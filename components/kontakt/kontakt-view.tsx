"use client";

import { useId, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import styles from "./kontakt.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// KontaktView – zentriertes Kontaktformular auf animiertem Grid-Hintergrund.
// Aufbau (zwei Ebenen):
//   1. Fixer, dunkler Hintergrund mit animiertem Grid-Pattern (zum Zentrum hin
//      per Maske ausgeblendet, damit die Karte im Fokus bleibt).
//   2. Zentrierte Karte (min. 100vh) mit Überschrift + Formular.
//
// Wichtig (statischer Export, DSGVO, CLAUDE.md): KEIN Backend, KEIN Versand.
// Das Formular validiert nur clientseitig und zeigt bei gültiger Eingabe eine
// Dank-Meldung – es werden keine Daten übertragen oder gespeichert.
// ─────────────────────────────────────────────────────────────────────────────

// Zeichenobergrenzen (defensive Eingabe-Validierung, auch ohne Versand).
const LIMITS = { name: 100, email: 150, betreff: 150, nachricht: 2000 } as const;

// Einfache, ausreichend strenge E-Mail-Prüfung (kein Vollständigkeits-RFC).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "name" | "email" | "betreff" | "nachricht";
type FormState = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const EMPTY: FormState = { name: "", email: "", betreff: "", nachricht: "" };

// ── Validierung: liefert pro Feld eine Fehlermeldung (oder nichts) ───────────
function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const betreff = values.betreff.trim();
  const nachricht = values.nachricht.trim();

  if (!name) errors.name = "Bitte geben Sie Ihren Namen an.";
  else if (name.length > LIMITS.name) errors.name = `Maximal ${LIMITS.name} Zeichen.`;

  if (!email) errors.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  else if (email.length > LIMITS.email) errors.email = `Maximal ${LIMITS.email} Zeichen.`;
  else if (!EMAIL_RE.test(email)) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";

  if (!betreff) errors.betreff = "Bitte geben Sie einen Betreff an.";
  else if (betreff.length > LIMITS.betreff) errors.betreff = `Maximal ${LIMITS.betreff} Zeichen.`;

  if (!nachricht) errors.nachricht = "Bitte geben Sie eine Nachricht ein.";
  else if (nachricht.length > LIMITS.nachricht)
    errors.nachricht = `Maximal ${LIMITS.nachricht} Zeichen.`;

  return errors;
}

export function KontaktView() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Eindeutige Feld-IDs (Label-Verknüpfung + aria-describedby für Fehler).
  const uid = useId();
  const fieldId = (name: FieldName) => `${uid}-${name}`;
  const errorId = (name: FieldName) => `${uid}-${name}-error`;

  const update = (name: FieldName) => (value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Fehler des bearbeiteten Felds beim Tippen zurücksetzen.
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    // Kein Versand – nur Frontend-Bestätigung.
    setSubmitted(true);
  };

  return (
    <div className={styles.view} data-cursor-dark>
      {/* 1) Fixer Hintergrund mit animiertem Grid */}
      <div className={styles.fixedBackdrop} aria-hidden="true">
        <div className={styles.gridMask}>
          <AnimatedGridPattern maxOpacity={0.35} numSquares={48} />
        </div>
      </div>

      {/* 2) Zentrierte Karte */}
      <main
        className={cn(
          styles.main,
          "relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-24",
        )}
      >
        <Card className={styles.card} contentClassName={styles.cardContent}>
          <h1 className={styles.heading}>Kontakt</h1>
          <p className={styles.lead}>
            Schreiben Sie mir – ob Webentwicklung oder IT-Sicherheitsanalyse.
            Ich melde mich zeitnah bei Ihnen zurück.
          </p>

          {submitted ? (
            // ── Dank-Meldung (kein Datenversand) ────────────────────────────
            <div className={styles.success} role="status" aria-live="polite">
              <CheckCircle2 className={styles.successIcon} aria-hidden="true" />
              <h2 className={styles.successTitle}>Vielen Dank!</h2>
              <p className={styles.successText}>
                Ihre Eingaben wurden geprüft. Für eine echte Anfrage schreiben
                Sie mir bitte direkt an{" "}
                <a className={styles.successLink} href="mailto:bauer.philipp96@t-online.de">
                  bauer.philipp96@t-online.de
                </a>
                .
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className={styles.field}>
                <Label htmlFor={fieldId("name")}>Name</Label>
                <Input
                  id={fieldId("name")}
                  name="name"
                  autoComplete="name"
                  placeholder="Ihr Name"
                  maxLength={LIMITS.name}
                  value={values.name}
                  onChange={(e) => update("name")(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? errorId("name") : undefined}
                />
                {errors.name && (
                  <p id={errorId("name")} className={styles.error} role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* E-Mail */}
              <div className={styles.field}>
                <Label htmlFor={fieldId("email")}>E-Mail</Label>
                <Input
                  id={fieldId("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@beispiel.de"
                  maxLength={LIMITS.email}
                  value={values.email}
                  onChange={(e) => update("email")(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? errorId("email") : undefined}
                />
                {errors.email && (
                  <p id={errorId("email")} className={styles.error} role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Betreff */}
              <div className={styles.field}>
                <Label htmlFor={fieldId("betreff")}>Betreff</Label>
                <Input
                  id={fieldId("betreff")}
                  name="betreff"
                  placeholder="Worum geht es?"
                  maxLength={LIMITS.betreff}
                  value={values.betreff}
                  onChange={(e) => update("betreff")(e.target.value)}
                  aria-invalid={Boolean(errors.betreff)}
                  aria-describedby={errors.betreff ? errorId("betreff") : undefined}
                />
                {errors.betreff && (
                  <p id={errorId("betreff")} className={styles.error} role="alert">
                    {errors.betreff}
                  </p>
                )}
              </div>

              {/* Nachricht */}
              <div className={styles.field}>
                <Label htmlFor={fieldId("nachricht")}>Nachricht</Label>
                <Textarea
                  id={fieldId("nachricht")}
                  name="nachricht"
                  placeholder="Ihre Nachricht …"
                  maxLength={LIMITS.nachricht}
                  value={values.nachricht}
                  onChange={(e) => update("nachricht")(e.target.value)}
                  aria-invalid={Boolean(errors.nachricht)}
                  aria-describedby={errors.nachricht ? errorId("nachricht") : undefined}
                />
                {errors.nachricht && (
                  <p id={errorId("nachricht")} className={styles.error} role="alert">
                    {errors.nachricht}
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className={cn(styles.submit, "w-full")}>
                Absenden
              </Button>
            </form>
          )}

          <p className={styles.hint}>
            Hinweis: Dieses Formular versendet keine Daten. Ihre Anfrage
            erreicht mich direkt per E-Mail.
          </p>
        </Card>
      </main>
    </div>
  );
}
