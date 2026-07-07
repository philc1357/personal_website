import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum gemäß § 5 DDG.",
  // Platzhalterseite – solange ohne Inhalt nicht indexieren.
  robots: { index: false, follow: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// Impressum – Platzhalter. Die gesetzlich vorgeschriebenen Angaben (§ 5 DDG)
// müssen vom Betreiber noch eingesetzt werden.
// ─────────────────────────────────────────────────────────────────────────────
export default function ImpressumPage() {
  return (
    <main>
      <h1>Impressum</h1>
      <p>Inhalt in Vorbereitung.</p>
    </main>
  );
}
