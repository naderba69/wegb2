"use client";
// 🧭 مركز الحصص الذاتية — LektionsZentrum (Modul R) في جناح التعليم
// محرّكان مدمّجان (لا أدوات شاردة):
//   ① مولّد حصة 25 دقيقة حتمياً: 15 بناء (قواعد·مفردات·استماع) + 10 إنتاج حسب أخطائك
//   ② حزم السياق الحيوي: ✈️ سفر · 💼 مقابلة · 🏠 بحث عن سكن (12 جملة + حوار + نموذجان)
// كل حصة مصمّمة على منهج Tagesplan: بناء ثم إنتاج — وتغذّي خطوط الأنابيب الأربعة.
import { useEffect, useMemo, useState } from "react";
import type { Exercise, Level, Progress, KontextPaket } from "@/lib/types";
import { grammarMap, alleVokabeln, dialogues, writingTasks, pakete, sentences } from "@/lib/content";
import { levelOf, pickN, rng, clozeFromSatz } from "@/lib/plan";
import { normalize, konfidenz } from "@/lib/grader";
import { fehlerFamilien, fehlerDesMonats, schwere } from "@/lib/fehler";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny } from "@/lib/speech";
import { VertrauensBalken, AntwortDiff } from "./ui";
import { De } from "./De";

function gradeItem(ex: Exercise, resp: string): boolean {
  if (!resp.trim()) return false;
  if (ex.type === "mc") return resp === String(Array.isArray(ex.answer) ? ex.answer[0] : ex.answer);
  const n = normalize(resp);
  const answers = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
  return answers.some((a) => normalize(String(a)) === n);
}

const ART_THEMA: Record<string, string[]> = {
  artikel: ["artikel", "nomen", "adjektiv", "deklination", "genus", "أداة", "أدوات"],
  praeposition: ["praposition", "kasus", "dativ", "akkusativ", "حرف الجر", "الحالات"],
  wortstellung: ["wortstellung", "satzbau", "stellung", "neben", "ترتيب"],
  zeitform: ["praeteritum", "perfekt", "tempus", "partizip", "modal", "أزمنة"],
  konstruktion: ["neben", "konjunktion", "relativ", "passiv", "satz", "تراكيب"],
  schreibung: ["orthografie", "schreib", "hoch", "همزة", "كتابة"],
  wortschatz: ["wortschatz", "thema", "مفردات"],
  "falsche-freunde": ["falsche", "freund", "زائفة"],
  "zahlen-zeit": ["zahlen", "zahl", "zeit", "uhr", "أرقام"],
  sonst: [],
};

type BlockItem = { min: number; kat: "Grammatik" | "Wortschatz" | "Hoeren"; label: string; ex: Exercise };

type Lektion = {
  titel: string;
  stufe: Level;
  g: BlockItem[];
  w: BlockItem[];
  h: BlockItem[];
  produktion: { art: "fehler" | "schreiben"; titel: string; prompt: string; hilfe: string; ziel: number };
};

