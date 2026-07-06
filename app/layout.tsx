import type { Metadata } from "next";
import { Michroma } from "next/font/google";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Schriften via next/font – werden zur Build-Zeit heruntergeladen und lokal
// self-hosted ausgeliefert (kein externer Runtime-Call -> DSGVO-konform).
// Michroma gibt es nur in Schriftschnitt 400 (kein Bold/Italic).
// ─────────────────────────────────────────────────────────────────────────────
const font = Michroma({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-sans-fallback",
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
    <html lang="de" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
