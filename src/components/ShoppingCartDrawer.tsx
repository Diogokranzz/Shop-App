import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./ProductCard";

export interface CartItem extends Product {
  quantity: number;
}

interface ShoppingCartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function ShoppingCartDrawer({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: ShoppingCartDrawerProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full px-4 pb-4">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Seu carrinho está vazio</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-3 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-2.5 border rounded-lg bg-white"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm mb-1 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-blue-600 mb-2">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 space-y-3 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Total</span>
                    <span className="text-xl text-blue-600">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
