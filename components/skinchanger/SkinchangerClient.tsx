"use client";

import { useMemo, useState } from "react";
import { LeftCollectionPanel } from "@/components/skinchanger/LeftCollectionPanel";
import { WeaponFilterBar } from "@/components/skinchanger/WeaponFilterBar";
import { ItemGrid } from "@/components/skinchanger/ItemGrid";
import { KnifeSkinsModal } from "@/components/skinchanger/KnifeSkinsModal";
import {
  skinItemsMock,
  type SkinItem,
  type WeaponTab,
  knifeSkinsByKnife,
  type KnifeFinish,
} from "@/lib/skinchangerMock";

export function SkinchangerClient() {
  const [tab, setTab] = useState<WeaponTab>("Knife");
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [activeKnife, setActiveKnife] = useState<{ id: string; name: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skinItemsMock.filter((it) => {
      const okTab = it.weapon === tab;
      const okQuery = !q || it.name.toLowerCase().includes(q);
      return okTab && okQuery;
    });
  }, [tab, query]);

  const finishes: KnifeFinish[] = useMemo(() => {
    if (!activeKnife) return [];
    return knifeSkinsByKnife[activeKnife.id] ?? [];
  }, [activeKnife]);

  function installFinish(finish: KnifeFinish) {
    if (!activeKnife) return;
    alert(`✅ Встановлено: ${activeKnife.name} | ${finish.name}`);
    setModalOpen(false);
  }

  function pickSimple(id: string, name: string) {
    alert(`✅ Обрано: ${name}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <LeftCollectionPanel />
      </div>

      <div className="lg:col-span-9 space-y-4">
        <WeaponFilterBar
          tab={tab}
          onTabChange={(t) => {
            setTab(t);
            setQuery("");
            setModalOpen(false);
            setActiveKnife(null);
          }}
          query={query}
          onQueryChange={setQuery}
          count={filtered.length}
          selectedName={tab === "Knife" ? activeKnife?.name : undefined}
          canInstall={false}
          onInstall={() => {}}
        />

        <ItemGrid
          items={filtered as SkinItem[]}
          tab={tab}
          onOpenKnife={(knifeId: string, knifeName: string) => {
            setActiveKnife({ id: knifeId, name: knifeName });
            setModalOpen(true);
          }}
          onPickSimple={pickSimple}
        />

        <KnifeSkinsModal
          open={modalOpen && tab === "Knife" && !!activeKnife}
          knifeName={activeKnife?.name ?? ""}
          finishes={finishes}
          onClose={() => setModalOpen(false)}
          onInstall={installFinish}
        />
      </div>
    </div>
  );
}
