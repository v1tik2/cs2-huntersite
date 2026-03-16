'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addInventoryReward,
  mapDurationFromDropId,
  mapTierFromDropId,
  tierTitleEn,
  tierTitleUk,
} from '@/lib/rewardsStorage';

type Lang = 'uk' | 'en';
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

type DropItem = {
  id: string;
  nameUk: string;
  nameEn: string;
  rarity: Rarity;
};

type CaseItem = {
  id: 'welcome' | 'weekly' | 'premium';
  titleUk: string;
  titleEn: string;
  descUk: string;
  descEn: string;
  tagUk?: string;
  tagEn?: string;
  price: number; // 0 = free
  icon: string;
  accent: string; // tailwind gradient
  oneTimeBadge?: boolean;
};

const LS_WELCOME = 'cases.welcome.opened';
const LS_WEEKLY = 'cases.weekly.lastOpenKey';

const UI = (lang: Lang) => ({
  open: lang === 'uk' ? 'Відкрити' : 'Open',
  openCase: lang === 'uk' ? 'Відкрити кейс' : 'Open case',
  close: lang === 'uk' ? 'Закрити' : 'Close',
  opening: lang === 'uk' ? 'Відкриваємо…' : 'Opening…',
  rolling: lang === 'uk' ? 'Прокрутка…' : 'Rolling…',
  youGot: lang === 'uk' ? 'Тобі випало:' : 'You got:',
  caseContent: lang === 'uk' ? 'Вміст кейсу' : 'Case content',
  toInventory: lang === 'uk' ? 'Інвентар' : 'Inventory',
  rewardReady: lang === 'uk' ? 'Нагорода отримана' : 'Reward received',
  free: lang === 'uk' ? 'Безкоштовно' : 'Free',
  coins: lang === 'uk' ? 'монет' : 'coins',
  oneTime: lang === 'uk' ? 'Доступно 1 раз' : 'One-time',
  weeklyOnce: lang === 'uk' ? '1 раз/тиждень' : 'Once a week',
  welcomeUsed:
    lang === 'uk'
      ? 'Вітальний кейс уже відкрито'
      : 'Welcome case already opened',
  resetWelcome:
    lang === 'uk' ? 'Скинути вітальний кейс (тест)' : 'Reset welcome case (test)',
  weeklyUsed:
    lang === 'uk'
      ? 'Щотижневий кейс уже забрано'
      : 'Weekly case already claimed',
});

const defaultPool: DropItem[] = [
  {
    id: 'w1',
    nameUk: 'P250 | Пісочний шторм',
    nameEn: 'P250 | Sandstorm',
    rarity: 'common',
  },
  {
    id: 'w2',
    nameUk: 'USP-S | Нічний дим',
    nameEn: 'USP-S | Night Smoke',
    rarity: 'common',
  },
  {
    id: 'w3',
    nameUk: 'AK-47 | Синій імпульс',
    nameEn: 'AK-47 | Blue Pulse',
    rarity: 'rare',
  },
  {
    id: 'w4',
    nameUk: 'AWP | Фіолетовий блиск',
    nameEn: 'AWP | Violet Glare',
    rarity: 'epic',
  },
  {
    id: 'w5',
    nameUk: 'Ніж | Тестовий лут',
    nameEn: 'Knife | Test Loot',
    rarity: 'legendary',
  },
];

