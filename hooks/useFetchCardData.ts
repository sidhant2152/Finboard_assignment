"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchData } from "@/lib/utils";

export function useFetchCardData(
  url?: string,
  options?: RequestInit,
  refreshIntervalMs?: number
) {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const run = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchData(url, {
        ...options,
      });

      if (!cancelledRef.current) {
        setData(res);
      }
    } catch (err: any) {
      if (!cancelledRef.current) {
        setError(err?.message ?? String(err));
        setData(null);
      }
    } finally {
      if (!cancelledRef.current) {
        setIsLoading(false);
      }
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    cancelledRef.current = false;

    run();

    if (refreshIntervalMs && refreshIntervalMs > 0) {
      timerRef.current = window.setInterval(run, refreshIntervalMs);
    }

    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [url, options, refreshIntervalMs, run]);

  return {
    data,
    error,
    isLoading,
    refresh: run,
    reset,
  };
}

export default useFetchCardData;
