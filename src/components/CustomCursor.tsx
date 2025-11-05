import { motion } from "motion/react";
import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.onclick !== null ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
        }}
        transition={{
          duration: 0,
        }}
      >
        {!isPointer && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={isClicking ? "scale-90" : "scale-100"}
          >
            <path
              d="M0 0 L0 12 L4 8 L7 14 L9 13 L6 7 L12 7 L0 0Z"
              fill="white"
              stroke="black"
              strokeWidth="1"
            />
          </svg>
        )}

        {isPointer && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={isClicking ? "scale-90" : "scale-100"}
          >
            <rect x="8" y="4" width="2" height="8" fill="white" stroke="black" />
            <rect x="6" y="6" width="2" height="6" fill="white" stroke="black" />
            <rect x="10" y="6" width="2" height="6" fill="white" stroke="black" />
            <rect x="12" y="7" width="2" height="5" fill="white" stroke="black" />
            <rect x="6" y="12" width="8" height="4" fill="white" stroke="black" />
            <circle cx="7" cy="6" r="1" fill="black" />
          </svg>
        )}
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-black border border-white z-[9998] pointer-events-none"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
        }}
        transition={{
          duration: 0,
        }}
      />
    </>
  );
};
