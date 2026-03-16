'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Lang = 'uk' | 'en';

export function SkinchangerTabs() {
  const pathname = usePathname();

  // ✅ беремо lang з URL: /uk/... або /en/...
  const lang: Lang = pathname.startsWith('/en') ? 'en' : 'uk';

  const tabs = [
    { label: 'Профіль', href: `/${lang}/profile` },
    { label: 'Інвентар', href: `/${lang}/inventory` },
    { label: 'Skinchanger', href: `/${lang}/skinchanger` },
    { label: 'Статистика', href: `/${lang}/stats` },
    { label: 'Друзі', href: `/${lang}/friends` },
    { label: 'Реферали', href: `/${lang}/referrals` },
    { label: 'Налаштування', href: `/${lang}/settings` },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={[
            'rounded-full px-4 py-2 text-sm transition',
            isActive(t.href)
              ? 'bg-white/10 text-white ring-1 ring-white/10'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
          ].join(' ')}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
