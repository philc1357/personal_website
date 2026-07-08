import type { Metadata } from "next";
import { WebentwicklungView } from "@/components/webentwicklung/webentwicklung-view";

export const metadata: Metadata = {
  title: "Webentwicklung für KMU",
  description:
    "Full-Stack-Webentwicklung für KMU — von der schlanken Firmenpräsenz bis zur individuellen Web-Anwendung mit Login, Nutzerverwaltung und Datenbank.",
};

export default function WebentwicklungPage() {
  return <WebentwicklungView />;
}
