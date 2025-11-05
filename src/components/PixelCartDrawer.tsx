import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { PixelProduct } from "./PixelProductCard";
import { PixelCheckout } from "./PixelCheckout";

export interface PixelCartItem extends PixelProduct {
  quantity: number;
}

interface PixelCartDrawerProps {
  items: PixelCartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

export function PixelCartDrawer({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: PixelCartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Cart Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative px-3 py-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors duration-200 flex items-center gap-2"
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart className="h-5 w-5" />
        {items.length > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white border border-white flex items-center justify-center text-xs font-bold"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {items.length}
          </motion.span>
        )}
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)",
              }}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2, ease: "linear" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l-4 border-black z-50 flex flex-col"
            >
              {/* Title Bar */}
              <div className="flex items-center justify-between p-3 border-b-2 border-black bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h2 className="text-lg font-bold">CARRINHO DE COMPRAS</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-3 bg-[#C0C0C0]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-24 h-24 border-4 border-black bg-white flex items-center justify-center mb-4">
                      <ShoppingCart className="h-12 w-12" />
                    </div>
                    <p className="text-lg font-bold mb-2">CARRINHO VAZIO</p>
                    <p className="text-sm text-[#333]">
                      Adicione produtos para começar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white border-2 border-black p-3"
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 border-2 border-black bg-[#C0C0C0] flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover pixel-perfect"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-[#808080] mb-2">
                              {item.category}
                            </p>
                            <p className="text-lg font-bold">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-dashed border-[#808080]">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-none"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-none"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="px-2 py-1 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center gap-1 text-xs transition-none"
                          >
                            <Trash2 className="h-3 w-3" />
                            REMOVER
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-2 text-right">
                          <span className="text-xs text-[#808080]">
                            Subtotal:{" "}
                          </span>
                          <span className="font-bold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer com Total */}
              {items.length > 0 && (
                <div className="border-t-4 border-black bg-white p-4">
                  {/* Total */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-dashed border-[#808080]">
                    <div>
                      <p className="text-xs text-[#808080] mb-1">
                        TOTAL ({items.length}{" "}
                        {items.length === 1 ? "item" : "itens"})
                      </p>
                      <p className="text-2xl font-bold">
                        R$ {total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full py-3 px-4 bg-black text-white border-4 border-black text-sm font-bold hover:bg-white hover:text-black transition-none"
                  >
                    FINALIZAR COMPRA
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full mt-2 py-2 px-4 bg-white text-black border-2 border-black text-xs font-bold hover:bg-[#C0C0C0] transition-none"
                  >
                    CONTINUAR COMPRANDO
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <PixelCheckout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={items}
        totalAmount={total}
        onClearCart={onClearCart}
      />
    </>
  );
}
