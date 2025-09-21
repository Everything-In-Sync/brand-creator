import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.resolve(__dirname, '../../tmp');
const MAX_SESSIONS = 50;
const EXPIRY_MS = 1000 * 60 * 60 * 6; // 6 hours

async function ensureStoreDir() {
  await fs.ensureDir(STORE_DIR);
}

export async function saveSession(payload) {
  await ensureStoreDir();
  const id = nanoid(12);
  const filePath = path.join(STORE_DIR, `${id}.json`);
  const record = {
    id,
    createdAt: new Date().toISOString(),
    ...payload
  };
  await fs.writeJson(filePath, record, { spaces: 2 });
  await pruneOldSessions();
  return record;
}

export async function loadSession(id) {
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, `${id}.json`);
  if (!(await fs.pathExists(filePath))) {
    return null;
  }
  return fs.readJson(filePath);
}

async function pruneOldSessions() {
  const files = await fs.readdir(STORE_DIR);
  if (files.length <= MAX_SESSIONS) {
    return;
  }
  const entries = await Promise.all(files.map(async (file) => {
    const filePath = path.join(STORE_DIR, file);
    const stat = await fs.stat(filePath);
    return { filePath, created: stat.birthtimeMs };
  }));
  const now = Date.now();
  const expired = entries.filter((entry) => now - entry.created > EXPIRY_MS);
  for (const item of expired) {
    await fs.remove(item.filePath);
  }
  if (files.length - expired.length > MAX_SESSIONS) {
    const sorted = entries.sort((a, b) => a.created - b.created);
    const toRemove = sorted.slice(0, files.length - MAX_SESSIONS);
    for (const item of toRemove) {
      await fs.remove(item.filePath);
    }
  }
}
