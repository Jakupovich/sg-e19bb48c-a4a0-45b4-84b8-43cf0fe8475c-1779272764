import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "blue" | "red";
  size?: "sm" | "md" | "lg";
}

export function NeonButton({
  children,
  variant = "blue",
  size = "md",
  className,
  ...props
}: NeonButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    blue: "bg-primary hover:bg-primary/90 border-neon-blue text-primary-foreground",
    red: "bg-secondary hover:bg-secondary/90 border-neon-red text-secondary-foreground",
  };

  return (
    <button
      className={cn(
        "font-mono font-semibold rounded-lg transition-all duration-300",
        "hover:scale-105 active:scale-95",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}