import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";

export function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="text-2xl md:text-3xl font-mono font-bold">
                <span className="text-primary group-hover:glow-blue transition-all">ALZA</span>
              </div>
              <div className="hidden md:block text-sm text-muted-foreground">
                Grijanje i Hlađenje
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-mono hover:text-primary transition-colors"
              >
                Početna
              </Link>
              <Link
                href="/proizvodi"
                className="text-sm font-mono hover:text-primary transition-colors"
              >
                Proizvodi
              </Link>
              <Link
                href="/o-nama"
                className="text-sm font-mono hover:text-primary transition-colors"
              >
                O nama
              </Link>
              <Link
                href="/kontakt"
                className="text-sm font-mono hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Auth Buttons - Desktop */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-sm font-mono"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Odjavi se
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/login")}
                    className="text-sm font-mono"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Prijava
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/register")}
                    className="text-sm font-mono border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Registracija
                  </Button>
                </div>
              )}

              {/* Cart Button */}
              <Button
                variant="outline"
                size="icon"
                className="relative border-neon-blue hover-glow-blue"
                onClick={openCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-primary text-primary-foreground border-2 border-background">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-border/50">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm font-mono hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Početna
                </Link>
                <Link
                  href="/proizvodi"
                  className="text-sm font-mono hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Proizvodi
                </Link>
                <Link
                  href="/o-nama"
                  className="text-sm font-mono hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  O nama
                </Link>
                <Link
                  href="/kontakt"
                  className="text-sm font-mono hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kontakt
                </Link>

                {/* Mobile Auth */}
                <div className="border-t border-border/50 pt-4 mt-2 space-y-2">
                  {user ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-sm font-mono"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Odjavi se
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push("/login");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-sm font-mono"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Prijava
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          router.push("/register");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-sm font-mono bg-primary text-primary-foreground"
                      >
                        Registracija
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}