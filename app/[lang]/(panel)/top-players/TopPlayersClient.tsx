'use client';

import type React from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  topPlayersMock,
  type ModeKey,
  type TopPlayer,
  type TopPlayersByMode,
} from '@/lib/topPlayersMock';

type Lang = 'uk' | 'en';

type SortKey =
  | '#'
  | 'nickname'
  | 'rank'
  | 'kills'
  | 'deaths'
  | 'kd'
  | 'hours'
  | 'xp';
type SortDir = 'asc' | 'desc';

const ui = (lang: Lang) => ({
  title: lang === 'uk' ? 'Топ гравців' : 'Top Players',
  searchPh: lang === 'uk' ? 'Пошук по ніку…' : 'Search by nickname…',
  you: lang === 'uk' ? 'Ви' : 'You',
  myStats: lang === 'uk' ? 'Ваша статистика' : 'Your stats',
  moreStats: lang === 'uk' ? 'Більше статистики' : 'More stats',
  loading: lang === 'uk' ? 'Завантаження рейтингу…' : 'Loading leaderboard…',
  tabs: {
    dm: lang === 'uk' ? 'ДМ' : 'DM',
    '1x1': lang === 'uk' ? '1х1' : '1v1',
    '5x5': lang === 'uk' ? '5х5' : '5v5',
  },
  columns: {
    '#': '#',
    nickname: lang === 'uk' ? 'Нікнейм' : 'Nickname',
    rank: lang === 'uk' ? 'Ранг' : 'Rank',
    kills: lang === 'uk' ? 'Вбивства' : 'Kills',
    deaths: lang === 'uk' ? 'Смерті' : 'Deaths',
    kd: 'K/D',
    hours: lang === 'uk' ? 'Час гри' : 'Play time',
    xp: lang === 'uk' ? 'Досвід' : 'XP',
  },
});

function isModeKey(value: string): value is ModeKey {
  return value === 'dm' || value === '1x1' || value === '5x5';
}

function isTopPlayer(value: unknown): value is TopPlayer {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.steamId === 'string' &&
    typeof v.nickname === 'string' &&
    typeof v.rank === 'string' &&
    typeof v.kills === 'number' &&
    typeof v.deaths === 'number' &&
    typeof v.kd === 'number' &&
    typeof v.hours === 'number' &&
    typeof v.xp === 'number'
  );
}

function isTopPlayersByMode(value: unknown): value is TopPlayersByMode {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;

  return (['dm', '1x1', '5x5'] as ModeKey[]).every((key) => {
    const list = v[key];
    return Array.isArray(list) && list.every(isTopPlayer);
  });
}

