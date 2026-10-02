import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { fetchReports } from "@/lib/reports";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "BLACKARCHIVE | 블랙컨슈머 디지털 아카이브",
    description:
      "안전한 거래를 위한 블랙컨슈머 제보 및 검색 서비스. 이름, 연락처, 아이디, 차량번호, 인상착의로 검색하세요.",
  },
};

export default async function HomePage() {
  const reports = await fetchReports();
  return <HomeClient initialReports={reports} />;
}
