"use client";

/**
 * BlitzDrill (Modul X — Schritte 165–168) — جناح التدريب ③
 * ---------------------------------------------------------------------------
 * «حقيبة الدقيقة»: ستّون ثانية، أقصى ما يمكن من الإصابات — السرعة تبني
 * الاسترجاع الآلي الذي لا يملكه المتأنّي أمام ورقة الامتحان. أربع رقع:
 *  · 🥨 جمع الأسماء (165) — من بنك المفردات بصفة الجمع الحقيقية.
 *  · ⚖️ المقارنة والفضلى (166) — جدول تصريف الصفة + الشواذ (gut/hoch/…) من كتاب القواعد.
 *  · 🫡 صيغة الأمر (167) — du/ihr/Sie مولّدة من تصريفات الأفعال الـ26 بمشتقاتها.
 *  · 🩴 أخطاؤك أنت (168) — دفتر أخطائك نفسه، الأعتق عناداً أولاً؛ كل إجابة
 *    تُصفّي الدفتر عبر gradeFehlerNow (الأنبوب ① مباشرة).
 * كل شيء محلي deterministic (بذرة = يوم الخطة)؛ الرقعة الحرة تُعيد ترتيب
 * بطاقاتها كل يوم فلا حفظ لموضع. أفضل نتيجة لكل رقعة محفوظة 🏆.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress, gradeFehlerNow } from "@/lib/store";
import { normalize } from "@/lib/grader";
import { levelOf, pickN, rng } from "@/lib/plan";
import { logK } from "@/lib/kompetenz";
import { checkAbzeichen } from "@/lib/spiel";
import { alleVokabeln, grammarMap, verben, haerte } from "@/lib/content";
import { ProgressBar } from "./ui";

type Deck = "plural" | "vergl" | "imperativ" | "fehler" | "haerte";

const DECKS: { id: Deck; emoji: string; titel: string; ar: string; comp: "Wortschatz" | "Grammatik" | null }[] = [
  { id: "plural", emoji: "🥨", titel: "الجمع الشاذّ", ar: "مفردتك + صيغة جمعها الحقيقية", comp: "Wortschatz" },
  { id: "vergl", emoji: "⚖️", titel: "المقارنة والفضلى", ar: "klein · kleiner · am kleinsten — والشواذ", comp: "Grammatik" },
  { id: "imperativ", emoji: "🫡", titel: "الأمر الثلاثي", ar: "du! · ihr! · Sie! من تصريفاتك", comp: "Grammatik" },
  { id: "fehler", emoji: "🩴", titel: "أخطاؤك أنت", ar: "دفترك — الأعتق عناداً أولاً", comp: null },
  { id: "haerte", emoji: "🥵", titel: "العينة الأصعب", ar: "فخاخ B2/C1: desto · lassen · Konjunktiv II", comp: "Grammatik" },
];

interface Karte {
  q: string;
  qAr: string;
  a: string;
  alts?: string[];
  key?: string;
  opts?: string[];
}

/* -------------------------------------------------------------- تقييم خاطف */

