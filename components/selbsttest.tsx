"use client";

/**
 * Zentrum Selbsttests (Modul W — Schritte 161–164) — جناح التدريب ③
 * ---------------------------------------------------------------------------
 * الاسترجاع الفعّال أقوى من التعرّف السطحي. ثلاث آلات اختبار ذاتي بلا خيارات
 * جاهزة + معايرة تقدير الذات:
 *  · 🕊️ الاسترجاع الحر (161) — المعنى بالعربية واكتب الألمانية من الذاكرة.
 *  · 🧩 الفجوات المفتوحة (162) — نصّ قراءة حقيقي بكلمات محذوفة دون بنك كلمات.
 *  · 🔀 الخلّاط المتداخل (163) — صوّب · مفردة · فجوة في تسلسل مُداخَل، مع مبدّل
 *    «كتل» لتشمّ الفرق بين التكرار المتجاور والمتداخل بنفسك.
 *  · 🎯 المعايرة (164) — توقّع نتيجتك قبل التسليم؛ المقياس يكشف وهم الإتقان
 *    («أظنّني جاهز» هو أخطر جملة قبل الامتحان).
 * المحتوى كلها من بنوك التطبيق عبر lib/content.ts · التوليد deterministic
 * ببذرة اليوم · الأخطاء تصبّ في الدفتر (①) والجولات في الرادار (③).
 */

import { useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress, addFehlerNow } from "@/lib/store";
import { normalize } from "@/lib/grader";
import { levelOf, pickN, rng, clozeFromSatz } from "@/lib/plan";
import { logK } from "@/lib/kompetenz";
import { checkAbzeichen } from "@/lib/spiel";
import { sentences, texts, fehlerList, alleVokabeln } from "@/lib/content";

/* ---------------------------------------------------------------- helpers */

