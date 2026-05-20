import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/services/productService";

interface ProductGridProps {
  products: (Product & {
    categories?: {
      name: string;
      slug: string;
      icon: string;
    } | null;
  })[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Nema proizvoda za prikaz.</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      {title && (
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-8 text-center gradient-blue">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}