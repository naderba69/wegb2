"use client";
// 🎚️ M4 (R288): معايرة من بيانات المتعلم + إصلاح البطاقات العنيدة
import { useProgress } from "@/lib/store";
import { KOMPETENZ_AR } from "@/lib/kompetenz";
import { kartenAusreisser, skillTrends } from "@/lib/kalibrierung";
import { alleVokabeln } from "@/lib/content";
import type { Progress } from "@/lib/types";

const RICHTUNG_AR: Record<string, string> = {
  schwerer: "⬆ اتجاهك يتحسّن — زد الصعوبة قليلًا في تدريبك الحرّ",
  leichter: "⬇ تراجع حديث — خفّف الصعوبة وركّز على التثبيت",
  stabil: "➡ مستقر — أبقِ الصعوبة",
  neu: "· بيانات غير كافية بعد",
};

export function KalibrierungPanel({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const trends = skillTrends(progress).filter((t) => t.nAktuell + t.nVorher > 0);
  const aus = kartenAusreisser(progress);
  const karteVon = (id: string) => alleVokabeln.find((k) => k.id === id);
  return (
    <div data-testid="kalibrierung-panel" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.85rem" }}>
      <div style={{ fontWeight: 900, marginBottom: "0.3rem" }}>🎚️ معايرة الصعوبة من بياناتك (M4)</div>
      {trends.length === 0 && aus.hartnaeckig.length === 0 ? (
        <span style={{ color: "var(--color-ink2)" }}>لا بيانات مؤرّخة كافية بعد للمعايرة — تظهر هنا بعد محاولات مسجّلة بالتاريخ.</span>
      ) : (
        <div style={{ display: "grid", gap: "0.25rem" }}>
          {trends.map((t) => (
            <div key={t.hand}>
              {KOMPETENZ_AR[t.hand]}: {t.aktuell !== null ? `${Math.round(t.aktuell * 100)}٪ حديثًا` : "—"}
              {t.vorher !== null ? ` ← ${Math.round(t.vorher * 100)}٪ قبلها` : ""} ({t.nAktuell}+{t.nVorher} محاولة) — {RICHTUNG_AR[t.richtung]}
            </div>
          ))}
        </div>
      )}
      {aus.hartnaeckig.length > 0 && (
        <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.3rem" }}>
          <div style={{ fontWeight: 800 }}>🧱 بطاقات عنيدة (سقطات متكررة رغم التكرار) — FSRS يعيد جدولتها مبكرًا تلقائيًا، والإصلاح الواعي بيدك:</div>
          {aus.hartnaeckig.map((a) => {
            const k = karteVon(a.id);
            return (
              <div key={a.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <span><span className="de" style={{ fontWeight: 700 }}>{k?.de ?? a.id}</span> — {k?.ar ?? ""} (سقطات {a.lapses} · تكرار {a.reps})</span>
                <button className="btn" data-testid={`ausreisser-reset-${a.id}`} onClick={() => update((p) => { const srs = { ...p.srs }; delete srs[a.id]; return { ...p, srs }; })}>↺ أعد تعلّمها من الصفر</button>
                <button className="btn" data-testid={`ausreisser-sicher-${a.id}`} onClick={() => update((p) => ({ ...p, srs: { ...p.srs, [a.id]: { ...p.srs[a.id], stab: 90, interval: 90, due: new Date(Date.now() + 90 * 86400000).toISOString() } } }))}>أعرفها فعلًا — أجلّها ٩٠ يومًا</button>
              </div>
            );
          })}
        </div>
      )}
      {aus.sicherAnzahl > 0 && <div style={{ marginTop: "0.4rem", color: "var(--color-ink2)" }}>بطاقات مستقرة تمامًا بلا سقطة: {aus.sicherAnzahl} — لا تحتاج تدخّلًا.</div>}
    </div>
  );
}
