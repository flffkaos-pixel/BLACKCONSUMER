import type { Metadata } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import ReportDetail from "./detail-client";

type Props = { params: Promise<{ id: string }> };

async function fetchReport(id: string) {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const url = absoluteUrl(`/report/${id}`);
  const data = await fetchReport(id);

  const title = data
    ? `${data.name} ${data.age_group ?? ""} ${data.damage_type} 제보`
    : "제보 기록";
  const description = data
    ? `[${data.damage_type}] ${data.description.slice(0, 100)}`
    : "블랙컨슈머 디지털 아카이브 제보 기록";

  return {
    title,
    description,
    alternates: { canonical: `/report/${id}` },
    openGraph: { title, description, type: "article", url, locale: "ko_KR" },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const data = await fetchReport(id);
  const url = absoluteUrl(`/report/${id}`);

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
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        publisher: { "@id": `${SITE_URL}/#organization` },
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
      <ReportDetail id={id} initialReport={data ?? null} />
    </>
  );
}