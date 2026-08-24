"use client";
import React, { useEffect, useState } from 'react';
import { Search, UserPlus, ShieldAlert, Filter, User, Info, X, ExternalLink, Database, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Report } from '@/lib/types';

// ponytail: DB 미연결 시 보여주는 데모 데이터. .env.local 채우면 사라짐
const MOCK_DATA: Report[] = [
  { id: 'demo-1', created_at: '2024-08-20T00:00:00Z', name: '김*철', gender: '남성', age_group: '30대', height: '175cm', build: '보통', appearance: '안경 착용, 왼쪽 턱 흉터', contact_info: '010-****-1234', vehicle_number: null, incident_at: null, location: '강남구 논현동', damage_type: '노쇼 / 결제 회피', damage_amount: 150000, description: '결제 직전 잠적 및 연락두절', response_process: '연락 시도 3회 후 접수', evidence_type: '채팅 캡처', media_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', views: 128 },
  { id: 'demo-2', created_at: '2024-08-15T00:00:00Z', name: '이*영', gender: '여성', age_group: '20대', height: '160cm', build: '마름', appearance: '긴 생머리, 피어싱', contact_info: '@id1234', vehicle_number: null, incident_at: null, location: null, damage_type: '허위 피해 주장 / 억지 환불', damage_amount: null, description: '반복적인 단순 변심 환불 요청 및 폭언', response_process: null, evidence_type: '통화 녹취록', media_url: null, views: 42 },
];

const emptyForm = {
  name: '', gender: '남성', age_group: '20대', height: '', build: '보통',
  contact_info: '', vehicle_number: '', appearance: '',
  incident_date: '', incident_time: '', location: '',
  damage_type: '허위 피해 주장 / 억지 환불', damage_amount: '', description: '', response_process: '',
  evidence_type: '채팅 캡처', media_url: '',
};

const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all";

export default function BlackArchive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [filter, setFilter] = useState({ gender: '전체', build: '전체' });
  const [reports, setReports] = useState<Report[]>(MOCK_DATA);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [form, setForm] = useState(emptyForm);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from('reports').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setReports(data ?? []); setLoading(false); });
  }, []);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { alert('데모 모드입니다. Supabase 연결 후 실제 저장됩니다.'); return; }
    setSubmitting(true);
    try {
      let mediaUrl: string | null = form.media_url || null;
      if (mediaFile) {
        const path = `${Date.now()}_${mediaFile.name}`;
        const { error: upErr } = await supabase.storage.from('evidence').upload(path, mediaFile);
        if (upErr) { alert('파일 업로드 실패: ' + upErr.message); return; }
        mediaUrl = supabase.storage.from('evidence').getPublicUrl(path).data.publicUrl;
      }
      const payload = {
        name: form.name,
        gender: form.gender,
        age_group: form.age_group,
        height: form.height || null,
        build: form.build,
        contact_info: form.contact_info || null,
        vehicle_number: form.vehicle_number || null,
        appearance: form.appearance || null,
        incident_at: form.incident_date ? `${form.incident_date}T${form.incident_time || '00:00'}:00` : null,
        location: form.location || null,
        damage_type: form.damage_type,
        damage_amount: form.damage_amount ? Number(form.damage_amount) : null,
        description: form.description,
        response_process: form.response_process || null,
        evidence_type: mediaFile?.type.startsWith('video') ? 'CCTV 영상' : form.evidence_type,
        media_url: mediaUrl,
      };
      const { error } = await supabase.from('reports').insert(payload);
      if (error) { alert('등록 실패: ' + error.message); return; }
      const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      setReports(data ?? []);
      setForm(emptyForm);
      setMediaFile(null);
      setIsReporting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = reports.filter(item =>
    ((item.name + (item.appearance ?? '') + item.description +
      (item.contact_info ?? '') + (item.vehicle_number ?? '')).includes(searchQuery)) &&
    (filter.gender === '전체' || item.gender === filter.gender) &&
    (filter.build === '전체' || item.build === filter.build)
  );

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyCount = reports.filter(r => new Date(r.created_at).getTime() > weekAgo).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <ShieldAlert className="text-amber-500 w-6 h-6" />
            <span className="text-xl font-bold tracking-tighter text-white">BLACK<span className="text-amber-500">ARCHIVE</span></span>
          </a>
          <div className="flex items-center gap-2">
            <a href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors mr-2">이용약관</a>
            <button
              onClick={() => setIsReporting(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> 제보하기
            </button>
          </div>
        </div>
      </nav>

      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 text-center text-xs text-amber-400 flex items-center justify-center gap-2">
          <Database className="w-3 h-3" /> 데모 모드 — .env.local에 Supabase 키 입력 후 실제 저장 활성화
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Search */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            안전한 거래를 위한 <br />
            <span className="text-zinc-500">디지털 블랙리스트 아카이브</span>
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input
              type="text"
              placeholder="이름, 연락처, 아이디, 차량번호, 인상착의로 검색..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!loading && (
            <div className="flex items-center justify-center gap-6 mt-6 font-mono text-xs uppercase tracking-widest">
              <span className="text-zinc-500">총 <span className="text-white font-bold">{reports.length}</span>건 등록</span>
              <span className="w-px h-3 bg-zinc-800" />
              <span className="text-zinc-500">이번 주 <span className="text-amber-500 font-bold">{weeklyCount}</span>건</span>
            </div>
          )}
        </section>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <Filter className="w-4 h-4 text-zinc-500 mr-2" />
          {['전체', '남성', '여성'].map(g => (
            <button key={g} onClick={() => setFilter(f => ({ ...f, gender: g }))} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", filter.gender === g ? "bg-amber-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800")}>
              {g}
            </button>
          ))}
          <div className="w-px h-4 bg-zinc-800 mx-2" />
          {['전체', '마름', '보통', '건장'].map(b => (
            <button key={b} onClick={() => setFilter(f => ({ ...f, build: b }))} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", filter.build === b ? "bg-amber-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800")}>
              {b}
            </button>
          ))}
        </div>

        {/* Grid Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-64 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => (
              <a key={item.id} href={`/report/${item.id}`} className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-amber-500/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-zinc-800 p-3 rounded-2xl">
                    <User className="w-6 h-6 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <span className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>{item.created_at.slice(0, 10)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views}</span>
                  </span>
                </div>
                {item.media_url && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 aspect-video relative group-hover:border-amber-500/30 transition-all">
                    {/* ponytail: 외부 이미지라 next/image 대신 img 사용 */}
                    <img src={item.media_url} alt="증거 사진" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{item.name} <span className="text-zinc-500 text-sm font-normal">{item.age_group}</span></h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[11px] rounded-md">{item.gender}</span>
                  {item.height && <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[11px] rounded-md">{item.height}</span>}
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[11px] rounded-md">{item.build}</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 mb-4">
                  <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2"><span className="text-amber-500 font-semibold mr-1">특징:</span> {item.appearance || '없음'}</p>
                </div>
                <p className="text-sm text-zinc-500 line-clamp-2 italic mb-3">&ldquo;{item.description}&rdquo;</p>
                <span className="flex items-center gap-1 text-xs text-amber-500/80 opacity-0 group-hover:opacity-100 transition-opacity">상세 보기 <ExternalLink className="w-3 h-3" /></span>
              </a>
            ))}
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20">
            <Info className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">일치하는 기록이 없습니다.</p>
          </div>
        )}
      </main>

      {/* Reporting Modal */}
      {isReporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 shrink-0">
              <h2 className="text-xl font-bold text-white">블랙컨슈머 제보</h2>
              <button onClick={() => setIsReporting(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <form className="p-6 space-y-6 overflow-y-auto" onSubmit={submitReport}>
              <fieldset className="space-y-4 border border-zinc-800 rounded-2xl p-4">
                <legend className="text-xs font-bold text-amber-500 uppercase ml-2 px-1">가해자 식별 정보</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">이름 *</label>
                    <input required type="text" placeholder="예: 김*철" value={form.name} onChange={set('name')} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">성별</label>
                    <select value={form.gender} onChange={set('gender')} className={inputCls}>
                      <option>남성</option><option>여성</option><option>기타/모름</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">연락처 / 아이디</label>
                    <input type="text" placeholder="예: 010-****-1234, @id" value={form.contact_info} onChange={set('contact_info')} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">차량 번호 (선택)</label>
                    <input type="text" placeholder="예: 서울 가 1234" value={form.vehicle_number} onChange={set('vehicle_number')} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">연령대</label>
                    <select value={form.age_group} onChange={set('age_group')} className={inputCls}>
                      <option>10대</option><option>20대</option><option>30대</option><option>40대</option><option>50대</option><option>60대 이상</option><option>모름</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">키</label>
                    <input type="text" placeholder="175cm" value={form.height} onChange={set('height')} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">체격</label>
                    <select value={form.build} onChange={set('build')} className={inputCls}>
                      <option>마름</option><option>보통</option><option>건장</option><option>비만</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">인상착의 및 특징</label>
                  <textarea placeholder="예: 왼쪽 턱에 흉터, 금테 안경, 특정 타투 등" value={form.appearance} onChange={set('appearance')} className={cn(inputCls, "h-24")} />
                </div>
              </fieldset>

              <fieldset className="space-y-4 border border-zinc-800 rounded-2xl p-4">
                <legend className="text-xs font-bold text-amber-500 uppercase ml-2 px-1">사건 일시 및 장소</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">사건 일자</label>
                    <input type="date" value={form.incident_date} onChange={set('incident_date')} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 ml-1">시간</label>
                    <input type="time" value={form.incident_time} onChange={set('incident_time')} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">장소</label>
                  <input type="text" placeholder="예: 강남구 논현동 모 카페" value={form.location} onChange={set('location')} className={inputCls} />
                </div>
              </fieldset>

              <fieldset className="space-y-4 border border-zinc-800 rounded-2xl p-4">
                <legend className="text-xs font-bold text-amber-500 uppercase ml-2 px-1">피해 내용 및 규모</legend>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">피해 유형 *</label>
                  <select value={form.damage_type} onChange={set('damage_type')} className={inputCls}>
                    <option>허위 피해 주장 / 억지 환불</option>
                    <option>폭언 및 모욕</option>
                    <option>리뷰 테러 / 협박</option>
                    <option>노쇼 / 결제 회피</option>
                    <option>제품 훼손 후 책임 전가</option>
                    <option>기타</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">금전적 손실액 (원, 선택)</label>
                  <input type="number" min={0} placeholder="150000" value={form.damage_amount} onChange={set('damage_amount')} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">피해 상세 *</label>
                  <textarea required placeholder="상세한 피해 내용을 입력해주세요." value={form.description} onChange={set('description')} className={cn(inputCls, "h-32")} />
                </div>
              </fieldset>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">대응 과정</label>
                <textarea placeholder="예: 환불 요청에 규정 안내 후 거절 → 리뷰 협박 → 고객센터 신고 접수" value={form.response_process} onChange={set('response_process')} className={cn(inputCls, "h-24")} />
              </div>

              <fieldset className="space-y-4 border border-zinc-800 rounded-2xl p-4">
                <legend className="text-xs font-bold text-amber-500 uppercase ml-2 px-1">객관적 증거</legend>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">증거 종류</label>
                  <select value={form.evidence_type} onChange={set('evidence_type')} className={inputCls}>
                    <option>채팅 캡처</option><option>통화 녹취록</option><option>CCTV 영상</option><option>결제 내역</option><option>기타 문서</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">증거 파일 업로드 (사진/영상)</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                    className={cn(inputCls, "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-zinc-950 file:text-xs file:font-bold file:cursor-pointer text-zinc-400 text-sm")}
                  />
                  {mediaFile && <p className="text-[11px] text-emerald-500">✓ {mediaFile.name} ({Math.round(mediaFile.size / 1024)}KB)</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 ml-1">또는 미디어 URL 입력</label>
                  <input type="url" placeholder="https://..." value={form.media_url} onChange={set('media_url')} className={inputCls} />
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">⚠ 증거가 없는 제보는 반려될 수 있습니다. 개인정보는 반드시 마스킹해주세요.</p>
              </fieldset>

              <div className="sticky bottom-0 pt-2 pb-1 bg-gradient-to-t from-zinc-900 via-zinc-900">
                <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
                  {submitting ? '업로드 중...' : '제보 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
