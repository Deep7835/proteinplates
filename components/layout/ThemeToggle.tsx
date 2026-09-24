"use client";

import { Moon, Sun } from "lucide-react";

/** Switches between light and dark. The choice is saved in localStorage; the head script applies it before paint. */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode). The theme still changes for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-11 items-center justify-center cursor-pointer rounded-full text-ink transition-colors hover:bg-surface"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <Moon aria-hidden className="size-5 dark:hidden" />
      <Sun aria-hidden className="hidden size-5 dark:block" />
    </button>
  );
}