const welcomeRewards: Array<DropItem & { chance: number }> = [
  { id: 'lite-2h', nameUk: 'Лайт — 2 години', nameEn: 'Lite — 2 hours', rarity: 'common', chance: 28 },
  { id: 'lite-12h', nameUk: 'Лайт — 12 годин', nameEn: 'Lite — 12 hours', rarity: 'common', chance: 18 },
  { id: 'lite-1d', nameUk: 'Лайт — 1 день', nameEn: 'Lite — 1 day', rarity: 'common', chance: 10 },
  { id: 'lite-3d', nameUk: 'Лайт — 3 дні', nameEn: 'Lite — 3 days', rarity: 'rare', chance: 6 },
  { id: 'lite-7d', nameUk: 'Лайт — 7 днів (макс)', nameEn: 'Lite — 7 days (max)', rarity: 'rare', chance: 3 },
  { id: 'premium-2h', nameUk: 'Преміум — 2 години', nameEn: 'Premium — 2 hours', rarity: 'rare', chance: 12 },
  { id: 'premium-12h', nameUk: 'Преміум — 12 годин', nameEn: 'Premium — 12 hours', rarity: 'rare', chance: 7 },
  { id: 'premium-1d', nameUk: 'Преміум — 1 день', nameEn: 'Premium — 1 day', rarity: 'epic', chance: 5 },
  { id: 'premium-2d', nameUk: 'Преміум — 2 дні', nameEn: 'Premium — 2 days', rarity: 'epic', chance: 3 },
  { id: 'premium-4d', nameUk: 'Преміум — 4 дні (макс)', nameEn: 'Premium — 4 days (max)', rarity: 'epic', chance: 1 },
  { id: 'elite-2h', nameUk: 'Еліта — 2 години', nameEn: 'Elite — 2 hours', rarity: 'epic', chance: 4 },
  { id: 'elite-1d', nameUk: 'Еліта — 1 день', nameEn: 'Elite — 1 day', rarity: 'legendary', chance: 2 },
  { id: 'elite-2d', nameUk: 'Еліта — 2 дні (макс)', nameEn: 'Elite — 2 days (max)', rarity: 'legendary', chance: 1 },
];

function rarityStyle(r: Rarity) {
  switch (r) {
    case 'common':
      return {
        ring: 'ring-white/10',
        bar: 'from-white/10 via-white/5 to-transparent',
        text: 'text-white/85',
      };
    case 'rare':
      return {
        ring: 'ring-blue-400/25',
        bar: 'from-blue-500/25 via-white/5 to-transparent',
        text: 'text-blue-100',
      };
    case 'epic':
      return {
        ring: 'ring-purple-400/25',
        bar: 'from-purple-500/25 via-white/5 to-transparent',
        text: 'text-purple-100',
      };
    case 'legendary':
      return {
        ring: 'ring-amber-300/30',
        bar: 'from-amber-400/25 via-white/5 to-transparent',
        text: 'text-amber-100',
      };
  }
}

function pickWeighted(pool: DropItem[]) {
  const weight: Record<Rarity, number> = {
    common: 70,
    rare: 22,
    epic: 7,
    legendary: 1,
  };
  const bag: DropItem[] = [];
  for (const it of pool) {
    for (let i = 0; i < weight[it.rarity]; i++) bag.push(it);
  }
  return bag[Math.floor(Math.random() * bag.length)];
}

function pickWelcomeReward() {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const reward of welcomeRewards) {
    cumulative += reward.chance;
    if (roll < cumulative) return reward;
  }

  return welcomeRewards[welcomeRewards.length - 1];
}

function getWeekKey(d = new Date()) {
  // Monday-based week key "YYYY-WW"
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7; // 1..7
  date.setUTCDate(date.getUTCDate() + 1 - day); // Monday

  const year = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const diffDays = Math.floor(
    (date.getTime() - yearStart.getTime()) / 86400000
  );
  const week =
    Math.floor((diffDays + (yearStart.getUTCDay() || 7) - 1) / 7) + 1;

  return `${year}-W${String(week).padStart(2, '0')}`;
}

function canOpenWeekly() {
  try {
    const lastKey = localStorage.getItem(LS_WEEKLY);
    const nowKey = getWeekKey(new Date());
    return lastKey !== nowKey;
  } catch {
    return true;
  }
}

