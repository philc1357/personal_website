import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./input.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Input – einzeiliges Textfeld. Optik (Fläche/Rahmen/Fokus) kommt aus
// input.module.css + Feld-Tokens (--field-*, per Kontext themebar), nicht aus
// Tailwind. `aria-invalid` schaltet den Fehler-Rahmen.
// ─────────────────────────────────────────────────────────────────────────────
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input ref={ref} type={type} className={cn(styles.input, className)} {...props} />
));
Input.displayName = "Input";

export { Input };
