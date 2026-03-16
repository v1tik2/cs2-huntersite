'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function UserMenu({
  lang,
  avatarUrl,
}: {
  lang: 'uk' | 'en';
  avatarUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Закриття при кліку поза меню
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = [
    {
      label: lang === 'uk' ? 'Профіль' : 'Profile',
      href: `/${lang}/profile`,
    },
    {
      label: lang === 'uk' ? 'Інвентар' : 'Inventory',
      href: `/${lang}/inventory`,
    },
    {
      label: 'Skinchanger',
      href: `/${lang}/skinchanger`,
    },
    {
      label: lang === 'uk' ? 'Друзі' : 'Friends',
      href: `/${lang}/friends`,
    },
    {
      label: lang === 'uk' ? 'Реферали' : 'Referrals',
      href: `/${lang}/referrals`,
    },
    {
      label: lang === 'uk' ? 'Налаштування' : 'Settings',
      href: `/${lang}/settings`,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      {/* Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          h-10 w-10 overflow-hidden rounded-full
          ring-1 ring-white/10
          hover:ring-white/20
          transition
        "
      >
        <img
          src={avatarUrl}
          alt="avatar"
          className="h-full w-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-60
            rounded-2xl bg-[#0f1720]
            ring-1 ring-white/10
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            p-2
            z-50
          "
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="
                block rounded-xl px-4 py-2 text-sm text-white/80
                hover:bg-white/5 hover:text-white
                transition
              "
            >
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-2 h-px bg-white/10" />

          {/* Logout */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `/api/auth/logout?next=/${lang}/servers`;
            }}
            className="
              w-full rounded-xl px-4 py-2 text-sm font-semibold
              text-red-400
              bg-red-500/10
              ring-1 ring-red-500/20
              hover:bg-red-500/20 hover:text-red-300
              transition
            "
          >
            {lang === 'uk' ? 'Вихід' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}
