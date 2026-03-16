import { t, type Lang } from './i18n';

export type NavItem = { href: string; label: string };

export const primaryNav = (lang: Lang): NavItem[] => [
  { href: `/${lang}/servers`, label: t[lang].nav.servers },
  { href: `/${lang}/personal-matches`, label: t[lang].nav.personal },
  { href: `/${lang}/skinchanger`, label: t[lang].nav.skinchanger },
];

export const secondaryNav = (lang: Lang) => [
  {
    label: lang === 'uk' ? 'Корисні команди' : 'Useful commands',
    href: `/${lang}/commands`,
  },
  {
    label: 'PRO-конфіги',
    href: `/${lang}/pro-configs`,
  },
  {
    label: lang === 'uk' ? 'Новини сервера' : 'Server news',
    href: `/${lang}/news`,
  },
];
