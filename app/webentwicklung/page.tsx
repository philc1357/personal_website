import type { Metadata } from "next";
import { WebentwicklungView } from "@/components/webentwicklung/webentwicklung-view";

export const metadata: Metadata = {
  title: "Webentwicklung",
  description: "Full-Stack-Webentwicklung für KMU.",
};

export default function WebentwicklungPage() {
  return <WebentwicklungView />;
}
