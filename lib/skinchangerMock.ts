export type WeaponTab =
  | 'Knife'
  | 'Gloves'
  | 'Rifles'
  | 'Snipers'
  | 'Pistols'
  | 'SMG'
  | 'Heavy';

export type SkinItem = {
  id: string;
  name: string;
  weapon: WeaponTab;
};

export type KnifeFinish = { id: string; name: string };

export const skinUserMock = {
  displayId: '76561198320662800',
  lastSeenLabel: 'Був(ла) в грі • a year ago',
  refLink: 'https://your-site.gg/ref/123456',
  balance: 760,
};

// ====== 1) Види ножів (Knife) ======
export const knifeTypes: SkinItem[] = [
  { id: 'k1', name: 'Karambit', weapon: 'Knife' },
  { id: 'k2', name: 'M9 Bayonet', weapon: 'Knife' },
  { id: 'k3', name: 'Butterfly', weapon: 'Knife' },
  { id: 'k4', name: 'Bayonet', weapon: 'Knife' },
  { id: 'k5', name: 'Stiletto', weapon: 'Knife' },
  { id: 'k6', name: 'Bowie', weapon: 'Knife' },
  { id: 'k7', name: 'Classic', weapon: 'Knife' },
  { id: 'k8', name: 'Falchion', weapon: 'Knife' },
  { id: 'k9', name: 'Flip', weapon: 'Knife' },
  { id: 'k10', name: 'Gut', weapon: 'Knife' },
  { id: 'k11', name: 'Huntsman', weapon: 'Knife' },
  { id: 'k12', name: 'Kukri', weapon: 'Knife' },
  { id: 'k13', name: 'Navaja', weapon: 'Knife' },
  { id: 'k14', name: 'Nomad', weapon: 'Knife' },
  { id: 'k15', name: 'Paracord', weapon: 'Knife' },
  { id: 'k16', name: 'Shadow Daggers', weapon: 'Knife' },
  { id: 'k17', name: 'Skeleton', weapon: 'Knife' },
  { id: 'k18', name: 'Survival', weapon: 'Knife' },
  { id: 'k19', name: 'Talon', weapon: 'Knife' },
  { id: 'k20', name: 'Ursus', weapon: 'Knife' },
];

// ====== 2) Види рукавиць (Gloves) ======
export const gloveTypes: SkinItem[] = [
  { id: 'g1', name: 'Bloodhound', weapon: 'Gloves' },
  { id: 'g2', name: 'Driver', weapon: 'Gloves' },
  { id: 'g3', name: 'Hand Wraps', weapon: 'Gloves' },
  { id: 'g4', name: 'Hydra', weapon: 'Gloves' },
  { id: 'g5', name: 'Moto', weapon: 'Gloves' },
  { id: 'g6', name: 'Specialist', weapon: 'Gloves' },
  { id: 'g7', name: 'Sport', weapon: 'Gloves' },
];

// ====== 3)  (Rifles) ======
export const rifleTypes: SkinItem[] = [
  { id: 'r1', name: 'AK-47', weapon: 'Rifles' },
  { id: 'r2', name: 'M4A1-S', weapon: 'Rifles' },
  { id: 'r3', name: 'M4A4', weapon: 'Rifles' },
  { id: 'r4', name: 'FAMAS', weapon: 'Rifles' },
  { id: 'r5', name: 'Galil AR', weapon: 'Rifles' },
  { id: 'r6', name: 'AUG', weapon: 'Rifles' },
  { id: 'r7', name: 'SG 553', weapon: 'Rifles' },
];

export const sniperTypes: SkinItem[] = [
  { id: 's1', name: 'AWP', weapon: 'Snipers' },
  { id: 's2', name: 'SSG 08', weapon: 'Snipers' },
  { id: 's3', name: 'SCAR-20', weapon: 'Snipers' },
  { id: 's4', name: 'G3SG1', weapon: 'Snipers' },
];

export const pistolTypes: SkinItem[] = [
  { id: 'p1', name: 'Glock-18', weapon: 'Pistols' },
  { id: 'p2', name: 'USP-S', weapon: 'Pistols' },
  { id: 'p3', name: 'P2000', weapon: 'Pistols' },
  { id: 'p4', name: 'P250', weapon: 'Pistols' },
  { id: 'p5', name: 'Five-SeveN', weapon: 'Pistols' },
  { id: 'p6', name: 'Tec-9', weapon: 'Pistols' },
  { id: 'p7', name: 'CZ75-Auto', weapon: 'Pistols' },
  { id: 'p8', name: 'Desert Eagle', weapon: 'Pistols' },
  { id: 'p9', name: 'R8 Revolver', weapon: 'Pistols' },
  { id: 'p10', name: 'Dual Berettas', weapon: 'Pistols' },
];

export const smgTypes: SkinItem[] = [
  { id: 'm1', name: 'MAC-10', weapon: 'SMG' },
  { id: 'm2', name: 'MP9', weapon: 'SMG' },
  { id: 'm3', name: 'MP7', weapon: 'SMG' },
  { id: 'm4', name: 'MP5-SD', weapon: 'SMG' },
  { id: 'm5', name: 'UMP-45', weapon: 'SMG' },
  { id: 'm6', name: 'P90', weapon: 'SMG' },
  { id: 'm7', name: 'PP-Bizon', weapon: 'SMG' },
];

export const heavyTypes: SkinItem[] = [
  { id: 'h1', name: 'Nova', weapon: 'Heavy' },
  { id: 'h2', name: 'XM1014', weapon: 'Heavy' },
  { id: 'h3', name: 'MAG-7', weapon: 'Heavy' },
  { id: 'h4', name: 'Sawed-Off', weapon: 'Heavy' },
  { id: 'h5', name: 'M249', weapon: 'Heavy' },
  { id: 'h6', name: 'Negev', weapon: 'Heavy' },
];

// ====== Загальний список для гріда  ======
export const skinItemsMock: SkinItem[] = [
  ...knifeTypes,
  ...gloveTypes,
  ...rifleTypes,
  ...sniperTypes,
  ...pistolTypes,
  ...smgTypes,
  ...heavyTypes,
];

// ====== Фініші/скіни для ножів (моки для модалки) ======
export const knifeSkinsByKnife: Record<string, KnifeFinish[]> = {
  k1: [
    { id: 'f1', name: 'Doppler' },
    { id: 'f2', name: 'Fade' },
    { id: 'f3', name: 'Slaughter' },
    { id: 'f4', name: 'Marble Fade' },
  ],
  k2: [
    { id: 'f5', name: 'Autotronic' },
    { id: 'f6', name: 'Crimson Web' },
    { id: 'f7', name: 'Doppler' },
  ],
  k3: [
    { id: 'f8', name: 'Gamma Doppler' },
    { id: 'f9', name: 'Tiger Tooth' },
    { id: 'f10', name: 'Case Hardened' },
  ],
};
