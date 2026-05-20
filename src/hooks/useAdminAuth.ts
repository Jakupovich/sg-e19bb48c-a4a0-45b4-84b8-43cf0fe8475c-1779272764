import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push("/admin/login");
          return;
        }

        // Check if user has admin role in profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, email, role")
          .eq("id", session.user.id)
          .single();

        if (error || !profile || profile.role !== "admin") {
          router.push("/admin/login");
          return;
        }

        setUser(profile as AdminUser);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { user, loading };
}