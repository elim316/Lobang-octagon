"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  if (typeof window === "undefined") return false;
  
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function getResponsiveValue<T>(mobile: T, desktop: T, isMobile: boolean): T {
  return isMobile ? mobile : desktop;
}
