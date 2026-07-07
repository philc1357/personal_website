import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./security.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Inhaltsdaten – 1:1 aus sicherheitspunkte.php übernommen.
// Es handelt sich um reale, belegbare Branchenwerte; die Quelle wird jeweils
// direkt am Element ausgewiesen. HINWEIS: Solche Kennzahlen schwanken jährlich –
// vor dem Go-Live gegen die jeweils aktuelle Quelle gegenprüfen (Mozilla HTTP
// Observatory, Scott Helmes Top-1-Mio-Crawl, Verizon DBIR, IBM Cost of a Data
// Breach Report, aktuelle OWASP-Edition).
// ─────────────────────────────────────────────────────────────────────────────

// Drei plakative Kennzahlen für das Awareness-Band.
const keyStats = [
    {
        value: "9 von 10",
        text: "Websites fallen bei einer ersten Sicherheitsbewertung durch (Note F).",
        source: "Mozilla HTTP Observatory",
    },
    {
        value: "43 %",
        text: "der Cyberangriffe richten sich gezielt gegen kleine Unternehmen.",
        source: "Verizon Data Breach Investigations Report",
    },
    {
        value: "4,88 Mio. $",
        text: "durchschnittlicher Schaden pro Datenleck weltweit.",
        source: "IBM Cost of a Data Breach Report 2024",
    },
];

// Anteil (%) der Websites, denen eine wichtige Schutzmaßnahme FEHLT.
const missingProtections = [
    {
        label: "Content-Security-Policy",
        percent: 88,
        desc: "Bremst eingeschleusten Schad-Code aus (z. B. fremde Skripte).",
    },
    {
        label: "HSTS — erzwungenes HTTPS",
        percent: 75,
        desc: "Erzwingt die verschlüsselte Verbindung und verhindert Mitlesen.",
    },
    {
        label: "X-Content-Type-Options",
        percent: 65,
        desc: "Verhindert, dass der Browser Dateitypen falsch interpretiert.",
    },
    {
        label: "X-Frame-Options",
        percent: 60,
        desc: "Schützt davor, die Seite für Klick-Betrug einzubetten.",
    },
];

// OWASP Top 10 (2021) – verständlich auf Deutsch. "focus" markiert die Bereiche,
// auf die sich meine Prüfungen konzentrieren (A02 TLS, A03 Injection,
// A04 unsicheres Design, A05 Header/Konfiguration, A06 veraltete Komponenten,
// A07 Authentifizierung, A09 Logging/Monitoring) – ehrliche Zuordnung, kein
// Überversprechen.
const owaspTop10 = [
    { rank: "A01", title: "Fehlerhafte Zugriffskontrolle", desc: "Nutzer gelangen an Daten oder Funktionen, die ihnen nicht zustehen.", focus: false },
    { rank: "A02", title: "Schwache Verschlüsselung", desc: "Daten werden unverschlüsselt oder mit veralteter Technik übertragen.", focus: true },
    { rank: "A03", title: "Einschleusen von Schad-Code (Injection)", desc: "Angreifer schmuggeln Befehle ein, etwa über Eingabefelder.", focus: true },
    { rank: "A04", title: "Unsicheres Grunddesign", desc: "Die Schwachstelle steckt schon im Konzept der Anwendung.", focus: true },
    { rank: "A05", title: "Sicherheits-Fehlkonfiguration", desc: "Falsche oder fehlende Einstellungen am Server und in den Headern.", focus: true },
    { rank: "A06", title: "Veraltete Komponenten", desc: "Bekannte Lücken in nicht aktualisierter Software.", focus: true },
    { rank: "A07", title: "Schwache Anmeldeverfahren", desc: "Unsichere Passwörter oder fehlerhafte Login-Mechanik.", focus: true },
    { rank: "A08", title: "Manipulierte Daten & Updates", desc: "Software-Updates oder Daten werden unbemerkt verändert.", focus: false },
    { rank: "A09", title: "Fehlende Überwachung", desc: "Angriffe bleiben unentdeckt, weil nichts protokolliert wird.", focus: true },
    { rank: "A10", title: "Server-seitige Anfrage-Fälschung (SSRF)", desc: "Der Server wird missbraucht, um interne Systeme anzugreifen.", focus: false },
];

// Warum Websites so oft angreifbar sind – Klartext für Laien.
const whyVulnerable = [
    { title: "Standard ist nicht „sicher“", text: "Viele Websites gehen online, ohne dass Schutzmechanismen aktiviert werden — Sicherheit ist selten die Voreinstellung." },
    { title: "Angriffe laufen automatisch", text: "Bots durchsuchen das Internet rund um die Uhr nach verwundbaren Seiten — gezielt auch kleine Unternehmen." },
    { title: "Niemand prüft es", text: "Ohne Fachwissen bleibt unsichtbar, was falsch konfiguriert ist. Probleme fallen oft erst auf, wenn ein Schaden entstanden ist." },
];

const contactMail = "bauer.philipp96@t-online.de";

