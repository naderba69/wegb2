"use client";
// 🔍 العمق المعجمي — TiefenLexikon (Modul P) في جناح التدريب
// أربعة أعماق في محرّك واحد (لا أدوات شاردة):
//   📖 المعنى بالسياق: الكلمة داخل جملة حقيقية من الموسوعة
//   🪞 Nuancen: الفروق الدقيقة بين المتقارب (سجل لغوي · حالة · اتجاه)
//   🔗 Verb+Präp: أفعال مع حروف جرّها الثابتة وحالاتها (20 صيغة)
//   🧩 Funktionsverbgefüge: التراكيب الخفيفة الرسمية (12 تعبيراً)
// كل خطأ ← دفتر الأخطاء بفئته · كل جولة ← شبكة الكفاءات (Wortschatz).
import { useMemo, useState } from "react";
import type { Level, Progress } from "@/lib/types";
import { sentences, tiefenlex, alleVokabeln, kollokVertiefung, synonymVertiefung } from "@/lib/content";
import { sucheAlles } from "@/lib/suche";
import { frequenzVonWort, FREQUENZ_AR } from "@/lib/frequenz";
import { levelOf, pickN, rng } from "@/lib/plan";
import { gemischteOptionen } from "@/lib/optionen";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { De } from "./De";


type Challenge = {
  id: string;
  frage: string;
  kontext?: string;
  options: string[];
  answer: string;
  erklaerung: string;
  art: string;
};

// ───────────────── ① المعنى بالسياق ─────────────────
function bauKontext(lvl: Level, runde: number): Challenge[] {
  const rnd = rng(runde * 521 + 17);
  const karten = pickN(alleVokabeln.filter((k) => k.level === lvl).length >= 6 ? alleVokabeln.filter((k) => k.level === lvl) : alleVokabeln, 6, rnd);
  const out: Challenge[] = [];
  for (const k of karten) {
    const satz = sentences.find((s) => s.de.toLowerCase().includes(k.de.toLowerCase()))?.de ?? k.exampleDe;
    if (!satz || !k.ar) continue;
    const distr = pickN(alleVokabeln.filter((x) => x.ar && x.ar !== k.ar), 3, rnd).map((x) => x.ar);
    out.push({
      id: `k-${k.id}`,
      frage: `ماذا تعني «${k.de}» هنا؟`,
      kontext: satz.replace(new RegExp(k.de.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), (m) => `【${m}】`),
      options: pickN([k.ar, ...distr], 4, rnd),
      answer: k.ar,
      erklaerung: `${k.de} = ${k.ar}${k.exampleDe ? ` · مثال: ${k.exampleDe}` : ""}`,
      art: "wortschatz",
    });
  }
  return out;
}

// ───────────────── ② Nuancen ─────────────────
function bauNuancen(runde: number): Challenge[] {
  const rnd = rng(runde * 337 + 9);
  const paare = pickN(tiefenlex.nuancen, 4, rnd);
  const out: Challenge[] = [];
  for (const p of paare) {
    out.push({
      id: `n-a-${p.a}`,
      frage: `أيّهما يملأ الفراغ: ${p.a} أم ${p.b}؟`,
      kontext: p.satzA,
      options: [p.a, p.b],
      answer: p.a,
      erklaerung: `${p.regel} · ${p.a} = ${p.aAr} / ${p.b} = ${p.bAr}`,
      art: "falsche-freunde",
    });
    out.push({
      id: `n-b-${p.a}`,
      frage: `وأيّهما هنا؟`,
      kontext: p.satzB,
      options: [p.a, p.b],
      answer: p.b,
      erklaerung: `${p.hinweis ? p.hinweis + " · " : ""}${p.b} = ${p.bAr}`,
      art: "falsche-freunde",
    });
  }
  return out.slice(0, 6);
}

// ───────────────── ③ Verb+Präp ─────────────────
function bauVerben(runde: number): Challenge[] {
  const rnd = rng(runde * 787 + 23);
  return pickN(tiefenlex.verben, 6, rnd).map((v) => ({
    id: `v-${v.verb}`,
    frage: `أكمل: ${v.verb}`,
    kontext: v.luecke,
    options: pickN(v.options, v.options.length, rnd),
    answer: v.praep,
    erklaerung: `${v.verb} + ${v.praep} + ${v.kasus} — ${v.ar}`,
    art: "praeposition",
  }));
}

