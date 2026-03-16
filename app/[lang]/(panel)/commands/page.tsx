export default function CommandsPage({
  params,
}: {
  params: { lang: "uk" | "en" };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">
        {params.lang === "uk" ? "Корисні команди" : "Useful commands"}
      </h1>

      <div className="rounded-2xl bg-black/20 p-6 ring-1 ring-white/10">
        <p className="text-white/70">
          {params.lang === "uk"
            ? "Тут будуть корисні команди для серверів."
            : "Useful server commands will be listed here."}
        </p>
      </div>
    </div>
  );
}