export function SecurityFacts() {
    return (
        <div className={styles.facts}>
            {/* ===================================================================
                Awareness-Band: belegte Kennzahlen – macht greifbar, wie
                verbreitet das Problem ist.
            ==================================================================== */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        Das Problem ist größer, als die meisten denken
                    </h2>
                    <p className={styles.sectionLead}>
                        Die Mehrheit aller Websites ist nicht sicher konfiguriert — oft ohne
                        dass die Betreiber es ahnen. Drei Zahlen, die das belegen:
                    </p>
                    <div className={styles.statGrid}>
                        {keyStats.map((s) => (
                            <div key={s.source} className={styles.statTile}>
                                <div className={styles.statValue}>{s.value}</div>
                                <div className={styles.statText}>{s.text}</div>
                                <div className={styles.statSource}>Quelle: {s.source}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================================================================
                Balkendiagramm: Anteil der Websites, denen Schutzmaßnahmen fehlen –
                genau diese Punkte prüfe ich bei einer Analyse.
            ==================================================================== */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        Diese Schutzmaßnahmen fehlen den meisten Websites
                    </h2>
                    <p className={styles.sectionLead}>
                        Selbst grundlegende Schutzfunktionen sind bei einem Großteil der
                        Websites nicht aktiv. Genau diese Punkte prüfe ich für Sie —
                        strukturiert und nachvollziehbar.
                    </p>
                    <div className={styles.barList}>
                        {missingProtections.map((p) => (
                            <div key={p.label} className={styles.barRow}>
                                <div className={styles.barHead}>
                                    <span className={styles.barLabel}>{p.label}</span>
                                    <span className={styles.barPercent}>{p.percent}&nbsp;%</span>
                                </div>
                                <div
                                    className={styles.barTrack}
                                    role="progressbar"
                                    aria-label={`${p.label} fehlt bei ${p.percent} Prozent der Websites`}
                                    aria-valuenow={p.percent}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className={styles.barFill}
                                        style={{ width: `${p.percent}%` }}
                                    />
                                </div>
                                <p className={styles.barDesc}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className={styles.sourceNote}>
                        Anteil der Websites, denen die jeweilige Schutzmaßnahme fehlt.
                        Quelle: Analysen der meistbesuchten Websites (Mozilla Observatory,
                        Scott Helme).
                    </p>
                </div>
            </section>

            {/* ===================================================================
                OWASP Top 10 – verständlich erklärt. "Mein Schwerpunkt" markiert
                die Bereiche, auf die sich meine Prüfungen konzentrieren.
            ==================================================================== */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        Die häufigsten Schwachstellen — verständlich erklärt
                    </h2>
                    <p className={styles.sectionLead}>
                        Sicherheitsfachleute weltweit pflegen eine Rangliste der zehn
                        häufigsten Web-Schwachstellen: die <strong>OWASP&nbsp;Top&nbsp;10</strong>.
                        Als Junior-Pentester konzentriere ich mich auf die Bereiche, in denen
                        Websites am häufigsten patzen —{" "}
                        <span className={styles.focusChip}>Mein Schwerpunkt</span> zeigt, worauf
                        ich mich spezialisiert habe.
                    </p>
                    <div className={styles.owaspGrid}>
                        {owaspTop10.map((o) => (
                            <div
                                key={o.rank}
                                className={cn(
                                    styles.owaspCard,
                                    o.focus && styles.owaspCardFocus
                                )}
                            >
                                <span className={styles.owaspRank}>{o.rank}</span>
                                <div>
                                    <div className={styles.owaspTitle}>
                                        {o.title}
                                        {o.focus && (
                                            <span className={styles.owaspBadge}>
                                                Mein Schwerpunkt
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.owaspDesc}>{o.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className={styles.sourceNote}>Quelle: OWASP Top&nbsp;10 (2021).</p>
                </div>
            </section>

            {/* ===================================================================
                Warum Websites so oft angreifbar sind – Klartext für Laien.
            ==================================================================== */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        Warum sind Websites so oft angreifbar?
                    </h2>
                    <div className={styles.whyGrid}>
                        {whyVulnerable.map((w) => (
                            <div key={w.title} className={styles.whyCard}>
                                <h3 className={styles.whyTitle}>{w.title}</h3>
                                <p className={styles.whyText}>{w.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================================================================
                Abschluss – leistungsbezogene Handlungsaufforderung.
                Kontakt ausschließlich per mailto (keine Formulare/Backend).
            ==================================================================== */}
            <section className={cn(styles.section, styles.ctaSection)}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>
                        Wie sicher ist Ihre Website wirklich?
                    </h2>
                    <p className={styles.ctaText}>
                        Ich prüfe Ihre Website auf die häufigsten Schwachstellen und übersetze
                        die Ergebnisse in klare, priorisierte Handlungsempfehlungen — verständlich,
                        auch ohne IT-Fachwissen.
                    </p>
                    <Link
                        className={styles.ctaButton}
                        href={`mailto:${contactMail}?subject=${encodeURIComponent(
                            "Anfrage IT-Sicherheitsanalyse"
                        )}`}
                    >
                        Sicherheitsanalyse anfragen
                    </Link>
                </div>
            </section>
        </div>
    );
}
