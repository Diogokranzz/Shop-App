import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ShoppingCart, Package, Grid3x3, DollarSign, Clock } from "lucide-react";

interface StatusBarProps {
  totalProducts: number;
  totalCategories: number;
  cartItemCount: number;
  cartTotal: number;
  currentFilter?: string;
}

export const StatusBar = ({
  totalProducts,
  totalCategories,
  cartItemCount,
  cartTotal,
  currentFilter,
}: StatusBarProps) => {
  const [time, setTime] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollPosition(Math.round((currentScroll / totalScroll) * 100) || 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C0C0C0] border-t-2 border-black z-40 overflow-hidden">
      {/* Status items */}
      <div className="flex items-center justify-between px-3 py-1 text-xs font-bold">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Package className="h-3 w-3" />
            <span>{totalProducts} produtos</span>
          </motion.div>

          <div className="w-px h-4 bg-black/20" />

          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Grid3x3 className="h-3 w-3" />
            <span>{totalCategories} categorias</span>
          </motion.div>

          {currentFilter && currentFilter !== "Todos" && (
            <>
              <div className="w-px h-4 bg-black/20" />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 text-black"
              >
                <span>Filtro: {currentFilter}</span>
              </motion.div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {cartItemCount > 0 && (
            <>
              <motion.div
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <ShoppingCart className="h-3 w-3" />
                <span>{cartItemCount} item{cartItemCount !== 1 ? "s" : ""}</span>
              </motion.div>

              <div className="w-px h-4 bg-black/20" />

              <motion.div
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <DollarSign className="h-3 w-3" />
                <span>R$ {cartTotal.toFixed(2)}</span>
              </motion.div>

              <div className="w-px h-4 bg-black/20" />
            </>
          )}

          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <span>{scrollPosition}%</span>
          </motion.div>

          <div className="w-px h-4 bg-black/20" />

          <motion.div
            className="flex items-center gap-1"
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Clock className="h-3 w-3" />
            <span>{formatTime(time)}</span>
          </motion.div>
        </div>
      </div>

      {/* Animated border */}
      <motion.div
        className="h-1 bg-black"
        style={{
          width: `${scrollPosition}%`,
        }}
        transition={{
          duration: 0.1,
        }}
      />
    </div>
  );
};
