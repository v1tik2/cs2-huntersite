"use client";

export type RewardRarity = "common" | "rare" | "epic" | "legendary";
export type PrivilegeTier = "lite" | "premium" | "elite";

export type InventoryReward = {
  id: string;
  titleUk: string;
  titleEn: string;
  rarity: RewardRarity;
  tier: PrivilegeTier;
  durationUk: string;
  durationEn: string;
  descriptionUk: string;
  descriptionEn: string;
  sourceCase: "welcome" | "weekly" | "premium";
  receivedAt: number;
  claimedAt?: number;
};

export type ActivePrivilege = {
  tier: PrivilegeTier;
  titleUk: string;
  titleEn: string;
  durationUk: string;
  durationEn: string;
  activatedAt: number;
};

const LS_INVENTORY = "account.inventory.rewards";
const LS_ACTIVE_PRIVILEGE = "account.privilege.active";

export const REWARDS_CHANGED_EVENT = "rewards:changed";
export const PRIVILEGE_CHANGED_EVENT = "privilege:changed";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function notify(eventName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(eventName));
}

export function getInventoryRewards(): InventoryReward[] {
  return readJson<InventoryReward[]>(LS_INVENTORY, []);
}

export function addInventoryReward(item: InventoryReward) {
  const items = getInventoryRewards();
  items.unshift(item);
  writeJson(LS_INVENTORY, items);
  notify(REWARDS_CHANGED_EVENT);
}

export function setInventoryRewards(items: InventoryReward[]) {
  writeJson(LS_INVENTORY, items);
  notify(REWARDS_CHANGED_EVENT);
}

export function claimInventoryReward(itemId: string): InventoryReward | null {
  const items = getInventoryRewards();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) return null;

  const item = items[idx];
  if (!item.claimedAt) {
    item.claimedAt = Date.now();
    items[idx] = item;
    writeJson(LS_INVENTORY, items);
    notify(REWARDS_CHANGED_EVENT);
  }
  return item;
}

export function getActivePrivilege(): ActivePrivilege | null {
  return readJson<ActivePrivilege | null>(LS_ACTIVE_PRIVILEGE, null);
}

export function setActivePrivilege(value: ActivePrivilege) {
  writeJson(LS_ACTIVE_PRIVILEGE, value);
  notify(PRIVILEGE_CHANGED_EVENT);
}

export function purgeExpiredPendingRewards(expireAfterMs = 7 * 24 * 60 * 60 * 1000) {
  const now = Date.now();
  const items = getInventoryRewards();
  const filtered = items.filter((item) => item.claimedAt || now - item.receivedAt < expireAfterMs);
  if (filtered.length !== items.length) {
    setInventoryRewards(filtered);
  }
  return filtered;
}

export function mapDurationFromDropId(dropId: string): {
  durationUk: string;
  durationEn: string;
} {
  if (dropId.includes("2h")) return { durationUk: "2 години", durationEn: "2 hours" };
  if (dropId.includes("12h")) return { durationUk: "12 годин", durationEn: "12 hours" };
  if (dropId.includes("1d")) return { durationUk: "1 день", durationEn: "1 day" };
  if (dropId.includes("2d")) return { durationUk: "2 дні", durationEn: "2 days" };
  if (dropId.includes("3d")) return { durationUk: "3 дні", durationEn: "3 days" };
  if (dropId.includes("4d")) return { durationUk: "4 дні", durationEn: "4 days" };
  if (dropId.includes("7d")) return { durationUk: "7 днів", durationEn: "7 days" };
  return { durationUk: "1 день", durationEn: "1 day" };
}

export function mapTierFromDropId(dropId: string): PrivilegeTier {
  if (dropId.startsWith("elite-")) return "elite";
  if (dropId.startsWith("premium-")) return "premium";
  return "lite";
}

export function tierTitleUk(tier: PrivilegeTier) {
  if (tier === "elite") return "Еліт";
  if (tier === "premium") return "Преміум";
  return "Лайт";
}

export function tierTitleEn(tier: PrivilegeTier) {
  if (tier === "elite") return "Elite";
  if (tier === "premium") return "Premium";
  return "Lite";
}
