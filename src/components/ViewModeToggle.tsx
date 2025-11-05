import { motion } from "motion/react";
import { Grid3x3, List, LayoutGrid } from "lucide-react";

export type ViewMode = "grid" | "list" | "masonry";

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({ currentMode, onChange }: ViewModeToggleProps) => {
  const modes: { value: ViewMode; icon: typeof Grid3x3; label: string }[] = [
    { value: "grid", icon: Grid3x3, label: "Grade" },
    { value: "list", icon: List, label: "Lista" },
    { value: "masonry", icon: LayoutGrid, label: "Mosaico" },
  ];

  return (
    <div className="flex border-2 border-black bg-white overflow-hidden">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <motion.button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`px-3 py-2 flex items-center gap-2 transition-none border-r-2 last:border-r-0 border-black ${
              currentMode === mode.value
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-[#C0C0C0]"
            }`}
            whileHover={{ scale: currentMode === mode.value ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs font-bold">{mode.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
