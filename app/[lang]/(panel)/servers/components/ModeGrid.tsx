'use client';

import { useEffect, useMemo, useState } from 'react';

type Mode = {
  id: string;
  icon: string;
  title: string;
  online: number;
  map: string;
  tag: string;
  accent: string;
  badge?: string;
  image: string;

  serverName: string;
  ip: string;
  description: string;
  features: string[];
};

const modeTiles = ['DM', '1x1', '2x2', '5x5', 'surf', 'awp', 'retake'] as const;
type ModeTile = (typeof modeTiles)[number];
const mapOptions = ['Dust 2', 'Mirage', 'Nuke', 'Inferno', 'Nuke', 'Custom'] as const;

const modes: Mode[] = [
  {
    id: 'lobby',
    icon: '🎯',
    image: '/images/modes/5x5.jpg',
    title: 'Створити лобі',
    online: 1047,
    map: 'Custom',
    tag: 'Lobby',
    accent: '#7dd3fc',
    serverName: 'Lobby / Hub',
    ip: 'play.example.com:27015',
    description:
      'Зайди в лобі, обери режим, налаштуй гру та запроси друзів. Тут можна швидко знайти сервер під настрій.',
    features: ['Швидкий підбір режимів', 'Запрошення друзів', 'Анти-AFK', 'Низький пінг'],
  },
  {
    id: 'dm',
    icon: '🎯',
    image: '/images/modes/5x5.jpg',
    title: 'Deathmatch',
    online: 296,
    map: 'Dust 2',
    tag: 'Warmup',
    accent: '#fb7185',
    serverName: 'DM Warmup',
    ip: 'dm.example.com:27015',
    description:
      'Класичний DM для розігріву: швидкі респавни, стабільний тікрейт, мінімум зайвого — максимум стрільби.',
    features: ['Instant respawn', 'HS-only (інколи)', 'Knife arena', 'Anti-cheat'],
  },
  {
    id: '5x5',
    icon: '🎯',
    image: '/images/modes/5x5.jpg',
    title: '5x5',
    online: 201,
    map: 'Mirage',
    tag: 'Team',
    accent: '#34d399',
    serverName: 'Competitive 5v5',
    ip: '5x5.example.com:27015',
    description:
      'Класичний змагальний режим 5v5 з премейдом/соло. Ідеально для тренування командної гри.',
    features: ['Matchmaking', 'Overtime', 'Rank/elo', 'Demo/Stats'],
  },
  {
    id: 'duels',
    icon: '🎯',
    image: '/images/modes/5x5.jpg',
    title: 'Duels',
    online: 166,
    map: 'Nuke',
    tag: '1v1',
    accent: '#fbbf24',
    serverName: '1v1 Duels',
    ip: '1v1.example.com:27015',
    description:
      'Швидкі дуелі 1v1 з ротацією суперників. Прокачай aim та реакцію без довгих каток.',
    features: ['Instant rounds', 'Skill-based', 'Fast queue', 'Clean maps'],
  },
  {
    id: 'awp',
    icon: '🎯',
    image: '/images/modes/5x5.jpg',
    title: 'AWP',
    online: 15,
    map: 'Inferno',
    tag: 'Sniper',
    accent: '#c084fc',
    serverName: 'AWP Arena',
    ip: 'awp.example.com:27015',
    description: 'AWP-only арена: швидкий темп, відпрацювання пік/фліків, мінімум затримок.',
    features: ['AWP-only', 'Small arenas', 'No spread gimmicks', 'Low latency'],
  },
  {
    id: 'special',
    icon: '🎯',
    image: '/images/modes/5x5.jpg',
    title: 'Режим сідого',
    online: 0,
    map: 'Custom',
    tag: 'Special',
    accent: '#f59e0b',
    badge: 'Ексклюзив',
    serverName: 'Exclusive Mode',
    ip: 'vip.example.com:27015',
    description:
      'Ексклюзивний режим для фан-ігор та івентів. Інколи доступний лише у певні години.',
    features: ['Івенти', 'Сезонні правила', 'Касти/нагороди', 'Унікальні налаштування'],
  },
];

