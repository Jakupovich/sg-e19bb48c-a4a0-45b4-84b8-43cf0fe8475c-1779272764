import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Snowflake, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Snowflake className="w-8 h-8 text-primary animate-pulse-glow absolute" />
              <Flame className="w-8 h-8 text-secondary opacity-70" />
            </div>
            <div>
              <h1 className="text-2xl font-mono font-bold gradient-blue">ALZA</h1>
              <p className="text-xs text-muted-foreground -mt-1">Grijanje i Hlađenje</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Početna
            </Link>
            <Link href="/proizvodi" className="text-sm font-medium hover:text-primary transition-colors">
              Proizvodi
            </Link>
            <Link href="/proizvodi?category=klima-uredjaji" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Snowflake className="w-4 h-4" />
              Klima
            </Link>
            <Link href="/proizvodi?category=bojleri" className="text-sm font-medium hover:text-secondary transition-colors flex items-center gap-1">
              <Flame className="w-4 h-4" />
              Bojleri
            </Link>
            <Link href="/kontakt" className="text-sm font-medium hover:text-primary transition-colors">
              Kontakt
            </Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/korpa">
              <Button variant="outline" size="icon" className="relative border-neon-blue hover-glow-blue">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-mono font-bold">
                  0
                </span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            <Link href="/" className="block text-sm font-medium hover:text-primary transition-colors">
              Početna
            </Link>
            <Link href="/proizvodi" className="block text-sm font-medium hover:text-primary transition-colors">
              Proizvodi
            </Link>
            <Link href="/proizvodi?category=klima-uredjaji" className="block text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <Snowflake className="w-4 h-4" />
              Klima Uređaji
            </Link>
            <Link href="/proizvodi?category=bojleri" className="block text-sm font-medium hover:text-secondary transition-colors flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Bojleri
            </Link>
            <Link href="/kontakt" className="block text-sm font-medium hover:text-primary transition-colors">
              Kontakt
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}