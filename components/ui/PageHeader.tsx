export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-white/70">{subtitle}</p> : null}
    </div>
  );
}
