import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        <Button asChild variant="default" size="lg">
          <Link href="/webentwicklung">Webentwicklung</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/security">IT-Sicherheitsanalyse</Link>
        </Button>
      </div>
    </div>
  );
}
