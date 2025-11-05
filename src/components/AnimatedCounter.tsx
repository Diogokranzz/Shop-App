import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number | string;
  className?: string;
  duration?: number;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  className = "",
  duration = 1,
  suffix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      const numericValue = typeof value === "string" ? parseFloat(value) : value;
      
      if (!isNaN(numericValue)) {
        const controls = animate(motionValue, numericValue, {
          duration,
          ease: "easeOut",
        });
        return controls.stop;
      }
    }
  }, [isInView, value, duration, motionValue]);

  const rounded = useTransform(motionValue, (latest) => {
    if (typeof value === "string" && value.includes("%")) {
      return Math.round(latest);
    }
    return Math.round(latest);
  });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <>
          <motion.span>{rounded}</motion.span>
          {suffix}
        </>
      ) : (
        "0" + suffix
      )}
    </span>
  );
}
