"use client";
// 🛠️ R301: الراحة والمظهر — وضع فاتح/داكن وحجم الخط (محلي فقط، يطبق فورًا على كل التطبيق)
import { useEffect, useState } from "react";
import {
  KOMFORT_STANDARD,
  ladeKomfort,
  speichereKomfort,
  wendeKomfortAn,
  type KomfortCfg,
  type KomfortSchrift,
  type KomfortThema,
} from "@/lib/komfort";

/** يُركَّب مرة في الجذر: يقرأ الإعداد المحفوظ ويطبقه عند فتح التطبيق. */
export function KomfortInit() {
  useEffect(() => {
    wendeKomfortAn(ladeKomfort());
  }, []);
  return null;
}

const THEMEN: { id: KomfortThema; titel: string }[] = [
  { id: "dunkel", titel: "🌙 داكن (الأساسي)" },
  { id: "hell", titel: "☀️ فاتح (للشمس والخارج)" },
];
const SCHRIFTEN: { id: KomfortSchrift; titel: string }[] = [
  { id: "normal", titel: "عادي" },
  { id: "gross", titel: "كبير" },
  { id: "sehr", titel: "كبير جدًا" },
];

export function KomfortEinstellungen() {
  const [cfg, setCfg] = useState<KomfortCfg>(KOMFORT_STANDARD);

  useEffect(() => {
    setCfg(ladeKomfort());
  }, []);

  const anwenden = (neu: KomfortCfg) => {
    setCfg(neu);
    speichereKomfort(neu);
    wendeKomfortAn(neu);
  };

  return (
    <section className="card" data-testid="komfort-station" style={{ padding: "1rem 1.2rem", background: "var(--color-paper2)", display: "grid", gap: "0.7rem" }}>
      <h2 style={{ margin: 0, fontWeight: 800 }}>🛠️ الراحة والمظهر</h2>
      <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        اختر ما يريح عينك: الوضع الفاتح أريح تحت الشمس وفي الخارج، والخط الأكبر أريح للقراءة الطويلة.
        يُحفظ اختيارك في هذا المتصفح فقط ويُطبَّق فورًا في كل مكان.
      </p>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.86rem", fontWeight: 700 }}>ألوان الشاشة:</span>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {THEMEN.map((t) => (
            <button key={t.id} type="button" className="chip" data-testid={`komfort-thema-${t.id}`}
              onClick={() => anwenden({ ...cfg, thema: t.id })}
              style={{ cursor: "pointer", minHeight: "46px", background: cfg.thema === t.id ? "var(--color-gold)" : undefined, color: cfg.thema === t.id ? "var(--ui-on-accent)" : undefined }}>
              {t.titel}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.86rem", fontWeight: 700 }}>حجم الخط:</span>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {SCHRIFTEN.map((s) => (
            <button key={s.id} type="button" className="chip" data-testid={`komfort-schrift-${s.id}`}
              onClick={() => anwenden({ ...cfg, schrift: s.id })}
              style={{ cursor: "pointer", minHeight: "46px", background: cfg.schrift === s.id ? "var(--color-gold)" : undefined, color: cfg.schrift === s.id ? "var(--ui-on-accent)" : undefined }}>
              {s.titel}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        💡 هذا مثال حي على الحجم: جرّب «كبير جدًا» وسترى هذا النص نفسه يكبر في كل التطبيق.
      </div>
    </section>
  );
}
