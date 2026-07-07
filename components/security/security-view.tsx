"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { BeamsCanvas } from "@/components/ui/beams-canvas";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { SecurityFacts } from "./security-facts";
import styles from "./security.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// SecurityView – Scroll-Inszenierung der /security-Seite
// Aufbau (drei Ebenen):
//   1. Fixer Hintergrund (schwarz). Darauf liegen zwei überblendende Layer:
//      animierte Beams (blenden beim Scrollen AUS) und ein animiertes Grid-
//      Pattern (blendet beim Scrollen EIN). Crossfade: Hero = Beams,
//      Fakten-Bereich = Grid – so bleibt kein reines Schwarz übrig.
//   2. 100vh-Hero mit Einstiegstext (ohne Buttons), der beim Scrollen sanft
//      nach oben wandert und ausblendet.
//   3. Fakten-Sektionen (Überblick aus sicherheitspunkte.php).
// ─────────────────────────────────────────────────────────────────────────────

export function SecurityView() {
    const heroRef = useRef<HTMLElement>(null);

    // Fortschritt 0 → 1, während der Hero aus dem Viewport scrollt
    // (viewport-unabhängig durch offset relativ zur Hero-Section).
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // Hintergrund-Crossfade: Grid ist von Anfang an sichtbar (wie im Hero auf
    // app/page.tsx), die Beams blenden beim Scrollen aus.
    const beamsOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    // Text-Fade: etwas schneller ausblenden + leicht nach oben bewegen.
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

    return (
        // Dunkle Zone (ganze Seite): aktiviert die Cursor-Effekte
        <div className={styles.view} data-cursor-dark>
            {/* 1) Fixer Hintergrund: schwarze Fläche bleibt; Grid & Beams überblenden */}
            <div className={styles.fixedBackdrop} aria-hidden="true">
                {/* Grid-Ebene: durchgehend sichtbar (liegt hinter den Beams) */}
                <div className="absolute inset-0">
                    <AnimatedGridPattern maxOpacity={0.35} numSquares={48} />
                </div>
                {/* Beams-Ebene: blendet beim Scrollen aus */}
                <motion.div
                    className="absolute inset-0"
                    style={{ opacity: beamsOpacity }}
                >
                    <BeamsCanvas intensity="strong" />
                </motion.div>
            </div>

            {/* 2) Hero: 100vh, zentriert, ohne Buttons */}
            <section
                ref={heroRef}
                className={cn(
                    styles.hero,
                    "relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4"
                )}
            >
                <motion.div
                    className={styles.heroInner}
                    style={{ opacity: textOpacity, y: textY }}
                >
                    <h1 className={styles.heroHeading}>IT-Sicherheit für Ihr Unternehmen</h1>
                    <p className={styles.heroSubheading}>
                        Als Pentester prüfe ich Ihre Website auf die häufigsten
                        Schwachstellen — mit Fokus auf die OWASP&nbsp;Top&nbsp;10. Ein Überblick,
                        warum das zählt.
                    </p>
                    <div className={styles.scrollHint} aria-hidden="true">
                        <span>Mehr erfahren</span>
                        <ChevronDown className={styles.scrollHintIcon} />
                    </div>
                </motion.div>
            </section>

            {/* 3) Fakten-Überblick auf reinem Schwarz */}
            <div className="relative z-10">
                <SecurityFacts />
            </div>
        </div>
    );
}
