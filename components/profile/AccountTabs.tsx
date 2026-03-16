'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AccountTabs({ lang }: { lang: 'uk' | 'en' }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/${lang}/profile`, uk: 'Профіль', en: 'Profile' },
    { href: `/${lang}/inventory`, uk: 'Інвентар', en: 'Inventory' },
    { href: `/${lang}/skinchanger`, uk: 'Skinchanger', en: 'Skinchanger' },
    { href: `/${lang}/stats`, uk: 'Статистика', en: 'Statistics' },
    { href: `/${lang}/friends`, uk: 'Друзі', en: 'Friends' },
    { href: `/${lang}/referrals`, uk: 'Реферали', en: 'Referrals' },
    { href: `/${lang}/settings`, uk: 'Налаштування', en: 'Settings' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = pathname === t.href;
        const label = lang === 'uk' ? t.uk : t.en;

        return (
          <Link
            key={t.href}
            href={t.href}
            className={[
              'rounded-full px-4 py-2 text-sm transition ring-1',
              active
                ? 'bg-white/10 text-white ring-white/15'
                : 'bg-white/5 text-white/70 ring-white/10 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
