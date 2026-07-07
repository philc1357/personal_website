import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./textarea.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Textarea – mehrzeiliges Textfeld (Nachricht). Optik analog zu Input aus
// textarea.module.css + Feld-Tokens (--field-*), nicht aus Tailwind.
// ─────────────────────────────────────────────────────────────────────────────
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(styles.textarea, className)} {...props} />
));
Textarea.displayName = "Textarea";

export { Textarea };
