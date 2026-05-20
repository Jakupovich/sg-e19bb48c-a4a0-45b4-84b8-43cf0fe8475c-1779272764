import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { productService } from "@/services/productService";
import { productAdminService, type ProductFormData } from "@/services/productAdminService";
import { SEO } from "@/components/SEO";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, X, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function EditProductPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const { id } = router.query;
  
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: "",
    image_url: null,
    is_featured: false,
    publish_to_pikba: false,
  });

  useEffect(() => {
    async function loadData() {
      if (!user || !id || typeof id !== "string") return;
      
      try {
        const [cats, product] = await Promise.all([
          productService.getCategories(),
          productAdminService.getProductById(id)
        ]);
        
        setCategories(cats);
        
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category_id: product.category_id || "",
          image_url: product.image_url,
          is_featured: product.is_featured || false,
          publish_to_pikba: false, // Default to false for edits
        });
        
        if (product.image_url) {
          setImagePreview(product.image_url);
        }
      } catch (error) {
        console.error("Failed to load product data:", error);
        alert("Greška pri učitavanju proizvoda");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user, id, router]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || typeof id !== "string") return;
    
    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new one is selected
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await productAdminService.uploadImage(imageFile);
        setUploadingImage(false);
      }

      // Update product
      await productAdminService.updateProduct(id, {
        ...formData,
        image_url: imageUrl,
      });

      if (formData.publish_to_pikba) {
        alert("Proizvod uspješno ažuriran i ažuriran na Pik.ba! ✅");
      } else {
        alert("Proizvod uspješno ažuriran! ✅");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Greška prilikom ažuriranja proizvoda");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Uredi Proizvod - ALZA Admin" />

      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin/products")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-mono font-bold gradient-blue">
                Uredi Proizvod
              </h1>
            </div>
          </div>

          <GlassCard className="max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <Label className="font-mono text-lg">Slika Proizvoda</Label>
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted/20">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/10">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Kliknite za upload</span> ili drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WebP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono">Naziv Proizvoda *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="font-mono">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="font-mono">Kategorija *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="font-mono">Cijena (KM) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="font-mono">Stanje na Skladištu *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-mono">Opis</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-6 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured" className="font-mono text-base">Featured Product</Label>
                    <p className="text-sm text-muted-foreground">Prikazati na početnoj stranici</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                </div>

                <div className="p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="pikba" className="font-mono text-lg cursor-pointer">
                          Ažuriraj i na OLX (Pik.ba)
                        </Label>
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sinhronizuj izmjene sa postojećim listingom na Pik.ba
                      </p>
                    </div>
                    <Switch
                      id="pikba"
                      checked={formData.publish_to_pikba}
                      onCheckedChange={(checked) => setFormData({ ...formData, publish_to_pikba: checked })}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                  className="flex-1"
                >
                  Otkaži
                </Button>
                <NeonButton
                  type="submit"
                  variant="blue"
                  disabled={saving || uploadingImage}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {uploadingImage ? "Uploading..." : "Ažuriranje..."}
                    </>
                  ) : (
                    <>
                      Sačuvaj Izmjene
                      {formData.publish_to_pikba && " + Pik.ba"}
                    </>
                  )}
                </NeonButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  );
}