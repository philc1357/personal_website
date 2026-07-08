"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { DarkVeil } from "@/components/ui/dark-veil";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { WebentwicklungFacts } from "./webentwicklung-facts";
import styles from "./webentwicklung.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// WebentwicklungView – Scroll-Inszenierung der /webentwicklung-Seite
// Aufbau (drei Ebenen, analog zur Schwesterseite /security):
//   1. Fixer Hintergrund (schwarz). Darauf zwei überblendende Layer: animierte
//      DarkVeil-Beams (blenden beim Scrollen AUS) und ein animiertes Grid-
//      Pattern (bleibt dezent sichtbar). Crossfade: Hero = Beams, Content =
//      Grid – so bleibt kein reines Schwarz übrig.
//   2. 100vh-Hero mit Einstiegstext (ohne Buttons), der beim Scrollen sanft
//      nach oben wandert und ausblendet.
//   3. Content-Sektionen (Leistungen, Tech-Stack, CTA …).
// ─────────────────────────────────────────────────────────────────────────────
export function WebentwicklungView() {
  const heroRef = useRef<HTMLElement>(null);

  // Fortschritt 0 → 1, während der Hero aus dem Viewport scrollt
  // (viewport-unabhängig durch offset relativ zur Hero-Section).
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hintergrund-Crossfade: Beams blenden beim Scrollen aus, Grid bleibt dezent.
  const beamsOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);
  // Text-Fade: etwas schneller ausblenden + leicht nach oben bewegen.
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    // Dunkle Zone (ganze Seite): aktiviert die Cursor-Effekte
    <div className={styles.view} data-cursor-dark>
      {/* 1) Fixer Hintergrund: schwarze Fläche; Beams & Grid überblenden */}
      <div className={styles.fixedBackdrop} aria-hidden="true">
        {/* DarkVeil-Ebene: blendet beim Scrollen aus */}
        <motion.div className="absolute inset-0" style={{ opacity: beamsOpacity }}>
          <DarkVeil hueShift={35} />
        </motion.div>
        {/* Grid-Ebene: liegt über den Beams, damit sie im Hero direkt sichtbar
            ist; wird beim Scrollen gleichmäßig transparenter und bleibt danach
            konstant dezent hinter dem Content. */}
        <motion.div className="absolute inset-0" style={{ opacity: gridOpacity }}>
          <AnimatedGridPattern maxOpacity={0.35} numSquares={48} />
        </motion.div>
      </div>

      {/* 2) Hero: 100vh, zentriert, ohne Buttons */}
      <section
        ref={heroRef}
        className={cn(
          styles.hero,
          "relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4",
        )}
      >
        <motion.div
          className={styles.heroInner}
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className={styles.heroHeading}>
            Web-Entwicklung, die zu Ihrem Unternehmen passt
          </h1>
          <p className={styles.heroSubheading}>
            Von der schlanken, repräsentativen Firmenpräsenz bis zur individuellen
            Web-Anwendung mit Login, Nutzerverwaltung und Datenbank — passgenau für
            das, was Ihr Unternehmen wirklich braucht.
          </p>
          <div className={styles.scrollHint} aria-hidden="true">
            <span>Mehr erfahren</span>
            <ChevronDown className={styles.scrollHintIcon} />
          </div>
        </motion.div>
      </section>

      {/* 3) Content-Sektionen auf reinem Schwarz */}
      <div className="relative z-10">
        <WebentwicklungFacts />
      </div>
    </div>
  );
}
