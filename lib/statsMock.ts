export type ProfileStats = {
  level: number;
  topPlace: number;
  playHours: number;
  favoriteMap: string;

  lastBulletKills: number;
  headshots: number;
  longshotKills: number;
  noscopeKills: number;

  runKills: number;
  blindKills: number;
  jumpKills: number;

  kd: number;
  kills: number;
  deaths: number;
  assists: number;

  accuracy: number; // %
  shots: number;
  hits: number;

  usefulness: number; // %
  wins: number;
  losses: number;
  mapsPlayed: number;

  shopCredits: number;
  shopItems: number;
};

export const statsMock: ProfileStats = {
  level: 0,
  topPlace: 0,
  playHours: 0,
  favoriteMap: "Mirage",

  lastBulletKills: 0,
  headshots: 0,
  longshotKills: 0,
  noscopeKills: 0,

  runKills: 0,
  blindKills: 0,
  jumpKills: 0,

  kd: 0,
  kills: 0,
  deaths: 0,
  assists: 0,

  accuracy: 0,
  shots: 0,
  hits: 0,

  usefulness: 0,
  wins: 0,
  losses: 0,
  mapsPlayed: 0,

  shopCredits: 0,
  shopItems: 0,
};
