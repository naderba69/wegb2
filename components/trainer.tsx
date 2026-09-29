"use client";
// 🏋️ تدريبات المحترفين — Konjugationstrainer + Sprechtraining بالتعرف على الصوت
import { useMemo, useRef, useState } from "react";
import type { Progress } from "@/lib/types";
import { verben, type VerbParadigmen, sentences } from "@/lib/content";
import { levelOf, pickN, rng } from "@/lib/plan";
import { normalize } from "@/lib/grader";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny, listenDe, recognitionAvailable } from "@/lib/speech";
import { DiktatBootcamp } from "./diktat";
import { SchreibWerkstatt } from "./schreiben";
import { GrammatikArena } from "./arena";
import { De } from "./De";

const PERSONEN = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
type Zeit = "präsens" | "perfekt" | "präteritum" | "konj2";
const ZEIT_LABEL: Record<Zeit, string> = {
  präsens: "Präsens",
  perfekt: "Perfekt",
  präteritum: "Präteritum",
  konj2: "Konjunktiv II",
};

export function form(v: VerbParadigmen, zeit: Zeit, p: number): string {
  if (zeit === "perfekt") {
    const aux = v.aux === "sein" ? ["bin", "bist", "ist", "sind", "seid", "sind"] : ["habe", "hast", "hat", "haben", "habt", "haben"];
    return `${aux[p]} ${v.part}`;
  }
  const base = zeit === "präsens" ? v.präs : zeit === "präteritum" ? v.prt : v.konj;
  return base[p] ?? base[0];
}

interface KonjItem {
  v: VerbParadigmen;
  zeit: Zeit;
  p: number;
  expected: string;
}

function buildKonjItems(seed: number): KonjItem[] {
  const rand = rng(seed);
  const items: KonjItem[] = [];
  const ziten: Zeit[] = ["präsens", "perfekt", "präteritum", "konj2"];
  for (let i = 0; i < 10; i++) {
    const v = pickN(verben, 1, rand)[0];
    const zeit = ziten[Math.floor(rand() * ziten.length)];
    const pMax = zeit === "konj2" ? 3 : 6;
    const p = Math.floor(rand() * pMax);
    items.push({ v, zeit, p, expected: form(v, zeit, p) });
  }
  return items;
}

