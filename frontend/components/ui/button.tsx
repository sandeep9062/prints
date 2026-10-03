import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Every variant keeps its fill/text PAIR. A previous pass dropped the
        // `bg-*` half of each pair, which left `default` as bg-primary-foreground
        // (white) and made `ghost` fill with accent-foreground without switching
        // the text colour — i.e. invisible controls.
        default:
          "bg-primary text-primary-foreground hover:bg-brand-hover shadow-md hover:shadow-lg hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Gold is a light foil surface in BOTH themes, so the label must stay
        // dark in both: text-footer is 7.28:1 light / 8.17:1 dark, whereas
        // text-ink or text-primary-foreground would flip to light and fail.
        gold: "bg-gold text-footer hover:opacity-90 shadow-[0_8px_30px_-8px_hsl(var(--gold)/0.25)] hover:shadow-[0_12px_35px_-10px_hsl(var(--gold)/0.35)] hover:-translate-y-0.5",
        elegant:
          "bg-transparent border-2 border-primary/30 text-foreground hover:border-primary hover:bg-primary/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
