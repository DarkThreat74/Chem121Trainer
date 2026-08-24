"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Register in both dev and production so offline features can be tested
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        // Check for updates every time the page loads
        reg.update();
      } catch (e) {
        console.error("SW registration failed:", e);
      }
    };

    register();

    // When a new SW takes over, reload so the new cache is used
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  return null;
}
