"use client";
/**
 * 🎓 محاكاة الامتحانات (E1/R171 + E2/R172) — صيغ Goethe B2/B1 وtelc B2 وDTZ
 * بأزمنة وعتبات رسمية موثّقة، وبنود من بنوك المشروع حتميًا بالبذرة (lib/simulation.ts).
 * القراءة والاستماع والبنى تُصحَّح آليًا؛ الكتابة والتحدّث بتقييم ذاتي بشبكة معلنة.
 * محاكاة تدريبية صادقة الاسم: ليست امتحانًا رسميًا ولا توقّع نتيجة.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import {
  getText, getDialogue, getWriting, dialogAudioSrc, dialogAudioIstKi,
  muendlich, kontaktKarten, luecken,
} from "@/lib/content";
import { gemischteOptionen } from "@/lib/optionen";
import {
  SIM_FORMATE, formatById, baueSimulation, antwortRichtig, rubrikPunkte, RUBRIK_LABELS,
  woerterZaehlen, schreibenZuKurz, bewerteSimulation,
  type SimFormatId,
} from "@/lib/simulation";

type Phase = "start" | "lesen" | "sprachbausteine" | "hoeren" | "schreiben" | "sprechen" | "ende";
const MODUL_TITEL: Record<string, string> = {
  lesen: "📖 القراءة (Lesen)",
  sprachbausteine: "🧩 البنى اللغوية (Sprachbausteine)",
  hoeren: "🎧 الاستماع (Hören)",
  schreiben: "✍️ الكتابة (Schreiben)",
  sprechen: "🗣️ التحدّث (Sprechen)",
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
  const [format, setFormat] = useState<SimFormatId>("goethe-b2");
  const [phase, setPhase] = useState<Phase>("start");
  const [seed, setSeed] = useState(() => 20261016);
  const plan = useMemo(() => baueSimulation(seed, format), [seed, format]);
  const [antLesen, setAntLesen] = useState<Record<string, string>>({});
  const [antSprach, setAntSprach] = useState<Record<string, string>>({});
  const [antHoeren, setAntHoeren] = useState<Record<string, string>>({});
  const [hoerSpiele, setHoerSpiele] = useState<Record<string, number>>({});
  const [texte, setTexte] = useState<string[]>(["", ""]);
  const [rubSchreiben, setRubSchreiben] = useState<number[]>([2, 2, 2, 2]);
  const [rubSprechen, setRubSprechen] = useState<number[]>([2, 2, 2, 2]);
  const [rest, setRest] = useState(0);
  const [vorbereitungFertig, setVorbereitungFertig] = useState(false);
  const gespeichert = useRef(false);

  const folge = useMemo<Phase[]>(() => [
    "lesen",
    ...(plan.sprachbausteine.length ? ["sprachbausteine" as Phase] : []),
    "hoeren", "schreiben", "sprechen", "ende",
  ], [plan]);

  const weiter = () => {
    const i = folge.indexOf(phase);
    if (i >= 0 && i < folge.length - 1) setPhase(folge[i + 1]);
  };
  const weiterRef = useRef(weiter);
  weiterRef.current = weiter;

  useEffect(() => {
    const dauer: Partial<Record<Phase, number>> = {
      lesen: plan.zeiten.lesen * 60,
      sprachbausteine: plan.zeiten.sprachbausteine * 60,
      hoeren: plan.zeiten.hoeren * 60,
      schreiben: plan.zeiten.schreiben * 60,
      sprechen: plan.zeiten.vorbereitung * 60,
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
  }, [phase, vorbereitungFertig, plan]);

  const bewertung = useMemo(() => {
    let rL = 0;
    for (const g of plan.lesen) {
      const t = getText(g.textId);
      for (const fi of g.fragen) {
        const q = t?.questions[fi];
        if (q && antwortRichtig(q, antLesen[`${g.textId}:${fi}`] ?? "")) rL++;
      }
    }
    let rS = 0, nS = 0;
    for (const g of plan.sprachbausteine) {
      const lk = luecken.find((x) => x.id === g.lueckenId);
      for (const gi of g.gaps) {
        nS++;
        const gap = lk?.gaps[gi];
        if (gap && antwortRichtig({ answer: gap.answer }, antSprach[`${g.lueckenId}:${gi}`] ?? "")) rS++;
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
    const aufgaben = plan.schreiben.teil2 ? [plan.schreiben.teil1, plan.schreiben.teil2] : [plan.schreiben.teil1];
    const ziele = aufgaben.map((_, i) => (format.startsWith("goethe") && i === 1 ? 100 : 150));
    const zuKurz = aufgaben.some((_, i) => schreibenZuKurz(woerterZaehlen(texte[i] ?? ""), ziele[i]));
    return bewerteSimulation(format, {
      lesenAnteil: rL / Math.max(plan.zielLesen, 1),
      sprachAnteil: nS ? rS / nS : 0,
      hoerenAnteil: rH / Math.max(plan.zielHoeren, 1),
      schreibenRubrik: rubrikPunkte(rubSchreiben),
      schreibenZuKurz: zuKurz,
      sprechenRubrik: rubrikPunkte(rubSprechen),
    });
  }, [plan, format, antLesen, antSprach, antHoeren, texte, rubSchreiben, rubSprechen]);

  useEffect(() => {
    if (phase !== "ende" || gespeichert.current) return;
    gespeichert.current = true;
    update((p) => ({
      ...p,
      simulationen: [
        ...(p.simulationen ?? []),
        { datum: new Date().toISOString().slice(0, 10), seed, format, punkte: bewertung.prozent, bestanden: bewertung.bestanden },
      ].slice(-30),
    }));
  }, [phase, bewertung, seed, format, update]);

  const neuStarten = () => {
    gespeichert.current = false;
    setSeed(Math.floor(Math.random() * 1_000_000_000));
    setAntLesen({}); setAntSprach({}); setAntHoeren({}); setHoerSpiele({});
    setTexte(["", ""]);
    setRubSchreiben([2, 2, 2, 2]); setRubSprechen([2, 2, 2, 2]);
    setVorbereitungFertig(false);
    setPhase("start");
  };

  const fragenBlock = (
    fragen: { promptDe?: string; type?: string; options?: string[]; id?: string }[],
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
    const f = formatById(format);
    return (
      <div data-testid="sim-start">
        <p style={{ lineHeight: 1.9 }}>
          محاكاة كاملة بصيغة رسمية من بنوك التطبيق: وحدات موقوتة وبنود حقيقية من مستواك.
          القراءة والاستماع والبنى اللغوية تُصحَّح آليًا؛ الكتابة والتحدّث تُقيّمهما أنت بشبكة معايير معلنة
          (والتصحيح الذكي الاختياري في الإعدادات استشاريّ خارج النقاط).
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }} role="radiogroup" aria-label="صيغة الامتحان">
          {SIM_FORMATE.map((fm) => (
            <button
              key={fm.id}
              type="button"
              role="radio"
              aria-checked={format === fm.id}
              data-testid={`sim-format-${fm.id}`}
              className="btn btn-ghost"
              style={{
                minHeight: "52px", textAlign: "start", justifyContent: "flex-start",
                background: format === fm.id ? "rgb(34 197 94 / 0.14)" : "transparent",
                borderColor: format === fm.id ? "#22c55e" : undefined,
              }}
              onClick={() => setFormat(fm.id)}
            >
              <span><strong>{fm.titelAr}</strong> — <span style={{ fontSize: "0.85rem" }}>{fm.quelleAr}</span></span>
            </button>
          ))}
        </div>
        <ul style={{ lineHeight: 2, paddingInlineStart: "1.2rem", marginTop: "0.8rem" }}>
          <li>📖 القراءة: {plan.zielLesen} بندًا في {plan.zeiten.lesen} دقيقة</li>
          {plan.sprachbausteine.length > 0 && (
            <li>🧩 البنى اللغوية: نصّا فجوات في {plan.zeiten.sprachbausteine} دقيقة (في الامتحان ضمن كتلة القراءة 90 دقيقة تقسّمها بنفسك)</li>
          )}
          <li>🎧 الاستماع: {plan.zielHoeren} بندًا في {plan.zeiten.hoeren} دقيقة{format.startsWith("goethe") ? " — أجزاء بسماعٍ واحد وأخرى بسماعين" : " — كلّ المواد بسماعٍ واحد كما في telc/DTZ"}</li>
          <li>✍️ الكتابة: {plan.schreiben.teil2 ? "نصّان (‏≈150 + ‏≈100 كلمة)" : "نصّ واحد (‏≥150 كلمة)"} في {plan.zeiten.schreiben} دقيقة — دون نصف الهدف = الجزء غير مُنجَز</li>
          <li>🗣️ التحدّث: {plan.zeiten.vorbereitung} دقيقة تحضير ثم عرض ونقاش ({plan.zeiten.sprechen} دقيقة)</li>
        </ul>
        <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
          ⚠️ محاكاة تدريبية من موادّ التطبيق — ليست امتحانًا رسميًا ولا توقّعًا لنتيجتك؛ غايتها قياس جاهزيتك بصدق.
          الصيغة المختارة: {f.titelAr}.
        </p>
        <button type="button" className="btn btn-primary" data-testid="sim-starten" style={{ minHeight: "48px" }} onClick={() => setPhase("lesen")}>
          ▶️ ابدأ المحاكاة
        </button>
        {historik.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 0.4rem" }}>محاكاة سابقة ({historik.length})</h4>
            {historik.slice(-5).reverse().map((h, i) => (
              <div key={i} style={{ fontSize: "0.9rem", lineHeight: 1.9 }}>
                <span className="rtl-num">{h.datum}</span> · {formatById((h.format as SimFormatId) ?? "goethe-b2").titelAr} — قراءة {h.punkte.lesen}% · استماع {h.punkte.hoeren}% · كتابة {h.punkte.schreiben}% · تحدّث {h.punkte.sprechen}%{" "}
                {h.bestanden ? "✅ مستوفية بصيغتها" : "— دون عتبة صيغتها"}
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
          تسليم ← التالي
        </button>
      </div>
    );
  }

  if (phase === "sprachbausteine") {
    return (
      <div data-testid="sim-sprachbausteine">
        {kopf(MODUL_TITEL.sprachbausteine)}
        <p style={{ lineHeight: 1.9, fontSize: "0.92rem" }}>أكمل كلّ فجوة بالكلمة الألمانية الصحيحة (قواعد/مفردات من متن النصّ).</p>
        {plan.sprachbausteine.map((g) => {
          const lk = luecken.find((x) => x.id === g.lueckenId);
          if (!lk) return null;
          return (
            <article key={g.lueckenId} className="card" style={{ padding: "1rem", marginTop: "0.8rem" }}>
              <h4 className="de" style={{ margin: "0 0 0.4rem" }}>{lk.titleDe}</h4>
              {g.gaps.map((gi) => {
                const gap = lk.gaps[gi];
                const key = `${g.lueckenId}:${gi}`;
                return (
                  <div key={key} style={{ marginTop: "0.55rem" }}>
                    <div className="de" style={{ lineHeight: 1.8 }}>{gi + 1}. {gap.blanked}</div>
                    <input
                      className="field" dir="ltr" style={{ maxWidth: "320px" }}
                      value={antSprach[key] ?? ""}
                      onChange={(e) => setAntSprach((a) => ({ ...a, [key]: e.target.value }))}
                      placeholder="الكلمة الناقصة…"
                    />
                  </div>
                );
              })}
            </article>
          );
        })}
        <button type="button" className="btn btn-primary" style={{ minHeight: "48px", marginTop: "0.8rem" }} onClick={weiter}>
          تسليم ← الاستماع
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
          تسليم ← الكتابة
        </button>
      </div>
    );
  }

  if (phase === "schreiben") {
    const aufgaben = (plan.schreiben.teil2 ? [plan.schreiben.teil1, plan.schreiben.teil2] : [plan.schreiben.teil1])
      .map((id, i) => ({ id, a: getWriting(id), ziel: format.startsWith("goethe") && i === 1 ? 100 : 150, i }));
    return (
      <div data-testid="sim-schreiben">
        {kopf(MODUL_TITEL.schreiben)}
        {aufgaben.map(({ id, a, ziel, i }) => {
          if (!a) return null;
          const woerter = woerterZaehlen(texte[i] ?? "");
          return (
            <article key={id} className="card" style={{ padding: "1rem", marginTop: "0.8rem" }}>
              <h4 style={{ margin: "0 0 0.3rem" }}>{aufgaben.length > 1 ? `الجزء ${i + 1}` : "المهمّة"}: <span className="de">{a.titleDe}</span></h4>
              <p className="de" style={{ lineHeight: 1.8 }}>{a.taskDe}</p>
              <p style={{ lineHeight: 1.8, fontSize: "0.92rem" }}>{a.taskAr}</p>
              <textarea
                className="field de"
                dir="ltr"
                rows={9}
                value={texte[i] ?? ""}
                onChange={(e) => { const t = [...texte]; t[i] = e.target.value; setTexte(t); }}
                placeholder="اكتب نصّك الألماني هنا…"
                style={{ width: "100%", lineHeight: 1.8 }}
              />
              <div style={{ fontSize: "0.88rem", marginTop: "0.3rem", color: schreibenZuKurz(woerter, ziel) ? "var(--color-cola)" : undefined }}>
                <span className="rtl-num">{woerter}</span> / ≈{ziel} كلمة
                {schreibenZuKurz(woerter, ziel) && " — دون النصف: يُعدّ النصّ غير مُنجَز في قواعد المحاكاة"}
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
        })}
        <h4 style={{ marginTop: "1rem" }}>قيّم {aufgaben.length > 1 ? "نصّيك" : "نصّك"} بصدق (شبكة المعايير الرباعية):</h4>
        <Rubrik kriterien={SCHREIB_KRITERIEN} wert={rubSchreiben} setzen={setRubSchreiben} />
        <button type="button" className="btn btn-primary" style={{ minHeight: "48px", marginTop: "0.8rem" }} onClick={weiter}>
          تسليم ← التحدّث
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
              حديث التعارف التمهيدي غير مُقيَّم.
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
            <h4 className="de" style={{ margin: "0 0 0.3rem" }}>Teil 1 — Vortrag/Monolog: {vortrag.titel_de}</h4>
            <p className="de" style={{ lineHeight: 1.8 }}>{vortrag.auftrag_de}</p>
            {(vortrag.stuetzen ?? []).length > 0 && (
              <ul className="de" style={{ lineHeight: 1.8 }}>{vortrag.stuetzen!.map((s) => (<li key={s}>{s}</li>))}</ul>
            )}
          </article>
        )}
        {diskussion && (
          <article className="card" style={{ padding: "1rem", marginTop: "0.6rem" }}>
            <h4 className="de" style={{ margin: "0 0 0.3rem" }}>Teil 2 — Diskussion/Planung: {diskussion.titel_de}</h4>
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
  return (
    <div data-testid="sim-ergebnis">
      <h3 style={{ marginTop: 0 }}>{bewertung.bestanden ? "🏆 مستوفية لعتبات صيغتها" : "📋 دون عتبات صيغتها"}</h3>
      <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>{formatById(format).titelAr}</div>
      {bewertung.zeilen.map((z) => (
        <div key={z.titelAr} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: "1px solid var(--color-line)", fontWeight: z.stark ? 800 : undefined }}>
          <span>{z.titelAr}</span>
          <span><strong className="rtl-num">{z.wert}</strong>{z.ok === undefined ? "" : z.ok ? " ✅" : " ❌"}</span>
        </div>
      ))}
      <p style={{ fontSize: "0.9rem", lineHeight: 1.85, marginTop: "0.7rem" }}>{bewertung.fazitAr}</p>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
        هذه محاكاة من موادّ التطبيق لتقدير جاهزيتك — ليست نتيجة امتحان رسمي ولا توقّعًا.
        حُفظت المحاولة في سجلّك (شاشة البدء).
      </p>
      <button type="button" className="btn btn-primary" style={{ minHeight: "48px" }} onClick={neuStarten}>
        🔁 محاكاة جديدة بموادّ أخرى
      </button>
    </div>
  );
}