export default function TopPlayersClient({ lang }: { lang: Lang }) {
  const T = ui(lang);

  const [mode, setMode] = useState<ModeKey>('dm');
  const [data, setData] = useState<TopPlayersByMode>(topPlayersMock);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('xp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedId, setSelectedId] = useState<number>(topPlayersMock.dm[0]?.id ?? 1);

  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/top-players?lang=${lang}`, { cache: 'no-store' });
        const json = res.ok ? await res.json() : null;
        if (active && isTopPlayersByMode(json)) {
          setData(json);
        }
      } catch {
        // keep fallback
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [lang]);

  useEffect(() => {
    setQ('');
    setSortKey('xp');
    setSortDir('desc');
    setSelectedId(data[mode][0]?.id ?? 1);
    setAnimKey((v) => v + 1);
  }, [mode, data]);

  const rowsSource = data[mode] ?? [];

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();

    const filtered = query
      ? rowsSource.filter((p) => p.nickname.toLowerCase().includes(query))
      : rowsSource.slice();

    const compare = (a: TopPlayer, b: TopPlayer) => {
      const dir = sortDir === 'asc' ? 1 : -1;

      if (sortKey === '#') return (a.id - b.id) * dir;

      const av = a[sortKey as Exclude<SortKey, '#'>];
      const bv = b[sortKey as Exclude<SortKey, '#'>];

      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dir;
      }
      return (Number(av) - Number(bv)) * dir;
    };

    filtered.sort(compare);
    return filtered;
  }, [q, sortKey, sortDir, rowsSource]);

  const selected = useMemo(
    () => filteredSorted.find((p) => p.id === selectedId) ?? filteredSorted[0],
    [filteredSorted, selectedId]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'nickname' || key === 'rank' ? 'asc' : 'desc');
    }
  };

  const SortHint = ({ k }: { k: SortKey }) =>
    sortKey !== k ? (
      <span className="text-white/30">↕</span>
    ) : (
      <span className="text-white/60">{sortDir === 'asc' ? '↑' : '↓'}</span>
    );

  if (loading && rowsSource.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 text-white/70 ring-1 ring-white/10">
        {T.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-white">{T.title}</h1>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-black/20 p-1 ring-1 ring-white/10">
            <Tab active={mode === 'dm'} onClick={() => setMode('dm')}>
              {T.tabs.dm}
            </Tab>
            <Tab active={mode === '1x1'} onClick={() => setMode('1x1')}>
              {T.tabs['1x1']}
            </Tab>
            <Tab active={mode === '5x5'} onClick={() => setMode('5x5')}>
              {T.tabs['5x5']}
            </Tab>
          </div>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={T.searchPh}
          className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20 sm:w-[360px]"
        />
      </div>

      <div
        key={animKey}
        className="grid gap-6 animate-[fadeInUp_.18s_ease-out] lg:grid-cols-[1fr_360px]"
      >
        <div className="overflow-hidden rounded-3xl bg-black/20 ring-1 ring-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="bg-white/5 text-white/50">
                <tr>
                  <Th onClick={() => toggleSort('#')}>
                    {T.columns['#']} <SortHint k="#" />
                  </Th>
                  <Th onClick={() => toggleSort('nickname')}>
                    {T.columns.nickname} <SortHint k="nickname" />
                  </Th>
                  <Th onClick={() => toggleSort('rank')}>
                    {T.columns.rank} <SortHint k="rank" />
                  </Th>
                  <Th onClick={() => toggleSort('kills')}>
                    {T.columns.kills} <SortHint k="kills" />
                  </Th>
                  <Th onClick={() => toggleSort('deaths')}>
                    {T.columns.deaths} <SortHint k="deaths" />
                  </Th>
                  <Th onClick={() => toggleSort('kd')}>
                    {T.columns.kd} <SortHint k="kd" />
                  </Th>
                  <Th onClick={() => toggleSort('hours')}>
                    {T.columns.hours} <SortHint k="hours" />
                  </Th>
                  <Th onClick={() => toggleSort('xp')}>
                    {T.columns.xp} <SortHint k="xp" />
                  </Th>
                </tr>
              </thead>

              <tbody>
                {filteredSorted.map((p, idx) => {
                  const active = p.id === selected?.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={[
                        'cursor-pointer border-t border-white/5',
                        active ? 'bg-white/10' : 'hover:bg-white/5',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3 text-white/60">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-white/10 ring-1 ring-white/10" />
                          <Link
                            href={`/${lang}/profile/${p.steamId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold text-white transition hover:text-white/80"
                          >
                            {p.nickname}
                          </Link>
                          {p.privilege && (
                            <span
                              className={[
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                                p.privilege.tier === "elite"
                                  ? "bg-amber-400/15 text-amber-200 ring-amber-300/40"
                                  : p.privilege.tier === "premium"
                                  ? "bg-blue-500/15 text-blue-100 ring-blue-300/40"
                                  : "bg-white/10 text-white ring-white/20",
                              ].join(" ")}
                            >
                              {lang === "uk" ? p.privilege.titleUk ?? "Привілегія" : p.privilege.titleEn ?? "Privilege"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/80">{p.rank}</td>
                      <td className="px-4 py-3 text-white/80">{formatNum(p.kills, lang)}</td>
                      <td className="px-4 py-3 text-white/80">{formatNum(p.deaths, lang)}</td>
                      <td className="px-4 py-3 text-white/80">{p.kd.toFixed(2)}</td>
                      <td className="px-4 py-3 text-white/80">{formatHours(p.hours, lang)}</td>
                      <td className="px-4 py-3 text-white/80">{formatNum(p.xp, lang)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-black/20 p-5 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/10 ring-1 ring-white/10" />
            <div>
              <div className="font-semibold text-white">{selected?.nickname ?? '-'}</div>
              <div className="text-sm text-white/55">{T.myStats}</div>
              {selected?.privilege && (
                <div className="mt-1 text-xs text-[#9cc0ff]">
                  {lang === "uk"
                    ? `${selected.privilege.titleUk ?? "Привілегія"} • ${selected.privilege.durationUk ?? ""}`
                    : `${selected.privilege.titleEn ?? "Privilege"} • ${selected.privilege.durationEn ?? ""}`}
                </div>
              )}
            </div>

            <div className="ml-auto rounded-lg bg-[#4b6bff] px-2 py-1 text-xs font-semibold text-white">
              {T.you}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Row label={T.columns.rank} value={selected?.rank ?? '-'} />
            <Row label={T.columns.xp} value={selected ? formatNum(selected.xp, lang) : '-'} />
            <Row label={T.columns.kd} value={selected ? selected.kd.toFixed(2) : '-'} />
            <Row label={T.columns.kills} value={selected ? formatNum(selected.kills, lang) : '-'} />
            <Row label={T.columns.deaths} value={selected ? formatNum(selected.deaths, lang) : '-'} />
            <Row label={T.columns.hours} value={selected ? formatHours(selected.hours, lang) : '-'} />
          </div>

          <Link
            href={selected ? `/${lang}/profile/${selected.steamId}` : `/${lang}/profile`}
            className="mt-4 block w-full rounded-2xl bg-[#4b6bff] px-4 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110"
          >
            {T.moreStats} →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function Tab({
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
        'rounded-xl px-4 py-2 text-sm font-semibold transition ring-1',
        active
          ? 'bg-white/10 text-white ring-white/15'
          : 'bg-transparent text-white/60 ring-transparent hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Th({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 font-semibold"
      title="Sort"
    >
      <div className="flex items-center gap-2">{children}</div>
    </th>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
      <div className="text-sm text-white/70">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}

function formatNum(n: number, lang: 'uk' | 'en') {
  return new Intl.NumberFormat(lang === 'uk' ? 'uk-UA' : 'en-US').format(n);
}

function formatHours(h: number, lang: 'uk' | 'en') {
  const v = new Intl.NumberFormat(lang === 'uk' ? 'uk-UA' : 'en-US').format(h);
  return lang === 'uk' ? `${v} год` : `${v} hrs`;
}
