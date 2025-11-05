import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface ProductBadgeProps {
  type: "new" | "hot" | "sale";
  className?: string;
}

export const ProductBadge = ({ type, className = "" }: ProductBadgeProps) => {
  const configs = {
    new: {
      label: "NEW",
      bgColor: "bg-blue-600",
      icon: Sparkles,
    },
    hot: {
      label: "HOT",
      bgColor: "bg-red-600",
      icon: null,
    },
    sale: {
      label: "SALE",
      bgColor: "bg-green-600",
      icon: null,
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute top-2 left-2 ${config.bgColor} text-white px-2 py-1 border-2 border-white flex items-center gap-1 z-10 ${className}`}
      style={{
        boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
      }}
    >
      {Icon && (
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Icon className="h-3 w-3" />
        </motion.div>
      )}
      <span className="text-xs font-bold">{config.label}</span>
      
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        animate={{
          opacity: [0, 0.3, 0],
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    </motion.div>
  );
};
