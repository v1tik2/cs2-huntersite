"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type DurationKey = "one" | "three" | "six";

type Plan = {
  title: string;
  accent: string;
  accentText: string;
  prices: {
    one: string;
    three: string;
    six: string;
  };
  features: string[];
};

const ukPlans: Plan[] = [
  {
    title: "Лайт",
    accent: "ring-[#6f8cff]/40",
    accentText: "text-[#7da3ff]",
    prices: { one: "79 грн", three: "199 грн", six: "349 грн" },
    features: [
      "+10% XP",
      "Префікс у чаті",
      "Бейдж у профілі",
      "Резервний слот",
      "Імунітет до AWP",
      "Кастомний колір ніку в табі",
    ],
  },
  {
    title: "Преміум",
    accent: "ring-[#f3c969]/40",
    accentText: "text-[#f3c969]",
    prices: { one: "169 грн", three: "449 грн", six: "799 грн" },
    features: [
      "Унікальний титул Premium",
      "+25% XP",
      "Скінченджер фулл",
      "Пріоритет підтримки",
      "Кейс раз на тиждень",
      "Колекції скінченджер",
      "Будь-який float, pattern, якість",
      "MVP музика",
      "Відображення шкоди над ворогом",
      "Участь у турнірах на скіни",
      "+Лайт",
    ],
  },
  {
    title: "Еліте",
    accent: "ring-[#ff8c6f]/40",
    accentText: "text-[#ff9f86]",
    prices: { one: "299 грн", three: "799 грн", six: "1399 грн" },
    features: [
      "Унікальний титул ELITE",
      "+50% XP",
      "MVP-музика кастомна",
      "Кастомний knife model",
      "+Преміум",
    ],
  },
];

const enPlans: Plan[] = [
  {
    title: "Lite",
    accent: "ring-[#6f8cff]/40",
    accentText: "text-[#7da3ff]",
    prices: { one: "$2.99", three: "$7.99", six: "$13.99" },
    features: ["+10% XP", "Chat prefix", "Profile badge", "Reserved slot"],
  },
  {
    title: "Premium",
    accent: "ring-[#f3c969]/40",
    accentText: "text-[#f3c969]",
    prices: { one: "$5.99", three: "$15.99", six: "$28.99" },
    features: ["+25% XP", "Priority support", "Skinchanger full", "+Lite"],
  },
  {
    title: "Elite",
    accent: "ring-[#ff8c6f]/40",
    accentText: "text-[#ff9f86]",
    prices: { one: "$9.99", three: "$25.99", six: "$46.99" },
    features: ["+50% XP", "Custom MVP music", "Custom knife model", "+Premium"],
  },
];

export default function PremiumPage({
  params,
}: {
  params: { lang: "uk" | "en" };
}) {
  const lang = params.lang;
  const isUk = lang === "uk";
  const plans = isUk ? ukPlans : enPlans;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!selectedPlan) return;

      const selectedColumn = columnRefs.current[selectedPlan];
      if (!selectedColumn) return;

      const target = event.target as Node | null;
      if (target && !selectedColumn.contains(target)) {
        setSelectedPlan(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [selectedPlan]);

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-12">
      <section className="rounded-3xl bg-gradient-to-br from-[#0c1533] via-[#0f1c41] to-[#0a122c] p-7 ring-1 ring-[#5d7be0]/30">
        <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[#7da3ff]">
          {isUk ? "Підписка" : "Subscription"}
        </div>
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
          {isUk ? "Одна підписка для твого максимуму" : "One subscription for your best game"}
        </h1>
        <p className="mt-2 text-white/75">
          {isUk
            ? "Вибирай Лайт, Преміум або Еліте та активуй на 1, 3 або 6 місяців."
            : "Choose Lite, Premium, or Elite for 1, 3, or 6 months."}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.title}
            ref={(element) => {
              columnRefs.current[plan.title] = element;
            }}
          >
            <PlanCard
              plan={plan}
              isUk={isUk}
              isSelected={selectedPlan === plan.title}
              onToggleSelect={() =>
                setSelectedPlan((current) => (current === plan.title ? null : plan.title))
              }
            />
          </div>
        ))}
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl bg-[#f3c969] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.98]"
        >
          {isUk ? "Продовжити оплату" : "Proceed to checkout"}
        </button>
        <Link
          href={`/${lang}/servers`}
          className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
        >
          {isUk ? "Назад до серверів" : "Back to servers"}
        </Link>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  isUk,
  isSelected,
  onToggleSelect,
}: {
  plan: Plan;
  isUk: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const [duration, setDuration] = useState<DurationKey>("one");
  const [isSelecting, setIsSelecting] = useState(false);

  const durationOptions: Array<{ key: DurationKey; label: string; term: string }> = isUk
    ? [
        { key: "one", label: "1 міс", term: "1 місяць" },
        { key: "three", label: "3 міс", term: "3 місяці" },
        { key: "six", label: "6 міс", term: "6 місяців" },
      ]
    : [
        { key: "one", label: "1 mo", term: "1 month" },
        { key: "three", label: "3 mo", term: "3 months" },
        { key: "six", label: "6 mo", term: "6 months" },
      ];

  const activeTerm = durationOptions.find((option) => option.key === duration)?.term ?? "";

  const handleSelect = () => {
    onToggleSelect();
    setIsSelecting(true);
    setTimeout(() => setIsSelecting(false), 450);
  };

  return (
    <div
      className={[
        `rounded-2xl bg-gradient-to-b from-[#131f45] to-[#111a36] p-5 ring-1 ${plan.accent}`,
        "transition-all duration-300",
        isSelecting ? "scale-[1.02]" : "",
        isSelected ? "scale-[1.01] shadow-[0_0_35px_rgba(125,163,255,0.35)]" : "",
      ].join(" ")}
    >
      <div className={`text-sm font-semibold uppercase tracking-[0.15em] ${plan.accentText}`}>
        {plan.title}
      </div>

      <div className="mt-4 inline-flex rounded-xl bg-[#0c1637] p-1 ring-1 ring-white/15">
        {durationOptions.map((option) => {
          const isActive = option.key === duration;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setDuration(option.key)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                isActive ? "bg-[#5d7be0] text-white" : "text-white/70 hover:text-white",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="text-xs uppercase tracking-wide text-white/60">{activeTerm}</div>
        <div className="mt-1 text-2xl font-black text-white">{plan.prices[duration]}</div>
        <div className="text-xs text-white/60">{isUk ? "Обраний термін" : "Selected duration"}</div>
      </div>

      <div className="mt-4 space-y-2.5">
        {plan.features.map((feature) => (
          <div key={feature} className="flex gap-2 text-sm text-white/85">
            <span className={`${plan.accentText}`}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSelect}
        className={[
          "mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
          "bg-white/10 ring-1 ring-white/20 hover:bg-white/15",
          isSelecting ? "animate-pulse" : "",
          isSelected ? "bg-[#5d7be0] ring-[#7da3ff]" : "",
        ].join(" ")}
      >
        {isUk ? (isSelected ? "Вибрано" : "Вибрати") : isSelected ? "Selected" : "Select"}
      </button>
    </div>
  );
}
