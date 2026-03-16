'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ProfileStats } from '@/lib/statsMock';
import { StatsClient } from '@/components/profile/StatsClient';

type Lang = 'uk' | 'en';

type Me = {
  id?: string;
  name?: string;
  avatarUrl?: string;
  steamUrl?: string;
  faceitUrl?: string;
  isOnline?: boolean;
  registeredAt?: string | null;
  lastSeenAt?: string | null;
  countryCode?: string | null;
  privilege?: {
    tier?: "lite" | "premium" | "elite";
    titleUk?: string;
    titleEn?: string;
    durationUk?: string;
    durationEn?: string;
  } | null;
};

type Tx = {
  id: string;
  date: string;
  type: 'deposit' | 'withdraw' | 'case' | 'trade';
  amount: number;
  currency: 'COIN' | 'USD';
  status: 'success' | 'pending' | 'failed';
  note?: string;
};

const ui = (lang: Lang) => ({
  tabs: {
    profile: lang === 'uk' ? 'Профіль' : 'Profile',
    stats: lang === 'uk' ? 'Статистика' : 'Statistics',
    skinchanger: lang === 'uk' ? 'Skinchanger' : 'Skinchanger',
    tx: lang === 'uk' ? 'Історія транзакцій' : 'Transaction history',
  },

  buttons: {
    steam: lang === 'uk' ? 'Профіль Steam' : 'Steam profile',
    faceit: lang === 'uk' ? 'Профіль Faceit' : 'Faceit profile',
  },

  meta: {
    online: lang === 'uk' ? 'Онлайн' : 'Online',
    registered: lang === 'uk' ? 'Дата реєстрації' : 'Registration date',
    lastSeen: lang === 'uk' ? 'Був(ла) в грі' : 'Last seen',
    noData: lang === 'uk' ? 'немає даних' : 'no data',
    level: lang === 'uk' ? 'Рівень' : 'Level',
    country: lang === 'uk' ? 'Країна' : 'Country',
    place: lang === 'uk' ? 'Місце' : 'Place',
    elo: lang === 'uk' ? 'Faceit ELO' : 'Faceit ELO',
    kd: 'K/D',
    kills: lang === 'uk' ? 'Убивства' : 'Kills',
    time: lang === 'uk' ? 'Час гри' : 'Play time',
    hours: lang === 'uk' ? 'год' : 'hrs',
  },
  tx: {
    title: lang === 'uk' ? 'Історія транзакцій' : 'Transaction history',
    subtitle:
      lang === 'uk'
        ? 'Показуємо останні операції (поки mock, потім підключимо API).'
        : 'Showing recent operations (mock for now, API later).',
    cols: {
      date: lang === 'uk' ? 'Дата' : 'Date',
      type: lang === 'uk' ? 'Тип' : 'Type',
      amount: lang === 'uk' ? 'Сума' : 'Amount',
      status: lang === 'uk' ? 'Статус' : 'Status',
      note: lang === 'uk' ? 'Коментар' : 'Note',
    },
    typeMap: {
      deposit: lang === 'uk' ? 'Поповнення' : 'Deposit',
      withdraw: lang === 'uk' ? 'Вивід' : 'Withdraw',
      case: lang === 'uk' ? 'Кейс' : 'Case',
      trade: lang === 'uk' ? 'Обмін' : 'Trade',
    },
    statusMap: {
      success: lang === 'uk' ? 'Успішно' : 'Success',
      pending: lang === 'uk' ? 'В обробці' : 'Pending',
      failed: lang === 'uk' ? 'Помилка' : 'Failed',
    },
  },
});

const mockTx: Tx[] = [
  {
    id: '1',
    date: '2026-02-14 12:41',
    type: 'deposit',
    amount: 500,
    currency: 'COIN',
    status: 'success',
    note: 'Bonus',
  },
  {
    id: '2',
    date: '2026-02-13 19:02',
    type: 'case',
    amount: -100,
    currency: 'COIN',
    status: 'success',
    note: 'Weekly case',
  },
  {
    id: '3',
    date: '2026-02-12 16:30',
    type: 'trade',
    amount: -250,
    currency: 'COIN',
    status: 'pending',
    note: 'Trade offer',
  },
  {
    id: '4',
    date: '2026-02-10 10:11',
    type: 'withdraw',
    amount: -20,
    currency: 'USD',
    status: 'failed',
    note: 'Card verification',
  },
];

