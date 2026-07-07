"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./animated-grid-pattern.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedGridPattern – animiertes SVG-Raster (adaptiert von Magic UI)
// Zeichnet ein feines Rasternetz über die gesamte Fläche (füllt den fixen
// Backdrop = Viewport). Zufällig verteilte Kacheln blenden auf, wieder aus und
// tauchen danach an einer neuen Position wieder auf – ein permanent wanderndes
// „Twinkle". Die Animation läuft bewusst IMMER (unabhängig von den System-
// einstellungen / prefers-reduced-motion), wie vom Nutzer gewünscht.
// Farben liegen im CSS Module (Projektregel: Tailwind = nur Layout); Tailwind
// steuert hier ausschließlich Positionierung/Größe. Mobile: weniger Kacheln.
// ─────────────────────────────────────────────────────────────────────────────

interface AnimatedGridPatternProps {
    /** Kachel-/Rasterbreite in px */
    width?: number;
    /** Kachel-/Rasterhöhe in px */
    height?: number;
    /** Versatz des Rasters (px) */
    x?: number;
    y?: number;
    /** Anzahl der aufleuchtenden Kacheln (Desktop). Mobile wird intern reduziert. */
    numSquares?: number;
    /** Maximale Deckkraft der Kacheln im Puls */
    maxOpacity?: number;
    /** Dauer eines Auf-/Ab-Blend-Zyklus (Sekunden) */
    duration?: number;
    className?: string;
}

interface Square {
    id: number;
    pos: [number, number];
}

export function AnimatedGridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    numSquares = 48,
    maxOpacity = 0.35,
    duration = 4,
    className,
}: AnimatedGridPatternProps) {
    const id = useId();
    const containerRef = useRef<SVGSVGElement>(null);
    // Aktuelle Maße der Fläche – in einer Ref, damit der onAnimationComplete-
    // Callback beim Neupositionieren einer Kachel darauf zugreifen kann, ohne
    // die Kachel-Animation neu aufzusetzen.
    const dimensionsRef = useRef({ width: 0, height: 0 });
    const [squares, setSquares] = useState<Square[]>([]);

    // ─────────────────────────────────────────────────────────────────────────
    // Geräte-Erkennung (gleiche Breakpoint-Konvention wie beams-canvas):
    // Mobile → weniger Kacheln (läuft parallel zum Beams-Canvas).
    // ─────────────────────────────────────────────────────────────────────────
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
            setIsMobile(e.matches);
        onChange(mq);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const effectiveCount = isMobile ? Math.min(numSquares, 24) : numSquares;

    // Zufällige Rasterposition (Spalte/Zeile) für die aktuell gemessene Fläche.
    const getPos = (): [number, number] => {
        const { width: w, height: h } = dimensionsRef.current;
        return [
            Math.floor((Math.random() * w) / width),
            Math.floor((Math.random() * h) / height),
        ];
    };

    // Eine einzelne Kachel neu platzieren (nach Ende ihres Blend-Zyklus).
    // setState im Callback ist erlaubt (kein Render, kein Effekt-Body); durch den
    // geänderten key remountet die Kachel und ihre Animation startet erneut.
    const updateSquarePosition = (squareId: number) => {
        setSquares((current) =>
            current.map((sq) =>
                sq.id === squareId ? { ...sq, pos: getPos() } : sq
            )
        );
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Fläche messen + Kacheln erzeugen. Die zufällige Verteilung (Math.random)
    // passiert im ResizeObserver-Callback – nicht im Render – und ist damit
    // erlaubt. Der Observer feuert beim observe() initial und bei jeder Größen-
    // änderung. Effekt hängt an effectiveCount/width/height: ändert sich die
    // Kachelzahl (z. B. Mobile-Wechsel), wird neu aufgesetzt und regeneriert.
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: w, height: h } = entry.contentRect;
                if (!w || !h) continue;
                dimensionsRef.current = { width: w, height: h };
                setSquares(
                    Array.from({ length: effectiveCount }, (_, i) => ({
                        id: i,
                        pos: getPos(),
                    }))
                );
            }
        });
        resizeObserver.observe(el);
        return () => resizeObserver.disconnect();
        // getPos liest nur aus der Ref – bewusst nicht in den Deps.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveCount, width, height]);

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                styles.grid,
                "pointer-events-none absolute inset-0 h-full w-full",
                className
            )}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeWidth={1}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
            <svg x={x} y={y} className="overflow-visible">
                {squares.map(({ pos: [sx, sy], id: squareId }, index) => (
                    <motion.rect
                        // key enthält die Position: beim Neuplatzieren remountet
                        // die Kachel → Animation startet erneut (wanderndes Twinkle).
                        key={`${sx}-${sy}-${index}`}
                        className={styles.square}
                        strokeWidth={0}
                        width={width - 1}
                        height={height - 1}
                        x={sx * width + 1}
                        y={sy * height + 1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, maxOpacity, 0] }}
                        transition={{
                            duration,
                            // pro Kachel leicht versetzt starten
                            delay: index * 0.1,
                            repeat: 1,
                            repeatType: "reverse",
                        }}
                        onAnimationComplete={() => updateSquarePosition(squareId)}
                    />
                ))}
            </svg>
        </svg>
    );
}
