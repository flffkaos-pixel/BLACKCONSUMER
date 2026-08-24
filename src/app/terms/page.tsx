import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "이용약관 | BLACKARCHIVE",
};

const sections = [
  {
    title: "1. 서비스 목적",
    body: "본 서비스는 건전한 거래 문화를 위해 사용자들이 블랙컨슈머 관련 피해 사실을 공유하는 정보 아카이브입니다. 등록된 모든 내용은 제보자의 일방적 주장을 포함할 수 있으며, 이를 객관적 사실로 단정하지 않습니다.",
  },
  {
    title: "2. 금지 행위",
    body: "다음 행위는 즉시 삭제되며 법적 조치의 대상이 될 수 있습니다: ① 허위 사실 유포 ② 개인 전화번호·주민등록번호 등 마스킹되지 않은 개인정보 등록 ③ 욕설, 성희롱 등 폭력적 표현 ④ 특정인에 대한 악의적 비방 목적의 등록 ⑤ 동일 내용 반복 등록",
  },
  {
    title: "3. 법적 책임",
    body: "형법 제307조(명예훼손), 제311조(모욕), 정보통신망법 제70조에 따라 허위 사실을 유포하거나 타인을 비방할 경우 형사처벌 대상이 됩니다. 제보자는 등록 내용의 진실성에 대한 책임을 부담하며, 분쟁 발생 시 증거 자료를 제출할 의무가 있습니다.",
  },
  {
    title: "4. 정보 이용 시 주의사항",
    body: "등록된 정보는 어디까지나 참고 자료입니다. 이를 근거로 특정인과의 거래를 일방적으로 거부하는 등 불이익을 가할 경우 그에 대한 책임은 이용자 본인에게 있습니다. 본 서비스의 정보를 영업 목적(회원권 판매 등)으로 이용하는 것을 금지합니다.",
  },
  {
    title: "5. 게시물 삭제 요청",
    body: "등록된 정보로 인해 권리가 침해되었다고 판단되는 당사자는 삭제 요청을 할 수 있습니다. 요청 검토 후 허위·과도한 내용은 삭제 조치합니다.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-2">
          <ShieldAlert className="text-amber-500 w-6 h-6" />
          <a href="/" className="text-xl font-bold tracking-tighter text-white">BLACK<span className="text-amber-500">ARCHIVE</span></a>
          <span className="ml-auto"><a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">← 메인으로</a></span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12 border-l-4 border-amber-500 pl-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">이용약관 및 법적 고지</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">본 서비스를 이용하기 전 반드시 읽어주세요. 이용 시 아래 내용에 동의한 것으로 간주됩니다.</p>
        </div>

        <div className="space-y-8">
          {sections.map(s => (
            <section key={s.title} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <h2 className="text-base font-bold text-amber-500 mb-3">{s.title}</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