/** تقارب مجموعهَي كلمات (F1 على الألفاظ بعد التطبيع) — معيار الاسترجاع. */
function overlap(a: string, b: string): number {
  const norm = (s: string) =>
    normalize(s)
      .replace(/[.,!?;:"“”„‘’]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  const ta = norm(a);
  const tb = norm(b);
  if (!ta.length || !tb.length) return 0;
  const rest = [...tb];
  let hit = 0;
  for (const w of ta) {
    const i = rest.indexOf(w);
    if (i >= 0) {
      hit++;
      rest.splice(i, 1);
    }
  }
  return (2 * hit) / (ta.length + tb.length);
}

/** مسافة تحرير صغيرة — للتمييز بين «نسيان الكلمة» و«خطأ إملائي قريب». */
function fastDistanz(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

const STOP = new Set(
  "und der die das ist sich mit für auch aber nicht sie er wir ich zu in den dem des auf von ein eine um dass als wenn bei aus nach zum zur werden wird hat habe haben kann mehr viele seinem ihrem über unter vor hinter".split(" ")
);

const sauber = (w: string) => w.replace(/[.,!?;:"“”]/g, "");

/* ------------------------------------------------------- بناء الجولات (بذرة) */

interface FreiItem {
  id: string;
  de: string;
  ar: string;
}

/** 161: ست جُمل من مستوى الطالب — العربية معروضة، الألمانية من الذاكرة. */
function bauFreie(tag: number, day: number): FreiItem[] {
  const lvl = levelOf(day);
  const rand = rng(tag * 977 + day * 31 + 11);
  const runde = 1 + (tag % 4);
  const pool = sentences.filter((s) => s.level === lvl);
  return pickN(pool.length ? pool : sentences, 6, rand).map((s) => ({ id: `${s.id}-f${runde}`, de: s.de, ar: s.ar }));
}

interface LueckRun {
  titleDe: string;
  titleAr: string;
  ar: string;
  masked: string[];
  holes: { word: string; zahl: number }[];
}

/** 162: نصّ قراءة من مستوى الطالب — تُخفى كلمات محتوى بلا أي بنك اختيارات. */
function bauLuecken(tag: number, day: number): LueckRun | null {
  const lvl = levelOf(day);
  const rand = rng(tag * 613 + day * 23 + 7);
  const pool = texts.filter((t) => t.level === lvl);
  const t = pool.length ? pool[Math.floor(rand() * pool.length)] : texts[0];
  if (!t || !t.de) return null;
  const zeilen = t.de.split(/\n+/).filter((l) => l.trim().length > 0);
  const alleW = zeilen.flatMap((l) => l.split(/\s+/));
  const kand = alleW.map((w, i) => ({ w, i })).filter(({ w }) => { const c = sauber(w); return c.length > 4 && !STOP.has(c.toLowerCase()); });
  if (kand.length < 4) return null;
  const chosen = pickN(kand, Math.min(7, kand.length), rand).sort((a, b) => a.i - b.i);
  const holes = chosen.map((c, k) => ({ word: sauber(c.w), zahl: k + 1 }));
  const holeMap = new Map(chosen.map((c, k) => [c.i, holes[k].zahl]));
  let idx = -1;
  const masked: string[] = [];
  for (const z of zeilen) {
    const parts: string[] = [];
    for (const w of z.split(/\s+/)) {
      idx++;
      const h = holeMap.get(idx);
      parts.push(h ? `___(${h})___` : w);
    }
    masked.push(parts.join(" "));
  }
  return { titleDe: t.titleDe, titleAr: t.titleAr, ar: t.ar, masked, holes };
}

/** 163: ثلاثة مصادر متداخلة — صوّب خطأً حقيقياً · مفردة · فجوة كلوز. */
interface MixItem {
  quell: "fehler" | "vokabel" | "cloze";
  fragE: string;
  fragAr: string;
  loesung: string;
  hilfeAr: string;
  kat: string;
}

function mischPool(tag: number, day: number): MixItem[] {
  const lvl = levelOf(day);
  const rand = rng(tag * 419 + day * 53 + 17);
  const out: MixItem[] = [];
  const fPool = fehlerList.filter((f) => typeof f.falsch === "string" && f.falsch.length > 16 && /\s/.test(f.falsch) && typeof f.richtig === "string" && f.richtig.length > 4);
  for (const f of pickN(fPool, 3, rand)) {
    out.push({
      quell: "fehler",
      fragE: f.falsch,
      fragAr: "صوّب الجملة — هذا الخطأ من بنك أخطائك الحقيقي",
      loesung: f.richtig,
      hilfeAr: f.ar,
      kat: f.kat,
    });
  }
  const vPool = alleVokabeln.filter((v) => v.level === lvl);
  for (const v of pickN(vPool.length ? vPool : alleVokabeln, 3, rand)) {
    out.push({
      quell: "vokabel",
      fragE: v.ar,
      fragAr: v.article ? `اكتب الكلمة الألمانية مع الأداة (${v.article})` : "اكتب الكلمة الألمانية",
      loesung: v.article ? `${v.article} ${v.de}` : v.de,
      hilfeAr: v.exampleDe ? `مثال: ${v.exampleDe}` : "",
      kat: "wortschatz",
    });
  }
  const sPool = sentences.filter((s) => s.level === lvl);
  for (const s of pickN(sPool.length ? sPool : sentences, 3, rand)) {
    const ex = clozeFromSatz(s, out.length, rand);
    out.push({
      quell: "cloze",
      fragE: ex.promptDe,
      fragAr: ex.promptAr ?? "",
      loesung: Array.isArray(ex.answer) ? ex.answer[0] : String(ex.answer),
      hilfeAr: typeof ex.explanationDe === "string" ? ex.explanationDe : s.de,
      kat: "wortschatz",
    });
  }
  return pickN(out, out.length, rand); // خلط المصادر = تداخل
}

/* -------------------------------------------------- معايرة (164) — مشتركة */

function Eichstreifen({ n, erwartet, gesetzt }: { n: number; erwartet: number | null; gesetzt: (k: number) => void }) {
  return (
    <div style={{ background: "var(--color-paper2)", borderRadius: 12, padding: "0.55rem 0.8rem", fontSize: "0.75rem" }} dir="rtl">
      <b>🎯 قبل التسليم قرّر: كم إجابة تتوقّع أن تصيب؟</b>{" "}
      <span style={{ opacity: 0.75 }}>(من يبالغ في تقدير نفسه هو بالذات من يرتبك في الامتحان)</span>
      <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {Array.from({ length: n + 1 }, (_, k) => k).map((k) => (
          <button
            key={k}
            onClick={() => gesetzt(k)}
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              cursor: "pointer",
              border: erwartet === k ? "1.5px solid var(--color-b2)" : "1px solid #d6d3d1",
              background: erwartet === k ? "var(--color-b2)" : "white",
              color: erwartet === k ? "white" : undefined,
              fontWeight: 800,
              fontSize: "0.7rem",
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

function EichErgebnis({ n, richtig, erwartet }: { n: number; richtig: number; erwartet: number | null }) {
  if (erwartet === null) return null;
  const diff = erwartet - richtig;
  const farbe = Math.abs(diff) <= 1 ? "var(--color-a1)" : diff > 0 ? "var(--color-gold)" : "var(--color-a2)";
  const satz =
    Math.abs(diff) <= 1
      ? "تقديرك دقيق — تعرف بالضبط ما تعرفه. هذه أعلى درجات الاستعداد."
      : diff > 0
      ? `بالغتَ بـ ${diff}: «وهم الإتقان» — بدا لك سهلاً فلم تسترجعه فعلاً. أعد البطاقات الفاسدة بعد يومين.`
      : `قلّلتَ من شأنك بـ ${-diff} — أنت أفضل مما تظن؛ ادخل الامتحان بثقة.`;
  return (
    <div style={{ borderRadius: 12, padding: "0.55rem 0.8rem", fontSize: "0.78rem", fontWeight: 800, color: farbe, background: "var(--color-paper2)" }} dir="rtl">
      توقّعت <span className="rtl-num">{erwartet}</span> من <span className="rtl-num">{n}</span> · أصبت{" "}
      <span className="rtl-num">{richtig}</span> — {satz}
    </div>
  );
}

const feld: React.CSSProperties = { direction: "ltr", width: "100%", maxWidth: "30rem" };

/* --------------------------------------------------------- 161 · الاسترجاع */

function FreieWiedergabe({ tag, day }: { tag: number; day: number }) {
  const { update } = useProgress();
  const items = useMemo(() => bauFreie(tag, day), [tag, day]);
  const [gaben, setGaben] = useState<Record<number, string>>({});
  const [tipp, setTipp] = useState<Record<number, boolean>>({});
  const [erwartet, setErwartet] = useState<number | null>(null);
  const [fertig, setFertig] = useState(false);

  const bewertung = useMemo(() => {
    if (!fertig) return null;
    return items.map((it, k) => {
      const o = overlap(it.de, gaben[k] ?? "");
      return { o, ok: o >= 0.85 && !tipp[k], teil: o >= 0.6 };
    });
  }, [fertig, items, gaben, tipp]);

  const richtig = bewertung ? bewertung.filter((b) => b.ok || b.teil).length : 0;

  function abgeben() {
    if (fertig) return;
    setFertig(true);
    let xp = 0;
    let okAnz = 0;
    items.forEach((it, k) => {
      const o = overlap(it.de, gaben[k] ?? "");
      const ok = o >= 0.85 && !tipp[k];
      if (ok) {
        xp += 2;
        okAnz++;
      } else if (o >= 0.6) {
        xp += 1;
        okAnz++;
      } else {
        addFehlerNow({ falsch: (gaben[k] ?? "").trim() || "…", richtig: it.de, art: "wortschatz", ar: "استرجاع حر — الجملة ضاعت من الذاكرة", quelle: "Selbsttest" });
      }
    });
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + xp }), "Wortschatz", okAnz >= 4));
  }

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      {items.map((it, k) => {
        const b = bewertung?.[k];
        return (
          <div key={it.id} style={{ border: "1px solid #e7e5e4", borderRadius: 12, padding: "0.6rem 0.8rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.86rem" }} dir="rtl">
              <span className="rtl-num">{k + 1}.</span> {it.ar}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6 }}>
              <input className="field" style={feld} value={gaben[k] ?? ""} onChange={(e) => setGaben((g) => ({ ...g, [k]: e.target.value }))} disabled={fertig} placeholder="Dein Satz aus dem Gedächtnis…" />
              <button
                title="اكشف الحروف الأولى (تُسجَّل مساعدة)"
                onClick={() => setTipp((t) => ({ ...t, [k]: !t[k] }))}
                style={{ border: "1px solid #d6d3d1", background: "var(--color-card)", borderRadius: 10, padding: "0.35rem 0.5rem", cursor: "pointer", fontSize: "0.85rem" }}
              >
                {tipp[k] ? "🙈" : "🔤"}
              </button>
            </div>
            {tipp[k] && (
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem", opacity: 0.7, marginTop: 4 }} dir="ltr">
                {it.de.split(/\s+/).map((w) => `${sauber(w)[0]}·`).join(" ")}
              </div>
            )}
            {b && (
              <>
                <div style={{ background: "var(--color-paper)", borderRadius: 8, padding: "0.25rem 0.5rem", fontSize: "0.74rem", fontWeight: 800, marginTop: 4 }}>
                  <span className="de">{it.de}</span>
                </div>
                <div dir="rtl" style={{ fontSize: "0.72rem", fontWeight: 800, marginTop: 3, color: b.ok ? "var(--color-a1)" : b.teil ? "var(--color-gold)" : "#b91c1c" }}>
                  {b.ok
                    ? "✓ استرجاع نظيف — الذاكرة تثبيتت"
                    : b.teil
                    ? `~ قريب (${Math.round(b.o * 100)}٪) — ناقصٌ سيقوّيه الدفتر`
                    : `✗ ${Math.round(b.o * 100)}٪ فقط — دخل دفتر الأخطاء، راجعه غداً`}
                </div>
              </>
            )}
          </div>
        );
      })}
      {!fertig && <Eichstreifen n={items.length} erwartet={erwartet} gesetzt={setErwartet} />}
      {!fertig ? (
        <button className="btn btn-primary" onClick={abgeben}>سلّم الجولة · تصحيح ذاتي</button>
      ) : (
        <EichErgebnis n={items.length} richtig={richtig} erwartet={erwartet} />
      )}
    </div>
  );
}

/* --------------------------------------------------------- 162 · الفجوات */

function Textluecken({ tag, day }: { tag: number; day: number }) {
  const { update } = useProgress();
  const run = useMemo(() => bauLuecken(tag, day), [tag, day]);
  const [gaben, setGaben] = useState<Record<number, string>>({});
  const [erwartet, setErwartet] = useState<number | null>(null);
  const [fertig, setFertig] = useState(false);

  const bewertung = useMemo(() => {
    if (!fertig || !run) return null;
    return run.holes.map((h) => {
      const g = normalize(sauber(gaben[h.zahl] ?? ""));
      const s = normalize(h.word);
      if (g === s) return { ok: true as const, grund: "" as const };
      if (g && fastDistanz(g, s) <= 2) return { ok: false as const, grund: "schreibung" as const };
      return { ok: false as const, grund: "wortschatz" as const };
    });
  }, [fertig, run, gaben]);

  if (!run)
    return (
      <div style={{ background: "var(--color-gold-soft)", borderRadius: 12, padding: "0.55rem 0.8rem", fontSize: "0.78rem", fontWeight: 800 }} dir="rtl">
        نصّ هذه الجولة لا يحتمل فجوات كافية — غداً تبذر الجولة نصّاً آخر.
      </div>
    );

  const richtig = bewertung ? bewertung.filter((b) => b.ok).length : 0;

  function abgeben() {
    if (fertig || !run) return;
    setFertig(true);
    let xp = 0;
    run.holes.forEach((h) => {
      const g = normalize(sauber(gaben[h.zahl] ?? ""));
      const s = normalize(h.word);
      if (g === s) xp += 1;
      else addFehlerNow({ falsch: g || "…", richtig: h.word, art: g && fastDistanz(g, s) <= 2 ? "schreibung" : "wortschatz", ar: `فجوة نص ${run.titleDe} — ${g ? "خطأ إملائي قريب" : "الكلمة غابت تماماً"}`, quelle: "Selbsttest" });
    });
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + xp }), "Lesen", richtig >= Math.ceil(run.holes.length * 0.6)));
  }

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ fontWeight: 800, fontSize: "0.86rem" }} dir="rtl">
        📖 {run.titleAr} <span style={{ opacity: 0.6, fontWeight: 600 }} className="de">({run.titleDe})</span>
      </div>
      <div style={{ background: "var(--color-card)", border: "1px solid #e7e5e4", borderRadius: 12, padding: "0.7rem 0.9rem", fontSize: "0.86rem", lineHeight: 2 }}>
        {run.masked.map((z, k) => (
          <p key={k} className="de" style={{ margin: k ? "0.4rem 0 0" : 0 }}>{z}</p>
        ))}
      </div>
      <details style={{ fontSize: "0.76rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 800, opacity: 0.8 }}>🇸🇦 الترجمة العربية — اكشفها عند الحاجة فقط</summary>
        <p style={{ lineHeight: 1.9, opacity: 0.9, margin: "0.3rem 0 0" }} dir="rtl">{run.ar}</p>
      </details>
      <div className="grid2" style={{ gap: 6 }}>
        {run.holes.map((h) => {
          const b = bewertung?.[h.zahl - 1];
          return (
            <div key={h.zahl} style={{ border: "1px solid #e7e5e4", borderRadius: 10, padding: "0.35rem 0.55rem" }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 900, opacity: 0.7 }} dir="rtl">الفجوة <span className="rtl-num">{h.zahl}</span></div>
              <input className="field" style={{ direction: "ltr", width: "100%" }} value={gaben[h.zahl] ?? ""} onChange={(e) => setGaben((g) => ({ ...g, [h.zahl]: e.target.value }))} disabled={fertig} />
              {b && (
                <div style={{ fontSize: "0.7rem", fontWeight: 900, color: b.ok ? "var(--color-a1)" : "#b91c1c" }} dir="rtl">
                  {b.ok ? "✓" : b.grund === "schreibung" ? <span>✗ إملائي فقط! الصواب <b className="de">{h.word}</b></span> : <span>✗ <b className="de">{h.word}</b></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!fertig && <Eichstreifen n={run.holes.length} erwartet={erwartet} gesetzt={setErwartet} />}
      {!fertig ? (
        <button className="btn btn-primary" onClick={abgeben}>سلّم الفجوات · تصحيح آلي</button>
      ) : (
        <EichErgebnis n={run.holes.length} richtig={richtig} erwartet={erwartet} />
      )}
    </div>
  );
}

/* --------------------------------------------------------- 163 · الخلّاط */

function InterleavingMischer({ tag, day }: { tag: number; day: number }) {
  const { update } = useProgress();
  const items = useMemo(() => mischPool(tag, day), [tag, day]);
  const [blockiert, setBlockiert] = useState(false);
  const geordnet = useMemo(() => (blockiert ? [...items].sort((a, b) => a.quell.localeCompare(b.quell)) : items), [items, blockiert]);
  const [gaben, setGaben] = useState<Record<number, string>>({});
  const [erwartet, setErwartet] = useState<number | null>(null);
  const [fertig, setFertig] = useState(false);

  const bewertung = useMemo(() => {
    if (!fertig) return null;
    return geordnet.map((it, k) => {
      const gi = normalize(sauber((gaben[k] ?? "").trim()));
      if (!gi) return false;
      if (it.quell === "fehler") {
        const want = normalize(sauber(it.loesung)).split(/\s+/).filter((w) => w.length > 2);
        const have = new Set(gi.split(/\s+/));
        const hit = want.filter((w) => have.has(w)).length;
        return want.length > 0 && hit / want.length >= 0.8;
      }
      const lo = normalize(sauber(it.loesung));
      return gi === lo || (it.quell === "vokabel" && fastDistanz(gi, lo) <= 2);
    });
  }, [fertig, geordnet, gaben]);

  const richtig = bewertung ? bewertung.filter(Boolean).length : 0;

  function abgeben() {
    if (fertig) return;
    setFertig(true);
    let xp = 0;
    geordnet.forEach((it, k) => {
      const gi = normalize(sauber((gaben[k] ?? "").trim()));
      const ok = (() => {
        if (!gi) return false;
        if (it.quell === "fehler") {
          const want = normalize(sauber(it.loesung)).split(/\s+/).filter((w) => w.length > 2);
          const have = new Set(gi.split(/\s+/));
          return want.length > 0 && want.filter((w) => have.has(w)).length / want.length >= 0.8;
        }
        const lo = normalize(sauber(it.loesung));
        return gi === lo || (it.quell === "vokabel" && fastDistanz(gi, lo) <= 2);
      })();
      if (ok) xp += 2;
      else addFehlerNow({ falsch: gi || "…", richtig: it.loesung, art: it.quell === "fehler" ? it.kat : "wortschatz", ar: `الخلّاط (${it.quell === "fehler" ? "تصويب" : it.quell === "vokabel" ? "مفردة" : "فجوة"}) — ضاع في التداخل`, quelle: "Selbsttest" });
    });
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + xp }), "Grammatik", richtig >= (blockiert ? 7 : 6)));
  }

  const QLABEL: Record<MixItem["quell"], string> = { fehler: "🔍 صوّب", vokabel: "🔤 مفردة", cloze: "🧩 فجوة" };

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", background: "var(--color-paper2)", borderRadius: 12, padding: "0.5rem 0.75rem" }} dir="rtl">
        <div style={{ fontSize: "0.76rem", flex: 1, minWidth: "14rem" }}>
          تسع بطاقات من ثلاثة مصادر <b>مُداخَلة</b> — أصعب الآن وأثبت لاحقاً. بدّل إلى «كتل» لتشمّ الفرق بنفسك.
        </div>
        <button style={{ border: "1px solid var(--color-b2)", background: "var(--color-card)", color: "var(--color-b2)", borderRadius: 10, padding: "0.3rem 0.55rem", cursor: "pointer", fontWeight: 900, fontSize: "0.7rem" }} onClick={() => setBlockiert((v) => !v)}>
          {blockiert ? "الأوضاع: كتل 🧱" : "الأوضاع: تداخل 🔀"}
        </button>
      </div>
      {geordnet.map((it, k) => {
        const b = bewertung?.[k];
        return (
          <div key={k} style={{ border: "1px solid #e7e5e4", borderRadius: 12, padding: "0.55rem 0.8rem" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span className="chip" style={{ fontWeight: 900 }}>{QLABEL[it.quell]}</span>
              <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>
                {it.quell === "vokabel" ? <span dir="rtl">{it.fragE}</span> : <span className="de">{it.fragE}</span>}
              </span>
            </div>
            <div style={{ fontSize: "0.7rem", opacity: 0.75, marginTop: 2 }} dir="rtl">{it.fragAr}</div>
            <input className="field" style={{ direction: "ltr", width: "100%", marginTop: 6 }} value={gaben[k] ?? ""} onChange={(e) => setGaben((g) => ({ ...g, [k]: e.target.value }))} disabled={fertig} placeholder="اكتب إجابتك…" />
            {b !== undefined && (
              <div style={{ fontSize: "0.73rem", fontWeight: 900, marginTop: 4, color: b ? "var(--color-a1)" : "#b91c1c" }} dir="rtl">
                {b ? "✓ في محله" : <span>✗ الصواب: <b className="de">{it.loesung}</b>{it.hilfeAr ? ` — ${it.hilfeAr}` : ""}</span>}
              </div>
            )}
          </div>
        );
      })}
      {!fertig && <Eichstreifen n={geordnet.length} erwartet={erwartet} gesetzt={setErwartet} />}
      {!fertig ? (
        <button className="btn btn-primary" onClick={abgeben}>سلّم الخلّاط</button>
      ) : (
        <EichErgebnis n={geordnet.length} richtig={richtig} erwartet={erwartet} />
      )}
    </div>
  );
}

/* --------------------------------------------------------------- المركز */

export function SelbstTestZentrum({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"frei" | "luecken" | "mischer">("frei");
  const day = progress.plan.day;
  const tag = day;

  return (
    <div className="card fadein" id="selbsttest" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a1)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🧠 مختبر الاختبارات الذاتية — Selbsttests <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul W)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        استرجاع حر · فجوات نصّية بلا خيارات · تداخل المصادر — ثم تخبرني كم تتوقّع أن تصيب؟ المعايرة الصادقة قبل الامتحان تنقذك من «وهم الإتقان».
      </div>
      {open && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(
              [
                ["frei", "🕊️ استرجاع حر"],
                ["luecken", "🧩 فجوات النص"],
                ["mischer", "🔀 الخلّاط المتداخل"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} className="chip" style={{ cursor: "pointer", background: tab === id ? "var(--color-cola)" : "white", color: tab === id ? "white" : undefined }} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
          {tab === "frei" && <FreieWiedergabe tag={tag} day={day} />}
          {tab === "luecken" && <Textluecken tag={tag} day={day} />}
          {tab === "mischer" && <InterleavingMischer tag={tag} day={day} />}
        </div>
      )}
    </div>
  );
}
