import type { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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
