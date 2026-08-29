"use client";
import { useEffect, useState } from 'react';
import { ShieldAlert, ArrowLeft, User, Share2, MapPin, Calendar, Phone, Car, Eye, Wallet, MessageSquareWarning, Flag } from 'lucide-react';
import type { Report } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import AdSlot from '@/components/AdSlot';

const fmtAmount = (n: number | null) => n == null ? null : new Intl.NumberFormat('ko-KR').format(n) + '원';

export default function ReportDetail({ id }: { id: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || id.toString().startsWith('demo-')) {
      // 데모 모드: 메인의 mock과 동일한 예시 중 id 매칭은 생략하고 안내만 표시
      setLoading(false);
      return;
    }
    supabase.from('reports').select('*').eq('id', id).single()
      .then(({ data }) => { setReport(data); setLoading(false); });
    supabase.rpc('increment_views', { report_id: id }); // ponytail: 조회수, 중복 카운트 방지는 나중에
  }, [id]);

  const flagReport = async () => {
    const { error } = await supabase.from('report_flags').insert({ report_id: id });
    if (!error) setFlagged(true);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'BLACKARCHIVE 제보 기록', url }); return; } catch { /* 취소됨 */ }
    }
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="flex items-center gap-2"><ShieldAlert className="text-amber-500 w-5 h-5" /><span className="font-bold tracking-tighter text-white">BLACK<span className="text-amber-500">ARCHIVE</span></span></span>
          </a>
          <button onClick={share} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95">
            <Share2 className="w-4 h-4" /> {shared ? '복사됨!' : '공유'}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-10 w-1/3 bg-zinc-900 rounded-xl" />
            <div className="h-64 bg-zinc-900 rounded-3xl" />
          </div>
        ) : !report ? (
          <div className="text-center py-24">
            <Eye className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-semibold mb-2">기록을 찾을 수 없습니다.</p>
            <p className="text-sm text-zinc-600">데모 모드이거나 삭제된 기록입니다. Supabase 연결 후 다시 시도하세요.</p>
          </div>
        ) : (
          <article className="space-y-8">
            {/* Header */}
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-8">
              <div className="flex items-start gap-5">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl">
                  <User className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{report.name}</h1>
                  <p className="text-zinc-500 mt-2">{report.age_group} · {report.gender} · {report.build}{report.height ? ` · ${report.height}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">등록일 {report.created_at.slice(0, 10)}</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
                  <Eye className="w-3 h-3 text-amber-500" /> {report.views}
                </span>
              </div>
            </header>

            {report.media_url && (
              <div className="overflow-hidden rounded-3xl border border-zinc-800 aspect-video">
                {/\.(mp4|webm|mov)$/i.test(report.media_url) ? (
                  <video src={report.media_url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={report.media_url} alt="증거 미디어" className="w-full h-full object-cover" />
                )}
              </div>
            )}

            {/* 식별 정보 */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Phone, label: '연락처 / 아이디', value: report.contact_info },
                { icon: Car, label: '차량 번호', value: report.vehicle_number },
                { icon: Calendar, label: '사건 일시', value: report.incident_at ? new Date(report.incident_at).toLocaleString('ko-KR') : null },
                { icon: MapPin, label: '장소', value: report.location },
                { icon: Wallet, label: '금전적 손실', value: fmtAmount(report.damage_amount) },
                { icon: MessageSquareWarning, label: '피해 유형', value: report.damage_type },
              ].filter(f => f.value).map(f => (
                <div key={f.label} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                  <f.icon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">{f.label}</p>
                    <p className="text-sm text-white font-medium break-all">{f.value}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* 본문 */}
            <section className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">인상착의 및 특징</h2>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{report.appearance || '등록된 내용이 없습니다.'}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">피해 상세</h2>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{report.description}</p>
              </div>
              {report.response_process && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">대응 과정</h2>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{report.response_process}</p>
                </div>
              )}
              {report.evidence_type && (
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">증거: {report.evidence_type}</span>
                </div>
              )}
            </section>

            {/* 허위 신고 */}
            <section className="flex justify-center">
              {flagged ? (
                <p className="text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">신고가 접수되었습니다. 관리자 검토 후 처리됩니다.</p>
              ) : (
                <button onClick={flagReport} className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 transition-colors">
                  <Flag className="w-3 h-3" /> 이 기록이 허위 제보인가요? 신고하기
                </button>
              )}
            </section>

            <AdSlot slot="2233445566" />

            <footer className="border-t border-zinc-800 pt-6 text-[11px] text-zinc-600 leading-relaxed">
              본 정보는 사용자 제보에 기반하며, 허위 사실 유포 시 명예훼손으로 처벌될 수 있습니다. 상대방 일방 주장이 포함될 수 있으므로 거래 판단 시 참고 자료로만 활용하세요. <a href="/terms" className="text-amber-500/80 underline">전체 이용약관 보기</a>
            </footer>
          </article>
        )}
      </main>
    </div>
  );
}
