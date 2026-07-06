import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// Next.js Konfiguration – statischer Export
// output: 'export' erzeugt reines HTML/CSS/JS in out/ (läuft auf Vercel UND VPS/nginx).
// Achtung: dynamische API-Routen / Server Actions sind damit NICHT möglich.
// Security-Header werden host-seitig gesetzt (vercel.json bzw. nginx), NICHT via headers().
// ─────────────────────────────────────────────────────────────────────────────
// GitHub Pages liegt beim Projekt-Repo unter /<repo>/ -> basePath/assetPrefix nur für
// den Pages-Build setzen (Workflow setzt GITHUB_PAGES=true). Vercel/VPS bauen ohne diese
// Env-Var weiterhin am Root, damit dort keine Pfade brechen.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "/personal_website";

const nextConfig: NextConfig = {
  output: "export",
  // Der Export hat keine On-the-fly-Bildoptimierung -> Bilder unoptimiert ausliefern.
  images: { unoptimized: true },
  // Erzeugt pro Route eine index.html im Unterordner (saubere URLs auf nginx).
  trailingSlash: true,
  reactStrictMode: true,
  // Blendet das Next.js-Dev-Overlay (Menü-Button unten links) im Dev-Modus aus.
  devIndicators: false,
  // Nur GitHub Pages: Assets/Links unter den Repo-Unterpfad legen.
  ...(isGithubPages ? { basePath: repo, assetPrefix: repo } : {}),
};

export default nextConfig;
