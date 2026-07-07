"use client";

import { cn } from "@/lib/utils";
import { BeamsCanvas } from "./beams-canvas";
import styles from "./beams-background.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// BeamsBackground – Vollbild-Hülle für den Startseiten-Hero
// Dunkle Grundfläche + animierte Beams (via BeamsCanvas) + zentrierter Inhalt.
// Die eigentliche Canvas-/Overlay-Animation lebt in BeamsCanvas, damit sie auch
// an anderer Stelle (z. B. als scroll-ausblendender Hintergrund) genutzt werden
// kann. Das gerenderte Erscheinungsbild bleibt identisch zur bisherigen Version.
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
        >
            <BeamsCanvas intensity={intensity} />

            <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
                {children}
            </div>
        </div>
    );
}
