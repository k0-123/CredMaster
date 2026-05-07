"use client";

import { useState, useEffect } from "react";

export function useFormPersistence<T>(
  key: string,
  defaultValue: T
): [T, (val: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored) as T;
    } catch {
      // ignore parse errors
    }
    return defaultValue;
  });

  const setValue = (val: T) => {
    setState(val);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // ignore quota errors
      }
    }
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [state, setValue];
}
