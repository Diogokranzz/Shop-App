import { motion } from "motion/react";

interface PixelLoadingBarProps {
  progress?: number;
  className?: string;
}

export function PixelLoadingBar({
  progress = 0,
  className = "",
}: PixelLoadingBarProps) {
  return (
    <div className={`relative w-full h-4 border-2 border-black bg-white ${className}`}>
      {/* Barra de progresso pixelada */}
      <motion.div
        className="h-full bg-black relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Padrão pixel interno */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)",
          }}
        />
      </motion.div>

      {/* Grid pixelado overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)",
          backgroundSize: "2px 2px",
        }}
      />
    </div>
  );
}
