import { motion } from "motion/react";

export function ScanlineEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Scanline vertical extremamente sutil */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-b from-transparent via-black to-transparent opacity-5"
        animate={{
          y: ["0%", "100%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 8,
        }}
      />
    </div>
  );
}
