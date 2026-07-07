import type { Metadata } from "next";
import { Michroma, Karla, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "./includes/site-header";
import { CursorEffects } from "@/components/ui/cursor-effects";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Schriften via next/font – werden zur Build-Zeit heruntergeladen und lokal
// self-hosted ausgeliefert (kein externer Runtime-Call -> DSGVO-konform).
// Drei Rollen: Michroma für Headings (technisch/futuristisch), Karla für
// Fließtext (gut lesbar), JetBrains Mono für Code/Labels/Badges.
// Michroma gibt es nur in Schriftschnitt 400 (kein Bold/Italic).
// ─────────────────────────────────────────────────────────────────────────────
const heading = Michroma({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-heading-fallback",
});

const body = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans-fallback",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono-fallback",
});

export const metadata: Metadata = {
  title: "Personal Website",
  description:
    "Full-Stack-Webentwicklung für KMU und Junior-Pentesting (OWASP Top 10).",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${heading.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
        {/* Globale Cursor-Effekte (nur Desktop/Maus, nur über dunklen Bereichen).
            Anpassung über den CURSOR_CONFIG-Block in cursor-effects.tsx.
            Temporär deaktiviert – einfach wieder einkommentieren zum Reaktivieren. */}
        {/* <CursorEffects /> */}
      </body>
    </html>
  );
}
