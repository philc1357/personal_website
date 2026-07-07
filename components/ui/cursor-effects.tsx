"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./cursor-effects.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// CursorEffects – zentrale, leicht anpassbare Cursor-Effekt-Komponente
//
// Enthält vier unabhängig schaltbare Effekte (Spotlight-Glow, Custom Cursor,
// Partikel-Trail, Card-Spotlight). Alles wird über den CURSOR_CONFIG-Block direkt
// darunter gesteuert – das ist der EINZIGE Ort, den man zum Anpassen/Ausschalten
// verändern muss. Jeder Effekt lässt sich per `aktiv: false` deaktivieren.
//
// Rahmenbedingungen (bewusst so gewählt):
//   • Nur Desktop/Maus: auf Touch-Geräten (kein Feinzeiger/Hover) rendert die
//     Komponente gar nichts.
//   • Nur dunkle Bereiche: Effekte erscheinen nur über Elementen, die (oder deren
//     Vorfahren) `data-cursor-dark` tragen (Hero/Beams). Steuerbar per Config.
//   • Reduced-Motion wird respektiert: bewegungsintensive Effekte (Trail,
//     Ring-Nachlauf) werden dann automatisch abgeschaltet.
// ─────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
// KONFIGURATION – hier alles einstellen. Zum Ausprobieren sind zunächst alle
// vier Effekte aktiv; nach Geschmack einzelne auf `aktiv: false` setzen.
// ═════════════════════════════════════════════════════════════════════════════
const CURSOR_CONFIG = {
    // Grundfarbe aller Effekte als "R, G, B" (Cyan im Ton der Beams, vgl. --sec-focus)
    farbeRGB: "56, 189, 248",
    // true = Effekte nur über [data-cursor-dark]; false = überall auf der Seite
    nurDunkleBereiche: true,

    // Effekt A – weicher Lichtschein, der der Maus folgt
    spotlight: {
        aktiv: true,
        radius: 260, // Radius des Glows in px (Elementgröße = 2 × radius)
        deckkraft: 0.14, // 0–1, wie hell der Schein maximal ist
    },

    // Effekt B – eigener Cursor: exakter Punkt + weich nachlaufender Ring
    // (deaktiviert: Standard-System-Cursor soll erhalten bleiben, siehe unten)
    customCursor: {
        aktiv: false,
        punkt: 6, // Durchmesser des Punkts (px)
        ring: 34, // Durchmesser des Rings im Ruhezustand (px)
        ringHoverFaktor: 1.7, // Ring-Vergrößerung über Links/Buttons
        nachlauf: 0.18, // 0–1: kleiner = träger/weicher, 1 = ohne Verzögerung
    },

    // Effekt C – verblassende Partikelspur entlang der Bewegung
    trail: {
        aktiv: true,
        maxPartikel: 20, // Obergrenze gleichzeitig sichtbarer Partikel
        groesse: 3, // Basisradius eines Partikels (px)
        abstand: 8, // Mindest-Mausweg (px) zwischen zwei Partikeln
        lebensdauer: 600, // Lebensdauer eines Partikels (ms)
        deckkraft: 0.5, // 0–1, Anfangs-Deckkraft eines Partikels
    },

    // Effekt D – Glow, der dem Cursor über markierten Karten folgt ([data-cursor-card])
    cardSpotlight: {
        aktiv: true,
        radius: 260, // Radius des Karten-Glows (px)
        deckkraft: 0.1, // 0–1, Stärke des Karten-Glows
    },
};

interface Particle {
    x: number;
    y: number;
    born: number; // Zeitstempel (performance.now) der Entstehung
    size: number;
}

const TAU = Math.PI * 2;

