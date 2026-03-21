"use client";

import { useEffect, useRef, useCallback } from "react";

export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  const poll = useCallback(() => savedCallback.current(), []);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    poll();

    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (id) return;
      id = setInterval(poll, intervalMs);
    };

    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        poll(); // fetch immediately on return
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled, poll]);
}