const norm = (s: string) =>
  normalize(s)
    .replace(/[.!?,;:"“”„]/g, "")
    .replace(/^(der|die|das)\s+/, "")
    .trim();

function trifft(gab: string, soll: string, alts: string[] = []): boolean {
  const g = norm(gab);
  if (!g) return false;
  const targets = [soll, ...alts].map(norm).filter(Boolean);
  if (targets.includes(g)) return true;
  const want = targets[0].split(/\s+/).filter((w) => w.length > 2);
  if (want.length >= 4) {
    const have = new Set(g.split(/\s+/));
    return want.filter((w) => have.has(w)).length / want.length >= 0.8;
  }
  return false;
}

/* ------------------------------------------------- مولّدات الرقع (بذرة يوم) */

function deckPlural(day: number): Karte[] {
  const lvl = levelOf(day);
  const rand = rng(day * 761 + 11);
  const pool = alleVokabeln.filter((v) => v.plural && v.level === lvl);
  const base = pool.length >= 8 ? pool : alleVokabeln.filter((v) => v.plural);
  return pickN(base, Math.min(18, base.length), rand).map((v) => {
    const pluralFull = v.plural!.trim();
    const ohne = pluralFull.replace(/^(der|die|das)\s+/i, "");
    return { q: v.de, qAr: `الجمع؟ (${v.ar})`, a: ohne, alts: [pluralFull] };
  });
}

function deckVergleich(day: number): Karte[] {
  const rand = rng(day * 761 + 23);
  const rows = (grammarMap["a2-steigerung"]?.tables?.[0]?.rows ?? []) as string[][];
  const usable = rows.filter((r) => r.length >= 3 && r.every((x) => typeof x === "string" && x.trim()));
  const picked = pickN(usable, Math.min(18, usable.length), rand);
  return picked.map((r, k) => {
    const wantK = k % 2 === 0;
    return wantK
      ? { q: `⚖️ ${r[0]} …Komparativ?`, qAr: `«أكثر ${r[0]}» — صيغة المقارنة`, a: r[1].trim() }
      : { q: `⚖️ ${r[0]} …Superlativ?`, qAr: `«الأكثر ${r[0]}» — صيغة التفضيل (مع am أو بدونها)`, a: r[2].trim(), alts: [r[2].trim().replace(/^am\s+/i, "")] };
  });
}

/** الأشكال التي لا تُشتق بالقاعدة — تُعرف ولا تُقاس (liest·isst·bist·hast) */
const DU_AUSNAHMEN: Record<string, string> = { liest: "lies", isst: "iss", bist: "sei", hast: "hab" };

function imperativDu(du: string, inf: string): string | null {
  if (DU_AUSNAHMEN[du]) return DU_AUSNAHMEN[du];
  if (!du.endsWith("st")) return null;
  let s = du.slice(0, -2);
  if (/[sßzx]$/.test(s) && !/(ss|ß)$/.test(s)) s += "s";
  if (s.includes("ä") && inf.includes("a")) s = s.replace(/ä/g, "a");
  if (s.includes("ö") && /o|e/.test(inf)) s = s.replace(/ö/g, "o");
  if (s.includes("ü") && /u|au/.test(inf)) s = s.replace(/ü/g, "u");
  return s || null;
}

const MODALE = new Set(["sein", "haben", "werden", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"]);

function deckImperativ(day: number): Karte[] {
  const rand = rng(day * 761 + 37);
  const liste = verben
    .filter((v) => !MODALE.has(v.inf) && Array.isArray(v.präs) && v.präs.length >= 6)
    .map((v) => {
      const out: Karte[] = [];
      const du = imperativDu(v.präs[1], v.inf);
      if (du) out.push({ q: `🫡 ${v.inf} — du!`, qAr: `أمر لصديق واحد (${v.inf})`, a: du, alts: [du + "e"] });
      out.push({ q: `🫡 ${v.inf} — ihr!`, qAr: `أمر لجمع من الأصدقاء (${v.inf})`, a: v.präs[4] });
      out.push({ q: `🫡 ${v.inf} — Sie!`, qAr: `أمر رسمي (${v.inf})`, a: `${v.inf} Sie`, alts: [`${v.inf[0].toUpperCase()}${v.inf.slice(1)} Sie`] });
      return out;
    })
    .flat();
  return pickN(liste, Math.min(18, liste.length), rand);
}

function deckFehler(p: Progress, day: number): Karte[] {
  const rand = rng(day * 761 + 53);
  const alle = Object.values(p.fehler ?? {}).filter((e) => e.falsch && e.richtig && e.falsch.trim() !== e.richtig.trim());
  const stur = alle.sort((a, b) => (b.treffer ?? 0) - (a.treffer ?? 0)).slice(0, 15);
  return pickN(stur, stur.length, rand).map((e) => ({
    q: e.falsch,
    qAr: `صوّب الجملة كاملة${e.treffer > 1 ? ` — أخطأتَ فيها ${e.treffer} مرات!` : ""}`,
    a: e.richtig,
    key: e.key,
  }));
}

/** 🥵 العينة الأصعب — فخاخ تركيبية من بنك Haerte (خيار رقمي سريع) */
function deckHaerte(day: number): Karte[] {
  const rand = rng(day * 761 + 71);
  return pickN(haerte, haerte.length, rand).map((h, k) => {
    const order = pickN(h.options.map((o, i) => ({ o, i })), 4, rng(day * 977 + k * 31 + 5));
    const correct = order.findIndex((x) => x.i === h.answer);
    return { q: h.frage, qAr: h.ar + " — اكتب رقم الخيار (1–4)", a: order[correct].o, opts: order.map((x) => x.o) };
  });
}

/* -------------------------------------------------------------- الحقيبة */

const SEK = 60;

export function BlitzDrill({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [deck, setDeck] = useState<Deck>("plural");
  const [zustand, setZustand] = useState<"idle" | "lauf" | "ende">("idle");
  const [zeit, setZeit] = useState(SEK);
  const [idx, setIdx] = useState(0);
  const [gab, setGab] = useState("");
  const [flash, setFlash] = useState<null | { ok: boolean; text: string }>(null);
  const [score, setScore] = useState({ hits: 0, n: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const karten = useMemo(() => {
    if (deck === "plural") return deckPlural(progress.plan.day);
    if (deck === "vergl") return deckVergleich(progress.plan.day);
    if (deck === "imperativ") return deckImperativ(progress.plan.day);
    if (deck === "haerte") return deckHaerte(progress.plan.day);
    return deckFehler(progress, progress.plan.day);
  }, [deck, progress]);

  // العدّاد
  useEffect(() => {
    if (zustand !== "lauf") return;
    const t = setInterval(() => setZeit((z) => z - 1), 1000);
    return () => clearInterval(t);
  }, [zustand]);
  useEffect(() => {
    if (zustand === "lauf" && zeit <= 0) beenden();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeit, zustand]);

  function starten(d: Deck) {
    if (d === "fehler" && Object.values(progress.fehler ?? {}).filter((e) => e.falsch && e.richtig && e.falsch !== e.richtig).length === 0) return;
    setDeck(d);
    setZustand("lauf");
    setZeit(SEK);
    setIdx(0);
    setGab("");
    setFlash(null);
    setScore({ hits: 0, n: 0 });
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function weiter() {
    setFlash(null);
    setGab("");
    setIdx((i) => i + 1);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  function antworten() {
    if (zustand !== "lauf" || flash?.ok) return;
    const k = karten[idx % karten.length];
    let use = gab.trim();
    if (k.opts && /^\d$/.test(use)) {
      const i = Number(use) - 1;
      if (i >= 0 && i < k.opts.length) use = k.opts[i];
    }
    const ok = trifft(use, k.a, k.alts ?? []);
    setScore((s) => ({ hits: s.hits + (ok ? 1 : 0), n: s.n + 1 }));
    if (k.key) gradeFehlerNow(k.key, ok);
    setFlash({ ok, text: ok ? "" : `✓ ${k.a}` });
    if (ok) setTimeout(() => weiter(), 320);
  }

  function beenden() {
    if (zustand === "ende") return;
    setZustand("ende");
    const { hits, n } = scoreRef.current;
    const meta = DECKS.find((d) => d.id === deck)!;
    update((p) => {
      const alt = p.blitz?.[deck] ?? 0;
      const xp = Math.min(12, hits) + (hits >= 10 ? 3 : 0);
      const q: Progress = { ...p, blitz: { ...(p.blitz ?? {}), [deck]: Math.max(alt, hits) }, xp: (p.xp ?? 0) + xp };
      return meta.comp ? logK(checkAbzeichen(q), meta.comp, hits >= Math.max(5, Math.round(n * 0.6))) : checkAbzeichen(q);
    });
  }

  const k = karten[idx % Math.max(1, karten.length)];
  const leer = deck === "fehler" && karten.length === 0;
  const neuBest = zustand === "ende" && score.hits > 0 && score.hits >= (progress.blitz?.[deck] ?? 0);

  return (
    <div className="card fadein" id="blitz" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-gold)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          ⚡ حقيبة الدقيقة — BlitzDrill <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul X)</span>
        </span>
        <span className="chip" style={{ fontWeight: 900 }}>
          🏆 أفضل إصابات: {DECKS.filter((d) => (progress.blitz?.[d.id] ?? 0) > 0).length ? DECKS.filter((d) => (progress.blitz?.[d.id] ?? 0) > 0).map((d) => `${d.emoji} ${progress.blitz?.[d.id]}`).join(" · ") : "—"}
        </span>
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }} dir="rtl">
        ستّون ثانية — اضغط أكبر عدد. السرعة تُجبر دماغك على الاسترجاع الآلي، والخطأ هنا يُدفن في نفس الثانية في نظام المراجعة.
      </div>

      {/* اختيار الرقعة */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 6 }}>
        {DECKS.map((d) => (
          <button
            key={d.id}
            disabled={zustand === "lauf" || (d.id === "fehler" && leer)}
            onClick={() => starten(d.id)}
            style={{
              textAlign: "right",
              cursor: zustand === "lauf" ? "wait" : "pointer",
              border: d.id === deck && zustand !== "idle" ? "1.5px solid var(--color-gold)" : "1px solid var(--color-line)",
              background: zustand === "lauf" ? "var(--color-paper2)" : "var(--color-paper)",
              borderRadius: 12,
              padding: "0.5rem 0.7rem",
              minHeight: "44px",
              opacity: d.id === "fehler" && leer ? 0.5 : 1,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: "0.85rem" }}>
              {d.emoji} {d.titel}
              {(progress.blitz?.[d.id] ?? 0) > 0 && <span style={{ fontSize: "0.66rem", color: "var(--color-gold)", marginInlineStart: 4 }}>🏆 {progress.blitz?.[d.id]}</span>}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--color-ink2)" }}>{d.ar}</div>
          </button>
        ))}
      </div>

      {deck === "fehler" && leer && zustand === "idle" && (
        <div style={{ marginTop: 6, background: "var(--color-gold-soft)", borderRadius: 10, padding: "0.45rem 0.7rem", fontSize: "0.76rem" }} dir="rtl">
          🩴 الرقعة فارغة الآن — وهذا خبر ممتاز: دفتر أخطائك لا يضمّ جملاً قابلة للتصويب بعد. سلّم كتاباتك أولاً وسأعود مليانة.
        </div>
      )}

      {/* ميدان اللعب */}
      {zustand === "lauf" && !leer && k && (
        <div style={{ marginTop: 8, background: "var(--color-paper2)", borderRadius: 14, padding: "0.8rem 1rem" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontWeight: 900, fontSize: "1.15rem", fontVariantNumeric: "tabular-nums", color: zeit <= 10 ? "#b91c1c" : undefined }}>
              0:{String(Math.max(0, zeit)).padStart(2, "0")}
            </span>
            <div style={{ flex: 1 }}>
              <ProgressBar pct={(Math.max(0, zeit) / SEK) * 100} color={zeit <= 10 ? "#b91c1c" : "var(--color-gold)"} />
            </div>
            <span style={{ fontSize: "0.74rem", fontWeight: 800 }} dir="rtl">
              {score.hits}/{score.n} ✓ · بطاقة {idx + 1}
            </span>
          </div>
          <div className="de" style={{ fontWeight: 900, fontSize: "1.05rem", minHeight: "1.7rem" }}>{k.q}</div>
          {k.opts && (
            <div style={{ display: "grid", gap: 2, margin: "4px 0" }}>
              {k.opts.map((o, j) => (
                <span key={j} className="de" style={{ fontSize: "0.78rem" }}>
                  <b style={{ color: "var(--color-b2)" }}>{j + 1})</b> {o}
                </span>
              ))}
            </div>
          )}
          <div style={{ fontSize: "0.76rem", color: "var(--color-ink2)", margin: "2px 0 8px" }} dir="rtl">{k.qAr}</div>
          {flash && !flash.ok && <div className="de" style={{ background: "var(--color-card)", border: "1px solid var(--color-a1)", borderRadius: 8, padding: "0.25rem 0.5rem", fontSize: "0.78rem", fontWeight: 900, marginBottom: 6 }}>{flash.text}</div>}
          <div style={{ display: "flex", gap: 6 }}>
            <input ref={inputRef} className="field" style={{ direction: "ltr", flex: 1 }} value={gab} onChange={(e) => setGab(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (flash && !flash.ok ? weiter() : antworten())} placeholder="اكتب أو رقم الخيار (1–4) ثم ⏎" autoFocus />
            {flash && !flash.ok ? (
              <button className="btn btn-ghost" onClick={weiter}>التالي ↵</button>
            ) : (
              <button className="btn btn-primary" onClick={antworten}>⟶</button>
            )}
          </div>
          {flash?.ok && <div style={{ color: "var(--color-a1)", fontWeight: 900, fontSize: "0.72rem", marginTop: 3 }}>✓ تصفير — انتقل!</div>}
        </div>
      )}

      {zustand === "lauf" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <button className="btn btn-ghost" style={{ fontSize: "0.72rem" }} onClick={beenden}>
            ⏹ إنهاء الجولة الآن
          </button>
        </div>
      )}

      {/* النتيجة */}
      {zustand === "ende" && (
        <div style={{ marginTop: 8, borderRadius: 14, padding: "0.8rem 1rem", background: "var(--color-paper2)", display: "grid", gap: 6 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }} dir="rtl">
            <span style={{ fontSize: "1.9rem", fontWeight: 900, color: score.hits >= 10 ? "var(--color-a1)" : "var(--color-cola)" }}>{score.hits}</span>
            <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>إصابة من {score.n} — {score.n ? Math.round((100 * score.hits) / score.n) : 0}٪</span>
            {neuBest && <span className="chip" style={{ background: "var(--color-gold)", color: "var(--ui-on-accent)", border: 0 }}>🏆 رقم قياسي جديد!</span>}
            <span style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }}>
              {score.hits >= 10 ? `+${Math.min(12, score.hits) + 3} XP — سرعة الامتحان وصلت، وهذا هو الهدف.` : `+${Math.min(12, score.hits)} XP`}
            </span>
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--color-ink2)" }} dir="rtl">
            {score.n >= 6 && score.hits / score.n < 0.5
              ? "⚠️ دقّة أقل من النصف: أبطئ قليلاً واقرأ السؤال حتى النهاية — السرعة فوق أساس رطب تنزلق."
              : deck === "fehler"
              ? "كل صواب هنا صفّى بطاقة من دفترك فعلياً وأزاحها من مواعيد المراجعة."
              : "غداً تبذر الدقيقة بطاقات أخرى — الرقعة لا تُحفظ مواضعها."}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={() => starten(deck)}>⚡ جولة أخرى</button>
            <button className="btn btn-ghost" onClick={() => setZustand("idle")}>↩ الرقع</button>
          </div>
        </div>
      )}
    </div>
  );
}
