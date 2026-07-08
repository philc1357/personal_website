"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { DarkVeil } from "@/components/ui/dark-veil";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { ReferenzenContent } from "./referenzen-content";
import styles from "./referenzen.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// ReferenzenView – Übersicht anonymisierter Pentest-Erfahrung.
// Statischer Hero + Karten-Sektion (kein Scroll-Storytelling wie /security,
// da hier die Inhalte selbst im Vordergrund stehen). Hintergrund wie auf
// /security: DarkVeil im Hero blendet beim Scrollen aus (transparent), das
// animierte Grid bleibt dezent über die gesamte Seite sichtbar.
// ─────────────────────────────────────────────────────────────────────────────

export function ReferenzenView() {
    const heroRef = useRef<HTMLElement>(null);

    // Fortschritt 0 → 1, während der Hero aus dem Viewport scrollt.
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const veilOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    // Grid wird beim Scrollen (wie auf /security) gleichmäßig transparenter.
    const gridOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

    return (
        <div className={styles.view} data-cursor-dark>
            <div className={styles.fixedBackdrop} aria-hidden="true">
                <motion.div className="absolute inset-0" style={{ opacity: veilOpacity }}>
                    <DarkVeil hueShift={35} />
                </motion.div>
                <motion.div className="absolute inset-0" style={{ opacity: gridOpacity }}>
                    <AnimatedGridPattern maxOpacity={0.35} numSquares={48} />
                </motion.div>
            </div>

            <section
                ref={heroRef}
                className={`${styles.hero} relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4`}
            >
                <div className={styles.heroInner}>
                    <h1 className={styles.heroHeading}>Referenzen aus der Praxis</h1>
                    <p className={styles.heroSubheading}>
                        Ein anonymisierter Einblick in wiederkehrende Schwachstellen aus
                        bisherigen Sicherheitsprüfungen — ohne Bezug zu konkreten Kunden.
                    </p>
                    <div className={styles.scrollHint} aria-hidden="true">
                        <span>Mehr erfahren</span>
                        <ChevronDown className={styles.scrollHintIcon} />
                    </div>
                </div>
            </section>
            <div className="relative z-10">
                <ReferenzenContent />
            </div>
        </div>
    );
}
