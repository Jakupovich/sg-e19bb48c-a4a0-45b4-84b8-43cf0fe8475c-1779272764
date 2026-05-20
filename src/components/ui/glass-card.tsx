import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "blue" | "red" | "cyan" | "none";
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  glow = "none",
  hover = false 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        glow === "blue" && "glow-blue",
        glow === "red" && "glow-red",
        glow === "cyan" && "glow-cyan",
        hover && glow === "blue" && "hover-glow-blue",
        hover && glow === "red" && "hover-glow-red",
        className
      )}
    >
      {children}
    </div>
  );
}