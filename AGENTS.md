# AGENTS.md

Gemeinsame Arbeitsanweisungen für KI-Agenten in diesem Repo. Die projektspezifischen
Regeln (Stack, Static-Export-Grenzen, Tailwind-nur-Layout, DSGVO, Security-Header)
stehen in `CLAUDE.md` und gelten verbindlich.

## Kurzregeln
- **Nur statischer Export**: keine Server Actions / dynamischen API-Routen.
- **Optik** über Design-Tokens (`app/globals.css`) + CSS Modules, nicht über Tailwind.
- **Deutsch** (`lang="de"`), Kontakt nur via `mailto:`, keine externen Runtime-Calls.
- **Sicherheit**: Header host-seitig (`vercel.json` / `nginx.conf.example`), keine
  Secrets im Repo, externe Links mit `rel="noopener noreferrer"`.
- Vor größeren/wichtigen Entscheidungen rückfragen.

## Verifikation
`npm run lint` · `npm run typecheck`. **Kein** `npm run build` zur Selbstkontrolle nach
Änderungen ausführen (dauert lange, nicht nötig) – nur wenn der Nutzer explizit danach fragt.
