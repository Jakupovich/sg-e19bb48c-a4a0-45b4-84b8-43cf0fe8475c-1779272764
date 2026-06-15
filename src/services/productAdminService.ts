import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export interface ProductFormData {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string;
  images: string[];
  is_featured: boolean;
}

export const productAdminService = {
  async getProductById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }

    return data;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const { data: product, error } = await supabase
      .from("products")
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    return product;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const { data: product, error } = await supabase
      .from("products")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const path = imageUrl.split("/products/")[1];
      if (!path) return;

      const { error } = await supabase.storage
        .from("products")
        .remove([path]);

      if (error) {
        console.error("Error deleting image:", error);
      }
    } catch (error) {
      console.error("Error parsing image URL:", error);
    }
  },

  /**
   * Copy product data to clipboard for OLX.ba posting
   * Does NOT open OLX - user copies data manually
   */
  async copyToClipboard(product: { name: string; price: number; description: string | null }): Promise<void> {
    const formattedText = `Naslov: ${product.name}

Cijena: ${product.price.toFixed(2)} KM

Opis:
${product.description || ""}

---
ALZA - Grijanje i Hlađenje
Tel: [Vaš telefon]
`;

    try {
      await navigator.clipboard.writeText(formattedText);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      throw new Error("Clipboard pristup nije dozvoljen");
    }
  },
};