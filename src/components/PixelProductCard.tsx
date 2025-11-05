import { motion } from "motion/react";
import { useState } from "react";
import { PixelImage } from "./PixelImage";

export interface PixelProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  discount?: number;
  specs?: string[];
  keywords?: string[];
}

interface PixelProductCardProps {
  product: PixelProduct;
  onAddToCart: (product: PixelProduct) => void;
  index: number;
}

export function PixelProductCard({
  product,
  onAddToCart,
  index,
}: PixelProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const discountPercent = product.discount || 0;

  const slideDirection = index % 2 === 0 ? -20 : 20;

  return (
    <motion.article
      className="relative bg-white border-2 border-black transition-shadow duration-200"
      initial={{ opacity: 0, x: slideDirection, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? "6px 6px 0 black" : "2px 2px 0 black",
      }}
    >
      <div className="relative h-48 border-b-2 border-black overflow-hidden bg-[#C0C0C0]">
        <motion.div
          className="w-full h-full"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <PixelImage
            src={product.image}
            alt={product.name}
            className="w-full h-full"
          />
        </motion.div>

        {discountPercent > 0 && (
          <motion.div
            className="absolute top-2 left-2 px-2 py-1 bg-black text-white border border-white text-xs font-bold"
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            -{discountPercent}%
          </motion.div>
        )}

        <div className="absolute top-2 right-2 px-2 py-1 bg-white border-2 border-black text-xs font-bold">
          {product.category.toUpperCase()}
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.15 : 0.05,
          }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)",
            }}
          />
        </motion.div>
      </div>

      <div className="p-3">
        <h3 className="text-base mb-2 border-b border-dashed border-[#808080] pb-2 leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="text-sm"
              style={{
                color: i < Math.floor(product.rating) ? "#000" : "#C0C0C0",
              }}
            >
              ★
            </span>
          ))}
          <span className="text-xs ml-1 text-[#808080]">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {product.specs && product.specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.specs.slice(0, 2).map((spec, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-1 border border-black bg-[#C0C0C0]"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1 mb-3">
          {product.originalPrice && (
            <span className="text-sm line-through text-[#808080]">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-2xl font-bold">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs">
          <span
            className="inline-block w-2 h-2 border border-black"
            style={{
              background: product.inStock ? "#000" : "#C0C0C0",
            }}
          />
          <span>{product.inStock ? "EM ESTOQUE" : "INDISPONÍVEL"}</span>
        </div>

        <motion.button
          onClick={() => onAddToCart(product)}
          className="w-full py-2 px-3 bg-black text-white border-2 border-black text-sm font-bold hover:bg-white hover:text-black transition-colors duration-150"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        >
          ADICIONAR AO CARRINHO
        </motion.button>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)",
          }}
        />
      </div>
    </motion.article>
  );
}
