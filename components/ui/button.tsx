import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./button.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Button – Struktur/Varianten via cva, Optik (Farben/Radius/Schatten) kommt aus
// button.module.css + Design-Tokens (app/globals.css), nicht aus Tailwind.
// ─────────────────────────────────────────────────────────────────────────────
const buttonVariants = cva(
  cn(
    styles.base,
    "inline-flex items-center justify-center whitespace-nowrap gap-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: styles.variantDefault,
        outline: styles.variantOutline,
      },
      size: {
        default: styles.sizeDefault,
        lg: styles.sizeLg,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
