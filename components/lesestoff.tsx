"use client";
// 📚 R300: محطة القراءة والحوارات الحرة — نصوص وقصص وحوارات جديدة لكل المستويات (خارج خطة الـ378 يومًا)
import { useEffect, useMemo, useState } from "react";
import {
  FREIE_TEXTE,
  FREIE_DIALOGE,
  STOFF_STUFEN,
  texteFuer,
  dialogeFuer,
  type StoffFrage,
} from "@/lib/lesestoff";
import { speakAny } from "@/lib/speech";
import { De } from "@/components/De";
import type { Level } from "@/lib/types";

const LS_KEY = "weg-lesestoff-v1";
const ART_ICON: Record<string, string> = { geschichte: "📖 قصة", alltag: "🏠 حياة يومية", wissen: "💡 معرفة" };

function FragenBlock({ fragen, praefix }: { fragen: StoffFrage[]; praefix: string }) {
  const [antworten, setAntworten] = useState<Record<number, number>>({});
  const punkte = fragen.filter((f, i) => antworten[i] === f.richtig).length;
  const alleBeantwortet = fragen.every((_, i) => antworten[i] !== undefined);
  return (
    <div style={{ display: "grid", gap: "0.7rem" }} data-testid={`lesestoff-fragen-${praefix}`}>
      <strong>❓ أسئلة الفهم — نتيجتك: <span className="rtl-num">{punkte}</span>/<span className="rtl-num">{fragen.length}</span></strong>
      {fragen.map((f, i) => (
        <div key={i} style={{ display: "grid", gap: "0.35rem" }}>
          <De style={{ fontWeight: 700 }}>{f.frageDe}</De>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            {f.optionen.map((opt, oi) => {
              const gewaehlt = antworten[i] === oi;
              const richtig = antworten[i] !== undefined && oi === f.richtig;
              const falsch = gewaehlt && oi !== f.richtig;
              return (
                <button key={oi} type="button" className="btn btn-ghost"
                  data-testid={`lesestoff-opt-${praefix}-${i}-${oi}`}
                  disabled={antworten[i] !== undefined}
                  onClick={() => setAntworten((a) => ({ ...a, [i]: oi }))}
                  style={{ minHeight: "44px", textAlign: "start", background: richtig ? "var(--color-mint, #d1fae5)" : falsch ? "var(--color-blush, #fee2e2)" : undefined }}>
                  {opt} {richtig ? "✓" : falsch ? "✗" : ""}
                </button>
              );
            })}
          </div>
          {antworten[i] !== undefined && (
            <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
              {antworten[i] === f.richtig ? "✅ أحسنت! " : "💡 "}{f.erklaerAr}
            </div>
          )}
        </div>
      ))}
      {alleBeantwortet && (
        <div style={{ fontSize: "0.88rem" }}>
          {punkte === fragen.length ? "🏆 ممتاز! فهمت كل شيء." : "🏁 انتهيت. أعد القراءة وجرّب مرة أخرى متى شئت — التكرار يثبّت الفهم."}
        </div>
      )}
    </div>
  );
}

