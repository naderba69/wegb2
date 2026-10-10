"use client";
/**
 * ============================================================
 *  MündlichLabor (Modul AA) — مختبر الشفهي: Teil 2 · Teil 3
 * ------------------------------------------------------------
 *  InterviewArena تغطي Teil 1 من الامتحان الشفوي؛ هنا يسدّ
 *  الجزءان المتروكان لصديق أو لمدرس: وصف الصورة (240 ث)
 *  والمناقشة مع شريك افتراضي (300 ث). البطاقة حتمية كيومك،
 *  والمؤقّت يعدّ تنازلياً، والتقدير ذاتي بأربعة معايير —
 *  لا يُدخَل في شبكة الإتقان عمداً: الكلام الحر لا يُكافأ بالنقاط.
 * ============================================================
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { Progress } from "@/lib/types";
import { muendlich, type MuendlichKarte } from "@/lib/content";
import { planeEinwand } from "@/lib/muendlich";
import { speakDe } from "@/lib/speech";

function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const URTEIL = (sum: number): { ar: string; de: string; farbe: string } =>
  sum >= 7
    ? { ar: "تقديرك الذاتي مرتفع لهذه البطاقة؛ لا يثبت جاهزية الامتحان", de: "Selbsteinschätzung: stark", farbe: "var(--color-a1)" }
    : sum >= 4
      ? { ar: "اختر معياراً واحداً للتركيز عليه في الجولة التالية", de: "nächster Übungsfokus", farbe: "var(--color-gold)" }
      : { ar: "جولة تدريبية — ابدأ بمعيار واحد من البطاقة", de: "Übungsrunde", farbe: "var(--color-cola)" };

export function MündlichLabor({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [teil, setTeil] = useState<2 | 3>(2);
  const [zug, setZug] = useState(0);
  const [phase, setPhase] = useState<"wahle" | "lauf" | "check">("wahle");
  const [noten, setNoten] = useState<number[]>([0, 0, 0, 0]);
  const [rest, setRest] = useState(0);
  const [einwandGezeigt, setEinwandGezeigt] = useState(false);
  const [einwandAntwort, setEinwandAntwort] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const einwandAusgeloestRef = useRef(false);

  const karten = useMemo(() => muendlich.filter((k) => k.teil === teil), [teil]);
  const karte = useMemo<Required<Pick<MuendlichKarte,"id"|"teil"|"titel_de"|"titel_ar"|"auftrag_de"|"zeit_s"|"stuetzen"|"kriterien">> & MuendlichKarte>(() => {
    const r = rng(progress.plan.day * 131 + (teil === 2 ? 0 : 97) + zug * 13);
    const raw = karten[Math.floor(r() * karten.length)];
    return {
      ...raw,
      auftrag_de: raw.auftrag_de ?? raw.titel_de,
      stuetzen: raw.stuetzen ?? [],
      kriterien: raw.kriterien ?? [],
      zeit_s: raw.zeit_s ?? 240,
    };
  }, [karten, teil, zug, progress.plan.day]);
  const geplanterEinwand = useMemo(
    () => teil === 3 ? planeEinwand(karte.id, karte.einwaende ?? [], progress.plan.day, zug) : null,
    [karte, teil, progress.plan.day, zug],
  );

  useEffect(() => {
    if (phase !== "lauf") return;
    timerRef.current = setInterval(() => setRest((s) => Math.max(0, s - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "lauf" || teil !== 3 || !geplanterEinwand || einwandGezeigt || rest <= 0) return;
    const restBeiEinwand = karte.zeit_s - geplanterEinwand.nachSekunden;
    if (rest > restBeiEinwand || einwandAusgeloestRef.current) return;
    einwandAusgeloestRef.current = true;
    setEinwandGezeigt(true);
  }, [phase, teil, geplanterEinwand, einwandGezeigt, rest, karte.zeit_s]);

  function starten() {
    setNoten([0, 0, 0, 0]);
    setRest(karte.zeit_s);
    setEinwandGezeigt(false);
    setEinwandAntwort(false);
    einwandAusgeloestRef.current = false;
    setPhase("lauf");
  }
  function beenden() {
    setPhase("check");
  }
  function protokoll() {
    const sum = noten.reduce((a, b) => a + b, 0);
    const rows = karte.kriterien.map((k, i) => `<tr><td>${k.ar}</td><td dir="ltr">${k.de}</td><td style="text-align:center"><b>${noten[i]}/2</b></td></tr>`).join("");
    const html = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>بروتوكول شفهي — ${karte.titel_de}</title>
<style>body{font-family:Georgia,serif;color:#1c1917;padding:2.2rem;max-width:44rem;margin:auto}h1{font-size:1.05rem}
table{width:100%;border-collapse:collapse;font-size:.85rem}td,th{border-bottom:1px solid #ccc;padding:.35rem .5rem}
.box{border:1px solid #ddd;border-radius:10px;padding:.7rem 1rem;font-size:.85rem;margin:.8rem 0}code{background:#faf7f2;padding:.1rem .4rem;border-radius:6px}
@media print{button{display:none}}button{padding:.4rem .9rem;cursor:pointer}</style></head><body>
<button onclick="print()">🖨️ طباعة</button>
<h1>🗣️ بروتوكول مختبر الشفهي — MündlichLabor</h1>
<p>اليوم <code>${progress.plan.day}</code> · Teil ${teil} · «${karte.titel_de}» — ${karte.titel_ar}</p>
<div class="box"><b>المهمة:</b><p dir="ltr" style="margin:.3rem 0">${karte.auftrag_de}</p></div>
<table><tr><th>المعيار</th><th>بالألمانية</th><th>التقدير</th></tr>${rows}
<tr><td colspan="2"><b>الإجمالي</b></td><td style="text-align:center"><b>${sum}/8</b></td></tr></table>
<p style="color:#666;font-size:.75rem">مُشتقّ من ${karte.zeit_s} ثانية حتمية البذر (يوم ${progress.plan.day} · جولة ${zug + 1}) — لا يُحسب في شبكة الإتقان، الكلام الحر لا يُكافَأ بالنقاط.</p>
</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  const mm = String(Math.floor(rest / 60)).padStart(2, "0");
  const ss = String(rest % 60).padStart(2, "0");
  const sum = noten.reduce((a, b) => a + b, 0);
  const u = URTEIL(sum);

  return (
    <div className="card fadein" id="muendlich" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🗣️ مختبر الشفهي — MündlichLabor <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul AA · Teile 2·3)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        وصف صورة في أربع دقائق بمخمين ومؤشر ورأي — أو مناقشة بخمس دقائق بحجج من الطرفين، يتخللها اعتراض مفاجئ. التقدير ذاتي بثمان نقاط، ولا يُسجَّل الصوت ولا تُقيَّم اللغة آلياً.
      </div>
      {open && (
        <div>
          <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: ".6rem" }}>
            {([2, 3] as const).map((t) => (
              <button key={t} className="chip" style={{ cursor: "pointer", background: teil === t ? "var(--color-cola)" : "var(--ui-surface-raised)", color: teil === t ? "var(--ui-on-accent)" : undefined }} onClick={() => { setTeil(t); setPhase("wahle"); setZug(0); }}>
                {t === 2 ? "🖼️ وصف الصورة — Teil 2 (240ث)" : "💬 المناقشة — Teil 3 (300ث)"}
              </button>
            ))}
          </div>
          {phase === "wahle" && (
            <div style={{ textAlign: "center", padding: ".8rem 0" }}>
              <div style={{ fontSize: "0.85rem", marginBottom: ".6rem" }}>دورك في <b>اليوم {progress.plan.day}</b> محسوم: {karten.length} بطاقة لهذا الجزء وترتيبها حتمي كصباحك — لا اختيار، لا هروب.</div>
              {teil === 3 && <div data-testid="muendlich-einwand-hinweis" style={{ fontSize: ".76rem", color: "var(--color-ink2)", margin: "0 auto .6rem", maxWidth: "38rem" }}>قد يتدخل اعتراض ألماني مفاجئ أثناء الجولة. يمكنك طلب قراءته بصوت الجهاز؛ ويبقى النص ظاهراً إن تعذّر الصوت. لن يُسجَّل صوتك أو تُقيَّم لغتك آلياً.</div>}
              <button className="btn btn-primary" onClick={starten}>▶ ابدأ — اقلب المؤقّت</button>
            </div>
          )}
          {phase !== "wahle" && (
            <div className="card" style={{ padding: ".8rem 1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".4rem" }}>
                <b className="de" style={{ fontSize: "0.95rem" }}>{karte.titel_de}</b>
                {phase === "lauf" && (
                  <span dir="ltr" style={{ fontWeight: 900, fontSize: "1.3rem", color: rest === 0 ? "var(--color-cola)" : "var(--color-a1)" }} className="rtl-num">
                    {mm}:{ss}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: ".1rem 0 .5rem" }}>{karte.titel_ar}</div>
              <div className="de" dir="ltr" style={{ fontSize: "0.85rem", lineHeight: 1.55, background: "var(--color-bg2)", borderRadius: 8, padding: ".5rem .7rem" }}>
                {karte.auftrag_de}
                <button className="btn btn-ghost" style={{ padding: ".1rem .5rem", marginInlineStart: ".4rem" }} onClick={() => speakDe(karte.auftrag_de)} title="استمع للأمر">🔊</button>
              </div>
              {phase === "lauf" && (
                <>
                  <div style={{ margin: ".55rem 0 .2rem", fontWeight: 700, fontSize: "0.75rem", color: "var(--color-ink2)" }}>قوائم العون — Redemittel (تحدّث ولا تقرأ)</div>
                  <div style={{ display: "grid", gap: ".2rem" }}>
                    {karte.stuetzen.map((s, i) => (
                      <div key={i} className="de" dir="ltr" style={{ fontSize: "0.78rem", color: "var(--color-ink2)", paddingInlineStart: ".5rem", borderInlineStart: "2px solid var(--color-a1)" }}>{s}</div>
                    ))}
                  </div>
                  {einwandGezeigt && geplanterEinwand && (
                    <div role="alert" aria-live="assertive" data-testid="muendlich-einwand" style={{ marginTop: ".65rem", padding: ".65rem .8rem", border: "2px solid var(--color-cola)", borderRadius: 10, background: "var(--color-bg2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".4rem", flexWrap: "wrap" }}>
                        <strong>⚡ مقاطعة مفاجئة — Einwand</strong>
                        <button className="btn btn-ghost" style={{ padding: ".15rem .5rem" }} aria-label="استمع للاعتراض" onClick={() => speakDe(geplanterEinwand.einwand.de)}>🔊 اسمع الاعتراض</button>
                      </div>
                      <p className="de" dir="ltr" style={{ margin: ".35rem 0", fontWeight: 700 }}>{geplanterEinwand.einwand.de}</p>
                      <details style={{ fontSize: ".75rem", marginBlock: ".25rem" }}>
                        <summary style={{ cursor: "pointer" }}>ترجمة مساعدة</summary>
                        <p style={{ margin: ".25rem 0" }}>{geplanterEinwand.einwand.ar}</p>
                      </details>
                      <div style={{ fontSize: ".76rem", marginTop: ".35rem" }}>أجب الآن بصوت مسموع. النص ظاهر إن تعذّر صوت الجهاز؛ لا تسجيل ولا تقييم آلي للنطق أو الإجابة.</div>
                      {!einwandAntwort ? (
                        <button className="btn btn-primary" data-testid="muendlich-einwand-antwort" style={{ marginTop: ".45rem", padding: ".2rem .65rem" }} onClick={() => setEinwandAntwort(true)}>✅ رددتُ عليه شفهياً</button>
                      ) : (
                        <div role="status" data-testid="muendlich-einwand-bestaetigt" style={{ marginTop: ".4rem", fontSize: ".74rem" }}>تمّ الإقرار بمحاولة الرد ذاتياً فقط؛ لا يُعدّ هذا إثباتاً للنطق أو للاستقلال.</div>
                      )}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: ".4rem", marginTop: ".6rem", flexWrap: "wrap" }}>
                    <button className="btn btn-primary" onClick={beenden}>⏹ أنهيت — إلى التقدير</button>
                    <button className="btn btn-ghost" onClick={() => { setPhase("wahle"); }}>↺ تراجع</button>
                  </div>
                  {rest === 0 && <div style={{ marginTop: ".4rem", fontSize: "0.78rem", color: "var(--color-cola)", fontWeight: 700 }}>انتهى الوقت — حتى لو بقيت جملة في حلقك: اضغط «أنهيت».</div>}
                </>
              )}
              {phase === "check" && (
                <div style={{ marginTop: ".5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.75rem", marginBottom: ".35rem" }}>التقدير الذاتي — صدق مع نفسك لا مع الشبكة</div>
                  {karte.kriterien.map((kr, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".5rem", padding: ".3rem 0", borderBottom: "1px solid var(--color-line)", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.8rem" }}>{kr.ar} <span className="de" dir="ltr" style={{ color: "var(--color-ink2)", fontSize: "0.72rem" }}>— {kr.de}</span></span>
                      <span style={{ display: "flex", gap: ".25rem" }}>
                        {[0, 1, 2].map((v) => (
                          <button key={v} className="chip" style={{ cursor: "pointer", background: noten[i] === v ? "var(--color-cola)" : "var(--ui-surface-raised)", color: noten[i] === v ? "var(--ui-on-accent)" : undefined, minWidth: 44 }} onClick={() => setNoten((n) => n.map((x, j) => (j === i ? v : x)))}>
                            {v}
                          </button>
                        ))}
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: ".6rem", padding: ".5rem .7rem", borderRadius: 8, background: "var(--color-bg2)", fontSize: "0.85rem" }}>
                    <b dir="ltr" className="rtl-num">{sum}/8</b> — <span style={{ color: u.farbe, fontWeight: 700 }}>{u.ar}</span> <span className="de" dir="ltr" style={{ color: "var(--color-ink2)", fontSize: "0.75rem" }}>({u.de})</span>
                  </div>
                  <div style={{ display: "flex", gap: ".4rem", marginTop: ".55rem", flexWrap: "wrap" }}>
                    <button className="btn btn-ghost" onClick={protokoll}>🖨️ بروتوكول مطبوع</button>
                    <button className="btn btn-primary" onClick={() => { setZug((z) => z + 1); setEinwandGezeigt(false); setEinwandAntwort(false); setPhase("wahle"); }}>🎴 بطاقة أخرى لنفس الجزء</button>
                    <button className="btn btn-ghost" onClick={() => setPhase("wahle")}>↩︎ رجوع</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
