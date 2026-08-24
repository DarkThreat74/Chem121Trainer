"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, CloudUpload, CheckCircle2 } from "lucide-react";
import { flushQueue, getQueueCount, isOnline } from "@/lib/offline-sync";

type SyncStatus = "online" | "offline" | "syncing" | "synced";

export default function OfflineSync() {
  const [status, setStatus] = useState<SyncStatus>("online");
  const [pendingCount, setPendingCount] = useState(0);

  // Check pending count and online status on mount
  useEffect(() => {
    const check = async () => {
      const count = await getQueueCount();
      setPendingCount(count);
      if (!isOnline()) {
        setStatus("offline");
      } else if (count > 0) {
        // If we're online and have pending items, flush immediately
        doFlush();
      }
    };
    check();
  }, []);

  const doFlush = useCallback(async () => {
    setStatus("syncing");
    try {
      const flushed = await flushQueue();
      const remaining = await getQueueCount();
      setPendingCount(remaining);
      if (flushed > 0) {
        setStatus("synced");
        // Hide the "synced" message after 3 seconds
        setTimeout(() => setStatus("online"), 3000);
      } else {
        setStatus("online");
      }
    } catch {
      setStatus("online");
    }
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      doFlush();
    };
    const handleOffline = () => {
      setStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [doFlush]);

  // Listen for Background Sync messages from the service worker
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "FLUSH_QUEUE") {
        doFlush();
      }
    };
    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [doFlush]);

  // Don't render anything when online with no pending items and not syncing
  if (status === "online") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 safe-bottom"
      >
        <div
          className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl ${
            status === "offline"
              ? "border-warn/30 bg-warn/10 text-warn"
              : status === "syncing"
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-ok/30 bg-ok/10 text-ok"
          }`}
        >
          {status === "offline" && (
            <>
              <WifiOff className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Offline{pendingCount > 0 ? ` — ${pendingCount} answer${pendingCount > 1 ? "s" : ""} queued` : " — progress will sync when reconnected"}
              </span>
            </>
          )}
          {status === "syncing" && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <CloudUpload className="h-4 w-4 flex-shrink-0" />
              </motion.div>
              <span className="text-sm font-medium">
                Syncing{pendingCount > 0 ? ` ${pendingCount} answer${pendingCount > 1 ? "s" : ""}...` : "..."}
              </span>
            </>
          )}
          {status === "synced" && (
            <>
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Progress synced!</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
