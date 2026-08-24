import { createClient } from "@supabase/supabase-js";

// ponytail: 공개 키라 코드에 직접 넣음 (anon key는 브라우저에 노출되는 값이 원래 맞음, 보안은 RLS가 담당)
// Supabase 대시보드 > Settings > API에서 복사해서 아래 두 줄만 채우고 커밋/푸시하면 끝
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-key"
);