export function ModeGrid() {
  const [selectedTile, setSelectedTile] = useState<ModeTile | null>(null);
  const [selectedMap, setSelectedMap] = useState<(typeof mapOptions)[number] | null>(null);
  const [active, setActive] = useState<Mode | null>(null);

  const filtered = useMemo(() => {
    let result = modes;

    if (selectedTile) {
      const map: Record<ModeTile, string[]> = {
        DM: ['dm'],
        '1x1': ['duels'],
        '2x2': [],
        '5x5': ['5x5'],
        surf: [],
        awp: ['awp'],
        retake: [],
      };

      const selectedIds = map[selectedTile];
      result = result.filter((m) => selectedIds.includes(m.id));
    }

    if (selectedMap) {
      result = result.filter((m) => m.map === selectedMap);
    }

    return result;
  }, [selectedTile, selectedMap]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0d1528] via-[#0a1325] to-[#0d1528] p-3 ring-1 ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {modeTiles.map((tile) => {
              const isActive = selectedTile === tile;
              return (
                <button
                  key={tile}
                  type="button"
                  onClick={() => setSelectedTile((current) => (current === tile ? null : tile))}
                  className={[
                    'rounded-xl px-4 py-2 text-sm font-extrabold uppercase tracking-[0.08em] transition-all duration-200',
                    'ring-1 border border-transparent',
                    isActive
                      ? 'bg-[#18233d] text-[#79a9ff] ring-[#79a9ff]/40 shadow-[0_0_18px_rgba(121,169,255,0.2)]'
                      : 'bg-[#141c2e] text-[#9dc2ff] ring-white/5 hover:bg-[#1a243a] hover:text-[#b8d2ff]',
                  ].join(' ')}
                >
                  {tile}
                </button>
              );
            })}
          </div>

          <div className="min-w-[170px]">
            <select
              value={selectedMap ?? ''}
              onChange={(e) => setSelectedMap((e.target.value || null) as (typeof mapOptions)[number] | null)}
              className="w-full rounded-xl bg-[#141c2e] px-3 py-2 text-sm font-semibold text-[#9dc2ff] ring-1 ring-white/10 outline-none transition focus:ring-[#79a9ff]/50"
            >
              <option value="" className="bg-[#141c2e] text-[#9dc2ff]">
                Всі мапи
              </option>
              {mapOptions.map((map, idx) => (
                <option key={`${map}-${idx}`} value={map} className="bg-[#141c2e] text-[#9dc2ff]">
                  {map}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {filtered.map((m) => (
          <ModeCard key={m.id} mode={m} onOpen={() => setActive(m)} />
        ))}
      </div>

      <ExpandedModeModal mode={active} onClose={() => setActive(null)} />
    </div>
  );
}

function ModeCard({ mode, onOpen }: { mode: Mode; onOpen: () => void }) {
  const { title, online, image, description, badge } = mode;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        group relative overflow-hidden rounded-3xl text-left
        ring-1 ring-white/10 bg-black/20
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:ring-white/20
        hover:shadow-[0_28px_80px_rgba(0,0,0,0.65)]
        will-change-transform
      "
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Badge */}
      {badge && (
        <div className="absolute right-4 top-4 z-10">
          <span className="rounded-full bg-[#f3c969]/20 px-3 py-1 text-[11px] font-semibold text-[#f3c969] ring-1 ring-[#f3c969]/30">
            {badge}
          </span>
        </div>
      )}

      {/* Content container */}
      <div className="relative h-72 px-6 text-center">
        {/* Center block (title + online) */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
          <div
            className="
              transition-transform duration-300 ease-out
              group-hover:-translate-y-6
            "
          >
            <div className="text-3xl font-extrabold tracking-tight text-white drop-shadow">
              {title}
            </div>
            <div className="mt-2 text-sm text-white/70">У грі: {online}</div>
          </div>
        </div>

        {/* Open button pinned to bottom; flies OUT on hover */}
        <div
          className="
            absolute bottom-6 left-1/2 -translate-x-1/2
            transition-all duration-500 ease-out
            group-hover:translate-y-16
            group-hover:opacity-0
            will-change-transform
          "
        >
          <div className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110">
            Відкрити <span className="text-black/60">→</span>
          </div>
        </div>

        {/* Description appears AFTER button starts leaving */}
        <div
          className="
            absolute bottom-8 left-6 right-6
            opacity-0 translate-y-6
            transition-all duration-400 ease-out
            group-hover:opacity-100 group-hover:translate-y-0
            group-hover:delay-150
            text-sm text-white/80
          "
        >
          {description}
        </div>
      </div>
    </button>
  );
}

