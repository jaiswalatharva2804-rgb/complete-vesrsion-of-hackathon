// API Service for Backend Integration

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface VideoMetadata {
  frame_count: number;
  width: number;
  height: number;
  fps: number;
}

export interface UploadResponse {
  video_id: string;
  meta: VideoMetadata;
}

export interface SelectResponse {
  ok: boolean;
  track_id?: number;
  message?: string;
}

export interface RenderResponse {
  ok: boolean;
  output_path?: string;
  message?: string;
  frames_processed?: number;
}

// Upload video file
export const uploadVideo = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

// Get a preview frame with processing
export const getFrame = async (
  videoId: string,
  frameIndex: number,
  options: {
    downscale?: number;
    infer_every?: number;
    blur_ksize?: number;
    feather_px?: number;
    outline?: boolean;
    jpg_quality?: number;
  } = {}
): Promise<Blob> => {
  const params = new URLSearchParams({
    video_id: videoId,
    frame_index: frameIndex.toString(),
    downscale: (options.downscale || 640).toString(),
    infer_every: (options.infer_every || 3).toString(),
    blur_ksize: (options.blur_ksize || 25).toString(),
    feather_px: (options.feather_px || 5).toString(),
    outline: (options.outline || false).toString(),
    jpg_quality: (options.jpg_quality || 85).toString(),
  });

  const response = await fetch(`${API_BASE_URL}/frame?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to get frame: ${response.statusText}`);
  }

  return response.blob();
};

// Select a subject at coordinates
export const selectSubject = async (
  videoId: string,
  frameIndex: number,
  x: number,
  y: number,
  downscale: number = 640
): Promise<SelectResponse> => {
  const formData = new FormData();
  formData.append("video_id", videoId);
  formData.append("frame_index", frameIndex.toString());
  formData.append("x", x.toString());
  formData.append("y", y.toString());
  formData.append("downscale", downscale.toString());

  const response = await fetch(`${API_BASE_URL}/select`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to select subject: ${response.statusText}`);
  }

  return response.json();
};

// Reset target selection
export const resetTarget = async (videoId: string): Promise<{ ok: boolean }> => {
  const formData = new FormData();
  formData.append("video_id", videoId);

  const response = await fetch(`${API_BASE_URL}/reset`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to reset target: ${response.statusText}`);
  }

  return response.json();
};

// Render the full video with blur effect
export const renderVideo = async (
  videoId: string,
  options: {
    downscale?: number | null;
    blur_ksize?: number;
    feather_px?: number;
    outline?: boolean;
    start_frame?: number;
    end_frame?: number;
  } = {}
): Promise<RenderResponse> => {
  const formData = new FormData();
  formData.append("video_id", videoId);
  
  if (options.downscale !== undefined && options.downscale !== null) {
    formData.append("downscale", options.downscale.toString());
  }
  
  formData.append("blur_ksize", (options.blur_ksize || 31).toString());
  formData.append("feather_px", (options.feather_px || 7).toString());
  formData.append("outline", (options.outline || false).toString());
  formData.append("start_frame", (options.start_frame || 0).toString());
  formData.append("end_frame", (options.end_frame || -1).toString());

  const response = await fetch(`${API_BASE_URL}/render`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to render video: ${response.statusText}`);
  }

  return response.json();
};

// Download the rendered video
export const downloadVideo = async (videoId: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/download?video_id=${videoId}`);

  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  return response.blob();
};

// Close/cleanup a video job
export const closeJob = async (videoId: string): Promise<{ ok: boolean }> => {
  const formData = new FormData();
  formData.append("video_id", videoId);

  const response = await fetch(`${API_BASE_URL}/close`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to close job: ${response.statusText}`);
  }

  return response.json();
};

// Health check
export const healthCheck = async (): Promise<{ ok: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }

  return response.json();
};