function bauLektion(p: Progress, lvl: Level, runde: number): Lektion {
  const rnd = rng(p.plan.day * 991 + runde * 41 + 7);
  const topArt = fehlerFamilien(p)[0]?.art;
  const keys = topArt ? ART_THEMA[topArt] ?? [] : [];

  // ① قواعد (5′) — تفضّل موضوعاتك الضعيفة
  const themen = Object.values(grammarMap).filter((t) => t.level === lvl);
  const geordnet = [...(themen.length ? themen : Object.values(grammarMap))].sort((a, b) => {
    const sa = keys.reduce((s, k) => s + ((a.id + a.titleAr + a.summaryAr).toLowerCase().includes(k.toLowerCase()) ? 1 : 0), 0);
    const sb = keys.reduce((s, k) => s + ((b.id + b.titleAr + b.summaryAr).toLowerCase().includes(k.toLowerCase()) ? 1 : 0), 0);
    return sb - sa;
  });
  const gThemen = pickN(geordnet.slice(0, 4), 2, rnd);
  const g: BlockItem[] = gThemen.map((t, i) => {
    const ex = pickN(t.exercises.filter((e) => e.type === "mc"), 1, rnd)[0] ?? t.exercises[0];
    return { min: 2.5, kat: "Grammatik", label: t.titleAr, ex: { ...ex, id: `l-g-${i}-${ex.id}` } };
  });

  // ② مفردات (5′) — من بنك الكلمات
  const vk = pickN(alleVokabeln.filter((k) => k.level === lvl).length >= 3 ? alleVokabeln.filter((k) => k.level === lvl) : alleVokabeln, 3, rnd);
  const w: BlockItem[] = vk.map((k, i) => {
    const distr = pickN(alleVokabeln.filter((x) => x.ar && x.ar !== k.ar), 3, rnd).map((x) => x.ar);
    return {
      min: 1.5,
      kat: "Wortschatz",
      label: "معنى بالسياق",
      ex: { id: `l-w-${i}-${k.id}`, type: "mc", promptDe: k.de, promptAr: k.exampleDe ? `مثال: ${k.exampleDe}` : "ما معنى؟", options: pickN([k.ar, ...distr], 4, rnd), answer: k.ar, explanationAr: `${k.de} = ${k.ar}` },
    };
  });

  // ③ استماع (5′) — إملاء من حوار
  const d = pickN(dialogues.filter((x) => x.dictation?.length), 1, rnd)[0];
  const zeile = d?.dictation[Math.floor(rnd() * (d.dictation.length || 1))] ?? "Ich heiße Omar.";
  const h: BlockItem[] = [{
    min: 5,
    kat: "Hoeren",
    label: d?.titleAr ?? "إملاء",
    ex: { id: "l-h-0", type: "dictation", promptDe: "اسمع واكتب:", promptAr: d?.titleAr, answer: [zeile], explanationDe: zeile },
  }];

  // ④ إنتاج (10′) — حسب أخطائك أنت
  const monat = fehlerDesMonats(p);
  const wtask = pickN(writingTasks.filter((t) => t.level === lvl).length ? writingTasks.filter((t) => t.level === lvl) : writingTasks, 1, rnd)[0];
  const produktion = monat
    ? {
        art: "fehler" as const,
        titel: "🔧 إنتاج تصحيحي — أخطر خطأ عندك حالياً",
        prompt: `أصلح ثم ابتكر: «${monat.falsch}»`,
        hilfe: `الصواب: ${monat.richtig} — ${monat.ar}\nالآن كوّن جملة جديدة من عندك تحمل هذه الصيغة الصحيحة.`,
        ziel: 8,
      }
    : {
        art: "schreiben" as const,
        titel: `✍️ إنتاج كتابي — ${wtask?.titleAr ?? "موضوع حر"}`,
        prompt: wtask?.taskAr ?? "اكتب 6 جُمل عن يومك الألماني.",
        hilfe: wtask?.taskDe ?? "",
        ziel: 25,
      };

  return { titel: `حصة اليوم ${p.plan.day} — جولة ${runde}`, stufe: lvl, g, w, h, produktion };
}

