import ProfilePageClient from "@/components/profile/ProfilePageClient";
import AccountLayout from "../(panel)/(account)/layout";

export default function ProfilePage({
  params,
}: {
  params: { lang: "uk" | "en" };
}) {
  return (
    <AccountLayout params={params}>
      <ProfilePageClient lang={params.lang} embedded />
    </AccountLayout>
  );
}
