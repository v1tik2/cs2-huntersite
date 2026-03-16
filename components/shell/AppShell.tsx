'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Sidebar } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { LanguageSwitcher } from '@/components/shell/LanguageSwitcher';
import { PRIVILEGE_CHANGED_EVENT } from '@/lib/rewardsStorage';

type Lang = 'uk' | 'en';

type MeResponse =
  | { steamId: string; profile?: { personaname?: string; avatarfull?: string } }
  | {
      ok: true;
      id?: string;
      avatarUrl?: string;
      name?: string;
      privilege?: { titleUk?: string; titleEn?: string; durationUk?: string; durationEn?: string } | null;
    }
  | { ok: false }
  | null;

async function fetchMe(): Promise<MeResponse> {
  try {
    const r1 = await fetch('/api/me', { cache: 'no-store' });
    if (r1.ok) return (await r1.json()) as MeResponse;
  } catch {}

  try {
    const r2 = await fetch('/api/auth/me', { cache: 'no-store' });
    if (r2.ok) return (await r2.json()) as MeResponse;
  } catch {}

  return null;
}

export function AppShell({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Lang;
}) {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [activePrivilegeLabel, setActivePrivilegeLabel] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const data = await fetchMe();

      const authed =
        Boolean((data as any)?.steamId) ||
        Boolean((data as any)?.id) ||
        Boolean((data as any)?.ok === true);

      if (!alive) return;
      setIsAuthed(authed);

      const p = (data as any)?.privilege;
      if (p?.titleUk || p?.titleEn) {
        setActivePrivilegeLabel(
          lang === 'uk' ? `${p.titleUk || 'Привілегія'} (${p.durationUk || ''})` : `${p.titleEn || 'Privilege'} (${p.durationEn || ''})`
        );
      } else {
        setActivePrivilegeLabel(null);
      }
    };

    run();
    const onPrivilegeChanged = () => {
      run();
    };
    window.addEventListener(PRIVILEGE_CHANGED_EVENT, onPrivilegeChanged);
    window.addEventListener('storage', onPrivilegeChanged);

    return () => {
      alive = false;
      window.removeEventListener(PRIVILEGE_CHANGED_EVENT, onPrivilegeChanged);
      window.removeEventListener('storage', onPrivilegeChanged);
    };
  }, [lang]);

  return (
    <div className="min-h-screen">
      <Sidebar lang={lang} />

      <div className="pl-[300px]">
        <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1118]/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <LanguageSwitcher />

              {isAuthed && (
                <Link
                  href={`/${lang}/premium`}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold ring-1 transition active:scale-95',
                    activePrivilegeLabel
                      ? 'bg-[#1f345f] text-[#b7cfff] ring-[#6d92e6]/45 hover:bg-[#274173]'
                      : 'bg-[#f3c969] text-black ring-black/10 hover:brightness-110',
                  ].join(' ')}
                >
                  👑 {activePrivilegeLabel || (lang === 'uk' ? 'Отримати Преміум' : 'Get Premium')}
                </Link>
              )}
            </div>

            <TopBar lang={lang} />
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
