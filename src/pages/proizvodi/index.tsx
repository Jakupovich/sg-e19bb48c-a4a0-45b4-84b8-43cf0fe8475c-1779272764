import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navigation } from "@/components/Navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { SEO } from "@/components/SEO";
import { productService, type Product, type Category } from "@/services/productService";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Loader2, Filter } from "lucide-react";

export default function ProizvodiPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(selectedCategory || undefined),
          productService.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory]);

  useEffect(() => {
    if (category && typeof category === "string") {
      setSelectedCategory(category);
    }
  }, [category]);

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug);
    if (slug) {
      router.push(`/proizvodi?category=${slug}`, undefined, { shallow: true });
    } else {
      router.push("/proizvodi", undefined, { shallow: true });
    }
  };

  return (
    <>
      <SEO
        title="Proizvodi - ALZA Grijanje i Hlađenje"
        description="Pregledajte naš kompletan katalog klima uređaja, bojlera, radijatora i sistema grijanja."
      />

      <div className="min-h-screen">
        <Navigation />

        <div className="container pt-32 pb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-mono font-bold gradient-blue mb-4">
              Naši Proizvodi
            </h1>
            <p className="text-lg text-muted-foreground">
              Vrhunska oprema za vaš dom i poslovni prostor
            </p>
          </div>

          {/* Filters */}
          <GlassCard className="mb-8" glow="cyan">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-semibold">Kategorije</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => handleCategoryChange(null)}
                className={selectedCategory === null ? "border-neon-blue" : ""}
              >
                Sve
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? "default" : "outline"}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={selectedCategory === cat.slug ? "border-neon-blue" : ""}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </GlassCard>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </>
  );
}