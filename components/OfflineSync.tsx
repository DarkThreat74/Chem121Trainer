"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, CloudUpload, CheckCircle2, X } from "lucide-react";
import { flushQueue, getQueueCount, isOnline, clearQueue } from "@/lib/offline-sync";

type SyncStatus = "online" | "offline" | "syncing" | "synced" | "stuck";

export default function OfflineSync() {
  const [status, setStatus] = useState<SyncStatus>("online");
  const [pendingCount, setPendingCount] = useState(0);
  const flushingRef = useRef(false);
  const flushAttempts = useRef(0);

  const doFlush = useCallback(async () => {
    // Prevent concurrent flush calls — Background Sync and online events
    // can fire multiple times simultaneously
    if (flushingRef.current) return;
    flushingRef.current = true;
    flushAttempts.current += 1;

    setStatus("syncing");
    const timeout = setTimeout(() => {
      flushingRef.current = false;
      // If we've tried multiple times and still have items, show "stuck" state
      getQueueCount().then((count) => {
        if (count > 0 && flushAttempts.current >= 3) {
          setStatus("stuck");
        } else {
          setStatus("online");
        }
      });
    }, 15000);

    try {
      const flushed = await flushQueue();
      const remaining = await getQueueCount();
      setPendingCount(remaining);

      if (remaining === 0) {
        flushAttempts.current = 0;
        if (flushed > 0) {
          setStatus("synced");
          setTimeout(() => setStatus("online"), 3000);
        } else {
          setStatus("online");
        }
      } else if (flushed > 0) {
        // Partial flush — some succeeded, some remain. Try again.
        setStatus("synced");
        setTimeout(() => {
          flushingRef.current = false;
          doFlush();
        }, 2000);
      } else {
        // Nothing flushed — items are failing. Show stuck state after retries.
        if (flushAttempts.current >= 3) {
          setStatus("stuck");
        } else {
          setStatus("online");
        }
      }
    } catch {
      setStatus("online");
    }
    clearTimeout(timeout);
    flushingRef.current = false;
  }, []);

  // Check pending count and online status on mount
  useEffect(() => {
    const check = async () => {
      const count = await getQueueCount();
      setPendingCount(count);
      if (!isOnline()) {
        setStatus("offline");
      } else if (count > 0) {
        doFlush();
      }
    };
    check();
  }, [doFlush]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      flushAttempts.current = 0;
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

  const handleClearQueue = async () => {
    await clearQueue();
    setPendingCount(0);
    flushAttempts.current = 0;
    setStatus("online");
  };

  // Don't render anything when online with no pending items
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
              : status === "stuck"
              ? "border-err/30 bg-err/10 text-err"
              : "border-ok/30 bg-ok/10 text-ok"
          }`}
        >
          {status === "offline" && (
            <>
              <WifiOff className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Offline{pendingCount > 0 ? ` — ${pendingCount} queued` : " — progress will sync when reconnected"}
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
          {status === "stuck" && (
            <>
              <span className="text-sm font-medium">
                {pendingCount} save{pendingCount > 1 ? "s" : ""} failed — progress already saved to DB
              </span>
              <button
                onClick={handleClearQueue}
                className="flex items-center gap-1 rounded-lg bg-err/20 px-2 py-1 text-xs font-medium transition hover:bg-err/30"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
