"use client";
// 🎧 Diktat-Bootcamp — إملاء متدرّج (جمل قصيرة ← طويلة) بتصحيح فوري
import { useRef, useState } from "react";
import type { Progress } from "@/lib/types";
import { sentences, diktatSrc } from "@/lib/content";
import { levelOf, pickN, rng } from "@/lib/plan";
import { normalize } from "@/lib/grader";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny } from "@/lib/speech";
import { konfidenz } from "@/lib/grader";
import { VertrauensBalken, AntwortDiff } from "./ui";
import { De } from "./De";

export function DiktatBootcamp({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const level = levelOf(Math.min(progress.plan.day, 270));
  const [items] = useState(() => {
    const pool = [...sentences.filter((s) => s.level === level)].sort((a, b) => a.de.length - b.de.length);
    const half = Math.max(1, Math.ceil(pool.length / 2));
    const seed = Date.now() % 2147483647;
    // تدرّج حتمي داخل الجلسة: قصيرة أولاً ثم طويلة
    return [...pickN(pool.slice(0, half), 4, rng(seed)), ...pickN(pool.slice(half), 4, rng(seed + 9))];
  });
  const [idx, setIdx] = useState(0);
  const [inp, setInp] = useState("");
  const [state, setState] = useState<null | { ok: boolean }>(null);
  const [score, setScore] = useState({ s: 0, t: 0 });

  const it = items[idx];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hmac, setHmac] = useState(0);
  const src = it ? diktatSrc(it.id) : null;
  const horen = () => {
    if (!it || hmac >= 3) return;
    setHmac((h) => h + 1);
    const el = audioRef.current;
    if (src && el) {
      el.currentTime = 0;
      el.playbackRate = progress.settings.rate ?? 0.9;
      const pr = el.play();
      if (pr && typeof pr.catch === "function") pr.catch(() => {});
    } else speakAny(it.de);
  };
  const pruefen = () => {
    if (state || !it) return;
    const ok = normalize(inp) === normalize(it.de);
    setState({ ok });
    setScore((sc) => ({ s: sc.s + (ok ? 1 : 0), t: sc.t + 1 }));
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 3 : 1) }), "Schreiben", ok));
    if (!ok) {
      addFehlerNow({
        falsch: inp.trim() || "(leer)",
        richtig: it.de,
        art: "schreibung",
        ar: `إملاء — المعنى: ${it.ar}`,
        quelle: "Diktat-Bootcamp",
      });
    }
  };
  const weiter = () => {
    audioRef.current?.pause();
    setHmac(0);
    setState(null);
    setInp("");
    if (idx === items.length - 1) update((p) => checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 10 }));
    setIdx((i) => i + 1);
  };

  if (idx >= items.length)
    return (
      <div style={{ textAlign: "center", padding: "0.8rem" }}>
        <strong>
          ✅ انتهى الإملاء — <span className="rtl-num">{score.s}</span>/<span className="rtl-num">{score.t}</span>
        </strong>
        <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>ما فاتك سجّله المحرّك في دفتر الأخطاء بفئة «كتابة وهزات».</div>
        <button className="btn btn-ghost" style={{ marginTop: "0.5rem" }} onClick={() => window.location.reload()}>
          🔁 جولة جديدة
        </button>
      </div>
    );

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🎧 Diktat-Bootcamp — تدرّج من القصير إلى الطويل</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
        <span className="rtl-num">{idx + 1}</span>/8 — اضغط 🔊 حتى 3 مرات ثم اكتب ما سمعته بالضبط.
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.4rem" }}>
        {src ? <>🔊 <strong>صوتٌ من الدار</strong> — ملف المصنع يُخدَم من public/</> : <>📟 لا ملف لهذه الجملة بعد — صوتُ الجهاز احتياطٌ معلن</>}
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-gold" onClick={horen} disabled={hmac >= 3}>🔊 اسمع — {3 - hmac}/3</button>
        {src && <audio ref={audioRef} src={src} preload="auto" />}
        <input
          className="field"
          style={{ direction: "ltr", flex: 1, minWidth: "12rem" }}
          placeholder="Schreibe, was du hörst …"
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
            <strong style={{ color: "var(--color-a1)" }}>✅ مسموع تماماً — أحسنت!</strong>
          ) : (
            <>
              <strong style={{ color: "var(--color-cola)" }}>❌ الصواب:</strong>{" "}
              <De style={{ fontWeight: 800 }}>{it.de}</De>
              <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{it.ar}</div>
              <AntwortDiff gegeben={inp} referenz={it.de} />
            </>
          )}
          <div style={{ marginTop: "0.3rem" }}>
            <VertrauensBalken wert={konfidenz(inp, it.de)} />
          </div>
        </div>
      )}
    </div>
  );
}
