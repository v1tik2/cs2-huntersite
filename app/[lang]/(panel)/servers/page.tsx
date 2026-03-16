import { HeroBanners } from './components/HeroBanners';
import { ModeGrid } from './components/ModeGrid';
import Link from 'next/link';

export default function ServersPage({
  params,
}: {
  params: { lang: 'uk' | 'en' };
}) {
  const lang = params.lang;

  const T = {
    offersTitle: lang === 'uk' ? 'Пропозиції' : 'Offers',
    offer1Title:
      lang === 'uk' ? 'Відкрити вітальний кейс' : 'Open welcome case',
    offer1Desc:
      lang === 'uk'
        ? 'Забери перший безкоштовний кейс та стартові бонуси.'
        : 'Claim your first free case and starter bonuses.',
    offer1Btn: lang === 'uk' ? 'Відкрити' : 'Open',

    offer2Title: lang === 'uk' ? 'Щоденний бонус' : 'Daily bonus',
    offer2Desc:
      lang === 'uk'
        ? 'Заходь щодня та отримуй монети для обміну.'
        : 'Log in daily and earn coins to redeem.',
    offer2Btn: lang === 'uk' ? 'Забрати' : 'Claim',

    offer3Title: lang === 'uk' ? 'Новини сервера' : 'Server news',
    offer3Desc:
      lang === 'uk'
        ? 'Оновлення, події та важливі оголошення.'
        : 'Updates, events, and important announcements.',
    offer3Btn: lang === 'uk' ? 'Перейти' : 'Open',
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      <HeroBanners lang={lang} />

      {/* ModeGrid */}
      <ModeGrid />
    </div>
  );
}

function OfferCard({
  icon,
  title,
  desc,
  actionLabel,
  href,
  accent,
}: {
  icon: string;
  title: string;
  desc: string;
  actionLabel: string;
  href: string;
  accent: string;
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10',
        'p-5',
      ].join(' ')}
    >
      {/* subtle gradient accent */}
      <div
        className={[
          'pointer-events-none absolute inset-0 bg-gradient-to-br',
          accent,
        ].join(' ')}
      />
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-30" />

      <div className="relative flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 text-white/90">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-base font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/60">{desc}</div>

          <div className="mt-4">
            <Link
              href={href}
              className="
                inline-flex items-center gap-2
                rounded-xl bg-white/10 px-4 py-2
                text-sm font-semibold text-white
                ring-1 ring-white/10
                hover:bg-white/15 hover:ring-white/15
                transition active:scale-[0.98]
              "
            >
              {actionLabel} <span className="text-white/60">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
