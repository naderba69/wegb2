"use client";
// 🔔 A27 (R293): تذكيرات محلية — إشعار متصفح بموافقتك + تصدير تقويم .ics
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";
import { erinnerungFaellig, icsText } from "@/lib/erinnerung";

const FEUER_KEY = "wegb2:erinnerung-gefeuert";

export function ErinnerungsWache() {
  useEffect(() => {
    const intervall = setInterval(() => {
      try {
        const roh = localStorage.getItem("wegb2:progress");
        if (!roh) return;
        const p = JSON.parse(roh) as Parameters<typeof erinnerungFaellig>[0];
        if (!erinnerungFaellig(p, new Date())) return;
        const heute = new Date().toISOString().slice(0, 10);
        if (localStorage.getItem(FEUER_KEY) === heute) return;
        if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
        localStorage.setItem(FEUER_KEY, heute);
        new Notification("🇩🇪 طريقي إلى B2", { body: "حان وقت جلستك الألمانية اليوم — ابدأ بمهمة الاسترجاع." });
      } catch { /* تذكير صامت الفشل خير من كسر التطبيق */ }
    }, 30000);
    return () => clearInterval(intervall);
  }, []);
  return null;
}

export function ErinnerungKarte() {
  const { progress, update } = useProgress();
  const [meldung, setMeldung] = useState("");
  const e = progress.settings.erinnerung;
  const erlaubt = typeof Notification !== "undefined" ? Notification.permission : "unsupported";

  const herunterladen = () => {
    const blob = new Blob([icsText(progress)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "weg-b2-plan.ics";
    a.click();
    URL.revokeObjectURL(a.href);
    setMeldung("نُزّل ملف التقويم — افتحه في تطبيق تقويمك لاستيراد جلسات الأيام السبعة القادمة.");
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem" }} data-testid="erinnerung-karte">
      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          data-testid="erinnerung-aktiv"
          checked={!!e?.aktiv}
          onChange={(ev) => update((p) => ({ ...p, settings: { ...p.settings, erinnerung: { aktiv: ev.target.checked, uhrzeit: p.settings.erinnerung?.uhrzeit ?? "18:00" } } }))}
        />
        <span>ذكّرني يوميًا بوقت جلستي (إشعار متصفح — يعمل ما دام التطبيق مفتوحًا أو مثبّتًا)</span>
      </label>
      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span>الوقت:</span>
        <input
          type="time"
          data-testid="erinnerung-zeit"
          value={e?.uhrzeit ?? "18:00"}
          onChange={(ev) => update((p) => ({ ...p, settings: { ...p.settings, erinnerung: { aktiv: p.settings.erinnerung?.aktiv ?? false, uhrzeit: ev.target.value || "18:00" } } }))}
        />
      </label>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="btn" data-testid="erinnerung-erlaubnis" onClick={async () => {
          if (typeof Notification === "undefined") { setMeldung("متصفحك لا يدعم إشعارات الويب — استخدم تصدير التقويم بدلًا منها."); return; }
          const erg = await Notification.requestPermission();
          setMeldung(erg === "granted" ? "✅ سمحتَ بالإشعارات — ستظهر في وقتك ما دام التطبيق مفتوحًا." : "لم تمنح الإذن — يمكنك منحه من إعدادات المتصفح متى شئت.");
        }}>🔔 اطلب إذن الإشعارات (الحالة: {erlaubt === "unsupported" ? "غير مدعوم" : erlaubt})</button>
        <button className="btn" data-testid="erinnerung-test" onClick={() => {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("🇩🇪 طريقي إلى B2", { body: "إشعار تجريبي — هكذا سيصلك تذكير جلستك." });
            setMeldung("أُرسل إشعار تجريبي.");
          } else setMeldung("امنح إذن الإشعارات أولًا ثم جرّب.");
        }}>جرّب إشعارًا</button>
        <button className="btn btn-gold" data-testid="erinnerung-ics" onClick={herunterladen}>📅 صدّر جلسات الأسبوع القادم (.ics)</button>
      </div>
      {meldung && <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>{meldung}</div>}
      <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
        بلا أي خادم: الإشعار محلي من متصفحك، وملف التقويم بياناته من خطتك وحدها.
      </div>
    </div>
  );
}
