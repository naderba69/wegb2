"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Avoid registering during Next dev (HMR) cycles — only when served over HTTP(S),
    // and only in production or when the sw.js exists.
    if (window.location.hostname === "localhost" && window.location.port === "3000") {
      // dev mode: still try register to catch errors, but silently ignore failures.
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      return;
    }
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    });
  }, []);
  return null;
}
