"use client";
// 🔬 معمل تحليل الخطأ العميق — Fehlerlabor (Modul N) في جناح التقوية
// أربعة تحليلات في محرّك واحد (لا أدوات شاردة):
//   🧭 تصنيف الأسباب الستّة مع خطة علاج لكل سبب
//   👨‍👩‍👧 شجرة عائلات الخطأ (فئات FEHLER_KAT) + تدريب فوري على أي عائلة
//   🌡️ شبكة حرارة: الفئات × آخر 6 أسابيع (من تواريخ first)
//   🛡️ الخطأ المقاوم + «خطأ الشهر» + بروتوكول علاج من 3 خطوات
// التقييم الذاتي يمرّ عبر gradeFehlerNow ← SRS + شبكة الكفاءات تلقائياً.
import { useState } from "react";
import type { FehlerState, Progress } from "@/lib/types";
import { FEHLER_KAT } from "@/lib/fehler";
import {
  URSACHEN, ursacheVon, fehlerFamilien, wochenWaerme, resistenteFehler, fehlerDesMonats, schwere,
} from "@/lib/fehler";
import { gradeFehlerNow } from "@/lib/store";
import { De } from "./De";

function FehlerZeile({ f, offen }: { f: FehlerState; offen: boolean }) {
  const u = URSACHEN.find((x) => x.id === ursacheVon(f))!;
  return (
    <div style={{ borderTop: "1px dashed var(--color-line)", padding: "0.45rem 0", fontSize: "0.85rem" }}>
      <div style={{ fontWeight: 700 }}>
        ❌ <De>{f.falsch}</De>
        {offen && (
          <>
            {" "}→✅ <De>{f.richtig}</De>
          </>
        )}
      </div>
      {offen && <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>{f.ar} · السبب: {u.titel}</div>}
      <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }}>
        سقوط <span className="rtl-num">{f.srs.lapses}</span> · محاولات <span className="rtl-num">{f.treffer}</span> · خطورة <span className="rtl-num">{schwere(f)}</span> {f.quelle ? `· ${f.quelle}` : ""}
      </div>
    </div>
  );
}

/** تدريب عائلي: يكشف الصواب ثم تقيّم نفسك — SRS + شبكة الكفاءات تتحرّكان */
function FamilienDrill({ mitglieder }: { mitglieder: FehlerState[] }) {
  const [i, setI] = useState(0);
  const [offen, setOffen] = useState(false);
  const [stat, setStat] = useState({ ok: 0, n: 0 });
  const f = mitglieder[i];
  if (!f) return null;
  const bewerte = (ok: boolean) => {
    gradeFehlerNow(f.key, ok);
    setStat((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 }));
    setOffen(false);
    setI((x) => (x + 1) % mitglieder.length);
  };
  return (
    <div className="card" style={{ padding: "0.7rem 1rem", background: "var(--color-paper)", display: "grid", gap: "0.4rem" }}>
      <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>
        تدريب العائلة — بطاقة <span className="rtl-num">{i + 1}</span>/<span className="rtl-num">{mitglieder.length}</span>
        {stat.n > 0 && <> · هذه الجلسة: <span className="rtl-num">{stat.ok}</span>/<span className="rtl-num">{stat.n}</span></>}
      </div>
      <div style={{ fontWeight: 800, fontSize: "1.05rem" }}><De>{f.falsch}</De></div>
      {offen ? (
        <>
          <div style={{ color: "var(--color-a1)", fontWeight: 800 }}><De>{f.richtig}</De></div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{f.ar}</div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => bewerte(true)}>أتقنته ✓</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => bewerte(false)}>ما زلت أخطئ 🔁</button>
          </div>
        </>
      ) : (
        <button className="btn btn-ghost" onClick={() => setOffen(true)}>👁 اكشف الصواب ثم قيّم نفسك</button>
      )}
    </div>
  );
}

