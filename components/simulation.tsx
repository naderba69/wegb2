"use client";
/**
 * 🎓 محاكاة Goethe-Zertifikat B2 (E1/R171) — أربع وحدات موقوتة بصيغة الامتحان الرسمي،
 * بنودها من بنوك المشروع حتميًا بالبذرة (lib/simulation.ts).
 * القراءة والاستماع تُصحَّحان آليًا؛ الكتابة والتحدّث بتقييم ذاتي بشبكة معلنة.
 * محاكاة تدريبية صادقة الاسم: ليست امتحانًا رسميًا ولا توقّع نتيجة.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import {
  getText, getDialogue, getWriting, dialogAudioSrc, dialogAudioIstKi,
  muendlich, kontaktKarten,
} from "@/lib/content";
import { gemischteOptionen } from "@/lib/optionen";
import {
  SIM_FORM, baueSimulation, antwortRichtig, punkteAusAnteil, modulBestanden,
  simulationBestanden, rubrikPunkte, RUBRIK_LABELS, woerterZaehlen, schreibenZuKurz,
  schreibenPunkte,
} from "@/lib/simulation";

type Phase = "start" | "lesen" | "hoeren" | "schreiben" | "sprechen" | "ende";
const PHASEN_FOLGE: Phase[] = ["lesen", "hoeren", "schreiben", "sprechen", "ende"];
const MODUL_TITEL: Record<string, string> = {
  lesen: "📖 القراءة (Lesen)", hoeren: "🎧 الاستماع (Hören)",
  schreiben: "✍️ الكتابة (Schreiben)", sprechen: "🗣️ التحدّث (Sprechen)",
};
const SCHREIB_KRITERIEN = ["إيفاء المهمة والمحتوى", "المفردات", "البنى والقواعد", "التماسك والربط"];
const SPRECH_KRITERIEN = ["إيفاء المهمة", "المفردات", "البنى والقواعد", "الطلاقة والنطق (تقديرك الذاتي)"];

const fmtZeit = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Rubrik({ kriterien, wert, setzen }: { kriterien: string[]; wert: number[]; setzen: (w: number[]) => void }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.6rem" }}>
      {kriterien.map((k, i) => (
        <label key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", fontSize: "0.92rem" }}>
          <span>{k}</span>
          <select
            className="field"
            style={{ maxWidth: "180px" }}
            value={wert[i]}
            onChange={(e) => { const w = [...wert]; w[i] = Number(e.target.value); setzen(w); }}
          >
            {RUBRIK_LABELS.map((l, s) => (<option key={l} value={s}>{l}</option>))}
          </select>
        </label>
      ))}
    </div>
  );
}

export default function Simulation() {
  const { progress, update } = useProgress();
  const [phase, setPhase] = useState<Phase>("start");
  const [seed, setSeed] = useState(() => 20261016);
  const plan = useMemo(() => baueSimulation(seed), [seed]);
  const [antLesen, setAntLesen] = useState<Record<string, string>>({});
  const [antHoeren, setAntHoeren] = useState<Record<string, string>>({});
  const [hoerSpiele, setHoerSpiele] = useState<Record<string, number>>({});
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [rubSchreiben, setRubSchreiben] = useState<number[]>([2, 2, 2, 2]);
  const [rubSprechen, setRubSprechen] = useState<number[]>([2, 2, 2, 2]);
  const [rest, setRest] = useState(0);
  const [vorbereitungFertig, setVorbereitungFertig] = useState(false);
  const gespeichert = useRef(false);

  const weiter = () => {
    const i = PHASEN_FOLGE.indexOf(phase as Phase);
    if (i >= 0 && i < PHASEN_FOLGE.length - 1) setPhase(PHASEN_FOLGE[i + 1]);
  };
  const weiterRef = useRef(weiter);
  weiterRef.current = weiter;

  // مؤقّت الوحدة: عند دخول طور موقوت يُضبط، وعند الصفر ينتقل تلقائيًا
  useEffect(() => {
    const dauer: Partial<Record<Phase, number>> = {
      lesen: SIM_FORM.lesenMinuten * 60,
      hoeren: SIM_FORM.hoerenMinuten * 60,
      schreiben: SIM_FORM.schreibenMinuten * 60,
      sprechen: SIM_FORM.sprechenVorbereitungMinuten * 60,
    };
    if (phase === "sprechen" && vorbereitungFertig) return;
    const d = dauer[phase];
    if (!d) return;
    setRest(d);
    const iv = setInterval(() => {
      setRest((r) => {
        if (r <= 1) {
          clearInterval(iv);
          if (phase === "sprechen") setVorbereitungFertig(true);
          else weiterRef.current();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, vorbereitungFertig]);

  // النتيجة والحفظ مرة واحدة
  const ergebnis = useMemo(() => {
    let rL = 0;
    for (const g of plan.lesen) {
      const t = getText(g.textId);
      for (const fi of g.fragen) {
        const q = t?.questions[fi];
        if (q && antwortRichtig(q, antLesen[`${g.textId}:${fi}`] ?? "")) rL++;
      }
    }
    let rH = 0;
    for (const g of plan.hoeren) {
      const d = getDialogue(g.dialogId);
      for (const fi of g.fragen) {
        const q = d?.questions[fi];
        if (q && antwortRichtig(q, antHoeren[`${g.dialogId}:${fi}`] ?? "")) rH++;
      }
    }
    const w1 = woerterZaehlen(text1), w2 = woerterZaehlen(text2);
    const schreiben = schreibenPunkte(rubrikPunkte(rubSchreiben), schreibenZuKurz(w1, 150), schreibenZuKurz(w2, 100));
    return {
      lesen: punkteAusAnteil(rL / SIM_FORM.lesenZiel),
      hoeren: punkteAusAnteil(rH / SIM_FORM.hoerenZiel),
      schreiben,
      sprechen: rubrikPunkte(rubSprechen),
    };
  }, [plan, antLesen, antHoeren, text1, text2, rubSchreiben, rubSprechen]);

  useEffect(() => {
    if (phase !== "ende" || gespeichert.current) return;
    gespeichert.current = true;
    const bestanden = simulationBestanden(ergebnis);
    update((p) => ({
      ...p,
      simulationen: [
        ...(p.simulationen ?? []),
        { datum: new Date().toISOString().slice(0, 10), seed, punkte: ergebnis, bestanden },
      ].slice(-30),
    }));
  }, [phase, ergebnis, seed, update]);

  const neuStarten = () => {
    gespeichert.current = false;
    setSeed(Math.floor(Math.random() * 1_000_000_000));
    setAntLesen({}); setAntHoeren({}); setHoerSpiele({});
    setText1(""); setText2("");
    setRubSchreiben([2, 2, 2, 2]); setRubSprechen([2, 2, 2, 2]);
    setVorbereitungFertig(false);
    setPhase("start");
  };

  const fragenBlock = (
    fragen: { promptDe?: string; promptAr?: string; type?: string; options?: string[]; id?: string }[],
    indizes: number[],
    werte: Record<string, string>,
    setzen: (k: string, v: string) => void,
    schluesselBasis: string,
  ) => indizes.map((fi) => {
    const q = fragen[fi];
    if (!q) return null;
    const key = `${schluesselBasis}:${fi}`;
    const optionen = q.type === "mc" && q.options ? gemischteOptionen(q.options, q.id ?? key) : q.options;
    return (
      <fieldset key={key} style={{ border: "1px solid var(--color-line)", borderRadius: "10px", padding: "0.6rem 0.8rem", marginTop: "0.5rem" }}>
        <legend className="de" style={{ fontSize: "0.95rem", padding: "0 0.3rem" }}>{fi + 1}. {q.promptDe}</legend>
        {q.type === "fill" ? (
          <input className="field" dir="ltr" value={werte[key] ?? ""} onChange={(e) => setzen(key, e.target.value)} placeholder="…" />
        ) : (
          (optionen ?? ["richtig", "falsch"]).map((opt) => (
            <label key={opt} style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.25rem 0", cursor: "pointer" }}>
              <input type="radio" name={key} checked={werte[key] === opt} onChange={() => setzen(key, opt)} />
              <span className="de">{opt}</span>
            </label>
          ))
        )}
      </fieldset>
    );
  });

  const kopf = (titel: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
      <h3 style={{ margin: 0 }}>{titel}</h3>
      {phase !== "ende" && phase !== "start" && (
        <span className="rtl-num" style={{ fontWeight: 800, color: rest <= 60 ? "var(--color-cola)" : undefined }}>
          ⏱ {fmtZeit(rest)}
        </span>
      )}
    </div>
  );

  if (phase === "start") {
    const historik = progress.simulationen ?? [];
    return (
      <div data-testid="sim-start">
        <p style={{ lineHeight: 1.9 }}>
          محاكاة كاملة بصيغة <strong>Goethe-Zertifikat B2</strong> الرسمية من بنوك التطبيق: أربع وحدات موقوتة،
          كلّ وحدة من 100 نقطة ونجاحها عند 60، و<strong>لا تعويض بين الوحدات</strong>. القراءة والاستماع تُصحَّحان آليًا؛
          الكتابة والتحدّث تُقيّمهما أنت بشبكة معايير معلنة (والتصحيح الذكي الاختياري في الإعدادات استشاريّ خارج النقاط).
        </p>
        <ul style={{ lineHeight: 2, paddingInlineStart: "1.2rem" }}>
          <li>📖 القراءة: {SIM_FORM.lesenZiel} بندًا في {SIM_FORM.lesenMinuten} دقيقة</li>
          <li>🎧 الاستماع: {SIM_FORM.hoerenZiel} بندًا في {SIM_FORM.hoerenMinuten} دقيقة — أجزاء تُسمَع مرة واحدة كما في الامتحان</li>
          <li>✍️ الكتابة: نصّان (منتدى ≈150 كلمة + رسالة ≈100) في {SIM_FORM.schreibenMinuten} دقيقة — دون نصف الهدف = الجزء غير مُنجَز</li>
          <li>🗣️ التحدّث: {SIM_FORM.sprechenVorbereitungMinuten} دقيقة تحضير ثم عرض ونقاش ({SIM_FORM.sprechenMinuten} دقيقة)</li>
        </ul>
        <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
          ⚠️ محاكاة تدريبية من موادّ التطبيق — ليست امتحانًا رسميًا ولا توقّعًا لنتيجتك؛ غايتها قياس جاهزيتك بصدق.
        </p>
        <button type="button" className="btn btn-primary" data-testid="sim-starten" style={{ minHeight: "48px" }} onClick={() => setPhase("lesen")}>
          ▶️ ابدأ المحاكاة
        </button>
        {historik.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 0.4rem" }}>محاكاة سابقة ({historik.length})</h4>
            {historik.slice(-5).reverse().map((h, i) => (
              <div key={i} style={{ fontSize: "0.9rem", lineHeight: 1.9 }}>
                <span className="rtl-num">{h.datum}</span> — قراءة {h.punkte.lesen} · استماع {h.punkte.hoeren} · كتابة {h.punkte.schreiben} · تحدّث {h.punkte.sprechen}{" "}
                {h.bestanden ? "✅ ناجح بكلّ الوحدات" : "— لم تكتمل عتبة 60 في الكلّ"}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === "lesen") {
    return (
      <div data-testid="sim-lesen">
        {kopf(MODUL_TITEL.lesen)}
        {plan.lesen.map((g) => {
          const t = getText(g.textId);
          if (!t) return null;
          return (
            <article key={g.textId} className="card" style={{ padding: "1rem", marginTop: "0.8rem" }}>
              <h4 className="de" style={{ margin: "0 0 0.3rem" }}>{t.titleDe}</h4>
              <div className="de" style={{ lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{t.de}</div>
              {fragenBlock(t.questions, g.fragen, antLesen, (k, v) => setAntLesen((a) => ({ ...a, [k]: v })), g.textId)}
            </article>
          );
        })}
        <button type="button" className="btn btn-primary" style={{ minHeight: "48px", marginTop: "0.8rem" }} onClick={weiter}>
          سلّم القراءة ← الاستماع
        </button>
      </div>
    );
  }

  if (phase === "hoeren") {
    return (
      <div data-testid="sim-hoeren">
        {kopf(MODUL_TITEL.hoeren)}
        {plan.hoeren.map((g) => {
          const d = getDialogue(g.dialogId);
          if (!d) return null;
          const src = dialogAudioSrc(g.dialogId);
          const limit = g.einmal ? 1 : 2;
          const gespielt = hoerSpiele[g.dialogId] ?? 0;
          return (
            <article key={g.dialogId} className="card" style={{ padding: "1rem", marginTop: "0.8rem" }}>
              <h4 className="de" style={{ margin: "0 0 0.3rem" }}>
                Teil {g.teil}: {d.titleDe} {g.einmal ? "(يُسمَع مرة واحدة)" : "(يُسمَع مرتين)"}
              </h4>
              {src && gespielt < limit ? (
                <audio
                  controls
                  src={src}
                  style={{ width: "100%" }}
                  onPlay={(e) => {
                    // يُحتسَب بدءٌ من الصفر فقط؛ الاستئناف بعد إيقافٍ مؤقّت ليس سماعًا جديدًا
                    if (e.currentTarget.currentTime < 1) {
                      setHoerSpiele((s) => ({ ...s, [g.dialogId]: (s[g.dialogId] ?? 0) + 1 }));
                    }
                  }}
                />
              ) : (
                <div style={{ fontSize: "0.9rem" }}>🔒 {src ? "انتهت مرّات السماع المسموحة لهذا الجزء." : "لا ملف صوت لهذه المادة."}</div>
              )}
              {src && dialogAudioIstKi(g.dialogId) && (
                <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.3rem" }}>
                  🤖 الصوت مولّد بالذكاء الاصطناعي (صوت واحد) — مُفصَح كما في كلّ التطبيق.
                </div>
              )}
              {fragenBlock(d.questions, g.fragen, antHoeren, (k, v) => setAntHoeren((a) => ({ ...a, [k]: v })), g.dialogId)}
            </article>
          );
        })}
        <button type="button" className="btn btn-primary" style={{ minHeight: "48px", marginTop: "0.8rem" }} onClick={weiter}>
          سلّم الاستماع ← الكتابة
        </button>
      </div>
    );
  }

  if (phase === "schreiben") {
    const a1 = getWriting(plan.schreiben.teil1);
    const a2 = getWriting(plan.schreiben.teil2);
    const w1 = woerterZaehlen(text1), w2 = woerterZaehlen(text2);
    const block = (a: typeof a1, wert: string, setzen: (v: string) => void, ziel: number, woerter: number, teil: string) => a && (
      <article className="card" style={{ padding: "1rem", marginTop: "0.8rem" }}>
        <h4 style={{ margin: "0 0 0.3rem" }}>{teil}: <span className="de">{a.titleDe}</span></h4>
        <p className="de" style={{ lineHeight: 1.8 }}>{a.taskDe}</p>
        <p style={{ lineHeight: 1.8, fontSize: "0.92rem" }}>{a.taskAr}</p>
        <textarea
          className="field de"
          dir="ltr"
          rows={9}
          value={wert}
          onChange={(e) => setzen(e.target.value)}
          placeholder="اكتب نصّك الألماني هنا…"
          style={{ width: "100%", lineHeight: 1.8 }}
        />
        <div style={{ fontSize: "0.88rem", marginTop: "0.3rem", color: schreibenZuKurz(woerter, ziel) ? "var(--color-cola)" : undefined }}>
          <span className="rtl-num">{woerter}</span> / ≈{ziel} كلمة
          {schreibenZuKurz(woerter, ziel) && " — دون النصف: يُعدّ هذا الجزء غير مُنجَز في قواعد المحاكاة"}
        </div>
        <ul style={{ fontSize: "0.88rem", lineHeight: 1.8, paddingInlineStart: "1.2rem" }}>
          {a.criteria.map((c) => (<li key={c}>{c}</li>))}
        </ul>
        <details>
          <summary style={{ cursor: "pointer", fontSize: "0.9rem" }}>📄 أظهر نصًّا نموذجيًا للمقارنة الذاتية (بعد الكتابة)</summary>
          <div className="de" style={{ lineHeight: 1.85, whiteSpace: "pre-wrap", marginTop: "0.4rem" }}>{a.sample}</div>
        </details>
      </article>
    );
    return (
      <div data-testid="sim-schreiben">
        {kopf(MODUL_TITEL.schreiben)}
        {block(a1, text1, setText1, 150, w1, "الجزء 1 — Beitrag")}
        {block(a2, text2, setText2, 100, w2, "الجزء 2 — Nachricht")}
        <h4 style={{ marginTop: "1rem" }}>قيّم نصّيك بصدق (شبكة Goethe الرباعية):</h4>
        <Rubrik kriterien={SCHREIB_KRITERIEN} wert={rubSchreiben} setzen={setRubSchreiben} />
        <button type="button" className="btn btn-primary" style={{ minHeight: "48px", marginTop: "0.8rem" }} onClick={weiter}>
          سلّم الكتابة ← التحدّث
        </button>
      </div>
    );
  }

  if (phase === "sprechen") {
    const vortrag = muendlich.find((k) => k.id === plan.sprechen.vortragId);
    const diskussion = muendlich.find((k) => k.id === plan.sprechen.diskussionId);
    const kontakt = kontaktKarten.find((k) => k.id === plan.sprechen.kontaktId);
    return (
      <div data-testid="sim-sprechen">
        {kopf(MODUL_TITEL.sprechen)}
        {!vorbereitungFertig ? (
          <>
            <p style={{ lineHeight: 1.9 }}>
              ⏳ التحضير: <span className="rtl-num">{fmtZeit(rest)}</span> — اقرأ البطاقات ودوّن نقاطك.
              حديث التعارف التمهيدي غير مُقيَّم رسميًا.
            </p>
            {kontakt && (
              <article className="card" style={{ padding: "1rem", marginTop: "0.6rem" }}>
                <h4 className="de" style={{ margin: "0 0 0.3rem" }}>Einleitung (unbewertet): {kontakt.titel_de}</h4>
                <p className="de" style={{ lineHeight: 1.8 }}>{kontakt.auftrag_de}</p>
              </article>
            )}
          </>
        ) : (
          <p style={{ lineHeight: 1.9 }}>🎙️ تحدّث الآن بصوت مسموع (سجّل نفسك إن شئت): عرضك ≈4 دقائق، ثم النقاش ≈5 دقائق.</p>
        )}
        {vortrag && (
          <article className="card" style={{ padding: "1rem", marginTop: "0.6rem" }}>
            <h4 className="de" style={{ margin: "0 0 0.3rem" }}>Teil 1 — Vortrag: {vortrag.titel_de}</h4>
            <p className="de" style={{ lineHeight: 1.8 }}>{vortrag.auftrag_de}</p>
            {(vortrag.stuetzen ?? []).length > 0 && (
              <ul className="de" style={{ lineHeight: 1.8 }}>{vortrag.stuetzen!.map((s) => (<li key={s}>{s}</li>))}</ul>
            )}
          </article>
        )}
        {diskussion && (
          <article className="card" style={{ padding: "1rem", marginTop: "0.6rem" }}>
            <h4 className="de" style={{ margin: "0 0 0.3rem" }}>Teil 2 — Diskussion: {diskussion.titel_de}</h4>
            <p className="de" style={{ lineHeight: 1.8 }}>{diskussion.auftrag_de}</p>
            {(diskussion.stuetzen ?? []).length > 0 && (
              <ul className="de" style={{ lineHeight: 1.8 }}>{diskussion.stuetzen!.map((s) => (<li key={s}>{s}</li>))}</ul>
            )}
          </article>
        )}
        {!vorbereitungFertig ? (
          <button type="button" className="btn btn-ghost" style={{ minHeight: "44px", marginTop: "0.8rem" }} onClick={() => setVorbereitungFertig(true)}>
            أنهيت التحضير مبكرًا ← ابدأ التحدّث
          </button>
        ) : (
          <>
            <h4 style={{ marginTop: "1rem" }}>قيّم أداءك بصدق:</h4>
            <Rubrik kriterien={SPRECH_KRITERIEN} wert={rubSprechen} setzen={setRubSprechen} />
            <button type="button" className="btn btn-primary" style={{ minHeight: "48px", marginTop: "0.8rem" }} onClick={weiter}>
              إنهاء المحاكاة ← النتيجة
            </button>
          </>
        )}
      </div>
    );
  }

  // ende
  const bestanden = simulationBestanden(ergebnis);
  const zeile = (name: string, p: number) => (
    <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: "1px solid var(--color-line)" }}>
      <span>{name}</span>
      <span><strong className="rtl-num">{p}</strong>/100 {modulBestanden(p) ? "✅" : "❌ دون 60"}</span>
    </div>
  );
  return (
    <div data-testid="sim-ergebnis">
      <h3 style={{ marginTop: 0 }}>{bestanden ? "🏆 ناجح في كلّ الوحدات" : "📋 لم تكتمل عتبات كلّ الوحدات"}</h3>
      {zeile("📖 القراءة", ergebnis.lesen)}
      {zeile("🎧 الاستماع", ergebnis.hoeren)}
      {zeile("✍️ الكتابة (تقييم ذاتي بالشبكة)", ergebnis.schreiben)}
      {zeile("🗣️ التحدّث (تقييم ذاتي بالشبكة)", ergebnis.sprechen)}
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.8, marginTop: "0.7rem" }}>
        الحكم بصيغة Goethe: كلّ وحدة تحتاج 60 على الأقلّ ولا تعويض بين الوحدات.
        هذه محاكاة من موادّ التطبيق لتقدير جاهزيتك — ليست نتيجة امتحان رسمي.
        حُفظت المحاولة في سجلّك أدناه (شاشة البدء).
      </p>
      <button type="button" className="btn btn-primary" style={{ minHeight: "48px" }} onClick={neuStarten}>
        🔁 محاكاة جديدة بموادّ أخرى
      </button>
    </div>
  );
}
