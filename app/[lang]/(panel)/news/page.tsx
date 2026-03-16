export default function NewsPage({
  params,
}: {
  params: { lang: 'uk' | 'en' };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">
        {params.lang === 'uk' ? 'Новини сервера' : 'Server news'}
      </h1>

      <div className="rounded-2xl bg-black/20 p-6 ring-1 ring-white/10">
        <p className="text-white/70">
          {params.lang === 'uk'
            ? 'Останні оновлення та новини серверу.'
            : 'Latest updates and server news.'}
        </p>
      </div>
    </div>
  );
}
