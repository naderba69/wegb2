"use client";
// 🧩 بنك الأسئلة التراكمي — PrüfungsZentrum (Modul M) داخل جناح الامتحان
// أربعة أنماط في محرّك واحد مدمج (لا أدوات شاردة):
//   ① صح/خطأ مولَّد حتمياً من الموسوعة (تشويه: ترتيب · كلمة · أداة)
//   ② ترتيب حوار (استعادة تسلسل الأدوار)
//   ③ اختبار أسبوعي تراكمي (مادة الأسابيع الفائتة مجتمعة)
//   ④ محاكاة شهرية ببذرة رقمية (نفس البذرة ← نفس النموذج)
// كل محاولة تمرّ بخطّي الأنبوب: شبكة الكفاءات (logK) ودفتر الأخطاء (addFehlerNow).
import { useMemo, useRef, useState } from "react";
import type { Exercise, Level, Progress, Satz, VocabCard } from "@/lib/types";
import { sentences, texts, dialogues, grammarMap, vocabMap, dialogAudioSrc, leseText } from "@/lib/content";
import { levelOf, pickN, rng, clozeFromSatz } from "@/lib/plan";
import { normalize, konfidenz } from "@/lib/grader";
import { klausurNote } from "@/lib/klausur";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK, KOMPETENZ_AR } from "@/lib/kompetenz";
import { speakAny } from "@/lib/speech";
import { VertrauensBalken, AntwortDiff } from "./ui";
import { De } from "./De";

function gradeItem(ex: Exercise, resp: string): boolean {
  if (!resp.trim()) return false;
  if (ex.type === "mc") return resp === ex.answer;
  const n = normalize(resp);
  const answers = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
  return answers.some((a) => normalize(String(a)) === n);
}

function poolVon<T extends { level: Level }>(arr: T[], lvl: Level): T[] {
  const g = arr.filter((x) => x.level === lvl);
  return g.length >= 4 ? g : arr;
}

const KARTEN: VocabCard[] = Object.values(vocabMap as Record<string, { cards: VocabCard[] }>).flatMap((g) => g.cards);

// ───────────────────────── ① صح/خطأ مولَّد ─────────────────────────
type Aussage = { text: string; wahr: boolean; richtig?: string; art?: string; hinweisAr?: string };

const ARTIKEL_MAP: Record<string, string> = { der: "die", die: "das", das: "der", ein: "eine", eine: "ein", einen: "ein", dem: "den", den: "dem" };

