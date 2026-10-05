"use client";
/**
 * المدرّس الافتراضي — تعليم تفاعلي يعوّض المدرّس الخاص:
 *  · FehlerFinden: صحّح جملة الخطأ الشائعة (من pitfalls كل قاعدة)
 *  · RollenDialog: حوار بدورين — شريكك ينطق ودورك تنتجه
 *  · SchreibBerater: مستشار الكتابة (تشخيص محلي + مدرّس LLM اختياري)
 *  · Pruefung: امتحان شامل متعدد الأقسام بدرجة ألمانية وتقرير نقاط ضعف
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { DayTask, Exercise, Hoerdialog } from "@/lib/types";
import { getText, getDialogue, getWriting } from "@/lib/content";
import {
  deepReview,
  llmKorrigieren,
  noteFromPct,
  normalize,
  type LlmKorrektur,
} from "@/lib/grader";
import { loadProgress } from "@/lib/store";
import { speakLine, speakAny, stopSpeech } from "@/lib/speech";
import ExerciseSet from "./exercises";
import { De } from "./De";

// ═══════════════ صحّح الخطأ — تدريب على الصيغ الألمانية ═══════════════

const PITFALL_RE = /„([^“]+)“\s*✗\s*→\s*„([^“]+)“\s*✓/;

/** ⏱️ رادار الفخاخ موقوت: ثواني كل فخّ — انتهاء الوقت يكشف الصواب ويُدخله دفتر المراجعة (R11) */
export const PITFALL_SEKUNDEN = 45;

import { addFehlerNow } from "@/lib/store";

