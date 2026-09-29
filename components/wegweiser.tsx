"use client";
/**
 * ============================================================
 *  WegWeiser — البطاقة الأولى التي يرى المتعلم كل صباح
 * ============================================================
 *  لا تقرر الواجهة شيئاً وحدها: كل سطر هنا من lib/weg.ts
 *  المشتق من سجلّ الأنشطة + شبكة الكفاءات. ثلاث وجهات لليوم
 *  بسبب معلن لكل واحدة، ثم «ما يمكنك أيضاً»، ثم المقفل
 *  بالمراحل القادمة صراحةً — لا جدار أكورديونات ولا تيه.
 * ============================================================
 */
import type { Progress } from "@/lib/types";
import { wegHeute, tagVonStufe, type WegItem } from "@/lib/weg";

export function WegWeiser({ progress }: { progress: Progress }) {
  const weg = wegHeute(progress);
  function springe(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const KREIS = ["①", "②", "③"];
  const Ziel = ({ item, i }: { item: WegItem; i: number }) => (
    <div
      key={item.akt.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".5rem",
        flexWrap: "wrap",
        padding: ".45rem 0",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <span style={{ fontWeight: 900, color: "var(--color-a1)", fontSize: "1rem" }}>{KREIS[i] ?? "•"}</span>
      <button className="btn btn-primary" style={{ padding: ".25rem .7rem", fontSize: ".82rem" }} onClick={() => springe(item.anker)} dir="auto">
        {item.akt.emoji} {item.akt.titel.split(" — ")[0]} ←
      </button>
      <span style={{ flex: 1, minWidth: "10rem", fontSize: ".76rem", color: "var(--color-ink2)" }}>{item.grundAr}</span>
    </div>
  );
  return (
    <div className="card fadein" id="wegweiser" style={{ padding: "1rem 1.2rem", borderInlineStart: "5px solid var(--color-a1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".35rem" }}>
        <b style={{ color: "var(--color-cola)", fontSize: "1.02rem" }}>🧭 مسارك اليوم — Dein Weg</b>
        <span className="chip" dir="ltr" style={{ fontWeight: 700 }}>
          Stufe {weg.stufe}/8 · Tag {weg.von}–{weg.bis}
        </span>
      </div>
      {weg.heute.length === 0 ? (
        <div style={{ fontSize: ".85rem", color: "var(--color-ink2)", marginTop: ".4rem" }}>لا نشاط مفتوح في هذه اللحظة — ابدأ من أي جناح أدناه وستنفتح الوجهات غداً.</div>
      ) : (
        <div style={{ marginTop: ".3rem" }}>
          {weg.heute.map((item, i) => (
            <Ziel key={item.akt.id} item={item} i={i} />
          ))}
        </div>
      )}
      {weg.offen.length > 0 && (
        <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", marginTop: ".5rem" }}>
          <span style={{ fontSize: ".72rem", color: "var(--color-ink2)", alignSelf: "center" }}>ما يمكنك أيضاً:</span>
          {weg.offen.map((item) => (
            <button key={item.akt.id} className="chip" style={{ cursor: "pointer", fontSize: ".72rem" }} onClick={() => springe(item.anker)} title={item.akt.unter}>
              {item.akt.emoji} {item.akt.titel.split(" — ")[0]}
            </button>
          ))}
        </div>
      )}
      {weg.spaeter.length > 0 && (
        <div style={{ marginTop: ".5rem", fontSize: ".72rem", color: "var(--color-ink2)" }}>
          🔒 لاحقاً حتى لا يشتتّك — {weg.spaeter.map((s) => `${s.akt.emoji} «${s.akt.titel.split(" — ")[0]}» في المرحلة ${s.ab} (يوم ${tagVonStufe(s.ab)[0]})`).join(" · ")}
        </div>
      )}
    </div>
  );
}
