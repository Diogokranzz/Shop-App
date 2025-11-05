import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endDate: Date;
  onExpire?: () => void;
}

export const CountdownTimer = ({ endDate, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = endDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.expired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-600 text-white px-2 py-1 border-2 border-white text-xs font-bold">
        OFERTA EXPIRADA
      </div>
    );
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 60;

  return (
    <motion.div
      className={`${
        isUrgent ? "bg-red-600" : "bg-black"
      } text-white px-2 py-1 border-2 border-white flex items-center gap-2`}
      animate={
        isUrgent
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0)",
                "0 0 0 4px rgba(239, 68, 68, 0.5)",
                "0 0 0 0 rgba(239, 68, 68, 0)",
              ],
            }
          : {}
      }
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    >
      <motion.div
        animate={
          isUrgent
            ? {
                rotate: [0, -10, 10, -10, 10, 0],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <Clock className="h-3 w-3" />
      </motion.div>
      <span className="text-xs font-bold">
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </motion.div>
  );
};
