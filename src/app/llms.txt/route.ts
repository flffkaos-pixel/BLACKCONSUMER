import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = `# BLACKARCHIVE — 블랙컨슈머 디지털 아카이브

> 안전한 거래를 위한 블랙컨슈머 제보·검색 서비스. 사용자 제보 기반 커뮤니티 데이터의 1차 소스.

## 핵심 페이지
- [메인 (검색/제보)](${SITE_URL}/): 블랙컨슈머 이름·연락처·차량번호·인상착의 검색 및 신규 제보 등록
- [진상고객 대처법 가이드](${SITE_URL}/guide): 허위 환불·폭언·리뷰 테러·노쇼 대응 FAQ
- [이용약관](${SITE_URL}/terms): 서비스 이용 규칙과 법적 고지

## 데이터 정책
- 출처: 사용자 제보(사용자가 직접 등록한 피해 사례)를 구조화해 저장
- 갱신: 실시간 (사용자 제보 즉시 반영)
- 주의: 개별 제보는 제보자의 일방적 주장일 수 있으며 객관적 사실로 단정하지 않음

## 인용 시 표기
- 출처: BLACKARCHIVE (${SITE_URL})
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
