"use client";

import { useEffect, useRef } from "react";

/**
 * Thin bar under the sticky header showing how far you've read through the article (not the whole page).
 * Updates via transform only (no layout work), at most once per frame. Decorative, so hidden from screen readers.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const read = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - rect.top) / Math.max(total, 1)));
      if (bar.current) bar.current.style.transform = `scaleX(${read})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-16 z-40 h-1 bg-transparent print:hidden">
      <div ref={bar} className="h-full origin-left bg-brand-600" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
