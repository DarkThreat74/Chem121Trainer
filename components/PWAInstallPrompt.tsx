"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if already installed or previously dismissed
    const dismissedBefore = localStorage.getItem("pwa-install-dismissed") === "true";
    if (dismissedBefore) {
      setDismissed(true);
      return;
    }

    // Check if already in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after a short delay so it doesn't feel intrusive
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS doesn't support beforeinstallprompt — detect iOS Safari for instructions
    if (ios) {
      const iosDismissed = localStorage.getItem("pwa-ios-dismissed") === "true";
      if (!iosDismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      // iOS — no programmatic install, just hide the prompt
      setShowPrompt(false);
    }
  }

  function handleDismiss() {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
    localStorage.setItem("pwa-ios-dismissed", "true");
    setDismissed(true);
  }

  if (!mounted || dismissed) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4 safe-bottom md:bottom-4 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="rounded-2xl border border-border-strong bg-bg-card p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-500">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Install Chem 121 Trainer</p>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {isIOS
                    ? "Tap Share → 'Add to Home Screen' to install as an app for offline access."
                    : "Install as an app for faster access and offline studying."}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {!isIOS && (
                    <button
                      onClick={handleInstall}
                      className="flex-1 rounded-lg bg-gradient-to-r from-accent-hover to-accent py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Install
                    </button>
                  )}
                  <button
                    onClick={handleDismiss}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
                  >
                    <X className="h-3.5 w-3.5" />
                    Not now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
