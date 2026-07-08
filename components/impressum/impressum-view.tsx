"use client";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import styles from "./impressum.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// ImpressumView – Platzhalter-Inhalt auf demselben animierten Grid-Hintergrund
// wie die Kontakt-Seite (zwei Ebenen):
//   1. Fixer, dunkler Hintergrund mit animiertem Grid-Pattern (zum Zentrum hin
//      per Maske ausgeblendet, damit die Karte im Fokus bleibt).
//   2. Zentrierte Karte (min. 100vh) mit Überschrift + Text.
// ─────────────────────────────────────────────────────────────────────────────
export function ImpressumView() {
  return (
    <div className={styles.view} data-cursor-dark>
      {/* 1) Fixer Hintergrund mit animiertem Grid */}
      <div className={styles.fixedBackdrop} aria-hidden="true">
        <div className={styles.gridMask}>
          <AnimatedGridPattern maxOpacity={0.35} numSquares={48} />
        </div>
      </div>

      {/* 2) Zentrierte Karte */}
      <main className={`${styles.main} relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-24`}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Impressum</h1>
          <p className={styles.lead}>Inhalt in Vorbereitung.</p>
        </div>
      </main>
    </div>
  );
}
