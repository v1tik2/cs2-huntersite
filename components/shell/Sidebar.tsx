'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNav, secondaryNav } from '@/lib/nav';
import { t, type Lang } from '@/lib/i18n';
import { SocialLinks } from '@/components/shell/SocialLinks';

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

export function Sidebar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const main = primaryNav(lang);
  const secondary = secondaryNav(lang);

  const profileHref = `/${lang}/profile`;
  const profileLabel = lang === 'uk' ? 'Профіль' : 'Profile';

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[300px] flex-col border-r border-white/5 bg-black/20 px-4 py-5">
      <Link
        href={`/${lang}/servers`}
        className="flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-white/5 active:scale-[0.99]"
        title={lang === 'uk' ? 'Перейти до серверів' : 'Go to servers'}
      >
        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image
            src="/logo/logo.png?v=2"
            alt="CSHunter logo"
            fill
            className="object-cover object-center scale-[1.18]"
            sizes="72px"
            priority
          />
        </div>
        <div>
          <div className="text-sm text-white/70">{t[lang].playersOnline}</div>
          <div className="text-3xl font-semibold leading-none text-white">2348</div>
        </div>
      </Link>

      <nav className="mt-6 space-y-2">
        {main.map((item) => {
          const active = pathname === item.href;
          const isPersonalMatches = item.href.includes('/personal-matches');
          const isServers = item.href.endsWith('/servers');
          const profileActive = pathname === profileHref;

          return (
            <div key={item.href} className="space-y-2">
              {isPersonalMatches ? (
                <div
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm bg-black/30 text-white/30 ring-1 ring-white/5 cursor-not-allowed"
                >
                  <span className="h-6 w-6 rounded-md bg-white/5" />
                  <span>
                    {item.label} <span className="text-white/40">(скоро)</span>
                  </span>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cx(
                    'group flex items-center gap-3 rounded-xl px-3 text-sm transition',
                    isServers ? 'py-3.5 text-lg font-semibold tracking-wide' : 'py-2',
                    active
                      ? isServers
                        ? 'bg-gradient-to-r from-blue-500/30 via-cyan-400/15 to-transparent ring-1 ring-cyan-300/40 shadow-[0_0_24px_rgba(34,211,238,0.25)]'
                        : 'bg-white/10'
                      : isServers
                        ? 'bg-white/[0.07] ring-1 ring-white/15 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-cyan-400/10 hover:to-transparent hover:ring-cyan-300/35 hover:shadow-[0_0_18px_rgba(34,211,238,0.18)]'
                        : 'hover:bg-white/5'
                  )}
                >
                  <span
                    className={cx(
                      'h-6 w-6 rounded-md bg-white/10 transition',
                      isServers && 'ring-1 ring-cyan-300/40 bg-cyan-400/10 group-hover:bg-cyan-400/20'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              )}

              {isServers && (
                <Link
                  href={profileHref}
                  className={cx(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                    profileActive ? 'bg-white/10' : 'hover:bg-white/5'
                  )}
                >
                  <span className="h-6 w-6 rounded-md bg-white/10" />
                  <span>{profileLabel}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="border-t border-white/5 pt-4">
          {secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              <span className="h-6 w-6 rounded-md bg-white/10" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 border-t border-white/5 pt-4">
          <div className="flex justify-center">
            <SocialLinks lang={lang} />
          </div>
        </div>
      </div>
    </aside>
  );
}




