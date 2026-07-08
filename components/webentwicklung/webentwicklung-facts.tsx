import Link from "next/link";
import { Globe, Database, Gauge, Sparkles } from "lucide-react";
import {
  SiPhp,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTailwindcss,
  SiLaravel,
  SiReact,
} from "react-icons/si";
import { Card } from "@/components/ui/card";
import styles from "./webentwicklung.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Inhaltsdaten der /webentwicklung-Seite.
// Bewusst qualitativ statt mit unbelegten Zahlen: anders als das mit Quellen
// belegte Stat-Band auf /security liegt hier keine zitierfähige Quelle vor.
// Sicherheit wird nur beiläufig (in einer Leistungskarte) erwähnt – Cross-Sell
// erfolgt über /security.
// ─────────────────────────────────────────────────────────────────────────────

// Warum eine eigene Online-Präsenz? – qualitative Argumente, keine Kennzahlen.
const reasons = [
  {
    title: "Erreichbarkeit rund um die Uhr",
    text: "Ihre Website arbeitet auch dann, wenn das Geschäft geschlossen ist — Informationen und Kontaktwege stehen jederzeit bereit.",
  },
  {
    title: "Unabhängigkeit",
    text: "Eine eigene Plattform statt reiner Abhängigkeit von Social Media oder Verzeichnisdiensten — Sie behalten die Kontrolle über Auftritt und Inhalte.",
  },
  {
    title: "Vertrauen & Professionalität",
    text: "Oft der erste Eindruck, den potenzielle Kunden von Ihrem Unternehmen bekommen. Ein durchdachter Auftritt schafft Vertrauen.",
  },
  {
    title: "Neue Reichweite",
    text: "Sichtbarkeit über lokale Suche und SEO hinaus — ein planbarer Kontaktkanal, der neue Zielgruppen erschließt.",
  },
];

// Kern-Sektion: Leistungsspektrum. Jede Karte mit lucide-Icon als visuellem
// Anker. Der Sicherheitshinweis steht bewusst nur beiläufig im Text der zweiten
// Karte – kein eigener Abschnitt, kein Badge.
const services = [
  {
    icon: Globe,
    title: "Unternehmens-Websites",
    desc: "Statische, repräsentative Seiten zur Firmenpräsentation — Leistungen, Kontakt, Impressum. Schnell, wartungsarm und klar strukturiert.",
  },
  {
    icon: Database,
    title: "Web-Anwendungen mit Login & Datenbank",
    desc: "Individuelle Systeme mit Nutzerverwaltung, Datenbankanbindung und Datei-Uploads — etwa Kundenportale oder interne Tools, inklusive grundlegender Absicherung nach Best Practices.",
  },
  {
    icon: Gauge,
    title: "Performance-optimierte Websites",
    desc: "Fokus auf Ladezeit und Core Web Vitals: schlanke Umsetzung, wenn Geschwindigkeit im Vordergrund steht.",
  },
  {
    icon: Sparkles,
    title: "Interaktive & effektreiche Websites",
    desc: "Moderne UI, Animationen und aufwendigere Interaktion, wenn der „Wow-Effekt“ gewünscht ist.",
  },
];

// Tech-Stack als flache Badge-Reihe, ohne Kategorisierung.
// Logos in offiziellen Markenfarben (nominativer Fair Use zur reinen
// Technologie-Kennzeichnung), Icons aus react-icons/si, lokal gebündelt.
const techStack = [
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "HTML", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", icon: SiCss, color: "#1572B6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
];

export function WebentwicklungFacts() {
  return (
    <div className={styles.facts}>
      {/* ===================================================================
          Warum eine eigene Website? – qualitatives Karten-Grid.
      ==================================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Warum eine eigene Online-Präsenz?
          </h2>
          <p className={styles.sectionLead}>
            Eine durchdachte Website ist mehr als eine digitale Visitenkarte — sie
            arbeitet für Ihr Unternehmen, rund um die Uhr.
          </p>
          <div className={styles.reasonGrid}>
            {reasons.map((r) => (
              <Card key={r.title} contentClassName={styles.reasonCard} data-cursor-card>
                <h3 className={styles.reasonTitle}>{r.title}</h3>
                <p className={styles.reasonText}>{r.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          Leistungen (Kern-Sektion) – Card-Grid mit Icons.
      ==================================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Meine Leistungen</h2>
          <p className={styles.sectionLead}>
            Vom schlanken Firmenauftritt bis zur individuellen Web-Anwendung — je
            nach Ziel performance-optimiert oder bewusst effektreich und interaktiv.
          </p>
          <div className={styles.serviceGrid}>
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} contentClassName={styles.serviceCard} data-cursor-card>
                  <span className={styles.serviceIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3 className={styles.serviceTitle}>{s.title}</h3>
                    <p className={styles.serviceDesc}>{s.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          Tech-Stack – flache Badge-Reihe.
      ==================================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Mein Tech-Stack</h2>
          <p className={styles.sectionLead}>
            Die Technologien, mit denen ich arbeite — je nach Projekt einzeln oder
            kombiniert.
          </p>
          <ul className={styles.techList}>
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <li key={tech.name} className={styles.techBadge}>
                  <Icon
                    className={styles.techIcon}
                    style={{ color: tech.color }}
                    aria-hidden="true"
                  />
                  {tech.name}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ===================================================================
          Referenzen – Platzhalter. Struktur so vorbereitet, dass später echte,
          anonymisierte Projektbeispiele ergänzt werden können (analog
          /referenzen), ohne das Layout neu zu bauen.
      ==================================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Referenzen</h2>
          <p className={styles.sectionLead}>
            Ausgewählte Projektbeispiele folgen in Kürze — anonymisiert und
            exemplarisch aufbereitet.
          </p>
          <Card contentClassName={styles.placeholderCard} data-cursor-card>
            <p className={styles.placeholderText}>Projekte folgen in Kürze.</p>
          </Card>
        </div>
      </section>

      {/* ===================================================================
          Abschluss / CTA – führt auf die Kontakt-Seite (/kontakt).
      ==================================================================== */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Sie haben eine Idee für eine Website oder Anwendung?
          </h2>
          <p className={styles.ctaText}>
            Lassen Sie uns in einem unverbindlichen Erstgespräch klären, was Sie
            brauchen — von der ersten Idee bis zum konkreten Angebot.
          </p>
          <Link className={styles.ctaButton} href="/kontakt">
            Projekt anfragen
          </Link>
        </div>
      </section>
    </div>
  );
}
