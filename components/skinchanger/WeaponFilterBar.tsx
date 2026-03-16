'use client';

import type { WeaponTab } from '@/lib/skinchangerMock';

const tabs: Array<{
  key: WeaponTab;
  label: string;
  Icon: (p: { active: boolean }) => JSX.Element;
}> = [
  { key: 'Knife', label: 'Knife', Icon: KnifeIcon },
  { key: 'Gloves', label: 'Gloves', Icon: GlovesIcon },
  { key: 'Rifles', label: 'Rifles', Icon: RifleIcon },
  { key: 'Snipers', label: 'Snipers', Icon: SniperIcon },
  { key: 'Pistols', label: 'Pistols', Icon: PistolIcon },
  { key: 'SMG', label: 'SMG', Icon: SmgIcon },
  { key: 'Heavy', label: 'Heavy', Icon: HeavyIcon },
];

export function WeaponFilterBar({
  tab,
  onTabChange,
  query,
  onQueryChange,
  count,
  selectedName,
  canInstall,
  onInstall,
}: {
  tab: WeaponTab;
  onTabChange: (t: WeaponTab) => void;
  query: string;
  onQueryChange: (v: string) => void;
  count: number;
  selectedName?: string;
  canInstall: boolean;
  onInstall: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* left: weapon menu */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-black/20 p-1 ring-1 ring-white/10">
            {/* grid button (як у скріні) */}
            <button
              className="grid place-items-center rounded-lg px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 bg-black/20 hover:bg-white/10 transition"
              title="Grid"
              type="button"
            >
              <GridIcon />
            </button>

            {/* weapon icons */}
            <div className="flex items-center gap-1">
              {tabs.map(({ key, Icon, label }) => {
                const active = key === tab;

                // ПОКИ що дозволяємо клік тільки на Knife

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onTabChange(key)}
                    className={[
                      'grid place-items-center rounded-lg px-3 py-2 transition ring-1',
                      active
                        ? 'bg-[#f3c969]/15 ring-[#f3c969]/35 text-[#f3c969]'
                        : 'bg-black/20 ring-white/10 text-white/75 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                    title={label}
                  >
                    <Icon active={active} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-white/60">
            Показано: <span className="text-white/80">{count}</span>
            {selectedName ? (
              <>
                <span className="mx-2 text-white/30">•</span>
                <span className="text-white/60">Вибрано:</span>{' '}
                <span className="text-white/80">{selectedName}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* right */}
        <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
          <div className="w-full lg:w-[260px]">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Пошук скіна"
              className="w-full rounded-xl bg-black/20 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-white/20"
            />
          </div>

          <button
            onClick={onInstall}
            disabled={!canInstall}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              canInstall
                ? 'bg-white text-black hover:brightness-110'
                : 'bg-white/15 text-white/40 cursor-not-allowed',
            ].join(' ')}
          >
            Встановити
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Icons (простий силует, щоб не лагало) ===== */
function GridIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
    >
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function KnifeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M3 21l6.5-6.5c.7-.7 1.8-.7 2.5 0l.5.5L21 6.5 17.5 3 9 11.5l.5.5c.7.7.7 1.8 0 2.5L3 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlovesIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M7 11V6.5A2.5 2.5 0 0 1 9.5 4H10v7M12 11V5.8A1.8 1.8 0 0 1 13.8 4H14v7M17 12V7.2A1.2 1.2 0 0 0 15.8 6H15v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 11l-1.2 2.2a6 6 0 0 0 1.2 7.1l.8.7h6.8l2.1-2.3A6 6 0 0 0 18 14v-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RifleIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 28 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M2 14h12l4-3h8v3h-5l-2 2H9l-2 2H4l-2-2v-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SniperIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 28 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M2 13h16l4-2h4v3h-4l-2 2H8l-2 2H3l-1-1v-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 9h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PistolIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M4 9h10l2 2h2v4h-4l-2 5H9l1-5H6l-2-2V9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmgIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M3 12h12l3-2h3v3h-3l-2 2H9l-2 2H5l-2-2v-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 16v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeavyIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="18"
      viewBox="0 0 28 24"
      fill="none"
      className={active ? 'opacity-100' : 'opacity-80'}
    >
      <path
        d="M2 13h14l4-2h6v3h-6l-2 2H9l-2 2H3l-1-1v-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11 15v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