export function FehlerFinden({
  pitfalls,
  onPoints,
}: {
  pitfalls: { de: string; ar: string }[];
  onPoints: (p: number, m: number) => void;
}) {
  const items = useMemo(
    () =>
      pitfalls
        .map((p, i) => {
          const m = p.de.match(PITFALL_RE);
          return m ? { key: i, wrong: m[1], right: m[2], ar: p.ar } : null;
        })
        .filter(Boolean) as { key: number; wrong: string; right: string; ar: string }[],
    [pitfalls]
  );
  const [ans, setAns] = useState<Record<number, string>>({});
  const [chk, setChk] = useState<Record<number, boolean>>({});
  const [secs, setSecs] = useState<Record<number, number>>({});
  const [zeitUm, setZeitUm] = useState<Record<number, boolean>>({});
  const live = useRef({ ans, chk });
  live.current = { ans, chk };
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const onPointsRef = useRef(onPoints);
  onPointsRef.current = onPoints;
  const secsRef = useRef<Record<number, number>>({});
  useEffect(() => {
    secsRef.current = Object.fromEntries(itemsRef.current.map((it) => [it.key, PITFALL_SEKUNDEN]));
    setSecs({ ...secsRef.current });
    const id = setInterval(() => {
      const nx = { ...secsRef.current };
      let changed = false;
      for (const it of itemsRef.current) {
        if (live.current.chk[it.key]) continue;
        if ((nx[it.key] ?? 0) > 0) { nx[it.key] -= 1; changed = true; }
        if (nx[it.key] === 0) {
          const richtig = normalize(live.current.ans[it.key] ?? "") === normalize(it.right);
          setChk((c) => (c[it.key] ? c : { ...c, [it.key]: true }));
          setZeitUm((z) => (z[it.key] ? z : { ...z, [it.key]: true }));
          onPointsRef.current(richtig ? 1 : 0, 1);
          if (!richtig) {
            addFehlerNow({ falsch: (live.current.ans[it.key] ?? "").trim() || it.wrong, richtig: it.right, art: "wortstellung", ar: `${it.ar} (انتهى وقت الرادار)`, quelle: "رادار الفخاخ" });
          }
        }
      }
      secsRef.current = nx;
      if (changed) setSecs({ ...nx });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!items.length) return null;

  const pruefen = (it: { key: number; wrong: string; right: string; ar: string }) => {
    if (chk[it.key]) return;
    const ok = normalize(ans[it.key] ?? "") === normalize(it.right);
    setChk((c) => ({ ...c, [it.key]: true }));
    onPoints(ok ? 1 : 0, 1);
    if (!ok) {
      addFehlerNow({
        falsch: (ans[it.key] ?? "").trim() || it.wrong,
        richtig: it.right,
        art: "wortstellung",
        ar: it.ar,
        quelle: "تمرين تصحيح الألمانية",
      });
    }
  };

  return (
    <div style={{ margin: "1.1rem 0" }}>
      <h4 style={{ fontWeight: 800, margin: "0 0 0.5rem" }}>
        🛠️ صحّح الخطأ — تدرّب على تصحيح الجمل الألمانية
      </h4>
      <div style={{ display: "grid", gap: "0.7rem" }}>
        {items.map((it) => {
          const done = chk[it.key];
          const ok = normalize(ans[it.key] ?? "") === normalize(it.right);
          return (
            <div
              key={it.key}
              className="card"
              style={{
                padding: "0.8rem 1rem",
                borderInlineStart: done
                  ? ok
                    ? "4px solid var(--color-a1)"
                    : "4px solid var(--color-cola)"
                  : "4px solid var(--color-gold)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>
                الجملة التي كتبها طالب — صحّحها:
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <De style={{ color: "var(--color-cola)", fontWeight: 800 }}>{it.wrong}</De>
                <button
                  className="chip"
                  style={{ cursor: "pointer" }}
                  onClick={() => speakAny(it.wrong)}
                >
                  🔊
                </button>
              </div>
              {!done ? (
                <>
                <div style={{ marginTop: "0.4rem" }}>
                  <span data-testid={`pitfall-timer-${it.key}`} className="chip rtl-num" style={{ fontWeight: 800, color: (secs[it.key] ?? PITFALL_SEKUNDEN) <= 10 ? "var(--color-cola)" : "var(--color-ink2)" }}>
                    ⏱️ {secs[it.key] ?? PITFALL_SEKUNDEN}s
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  <input
                    className="field"
                    style={{ direction: "ltr", flex: 1, minWidth: "14rem" }}
                    placeholder="Schreibe den richtigen Satz …"
                    value={ans[it.key] ?? ""}
                    onChange={(e) => setAns((a) => ({ ...a, [it.key]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && pruefen(it)}
                  />
                  <button className="btn btn-primary" onClick={() => pruefen(it)}>
                    تحقّق
                  </button>
                </div>
                </>
              ) : (
                <div style={{ marginTop: "0.5rem", fontSize: "0.92rem", lineHeight: 1.8 }}>
                  {zeitUm[it.key] && ok ? (
                    <strong style={{ color: "var(--color-a1)" }}>⏰ في اللحظة الأخيرة — أحسنت!</strong>
                  ) : zeitUm[it.key] ? (
                    <strong style={{ color: "var(--color-gold)" }}>⏰ انتهى الوقت ({PITFALL_SEKUNDEN}s) — الصواب دخل دفتر مراجعتك:</strong>
                  ) : ok ? (
                    <strong style={{ color: "var(--color-a1)" }}>✅ ممتاز — صحّحتَ الخطأ بنفسك!</strong>
                  ) : (
                    <strong style={{ color: "var(--color-cola)" }}>❌ ليست بعد — الصواب:</strong>
                  )}
                  {(!ok || zeitUm[it.key]) && (
                    <div style={{ margin: "0.25rem 0" }}>
                      <De style={{ fontWeight: 800, color: "var(--color-a1)" }}>{it.right}</De>
                    </div>
                  )}
                  <div style={{ color: "var(--color-ink2)" }}>👨‍🏫 {it.ar}</div>
                  <button
                    className="chip"
                    style={{ cursor: "pointer", marginTop: "0.35rem" }}
                  onClick={() => speakAny(it.right)}
                  >
                    🔊 اسمع الجملة الصحيحة
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════ حوار بدورين (تقمّص مع المدرّس) ═══════════════

function overlapRatio(a: string, b: string): number {
  const aw = normalize(a).split(" ").filter(Boolean);
  const bw = normalize(b).split(" ").filter(Boolean);
  if (!aw.length || !bw.length) return 0;
  const hit = aw.filter((w) => bw.includes(w)).length;
  return hit / Math.max(aw.length, bw.length);
}

export function RollenDialog({
  dlg,
  onPoints,
  voiceName,
  rate,
}: {
  dlg: Hoerdialog;
  onPoints: (p: number, m: number) => void;
  voiceName?: string;
  rate?: number;
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [inp, setInp] = useState("");
  const [fb, setFb] = useState<null | { ok: boolean }>(null);
  const [finished, setFinished] = useState(false);
  const you = dlg.lines.length > 1 ? dlg.lines[1].who : "Du";
  const myLines = dlg.lines.filter((l) => l.who === you).length;
  const line = dlg.lines[idx];
  const isMine = line?.who === you;

  const weiter = () => {
    setFb(null);
    setInp("");
    if (idx + 1 >= dlg.lines.length) setFinished(true);
    else setIdx(idx + 1);
  };

  const pruefen = () => {
    if (!line || fb) return;
    const ok =
      normalize(inp) === normalize(line.de) ||
      (inp.trim().length > 0 && overlapRatio(inp, line.de) >= 0.7);
    setFb({ ok });
    onPoints(ok ? 1 : 0, 1);
  };

  return (
    <div style={{ margin: "1.1rem 0" }}>
      <button className="btn btn-gold" onClick={() => { setOpen((o) => !o); stopSpeech(); setIdx(0); setFinished(false); setFb(null); }}>
        {open ? "🙈 أخفِ تمثيل الأدوار" : "🎭 تمثيل الأدوار — المدرّس يلعب دوراً وأنت الآخر"}
      </button>
      {open && (
        <div className="card fadein" style={{ padding: "1rem", marginTop: "0.6rem", background: "var(--color-paper2)" }}>
          {!finished && line && (
            <>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
                أنت الآن: <strong>{you}</strong> · الشريك: <strong>{line.who === you ? dlg.lines.find((l) => l.who !== you)?.who ?? "—" : line.who}</strong>
                {isMine ? " — اكتب جملك (أو قلها بصوت عالٍ ثم اكتبها)" : " — استمع لدور المدرّس"}
              </div>
              {isMine ? (
                <div>
                  <div style={{ marginBottom: "0.4rem", fontWeight: 700 }}>دورك! ماذا تقول؟</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <input
                      className="field"
                      style={{ direction: "ltr", flex: 1, minWidth: "14rem" }}
                      placeholder="Sag deinen Satz …"
                      value={inp}
                      disabled={!!fb}
                      onChange={(e) => setInp(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && pruefen()}
                    />
                    {!fb && (
                      <button className="btn btn-primary" disabled={!inp.trim()} onClick={pruefen}>
                        تحقّق
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => speakLine(line.de, undefined, { voiceName, rate })}
                  >
                    🔊 اسمع المدرّس
                  </button>
                  <span style={{ color: "var(--color-ink2)", fontSize: "0.9rem" }}>
                    {line.who}: … (نُطق صوتياً)
                  </span>
                </div>
              )}
              {fb && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.92rem" }}>
                  {fb.ok ? (
                    <strong style={{ color: "var(--color-a1)" }}>✅ رائع! ({line.who})</strong>
                  ) : (
                    <strong style={{ color: "var(--color-cola)" }}>❌ قارن مع النموذج:</strong>
                  )}
                  <div style={{ marginTop: "0.2rem" }}>
                    <De style={{ fontWeight: 700 }}>{line.de}</De>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{line.ar}</div>
                  </div>
                  <button
                    className="chip"
                    style={{ cursor: "pointer", marginTop: "0.35rem" }}
                    onClick={() => speakLine(line.de, undefined, { voiceName, rate })}
                  >
                    🔊 كرّرها مع المدرّس
                  </button>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.7rem" }}>
                {(!isMine || fb) && (
                  <button className="btn btn-gold" onClick={weiter}>
                    {idx + 1 >= dlg.lines.length ? "أنهِ الحوار ✓" : "التالي ←"}
                  </button>
                )}
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    const nxt = dlg.lines[idx + 1];
                    if (nxt && nxt.who !== you) speakLine(nxt.de, undefined, { voiceName, rate });
                  }}
                  disabled={idx + 1 >= dlg.lines.length}
                >
                  ⏭ اسمع التالي ثم أجب
                </button>
              </div>
            </>
          )}
          {finished && (
            <div style={{ textAlign: "center", padding: "0.6rem" }}>
              <strong>🎬 انتهى التمثيل!</strong>
              <div style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                لعبتَ دور {you} في {myLines} سطر — تدرّب الآن على نفس الحوار بصوت عالٍ بلا نص.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════ مستشار الكتابة (المدرّس يقرأ ويرشد) ═══════════════

const FALSCHE_MUSTER: { re: RegExp; tipp: string }[] = [
  { re: /Ich habe müde|Ich habe Hunger\.?$/i, tipp: "الصفات مع sein: Ich bin müde — وليس haben!" },
  { re: /Ich bin studiere|Ich bin arbeite/i, tipp: "لا تجمع فعلين: قل Ich studiere / Ich arbeite مباشرة." },
  { re: /\b(in der|im)\s+\w+en Abend\b/i, tipp: "الزمن الظرفي بلا أداة: am Abend / heute Abend." },
  { re: /nicht\s+(ich|du|er|sie|wir|ihr)\b/i, tipp: "لا يسبق nicht الفعل المصرَّف في الجملة الخبرية — place النفي قبل الفعل الثاني." },
];

export function SchreibBerater({ text, taskDe }: { text: string; taskDe: string }) {
  const [llm, setLlm] = useState<LlmKorrektur | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const saetze = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const tips: string[] = [];
  if (words < 40) tips.push("النص قصير — أضف جملة أو جملتين بأفكار مساندة (weil/deshalb).");
  if (saetze < 3) tips.push("قسّم أفكارك إلى 3 جمل على الأقل: تمهيد ← تفصيل ← خاتمة.");
  for (const m of FALSCHE_MUSTER) if (m.re.test(text)) tips.push("⚠️ " + m.tipp);
  if (/\bweil\b/i.test(text) && !/\bweil\b[^.!?]*\b\w+(e|t|en|st)\b/i.test(text))
    tips.push("بعد weil يأتي الفعل المصرَّف في آخر الجملة الفرعية.");

  const startLlm = async () => {
    const cfg = loadProgress().settings.llm;
    if (!cfg?.apiKey) {
      setErr("لم تُفعَّل خدمة المدرّس الذكي بعد — أضف مفتاح API من الإعدادات (اختياري).");
      return;
    }
    setBusy(true);
    setErr("");
    const res = await llmKorrigieren(cfg, taskDe, text);
    setBusy(false);
    if (res) setLlm(res);
    else setErr("تعذّر الاتصال بالخدمة — تحقّق من الإعدادات والشبكة.");
  };

  return (
    <div style={{ marginTop: "0.8rem" }}>
      <h4 style={{ fontWeight: 800, margin: "0 0 0.4rem" }}>👨‍🏫 ملاحظات المدرّس على نصّك</h4>
      <ul style={{ margin: 0, paddingInlineStart: "1.2rem", lineHeight: 1.9, fontSize: "0.92rem" }}>
        <li>
          الإحصاء: <span className="rtl-num">{words}</span> كلمة · <span className="rtl-num">{saetze}</span> جملة
        </li>
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
        {!tips.length && <li>بنية سليمة — أحسنت! ركّز في المرة القادمة على تنويع الروابط (und, aber, weil, deshalb).</li>}
      </ul>
      <button className="btn btn-gold" style={{ marginTop: "0.5rem" }} disabled={busy} onClick={startLlm}>
        {busy ? "… المدرّس الذكي يقرأ نصّك" : "🤖 اطلب تصحيح المدرّس الذكي (اختياري)"}
      </button>
      {err && <div style={{ color: "var(--color-cola)", fontSize: "0.88rem", marginTop: "0.4rem" }}>{err}</div>}
      {llm && (
        <div className="card fadein" style={{ marginTop: "0.6rem", padding: "0.8rem 1rem", background: "var(--color-gold-soft)" }}>
          <div style={{ fontWeight: 800 }}>✏️ النص المصحَّح:</div>
          <article className="de" style={{ display: "block", lineHeight: 1.85, margin: "0.3rem 0" }}>{llm.korrigiert}</article>
          {llm.notizen.length > 0 && (
            <ul style={{ margin: "0.4rem 0 0", paddingInlineStart: "1.2rem", fontSize: "0.92rem", lineHeight: 1.8 }}>
              {llm.notizen.map((n, i) => (
                <li key={i}>📌 {n}</li>
              ))}
            </ul>
          )}
          {llm.bewertung && <div style={{ marginTop: "0.4rem", fontWeight: 700 }}>🎓 {llm.bewertung}</div>}
        </div>
      )}
    </div>
  );
}

// ═══════════════ الامتحان الشامل (Prüfung) ═══════════════

export function Pruefung({
  task,
  onPoints,
  voiceName,
  rate,
}: {
  task: DayTask;
  onPoints: (p: number, m: number) => void;
  voiceName?: string;
  rate?: number;
}) {
  const text = task.textId ? getText(task.textId) : undefined;
  const dlg = task.dialogueId ? getDialogue(task.dialogueId) : undefined;
  const wr = task.writeId ? getWriting(task.writeId) : undefined;

  const lesenItems = useMemo(() => (text ? text.questions.slice(0, 2) : []), [text]);
  const hoerenItems = useMemo(
    () =>
      dlg
        ? [
            ...dlg.questions.slice(0, 2),
            ...(dlg.dictation[0]
              ? [
                  {
                    id: `${task.id}-di`,
                    type: "dictation" as const,
                    promptDe: "Diktiert: Schreibe, was du hörst",
                    promptAr: "سمّع الجملة واكتبها",
                    answer: [dlg.dictation[0]],
                    explanationDe: dlg.dictation[0],
                  } satisfies Exercise,
                ]
              : []),
          ]
        : [],
    [dlg, task.id]
  );
  const strukturItems = task.quiz ?? [];

  const [teile, setTeile] = useState<Record<string, { s: number; t: number }>>({});
  const [wrText, setWrText] = useState("");
  const [wrChecks, setWrChecks] = useState<Record<number, boolean>>({});
  const [wrDone, setWrDone] = useState(false);
  const [report, setReport] = useState<null | {
    pct: number;
    note: string;
    passed: boolean;
    schwach: string[];
  }>(null);

  const add = (teil: string, p: number, m: number) => {
    setTeile((old) => {
      const cur = old[teil] ?? { s: 0, t: 0 };
      return { ...old, [teil]: { s: cur.s + p, t: cur.t + m } };
    });
    onPoints(p, m);
  };

  const wrPct = wr ? (Object.values(wrChecks).filter(Boolean).length / Math.max(wr.criteria.length, 1)) : 0;
  const wrSubmit = () => {
    if (!wr || wrDone) return;
    setWrDone(true);
    add("Schreiben", Object.values(wrChecks).filter(Boolean).length, wr.criteria.length);
  };

  const auswerten = () => {
    let s = 0;
    let t = 0;
    const schwach: string[] = [];
    const namen: Record<string, string> = {
      Lesen: "القراءة",
      Hören: "الاستماع",
      Struktur: "القواعد والمفردات",
      Schreiben: "الكتابة",
    };
    for (const [k, v] of Object.entries(teile)) {
      s += v.s;
      t += v.t;
      if (v.t > 0 && v.s / v.t < 0.7) schwach.push(namen[k] ?? k);
    }
    const pct = t ? Math.round((s / t) * 100) : 0;
    setReport({ pct, note: noteFromPct(pct), passed: pct >= 80, schwach });
  };

  const teilPct = (k: string) => {
    const v = teile[k];
    return v && v.t ? Math.round((v.s / v.t) * 100) : null;
  };

  return (
    <section className="card fadein" style={{ padding: "1.2rem" }}>
      <h3 style={{ fontWeight: 800, marginBottom: "0.2rem" }}>📝 {task.titleDe}</h3>
      <div style={{ color: "var(--color-ink2)", marginBottom: "0.8rem" }}>
        {task.titleAr} — أربعة أقسام، ورقة واحدة، عتبة النجاح في الخطة 80%. التزم الصدق في التقييم الذاتي.
      </div>

      {text && (
        <>
          <h4 style={{ fontWeight: 800, margin: "0.8rem 0 0.4rem" }}>Teil 1 — Lesen (القراءة)</h4>
          <article
            className="de"
            style={{ display: "block", lineHeight: 1.9, background: "var(--color-paper2)", padding: "0.9rem", borderRadius: "0.7rem", marginBottom: "0.6rem" }}
          >
            {text.de}
          </article>
          <ExerciseSet items={lesenItems} onPoints={(p, m) => add("Lesen", p, m)} />
        </>
      )}

      {dlg && (
        <>
          <h4 style={{ fontWeight: 800, margin: "1rem 0 0.4rem" }}>Teil 2 — Hören (الاستماع)</h4>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => dlg.lines.forEach((l, i) => setTimeout(() => speakLine(l.de, undefined, { voiceName, rate }), i * 1600))}
            >
              🔊 شغّل الحوار (بلا نص!)
            </button>
            <button className="btn btn-ghost" onClick={() => stopSpeech()}>⏹ أوقف</button>
          </div>
          <ExerciseSet items={hoerenItems} onPoints={(p, m) => add("Hören", p, m)} />
        </>
      )}

      {strukturItems.length > 0 && (
        <>
          <h4 style={{ fontWeight: 800, margin: "1rem 0 0.4rem" }}>Teil 3 — Grammatik & Wortschatz</h4>
          <ExerciseSet items={strukturItems} onPoints={(p, m) => add("Struktur", p, m)} />
        </>
      )}

      {wr && (
        <>
          <h4 style={{ fontWeight: 800, margin: "1rem 0 0.4rem" }}>Teil 4 — Schreiben (الكتابة)</h4>
          <div className="card" style={{ padding: "0.7rem 0.9rem", marginBottom: "0.5rem", background: "var(--color-gold-soft)" }}>
            <De>{wr.taskDe}</De>
            <div style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>{wr.taskAr}</div>
          </div>
          <textarea
            className="field"
            rows={6}
            dir="ltr"
            style={{ lineHeight: 1.8 }}
            placeholder="Schreibe hier …"
            value={wrText}
            disabled={wrDone}
            onChange={(e) => setWrText(e.target.value)}
          />
          <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0", display: "grid", gap: "0.3rem" }}>
            {wr.criteria.map((c, i) => (
              <li key={c}>
                <label style={{ display: "flex", gap: "0.5rem", cursor: wrDone ? "default" : "pointer" }}>
                  <input
                    type="checkbox"
                    checked={!!wrChecks[i]}
                    disabled={wrDone}
                    onChange={() => setWrChecks((ch) => ({ ...ch, [i]: !ch[i] }))}
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
          {!wrDone ? (
            <button className="btn btn-primary" disabled={wrText.trim().length < 30} onClick={wrSubmit}>
              سلّم ورقة الكتابة
            </button>
          ) : (
            <div className="fadein">
              <strong>
                ✅ الورقة مُسلَّمة — تقييمك الذاتي:{" "}
                <span className="rtl-num">{Math.round(wrPct * 100)}%</span>
              </strong>
              <details style={{ marginTop: "0.4rem" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>نموذج الإجابة</summary>
                <article className="de" style={{ display: "block", lineHeight: 1.85, background: "var(--color-paper2)", padding: "0.7rem", borderRadius: "0.6rem", marginTop: "0.4rem" }}>
                  {wr.sample}
                </article>
              </details>
              <SchreibBerater text={wrText} taskDe={wr.taskDe} />
            </div>
          )}
        </>
      )}

      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginTop: "1.1rem", flexWrap: "wrap" }}>
        <button className="btn btn-gold" disabled={report !== null} onClick={auswerten}>
          📊 اجمع أوراق الامتحان — Auswerten
        </button>
        {(["Lesen", "Hören", "Struktur", "Schreiben"] as const).map((k) => {
          const p = teilPct(k);
          return (
            <span key={k} className="chip">
              {k}: {p === null ? "—" : `${p}%`}
            </span>
          );
        })}
      </div>

      {report && (
        <div
          className="card fadein"
          style={{
            marginTop: "0.9rem",
            padding: "1.1rem",
            background: report.passed ? "var(--color-gold-soft)" : "var(--color-cola-soft)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.2rem", fontWeight: 900 }} className="rtl-num">
            {report.pct}%
          </div>
          <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>الدرجة: {report.note}</div>
          <div style={{ marginTop: "0.3rem" }}>
            {report.passed ? "🎉 ناجح — أنت جاهز للمستوى التالي!" : "⚠️ دون عتبة 80% — سيرفع المحرّك ما لم يُتقَن تعويضاً إلزامياً."}
          </div>
          {report.schwach.length > 0 && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.92rem", textAlign: "start" }}>
              <strong>🧭 نقاط تحتاج تدريباً إضافياً:</strong>{" "}
              {report.schwach.join(" · ")} — راجعها في الحصص القادمة وستراها المحرّك في الاسترجاع.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** مقارنة المدرّس كلمة-بكلمة (تُستعمل داخل واجهات التمارين) */
export function LehrerDiff({ urteil }: { urteil: ReturnType<typeof deepReview> }) {
  if (!urteil.fehler.length) return null;
  return (
    <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
      {urteil.fehler.map((f, i) => (
        <div key={i} style={{ display: "flex", gap: "0.45rem", alignItems: "baseline", flexWrap: "wrap" }}>
          <span style={{ color: "var(--color-cola)", textDecoration: "line-through" }}>{f.wrong}</span>
          <span>→</span>
          <span style={{ color: "var(--color-a1)", fontWeight: 700 }}>{f.right}</span>
          <span style={{ color: "var(--color-ink2)", fontSize: "0.84rem" }}>👨‍🏫 {f.erklaerungAr}</span>
        </div>
      ))}
    </div>
  );
}
