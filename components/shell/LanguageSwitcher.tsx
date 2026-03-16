'use client';

import { usePathname, useRouter } from 'next/navigation';

const locales = [
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/');
  const current = locales.some((l) => l.code === segments[1])
    ? segments[1]
    : 'uk';

  function changeLocale(locale: string) {
    if (locale === current) return;

    segments[1] = locale;
    const newPath = segments.join('/') || `/${locale}`;
    router.push(newPath);
  }

  return (
    <div className="flex items-center rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
      {locales.map((locale) => {
        const active = locale.code === current;

        return (
          <button
            key={locale.code}
            onClick={() => changeLocale(locale.code)}
            className={[
              'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300',
              active
                ? 'bg-white text-black shadow'
                : 'text-white/70 hover:text-white',
            ].join(' ')}
          >
            {/* 🇺🇦 hover gradient */}
            {!active && (
              <span className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100 bg-gradient-to-r from-blue-500/20 to-yellow-400/20" />
            )}

            <span className="relative z-10">{locale.label}</span>
          </button>
        );
      })}
    </div>
  );
}