export default function ProfilePageClient({
  lang,
  steamId,
  embedded,
}: {
  lang: Lang;
  steamId?: string;
  embedded?: boolean;
}) {
  const T = useMemo(() => ui(lang), [lang]);
  const isForeignProfile = Boolean(steamId);
  const [tab, setTab] = useState<'profile' | 'tx' | 'stats'>('profile');
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        const profileRes = await fetch(
          isForeignProfile
            ? `/api/player?steamId=${encodeURIComponent(steamId || '')}`
            : '/api/me',
          { cache: 'no-store' }
        );
        if (!profileRes.ok) {
          if (active) {
            setMe(null);
            setStats(null);
          }
          return;
        }

        const meData = (await profileRes.json()) as Me;
        if (!active) return;
        setMe(meData);

        if (meData?.id) {
          const statsRes = await fetch(
            `/api/profile-stats?lang=${lang}&steamId=${meData.id}`,
            { cache: 'no-store' }
          );
          const statsData = statsRes.ok ? ((await statsRes.json()) as ProfileStats) : null;
          if (active) setStats(statsData);
        }
      } catch {
        if (active) {
          setMe(null);
          setStats(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [lang, isForeignProfile, steamId]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 text-white/70 ring-1 ring-white/10">
        {lang === 'uk' ? 'Завантаження профілю...' : 'Loading profile...'}
      </div>
    );
  }

  if (!me?.id && !isForeignProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <a
          href={`/api/auth/steam?next=/${lang}/profile`}
          className="rounded-full bg-[#1b2838] px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-[#243447]"
        >
          {lang === 'uk' ? 'Увійти через Steam' : 'Sign in with Steam'}
        </a>
      </div>
    );
  }

  if (!me?.id && isForeignProfile) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 text-white/70 ring-1 ring-white/10">
        {lang === 'uk' ? 'Профіль гравця не знайдено.' : 'Player profile not found.'}
      </div>
    );
  }

  const profile = me!;
  const nickname = profile.name || profile.id || 'Unknown';
  const avatarUrl = profile.avatarUrl || 'https://avatars.fastly.steamstatic.com/0000000000000000000000000000000000000000_full.jpg';
  const steamUrl = profile.steamUrl || `https://steamcommunity.com/profiles/${profile.id}`;
  const faceitUrl = profile.faceitUrl || `https://www.faceit.com/en/players/${encodeURIComponent(nickname)}`;

  const statusText = profile.isOnline
    ? T.meta.online
    : profile.lastSeenAt
    ? new Intl.DateTimeFormat(lang === 'uk' ? 'uk-UA' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(profile.lastSeenAt))
    : T.meta.noData;
  const registeredText = profile.registeredAt
    ? new Intl.DateTimeFormat(lang === 'uk' ? 'uk-UA' : 'en-US', {
        dateStyle: 'medium',
      }).format(new Date(profile.registeredAt))
    : T.meta.noData;

  const level = stats?.level ?? 0;
  const xpMax = Math.max(1000, (level || 1) * 4000);
  const xpRaw = (stats?.playHours ?? 0) * 120 + (stats?.kills ?? 0) * 2;
  const xp = Math.max(0, Math.min(xpMax, xpRaw % xpMax));
  const xpPct = Math.max(0, Math.min(100, Math.round((xp / xpMax) * 100)));

  const place = stats?.topPlace ?? 0;
  const elo = 1500 + Math.round((stats?.kd ?? 0) * 250);
  const kd = stats?.kd ?? 0;
  const kills = stats?.kills ?? 0;
  const playHours = stats?.playHours ?? 0;
  const country = profile.countryCode || '--';

  const statsGrid = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <MiniStat label={T.meta.place} value={formatNum(place, lang)} />
      <MiniStat label={T.meta.country} value={country} center />
      <MiniStat label={T.meta.elo} value={formatNum(elo, lang)} />
      <MiniStat label={T.meta.kd} value={kd.toFixed(2)} />
      <MiniStat label={T.meta.kills} value={formatNum(kills, lang)} />
      <MiniStat label={T.meta.time} value={`${formatNum(playHours, lang)} ${T.meta.hours}`} />
    </div>
  );

  if (embedded) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl bg-black/20 p-4 ring-1 ring-white/10 sm:p-5">
          {statsGrid}
        </div>

        <div className="rounded-3xl bg-black/20 p-5 ring-1 ring-white/10">
          <div className="text-sm text-white/70">
            {lang === 'uk'
              ? 'Тут буде контент профілю (досягнення/інфо/предмети) — додамо пізніше.'
              : 'Profile content goes here (achievements/info/items) — we will add it later.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111821] to-[#0b1118] ring-1 ring-white/10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.75)), url(/images/covers/dust2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={`${nickname} avatar`}
                className="h-16 w-16 rounded-2xl bg-white/10 object-cover ring-1 ring-white/15"
              />

              <div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-semibold text-white">{nickname}</div>
                  {profile.privilege && (
                    <div
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        profile.privilege.tier === "elite"
                          ? "bg-amber-400/15 text-amber-200 ring-amber-300/40"
                          : profile.privilege.tier === "premium"
                          ? "bg-blue-500/15 text-blue-100 ring-blue-300/40"
                          : "bg-white/10 text-white ring-white/20",
                      ].join(" ")}
                    >
                      {lang === "uk"
                        ? `${profile.privilege.titleUk ?? "Привілегія"} • ${profile.privilege.durationUk ?? ""}`
                        : `${profile.privilege.titleEn ?? "Privilege"} • ${profile.privilege.durationEn ?? ""}`}
                    </div>
                  )}
                  <div className="text-xs text-white/60">
                    {T.meta.lastSeen} • {statusText}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="h-2 w-[420px] max-w-[70vw] overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                    <div className="h-full rounded-full bg-white/70" style={{ width: `${xpPct}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-white/70">
                    <span className="font-semibold text-white">{formatNum(xp, lang)}</span> / {formatNum(xpMax, lang)} XP{' '}
                    <span className="text-white/50">
                      ({T.meta.level} {level})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <a
                  href={steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
                >
                  {T.buttons.steam}
                </a>

                <a
                  href={faceitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
                >
                  {T.buttons.faceit}
                </a>
              </div>

              <div className="text-xs text-white/60">
                {T.meta.registered}: {registeredText}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
              {T.tabs.profile}
            </TabButton>
            {isForeignProfile ? (
              <TabButton active={tab === 'stats'} onClick={() => setTab('stats')}>
                {T.tabs.stats}
              </TabButton>
            ) : (
              <>
                <Link
                  href={`/${lang}/skinchanger`}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  {T.tabs.skinchanger}
                </Link>

                <TabButton active={tab === 'tx'} onClick={() => setTab('tx')}>
                  {T.tabs.tx}
                </TabButton>
              </>
            )}
          </div>

          {tab === 'profile' && <div className="mt-6">{statsGrid}</div>}
        </div>
      </div>

      {tab === 'profile' ? (
        <div className="rounded-3xl bg-black/20 p-5 ring-1 ring-white/10">
          <div className="text-sm text-white/70">
            {lang === 'uk'
              ? 'Тут буде контент профілю (досягнення/інфо/предмети) — додамо пізніше.'
              : 'Profile content goes here (achievements/info/items) — we will add it later.'}
          </div>
        </div>
      ) : tab === 'stats' ? (
        <div className="rounded-3xl bg-black/20 p-4 ring-1 ring-white/10 backdrop-blur sm:p-6">
          <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <StatsClient
            lang={lang}
            steamId={profile.id || steamId || undefined}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-black/20 ring-1 ring-white/10">
          <div className="p-5">
            <div className="text-xl font-semibold text-white">{T.tx.title}</div>
            <div className="mt-1 text-sm text-white/60">{T.tx.subtitle}</div>
          </div>

          <div className="h-px w-full bg-white/10" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-white/5 text-white/55">
                <tr>
                  <Th>{T.tx.cols.date}</Th>
                  <Th>{T.tx.cols.type}</Th>
                  <Th>{T.tx.cols.amount}</Th>
                  <Th>{T.tx.cols.status}</Th>
                  <Th>{T.tx.cols.note}</Th>
                </tr>
              </thead>
              <tbody>
                {mockTx.map((tx) => (
                  <tr key={tx.id} className="border-t border-white/5 transition hover:bg-white/5">
                    <Td className="text-white/75">{tx.date}</Td>
                    <Td className="text-white">
                      <span className="rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">{T.tx.typeMap[tx.type]}</span>
                    </Td>
                    <Td className={tx.amount >= 0 ? 'text-[#34d399]' : 'text-white'}>
                      {tx.amount >= 0 ? '+' : ''}
                      {formatNum(tx.amount, lang)} {tx.currency}
                    </Td>
                    <Td>
                      <StatusPill lang={lang} status={tx.status} />
                    </Td>
                    <Td className="text-white/70">{tx.note ?? '-'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-xs text-white/45">
            {lang === 'uk' ? 'Примітка: це мок-дані для верстки.' : 'Note: this is mock data for layout.'}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-4 py-2 text-sm font-semibold transition ring-1',
        active
          ? 'bg-white/10 text-white ring-white/15'
          : 'bg-white/5 text-white/60 ring-white/10 hover:bg-white/10 hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function MiniStat({
  label,
  value,
  center,
}: {
  label: string;
  value: string;
  center?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl bg-black/30 px-4 py-4 backdrop-blur ring-1 ring-white/10',
        center ? 'text-center' : '',
      ].join(' ')}
    >
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function StatusPill({ lang, status }: { lang: Lang; status: Tx['status'] }) {
  const T = ui(lang);
  const cls =
    status === 'success'
      ? 'bg-[#34d399]/15 text-[#34d399] ring-[#34d399]/30'
      : status === 'pending'
      ? 'bg-[#f3c969]/15 text-[#f3c969] ring-[#f3c969]/30'
      : 'bg-[#fb7185]/15 text-[#fb7185] ring-[#fb7185]/30';

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${cls}`}>{T.tx.statusMap[status]}</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-semibold">{children}</th>;
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={['px-4 py-3', className ?? ''].join(' ')}>{children}</td>;
}

function formatNum(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'uk' ? 'uk-UA' : 'en-US').format(n);
}
