import type { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    {
      url: `${SITE_URL}/guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  if (!isSupabaseConfigured) return staticPages;
  const { data } = await supabase.from("reports").select("id, created_at").limit(5000);
  return [
    ...staticPages,
    ...(data ?? []).map(r => ({
      url: `${SITE_URL}/report/${r.id}`,
      lastModified: r.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
