import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "learnone-db";
const DB_VERSION = 1;
const STORE = {
  profiles: "profiles",
  wizard: "wizard",
  progress: "progress",
  settings: "settings",
};

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE.profiles)) db.createObjectStore(STORE.profiles);
        if (!db.objectStoreNames.contains(STORE.wizard)) db.createObjectStore(STORE.wizard);
        if (!db.objectStoreNames.contains(STORE.progress)) db.createObjectStore(STORE.progress);
        if (!db.objectStoreNames.contains(STORE.settings)) db.createObjectStore(STORE.settings);
      },
    });
  }
  return dbPromise;
}

function hasIndexedDb() {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}

export async function kvGet<T>(bucket: keyof typeof STORE, key: string): Promise<T | null> {
  if (hasIndexedDb()) {
    const db = await getDb();
    return (await db.get(STORE[bucket], key)) as T | null;
  }
  const raw = localStorage.getItem(`${bucket}:${key}`);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function kvSet<T>(bucket: keyof typeof STORE, key: string, value: T): Promise<void> {
  if (hasIndexedDb()) {
    const db = await getDb();
    await db.put(STORE[bucket], value as any, key);
    return;
  }
  localStorage.setItem(`${bucket}:${key}`, JSON.stringify(value));
}

export async function kvDelete(bucket: keyof typeof STORE, key: string): Promise<void> {
  if (hasIndexedDb()) {
    const db = await getDb();
    await db.delete(STORE[bucket], key);
    return;
  }
  localStorage.removeItem(`${bucket}:${key}`);
}

export async function kvKeys(bucket: keyof typeof STORE): Promise<string[]> {
  if (hasIndexedDb()) {
    const db = await getDb();
    return await db.getAllKeys(STORE[bucket]).then((keys) => keys.map(String));
  }
  const prefix = `${bucket}:`;
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.slice(prefix.length));
}


