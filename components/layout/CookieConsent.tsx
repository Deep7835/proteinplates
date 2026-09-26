"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { CONSENT_KEY, OPEN_CONSENT_EVENT, type ConsentChoice } from "@/lib/analytics/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Deletes Google Analytics cookies (_ga, _ga_…) left from an earlier "Accept", on this host and its parent domain. */
function removeAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n.startsWith("_ga_"));
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const name of names) {
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

/**
 * Asks before Google Analytics may use cookies. Accept and Reject are equally easy (UK/EU guidance), and the footer's
 * "Cookie settings" link reopens this so people can change their mind at any time.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(CONSENT_KEY);
    } catch {
      // Storage blocked: ask each visit.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved choice once, after hydration
    if (saved !== "granted" && saved !== "denied") setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function choose(choice: ConsentChoice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Storage blocked: the choice still applies to this page view.
    }
    window.gtag?.("consent", "update", { analytics_storage: choice });
    if (choice === "denied") removeAnalyticsCookies();
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div
      role="region"
      aria-label="Cookie choice"
      className="fixed inset-x-3 bottom-3 z-50 rounded-card border border-line bg-page p-4 shadow-lift motion-safe:animate-fade-up sm:inset-x-auto sm:left-4 sm:max-w-md print:hidden"
    >
      <p className="flex gap-3 text-sm">
        <Cookie aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-700" />
        <span>
          We’d like to use Google Analytics cookies to see which pages help people most. No ads, and we never sell data.{" "}
          <Link href="/privacy">Privacy policy</Link>
        </span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="min-h-11 cursor-pointer rounded-full border border-line bg-page px-4 text-sm font-semibold text-ink transition-colors duration-200 hover:border-brand-600"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="min-h-11 cursor-pointer rounded-full bg-brand-700 px-4 text-sm font-semibold text-page transition-colors duration-200 hover:bg-brand-800"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the cookie banner. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}
