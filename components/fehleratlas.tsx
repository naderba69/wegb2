"use client";
// 🗺️ A15 (R294): أطلس أخطاء تباينية عربي↔ألماني — عائلات أخطاء بقاعدتها الواحدة
import { useState } from "react";
import { ATLAS_KATEGORIE_AR, atlasEintraege, type AtlasKategorie } from "@/lib/fehleratlas";

const KATEGORIEN: AtlasKategorie[] = ["wortstellung", "konnektoren", "artikel", "kasus", "praeposition", "zeitform", "falsche-freunde"];

export function FehlerAtlas() {
  const [kat, setKat] = useState<AtlasKategorie>("wortstellung");
  const eintraege = atlasEintraege(kat);
  return (
    <section className="card" data-testid="fehleratlas" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>🗺️ أطلس الأخطاء التباينية (A15) — أخطاء الناطق بالعربية المتكررة وقاعدتها</strong>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {KATEGORIEN.map((k) => (
          <button key={k} type="button" className="chip" data-testid={`atlas-kat-${k}`} onClick={() => setKat(k)} style={{ cursor: "pointer", minHeight: "44px", background: k === kat ? "var(--color-gold)" : undefined, color: k === kat ? "var(--ui-on-accent)" : undefined }}>
            {ATLAS_KATEGORIE_AR[k]}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {eintraege.map((e, i) => (
          <div key={i} className="card" style={{ padding: "0.6rem 0.8rem", display: "grid", gap: "0.25rem" }}>
            <strong style={{ fontSize: "0.9rem" }}>{e.titelAr}</strong>
            <div style={{ fontSize: "0.88rem" }}>✗ <span className="de" dir="ltr" style={{ color: "var(--ui-danger)" }}>{e.falsch}</span></div>
            <div style={{ fontSize: "0.88rem" }}>✓ <span className="de" dir="ltr" style={{ fontWeight: 700 }}>{e.richtig}</span></div>
            <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>{e.regelAr}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
