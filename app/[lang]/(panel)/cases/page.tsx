import { CasesClient } from '@/components/cases/CasesClient';

export default function CasesPage({
  params,
}: {
  params: { lang: 'uk' | 'en' };
}) {
  const lang = params.lang;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {lang === 'uk' ? 'Кейси' : 'Cases'}
        </h1>
        <p className="mt-1 text-sm text-white/60">
          {lang === 'uk'
            ? 'Відкривай кейси та отримуй нагороди.'
            : 'Open cases and claim rewards.'}
        </p>
      </div>

      <CasesClient lang={lang} />
    </div>
  );
}
