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
import { Loader2, ArrowLeft, Upload, X, Copy, Check } from "lucide-react";
import Image from "next/image";

export default function EditProductPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const { id } = router.query;
  
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [olxCopied, setOlxCopied] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: "",
    images: [],
    is_featured: false,
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
          images: product.images || [],
          is_featured: product.is_featured || false,
        });
        
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOlxCopy = async () => {
    try {
      await productAdminService.copyToClipboard({
        name: formData.name,
        price: formData.price,
        description: formData.description,
      });
      
      setOlxCopied(true);
      setTimeout(() => setOlxCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("❌ Greška: " + (error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || typeof id !== "string") return;
    
    setSaving(true);

    try {
      const newImageUrls: string[] = [];

      if (imageFiles.length > 0) {
        setUploadingImages(true);
        for (const file of imageFiles) {
          const url = await productAdminService.uploadImage(file);
          newImageUrls.push(url);
        }
        setUploadingImages(false);
      }

      const allImages = [...existingImages, ...newImageUrls];

      await productAdminService.updateProduct(id, {
        ...formData,
        images: allImages,
      });

      alert("Proizvod uspješno ažuriran! ✅");
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Greška prilikom ažuriranja proizvoda");
    } finally {
      setSaving(false);
      setUploadingImages(false);
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
              {/* Multiple Images Upload */}
              <div className="space-y-4">
                <Label className="font-mono text-lg">Slike Proizvoda</Label>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Postojeće slike:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted/20">
                          <Image
                            src={image}
                            alt={`Existing ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Nove slike:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted/20">
                          <Image
                            src={preview}
                            alt={`New ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => removeNewImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Kliknite za upload</span> ili drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP (Možete dodati više slika)
                    </p>
                    {(existingImages.length + imagePreviews.length) > 0 && (
                      <p className="text-xs text-primary font-mono mt-2">
                        {existingImages.length + imagePreviews.length} slika ukupno
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
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

                {/* OLX.BA COPY BUTTON */}
                <div className="p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Copy className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-mono text-lg font-semibold mb-2">Kopiraj za OLX.ba</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Kliknite dugme da kopirate sve podatke proizvoda u clipboard. Zatim idite na OLX.ba i paste-ujte podatke u formu.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleOlxCopy}
                      disabled={!formData.name || formData.price <= 0}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {olxCopied ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          ✅ Podaci kopirani u clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Kopiraj podatke za OLX
                        </>
                      )}
                    </Button>
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
                  disabled={saving || uploadingImages}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {uploadingImages ? `Uploading ${imageFiles.length} slika...` : "Ažuriranje..."}
                    </>
                  ) : (
                    "Sačuvaj Izmjene"
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