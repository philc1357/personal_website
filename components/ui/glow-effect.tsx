"use client";

import * as React from "react";
import { motion, type Transition, type TargetAndTransition } from "motion/react";

import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// GlowEffect – animierter Leucht-Rand hinter Buttons/Elementen (per absoluter
// Positionierung im `relative` Elternelement). Standardfarben nutzen die
// Cyan-Glow-Tokens aus app/globals.css (--card-glow / --card-glow-light),
// damit der Effekt zur Optik von components/ui/card.tsx passt. Pausiert die
// Animation automatisch, wenn der Tab/das Fenster inaktiv ist.
// ─────────────────────────────────────────────────────────────────────────────
export type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?:
    | "rotate"
    | "pulse"
    | "breathe"
    | "colorShift"
    | "flowHorizontal"
    | "static";
  blur?:
    | number
    | "softest"
    | "soft"
    | "medium"
    | "strong"
    | "stronger"
    | "strongest"
    | "none";
  transition?: Transition;
  scale?: number;
  duration?: number;
};

const BLUR_PRESETS_PX: Record<string, number> = {
  softest: 4,
  soft: 8,
  medium: 12,
  strong: 16,
  stronger: 24,
  strongest: 24,
  none: 0,
};

function resolveBlurPx(blur: GlowEffectProps["blur"]): number {
  if (typeof blur === "number") return blur;
  return BLUR_PRESETS_PX[blur ?? "medium"] ?? BLUR_PRESETS_PX.medium;
}

function useIsPageVisible() {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isVisible;
}

export function GlowEffect({
  className,
  style,
  colors = ["var(--card-glow)", "var(--card-glow-light)"],
  mode = "rotate",
  blur = "medium",
  transition,
  scale = 1,
  duration = 5,
}: GlowEffectProps) {
  const isVisible = useIsPageVisible();

  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: duration,
    ease: "linear",
  };

  const animations: Record<NonNullable<GlowEffectProps["mode"]>, TargetAndTransition> = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(", ")})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(", ")})`,
      ],
      transition: {
        ...(transition ?? BASE_TRANSITION),
      },
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`,
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    breathe: {
      background: [
        ...colors.map(
          (color) =>
            `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`,
        ),
      ],
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    flowHorizontal: {
      background: colors.map((color) => {
        const nextColor = colors[(colors.indexOf(color) + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(", ")})`,
    },
  };

  return (
    <motion.div
      style={
        {
          ...style,
          "--scale": scale,
          filter: `blur(${resolveBlurPx(blur)}px)`,
          willChange: "transform",
          backfaceVisibility: "hidden",
        } as React.CSSProperties
      }
      animate={isVisible ? animations[mode] : undefined}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        "scale-[var(--scale)] transform-gpu",
        className,
      )}
    />
  );
}