export function CasesClient({ lang }: { lang: Lang }) {
  const T = UI(lang);
  const router = useRouter();
  const canResetWelcome = process.env.NODE_ENV !== 'production';

  const [welcomeOpened, setWelcomeOpened] = useState(false);
  const [weeklyAvailable, setWeeklyAvailable] = useState(true);

  const [openingId, setOpeningId] = useState<CaseItem['id'] | null>(null);
  const [strip, setStrip] = useState<DropItem[]>([]);
  const [winner, setWinner] = useState<DropItem | null>(null);
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'done'>('idle');
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const [trackX, setTrackX] = useState(0);
  const [trackTransition, setTrackTransition] = useState<string>('none');

  useEffect(() => {
    try {
      setWelcomeOpened(localStorage.getItem(LS_WELCOME) === '1');
    } catch {}
    setWeeklyAvailable(canOpenWeekly());
  }, []);

  const list: CaseItem[] = useMemo(
    () => [
      {
        id: 'welcome',
        titleUk: 'Вітальний кейс',
        titleEn: 'Welcome case',
        descUk: 'Перший кейс для нових гравців. Забери стартовий бонус!',
        descEn: 'First case for new players. Claim your starter bonus!',
        tagUk: 'для новачків',
        tagEn: 'new players',
        price: 0,
        icon: '🎁',
        accent: 'from-amber-400/20 via-white/5 to-transparent',
        oneTimeBadge: true,
      },
      {
        id: 'weekly',
        titleUk: 'Щотижневий кейс',
        titleEn: 'Weekly case',
        descUk: 'Раз на тиждень безкоштовно. Забирай нагороду!',
        descEn: 'Free once a week. Claim your reward!',
        tagUk: '1 раз/тиждень',
        tagEn: 'once a week',
        price: 0,
        icon: '🗓️',
        accent: 'from-blue-500/20 via-white/5 to-transparent',
        oneTimeBadge: true,
      },
      {
        id: 'premium',
        titleUk: 'Преміум кейс',
        titleEn: 'Premium case',
        descUk: 'Кращі нагороди. Для тих, хто хоче жирний лут.',
        descEn: 'Better rewards. For those who want big loot.',
        tagUk: 'топ лут',
        tagEn: 'top loot',
        price: 250,
        icon: '💎',
        accent: 'from-purple-500/20 via-white/5 to-transparent',
      },
    ],
    []
  );

  const closeModal = () => {
    setOpeningId(null);
    setStrip([]);
    setWinner(null);
    setRewardModalOpen(false);
    setPhase('idle');
    setTrackTransition('none');
    setTrackX(0);
  };

  const resetWelcomeCase = () => {
    try {
      localStorage.removeItem(LS_WELCOME);
    } catch {}
    setWelcomeOpened(false);
  };

  const canOpenCase = (id: CaseItem['id']) => {
    if (id === 'welcome' && welcomeOpened) return false;
    if (id === 'weekly' && !canOpenWeekly()) return false;
    return true;
  };

  const openCaseMenu = (id: CaseItem['id']) => {
    if (!canOpenCase(id)) return;
    setOpeningId(id);
    setWinner(null);
    setPhase('idle');
    setStrip([]);
    setTrackTransition('none');
    setTrackX(0);
  };

  const runCaseOpen = async (id: CaseItem['id']) => {
    // gate
    if (!canOpenCase(id)) return;

    setWinner(null);
    setPhase('idle');

    const pool = id === 'welcome' ? welcomeRewards : defaultPool;
    const winning = id === 'welcome' ? pickWelcomeReward() : pickWeighted(pool);

    // roulette strip
    const len = 42;
    const forcedIndex = 34;
    const arr: DropItem[] = Array.from({ length: len }, () =>
      id === 'welcome' ? pickWelcomeReward() : pickWeighted(pool)
    );
    arr[forcedIndex] = winning;

    setStrip(arr);

    // reset track
    setTrackTransition('none');
    setTrackX(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ITEM_W = 160;
        const GAP = 12;
        const step = ITEM_W + GAP;

        const viewport = 520;
        const center = viewport / 2;

        const target = -(forcedIndex * step) + center - ITEM_W / 2;
        const jitter = (Math.random() * 24 - 12) | 0;

        setPhase('spinning');
        setTrackTransition('transform 5.2s cubic-bezier(0.10, 0.90, 0.12, 1)');
        setTrackX(target + jitter);

        window.setTimeout(() => {
          setWinner(winning);
          setPhase('done');
          setRewardModalOpen(true);

          if (id === 'welcome') {
            const tier = mapTierFromDropId(winning.id);
            const duration = mapDurationFromDropId(winning.id);
            addInventoryReward({
              id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              titleUk: `${tierTitleUk(tier)} — ${duration.durationUk}`,
              titleEn: `${tierTitleEn(tier)} — ${duration.durationEn}`,
              rarity: winning.rarity,
              tier,
              durationUk: duration.durationUk,
              durationEn: duration.durationEn,
              descriptionUk: `Привілегія ${tierTitleUk(tier)} на ${duration.durationUk}.`,
              descriptionEn: `${tierTitleEn(tier)} privilege for ${duration.durationEn}.`,
              sourceCase: id,
              receivedAt: Date.now(),
            });
          }

          if (id === 'welcome') {
            try {
              localStorage.setItem(LS_WELCOME, '1');
            } catch {}
            setWelcomeOpened(true);
          }

          if (id === 'weekly') {
            try {
              localStorage.setItem(LS_WEEKLY, getWeekKey(new Date()));
            } catch {}
            setWeeklyAvailable(false);
          }
        }, 5300);
      });
    });
  };

  const activeCase = list.find((item) => item.id === openingId) ?? null;
  const contentPool = openingId === 'welcome' ? welcomeRewards : defaultPool;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const isWelcome = c.id === 'welcome';
          const isWeekly = c.id === 'weekly';

          const disabled =
            (isWelcome && welcomeOpened) || (isWeekly && !weeklyAvailable);

          const disabledText = isWelcome
            ? T.welcomeUsed
            : isWeekly
            ? T.weeklyUsed
            : '';

          return (
            <div
              key={c.id}
              className={[
                'relative overflow-hidden rounded-3xl bg-black/20 p-5 ring-1 ring-white/10 transition-all duration-300',
                isWelcome
                  ? 'shadow-[0_0_0_1px_rgba(245,158,11,0.18),0_20px_60px_rgba(245,158,11,0.15)] hover:-translate-y-0.5'
                  : '',
              ].join(' ')}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`}
              />
              {isWelcome && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.24),transparent_52%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.16),transparent_48%)] animate-pulse" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
                </>
              )}
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl opacity-30" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={[
                      'grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 text-white/90',
                      isWelcome ? 'animate-pulse' : '',
                    ].join(' ')}
                  >
                    {c.icon}
                  </div>

                  <div className="flex items-center gap-2">
                    {c.oneTimeBadge && (
                      <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                        {c.id === 'weekly' ? T.weeklyOnce : T.oneTime}
                      </span>
                    )}

                    {c.price === 0 ? (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                        {T.free}
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                        {c.price} {T.coins}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-lg font-semibold text-white">
                    {lang === 'uk' ? c.titleUk : c.titleEn}
                  </div>
                  <div className="mt-1 text-sm text-white/60">
                    {lang === 'uk' ? c.descUk : c.descEn}
                  </div>

                  {(c.tagUk || c.tagEn) && (
                    <div className="mt-3 inline-flex rounded-full bg-black/30 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                      {lang === 'uk' ? c.tagUk : c.tagEn}
                    </div>
                  )}

                  {disabled ? (
                    <>
                      <div className="mt-4 w-full rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white/40 ring-1 ring-white/10">
                        {disabledText}
                      </div>
                      {isWelcome && welcomeOpened && canResetWelcome && (
                        <button
                          type="button"
                          onClick={resetWelcomeCase}
                          className="mt-2 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                        >
                          {T.resetWelcome}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCaseMenu(c.id)}
                      className="group mt-4 w-full rounded-2xl bg-gradient-to-r from-[#f5f7ff] via-white to-[#eef3ff] px-4 py-3 text-sm font-bold text-[#0c1427] ring-1 ring-white/80 shadow-[0_12px_30px_rgba(120,155,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(120,155,255,0.36)] active:translate-y-0"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {T.open}
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#5d7be0] text-[11px] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {openingId && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-[1080px] overflow-hidden rounded-3xl bg-[#0b1118] ring-1 ring-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-semibold text-white">
                  {activeCase ? (lang === 'uk' ? activeCase.titleUk : activeCase.titleEn) : ''}
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition"
                >
                  {T.close}
                </button>
              </div>

              <div className="mt-5 text-sm text-white/70">
                {phase === 'done' ? T.youGot : T.opening}
              </div>

              {/* roulette window */}
              <div className="mt-5 rounded-2xl bg-black/30 ring-1 ring-white/10 overflow-hidden">
                <div className="relative">
                  <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
                  <div className="px-4 py-5">
                    <div className="overflow-hidden min-h-[112px]">
                      <div
                        className="flex gap-3"
                        style={{
                          transform: `translateX(${trackX}px)`,
                          transition: trackTransition,
                          willChange: 'transform',
                        }}
                      >
                        {(strip.length ? strip : contentPool).map((it, idx) => {
                          const rs = rarityStyle(it.rarity);
                          return (
                            <div
                              key={`${it.id}-${idx}`}
                              className={`w-[160px] shrink-0 rounded-2xl bg-[#0b1118] ring-1 ${rs.ring}`}
                            >
                              <div
                                className={`h-1 rounded-t-2xl bg-gradient-to-r ${rs.bar}`}
                              />
                              <div className="p-4">
                                <div className="text-xs text-white/50">
                                  {it.rarity.toUpperCase()}
                                </div>
                                <div
                                  className={`mt-1 text-sm font-semibold ${rs.text}`}
                                >
                                  {lang === 'uk' ? it.nameUk : it.nameEn}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-white/50">
                      {phase === 'spinning' ? T.rolling : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => runCaseOpen(openingId)}
                  disabled={!canOpenCase(openingId) || phase === 'spinning'}
                  className={[
                    'mx-auto block min-w-[180px] rounded-2xl px-5 py-4 text-sm font-semibold transition',
                    !canOpenCase(openingId) || phase === 'spinning'
                      ? 'bg-white/5 text-white/40 ring-1 ring-white/10 cursor-not-allowed'
                      : 'bg-white text-black hover:brightness-110 active:scale-[0.99]',
                  ].join(' ')}
                >
                  {T.openCase}
                </button>
              </div>

              <div className="mt-5">
                {winner ? (
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-white/50">
                      {winner.rarity.toUpperCase()}
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {lang === 'uk' ? winner.nameUk : winner.nameEn}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-6">
                <div className="text-center text-2xl font-extrabold tracking-wide text-white">
                  {T.caseContent}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {contentPool.map((item) => {
                    const rs = rarityStyle(item.rarity);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl bg-[#111827] p-4 ring-1 ${rs.ring} bg-gradient-to-br from-white/5 to-white/[0.02]`}
                      >
                        <div className="text-[11px] uppercase tracking-wide text-white/55">
                          {item.rarity}
                        </div>
                        <div className={`mt-2 text-sm font-semibold ${rs.text}`}>
                          {lang === 'uk' ? item.nameUk : item.nameEn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 text-xs text-white/35">
                {openingId === 'welcome'
                  ? lang === 'uk'
                    ? 'Вітальний кейс — 1 раз (поки збережено локально в браузері).'
                    : 'Welcome case — one-time (stored locally in browser for now).'
                  : openingId === 'weekly'
                  ? lang === 'uk'
                    ? 'Щотижневий кейс — 1 раз на тиждень (поки локально в браузері).'
                    : 'Weekly case — once per week (stored locally in browser for now).'
                  : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {rewardModalOpen && winner && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0d1425] p-6 ring-1 ring-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <div className="text-xs uppercase tracking-[0.14em] text-[#8fb1ff]">
              {T.rewardReady}
            </div>
            <div className="mt-2 text-2xl font-black text-white">{T.youGot}</div>

            <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs text-white/50">{winner.rarity.toUpperCase()}</div>
              <div className="mt-1 text-base font-semibold text-white">
                {lang === 'uk' ? winner.nameUk : winner.nameEn}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRewardModalOpen(false);
                  closeModal();
                  router.push(`/${lang}/inventory`);
                }}
                className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110"
              >
                {T.toInventory}
              </button>
              <button
                type="button"
                onClick={() => setRewardModalOpen(false)}
                className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
              >
                {T.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

