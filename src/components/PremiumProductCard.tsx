import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ShoppingCart, Heart, Eye, Star, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface PremiumProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export function PremiumProductCard({
  product,
  onAddToCart,
  index,
}: PremiumProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        className="relative group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Premium glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(0, 245, 255, 0.3), rgba(107, 76, 230, 0.2))",
            filter: "blur(20px)",
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
        />

        {/* Card with glassmorphism */}
        <div
          className="relative overflow-hidden rounded-2xl backdrop-blur-xl border"
          style={{
            background: "rgba(37, 43, 74, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            transformStyle: "preserve-3d",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Subtle gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(135deg, transparent, rgba(0, 245, 255, 0.1), transparent)",
            }}
            animate={{
              backgroundPosition: isHovered ? ["0% 0%", "200% 200%"] : "0% 0%",
              opacity: isHovered ? 0.5 : 0,
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge
                  className="border-0 px-3 py-1 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #00F5FF, #0066FF)",
                    color: "#0A0E27",
                    boxShadow: "0 4px 12px rgba(0, 245, 255, 0.4)",
                  }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  NOVO
                </Badge>
              </motion.div>
            )}
            {product.discount && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                animate-pulse="true"
                style={{
                  animation: "badge-bounce 2s ease-in-out infinite",
                }}
              >
                <Badge
                  className="border-0 px-3 py-1 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #FF3366, #FF6B35)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255, 51, 102, 0.4)",
                  }}
                >
                  -{product.discount}%
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <motion.button
              className="w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all"
              style={{
                background: isFavorite ? "#00F5FF" : "rgba(10, 14, 39, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: isFavorite ? "#0A0E27" : "#B8BED9",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Heart
                className="w-4 h-4"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </motion.button>
            <motion.button
              className="w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all"
              style={{
                background: "rgba(10, 14, 39, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "#B8BED9",
              }}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(0, 245, 255, 0.2)",
                color: "#00F5FF"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            <motion.div
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Scanline effect */}
            <motion.div
              className="absolute inset-0 opacity-0 transition-opacity"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.05) 2px, rgba(0, 245, 255, 0.05) 4px)",
              }}
              animate={{
                y: isHovered ? [0, -100] : 0,
                opacity: isHovered ? 0.3 : 0,
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                ease: "linear",
              }}
            />
          </div>

          {/* Content */}
          <div className="p-4 relative">
            {/* Decorative line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: "linear-gradient(to right, transparent, rgba(0, 245, 255, 0.5), transparent)",
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="secondary"
                className="mb-2 border"
                style={{
                  background: "rgba(0, 245, 255, 0.1)",
                  color: "#00F5FF",
                  borderColor: "rgba(0, 245, 255, 0.3)",
                }}
              >
                {product.category}
              </Badge>

              <h3 className="mb-2 text-white line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Star
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : ""
                      }`}
                      style={{
                        color: i < Math.floor(product.rating) ? "#00F5FF" : "#4A5568",
                      }}
                    />
                  </motion.div>
                ))}
                <span className="text-xs ml-1" style={{ color: "#B8BED9" }}>
                  ({product.rating.toFixed(1)})
                </span>
              </div>

              <div className="flex items-end justify-between mb-3">
                <div>
                  {product.discount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through" style={{ color: "#6B7280" }}>
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-2xl" style={{ color: "#00F5FF" }}>
                        R${" "}
                        {(
                          product.price *
                          (1 - product.discount / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl" style={{ color: "#00F5FF" }}>
                      R$ {product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full h-11 border-0 relative overflow-hidden text-black transition-all"
                  style={{
                    background: "linear-gradient(135deg, #00F5FF, #0066FF)",
                    boxShadow: "0 4px 12px rgba(0, 245, 255, 0.3)",
                  }}
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
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
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? "Adicionar ao Carrinho" : "Esgotado"}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