export function CursorEffects() {
    // Aktiv nur bei echtem Feinzeiger + Hover (schließt Touch/Mobile aus).
    const [active, setActive] = useState(false);
    // Reduced-Motion-Präferenz des Nutzers.
    const [reducedMotion, setReducedMotion] = useState(false);

    // DOM-Referenzen der Effekt-Layer
    const spotlightRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ─────────────────────────────────────────────────────────────────────────
    // Fähigkeits-/Präferenz-Erkennung via matchMedia (Muster wie beams-canvas).
    // Läuft nur clientseitig → SSR-sicher (vor Mount wird `active=false` → null).
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
        const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

        const syncPointer = () => setActive(pointerMq.matches);
        const syncMotion = () => setReducedMotion(motionMq.matches);
        syncPointer();
        syncMotion();

        pointerMq.addEventListener("change", syncPointer);
        motionMq.addEventListener("change", syncMotion);
        return () => {
            pointerMq.removeEventListener("change", syncPointer);
            motionMq.removeEventListener("change", syncMotion);
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Haupt-Loop: EIN gemeinsamer pointermove-Listener + EINE rAF-Schleife
    // versorgen alle Effekte. Die Maus-Position wird nur gespeichert und einmal
    // pro Frame verarbeitet (rAF-Bündelung → keine Layout-Thrash, gute Web-Vitals).
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!active) return;

        const cfg = CURSOR_CONFIG;
        const color = cfg.farbeRGB;

        const spotlight = spotlightRef.current;
        const dot = dotRef.current;
        const ring = ringRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d") ?? null;

        // Effekte, die bei Reduced-Motion pausieren:
        const trailOn = cfg.trail.aktiv && !reducedMotion;

        // ── Geteilter Zustand ─────────────────────────────────────────────────
        let pointerX = -9999;
        let pointerY = -9999;
        let hasMoved = false;
        // Ergebnis des letzten Hit-Tests (nur neu berechnet, wenn Maus sich bewegte):
        let lastHitX = Number.NaN;
        let lastHitY = Number.NaN;
        let overDark = !cfg.nurDunkleBereiche; // ohne Gating gilt „immer dunkel“
        let overInteractive = false;
        let currentCard: HTMLElement | null = null;
        // Ring-Position (läuft der Maus per Interpolation hinterher):
        let ringX = pointerX;
        let ringY = pointerY;
        let ringHoverApplied = false;
        // Trail-Partikel:
        const particles: Particle[] = [];
        let lastSpawnX = pointerX;
        let lastSpawnY = pointerY;

        // ── Canvas (Trail) einrichten – DPR gedeckelt wie beim Beams-Canvas ────
        const resizeCanvas = () => {
            if (!canvas || !ctx) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        if (trailOn) resizeCanvas();

        // ── Custom-Cursor: statische Größen/Farben einmalig setzen ─────────────
        if (cfg.customCursor.aktiv) {
            if (dot) {
                dot.style.width = `${cfg.customCursor.punkt}px`;
                dot.style.height = `${cfg.customCursor.punkt}px`;
                dot.style.background = `rgb(${color})`;
            }
            if (ring) {
                ring.style.width = `${cfg.customCursor.ring}px`;
                ring.style.height = `${cfg.customCursor.ring}px`;
                ring.style.border = `1.5px solid rgba(${color}, 0.6)`;
            }
        }

        // ── Spotlight: statische Größe/Verlauf einmalig setzen ─────────────────
        if (cfg.spotlight.aktiv && spotlight) {
            const size = cfg.spotlight.radius * 2;
            spotlight.style.width = `${size}px`;
            spotlight.style.height = `${size}px`;
            spotlight.style.background = `radial-gradient(circle, rgba(${color}, ${cfg.spotlight.deckkraft}) 0%, rgba(${color}, 0) 70%)`;
        }

        // ── Pointermove: nur Position merken (Verarbeitung im Frame) ───────────
        const onMove = (e: PointerEvent) => {
            pointerX = e.clientX;
            pointerY = e.clientY;
            hasMoved = true;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("resize", resizeCanvas);

        // ── Card-Glow von einer Karte lösen ────────────────────────────────────
        const clearCard = () => {
            if (currentCard) {
                currentCard.removeAttribute("data-cursor-active");
                currentCard = null;
            }
        };

        // ── Hit-Test: bestimmt dunkel/interaktiv/Karte unter dem Cursor ────────
        // Nur ausführen, wenn sich die Maus seit dem letzten Frame bewegt hat
        // (elementFromPoint ist ein Treffer-Test → nicht bei jedem Idle-Frame nötig).
        const updateHitState = () => {
            if (pointerX === lastHitX && pointerY === lastHitY) return;
            lastHitX = pointerX;
            lastHitY = pointerY;

            const el = document.elementFromPoint(
                pointerX,
                pointerY
            ) as HTMLElement | null;

            overDark = cfg.nurDunkleBereiche
                ? !!el?.closest("[data-cursor-dark]")
                : true;
            overInteractive = !!el?.closest("a, button, [data-cursor-hover]");

            // Card-Spotlight: zugehörige Karte finden und CSS-Variablen setzen
            if (cfg.cardSpotlight.aktiv) {
                const card =
                    overDark && el
                        ? (el.closest("[data-cursor-card]") as HTMLElement | null)
                        : null;
                if (card !== currentCard) {
                    clearCard();
                    currentCard = card;
                    if (card) {
                        card.style.setProperty(
                            "--cursor-color",
                            cfg.farbeRGB
                        );
                        card.style.setProperty(
                            "--cursor-card-radius",
                            `${cfg.cardSpotlight.radius}px`
                        );
                        card.style.setProperty(
                            "--cursor-card-alpha",
                            `${cfg.cardSpotlight.deckkraft}`
                        );
                        card.setAttribute("data-cursor-active", "");
                    }
                }
                if (currentCard) {
                    const r = currentCard.getBoundingClientRect();
                    currentCard.style.setProperty(
                        "--spot-x",
                        `${pointerX - r.left}px`
                    );
                    currentCard.style.setProperty(
                        "--spot-y",
                        `${pointerY - r.top}px`
                    );
                }
            }
        };

        // ── rAF-Schleife: verarbeitet Position einmal pro Frame für alle Effekte ─
        let raf = 0;
        const frame = (now: number) => {
            if (hasMoved) updateHitState();

            // Effekt A – Spotlight
            if (cfg.spotlight.aktiv && spotlight) {
                spotlight.style.transform = `translate3d(${
                    pointerX - cfg.spotlight.radius
                }px, ${pointerY - cfg.spotlight.radius}px, 0)`;
                spotlight.style.opacity = overDark ? "1" : "0";
            }

            // Effekt B – Custom Cursor (Punkt exakt, Ring interpoliert)
            if (cfg.customCursor.aktiv) {
                // Ring: bei Reduced-Motion ohne Nachlauf (sofort an der Maus)
                const ease = reducedMotion ? 1 : cfg.customCursor.nachlauf;
                ringX += (pointerX - ringX) * ease;
                ringY += (pointerY - ringY) * ease;
                if (dot) {
                    dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
                    dot.style.opacity = overDark ? "1" : "0";
                }
                if (ring) {
                    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
                    ring.style.opacity = overDark ? "1" : "0";
                    // Hover-Vergrößerung nur bei Zustandswechsel schreiben (kein Thrash)
                    if (overInteractive !== ringHoverApplied) {
                        ringHoverApplied = overInteractive;
                        const base = cfg.customCursor.ring;
                        const d = overInteractive
                            ? base * cfg.customCursor.ringHoverFaktor
                            : base;
                        ring.style.width = `${d}px`;
                        ring.style.height = `${d}px`;
                        ring.style.borderColor = overInteractive
                            ? `rgba(${color}, 0.9)`
                            : `rgba(${color}, 0.6)`;
                    }
                }
                // System-Cursor nur in dunklen Zonen ausblenden (sonst normal sichtbar)
                document.documentElement.classList.toggle(
                    "cursor-hidden",
                    overDark
                );
            }

            // Effekt C – Partikel-Trail
            if (trailOn && ctx && canvas) {
                // Neuen Partikel setzen, wenn genug Weg zurückgelegt wurde
                if (overDark && hasMoved) {
                    const dx = pointerX - lastSpawnX;
                    const dy = pointerY - lastSpawnY;
                    if (dx * dx + dy * dy >= cfg.trail.abstand * cfg.trail.abstand) {
                        lastSpawnX = pointerX;
                        lastSpawnY = pointerY;
                        if (particles.length >= cfg.trail.maxPartikel) particles.shift();
                        particles.push({
                            x: pointerX,
                            y: pointerY,
                            born: now,
                            size: cfg.trail.groesse * (0.7 + Math.random() * 0.6),
                        });
                    }
                }
                // Canvas leeren und lebende Partikel additiv zeichnen
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "lighter";
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    const age = now - p.born;
                    if (age >= cfg.trail.lebensdauer) {
                        particles.splice(i, 1);
                        continue;
                    }
                    const t = 1 - age / cfg.trail.lebensdauer; // 1 → 0
                    const radius = Math.max(p.size * t, 0.01);
                    const alpha = t * cfg.trail.deckkraft;
                    const g = ctx.createRadialGradient(
                        p.x,
                        p.y,
                        0,
                        p.x,
                        p.y,
                        radius
                    );
                    g.addColorStop(0, `rgba(${color}, ${alpha})`);
                    g.addColorStop(1, `rgba(${color}, 0)`);
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, radius, 0, TAU);
                    ctx.fill();
                }
                ctx.globalCompositeOperation = "source-over";
            }

            hasMoved = false;
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        // ── Aufräumen: Listener, rAF, globaler Cursor-State, Card-Glow ─────────
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(raf);
            document.documentElement.classList.remove("cursor-hidden");
            clearCard();
        };
    }, [active, reducedMotion]);

    // Auf Touch/ohne Feinzeiger nichts rendern (kein sinnvoller Cursor-Effekt).
    if (!active) return null;

    const cfg = CURSOR_CONFIG;
    return (
        <>
            {cfg.spotlight.aktiv && (
                <div ref={spotlightRef} className={styles.spotlight} aria-hidden="true" />
            )}
            {cfg.trail.aktiv && (
                <canvas ref={canvasRef} className={styles.trailCanvas} aria-hidden="true" />
            )}
            {cfg.customCursor.aktiv && (
                <>
                    <div ref={ringRef} className={styles.cursorRing} aria-hidden="true" />
                    <div ref={dotRef} className={styles.cursorDot} aria-hidden="true" />
                </>
            )}
        </>
    );
}
