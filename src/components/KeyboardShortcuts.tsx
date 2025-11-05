import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, X } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + ? para ajuda
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // ESC para fechar ajuda
      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
        return;
      }

      // Executar atalhos
      shortcuts.forEach(shortcut => {
        const keys = shortcut.key.toLowerCase().split("+");
        const needsCtrl = keys.includes("ctrl") || keys.includes("cmd");
        const needsShift = keys.includes("shift");
        const needsAlt = keys.includes("alt");
        const mainKey = keys[keys.length - 1];

        const ctrlPressed = e.metaKey || e.ctrlKey;
        const shiftPressed = e.shiftKey;
        const altPressed = e.altKey;

        if (
          (!needsCtrl || ctrlPressed) &&
          (!needsShift || shiftPressed) &&
          (!needsAlt || altPressed) &&
          e.key.toLowerCase() === mainKey
        ) {
          // Não executar se estiver em input
          const target = e.target as HTMLElement;
          if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
            return;
          }

          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, showHelp]);

  return { showHelp, setShowHelp };
};

export const KeyboardShortcutsHelp = ({ 
  shortcuts, 
  show, 
  onClose 
}: { 
  shortcuts: Shortcut[]; 
  show: boolean; 
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border-4 border-black z-50"
            style={{
              boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
            }}
          >
            {/* Title Bar */}
            <div className="bg-black text-white p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                <span className="text-xs font-bold">ATALHOS DE TECLADO</span>
              </div>
              <button
                onClick={onClose}
                className="w-5 h-5 border-2 border-white bg-black hover:bg-white hover:text-black flex items-center justify-center transition-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto bg-[#C0C0C0]">
              <div className="bg-white border-2 border-black p-3">
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between border-b border-dashed border-[#808080] pb-2 last:border-0"
                    >
                      <span className="text-xs">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-black text-white text-xs font-bold border-2 border-black">
                        {shortcut.key.toUpperCase()}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs text-[#808080]">
                  Pressione CMD/CTRL + ? para abrir esta ajuda
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