const TABS = [
  { id: "u", emoji: "🧭", name: "الأسباب الستّة", unter: "لماذا تخطئ؟" },
  { id: "f", emoji: "👨‍👩‍👧", name: "شجرة العائلات", unter: "فئاتك وأفرادها" },
  { id: "h", emoji: "🌡️", name: "شبكة الحرارة", unter: "متى تسقط فئاتك؟" },
  { id: "r", emoji: "🛡️", name: "المقاوم وعلاجه", unter: "أخطاء لا تُرَدّ" },
] as const;

export function FehlerLabor({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("u");
  const [famOffen, setFamOffen] = useState<string | null>(null);
  const alle = Object.values(progress.fehler ?? {});
  const monat = fehlerDesMonats(progress);
  const fams = fehlerFamilien(progress);
  const waerme = wochenWaerme(progress);
  const resis = resistenteFehler(progress);

  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-mid)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🔬 معمل تحليل الخطأ العميق — Fehlerlabor <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul N)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        لماذا تخطئ لا ماذا فقط: ستّة أسباب نفس-لغوية · عائلات الفئات · حرارة زمنية · الأخطاء المقاومة وبروتوكول علاجها — {alle.length} خطأً تحت المجهر.
      </div>
      {open && (
        <>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className="chip"
                style={{ cursor: "pointer", background: tab === t.id ? "var(--color-cola)" : "white", color: tab === t.id ? "white" : undefined }}
                onClick={() => setTab(t.id)}
                title={t.unter}
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>

          {tab === "u" && (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {URSACHEN.map((u) => {
                const mit = alle.filter((f) => ursacheVon(f) === u.id);
                return (
                  <div key={u.id} className="card" style={{ padding: "0.75rem 1rem", opacity: mit.length ? 1 : 0.5 }}>
                    <div style={{ fontWeight: 800 }}>
                      {u.titel} <span className="chip" style={{ fontSize: "0.7rem" }}>{mit.length} خطأً</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0" }}>{u.erklaerung}</div>
                    <ul style={{ margin: 0, paddingInlineStart: "1.1rem", fontSize: "0.8rem", lineHeight: 1.8 }}>
                      {u.plan.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                    {mit.length > 0 && (
                      <div style={{ marginTop: "0.3rem" }}>
                        {mit.slice(0, 3).map((f) => <FehlerZeile key={f.key} f={f} offen />)}
                        {mit.length > 3 && <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }}>و<span className="rtl-num">{mit.length - 3}</span> أخرى…</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "f" && (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {!fams.length && <div className="card" style={{ padding: "0.9rem" }}>لا أخطاء بعد — العائلات تظهر مع أول خطأ تسجّله أي مدرّبة.</div>}
              {fams.map((fam) => {
                const offen = famOffen === fam.art;
                const breite = Math.min(100, (fam.schwere / Math.max(1, fams[0]?.schwere ?? 1)) * 100);
                return (
                  <div key={fam.art} className="card" style={{ padding: "0.75rem 1rem" }}>
                    <button style={{ background: "none", border: 0, cursor: "pointer", width: "100%", textAlign: "start", padding: 0 }} onClick={() => setFamOffen(offen ? null : fam.art)}>
                      <div style={{ fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
                        <span>👨‍👩‍👧 {fam.titel} <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>({fam.art})</span></span>
                        <span className="chip" style={{ fontSize: "0.7rem" }}>{fam.gl.length} فرداً · خطورة {fam.schwere}</span>
                      </div>
                      <div className="progressbar" style={{ marginTop: "0.35rem", height: 8 }}>
                        <div style={{ width: `${breite}%`, background: "var(--color-mid)" }} />
                      </div>
                    </button>
                    {offen && (
                      <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.5rem" }}>
                        <FamilienDrill mitglieder={fam.gl} />
                        {fam.gl.slice(0, 6).map((f) => <FehlerZeile key={f.key} f={f} offen={false} />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "h" && (
            <div className="card" style={{ padding: "0.8rem 1rem", overflowX: "auto" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.5rem" }}>
                🌡️ أين تسقط أخطاؤك ومتى؟ الصفوف = فئات FEHLER_KAT · الأعمدة = أسابيع الظهور الأول — الغامق = الأكثر سخونة.
              </div>
              <table style={{ borderCollapse: "collapse", fontSize: "0.72rem", width: "100%", minWidth: "32rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "start", padding: "0.25rem 0.4rem" }}>الفئة</th>
                    {waerme.spalten.map((s) => (
                      <th key={s} style={{ padding: "0.25rem 0.4rem", fontWeight: 700 }}>{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {waerme.kat.map((k, ri) => (
                    <tr key={k}>
                      <td style={{ padding: "0.25rem 0.4rem", whiteSpace: "nowrap" }}>{FEHLER_KAT[k]}</td>
                      {waerme.zeilen[ri].map((v, ci) => (
                        <td
                          key={ci}
                          style={{
                            padding: "0.25rem 0.4rem",
                            textAlign: "center",
                            background: v ? `rgba(53, 94, 59, ${0.15 + 0.75 * (v / waerme.max)})` : "transparent",
                            color: v && v / waerme.max > 0.55 ? "white" : undefined,
                            borderRadius: 6,
                          }}
                        >
                          <span className="rtl-num">{v || "·"}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "r" && (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {monat && (
                <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-gold-soft)" }}>
                  <div style={{ fontWeight: 900 }}>🏆 خطأ الشهر — الأخطر حالياً</div>
                  <div style={{ margin: "0.35rem 0", fontWeight: 800, fontSize: "1.05rem" }}>
                    ❌ <De>{monat.falsch}</De> → ✅ <De>{monat.richtig}</De>
                  </div>
                  <div style={{ fontSize: "0.82rem", lineHeight: 1.8 }}>
                    {monat.ar}
                    <div style={{ color: "var(--color-ink2)" }}>
                      السبب المصنَّف: {URSACHEN.find((x) => x.id === ursacheVon(monat))?.titel} · سقط <span className="rtl-num">{monat.srs.lapses}</span> مرة · خطورة <span className="rtl-num">{schwere(monat)}</span>
                    </div>
                  </div>
                </div>
              )}
              {!resis.length && (
                <div className="card" style={{ padding: "0.9rem" }}>
                  لا أخطاء مقاومة بعد 🎉 — ما إن تسقط أي بطاقة مرتين فصاعداً حتى تدخل هنا ببروتوكول علاجها.
                </div>
              )}
              {resis.map((f) => {
                const u = URSACHEN.find((x) => x.id === ursacheVon(f))!;
                return (
                  <div key={f.key} className="card" style={{ padding: "0.8rem 1rem", borderInlineStart: "5px solid var(--color-mid)" }}>
                    <div style={{ fontWeight: 800 }}>
                      🛡️ <De>{f.falsch}</De> → <De>{f.richtig}</De>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", margin: "0.2rem 0" }}>
                      {f.ar} · السقوط: <span className="rtl-num">{f.srs.lapses}</span> · {u.titel}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", margin: "0.3rem 0 0.1rem" }}>بروتوكول العلاج الثلاثي:</div>
                    <ol style={{ margin: 0, paddingInlineStart: "1.2rem", fontSize: "0.8rem", lineHeight: 1.8 }}>
                      <li>✋ اكتبه بخط اليد ثلاثاً — اليد تُثبت ما تُنسى العين.</li>
                      <li>⚖️ قارن بصوت مسموع: «<De>{f.falsch}</De>» خطأ لأنّ… ثم الصواب.</li>
                      {u.plan.slice(0, 2).map((p, i) => <li key={i}>{p}</li>)}
                    </ol>
                    <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => gradeFehlerNow(f.key, true)}>خلصتُ منه ✓</button>
                      <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => gradeFehlerNow(f.key, false)}>ما زال يسقط 🔁</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
