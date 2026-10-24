"use client";
import { useEffect, useMemo, useState } from "react";
import { istPhasenPruefung } from "@/lib/phasen";
import type { DayTask, Exercise, SrsState, UiLang, VocabCard, GrammarTopic, Eselsbruecke, Tempo } from "@/lib/types";
import { POS_AR } from "@/lib/types";
import { eselsbruecken, getBrueckenFor, getBrueckenForWort, getGrammar, sprichwortSrc, getDeck, getText, leseText, getDialogue, getWriting, getSatz, getMnemonik, candoMap, vocabMap, deFormOf, partnerKarten, kontaktKarten, muendlich } from "@/lib/content";
import { kollokationenFuer, kollokationUebung } from "@/lib/kollokationen";
import { WortLinkText } from "./wortlink";
import { newCard, reviewCard, isDue, newCardCap, countNewCardsIntroducedToday, wasIntroducedToday, karteStufe, KARTENSTUFE_AR } from "@/lib/srs";
import { genusCode } from "@/lib/genus";
import { addFehlerNow, markiereSchriftlich, loadProgress, saveProgress } from "@/lib/store";
import { speakDe, speakAny, speakLine, stopSpeech, speechAvailable, germanVoices, warmVoices } from "@/lib/speech";
import { levelOf, clozeFromSatz, rng } from "@/lib/plan";
import { buildBrueckeItems } from "@/lib/bruecken";
import ExerciseSet from "./exercises";
import { satzIdAusUebung } from "@/lib/kapsel";
import { FehlerFinden, RollenDialog, SchreibBerater, Pruefung } from "./lehrer";
import { FehlerFallen, Fehlerheft } from "./fehler-ui";
import { De } from "./De";
import AusspracheTrainer, { type AusspracheAbschluss } from "./aussprachetrainer";
import { SynonymKontext } from "./SynonymKontext";
import { KompositaWerkstatt } from "./komposita";
import { SignalRadar } from "./signalradar";
import { StilWechsler } from "./stilwechsler";
import { grammatikImText } from "@/lib/grammatikRadar";
import { meldung } from "@/lib/meldungen";
import { BemerkenKarte } from "./bemerken";
import { entdeckungsFrage, induktionMoeglich, ergebnisText, type EntdeckungsErgebnis } from "@/lib/induktion";
import { grammarMap } from "@/lib/content";
const alleGrammatik = Object.values(grammarMap);
const alleVokabelIds = Object.values(vocabMap).flatMap((deck) => deck.cards.map((card) => card.id));

/** مسودّة محلية للمهمة الجارية؛ تبقى حتى التسليم أو الإغلاق الصريح لليوم. */
function useTaskDraft<T>(persistKey: string | undefined, slot: string, initial: T) {
  const key = persistKey ? `${persistKey}:${slot}` : undefined;
  const [draft, setDraft] = useState<T>(initial);
  const [ready, setReady] = useState(!key);

  useEffect(() => {
    if (!key) {
      setDraft(initial);
      setReady(true);
      return;
    }
    setReady(false);
    try {
      const raw = localStorage.getItem(key);
      setDraft(raw ? JSON.parse(raw) as T : initial);
    } catch {
      setDraft(initial);
    }
    setReady(true);
    // initial is a reset value; load only when the storage namespace changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!key || !ready) return;
    try { localStorage.setItem(key, JSON.stringify(draft)); } catch { /* التخزين محظور أو ممتلئ */ }
  }, [key, ready, draft]);

  return [draft, setDraft, ready] as const;
}

interface TaskProps {
  task: DayTask;
  lang: UiLang;
  day: number;
  srs: Record<string, SrsState>;
  onSrs: (cardId: string, state: SrsState) => void;
  onPoints: (points: number, max: number) => void;
  /** نتيجة استرجاع جملة كبسولة (M1): تُحجز في فواصل المتعلم المتكيفة. */
  onKapselErgebnis?: (satzId: string, ok: boolean) => void;
  voiceName?: string;
  rate?: number;
  tempo?: Tempo;
  /** 🔎 M10/R290: قواعد الأسبوع الجديدة للملاحظة داخل نص القراءة */
  bemerkenRegeln?: { id: string; titelDe: string; titelAr: string }[];
  /** بادئة تخزينٍ مؤقّتة لمحاولات المهمة، تُحذف عند تسليمها. */
  persistKey?: string;
}

/** عارض مهمة اليوم حسب نوعها — كل شيء داخلي (TTS بدل الملفات) */
export default function TaskView({ task, lang: _lang, day, srs, onSrs, onPoints, voiceName, rate, tempo = "regelmaessig", persistKey, onKapselErgebnis, bemerkenRegeln }: TaskProps) {
  // تسميع الإملاء: مستمع عام يعمل في كل المهام
  useEffect(() => {
    const onSpeak = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const text = Array.isArray(detail) ? String(detail[0]) : String(detail);
      speakDe(text, { voiceName, rate });
    };
    window.addEventListener("weg-speak-dictation", onSpeak);
    return () => window.removeEventListener("weg-speak-dictation", onSpeak);
  }, [voiceName, rate]);

  switch (task.kind) {
    case "grammatik":
      return <GrammarTask task={task} srs={srs} onPoints={onPoints} persistKey={persistKey} />;
    case "wortschatz":
      return <VocabTask task={task} srs={srs} onSrs={onSrs} onPoints={onPoints} voiceName={voiceName} rate={rate} tempo={tempo} persistKey={persistKey} />;
    case "hoeren":
      return <HoerenTask task={task} onPoints={onPoints} voiceName={voiceName} rate={rate} persistKey={persistKey} />;
    case "lesen":
      return <LesenTask task={task} onPoints={onPoints} voiceName={voiceName} rate={rate} persistKey={persistKey} bemerkenRegeln={bemerkenRegeln} />;
    case "schreiben":
      return <SchreibenTask task={task} onPoints={onPoints} persistKey={persistKey} />;
    case "sprechen":
      return <SprechenTask task={task} onPoints={onPoints} voiceName={voiceName} rate={rate} persistKey={persistKey} />;
    case "aussprache":
      return <AusspracheTask task={task} day={day} onPoints={onPoints} voiceName={voiceName} rate={rate} persistKey={persistKey} />;
    case "briefe":
    case "schulsim":
    case "partner":
      return <PartnerTask task={task} onPoints={onPoints} voiceName={voiceName} rate={rate} persistKey={persistKey} />;
    case "wiederholen":
      return task.fehlerKeys?.length ? (
        <Fehlerheft fehlerKeys={task.fehlerKeys} onPoints={onPoints} voiceName={voiceName} rate={rate} />
      ) : task.fehlerItems?.length ? (
        <FehlerFallen items={task.fehlerItems} onPoints={onPoints} />
      ) : (
        <WiederholenTask task={task} day={day} srs={srs} onSrs={onSrs} onPoints={onPoints} voiceName={voiceName} rate={rate} persistKey={persistKey} onKapselErgebnis={onKapselErgebnis} />
      );
    case "check":
      return task.exam ? (
        <Pruefung task={task} onPoints={onPoints} voiceName={voiceName} rate={rate} />
      ) : (
        <CheckTask task={task} onPoints={onPoints} persistKey={persistKey} />
      );
    default:
      return <CheckTask task={task} onPoints={onPoints} />;
  }
}




type SrsState2 = Record<string, SrsState>;

