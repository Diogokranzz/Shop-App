import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const useEasterEggs = (onActivate: (egg: string) => void) => {
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonamiSequence((prev) => {
        const newSequence = [...prev, e.key].slice(-konamiCode.length);
        
        if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
          onActivate("konami");
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime > 1000) {
      setLogoClicks(1);
    } else {
      const newCount = logoClicks + 1;
      setLogoClicks(newCount);
      
      if (newCount >= 10) {
        onActivate("logo");
        setLogoClicks(0);
      }
    }
    
    setLastClickTime(now);
  };

  return { handleLogoClick };
};

interface MatrixModeProps {
  active: boolean;
}

export const MatrixMode = ({ active }: MatrixModeProps) => {
  const [drops, setDrops] = useState<number[]>([]);

  useEffect(() => {
    if (active) {
      const columns = Math.floor(window.innerWidth / 20);
      setDrops(Array(columns).fill(0));
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none overflow-hidden bg-black/80"
        >
          {drops.map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-500 font-mono text-sm"
              style={{
                left: i * 20,
                top: 0,
              }}
              animate={{
                y: [0, window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            >
              {String.fromCharCode(Math.random() * 94 + 33)}
            </motion.div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-black border-4 border-green-500 p-8 text-green-500 font-mono"
            >
              <p className="text-xl font-bold mb-2">MATRIX MODE ATIVADO</p>
              <p className="text-sm">Codigo Konami detectado!</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SnakeGameProps {
  active: boolean;
  onClose: () => void;
}

export const SnakeGame = ({ active, onClose }: SnakeGameProps) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!active) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection([-1, 0]);
          break;
        case "ArrowDown":
          setDirection([1, 0]);
          break;
        case "ArrowLeft":
          setDirection([0, -1]);
          break;
        case "ArrowRight":
          setDirection([0, 1]);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const gameLoop = setInterval(() => {
      setSnake((prev) => {
        const newHead = [prev[0][0] + direction[0], prev[0][1] + direction[1]];
        
        if (newHead[0] < 0 || newHead[0] >= 20 || newHead[1] < 0 || newHead[1] >= 20) {
          return [[10, 10]];
        }
        
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
          setScore((s) => s + 10);
          return [newHead, ...prev];
        }
        
        return [newHead, ...prev.slice(0, -1)];
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [active, direction, food]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-4 border-black p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">SNAKE GAME</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">SCORE: {score}</span>
                <button
                  onClick={onClose}
                  className="px-2 py-1 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-none text-xs font-bold"
                >
                  ESC
                </button>
              </div>
            </div>
            <div className="bg-[#C0C0C0] border-2 border-black p-2">
              <div className="grid grid-cols-20 gap-0" style={{ width: 400, height: 400 }}>
                {Array.from({ length: 20 }).map((_, row) =>
                  Array.from({ length: 20 }).map((_, col) => {
                    const isSnake = snake.some(([r, c]) => r === row && c === col);
                    const isFood = food[0] === row && food[1] === col;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`w-5 h-5 border border-black/10 ${
                          isSnake ? "bg-black" : isFood ? "bg-red-600" : "bg-white"
                        }`}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <p className="text-xs text-center mt-2 text-[#808080]">Use as setas para jogar</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
