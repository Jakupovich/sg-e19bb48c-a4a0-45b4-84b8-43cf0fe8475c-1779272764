import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { productService, type Product } from "@/services/productService";
import { productAdminService } from "@/services/productAdminService";
import { SEO } from "@/components/SEO";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Search,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

type ProductWithCategory = Product & {
  categories?: {
    name: string;
    slug: string;
  } | null;
};

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      if (!user) return;

      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovaj proizvod?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await productAdminService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Greška prilikom brisanja proizvoda");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Upravljanje Proizvodima - ALZA Admin" />

      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-mono font-bold gradient-blue">
                Upravljanje Proizvodima
              </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži proizvode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Link href="/admin/products/new">
                <Button className="border-neon-blue w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj Proizvod
                </Button>
              </Link>
            </div>
          </div>

          <GlassCard>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="font-mono">Slika</TableHead>
                    <TableHead className="font-mono">Naziv</TableHead>
                    <TableHead className="font-mono">Kategorija</TableHead>
                    <TableHead className="font-mono">Cijena</TableHead>
                    <TableHead className="font-mono">Stanje</TableHead>
                    <TableHead className="font-mono">Status</TableHead>
                    <TableHead className="font-mono text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                        {searchQuery ? "Nema rezultata pretrage" : "Nema proizvoda"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="border-border/30">
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted/20">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                ?
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.categories?.name || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-primary">
                          {product.price.toFixed(2)} KM
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.stock > 5 ? "outline" : "destructive"}
                            className={product.stock > 5 ? "border-green-500 text-green-500" : ""}
                          >
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.is_featured && (
                            <Badge className="bg-primary/20 text-primary border-primary/50">
                              Featured
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button size="icon" variant="outline" className="border-neon-blue">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="icon"
                              variant="outline"
                              className="border-destructive/50 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(product.id)}
                              disabled={deleteLoading === product.id}
                            >
                              {deleteLoading === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}