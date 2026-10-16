"use client";
/**
 * 🎯 M6/R186 — تدريب اليوم على أضعف نمطين: أسئلة جديدة من بنك
 * التصحيح، لا إعادة لأزواج دفتر المتعلّم (مستبعدة في المحرّك).
 */
import { useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { musterDrill } from "@/lib/musterdrill";
import ExerciseSet from "./exercises";

export function MusterDrill({ progress }: { progress: Progress }) {
  const [runde, setRunde] = useState(0);
  const drill = useMemo(
    () => musterDrill(progress, progress.plan.day + runde * 31),
    [progress, runde],
  );

  if (drill.leer) {
    return (
      <div style={{ borderTop: "1px dashed var(--color-line)", padding: "0.6rem 0", fontSize: "0.88rem" }}>
        🎯 <strong>تدريب الأنماط:</strong> لا أخطاء مسجّلة بعد — ما إن يمتلئ دفترك حتى يُبنى هنا
        تدريبٌ يومي قصير على أضعف نمطين لديك بأسئلة جديدة.
      </div>
    );
  }

  return (
    <div style={{ borderTop: "1px dashed var(--color-line)", padding: "0.6rem 0" }} data-testid="musterdrill">
      <div style={{ fontWeight: 900, fontSize: "0.95rem" }}>🎯 تدريب اليوم على أضعف نمطين في دفترك</div>
      <p className="tiny muted" style={{ margin: "0.25rem 0 0.5rem", lineHeight: 1.9 }}>
        {drill.muster.map((m) => `${m.titel} (${m.fragen} أسئلة)`).join(" · ")} —
        أسئلة مولّدة اليوم من بنك التصحيح العام، وأزواج أخطائك المسجّلة نفسها مستبعدة عمدًا:
        تتدرب على النمط لا على حفظ سؤال بعينه. تتبدّل الأسئلة بتناوب اليوم.
      </p>
      {drill.uebungen.length > 0 ? (
        <>
          <ExerciseSet key={`${progress.plan.day}-${runde}`} items={drill.uebungen} />
          <button type="button" className="btn" style={{ marginTop: "0.5rem", minHeight: "42px" }} onClick={() => setRunde((r) => r + 1)}>
            🔀 أسئلة أخرى على النمطين نفسيهما
          </button>
        </>
      ) : (
        <p className="tiny" style={{ margin: 0 }}>
          بنك التصحيح لهذا النمط مستنفد خارج دفترك — نمطك مغطّى بأسئلة دفترك المجدولة أصلًا في خطة اليوم.
        </p>
      )}
    </div>
  );
}
