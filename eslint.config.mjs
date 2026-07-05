import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

// ESLint (Flat Config) auf Basis der nativen Next.js-Regelsätze
// (Core Web Vitals + TypeScript). eslint-config-next 16 liefert fertige
// Flat-Config-Arrays -> direkt spreaden, kein FlatCompat nötig.
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: ["node_modules/**", ".next/**", "out/**"],
  },
];

export default eslintConfig;
