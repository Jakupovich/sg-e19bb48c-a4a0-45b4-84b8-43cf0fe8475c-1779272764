import { Snowflake, Flame, Zap } from "lucide-react";
import { NeonButton } from "@/components/ui/neon-button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradient" />
      
      {/* Floating Icons */}
      <div className="absolute top-40 left-10 animate-pulse-glow">
        <Snowflake className="w-20 h-20 text-primary/30" />
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse">
        <Flame className="w-24 h-24 text-secondary/30" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <GlassCard className="inline-flex items-center gap-2 px-6 py-3" glow="blue">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono font-semibold">2026 Tech - Vrhunski Sistemi</span>
            </GlassCard>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-mono font-bold leading-tight">
            <span className="gradient-blue">Grijanje</span> i{" "}
            <span className="gradient-blue">Hlađenje</span>
            <br />
            <span className="text-3xl md:text-5xl text-muted-foreground">Budućnosti</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Najmoderniji sistemi klima uređaja, bojlera i grijanja. 
            Vrhunska tehnologija za savršenu temperaturu vašeg prostora.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/proizvodi">
              <NeonButton variant="blue" size="lg" className="w-full sm:w-auto">
                Pregledaj Katalog
              </NeonButton>
            </Link>
            <Link href="/proizvodi?category=klima-uredjaji">
              <NeonButton variant="red" size="lg" className="w-full sm:w-auto">
                <Snowflake className="w-5 h-5 mr-2" />
                Klima Sistemi
              </NeonButton>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
            <GlassCard className="text-center" glow="cyan">
              <div className="text-3xl md:text-4xl font-mono font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Zadovoljnih Klijenata</div>
            </GlassCard>
            <GlassCard className="text-center" glow="cyan">
              <div className="text-3xl md:text-4xl font-mono font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground mt-1">Godina Iskustva</div>
            </GlassCard>
            <GlassCard className="text-center" glow="cyan">
              <div className="text-3xl md:text-4xl font-mono font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Podrška</div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}