// ── 🔁 مراجعةُ الشفرات بفواصلَ متباعدة: التركةُ بطاقةٌ في دورةِ SM-2 كالمفردة ──
function BrueckenSRS({ srs, onSrs, onPoints }: { srs: SrsState2; onSrs: (id: string, s: SrsState) => void; onPoints: (p: number, m: number) => void }) {
  const [i, setI] = useState(0);
  const [offen, setOffen] = useState(false);
  const schlange = useMemo(() => {
    const key = (b: Eselsbruecke) => `bru:${b.id}`;
    const frisch = eselsbruecken.filter((b) => !srs[key(b)]);
    const faellig = eselsbruecken.filter((b) => srs[key(b)] && isDue(srs[key(b)]));
    return [...faellig, ...frisch].slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!schlange.length) return null;
  const b = schlange[i];
  if (!b)
    return (
      <div className="card" style={{ padding: "0.7rem 1rem", background: "var(--color-gold-soft)", marginTop: "0.6rem" }}>
        <strong>✅ انتهت شفراتُ اليوم — عادَت إلى الجدولِ بفواصلَ أطول.</strong>
      </div>
    );

  const bewerten = (q: 0 | 2 | 4) => {
    onSrs(`bru:${b.id}`, reviewCard(srs[`bru:${b.id}`] ?? newCard(), q));
    onPoints(q === 4 ? 3 : q === 2 ? 2 : 1, 3);
    if (q === 0) {
      addFehlerNow({
        falsch: `نسيتُ شفرة: ${b.titleAr}`,
        richtig: b.zeilen.map((z) => z.de).slice(0, 3).join(" · "),
        art: "konstruktion",
        ar: `${b.storyAr.slice(0, 120)}…`,
        quelle: "Eselsbrücke-SRS",
      });
    }
    setOffen(false);
    setI((x) => x + 1);
  };

  return (
    <div className="card" style={{ padding: "0.8rem 1rem", marginTop: "0.7rem", borderInlineStart: "4px solid var(--color-gold)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong>🔁 شفراتُ الحفظِ المستحقّة</strong>
        <span className="chip rtl-num">{i + 1}/{schlange.length}</span>
      </div>
      <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", margin: "0.3rem 0 0.5rem" }}>
        استرجعِ الشفرةَ من ذاكرتِك أولاً — ثمَّ اكشفْ وقيِّمْ نفسَك بصدق.
      </div>
      <div style={{ fontWeight: 900, fontSize: "1.03rem" }}>{b.emoji} {b.titleAr}</div>
      {!offen ? (
        <button className="btn btn-gold" style={{ marginTop: "0.6rem" }} onClick={() => setOffen(true)}>👁 اكشفِ الشفرة</button>
      ) : (
        <>
          <div style={{ fontSize: "0.86rem", lineHeight: 1.9, margin: "0.4rem 0" }}>{b.storyAr}</div>
          <div style={{ display: "grid", gap: "0.25rem" }}>
            {b.zeilen.slice(0, 4).map((z: { code: string; de: string; ar: string }, k: number) => (
              <div key={k} style={{ fontSize: "0.85rem" }}>
                <span className="chip" style={{ fontWeight: 800 }}>{z.code}</span> <De>{z.de}</De>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => bewerten(0)}>😵 نسيتُها</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => bewerten(2)}>🤔 بصعوبة</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => bewerten(4)}>😎 حاضرةٌ فوراً</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── 🎯 امتحانُ الشفرات: التركةُ تُمتَحَنُ لا تُقرَأُ فقط ──
function BrueckenQuiz({ gramId, bruecken }: { gramId: string; bruecken: Eselsbruecke[] }) {
  const items = useMemo(() => buildBrueckeItems(bruecken, gramId.length * 31 + bruecken.length, 6, eselsbruecken), [bruecken, gramId]);
  const [i, setI] = useState(0);
  const [wahl, setWahl] = useState<string | null>(null);
  const [score, setScore] = useState({ s: 0, t: 0 });
  const [fertig, setFertig] = useState(false);
  if (!items.length) return null;
  const it = items[i];

  const antworte = (o: string) => {
    if (wahl) return;
    setWahl(o);
    const ok = o === it.antwort;
    setScore((x) => ({ s: x.s + (ok ? 1 : 0), t: x.t + 1 }));
    if (!ok) {
      addFehlerNow({
        falsch: `${it.frageDe} → ${o}`,
        richtig: it.art === "artikel" ? `${it.antwort} ${it.frageDe.replace("___ ", "")}` : it.antwort,
        art: it.kat,
        ar: `شفرةُ الحفظ — ${it.erklaerungAr}`,
        quelle: "Eselsbrücke",
      });
    }
  };
  const weiter = () => {
    setWahl(null);
    if (i + 1 >= items.length) setFertig(true);
    else setI(i + 1);
  };

  if (fertig)
    return (
      <div className="card" style={{ padding: "0.75rem 1rem", background: "var(--color-gold-soft)", marginTop: "0.5rem" }}>
        <strong>🎯 انتهى امتحانُ الشفرات — <span className="rtl-num">{score.s}/{score.t}</span></strong>
        <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", marginTop: "0.25rem", lineHeight: 1.8 }}>
          ما أخطأتَ فيه دُفِنَ في دفترِ الأخطاءِ بفئتِه، وسيعودُ إليك في المراجعةِ لا في النسيان.
        </div>
        <button className="btn btn-ghost" style={{ marginTop: "0.5rem" }} onClick={() => { setI(0); setWahl(null); setScore({ s: 0, t: 0 }); setFertig(false); }}>
          🔁 أعِدْ من أوّلِها
        </button>
      </div>
    );

  return (
    <div className="card" style={{ padding: "0.8rem 1rem", marginTop: "0.5rem", borderInlineStart: "4px solid var(--color-cola)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong style={{ fontSize: "0.95rem" }}>🎯 امتحانُ الشفرات</strong>
        <span className="chip rtl-num">{i + 1}/{items.length} · {score.s} ✓</span>
      </div>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", margin: "0.3rem 0" }}>{it.frageAr}</div>
      <De style={{ fontWeight: 800, fontSize: "1.05rem", display: "block", margin: "0.2rem 0 0.5rem" }}>{it.frageDe}</De>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        {it.optionen.map((o) => {
          const gewaehlt = wahl === o;
          const richtig = wahl && o === it.antwort;
          const falsch = gewaehlt && o !== it.antwort;
          return (
            <button
              key={o}
              className="btn"
              style={{
                justifyContent: "flex-start",
                minHeight: "44px",
                border: "1px solid var(--color-line)",
                background: richtig ? "rgb(34 197 94 / 0.14)" : falsch ? "var(--color-cola-soft)" : "transparent",
              }}
              disabled={!!wahl}
              onClick={() => antworte(o)}
            >
              {richtig ? "✅ " : falsch ? "❌ " : ""}{o}
            </button>
          );
        })}
      </div>
      {wahl && (
        <>
          <div style={{ fontSize: "0.84rem", marginTop: "0.5rem", lineHeight: 1.9, background: "var(--color-paper2)", padding: "0.45rem 0.65rem", borderRadius: "0.5rem" }}>
            🧠 {it.erklaerungAr}
          </div>
          <button className="btn btn-primary" style={{ marginTop: "0.5rem" }} onClick={weiter}>
            {i + 1 >= items.length ? "أنهِ الامتحان ✓" : "التالي ←"}
          </button>
        </>
      )}
    </div>
  );
}

// ── 🧠 تركاتُ الحفظ: الشفراتُ والقصصُ والأمثالُ الملتصقةُ بهذا الدرسِ بعينه ──
function BrueckenBlock({ gramId, srs }: { gramId: string; srs: SrsState2 }) {
  const bruecken = getBrueckenFor(gramId);
  const [offen, setOffen] = useState<Record<string, boolean>>({});
  const faellig = bruecken.filter((b) => srs[`bru:${b.id}`] && isDue(srs[`bru:${b.id}`])).length;
  if (!bruecken.length) return null;
  return (
    <div data-testid="grammar-bruecken-block" style={{ display: "grid", gap: "0.5rem", margin: "0.9rem 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", fontWeight: 900, fontSize: "0.95rem", color: "var(--color-cola)" }}>
        🧠 تركاتُ الحفظ لهذا الدرس <span className="rtl-num" style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>({bruecken.length})</span>
        {faellig > 0 && <span data-testid="grammar-bruecken-due-count" className="chip" style={{ color: "var(--color-ink)", borderColor: "var(--color-gold)" }}>🔔 {faellig} مستحقّة</span>}
      </div>
      <BrueckenQuiz gramId={gramId} bruecken={bruecken} />
      {bruecken.map((b) => {
        const auf = !!offen[b.id];
        const due = !!srs[`bru:${b.id}`] && isDue(srs[`bru:${b.id}`]);
        return (
          <div key={b.id} data-testid={`grammar-bruecke-${b.id}`} className="card" style={{ padding: "0.7rem 0.95rem", background: "var(--color-paper2)", borderInlineStart: "4px solid var(--color-gold)" }}>
            <button
              type="button"
              aria-expanded={auf}
              onClick={() => setOffen((o) => ({ ...o, [b.id]: !o[b.id] }))}
              style={{ background: "none", border: 0, cursor: "pointer", width: "100%", minHeight: "44px", display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "space-between", textAlign: "start", font: "inherit", color: "inherit" }}
            >
              <span style={{ fontWeight: 800 }}>{b.emoji} {b.titleAr}</span>
              <span style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap" }}>
                {due && <span className="chip" data-testid={`grammar-bruecke-due-${b.id}`} style={{ borderColor: "var(--color-gold)" }}>🔔 مستحقّة</span>}
                <span className="chip">{auf ? "إخفاء ▲" : "افتح ▼"}</span>
              </span>
            </button>
            {auf && (
              <>
                <div style={{ fontSize: "0.86rem", lineHeight: 1.95, margin: "0.4rem 0 0.55rem" }}>{b.storyAr}</div>
                <div style={{ display: "grid", gap: "0.3rem" }}>
                  {b.zeilen.map((z: { code: string; de: string; ar: string }, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "baseline", background: "var(--color-paper)", padding: "0.4rem 0.6rem", borderRadius: "0.5rem" }}>
                      <span className="chip" style={{ fontWeight: 800 }}>{z.code}</span>
                      <De style={{ fontWeight: 700, flex: 1, minWidth: "11rem" }}>{z.de}</De>
                      <button className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(z.de)}>🔊</button>
                      <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", flexBasis: "100%" }}>{z.ar}</div>
                    </div>
                  ))}
                </div>
                {sprichwortSrc(b.id) && (
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.5rem" }}>
                    <audio controls preload="none" src={sprichwortSrc(b.id) ?? undefined} style={{ height: "44px", maxWidth: "100%" }} />
                    <span className="chip">🔊 نُطقٌ أصيلٌ — ملفٌّ من الدار</span>
                  </div>
                )}
                {b.warnung && (
                  <div style={{ fontSize: "0.82rem", marginTop: "0.5rem", padding: "0.45rem 0.65rem", borderRadius: "0.5rem", background: "var(--color-cola-soft)", lineHeight: 1.85 }}>
                    ⚠️ {b.warnung}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── الحلقة الثلاثية بعد القاعدة: تعرّف → إكمال → إنتاج حر ──────────────
function TriplePractice({ topic, seed, onPoints, persistKey }: { topic: GrammarTopic; seed: number; onPoints: (p: number, m: number) => void; persistKey?: string }) {
  const items = useMemo(() => {
    // نبني من أمثلة القاعدة 3 تمارين فقط إن أمكن
    const rand = rng(seed);
    const beispiele = [...topic.examples].sort(() => rand() - 0.5).slice(0, 3);
    if (beispiele.length < 2) return [] as Exercise[];
    const out: Exercise[] = [];
    // المرحلة 1: تعرّف (اختيار من متعدد) — أيُّ الجمل يخالف القاعدة / أو أيها صحيح؟
    const richtig = beispiele[0];
    // نولّد جملة مشوَّهة بسيطة من التحذيرات إن وُجدت، وإلا نحذف أداة/كلمة قصيرة
    const pit = topic.pitfalls?.[Math.floor(rand() * (topic.pitfalls?.length ?? 1))];
    const falschDe = pit?.de ?? richtig.de.replace(/\b(der|die|das|ein|eine)\b/i, "___").replace(/___\s+___/, "der");
    out.push({
      id: `trip-erk-${topic.id}-${seed}`,
      type: "mc",
      promptDe: "Welcher Satz ist korrekt?",
      promptAr: "🧠 المرحلة 1 (تعرّف): أيُّ الجمل الآتية صحيح حسب القاعدة؟",
      options: [richtig.de, falschDe].sort(() => rand() - 0.5),
      answer: richtig.de,
      explanationAr: `الجملة الصحيحة: «${richtig.de}» — ${richtig.ar}`,
    });
    // المرحلة 2: إكمال (fill) — نحذف كلمة مفتاحية من المثال الثاني
    const ziel = beispiele[1];
    const worte = ziel.de.split(/\s+/);
    // اختر أطول كلمة (غالباً الكلمة المفتاحية)
    const idx = worte.reduce((best, w, i) => (w.length > worte[best].length ? i : best), 0);
    const loesung = worte[idx].replace(/[.,!?]+$/, "");
    worte[idx] = "___";
    out.push({
      id: `trip-fill-${topic.id}-${seed}`,
      type: "fill",
      promptDe: "Ergänze die fehlende Wortform.",
      promptAr: "✍️ المرحلة 2 (إكمال): أكمل الفراغ في الجملة:",
      text: worte.join(" "),
      answer: loesung,
      explanationAr: `الجملة الكاملة: «${ziel.de}» — ${ziel.ar}`,
    });
    // المرحلة 3: إنتاج حر (translate) — ترجمة من العربية إلى الألمانية للمثال الثالث أو الأول
    const prod = beispiele[2] ?? beispiele[0];
    // نستخرج كلمات مفتاحية من الجملة الألمانية (أطول 3 كلمات)
    const kw = prod.de
      .replace(/[.,!?]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !/^(der|die|das|ein|eine|einer|eines|einem|einen|ich|du|er|sie|es|wir|ihr|Sie|und|oder|aber|in|an|auf|zu|mit|von|für|ist|sind|war|bin|bist|hat|habe|haben|sein|nicht|auch|sehr)$/i.test(w))
      .sort((a, b) => b.length - a.length)
      .slice(0, 3);
    out.push({
      id: `trip-prod-${topic.id}-${seed}`,
      type: "translate",
      promptDe: "Übersetze ins Deutsche (Schlüsselwörter müssen vorkommen).",
      promptAr: "🗣️ المرحلة 3 (إنتاج): ترجم إلى الألمانية (يجب أن تظهر الكلمات المفتاحية):",
      text: prod.ar,
      answer: prod.de,
      keywords: kw,
      explanationAr: `الجملة المرجعية: «${prod.de}» — ${prod.ar}`,
    });
    return out;
  }, [topic, seed]);
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: "0.8rem" }} data-testid="triple-practice">
      <h4 style={{ fontWeight: 800, margin: "0.4rem 0 0.5rem" }}>🔁 الحلقة الثلاثية: تعرّف ← إكمال ← إنتاج</h4>
      <ExerciseSet items={items} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:triple` : undefined} />
    </div>
  );
}

// ── شرح القواعد + تمارينه ───────────────────────────────────────────────
function GrammarTask({ task, srs, onPoints, persistKey }: { task: DayTask; srs: SrsState2; onPoints: (p: number, m: number) => void; persistKey?: string }) {
  const topic = getGrammar(task.topicId ?? "");
  // 🔍 الاستقراء قبل القاعدة: أمثلة ← تخمين ← كشف (lib/induktion.ts)
  const seed = Array.from(task.id).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11);
  const frage = useMemo(() => (topic ? entdeckungsFrage(topic, alleGrammatik, seed) : null), [topic, seed]);
  const [ergebnis, setErgebnis] = useState<EntdeckungsErgebnis | null>(null);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  if (!topic) {
    /* 🧩 مهمةُ الأسبوعِ (Komposita / FVG): ورشةٌ بلا درسٍ مضيف — أسئلتُها قائمةٌ بذاتها لا شاشةً خاوية */
    if (task.quiz && task.quiz.length > 0) {
      return (
        <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
          <Head icon="🧩" de={task.titleDe} ar={task.titleAr} />
          <ExerciseSet items={task.quiz} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:quiz` : undefined} />
        </section>
      );
    }
    return <Empty title={meldung("regel-fehlt").titel} aktion={meldung("regel-fehlt").aktion} />;
  }
  const entdecken = !!frage && induktionMoeglich(topic);
  const offen = !entdecken || ergebnis !== null;

  const waehle = (i: number) => {
    if (gewaehlt !== null || !frage) return;
    setGewaehlt(i);
    const r: EntdeckungsErgebnis = i === frage.richtigIndex ? "richtig" : "falsch";
    setErgebnis(r);
    onPoints(r === "richtig" ? 1 : 0, 1);
  };

  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="📘" de={topic.titleDe} ar={topic.titleAr} />

      {entdecken && ergebnis !== null && (
        <div className="card" style={{ padding: "0.6rem 0.9rem", background: "var(--color-paper2)", borderInlineStart: "5px solid var(--color-gold)", marginBottom: "0.8rem", fontSize: "0.88rem" }} data-testid="entdecken-ergebnis">
          <span style={{ fontWeight: 600 }}>{ergebnis === "richtig" ? "✅ " : ergebnis === "falsch" ? "↪️ " : "⏭ "}{ergebnisText(ergebnis)}</span>
          <div style={{ marginTop: "0.25rem" }}>القاعدة: <De style={{ fontWeight: 700 }}>{frage!.optionen[frage!.richtigIndex].de}</De>
            {gewaehlt !== null && gewaehlt !== frage!.richtigIndex && <span style={{ color: "var(--color-ink2)" }}> — اخترتَ: <De>{frage!.optionen[gewaehlt].de}</De></span>}
          </div>
        </div>
      )}
      {entdecken && ergebnis === null && (
        <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)", borderInlineStart: "5px solid var(--color-gold)", marginBottom: "0.8rem" }} data-testid="entdecken">
          <strong>🔍 اكتشف القاعدة قبل أن تقرأها</strong>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.25rem 0 0.6rem" }}>
            اقرأ الأمثلة واسمعها، ثم خمّن: ما القاعدة المشتركة؟ الخطأ هنا لا يُخصم — بل يجهّز ذهنك للشرح.
          </p>
          <div style={{ display: "grid", gap: "0.35rem", marginBottom: "0.7rem" }}>
            {topic.examples.map((ex) => (
              <div key={ex.de} style={{ borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.7rem" }} data-testid="entdecken-beispiel">
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De>{ex.de}</De>
                  <button className="chip" style={{ cursor: "pointer" }} onClick={() => speakAny(ex.de)}>🔊</button>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
          </div>
          <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>ما القاعدة التي تراها في هذه الأمثلة؟</div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            {frage!.optionen.map((o, i) => {
              const ist = gewaehlt === i, richtig = i === frage!.richtigIndex;
              return (
                <button key={i} className="btn btn-ghost" style={{ textAlign: "start", justifyContent: "flex-start", borderColor: gewaehlt === null ? undefined : richtig ? "var(--color-a1)" : ist ? "var(--color-cola)" : undefined, opacity: gewaehlt !== null && !richtig && !ist ? 0.6 : 1 }} onClick={() => waehle(i)} disabled={gewaehlt !== null} data-testid={`entdecken-option-${i}`}>
                  <span><De style={{ fontWeight: 700 }}>{o.de}</De><span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-ink2)" }}>{o.ar}</span></span>
                </button>
              );
            })}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: "0.6rem", fontSize: "0.82rem" }} onClick={() => setErgebnis("uebersprungen")} data-testid="entdecken-ueberspringen">
            أرني القاعدة مباشرة (يُسجَّل تخطّياً، بلا نقطة)
          </button>
        </div>
      )}

      {!offen && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }} data-testid="regel-verdeckt">🔒 الشرح والقواعد والتمارين تُكشف بعد تخمينك.</p>
      )}

      {offen && (<>
      {/* 🏃 R196 — الممارسة قبل النظرية: التثبيت الفوري أولًا، والشرح الكامل مطويّ لمن يحتاجه */}
      <h4 style={{ fontWeight: 800, margin: "0.4rem 0 0.3rem" }}>🏃 طبّق أولًا — ثبّت بالمحاولة قبل قراءة الشرح</h4>
      <p style={{ fontSize: "0.83rem", color: "var(--color-ink2)", margin: "0 0 0.6rem" }}>
        حاول بنفسك الآن؛ الخطأ هنا وقودُ التعلّم. الشرح والقواعد كاملةً مطويّة أسفل التمرين — افتحها بعد محاولتك أو متى احتجتَها.
      </p>
      <ExerciseSet items={topic.exercises} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:grammar` : undefined} />

      <details data-testid="grammatik-theorie" style={{ marginTop: "0.9rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 800, minHeight: "44px", display: "flex", alignItems: "center" }}>
          📘 الشرح والقواعد والأمثلة كاملةً — افتح عند الحاجة
        </summary>
      <p style={{ lineHeight: 1.9 }}>{topic.summaryAr}</p>

      <BrueckenBlock gramId={topic.id} srs={srs} />

      {/* 🧩 ورشةُ المركّبات: مهارةُ فكِّ شفرةٍ تُدرَّب داخلَ درسِها — بذرتُها رقمُ المهمة فتتجدّد */}
      {topic.id === "b2-nominalstil" && (
        <StilWechsler seed={Array.from(task.id).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 3)} onPoints={onPoints} />
      )}
      {topic.id === "b1-wortbildung" && (
        <KompositaWerkstatt level={topic.level} seed={Array.from(task.id).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)} />
      )}

      <ul style={{ margin: "1rem 0", display: "grid", gap: "0.4rem", listStyle: "none", padding: 0 }}>
        {topic.rules.map((r) => (
          <li key={r.de} style={{ background: "var(--color-paper2)", padding: "0.6rem 0.8rem", borderRadius: "0.6rem" }}>
            <De style={{ fontWeight: 700 }}>{r.de}</De>
            <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)" }}>{r.ar}</div>
          </li>
        ))}
      </ul>

      {topic.tables?.map((tb, i) => (
        <div key={i} style={{ overflowX: "auto", margin: "0.8rem 0" }}>
          {tb.captionAr && <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>{tb.captionAr}</div>}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem", direction: "ltr", textAlign: "left" }}>
            <thead>
              <tr>
                {tb.headers.map((h) => (
                  <th key={h} style={{ borderBottom: "2px solid var(--color-line)", padding: "0.4rem 0.6rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tb.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci} style={{ borderBottom: "1px solid var(--color-line)", padding: "0.4rem 0.6rem" }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ display: "grid", gap: "0.35rem", margin: "0.8rem 0" }}>
        {topic.examples.map((ex) => (
          <div key={ex.de} style={{ borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.7rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
              <De>{ex.de}</De>
              <button
                className="chip"
                style={{ cursor: "pointer" }}
                onClick={() => speakAny(ex.de)}
              >
                🔊
              </button>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
          </div>
        ))}
      </div>

      {topic.pitfalls && (
        <div style={{ background: "var(--color-cola-soft)", border: "1px solid var(--color-cola)", borderRadius: "0.7rem", padding: "0.7rem 0.9rem", margin: "0.8rem 0" }}>
          <strong style={{ color: "var(--color-cola)" }}>⚠️ انتبه إلى هذه الأمثلة</strong>
          {topic.pitfalls.map((p) => (
            <div key={p.de} style={{ marginTop: "0.4rem" }}>
              <De>{p.de}</De>
              <div style={{ fontSize: "0.85rem" }}>{p.ar}</div>
            </div>
          ))}
        </div>
      )}

      {topic.pitfalls && topic.pitfalls.length > 0 && (
        <FehlerFinden pitfalls={topic.pitfalls} onPoints={onPoints} />
      )}

      </details>

      {/* 🔁 الحلقة الثلاثية: تعرّف → إكمال → إنتاج حر */}
      <TriplePractice topic={topic} seed={Array.from(task.id).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 41)} onPoints={onPoints} persistKey={persistKey} />
      </>)}
    </section>
  );
}

// ── مفردات + بنك جمل ────────────────────────────────────────────────────
function VocabTask({ task, srs, onSrs, onPoints, voiceName, rate, tempo = "regelmaessig", persistKey }: Omit<TaskProps, "lang" | "day">) {
  const deck = getDeck(task.deckId ?? "");
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [queueStats, setQueueStats] = useState({ due: 0, fresh: 0, cap: 0, introduced: 0 });
  const card = queue[0];

  useEffect(() => {
    let pool: VocabCard[];
    let dueCount = 0;
    let freshCount = 0;
    let introducedToday = 0;
    if (deck) {
      const pending = deck.cards.filter((c) => srs[c.id]?.reps === 0 && wasIntroducedToday(srs[c.id]));
      const due = deck.cards.filter((c) => srs[c.id] && isDue(srs[c.id]) && !pending.some((p) => p.id === c.id));
      const fresh = deck.cards.filter((c) => !srs[c.id]);
      const alreadyIntroduced = countNewCardsIntroducedToday(srs, alleVokabelIds);
      introducedToday = alreadyIntroduced;
      const roomForNew = Math.max(0, newCardCap(tempo) - alreadyIntroduced);
      const pendingToday = pending.slice(0, 10);
      const dueSlots = Math.max(0, 10 - pendingToday.length);
      const dueToday = due.slice(0, dueSlots);
      const newSlots = Math.min(roomForNew, Math.max(0, 10 - pendingToday.length - dueToday.length));
      // المستحقّ أولاً، ثم استأنف البطاقة التي ظهرت ولم تُقيَّم، وأخيراً الجديد ضمن السقف.
      pool = [...dueToday, ...pendingToday, ...fresh.slice(0, newSlots)].slice(0, 10);
      dueCount = due.length;
      freshCount = fresh.length;
    } else {
      const all: VocabCard[] = Object.values(vocabMap).flatMap((d) => d.cards);
      pool = all.filter((c) => srs[c.id] && isDue(srs[c.id])).slice(0, 10);
      dueCount = pool.length;
      freshCount = 0;
    }
    setQueue(pool);
    // R138/P-15: نُعرِض إحصائيات البطاقات (مستحقة/جديدة/مقدمة اليوم) في الـ state لكي تظهَر في الواجهة.
    setQueueStats({ due: dueCount, fresh: freshCount, cap: newCardCap(tempo), introduced: introducedToday });
    // تُثبَّت الوتيرة عند بدء المهمة؛ تغيّرُ SRS داخل الطابور لا يعيدُ البطاقةَ الحالية.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id, tempo]);

  // إدخال البطاقة في SRS عند ظهورها فعلاً، لا عند تحميل طابورٍ قد لا يراه المتعلّم.
  useEffect(() => {
    if (card && !srs[card.id]) onSrs(card.id, newCard());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, srs, onSrs]);

  const kollokItems = useMemo(() => {
    const alle: VocabCard[] = Object.values(vocabMap).flatMap((d) => d.cards);
    const rand = rng(seedFrom(task.id) + 7);
    return queue.map((c, i) => kollokationUebung(c, alle, rand, i)).filter(Boolean) as Exercise[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length, task.id]);
  const satzItems = useMemo(() => {
    return (task.sentenceIds ?? [])
      .map((sid, i) => {
        const s = getSatz(sid);
        return s ? clozeFromSatz(s, i, rng(seedFrom(task.id) + i * 97)) : null;
      })
      .filter(Boolean) as Exercise[];
  }, [task.sentenceIds, task.id]);

  if (!deck && task.deckId) return <Empty title={meldung("deck-fehlt").titel} aktion={meldung("deck-fehlt").aktion} />;

  const produktiv = !!card && ((srs[card.id]?.reps ?? 0) % 2 === 1);
  const rateCard = (q: 0 | 2 | 4) => {
    if (!card) return;
    const prev = srs[card.id] ?? newCard();
    onSrs(card.id, reviewCard(prev, q, { produktiv }));
    if (q === 0) {
      addFehlerNow({
        falsch: deFormOf(card),
        richtig: card.ar,
        art: "wortschatz",
        ar: card.exampleDe ? `${card.ar} — مثال: ${card.exampleDe}` : card.ar,
        level: card.level,
        quelle: deck?.titleAr ?? "مفردات",
      });
    }
    setQueue((qs) => qs.slice(1));
    setDoneCount((d) => d + 1);
    setFlipped(false);
  };

  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head
        icon="🃏"
        de={deck?.titleDe ?? "Wiederholungskarten"}
        ar={`${deck?.titleAr ?? "بطاقات المراجعة المتباعدة"} — سقفُ الجديد اليومي ${newCardCap(tempo)} بطاقات حسب الوتيرة`}
      />
      <p data-testid="vocab-tempo-cap" style={{ margin: "-0.35rem 0 0.7rem", fontSize: "0.82rem", color: "var(--color-ink2)" }}>
        الحدّ الأقصى للبطاقات الجديدة اليوم: <span className="rtl-num">{newCardCap(tempo)}</span>؛ تُقدَّم المراجعات المستحقّة أولاً.
        <br />
        <strong>بطاقات اليوم:</strong> <span className="rtl-num">{queue.length}</span> في الدفعة الحالية · مراجعات مستحقة إجمالاً: <span className="rtl-num">{queueStats.due}</span> · بطاقات جديدة متبقية في الحزمة: <span className="rtl-num">{queueStats.fresh}</span> · بطاقات جديدة قُدّمت اليوم: <span className="rtl-num">{queueStats.introduced}</span>/<span className="rtl-num">{queueStats.cap}</span>
      </p>
      {card ? (
        // ♿ R305/ت16+ب10: كانت هذه البطاقة <div onClick> بلا أي دعم للوحة المفاتيح — أكثر
        // تفاعل متكرر في كامل المنهج (مراجعة SRS اليومية). أُضيف role="button"/tabIndex حينها،
        // لكن فحص axe-core الآلي (R305/ب10) كشف أن هذا يُنتج مخالفة «nested-interactive»:
        // أزرار حقيقية (🔊 اسمع النطق، اكشف المعنى، لم أعرف/بجهد/سهّل) متداخلة داخل عنصر له
        // دور ARIA «زر» أيضًا — يربك قارئ الشاشة وترتيب التبويب. الإصلاح النهائي: الحاوية
        // الخارجية حاوية بصريّة محضة (لا onClick ولا دور)، وواجهُ البطاقة (الصورة + الكلمة)
        // أصبح ‎<button>‎ حقيقيًّا واحدًا بذاته — قابل للتبويب والتفعيل بالفأرة/اللمس/لوحة
        // المفاتيح أصلًا بلا أي كود إضافي، ولا يحوي أزرارًا أخرى بداخله فلا تداخل إطلاقًا.
        <div className="card" style={{ padding: "1.4rem", textAlign: "center", background: "var(--color-paper2)" }}>
          <div className="chip" data-testid="vocab-queue-count" style={{ marginBottom: "0.6rem" }}>
            <span className="rtl-num">{doneCount + 1}</span> / <span className="rtl-num">{doneCount + queue.length}</span>
          </div>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-label={flipped ? "وجه البطاقة" : produktiv ? "اكشف اللفظ الألماني" : "اكشف المعنى"}
            style={{ display: "block", width: "100%", minHeight: "44px", background: "none", border: "none", padding: 0, margin: 0, font: "inherit", color: "inherit", cursor: "pointer" }}
          >
            {card.img && (
              // alt="" مقصودة: الصورة إيضاح بصريّ مرافق للكلمة المعروضة نصًّا أسفلها مباشرة
              // داخل نفس الزرّ — تكرار النطق عبر alt يُضاعف اسم الزرّ لقارئ الشاشة (axe-core
              // image-redundant-alt، R305/ب10)، والزرّ نفسه يحمل aria-label واضحًا بالفعل.
              <img
                src={card.img}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                style={{ display: "block", margin: "0 auto 0.6rem", width: "100%", maxWidth: 230, height: 150, objectFit: "contain", borderRadius: 12, background: "var(--color-card)" }}
              />
            )}
            <div style={{ fontSize: "1.7rem", fontWeight: 900 }}>
              {produktiv && !flipped ? (
                <span>{card.ar}</span>
              ) : (
                <>
                  {card.article && <span style={{ color: "var(--color-gold)" }}>{card.article} </span>}
                  <De>{deFormOf(card, false)}</De>
                  {genusCode(card.article) && (
                    <span className="chip" data-testid="karte-genus" title={`الجنس: ${genusCode(card.article)!.ar}`} style={{ fontSize: "0.8rem", marginInlineStart: "0.4rem" }}>
                      {genusCode(card.article)!.symbol} {genusCode(card.article)!.letter}
                    </span>
                  )}
                </>
              )}
            </div>
          </button>
          {produktiv && !flipped && (
            <div className="chip" data-testid="karte-produktiv" style={{ marginTop: "0.3rem" }}>🎯 إنتاج: تذكّر اللفظ الألماني بنفسك ثم اكشفه</div>
          )}
          {(!produktiv || flipped) && (
          <button
            className="btn btn-ghost"
            style={{ margin: "0.5rem" }}
            onClick={(e) => {
              e.stopPropagation();
              speakDe(deFormOf(card), { voiceName, rate });
            }}
          >
            🔊 اسمع النطق
          </button>
          )}
          {!flipped ? (
            <div>
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); setFlipped(true); }}>{produktiv ? "اكشف اللفظ الألماني" : "اكشف المعنى"}</button>
            </div>
          ) : (
            <div className="fadein">
              <div style={{ fontSize: "1.15rem", color: "var(--color-cola)" }}>{card.ar}</div>
              <div style={{ marginTop: "0.35rem" }}>
                <span className="chip" data-testid="karte-stufe" style={{ fontSize: "0.75rem" }}>
                  🪜 مرحلة البطاقة: {KARTENSTUFE_AR[karteStufe(srs[card.id])]}{produktiv ? " · هذه الجولة إنتاج (عربي←ألماني)" : ""}
                </span>
              </div>
              {card.pos && (
                <div style={{ marginTop: "0.35rem" }}>
                  <span data-testid="karte-pos" className="chip" style={{ fontSize: "0.75rem" }}>
                    🏷️ {card.pos}{POS_AR[card.pos] ? ` · ${POS_AR[card.pos]}` : ""}{card.posInfo ? ` (${card.posInfo})` : ""}
                  </span>
                </div>
              )}
              {card.ant?.length ? (
                <div data-testid="karte-synant" style={{ marginTop: "0.5rem", fontSize: "0.85rem", display: "grid", gap: "0.2rem" }}>
                  <div>↔️ ضدّ: <De>{card.ant.join(" · ")}</De></div>
                </div>
              ) : null}
              <SynonymKontext karte={card} testId="karte-syn-context" />
              {getMnemonik(card.de) && (
                <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", background: "var(--color-gold-soft)", borderRadius: "0.5rem", padding: "0.35rem 0.6rem" }}>
                  💡 {getMnemonik(card.de)!.tipp}
                </div>
              )}
              {(() => {
                // R138/P-22: روابط لشفرات Eselsbrücken المتعلقة بالكلمة
                const bs = getBrueckenForWort(card.de);
                if (!bs.length) return null;
                return (
                  <div style={{ marginTop: "0.4rem", fontSize: "0.82rem", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {bs.map((b) => (
                      <span key={b.id} className="chip" style={{ background: "var(--color-b2-soft, rgba(123,31,162,0.12))" }}>
                        {b.emoji} شفرة: {b.titleAr}
                      </span>
                    ))}
                  </div>
                );
              })()}
              {card.exampleDe && (
                <div style={{ marginTop: "0.6rem" }}>
                  <De>{card.exampleDe}</De>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{card.exampleAr}</div>
                </div>
              )}
              {kollokationenFuer(card).length > 0 && (
                <div data-testid="kollokationen" style={{ marginTop: "0.6rem", fontSize: "0.9rem", display: "flex", gap: "0.35rem", flexWrap: "wrap", justifyContent: "center" }}>
                  {kollokationenFuer(card).map((k) => (
                    <span key={k} dir="ltr" style={{ background: "var(--color-sand, #f3ede2)", borderRadius: "0.5rem", padding: "0.2rem 0.5rem" }}>{k}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginTop: "0.9rem", flexWrap: "wrap" }}>
                <button className="btn btn-ghost" onClick={() => rateCard(0)}>لم أعرف (0)</button>
                <button className="btn btn-gold" onClick={() => rateCard(2)}>بجهد (2)</button>
                <button className="btn btn-primary" onClick={() => rateCard(4)}>سهّل! (4)</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center", padding: "0.8rem" }}>✨ أنهيت البطاقات — ستُجدول للمراجعة تلقائياً.</p>
      )}
      {kollokItems.length > 0 && (
        <div data-testid="kollok-uebung" style={{ marginTop: "1rem" }}>
          <h4 style={{ fontWeight: 800, margin: "0 0 0.5rem" }}>أكمل المتلازمة</h4>
          <ExerciseSet items={kollokItems} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:collocations` : undefined} />
        </div>
      )}
      {satzItems.length > 0 && (
        <>
          <h4 style={{ fontWeight: 800, margin: "1rem 0 0.6rem" }}>تثبيت من بنك الجمل</h4>
          <ExerciseSet items={satzItems} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:sentences` : undefined} />
        </>
      )}
    </section>
  );
}

// ── استماع/تسميع (TTS) ─────────────────────────────────────────────────
function HoerenTask({ task, onPoints, voiceName, rate, persistKey }: Omit<TaskProps, "lang" | "day" | "srs" | "onSrs">) {
  const dlg = getDialogue(task.dialogueId ?? "");
  const [playing, setPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  // A9 (R282): Pruefungsmodus — ein Abspielvorgang, Text erst nach Abgabe
  const [pruefung, setPruefung] = useState(false);
  const [plays, setPlays] = useState(0);
  const [abgegeben, setAbgegeben] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [, setVoReady] = useState(false);
  // R138/P-13: Hörverstehen-Modi mit Anweisung
  const modus = task.hoerenModus ?? "global";
  const MODUS_INFO: Record<string, { labelDe: string; labelAr: string; instrAr: string }> = {
    global: { labelDe: "Globalverstehen", labelAr: "فهم عام", instrAr: "🎯 هدفك: فهم الموضوع العام والمكان والعلاقة بين المتحدّثين. لا تقلق من كل كلمة." },
    selektiv: { labelDe: "Selektivverstehen", labelAr: "فهم انتقائي", instrAr: "🎯 هدفك: التقاط معلومات محددة (تواريخ، أرقام، أسماء، أوقات) — ركّز فقط على ما تحتاجه." },
    detailliert: { labelDe: "Detailverstehen", labelAr: "فهم تفصيلي", instrAr: "🎯 هدفك: فهم التفاصيل والحجج والسبب والنتيجة. استمع مرتين إن لزم." },
  };

  useEffect(() => {
    warmVoices(() => setVoReady(true));
  }, []);

  if (!dlg) return <Empty title={meldung("dialog-fehlt").titel} aktion={meldung("dialog-fehlt").aktion} />;

  const playAll = () => {
    if (playing) {
      stopSpeech();
      setPlaying(false);
      setLineIdx(-1);
      return;
    }
    if (pruefung && !abgegeben && plays >= 1) return; // A9: nur ein Durchlauf
    setPlaying(true);
    setPlays((p) => p + 1);
    let i = 0;
    const next = () => {
      if (i >= dlg.lines.length) {
        setPlaying(false);
        setLineIdx(-1);
        return;
      }
      setLineIdx(i);
      speakLine(dlg.lines[i].de, () => {
        i += 1;
        setTimeout(next, 350);
      }, { voiceName, rate });
    };
    next();
  };

  const dictationEx: Exercise[] = dlg.dictation.map((s, i) => ({
    id: `${dlg.id}-di${i}`,
    type: "dictation",
    promptDe: "اسمع واكتب",
    promptAr: "اضغط 🔊 ثم اكتب ما سمعته بالألمانية",
    answer: [s],
    explanationDe: s,
  }));

  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="🎧" de={`${dlg.titleDe} · ${MODUS_INFO[modus].labelDe}`} ar={`${dlg.titleAr} — ${MODUS_INFO[modus].labelAr}`} />
      <div style={{ background: "var(--color-a1-soft, rgba(25,118,210,0.08))", border: "1px solid var(--color-a1-soft, rgba(25,118,210,0.2))", borderRadius: "0.5rem", padding: "0.5rem 0.8rem", marginBottom: "0.7rem", fontSize: "0.88rem" }}>
        {MODUS_INFO[modus].instrAr}
      </div>
      {!speechAvailable() && (
        <p style={{ color: "var(--color-cola)" }}>
          ⚠️ متصفحك لا يدعم النطق المدمج — اقرأ النص بصوت عالٍ (يبقى التمرين نصياً كاملاً).
        </p>
      )}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.6rem 0" }}>
        <button className="btn btn-primary" onClick={playAll} disabled={pruefung && !abgegeben && plays >= 1}>
          {playing ? "⏹ أوقف" : pruefung && !abgegeben && plays >= 1 ? "🔒 استُمع مرة واحدة (وضع الامتحان)" : "▶️ شغّل الحوار كاملاً"}
        </button>
        <button className="btn btn-ghost" onClick={() => setShowText((s) => !s)} disabled={pruefung && !abgegeben}>
          {pruefung && !abgegeben ? "🔒 النص مقفل حتى التسليم" : showText ? "🙈 أخفِ النص (أول استماع)" : "👁 أظهر النص"}
        </button>
        <button className="btn btn-ghost" data-testid="hoeren-pruefung-toggle" onClick={() => { setPruefung((p) => !p); setShowText(false); }}>
          {pruefung ? "🎓 وضع الامتحان: يعمل (أوقف)" : "🎓 فعّل وضع الامتحان (A9)"}
        </button>
        {pruefung && !abgegeben && (
          <button className="btn btn-ghost" data-testid="hoeren-abgabe" onClick={() => setAbgegeben(true)}>
            📨 سلّمت إجابتي — افتح النص والمراجعة
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: "0.35rem", margin: "0.8rem 0" }}>
        {dlg.lines.map((l, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: "0.55rem 0.8rem",
              background: lineIdx === i ? "rgb(34 197 94 / 0.14)" : "transparent",
              borderColor: lineIdx === i ? "#22c55e" : undefined,
              display: "flex",
              gap: "0.6rem",
              alignItems: "flex-start",
            }}
          >
            <button
              className="chip"
              style={{ cursor: "pointer" }}
              disabled={pruefung && !abgegeben}
              onClick={() => { if (pruefung && !abgegeben) return; speakLine(l.de, undefined, { voiceName, rate }); }}
              title="اسمع السطر"
            >
              🔊
            </button>
            <div style={{ flex: 1 }}>
              <strong>{l.who}:</strong>{" "}
              {showText ? <De><WortLinkText text={l.de} level={dlg.level} testid={`wortlink-dlg-${i}`} /></De> : <span style={{ color: "var(--color-ink2)" }}>•••••• (استمع أولاً)</span>}
              {showText && <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{l.ar}</div>}
            </div>
          </div>
        ))}
      </div>

      <h4 style={{ fontWeight: 800, margin: "0.8rem 0 0.5rem" }}>فهم المسموع</h4>
      <ExerciseSet items={dlg.questions} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:listening` : undefined} />

      <SignalRadar dlg={dlg} onPoints={onPoints} />

      <h4 style={{ fontWeight: 800, margin: "1rem 0 0.5rem" }}>إملاء (Dictation)</h4>
      <ExerciseSet items={dictationEx} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:dictation` : undefined} />

      <RollenDialog dlg={dlg} onPoints={onPoints} voiceName={voiceName} rate={rate} />
    </section>
  );
}

// ── قراءة ───────────────────────────────────────────────────────────────
function LesenTask({ task, onPoints, voiceName, rate, persistKey, bemerkenRegeln }: Omit<TaskProps, "lang" | "day" | "srs" | "onSrs">) {
  const text = getText(task.textId ?? "");
  const [showTr, setShowTr] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [predictionDone, setPredictionDone] = useState(false);
  const _isB2 = text?.level === "B2";
  // reset prediction when textId changes
  useEffect(() => { setPrediction(""); setPredictionDone(!_isB2); }, [task.textId, _isB2]);
  if (!text) return <Empty title={meldung("text-fehlt").titel} aktion={meldung("text-fehlt").aktion} />;
  // 📜 النسخةُ الطويلةُ (طول CEFR حقيقي) إن وُجدت؛ وإلا النصُّ القصير
  const lese = leseText(text);
  const absaetze = lese.de.split(/\n\n+/);
  const woerter = lese.de.split(/\s+/).length;
  const radar = useMemo(() => grammatikImText(lese.de), [lese.de]);
  const splitSaetze = (txt: string) => txt.match(/[^.!?؟。]+[.!?؟۔]+/g)?.map((s) => s.trim()).filter(Boolean) ?? [txt];
  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="📖" de={text.titleDe} ar={text.titleAr} />
      {lese.lang && (
        <div data-testid="lesen-lang" style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.5rem" }}>
          <span className="chip">{text.level} · <span className="rtl-num">{woerter}</span> كلمة</span>
          <span>اقرأ مرّتين: الأولى للفكرة، الثانية للأسئلة — الأسئلة تأويلية لا حرفية</span>
        </div>
      )}
      {/* 🔮 Prediction vor dem Lesen — Conti/Mayer: Vermutung aktiviert Vorwissen */}
      {text.level === "B2" && !predictionDone && (
        <div data-testid="lesen-prediction" className="card" style={{ padding: "0.7rem 0.9rem", background: "linear-gradient(135deg, var(--color-paper2), var(--color-paper))", borderInlineStart: "4px solid #a78bfa", marginBottom: "0.7rem", display: "grid", gap: "0.4rem" }}>
          <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>🔮 قبل القراءة — ماذا تتوقع؟</div>
          <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>العنوان: <De style={{ fontWeight: 700 }}>{text.titleDe}</De> — خمّن فكرة النص بجملة واحدة، ثم اكشف النص.</div>
          <input data-testid="lesen-prediction-input" className="field" dir="ltr" lang="de" placeholder="Ich denke, es geht um..." value={prediction} onChange={(e) => setPrediction(e.target.value)} style={{ minHeight: "42px" }} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" className="btn btn-primary" data-testid="lesen-prediction-submit" disabled={prediction.trim().length < 3} onClick={() => setPredictionDone(true)} style={{ minHeight: "40px" }}>💭 لدي تخمين — افتح النص</button>
            <button type="button" className="btn btn-ghost" data-testid="lesen-prediction-skip" onClick={() => setPredictionDone(true)} style={{ minHeight: "40px" }}>تخطي →</button>
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--ui-muted)" }}>Conti Prediction: توقعك يجهّز الدماغ — حتى الخطأ مفيد.</div>
        </div>
      )}
      {(!text.level || text.level !== "B2" || predictionDone) && (
      <article className="de authentic-reader" style={{ display: "block", width: "100%", lineHeight: 2.05, background: "var(--color-paper2)", padding: "1rem 1.1rem", borderRadius: "0.8rem", borderInlineStart: text.level === "A0" ? "4px solid #4ade80" : text.level === "A1" ? "4px solid #22c55e" : text.level === "A2" ? "4px solid #60a5fa" : text.level === "B1" ? "4px solid #f2c866" : "4px solid #a78bfa", fontSize: text.level === "B2" ? "0.98rem" : "0.92rem", letterSpacing: "0.01em" }}>
        {absaetze.map((p, i) => {
          const saetze = splitSaetze(p);
          return (
            <p key={i} style={{ margin: i === 0 ? 0 : "0.9rem 0 0" }}>
              {saetze.map((satz, si) => (
                <span key={si} className="authentic-satz" style={{ display: "inline-flex", gap: "0.35rem", alignItems: "baseline", marginInlineEnd: "0.35rem", marginBottom: "0.2rem" }}>
                  <button className="chip authentic-satz-audio" aria-label={`استمع للجملة ${si + 1}`} data-testid={`lesen-satz-audio-${i}-${si}`} style={{ cursor: "pointer", minHeight: "28px", minWidth: "32px", padding: "0 0.35rem", fontSize: "0.75rem", flexShrink: 0 }} onClick={() => speakDe(satz, { voiceName, rate: (rate ?? 0.9) * 0.9 })}>🔊</button>
                  <span style={{ flex: 1 }}>
                    {text.level === "B2" && /(weil|obwohl|während|damit|indem|falls|sodass)/i.test(satz) ? (
                      <span dir="ltr" lang="de" className="b2-konnektor-wrap" dangerouslySetInnerHTML={{ __html: satz.replace(/(weil|obwohl|während|damit|indem|falls|sodass)/gi, (m) => { const l=m.toLowerCase(); const cls=l==="weil"?"b2-konnektor--weil":l==="obwohl"?"b2-konnektor--obwohl":l==="während"?"b2-konnektor--waehrend":l==="damit"?"b2-konnektor--damit":l==="indem"?"b2-konnektor--indem":l==="falls"?"b2-konnektor--falls":l==="sodass"?"b2-konnektor--sodass":""; return `<mark class="b2-konnektor ${cls}">${m}</mark>`; }) }} />
                    ) : (
                      <WortLinkText text={satz} level={text.level} testid={`wortlink-${i}-${si}`} />
                    )}
                  </span>
                </span>
              ))}
            </p>
          );
        })}
      </article>
      )}
      {prediction && predictionDone && text.level === "B2" && (
        <div data-testid="lesen-prediction-done" style={{ marginTop: "0.5rem", padding: "0.6rem 0.8rem", background: "var(--color-paper)", borderRadius: "0.6rem", border: "1px dashed var(--color-line)", fontSize: "0.82rem", lineHeight: 1.7 }}>
          <span style={{ fontWeight: 800 }}>🔮 توقعك:</span> <span dir="ltr" lang="de" style={{ fontStyle: "italic" }}>{prediction}</span> — الآن قارن بما قرأت: هل أصبت الفكرة؟ ما الذي فاجأك؟
        </div>
      )}
      {text.level === "B2" && predictionDone && (
        <div data-testid="b2-konnektor-legende" style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.45rem", fontSize: "0.74rem", color: "var(--color-ink2)", alignItems: "center" }}>
          <span style={{ fontWeight: 700 }}>Konnektoren:</span>
          <span className="chip"><span className="b2-konnektor b2-konnektor--weil">weil</span> Ursache</span>
          <span className="chip"><span className="b2-konnektor b2-konnektor--obwohl">obwohl</span> Einräumung</span>
          <span className="chip"><span className="b2-konnektor b2-konnektor--waehrend">während</span> Gleichzeitigkeit</span>
          <span className="chip"><span className="b2-konnektor b2-konnektor--damit">damit</span> Ziel · <span className="b2-konnektor b2-konnektor--indem">indem</span> Mittel</span>
          <span className="chip"><span className="b2-konnektor b2-konnektor--falls">falls</span> Bedingung · <span className="b2-konnektor b2-konnektor--sodass">sodass</span> Folge</span>
        </div>
      )}
      {bemerkenRegeln && bemerkenRegeln.length > 0 && <BemerkenKarte textDe={lese.de} regeln={bemerkenRegeln} />}
      {radar.length > 0 && (
        <div data-testid="grammatik-radar" style={{ margin: "0.8rem 0 0.4rem", padding: "0.6rem 0.8rem", borderRadius: "8px", background: "var(--color-paper)", borderInlineStart: "4px solid var(--color-b1)", fontSize: "0.82rem" }}>
          <div style={{ fontWeight: 800, marginBottom: "0.3rem", color: "var(--color-ink)" }}>
            📐 رادار القواعد في النص — ظواهر مرصودة:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {radar.map((f) => (
              <span key={f.topicId} className="chip" style={{ fontSize: "0.78rem", padding: "0.2rem 0.6rem" }} title={`شاهد: «${f.beleg}»`}>
                <strong lang="de" dir="ltr">{f.nameDe}</strong> <span style={{ color: "var(--color-ink2)" }}>({f.nameAr})</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {text.level === "B2" && (
        <div style={{ margin: "0.8rem 0", padding: "0.6rem 0.85rem", borderRadius: "0.7rem", background: "rgb(167 139 250 / 0.08)", border: "1px solid rgb(167 139 250 / 0.3)", fontSize: "0.82rem", lineHeight: 1.9 }}>
          <strong>🌍 في ألمانيا:</strong> هذا النص يعكس أسلوب {text.titleDe.includes("Zeitung") || text.titleDe.includes("Presse") ? "الصحافة الألمانية — جمل длинная و Nominalstil شائع." : text.level === "B2" ? "الكتابة الأكاديمية — انتبه لتحوّل weil → wegen و Passiv → sein + Partizip." : "الحياة اليومية — لاحظ كيف يُستعمل الكلام غير المباشر في التقارير."}
        </div>
      )}
      <div style={{ display: "flex", gap: "0.5rem", margin: "0.6rem 0", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => speakDe(lese.de, { voiceName, rate: (rate ?? 0.9) * 0.9 })}>
          🔊 استمع للنص (ببطء)
        </button>
        <button className="btn btn-ghost" onClick={() => setShowTr((s) => !s)}>
          {showTr ? (lese.lang ? "أخفِ الملخّص" : "أخفِ الترجمة") : (lese.lang ? "ملخّص عربي (بعد القراءة)" : "الترجمة (بعد القراءة)")}
        </button>
      </div>
      {showTr && <p style={{ color: "var(--color-ink2)", lineHeight: 1.9, marginBottom: "0.8rem" }}>{lese.ar}</p>}
      <ExerciseSet items={lese.questions} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:reading` : undefined} />
    </section>
  );
}

// ── كتابة بتقييم ذاتي ───────────────────────────────────────────────────
function SchreibenTask({ task, onPoints, persistKey }: Omit<TaskProps, "lang" | "day" | "srs" | "onSrs" | "voiceName" | "rate">) {
  const w = getWriting(task.writeId ?? "");
  const [draft, setDraft, draftReady] = useTaskDraft(persistKey, "writing", {
    text: "",
    checks: {} as Record<number, boolean>,
    submitted: false,
  });
  const { text, checks, submitted } = draft;
  if (!draftReady) return <div className="card" role="status">⏳ جارٍ استعادة مسودّة الكتابة…</div>;
  if (!w) return <Empty title={meldung("schreiben-fehlt").titel} aktion={meldung("schreiben-fehlt").aktion} />;
  const selfScore = w.criteria.filter((_, i) => checks[i]).length;

  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="✍️" de={w.titleDe} ar={w.titleAr} />
      <div className="card" style={{ padding: "0.8rem 1rem", marginBottom: "0.8rem", background: "var(--color-gold-soft)" }}>
        <De>{w.taskDe}</De>
        <div style={{ marginTop: "0.3rem", fontSize: "0.9rem" }}>{w.taskAr}</div>
      </div>
      <textarea className="field" rows={8} dir="ltr" style={{ lineHeight: 1.8 }} placeholder="Schreibe hier …" value={text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} />
      <div style={{ margin: "0.8rem 0", fontWeight: 700 }}>معايير التقييم الذاتي (مستمدة من معايير Goethe):</div>
      <ul style={{ display: "grid", gap: "0.35rem", listStyle: "none", padding: 0 }}>
        {w.criteria.map((c, i) => (
          <li key={c}>
            <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={!!checks[i]} onChange={() => setDraft((d) => ({ ...d, checks: { ...d.checks, [i]: !d.checks[i] } }))} style={{ marginTop: "0.25rem" }} />
              <span>{c}</span>
            </label>
          </li>
        ))}
      </ul>
      {!submitted ? (
        <button
          className="btn btn-primary"
          style={{ marginTop: "0.8rem" }}
          disabled={text.trim().length < 30}
          onClick={() => {
            setDraft((d) => ({ ...d, submitted: true }));
            onPoints(selfScore, w.criteria.length);
          }}
        >
          سلّمت النص (التقييم الذاتي)
        </button>
      ) : (
        <div className="fadein" style={{ marginTop: "0.8rem" }}>
          <strong>
            ✅ التقييم الذاتي: <span className="rtl-num">{selfScore}</span> / <span className="rtl-num">{w.criteria.length}</span> معايير
          </strong>
          <details style={{ marginTop: "0.6rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>نموذج إجابة للمقارنة</summary>
            <article className="de" style={{ display: "block", width: "100%", background: "var(--color-paper2)", padding: "0.8rem", borderRadius: "0.6rem", marginTop: "0.5rem", lineHeight: 1.85 }}>
              {w.sample}
            </article>
          </details>
          <SchreibBerater text={text} taskDe={w.taskDe} />
        </div>
      )}
    </section>
  );
}

// ── نطقٌ وإيقاعٌ قابلان للاستعمال داخل مهمة اليوم ──────────────────────
function AusspracheTask({ task, day, onPoints, voiceName, rate, persistKey }: Omit<TaskProps, "lang" | "srs" | "onSrs">) {
  const [draft, setDraft, draftReady] = useTaskDraft(persistKey, "pronunciation", {
    done: {} as Record<string, boolean>,
    measured: {} as Record<string, boolean>,
  });
  const done = draft.done ?? {};
  const measured = draft.measured ?? {};
  const items = (task.sentenceIds ?? []).flatMap((id) => {
    const sentence = getSatz(id);
    return sentence ? [sentence] : [];
  });
  const level = levelOf(day);
  const doneCount = items.filter((sentence) => done[sentence.id]).length;
  const measuredCount = items.filter((sentence) => measured[sentence.id]).length;

  const completeSentence = (id: string, result: AusspracheAbschluss) => {
    setDraft((previous) => ({
      ...previous,
      done: { ...(previous.done ?? {}), [id]: true },
      measured: { ...(previous.measured ?? {}), [id]: result.measured },
    }));
  };

  if (!draftReady) return <div className="card" role="status">⏳ جارٍ استعادة تدريب النطق…</div>;
  if (!items.length) return <div className="card" role="alert">لا توجد جمل نطق مرتبطة بهذه المهمة بعد؛ لم نُسجّل إنجازاً وهمياً.</div>;

  return (
    <section className="card fadein dirb-ex" data-testid="aussprache-task" style={{ padding: "1.2rem" }}>
      <Head icon="🎙️" de="Aussprache & Shadowing" ar={`${task.titleAr} — اسمع النموذج، كرّر، وراجع تسجيلك`} />
      <p style={{ margin: "0.2rem 0 0.5rem", color: "var(--color-ink2)", fontSize: "0.86rem" }}>
        الجمل محفوظة لهذه المهمة فقط. يمكنك التدرّب بترديد ذاتي، أو تسجيل صوت محلي ومقارنته بالنموذج؛ القياس الحالي للإيقاع والوقفات لا لمخارج الأصوات.
      </p>
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {items.map((sentence) => (
          <div key={sentence.id} className="card" data-testid={`aussprache-item-${sentence.id}`} style={{ padding: "0.7rem 0.85rem" }}>
            <AusspracheTrainer
              satz={sentence.de}
              ar={sentence.ar}
              level={level}
              voiceName={voiceName}
              rate={rate}
              onPracticeComplete={(result) => completeSentence(sentence.id, result)}
            />
            <div role="status" aria-live="polite" style={{ marginTop: "0.35rem", fontSize: "0.8rem", color: "var(--color-ink2)" }}>
              {done[sentence.id]
                ? measured[sentence.id] ? "✅ تمّت مراجعة الإيقاع محلياً؛ لا حكم على مخارج الحروف." : "✅ تمّ الترديد ذاتياً دون قياس أو درجة."
                : "الجملة لم تُسجَّل كمكتملة بعد."}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "0.65rem", display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
        <span className="chip rtl-num">تدرّبت {doneCount}/{items.length} · قياس محلي {measuredCount}</span>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="aussprache-task-complete"
          disabled={doneCount < items.length}
          onClick={() => onPoints(doneCount, items.length)}
        >
          أنجزت تدريب النطق ({doneCount}/{items.length})
        </button>
      </div>
    </section>
  );
}

// ── تحدّث (Shadowing + تسميع) ───────────────────────────────────────────
function SprechenTask({ task, onPoints, voiceName, rate, persistKey }: Omit<TaskProps, "lang" | "day" | "srs" | "onSrs">) {
  const [draft, setDraft, draftReady] = useTaskDraft(persistKey, "speaking", {
    done: {} as Record<number, boolean>,
    schrift: "",
    schriftAb: false,
  });
  const { done, schrift, schriftAb } = draft;
  const items = (task.sentenceIds ?? []).map((sid) => getSatz(sid)).filter(Boolean);
  const doneCount = items.filter((_, i) => done[i]).length;
  if (!draftReady) return <div className="card" role="status">⏳ جارٍ استعادة تدريب التحدّث…</div>;
  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="🗣️" de="Sprechtraining (Shadowing)" ar={`${task.titleAr} — استمع، كرّر، سجّل نفسك`} />
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {items.map((s, i) => (
          <div key={s!.id} className="card" style={{ padding: "0.7rem 0.9rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button className="chip" style={{ cursor: "pointer" }} onClick={() => speakDe(s!.de, { voiceName, rate })}>
                🔊 استمع
              </button>
              <div style={{ flex: 1, minWidth: "14rem" }}>
                <De>{s!.de}</De>
                <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{s!.ar}</div>
              </div>
              <label style={{ display: "flex", gap: "0.35rem", alignItems: "center", fontSize: "0.85rem", cursor: "pointer" }}>
                <input type="checkbox" checked={!!done[i]} onChange={() => setDraft((d) => ({ ...d, done: { ...d.done, [i]: !d.done[i] } }))} />
                كرّرت بصوت عالٍ
              </label>
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--color-ink2)", fontSize: "0.88rem", margin: "0.7rem 0" }}>
        💡 قاعدة الظل اللغوي: استمع للجملة ← انسخ نغمة المتحدث بحذف اللامام ← سجّل صوتك بالهاتف واستمع كل 3 أيام لتلاحظ تقدّمك.
      </p>
      {!schriftAb ? (
        <div className="card" style={{ padding: "0.7rem 0.9rem", margin: "0 0 0.7rem", background: "var(--color-paper2)" }}>
          <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>⌨️ تعذّر النطق اليوم؟ (مرض · ضجيج · لا ميكروفون)</div>
          <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.4rem" }}>
            اكتب الجمل من الذاكرة بدلاً — يُحتسب إنجازاً للمهمة، لا دليل نطق.
          </div>
          <textarea
            data-testid="sprech-schrift-text"
            className="field"
            rows={4}
            value={schrift}
            onChange={(e) => setDraft((d) => ({ ...d, schrift: e.target.value }))}
            placeholder="Schreibe die Sätze aus dem Gedächtnis …"
            style={{ width: "100%", padding: "0.5rem", fontSize: "0.9rem", borderRadius: "0.5rem" }}
          />
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="sprech-schrift-ab"
            disabled={schrift.trim().length < 10}
            onClick={() => { markiereSchriftlich(task.id); setDraft((d) => ({ ...d, schriftAb: true, done: Object.fromEntries(items.map((_, i) => [i, true])) })); }}
            style={{ marginTop: "0.4rem" }}
          >
            سلّم كتابياً
          </button>
        </div>
      ) : (
        <div data-testid="sprech-schrift-hinweis" style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 0.7rem" }}>
          📝 مسلَّم كتابياً — إثبات إنجاز لا إثبات نطق.
        </div>
      )}
      <button
        className="btn btn-primary"
        disabled={doneCount < items.length}
        onClick={() => onPoints(1, 1)}
      >
        أنجزت التدريب الشفهي ({doneCount}/{items.length})
      </button>
    </section>
  );
}

// ── استرجاع يومي/أسبوعي + قائمة «أستطيع» ────────────────────────────────
function WiederholenTask({
  task,
  day,
  srs,
  onSrs,
  onPoints,
  voiceName: _voiceName,
  rate: _rate,
  persistKey,
  onKapselErgebnis,
}: Omit<TaskProps, "lang">) {
  const level = levelOf(Math.max(day - 1, 1));
  const isPhaseEnd = istPhasenPruefung(day); // أيام نهاية المرحلة: تقرير كامل

  // بطاقة استرجاع سريعة: نعرض الجمل المطلوبة + فحص
  const satzItems: Exercise[] = (task.sentenceIds ?? [])
    .map((sid) => getSatz(sid))
    .filter(Boolean)
    .map((s, i) => ({
      id: `${s!.id}-tr${i}`,
      type: "translate",
      promptDe: "Übersetze ins Deutsche:",
      promptAr: s!.ar,
      answer: [s!.de],
      keywords: s!.de
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.replace(/[.,!?;:„“"']/g, ""))
        .filter((w) => w.length > 3)
        .slice(0, 4),
      explanationDe: s!.de,
    }));

  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="🔁" de={task.titleDe} ar={task.titleAr} />
      {task.mandatory && (
        <div style={{ background: "var(--color-cola-soft)", border: "1px solid var(--color-cola)", borderRadius: "0.6rem", padding: "0.5rem 0.8rem", marginBottom: "0.7rem", fontWeight: 700, color: "var(--color-cola)" }}>
          ⚠️ تعويض إلزامي من اليوم {task.from} — أنجزه قبل محتوى اليوم الجديد.
        </div>
      )}
      {satzItems.length > 0 && (
        <>
          <h4 style={{ fontWeight: 800, margin: "0.4rem 0 0.5rem" }}>ترجم واسترجع</h4>
          <ExerciseSet items={satzItems} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:sentences` : undefined} onErgebnis={(ex, ok) => { const sid = satzIdAusUebung(ex.id); if (sid && (task.sentenceIds ?? []).includes(sid)) onKapselErgebnis?.(sid, ok); }} />
        </>
      )}
      {task.quiz && task.quiz.length > 0 && (
        <>
          <h4 style={{ fontWeight: 800, margin: "1rem 0 0.5rem" }}>استرجاع سريع من أيام سابقة</h4>
          <ExerciseSet items={task.quiz} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:quiz` : undefined} onErgebnis={(ex, ok) => { const sid = satzIdAusUebung(ex.id); if (sid && (task.sentenceIds ?? []).includes(sid)) onKapselErgebnis?.(sid, ok); }} />
        </>
      )}
      {(task.sentenceIds ?? []).length === 0 && !task.quiz?.length && (
        <div style={{ display: "grid", gap: "0.9rem", marginTop: "0.4rem" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--color-cola-soft), var(--color-card))",
              border: "1px solid var(--color-cola)",
              borderRadius: "0.8rem",
              padding: "1rem 1.1rem",
              lineHeight: 1.9,
              fontSize: "0.92rem",
            }}
          >
            <div style={{ fontSize: "1.1rem", fontWeight: 900, marginBottom: "0.4rem", color: "var(--color-cola)" }}>
              👋 أهلاً بك في الحصة الأولى — الطريق إلى B2 يبدأ بخطوة واحدة
            </div>
            <p style={{ margin: 0 }}>
              اليوم لا يوجد «ماضٍ» لديك لنسترجعه — لا اختبار، لا ترجمة، لا ضغط. سنبدأ معاً من الصفر: حروف الأبجدية،
              مخارج صوت <strong>ch</strong> بنوعيها (<em>ich-Laut</em> بعد e/i و<em>ach-Laut</em> بعد a/o/u)، ثم كلمات التحية والتعارف الأولى في المحطة التالية.
            </p>
            <p style={{ margin: "0.6rem 0 0", fontSize: "0.88rem", color: "var(--color-ink2)" }}>
              🧠 قاعدةُ اليوم النفسية: <em>الاسترجاع قبل الجديد</em> — ولكن عندما لا يوجد «قديم» فالواجبُ هو الاستقبال، لا الاختبار.
            </p>
          </div>
          <div style={{ background: "var(--color-paper2)", border: "1px solid var(--color-line)", borderRadius: "0.7rem", padding: "0.9rem 1rem" }}>
            <strong>🔤 الأبجدية الألمانية في 90 ثانية:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem", direction: "ltr", fontFamily: "var(--font-de)" }}>
              {["A a","B b","C c","D d","E e","F f","G g","H h","I i","J j","K k","L l","M m","N n","O o","P p","Q q","R r","S s","T t","U u","V v","W w","X x","Y y","Z z","Ä ä","Ö ö","Ü ü","ß"].map((ch) => (
                <span key={ch} className="chip" style={{ minWidth: "46px", textAlign: "center", fontWeight: 700, fontSize: "0.85rem" }}>{ch}</span>
              ))}
            </div>
            <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", marginTop: "0.6rem", lineHeight: 1.8 }}>
              • <strong>W</strong> تنطق «ف» (Wasser = فاسر) · <strong>V</strong> غالباً «ف» أو «ف» ناعمة · <strong>Z</strong> «تس» (Zeit = تسايت) · <strong>S</strong> قبل حرف علة = «ز» (sehen = زين) · <strong>R</strong> خفيفة من الحلق · <strong>ß</strong> صوت «س» طويل.
            </div>
          </div>
          <div
            style={{
              background: "rgb(34 197 94 / 0.10)",
              border: "1px solid #22c55e",
              borderRadius: "0.8rem",
              padding: "0.7rem 1rem",
              fontSize: "0.9rem",
              lineHeight: 1.9,
            }}
          >
            👆 أكمل مهمّة اليوم، ثم سلّمها بزرّ «سلّم المهمة» بالأسفل — ومن الغد يبدأ كلّ يوم بالاسترجاع قبل الجديد.
          </div>
        </div>
      )}
      <BrueckenSRS srs={srs} onSrs={onSrs} onPoints={onPoints} />
      <CanDoList level={level} full={isPhaseEnd} />
    </section>
  );
}

function seedFrom(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h) + 1;
}

function CanDoList({ level, full }: { level: "A0" | "A1" | "A2" | "B1" | "B2"; full?: boolean }) {
  const items = candoMap[level] ?? [];
  const toggleCanDoNow = (id: string) => {
    const progress = loadProgress();
    const canDo = { ...progress.canDo };
    if (canDo[id]) delete canDo[id];
    else canDo[id] = true;
    saveProgress({ ...progress, canDo });
  };
  return (
    <div style={{ marginTop: "1.2rem" }}>
      <h4 style={{ fontWeight: 800, margin: "0.4rem 0 0.5rem" }}>
        ✅ أستطيع أن… {full ? "— تقرير نهاية المرحلة (القائمة الكاملة)" : "(علّم ما أتقنته)"}
      </h4>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        {(full ? items : items.slice(0, 4)).map((c) => (
          <label
            key={c.id}
            aria-label={`${c.de} — ${c.ar}`}
            style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", cursor: "pointer", border: "1px solid var(--color-line)", borderRadius: "0.6rem", padding: "0.5rem 0.7rem" }}
          >
            <input type="checkbox" onChange={() => toggleCanDoNow(c.id)} style={{ marginTop: "0.25rem" }} />
            <span>
              <De>{c.de}</De>
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{c.ar}</div>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── فحص ختامي ──────────────────────────────────────────────────────────
function CheckTask({ task, onPoints, persistKey }: { task: DayTask; onPoints: (p: number, m: number) => void; persistKey?: string }) {
  return (
    <section className="card fadein dirb-ex" style={{ padding: "1.2rem" }}>
      <Head icon="✅" de={task.titleDe} ar={task.titleAr} />
      {task.verifyFor ? (
        <div data-testid="verify-banner" style={{ background: "var(--color-a1-soft)", border: "1px solid var(--color-a1)", borderRadius: "0.6rem", padding: "0.5rem 0.8rem", marginBottom: "0.7rem", fontWeight: 700, color: "var(--color-a1)", lineHeight: 1.9 }}>
          🎯 تحقق استقلال — مهمة جديدة (مستحقة منذ اليوم <span className="rtl-num">{task.from}</span>).
          النجاح هنا هو الدليل على الاستقلال، لا درجة التدريب.
        </div>
      ) : (
        task.mandatory && (
          <div style={{ background: "var(--color-cola-soft)", border: "1px solid var(--color-cola)", borderRadius: "0.6rem", padding: "0.5rem 0.8rem", marginBottom: "0.7rem", fontWeight: 700, color: "var(--color-cola)" }}>
            ⚠️ تعويض إلزامي من اليوم {task.from}
          </div>
        )
      )}
      <p style={{ color: "var(--color-ink2)", marginBottom: "0.7rem" }}>عتبة النجاح 80% — الفاشل يُعاد ويُرحَّل إن لزم.</p>
      <ExerciseSet items={task.quiz ?? []} onPoints={onPoints} storageKey={persistKey ? `${persistKey}:quiz` : undefined} />
    </section>
  );
}

// ── مساعدات ─────────────────────────────────────────────────────────────
function Head({ icon, de, ar }: { icon: string; de: string; ar: string }) {
  return (
    <>
      <h3 style={{ fontWeight: 800, marginBottom: "0.2rem" }}>
        {icon} <De>{de}</De>
      </h3>
      <div style={{ color: "var(--color-ink2)", marginBottom: "0.8rem" }}>{ar}</div>
    </>
  );
}

function Empty({ title, aktion }: { title: string; aktion?: string }) {
  return (
    <div className="card" style={{ padding: "1.2rem" }} data-testid="empty-meldung">
      <strong>{title}</strong>
      {aktion && <div style={{ color: "var(--color-ink2)", marginTop: "0.35rem" }}>{aktion}</div>}
    </div>
  );
}

/** R138/P-12 + R140: Anzeige für Partner/Diskussion, Kontaktgespräch, Monolog/Bild, Briefe, Schulsim */
function PartnerTask({ task, onPoints }: { task: DayTask; onPoints: (p: number, m: number) => void; voiceName?: string; rate?: number; persistKey?: string }) {
  const partner = partnerKarten.find((p) => p.id === task.partnerId);
  const kontakt = kontaktKarten.find((k) => k.id === task.kontaktId);
  const mono = muendlich.find((m) => m.id === (task.muendlichId ?? task.monologId));
  const karte = partner || kontakt || mono;
  const [done, setDone] = useState(false);
  const isKontakt = !!kontakt;
  const isMono = !!mono && mono.teil === 2;
  if (!karte) {
    return (
      <section className="card fadein" style={{ padding: "1.2rem" }}>
        <Head icon="🗣️" de={task.titleDe} ar={task.titleAr} />
        <p style={{ color: "var(--color-ink2)" }}>تدرّب على المهمة في كراستك أو مع شريك ثم سجّل إنجازك.</p>
        <button className="btn btn-primary" disabled={done} onClick={() => { setDone(true); onPoints(1,1); }}>{done ? "✓ أنجزت" : "سجّل الإنجاز"}</button>
      </section>
    );
  }
  const icon = isMono ? "🎙️" : isKontakt ? "💬" : "🗣️";
  const labelDe = isMono ? "Monolog / Bildbeschreibung" : isKontakt ? "Kontaktgespräch" : "Partner-Diskussion";
  const stuetz = (karte.stuetzen ?? []) as string[];
  const kriterien = (karte.kriterien ?? []) as { de: string; ar: string }[];
  const auftragDe = (karte as { auftrag_de?: string }).auftrag_de ?? (partner ? karte.situationDe : "");
  const auftragAr = (karte as { auftrag_ar?: string }).auftrag_ar ?? (partner ? karte.situationAr : "");
  const zeit = (karte as { zeit_s?: number }).zeit_s ?? 120;
  return (
    <section className="card fadein" style={{ padding: "1.2rem" }}>
      <Head icon={icon} de={`${labelDe}: ${(karte as { titel_de?: string }).titel_de ?? task.titleDe}`} ar={(karte as { titel_ar?: string }).titel_ar ?? task.titleAr} />
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
        <span className="chip">⏱️ {Math.round(zeit/60)} min</span>
        {isKontakt ? <span className="chip">Teil 1</span> : isMono ? <span className="chip">Teil 2</span> : <span className="chip">Teil 3</span>}
      </div>
      <div style={{ background: "var(--color-paper2)", borderRadius: "0.7rem", padding: "0.9rem 1rem", marginBottom: "0.7rem" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.3rem" }}>المهمة / الموقف:</div>
        {auftragDe && <p style={{ margin: 0 }}><De>{auftragDe}</De></p>}
        {partner?.situationDe && !isKontakt && !isMono && (
          <>
            <p style={{ margin: 0 }}><De>{partner.situationDe}</De></p>
            {partner.vorschlagA && partner.vorschlagB && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.5rem" }}>
                <div style={{ background: "var(--color-a1)", borderRadius: "0.5rem", padding: "0.5rem", color: "#fff" }}>
                  <div style={{ fontSize: "0.72rem" }}>Vorschlag A</div>
                  <strong><De>{partner.vorschlagA}</De></strong>
                </div>
                <div style={{ background: "var(--color-b1)", borderRadius: "0.5rem", padding: "0.5rem", color: "#fff" }}>
                  <div style={{ fontSize: "0.72rem" }}>Vorschlag B</div>
                  <strong><De>{partner.vorschlagB}</De></strong>
                </div>
              </div>
            )}
          </>
        )}
        {auftragAr && <p style={{ margin: "0.4rem 0 0", color: "var(--color-ink2)" }} dir="rtl">{auftragAr}</p>}
      </div>
      {stuetz.length > 0 && (
        <div style={{ background: "var(--color-gold-soft)", borderRadius: "0.5rem", padding: "0.5rem 0.8rem", marginBottom: "0.6rem", fontSize: "0.85rem" }}>
          <strong>💡 Redemittel / Stützen:</strong> <De>{stuetz.join(" · ")}</De>
        </div>
      )}
      {partner?.redemittel && (
        <div style={{ background: "var(--color-gold-soft)", borderRadius: "0.5rem", padding: "0.5rem 0.8rem", marginBottom: "0.6rem", fontSize: "0.85rem" }}>
          <strong>💡 Redemittel:</strong> <De>{partner.redemittel.join(" · ")}</De>
        </div>
      )}
      {partner?.tippAr && <p style={{ color: "var(--color-ink2)", fontSize: "0.85rem" }}>💡 {partner.tippAr}</p>}
      {kriterien.length > 0 && (
        <div style={{ marginTop: "0.4rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>📋 معايير التقييم:</div>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--color-ink2)" }}>
            {kriterien.map((kr, i) => <li key={i}>{kr.ar} <span style={{ opacity: 0.7 }}>(<De>{kr.de}</De>)</span></li>)}
          </ul>
        </div>
      )}
      <button
        className="btn btn-primary"
        style={{ marginTop: "0.8rem" }}
        disabled={done}
        onClick={() => { setDone(true); onPoints(1,1); }}
      >{done ? "✓ سجّلت التدريب" : "سجّل: أتممت التدريب"}</button>
    </section>
  );
}

export function useVoicesReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    warmVoices(() => setReady(true));
  }, []);
  return { ready, voices: germanVoices() };
}
