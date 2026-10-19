"use client";
// 🎓 لوحة معايير Goethe الأربعة (E4/R173): مؤشرات آلية محلية + مستشار ذكاء اصطناعي اختياري (R170).
import { useMemo, useState } from "react";
import { KRITERIEN, bewerteKriterien } from "@/lib/kriterien";
import { llmBereit, llmKriterien, type LlmKriterienErgebnis } from "@/lib/grader";
import { loadProgress } from "@/lib/store";

const farbe = (p: number) => (p >= 70 ? "var(--color-a1)" : p >= 50 ? "var(--color-gold)" : p >= 35 ? "var(--color-b2)" : "var(--color-cola)");

export function KriterienPanel({
  text,
  ziel,
  art,
  taskDe,
}: {
  text: string;
  ziel: number;
  art: "brief" | "forum";
  taskDe: string;
}) {
  const erg = useMemo(() => bewerteKriterien(text, ziel, art), [text, ziel, art]);
  const [ki, setKi] = useState<LlmKriterienErgebnis | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const startKi = async () => {
    const cfg = loadProgress().settings.llm;
    if (!cfg?.apiKey) {
      setErr("لم تُفعَّل خدمة المدرّس الذكي بعد — أضف مفتاح API من الإعدادات (اختياري).");
      return;
    }
    if (!llmBereit(cfg)) {
      setErr("اخترتَ مزوّدًا لكنك لم تُفعّل موافقة الإرسال في الإعدادات — بلا موافقتك الصريحة لا يغادر أيّ نصّ جهازك.");
      return;
    }
    setBusy(true);
    setErr("");
    const res = await llmKriterien(cfg, taskDe, text, ziel);
    setBusy(false);
    if (res) setKi(res);
    else setErr("تعذّر الاتصال بالخدمة أو جاء ردّها بغير الصيغة المطلوبة — تحقّق من الإعدادات والشبكة، وبقي التقدير المحلي ظاهرًا.");
  };

  return (
    <div style={{ marginTop: "0.8rem" }}>
      <h4 style={{ fontWeight: 800, margin: "0 0 0.3rem" }}>🎓 نصّك بمعايير Goethe الأربعة</h4>
      <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginBottom: "0.5rem", lineHeight: 1.8 }}>
        إنجاز المهمة · المفردات · التراكيب · التماسك — هذه مؤشرات آلية تُحسب من نصّك نفسه (روابط وجدتها، جمل فرعية، تنوّع كلمات)،
        وهي تقديرٌ تدريبي لدعم حكمك، وليست درجة مصحّح بشري ولا نتيجة رسمية.
      </div>

      {erg.zuKurz && (
        <div className="card" style={{ padding: "0.6rem 0.8rem", background: "var(--color-gold-soft)", marginBottom: "0.5rem", fontWeight: 700 }}>
          ⚠️ قاعدة نصف الطول: كتبتَ <span className="rtl-num">{erg.woerter}</span> من <span className="rtl-num">{erg.ziel}</span> كلمة —
          في الامتحان الحقيقي تُحسب المهمة عندها غير مُنجزة (الإنجاز 0) مهما كانت جودة ما كُتب.
        </div>
      )}

      <div style={{ display: "grid", gap: "0.45rem" }}>
        {KRITERIEN.map((k) => {
          const w = erg.kriterien[k.key];
          return (
            <div key={k.key} className="card" style={{ padding: "0.6rem 0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
                <strong>
                  {k.ar} <span style={{ color: "var(--color-ink2)", fontWeight: 600 }}>({k.de})</span>
                </strong>
                <b className="rtl-num" style={{ color: farbe(w.punkte) }}>{w.punkte}/100</b>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "var(--color-paper)", margin: "0.35rem 0" }}>
                <div style={{ width: `${w.punkte}%`, height: "100%", borderRadius: 4, background: farbe(w.punkte) }} />
              </div>
              <ul style={{ margin: 0, paddingInlineStart: "1.1rem", fontSize: "0.85rem", lineHeight: 1.8, color: "var(--color-ink2)" }}>
                {w.hinweiseAr.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div style={{ fontWeight: 800, marginTop: "0.5rem" }}>
        المجموع الإشاري: <span className="rtl-num">{erg.gesamt}</span>/100
        <span style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--color-ink2)" }}> (متوسط المؤشرات الأربعة{erg.zuKurz ? " مع سقف قاعدة نصف الطول" : ""})</span>
      </div>

      <button className="btn btn-gold" style={{ marginTop: "0.6rem" }} disabled={busy} onClick={startKi}>
        {busy ? "… المستشار الذكي يقيّم بالمعايير" : "🤖 اطلب تقييم المستشار الذكي بالمعايير الأربعة (اختياري)"}
      </button>
      {err && <div style={{ color: "var(--color-cola)", fontSize: "0.88rem", marginTop: "0.4rem" }}>{err}</div>}
      {ki && (
        <div className="card fadein" style={{ marginTop: "0.6rem", padding: "0.8rem 1rem", background: "var(--color-gold-soft)" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
            🤖 تقييم مولّد بالذكاء الاصطناعي عبر مزوّد خارجي بمفتاحك (KI) — ليس مصحّحًا بشريًا ولا درجة رسمية؛ قارنه بالمؤشرات المحلية أعلاه وراجعه بعينٍ ناقدة.
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {ki.kriterien.map((k) => (
              <div key={k.name}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <strong>{k.name}</strong>
                  <b className="rtl-num" style={{ color: farbe(k.punkte) }}>{k.punkte}/100</b>
                </div>
                <div style={{ fontSize: "0.88rem", lineHeight: 1.8 }}>{k.kommentar}</div>
              </div>
            ))}
          </div>
          {ki.fazit && <div style={{ marginTop: "0.4rem", fontWeight: 700 }}>🎓 {ki.fazit}</div>}
        </div>
      )}
    </div>
  );
}
