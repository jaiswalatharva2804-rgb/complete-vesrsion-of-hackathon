import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PipelineStep {
  number: string;
  title: string;
  description: string;
}

const steps: PipelineStep[] = [
  { number: "01", title: "Detection", description: "YOLO-based object detection identifies all subjects in the frame" },
  { number: "02", title: "Selection", description: "User taps/clicks to select target — bounding box locks on" },
  { number: "03", title: "Tracking", description: "DeepSORT tracks the selected subject across frames in real-time" },
  { number: "04", title: "Segmentation", description: "Instance segmentation isolates subject from background" },
  { number: "05", title: "Focus Render", description: "Gaussian blur applied to background, subject stays sharp" },
];

const PipelineSection = () => {
  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative"
          >
            <div className="glass-panel p-4 text-center group hover:glow-border transition-all duration-300 h-full">
              <div className="font-display text-2xl font-bold text-primary/40 mb-2">{step.number}</div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-2">{step.title}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
            </div>
            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-4 h-4 text-primary/40" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PipelineSection;
