import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Contrast } from "lucide-react";

export const useHighContrast = () => {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("vortex-high-contrast");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("vortex-high-contrast", enabled.toString());
    
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [enabled]);

  return { enabled, setEnabled };
};

export const HighContrastToggle = ({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 border-2 transition-none ${
        enabled
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black hover:bg-black hover:text-white"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Contrast className="h-4 w-4" />
      <span className="text-xs font-bold">ALTO CONTRASTE</span>
    </motion.button>
  );
};

export const HighContrastStyles = () => {
  return (
    <style>{`
      .high-contrast {
        filter: contrast(1.2) saturate(0);
      }
      
      .high-contrast img {
        filter: contrast(1.3) brightness(1.1);
      }
      
      .high-contrast .bg-\\[\\#C0C0C0\\] {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      
      .high-contrast .bg-white {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      
      .high-contrast .bg-black {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      
      .high-contrast .text-\\[\\#808080\\] {
        color: #ffffff !important;
      }
      
      .high-contrast .border-\\[\\#C0C0C0\\] {
        border-color: #ffffff !important;
      }
      
      .high-contrast .border-\\[\\#808080\\] {
        border-color: #ffffff !important;
      }
    `}</style>
  );
};
