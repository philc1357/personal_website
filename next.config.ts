import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// Next.js Konfiguration – statischer Export
// output: 'export' erzeugt reines HTML/CSS/JS in out/ (läuft auf Vercel UND VPS/nginx).
// Achtung: dynamische API-Routen / Server Actions sind damit NICHT möglich.
// Security-Header werden host-seitig gesetzt (vercel.json bzw. nginx), NICHT via headers().
// ─────────────────────────────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  output: "export",
  // Der Export hat keine On-the-fly-Bildoptimierung -> Bilder unoptimiert ausliefern.
  images: { unoptimized: true },
  // Erzeugt pro Route eine index.html im Unterordner (saubere URLs auf nginx).
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
