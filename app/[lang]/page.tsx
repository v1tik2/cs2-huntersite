import { redirect } from "next/navigation";

export default function LangIndex({ params }: { params: { lang: "uk" | "en" } }) {
  redirect(`/${params.lang}/servers`);
}
