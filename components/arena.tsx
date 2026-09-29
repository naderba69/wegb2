"use client";
// 🥊 Grammatik-Arena — ثلاثة ميادين: تعداد الأدوات · الروابط · المجهول (MC حتمي)
import { useState } from "react";
import type { Progress } from "@/lib/types";
import { arenaMap } from "@/lib/content";
import { pickN, rng } from "@/lib/plan";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny } from "@/lib/speech";
import { De } from "./De";

type Mode = "deklination" | "konnektoren" | "passiv";

const ARTIKEL: Record<string, Record<string, string>> = {
  m: { Nom: "der", Gen: "des", Dat: "dem", Akk: "den" },
  f: { Nom: "die", Gen: "der", Dat: "der", Akk: "die" },
  n: { Nom: "das", Gen: "des", Dat: "dem", Akk: "das" },
  pl: { Nom: "die", Gen: "der", Dat: "den", Akk: "die" },
};
const GEN_LABEL: Record<string, string> = { m: "der", f: "die", n: "das", pl: "die (Plural)" };
const Faelle = ["Nom", "Gen", "Dat", "Akk"] as const;

interface Item {
  promptDe: string;
  promptAr?: string;
  options: string[];
  answer: string;
  ar: string;
  speak?: string;
  art: string;
}

function buildItems(mode: Mode, seed: number): Item[] {
  const rand = rng(seed);
  if (mode === "deklination") {
    return pickN(arenaMap.nomen, 10, rand).map((n, i) => {
      const kasus = Faelle[Math.floor(rand() * Faelle.length)];
      const correct = ARTIKEL[n.gen][kasus];
      const alle = ["der", "die", "das", "dem", "den", "des"];
      const wrong = pickN(alle.filter((a) => a !== correct), 3, rand);
      return {
        promptDe: `___ ${n.wort} — ${kasus} (${GEN_LABEL[n.gen]} ${n.wort})`,
        promptAr: `${n.ar} — اختر الأداة الصحيحة للحالة`,
        options: pickN([correct, ...wrong], 4, rand),
        answer: correct,
        ar: `${GEN_LABEL[n.gen]} في ${kasus} = ${correct}`,
        speak: `${correct} ${n.wort}`,
        art: "artikel",
      };
    });
  }
  if (mode === "konnektoren") {
    return pickN(arenaMap.konnektoren, 10, rand).map((k) => ({
      promptDe: k.satz,
      promptAr: "أي رابط يملأ الفراغ؟",
      options: pickN(k.options, k.options.length, rand),
      answer: k.answer,
      ar: k.ar,
      speak: k.satz.replace("___", k.answer),
      art: "konstruktion",
    }));
  }
  return pickN(arenaMap.passiv, 10, rand).map((p) => ({
    promptDe: `Passiv: ${p.aktiv}`,
    promptAr: "أي صيغة مجهولة صحيحة؟",
    options: pickN(p.options, p.options.length, rand),
    answer: p.answer,
    ar: p.ar,
    speak: p.answer,
    art: "zeitform",
  }));
}

const MODE_LABEL: Record<Mode, string> = {
  deklination: "🃏 الأدوات والحالات",
  konnektoren: "🔗 الروابط",
  passiv: "🔁 المجهول (Passiv)",
};

export function GrammatikArena({ progress: _progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [mode, setMode] = useState<Mode>("deklination");
  const [items, setItems] = useState<Item[]>(() => buildItems("deklination", Date.now() % 2147483647));
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<null | { choice: string; ok: boolean }>(null);
  const [score, setScore] = useState({ s: 0, t: 0 });

  const it = items[idx];
  const wähle = (m: Mode) => {
    setMode(m);
    setItems(buildItems(m, (Date.now() % 2147483647) + m.length));
    setIdx(0);
    setState(null);
    setScore({ s: 0, t: 0 });
  };
  const pruefen = (choice: string) => {
    if (state || !it) return;
    const ok = choice === it.answer;
    setState({ choice, ok });
    setScore((sc) => ({ s: sc.s + (ok ? 1 : 0), t: sc.t + 1 }));
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 3 : 1) }), "Grammatik", ok));
    if (!ok) {
      addFehlerNow({
        falsch: `${it.promptDe} → ${choice}`,
        richtig: it.answer,
        art: it.art,
        ar: it.ar,
        quelle: "Grammatik-Arena",
      });
    }
  };
  const weiter = () => {
    setState(null);
    if (idx === items.length - 1) update((p) => checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 10 }));
    setIdx((i) => i + 1);
  };

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.4rem" }}>🥊 Grammatik-Arena — 10 أسئلة في الميدان</div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
        {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
          <button
            key={m}
            className="chip"
            style={{ cursor: "pointer", background: m === mode ? "var(--color-cola)" : "white", color: m === mode ? "white" : undefined }}
            onClick={() => wähle(m)}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>
      {idx >= items.length ? (
        <div style={{ textAlign: "center", padding: "0.6rem" }}>
          <strong>
            ✅ انتهى الميدان — <span className="rtl-num">{score.s}</span>/<span className="rtl-num">{score.t}</span>
          </strong>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>الفخاخ وقعت في دفتر الأخطاء بفئتها الصحيحة.</div>
          <button className="btn btn-ghost" style={{ marginTop: "0.4rem" }} onClick={() => wähle(mode)}>🔁 جولة جديدة</button>
        </div>
      ) : (
        <div className="card" style={{ padding: "0.7rem 0.9rem" }}>
          <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
            <span className="rtl-num">{idx + 1}</span>/10 · <De>{it.promptDe}</De>
            {it.promptAr && <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", fontWeight: 400 }}>{it.promptAr}</div>}
          </div>
          <div style={{ display: "grid", gap: "0.3rem" }}>
            {it.options.map((o) => (
              <button
                key={o}
                className="btn btn-ghost"
                style={{
                  justifyContent: "flex-start",
                  textAlign: "start",
                  direction: "ltr",
                  background: state ? (o === it.answer ? "var(--color-a1)" : o === state.choice ? "var(--color-cola-soft)" : "white") : "white",
                  color: state && o === it.answer ? "white" : undefined,
                }}
                disabled={!!state}
                onClick={() => pruefen(o)}
              >
                {o}
              </button>
            ))}
          </div>
          {state && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.92rem" }}>
              {state.ok ? <strong style={{ color: "var(--color-a1)" }}>✅ إصابة!</strong> : <strong style={{ color: "var(--color-cola)" }}>❌ تذكّر:</strong>} {it.ar}
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem" }}>
                <button className="chip" style={{ cursor: "pointer" }} onClick={() => speakAny(it.speak ?? it.answer)}>🔊 الصيغة</button>
                <button className="btn btn-gold" style={{ padding: "0.2rem 0.8rem" }} onClick={weiter}>التالي ←</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
