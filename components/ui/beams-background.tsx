"use client";

import { cn } from "@/lib/utils";
import { BeamsCanvas } from "./beams-canvas";
import { AnimatedGridPattern } from "./animated-grid-pattern";
import styles from "./beams-background.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// BeamsBackground – Vollbild-Hülle für den Startseiten-Hero
// Dunkle Grundfläche + animiertes Grid-Raster (hinten) + animierte Beams
// (via BeamsCanvas) + zentrierter Inhalt. Grid und Beams laufen gemeinsam und
// geben dem Hero Tiefe; das Grid bleibt dezent, damit der Text lesbar bleibt.
// Die Canvas-/Overlay-Animation lebt in BeamsCanvas, damit sie auch an anderer
// Stelle (z. B. als scroll-ausblendender Hintergrund auf /security) nutzbar ist.
// ─────────────────────────────────────────────────────────────────────────────

interface BeamsBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

export function BeamsBackground({
    className,
    children,
    intensity = "strong", // an BeamsCanvas durchgereicht – steuert die Gesamt-Deckkraft der Beams
}: BeamsBackgroundProps) {
    return (
        <div
            className={cn(
                styles.root,
                "relative min-h-screen w-full overflow-hidden",
                className
            )}
            // Dunkle Zone: aktiviert die Cursor-Effekte (components/ui/cursor-effects.tsx)
            data-cursor-dark
        >
            {/* Grid-Raster hinter den Beams – beide animieren gemeinsam */}
            <AnimatedGridPattern maxOpacity={0.3} numSquares={48} />

            <BeamsCanvas intensity={intensity} />

            <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
                {children}
            </div>
        </div>
    );
}
