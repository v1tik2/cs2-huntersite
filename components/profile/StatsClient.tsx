'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ProfileStats } from '@/lib/statsMock';

function Card({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-[13px] text-white/60">{title}</div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

function StatBlock({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-[13px] font-semibold text-white">{title}</div>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between text-sm"
          >
            <div className="text-white/60">{r.label}</div>
            <div className="text-white">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ModeKey = 'dm' | '5x5' | '1x1';

const ui = (lang: 'uk' | 'en') => ({
  loading: lang === 'uk' ? 'Завантаження статистики…' : 'Loading stats…',
  modes: {
    dm: lang === 'uk' ? 'ДМ' : 'DM',
    '5x5': lang === 'uk' ? '5x5' : '5v5',
    '1x1': lang === 'uk' ? '1х1' : '1v1',
  },
  labels: {
    level: lang === 'uk' ? 'Рівень' : 'Level',
    top: lang === 'uk' ? 'Місце у топі' : 'Top place',
    playtime: lang === 'uk' ? 'Ігровий час' : 'Play time',
    favMap: lang === 'uk' ? 'Улюблена карта' : 'Favorite map',

    lastBullet: lang === 'uk' ? 'Останньою кулею' : 'Last-bullet kills',
    hs: lang === 'uk' ? 'Вбивств у голову' : 'Headshots',
    longshot: lang === 'uk' ? 'Вбивств пострілом' : 'Longshot kills',
    noscope: lang === 'uk' ? 'Вбивств без прицілу' : 'Noscope kills',

    run: lang === 'uk' ? 'Вбивства на бігу' : 'Run kills',
    blind: lang === 'uk' ? 'Вбивств осліпленим' : 'Blind kills',
    jump: lang === 'uk' ? 'Вбивств у стрибку' : 'Jump kills',
    reserve: lang === 'uk' ? '(резерв)' : '(reserve)',

    kd: 'K/D',
    kills: lang === 'uk' ? 'Вбивств' : 'Kills',
    deaths: lang === 'uk' ? 'Смертей' : 'Deaths',
    assists: lang === 'uk' ? 'Асистів' : 'Assists',

    accuracyTitle: lang === 'uk' ? 'Міткість' : 'Accuracy',
    accuracy: lang === 'uk' ? 'Міткість' : 'Accuracy',
    shots: lang === 'uk' ? 'Пострілів' : 'Shots',
    hits: lang === 'uk' ? 'Попадань' : 'Hits',

    usefulnessTitle: lang === 'uk' ? 'Корисність' : 'Utility',
    usefulness: lang === 'uk' ? 'Корисність' : 'Utility',
    wins: lang === 'uk' ? 'Перемог' : 'Wins',
    losses: lang === 'uk' ? 'Поразок' : 'Losses',
    maps: lang === 'uk' ? 'Зіграно карт' : 'Maps played',

    shopTitle: lang === 'uk' ? 'Ігровий магазин' : 'Shop',
    credits: lang === 'uk' ? 'Кредитів' : 'Credits',
    items: lang === 'uk' ? 'Предметів' : 'Items',
  },
  modeSubtitle: {
    dm:
      lang === 'uk'
        ? 'Статистика Deathmatch'
        : 'Deathmatch statistics',
    '5x5':
      lang === 'uk'
        ? 'Статистика змагального 5v5'
        : 'Competitive 5v5 statistics',
    '1x1':
      lang === 'uk'
        ? 'Статистика дуелей 1v1'
        : '1v1 duels statistics',
  },
});

function ModeTabs({
  lang,
  value,
  onChange,
}: {
  lang: 'uk' | 'en';
  value: ModeKey;
  onChange: (m: ModeKey) => void;
}) {
  const T = ui(lang);

  const btn = (m: ModeKey) => {
    const active = value === m;
    return (
      <button
        key={m}
        type="button"
        onClick={() => onChange(m)}
        className={[
          'rounded-full px-4 py-2 text-sm font-semibold transition ring-1',
          active
            ? 'bg-white/10 text-white ring-white/15'
            : 'bg-white/5 text-white/60 ring-white/10 hover:bg-white/10 hover:text-white',
        ].join(' ')}
      >
        {T.modes[m]}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {btn('dm')}
      {btn('5x5')}
      {btn('1x1')}
    </div>
  );
}

/**
 * ВАЖЛИВО:
 * У тебе в ProfileStats наразі немає окремих даних по режимах,
 * тому ми робимо "демо-розкладку" від базових значень, щоб перемикач
 * був живий і анімація працювала.
 * Коли додаси реальні stats по режимах з API — просто заміниш це місце.
 */
function getModeView(base: ProfileStats, mode: ModeKey) {
  const mul =
    mode === 'dm' ? 1 : mode === '5x5' ? 0.62 : 0.38;

  // легка різниця, щоб було видно, що режим реально міняє дані
  const kills = Math.round(base.kills * mul);
  const deaths = Math.max(1, Math.round(base.deaths * mul));
  const assists = Math.round(base.assists * mul);

  const kd =
    deaths > 0 ? Math.round((kills / deaths) * 100) / 100 : base.kd;

  const headshots = Math.round(base.headshots * mul);
  const shots = Math.round(base.shots * mul);
  const hits = Math.round(base.hits * mul);
  const wins = Math.round(base.wins * mul);
  const losses = Math.round(base.losses * mul);
  const mapsPlayed = Math.max(1, Math.round(base.mapsPlayed * mul));

  return {
    ...base,
    kills,
    deaths,
    assists,
    kd,
    headshots,
    shots,
    hits,
    wins,
    losses,
    mapsPlayed,
  };
}

export function StatsClient({
  lang,
  steamId: steamIdProp,
}: {
  lang: 'uk' | 'en';
  steamId?: string;
}) {
  const T = ui(lang);
  const searchParams = useSearchParams();

  const [data, setData] = useState<ProfileStats | null>(null);

  // ✅ хуки — завжди зверху, до будь-яких return
  const [mode, setMode] = useState<ModeKey>('dm');

  // ✅ анімація: показуємо displayMode, а при кліку робимо fade-out → switch → fade-in
  const [displayMode, setDisplayMode] = useState<ModeKey>('dm');
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  const steamId =
    steamIdProp || searchParams.get('steamId') || '76561198320662800';

  useEffect(() => {
    const run = async () => {
      const res = await fetch(
        `/api/profile-stats?lang=${lang}&steamId=${steamId}`,
        { cache: 'no-store' }
      );
      const json = (await res.json()) as ProfileStats;
      setData(json);
    };
    run();
  }, [lang, steamId]);

  // ✅ тригер анімації при зміні режиму
  useEffect(() => {
    if (mode === displayMode) return;

    setPhase('out');
    const t = window.setTimeout(() => {
      setDisplayMode(mode);
      setPhase('in');
    }, 140); // швидко, як ти хочеш (можеш 100-180)

    return () => window.clearTimeout(t);
  }, [mode, displayMode]);

  const view = useMemo(() => {
    if (!data) return null;
    return getModeView(data, displayMode);
  }, [data, displayMode]);

  if (!data || !view) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 text-white/70">
        {T.loading}
      </div>
    );
  }

  // ✅ класи для анімації
  const anim =
    phase === 'in'
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-2';

  return (
    <div className="space-y-5">
      {/* режимні таби */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-white/60">{T.modeSubtitle[displayMode]}</div>
        </div>
        <ModeTabs lang={lang} value={mode} onChange={setMode} />
      </div>

      {/* анімований контейнер */}
      <div className={['transition-all duration-200 ease-out', anim].join(' ')}>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card title={T.labels.level} value={view.level} />
          <Card title={T.labels.top} value={view.topPlace} />
          <Card title={T.labels.playtime} value={`${view.playHours} г.`} />
          <Card title={T.labels.favMap} value={view.favoriteMap} />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card title={T.labels.lastBullet} value={view.lastBulletKills} />
          <Card title={T.labels.hs} value={view.headshots} />
          <Card title={T.labels.longshot} value={view.longshotKills} />
          <Card title={T.labels.noscope} value={view.noscopeKills} />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card title={T.labels.run} value={view.runKills} />
          <Card title={T.labels.blind} value={view.blindKills} />
          <Card title={T.labels.jump} value={view.jumpKills} />
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 flex items-center justify-center text-sm text-white/40">
            {T.labels.reserve}
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatBlock
            title={T.labels.kd}
            rows={[
              { label: T.labels.kd, value: Number(view.kd).toFixed(2) },
              { label: T.labels.kills, value: view.kills },
              { label: T.labels.deaths, value: view.deaths },
              { label: T.labels.assists, value: view.assists },
            ]}
          />

          <StatBlock
            title={T.labels.accuracyTitle}
            rows={[
              { label: T.labels.accuracy, value: `${view.accuracy}%` },
              { label: T.labels.shots, value: view.shots },
              { label: T.labels.hits, value: view.hits },
            ]}
          />

          <StatBlock
            title={T.labels.usefulnessTitle}
            rows={[
              { label: T.labels.usefulness, value: `${view.usefulness}%` },
              { label: T.labels.wins, value: view.wins },
              { label: T.labels.losses, value: view.losses },
              { label: T.labels.maps, value: view.mapsPlayed },
            ]}
          />

          <StatBlock
            title={T.labels.shopTitle}
            rows={[
              { label: T.labels.credits, value: view.shopCredits },
              { label: T.labels.items, value: view.shopItems },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
