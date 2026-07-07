import type { Metadata } from "next";
import { KontaktView } from "@/components/kontakt/kontakt-view";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktieren Sie mich für Webentwicklung oder IT-Sicherheitsanalyse (Pentesting) – unverbindlich und direkt.",
};

export default function KontaktPage() {
  return <KontaktView />;
}