function mutiere(de: string, rand: () => number, pool: Satz[]): Aussage | null {
  const words = de.split(/\s+/);
  if (words.length < 5) return null;
  const mode = Math.floor(rand() * 3);
  const i1 = 1 + Math.floor(rand() * Math.max(1, words.length - 3));
  if (mode === 0) {
    const w = [...words];
    [w[i1], w[i1 + 1]] = [w[i1 + 1], w[i1]];
    return { text: w.join(" "), wahr: false, richtig: de, art: "wortstellung", hinweisAr: "ترتيب مقلوب: لاحظ موقع الفعل في الجملة الألمانية." };
  }
  if (mode === 1) {
    const kandidaten = pool
      .flatMap((s) => s.de.split(/\s+/))
      .map((w) => w.replace(/[.,!?;:„“"']/g, ""))
      .filter((w) => w.length >= 5);
    if (!kandidaten.length) return null;
    const fremd = kandidaten[Math.floor(rand() * kandidaten.length)];
    if (fremd.toLowerCase() === words[i1].toLowerCase()) return null;
    const w = [...words];
    w[i1] = fremd;
    return { text: w.join(" "), wahr: false, richtig: de, art: "wortschatz", hinweisAr: "كلمة مُغتالة من سياق آخر — انتبه للمعنى الدقيق." };
  }
  const idx = words.findIndex((w) => ARTIKEL_MAP[w.toLowerCase().replace(/[.,!?;:]/g, "")] !== undefined);
  if (idx < 0) {
    const w = [...words];
    [w[i1], w[i1 + 1]] = [w[i1 + 1], w[i1]];
    return { text: w.join(" "), wahr: false, richtig: de, art: "wortstellung", hinweisAr: "ترتيب مقلوب: الفعل له موقعه الثابت." };
  }
  const w = [...words];
  const roh = w[idx].toLowerCase().replace(/[.,!?;:]/g, "");
  const neu = ARTIKEL_MAP[roh];
  w[idx] = w[idx].replace(new RegExp(roh, "i"), neu);
  return { text: w.join(" "), wahr: false, richtig: de, art: "artikel", hinweisAr: "أداة غير ملائمة للجنس أو للإعراب." };
}

function bauAussagen(tag: number, lvl: Level, rnd: () => number): Aussage[] {
  const pool = poolVon(sentences, lvl);
  const gezogen = pickN(pool, 8, rnd);
  const out: Aussage[] = [];
  for (const s of gezogen) {
    const falsch = rnd() < 0.55 && out.filter((a) => !a.wahr).length < 5;
    const m = falsch ? mutiere(s.de, rnd, pool) : null;
    if (m) out.push(m);
    else out.push({ text: s.de, wahr: true });
  }
  // توازن مضمون: على الأقل 3 صحيحة و3 خاطئة
  if (out.filter((a) => !a.wahr).length < 3) {
    for (let i = out.length - 1; i >= 0 && out.filter((a) => !a.wahr).length < 3; i--) {
      if (out[i].wahr) {
        const m = mutiere(out[i].text, rnd, pool);
        if (m) out[i] = m;
      }
    }
  }
  return out;
}

function WahrFalsch({ level, onFertig }: { level: Level; onFertig: (ok: number, n: number) => void }) {
  const { update } = useProgress();
  const [runde, setRunde] = useState(0);
  const [i, setI] = useState(0);
  const [okN, setOkN] = useState(0);
  const [antwort, setAntwort] = useState<null | boolean>(null);
  const aussagen = useMemo(() => bauAussagen(runde + 1, level, rng(runde * 997 + 31)), [runde, level]);
  const a = aussagen[i];
  if (!a) return null;

  const waehle = (mein: boolean) => {
    if (antwort !== null) return;
    const ok = mein === a.wahr;
    setAntwort(mein);
    if (ok) setOkN((n) => n + 1);
    update((p) =>
      logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 2 : 1) }), a.art === "wortschatz" ? "Wortschatz" : "Grammatik", ok)
    );
    if (!ok) {
      addFehlerNow({
        falsch: a.text,
        richtig: a.richtig ?? a.text,
        art: a.art ?? "sonst",
        ar: a.hinweisAr ?? "من بنك الأسئلة: صح/خطأ",
        quelle: "PrüfungsZentrum",
      });
    }
  };

  const weiter = () => {
    setAntwort(null);
    if (i + 1 < aussagen.length) setI(i + 1);
    else {
      onFertig(okN, aussagen.length);
      setRunde((r) => r + 1);
      setI(0);
      setOkN(0);
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        العبارة <span className="rtl-num">{i + 1}</span>/<span className="rtl-num">{aussagen.length}</span> — أصحيح أم مزوَّرة بالتشويه؟
      </div>
      <div className="card" style={{ padding: "1rem 1.2rem", fontSize: "1.12rem", fontWeight: 700, lineHeight: 1.9 }}>
        <De>{a.text}</De>
      </div>
      {antwort === null ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => waehle(true)}>✅ صحيح — wahr</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => waehle(false)}>❌ مزوَّر — falsch</button>
        </div>
      ) : (
        <div className="card" style={{ padding: "0.8rem 1rem", borderInlineStart: `5px solid ${(antwort === a.wahr) ? "var(--color-a1)" : "var(--color-mid)"}`, fontSize: "0.9rem", lineHeight: 1.8 }}>
          {(antwort === a.wahr) ? "✅ أصبتَ! " : "⚠️ "}
          العبارة <strong>{a.wahr ? "صحيحة" : "مزوَّرة"}</strong>
          {!a.wahr && a.hinweisAr && <> — {a.hinweisAr}</>}
          {!a.wahr && a.richtig && (
            <div style={{ marginTop: "0.3rem" }}>
              الصواب: <De>{a.richtig}</De>
            </div>
          )}
          <div style={{ marginTop: "0.5rem", textAlign: "end" }}>
            <button className="btn btn-primary" onClick={weiter}>{i + 1 < aussagen.length ? "التالي ←" : "أنهِ الجولة ✓"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────── ② ترتيب حوار ─────────────────────────
export function DialogOrdnung({ level, onFertig }: { level: Level; onFertig: (ok: number, n: number) => void }) {
  const { update } = useProgress();
  const [runde, setRunde] = useState(0);
  const [wahl, setWahl] = useState<number[]>([]);
  const [geprueft, setGeprueft] = useState(false);
  const dlg = useMemo(() => {
    const pool = poolVon(dialogues, level).filter((d) => d.lines.length >= 4);
    const d = pickN(pool, 1, rng(runde * 733 + 7))[0] ?? dialogues[0];
    const n = Math.min(5, d.lines.length);
    const rnd = rng(runde * 191 + 13);
    const idxs = d.lines.map((_, i) => i).slice(0, n);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return { d, n, gemischt: idxs };
  }, [runde, level]);
  const { d, n, gemischt } = dlg;
  if (!d) return null;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const src = dialogAudioSrc(d.id);

  const fertig = wahl.length === n;
  const punkte = geprueft ? wahl.filter((v, i) => v === i).length : 0;

  const pruefe = () => {
    setGeprueft(true);
    const ok = punkte / n >= 0.6;
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (punkte === n ? 10 : 4) }), "Lesen", ok));
    if (punkte < n) {
      addFehlerNow({
        falsch: `ترتيب حوار: ${punkte}/${n} مراكز صحيحة`,
        richtig: d.lines.slice(0, n).map((l) => l.who).join(" ← "),
        art: "wortstellung",
        ar: "تسلسل الأدوار في الحوار: من يفتتح؟ ما امتداد الردّ؟ لاحظ مفاتيح الربط.",
        quelle: "Dialog-Ordnung",
      });
    }
    onFertig(punkte, n);
  };
  const neu = () => {
    setRunde((r) => r + 1);
    setWahl([]);
    setGeprueft(false);
  };

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
        <De>{d.titleDe}</De> — <span style={{ color: "var(--color-ink2)", fontWeight: 400 }}>أعد بناء تسلسل الأدوار {n} بالضغط بالترتيب</span>
      </div>
      {!geprueft &&
        gemischt.map((orig) => {
          const schon = wahl.indexOf(orig);
          return (
            <button
              key={orig}
              className="card"
              style={{ padding: "0.6rem 0.9rem", textAlign: "start", cursor: schon < 0 ? "pointer" : "default", opacity: schon < 0 ? 1 : 0.45, background: "var(--color-card)", border: "1px solid var(--color-line)" }}
              disabled={schon >= 0}
              onClick={() => setWahl((w) => [...w, orig])}
            >
              <strong>{schon >= 0 ? `#${schon + 1} ` : "▢ "}</strong>
              <strong style={{ color: "var(--color-cola)" }}>{d.lines[orig].who}:</strong> <De>{d.lines[orig].de}</De>
            </button>
          );
        })}
      {geprueft && (
        <div className="card" style={{ padding: "0.8rem 1rem", fontSize: "0.9rem", lineHeight: 1.9 }}>
          <strong>الترتيب الصحيح — {punkte}/{n}</strong>
          {d.lines.slice(0, n).map((l, i) => (
            <div key={i} style={{ opacity: wahl[i] === i ? 1 : 0.75 }}>
              {wahl[i] === i ? "✅" : "❌"} <strong>{i + 1}. {l.who}:</strong> <De>{l.de}</De>
              <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>{l.ar}</div>
            </div>
          ))}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <button
              className="btn btn-ghost"
              style={{ minHeight: 44, padding: "0.4rem 0.9rem" }}
              onClick={() => {
                const el = audioRef.current;
                if (src && el) { el.currentTime = 0; const pr = el.play(); if (pr) pr.catch(() => speakAny(d.lines.map((l) => l.de).join(" "))); }
                else speakAny(d.lines.map((l) => l.de).join(" "));
              }}
            >
              ▶️ استمع للحوار كاملًا {src ? "" : "(بصوت المتصفح — الملفُّ لم يُفرَغ بعد)"}
            </button>
            <button className="btn btn-primary" style={{ minHeight: 44 }} onClick={neu}>حوار جديد ←</button>
          </div>
          {src && <audio ref={audioRef} src={src} preload="none" />}
        </div>
      )}
      {!geprueft && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-ghost" disabled={!wahl.length} onClick={() => setWahl((w) => w.slice(0, -1))}>↩ تراجع</button>
          <button className="btn btn-gold" style={{ flex: 1 }} disabled={!fertig} onClick={pruefe}>تحقّق من الترتيب ✓</button>
        </div>
      )}
    </div>
  );
}

