import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  description: string;
  stock?: number;
}

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
}

export const QuickView = ({
  product,
  onClose,
  onNext,
  onPrev,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: QuickViewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) return null;

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border-4 border-black max-w-3xl w-full max-h-[90vh] overflow-hidden"
          style={{
            boxShadow: "12px 12px 0 rgba(0,0,0,0.3)",
          }}
        >
          {/* Title Bar - Mac OS Style */}
          <div className="bg-black text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 border-2 border-white" />
                <div className="w-3 h-3 border-2 border-white" />
              </div>
              <span className="text-xs font-bold">GET INFO: {product.name}</span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 border-2 border-white bg-black hover:bg-white hover:text-black flex items-center justify-center transition-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-[#C0C0C0] p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
            <div className="bg-white border-2 border-black p-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative">
                  <div className="aspect-square bg-white border-2 border-black overflow-hidden relative">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-opacity ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold border-2 border-white">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Navigation arrows */}
                  {(onPrev || onNext) && (
                    <div className="flex gap-2 mt-3">
                      {onPrev && (
                        <button
                          onClick={onPrev}
                          className="flex-1 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none flex items-center justify-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="text-xs font-bold">ANTERIOR</span>
                        </button>
                      )}
                      {onNext && (
                        <button
                          onClick={onNext}
                          className="flex-1 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none flex items-center justify-center gap-1"
                        >
                          <span className="text-xs font-bold">PROXIMO</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-bold text-lg">{product.name}</h2>
                      {onToggleFavorite && (
                        <button
                          onClick={() => onToggleFavorite(product)}
                          className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none"
                        >
                          <Star
                            className="h-4 w-4"
                            fill={isFavorite ? "currentColor" : "none"}
                          />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#808080] mt-1">{product.category}</p>
                  </div>

                  <div className="border-t-2 border-dashed border-[#808080] pt-3">
                    <p className="text-sm leading-relaxed">{product.description}</p>
                  </div>

                  <div className="border-t-2 border-dashed border-[#808080] pt-3">
                    <div className="space-y-2">
                      {product.discount && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#808080]">Preco Original:</span>
                          <span className="text-sm line-through text-[#808080]">
                            R$ {product.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Preco Final:</span>
                        <span className="text-xl font-bold">
                          R$ {finalPrice.toFixed(2)}
                        </span>
                      </div>
                      {product.discount && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-700">Economia:</span>
                          <span className="text-sm font-bold text-green-700">
                            R$ {(product.price - finalPrice).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {product.stock !== undefined && (
                    <div className="border-t-2 border-dashed border-[#808080] pt-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 ${
                            product.stock > 10
                              ? "bg-green-600"
                              : product.stock > 0
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                        />
                        <span className="text-xs">
                          {product.stock > 10
                            ? "Em estoque"
                            : product.stock > 0
                            ? `Ultimas ${product.stock} unidades`
                            : "Fora de estoque"}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    disabled={product.stock === 0}
                    className="w-full py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-none font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>ADICIONAR AO CARRINHO</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
