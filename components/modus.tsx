"use client";
// 🎓/⚙️ M20 (R289): فصل ثابت بين وضع التعلّم ووضع الامتحان — نفس الشريحة
// والعلم واللون في كل سطح استماع، بدل صيغ مختلفة متناثرة.
import type { Modus } from "@/lib/hoeren";

const CHIP = (aktiv: boolean): React.CSSProperties => ({
  cursor: "pointer",
  background: aktiv ? "var(--color-cola)" : "var(--ui-surface-raised)",
  color: aktiv ? "var(--ui-on-accent)" : undefined,
  padding: "0.45rem 0.75rem",
  minHeight: "44px",
});

export function ModusUmschalter({ modus, onWechsel }: { modus: Modus; onWechsel: (m: Modus) => void }) {
  return (
    <>
      <button type="button" className="chip" style={CHIP(modus === "training")} data-testid="modus-training" onClick={() => onWechsel("training")}>🎓 تدريب — مرات بلا حد</button>
      <button type="button" className="chip" style={CHIP(modus === "pruefung")} data-testid="modus-pruefung" onClick={() => onWechsel("pruefung")}>⚙️ امتحان — استماعة واحدة 🔒</button>
    </>
  );
}

export function ModusAbzeichen({ modus }: { modus: Modus }) {
  return (
    <span className="chip" data-testid="modus-abzeichen" style={{ background: modus === "pruefung" ? "var(--color-cola)" : "var(--ui-surface-raised)", color: modus === "pruefung" ? "var(--ui-on-accent)" : undefined }}>
      {modus === "pruefung" ? "⚙️ وضع الامتحان — قواعد صارمة" : "🎓 وضع التعلّم"}
    </span>
  );
}
