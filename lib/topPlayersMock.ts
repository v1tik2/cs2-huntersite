export type ModeKey = "dm" | "1x1" | "5x5";

export type TopPlayer = {
  id: number;
  steamId: string;
  nickname: string;
  rank: string;
  kills: number;
  deaths: number;
  kd: number;
  hours: number;
  xp: number;
  privilege?: {
    tier?: "lite" | "premium" | "elite";
    titleUk?: string;
    titleEn?: string;
    durationUk?: string;
    durationEn?: string;
  } | null;
};

export type TopPlayersByMode = Record<ModeKey, TopPlayer[]>;

export const topPlayersMock: TopPlayersByMode = {
  dm: [
    { id: 1, steamId: "76561198000000001", nickname: "spaflxx", rank: "97", kills: 23701, deaths: 23835, kd: 0.99, hours: 860, xp: 7771165 },
    { id: 2, steamId: "76561198000000002", nickname: "Snecky", rank: "19", kills: 19210, deaths: 18922, kd: 1.01, hours: 980, xp: 9610318 },
    { id: 3, steamId: "76561198000000003", nickname: "GNOM", rank: "19", kills: 71523, deaths: 40041, kd: 1.78, hours: 1420, xp: 12928051 },
    { id: 4, steamId: "76561198000000004", nickname: "cheat", rank: "19", kills: 30144, deaths: 10164, kd: 2.96, hours: 1298, xp: 12981666 },
    { id: 5, steamId: "76561198000000005", nickname: "joffy_", rank: "3", kills: 15, deaths: 22, kd: 0.68, hours: 225, xp: 225 },
  ],
  "1x1": [
    { id: 11, steamId: "76561198000000011", nickname: "joffy_", rank: "6", kills: 709, deaths: 457, kd: 1.55, hours: 225, xp: 2189 },
    { id: 12, steamId: "76561198000000012", nickname: "Kioka", rank: "93", kills: 30929, deaths: 14750, kd: 2.09, hours: 740, xp: 6203402 },
    { id: 13, steamId: "76561198000000013", nickname: "thh", rank: "91", kills: 107101, deaths: 50980, kd: 2.10, hours: 690, xp: 5583321 },
    { id: 14, steamId: "76561198000000014", nickname: "Lenin|pl4", rank: "91", kills: 22106, deaths: 9160, kd: 2.41, hours: 640, xp: 5415976 },
    { id: 15, steamId: "76561198000000015", nickname: "monarch", rank: "88", kills: 6294, deaths: 2063, kd: 3.05, hours: 610, xp: 4652593 },
  ],
  "5x5": [
    { id: 21, steamId: "76561198000000021", nickname: "cheat", rank: "19", kills: 50144, deaths: 20164, kd: 2.48, hours: 1800, xp: 18981666 },
    { id: 22, steamId: "76561198000000022", nickname: "GNOM", rank: "19", kills: 81523, deaths: 50041, kd: 1.63, hours: 2100, xp: 17228051 },
    { id: 23, steamId: "76561198000000023", nickname: "Snecky", rank: "18", kills: 25210, deaths: 21922, kd: 1.15, hours: 1200, xp: 10610318 },
    { id: 24, steamId: "76561198000000024", nickname: "spaflxx", rank: "80", kills: 14701, deaths: 15835, kd: 0.93, hours: 640, xp: 3771165 },
    { id: 25, steamId: "76561198000000025", nickname: "joffy_", rank: "7", kills: 1201, deaths: 980, kd: 1.23, hours: 340, xp: 3225 },
  ],
};