function LektionsGenerator({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [runde, setRunde] = useState(1);
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [prod, setProd] = useState("");
  const [done, setDone] = useState(false);
  const [sek, setSek] = useState(25 * 60);
  const [laeuft, setLaeuft] = useState(false);
  const level = levelOf(progress.plan.day);
  const L = useMemo(() => bauLektion(progress, level, runde), [progress, level, runde]);

  useEffect(() => {
    if (!laeuft || done) return;
    const t = setInterval(() => setSek((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [laeuft, done]);

  const alle = [...L.g, ...L.w, ...L.h];
  const beantwortet = alle.every((q) => (antworten[q.ex.id] ?? "").trim());
  const okN = alle.filter((q) => gradeItem(q.ex, antworten[q.ex.id] ?? "")).length;
  const mmss = `${String(Math.floor(sek / 60)).padStart(2, "0")}:${String(sek % 60).padStart(2, "0")}`;

  const abgeben = () => {
    setDone(true);
    setLaeuft(false);
    for (const q of alle) {
      const ok = gradeItem(q.ex, antworten[q.ex.id] ?? "");
      if (!ok) {
        const right = String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer);
        addFehlerNow({
          falsch: antworten[q.ex.id] || "(leer)",
          richtig: right,
          art: q.kat === "Wortschatz" ? "wortschatz" : q.kat === "Hoeren" ? "schreibung" : "sonst",
          ar: q.ex.explanationAr ?? q.ex.explanationDe ?? q.label,
          quelle: `Lektion ${L.titel}`,
        });
      }
    }
    update((p) => {
      let q0 = checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 8 + okN * 2 });
      for (const kat of ["Grammatik", "Wortschatz", "Hoeren"] as const) {
        const teile = alle.filter((q) => q.kat === kat);
        const okT = teile.filter((q) => gradeItem(q.ex, antworten[q.ex.id] ?? "")).length;
        if (teile.length) q0 = logK(q0, kat, okT / teile.length >= 0.6);
      }
      q0 = logK(q0, "Schreiben", prod.trim().length >= (L.produktion.ziel ?? 8));
      return checkAbzeichen({ ...q0, xp: (q0.xp ?? 0) + (prod.trim().length >= 8 ? 3 : 1) });
    });
  };

  const Block = ({ titel, min, items }: { titel: string; min: number; items: BlockItem[] }) => (
    <div className="card" style={{ padding: "0.75rem 1rem", borderInlineStart: "4px solid var(--color-a2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.35rem" }}>
        {titel} <span className="chip" style={{ fontSize: "0.7rem" }}>⏱ {min}′</span>
      </div>
      {items.map((q, i) => (
        <div key={q.ex.id} style={{ padding: "0.35rem 0", borderTop: i ? "1px dashed var(--color-line)" : "none" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>{q.label}</div>
          <div style={{ fontWeight: 700, margin: "0.2rem 0" }}>
            {q.ex.promptDe && <De>{q.ex.promptDe}</De>}
            {q.ex.promptAr && <div style={{ fontWeight: 400, fontSize: "0.82rem", color: "var(--color-ink2)" }}>{q.ex.promptAr}</div>}
          </div>
          {q.ex.options ? (
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
              {q.ex.options.map((o) => {
                const gewaehlt = antworten[q.ex.id] === o;
                const richtig = done && gradeItem(q.ex, o);
                return (
                  <button key={o} className="chip" style={{ cursor: done ? "default" : "pointer", background: richtig ? "var(--color-a1)" : gewaehlt ? "var(--color-cola)" : "white", color: richtig || gewaehlt ? "white" : undefined }} disabled={done} onClick={() => setAntworten((a) => ({ ...a, [q.ex.id]: o }))}>
                    {o}
                  </button>
                );
              })}
            </div>
          ) : (
            <input className="input" style={{ width: "100%" }} value={antworten[q.ex.id] ?? ""} disabled={done} placeholder={q.ex.type === "dictation" ? "🔊 اكتب ما سمعته…" : "اكتب…"} onChange={(e) => setAntworten((a) => ({ ...a, [q.ex.id]: e.target.value }))} />
          )}
          {q.ex.type === "dictation" && !done && (
            <button className="btn btn-ghost" style={{ padding: "0.2rem 0.7rem", marginTop: "0.3rem" }} onClick={() => speakAny(String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer))}>🔊 استمع</button>
          )}
          {done && (
            <div style={{ fontSize: "0.78rem", marginTop: "0.2rem", color: gradeItem(q.ex, antworten[q.ex.id] ?? "") ? "var(--color-a1)" : "var(--color-mid)" }}>
              {gradeItem(q.ex, antworten[q.ex.id] ?? "") ? "✅" : `❌ الصواب: ${String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer)}`}
              {!gradeItem(q.ex, antworten[q.ex.id] ?? "") && !q.ex.options && (
                <AntwortDiff gegeben={antworten[q.ex.id] ?? ""} referenz={String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer)} />
              )}
              {!q.ex.options && (
                <VertrauensBalken wert={konfidenz(antworten[q.ex.id] ?? "", String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer))} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
        <div style={{ fontWeight: 800 }}>
          🧭 {L.titel} — 25 دقيقة = 15 بناء + 10 إنتاج
          <div style={{ fontWeight: 400, fontSize: "0.78rem", color: "var(--color-ink2)" }}>المرحلة {L.stufe} · البذرة حتمية من يومك ودورتك</div>
        </div>
        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
          <span className="chip" style={{ fontWeight: 800, fontSize: "1rem", color: sek === 0 ? "var(--color-mid)" : undefined }}>⏱ {mmss}</span>
          {!done && (
            <>
              <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem" }} onClick={() => setLaeuft((l) => !l)}>{laeuft ? "⏸" : "▶️"}</button>
              <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem" }} onClick={() => { setSek(25 * 60); setLaeuft(false); }}>↺</button>
            </>
          )}
        </div>
      </div>
      <Block titel="① قواعد في الميدان" min={5} items={L.g} />
      <Block titel="② مفردات بالسياق" min={5} items={L.w} />
      <Block titel="③ استماع وإملاء" min={5} items={L.h} />
      <div className="card" style={{ padding: "0.75rem 1rem", borderInlineStart: "4px solid var(--color-gold)" }}>
        <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>④ {L.produktion.titel} <span className="chip" style={{ fontSize: "0.7rem" }}>⏱ 10′</span></div>
        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}><De>{L.produktion.prompt}</De></div>
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.3rem 0", whiteSpace: "pre-line" }}>{L.produktion.hilfe}</div>
        <textarea className="input" style={{ width: "100%", minHeight: "5rem" }} value={prod} disabled={done} placeholder="إنتاجك أنت هنا… (جملة تصحيحية أو فقرة)" onChange={(e) => setProd(e.target.value)} />
        <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>الهدف: ≥{L.produktion.ziel} حرفاً/كلمة حسب المهمة · قيّم نفسك بصدق — التقدير يدخل شبكة الكفاءات.</div>
      </div>
      {!done ? (
        <button className="btn btn-gold" disabled={!beantwortet || !prod.trim()} onClick={abgeben}>سلّم الحصة ({okN}/{alle.length} + إنتاج) ✓</button>
      ) : (
        <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-gold-soft)", fontWeight: 700 }}>
          📊 الحصة مُسلَّمة: <span className="rtl-num">{okN}</span>/<span className="rtl-num">{alle.length}</span> + إنتاج <span className="rtl-num">{prod.trim().length}</span> حرفاً — {okN === alle.length ? "بناء متقن! 🌟" : "راجع الفائت من دفتر الأخطاء."}
          <div style={{ textAlign: "end", marginTop: "0.4rem" }}>
            <button className="btn btn-primary" onClick={() => { setRunde((r) => r + 1); setAntworten({}); setProd(""); setDone(false); setSek(25 * 60); }}>🧭 حصة جديدة (بذرة مختلفة)</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaketKarte({ p }: { p: KontextPaket }) {
  const { update } = useProgress();
  const [i, setI] = useState(0);
  const [offen, setOffen] = useState(false);
  const [geuebt, setGeuebt] = useState<Record<number, boolean>>({});
  const [modelOffen, setModelOffen] = useState<number | null>(null);
  const s = p.saetze[i];

  const probe = (ok: boolean) => {
    if (geuebt[i]) return;
    setGeuebt((g) => ({ ...g, [i]: true }));
    update((p0) => logK(checkAbzeichen({ ...p0, xp: (p0.xp ?? 0) + (ok ? 2 : 1) }), "Wortschatz", ok));
    if (!ok) {
      addFehlerNow({
        falsch: `(تعثّرت في) ${s.de}`,
        richtig: s.de,
        art: "wortschatz",
        ar: `من حزمة «${p.nameAr}»: ${s.ar}`,
        quelle: `Paket: ${p.nameDe}`,
      });
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div className="card" style={{ padding: "0.85rem 1.1rem", background: "var(--color-paper)" }}>
        <div style={{ fontWeight: 900 }}>{p.emoji} {p.nameDe} — {p.nameAr}</div>
        <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.5rem" }}>{p.nutzung}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>بطاقة <span className="rtl-num">{i + 1}</span>/<span className="rtl-num">{p.saetze.length}</span> — احفظها من الذاكرة ثم اكشف:</div>
        <div style={{ fontWeight: 800, fontSize: "1.05rem", margin: "0.3rem 0" }}><De>{s.de}</De></div>
        {offen ? (
          <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)" }}>
            {s.ar}
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
              {geuebt[i] ? (
                <span className="chip" style={{ color: "var(--color-a1)", borderColor: "var(--color-a1)" }}>✓ سُجّلت</span>
              ) : (
                <>
                  <button className="btn btn-primary" style={{ flex: 1, padding: "0.3rem" }} onClick={() => probe(true)}>حفظتها ✓</button>
                  <button className="btn btn-ghost" style={{ flex: 1, padding: "0.3rem" }} onClick={() => probe(false)}>لم ترسخ 🔁</button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button className="btn btn-ghost" onClick={() => speakAny(s.de)}>🔊</button>
            <button className="btn btn-ghost" onClick={() => setOffen(true)}>👁 اكشف المعنى</button>
          </div>
        )}
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
          <button className="btn btn-ghost" style={{ padding: "0.25rem 0.7rem" }} onClick={() => { setI((x) => (x + p.saetze.length - 1) % p.saetze.length); setOffen(false); }}>←</button>
          <button className="btn btn-ghost" style={{ padding: "0.25rem 0.7rem" }} onClick={() => { setI((x) => (x + 1) % p.saetze.length); setOffen(false); }}>→</button>
        </div>
      </div>

      <div className="card" style={{ padding: "0.75rem 1rem" }}>
        <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>💬 {p.dialog.titel}</div>
        {p.dialog.lines.map((l, li) => (
          <div key={li} style={{ display: "flex", gap: "0.45rem", padding: "0.2rem 0", alignItems: "baseline", borderTop: li ? "1px dashed var(--color-line)" : "none" }}>
            <button className="btn btn-ghost" style={{ padding: "0.15rem 0.55rem" }} onClick={() => speakAny(l.de)}>🔊</button>
            <span className="chip" style={{ fontSize: "0.68rem", padding: "0.1rem 0.4rem" }}>{l.who}·{l.role}</span>
            <span style={{ flex: 1 }}>
              <De>{l.de}</De>
              <div style={{ fontWeight: 400, fontSize: "0.78rem", color: "var(--color-ink2)" }}>{l.ar}</div>
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
        {p.modelle.map((m, mi) => (
          <div key={mi} className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper)" }}>
            <button style={{ background: "none", border: 0, cursor: "pointer", padding: 0, fontWeight: 800, textAlign: "start" }} onClick={() => setModelOffen(modelOffen === mi ? null : mi)}>
              ✍️ {m.titel} {modelOffen === mi ? "▲" : "▼"}
            </button>
            {modelOffen === mi && m.zeilen.map((z, zi) => (
              <div key={zi} style={{ fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.8, whiteSpace: "pre-wrap", borderTop: zi ? "1px dashed var(--color-line)" : "none", padding: "0.15rem 0" }}>
                <De>{z}</De>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: "lektion", emoji: "🧭", name: "مولّد الحصة (25د)", unter: "15 بناء + 10 إنتاج حسب أخطائك" },
  { id: "pakete", emoji: "🧳", name: "حزم السياق", unter: "سفر · مقابلة · بحث عن سكن" },
] as const;

export function LektionsZentrum({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("lektion");
  const [pid, setPid] = useState(pakete[0].id);
  const p = pakete.find((x) => x.id === pid) ?? pakete[0];

  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-gold)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🧭 مركز الحصص الذاتية — LektionsZentrum <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul R)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        حصة مؤسَّسة تربوياً: بناء قصير ثم إنتاج يوجّهه دفتر أخطائك — وثلاث حزم سياق للسفر والمقابلة والبحث عن سكن.
      </div>
      {open && (
        <>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            {TABS.map((t) => (
              <button key={t.id} className="chip" style={{ cursor: "pointer", background: tab === t.id ? "var(--color-cola)" : "white", color: tab === t.id ? "white" : undefined }} onClick={() => setTab(t.id)} title={t.unter}>
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
          {tab === "lektion" ? (
            <LektionsGenerator progress={progress} />
          ) : (
            <>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                {pakete.map((x) => (
                  <button key={x.id} className="chip" style={{ cursor: "pointer", background: pid === x.id ? "var(--color-gold)" : "white", color: pid === x.id ? "white" : undefined }} onClick={() => setPid(x.id)}>
                    {x.emoji} {x.nameAr}
                  </button>
                ))}
              </div>
              <PaketKarte key={pid} p={p} />
            </>
          )}
        </>
      )}
    </div>
  );
}
