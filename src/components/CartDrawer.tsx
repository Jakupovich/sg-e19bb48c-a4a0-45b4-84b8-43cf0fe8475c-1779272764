import { useCart } from "@/contexts/CartContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, closeCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] z-50 transform transition-transform duration-300">
        <GlassCard className="h-full rounded-none border-l border-border/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-mono font-bold">Korpa</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="hover-glow-blue"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground">Korpa je prazna</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={closeCart}
                >
                  Nastavite sa kupovinom
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-lg bg-muted/10 border border-border/30"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted/20">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/proizvodi/${item.product.slug}`}
                        onClick={closeCart}
                      >
                        <h3 className="font-mono font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="text-lg font-mono font-bold text-primary mb-2">
                        {item.product.price.toFixed(2)} KM
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-mono font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border/50 space-y-4">
              <div className="flex items-center justify-between text-2xl font-mono font-bold">
                <span>Ukupno:</span>
                <span className="text-primary">{totalPrice.toFixed(2)} KM</span>
              </div>
              <Separator className="bg-border/50" />
              <Button
                className="w-full border-neon-blue text-lg h-14"
                onClick={() => {
                  // TODO: Navigate to checkout
                  console.log("Proceeding to checkout");
                }}
              >
                Nastavi na plaćanje
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}