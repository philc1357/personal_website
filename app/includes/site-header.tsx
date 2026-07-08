"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Code2,
  FileText,
  Home,
  Lock,
  Mail,
  Menu,
  Scale,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import styles from "./site-header.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Site-Header – global (in app/layout.tsx eingebunden), komplett transparent,
// mit einem einzigen Element oben rechts: einem animierten Gooey-Menü.
//
// Funktionsweise:
//  - Ein runder Toggle-Button öffnet/schließt das Menü (State `isOpen`).
//  - Beim Öffnen fahren die Menüpunkte als Kette runder Icon-Buttons nach unten
//    aus; ein SVG-Goo-Filter (GooeyFilter) lässt sie beim Übergang "verschmelzen".
//  - Interne Ziele nutzen next/link, der Kontakt-Punkt einen mailto:-Link.
//  - Barrierefreiheit: aria-label pro Punkt, aria-expanded am Toggle, Schließen
//    per Escape und nach Klick auf einen Punkt.
// ─────────────────────────────────────────────────────────────────────────────

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  external?: boolean; // true = kein next/link (z. B. mailto:)
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Webentwicklung", icon: Code2, href: "/webentwicklung" },
  { label: "IT-Sicherheitsanalyse", icon: ShieldCheck, href: "/security" },
  { label: "Referenzen", icon: FileText, href: "/referenzen" },
  { label: "Kontakt", icon: Mail, href: "/kontakt" },
  { label: "Impressum", icon: Scale, href: "/impressum" },
  { label: "Datenschutz", icon: Lock, href: "/datenschutz" },
];

// Vertikaler Abstand zwischen den ausgefahrenen Kreisen (px).
const ITEM_SPACING = 56;

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Menü schließen bei Escape oder Klick außerhalb des Menüs.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <nav ref={navRef} className={styles.menu} aria-label="Hauptnavigation">
        {/* Ausfahrende Menüpunkte */}
        <AnimatePresence>
          {isOpen &&
            MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              // Menü fährt nach links aus -> negativer X-Versatz. Reihenfolge
              // gespiegelt: erstes Item (Home) ganz links, letztes neben dem Toggle.
              const x = -((MENU_ITEMS.length - index) * ITEM_SPACING);
              const linkProps = {
                className: cn(styles.circle),
                "aria-label": item.label,
                title: item.label,
                onClick: () => setIsOpen(false),
              };

              return (
                <motion.div
                  key={item.label}
                  className={styles.item}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x, opacity: 1 }}
                  exit={{
                    x: 0,
                    opacity: 0,
                    transition: {
                      delay: (MENU_ITEMS.length - index) * 0.05,
                      duration: 0.4,
                      type: "spring",
                      bounce: 0,
                    },
                  }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    type: "spring",
                    bounce: 0,
                  }}
                >
                  {item.external ? (
                    <a href={item.href} {...linkProps}>
                      <Icon className={styles.icon} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={item.href} {...linkProps}>
                      <Icon className={styles.icon} aria-hidden="true" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Toggle-Button */}
        <button
          type="button"
          className={cn(styles.circle, styles.toggle)}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.2 }}
              >
                <X className={styles.icon} aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.2 }}
              >
                <Menu className={styles.icon} aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>
    </header>
  );
}
