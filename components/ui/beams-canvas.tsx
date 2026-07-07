"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./beams-background.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// BeamsCanvas – die reinen Animations-Layer (Canvas + pulsierende Overlay)
// Wiederverwendbare Präsentations-Komponente, extrahiert aus BeamsBackground.
// Rendert die beiden absolut positionierten Layer OHNE min-h-screen-Root und
// OHNE Children-Zentrierung – so lässt sie sich sowohl im Startseiten-Hero als
// auch als fixer, beim Scrollen ausblendender Hintergrund (/security) einsetzen.
// ─────────────────────────────────────────────────────────────────────────────

interface BeamsCanvasProps {
    className?: string;
    intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
    const angle = -35 + Math.random() * 10; // Neigung der Streifen in Grad
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60, // Dicke des einzelnen Streifens (px)
        length: height * 2.5, // Länge des Streifens
        angle: angle,
        speed: 0.6 + Math.random() * 1.2, // Aufstiegsgeschwindigkeit pro Frame
        opacity: 0.12 + Math.random() * 0.16, // Grund-Deckkraft
        // Farbton (HSL-Farbkreis, 0–360): 190 = Start, +70 = Spannweite nach oben
        // → aktuell Cyan/Blau/Violett (190–260). 0=Rot, 60=Gelb, 120=Grün, 240=Blau.
        // Zum Ändern: Startwert + Spannweite anpassen, z. B. 20 + Math.random() * 30 für Orange.
        hue: 210 + Math.random() * 70,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03, // Geschwindigkeit des Pulsierens (Deckkraft-Flackern)
    };
}

export function BeamsCanvas({
    className,
    intensity = "strong", // "subtle" | "medium" | "strong" – steuert die Gesamt-Deckkraft aller Beams, siehe opacityMap unten
}: BeamsCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);

    // ─────────────────────────────────────────────────────────────────────────
    // Breakpoint-Erkennung (< 768px = Handy)
    // Single Source of Truth für die Mobil-Anpassungen: steuert sowohl die
    // Canvas-Animation (Positionierung/Anzahl/Blur) als auch die Inline-Blur-
    // Werte im JSX. Auf dem Desktop (≥ 768px) bleibt alles wie bisher.
    // ─────────────────────────────────────────────────────────────────────────
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(max-width: 767px)").matches;
    });

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Canvas-Animation: Beams zeichnen & pro Frame nach oben bewegen.
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const MINIMUM_BEAMS = 20; // Basis-Anzahl der Streifen (tatsächlich genutzt: MINIMUM_BEAMS * 1.5, siehe unten)
        // Deckkraft-Multiplikator je intensity-Stufe (Prop oben) – höher = sichtbarer/kräftiger
        const opacityMap = {
            subtle: 0.7,
            medium: 0.85,
            strong: 1,
        };

        // ─────────────────────────────────────────────────────────────────────
        // Konfiguration je nach Gerät.
        // Desktop: exakt die bisherigen Werte (Positionierung in Geräte-Pixeln,
        //          30 Beams, 3 Spalten, Blur 35px) → Look unverändert.
        // Mobil:   Positionierung in CSS-Pixeln (behebt den dpr-Fehler, der die
        //          Beams sonst aus dem Bild schiebt) + weniger/klarere Streifen.
        // logicalW/logicalH sind die Maße, in denen die Beams platziert werden.
        // ─────────────────────────────────────────────────────────────────────
        let config = {
            logicalW: 0,
            logicalH: 0,
            beamCount: 0,
            columns: 3,
            canvasBlur: 35,
        };

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            config = isMobile
                ? {
                      logicalW: window.innerWidth,
                      logicalH: window.innerHeight,
                      beamCount: 12,
                      columns: 2,
                      canvasBlur: 18,
                  }
                : {
                      logicalW: canvas.width,
                      logicalH: canvas.height,
                      beamCount: MINIMUM_BEAMS * 1.5,
                      columns: 3,
                      canvasBlur: 35,
                  };

            beamsRef.current = Array.from({ length: config.beamCount }, () =>
                createBeam(config.logicalW, config.logicalH)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            if (!canvas) return beam;

            const column = index % config.columns;
            const spacing = config.logicalW / config.columns;

            beam.y = config.logicalH + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = 190 + (index * 70) / totalBeams; // gleicher Farbbereich wie in createBeam() oben
            beam.opacity = 0.2 + Math.random() * 0.1;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            // Pulsierende Deckkraft berechnen
            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            // Verlauf mit mehreren Farbstopps: hsla(hue, sättigung%, helligkeit%, deckkraft)
            // 85% Sättigung, 65% Helligkeit – für kräftigere/blassere Farben diese Werte ändern
            gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
            gradient.addColorStop(
                0.1,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(
                0.4,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.6,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.9,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate() {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = `blur(${config.canvasBlur}px)`;

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                // Beam zurücksetzen, wenn er den Bildschirm verlässt
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity, isMobile]);

    return (
        <div className={cn("absolute inset-0", className)}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ filter: isMobile ? "blur(8px)" : "blur(15px)" }}
            />

            <motion.div
                className={cn(styles.overlay, "absolute inset-0")}
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                    backdropFilter: isMobile ? "blur(30px)" : "blur(50px)",
                }}
            />
        </div>
    );
}
