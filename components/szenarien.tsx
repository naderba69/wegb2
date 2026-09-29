"use client";
// 🏥 سيناريوهات الحياة — LebensSzenarien (Modul Q) في جناح التعليم
// ستّة سيناريوهات حيوية، لكل واحد حزمة مكتملة (لا أدوات شاردة):
//   🗣️ 6 جُمل جاهزة بالتسميع · 💬 حواران بأدوار حقيقية · ✍️ نموذج طلب رسمي · 🎭 دور مُصاغ بخطة
// التسميع والتقييم الذاتي يمرّان بخطّي الأنابيب: شبكة الكفاءات ودفتر الأخطاء.
import { useState } from "react";
import type { Progress, Szenario } from "@/lib/types";
import { szenarien } from "@/lib/content";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny } from "@/lib/speech";
import { De } from "./De";

type Tab = "saetze" | "dialoge" | "formular" | "rolle";

const TAB_LABEL: { id: Tab; emoji: string; name: string }[] = [
  { id: "saetze", emoji: "🗣️", name: "الجُمل الست" },
  { id: "dialoge", emoji: "💬", name: "الحواران" },
  { id: "formular", emoji: "✍️", name: "نموذج الطلب" },
  { id: "rolle", emoji: "🎭", name: "الدور المُصاغ" },
];

