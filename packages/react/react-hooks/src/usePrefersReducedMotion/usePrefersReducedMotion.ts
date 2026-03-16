import { useEffect, useState } from 'react';

export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => isPrefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || !window?.matchMedia) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => setReduced(isPrefersReducedMotion(e));

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  return reduced;
}

const isPrefersReducedMotion = (e?: MediaQueryListEvent) => {
  if (!window?.matchMedia) return false;

  return e?.matches ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
