"use client";
/**
 * 📴 U3/R189 — بطاقة عدم الاتصال: حالة عامل الخدمة، حجم المخزن
 * الفعلي المقاس من المتصفح نفسه، ومسحه بيد المتعلّم. المسح يزيل
 * أصولًا مخزّنة فقط — تقدّمك (localStorage) لا يُمسّ.
 */
import { useEffect, useRef, useState } from "react";

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

/** مقطع صوتي واحد من بيان التنزيل الكامل (public/audio-manifest.json يُبنى من public/audio). */
interface AudioEintrag { p: string; b: number }

/** 📏 M13 (R290): حجم أول تشغيل مقاس — بنوك المحتوى من ترويسة الخادم، والصوت كله من بيانه.
 *  الصوت لا يدخل أول تشغيل: يُنزَّل عند الطلب ملفًا ملفًا (preload=none في كل المشغّلات). */
async function messeErstStart(): Promise<{ bankenMb: number | null; audioMb: number; audioDateien: number }> {
  let bankenMb: number | null = null;
  try {
    const kopf = await fetch("/banks.json", { method: "HEAD" });
    const laenge = Number(kopf.headers.get("content-length") ?? 0);
    if (laenge > 0) bankenMb = Math.round((laenge / 1048576) * 10) / 10;
  } catch { /* القياس اختياري العرض */ }
  let audioMb = 0; let audioDateien = 0;
  try {
    const res = await fetch("/audio-manifest.json");
    if (res.ok) {
      const eintraege = (await res.json()) as AudioEintrag[];
      audioDateien = eintraege.length;
      audioMb = Math.round((eintraege.reduce((a2, x) => a2 + x.b, 0) / 1048576) * 10) / 10;
    }
  } catch { /* البيان قد لا يُبنى في بيئة التطوير */ }
  return { bankenMb, audioMb, audioDateien };
}

export function OfflineKarte() {
  const [zustand, setZustand] = useState<OfflineZustand | null>(null);
  const [erstStart, setErstStart] = useState<{ bankenMb: number | null; audioMb: number; audioDateien: number } | null>(null);
  const [meldung, setMeldung] = useState("");
  const [laedtVoll, setLaedtVoll] = useState<null | { n: number; gesamt: number; mbGesamt: number }>(null);
  const abbrechenRef = useRef(false);

  useEffect(() => {
    let lebt = true;
    messe().then((z) => { if (lebt) setZustand(z); }).catch(() => undefined);
    messeErstStart().then((z) => { if (lebt) setErstStart(z); }).catch(() => undefined);
    return () => { lebt = false; };
  }, []);

  /** 📥 تنزيل كلّ الصوت مسبقًا (R202): قرار صريح بحجمه الحقيقي المقاس من البيان.
   *  يملأ مخزن «wegb2-audio-voll» (يقرأه عامل الخدمة بـ cache-first كغيره)،
   *  والمسح القائم يزيله مع بقية مخازن wegb2- — تقدّم المتعلّم لا يُمسّ أبدًا. */
  const allesLaden = async () => {
    try {
      const res = await fetch("/audio-manifest.json");
      if (!res.ok) throw new Error("manifest");
      const eintraege = (await res.json()) as AudioEintrag[];
      const mbGesamt = Math.round((eintraege.reduce((a, x) => a + x.b, 0) / 1048576) * 10) / 10;
      abbrechenRef.current = false;
      const cache = await caches.open("wegb2-audio-voll");
      let n = 0;
      setLaedtVoll({ n, gesamt: eintraege.length, mbGesamt });
      for (const e of eintraege) {
        if (abbrechenRef.current) break;
        try {
          if (!(await cache.match(e.p))) {
            const r = await fetch(e.p);
            if (r.ok) await cache.put(e.p, r);
          }
        } catch { /* ملف واحد لا يقتل البقية */ }
        n += 1;
        if (n % 20 === 0 || n === eintraege.length) setLaedtVoll({ n, gesamt: eintraege.length, mbGesamt });
      }
      setLaedtVoll(null);
      setMeldung(abbrechenRef.current
        ? `توقّف التنزيل عند ${n} من ${eintraege.length} ملفًا — ما نزل يعمل بلا اتصال، والبقية تُستكمل من زرّ التنزيل نفسه.`
        : `اكتمل تنزيل الصوت: ${n} ملفًا (نحو ${mbGesamt} MB) — كلّ حواراتك تعمل الآن بلا اتصال.`);
      setZustand(await messe());
    } catch {
      setLaedtVoll(null);
      setMeldung("تعذّر التنزيل الكامل هنا (المتصفح أو الشبكة) — الصوت الذي تسمعه يبقى مخزّنًا كالعادة.");
    }
  };

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
          {erstStart && (
            <> · 📏 حجم أول تشغيل: بنوك المحتوى <strong>{erstStart.bankenMb !== null ? `نحو ${erstStart.bankenMb}` : "—"}</strong> MB، والصوت كله ({erstStart.audioDateien} ملفًا، نحو {erstStart.audioMb} MB) <strong>لا يُنزَّل إلا عند الطلب</strong> — تسمع ملفًا فيُنزَّل وحده.</>
          )}
        </p>
      ) : (
        <p className="tiny muted" style={{ margin: 0 }}>جارٍ قياس المخزن…</p>
      )}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary" data-testid="offline-voll-download"
          onClick={allesLaden} disabled={!!laedtVoll} style={{ minHeight: "44px" }}>
          {laedtVoll ? `📥 يُنزِّل… ${laedtVoll.n}/${laedtVoll.gesamt}` : "📥 نزّل كلّ الصوت للاستخدام دون اتصال"}
        </button>
        {laedtVoll && (
          <button type="button" className="btn" style={{ minHeight: "44px" }}
            onClick={() => { abbrechenRef.current = true; }}>
            ⏹ إيقاف التنزيل
          </button>
        )}
        <button type="button" className="btn" onClick={leeren} style={{ minHeight: "44px" }}>
          🧹 امسح مخزن عدم الاتصال
        </button>
      </div>
      <p className="tiny muted" style={{ margin: 0 }}>
        التنزيل الكامل اختياري وكبير (نحو 64 MB بصوت الحوارات كاملًا) — على Wi-Fi أفضل.
        بلا تنزيل كامل يبقى كلّ صوت تسمعه مخزّنًا تلقائيًا كما كان.
      </p>
      {meldung && <p className="tiny" role="status" style={{ margin: 0 }}>{meldung}</p>}
    </div>
  );
}
