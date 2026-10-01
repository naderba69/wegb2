"use client";
import { useMemo, useState } from "react";
import type { Hoerdialog as Dialogue } from "@/lib/types";
import { signalRadar, signalDrill, KATEGORIE_AR, type SignalTreffer } from "@/lib/signalwoerter";
import ExerciseSet from "./exercises";

/** يعلّم الكلمات الإشارية داخل سطر — «nicht am Montag, sondern am Dienstag» */
function Markiert({ de, signale }: { de: string; signale: SignalTreffer[] }) {
  if (!signale.length) return <span lang="de">{de}</span>;
  const teile: React.ReactNode[] = [];
  let pos = 0;
  signale.forEach((s, k) => {
    if (s.index > pos) teile.push(<span key={`t${k}`}>{de.slice(pos, s.index)}</span>);
    teile.push(
      <mark key={`m${k}`} title={`${KATEGORIE_AR[s.kategorie].name}: ${KATEGORIE_AR[s.kategorie].hinweis}`} style={{ background: "var(--color-gold-soft)", padding: "0 0.15em", borderRadius: 3, fontWeight: 800 }} data-testid="signal-mark">
        {de.slice(s.index, s.index + s.wort.length)}
      </mark>
    );
    pos = s.index + s.wort.length;
  });
  if (pos < de.length) teile.push(<span key="rest">{de.slice(pos)}</span>);
  return <span lang="de" dir="ltr">{teile}</span>;
}

/**
 * 📡 رادار الإشارات لحوار واحد — يُفتح بعد الأسئلة (تغذية راجعة)، لا قبلها،
 * حتى لا يحلّ محلَّ الاستماع. كل ما فيه مشتقٌّ من أسطر الحوار نفسه.
 */
export function SignalRadar({ dlg, onPoints }: { dlg: Dialogue; onPoints: (p: number, m: number) => void }) {
  const [offen, setOffen] = useState(false);
  const radar = useMemo(() => signalRadar(dlg), [dlg]);
  const drill = useMemo(() => signalDrill(dlg), [dlg]);
  const zeilenMitSignal = radar.zeilen.filter((z) => z.signale.length > 0);
  if (radar.anzahlSignale === 0 && radar.fallen.length === 0) {
    return (
      <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }} data-testid="signalradar-leer">
        📡 هذا الحوار بلا كلمات إشارية قالبة للمعنى (بحسب معجم الرادار) — الأسئلة فيه مباشرة.
      </p>
    );
  }
  return (
    <section className="card" style={{ padding: "0.8rem 1rem", borderInlineStart: "5px solid var(--color-gold)" }} data-testid="signalradar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <div>
          <strong>📡 رادار الإشارات</strong>
          <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginInlineStart: "0.5rem" }}>
            {radar.anzahlSignale} إشارة في {zeilenMitSignal.length} سطراً{radar.fallen.length ? ` · ${radar.fallen.length} مُضلِّل مسموع` : " · لا مُضلِّل مسموع في هذا الحوار"}
          </span>
        </div>
        <button className="btn btn-ghost" onClick={() => setOffen((o) => !o)} aria-expanded={offen} data-testid="signalradar-toggle">
          {offen ? "أغلق الرادار" : "افتح الرادار (بعد إجابتك)"}
        </button>
      </div>
      {offen && (
        <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.6rem" }}>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            في الامتحان لا تخسر لأنك لم تفهم الكلمات، بل لأن <b>كلمةً واحدة قلبت المعنى</b>. هذه أسطر الحوار التي تحمل مثل تلك الكلمات:
          </p>
          <ol style={{ margin: 0, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem", fontSize: "0.92rem" }}>
            {zeilenMitSignal.map((z) => (
              <li key={z.zeile} data-testid="radar-zeile">
                <strong>{z.who}:</strong> <Markiert de={z.de} signale={z.signale} />
                <span style={{ display: "block", fontSize: "0.78rem", color: "var(--color-ink2)" }}>
                  {z.signale.map((s) => `${KATEGORIE_AR[s.kategorie].emoji} ${s.wort} = ${KATEGORIE_AR[s.kategorie].name}`).join(" · ")}
                  {z.falle && " · 🎣 هنا مُضلِّل مسموع"}
                </span>
              </li>
            ))}
          </ol>
          {radar.fallen.length > 0 && (
            <div style={{ background: "var(--color-cola-soft)", borderRadius: 6, padding: "0.55rem 0.8rem", fontSize: "0.86rem" }} data-testid="radar-fallen">
              <strong>🎣 المُضلِّلات الموسومة</strong> — خيارٌ خاطئ يُسمَع في الحوار (حرفياً أو بكلماته في دورٍ آخر):
              <ul style={{ margin: "0.3rem 0 0", paddingInlineStart: "1.1rem" }}>
                {radar.fallen.map((f, i) => (
                  <li key={i}>
                    «<span lang="de">{f.option}</span>» {f.art === "woertlich" ? "يُسمَع حرفياً" : <>كلماتُه (<span lang="de">{f.anker.join(", ")}</span>) تُسمَع</>} في السطر {f.zeile + 1}
                    {f.signal ? ` — والإشارة الكاشفة في السطر نفسه: «${f.signal.wort}» (${KATEGORIE_AR[f.signal.kategorie].name})` : " — بلا إشارة في السطر نفسه: الحسمُ من سياق السطور المجاورة"}
                    ؛ الصحيح: «<span lang="de">{f.richtig}</span>».
                  </li>
                ))}
              </ul>
            </div>
          )}
          {drill.length > 0 && (
            <div>
              <h4 style={{ fontWeight: 800, margin: "0.3rem 0 0.4rem" }}>تدريب الأذن: ما وظيفة الكلمة؟</h4>
              <ExerciseSet items={drill} onPoints={onPoints} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
