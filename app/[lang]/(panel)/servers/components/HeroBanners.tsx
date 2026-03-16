'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export function HeroBanners({ lang }: { lang: 'uk' | 'en' }) {
  const T = useMemo(
    () => ({
      title:
        lang === 'uk'
          ? 'Отримуй скіни, просто граючи\nна наших серверах!'
          : 'Get skins just by playing\non our servers!',
      subtitle:
        lang === 'uk'
          ? 'Тут буде твій авторський текст. Структура як у референсі: заголовок, опис і блоки статистики.'
          : 'Your custom text goes here. Structure like the reference: headline, description, and stat blocks.',
      players: lang === 'uk' ? 'Всього гравців' : 'Total players',
      today: lang === 'uk' ? 'Гравців за тиждень' : 'Players per week',
      peak: lang === 'uk' ? 'Макс. онлайн сьогодні' : 'Max. online today',
      topTitle: lang === 'uk' ? 'Топ гравці' : 'Top players',
      topSub: lang === 'uk' ? 'Рейтинг та статистика' : 'Leaderboard & stats',
    }),
    [lang]
  );

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl ring-1 ring-white/10 bg-gradient-to-br from-[#121a24] via-[#0f1720] to-[#0b1118]">
        <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 -bottom-36 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative p-6 sm:p-7">
          <h1 className="text-[26px] sm:text-[30px] font-semibold leading-tight text-white whitespace-pre-line">
            {T.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/65">{T.subtitle}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <MiniStat label={T.players} value={5_845_677} lang={lang} />
            <MiniStat label={T.today} value={12_840} lang={lang} />
            <MiniStat label={T.peak} value={742} lang={lang} />

            <Link
              href={`/${lang}/top-players`}
              className="group relative overflow-hidden rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/15 transition"
              title={T.topTitle}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/30 ring-1 ring-white/10">
                    🏆
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {T.topTitle}
                    </div>
                    <div className="text-xs text-white/60">{T.topSub}</div>
                  </div>
                </div>
                <div className="text-white/60 group-hover:text-white transition">
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 bg-gradient-to-br from-[#16202b] to-[#0e141b] p-6">
        <div className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-white/6 blur-3xl" />
        <OffersCarousel lang={lang} />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  lang,
}: {
  label: string;
  value: number;
  lang: 'uk' | 'en';
}) {
  const [display, setDisplay] = useState(0);

  const formatted = useMemo(() => {
    return new Intl.NumberFormat(lang === 'uk' ? 'uk-UA' : 'en-US').format(
      display
    );
  }, [display, lang]);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setDisplay(value);
      return;
    }

    const duration = 850;
    const start = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="rounded-2xl bg-black/25 px-4 py-4 ring-1 ring-white/10 backdrop-blur">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{formatted}</div>
    </div>
  );
}

function OffersCarousel({ lang }: { lang: 'uk' | 'en' }) {
  const offers = useMemo(
    () => [
      {
        title: lang === 'uk' ? 'Вітальний кейс' : 'Welcome case',
        desc:
          lang === 'uk'
            ? 'Безкоштовний стартовий бонус.'
            : 'Free starter bonus. Can be opened once.',
        action: lang === 'uk' ? 'Відкрити' : 'Open',
        href: `/${lang}/cases`,
        icon: '🎁',
      },
      {
        title: lang === 'uk' ? 'Щотижневий бонус' : 'Weekly bonus',
        desc:
          lang === 'uk'
            ? 'Забирай бонус раз на тиждень безкоштовно.'
            : 'Claim a free bonus once per week.',
        action: lang === 'uk' ? 'Забрати' : 'Claim',
        href: `/${lang}/cases`,
        icon: '🪙',
      },
      {
        title: lang === 'uk' ? 'Новини сервера' : 'Server news',
        desc:
          lang === 'uk'
            ? 'Оновлення, події та важливі оголошення.'
            : 'Updates, events, and important announcements.',
        action: lang === 'uk' ? 'Перейти' : 'Go',
        href: `/${lang}/info/news`,
        icon: '📰',
      },
    ],
    [lang]
  );

  const [i, setI] = useState(0);
  const total = offers.length;

  const prev = () => setI((v) => (v - 1 + total) % total);
  const next = () => setI((v) => (v + 1) % total);

  const [startX, setStartX] = useState<number | null>(null);

  return (
    <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-xs font-semibold text-white/70">
          {lang === 'uk' ? 'Пропозиції' : 'Offers'}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
            aria-label="Prev"
            title={lang === 'uk' ? 'Назад' : 'Previous'}
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
            aria-label="Next"
            title={lang === 'uk' ? 'Вперед' : 'Next'}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="p-4"
        onTouchStart={(e) => setStartX(e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (startX == null) return;
          const endX = e.changedTouches[0]?.clientX ?? startX;
          const dx = endX - startX;
          if (Math.abs(dx) > 40) {
            dx > 0 ? prev() : next();
          }
          setStartX(null);
        }}
      >
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/30 ring-1 ring-white/10">
              {offers[i].icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">
                {offers[i].title}
              </div>
              <div className="mt-1 text-xs text-white/60">{offers[i].desc}</div>

              <Link
                href={offers[i].href}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20 hover:ring-white/25 transition active:scale-95"
              >
                {offers[i].action}
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {offers.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                className={[
                  'h-1.5 rounded-full transition',
                  idx === i
                    ? 'w-6 bg-white/70'
                    : 'w-2 bg-white/25 hover:bg-white/40',
                ].join(' ')}
                aria-label={`Go to ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