// ───────────────────────── ③ اختبار أسبوعي تراكمي ─────────────────────────
type QItem = { ex: Exercise; kat: "Wortschatz" | "Grammatik"; label: string };

function bauWochenTest(woche: number, lvl: Level): QItem[] {
  const rnd = rng(woche * 613 + 41);
  const items: QItem[] = [];
  const vk = pickN(KARTEN, 4, rnd);
  for (const k of vk) {
    const distr = pickN(KARTEN.filter((x) => x.id !== k.id), 3, rnd).map((x) => x.ar);
    const options = pickN([k.ar, ...distr], 4, rnd);
    items.push({
      kat: "Wortschatz",
      label: "مفردات الأسابيع الفائتة",
      ex: { id: `w-${k.id}`, type: "mc", promptDe: k.de, promptAr: "ما معنى هذه الكلمة؟", options, answer: k.ar, explanationAr: `${k.de} = ${k.ar}${k.exampleDe ? ` · مثال: ${k.exampleDe}` : ""}` },
    });
  }
  const saetze = pickN(poolVon(sentences, lvl), 3, rnd);
  saetze.forEach((s, i) => items.push({ kat: "Grammatik", label: "قواعد في سياق (Cloze)", ex: clozeFromSatz(s, i, rnd) }));
  const themen = Object.values(grammarMap).filter((g) => g.level === lvl);
  const gez = pickN(themen.length ? themen : Object.values(grammarMap), 3, rnd);
  for (const g of gez) {
    const ex = pickN(g.exercises.filter((e) => e.type === "mc"), 1, rng(Math.floor(rnd() * 1e6)))[0] ?? g.exercises[0];
    items.push({ kat: "Grammatik", label: g.titleAr, ex: { ...ex, id: `g-${g.id}-${ex.id}` } });
  }
  return items;
}

