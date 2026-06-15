"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mouse-follow perspective tilt wrapper.
 * Pure CSS 3D (no WebGL) — adds depth to a child element without any runtime cost.
 *
 * Respects `prefers-reduced-motion`: users who opted out see the static element.
 */
export function TiltCard({
  children,
  intensity = 6,
  glare = true,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  intensity?: number;
  glare?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduceMotion(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (py - 0.5) * -intensity * 2,
      y: (px - 0.5) * intensity * 2,
    });
    setGlarePos({ x: px * 100, y: py * 100 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setHover(false);
  }

  return (
    <div
      className={cn("[perspective:1500px]", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={handleMouseLeave}
        className={cn("relative will-change-transform", innerClassName)}
        style={{
          transform: reduceMotion
            ? undefined
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: hover
            ? "transform 0.12s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}

        {/* Glare highlight (soft moving light) */}
        {glare && !reduceMotion && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: hover ? 0.4 : 0,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.85), transparent 50%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
