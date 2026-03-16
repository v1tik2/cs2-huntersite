import { notFound } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';

const SUPPORTED = ['uk', 'en'];

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!SUPPORTED.includes(params.lang)) notFound();

  return <AppShell lang={params.lang as 'uk' | 'en'}>{children}</AppShell>;
}
