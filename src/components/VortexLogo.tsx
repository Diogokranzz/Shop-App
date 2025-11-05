import { motion } from "motion/react";

export function VortexLogo() {
  return (
    <motion.div
      className="inline-flex items-center gap-4 px-8 py-4 border-4 border-black bg-white shadow-[8px_8px_0_black] relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      {/* Scanline effect animado no fundo */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, black 0px, black 1px, transparent 1px, transparent 2px)"
        }}
        animate={{
          y: [0, 2],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Ícone Vórtex animado em Pixel Art */}
      <motion.div 
        className="relative w-12 h-12"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Círculo externo com animação de pulso */}
        <motion.div 
          className="absolute inset-0 border-4 border-black bg-white"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Espiral em pixel art animada */}
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Camadas da espiral com animação de opacidade */}
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
          >
            <rect x="20" y="8" width="8" height="4" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.125
            }}
          >
            <rect x="28" y="12" width="4" height="8" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.25
            }}
          >
            <rect x="32" y="20" width="4" height="8" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.375
            }}
          >
            <rect x="28" y="28" width="8" height="4" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <rect x="16" y="32" width="8" height="4" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.625
            }}
          >
            <rect x="12" y="28" width="4" height="8" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.75
            }}
          >
            <rect x="8" y="16" width="4" height="8" fill="black" />
          </motion.g>
          
          <motion.g
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.875
            }}
          >
            <rect x="12" y="12" width="8" height="4" fill="black" />
          </motion.g>
          
          {/* Centro pulsante */}
          <motion.rect 
            x="18" 
            y="18" 
            width="12" 
            height="12" 
            fill="black"
            animate={{
              scale: [1, 0.8, 1],
            }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
        
        {/* Pixels animados nos cantos */}
        <motion.div 
          className="absolute top-0 left-0 w-2 h-2 bg-black"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-2 h-2 bg-black"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.125 }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-2 h-2 bg-black"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-2 h-2 bg-black"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.375 }}
        />
      </motion.div>

      {/* Nome Principal com efeito de glitch sutil */}
      <div className="flex items-center gap-3 relative">
        <motion.span 
          className="text-4xl font-bold tracking-[0.3em] leading-none relative"
          animate={{
            textShadow: [
              "0 0 0px rgba(0,0,0,0)",
              "2px 0 0px rgba(0,0,0,0.3)",
              "0 0 0px rgba(0,0,0,0)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          VORTEX
        </motion.span>
        
        {/* Separador animado */}
        <motion.div 
          className="w-1 h-10 bg-black"
          animate={{
            scaleY: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.span 
          className="text-4xl font-bold tracking-[0.3em] leading-none"
          animate={{
            textShadow: [
              "0 0 0px rgba(0,0,0,0)",
              "-2px 0 0px rgba(0,0,0,0.3)",
              "0 0 0px rgba(0,0,0,0)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 1.5
          }}
        >
          TECH
        </motion.span>
      </div>

      {/* Decoração lateral animada - Barras de nível */}
      <div className="flex flex-col gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-1 border border-black bg-black"
            animate={{
              scaleX: [1, 0.5, 1],
              backgroundColor: ["#000000", "#ffffff", "#000000"],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>

      {/* Bordas decorativas animadas */}
      <motion.div
        className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black"
        animate={{
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black"
        animate={{
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black"
        animate={{
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black"
        animate={{
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </motion.div>
  );
}
