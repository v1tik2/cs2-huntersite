"use client";

import { SiDiscord, SiTelegram, SiTiktok, SiYoutube } from "react-icons/si";

type Lang = "uk" | "en";

const SOCIAL_LINKS = [
  {
    key: "discord",
    href: "https://discord.com",
    labelUk: "Discord",
    labelEn: "Discord",
    Icon: SiDiscord,
    glow: "hover:text-[#5865F2] hover:ring-[#5865F2]/45 hover:shadow-[0_0_22px_rgba(88,101,242,0.45)]",
  },
  {
    key: "telegram",
    href: "https://t.me",
    labelUk: "Telegram",
    labelEn: "Telegram",
    Icon: SiTelegram,
    glow: "hover:text-[#26A5E4] hover:ring-[#26A5E4]/45 hover:shadow-[0_0_22px_rgba(38,165,228,0.45)]",
  },
  {
    key: "youtube",
    href: "https://youtube.com",
    labelUk: "YouTube",
    labelEn: "YouTube",
    Icon: SiYoutube,
    glow: "hover:text-[#FF0033] hover:ring-[#FF0033]/45 hover:shadow-[0_0_22px_rgba(255,0,51,0.45)]",
  },
  {
    key: "tiktok",
    href: "https://tiktok.com",
    labelUk: "TikTok",
    labelEn: "TikTok",
    Icon: SiTiktok,
    glow: "hover:text-[#00F2EA] hover:ring-[#00F2EA]/45 hover:shadow-[0_0_22px_rgba(0,242,234,0.45)]",
  },
];

export function SocialLinks({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <div className={className || "flex items-center gap-2"}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          title={lang === "uk" ? s.labelUk : s.labelEn}
          className={[
            "grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10",
            "transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10",
            s.glow,
          ].join(" ")}
        >
          <s.Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
