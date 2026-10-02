import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Report } from "@/lib/types";

// DB 미연결/장애 시 보여주는 데모 데이터
export const DEMO_REPORTS: Report[] = [
  { id: 'demo-1', created_at: '2024-08-20T00:00:00Z', name: '김*철', gender: '남성', age_group: '30대', height: '175cm', build: '보통', appearance: '안경 착용, 왼쪽 턱 흉터', contact_info: '010-****-1234', vehicle_number: null, incident_at: null, location: '강남구 논현동', damage_type: '노쇼 / 결제 회피', damage_amount: 150000, description: '결제 직전 잠적 및 연락두절', response_process: '연락 시도 3회 후 접수', evidence_type: '채팅 캡처', media_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', views: 128, industry: '중고거래' },
  { id: 'demo-2', created_at: '2024-08-15T00:00:00Z', name: '이*영', gender: '여성', age_group: '20대', height: '160cm', build: '마름', appearance: '긴 생머리, 피어싱', contact_info: '@id1234', vehicle_number: null, incident_at: null, location: null, damage_type: '허위 피해 주장 / 억지 환불', damage_amount: null, description: '반복적인 단순 변심 환불 요청 및 폭언', response_process: null, evidence_type: '통화 녹취록', media_url: null, views: 42, industry: '음식점/카페' },
];

export async function fetchReports(): Promise<Report[]> {
  if (!isSupabaseConfigured) return DEMO_REPORTS;
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return DEMO_REPORTS;
    return data ?? [];
  } catch {
    return DEMO_REPORTS;
  }
}
