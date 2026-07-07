import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./label.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Label – schlichtes Formular-Label. Optik (Schrift/Farbe) kommt aus
// label.module.css + Feld-Tokens (per Kontext gesetzt), nicht aus Tailwind.
// Verknüpfung mit dem Feld über `htmlFor`.
// ─────────────────────────────────────────────────────────────────────────────
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(styles.label, className)} {...props} />
));
Label.displayName = "Label";

export { Label };