function ExpandedModeModal({
  mode,
  onClose,
}: {
  mode: Mode | null;
  onClose: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // РїР»Р°РІРЅРµ РІС–РґРєСЂРёС‚С‚СЏ/Р·Р°РєСЂРёС‚С‚СЏ
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // РІРєР»Р°РґРєР° РєРѕРјР°РЅРґ
  const [commandsOpen, setCommandsOpen] = useState(false);

  useEffect(() => {
    if (!mode) {
      setVisible(false);
      setClosing(false);
      setCommandsOpen(false);
      return;
    }

    setCopiedKey(null);
    setCommandsOpen(false);
    setClosing(false);

    const raf = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, [mode]);

  const requestClose = () => {
    if (!mode) return;
    if (closing) return;

    setClosing(true);
    setVisible(false);

    window.setTimeout(() => {
      setClosing(false);
      setCommandsOpen(false);
      onClose();
    }, 220); // РјР°С” Р·Р±С–РіР°С‚РёСЃСЊ Р· duration-200
  };

  // ESC Р·Р°РєСЂРёРІР°С” РїР»Р°РІРЅРѕ
  useEffect(() => {
    if (!mode) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, closing]);

  if (!mode) return null;

  const copyIp = async (ip: string, key: string) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = ip;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1200);
    }
  };

  const serverEntries = [
    { id: 263, map: 'de_mirage', players: '15/16', locked: false, ping: 22, ip: '5x5.example.com:27015' },
    { id: 181, map: 'de_mirage_fps', players: '16/16', locked: true, ping: 31, ip: '5x5.example.com:27016' },
    { id: 262, map: 'de_mirage', players: '14/16', locked: false, ping: 19, ip: '5x5.example.com:27017' },
    { id: 255, map: 'de_mirage', players: '16/16', locked: true, ping: 28, ip: '5x5.example.com:27018' },
    { id: 256, map: 'de_mirage', players: '15/16', locked: false, ping: 24, ip: '5x5.example.com:27019' },
    { id: 295, map: 'de_dust2', players: '16/16', locked: true, ping: 35, ip: '5x5.example.com:27020' },
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* вњ… Р±РµРєРґСЂРѕРї: РєР»С–Рє РїРѕР·Р° РјРѕРґР°Р»РєРѕСЋ Р·Р°РєСЂРёРІР°С” */}
      <div
        className={[
          'absolute inset-0 bg-black/70 backdrop-blur-sm',
          'transition-opacity duration-200 ease-out',
          visible && !closing ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={requestClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={requestClose}>
        {/* вњ… РњРћР”РђР›РљРђ (РѕР±РјРµР¶РµРЅР° РїРѕ РІРёСЃРѕС‚С–!) */}
        <div
          className={[
            'relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-3xl',
            'bg-gradient-to-br from-[#111821] to-[#0b1118]',
            'ring-1 ring-white/12 shadow-[0_30px_120px_rgba(0,0,0,0.75)]',
            'transition-all duration-200 ease-out will-change-transform',
            visible && !closing
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-[0.98] translate-y-2',
          ].join(' ')}
          style={{ ['--accent' as any]: mode.accent } as any}
          onClick={(e) => e.stopPropagation()}
        >
          {/* вњ… Close button (top-right) */}

          {/* Glow */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[90px] opacity-35"
            style={{ background: 'var(--accent)' }}
          />

          {/* вњ… Р’РђР–Р›РР’Рћ: h-full + min-h-0 */}
          <div className="relative grid h-full min-h-0 gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Р›Р†Р’Рђ РљРћР›РћРќРљРђ */}
<div className="p-6 sm:p-8 min-h-0">
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="inline-flex items-center gap-2">
        <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] text-white/75 ring-1 ring-white/10">
          {mode.tag}
        </span>

        {mode.badge && (
          <span className="rounded-full bg-[#f3c969]/20 px-3 py-1 text-[11px] font-semibold text-[#f3c969] ring-1 ring-[#f3c969]/30">
            {mode.badge}
          </span>
        )}
      </div>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {mode.title}
      </h2>

      <p className="mt-2 text-sm text-white/65">
        Сервер: <span className="text-white/85">{mode.serverName}</span> • У грі:{' '}
        <span className="text-white/85">{mode.online}</span>
      </p>
    </div>
  </div>

  <div className="mt-5 flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => setCommandsOpen(true)}
      className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 hover:ring-white/25 active:scale-95"
    >
      Команди сервера
    </button>

    {commandsOpen && (
      <button
        type="button"
        onClick={() => setCommandsOpen(false)}
        className="rounded-2xl bg-white/5 px-4 py-2 text-sm font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
      >
        Назад
      </button>
    )}
  </div>

  <div className="mt-6 grid gap-3 sm:grid-cols-2">
    {serverEntries.map((server) => {
      const [usedRaw, maxRaw] = server.players.split('/');
      const used = Number(usedRaw);
      const max = Number(maxRaw);
      const freeSlots = Number.isFinite(used) && Number.isFinite(max) ? Math.max(0, max - used) : 0;

      const indicatorClass =
        freeSlots <= 1
          ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.75)]'
          : freeSlots <= 4
            ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.75)]'
            : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.75)]';

      const accentGlow =
        freeSlots <= 1
          ? 'group-hover:shadow-[0_14px_38px_rgba(239,68,68,0.22)] group-hover:ring-red-400/35'
          : freeSlots <= 4
            ? 'group-hover:shadow-[0_14px_38px_rgba(250,204,21,0.22)] group-hover:ring-yellow-300/35'
            : 'group-hover:shadow-[0_14px_38px_rgba(16,185,129,0.22)] group-hover:ring-emerald-300/35';

      return (
      <div
        key={server.id}
        className={`group relative overflow-hidden rounded-2xl bg-[#101722] text-left ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 ${accentGlow}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition duration-500 group-hover:scale-110 group-hover:opacity-40"
          style={{ backgroundImage: `url(${mode.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#071225]/70 to-black/75" />
        <div className="pointer-events-none absolute -inset-y-2 -left-1/3 w-1/3 rotate-12 bg-white/10 blur-xl opacity-0 transition-all duration-500 group-hover:left-[115%] group-hover:opacity-100" />
        <div className="relative flex items-center justify-between gap-3 px-4 py-3">
          <div className="transition-transform duration-300 group-hover:translate-x-0.5">
            <div className="text-xs text-white/60 transition group-hover:text-white/80">{server.ping} ping</div>
            <div className="text-2xl font-semibold leading-none text-white transition group-hover:tracking-wide">#{server.id}</div>
            <div className="mt-1 inline-flex items-center gap-2 text-sm text-white/80">
              <span className={`h-2.5 w-2.5 rounded-full ${indicatorClass}`} />
              <span>{server.players}</span>
              <span>• {server.map}</span>
            </div>
          </div>
          <div className="grid gap-1.5">
            {server.locked ? (
              <span className="inline-flex h-7 items-center justify-center rounded-lg bg-white/10 px-2 text-[11px] text-white/70 ring-1 ring-white/15 transition group-hover:bg-white/15">
                🔒
              </span>
            ) : (
              <a
                href={`steam://connect/${server.ip}`}
                className="inline-flex h-7 items-center justify-center rounded-lg bg-white/10 px-2 text-[11px] font-semibold text-white ring-1 ring-white/15 transition hover:bg-[#f3c969] hover:text-black hover:ring-[#f3c969]/60"
              >
                Підкл.
              </a>
            )}
            <button
              type="button"
              onClick={() => copyIp(server.ip, String(server.id))}
              className="inline-flex h-7 items-center justify-center rounded-lg bg-white/5 px-2 text-[11px] text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white hover:ring-white/20"
            >
              {copiedKey === String(server.id) ? 'Скопійовано' : 'IP'}
            </button>
          </div>
        </div>
      </div>
    )})}
  </div>
