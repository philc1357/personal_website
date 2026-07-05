import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind v3 – bewusst NUR für Layout-Utilities (grid/flex/gap/spacing/container/
// Responsive). Farben, Buttons, Karten, Schatten, Rundungen und Typografie kommen
// NICHT aus Tailwind, sondern aus eigenen Design-Tokens (CSS-Custom-Properties in
// app/globals.css) + CSS Modules -> eigenständiger Look, kein generisches Aussehen.
// Daher wird das Theme hier NICHT mit einer Farbpalette aufgebläht.
// ─────────────────────────────────────────────────────────────────────────────
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