function Saetze({ s }: { s: Szenario }) {
  const { update } = useProgress();
  const [offen, setOffen] = useState<Record<number, boolean>>({});
  const [geuebt, setGeuebt] = useState<Record<number, boolean>>({});

  const probe = (i: number, ok: boolean) => {
    if (geuebt[i]) return;
    setGeuebt((g) => ({ ...g, [i]: true }));
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 2 : 1) }), "Sprechen", ok));
    if (!ok) {
      addFehlerNow({
        falsch: `(تعثّرت في) ${s.saetze[i].de}`,
        richtig: s.saetze[i].de,
        art: "wortschatz",
        ar: `جملة جاهزة من سيناريو «${s.nameAr}»: ${s.saetze[i].ar}`,
        quelle: `Szenario: ${s.nameDe}`,
      });
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        🗣️ المنهجية: شغّل الصوت وكرّر ثلاثاً ← اخترع الجملة من الذاكرة قبل الكشف ← ثم قيّم نفسك.
      </div>
      {s.saetze.map((z, i) => (
        <div key={i} className="card" style={{ padding: "0.65rem 0.9rem" }}>
          <div style={{ display: "flex", gap: "0.45rem", alignItems: "baseline", flexWrap: "wrap" }}>
            <button className="btn btn-ghost" style={{ padding: "0.25rem 0.7rem" }} onClick={() => speakAny(z.de)}>🔊</button>
            <span style={{ fontWeight: 800, flex: 1, minWidth: "14rem" }}><De>{z.de}</De></span>
          </div>
          {offen[i] ? (
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>{z.ar}</div>
          ) : (
            <button className="btn btn-ghost" style={{ padding: "0.2rem 0.7rem", fontSize: "0.78rem", marginTop: "0.25rem" }} onClick={() => setOffen((o) => ({ ...o, [i]: true }))}>
              👁 اكشف المعنى (بعد المحاولة!)
            </button>
          )}
          {offen[i] && (
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.35rem" }}>
              {geuebt[i] ? (
                <span className="chip" style={{ color: "var(--color-a1)", borderColor: "var(--color-a1)" }}>✓ سُجّلت محاولتك</span>
              ) : (
                <>
                  <button className="btn btn-primary" style={{ flex: 1, padding: "0.35rem" }} onClick={() => probe(i, true)}>قلتها بطلاقة ✓</button>
                  <button className="btn btn-ghost" style={{ flex: 1, padding: "0.35rem" }} onClick={() => probe(i, false)}>تعثّرت 🔁</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Dialoge({ s }: { s: Szenario }) {
  const { update } = useProgress();
  const [rolleAus, setRolleAus] = useState<"A" | "B" | null>(null);
  const [bewertet, setBewertet] = useState<Record<number, boolean>>({});

  const probe = (di: number, ok: number) => {
    if (bewertet[di]) return;
    setBewertet((b) => ({ ...b, [di]: true }));
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok >= 2 ? 5 : 2) }), "Sprechen", ok >= 2));
  };

  return (
    <div style={{ display: "grid", gap: "0.7rem" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        💬 اختر دورك فيُخفى نصّك فتؤدّيه من الذاكرة — ثم اكشف وقيّم نفسك (ثلاثة مستويات).
      </div>
      {s.dialoge.map((d, di) => (
        <div key={di} className="card" style={{ padding: "0.75rem 1rem" }}>
          <div style={{ fontWeight: 800, marginBottom: "0.35rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
            <span>💬 {d.titel}</span>
            <span style={{ display: "flex", gap: "0.3rem" }}>
              {(["A", "B"] as const).map((r) => (
                <button
                  key={r}
                  className="chip"
                  style={{ cursor: "pointer", background: rolleAus === r ? "var(--color-cola)" : "white", color: rolleAus === r ? "white" : undefined }}
                  onClick={() => setRolleAus(rolleAus === r ? null : r)}
                >
                  {rolleAus === r ? `👁 دور ${r} مخفي` : `أدِّ دور ${r}`}
                </button>
              ))}
            </span>
          </div>
          {d.lines.map((l, i) => {
            const versteckt = rolleAus === l.who;
            return (
              <div key={i} style={{ display: "flex", gap: "0.45rem", padding: "0.22rem 0", alignItems: "baseline", borderTop: i ? "1px dashed var(--color-line)" : "none" }}>
                <button className="btn btn-ghost" style={{ padding: "0.15rem 0.55rem" }} onClick={() => speakAny(l.de)}>🔊</button>
                <span className="chip" style={{ fontSize: "0.68rem", padding: "0.1rem 0.4rem" }}>{l.who}·{l.role}</span>
                <span style={{ flex: 1, filter: versteckt ? "blur(5px)" : "none", userSelect: versteckt ? "none" : "auto", fontWeight: 600 }}>
                  <De>{l.de}</De>
                  <div style={{ fontWeight: 400, fontSize: "0.78rem", color: "var(--color-ink2)" }}>{l.ar}</div>
                </span>
              </div>
            );
          })}
          {rolleAus && (
            <div style={{ marginTop: "0.45rem", display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
              {bewertet[di] ? (
                <span className="chip" style={{ color: "var(--color-a1)", borderColor: "var(--color-a1)" }}>✓ سُجّل أداؤك</span>
              ) : (
                <>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>أدّيتُ دور {rolleAus}:</span>
                  <button className="btn btn-primary" style={{ padding: "0.3rem 0.8rem" }} onClick={() => probe(di, 3)}>كامل بلا مساعدة 🌟</button>
                  <button className="btn btn-ghost" style={{ padding: "0.3rem 0.8rem" }} onClick={() => probe(di, 2)}>مع نظرة خاطفة 👀</button>
                  <button className="btn btn-ghost" style={{ padding: "0.3rem 0.8rem" }} onClick={() => probe(di, 1)}>قرأتُ النصّ 📖</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Formular({ s }: { s: Szenario }) {
  const { update } = useProgress();
  const [mein, setMein] = useState("");
  const [bewertet, setBewertet] = useState(false);

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        ✍️ النموذج الرسمي مقسّم الأسطر — انسخ بنيته بأسلوبك: نفس الترتيب، كلامك أنت.
      </div>
      <div className="card" style={{ padding: "0.8rem 1rem", background: "var(--color-paper)" }}>
        <div style={{ fontWeight: 800, marginBottom: "0.35rem" }}>{s.formular.titel}</div>
        {s.formular.zeilen.map((z, i) => (
          <div key={i} style={{ fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.8, whiteSpace: "pre-wrap", borderTop: i ? "1px dashed var(--color-line)" : "none", padding: "0.15rem 0" }}>
            <span style={{ color: "var(--color-ink2)" }}>{i + 1}. </span>
            <De>{z}</De>
          </div>
        ))}
      </div>
      <textarea
        className="input"
        style={{ width: "100%", minHeight: "5.5rem" }}
        placeholder="اكتب سطر افتتاح رسالتك أنت هنا… (Betreff + Anrede)"
        value={mein}
        onChange={(e) => setMein(e.target.value)}
      />
      {bewertet ? (
        <div className="card" style={{ padding: "0.7rem 0.9rem", fontSize: "0.85rem" }}>
          ✅ سُجّلت محاولتك الكتابية. قارن افتتاحيتك بسطر النموذج 1-2 وأصلح الفروق بنفسك — هذا هو التمرين.
        </div>
      ) : (
        <button
          className="btn btn-gold"
          disabled={!mein.trim()}
          onClick={() => {
            setBewertet(true);
            update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 5 }), "Schreiben", mein.trim().length >= 15));
          }}
        >
          سلّم افتتاحيتك ✓
        </button>
      )}
    </div>
  );
}

function Rolle({ s }: { s: Szenario }) {
  const { update } = useProgress();
  const [bewertet, setBewertet] = useState(false);

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div className="card" style={{ padding: "0.85rem 1.1rem", borderInlineStart: "5px solid var(--color-gold)" }}>
        <div style={{ fontWeight: 900 }}>🎭 مسرح الدور — {s.rolle.sitter} ↔ {s.rolle.partner}</div>
        <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.3rem 0" }}>{s.kontext}</div>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", margin: "0.3rem 0" }}>
          {s.rolle.stichworte.map((k) => <span key={k} className="chip" style={{ fontSize: "0.75rem" }}>🗝 {k}</span>)}
        </div>
        <div style={{ fontWeight: 800, fontSize: "0.85rem", marginTop: "0.3rem" }}>خطة الدور الثلاثية:</div>
        <ol style={{ margin: "0.2rem 0 0", paddingInlineStart: "1.2rem", fontSize: "0.88rem", lineHeight: 1.9 }}>
          {s.rolle.plan.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
      </div>
      <div className="card" style={{ padding: "0.7rem 0.9rem", fontSize: "0.85rem" }}>
        🎯 التمثيل: جهّز شريكاً (أباً/أخاً/تطبيق ترجمة يقرأ دور B) ونفّذ الدور كاملاً بصوت عالٍ — ستّ جُمل الحوار تكفي.
      </div>
      {bewertet ? (
        <div className="card" style={{ padding: "0.7rem 0.9rem", fontWeight: 700 }}>
          🌟 تمثيل مسجَّل! عُد غداً للسيناريو التالي — التكرار الأسبوعي هو ما يحوّل الدور إلى ملكة.
        </div>
      ) : (
        <button
          className="btn btn-gold"
          onClick={() => {
            setBewertet(true);
            update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + 8 }), "Sprechen", true));
          }}
        >
          أنجزتُ التمثيل كاملاً 🎭
        </button>
      )}
    </div>
  );
}

export function LebensSzenarien({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [sid, setSid] = useState(szenarien[0].id);
  const [tab, setTab] = useState<Tab>("saetze");
  const s = szenarien.find((x) => x.id === sid) ?? szenarien[0];

  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🏥 سيناريوهات الحياة — LebensSzenarien <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul Q)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        اثنتا عشرة ساحةً تُدار بالألمانية: طوارئ · بلدية · بنك · سكن · عمل · جامعة — وبجناح ξ8: عِوَضُ المواطنة · بدلُ السكن · بدلُ الأطفال · صندوقُ المرضى · دعمُ الدراسة · الرقمُ الضريبي — لكل حزمة: جُمل مسموعة + حواران بأدوار + نموذج طلب + دور مُصاغ.
      </div>
      {open && (
        <>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            {szenarien.map((x) => (
              <button
                key={x.id}
                className="chip"
                style={{ cursor: "pointer", background: sid === x.id ? "var(--color-cola)" : "white", color: sid === x.id ? "white" : undefined }}
                onClick={() => { setSid(x.id); setTab("saetze"); }}
              >
                {x.emoji} {x.nameAr}
              </button>
            ))}
          </div>
          <div className="card" style={{ padding: "0.6rem 0.9rem", fontSize: "0.85rem", marginBottom: "0.6rem", background: "var(--color-paper)" }}>
            <strong><De>{s.nameDe}</De> — {s.nameAr}:</strong> {s.kontext}
          </div>
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            {TAB_LABEL.map((t) => (
              <button
                key={t.id}
                className="chip"
                style={{ cursor: "pointer", background: tab === t.id ? "var(--color-a2)" : "white", color: tab === t.id ? "white" : undefined }}
                onClick={() => setTab(t.id)}
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
          {tab === "saetze" && <Saetze key={sid} s={s} />}
          {tab === "dialoge" && <Dialoge key={sid} s={s} />}
          {tab === "formular" && <Formular key={sid} s={s} />}
          {tab === "rolle" && <Rolle key={sid} s={s} />}
        </>
      )}
    </div>
  );
}
