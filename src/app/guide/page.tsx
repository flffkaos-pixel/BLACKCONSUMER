import type { Metadata } from "next";
import { ShieldAlert, Scale, MessageCircle, FileText, Camera, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "진상고객 대처법 가이드 | BLACKARCHIVE",
  description: "블랙컨슈머 대처법: 허위 환불, 폭언, 리뷰 테러, 노쇼에 대응하는 실전 매뉴얼. 자영업자 필수 가이드.",
};

const FAQS = [
  { q: "블랙컨슈머가 무료 환불을 억지로 요구할 때 어떻게 대응해야 하나요?", a: "환불 정책을 서면(영수증·매뉴얼·안내문)으로 근거 제시하고, 규정에 없는 환불은 일관되게 거절하세요. 상대가 요구를 반복해도 한 번 정한 기준을 바꾸지 않는 것이 핵심입니다. 환불이 불가한 사유를 문서로 남기면 추후 분쟁 시 증거가 됩니다." },
  { q: "매장에서 폭언이나 고성방가를 하는 손님은 어떻게 처리하나요?", a: "즉시 CCTV 녹화를 확인하고, 중립적인 어조로 '영업 방해 시 경찰 신고 대상'임을 고지합니다. 동료 직원 한 명을 곁에 두어 목격자를 확보하고, 통화·사진·녹취 등 증거를 수집하세요. 상황이 폭력으로 번지면 즉시 112 신고합니다." },
  { q: "허위 리뷰 테러를 당했을 때 삭제 요청은 어떻게 하나요?", a: "리뷰의 허위 사실(주문 내역·결제 기록·CCTV)을 근거로 플랫폼 고객센터에 삭제를 요청합니다. 명예훼손에 해당하는 내용은 형법 제307조·정보통신망법 제70조 위반으로 고소할 수 있으며, 이 경우 사이트에 명예훼손 고의가 드러나는 자료를 첨부하세요." },
  { q: "노쇼(예약 후 무단 불참) 손실은 어떻게 최소화하나요?", a: "예약 시 선결제·예약금 정책을 도입하고, 취소 마감 시간을 명확히 고지합니다. 노쇼 시 별도의 노쇼 수수료 정책을 안내하고, 반복 노쇼자는 블랙리스트로 관리합니다. 예약 내역·미도착 기록을 문자나 앱으로 남겨 증빙을 확보하세요." },
  { q: "제품을 고객이 훼손해놓고 불량이라고 환불 요구하면?", a: "판매·배송 시점의 상태를 사진으로 남기는 관행을 만들고, 반품 접수 시 개봉·사용 흔적을 사진으로 촬영하세요. 고의 훼손 정황이 확인되면 환불을 거절할 수 있으며, 상습적이라면 경찰 고소(재물손괴)도 가능합니다." },
  { q: "증거는 무엇을 어떻게 남겨야 법적으로 도움이 되나요?", a: "채팅 캡처, 통화 녹음, CCTV, 결제 내역, 목격자 진술을 날짜와 함께 보관하세요. 개인정보(전화번호·주민번호)는 분쟁 당사자 확인 목적 외 공개를 피하고, 공개가 필요하면 일부 마스킹합니다. 확보한 증거는 6개월 이상 보관을 권장합니다." },
];

const STEPS = [
  { icon: Camera, t: "증거 확보", d: "채팅·녹음·CCTV·결제 내역을 날짜와 함께 수집" },
  { icon: FileText, t: "정책 근거 제시", d: "환불·예약·이용 규정을 서면으로 명확히 고지" },
  { icon: MessageCircle, t: "일관된 대응", d: "한 번 정한 기준을 흔들지 않고 중립적 어조 유지" },
  { icon: Scale, t: "법적 대응", d: "명예훼손·재물손괴 등은 증거 기반으로 고소 검토" },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-2">
          <ShieldAlert className="text-amber-500 w-6 h-6" />
          <a href="/" className="text-xl font-bold tracking-tighter text-white">BLACK<span className="text-amber-500">ARCHIVE</span></a>
          <span className="ml-auto"><a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">← 메인으로</a></span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">진상고객 대처법 가이드</h1>
          <p className="text-zinc-500 leading-relaxed">블랙컨슈머로 인한 매출 손실과 스트레스를 최소화하는 실전 대응 매뉴얼입니다. 먼저 증거를 확보하고, 정책 근거를 제시하며 일관되게 대응하세요.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {STEPS.map((s, i) => (
            <div key={s.t} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
              <div className="bg-amber-500/10 p-3 rounded-xl shrink-0">
                <s.icon className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">STEP {i + 1}</p>
                <h2 className="text-white font-bold mb-1">{s.t}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            {FAQS.map(f => (
              <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <summary className="flex items-center gap-3 p-6 cursor-pointer list-none">
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 transition-transform group-open:rotate-90" />
                  <span className="text-white font-medium">{f.q}</span>
                </summary>
                <p className="px-6 pb-6 text-zinc-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-800 pt-6 text-[11px] text-zinc-600 leading-relaxed">
          본 가이드는 일반적인 대응 원칙을 안내하며, 구체적인 법률 상담은 변호사 등 전문가에게 받으세요.
        </footer>
      </main>
    </div>
  );
}