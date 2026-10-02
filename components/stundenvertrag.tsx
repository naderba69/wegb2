"use client";
/**
 * ⏱️ عقد الساعات — StundenVertrag
 * ═══════════════════════════════════════════════════════════════
 *  يعرض للمتعلّم ثلاثة أرقام لا رقماً واحداً:
 *    (١) ما تخطِّطُه له الخطةُ فعلاً (محسوب من buildDay، لا مكتوب يدوياً)
 *    (٢) ما يطلبُه مرجعُ CEFR لكل مستوى
 *    (٣) ما قضاه هو فعلاً (محجوز بيده — فلا قياس بلا تسجيل)
 *  ثم يقول له بصراحة أيَّ مستوى يبلغُه بهذا الحمل.
 *
 *  لماذا هذه اللوحة موجودة: لأنَّ وعداً لا يُقابَلُ بمرجعٍ هو ادّعاء.
 *  والخطةُ كانت تعدُ B2 وهي تخطِّط 517.6 ساعة، ومرجعُ B2 يبدأ من 600.
 *  هذا لا يُصلَحُ بإخفائه — يُصلَحُ بقولِه وبفتحِ طريقٍ أثقل لمن أراده.
 * ═══════════════════════════════════════════════════════════════
 */
import { useEffect, useState } from "react";
import type { Progress } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import { planStundenBis, planStundenGesamt } from "@/lib/plan";
import { PHASEN, LERNLAST, PHASE_END_DAY } from "@/lib/phasen";
import {
  CEFR_STUNDEN,
  URTEIL_AR,
  vergleichePlan,
  erreichbaresNiveau,
  minutenEffektiv,
  minutenZuStunden,
  clampMinuten,
  MAX_MIN_PRO_TASK,
} from "@/lib/cefr";
import { bucheMinuten, loadProgress, PROGRESS_EVENT } from "@/lib/store";

/** الصياغة العربية للحكم — واحدة في كل المشروع حتى لا تختلف الشاشات */
export function urteilZeile(u: ReturnType<typeof vergleichePlan>[number]): string {
  return `${u.level}: خطَّتنا ${u.planStd} س · مرجع CEFR ${u.ref[0]}–${u.ref[1]} س · ${URTEIL_AR[u.urteil].emoji} ${URTEIL_AR[u.urteil].text}`;
}

