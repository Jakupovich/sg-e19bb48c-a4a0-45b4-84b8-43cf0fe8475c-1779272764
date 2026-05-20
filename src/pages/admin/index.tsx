import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  Loader2,
  LogOut,
  Settings,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;

      try {
        // Get product stats
        const { count: productCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { count: lowStockCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lte("stock", 5);

        // Get order stats
        const { count: orderCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        const { data: orders } = await supabase
          .from("orders")
          .select("total");

        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

        setStats({
          totalProducts: productCount || 0,
          totalOrders: orderCount || 0,
          totalRevenue,
          lowStockProducts: lowStockCount || 0,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
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
      <SEO title="Admin Dashboard - ALZA" />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="container">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-mono font-bold gradient-blue">
                  ALZA Admin
                </h1>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-8">
          {/* Quick Actions */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Link href="/admin/products/new">
              <Button className="border-neon-blue">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj Proizvod
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Upravljaj Proizvodima
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Narudžbe
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard glow="blue" hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-mono mb-1">
                    Ukupno Proizvoda
                  </p>
                  <p className="text-4xl font-mono font-bold text-primary">
                    {stats.totalProducts}
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Pogledaj sve
                </Button>
              </Link>
            </GlassCard>

            <GlassCard glow="cyan" hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-mono mb-1">
                    Ukupne Narudžbe
                  </p>
                  <p className="text-4xl font-mono font-bold text-primary">
                    {stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Pogledaj sve
                </Button>
              </Link>
            </GlassCard>

            <GlassCard glow="blue" hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-mono mb-1">
                    Ukupni Prihod
                  </p>
                  <p className="text-3xl font-mono font-bold text-primary">
                    {stats.totalRevenue.toFixed(2)} KM
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>

            <GlassCard glow="red" hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-mono mb-1">
                    Nisko Stanje
                  </p>
                  <p className="text-4xl font-mono font-bold text-secondary">
                    {stats.lowStockProducts}
                  </p>
                </div>
                <Package className="w-8 h-8 text-secondary" />
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs">
                Upozorenje
              </Button>
            </GlassCard>
          </div>

          {/* Recent Activity Section */}
          <GlassCard>
            <h2 className="text-xl font-mono font-bold mb-6">Nedavna Aktivnost</h2>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aktivnost će biti prikazana ovdje</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}