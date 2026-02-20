import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Video, 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";

interface ProcessingState {
  videoId: string | null;
  meta: api.VideoMetadata | null;
  currentFrame: number;
  isPlaying: boolean;
  isProcessing: boolean;
  isRendering: boolean;
  hasTarget: boolean;
  renderProgress: number;
}

const TrackingViewport = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processing, setProcessing] = useState<ProcessingState>({
    videoId: null,
    meta: null,
    currentFrame: 0,
    isPlaying: false,
    isProcessing: false,
    isRendering: false,
    hasTarget: false,
    renderProgress: 0,
  });
  const [frameImage, setFrameImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Upload video to backend
  const handleUploadToBackend = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await api.uploadVideo(file);
      setProcessing({
        ...processing,
        videoId: response.video_id,
        meta: response.meta,
        currentFrame: 0,
      });
      
      toast({
        title: "Video uploaded successfully",
        description: `${response.meta.frame_count} frames • ${response.meta.width}x${response.meta.height}`,
      });
      
      // Load first frame
      await loadFrame(response.video_id, 0);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      setVideoFile(file);
      handleUploadToBackend(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid video file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveVideo = () => {
    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo);
    }
    setSelectedVideo(null);
    setVideoFile(null);
    setFrameImage(null);
    setProcessing({
      videoId: null,
      meta: null,
      currentFrame: 0,
      isPlaying: false,
      isProcessing: false,
      isRendering: false,
      hasTarget: false,
      renderProgress: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  // Load and display a processed frame
  const loadFrame = async (videoId: string, frameIndex: number, skipProcessingFlag: boolean = false) => {
    try {
      if (!skipProcessingFlag) {
        setProcessing(prev => ({ ...prev, isProcessing: true }));
      }
      const blob = await api.getFrame(videoId, frameIndex);
      const url = URL.createObjectURL(blob);
      
      // Clean up previous frame image
      if (frameImage) {
        URL.revokeObjectURL(frameImage);
      }
      
      setFrameImage(url);
      setProcessing(prev => ({ ...prev, currentFrame: frameIndex, isProcessing: false }));
    } catch (error) {
      console.error("Frame load error:", error);
      setProcessing(prev => ({ ...prev, isProcessing: false }));
      toast({
        title: "Failed to load frame",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  // Handle canvas click for subject selection
  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!processing.videoId || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Don't block - send selection request and continue
    api.selectSubject(
      processing.videoId,
      processing.currentFrame,
      x,
      y
    ).then(response => {
      if (response.ok) {
        setProcessing(prev => ({ ...prev, hasTarget: true }));
        toast({
          title: "Subject locked",
          description: `Blur effect active`,
          duration: 2000,
        });
        // The next frame will automatically have blur applied by backend
      } else {
        toast({
          title: "No subject found",
          description: "Click on a person or object",
          variant: "destructive",
          duration: 2000,
        });
      }
    }).catch(error => {
      console.error("Selection error:", error);
    });
  };

  // Reset target selection
  const handleResetTarget = async () => {
    if (!processing.videoId) return;

    try {
      await api.resetTarget(processing.videoId);
      setProcessing(prev => ({ ...prev, hasTarget: false }));
      toast({
        title: "Target reset",
        description: "Subject tracking has been reset",
      });
      
      // Reload frame
      await loadFrame(processing.videoId, processing.currentFrame);
    } catch (error) {
      console.error("Reset error:", error);
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  // Play/pause controls
  const handlePlayPause = () => {
    if (processing.isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      setProcessing(prev => ({ ...prev, isPlaying: false }));
    } else {
      setProcessing(prev => ({ ...prev, isPlaying: true }));
      playIntervalRef.current = setInterval(() => {
        setProcessing(prev => {
          if (!prev.videoId || !prev.meta) return prev;
          
          const nextFrame = prev.currentFrame + 1;
          if (nextFrame >= prev.meta.frame_count) {
            if (playIntervalRef.current) {
              clearInterval(playIntervalRef.current);
              playIntervalRef.current = null;
            }
            return { ...prev, isPlaying: false, currentFrame: 0 };
          }
          
          // Skip processing flag during playback for smoother performance
          loadFrame(prev.videoId, nextFrame, true);
          return { ...prev, currentFrame: nextFrame };
        });
      }, 100); // ~10 fps playback
    }
  };

  const handleStepForward = () => {
    if (!processing.videoId || !processing.meta) return;
    const nextFrame = Math.min(processing.currentFrame + 1, processing.meta.frame_count - 1);
    loadFrame(processing.videoId, nextFrame);
  };

  const handleStepBackward = () => {
    if (!processing.videoId) return;
    const prevFrame = Math.max(processing.currentFrame - 1, 0);
    loadFrame(processing.videoId, prevFrame);
  };

  // Render full video
  const handleRenderVideo = async () => {
    if (!processing.videoId || !processing.hasTarget) {
      toast({
        title: "Cannot render",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    setProcessing(prev => ({ ...prev, isRendering: true, renderProgress: 0 }));
    
    try {
      const response = await api.renderVideo(processing.videoId, {
        downscale: 720, // For faster rendering
        blur_ksize: 31,
        feather_px: 7,
        outline: false,
      });

      if (response.ok) {
        toast({
          title: "Video rendered successfully",
          description: `Processed ${response.frames_processed} frames`,
        });
        
        // Trigger download
        const blob = await api.downloadVideo(processing.videoId);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${processing.videoId}_focused.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(response.message || "Rendering failed");
      }
    } catch (error) {
      console.error("Render error:", error);
      toast({
        title: "Rendering failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setProcessing(prev => ({ ...prev, isRendering: false }));
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameImage) {
        URL.revokeObjectURL(frameImage);
      }
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!processing.videoId) return;
      
      // Spacebar to play/pause
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      }
      // Arrow keys for frame navigation (only when paused)
      else if (!processing.isPlaying) {
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          handleStepForward();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          handleStepBackward();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [processing.videoId, processing.isPlaying]);

  // Update canvas when frame image changes
  useEffect(() => {
    if (frameImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = frameImage;
    }
  }, [frameImage]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative w-full aspect-video rounded-xl overflow-hidden glass-panel-strong group"
    >
      {!selectedVideo ? (
        <div
          className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging ? "bg-primary/10 border-2 border-primary" : "border-2 border-dashed border-primary/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <motion.div
            animate={{ y: isDragging ? -10 : 0 }}
            className="flex flex-col items-center gap-4 p-8"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-primary" />
                )}
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-primary/20"
              />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-display text-xl font-semibold text-foreground">
                {isUploading ? "Uploading Video..." : "Upload Your Video"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                {isUploading 
                  ? "Processing your video with AI..." 
                  : "Drag and drop your video file here, or click to browse from your files"}
              </p>
            </div>

            {!isUploading && (
              <button
                onClick={handleBrowseClick}
                className="glass-panel-strong px-6 py-3 font-display text-sm font-semibold text-primary hover:bg-primary/10 transition-all duration-300 glow-border flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                BROWSE FILES
              </button>
            )}

            <p className="text-xs text-muted-foreground/70 font-mono">
              Supported formats: MP4, WebM, AVI, MOV
            </p>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      ) : (
        <div className="relative w-full h-full bg-black">
          {/* Main Canvas for processed frames */}
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full object-contain cursor-crosshair"
            style={{ display: frameImage ? 'block' : 'none' }}
          />

          {/* Original video (hidden, used as fallback) */}
          <video
            ref={videoRef}
            src={selectedVideo}
            className="w-full h-full object-contain"
            style={{ display: !frameImage ? 'block' : 'none' }}
          />

          {/* Loading overlay */}
          {processing.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={handleRemoveVideo}
            className="absolute top-3 right-3 glass-panel p-2 hover:bg-red-500/20 transition-colors duration-300 group/btn z-10"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover/btn:text-red-500" />
          </button>

          {/* Video info */}
          {videoFile && processing.meta && (
            <div className="absolute top-3 left-3 glass-panel p-3 font-mono text-xs space-y-1">
              <div className="text-primary font-semibold flex items-center gap-2">
                {processing.hasTarget ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    TARGET LOCKED
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    NO TARGET
                  </>
                )}
              </div>
              <div className="text-muted-foreground">
                Frame: <span className="text-foreground">{processing.currentFrame + 1} / {processing.meta.frame_count}</span>
              </div>
              <div className="text-muted-foreground">
                Size: <span className="text-foreground">{processing.meta.width}x{processing.meta.height}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          {processing.meta && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-panel p-3 flex items-center gap-2">
              <button
                onClick={handleStepBackward}
                disabled={processing.currentFrame === 0 || processing.isPlaying}
                className="p-2 hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous frame"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-primary/10 transition-colors"
                title={processing.isPlaying ? "Pause" : "Play"}
              >
                {processing.isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleStepForward}
                disabled={processing.currentFrame >= processing.meta.frame_count - 1 || processing.isPlaying}
                className="p-2 hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next frame"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-border mx-1" />

              <button
                onClick={handleResetTarget}
                disabled={!processing.hasTarget}
                className="p-2 hover:bg-yellow-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reset target"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handleRenderVideo}
                disabled={!processing.hasTarget || processing.isRendering}
                className="p-2 px-4 hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
                title="Render full video"
              >
                {processing.isRendering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Render Video
                  </>
                )}
              </button>
            </div>
          )}

          {/* Click instruction */}
          {!processing.hasTarget && processing.meta && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel p-4 text-center pointer-events-none">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display font-semibold text-foreground">Click to Select Subject</div>
              <div className="text-xs text-muted-foreground mt-1">AI will track your selection</div>
              <div className="text-xs text-muted-foreground/70 mt-2 font-mono">
                SPACE: Play/Pause • ← →: Navigate
              </div>
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          {processing.hasTarget && processing.meta && (
            <div className="absolute bottom-20 right-3 glass-panel p-2 text-xs font-mono text-muted-foreground/70 pointer-events-none">
              SPACE to play/pause
            </div>
          )}

          {/* Crosshair center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
            <div className="w-8 h-[1px] bg-primary absolute top-1/2 -left-4" />
            <div className="h-8 w-[1px] bg-primary absolute left-1/2 -top-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TrackingViewport;
