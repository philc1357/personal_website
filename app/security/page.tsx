import type { Metadata } from "next";
import { SecurityView } from "@/components/security/security-view";

export const metadata: Metadata = {
  title: "IT-Sicherheitsanalyse (Pentesting)",
  description:
    "IT-Sicherheitsanalyse / Pentesting für KMU mit Fokus auf OWASP Top 10.",
};

export default function SecurityPage() {
  return <SecurityView />;
}
