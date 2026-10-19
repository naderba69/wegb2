"use client";
// 🔁 M9 (R288): إعادة كتابة محسّنة بعد 48 ساعة — مقارنة آلية بأنماط الأخطاء السابقة
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import { SPALTE_AR, type Spalte } from "@/lib/schreibpruefer";
import { erledigeWiederschreiben, faelligeWiederschreiben, planeWiederschreiben } from "@/lib/wiederschreiben";

const spalteAr = (s: string) => SPALTE_AR[s as Spalte] ?? s;

export function WiederschreibenKarte({ quelleText }: { quelleText: string }) {
  const { progress, ready, update } = useProgress();
  const geplant = useRef("");
  const [texte, setTexte] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ready || !quelleText.trim() || geplant.current === quelleText) return;
    geplant.current = quelleText;
    update((p) => planeWiederschreiben(p, quelleText));
  }, [ready, quelleText, update]);

  const offen = (progress.wiederschreiben ?? []).filter((e) => e.status === "offen");
  const faellig = faelligeWiederschreiben(progress);
  const erledigt = (progress.wiederschreiben ?? []).filter((e) => e.status === "erledigt").slice(-2);
  if (offen.length === 0 && erledigt.length === 0) return null;

  return (
    <section className="card" data-testid="wiederschreiben-karte" style={{ padding: "0.8rem 1rem", display: "grid", gap: "0.5rem", marginTop: "0.7rem" }}>
      <strong>🔁 إعادة الكتابة المحسّنة (M9)</strong>
      {offen.map((e) => {
        const istFaellig = faellig.some((f) => f.id === e.id);
        return (
          <div key={e.id} style={{ display: "grid", gap: "0.35rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
              {istFaellig ? "حان وقتها:" : `تُستحق في ${new Date(e.faellig).toLocaleDateString("ar")}:`}
              {" "}أعد كتابة هذه الفقرة من نصّك السابق بجملك أنت:
            </div>
            <blockquote className="de" style={{ margin: 0, padding: "0.5rem 0.7rem", background: "var(--color-paper2)", borderRadius: "0.5rem", lineHeight: 1.8 }}>{e.absatz}</blockquote>
            {e.spalten.length > 0 && <div style={{ fontSize: "0.8rem" }}>أنماط رصدها الكاشف محليًا يومها: {e.spalten.map(spalteAr).join(" · ")}</div>}
            {istFaellig && (
              <>
                <textarea dir="ltr" lang="de" rows={4} data-testid={`wiederschreiben-input-${e.id}`} value={texte[e.id] ?? ""} onChange={(ev) => setTexte((t) => ({ ...t, [e.id]: ev.target.value }))} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem" }} />
                <button className="btn btn-primary" data-testid={`wiederschreiben-vergleich-${e.id}`} disabled={!(texte[e.id] ?? "").trim()} onClick={() => update((p) => erledigeWiederschreiben(p, e.id, texte[e.id] ?? ""))} style={{ justifySelf: "start" }}>
                  قارن تلقائيًا بأنماطي السابقة
                </button>
              </>
            )}
          </div>
        );
      })}
      {erledigt.map((e) => (
        <div key={e.id} data-testid="wiederschreiben-ergebnis" style={{ fontSize: "0.86rem", lineHeight: 1.9 }}>
          ✅ أُنجزت في {e.erledigtAm ? new Date(e.erledigtAm).toLocaleDateString("ar") : ""} —
          {e.vergleich && e.vergleich.behoben.length > 0 ? ` اختفت أنماط: ${e.vergleich.behoben.map(spalteAr).join(" ·")}.` : " لم يختفِ نمط بعد."}
          {e.vergleich && e.vergleich.geblieben.length > 0 ? ` وبقيت: ${e.vergleich.geblieben.map(spalteAr).join(" ·")} — سترافقك في دفتر الأخطاء.` : ""}
          {" "}مقارنة أنماط آلية بالكاشف المحلي نفسه — لا حكم بشري على الجودة.
        </div>
      ))}
    </section>
  );
}
