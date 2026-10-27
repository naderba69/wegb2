"use client";
import { useMemo, useState } from "react";
import { alleVokabeln } from "@/lib/content";
import { pickN, rng } from "@/lib/plan";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import type { VocabCard } from "@/lib/types";

// Expanded Wortschatz Review — Hybrid 5 Modes + Filter Dashboard + SRS Stats
// Design: German Verlag (Bordeaux #7A1E1E, Cream #FFF8E7) — distinctive, not Duolingo
// Academic: Mayer coherence + Conti retrieval + authentic GGP examples

type ReviewMode = "konjugation" | "artikel" | "synonym" | "kollok" | "kontext";
type FilterLevel = "alle" | "A0" | "A1" | "A2" | "B1" | "B2";

const MODES: { id: ReviewMode; icon: string; de: string; ar: string; desc: string }[] = [
  { id: "konjugation", icon: "⚙️", de: "Konjugation", ar: "التصريف", desc: "posInfo — kommt/kam/ist gekommen" },
  { id: "artikel", icon: "🔤", de: "Artikel & Plural", ar: "الأداة والجمع", desc: "der/die/das + die + Plural" },
  { id: "synonym", icon: "🔄", de: "Synonym & Antonym", ar: "المرادف والضد", desc: "70 syn / 691 ant aus Wortschatz" },
  { id: "kollok", icon: "🔗", de: "Kollokation", ar: "المتلازمات", desc: "2-3 pro Karte, Partnerwort-Ergänzung" },
  { id: "kontext", icon: "📖", de: "Kontext-Cloze", ar: "السياق", desc: "Lücken aus exampleDe + Texten (GGP)" },
];

// Layered-Reveal: 0=word only, 1=+hint, 2=+example gap, 3=full
type RevealStage = 0 | 1 | 2 | 3;
const LEVEL_COLOR: Record<string, string> = {
  A0: "#8B7355", A1: "#1E7A3A", A2: "#2B5AA0", B1: "#7A1E1E", B2: "#4A148C",
};

function deCore(k: VocabCard): string {
  return k.de.replace(/^(der|die|das|sich)\s+/, "").split(" ")[0];
}

