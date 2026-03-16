import TopPlayersClient from './TopPlayersClient';

export default function TopPlayersPage({
  params,
}: {
  params: { lang: 'uk' | 'en' };
}) {
  return <TopPlayersClient lang={params.lang} />;
}
