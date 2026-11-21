import { useEffect, useState } from "react";

const WIDE_QUERY = "(min-width: 640px)";

/** Two months on wider viewports, one on phones -- unless overridden. */
export function useResponsiveMonths(explicit?: number): number {
  const [isWide, setIsWide] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return true;
    return window.matchMedia(WIDE_QUERY).matches;
  });

  useEffect(() => {
    if (explicit !== undefined) return;
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia(WIDE_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsWide(event.matches);

    setIsWide(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, [explicit]);

  return explicit ?? (isWide ? 2 : 1);
}
