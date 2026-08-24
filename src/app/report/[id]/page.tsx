import type { Metadata } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import ReportDetail from "./detail-client";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let title = "제보 기록 | BLACKARCHIVE";
  let description = "블랙컨슈머 디지털 아카이브";

  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from("reports")
      .select("name, age_group, damage_type, description")
      .eq("id", id)
      .single();
    if (data) {
      title = `${data.name} ${data.age_group ?? ""} 제보 기록 | BLACKARCHIVE`;
      description = `[${data.damage_type}] ${data.description.slice(0, 80)}`;
    }
  }

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ReportDetail id={id} />;
}