export function KonjTrainer() {
  const { update } = useProgress();
  const [items] = useState<KonjItem[]>(() => buildKonjItems(Date.now() % 2147483647));
  const [idx, setIdx] = useState(0);
  const [inp, setInp] = useState("");
  const [state, setState] = useState<null | { ok: boolean }>(null);
  const [score, setScore] = useState({ s: 0, t: 0 });

  const it = items[idx];
  const pruefen = () => {
    if (state || !it) return;
    const ok = normalize(inp) === normalize(it.expected);
    setState({ ok });
    setScore((sc) => ({ s: sc.s + (ok ? 1 : 0), t: sc.t + 1 }));
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 3 : 1) }), "Grammatik", ok));
    if (!ok) {
      addFehlerNow({
        falsch: `${it.v.inf} (${PERSONEN[it.p]}, ${ZEIT_LABEL[it.zeit]}): ${inp.trim() || "(leer)"}`,
        richtig: it.expected,
        art: "zeitform",
        ar: `تصريف ${it.v.inf} في ${ZEIT_LABEL[it.zeit]} مع ${PERSONEN[it.p]}`,
        quelle: "تدريب التصريف",
      });
    }
  };
  const weiter = () => {
    setState(null);
    setInp("");
    if (idx === items.length - 1) update((p) => checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 10 }));
    setIdx((i) => Math.min(i + 1, items.length));
  };

  if (idx >= items.length)
    return (
      <div style={{ textAlign: "center", padding: "0.8rem" }}>
        <strong>
          ✅ انتهى التصريب — <span className="rtl-num">{score.s}</span>/<span className="rtl-num">{score.t}</span>
        </strong>
        <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>الأخطاء في دفتر الأخطاء بفئة «الأزمنة والأفعال».</div>
        <button className="btn btn-ghost" style={{ marginTop: "0.5rem" }} onClick={() => window.location.reload()}>
          🔁 جولة جديدة
        </button>
      </div>
    );

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>Conjugation — {it.v.inf}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
        <span className="rtl-num">{idx + 1}</span>/10 · {PERSONEN[it.p]} · <strong>{ZEIT_LABEL[it.zeit]}</strong> · aux: {it.v.aux}
            </div>
      {(it.v.ar || it.v.praep || it.v.trenn) ? (
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.4rem", fontSize: "0.8rem" }}>
          {it.v.ar ? <span className="chip" style={{ padding: "0.25rem 0.6rem" }}>{it.v.ar}</span> : null}
          {it.v.trenn ? <span className="chip" style={{ padding: "0.25rem 0.6rem" }}>تُنفصَل «{it.v.trenn}»</span> : null}
          {it.v.praep ? <span className="chip" style={{ padding: "0.25rem 0.6rem", background: "var(--color-gold-soft)" }}>يتعدّى: {it.v.praep}</span> : null}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          className="field"
          style={{ direction: "ltr", flex: 1, minWidth: "12rem" }}
          placeholder="Form hier …"
          value={inp}
          disabled={!!state}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pruefen()}
        />
        {!state ? (
          <button className="btn btn-primary" disabled={!inp.trim()} onClick={pruefen}>
            تحقّق
          </button>
        ) : (
          <button className="btn btn-gold" onClick={weiter}>
            التالي ←
          </button>
        )}
      </div>
      {state && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.92rem" }}>
          {state.ok ? (
            <strong style={{ color: "var(--color-a1)" }}>✅ صحيح!</strong>
          ) : (
            <>
              <strong style={{ color: "var(--color-cola)" }}>❌ الصواب:</strong>{" "}
              <De style={{ fontWeight: 800 }}>{it.expected}</De>
              <button className="chip" style={{ cursor: "pointer", marginInlineStart: "0.5rem" }} onClick={() => speakAny(it.expected)}>
                🔊
              </button>
            </>
          )}
          {it.v.bei ? (
            <div style={{ marginTop: "0.45rem", fontSize: "0.86rem", lineHeight: 1.9 }}>
              <De style={{ display: "block" }}>„{it.v.bei.de}“</De>
              <span style={{ color: "var(--color-ink2)" }}>{it.v.bei.ar}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function SprechTrainer({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const level = levelOf(Math.min(progress.plan.day, 270));
  const [items] = useState(() => pickN(sentences.filter((s) => s.level === level), 5, rng((Date.now() % 2147483647) + 3)));
  const [idx, setIdx] = useState(0);
  const [heard, setHeard] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const stopRef = useRef<null | (() => void)>(null);
  const available = useMemo(() => recognitionAvailable(), []);

  const s = items[idx];
  const ratio = (a: string, b: string) => {
    const aw = normalize(a).split(" ").filter(Boolean);
    const bw = normalize(b).split(" ").filter(Boolean);
    if (!aw.length || !bw.length) return 0;
    const hit = aw.filter((w) => bw.includes(w)).length;
    return hit / Math.max(aw.length, bw.length);
  };
  const score = heard !== null ? Math.round(ratio(heard, s!.de) * 100) : null;

  const startListen = () => {
    if (listening) return;
    setHeard(null);
    setListening(true);
    stopRef.current = listenDe(
      (text) => {
        setHeard(text);
        const r = text ? ratio(text, s!.de) : 0;
        update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (r >= 0.7 ? 4 : 1) }), "Sprechen", r >= 0.7));
        if (r < 0.7) {
          addFehlerNow({
            falsch: text ? `نطق: ${text}` : "(لم يُسمع شيء)",
            richtig: s!.de,
            art: "schreibung",
            ar: `تدريب النطق — الجملة الصحيحة: ${s!.ar}`,
            quelle: "تدريب النطق",
          });
        }
      },
      () => setListening(false)
    );
  };

  const weiter = () => {
    stopRef.current?.();
    setHeard(null);
    setIdx((i) => Math.min(i + 1, items.length));
  };

  if (!items.length) return null;
  if (idx >= items.length)
    return (
      <div style={{ textAlign: "center", padding: "0.8rem" }}>
        <strong>✅ أنهيت تدريب النطق — أحسنت!</strong>
      </div>
    );

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>Sprechtraining — كرّر الجملة</div>
      {!available && (
        <div style={{ fontSize: "0.85rem", color: "var(--color-cola)", marginBottom: "0.4rem" }}>
          ⚠️ متصفحك لا يدعم التعرّف على الصوت (جرّب Chrome) — التدريب يتحوّل إلى وضع المقارنة الذاتية.
        </div>
      )}
      <div className="card" style={{ padding: "0.6rem 0.8rem", marginBottom: "0.5rem" }}>
        <De style={{ fontWeight: 700 }}>{s!.de}</De>
        <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{s!.ar}</div>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => speakAny(s!.de)}>🔊 اسمع النموذج</button>
        <button className="btn btn-primary" onClick={startListen} disabled={listening}>
          {listening ? "🎙️ يسمع…" : "🎙️ كرّر الآن"}
        </button>
        {heard !== null && (
          <button className="btn btn-gold" onClick={weiter}>
            {idx === items.length - 1 ? "أنهِ ✓" : "التالي ←"}
          </button>
        )}
      </div>
      {heard !== null && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.92rem" }}>
          <div>
            سمعتُ: <span className="de">{heard || "…"}</span>
          </div>
          <div style={{ marginTop: "0.2rem" }}>
            المطابقة:{" "}
            <strong style={{ color: (score ?? 0) >= 70 ? "var(--color-a1)" : "var(--color-cola)" }} className="rtl-num">
              {score}%
            </strong>{" "}
            {(score ?? 0) >= 70 ? " — ممتاز! ✅" : " — أعد المحاولة بعد الاستماع للنموذج."}
          </div>
        </div>
      )}
    </div>
  );
}

/** بطاقة التدريبات الإضافية على الصفحة الرئيسية */
export function UebungenCard({ progress }: { progress: Progress }) {
  return (
    <details className="card" style={{ padding: "0.8rem 1.1rem" }}>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>🏋️ تدريبات المحترفين — تصريف + نطق (اضغط للفتح)</summary>
      <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.7rem" }}>
        <KonjTrainer />
        <DiktatBootcamp progress={progress} />
        <GrammatikArena progress={progress} />
        <SchreibWerkstatt progress={progress} />
        <SprechTrainer progress={progress} />
      </div>
    </details>
  );
}