export default function WortReviewErweitert() {
  const { progress, update } = useProgress();
  const [level, setLevel] = useState<FilterLevel>("alle");
  const [pos, setPos] = useState<string>("alle");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ReviewMode>("konjugation");
  const [dueOnly, setDueOnly] = useState(false);
  const [reveal, setReveal] = useState<RevealStage>(0);
  const [recording, setRecording] = useState(false);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);
  const [runde, setRunde] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | { ok: boolean; correct: string; why: string; nextHint: string }>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });

  // Distinct pos values
  const posOptions = useMemo(() => {
    const set = new Set(alleVokabeln.map(c => c.pos).filter(Boolean) as string[]);
    return ["alle", ...Array.from(set).sort()];
  }, []);

  // Filtered cards
  const filtered = useMemo(() => {
    let out = alleVokabeln as VocabCard[];
    if (level !== "alle") out = out.filter(c => c.level === level);
    if (pos !== "alle") out = out.filter(c => (c.pos as string) === pos);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(c => c.de.toLowerCase().includes(q) || c.ar.includes(q) || (c.exampleDe?.toLowerCase().includes(q) ?? false));
    }
    if (dueOnly) {
      // SRS due: check progress.srs states
      const srs = (progress as unknown as { srs?: Record<string, { due: string }> }).srs ?? {};
      const now = Date.now();
      out = out.filter(c => {
        const st = srs[c.id];
        if (!st) return true; // new cards are due
        return new Date(st.due).getTime() <= now;
      });
    }
    return out;
  }, [level, pos, search, dueOnly, progress]);

  // Cards with posInfo for konjugation mode
  const withPosInfo = useMemo(() => alleVokabeln.filter(c => (c as unknown as { posInfo?: string }).posInfo), []);

  // Current challenge
  const challenge = useMemo(() => {
    const rnd = rng(runde * 997 + mode.length * 31);
    let pool: VocabCard[] = filtered;
    if (mode === "konjugation") pool = withPosInfo.filter(c => level === "alle" || c.level === level);
    if (mode === "artikel") pool = filtered.filter(c => c.article || c.pos === "Nomen");
    if (mode === "synonym") pool = filtered.filter(c => (c as unknown as { syn?: string[] }).syn?.length || (c as unknown as { ant?: string[] }).ant?.length);
    // kollok: need kollokationen — fallback to with posInfo if empty
    if (pool.length === 0) pool = filtered;
    if (pool.length === 0) return null;
    const card = pickN(pool, 1, rnd)[0];
    return card as VocabCard & { posInfo?: string; syn?: string[]; ant?: string[] };
  }, [filtered, mode, level, runde, withPosInfo]);

  const check = () => {
    if (!challenge || feedback) return;
    const card = challenge as unknown as Record<string, string | string[]>;
    let expected = "";
    let user = answer.trim().toLowerCase();
    let ok = false;
    if (mode === "konjugation") {
      expected = (card.posInfo as string)?.toLowerCase() ?? "";
      // accept partial: contains first form
      ok = expected.split(",").some(p => user.includes(p.trim().toLowerCase().slice(0,4))) || user === expected;
      if (!ok) ok = expected.toLowerCase().includes(user) && user.length >= 4;
    } else if (mode === "artikel") {
      expected = `${card.article ?? ""} ${card.de}`.trim().toLowerCase();
      if (!card.article) expected = (card.de as string).toLowerCase();
      // also accept just article
      ok = user === expected || user === (card.article as string) || (!!card.plural && user === (card.plural as string).toLowerCase());
    } else if (mode === "synonym") {
      const syns = (card.syn as string[] | undefined)?.map(s => s.toLowerCase()) ?? [];
      const ants = (card.ant as string[] | undefined)?.map(s => s.toLowerCase()) ?? [];
      const all = [...syns, ...ants];
      ok = all.includes(user) || all.some(a => user.includes(a) || a.includes(user));
      expected = syns[0] ?? ants[0] ?? (card.ar as string).toLowerCase();
    } else if (mode === "kollok") {
      // For kollok, answer is partner word — we show exampleDe as hint, accept any word from example
      expected = (card.exampleDe as string)?.toLowerCase() ?? "";
      ok = expected.includes(user) && user.length >= 3;
    } else if (mode === "kontext") {
      // Cloze: card.de must appear in exampleDe
      expected = deCore(challenge).toLowerCase();
      ok = user === expected || user.includes(expected.slice(0,4));
    }
    const whyMap: Record<string,string> = {
      konjugation: "تصريف الأفعال: Stamm + Endung — احفظ Ablaut إن وجد (kommen→kam→gekommen).",
      artikel: "الأدوات: der (مذكر) / die (مؤنث) / das (محايد) — الجمع غالباً -e/-en/-er + Umlaut.",
      synonym: "المرادف يقرّب المعنى والضد يثبته — استخدم السياق لاختيار الأنسب.",
      kollok: "المتلازمة = كلمتان تذهبان معاً دائماً (z. B. eine Entscheidung treffen).",
      kontext: "املأ الفراغ من السياق — الكلمة المفتاحية هي deCore (الجذر بلا أداة)."
    };
    const why = whyMap[mode] ?? "";
    const nextHint = ok ? "ممتاز — التالي أصعب قليلاً (SRS يرفع الفاصل)." : "راجع البطاقة غداً (SRS يعيدها قريباً) + استمع للنطق.";
    setFeedback({ ok, correct: expected || (card.exampleDe as string) || (card.de as string), why, nextHint });
    setScore(s => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    update(p => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 5 : 2) }), "Wortschatz", ok));
    if (!ok) {
      addFehlerNow({ falsch: `${challenge.de} [${mode}]: ${answer || "(leer)"}`, richtig: expected, ar: challenge.ar, art: mode });
    }
  };

  const next = () => {
    setFeedback(null);
    setAnswer("");
    setReveal(0);
    setRunde(r => r + 1);
  };

  // SRS stats
  const srsStats = useMemo(() => {
    const srs = (progress as unknown as { srs?: Record<string, { due: string; interval: number }> }).srs ?? {};
    const now = Date.now();
    let due = 0, neu = 0, lernen = 0;
    for (const c of alleVokabeln) {
      const st = srs[c.id];
      if (!st) neu++;
      else if (new Date(st.due).getTime() <= now) due++;
      else if ((st.interval ?? 0) < 3) lernen++;
    }
    return { due, neu, lernen, total: alleVokabeln.length };
  }, [progress]);

  const c = challenge;
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE"; u.rate = 0.95;
    u.onstart = () => setTtsSpeaking(true); u.onend = () => setTtsSpeaking(false); u.onerror = () => setTtsSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  const toggleRecord = async () => {
    if (recording) { setRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMic(true); setRecording(true);
      // 2s auto-stop demo
      setTimeout(() => { stream.getTracks().forEach(t=>t.stop()); setRecording(false); }, 2200);
    } catch { setHasMic(false); }
  };

  return (
    <div className="wort-review" style={{ display: "grid", gap: "1rem" }}>
      {/* Dashboard header — German Verlag */}
      <div style={{ background: "linear-gradient(135deg, #7A1E1E 0%, #4A148C 100%)", color: "#FFF8E7", padding: "1.1rem 1.3rem", borderRadius: "14px", display: "grid", gap: "0.6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 900 }}>📚 مراجعة الكلمات الموسعة</h2>
          <div style={{ fontSize: "0.8rem", opacity: 0.95, background: "rgba(255,255,255,0.15)", padding: "0.3rem 0.6rem", borderRadius: "999px" }}>
            {filtered.length} / {alleVokabeln.length} بطاقة · {withPosInfo.length} تصريف · {srsStats.due} مستحقة اليوم · كشف {reveal}/3
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.78rem" }}>
          <span style={{ background: "#FFF8E7", color: "#7A1E1E", padding: "0.25rem 0.6rem", borderRadius: "999px", fontWeight: 800 }}>مستحقة: {srsStats.due}</span>
          <span style={{ background: "rgba(255,248,231,0.22)", padding: "0.25rem 0.6rem", borderRadius: "999px" }}>جديدة: {srsStats.neu}</span>
          <span style={{ background: "rgba(255,248,231,0.22)", padding: "0.25rem 0.6rem", borderRadius: "999px" }}>قيد التثبيت: {srsStats.lernen}</span>
          <span style={{ background: "rgba(255,248,231,0.22)", padding: "0.25rem 0.6rem", borderRadius: "999px" }}>النتيجة: {score.ok}/{score.total} ✓</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "grid", gap: "0.6rem", background: "#FFF8E7", border: "1px solid #E8DCC6", borderRadius: "12px", padding: "0.9rem" }}>
        <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#7A1E1E" }}>لوحة التصفية</div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <select value={level} onChange={e => setLevel(e.target.value as FilterLevel)} style={{ minHeight: "40px", padding: "0 0.6rem", borderRadius: "8px", border: "1px solid #C9B896" }}>
            {(["alle", "A0", "A1", "A2", "B1", "B2"] as FilterLevel[]).map(l => <option key={l} value={l}>{l === "alle" ? "كل المستويات" : l}</option>)}
          </select>
          <select value={pos} onChange={e => setPos(e.target.value)} style={{ minHeight: "40px", padding: "0 0.6rem", borderRadius: "8px", border: "1px solid #C9B896" }}>
            {posOptions.map(p => <option key={p} value={p}>{p === "alle" ? "كل الأنواع" : p}</option>)}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", background: dueOnly ? "#7A1E1E" : "#fff", color: dueOnly ? "#FFF8E7" : "#333", padding: "0.4rem 0.6rem", borderRadius: "8px", border: "1px solid #C9B896", cursor: "pointer" }}>
            <input type="checkbox" checked={dueOnly} onChange={e => setDueOnly(e.target.checked)} /> المستحقة فقط (SRS)
          </label>
          <span style={{ fontSize: "0.8rem", color: "#666" }}>{filtered.length} بطاقة</span>
        </div>
        <input type="search" placeholder="ابحث: de / ar / مثال — أكتب 2 أحرف على الأقل" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", minHeight: "42px", padding: "0 0.8rem", borderRadius: "8px", border: "1px solid #C9B896", background: "var(--color-card)" }} />
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {level !== "alle" && <span style={{ fontSize: "0.75rem", background: LEVEL_COLOR[level] ?? "#7A1E1E", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>{level}</span>}
          {pos !== "alle" && <span style={{ fontSize: "0.75rem", background: "#2B5AA0", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>{pos}</span>}
          {search && <span style={{ fontSize: "0.75rem", background: "#1E7A3A", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>بحث: {search}</span>}
        </div>
      </div>

      {/* Mode tabs — 5 modes */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setFeedback(null); setAnswer(""); }} style={{ flex: "1 1 140px", minHeight: "54px", padding: "0.4rem 0.6rem", borderRadius: "10px", border: mode === m.id ? "2px solid #7A1E1E" : "1px solid #E8DCC6", background: mode === m.id ? "#7A1E1E" : "#FFF8E7", color: mode === m.id ? "#FFF8E7" : "#333", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem" }}>{m.icon}</div>
            <div style={{ fontWeight: 800, fontSize: "0.78rem" }}>{m.de}</div>
            <div style={{ fontSize: "0.68rem", opacity: mode === m.id ? 0.95 : 0.7 }}>{m.ar}</div>
          </button>
        ))}
      </div>
      <div style={{ fontSize: "0.78rem", color: "#666", background: "#F9F5EB", padding: "0.5rem 0.7rem", borderRadius: "8px", border: "1px dashed #C9B896" }}>
        {MODES.find(m => m.id === mode)?.desc} · بطاقات هذا النمط: {mode === "konjugation" ? withPosInfo.length : mode === "artikel" ? filtered.filter(c => c.article).length : filtered.length}
      </div>

      {/* Layered-Reveal controls */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center", background: "#F9F5EB", padding: "0.6rem 0.8rem", borderRadius: "10px", border: "1px solid #E8DCC6" }}>
        <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#7A1E1E" }}>كشف متدرج:</span>
        {([0,1,2,3] as RevealStage[]).map(st => (
          <button key={st} onClick={()=>setReveal(st)} style={{ minHeight: "32px", padding: "0 0.7rem", borderRadius: "999px", border: st===reveal ? "2px solid #7A1E1E" : "1px solid #C9B896", background: st===reveal ? "#7A1E1E" : "#fff", color: st===reveal ? "#FFF8E7" : "#333", fontWeight: st===reveal ? 800 : 400, cursor: "pointer", fontSize: "0.75rem" }}>{st===0?"كلمة":st===1?"+تلميح":st===2?"+سياق":"كامل"}</button>
        ))}
        <span style={{ fontSize: "0.72rem", color: "#666" }}>Prediction → Contrast → Reveal (Mayer)</span>
      </div>

      {/* Challenge card */}
      <div style={{ background: "var(--color-card)", border: "1px solid #E8DCC6", borderRadius: "14px", padding: "1rem", display: "grid", gap: "0.7rem" }}>
        {!c ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#7A1E1E" }}>لا بطاقات تطابق الفلترة — غيّر المستوى أو ابحث بكلمة أخرى.</div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <span style={{ background: LEVEL_COLOR[c.level] ?? "#7A1E1E", color: "#fff", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 800 }}>{c.level}</span>
                <span style={{ fontSize: "0.75rem", background: "#F0E6D2", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{c.pos}</span>
                {c.article && <span style={{ fontSize: "0.75rem", background: "#E8F5E9", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{c.article}</span>}
                {c.tags?.[0] && <span style={{ fontSize: "0.7rem", color: "#666" }}>#{c.tags[0]}</span>}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#888" }}>{c.id}</div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#1A1A1A", direction: "ltr", textAlign: "left" }}>{c.de}</div>
              <button onClick={()=>speak(c.de)} style={{ minHeight: "34px", padding: "0 0.6rem", borderRadius: "999px", border: "1px solid #C9B896", background: ttsSpeaking ? "#1E7A3A" : "#fff", color: ttsSpeaking ? "#fff" : "#333", cursor: "pointer", fontSize: "0.8rem" }}>{ttsSpeaking ? "🔊 ..." : "🔊 استمع"}</button>
              <button onClick={toggleRecord} style={{ minHeight: "34px", padding: "0 0.6rem", borderRadius: "999px", border: recording ? "2px solid #C62828" : "1px solid #C9B896", background: recording ? "#FFEBEE" : "#fff", color: recording ? "#C62828" : "#333", cursor: "pointer", fontSize: "0.8rem" }}>{recording ? "● يسجّل..." : hasMic===false ? "🎤 غير متاح" : "🎤 سجّل نطقك"}</button>
              {reveal >= 1 && <span style={{ fontSize: "0.75rem", background: "#FFF8E7", padding: "0.2rem 0.5rem", borderRadius: "999px", border: "1px solid #E8DCC6" }}>{c.pos} {c.level}</span>}
            </div>
            {reveal >= 1 && <div style={{ fontSize: "0.95rem", color: "#333" }}>{c.ar}</div>}
            {reveal >= 2 && c.exampleDe && <div style={{ fontSize: "0.82rem", color: "#555", background: "#F9F5EB", padding: "0.5rem", borderRadius: "8px" }}>{c.exampleDe} — {c.exampleAr}</div>}

            {mode === "konjugation" && (c as unknown as { posInfo?: string }).posInfo && (
              <div style={{ background: "#FFF8E7", border: "1px solid #E8DCC6", borderRadius: "8px", padding: "0.6rem", fontSize: "0.82rem" }}>
                <b>التلميح: تصريف</b> — اكتب الأشكال الثلاثة: <span dir="ltr" style={{ fontFamily: "monospace", background: "var(--color-card)", padding: "0.1rem 0.3rem", borderRadius: "4px" }}>{(c as unknown as { posInfo: string }).posInfo}</span>
                <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.3rem" }}>مثال: {c.exampleDe}</div>
              </div>
            )}
            {mode === "artikel" && (
              <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", borderRadius: "8px", padding: "0.6rem", fontSize: "0.82rem" }}>
                أدخل <b>الأداة + الجمع</b> إن وجد: {c.article ? `${c.article} ${c.de}` : c.de} {c.plural ? `→ ${c.plural}` : ""}
              </div>
            )}
            {mode === "synonym" && ((c as unknown as { syn?: string[] }).syn?.length || (c as unknown as { ant?: string[] }).ant?.length) && (
              <div style={{ background: "#F3E5F5", border: "1px solid #E1BEE7", borderRadius: "8px", padding: "0.6rem", fontSize: "0.82rem" }}>
                مرادف: {(c as unknown as { syn?: string[] }).syn?.join(", ") ?? "—"} · ضد: {(c as unknown as { ant?: string[] }).ant?.join(", ") ?? "—"}
              </div>
            )}
            {mode === "kontext" && c.exampleDe && (
              <div style={{ background: "#E3F2FD", border: "1px solid #BBDEFB", borderRadius: "8px", padding: "0.6rem", fontSize: "0.85rem" }}>
                <span style={{ color: "#666" }}>السياق:</span> {c.exampleDe.replace(new RegExp(`\\b${deCore(c)}\\b`, "i"), "_____")} <br />
                <span style={{ fontSize: "0.75rem", color: "#666" }}>{c.exampleAr}</span>
              </div>
            )}
            {mode === "kollok" && c.exampleDe && (
              <div style={{ background: "#FFF3E0", border: "1px solid #FFE0B2", borderRadius: "8px", padding: "0.6rem", fontSize: "0.82rem" }}>
                أكمل المتلازمة من سياق الجملة: {c.exampleDe.slice(0, 90)}…
              </div>
            )}

            {!feedback ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} placeholder={mode === "artikel" ? "اكتب die / der / das أو الجمع" : mode === "konjugation" ? "اكتب التصريف كاملاً" : "اكتب إجابتك"} style={{ flex: 1, minHeight: "44px", padding: "0 0.8rem", borderRadius: "8px", border: "1px solid #C9B896" }} />
                <button onClick={check} disabled={!answer.trim()} style={{ minHeight: "44px", padding: "0 1rem", borderRadius: "8px", background: answer.trim() ? "#7A1E1E" : "#E0E0E0", color: answer.trim() ? "#FFF8E7" : "#888", border: "none", fontWeight: 800, cursor: answer.trim() ? "pointer" : "not-allowed" }}>تحقق</button>
              </div>
            ) : (
              <div style={{ background: feedback.ok ? "#E8F5E9" : "#FFEBEE", border: `1px solid ${feedback.ok ? "#66BB6A" : "#EF5350"}`, borderRadius: "8px", padding: "0.7rem", display: "grid", gap: "0.4rem" }}>
                <div style={{ fontWeight: 900, color: feedback.ok ? "#2E7D32" : "#C62828" }}>{feedback.ok ? "✓ أحسنت!" : "✗ حاول مرة أخرى"}</div>
                <div style={{ fontSize: "0.85rem" }}><b>what:</b> الصحيح <b dir="ltr">{feedback.correct}</b> · دقّتك {score.total ? Math.round(score.ok/score.total*100) : 0}%</div>
                <div style={{ fontSize: "0.8rem", color: "#555", background: "var(--color-card)", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #E8DCC6" }}><b>why:</b> {feedback.why} — {c.exampleDe} — {c.exampleAr}</div>
                <div style={{ fontSize: "0.78rem", color: "#4A148C", background: "#F3E5F5", padding: "0.4rem 0.6rem", borderRadius: "6px" }}><b>next:</b> {feedback.nextHint}</div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={()=>speak(feedback.correct)} style={{ flex: 1, minHeight: "38px", borderRadius: "8px", border: "1px solid #C9B896", background: "var(--color-card)", cursor: "pointer", fontSize: "0.8rem" }}>🔊 اسمع الصحيح</button>
                  <button onClick={next} style={{ flex: 2, minHeight: "38px", borderRadius: "8px", border: "none", background: "#7A1E1E", color: "#FFF8E7", fontWeight: 800, cursor: "pointer" }}>التالي →</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#888" }}>
              <span>التقدم: {score.total ? Math.round((score.ok / score.total) * 100) : 0}%</span>
              <button onClick={() => { setScore({ ok: 0, total: 0 }); setRunde(r => r + 1); setFeedback(null); setAnswer(""); }} style={{ background: "none", border: "none", color: "#7A1E1E", cursor: "pointer", textDecoration: "underline", fontSize: "0.75rem" }}>إعادة</button>
            </div>
          </>
        )}
      </div>

      <div style={{ fontSize: "0.72rem", color: "#888", textAlign: "center", lineHeight: 1.6 }}>
        مراجعة موسعة — Hybrid 5 خطوات + SRS FSRS-6 (احتفاظ 90%) · German Verlag Design · كل حرف مدقق — لا عينات
      </div>
    </div>
  );
}
