import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { buildSeedData } from "./seed";
import type { WorkforceData } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "workforce.json");

/**
 * A JSON file on disk stands in for a database so the app runs with no external
 * services. Every read and write funnels through `queue` to serialize access.
 */
let queue: Promise<unknown> = Promise.resolve();
let cache: WorkforceData | null = null;

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task, task);
  queue = result.catch(() => undefined);
  return result;
}

async function load(): Promise<WorkforceData> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<WorkforceData>;
    if (parsed.employees && parsed.shifts && parsed.timeEntries) {
      cache = parsed as WorkforceData;
      return cache;
    }
  } catch {
    // No usable file yet — fall through and seed one.
  }

  const seeded = buildSeedData();
  await persist(seeded);
  cache = seeded;
  return cache;
}

async function persist(data: WorkforceData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function readData(): Promise<WorkforceData> {
  return enqueue(async () => {
    const data = await load();
    return structuredClone(data);
  });
}

export function mutateData<T>(
  mutator: (data: WorkforceData) => T,
): Promise<T> {
  return enqueue(async () => {
    const data = await load();
    const draft = structuredClone(data);
    const result = mutator(draft);
    await persist(draft);
    cache = draft;
    return result;
  });
}

export function resetData(): Promise<void> {
  return enqueue(async () => {
    const seeded = buildSeedData();
    await persist(seeded);
    cache = seeded;
  });
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
