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
  type MediationAufgabe,
  type UeberschriftenAufgabe,
} from "@/lib/lesestoff";
import { speakAny } from "@/lib/speech";
import { alleVokabeln } from "@/lib/content";
import { bankenBereit, beiBankenBereit } from "@/lib/bankload";
import { levelOf } from "@/lib/plan";
import { useProgress } from "@/lib/store";
import { logK } from "@/lib/kompetenz";
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

/**
 * 📰 R305/خ18: «طابِق كل فقرة بعنوانها» — نمط Goethe Lesen Teil 1 (Überschriften zuordnen).
 * عدد العناوين أكبر من عدد الفقرات (مُضلِّلات)؛ تصحيح فوري لكل اختيار كـFragenBlock.
 */
function UeberschriftenBlock({ absaetze, aufgabe, praefix }: { absaetze: string[]; aufgabe: UeberschriftenAufgabe; praefix: string }) {
  const [wahl, setWahl] = useState<Record<number, number>>({});
  const alleBeantwortet = absaetze.every((_, i) => wahl[i] !== undefined);
  const richtigCount = absaetze.filter((_, i) => wahl[i] === aufgabe.richtig[i]).length;
  return (
    <div className="card" data-testid={`lesestoff-ueberschriften-${praefix}`} style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper)", display: "grid", gap: "0.5rem" }}>
      <strong>📰 طابِق كل فقرة بعنوانها (قبل القراءة التفصيلية)</strong>
      <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
        عدد العناوين أكبر من عدد الفقرات عمدًا — بعضها مُضلِّل لا يطابق أيّ فقرة، تمامًا كنمط الجزء الأول من قراءة Goethe B2.
      </div>
      {absaetze.map((_, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor={`uebsch-${praefix}-${i}`} style={{ fontSize: "0.85rem", fontWeight: 700 }}>الفقرة {i + 1}:</label>
          <select
            id={`uebsch-${praefix}-${i}`}
            data-testid={`lesestoff-ueberschrift-select-${praefix}-${i}`}
            value={wahl[i] ?? ""}
            disabled={wahl[i] !== undefined}
            onChange={(e) => setWahl((w) => ({ ...w, [i]: Number(e.target.value) }))}
            style={{ minHeight: "40px", borderRadius: "8px", flex: 1, minWidth: "200px" }}
          >
            <option value="" disabled>اختر عنوانًا…</option>
            {aufgabe.optionen.map((o, oi) => (
              <option key={oi} value={oi}>{o}</option>
            ))}
          </select>
          {wahl[i] !== undefined && (
            <span data-testid={`lesestoff-ueberschrift-ergebnis-${praefix}-${i}`}>
              {wahl[i] === aufgabe.richtig[i] ? "✅" : `✗ الصحيح: ${aufgabe.optionen[aufgabe.richtig[i]]}`}
            </span>
          )}
        </div>
      ))}
      {alleBeantwortet && (
        <div style={{ fontSize: "0.88rem" }}>
          نتيجتك: <span className="rtl-num">{richtigCount}</span>/<span className="rtl-num">{absaetze.length}</span> —{" "}
          {richtigCount === absaetze.length ? "🏆 طابقتَ كل الفقرات بعناوينها الصحيحة!" : "🏁 راجع الفقرات التي أخطأتَها — لا بأس، هذا تدريبٌ على القراءة السريعة (Skimming)."}
        </div>
      )}
    </div>
  );
}

/**
 * 🗣️ R305/خ15: مهمّة وساطة لغوية اختيارية — نقل المعنى إلى شخص لا يقرأ الألمانية، لا
 * ترجمة حرفية. تقييم ذاتي (لا تصحيح آلي): يكتب المتعلم تلخيصه ثم يقارنه بالنقاط الأساسية.
 */
