import { motion, AnimatePresence } from "motion/react";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
}

interface RecentlyViewedProps {
  onProductClick: (product: Product) => void;
}

const MAX_RECENT_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("vortex-recently-viewed");
    return saved ? JSON.parse(saved) : [];
  });

  const addToRecent = (product: Product) => {
    setRecentProducts(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
      localStorage.setItem("vortex-recently-viewed", JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentProducts([]);
    localStorage.removeItem("vortex-recently-viewed");
  };

  return { recentProducts, addToRecent, clearRecent };
};

export const RecentlyViewed = ({ onProductClick }: RecentlyViewedProps) => {
  const { recentProducts, clearRecent } = useRecentlyViewed();
  const [isExpanded, setIsExpanded] = useState(false);

  if (recentProducts.length === 0) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white border-4 border-black mb-2 w-64"
            style={{
              boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div className="bg-black text-white p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span className="text-xs font-bold">VISTOS RECENTEMENTE</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-4 h-4 border border-white hover:bg-white hover:text-black flex items-center justify-center transition-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-[#C0C0C0] p-2">
              <div className="max-h-96 overflow-y-auto space-y-2">
                {recentProducts.map((product, index) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onProductClick(product);
                      setIsExpanded(false);
                    }}
                    className="w-full bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-none text-left"
                  >
                    <div className="flex gap-2">
                      <div className="w-12 h-12 border border-black overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{product.name}</p>
                        <p className="text-xs opacity-70">{product.category}</p>
                        <p className="text-xs font-bold mt-1">
                          R$ {(product.discount
                            ? product.price * (1 - product.discount / 100)
                            : product.price
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={clearRecent}
                className="w-full mt-2 py-1 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-none text-xs font-bold"
              >
                LIMPAR HISTORICO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-black text-white border-4 border-black p-3 hover:bg-white hover:text-black transition-none relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isExpanded
            ? "0 0 0 0 rgba(0,0,0,0)"
            : ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 8px rgba(0,0,0,0.2)", "0 0 0 0 rgba(0,0,0,0)"],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
          },
        }}
      >
        <Clock className="h-5 w-5" />
        {recentProducts.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black border-2 border-black flex items-center justify-center text-xs font-bold"
          >
            {recentProducts.length}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};
