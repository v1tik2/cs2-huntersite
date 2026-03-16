'use client';

import { useMemo, useState } from 'react';
import { modes } from '@/lib/mock';

export function ServersToolbar({
  onChange,
}: {
  onChange: (opts: { query: string; tag: string }) => void;
}) {
  const tags = useMemo(() => {
    const s = new Set<string>(['All']);
    modes.forEach((m) => s.add(m.tag));
    return Array.from(s);
  }, []);

  const [tag, setTag] = useState('All');
  const [query, setQuery] = useState('');

  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = t === tag;
            return (
              <button
                key={t}
                onClick={() => {
                  setTag(t);
                  onChange({ query, tag: t });
                }}
                className={[
                  'rounded-xl px-3 py-2 text-xs transition',
                  active
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                    : 'bg-black/20 text-white/75 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="w-full lg:w-[320px]">
          <input
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              onChange({ query: v, tag });
            }}
            placeholder="Пошук режиму…"
            className="w-full rounded-xl bg-black/20 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-white/20"
          />
        </div>
      </div>
    </div>
  );
}
