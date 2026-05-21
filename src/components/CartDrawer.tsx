import React from "react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { orderService, type CheckoutData } from "@/services/orderService";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type View = "cart" | "checkout" | "success";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, closeCart, clearCart } = useCart();
  const [view, setView] = useState<View>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    notes: "",
  });

  const handleClose = () => {
    closeCart();
    // Reset after animation completes
    setTimeout(() => {
      setView("cart");
      setError(null);
      setCheckoutData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        shipping_address: "",
        notes: "",
      });
    }, 300);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const order = await orderService.createOrder(checkoutData, orderItems, totalPrice);
      
      setOrderNumber(order.id);
      setView("success");
      clearCart();
    } catch (err: any) {
      console.error("Order submission failed:", err);
      
      // Parse error message
      let errorMessage = "Greška prilikom kreiranja narudžbe.";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.code) {
        if (err.code === "42501") {
          errorMessage = "Nemate dozvolu za kreiranje narudžbe. Molimo prijavite se ili kontaktirajte podršku.";
        } else if (err.code === "23503") {
          errorMessage = "Greška sa podacima proizvoda. Molimo osvježite stranicu.";
        } else {
          errorMessage = `Greška (${err.code}): ${err.message || "Nepoznata greška"}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] z-50 transform transition-transform duration-300">
        <GlassCard className="h-full rounded-none border-l border-border/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {view === "checkout" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setView("cart");
                      setError(null);
                    }}
                    className="mr-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-mono font-bold">
                  {view === "cart" && "Korpa"}
                  {view === "checkout" && "Checkout"}
                  {view === "success" && "Uspješno!"}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover-glow-blue"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* CART VIEW */}
            {view === "cart" && (
              <>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mb-4" />
                    <p className="text-lg text-muted-foreground">Korpa je prazna</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleClose}
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
                            onClick={handleClose}
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
              </>
            )}

            {/* CHECKOUT VIEW */}
            {view === "checkout" && (
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="font-mono">Ime i prezime *</Label>
                    <Input
                      id="name"
                      value={checkoutData.customer_name}
                      onChange={(e) => setCheckoutData({ ...checkoutData, customer_name: e.target.value })}
                      placeholder="Vaše ime i prezime"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-mono">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={checkoutData.customer_email}
                      onChange={(e) => setCheckoutData({ ...checkoutData, customer_email: e.target.value })}
                      placeholder="vas@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-mono">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={checkoutData.customer_phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, customer_phone: e.target.value })}
                      placeholder="+387 XX XXX XXX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="font-mono">Adresa dostave *</Label>
                    <Textarea
                      id="address"
                      value={checkoutData.shipping_address}
                      onChange={(e) => setCheckoutData({ ...checkoutData, shipping_address: e.target.value })}
                      placeholder="Ulica, broj, grad, poštanski broj"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="font-mono">Napomene (opciono)</Label>
                    <Textarea
                      id="notes"
                      value={checkoutData.notes}
                      onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                      placeholder="Dodatne napomene za dostavu..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-4 rounded-lg bg-muted/10 border border-border/30 space-y-2">
                  <h3 className="font-mono font-semibold mb-2">Pregled narudžbe</h3>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span className="font-mono">{(item.quantity * item.product.price).toFixed(2)} KM</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-mono font-bold">
                    <span>Ukupno:</span>
                    <span className="text-primary">{totalPrice.toFixed(2)} KM</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full border-neon-blue text-lg h-14"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Obrada...
                    </>
                  ) : (
                    "Potvrdi narudžbu"
                  )}
                </Button>
              </form>
            )}

            {/* SUCCESS VIEW */}
            {view === "success" && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-mono font-bold mb-2">
                    Narudžba uspješna!
                  </h3>
                  <p className="text-muted-foreground mb-1">
                    Hvala vam na narudžbi.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Broj narudžbe: <span className="font-mono font-semibold">{orderNumber.slice(0, 8)}</span>
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/10 border border-border/30 text-sm text-left w-full">
                  <p className="mb-2">✅ Narudžba je zaprimljena</p>
                  <p className="mb-2">✅ Email potvrda poslata na {checkoutData.customer_email}</p>
                  <p>✅ Kontaktirat ćemo vas uskoro</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClose}
                >
                  Zatvori
                </Button>
              </div>
            )}
          </div>

          {/* Footer - Only show in cart view */}
          {view === "cart" && items.length > 0 && (
            <div className="p-6 border-t border-border/50 space-y-4">
              <div className="flex items-center justify-between text-2xl font-mono font-bold">
                <span>Ukupno:</span>
                <span className="text-primary">{totalPrice.toFixed(2)} KM</span>
              </div>
              <Separator className="bg-border/50" />
              <Button
                className="w-full border-neon-blue text-lg h-14"
                onClick={() => setView("checkout")}
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