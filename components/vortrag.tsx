"use client";
/**
 * ============================================================
 *  VortragsBühne (Modul AC) — منصة العرض: قالب Goethe الحقيقي
 * ------------------------------------------------------------
 *  المقياس الذي يفتّ به Goethe B2 Sprechen: تحضير 15 دقيقة،
 *  عرض أربع دقائق بحصونه الخمسة، ثم سؤالان من «الشريك».
 *  الموضوع محسوم بيومك (16 موضوعاً = 8 لوحات × 2)، والمؤقّت
 *  لا يرحم، والتقدير ذاتي بخمسة أركان — ولا يدخل شبكة الإتقان:
 *  العرض كالخطبة، يُقاس وقعه لا نقاطه.
 * ============================================================
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { Progress } from "@/lib/types";
import { vortrag, type VortragThema } from "@/lib/content";
import { rng } from "@/lib/plan";
import { speakDe } from "@/lib/speech";

const SAEULEN = [
  { ar: "بداية خطافية تُسمّي الموضوع", de: "Einstieg mit Leitfrage" },
  { ar: "تأطير الوضع الراهن بالأرقام/الأمثلة", de: "Bestandsaufnahme" },
  { ar: "حجج الطرفين بموازنة صريحة", de: "Pro und Contra abgewogen" },
  { ar: "رأيك الخاص المسبَّب بوضوح", de: "eigene begründete Meinung" },
  { ar: "خاتمة تُلخّص وتدعو للنقاش", de: "Abschluss mit Diskussionsimpuls" },
];

const URTEIL = (sum: number): string =>
  sum >= 9 ? "🏆 Bühnenreif — هذا عرض يفتح فم الممتحِن دهشةً" :
  sum >= 6 ? "🎯 على الطريق — اعمل على الركن الأضعف ثم أعد الوقوف" :
  "🌱 وقفة إحماء — لا عار؛ المذعور الأول على أي منصة كان هنا";

export function VortragsBühne({ progress }: { progress: Progress }) {
  const [phase, setPhase] = useState<"wahl" | "vorb" | "buehne" | "check">("wahl");
  const [zug, setZug] = useState(0);
  const [rest, setRest] = useState(0);
  const [noten, setNoten] = useState<number[]>([0, 0, 0, 0, 0]);
  const [frageIdx, setFrageIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const thema: VortragThema = useMemo(() => {
    const r = rng(progress.plan.day * 173 + 9 + zug * 7);
    return vortrag[Math.floor(r() * vortrag.length)];
  }, [progress.plan.day, zug]);

  useEffect(() => {
    if (phase !== "vorb" && phase !== "buehne") return;
    timerRef.current = setInterval(() => {
      setRest((s) => {
        if (s <= 1) {
          if (phase === "vorb") { setPhase("buehne"); return thema.dauer.vortrag_s; }
          setPhase("check");
        }
        return Math.max(0, s - 1);
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, thema]);

  function starten() {
    setNoten([0, 0, 0, 0, 0]);
    setFrageIdx(0);
    setRest(thema.dauer.vorbereitung_s);
    setPhase("vorb");
  }
  function protokoll() {
    const sum = noten.reduce((a, b) => a + b, 0);
    const rows = SAEULEN.map((s, i) => `<tr><td>${s.ar}</td><td dir="ltr">${s.de}</td><td style="text-align:center"><b>${noten[i]}/2</b></td></tr>`).join("");
    const html = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>بروتوكول عرض — ${thema.titel_de}</title>
<style>body{font-family:Georgia,serif;padding:2.2rem;max-width:44rem;margin:auto;color:#1c1917}table{width:100%;border-collapse:collapse;font-size:.85rem}td,th{border-bottom:1px solid #ccc;padding:.35rem .5rem;text-align:right}.box{border:1px solid #ddd;border-radius:10px;padding:.6rem .9rem;margin:.7rem 0;font-size:.85rem}@media print{button{display:none}}button{padding:.4rem .9rem;cursor:pointer}</style></head><body>
<button onclick="print()">🖨️ طباعة</button><h1>🎤 بروتوكول منصة العرض — VortragsBühne</h1>
<p>اليوم <b>${progress.plan.day}</b> · اللوحة: ${thema.unit} · «${thema.titel_de}» — ${thema.titel_ar}</p>
<div class="box" dir="ltr"><b>Auftrag:</b> ${thema.auftrag_de}</div>
<table><tr><th>الركن</th><th>بالألمانية</th><th>تقديرك</th></tr>${rows}
<tr><td colspan="2"><b>الإجمالي</b></td><td style="text-align:center"><b>${sum}/10</b></td></tr></table>
<div class="box"><b>سؤالا الشريك (تدرّب على الرد):</b><ul dir="ltr">${thema.partnerFragen.map((f) => `<li>${f}</li>`).join("")}</ul></div>
<p style="color:#666;font-size:.72rem">موضوع حتمي البذر (يوم ${progress.plan.day} · جولة ${zug + 1}) — يُطبع للورقة الرسمية في مركز التقارير، ولا يُغذّي SRS.</p>
</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  const mm = String(Math.floor(rest / 60)).padStart(2, "0");
  const ss = String(rest % 60).padStart(2, "0");
  const sum = noten.reduce((a, b) => a + b, 0);

  return (
    <div className="card fadein" id="vortrag" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".3rem" }}>
        <b style={{ color: "var(--color-cola)", fontSize: "1.02rem" }}>🎤 منصة العرض — VortragsBühne <span style={{ fontSize: ".75rem", color: "var(--color-ink2)" }}>(Modul AC · Goethe Kurzvortrag)</span></b>
        <span className="chip" dir="ltr">{phase === "wahl" ? "16 موضوعاً · 8 لوحات" : phase === "vorb" ? "Vorbereitung" : phase === "buehne" ? "Bühne — 4:00" : "danach"}</span>
      </div>

      {phase === "wahl" && (
        <div style={{ textAlign: "center", padding: ".7rem 0 .3rem" }}>
          <div style={{ fontSize: ".85rem", marginBottom: ".5rem" }}>موضوعك الليلة من لوحة <b>{thema.unit}</b> — محسوم بتاريخك، كما سيحصل في قاعة الامتحان:</div>
          <div className="de" style={{ fontWeight: 900, fontSize: "1rem" }}>„{thema.titel_de}“</div>
          <div style={{ fontSize: ".78rem", color: "var(--color-ink2)", margin: ".15rem 0 .6rem" }}>{thema.titel_ar}</div>
          <div style={{ display: "flex", gap: ".4rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={starten}>🎲 تحضير 15د ← عرض 4د</button>
            <button className="btn btn-ghost" onClick={() => setZug((z) => z + 1)}>↻ موضوع آخر</button>
          </div>
        </div>
      )}

      {phase !== "wahl" && (
        <div className="card" style={{ padding: ".8rem 1rem", marginTop: ".5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".4rem" }}>
            <b className="de">{thema.titel_de}</b>
            {phase !== "check" && (
              <span dir="ltr" className="rtl-num" style={{ fontWeight: 900, fontSize: "1.3rem", color: rest === 0 ? "var(--color-cola)" : phase === "buehne" ? "var(--color-cola)" : "var(--color-a1)" }}>{mm}:{ss}</span>
            )}
          </div>
          {phase !== "check" && (
            <div className="de" dir="ltr" style={{ fontSize: ".83rem", lineHeight: 1.55, margin: ".35rem 0", background: "var(--color-bg2)", borderRadius: 8, padding: ".45rem .7rem" }}>
              {thema.auftrag_de}
              <button className="btn btn-ghost" style={{ padding: ".1rem .5rem", marginInlineStart: ".4rem" }} onClick={() => speakDe(thema.auftrag_de)} title="استمع للأمر">🔊</button>
            </div>
          )}

          {phase === "vorb" && (
            <>
              <div style={{ fontWeight: 700, fontSize: ".74rem", margin: ".3rem 0" }}>أركان العرض الخمسة — خطّط لها بالترتيب:</div>
              <div style={{ display: "grid", gap: ".25rem" }}>
                {SAEULEN.map((s, i) => (
                  <div key={i} style={{ fontSize: ".78rem", color: "var(--color-ink2)" }}><b style={{ color: "var(--color-a1)" }}>{i + 1}.</b> {s.ar} <span className="de" dir="ltr" style={{ fontSize: ".7rem" }}>— {s.de}</span></div>
                ))}
              </div>
              <div style={{ fontWeight: 700, fontSize: ".74rem", margin: ".45rem 0 .2rem" }}>محاور الوجبات السريعة لعقلك:</div>
              <div style={{ display: "grid", gap: ".2rem" }}>
                {thema.aspekte.map((a, i) => (
                  <div key={i} className="de" dir="ltr" style={{ fontSize: ".78rem", paddingInlineStart: ".5rem", borderInlineStart: "2px solid var(--color-gold)" }}>{a}</div>
                ))}
              </div>
              <details style={{ margin: ".4rem 0" }}>
                <summary style={{ cursor: "pointer", fontSize: ".74rem", color: "var(--color-ink2)" }}>قوالب اللسان — Redemittel (لا تقرأها، امتصّها)</summary>
                <div style={{ display: "grid", gap: ".15rem", marginTop: ".3rem" }}>
                  {thema.redemittel.map((rd, i) => (
                    <div key={i} className="de" dir="ltr" style={{ fontSize: ".74rem", color: "var(--color-ink2)" }}>· {rd}</div>
                  ))}
                </div>
              </details>
              <button className="btn btn-primary" onClick={() => { setRest(thema.dauer.vortrag_s); setPhase("buehne"); }}>🎤 اصعد المنصة الآن (اقطع التحضير)</button>
            </>
          )}

          {phase === "buehne" && (
            <div style={{ textAlign: "center", padding: ".5rem 0" }}>
              <div style={{ fontSize: ".85rem" }}>🔴 على الهواء — تحدّث الآن بصوت مسموع، الأركان خمسة ولا متفرّج يرحم.</div>
              <div style={{ display: "grid", gap: ".15rem", margin: ".4rem 0", textAlign: "start" }}>
                {thema.aspekte.map((a, i) => (
                  <div key={i} className="de" dir="ltr" style={{ fontSize: ".74rem", color: "var(--color-ink2)" }}>{i + 1}. {a}</div>
                ))}
              </div>
              <button className="btn btn-ghost" onClick={() => setPhase("check")}>⏹ أنهيت — إلى المرآة</button>
            </div>
          )}

          {phase === "check" && (
            <div>
              <div style={{ fontWeight: 700, fontSize: ".75rem", margin: ".3rem 0" }}>المرآة — قدّر أركانك بصدق (0 لم أكن هنا · 1 كنت · 2 كنت وأسمعت)</div>
              {SAEULEN.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".5rem", padding: ".3rem 0", borderBottom: "1px solid var(--color-line)", flexWrap: "wrap" }}>
                  <span style={{ fontSize: ".79rem" }}>{s.ar} <span className="de" dir="ltr" style={{ color: "var(--color-ink2)", fontSize: ".7rem" }}>— {s.de}</span></span>
                  <span style={{ display: "flex", gap: ".25rem" }}>
                    {[0, 1, 2].map((v) => (
                      <button key={v} className="chip" style={{ cursor: "pointer", background: noten[i] === v ? "var(--color-cola)" : "white", color: noten[i] === v ? "white" : undefined, minWidth: 44 }} onClick={() => setNoten((n) => n.map((x, j) => (j === i ? v : x)))}>{v}</button>
                    ))}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: ".5rem", padding: ".45rem .7rem", borderRadius: 8, background: "var(--color-bg2)", fontSize: ".83rem" }}>
                <b dir="ltr" className="rtl-num">{sum}/10</b> — {URTEIL(sum)}
              </div>
              <div style={{ marginTop: ".5rem", border: "1px dashed var(--color-line)", borderRadius: 10, padding: ".5rem .7rem" }}>
                <div style={{ fontWeight: 700, fontSize: ".74rem", marginBottom: ".25rem" }}>❓ سؤال الشريك {frageIdx + 1} من {thema.partnerFragen.length} — أدر إليه الآن رداً بصوت مسموع:</div>
                <div className="de" dir="ltr" style={{ fontSize: ".8rem" }}>„{thema.partnerFragen[frageIdx]}“</div>
                <div style={{ display: "flex", gap: ".35rem", marginTop: ".4rem" }}>
                  <button className="btn btn-ghost" style={{ padding: ".15rem .6rem" }} onClick={() => speakDe(thema.partnerFragen[frageIdx])}>🔊 اسمع السؤال</button>
                  {frageIdx < thema.partnerFragen.length - 1 ? (
                    <button className="btn btn-ghost" style={{ padding: ".15rem .6rem" }} onClick={() => setFrageIdx((f) => f + 1)}>→ السؤال التالي</button>
                  ) : (
                    <button className="btn btn-ghost" style={{ padding: ".15rem .6rem" }} onClick={protokoll}>🖨️ بروتوكول مطبوع</button>
                  )}
                  <button className="btn btn-primary" style={{ padding: ".15rem .7rem" }} onClick={() => { setZug((z) => z + 1); setPhase("wahl"); }}>🎴 موضوع غداً</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
