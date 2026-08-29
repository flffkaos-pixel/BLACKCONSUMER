"use client";
import { useEffect } from "react";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? "";

export default function AdSlot({ slot }: { slot: string }) {
  useEffect(() => {
    if (!ADSENSE_ID) return;
    try {
      // ponytail: 애드센스 자동 노출 (auto ads 아님, 고정 슬롯)
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* 광고 차단기 등으로 스킵 */
    }
  }, []);

  if (!ADSENSE_ID) return null;

  return (
    <div className="my-6 flex justify-center min-h-[90px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}