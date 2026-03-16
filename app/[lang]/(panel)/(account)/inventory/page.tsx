import { InventoryClient } from "@/components/profile/InventoryClient";

export default function InventoryPage({
  params,
}: {
  params: { lang: "uk" | "en" };
}) {
  return <InventoryClient lang={params.lang} />;
}