function MediationBlock({ mediation, praefix, onErledigt }: { mediation: MediationAufgabe; praefix: string; onErledigt: () => void }) {
  const [text, setText] = useState("");
  const [zeigen, setZeigen] = useState(false);
  const [erledigt, setErledigt] = useState(false);
  return (
    <div className="card" data-testid={`lesestoff-mediation-${praefix}`} style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper)", display: "grid", gap: "0.5rem" }}>
      <strong>🗣️ مهمة وساطة لغوية (اختيارية)</strong>
      <div style={{ fontSize: "0.88rem", lineHeight: 1.9 }}>{mediation.aufgabeAr}</div>
      <textarea data-testid={`lesestoff-mediation-textarea-${praefix}`} value={text} onChange={(e) => setText(e.target.value)} rows={3}
        placeholder="اكتب تلخيصك هنا بالعربية…"
        style={{ width: "100%", borderRadius: "10px", padding: "0.5rem 0.7rem", font: "inherit", resize: "vertical" }} />
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="chip" data-testid={`lesestoff-mediation-zeigen-${praefix}`}
          style={{ cursor: "pointer", minHeight: "40px" }} onClick={() => setZeigen((v) => !v)}>
          {zeigen ? "إخفاء النقاط الأساسية" : "👁️ قارن مع النقاط الأساسية"}
        </button>
        {!erledigt ? (
          <button type="button" className="btn btn-ghost" data-testid={`lesestoff-mediation-fertig-${praefix}`}
            style={{ cursor: "pointer", minHeight: "40px" }}
            onClick={() => { setErledigt(true); onErledigt(); }}>
            ✅ أنهيت هذه المهمة
          </button>
        ) : (
          <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>✅ سُجِّلت ضمن كفاءة الكتابة</span>
        )}
      </div>
      {zeigen && (
        <ul style={{ margin: 0, paddingInlineStart: "1.2rem", fontSize: "0.85rem", lineHeight: 1.9, color: "var(--color-ink2)" }} data-testid={`lesestoff-mediation-punkte-${praefix}`}>
          {mediation.punkteAr.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
      <div style={{ fontSize: "0.76rem", color: "var(--color-ink2)" }}>
        💡 لا تصحيح آلي هنا: الهدف نقل المعنى الأساسي بأسلوبك، ثم المقارنة الذاتية مع النقاط الأساسية — وليس الترجمة الحرفية.
      </div>
    </div>
  );
}

export function LeseStoffStation() {
  const [stufe, setStufe] = useState<Level>("A0");
  const [offenId, setOffenId] = useState<string | null>(null);
  const [stimmHinweis, setStimmHinweis] = useState(false);
  const { progress, update } = useProgress();
  // 🧭 R305/خ17: التصفح هنا حرٌّ عمدًا (ت1/R302) — خارج قفل اليوم، لكل المستويات دفعةً
  // واحدة. بلا توسيم، قد يفسّر متعلّمٌ مبتدئ صعوبةَ نصٍّ B2 استكشافيٍّ كفشلٍ في أساسياته.
  // مستواه الفعلي يُشتقّ من يوم خطته (lib/plan.levelOf) — لا افتراضَ ولا سؤالَ إضافيّ.
  const meineStufe = useMemo(() => levelOf(progress.plan.day), [progress.plan.day]);
  const stufeChkIdx = (s: Level) => STOFF_STUFEN.indexOf(s);
  const aufwaerts = (s: Level) => stufeChkIdx(s) > stufeChkIdx(meineStufe);
  const [fertigAm, setFertigAm] = useState<Record<string, string>>({});
  const [bereit, setBereit] = useState(false);
  const [langsam, setLangsam] = useState(false);
  const [glossar, setGlossar] = useState<{ wort: string; ar: string; beispiel: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // ترحيل: عناصر بلا تاريخ تُرحَّل بتاريخ اليوم فتستحق الإعادة بعد 7 أيام
          const heute = new Date().toISOString().slice(0, 10);
          const rec: Record<string, string> = {};
          for (const id of parsed) if (typeof id === "string") rec[id] = heute;
          setFertigAm(rec);
          localStorage.setItem(LS_KEY, JSON.stringify(rec));
        } else if (parsed && typeof parsed === "object") setFertigAm(parsed as Record<string, string>);
      }
    } catch { /* تجاهل */ }
  }, []);

  useEffect(() => {
    if (bankenBereit()) { setBereit(true); return; }
    return beiBankenBereit(() => setBereit(true));
  }, []);

  const fertig = useMemo(() => Object.keys(fertigAm), [fertigAm]);
  const wiederFaellig = useMemo(() => {
    const grenze = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    return Object.entries(fertigAm).filter(([, d]) => d <= grenze).map(([id]) => id);
  }, [fertigAm]);

  const hoeren = (text: string) => {
    // ت2: صمت الصوت الجهازي كان يمرّ بلا أثر — الآن تنبيه عربي واضح
    if (!speakAny(text, { rate: langsam ? 0.72 : 0.9 })) setStimmHinweis(true);
  };

  const markieren = (id: string, kompetenz: "Lesen" | "Hoeren") => {
    setFertigAm((alt) => {
      const neu = { ...alt, [id]: new Date().toISOString().slice(0, 10) };
      try { localStorage.setItem(LS_KEY, JSON.stringify(neu)); } catch { /* تجاهل */ }
      return neu;
    });
    update((p) => logK(p, kompetenz, true));
  };

  // خ7: مسرد نقر — بحث فوري في بنك كلمات المشروع (4583)
  const glossarKarte = useMemo(() => {
    if (!bereit) return new Map<string, { de: string; ar: string; beispiel: string }>();
    const m = new Map<string, { de: string; ar: string; beispiel: string }>();
    for (const k of alleVokabeln) {
      const lemma = k.de.replace(/^(der|die|das)\s+/, "").split(/[\s(]/)[0].toLowerCase();
      if (lemma.length >= 2 && !m.has(lemma)) m.set(lemma, { de: k.de, ar: k.ar, beispiel: k.exampleDe ?? "" });
    }
    return m;
  }, [bereit]);
  const wortTippen = (wort: string) => {
    const rein = wort.replace(/^[^A-Za-zÄÖÜäöüß-]+|[^A-Za-zÄÖÜäöüß-]+$/g, "").toLowerCase();
    const hit = glossarKarte.get(rein)
      ?? (rein.endsWith("en") ? glossarKarte.get(rein.slice(0, -2)) : undefined)
      ?? (rein.endsWith("e") ? glossarKarte.get(rein.slice(0, -1)) : undefined)
      ?? (rein.endsWith("s") ? glossarKarte.get(rein.slice(0, -1)) : undefined);
    setGlossar(hit ? { wort: hit.de, ar: hit.ar, beispiel: hit.beispiel } : { wort, ar: "ليست في بنك كلمات المشروع — جرّبها في قاموسك أو اسأل معلّمك", beispiel: "" });
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
            {s}{aufwaerts(s) ? " ⬆️" : ""}
          </button>
        ))}
      </div>
      {aufwaerts(stufe) && (
        <div className="chip" data-testid="lesestoff-aufwaerts-hinweis" style={{ fontSize: "0.8rem", lineHeight: 1.8, background: "var(--color-gold-soft)", alignSelf: "start" }}>
          ⬆️ أنت الآن في خطتك عند مستوى <strong>{meineStufe}</strong> — هذا استكشاف حرّ لمستوى <strong>{stufe}</strong> الأعلى، خارج اليوم المجدول.
          لا بأس إن صعُب: هذا طبيعيٌّ تمامًا ولا يعني تقصيرًا في أساسياتك.
        </div>
      )}

      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }} role="group" aria-label="سرعة الاستماع">
        <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>سرعة الصوت:</span>
        <button type="button" className="chip" data-testid="lesestoff-tempo-normal" style={{ cursor: "pointer", minHeight: "40px", background: !langsam ? "var(--color-gold)" : undefined, color: !langsam ? "var(--ui-on-accent)" : undefined }} onClick={() => setLangsam(false)}>🔊 عادية</button>
        <button type="button" className="chip" data-testid="lesestoff-tempo-langsam" style={{ cursor: "pointer", minHeight: "40px", background: langsam ? "var(--color-gold)" : undefined, color: langsam ? "var(--ui-on-accent)" : undefined }} onClick={() => setLangsam(true)}>🐢 بطيئة للمبتدئ</button>
      </div>

      {stimmHinweis && (
        <div className="card" data-testid="lesestoff-stimm-hinweis" style={{ padding: "0.6rem 0.9rem", fontSize: "0.85rem", lineHeight: 1.9, background: "var(--color-gold-soft)" }}>
          🔇 لا يوجد صوت ألماني على جهازك الآن، فلم يُسمَع شيء — فعّل صوتًا ألمانيًا من إعدادات جهازك (إمكانية الوصول/النصوص والأصوات) أو تابع القراءة دون استماع.
          <button type="button" className="chip" style={{ cursor: "pointer", marginInlineStart: "0.5rem" }} onClick={() => setStimmHinweis(false)}>حسنًا</button>
        </div>
      )}

      {!offenerText && !offenerDialog && (
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {wiederFaellig.length > 0 && (
            <div className="card" data-testid="lesestoff-wieder" style={{ padding: "0.6rem 0.9rem", background: "var(--color-gold-soft)", display: "grid", gap: "0.4rem" }}>
              <strong style={{ fontSize: "0.9rem" }}>🔁 مرّت 7 أيام أو أكثر — أعد قراءة هذه لتثبيتها:</strong>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {wiederFaellig.map((id) => {
                  const t = FREIE_TEXTE.find((x) => x.id === id) ?? FREIE_DIALOGE.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <button key={id} type="button" className="chip" data-testid={`lesestoff-wieder-${id}`} style={{ cursor: "pointer", minHeight: "40px" }} onClick={() => { setStufe(t.stufe as Level); setOffenId(id); }}>
                      <De>{t.titelDe}</De>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {texte.map((t) => (
            <button key={t.id} type="button" className="btn btn-ghost" data-testid={`lesestoff-item-${t.id}`}
              onClick={() => setOffenId(t.id)}
              style={{ minHeight: "48px", textAlign: "start", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span>{ART_ICON[t.art]} · <De style={{ fontWeight: 700 }}>{t.titelDe}</De> — {t.titelAr}</span>
              {wiederFaellig.includes(t.id) ? <span>🔁</span> : fertig.includes(t.id) ? <span>✅</span> : null}
            </button>
          ))}
          {dialoge.map((d) => (
            <button key={d.id} type="button" className="btn btn-ghost" data-testid={`lesestoff-item-${d.id}`}
              onClick={() => setOffenId(d.id)}
              style={{ minHeight: "48px", textAlign: "start", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span>💬 حوار · <De style={{ fontWeight: 700 }}>{d.titelDe}</De> — {d.titelAr}</span>
              {wiederFaellig.includes(d.id) ? <span>🔁</span> : fertig.includes(d.id) ? <span>✅</span> : null}
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
            {aufwaerts(offenerText.stufe) && (
              <span className="chip" data-testid="lesestoff-aufwaerts-badge" style={{ background: "var(--color-gold-soft)" }}>⬆️ أصعب من مستواك الحالي ({meineStufe})</span>
            )}
          </div>
          {offenerText.absaetze.map((a, i) => (
            <div key={i} style={{ display: "grid", gap: "0.3rem" }}>
              <De style={{ display: "block", lineHeight: 1.95, fontSize: "1.02rem" }}>
                {a.split(/(\s+)/).map((token, ti) =>
                  /^[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]{2,}[.,;:!?)"»]*$/.test(token) ? (
                    <button key={ti} type="button" data-testid={`lesestoff-wort-${token.replace(/[^A-Za-zÄÖÜäöüß-]/g, "")}`}
                      onClick={() => wortTippen(token)}
                      style={{ background: "none", border: "none", borderBottom: "1px dotted var(--color-mid)", padding: 0, font: "inherit", cursor: "pointer", color: "inherit" }}>
                      {token}
                    </button>
                  ) : token
                )}
              </De>
              <button type="button" className="chip" data-testid={`lesestoff-hoeren-${i}`}
                onClick={() => hoeren(a)}
                style={{ cursor: "pointer", minHeight: "40px", justifySelf: "start" }}>
                🔊 استمع لهذه الفقرة (صوت جهازك)
              </button>
            </div>
          ))}
          {glossar && (
            <div className="card" data-testid="lesestoff-glossar" style={{ padding: "0.6rem 0.9rem", background: "var(--color-gold-soft)", fontSize: "0.88rem", lineHeight: 1.9 }}>
              📖 <De style={{ fontWeight: 800 }}>{glossar.wort}</De> — {glossar.ar}
              {glossar.beispiel && <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>مثال: <De>{glossar.beispiel}</De></div>}
              <button type="button" className="chip" style={{ cursor: "pointer", marginInlineStart: "0.5rem" }} onClick={() => setGlossar(null)}>إغلاق</button>
            </div>
          )}
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>💡 انقر أيّ كلمة ألمانية في النص لترى معناها من بنك كلمات المشروع.</div>
          {offenerText.ueberschriften && (
            <UeberschriftenBlock absaetze={offenerText.absaetze} aufgabe={offenerText.ueberschriften} praefix={offenerText.id} />
          )}
          <FragenBlock fragen={offenerText.fragen} praefix={offenerText.id} />
          {offenerText.mediation && (
            <MediationBlock mediation={offenerText.mediation} praefix={offenerText.id}
              onErledigt={() => update((p) => logK(p, "Schreiben", true))} />
          )}
          <button type="button" className="btn btn-primary" data-testid="lesestoff-fertig"
            style={{ minHeight: "48px", justifySelf: "start" }}
            onClick={() => { markieren(offenerText.id, "Lesen"); setOffenId(null); }}>
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
            {aufwaerts(offenerDialog.stufe) && (
              <span className="chip" data-testid="lesestoff-aufwaerts-badge" style={{ background: "var(--color-gold-soft)" }}>⬆️ أصعب من مستواك الحالي ({meineStufe})</span>
            )}
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
                  onClick={() => hoeren(z.de)} aria-label="استمع لهذه الجملة"
                  style={{ cursor: "pointer", minHeight: "40px" }}>🔊</button>
              </div>
            ))}
          </div>
          <FragenBlock fragen={offenerDialog.fragen} praefix={offenerDialog.id} />
          {offenerDialog.mediation && (
            <MediationBlock mediation={offenerDialog.mediation} praefix={offenerDialog.id}
              onErledigt={() => update((p) => logK(p, "Schreiben", true))} />
          )}
          <button type="button" className="btn btn-primary" data-testid="lesestoff-fertig"
            style={{ minHeight: "48px", justifySelf: "start" }}
            onClick={() => { markieren(offenerDialog.id, "Hoeren"); setOffenId(null); }}>
            ✅ علّم كمنتهٍ وعد إلى القائمة
          </button>
        </div>
      )}
    </section>
  );
}