export function StundenVertrag({ progress }: { progress: Progress }) {
  const [eingabe, setEingabe] = useState("");
  /* الحجزُ يُغيِّر الحالةَ مباشرةً عبر bucheMinuten، والأبُ لا يُمرِّرُ prop جديدة —
     فاللوحةُ تشتركُ في حدثِ الحالةِ نفسه الذي يشتركُ فيه useProgress، وإلّا
     عرضت رقماً قديماً بعد الحجز (وهذا عطلٌ ظهر في XLVI18 وأُصلِح هنا). */
  const [live, setLive] = useState<Progress | null>(null);
  useEffect(() => {
    const onChange = () => setLive(loadProgress());
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, []);
  const stand = live ?? progress;

  const vergleich = vergleichePlan(planStundenBis);
  const gesamt = planStundenGesamt();
  const niveau = erreichbaresNiveau(vergleich);
  const b2 = vergleich[3];

  const tag = Math.min(Math.max(stand.plan.day | 0, 1), TOTAL_DAYS);
  const stdBisher = planStundenBis(tag);
  const effektiv = minutenEffektiv(stand);
  const stdEffektiv = minutenZuStunden(effektiv);
  const quote = stdBisher > 0 ? Math.round((stdEffektiv / stdBisher) * 100) : 0;

  const buchen = () => {
    const z = bucheMinuten(Number(eingabe));
    if (z > 0) setEingabe("");
  };

  return (
    <section className="card" style={{ padding: "1.1rem 1.2rem" }} data-testid="stundenvertrag">
      <h2 style={{ fontWeight: 800, marginBottom: "0.35rem" }}>⏱️ عقد الساعات — Stundenvertrag</h2>
      <p style={{ color: "var(--color-ink2)", fontSize: "0.88rem", marginBottom: "0.8rem" }}>
        كلُّ رقمٍ هنا محسوبٌ من الخطةِ نفسِها ومن مرجعِ CEFR — لا مكتوبٌ يدوياً ولا مُقدَّر.
        ما لا يُقاس لا يُدَّعى.
      </p>

      {/* ── الأرقام الثلاثة ── */}
      <div className="grid2" style={{ gap: "0.6rem", marginBottom: "0.9rem" }}>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>ما تخطِّطُه الخطةُ كلَّها ({TOTAL_DAYS} يوماً)</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800 }} className="rtl-num" data-testid="stunden-plan">{gesamt.toFixed(1)} س</div>
        </div>
        <div style={{ background: "var(--color-paper2)", borderRadius: "8px", padding: "0.7rem 0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>ما قضيتَه فعلاً (محجوزٌ بيدك)</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800 }} className="rtl-num" data-testid="stunden-effektiv">{stdEffektiv.toFixed(1)} س</div>
        </div>
      </div>

      {/* ── جدول المقارنة ── */}
      <div style={{ overflowX: "auto", marginBottom: "0.9rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "start" }}>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>المستوى</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>ساعاتُ خطَّتنا (تراكمية)</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>مرجع CEFR</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>التغطية</th>
              <th style={{ padding: "0.35rem 0.4rem", textAlign: "start" }}>الحكم</th>
            </tr>
          </thead>
          <tbody>
            {vergleich.map((u) => (
              <tr key={u.level} style={{ borderBottom: "1px solid var(--color-line)" }} data-testid={`cefr-zeile-${u.level}`}>
                <td style={{ padding: "0.4rem", fontWeight: 700 }}>{u.level}</td>
                <td style={{ padding: "0.4rem" }} className="rtl-num">{u.planStd} س</td>
                <td style={{ padding: "0.4rem" }} className="rtl-num">{u.ref[0]}–{u.ref[1]} س</td>
                <td style={{ padding: "0.4rem" }} className="rtl-num">{u.deckungProzent}٪</td>
                <td style={{ padding: "0.4rem", color: URTEIL_AR[u.urteil].farb, fontSize: "0.82rem" }}>
                  {URTEIL_AR[u.urteil].emoji} {URTEIL_AR[u.urteil].text}
                  {u.fehlendBisMinimum > 0 && (
                    <span style={{ display: "block", color: "var(--color-ink2)" }}>
                      ينقصُ {u.fehlendBisMinimum} س للوصولِ إلى أدنى النطاق
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── الحكم الصريح ── */}
      <div style={{ background: URTEIL_AR[b2.urteil].farb === "var(--color-cola)" ? "var(--color-cola-soft)" : "var(--color-paper2)", borderInlineStart: `3px solid ${URTEIL_AR[b2.urteil].farb}`, borderRadius: "6px", padding: "0.7rem 0.85rem", marginBottom: "0.9rem", fontSize: "0.88rem" }} data-testid="stunden-urteil">
        <strong>الحكمُ الصريح:</strong> بهذا الحملِ المخطَّط تبلغُ <strong>{niveau}</strong> بمستوى مرجعِ CEFR.
        {b2.urteil === "weitDarunter" || b2.urteil === "darunter" ? (
          <>
            {" "}و<b>B2 يحتاج {CEFR_STUNDEN.B2[0]}–{CEFR_STUNDEN.B2[1]} ساعة</b>، وخطَّتنا تنتهي عند {gesamt.toFixed(1)} س —
            أي ينقصُها <b>{b2.fehlendBisMinimum} ساعة</b> على الأقل.
            <span style={{ display: "block", marginTop: "0.35rem" }}>
              هذا ليس تقصيراً منك ولا من المحتوى — بل في <b>توزيعِ الساعات</b>: مرحلتا A1 وA2 وافيتان،
              ومرحلةُ B2 أقصرُ المراحلِ وهي أثقلُها مطلباً. الطريقُ إلى B2 يمرُّ بزيادةِ الحملِ اليوميِّ أو إطالةِ المرحلة، وكلاهما قرارُك.
            </span>
          </>
        ) : (
          <> والحملُ المخطَّطُ يفي بالمرجع في كلِّ مرحلة.</>
        )}
      </div>

      {/* ── التوزيع الأكاديمي: كيف وُزِّعت الأيام والحمل ── */}
      <div style={{ marginBottom: "0.9rem" }} data-testid="phasen-verteilung">
        <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>📐 التوزيع الأكاديمي للأيام والحمل</div>
        <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0 0 0.45rem" }}>
          الأيامُ موزَّعةٌ بأوزانِ زيادةِ ساعاتِ CEFR بين المستويات (لا بالتساوي)، والحملُ اليوميُّ يتصاعدُ مع المستوى — المبتدئُ أخفّ، وB2 أطولُ وأثقل.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-line)" }}>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>المستوى</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>الأيام</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>أسابيع</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>معامل الحمل</th>
              <th style={{ padding: "0.3rem 0.4rem", textAlign: "start" }}>ساعة/يوم</th>
            </tr>
          </thead>
          <tbody>
            {(["A1", "A2", "B1", "B2"] as const).map((L) => {
              const von = PHASEN[L].von, bis = PHASE_END_DAY[L];
              const proTag = (planStundenBis(bis) - planStundenBis(von - 1)) / (bis - von + 1);
              return (
                <tr key={L} style={{ borderBottom: "1px solid var(--color-line)" }} data-testid={`phase-zeile-${L}`}>
                  <td style={{ padding: "0.3rem 0.4rem", fontWeight: 700 }}>{L}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{von}–{bis}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{PHASEN[L].wochen}{L === "B2" ? " + ختام" : ""}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">×{LERNLAST[L].toFixed(2)}</td>
                  <td style={{ padding: "0.3rem 0.4rem" }} className="rtl-num">{proTag.toFixed(1)} س</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── نسبة التحقيق ── */}
      <div style={{ fontSize: "0.85rem", marginBottom: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>ما قضيتَه مقابلَ ما خُطِّط حتى يومِك ({tag})</span>
          <strong className="rtl-num">{stdEffektiv.toFixed(1)} س / {stdBisher.toFixed(1)} س · {quote}٪</strong>
        </div>
        <div style={{ height: "8px", background: "var(--color-paper2)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(100, quote)}%`, height: "100%", background: quote >= 80 ? "var(--color-ok)" : quote >= 50 ? "var(--color-gold)" : "var(--color-cola)" }} />
        </div>
        <div style={{ color: "var(--color-ink2)", fontSize: "0.78rem", marginTop: "0.3rem" }}>
          {quote < 50
            ? "أقلُّ من نصفِ المخطَّط — الساعاتُ المرجعيةُ لا تتحقَّقُ بهذا الإيقاع، والوعدُ ينسحبُ على من أتمَّ حملَه."
            : quote < 80
              ? "تسيرُ دون المخطَّط — لا بأس إن كان مقصوداً، لكنَّ الرقمَ أعلاه سيتأخَّر عن المرجع."
              : "أنت عند الحملِ المخطَّط أو فوقه — الرقمُ أعلاه صادقٌ بحقّك."}
        </div>
      </div>

      {/* ── حجز الوقت ── */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", paddingTop: "0.6rem", borderTop: "1px solid var(--color-line)" }}>
        <label htmlFor="minuten-buchen" style={{ fontSize: "0.85rem", fontWeight: 700 }}>احجِز ما قضيتَه اليوم:</label>
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
        <button className="btn btn-primary" onClick={buchen} disabled={!(Number(eingabe) > 0)} style={{ minHeight: "44px" }}>
          ⏱️ احجِز
        </button>
        <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
          الحدُّ {MAX_MIN_PRO_TASK} دقيقةً في الحجزِ الواحد — تبويبٌ مفتوحٌ ومنسيٌّ ليس ساعةَ دراسة.
        </span>
      </div>

      <p style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.7rem" }}>
        مرجعُ الساعات: نطاقاتُ Goethe-Institut / telc التراكمية من الصفر. وهي <strong>نطاقات</strong> لا أرقامٌ حاسمة،
        تختلفُ باختلافِ اللغةِ الأمِّ والخبرةِ السابقةِ بالتعلّم — والعربيةُ أبعدُ عن الألمانيةِ من جاراتِها، فالحدُّ الأعلى أقربُ إليك من الأدنى.
      </p>
    </section>
  );
}
