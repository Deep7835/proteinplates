"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating "back to top" button that appears after scrolling down. Also opens FAQs/details before printing. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    const beforePrint = () => document.querySelectorAll("main details").forEach((d) => d.setAttribute("open", ""));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeprint", beforePrint);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeprint", beforePrint);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-5 right-5 z-30 flex size-12 items-center justify-center rounded-full border border-line bg-page text-ink shadow-card transition-opacity print:hidden ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  );
}
