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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-1955893232253258";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "BLACKARCHIVE",
      url: SITE_URL,
      description: "안전한 거래를 위한 블랙컨슈머 제보 및 검색 서비스",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "BLACKARCHIVE",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "ko-KR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="985014f4ac67680cdea4dbd3395ad557fc22dca1" />
        <meta name="google-site-verification" content="5m9WrjHo6HZ1aRzDjKvDEtLsv1Egv2K2yi-clQ1WHfk" />
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
