"use client";

import { cn } from "@/lib/utils";
import { DarkVeil } from "./dark-veil";
import { AnimatedGridPattern } from "./animated-grid-pattern";
import styles from "./beams-background.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// BeamsBackground – Vollbild-Hülle für den Startseiten-Hero
// Dunkle Grundfläche + animiertes Grid-Raster (hinten) + animierter WebGL-
// Hintergrund (via DarkVeil) + zentrierter Inhalt. Grid und DarkVeil laufen
// gemeinsam und geben dem Hero Tiefe; das Grid bleibt dezent, damit der Text
// lesbar bleibt. DarkVeil skaliert auf seinen absolut positionierten Container.
// ─────────────────────────────────────────────────────────────────────────────

interface BeamsBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export function BeamsBackground({
    className,
    children,
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
            {/* WebGL-Hintergrund (DarkVeil) in vollflächigem Container */}
            <div className="absolute inset-0">
                <DarkVeil />
            </div>

            {/* Grid-Raster über DarkVeil – beide animieren gemeinsam */}
            <AnimatedGridPattern maxOpacity={0.3} numSquares={48} />

            <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
                {children}
            </div>
        </div>
    );
}
