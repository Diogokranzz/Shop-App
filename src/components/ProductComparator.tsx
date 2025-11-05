import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeftRight, Check, Minus } from "lucide-react";

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

interface ProductComparatorProps {
  products: Product[];
  onClose: () => void;
  onRemove: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductComparator = ({
  products,
  onClose,
  onRemove,
  onAddToCart,
}: ProductComparatorProps) => {
  if (products.length === 0) return null;

  const specs = [
    { label: "Categoria", key: "category" },
    { label: "Preco Original", key: "price" },
    { label: "Desconto", key: "discount" },
    { label: "Preco Final", key: "finalPrice" },
    { label: "Economia", key: "savings" },
    { label: "Estoque", key: "stock" },
  ];

  const getProductValue = (product: Product, key: string) => {
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    switch (key) {
      case "category":
        return product.category;
      case "price":
        return `R$ ${product.price.toFixed(2)}`;
      case "discount":
        return product.discount ? `-${product.discount}%` : "---";
      case "finalPrice":
        return `R$ ${finalPrice.toFixed(2)}`;
      case "savings":
        return product.discount
          ? `R$ ${(product.price - finalPrice).toFixed(2)}`
          : "---";
      case "stock":
        return product.stock !== undefined
          ? product.stock > 0
            ? `${product.stock} unidades`
            : "Sem estoque"
          : "---";
      default:
        return "---";
    }
  };

  const getBestValue = (key: string) => {
    if (key === "finalPrice") {
      return Math.min(
        ...products.map(p =>
          p.discount ? p.price * (1 - p.discount / 100) : p.price
        )
      );
    }
    if (key === "discount") {
      return Math.max(...products.map(p => p.discount || 0));
    }
    return null;
  };

  const isHighlighted = (product: Product, key: string) => {
    const bestValue = getBestValue(key);
    if (bestValue === null) return false;

    if (key === "finalPrice") {
      const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return finalPrice === bestValue;
    }
    if (key === "discount") {
      return (product.discount || 0) === bestValue;
    }
    return false;
  };

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
          className="bg-white border-4 border-black w-full max-w-5xl max-h-[90vh] overflow-hidden"
          style={{
            boxShadow: "12px 12px 0 rgba(0,0,0,0.3)",
          }}
        >
          <div className="bg-black text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              <span className="font-bold">COMPARAR PRODUTOS</span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 border-2 border-white hover:bg-white hover:text-black flex items-center justify-center transition-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-[#C0C0C0] p-4 overflow-auto max-h-[calc(90vh-120px)]">
            <div className="bg-white border-2 border-black">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="p-3 text-left font-bold bg-[#C0C0C0] sticky left-0 z-10">
                        ESPECIFICACOES
                      </th>
                      {products.map((product) => (
                        <th
                          key={product.id}
                          className="p-3 text-center min-w-[200px] relative"
                        >
                          <button
                            onClick={() => onRemove(product.id)}
                            className="absolute top-2 right-2 w-5 h-5 border border-black bg-white hover:bg-black hover:text-white transition-none flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="aspect-square border-2 border-black overflow-hidden mb-2 bg-white">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-bold text-xs">{product.name}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr
                        key={spec.key}
                        className={index % 2 === 0 ? "bg-white" : "bg-[#F0F0F0]"}
                      >
                        <td className="p-3 font-bold border-r-2 border-black bg-[#C0C0C0] sticky left-0 z-10">
                          {spec.label}
                        </td>
                        {products.map((product) => {
                          const isHighlight = isHighlighted(product, spec.key);
                          return (
                            <td
                              key={product.id}
                              className={`p-3 text-center border-l border-[#808080] ${
                                isHighlight ? "bg-green-100 font-bold" : ""
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                {isHighlight && (
                                  <Check className="h-4 w-4 text-green-700" />
                                )}
                                <span>{getProductValue(product, spec.key)}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="border-t-2 border-black">
                      <td className="p-3 font-bold bg-[#C0C0C0] sticky left-0 z-10">
                        ACAO
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="p-3 text-center">
                          <button
                            onClick={() => {
                              onAddToCart(product);
                              onClose();
                            }}
                            className="w-full py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-none text-xs font-bold"
                          >
                            ADICIONAR
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 bg-white border-2 border-black p-3">
              <div className="flex items-center gap-2 text-xs">
                <Check className="h-4 w-4 text-green-700" />
                <span>Melhor valor destacado em verde</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const useProductComparator = () => {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const isInCompare = (productId: number) => {
    return compareList.some((p) => p.id === productId);
  };

  const removeFromCompare = (productId: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return {
    compareList,
    toggleCompare,
    isInCompare,
    removeFromCompare,
    clearCompare,
  };
};
