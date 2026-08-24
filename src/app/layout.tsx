import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "BLACKARCHIVE | 블랙컨슈머 디지털 아카이브",
    template: "%s",
  },
  description: "안전한 거래를 위한 블랙컨슈머 제보 및 검색 서비스. 이름, 연락처, 차량번호, 인상착의로 검색하세요.",
  openGraph: {
    title: "BLACKARCHIVE | 블랙컨슈머 디지털 아카이브",
    description: "안전한 거래를 위한 블랙컨슈머 제보 및 검색 서비스",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
