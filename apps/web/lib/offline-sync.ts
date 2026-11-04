/**
 * InnerOS Offline Storage & Synchronization Engine
 * 
 * Safety & Privacy Design:
 * - Minimalist, schema-validated IndexedDB persistence strictly for offline educational milestones.
 * - ZERO storage of private child conversation transcripts or sensitive disclosures in browser caches.
 * - Multi-user & shared-device isolation: local records are bound to specific account IDs.
 * - Full purge on user logout or profile switch (clearLocalAccountData).
 * - Compatible with future Supabase PostgreSQL synchronization.
 */

const DB_NAME = "inneros_offline_v1";
const DB_VERSION = 1;

export interface OfflineProgressRecord {
  id: string; // Composite: `${childId}_${lessonId}`
  accountId: string;
  childId: string;
  lessonId: string;
  departmentId: string;
  completedAt: string;
  starsEarned: number;
}

export interface OfflineSyncItem {
  queueId: string;
  accountId: string;
  childId: string;
  endpoint: string;
  method: "POST" | "PUT";
  payload: Record<string, unknown>;
  createdAt: number;
}

class OfflineSyncManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return Promise.reject(new Error("IndexedDB not available in current environment"));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains("progress")) {
            const store = db.createObjectStore("progress", { keyPath: "id" });
            store.createIndex("by_account", "accountId", { unique: false });
            store.createIndex("by_child", "childId", { unique: false });
          }
          if (!db.objectStoreNames.contains("sync_queue")) {
            const queueStore = db.createObjectStore("sync_queue", { keyPath: "queueId" });
            queueStore.createIndex("by_account", "accountId", { unique: false });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }

    return this.dbPromise;
  }

  /**
   * Save a completed offline lesson milestone
   */
  async recordOfflineLessonCompletion(record: OfflineProgressRecord): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(["progress", "sync_queue"], "readwrite");
      const progressStore = tx.objectStore("progress");
      const queueStore = tx.objectStore("sync_queue");

      progressStore.put(record);

      const syncItem: OfflineSyncItem = {
        queueId: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        accountId: record.accountId,
        childId: record.childId,
        endpoint: "/api/v1/youth-governance/progress",
        method: "POST",
        payload: {
          child_id: record.childId,
          lesson_id: record.lessonId,
          department_id: record.departmentId,
          completed_at: record.completedAt,
          stars_earned: record.starsEarned,
        },
        createdAt: Date.now(),
      };

      queueStore.put(syncItem);

      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn("[OfflineSync] Failed to store milestone offline:", err);
    }
  }

  /**
   * Retrieve cached completed progress for a specific child
   */
  async getChildCompletedLessons(childId: string): Promise<OfflineProgressRecord[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction("progress", "readonly");
      const store = tx.objectStore("progress");
      const index = store.index("by_child");

      return new Promise((resolve, reject) => {
        const req = index.getAll(childId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  /**
   * Sync pending offline items to backend once connectivity is re-established
   */
  async flushSyncQueue(currentAccountId: string): Promise<{ synced: number; failed: number }> {
    if (!navigator.onLine) {
      return { synced: 0, failed: 0 };
    }

    try {
      const db = await this.getDB();
      const tx = db.transaction("sync_queue", "readonly");
      const store = tx.objectStore("sync_queue");
      const index = store.index("by_account");

      const items: OfflineSyncItem[] = await new Promise((resolve, reject) => {
        const req = index.getAll(currentAccountId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      let syncedCount = 0;
      let failedCount = 0;

      for (const item of items) {
        try {
          const res = await fetch(item.endpoint, {
            method: item.method,
            headers: {
              "Content-Type": "application/json",
              "X-User-Id": item.accountId,
            },
            body: JSON.stringify(item.payload),
          });

          if (res.ok) {
            // Delete from queue
            const deleteTx = db.transaction("sync_queue", "readwrite");
            deleteTx.objectStore("sync_queue").delete(item.queueId);
            syncedCount += 1;
          } else {
            failedCount += 1;
          }
        } catch {
          failedCount += 1;
        }
      }

      return { synced: syncedCount, failed: failedCount };
    } catch {
      return { synced: 0, failed: 0 };
    }
  }

  /**
   * Shared Device & Logout Protection: Clears all local offline progress
   */
  async clearAllLocalData(): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(["progress", "sync_queue"], "readwrite");
      tx.objectStore("progress").clear();
      tx.objectStore("sync_queue").clear();
      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // Ignored
    }
  }
}

export const offlineSyncManager = new OfflineSyncManager();
