"use client";
/**
 * 🔒 بطاقة عقد الانضباط — Tagesvertrag (Modul O)
 * القارئ للعرض: props progress (نقية، قابلة للاختبار تحت jsdom).
 * الكاتب وحيد عبر useProgress.update() — والكل محروس بوسوم اليوم
 * في lib/kontrakt: لا عدّ مزدوج للوفاء، لا غرامة مزدوجة، لا كسر بلا دليل.
 */
import { useEffect, useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { pruefeKontrakt, signKontrakt, voidKontrakt, anwendenErfuellt, anwendenStrafe, tagLokal, type Strafe } from "@/lib/kontrakt";

export function KontraktCard({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [uhrzeit, setUhrzeit] = useState("21:30");
  const [strafe, setStrafe] = useState<Strafe>("xp30");
  const now = new Date();
  const heute = tagLokal(now);
  const k = progress.kontrakt;
  const u = pruefeKontrakt(progress, now);

  // التنفيذ التلقائي الوحيد: وفاءٌ يُسجَّل أو غرامةٌ تُنفَّذ — وكلاهما محروس بوسم اليوم فلا يتكرر
  useEffect(() => {
    if (!k) return;
    if (u.status === "erfuellt" && k.streakTag !== heute) update((p) => anwendenErfuellt(p, new Date()));
    if (u.status === "gebrochen" && k.lastPenalty !== heute) update((p) => anwendenStrafe(p, new Date()).p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [u.status, heute]);

  const gefaellt = k?.strafe === "flecken1" ? "نزع رقعة" : "−30 XP";

  return (
    <div className="card fadein" style={{ padding: "1rem 1.2rem", borderInlineStart: "5px solid var(--color-cola)" }}>
      <strong style={{ fontSize: "1.02rem" }}>🔒 عقد الانضباط — Tagesvertrag</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", margin: "0.3rem 0 0.6rem", lineHeight: 1.8 }}>
        موعد إغلاق ليلي يحدده المتعلم نفسه: عند الساعة يقرأ المحرك دفتر اليوم — إتمامٌ واحد يكفي للبراءة؛
        صفرٌ يعني كسراً وغرامة رمزية. العار المولَّد يُروى من سجلّ صاحبه فقط، ولا يُعاقَب مرتين في يوم.
      </div>

      {!k ? (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <label className="chip" style={{ display: "flex", gap: "0.35rem", alignItems: "center", padding: "0.3rem 0.6rem" }}>
            🕘 الإغلاق
            <input
              type="time"
              aria-label="ساعة الإغلاق"
              value={uhrzeit}
              onChange={(e) => setUhrzeit(e.target.value || "21:30")}
              style={{ direction: "ltr", border: 0, background: "none", font: "inherit", width: "5.8rem", cursor: "pointer" }}
            />
          </label>
          <label className="chip" style={{ cursor: "pointer", display: "flex", gap: "0.3rem", alignItems: "center", padding: "0.3rem 0.6rem" }}>
            <input type="radio" name="kontrakt-strafe" checked={strafe === "xp30"} onChange={() => setStrafe("xp30")} />
            غرامة بخار: −30 XP
          </label>
          <label className="chip" style={{ cursor: "pointer", display: "flex", gap: "0.3rem", alignItems: "center", padding: "0.3rem 0.6rem" }}>
            <input type="radio" name="kontrakt-strafe" checked={strafe === "flecken1"} onChange={() => setStrafe("flecken1")} />
            نزع رقعة من الجدار
          </label>
          <button className="btn btn-primary" onClick={() => update((p) => signKontrakt(p, uhrzeit, strafe, new Date()))}>
            ✍️ وقّع عقد اليوم
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginBottom: "0.5rem", direction: "ltr", textAlign: "right" }}>
            seit <span className="rtl-num">{k.seit}</span> · 🕘 {k.uhrzeit} · 🔥 streak{" "}
            <span className="rtl-num">{k.streak}</span> · ⚖️ {gefaellt}
          </div>

          {u.status === "laufend" && (
            <div className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-gold-soft)", fontWeight: 700 }}>
              ⏳ بقي <span className="rtl-num">{u.minuten}</span> دقيقة على الإغلاق — ما زالت يداك طليقتين.
            </div>
          )}
          {u.status === "erfuellt" && (
            <div className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-a1-soft, #e6f4ea)", fontWeight: 700 }}>
              ✅ يوم <span className="rtl-num">{heute}</span> وفيّ — سجّل المحرك الإتمام وحلقة السلسلة تشتعل (streak <span className="rtl-num">{k.streak}</span>).
            </div>
          )}
          {u.status === "gebrochen" && (
            <div style={{ background: "var(--color-cola-soft)", borderRadius: "0.7rem", padding: "0.75rem 0.95rem", fontWeight: 700, lineHeight: 1.9 }}>
              💔 كسر العقد — {u.scham ?? k.lastShame}
              <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                {k.lastPenalty !== heute ? (
                  <button className="btn btn-primary" onClick={() => update((p) => anwendenStrafe(p, new Date()).p)}>
                    ⚖️ نفّذ الغرامة
                  </button>
                ) : (
                  <span className="chip">نفّذت الغرامة اليوم — لا عقاب مزدوج</span>
                )}
                <button className="btn btn-gold" onClick={() => update((p) => signKontrakt(p, uhrzeit, strafe, new Date()))}>
                  ✍️ اربط عقداً جديداً الآن
                </button>
              </div>
            </div>
          )}
          {u.status === "kein" && (
            <div className="card" style={{ padding: "0.7rem 0.9rem", color: "var(--color-ink2)" }}>
              عقد الأم أمسُ مات — لا يدين اليوم. اربط واحداً جديداً إن شئت.
            </div>
          )}

          <div style={{ marginTop: "0.55rem" }}>
            <button className="btn btn-ghost" style={{ padding: "0.15rem 0.7rem", fontSize: "0.82rem" }} onClick={() => update((p) => voidKontrakt(p))}>
              🗑️ مزّق العقد — إلغاء نظيف بلا أثر
            </button>
          </div>
        </>
      )}
    </div>
  );
}
