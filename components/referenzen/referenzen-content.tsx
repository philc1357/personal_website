import Link from "next/link";
import { Card } from "@/components/ui/card";
import styles from "./referenzen.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Anonymisierte Auszüge aus bisherigen Pentest-Engagements.
// Bewusst als generische, komposite Beispiele formuliert (keine 1:1-Zusammen-
// fassung eines einzelnen Berichts): kein Kundenname, keine Domain, kein
// Zeitraum, keine Nutzer-/Umsatzzahlen und keine branchenspezifische Kombi-
// nation, die einen Rückschluss auf ein konkretes Projekt erlauben würde.
// ─────────────────────────────────────────────────────────────────────────────

const caseStudies = [
    {
        category: "A01 – Fehlerhafte Zugriffskontrolle",
        context: "Web-Anwendung mit Nutzerkonten",
        finding:
            "Über vorhersehbare IDs ließen sich fremde Datensätze abrufen (IDOR).",
        impact: "Vertrauliche Daten anderer Nutzer wären einsehbar gewesen.",
        remediation: "Objektbezogene Berechtigungsprüfung serverseitig ergänzt.",
    },
    {
        category: "A03 – Einschleusen von Schad-Code",
        context: "Formularbasierte Web-Anwendung",
        finding:
            "Eingabefelder ohne serverseitige Validierung erlaubten das Einschleusen von Code.",
        impact: "Angreifer hätten Skripte im Kontext anderer Nutzer ausführen können.",
        remediation: "Ein- und Ausgaben serverseitig validiert bzw. korrekt kodiert.",
    },
    {
        category: "A05 – Sicherheits-Fehlkonfiguration",
        context: "Produktiv betriebene Website",
        finding:
            "Zentrale Sicherheits-Header (u. a. Content-Security-Policy, HSTS) fehlten vollständig.",
        impact: "Fehlender Schutz gegen eingeschleusten Code und Downgrade-Angriffe.",
        remediation: "Sicherheits-Header host-seitig ergänzt und gehärtet.",
    },
    {
        category: "A06 – Veraltete Komponenten",
        context: "Server-Infrastruktur einer Web-Anwendung",
        finding:
            "Eingesetzte Software-Komponenten mit bekannten, öffentlich dokumentierten Schwachstellen.",
        impact: "Angriffsfläche durch längst behobene, aber ungepatchte Lücken.",
        remediation: "Komponenten aktualisiert und ein Update-Prozess etabliert.",
    },
    {
        category: "A07 – Schwache Anmeldeverfahren",
        context: "Login-Bereich einer Web-Anwendung",
        finding:
            "Kein Schutz gegen automatisiertes Durchprobieren von Zugangsdaten (Brute-Force).",
        impact: "Konten wären durch simples Ausprobieren übernehmbar gewesen.",
        remediation: "Rate-Limiting und Konto-Sperrmechanismen eingeführt.",
    },
];

export function ReferenzenContent() {
    return (
        <div className={styles.facts}>
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        Typische Funde aus bisherigen Sicherheitsprüfungen
                    </h2>
                    <p className={styles.sectionLead}>
                        Ein Auszug aus wiederkehrenden Fundkategorien meiner bisherigen
                        Pentests — anonymisiert und exemplarisch zusammengefasst, ohne
                        Rückschluss auf konkrete Kunden oder Projekte.
                    </p>
                    <div className={styles.caseGrid}>
                        {caseStudies.map((c) => (
                            <Card key={c.category} contentClassName={styles.caseCard} data-cursor-card>
                                <span className={styles.caseCategory}>{c.category}</span>
                                <div className={styles.caseContext}>{c.context}</div>
                                <p className={styles.caseFinding}>{c.finding}</p>
                                <div className={styles.caseRow}>
                                    <span className={styles.caseLabel}>Auswirkung</span>
                                    <p className={styles.caseText}>{c.impact}</p>
                                </div>
                                <div className={styles.caseRow}>
                                    <span className={styles.caseLabel}>Behebung</span>
                                    <p className={styles.caseText}>{c.remediation}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <p className={styles.sourceNote}>
                        Aus Vertraulichkeitsgründen sind alle Beispiele anonymisiert und
                        lassen keine Rückschlüsse auf konkrete Kunden zu.
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>Wie sicher ist Ihre Website wirklich?</h2>
                    <p className={styles.ctaText}>
                        Ich prüfe Ihre Website auf die häufigsten Schwachstellen und
                        übersetze die Ergebnisse in klare, priorisierte
                        Handlungsempfehlungen.
                    </p>
                    <Link className={styles.ctaButton} href="/kontakt">
                        Sicherheitsanalyse anfragen
                    </Link>
                </div>
            </section>
        </div>
    );
}
