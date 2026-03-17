import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variants = {
      default: "bg-gradient-to-r from-primary to-yellow-600 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "hover:bg-primary/10 text-foreground hover:text-primary",
      link: "text-primary underline-offset-4 hover:underline",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      glass: "glass-panel-gold text-foreground hover:bg-white/10 hover:-translate-y-0.5"
    };

    const sizes = {
      default: "h-12 px-6 py-3",
      sm: "h-9 rounded-md px-3",
      lg: "h-14 rounded-xl px-8 text-lg font-bold",
      icon: "h-12 w-12",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// compat export: some shadcn components import buttonVariants
export function buttonVariants(options?: { variant?: ButtonProps['variant']; size?: ButtonProps['size'] }): string {
  const v = options?.variant ?? 'default';
  const s = options?.size ?? 'default';
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-primary to-yellow-600 text-primary-foreground shadow-lg shadow-primary/20",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "hover:bg-primary/10 text-foreground hover:text-primary",
    link: "text-primary underline-offset-4 hover:underline",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    glass: "glass-panel-gold text-foreground hover:bg-white/10",
  };
  const sizes: Record<string, string> = {
    default: "h-12 px-6 py-3",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-xl px-8 text-lg font-bold",
    icon: "h-12 w-12",
  };
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
    variants[v] ?? variants['default'],
    sizes[s]  ?? sizes['default'],
  );
}

export { Button };
