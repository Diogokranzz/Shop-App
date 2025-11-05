import { motion } from "motion/react";
import { useState } from "react";

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-12 h-12 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(0, 245, 255, 0.6), transparent 70%)",
          filter: "blur(12px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SVG Logo - Vórtex Hexagonal */}
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 200 200"
        fill="none"
        className="relative z-10"
        animate={{
          filter: isHovered
            ? "drop-shadow(0 0 24px rgba(0, 245, 255, 0.6))"
            : "drop-shadow(0 0 16px rgba(0, 245, 255, 0.4))",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Hexágono externo (maior) */}
        <motion.path
          d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
          fill="url(#vortex-gradient-1)"
          opacity="0.3"
          animate={{
            rotate: [0, 360],
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 },
          }}
          style={{ transformOrigin: "100px 100px" }}
        />

        {/* Hexágono médio */}
        <motion.path
          d="M100 40 L155 70 L155 130 L100 160 L45 130 L45 70 Z"
          fill="url(#vortex-gradient-2)"
          opacity="0.6"
          animate={{
            rotate: [0, -360],
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 },
          }}
          style={{ transformOrigin: "100px 100px" }}
        />

        {/* Hexágono interno (menor) */}
        <motion.path
          d="M100 60 L140 80 L140 120 L100 140 L60 120 L60 80 Z"
          fill="#00F5FF"
          animate={{
            rotate: [0, 360],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ transformOrigin: "100px 100px" }}
        />

        {/* Linha espiral central */}
        <motion.path
          d="M100 70 Q125 85 100 100 Q75 115 100 130"
          stroke="#0066FF"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={{
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Núcleo central brilhante */}
        <motion.circle
          cx="100"
          cy="100"
          r="8"
          fill="#FFFFFF"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "100px 100px" }}
        />

        {/* Partículas orbitantes */}
        {[0, 120, 240].map((angle, i) => (
          <motion.circle
            key={i}
            cx="100"
            cy="100"
            r="3"
            fill="#00F5FF"
            animate={{
              x: [0, 35 * Math.cos((angle * Math.PI) / 180)],
              y: [0, 35 * Math.sin((angle * Math.PI) / 180)],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Gradientes */}
        <defs>
          <linearGradient
            id="vortex-gradient-1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>

          <linearGradient
            id="vortex-gradient-2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#6B4CE6" />
          </linearGradient>

          <radialGradient id="vortex-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Anel externo pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: "rgba(0, 245, 255, 0.3)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0, 0.3],
          borderColor: [
            "rgba(0, 245, 255, 0.3)",
            "rgba(0, 102, 255, 0.3)",
            "rgba(0, 245, 255, 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
