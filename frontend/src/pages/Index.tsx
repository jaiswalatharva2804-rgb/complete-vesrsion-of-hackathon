import { motion } from "framer-motion";
import {
  Focus,
  Crosshair,
  Zap,
  Eye,
  Layers,
  Cpu,
  Target,
  ScanEye,
} from "lucide-react";
import ParticleField from "@/components/ParticleField";
import FeatureCard from "@/components/FeatureCard";
import TrackingViewport from "@/components/TrackingViewport";
import PipelineSection from "@/components/PipelineSection";
import TechShowcase from "@/components/TechShowcase";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticleField />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-panel px-4 py-2 mb-8 font-mono text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-primary">SYSTEM ONLINE</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">v2.0.4</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">AI-Powered</span>
            <br />
            <span className="text-gradient-cyan glow-text">Smart Auto Focus</span>
            <br />
            <span className="text-foreground">&</span>{" "}
            <span className="text-gradient-magenta glow-text-magenta">Dynamic Tracking</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Select any subject. Track it in real-time. Keep it razor-sharp while the world blurs away. 
            AI-powered processing that never loses sight.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#demo"
              className="glass-panel-strong px-8 py-3 font-display text-sm font-semibold text-primary hover:bg-primary/10 transition-all duration-300 glow-border flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              UPLOAD VIDEO
            </a>
            <a
              href="#pipeline"
              className="glass-panel px-8 py-3 font-display text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ScanEye className="w-4 h-4" />
              HOW IT WORKS
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 animate-float"
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 mx-auto flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-widest">CAPABILITIES</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              <span className="text-gradient-cyan">Intelligent</span>{" "}
              <span className="text-foreground">Tracking System</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={Crosshair} title="Tap to Track" description="Click any subject to lock focus. AI instantly identifies and begins tracking." delay={0} />
            <FeatureCard icon={Eye} title="Continuous Tracking" description="Subject stays tracked across frames — handles motion, rotation, and scale changes." delay={0.1} />
            <FeatureCard icon={Focus} title="Dynamic Blur" description="Background objects receive real-time Gaussian blur. Selected subject stays razor-sharp." delay={0.2} accentColor="magenta" />
            <FeatureCard icon={Zap} title="Instant Switch" description="Click a new subject to instantly transfer focus. Seamless transition with zero delay." delay={0.3} accentColor="magenta" />
            <FeatureCard icon={Layers} title="Multi-Subject" description="Detects and tracks multiple subjects simultaneously. Pick any one to focus." delay={0.4} />
            <FeatureCard icon={Cpu} title="GPU Accelerated" description="Powered by YOLOv8 on RTX GPU — real-time processing with minimal latency." delay={0.5} />
            <FeatureCard icon={ScanEye} title="Occlusion Handling" description="Re-identifies subjects after temporary occlusion using appearance embeddings." delay={0.6} accentColor="magenta" />
            <FeatureCard icon={Target} title="Low-Light Ready" description="Optimized detection models handle challenging lighting and fast motion scenarios." delay={0.7} accentColor="magenta" />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-xs text-secondary tracking-widest">VIDEO UPLOAD</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              <span className="text-foreground">Upload Your </span>
              <span className="text-gradient-magenta">Video</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
              Upload a video from your device to test the AI tracking system. Drag and drop or browse your files.
            </p>
          </motion.div>

          <TrackingViewport />
        </div>
      </section>

      {/* Pipeline Section */}
      <section id="pipeline" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-widest">ARCHITECTURE</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              <span className="text-foreground">Detection → Tracking → </span>
              <span className="text-gradient-cyan">Segmentation Pipeline</span>
            </h2>
          </motion.div>

          <PipelineSection />
        </div>
      </section>

      {/* Tech Showcase */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <TechShowcase />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto text-center">
          <div className="font-display text-sm text-muted-foreground">
            AI Smart Focus & Dynamic Subject Tracking System
          </div>
          <div className="font-mono text-xs text-muted-foreground/50 mt-2">
            YOLO + ByteTrack + Instance Segmentation • Server-Side Processing
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
