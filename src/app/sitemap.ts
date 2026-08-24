import type { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// ponytail: 배포 후 실제 도메인으로 교체 (또는 환경변수 NEXT_PUBLIC_SITE_URL 사용)
const SITE_URL = "https://your-domain.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/terms`, changeFrequency: "monthly", priority: 0.3 },
  ];

  if (!isSupabaseConfigured) return staticPages;
  const { data } = await supabase.from("reports").select("id, created_at").limit(5000);
  return [
    ...staticPages,
    ...(data ?? []).map(r => ({
      url: `${base}/report/${r.id}`,
      lastModified: r.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
