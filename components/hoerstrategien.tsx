"use client";
// 🎧 A8 (R292): بطاقة استراتيجيات الاستماع — المرحلة النشطة تتبع حالة الجولة
import { useState } from "react";
import { HOERSTRATEGIEN, strategiePhase } from "@/lib/hoerstrategien";

export function HoerStrategienKarte({ started, geprueft }: { started: boolean; geprueft: boolean }) {
  const aktiv = strategiePhase(started, geprueft);
  const [offen, setOffen] = useState(true);
  const [gehakt, setGehakt] = useState<Set<string>>(new Set());
  return (
    <div className="card" data-testid="hoerstrategien" style={{ padding: "0.7rem 0.9rem", marginBottom: "0.6rem", background: "var(--color-paper2)" }}>
      <button type="button" className="btn btn-ghost" data-testid="hoerstrategien-toggle" onClick={() => setOffen((o) => !o)} style={{ minHeight: "44px" }}>
        🎧 استراتيجيات الاستماع (قبل · أثناء · بعد) {offen ? "▾" : "▸"}
      </button>
      {offen && (
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.4rem" }}>
          {HOERSTRATEGIEN.map((phase) => (
            <div key={phase.id} data-testid={`strategie-${phase.id}`} style={{ opacity: aktiv === phase.id ? 1 : 0.62, borderInlineStart: aktiv === phase.id ? "4px solid var(--color-gold)" : "4px solid transparent", paddingInlineStart: "0.5rem" }}>
              <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{phase.titelAr}{aktiv === phase.id ? " ← أنت هنا" : ""}</div>
              {phase.schritte.map((s, i) => {
                const key = `${phase.id}-${i}`;
                return (
                  <label key={key} style={{ display: "flex", gap: "0.45rem", alignItems: "baseline", fontSize: "0.84rem", lineHeight: 1.8 }}>
                    <input
                      type="checkbox"
                      data-testid={`strategie-schritt-${key}`}
                      checked={gehakt.has(key)}
                      onChange={() => setGehakt((alt) => { const n = new Set(alt); if (n.has(key)) n.delete(key); else n.add(key); return n; })}
                    />
                    <span>{s}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
