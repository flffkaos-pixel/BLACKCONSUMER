import Link from "next/link";

export const JJOKJJOKSO_URL = "https://jjokjjokso.pages.dev/";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-lg font-bold tracking-tighter text-white mb-3">
            BLACK<span className="text-amber-500">ARCHIVE</span>
          </p>
          <p className="text-[13px] text-zinc-500 leading-relaxed">
            안전한 거래를 위한 블랙컨슈머 제보·검색 아카이브입니다. 등록된 제보는 제보자의 주장이
            포함될 수 있으며 객관적 사실로 단정하지 않습니다.
          </p>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">바로가기</h4>
          <ul className="space-y-2 text-[13px] text-zinc-400">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors">
                블랙컨슈머 검색
              </Link>
            </li>
            <li>
              <Link href="/guide" className="hover:text-amber-400 transition-colors">
                진상고객 대처 가이드
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-amber-400 transition-colors">
                이용약관 및 법적 고지
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">관련 사이트</h4>
          <ul className="space-y-2 text-[13px] text-zinc-400">
            <li>
              <a
                href={JJOKJJOKSO_URL}
                className="hover:text-emerald-400 transition-colors"
                rel="noopener"
              >
                좆좆소 (JJOKJJOKSO)
              </a>
            </li>
          </ul>
          <p className="text-[13px] text-zinc-600 leading-relaxed mt-2">
            증거와 절차를 기준으로 기업·매장을 기록하는 제보 플랫폼
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-4 text-center text-[11px] text-zinc-600">
        © {new Date().getFullYear()} BLACKARCHIVE. 등록 정보는 참고 자료입니다.
      </div>
    </footer>
  );
}
