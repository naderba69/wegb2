"use client";

import { useEffect } from "react";

export const SW_STATUS_EVENT = "weg-sw-status";

export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      window.dispatchEvent(new CustomEvent(SW_STATUS_EVENT, { detail: { ok: false, grund: "unsupported" } }));
      return;
    }
    let aktiv = true;
    const registrieren = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        const meldeWorker = () => {
          if (!aktiv || !worker) return;
          const ok = worker.state === "activated";
          window.dispatchEvent(new CustomEvent(SW_STATUS_EVENT, {
            detail: { ok, scope: registration.scope, grund: ok ? undefined : worker.state },
          }));
        };
        meldeWorker();
        if (worker && worker.state !== "activated" && worker.state !== "redundant") {
          worker.addEventListener("statechange", meldeWorker);
        }
      } catch (error) {
        if (aktiv) window.dispatchEvent(new CustomEvent(SW_STATUS_EVENT, {
          detail: { ok: false, grund: error instanceof Error ? error.message : "registration-failed" },
        }));
      }
    };
    if (document.readyState === "complete") void registrieren();
    else window.addEventListener("load", registrieren, { once: true });
    return () => {
      aktiv = false;
      window.removeEventListener("load", registrieren);
    };
  }, []);
  return null;
}
