export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://blackconsumer.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "BLACKARCHIVE";
export const SITE_TITLE = "BLACKARCHIVE | 블랙컨슈머 디지털 아카이브";
export const SITE_DESCRIPTION =
  "안전한 거래를 위한 블랙컨슈머 제보 및 검색 서비스. 이름, 연락처, 아이디, 차량번호, 인상착의로 검색하고 피해 제보를 등록하세요.";
export const SITE_LOCALE = "ko_KR";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
