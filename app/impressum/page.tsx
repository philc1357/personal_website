import type { Metadata } from "next";
import { ImpressumView } from "@/components/impressum/impressum-view";

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
  return <ImpressumView />;
}
