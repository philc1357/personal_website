"use client";

import { useEffect, useState } from "react";
import styles from "./hero-content.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// TypewriterLoop – tippt eine Phrase Zeichen für Zeichen aus, hält kurz, löscht
// sie wieder und wechselt dann zur nächsten Phrase (Endlos-Loop). Angelehnt an
// die Aceternity-Typewriter-Optik inkl. blinkendem Cursor.
//
// Hinweis (Projektregel): Die Animation läuft bewusst IMMER voll – unabhängig von
// den System-/Reduced-Motion-Einstellungen; deshalb kein prefers-reduced-motion-Gate.
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "typing" | "holding" | "deleting";

interface TypewriterLoopProps {
  words: string[];
  typeSpeed?: number; // ms pro getipptem Zeichen
  deleteSpeed?: number; // ms pro gelöschtem Zeichen
  holdDelay?: number; // ms, wie lange die volle Phrase stehen bleibt
}

export function TypewriterLoop({
  words,
  typeSpeed = 90,
  deleteSpeed = 45,
  holdDelay = 1400,
}: TypewriterLoopProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const current = words[wordIndex] ?? "";

    // Timing je nach aktueller Phase bestimmen und den nächsten Schritt planen.
    let delay = typeSpeed;
    if (phase === "holding") delay = holdDelay;
    else if (phase === "deleting") delay = deleteSpeed;

    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setPhase("holding");
      } else if (phase === "holding") {
        setPhase("deleting");
      } else {
        const next = current.slice(0, Math.max(0, text.length - 1));
        setText(next);
        if (next === "") {
          setPhase("typing");
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, holdDelay]);

  return (
    <span className={styles.typewriter} aria-live="polite">
      {text}
      <span className={styles.cursor} aria-hidden="true" />
    </span>
  );
}
