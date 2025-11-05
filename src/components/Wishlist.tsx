import { motion, AnimatePresence } from "motion/react";
import { Star, X, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("vortex-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("vortex-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return { wishlist, toggleWishlist, isInWishlist, clearWishlist };
};

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onClear: () => void;
}

export const WishlistDrawer = ({
  isOpen,
  onClose,
  wishlist,
  onRemove,
  onAddToCart,
  onClear,
}: WishlistDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l-4 border-black z-50 flex flex-col"
          >
            
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" fill="currentColor" />
                <h2 className="font-bold">LISTA DE DESEJOS</h2>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 border-2 border-white hover:bg-white hover:text-black flex items-center justify-center transition-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            
            <div className="flex-1 overflow-y-auto bg-[#C0C0C0] p-4">
              {wishlist.length === 0 ? (
                <div className="bg-white border-2 border-black p-8 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm text-[#808080]">
                    Sua lista de desejos esta vazia
                  </p>
                  <p className="text-xs text-[#808080] mt-2">
                    Clique na estrela nos produtos para salvar seus favoritos
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((product, index) => {
                    const finalPrice = product.discount
                      ? product.price * (1 - product.discount / 100)
                      : product.price;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border-2 border-black p-3"
                      >
                        <div className="flex gap-3">
                          <div className="w-20 h-20 border-2 border-black overflow-hidden shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs text-[#808080]">
                              {product.category}
                            </p>
                            <div className="mt-2 space-y-1">
                              {product.discount && (
                                <p className="text-xs text-[#808080] line-through">
                                  R$ {product.price.toFixed(2)}
                                </p>
                              )}
                              <p className="font-bold">
                                R$ {finalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              onAddToCart(product);
                              onRemove(product);
                            }}
                            className="flex-1 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-none text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            <span>ADICIONAR</span>
                          </button>
                          <button
                            onClick={() => onRemove(product)}
                            className="px-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-none"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            
            {wishlist.length > 0 && (
              <div className="border-t-4 border-black bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Total de itens:</span>
                  <span className="text-lg font-bold">{wishlist.length}</span>
                </div>
                <button
                  onClick={onClear}
                  className="w-full py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold"
                >
                  LIMPAR LISTA
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
