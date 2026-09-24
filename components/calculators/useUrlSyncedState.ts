"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Form state that can be loaded from, and (optionally) written back to, the page's query string.
 * The URL is only rewritten after the user changes something, so a plain visit keeps a clean URL.
 * Nothing is stored anywhere else.
 */
export function useUrlSyncedState<T>(options: {
  initial: T;
  parse: (params: URLSearchParams) => T | null;
  serialize: (state: T) => URLSearchParams;
  syncUrl: boolean;
}) {
  const { initial, parse, serialize, syncUrl } = options;
  const [state, setState] = useState<T>(initial);
  const touched = useRef(false);

  // Read a shared link once, after hydration (keeps the static HTML identical for every visitor).
  useEffect(() => {
    const fromUrl = parse(new URLSearchParams(window.location.search));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    if (fromUrl) setState(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!syncUrl || !touched.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${serialize(state).toString()}`);
  }, [state, syncUrl, serialize]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    touched.current = true;
    setState(next);
  }, []);

  return [state, update] as const;
}