export function LeseStoffStation() {
  const [stufe, setStufe] = useState<Level>("A0");
  const [offenId, setOffenId] = useState<string | null>(null);
  const [fertig, setFertig] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setFertig(JSON.parse(raw) as string[]);
    } catch { /* تجاهل */ }
  }, []);

  const markieren = (id: string) => {
    setFertig((alt) => {
      if (alt.includes(id)) return alt;
      const neu = [...alt, id];
      try { localStorage.setItem(LS_KEY, JSON.stringify(neu)); } catch { /* تجاهل */ }
      return neu;
    });
  };

  const texte = useMemo(() => texteFuer(stufe), [stufe]);
  const dialoge = useMemo(() => dialogeFuer(stufe), [stufe]);
  const offenerText = FREIE_TEXTE.find((t) => t.id === offenId) ?? null;
  const offenerDialog = FREIE_DIALOGE.find((d) => d.id === offenId) ?? null;
  const gesamt = FREIE_TEXTE.length + FREIE_DIALOGE.length;

  return (
    <section className="card" data-testid="lesestoff-station" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>📚 قراءة وحوارات حرة جديدة (15 نصًّا و10 حوارات — كل المستويات)</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        قصص ونصوص وحوارات إضافية خارج خطة الـ378 يومًا: اقرأ أو استمع بصوت جهازك، ثم أجب عن أسئلة الفهم.
        أتممتَ <strong className="rtl-num">{fertig.length}</strong> من <strong className="rtl-num">{gesamt}</strong> حتى الآن.
      </div>

      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }} role="group" aria-label="المستوى">
        {STOFF_STUFEN.map((s) => (
          <button key={s} type="button" className="chip" data-testid={`lesestoff-stufe-${s}`}
            onClick={() => { setStufe(s); setOffenId(null); }}
            style={{ cursor: "pointer", minHeight: "44px", background: stufe === s ? "var(--color-gold)" : undefined, color: stufe === s ? "var(--ui-on-accent)" : undefined }}>
            {s}
          </button>
        ))}
      </div>

      {!offenerText && !offenerDialog && (
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {texte.map((t) => (
            <button key={t.id} type="button" className="btn btn-ghost" data-testid={`lesestoff-item-${t.id}`}
              onClick={() => setOffenId(t.id)}
              style={{ minHeight: "48px", textAlign: "start", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span>{ART_ICON[t.art]} · <De style={{ fontWeight: 700 }}>{t.titelDe}</De> — {t.titelAr}</span>
              {fertig.includes(t.id) && <span>✅</span>}
            </button>
          ))}
          {dialoge.map((d) => (
            <button key={d.id} type="button" className="btn btn-ghost" data-testid={`lesestoff-item-${d.id}`}
              onClick={() => setOffenId(d.id)}
              style={{ minHeight: "48px", textAlign: "start", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span>💬 حوار · <De style={{ fontWeight: 700 }}>{d.titelDe}</De> — {d.titelAr}</span>
              {fertig.includes(d.id) && <span>✅</span>}
            </button>
          ))}
        </div>
      )}

      {offenerText && (
        <div style={{ display: "grid", gap: "0.6rem" }} data-testid="lesestoff-lesen">
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-ghost" data-testid="lesestoff-zurueck" style={{ minHeight: "44px" }} onClick={() => setOffenId(null)}>→ القائمة</button>
            <strong><De>{offenerText.titelDe}</De> — {offenerText.titelAr}</strong>
            <span className="chip">{offenerText.stufe} · {ART_ICON[offenerText.art]}</span>
          </div>
          {offenerText.absaetze.map((a, i) => (
            <div key={i} style={{ display: "grid", gap: "0.3rem" }}>
              <De style={{ display: "block", lineHeight: 1.95, fontSize: "1.02rem" }}>{a}</De>
              <button type="button" className="chip" data-testid={`lesestoff-hoeren-${i}`}
                onClick={() => speakAny(a)}
                style={{ cursor: "pointer", minHeight: "40px", justifySelf: "start" }}>
                🔊 استمع لهذه الفقرة (صوت جهازك)
              </button>
            </div>
          ))}
          <FragenBlock fragen={offenerText.fragen} praefix={offenerText.id} />
          <button type="button" className="btn btn-primary" data-testid="lesestoff-fertig"
            style={{ minHeight: "48px", justifySelf: "start" }}
            onClick={() => { markieren(offenerText.id); setOffenId(null); }}>
            ✅ علّم كمنتهٍ وعد إلى القائمة
          </button>
        </div>
      )}

      {offenerDialog && (
        <div style={{ display: "grid", gap: "0.6rem" }} data-testid="lesestoff-lesen">
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-ghost" data-testid="lesestoff-zurueck" style={{ minHeight: "44px" }} onClick={() => setOffenId(null)}>→ القائمة</button>
            <strong><De>{offenerDialog.titelDe}</De> — {offenerDialog.titelAr}</strong>
            <span className="chip">{offenerDialog.stufe} · 💬 حوار</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>🔊 الاستماع هنا بصوت جهازك (نطق الجهاز)، لا تسجيلات بشرية.</div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {offenerDialog.zeilen.map((z, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", background: "var(--ui-surface-raised, transparent)", borderRadius: "10px", padding: "0.45rem 0.6rem" }}>
                <div style={{ flex: 1, display: "grid", gap: "0.15rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-ink2)" }}>{z.wer}</span>
                  <De style={{ lineHeight: 1.8 }}>{z.de}</De>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{z.ar}</span>
                </div>
                <button type="button" className="chip" data-testid={`lesestoff-zeile-hoeren-${i}`}
                  onClick={() => speakAny(z.de)} aria-label="استمع لهذه الجملة"
                  style={{ cursor: "pointer", minHeight: "40px" }}>🔊</button>
              </div>
            ))}
          </div>
          <FragenBlock fragen={offenerDialog.fragen} praefix={offenerDialog.id} />
          <button type="button" className="btn btn-primary" data-testid="lesestoff-fertig"
            style={{ minHeight: "48px", justifySelf: "start" }}
            onClick={() => { markieren(offenerDialog.id); setOffenId(null); }}>
            ✅ علّم كمنتهٍ وعد إلى القائمة
          </button>
        </div>
      )}
    </section>
  );
}
