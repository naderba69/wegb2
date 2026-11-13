"use client";
/**
 * مقارنة الحمل الزمني الإرشادية.
 * تفصل بين هدف الجلسة، والمسار الأساسي، والتعميق الاختياري، والوقت المقاس.
 * نطاقات الدورات سياق تخطيطي فقط ولا تُحوَّل إلى مستوى CEFR أو جاهزية امتحان.
 */
import { useEffect, useState } from "react";
import type { Progress } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import {
  planArbeitslast,
  planKernStundenBis,
  planKernTagesMinuten,
  planTagesMinuten,
  planVertiefungTagesMinuten,
} from "@/lib/plan";
import { PHASEN, LERNLAST } from "@/lib/phasen";
import {
  ZEITLAST_POSITION_AR,
  vergleicheZeitlast,
  minutenEffektiv,
  minutenZuStunden,
  MAX_MIN_PRO_TASK,
} from "@/lib/cefr";
import { bucheMinuten, loadProgress, PROGRESS_EVENT } from "@/lib/store";

export function StundenVertrag({ progress }: { progress: Progress }) {
  const [eingabe, setEingabe] = useState("");
  /* الإدخال اليدوي يحدث السجل مباشرة؛ نتابع حدث الحالة كي يتحدث العرض من دون
     خلطه بدقائق المؤقت المقاسة. */
  const [live, setLive] = useState<Progress | null>(null);
  useEffect(() => {
    const onChange = () => setLive(loadProgress());
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, []);
  const stand = live ?? progress;

  const arbeitslast = planArbeitslast();
  const vergleich = vergleicheZeitlast(planKernStundenBis);
  const tag = Math.min(Math.max(stand.plan.day | 0, 1), TOTAL_DAYS);
  const tagesSchaetzung = planTagesMinuten(tag);
  const kernSchaetzung = planKernTagesMinuten(tag);
  const vertiefungSchaetzung = planVertiefungTagesMinuten(tag);
  const heuteGemessen = Math.max(0, stand.plan.minutenEffektivTage?.[tag] ?? 0);
  const stdBisher = planKernStundenBis(tag);
  const effektiv = minutenEffektiv(stand);
  const stdEffektiv = minutenZuStunden(effektiv);
  const manuell = Math.max(0, stand.plan.minutenManuell ?? 0);
  const stdManuell = minutenZuStunden(manuell);
  const quote = stdBisher > 0 ? Math.round((stdEffektiv / stdBisher) * 100) : 0;

  const buchen = () => {
    const z = bucheMinuten(Number(eingabe), tag);
    if (z > 0) setEingabe("");
  };

  return (
    <section className="card" style={{ padding: "1.1rem 1.2rem" }} data-testid="stundenvertrag">
      <h2 style={{ fontWeight: 800, marginBottom: "0.35rem" }}>⏱️ مقارنة الحمل الزمني الإرشادية</h2>
      <p style={{ color: "var(--color-ink2)", fontSize: "0.88rem", marginBottom: "0.8rem", lineHeight: 1.8 }}>
        هذه أرقام مختلفة: هدف جلسة، ومسار أساسي يغلق اليوم، وتعميق اختياري، ووقت قاسه المؤقت. بلوغ هدف الجلسة لا يثبت إكمال الأساسي، وأي إدخال يدوي يبقى منفصلاً عن القياس.
      </p>

      {/* هدف الجلسة · حمل اليوم الكامل · القياس الفعلي */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.6rem", marginBottom: "0.7rem" }} data-testid="zeitmodell-drei-zahlen">
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>هدف الجلسة الافتراضي — التوقف قبله مسموح</div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800 }} className="rtl-num" data-testid="sitzungsziel-minuten">{arbeitslast.sitzungszielMinuten} د</div>
        </div>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem", borderInlineStart: "3px solid var(--color-a1)" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>المسار الأساسي لليوم {tag} — يدخل الإغلاق</div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800 }} className="rtl-num" data-testid="kernlast-minuten">{kernSchaetzung} د</div>
        </div>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>التعميق الاختياري / الكتالوج الكامل</div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800 }} className="rtl-num" data-testid="tageslast-minuten">+{vertiefungSchaetzung} / {tagesSchaetzung} د</div>
        </div>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>وقت اليوم الذي قاسه المؤقت</div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800 }} className="rtl-num" data-testid="heute-gemessen-minuten">{heuteGemessen.toFixed(1)} د</div>
        </div>
      </div>

      <div className="grid2" style={{ gap: "0.6rem", marginBottom: "0.9rem" }}>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>المسار الأساسي ({arbeitslast.tage} يوماً · متوسط {arbeitslast.durchschnittKernMinutenProTag.toFixed(1)} د/يوم)</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800 }} className="rtl-num" data-testid="stunden-plan">{arbeitslast.kernStunden.toFixed(1)} س</div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
            التعميق الاختياري: <span className="rtl-num">{arbeitslast.vertiefungStunden.toFixed(1)} س</span> · الكتالوج الكامل: <span className="rtl-num">{arbeitslast.stunden.toFixed(1)} س</span>
          </div>
        </div>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>مجموع الوقت الذي قاسه المؤقت</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800 }} className="rtl-num" data-testid="stunden-effektiv">{stdEffektiv.toFixed(1)} س</div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
            مُبلّغ عنه يدوياً، غير مقاس: <span className="rtl-num" data-testid="stunden-manuell">{stdManuell.toFixed(1)} س</span>
          </div>
        </div>
      </div>

      {/* مقارنة زمنية وصفية لا حكم كفاءة */}
      <div style={{ overflowX: "auto", marginBottom: "0.7rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <caption style={{ textAlign: "start", fontWeight: 700, paddingBottom: "0.35rem" }}>سياق زمني: تقدير المسار الأساسي ونطاقات ساعات دورات Goethe المنشورة</caption>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "start" }}>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>قسم الخطة</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>المسار الأساسي التراكمي</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>نطاق ساعات الدورة</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>مقارنة وصفية</th>
            </tr>
          </thead>
          <tbody>
            {vergleich.map((u) => (
              <tr key={u.level} style={{ borderBottom: "1px solid var(--color-line)" }} data-testid={`cefr-zeile-${u.level}`}>
                <td style={{ padding: "0.4rem", fontWeight: 700 }}>{u.level}</td>
                <td style={{ padding: "0.4rem" }} className="rtl-num">{u.planStd} س</td>
                <td style={{ padding: "0.4rem" }} className="rtl-num">{u.kursSpanne[0]}–{u.kursSpanne[1]} س</td>
                <td style={{ padding: "0.4rem", color: ZEITLAST_POSITION_AR[u.position].farb, fontSize: "0.82rem" }}>
                  {ZEITLAST_POSITION_AR[u.position].text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "var(--color-paper2)", borderInlineStart: "3px solid var(--color-mid)", borderRadius: "6px", padding: "0.7rem 0.85rem", marginBottom: "0.9rem", fontSize: "0.88rem", lineHeight: 1.8 }} data-testid="stunden-einordnung">
        <strong>حدود المقارنة:</strong> الساعات تصف حملاً زمنياً ولا تقيس الكفاءة. نافذة المسار الأساسي 45–90 دقيقة قرار تخطيط داخلي غير مُثبت بعد بدراسة التزام/تعب ميدانية. لا يمكن استنتاج أنك بلغت A1 أو A2 أو B1 أو B2 من الوقت أو النشاط وحدهما؛ إثبات المستوى يحتاج أداءً متعدد المهارات وتقويماً مناسباً، وجاهزية الامتحان غير مقاسة هنا.
      </div>

      <div style={{ marginBottom: "0.9rem" }} data-testid="phasen-verteilung">
        <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>📐 توزيع الأيام وتقديرات المهام</div>
        <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.45rem" }}>
          تقدير مهام اليوم يتغير حسب قسم الخطة؛ هذه القيم محسوبة من المهام الحالية وليست ساعات يجب تحويلها إلى حكم لغوي.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-line)" }}>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>القسم</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>الأيام</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>أسابيع</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>معامل التقدير</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>الأساسي د/يوم</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>الاختياري د/يوم</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>الكل د/يوم</th>
            </tr>
          </thead>
          <tbody>
            {(["A1", "A2", "B1", "B2"] as const).map((level) => {
              const phase = arbeitslast.phasen[level];
              return (
                <tr key={level} style={{ borderBottom: "1px solid var(--color-line)" }} data-testid={`phase-zeile-${level}`}>
                  <td style={{ padding: "0.3rem 0.4rem", fontWeight: 700 }}>{level}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{phase.von}–{phase.bis}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{PHASEN[level].wochen}{level === "B2" ? " + ختام" : ""}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">×{LERNLAST[level].toFixed(2)}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{phase.durchschnittKernMinutenProTag.toFixed(1)}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{phase.durchschnittVertiefungMinutenProTag.toFixed(1)}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{phase.durchschnittMinutenProTag.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: "0.85rem", marginBottom: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", gap: "0.5rem", flexWrap: "wrap" }}>
          <span>الوقت المقاس مقابل تقدير المسار الأساسي حتى اليوم {tag}</span>
          <strong className="rtl-num">{stdEffektiv.toFixed(1)} س / {stdBisher.toFixed(1)} س · {quote}٪</strong>
        </div>
        <div style={{ height: "8px", background: "var(--color-paper2)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(100, quote)}%`, height: "100%", background: "var(--color-mid)" }} />
        </div>
        <div style={{ color: "var(--color-ink2)", fontSize: "0.78rem", marginTop: "0.3rem" }}>
          هذه نسبة زمنية وصفية فقط: اختلافها قد يعني توقفات أو عملاً خارج المؤقت أو اختلاف سرعة التعلم، ولا يعني نجاحاً أو فشلاً أو مستوىً لغوياً.
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", paddingTop: "0.6rem", borderTop: "1px solid var(--color-line)" }} data-testid="stunden-manual-entry">
        <label htmlFor="minuten-buchen" style={{ fontSize: "0.85rem", fontWeight: 700 }}>أدخل وقتاً أبلغت عنه اليوم (غير مقاس):</label>
        <input
          id="minuten-buchen"
          className="field"
          type="number"
          min={1}
          max={MAX_MIN_PRO_TASK}
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder="دقائق"
          style={{ width: "7rem", minHeight: "44px" }}
        />
        <button className="btn btn-primary" data-testid="manual-time-add" onClick={buchen} disabled={!(Number(eingabe) > 0)} style={{ minHeight: "44px" }}>
          أضف إلى الإدخال اليدوي
        </button>
        <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
          الحد {MAX_MIN_PRO_TASK} دقيقة في الإدخال الواحد؛ لن يزيد وقت المؤقت المقاس.
        </span>
      </div>

      <p style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.7rem", lineHeight: 1.8 }}>
        المصدر السياقي: تقديرات Goethe-Institut لساعات الدورات التراكمية من الصفر. تختلف الخبرة والنتائج بين المتعلمين؛ CEFR يصف أداءً لغوياً، لا عدداً من الساعات.
      </p>
    </section>
  );
}
