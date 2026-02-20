import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  accentColor?: "cyan" | "magenta";
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0, accentColor = "cyan" }: FeatureCardProps) => {
  const isMagenta = accentColor === "magenta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass-panel p-6 group cursor-pointer transition-all duration-300 ${
        isMagenta ? "hover:glow-border-magenta" : "hover:glow-border"
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        isMagenta
          ? "bg-secondary/10 border border-secondary/30"
          : "bg-primary/10 border border-primary/30"
      }`}>
        <Icon className={`w-6 h-6 ${isMagenta ? "text-secondary" : "text-primary"}`} />
      </div>
      <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed font-body">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
