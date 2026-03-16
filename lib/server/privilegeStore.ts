import { promises as fs } from "fs";
import path from "path";

export type PrivilegeTier = "lite" | "premium" | "elite";

export type StoredPrivilege = {
  tier: PrivilegeTier;
  titleUk: string;
  titleEn: string;
  durationUk: string;
  durationEn: string;
  activatedAt: number;
};

type PrivilegeDb = Record<string, StoredPrivilege>;

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "privileges.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, "{}", "utf8");
  }
}

async function readDb(): Promise<PrivilegeDb> {
  await ensureFile();
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as PrivilegeDb;
  } catch {
    return {};
  }
}

async function writeDb(db: PrivilegeDb) {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function getPrivilegeBySteamId(steamId: string) {
  const db = await readDb();
  return db[steamId] ?? null;
}

export async function setPrivilegeBySteamId(steamId: string, privilege: StoredPrivilege) {
  const db = await readDb();
  db[steamId] = privilege;
  await writeDb(db);
  return db[steamId];
}

export async function getPrivilegesBySteamIds(steamIds: string[]) {
  const db = await readDb();
  const out: Record<string, StoredPrivilege | null> = {};
  for (const id of steamIds) out[id] = db[id] ?? null;
  return out;
}
