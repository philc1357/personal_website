import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./card.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Card – gemeinsame Basis-Optik für alle Karten der Website (dunkle Glasfläche
// mit Cyan-Gradient-Glow-Rand beim Hover, angelehnt an docs/card.html).
// Erzwingt keinen Innenabstand/keine Ausrichtung – das bleibt Sache der
// jeweiligen Verwendungsstelle (über `className`).
// ─────────────────────────────────────────────────────────────────────────────
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Klassen für den eigentlichen Inhalts-Wrapper (Layout wie flex/gap/padding
  // der Karteninhalte) – getrennt von `className` (Größe/Radius/Farb-Override
  // der Karte selbst), da Inhalt und Glasfläche/Glow-Ebenen unterschiedliche
  // DOM-Knoten sind.
  contentClassName?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, contentClassName, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.card, className)} {...props}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.surface} aria-hidden="true" />
        <div className={cn(styles.content, contentClassName)}>{children}</div>
      </div>
    );
  },
);
Card.displayName = "Card";

export { Card };
