import { ShoppingCart, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <Badge className="absolute top-1.5 right-1.5 bg-red-500 text-[10px] h-5 px-1.5">
            Esgotado
          </Badge>
        )}
      </div>
      <CardContent className="p-2.5">
        <div className="mb-1.5">
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
            {product.category}
          </Badge>
        </div>
        <h4 className="text-sm mb-1.5 line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
        <div className="flex items-center gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xs ${
                i < Math.floor(product.rating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-[10px] text-gray-500 ml-0.5">
            ({product.rating.toFixed(1)})
          </span>
        </div>
        <p className="text-blue-600">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-2.5 pt-0">
        <Button
          className="w-full h-8 text-xs"
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          size="sm"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
