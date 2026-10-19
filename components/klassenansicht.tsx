"use client";
/**
 * 🧑‍🏫 U4/R190 — نظرة الصفّ: جدول بكلّ ملفات المتعلّمين على هذا
 * الجهاز، وتصدير محلي (JSON للصفّ/للفرد + تقرير HTML للطباعة).
 * لا خادم ولا رفع — الملفّات تُنزَّل على الجهاز وتبقى بيد المعلّم.
 */
import { useMemo, useState } from "react";
import { listProfiles, activeProfile, progressKey } from "@/lib/profiles";
import { lernendenZeile, type LernendenZeile } from "@/lib/lehrer";
import type { Progress } from "@/lib/types";

function ladeProfil(id: string): Progress | null {
  try {
    const roh = localStorage.getItem(progressKey(id));
    if (!roh) return null;
    return JSON.parse(roh) as Progress;
  } catch {
    return null;
  }
}

function herunterladen(name: string, inhalt: string, typ: string) {
  const url = URL.createObjectURL(new Blob([inhalt], { type: typ }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function berichtHtml(zeilen: LernendenZeile[], datum: string): string {
  const rows = zeilen
    .map(
      (z) =>
        `<tr><td>${z.emoji} ${z.name}${z.aktiv ? " (الحالي)" : ""}</td><td>${z.tag}</td><td>${z.phase}</td>` +
        `<td>${z.geschlosseneTage}</td><td>${z.letztesDatum ?? "—"}</td><td>${z.minutenGemessen}</td>` +
        `<td>${z.pruefungenBestanden}/${z.pruefungenGesamt}</td><td>${z.schwaechstesMuster ?? "—"}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>تقرير الصفّ — WegB2</title>
<style>body{font-family:system-ui,Arial,sans-serif;margin:2rem;color:#111}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:.45rem .6rem;text-align:right}h1{font-size:1.3rem}</style></head>
<body><h1>🧑‍🏫 تقرير الصفّ — طريقي إلى B2 (محلي، ${datum})</h1>
<p>ملخّص مولّد على الجهاز من ملفات المتعلّمين المحلية — لم يغادر أيّ بيانٍ هذا الجهاز.</p>
<table><thead><tr><th>المتعلّم</th><th>اليوم</th><th>المستوى</th><th>أيام مغلقة</th><th>آخر نشاط</th><th>دقائق مقاسة</th><th>امتحانات مجتازة</th><th>أضعف نمط خطأ</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`;
}

export function KlassenAnsicht() {
  const [meldung, setMeldung] = useState("");
  const zeilen = useMemo<LernendenZeile[]>(() => {
    try {
      const aktiv = activeProfile();
      return listProfiles()
        .map((info) => {
          const p = ladeProfil(info.id);
          return p ? lernendenZeile(info, p, aktiv.id) : null;
        })
        .filter((z): z is LernendenZeile => !!z)
        .sort((a, b) => b.geschlosseneTage - a.geschlosseneTage || a.name.localeCompare(b.name));
    } catch {
      return [];
    }
  }, []);

  const datum = new Date().toISOString().slice(0, 10);

  const exportKlasseJson = () => {
    herunterladen(`wegb2-klasse-${datum}.json`, JSON.stringify({ exportiertAm: datum, lernende: zeilen }, null, 2), "application/json");
    setMeldung("نُزّل ملفّ الصفّ (JSON) على جهازك — لم يغادر شيءٌ الجهاز إلا إلى ملفٍّ بيدك.");
  };
  const exportBericht = () => {
    herunterladen(`wegb2-klassenbericht-${datum}.html`, berichtHtml(zeilen, datum), "text/html");
    setMeldung("نُزّل تقرير HTML — افتحه في المتصفح واطبعه (Ctrl+P) إن أردت نسخة ورقية.");
  };
  const exportEinzel = (z: LernendenZeile) => {
    const p = ladeProfil(z.id);
    if (!p) return;
    herunterladen(`wegb2-lernender-${z.id}-${datum}.json`, JSON.stringify(p, null, 2), "application/json");
    setMeldung(`نُزّل تقدّم «${z.name}» كاملًا (JSON) — هو ملفّ النسخ الاحتياطي نفسه القابل للاستيراد.`);
  };

  if (zeilen.length === 0) {
    return <p className="tiny muted" style={{ margin: 0 }}>لا ملفات متعلّمين مقروءة على هذا الجهاز بعد.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "0.6rem" }} data-testid="klassen-ansicht">
      <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 2 }}>
        {zeilen.length} {zeilen.length === 1 ? "متعلّم" : "متعلمون"} على هذا الجهاز. كلّ سطر مشتقّ من سجلّ صاحبه نفسه،
        والتصدير ملفّات محلية فقط — لا خادم ولا رفع.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.86rem" }}>
          <thead>
            <tr>
              {["المتعلّم", "اليوم", "المستوى", "أيام مغلقة", "آخر نشاط", "دقائق مقاسة", "امتحانات", "أضعف نمط", ""].map((h, i) => (
                <th key={i} style={{ borderBottom: "2px solid var(--color-line, #bbb)", padding: "0.35rem 0.45rem", textAlign: "start" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zeilen.map((z) => (
              <tr key={z.id}>
                <td style={{ padding: "0.35rem 0.45rem" }}>{z.emoji} {z.name}{z.aktiv ? " · الحالي" : ""}</td>
                <td>{z.tag}</td>
                <td>{z.phase}</td>
                <td>{z.geschlosseneTage}</td>
                <td>{z.letztesDatum ?? "—"}</td>
                <td>{z.minutenGemessen}</td>
                <td>{z.pruefungenBestanden}/{z.pruefungenGesamt}</td>
                <td>{z.schwaechstesMuster ?? "—"}</td>
                <td>
                  <button type="button" className="btn" style={{ minHeight: "38px" }} onClick={() => exportEinzel(z)}>
                    ⬇️ JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary" style={{ minHeight: "44px" }} onClick={exportKlasseJson}>
          ⬇️ تصدير الصفّ (JSON)
        </button>
        <button type="button" className="btn" style={{ minHeight: "44px" }} onClick={exportBericht}>
          🖨️ تقرير قابل للطباعة (HTML)
        </button>
      </div>
      {meldung && <p className="tiny" role="status" style={{ margin: 0 }}>{meldung}</p>}
    </div>
  );
}
