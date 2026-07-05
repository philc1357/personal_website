import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────────────────────────────────────
// cn() – kombiniert bedingte Klassen (clsx) und löst Tailwind-Konflikte auf
// (tailwind-merge). Wird von allen UI-Komponenten genutzt.
// ─────────────────────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
