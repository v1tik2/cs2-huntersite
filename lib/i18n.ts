export const SUPPORTED_LANGS = ["uk", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export function isLang(x: string): x is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(x);
}

export const t = {
  uk: {
    topTitle: "CS2 сервери та режими",
    login: "Увійти через Steam",
    nav: {
      servers: "Сервери",
      personal: "Персональні матчі",
      skinchanger: "Skinchanger",
      pro: "PRO-конфіги",
      faq: "FAQ",
      blog: "Блог",
    },
    playersOnline: "Гравців онлайн",
  },
  en: {
    topTitle: "CS2 servers and modes",
    login: "Sign in with Steam",
    nav: {
      servers: "Servers",
      personal: "Personal matches",
      skinchanger: "Skinchanger",
      pro: "PRO Configs",
      faq: "FAQ",
      blog: "Blog",
    },
    playersOnline: "Players online",
  },
} as const;
