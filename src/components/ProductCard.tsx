import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Snowflake, Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/services/productService";

interface ProductCardProps {
  product: Product & {
    categories?: {
      name: string;
      slug: string;
      icon: string;
    } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isCooling = product.categories?.slug?.includes("klima");
  const glowColor = isCooling ? "blue" : "red";
  const Icon = isCooling ? Snowflake : Flame;

  // Get first image from images array
  const firstImage = product.images?.[0] || null;

  return (
    <Link href={`/proizvodi/${product.slug}`}>
      <GlassCard 
        className="group cursor-pointer h-full overflow-hidden" 
        glow={glowColor}
        hover
      >
        {/* Image */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted/20">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className={`w-20 h-20 ${isCooling ? 'text-primary' : 'text-secondary'}`} />
            </div>
          )}
          
          {/* Badge */}
          {product.is_featured && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border-neon-blue">
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Category */}
          {product.categories && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="w-4 h-4" />
              <span>{product.categories.name}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-mono font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price & Stock */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-mono font-bold text-primary">
                {product.price.toFixed(2)} KM
              </div>
              <div className="text-xs text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="text-green-500">Na stanju: {product.stock}</span>
                ) : (
                  <span className="text-destructive">Nema na stanju</span>
                )}
              </div>
            </div>

            <Button
              size="icon"
              variant="outline"
              className={`${
                isCooling 
                  ? 'border-neon-blue hover-glow-blue' 
                  : 'border-neon-red hover-glow-red'
              }`}
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}