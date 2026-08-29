import { createClient } from "@supabase/supabase-js";

// ponytail: 공개 키라 코드에 직접 넣음 (anon key는 브라우저에 노출되는 값이 원래 맞음, 보안은 RLS가 담당)
// Supabase 대시보드 > Settings > API에서 복사해서 아래 두 줄만 채우고 커밋/푸시하면 끝
const SUPABASE_URL = "https://lmwywpgpcxgvfoiieumu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtd3l3cGdwY3hndmZvaWlldW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTI1NjgsImV4cCI6MjEwMzE2ODU2OH0.xfJgu1pr6lyaqRC6v_PyWIeiKPxjLHAK3sqWaM_HiRo";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-key"
);
