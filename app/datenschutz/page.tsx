import type { Metadata } from "next";
import { DatenschutzView } from "@/components/datenschutz/datenschutz-view";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung gemäß DSGVO.",
  // Platzhalterseite – solange ohne Inhalt nicht indexieren.
  robots: { index: false, follow: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// Datenschutzerklärung – Platzhalter. Die vollständige, DSGVO-konforme Erklärung
// muss vom Betreiber noch eingesetzt werden.
// ─────────────────────────────────────────────────────────────────────────────
export default function DatenschutzPage() {
  return <DatenschutzView />;
}
