import { motion } from "framer-motion";
import processorChip from "@/assets/processor-chip.jpg";
import aiLens from "@/assets/ai-lens.jpg";

const TechShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left: Images */}
      <div className="relative h-[400px] md:h-[500px]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 w-[65%] z-10"
        >
          <div className="glass-panel-strong p-2 rounded-xl overflow-hidden">
            <img src={processorChip} alt="AI Processor" className="w-full rounded-lg" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 right-0 w-[55%] z-20"
        >
          <div className="glass-panel-strong p-2 rounded-xl overflow-hidden glow-border-magenta">
            <img src={aiLens} alt="AI Lens" className="w-full rounded-lg" />
          </div>
        </motion.div>
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      </div>

      {/* Right: Stats */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="space-y-6 md:pl-8"
      >
        <h3 className="font-display text-2xl font-bold">
          <span className="text-gradient-cyan">Neural Processing</span>{" "}
          <span className="text-foreground">Engine</span>
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Powered by YOLOv8 AI models running on RTX GPU server. High-performance processing with minimal latency — upload, process, and download your enhanced video.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "Real-time", label: "Tracking" },
            { value: "RTX GPU", label: "Powered" },
            { value: "99.2%", label: "Accuracy" },
            { value: "Remote", label: "Processing" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-4 text-center">
              <div className="font-display text-xl font-bold text-primary">{stat.value}</div>
              <div className="text-muted-foreground text-xs mt-1 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TechShowcase;