function WochenTest({ level, woche, onFertig }: { level: Level; woche: number; onFertig: (ok: number, n: number) => void }) {
  const { update } = useProgress();
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const items = useMemo(() => bauWochenTest(woche, level), [woche, level]);
  const alle = items.every((q) => (antworten[q.ex.id] ?? "").trim());
  const okN = items.filter((q) => gradeItem(q.ex, antworten[q.ex.id] ?? "")).length;

  const abgeben = () => {
    setDone(true);
    for (const q of items) {
      const ok = gradeItem(q.ex, antworten[q.ex.id] ?? "");
      if (!ok) {
        const right = Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer;
        addFehlerNow({
          falsch: antworten[q.ex.id] || "(leer)",
          richtig: String(right),
          art: q.kat === "Wortschatz" ? "wortschatz" : "sonst",
          ar: q.ex.explanationAr ?? q.ex.explanationDe ?? q.label,
          quelle: `Wochenprüfung ${woche}`,
        });
      }
    }
    const wOk = items.filter((q) => q.kat === "Wortschatz" && gradeItem(q.ex, antworten[q.ex.id] ?? "")).length;
    const gOk = items.filter((q) => q.kat === "Grammatik" && gradeItem(q.ex, antworten[q.ex.id] ?? "")).length;
    const wN = items.filter((q) => q.kat === "Wortschatz").length;
    const gN = items.length - wN;
    update((p) => {
      let q0 = logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 12 + okN }), "Wortschatz", wN > 0 && wOk / wN >= 0.6);
      return logK(q0, "Grammatik", gN > 0 && gOk / gN >= 0.6);
    });
    onFertig(okN, items.length);
  };

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
        📰 اختبار الأسبوع <span className="rtl-num">{woche}</span> — تراكمي على كل ما مرّ من الأسبوع 1
        <div style={{ fontWeight: 400, fontSize: "0.78rem", color: "var(--color-ink2)" }}>
          {items.length} أسئلة: مفردات · قواعد بالسياق · قواعد الموضوعات
        </div>
      </div>
      {items.map((q, i) => (
        <div key={q.ex.id} className="card" style={{ padding: "0.7rem 1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>{i + 1}. {q.label}</div>
          <div style={{ fontWeight: 700, margin: "0.25rem 0" }}>
            {q.ex.promptDe && <De>{q.ex.promptDe}</De>}
            {q.ex.promptAr && <div style={{ fontWeight: 400, fontSize: "0.85rem" }}>{q.ex.promptAr}</div>}
          </div>
          {q.ex.options ? (
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {q.ex.options.map((o) => {
                const gewaehlt = antworten[q.ex.id] === o;
                const richtig = done && gradeItem(q.ex, o);
                return (
                  <button
                    key={o}
                    className="chip"
                    style={{ cursor: done ? "default" : "pointer", background: richtig ? "var(--color-a1)" : gewaehlt ? "var(--color-cola)" : "white", color: richtig || gewaehlt ? "white" : undefined }}
                    disabled={done}
                    onClick={() => setAntworten((a) => ({ ...a, [q.ex.id]: o }))}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              className="input"
              style={{ width: "100%" }}
              value={antworten[q.ex.id] ?? ""}
              disabled={done}
              placeholder="اكتب الكلمة الناقصة…"
              onChange={(e) => setAntworten((a) => ({ ...a, [q.ex.id]: e.target.value }))}
            />
          )}
          {done && (
            <div style={{ fontSize: "0.8rem", marginTop: "0.3rem", color: gradeItem(q.ex, antworten[q.ex.id] ?? "") ? "var(--color-a1)" : "var(--color-mid)" }}>
              {gradeItem(q.ex, antworten[q.ex.id] ?? "") ? "✅" : `❌ الصواب: ${String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer)}`}
                  {!gradeItem(q.ex, antworten[q.ex.id] ?? "") && q.ex.type === "dictation" && (
                    <AntwortDiff gegeben={antworten[q.ex.id] ?? ""} referenz={String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer)} />
                  )}
                  {q.ex.type === "dictation" && (
                    <VertrauensBalken wert={konfidenz(antworten[q.ex.id] ?? "", String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer))} />
                  )} — {q.ex.explanationAr ?? q.ex.explanationDe}
              {!gradeItem(q.ex, antworten[q.ex.id] ?? "") && !q.ex.options && (
                <AntwortDiff gegeben={antworten[q.ex.id] ?? ""} referenz={String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer)} />
              )}
              {q.ex.type === "dictation" && (
                <VertrauensBalken wert={konfidenz(antworten[q.ex.id] ?? "", String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer))} />
              )}
            </div>
          )}
        </div>
      ))}
      {!done ? (
        <button className="btn btn-gold" disabled={!alle} onClick={abgeben}>سلّم الاختبار ({okN > 0 ? "" : ""}{items.filter((q) => (antworten[q.ex.id] ?? "").trim()).length}/{items.length}) ✓</button>
      ) : (
        <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-gold-soft)", fontWeight: 700 }}>
          📊 النتيجة: <span className="rtl-num">{okN}</span>/<span className="rtl-num">{items.length}</span> — {klausurNote(Math.round((okN / items.length) * 100)).goethe}
          <div style={{ textAlign: "end", marginTop: "0.4rem" }}>
            <button className="btn btn-primary" onClick={() => { setAntworten({}); setDone(false); }}>اختبار الأسبوع التالي ←</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────── ④ محاكاة ببذرة رقمية ─────────────────────────
type MockItem = { ex: Exercise; sec: "Lesen" | "Grammatik" | "Hoeren" };

function bauMock(saat: number, lvl: Level): MockItem[] {
  const rnd = rng(saat * 31 + 5);
  const out: MockItem[] = [];
  const ts = pickN(poolVon(texts, lvl), 2, rnd);
  for (const t of ts) for (const q of leseText(t).questions.slice(0, 2)) out.push({ sec: "Lesen", ex: { ...q, id: `m-l-${q.id}` } });
  const saetze = pickN(poolVon(sentences, lvl), 2, rnd);
  saetze.forEach((s, i) => out.push({ sec: "Grammatik", ex: { ...clozeFromSatz(s, 100 + i, rnd), id: `m-c-${s.id}` } }));
  const themen = Object.values(grammarMap).filter((g) => g.level === lvl);
  pickN(themen.length ? themen : Object.values(grammarMap), 3, rnd).forEach((g) => {
    const ex = pickN(g.exercises.filter((e) => e.type === "mc"), 1, rnd)[0] ?? g.exercises[0];
    out.push({ sec: "Grammatik", ex: { ...ex, id: `m-g-${g.id}-${ex.id}` } });
  });
  const dlgs = pickN(dialogues.filter((x) => x.dictation?.length), 1, rnd);
  const d = dlgs[0];
  if (d) for (const zeile of d.dictation.slice(0, 3)) {
    out.push({
      sec: "Hoeren",
      ex: { id: `m-h-${d.id}-${zeile.slice(0, 8)}`, type: "dictation", promptDe: "اسمع واكتب:", promptAr: d.titleAr, answer: [zeile], explanationDe: zeile },
    });
  }
  return out;
}

function MonatsMock({ level, tag }: { level: Level; tag: number }) {
  const { update } = useProgress();
  const [saat, setSaat] = useState<number>(tag * 17 + 3);
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const items = useMemo(() => bauMock(saat, level), [saat, level]);
  const alle = items.every((q) => (antworten[q.ex.id] ?? "").trim());
  const bericht = useMemo(() => {
    if (!done) return null;
    const per: Record<string, { s: number; t: number }> = { Lesen: { s: 0, t: 0 }, Grammatik: { s: 0, t: 0 }, Hoeren: { s: 0, t: 0 } };
    for (const q of items) {
      per[q.sec].t += 1;
      if (gradeItem(q.ex, antworten[q.ex.id] ?? "")) per[q.sec].s += 1;
    }
    const s = Object.values(per).reduce((a, x) => a + x.s, 0);
    const t = Object.values(per).reduce((a, x) => a + x.t, 0);
    return { per, pct: t ? Math.round((s / t) * 100) : 0, ...klausurNote(t ? Math.round((s / t) * 100) : 0) };
  }, [done, items, antworten]);

  const abgeben = () => {
    setDone(true);
    for (const q of items) {
      const ok = gradeItem(q.ex, antworten[q.ex.id] ?? "");
      if (!ok) {
        const right = Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer;
        addFehlerNow({
          falsch: antworten[q.ex.id] || "(leer)",
          richtig: String(right),
          art: q.sec === "Hoeren" ? "schreibung" : q.sec === "Lesen" ? "sonst" : "sonst",
          ar: q.ex.explanationAr ?? q.ex.explanationDe ?? "من المحاكاة بالبذرة",
          quelle: `Monats-Mock #${saat}`,
        });
      }
    }
    update((p) => {
      let q0 = p;
      for (const sec of ["Lesen", "Grammatik", "Hoeren"] as const) {
        const teile = items.filter((q) => q.sec === sec);
        const okN = teile.filter((q) => gradeItem(q.ex, antworten[q.ex.id] ?? "")).length;
        if (teile.length) q0 = logK(q0, sec === "Hoeren" ? "Hoeren" : sec, okN / teile.length >= 0.6);
      }
      return checkAbzeichen({ ...q0, xp: (q0.xp ?? 0) + 20 });
    });
  };

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
          🎲 محاكاة شهرية مصغّرة — {items.length} بنود في ~12 دقيقة
          <div style={{ fontWeight: 400, fontSize: "0.78rem", color: "var(--color-ink2)" }}>
            بذرة رقمية <span className="rtl-num">#{saat}</span> — نفس البذرة تولّد نفس النموذج بالضبط
          </div>
        </div>
        {!done && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              setSaat((s) => s + 1);
              setAntworten({});
            }}
          >
            🎲 نموذج جديد ببذرة أخرى
          </button>
        )}
      </div>
      {["Lesen", "Grammatik", "Hoeren"].map((sec) => {
        const teile = items.filter((q) => q.sec === sec);
        if (!teile.length) return null;
        const titel = sec === "Lesen" ? "📖 قراءة" : sec === "Grammatik" ? "🧩 قواعد وتركيب" : "👂 استماع وإملاء";
        return (
          <div key={sec} style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-cola)", marginTop: "0.3rem" }}>{titel}</div>
            {teile.map((q, i) => (
              <div key={q.ex.id} className="card" style={{ padding: "0.7rem 1rem" }}>
                <div style={{ fontWeight: 700, margin: "0.25rem 0", fontSize: "0.95rem" }}>
                  {q.ex.type === "dictation" ? (
                    <button className="btn btn-ghost" style={{ padding: "0.3rem 0.8rem" }} onClick={() => speakAny(q.ex.answer ? String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer) : "")}>
                      🔊 استمع ({i + 1})
                    </button>
                  ) : (
                    <De>{q.ex.promptDe ?? ""}</De>
                  )}
                  {q.ex.promptAr && q.ex.type !== "dictation" && (
                    <div style={{ fontWeight: 400, fontSize: "0.82rem", color: "var(--color-ink2)" }}>{q.ex.promptAr}</div>
                  )}
                </div>
                {q.ex.options ? (
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {q.ex.options.map((o) => {
                      const gewaehlt = antworten[q.ex.id] === o;
                      const richtig = done && gradeItem(q.ex, o);
                      return (
                        <button
                          key={o}
                          className="chip"
                          style={{ cursor: done ? "default" : "pointer", background: richtig ? "var(--color-a1)" : gewaehlt ? "var(--color-cola)" : "white", color: richtig || gewaehlt ? "white" : undefined }}
                          disabled={done}
                          onClick={() => setAntworten((a) => ({ ...a, [q.ex.id]: o }))}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    className="input"
                    style={{ width: "100%" }}
                    value={antworten[q.ex.id] ?? ""}
                    disabled={done}
                    placeholder="اكتب ما سمعته…"
                    onChange={(e) => setAntworten((a) => ({ ...a, [q.ex.id]: e.target.value }))}
                  />
                )}
                {done && (
                  <div style={{ fontSize: "0.8rem", marginTop: "0.3rem", color: gradeItem(q.ex, antworten[q.ex.id] ?? "") ? "var(--color-a1)" : "var(--color-mid)" }}>
                    {gradeItem(q.ex, antworten[q.ex.id] ?? "") ? "✅" : `❌ الصواب: ${String(Array.isArray(q.ex.answer) ? q.ex.answer[0] : q.ex.answer)}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
      {!done ? (
        <button className="btn btn-gold" disabled={!alle} onClick={abgeben}>سلّم المحاكاة ✓</button>
      ) : bericht && (
        <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-gold-soft)", lineHeight: 1.9 }}>
          <strong>📊 تقرير المحاكاة #{saat}: {bericht.pct}%</strong> — الدرجة: {bericht.note}
          <div style={{ fontWeight: 400 }}>{bericht.pct >= 60 ? "🎉 " : "⚠️ "}{bericht.goethe}</div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
            {(["Lesen", "Grammatik", "Hoeren"] as const).map((sec) =>
              bericht.per[sec].t ? (
                <span key={sec} className="chip">{sec === "Lesen" ? "📖" : sec === "Grammatik" ? "🧩" : "👂"} {KOMPETENZ_AR[sec === "Hoeren" ? "Hoeren" : sec]}: <span className="rtl-num">{bericht.per[sec].s}/{bericht.per[sec].t}</span></span>
              ) : null
            )}
          </div>
          <div style={{ textAlign: "end", marginTop: "0.4rem" }}>
            <button className="btn btn-primary" onClick={() => { setSaat((s) => s + 1); setAntworten({}); setDone(false); }}>🎲 محاكاة أخرى</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────── البطاقة الجامعة ─────────────────────────
const TABS = [
  { id: "tf", emoji: "⚖️", name: "صح/خطأ مولَّد", unter: "عبارات مزوَّرة بالتشويه" },
  { id: "dlg", emoji: "🧵", name: "ترتيب حوار", unter: "استعادة تسلسل الأدوار" },
  { id: "woche", emoji: "📰", name: "اختبار أسبوعي", unter: "تراكمي على كل ما مرّ" },
  { id: "mock", emoji: "🎲", name: "محاكاة ببذرة", unter: "نموذج مصغّر حتمي" },
] as const;

export function PruefungsZentrum({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("tf");
  const [stat, setStat] = useState({ ok: 0, n: 0 });
  const day = progress.plan.day;
  const level = levelOf(day);
  const woche = Math.max(1, Math.ceil(day / 7));

  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-b2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🧩 بنك الأسئلة التراكمي — PrüfungsZentrum <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul M)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        أربعة أنماط في محرّك واحد: عبارات مزوَّرة · ترتيب حوار · اختبار أسبوعي تراكمي · محاكاة ببذرة رقمية — كلها تُغذّي شبكة الكفاءات ودفتر الأخطاء.
      </div>
      {stat.n > 0 && (
        <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
          جولات هذه الجلسة: <span className="rtl-num">{stat.ok}</span>/<span className="rtl-num">{stat.n}</span> إجابات صحيحة
        </div>
      )}
      {open && (
        <>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className="chip"
                style={{ cursor: "pointer", background: tab === t.id ? "var(--color-cola)" : "white", color: tab === t.id ? "white" : undefined }}
                onClick={() => setTab(t.id)}
                title={t.unter}
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
          {tab === "tf" && <WahrFalsch level={level} onFertig={(ok, n) => setStat((s) => ({ ok: s.ok + ok, n: s.n + n }))} />}
          {tab === "dlg" && <DialogOrdnung level={level} onFertig={(ok, n) => setStat((s) => ({ ok: s.ok + ok, n: s.n + n }))} />}
          {tab === "woche" && <WochenTest level={level} woche={woche} onFertig={(ok, n) => setStat((s) => ({ ok: s.ok + ok, n: s.n + n }))} />}
          {tab === "mock" && <MonatsMock level={level} tag={day} />}
        </>
      )}
    </div>
  );
}
