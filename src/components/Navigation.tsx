import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

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

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
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
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}