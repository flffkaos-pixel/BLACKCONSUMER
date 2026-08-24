import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.startsWith("여기에")
);

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-key"
);
