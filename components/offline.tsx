"use client";
/**
 * 📴 U3/R189 — بطاقة عدم الاتصال: حالة عامل الخدمة، حجم المخزن
 * الفعلي المقاس من المتصفح نفسه، ومسحه بيد المتعلّم. المسح يزيل
 * أصولًا مخزّنة فقط — تقدّمك (localStorage) لا يُمسّ.
 */
import { useEffect, useRef, useState } from "react";

interface OfflineZustand {
  swUnterstuetzt: boolean;
  swRegistriert: boolean;
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
  const swUnterstuetzt = "serviceWorker" in navigator;
  let swRegistriert = false;
  if (swUnterstuetzt) {
    try { swRegistriert = !!(await navigator.serviceWorker.getRegistration()); } catch { /* Status bleibt ehrlich false */ }
  }
  return {
    swUnterstuetzt,
    swRegistriert,
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
  const [laedtVoll, setLaedtVoll] = useState<null | { n: number; bearbeitet: number; gesamt: number; mbGesamt: number; fehler: number }>(null);
  const abbrechenRef = useRef(false);

  useEffect(() => {
    let lebt = true;
    const aktualisieren = () => messe().then((z) => { if (lebt) setZustand(z); }).catch(() => undefined);
    void aktualisieren();
    messeErstStart().then((z) => { if (lebt) setErstStart(z); }).catch(() => undefined);
    window.addEventListener("weg-sw-status", aktualisieren);
    navigator.serviceWorker?.addEventListener?.("controllerchange", aktualisieren);
    return () => {
      lebt = false;
      window.removeEventListener("weg-sw-status", aktualisieren);
      navigator.serviceWorker?.removeEventListener?.("controllerchange", aktualisieren);
    };
  }, []);

  /** تنزيلٌ كامل متحقق: الملف لا يُحسب إلا إذا كان موجوداً أو نزل بالحجم المعلن نفسه.
   *  مخزن الصوت الكامل مستقل ويحافظ عليه عامل الخدمة عند تحديث غلاف التطبيق. */
  const allesLaden = async () => {
    try {
      const res = await fetch("/audio-manifest.json", { cache: "no-store" });
      if (!res.ok) throw new Error("manifest");
      const eintraege = (await res.json()) as AudioEintrag[];
      const mbGesamt = Math.round((eintraege.reduce((a, x) => a + x.b, 0) / 1048576) * 10) / 10;
      abbrechenRef.current = false;
      try { await navigator.storage?.persist?.(); } catch { /* الاستمرار ممكن حتى إن رفض المتصفح التثبيت */ }
      const cache = await caches.open("wegb2-audio-voll-v1");
      let n = 0;
      let bearbeitet = 0;
      let fehler = 0;
      setLaedtVoll({ n, bearbeitet, gesamt: eintraege.length, mbGesamt, fehler });
      for (const e of eintraege) {
        if (abbrechenRef.current) break;
        try {
          const vorhanden = await cache.match(e.p);
          let schonGueltig = false;
          if (vorhanden) {
            const vorhandeneBytes = (await vorhanden.clone().arrayBuffer()).byteLength;
            if (vorhandeneBytes !== e.b) await cache.delete(e.p);
            else schonGueltig = true;
          }
          if (!schonGueltig) {
            const r = await fetch(e.p, { cache: "no-store" });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const bytes = await r.arrayBuffer();
            if (bytes.byteLength !== e.b) throw new Error(`size ${bytes.byteLength}/${e.b}`);
            await cache.put(e.p, new Response(bytes, { status: 200, headers: r.headers }));
          }
          n += 1;
        } catch {
          fehler += 1;
        }
        bearbeitet += 1;
        if (bearbeitet % 20 === 0 || bearbeitet === eintraege.length) {
          setLaedtVoll({ n, bearbeitet, gesamt: eintraege.length, mbGesamt, fehler });
        }
      }
      setLaedtVoll(null);
      setMeldung(abbrechenRef.current
        ? `توقّف الفحص بعد ${bearbeitet} ملفًا: المخزّن السليم ${n}/${eintraege.length}، والفاشل ${fehler}. اضغط الزر لاحقًا لاستكمال الناقص فقط.`
        : fehler > 0
          ? `اكتمل الفحص مع نقص: ${n}/${eintraege.length} ملفًا سليماً، وفشل ${fehler}. أعد المحاولة لتنزيل الناقص؛ لا نعلن اكتمالاً وهمياً.`
          : `اكتمل تنزيل الصوت والتحقق من الحجم: ${n}/${eintraege.length} ملفًا (نحو ${mbGesamt} MB) — الصوت كله متاح بلا اتصال.`);
      setZustand(await messe());
    } catch {
      setLaedtVoll(null);
      setMeldung("تعذّر بدء التنزيل الكامل هنا (المتصفح أو الشبكة). لم نحتسب أي ملف لم يُتحقق منه.");
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
        بعد تفعيل عامل الخدمة تُحفَظ صفحات التطبيق وبنوك المحتوى الثلاثة للعمل بلا شبكة. يُحفَظ آخر
        200 ملف صوتي سمعته تلقائياً؛ ولضمان الصوت كله استخدم التنزيل الكامل المتحقق أدناه.
        المخزن أصول عامة فقط — تقدّمك يبقى في متصفحك ويمكن تصديره من قسم النسخ الاحتياطي.
      </p>
      {zustand ? (
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 2 }}>
          عامل الخدمة: <strong>{zustand.swAktiv ? "نشط ✓" : !zustand.swUnterstuetzt ? "غير مدعوم في هذا المتصفح" : zustand.swRegistriert ? "مسجّل — أعد التحميل لتفعيل التحكم" : "غير مسجّل — افتح النسخة المنشورة عبر HTTPS ثم أعد التحميل"}</strong> ·
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
          {laedtVoll ? `📥 يفحص وينزّل… ${laedtVoll.bearbeitet}/${laedtVoll.gesamt} · سليم ${laedtVoll.n} · فشل ${laedtVoll.fehler}` : "📥 نزّل كلّ الصوت للاستخدام دون اتصال"}
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
        التنزيل الكامل اختياري وكبير{erstStart ? ` (الحجم الحالي المقاس نحو ${erstStart.audioMb} MB لـ${erstStart.audioDateien} ملفًا)` : ""} — على Wi-Fi أفضل.
        بلا تنزيل كامل يحتفظ التطبيق تلقائياً بآخر 200 ملف صوتي استُعملت.
      </p>
      {meldung && <p className="tiny" role="status" style={{ margin: 0 }}>{meldung}</p>}
    </div>
  );
}
