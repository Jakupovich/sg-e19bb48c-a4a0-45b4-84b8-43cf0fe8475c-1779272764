import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { SEO } from "@/components/SEO";
import { productService, type Product } from "@/services/productService";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <>
      <SEO
        title="ALZA - Grijanje i Hlađenje | Vrhunski HVAC Sistemi"
        description="Najmoderniji sistemi klima uređaja, bojlera i grijanja. Vrhunska tehnologija za savršenu temperaturu vašeg prostora."
      />
      
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        
        <div className="container pb-20">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProductGrid 
              products={featuredProducts} 
              title="Izdvojeni Proizvodi"
            />
          )}
        </div>
      </div>
    </>
  );
}