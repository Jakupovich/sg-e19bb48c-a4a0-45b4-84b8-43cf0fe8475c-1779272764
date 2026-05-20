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
  image_url: string | null;
  is_featured: boolean;
  publish_to_pikba: boolean;
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
    const { publish_to_pikba, ...productData } = data;
    
    const { data: product, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    // If Pik.ba toggle is active, trigger cross-posting
    if (publish_to_pikba && product) {
      await this.syncToPikBa(product);
    }

    return product;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const { publish_to_pikba, ...productData } = data;

    const { data: product, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    // If Pik.ba toggle is active, trigger cross-posting
    if (publish_to_pikba && product) {
      await this.syncToPikBa(product);
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

  async syncToPikBa(product: Product): Promise<void> {
    try {
      console.log("🔄 Syncing to Pik.ba:", product.name);
      
      // TODO: Implement actual Pik.ba API integration
      // This is a placeholder for the cross-posting logic
      const pikBaData = {
        title: product.name,
        description: product.description,
        price: product.price,
        images: product.image_url ? [product.image_url] : [],
        category: "hvac", // Map to Pik.ba category
        location: "Sarajevo", // Default location
      };

      // In production, this would make an API call to Pik.ba
      // const response = await fetch("https://api.pik.ba/listings", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${process.env.PIKBA_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(pikBaData),
      // });

      console.log("✅ Pik.ba sync completed (mock):", pikBaData);
      
      // Store Pik.ba listing ID in database if needed
      // await supabase
      //   .from("products")
      //   .update({ pikba_listing_id: response.id })
      //   .eq("id", product.id);

    } catch (error) {
      console.error("❌ Pik.ba sync failed:", error);
      // Don't throw - allow product creation to succeed even if sync fails
    }
  },
};