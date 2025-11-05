import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./PremiumProductCard";
import { useState } from "react";

export interface CartItem extends Product {
  quantity: number;
}

interface AdvancedCartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function AdvancedCartDrawer({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: AdvancedCartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 500 ? 0 : 29.9;
  const totalPrice = subtotal + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative backdrop-blur-xl border"
            style={{
              background: "rgba(0, 245, 255, 0.1)",
              borderColor: "rgba(0, 245, 255, 0.3)",
            }}
          >
            <ShoppingCart className="h-5 w-5" style={{ color: "#00F5FF" }} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge
                    className="h-5 w-5 flex items-center justify-center p-0 rounded-full border-0 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #00F5FF, #0066FF)",
                      color: "#0A0E27",
                      boxShadow: "0 4px 12px rgba(0, 245, 255, 0.5)",
                    }}
                  >
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 1.5 }}
                      animate={{ scale: 1 }}
                    >
                      {totalItems}
                    </motion.span>
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-lg p-0 border-l"
        style={{
          background: "linear-gradient(to bottom, #0A0E27, #1A1F3A)",
          borderColor: "rgba(0, 245, 255, 0.2)",
        }}
      >
        {/* Premium background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(0, 245, 255, 0.2), transparent 50%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <SheetHeader className="px-6 pt-6 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShoppingCart className="h-6 w-6" style={{ color: "#00F5FF" }} />
            </motion.div>
            <SheetTitle className="text-2xl" style={{ color: "#00F5FF" }}>
              Carrinho de Compras
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full px-6 pb-6 relative z-10">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ShoppingCart className="h-20 w-20 mx-auto mb-4" style={{ color: "#4A5568" }} />
                </motion.div>
                <p className="text-lg" style={{ color: "#B8BED9" }}>
                  Seu carrinho está vazio
                </p>
                <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
                  Adicione produtos incríveis!
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-3 py-4 pr-2">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="relative group"
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: "rgba(0, 245, 255, 0.2)",
                          filter: "blur(10px)",
                        }}
                      />

                      <div
                        className="relative flex gap-3 p-3 rounded-xl backdrop-blur-xl border"
                        style={{
                          background: "rgba(37, 43, 74, 0.6)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden relative border"
                          style={{
                            background: "#1F2937",
                            borderColor: "rgba(0, 245, 255, 0.1)",
                          }}
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-white mb-1 line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            {item.discount ? (
                              <>
                                <span className="text-xs line-through" style={{ color: "#6B7280" }}>
                                  R$ {item.price.toFixed(2)}
                                </span>
                                <span className="text-sm" style={{ color: "#00F5FF" }}>
                                  R${" "}
                                  {(
                                    item.price *
                                    (1 - item.discount / 100)
                                  ).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm" style={{ color: "#00F5FF" }}>
                                R$ {item.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="h-7 w-7 rounded-md border flex items-center justify-center transition-colors"
                              style={{
                                background: "rgba(0, 245, 255, 0.1)",
                                borderColor: "rgba(0, 245, 255, 0.3)",
                                color: "#00F5FF",
                              }}
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>

                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.5 }}
                              animate={{ scale: 1 }}
                              className="w-8 text-center text-sm text-white"
                            >
                              {item.quantity}
                            </motion.span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="h-7 w-7 rounded-md border flex items-center justify-center transition-colors"
                              style={{
                                background: "rgba(0, 245, 255, 0.1)",
                                borderColor: "rgba(0, 245, 255, 0.3)",
                                color: "#00F5FF",
                              }}
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="h-7 w-7 rounded-md ml-auto border flex items-center justify-center transition-colors"
                              style={{
                                background: "rgba(239, 68, 68, 0.2)",
                                borderColor: "rgba(239, 68, 68, 0.5)",
                                color: "#EF4444",
                              }}
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto pt-4 space-y-4"
                style={{
                  borderTop: "1px solid rgba(0, 245, 255, 0.2)",
                }}
              >
                {/* Summary */}
                <div
                  className="space-y-2 rounded-xl p-4 border backdrop-blur-xl"
                  style={{
                    background: "rgba(37, 43, 74, 0.4)",
                    borderColor: "rgba(0, 245, 255, 0.1)",
                  }}
                >
                  <div className="flex justify-between text-sm" style={{ color: "#B8BED9" }}>
                    <span>Subtotal</span>
                    <span className="text-white">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "#B8BED9" }}>
                    <span>Frete</span>
                    {shipping === 0 ? (
                      <span className="flex items-center gap-1" style={{ color: "#10B981" }}>
                        <Shield className="w-3 h-3" />
                        Grátis
                      </span>
                    ) : (
                      <span className="text-white">R$ {shipping.toFixed(2)}</span>
                    )}
                  </div>
                  <Separator style={{ background: "rgba(0, 245, 255, 0.2)" }} />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white">Total</span>
                    <motion.span
                      key={totalPrice}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                      style={{ color: "#00F5FF" }}
                    >
                      R$ {totalPrice.toFixed(2)}
                    </motion.span>
                  </div>
                </div>

                {/* Checkout button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full h-14 border-0 relative overflow-hidden transition-all"
                    style={{
                      background: "linear-gradient(135deg, #00F5FF, #0066FF)",
                      color: "#0A0E27",
                      boxShadow: "0 8px 24px rgba(0, 245, 255, 0.4)",
                    }}
                    onClick={() => setIsCheckingOut(true)}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      }}
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ opacity: 0.5 }}
                    />
                    <span className="relative z-10 flex items-center gap-2 text-lg">
                      <CreditCard className="w-5 h-5" />
                      Finalizar Compra
                    </span>
                  </Button>
                </motion.div>

                {/* Secure payment */}
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                  <Shield className="w-3 h-3" style={{ color: "#00F5FF" }} />
                  Pagamento 100% Seguro
                </div>
              </motion.div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