// ───────────────── ④ Funktionsverbgefüge ─────────────────
function bauFvg(runde: number): Challenge[] {
  const rnd = rng(runde * 619 + 31);
  return pickN(tiefenlex.funktion, 6, rnd).map((f) => ({
    id: `f-${f.gefüge}`,
    frage: "أي فعل يصوغ هذا التركيب الرسمي؟",
    kontext: f.luecke + (f.satz ? ` · مثال: ${f.satz}` : ""),
    options: pickN(f.options, f.options.length, rnd),
    answer: f.options.includes(f.answer.split(" ")[0]) ? f.answer : f.answer,
    erklaerung: `${f.gefüge} — ${f.ar}`,
    art: "konstruktion",
  }));
}

// ───────────────── ⑤ Kollokationen B2 im Kontext (C6/R180) ─────────────────
function bauKollokVertiefung(runde: number): Challenge[] {
  const rnd = rng(runde * 733 + 41);
  return pickN(kollokVertiefung, 6, rnd).map((k) => ({
    id: `kv-${k.id}`,
    frage: "أيّ كلمة تتمّم هذا التلازم؟",
    kontext: k.satz,
    options: pickN(k.optionen, k.optionen.length, rnd),
    answer: k.antwort,
    erklaerung: `${k.kollokation} — ${k.ar}. ${k.noteAr}`,
    art: "kollokation",
  }));
}

// ───────────────── ⑥ Register-Synonyme B2 im Kontext (C6/R180) ─────────────────
function bauSynonymVertiefung(runde: number): Challenge[] {
  const rnd = rng(runde * 421 + 53);
  return pickN(synonymVertiefung, 6, rnd).map((x) => ({
    id: `sv-${x.id}`,
    frage: `أيّ كلمة أرقى أسلوبًا هنا بدلًا من «${x.basis}»؟`,
    kontext: x.satz,
    options: pickN(x.optionen, x.optionen.length, rnd),
    answer: x.ziel,
    erklaerung: `${x.basis} ← ${x.ziel}. ${x.nuanceAr}`,
    art: "synonym",
  }));
}

