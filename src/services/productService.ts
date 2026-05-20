import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type Category = Tables<"categories">;

export const productService = {
  async getProducts(categorySlug?: string) {
    let query = supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (categorySlug) {
      query = query.eq("categories.slug", categorySlug);
    }

    const { data, error } = await query;
    console.log("getProducts:", { data, error });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data || [];
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    console.log("getProductBySlug:", { data, error });

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }

    return data;
  },

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(6);

    console.log("getFeaturedProducts:", { data, error });

    if (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }

    return data || [];
  },

  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    console.log("getCategories:", { data, error });

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    return data || [];
  },
};