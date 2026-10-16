"use client";
/**
 * 📴 U3/R189 — بطاقة عدم الاتصال: حالة عامل الخدمة، حجم المخزن
 * الفعلي المقاس من المتصفح نفسه، ومسحه بيد المتعلّم. المسح يزيل
 * أصولًا مخزّنة فقط — تقدّمك (localStorage) لا يُمسّ.
 */
import { useEffect, useState } from "react";

interface OfflineZustand {
  swAktiv: boolean;
  eintraege: number;
  mb: number | null;
}

async function messe(): Promise<OfflineZustand> {
  let eintraege = 0;
  if ("caches" in window) {
    const keys = await caches.keys();
    for (const k of keys) {
      if (!k.startsWith("wegb2-")) continue;
      const c = await caches.open(k);
      eintraege += (await c.keys()).length;
    }
  }
  let mb: number | null = null;
  try {
    const est = await navigator.storage?.estimate?.();
    if (est && typeof est.usage === "number") mb = Math.round((est.usage / 1048576) * 10) / 10;
  } catch { /* estimate may be unavailable */ }
  return {
    swAktiv: !!navigator.serviceWorker?.controller,
    eintraege,
    mb,
  };
}

export function OfflineKarte() {
  const [zustand, setZustand] = useState<OfflineZustand | null>(null);
  const [meldung, setMeldung] = useState("");

  useEffect(() => {
    let lebt = true;
    messe().then((z) => { if (lebt) setZustand(z); }).catch(() => undefined);
    return () => { lebt = false; };
  }, []);

  const leeren = async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("wegb2-")).map((k) => caches.delete(k)));
      setMeldung("مُسح مخزن الأصول. تقدّمك وبطاقاتك ودفترك لم يُمسّوا؛ ستُعاد تعبئة المخزن عند أول اتصال.");
      setZustand(await messe());
    } catch {
      setMeldung("تعذّر المسح في هذا المتصفح.");
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem" }} data-testid="offline-karte">
      <p style={{ margin: 0, lineHeight: 2, fontSize: "0.9rem" }}>
        بعد أول تحميل يعمل التطبيق بلا شبكة: بنوك المحتوى محفوظة، وكلّ صوت تسمعه يُخزَّن ليعمل
        لاحقًا دون اتصال. المخزن أصول ثابتة فقط — تقدّمك يعيش في متصفحك كما كان دائمًا.
      </p>
      {zustand ? (
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 2 }}>
          عامل الخدمة: <strong>{zustand.swAktiv ? "نشط ✓" : "سيُفعَّل عند إعادة التحميل"}</strong> ·
          ملفات مخزّنة: <strong>{zustand.eintraege}</strong>
          {zustand.mb !== null && <> · الحجم المقاس: نحو <strong>{zustand.mb}</strong> MB (تقدير متصفحك لاستعمال هذا الأصل)</>}
        </p>
      ) : (
        <p className="tiny muted" style={{ margin: 0 }}>جارٍ قياس المخزن…</p>
      )}
      <div>
        <button type="button" className="btn" onClick={leeren} style={{ minHeight: "44px" }}>
          🧹 امسح مخزن عدم الاتصال
        </button>
      </div>
      {meldung && <p className="tiny" role="status" style={{ margin: 0 }}>{meldung}</p>}
    </div>
  );
}
