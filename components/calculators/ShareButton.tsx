"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Tags shared links so visits from them show up as "share / copied-link" in campaign (UTM) reports. */
function withShareUtm(href: string): string {
  const u = new URL(href);
  u.searchParams.set("utm_source", "share");
  u.searchParams.set("utm_medium", "copied-link");
  return u.toString();
}

/** Copies an absolute link to the clipboard. Shows the link as text if copying isn't allowed. */
export function ShareButton({ path, label = "Copy link to these results" }: { path: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const url = typeof window === "undefined" ? path : withShareUtm(`${window.location.origin}${path}`);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="print:hidden">
      <Button variant="secondary" onClick={copy}>
        {status === "copied" ? <Check aria-hidden className="size-4" /> : <LinkIcon aria-hidden className="size-4" />}
        {status === "copied" ? "Link copied" : label}
      </Button>
      <p role="status" className="mt-2 text-xs text-muted">
        {status === "failed" ? (
          <>Copy this link: <span className="break-all">{url}</span></>
        ) : (
          "The link holds only the numbers you typed. We don't save anything."
        )}
      </p>
    </div>
  );
}
