import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { cn } from "@/lib/utils";
import { TypewriterLoop } from "./typewriter-loop";
import styles from "./hero-content.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Hero-Content – Überschrift, Subline und die beiden primären CTAs, die vor dem
// animierten Beams-Hintergrund liegen.
// ─────────────────────────────────────────────────────────────────────────────
export function HeroContent() {
  return (
    <div className={cn(styles.root, "flex flex-col items-center gap-6 px-4")}>
      <h1 className={styles.heading}>Bauer Web-Solutions</h1>
      <p className={styles.subheading}>
        <TypewriterLoop
          words={["Full-Stack-Webentwicklung", "IT-Sicherheitsanalysen"]}
        />
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="relative">
          <GlowEffect
            mode="colorShift"
            blur="soft"
            duration={6}
            scale={0.95}
            className="rounded-[var(--radius-md)]"
          />
          <Button asChild variant="default" size="lg" className="relative z-10">
            <Link href="/webentwicklung">Webentwicklung</Link>
          </Button>
        </div>
        <div className="relative">
          <GlowEffect
            mode="colorShift"
            blur="soft"
            duration={6}
            scale={0.95}
            className="rounded-[var(--radius-md)]"
          />
          <Button asChild variant="outline" size="lg" className="relative z-10">
            <Link href="/security">IT-Sicherheitsanalyse</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
