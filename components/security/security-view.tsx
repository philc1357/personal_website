"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { BeamsCanvas } from "@/components/ui/beams-canvas";
import { cn } from "@/lib/utils";
import { SecurityFacts } from "./security-facts";
import styles from "./security.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// SecurityView – Scroll-Inszenierung der /security-Seite
// Aufbau (drei Ebenen):
//   1. Fixer Hintergrund (schwarz + animierte Beams). Die Beams werden beim
//      Scrollen gleichmäßig ausgeblendet, bis reines Schwarz übrig bleibt.
//   2. 100vh-Hero mit Einstiegstext (ohne Buttons), der beim Scrollen sanft
//      nach oben wandert und ausblendet.
//   3. Fakten-Sektionen (Überblick aus sicherheitspunkte.php).
// Barrierefreiheit: Bei prefers-reduced-motion werden alle scroll-gekoppelten
// Transforms deaktiviert (Repo-Konvention, vgl. site-header.tsx).
// ─────────────────────────────────────────────────────────────────────────────

export function SecurityView() {
    const prefersReducedMotion = useReducedMotion();
    const heroRef = useRef<HTMLElement>(null);

    // Erst nach dem Mount auf reduced-motion umschalten. Beim ersten Render
    // (Server + Client-Hydration) sind die Motion-Styles immer aktiv – sonst
    // weicht das serverseitige HTML vom Client ab (Hydration-Mismatch), weil
    // useReducedMotion() auf dem Server null, auf dem Client aber sofort true
    // liefern kann.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const disableMotion = mounted && prefersReducedMotion;

    // Fortschritt 0 → 1, während der Hero aus dem Viewport scrollt
    // (viewport-unabhängig durch offset relativ zur Hero-Section).
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // Hintergrund-Fade: Beams voll sichtbar → komplett transparent (reines Schwarz).
    const beamsOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    // Text-Fade: etwas schneller ausblenden + leicht nach oben bewegen.
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

    return (
        <div className={styles.view}>
            {/* 1) Fixer Hintergrund: schwarze Fläche bleibt, nur die Beams faden aus */}
            <div className={styles.fixedBackdrop} aria-hidden="true">
                <motion.div
                    className="absolute inset-0"
                    style={disableMotion ? undefined : { opacity: beamsOpacity }}
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
                    style={
                        disableMotion
                            ? undefined
                            : { opacity: textOpacity, y: textY }
                    }
                >
                    <h1 className={styles.heroHeading}>IT-Sicherheit für Ihr Unternehmen</h1>
                    <p className={styles.heroSubheading}>
                        Als Junior-Pentester prüfe ich Ihre Website auf die häufigsten
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