</div>
            {/* вњ… РџР РђР’Рђ РљРћР›РћРќРљРђ: flex + min-h-0 (С†Рµ СЂРѕР±РёС‚СЊ СЃРєСЂРѕР» РјРѕР¶Р»РёРІРёРј) */}
            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0 flex flex-col min-h-0">
              {commandsOpen ? (
                <div className="flex flex-1 flex-col min-h-0 rounded-2xl bg-black/25 ring-1 ring-white/10">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">
                    <div className="text-sm font-semibold text-white/90">Команди сервера</div>

                    <button
                      type="button"
                      onClick={() => setCommandsOpen(false)}
                      className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15 active:scale-95"
                    >
                      Закрити
                    </button>
                  </div>

                  {/* вњ… Scroll area */}
                  <div
  className="flex-1 min-h-0 overflow-y-scroll p-5 space-y-3 pr-3 relative z-10 pointer-events-auto custom-scroll"
  onWheel={(e) => e.stopPropagation()}
>

                    <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10">
                      /connect {mode.ip}
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10">
                      /rank
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10">
                      /stats
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10">
                      /top
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10">
                      /report
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10">
                      /settings
                    </div>

                    {/* С‰РѕР± С‚РѕС‡РЅРѕ РїРµСЂРµРІС–СЂРёС‚Рё СЃРєСЂРѕР» */}
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10"
                      >
                        /future_command_{i + 1}
                      </div>
                    ))}

                    <div className="rounded-xl bg-white/5 p-3 text-xs text-white/60 ring-1 ring-white/10">
                      Тут можна буде додати опис кожної команди та пояснення.
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={requestClose}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-white/10 border border-white/15 transition-all duration-200 hover:bg-white/15 hover:border-white/30 active:scale-95"
                    >
                      Закрити ✕
                    </button>
                  </div>

                  <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white/90">Швидкі дані</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-[11px] text-white/55">Онлайн</div>
                        <div className="mt-1 text-lg font-semibold text-white">{mode.online}</div>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-[11px] text-white/55">Режим</div>
                        <div className="mt-1 text-lg font-semibold text-white">{mode.tag}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white/90">Про сервер</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{mode.description}</p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {mode.features.map((f) => (
                        <div
                          key={f}
                          className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75 ring-1 ring-white/10"
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-2" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

