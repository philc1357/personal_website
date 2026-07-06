import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./hero-content.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Hero-Content – Überschrift, Subline und die beiden primären CTAs, die vor dem
// animierten Beams-Hintergrund liegen.
// ─────────────────────────────────────────────────────────────────────────────
export function HeroContent() {
  return (
    <div className={cn(styles.root, "flex flex-col items-center gap-6 px-4")}>
      <h1 className={styles.heading}>Bauer Web-Solutions</h1>
      <p className={styles.subheading}>Full-Stack-Webentwicklung und Pentesting</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild variant="default" size="lg">
          <a href="#webentwicklung">Webentwicklung</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#pentesting">Pentesting</a>
        </Button>
      </div>
    </div>
  );
}