function Runde({ items, titel, onFertig }: { items: Challenge[]; titel: string; onFertig: (ok: number, n: number) => void }) {
  const { update } = useProgress();
  const [i, setI] = useState(0);
  const [okN, setOkN] = useState(0);
  const [antwort, setAntwort] = useState<null | string>(null);
  const c = items[i];
  if (!c) return <div className="card" style={{ padding: "0.9rem" }}>لا توجد بنود في هذا العمق لهذه المرحلة بعد.</div>;

  const waehle = (o: string) => {
    if (antwort !== null) return;
    const ok = o === c.answer;
    setAntwort(o);
    if (ok) setOkN((n) => n + 1);
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 2 : 1) }), "Wortschatz", ok));
    if (!ok) {
      addFehlerNow({
        falsch: (c.kontext ?? c.frage).replace("___", `«${o}»`),
        richtig: (c.kontext ?? "").replace("___", `«${c.answer}»`) || c.answer,
        art: c.art,
        ar: c.erklaerung,
        quelle: "TiefenLexikon",
      });
    }
  };

  const weiter = () => {
    setAntwort(null);
    if (i + 1 < items.length) setI(i + 1);
    else {
      onFertig(okN, items.length);
      setI(0);
      setOkN(0);
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        {titel} — بند <span className="rtl-num">{i + 1}</span>/<span className="rtl-num">{items.length}</span>
      </div>
      <div className="card" style={{ padding: "0.9rem 1.1rem" }}>
        <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>{c.frage}</div>
        {c.kontext && (
          <div style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.9 }}>
            <De>{c.kontext}</De>
          </div>
        )}
      </div>
      {antwort === null ? (
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {gemischteOptionen(c.options, c.id).map((o) => (
            <button key={o} className="chip" style={{ cursor: "pointer", fontSize: "1rem", padding: "0.45rem 1rem" }} onClick={() => waehle(o)}>
              {o}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: "0.8rem 1rem",
            borderInlineStart: `5px solid ${antwort === c.answer ? "var(--color-a1)" : "var(--color-mid)"}`,
            fontSize: "0.88rem",
            lineHeight: 1.8,
          }}
        >
          {antwort === c.answer ? "✅ أصبتَ! " : `⚠️ الصواب: ${c.answer} — `}
          {c.erklaerung}
          <div style={{ marginTop: "0.5rem", textAlign: "end" }}>
            <button className="btn btn-primary" onClick={weiter}>{i + 1 < items.length ? "التالي ←" : "أنهِ الجولة ✓"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: "k", emoji: "📖", name: "المعنى بالسياق", unter: "الكلمة داخل جملة حقيقية" },
  { id: "n", emoji: "🪞", name: "Nuancen", unter: "فروق المتقارب" },
  { id: "v", emoji: "🔗", name: "Verb + Präp", unter: "20 فعل بجرّه الثابت" },
  { id: "f", emoji: "🧩", name: "Funktionsverben", unter: "12 تركيباً رسمياً" },
  { id: "kv", emoji: "🔗", name: "Kollokationen B2", unter: "31 تلازماً بالسياق" },
  { id: "sv", emoji: "✒️", name: "Register-Synonyme", unter: "24 مرادفاً رسمياً بالسياق" },
] as const;

export function TiefenLexikon({ progress }: { progress: Progress }) {
  const [suchtext, setSuchtext] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("k");
  const [runde, setRunde] = useState(0);
  const [stat, setStat] = useState({ ok: 0, n: 0 });
  const level = levelOf(progress.plan.day);

  const items = useMemo(() => {
    switch (tab) {
      case "k": return bauKontext(level, runde);
      case "n": return bauNuancen(runde);
      case "v": return bauVerben(runde);
      case "f": return bauFvg(runde);
      case "kv": return bauKollokVertiefung(runde);
      case "sv": return bauSynonymVertiefung(runde);
    }
  }, [tab, runde, level]);

  const titel = TABS.find((t) => t.id === tab)!.name;

  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a1)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🔍 العمق المعجمي — TiefenLexikon <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul P)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        ستّة أعماق معجمية: المعنى بالسياق · فروق المتقارب (Nuancen) · أفعال بجرّها الثابت · التراكيب الخفيفة (Funktionsverben) · تلازمات B2 بالسياق · مرادفات السجلّ الرسمي — تحت المجهر لا فوق القوائم.
      </div>
      {stat.n > 0 && (
        <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
          جولات هذه الجلسة: <span className="rtl-num">{stat.ok}</span>/<span className="rtl-num">{stat.n}</span> إجابات صحيحة
        </div>
      )}
      {open && (
        <>
          <div data-testid="suche-box" style={{ marginBottom: "0.8rem" }}>
            <input
              data-testid="suche-input"
              value={suchtext}
              onChange={(e) => setSuchtext(e.target.value)}
              placeholder="🔎 بحث موحّد: كلمة، متلازمة، قاعدة، وسيلة تعبير… (M14)"
              style={{ width: "100%", minHeight: 44, borderRadius: 10, padding: "0.4rem 0.7rem" }}
            />
            {suchtext.trim().length >= 2 && (() => {
              const r = sucheAlles(suchtext);
              return (
                <div data-testid="suche-ergebnis" style={{ fontSize: "0.85rem", display: "grid", gap: "0.3rem", marginTop: "0.45rem" }}>
                  {r.trefferGesamt === 0 && <span style={{ color: "var(--color-ink2)" }}>لا نتائج — جرّب كلمة ألمانية أو عربية أخرى.</span>}
                  {r.vokabeln.map((v) => (
                    <div key={"v" + v.de}>🗂️ <strong dir="ltr" style={{ unicodeBidi: "isolate" }}>{v.de}</strong> = {v.ar} {v.level && <span className="chip" style={{ fontSize: "0.68rem" }}>{v.level}</span>} <span className="chip" style={{ fontSize: "0.68rem" }}>📊 {FREQUENZ_AR[frequenzVonWort(v.de).stufe]}</span></div>
                  ))}
                  {r.kollok.map((k) => (
                    <div key={"k" + k.phrase}>🧩 <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{k.phrase}</span>{k.karteAr && <span style={{ color: "var(--color-ink2)" }}> — بطاقة: {k.karteAr}</span>}</div>
                  ))}
                  {r.grammatik.map((g) => (
                    <div key={"g" + g.id}>📐 {g.titelAr} <span style={{ color: "var(--color-ink2)" }}>({g.titelDe})</span></div>
                  ))}
                  {r.redemittel.map((x) => (
                    <div key={"r" + x.de}>🧰 <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{x.de}</span> = {x.ar}</div>
                  ))}
                  {r.trefferGesamt > 0 && <span style={{ color: "var(--color-ink2)" }}>المجموع {r.trefferGesamt} نتيجة في أربع بنوك (تُعرض أول 6 من كل بنك).</span>}
                </div>
              );
            })()}
          </div>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className="chip"
                style={{ cursor: "pointer", background: tab === t.id ? "var(--color-cola)" : "var(--ui-surface-raised)", color: tab === t.id ? "var(--ui-on-accent)" : undefined }}
                onClick={() => { setTab(t.id); setRunde((r) => r + 1); }}
                title={t.unter}
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
          <Runde items={items} titel={titel} onFertig={(ok, n) => setStat((s) => ({ ok: s.ok + ok, n: s.n + n }))} />
          <div style={{ textAlign: "end", marginTop: "0.5rem" }}>
            <button className="btn btn-ghost" onClick={() => setRunde((r) => r + 1)}>🎲 جولة جديدة من نفس العمق</button>
          </div>
        </>
      )}
    </div>
  );
}
