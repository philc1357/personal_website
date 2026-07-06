# Personal Website

Statische Landing-Page (Next.js Static Export), die den Betreiber als
Full-Stack-Webentwickler (KMU) und Junior-Pentester (OWASP Top 10) positioniert.

> Status: **Projekt eingerichtet** – Inhalte/Sektionen folgen. Siehe `docs/plan.md`.

## Stack
- Next.js 16 (App Router) · React 19 · TypeScript
- Statischer Export (`output: 'export'`) → Ergebnis in `out/`
- Tailwind v3 (nur Layout-Utilities) · CSS Modules + Design-Tokens (`app/globals.css`)
- Radix UI · Framer Motion (`motion`) · lucide-react · next/font (lokal self-hosted)

## Scripts
| Befehl            | Zweck                                              |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Entwicklungsserver (`http://localhost:3000`)       |
| `npm run build`   | Produktions-Build + statischer Export nach `out/`  |
| `npm run preview` | `out/` lokal ausliefern (`npx serve`)              |
| `npm run lint`    | ESLint (Next Core Web Vitals + TS)                 |
| `npm run typecheck` | TypeScript-Typprüfung ohne Emit                  |

## Build & Deploy
```bash
npm install
npm run build   # erzeugt out/
```

- **Vercel**: Repo verbinden; Security-Header/Redirects kommen aus `vercel.json`.
- **VPS/nginx**: `out/` auf den Server kopieren; `nginx.conf.example` als Vorlage
  (Security-Header, HTTP→HTTPS-Redirect, HSTS) anpassen und einbinden.
- **GitHub Pages**: Automatisch via Workflow `.github/workflows/deploy.yml` bei jedem
  Push auf `main`. Einmalig aktivieren: **Settings → Pages → Source: „GitHub Actions“**.
  URL: `https://philc1357.github.io/personal_website/`. Der Pages-Build läuft mit
  `GITHUB_PAGES=true` (setzt `basePath=/personal_website`); Vercel/VPS bauen ohne diese
  Env-Var weiterhin am Root.

## Wichtige Regeln (siehe `CLAUDE.md`)
- Nur statisch – keine Server Actions / dynamischen API-Routen.
- Tailwind nur für Layout; Optik über Design-Tokens + CSS Modules.
- Sprache Deutsch (`lang="de"`), Kontakt via `mailto:`, keine externen Calls (DSGVO).
- Security-Header host-seitig; nur HTTPS; keine Secrets im Repo (Export ist öffentlich).
