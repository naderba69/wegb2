"use client";

import Link from "next/link";
import { eselsbruecken } from "@/lib/content";

const SEKTIONEN: { key: string; titel: string }[] = [
  { key: "genus", titel: "① شفراتُ الجنس — der / die / das" },
  { key: "praeposition", titel: "② حروفُ الجرِّ والحالات" },
  { key: "satzbau", titel: "③ ترتيبُ الجملةِ والروابط" },
  { key: "verb", titel: "④ الأفعالُ والأزمنة" },
  { key: "adjektiv", titel: "⑤ الصفاتُ والنفي" },
  { key: "b2", titel: "⑥ تركيباتُ B2" },
  { key: "sprichwort", titel: "⑦ أمثالٌ بقاعدةٍ مدمجة" },
  { key: "aussprache", titel: "⑧ النطق والأصوات" },
  { key: "pruefung", titel: "⑨ استراتيجيات الامتحان" },
];

export default function DruckSeite() {
  return (
    <section className="druckblatt ui-page ui-page--print" dir="rtl">
      <div className="no-print" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", padding: "1rem", alignItems: "center" }}>
        <Link href="/" className="btn btn-ghost" style={{ textDecoration: "none", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
          ← عودةٌ إلى المسار
        </Link>
        <button className="btn btn-primary" style={{ minHeight: "44px" }} onClick={() => window.print()}>
          🖨 اطبعِ الورقة (A4)
        </button>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
          علّقْها فوقَ مكتبِك — {eselsbruecken.length} شفرةً في صفحاتٍ قليلة.
        </span>
      </div>

      <header style={{ textAlign: "center", marginBottom: "0.6rem" }}>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>ورقةُ الشفرات — طريقي إلى B2</h1>
        <div style={{ fontSize: "0.8rem", color: "#555" }}>
          كلُّ شفرةٍ جسرٌ إلى قاعدة. احفظِ الشفرةَ تَحضُرِ القاعدةُ ساعةَ الكلام.
        </div>
      </header>

      {SEKTIONEN.map((s) => {
        const liste = eselsbruecken.filter((b) => b.sektion === s.key);
        if (!liste.length) return null;
        return (
          <section key={s.key} className="druck-sektion">
            <h2 className="druck-h2">{s.titel}</h2>
            <div className="druck-grid">
              {liste.map((b) => (
                <article key={b.id} className="druck-karte">
                  <div className="druck-titel">
                    <span>{b.emoji} {b.titleAr}</span>
                    <span className="druck-level">{b.level}</span>
                  </div>
                  <div className="druck-story">{b.storyAr}</div>
                  <table className="druck-tab">
                    <tbody>
                      {b.zeilen.map((z, i) => (
                        <tr key={i}>
                          <td className="druck-code">{z.code}</td>
                          <td lang="de" dir="ltr" className="druck-de">{z.de}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {b.warnung && <div className="druck-warn">⚠ {b.warnung}</div>}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <footer style={{ marginTop: "0.8rem", fontSize: "0.72rem", color: "#666", textAlign: "center" }}>
        وُلِّدَت من بنكِ الشفراتِ داخلَ التطبيق — لا مصدرَ خارجيّ.
      </footer>
    </section>
  );
}
