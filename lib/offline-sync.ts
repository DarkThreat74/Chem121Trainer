/**
 * Offline sync layer for review saves.
 *
 * When the user answers a question, we POST to /api/review. If the network
 * is unavailable (offline), the request body is queued in IndexedDB. When
 * connectivity is restored, the queue is flushed to the server.
 *
 * IndexedDB is used (not localStorage) because it's more reliable for
 * structured data and won't throw quota errors silently.
 */

const DB_NAME = "chem121-offline";
const DB_VERSION = 1;
const STORE_NAME = "review-queue";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

interface QueuedReview {
  id?: number;
  body: {
    questionId: string;
    isCorrect: boolean;
    timeTakenMs: number;
  };
  queuedAt: number;
}

/** Queue a failed review POST for later replay. */
export async function queueReview(body: {
  questionId: string;
  isCorrect: boolean;
  timeTakenMs: number;
}): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add({ body, queuedAt: Date.now() } as QueuedReview);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    // If IndexedDB fails too, fall back to localStorage as last resort
    try {
      const key = "chem121-offline-queue";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ body, queuedAt: Date.now() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      console.error("Failed to queue review offline:", e);
    }
  }
}

/** Get the number of pending reviews in the queue. */
export async function getQueueCount(): Promise<number> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const count = tx.objectStore(STORE_NAME).count();
    const result = await new Promise<number>((resolve, reject) => {
      count.onsuccess = () => resolve(count.result);
      count.onerror = () => reject(count.error);
    });
    db.close();
    return result;
  } catch {
    try {
      const key = "chem121-offline-queue";
      return JSON.parse(localStorage.getItem(key) || "[]").length;
    } catch {
      return 0;
    }
  }
}

/** Attempt to flush all queued reviews to the server. Returns the number successfully sent. */
let flushing = false;
export async function flushQueue(): Promise<number> {
  // Prevent concurrent flushes — Background Sync can fire multiple times
  // and the online event can overlap with SW messages
  if (flushing) return 0;
  flushing = true;

  let flushed = 0;
  const idsToDelete: number[] = [];

  try {
    const db = await openDB();

    // Step 1: Read all queued items (separate read transaction)
    const readTx = db.transaction(STORE_NAME, "readonly");
    const readStore = readTx.objectStore(STORE_NAME);
    const allReq = readStore.getAll();
    const items = await new Promise<QueuedReview[]>((resolve, reject) => {
      allReq.onsuccess = () => resolve(allReq.result as QueuedReview[]);
      allReq.onerror = () => reject(allReq.error);
    });
    db.close();

    if (items.length === 0) {
      flushing = false;
      return 0;
    }

    // Step 2: Send each item to the server (no transaction open during fetches)
    for (const item of items) {
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.body),
        });
        if (res.ok) {
          if (item.id) idsToDelete.push(item.id);
          flushed++;
        } else if (res.status >= 400 && res.status < 500) {
          // 4xx = permanent failure (bad data, question not found, etc.)
          // Delete from queue — retrying will never succeed
          if (item.id) idsToDelete.push(item.id);
        }
        // 5xx = server error — leave in queue, might succeed on retry
      } catch {
        // Network error — still offline, stop trying
        break;
      }
    }

    // Step 3: Delete processed items (separate write transaction)
    if (idsToDelete.length > 0) {
      const db2 = await openDB();
      const writeTx = db2.transaction(STORE_NAME, "readwrite");
      const writeStore = writeTx.objectStore(STORE_NAME);
      for (const id of idsToDelete) {
        writeStore.delete(id);
      }
      await new Promise<void>((resolve, reject) => {
        writeTx.oncomplete = () => resolve();
        writeTx.onerror = () => reject(writeTx.error);
      });
      db2.close();
    }
  } catch (e) {
    console.error("Failed to flush IndexedDB queue:", e);
  } finally {
    flushing = false;
  }

  // Flush from localStorage fallback
  try {
    const key = "chem121-offline-queue";
    const items = JSON.parse(localStorage.getItem(key) || "[]") as QueuedReview[];
    if (items.length > 0) {
      const remaining: QueuedReview[] = [];
      for (const item of items) {
        try {
          const res = await fetch("/api/review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.body),
          });
          if (res.ok) {
            flushed++;
          } else {
            remaining.push(item);
          }
        } catch {
          remaining.push(item);
          break;
        }
      }
      localStorage.setItem(key, JSON.stringify(remaining));
    }
  } catch (e) {
    console.error("Failed to flush localStorage queue:", e);
  }

  return flushed;
}

/** Clear all queued reviews (for stuck queues / debugging). */
export async function clearQueue(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    console.error("Failed to clear IndexedDB queue:", e);
  }
  try {
    localStorage.removeItem("chem121-offline-queue");
  } catch {}
}

/** Check if the browser is currently online. */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}
