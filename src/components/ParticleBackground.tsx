import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Premium gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A0E27 0%, #1A1F3A 100%)",
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"/></filter><rect width="300" height="300" filter="url(%23noise)"/></svg>')`,
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(0, 245, 255, 0.15), transparent 40%), radial-gradient(circle at 70% 80%, rgba(107, 76, 230, 0.12), transparent 40%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Minimal floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "rgba(0, 245, 255, 0.3)",
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1.3, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-8"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 245, 255, 0.2), transparent 70%)",
          filter: "blur(80px)",
          top: "10%",
          left: "-10%",
        }}
        animate={{
          x: ["0%", "30%", "0%"],
          y: ["0%", "20%", "0%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-8"
        style={{
          background:
            "radial-gradient(circle, rgba(107, 76, 230, 0.15), transparent 70%)",
          filter: "blur(80px)",
          bottom: "10%",
          right: "-10%",
        }}
        animate={{
          x: ["0%", "-30%", "0%"],
          y: ["0%", "-20%", "0%"],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
