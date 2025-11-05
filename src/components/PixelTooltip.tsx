import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, ReactNode } from "react";

interface PixelTooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
}

export const PixelTooltip = ({ content, children, delay = 500 }: PixelTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const targetRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    timeoutRef.current = setTimeout(() => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[100] pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-black text-white border-2 border-white px-3 py-2 text-xs font-bold whitespace-nowrap">
              <div className="absolute inset-0 border-2 border-[#808080]" style={{ top: 2, left: 2 }} />
              <div className="relative z-10">{content}</div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1">
              <div className="w-2 h-2 bg-black border-l-2 border-b-2 border-white transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
