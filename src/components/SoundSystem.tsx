import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Sistema de sons retrô do Mac OS
const sounds = {
  click: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "square";
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  },
  
  addToCart: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  },
  
  success: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      
      const startTime = audioContext.currentTime + (i * 0.15);
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  },
  
  error: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = "sawtooth";
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  },
  
  hover: () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1200;
    oscillator.type = "square";
    
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }
};

export const useSoundSystem = () => {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("vortex-sounds-enabled");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("vortex-sounds-enabled", enabled.toString());
  }, [enabled]);

  const playSound = (soundName: keyof typeof sounds) => {
    if (enabled) {
      try {
        sounds[soundName]();
      } catch (error) {
        console.error("Sound playback error:", error);
      }
    }
  };

  return { playSound, enabled, setEnabled };
};

export const SoundToggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {enabled ? (
          <motion.div
            key="on"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <Volume2 className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <VolumeX className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-xs font-bold">SONS</span>
    </motion.button>
  );
};
