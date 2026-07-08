import type { Metadata } from "next";
import { ReferenzenView } from "@/components/referenzen/referenzen-view";

export const metadata: Metadata = {
  title: "Referenzen (Pentesting)",
  description:
    "Anonymisierte Einblicke in typische Schwachstellen aus bisherigen Pentest-Engagements.",
};

export default function ReferenzenPage() {
  return <ReferenzenView />;
}
