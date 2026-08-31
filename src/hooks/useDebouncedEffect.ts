import { useEffect, useRef } from 'react';

/** Runs `callback` `delayMs` after the last change to any value in `deps`, canceling any pending run in between. */
export function useDebouncedEffect(callback: () => void, deps: unknown[], delayMs: number) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const timer = setTimeout(() => callbackRef.current(), delayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
