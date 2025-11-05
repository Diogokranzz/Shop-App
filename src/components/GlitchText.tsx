import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

export function GlitchText({
  text,
  className = "",
  trigger = false,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true);
      const timeout = setTimeout(() => setIsGlitching(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-10"
        animate={
          isGlitching
            ? {
                x: [0, -2, 2, -1, 1, 0],
                opacity: [1, 0.8, 1, 0.9, 1],
              }
            : {}
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {text}
      </motion.span>

      {/* Glitch Layers */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-500 mix-blend-screen"
            animate={{
              x: [-3, 3, -2, 2, -1],
              opacity: [0.7, 0.5, 0.7, 0.5, 0],
            }}
            transition={{ duration: 0.3, ease: "linear" }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-cyan-500 mix-blend-screen"
            animate={{
              x: [3, -3, 2, -2, 1],
              opacity: [0.7, 0.5, 0.7, 0.5, 0],
            }}
            transition={{ duration: 0.3, ease: "linear" }}
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}
