import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { productService, type Product } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { Loader2, ShoppingCart, Snowflake, Flame, Check, Package, Shield, Truck } from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      if (!slug || typeof slug !== "string") return;

      try {
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="text-center">
            <h1 className="text-2xl font-mono font-bold mb-2">Proizvod nije pronađen</h1>
            <Button onClick={() => router.push("/proizvodi")}>
              Povratak na katalog
            </Button>
          </GlassCard>
        </div>
      </>
    );
  }

  const isCooling = product.categories?.slug?.includes("klima");
  const Icon = isCooling ? Snowflake : Flame;
  const glowColor = isCooling ? "blue" : "red";

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <>
      <SEO
        title={`${product.name} - ALZA Grijanje i Hlađenje`}
        description={product.description || `Pregledajte detalje proizvoda ${product.name} u ALZA ponudi.`}
        image={product.image_url || undefined}
      />

      <div className="min-h-screen">
        <Navigation />

        <div className="container pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <GlassCard className="overflow-hidden" glow={glowColor}>
              <div className="relative aspect-square">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/20">
                    <Icon className={`w-40 h-40 ${isCooling ? 'text-primary' : 'text-secondary'}`} />
                  </div>
                )}

                {product.is_featured && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-neon-blue text-lg px-4 py-2">
                    Featured
                  </Badge>
                )}
              </div>
            </GlassCard>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              {product.categories && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-mono">{product.categories.name}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-mono font-bold gradient-blue">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <div className="text-5xl font-mono font-bold text-primary">
                  {product.price.toFixed(2)} KM
                </div>
                {product.stock > 0 ? (
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    <Check className="w-4 h-4 mr-1" />
                    Na stanju: {product.stock}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-destructive text-destructive">
                    Nema na stanju
                  </Badge>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h2 className="text-lg font-mono font-semibold">Opis</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <Separator className="bg-border/50" />

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-mono text-sm">Količina:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <div className="w-16 text-center font-mono font-bold text-xl">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <NeonButton
                  variant={isCooling ? "blue" : "red"}
                  size="lg"
                  className="w-full text-lg"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Dodaj u korpu
                </NeonButton>
              </div>

              {/* Features */}
              <GlassCard glow="cyan" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Package className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-mono font-semibold mb-1">Brza dostava</h3>
                      <p className="text-xs text-muted-foreground">Isporuka u roku od 3-5 dana</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-mono font-semibold mb-1">Garancija</h3>
                      <p className="text-xs text-muted-foreground">2 godine proizvodne garancije</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-mono font-semibold mb-1">Besplatna montaža</h3>
                      <p className="text-xs text-muted-foreground">Profesionalna instalacija uključena</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}