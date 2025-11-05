import { motion, useScroll, useSpring } from "motion/react";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50"
      style={{ scaleX }}
    >
      <div className="absolute inset-0 flex items-center justify-end pr-1">
        <motion.div
          className="w-2 h-2 bg-white border border-black"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      </div>
    </motion.div>
  );
};
