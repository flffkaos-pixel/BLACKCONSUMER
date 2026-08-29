import type { Metadata } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import ReportDetail from "./detail-client";

type Props = { params: Promise<{ id: string }> };

async function fetchReport(id: string) {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase
    .from("reports")
    .select("name, age_group, gender, build, damage_type, description, appearance, location, incident_at, created_at, views")
    .eq("id", id)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const data = await fetchReport(id);

  const name = data?.name ?? "제보 기록";
  const title = data
    ? `${data.name} ${data.age_group ?? ""} ${data.damage_type} 제보 | BLACKARCHIVE`
    : "제보 기록 | BLACKARCHIVE";
  const description = data
    ? `[${data.damage_type}] ${data.description.slice(0, 100)}`
    : "블랙컨슈머 디지털 아카이브";

  return {
    title,
    description,
    alternates: { canonical: `${base}/report/${id}` },
    openGraph: { title, description, type: "article", url: `${base}/report/${id}`, locale: "ko_KR" },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const data = await fetchReport(id);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const articleJsonLd = data
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${data.name} ${data.age_group ?? ""} 블랙컨슈머 제보`,
        description: data.description,
        datePublished: data.created_at,
        dateModified: data.created_at,
        about: data.damage_type,
        inLanguage: "ko-KR",
        mainEntityOfPage: `${base}/report/${id}`,
        publisher: { "@id": `${base}/#organization` },
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <ReportDetail id={id} />
    </>
  );
}