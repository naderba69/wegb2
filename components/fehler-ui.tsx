"use client";
import { useMemo, useState } from "react";
import { levelAmTag } from "@/lib/phasen";
import type { FehlerState } from "@/lib/types";
import { useProgress, gradeFehlerNow, addFehlerNow } from "@/lib/store";
import { FEHLER_KAT, normKey, platzierungsFragen, vorschlagTag } from "@/lib/fehler";
import { grammarMap } from "@/lib/content";
import { speakAny } from "@/lib/speech";
import ExerciseSet from "./exercises";
import { transferUebung, istUeberkonfident } from "@/lib/fehlerbank2";
import { alleVokabeln } from "@/lib/content";
import { rng } from "@/lib/plan";

// ── 📓 مهمة دفتر الأخطاء: مراجعة متباعدة بأخطائك الحقيقيّة ──────────────
export function Fehlerheft({
  fehlerKeys,
  onPoints,
  voiceName,
  rate,
}: {
  fehlerKeys: string[];
  onPoints: (p: number, m: number) => void;
  voiceName?: string;
  rate?: number;
}) {
  const { progress } = useProgress();
  const [state, setState] = useState<Record<string, { choice: string; ok: boolean }>>({});
  const list = fehlerKeys
    .map((k) => progress.fehler?.[k])
    .filter(Boolean) as FehlerState[];
  /** 2.0: تمرينُ نقلٍ جديدٌ لكلِّ خطأٍ له بطاقةٌ مرتبطة — لا السؤالُ نفسُه */
  const transfers = useMemo(() => {
    const rand = rng(fehlerKeys.join("|").length * 7 + 3);
    const m: Record<string, ReturnType<typeof transferUebung>> = {};
    for (const f of list) m[f.key] = transferUebung(f, alleVokabeln, rand);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.map((f) => f.key + ":" + f.treffer).join("|")]);

  if (!list.length) {
    return (
      <section className="card fadein" style={{ padding: "1.2rem" }}>
        <p>✨ لا أخطاء مستحقّة اليوم — دفترك نظيف في هذا الموعد.</p>
      </section>
    );
  }

  const pruefen = (f: FehlerState, choice: string) => {
    if (state[f.key]) return;
    const ok = choice === f.richtig;
    setState((s) => ({ ...s, [f.key]: { choice, ok } }));
    gradeFehlerNow(f.key, ok);
    onPoints(ok ? 1 : 0, 1);
  };

  return (
    <section className="card fadein" style={{ padding: "1.2rem" }}>
      <h3 style={{ fontWeight: 900, marginBottom: "0.3rem" }}>📓 دفتر الأخطاء</h3>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.9rem" }}>
        هذه أخطاؤك أنت — راجعها بنظام التكرار المتباعد حتى تنطفئ. أصبتَ ← يبتعد موعدُها؛ أخطأتَ ← تعود غداً.
      </p>
      <div style={{ display: "grid", gap: "0.8rem" }}>
        {list.map((f) => {
          const st = state[f.key];
          const tr = transfers[f.key];
          if (tr) {
            return (
              <div key={f.key} data-testid="fehler-transfer" className="card" style={{ padding: "0.8rem 1rem", borderInlineStart: istUeberkonfident(f) ? "4px solid var(--color-cola)" : "4px solid var(--color-gold)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.3rem" }}>
                  {istUeberkonfident(f) && <strong style={{ color: "var(--color-cola)" }}>⚠️ ثقة خاطئة سابقاً · </strong>}
                  {FEHLER_KAT[f.art] ?? f.art} · تكرّر {f.treffer} مرة — سؤالٌ جديدٌ على الكلمةِ نفسِها ({tr.art === "kollokation" ? "متلازمة" : "جملة"}): <span dir="ltr">{f.richtig}</span>
                </div>
                <ExerciseSet items={[tr.ex]} onPoints={(p, m) => { const ok = p > 0; setState((s) => ({ ...s, [f.key]: { choice: ok ? f.richtig : f.falsch, ok } })); gradeFehlerNow(f.key, ok); onPoints(ok ? 1 : 0, 1); }} />
                {st && (
                  <div data-testid="fehler-transfer-ergebnis" style={{ marginTop: "0.5rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
                    {st.ok ? "✅ نُقلت المعرفة إلى سياق جديد — يبتعد موعد هذا الخطأ." : "❌ الخطأ ما زال حيّاً في سياق جديد — يعود غداً."} <span style={{ color: "var(--color-ink2)" }}>{f.ar}</span>
                  </div>
                )}
              </div>
            );
          }
          // ترتيب حتمي للخيارات
          const opts = f.key.charCodeAt(0) % 2 === 0 ? [f.falsch, f.richtig] : [f.richtig, f.falsch];
          return (
            <div
              key={f.key}
              className="card"
              style={{
                padding: "0.8rem 1rem",
                borderInlineStart: st
                  ? st.ok
                    ? "4px solid var(--color-a1)"
                    : "4px solid var(--color-cola)"
                  : "4px solid var(--color-gold)",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.3rem" }}>
                {FEHLER_KAT[f.art] ?? f.art} · تكرّر {f.treffer} مرة — أيّ صيغة صحيحة؟
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {opts.map((o) => (
                  <button
                    key={o}
                    className="btn btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      textAlign: "start",
                      direction: "ltr",
                      background: st ? (o === f.richtig ? "var(--color-a1)" : "white") : "white",
                      color: st && o === f.richtig ? "white" : undefined,
                    }}
                    disabled={!!st}
                    onClick={() => pruefen(f, o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {st && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  {st.ok ? "✅ أحسنت — ستبتعد هذه عن موعدك." : "❌ عادت لك بموعد أقرب — ركّز:"} {f.ar}
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                    <button
                      className="chip"
                      style={{ cursor: "pointer" }}
                      onClick={() => speakAny(f.richtig)}
                    >
                      🔊 اسمع الصيغة الصحيحة
                    </button>
                    {f.quelle && <span className="chip">المصدر: {f.quelle}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 🪤 فخاخ الأخطاء الشائعة (تدريب استباقي من الموسوعة) ─────────────────
export function FehlerFallen({
  items,
  onPoints,
}: {
  items: { falsch: string; richtig: string; ar: string; art?: string }[];
  onPoints: (p: number, m: number) => void;
}) {
  const [state, setState] = useState<Record<number, { ok: boolean }>>({});

  const pruefen = (
    i: number,
    it: { falsch: string; richtig: string; ar: string; art?: string },
    choice: string
  ) => {
    if (state[i]) return;
    const ok = choice === it.richtig;
    setState((s) => ({ ...s, [i]: { ok } }));
    onPoints(ok ? 1 : 0, 1);
    const key = normKey(`${it.falsch}|${it.richtig}`);
    if (ok) gradeFehlerNow(key, true); // إن كان في دفترك: قرّب موعد إتقانه
    else
      addFehlerNow({
        falsch: it.falsch,
        richtig: it.richtig,
        art: it.art ?? "sonst",
        ar: it.ar,
        quelle: "فخاخ الموسوعة",
      });
  };

  return (
    <section className="card fadein" style={{ padding: "1.2rem" }}>
      <h3 style={{ fontWeight: 900, marginBottom: "0.3rem" }}>🪤 فخاخ الأخطاء الشائعة</h3>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.9rem" }}>
        من موسوعة أخطاء الناطقين بالعربية — اختر الصيغة الصحيحة قبل أن يخدعك الفخّ. ما تخطئه يدخل دفتر أخطائك الشخصي فوراً.
      </p>
      <div style={{ display: "grid", gap: "0.8rem" }}>
        {items.map((it, i) => {
          const st = state[i];
          const opts = i % 2 === 0 ? [it.falsch, it.richtig] : [it.richtig, it.falsch];
          return (
            <div
              key={i}
              className="card"
              style={{
                padding: "0.8rem 1rem",
                borderInlineStart: st
                  ? st.ok
                    ? "4px solid var(--color-a1)"
                    : "4px solid var(--color-cola)"
                  : "4px solid var(--color-gold)",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginBottom: "0.3rem" }}>
                {FEHLER_KAT[it.art ?? "sonst"] ?? it.art} — أيّ صيغة صحيحة؟
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {opts.map((o) => (
                  <button
                    key={o}
                    className="btn btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      textAlign: "start",
                      direction: "ltr",
                      background: st && o === it.richtig ? "var(--color-a1)" : "white",
                      color: st && o === it.richtig ? "white" : undefined,
                    }}
                    disabled={!!st}
                    onClick={() => pruefen(i, it, o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {st && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  {st.ok ? "✅ ممتاز — تفاديت الفخّ." : "❌ وقعت في الفخّ — تذكّر:"} {it.ar}
                  <div style={{ marginTop: "0.4rem" }}>
                    <button
                      className="chip"
                      style={{ cursor: "pointer" }}
                      onClick={() => speakAny(it.richtig)}
                    >
                      🔊 اسمع الصيغة الصحيحة
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 📓 كشوف دفتر الأخطاء (الإعدادات) ───────────────────────────────────
export function Fehlerkartei() {
  const { progress, update } = useProgress();
  const list = Object.values(progress.fehler ?? {}).sort((a, b) => b.treffer - a.treffer);
  return (
    <section className="card" style={{ padding: "1.3rem" }}>
      <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>📓 دفتر الأخطاء — كشوفك</h2>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>
        كل خطأ ارتكبته يُسجَّل هنا مع شرحه وجدول مراجعته المتباعدة. مهمة «Fehlerheft» في خطتك تُغذّى من هذه القائمة.
      </p>
      {list.length === 0 ? (
        <p>✨ الدفتر فارغ بعد — ابدأ التعلّم وسيمتلئ تلقائياً.</p>
      ) : (
        <div style={{ display: "grid", gap: "0.5rem", maxHeight: "24rem", overflowY: "auto" }}>
          {list.map((f) => (
            <div key={f.key} style={{ background: "var(--color-paper2)", borderRadius: "0.6rem", padding: "0.6rem 0.8rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="chip">{FEHLER_KAT[f.art] ?? f.art}</span>
                <button
                  className="chip"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    update((p) => {
                      const fehler = { ...(p.fehler ?? {}) };
                      delete fehler[f.key];
                      return { ...p, fehler };
                    })
                  }
                >
                  🗑 حذف
                </button>
              </div>
              <div style={{ direction: "ltr", margin: "0.3rem 0" }}>
                <s style={{ color: "var(--color-cola)" }}>{f.falsch}</s> → <strong>{f.richtig}</strong>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{f.ar}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
                موعد المراجعة القادم: {new Date(f.srs.due).toLocaleDateString("ar")} · تكرّر {f.treffer} · نجاحات {f.srs.reps}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── 🧠 استراتيجيات التعلّم وحيل الحفظ ─────────────────────────────────
export function Lernstrategien() {
  const { update } = useProgress();
  const techniken = [
    ["⏱ التكرار المتباعد (SM-2)", "البطاقات والأخطاء تعود في مواعيدها العلمية: 1 ← 3 ← 7 ← 15… يوماً — لا تحفظ مرتين في يوم."],
    ["🩸 الجرعات الصغيرة", "3–5 كلمات جديدة في الجلسة، مراجعة كثيرة — هذا أثبت من «حشو» 50 كلمة."],
    ["🖼 التشفير المزدوج", "صورة + كلمة + نطق + مثال: كل قناة حسّ تبني خيط تذكّر مستقلاً."],
    ["🔁 الاسترجاع النشط", "اغطِ الجواب وتعرّض: cloze و«صحّح الخطأ» ودفتر الأخطاء أقوى من إعادة القراءة بـ3 مرات."],
    ["🗝 الكلمة المفتاحية", "اربط الكلمة بشبيه عربي مضحك: Hose ≈ «حوزة» — الحيلة السخيفة تُنسى أبطأ. (💡 على البطاقات)"],
    ["🎨 حيل الأدوات باللون", "der = أحمر · die = أزرق · das = ذهبي — ارسم الأداة مع الاسم كقطعة واحدة."],
    ["✍️ الكتابة الخطأ أولاً", "دع المصحّح يكسر جملك ثم أعد بناءها: الخطأ المؤشَّر يُحوَّل فوراً إلى بطاقة في دفترك."],
    ["🗣 النطق كجسرين", "سمع + كرّر + اكتب: الإملاء اليومي يربط الأذن باليد."],
  ];
  const regeln = [
    ["die مؤنثة يقيناً", "كلمات -ung / -heit / -keit / -schaft / -ion / -tät / -ei / -enz / -ik"],
    ["das محايد غالباً", "-chen / -lein / -ment / اسم الجماعة Ge-…-e (Getränk, Getreide)"],
    ["der مذكّر غالباً", "-ling / -ismus / -or / -ant / -ist وأيام الأسبوع والشهور والفصول والطقس"],
    ["جمع مطمئن", "كلمات التأنيث وأسماء المهن فين -innen للإناث (Lehrerin)"],
  ];
  return (
    <section className="card" style={{ padding: "1.3rem", background: "var(--color-paper2)" }}>
      <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🧠 كيف يذاكر المحترفون — حيل الحفظ السريع</h2>
      <div style={{ display: "grid", gap: "0.5rem", margin: "0.6rem 0" }}>
        {techniken.map(([t1, t2]) => (
          <div key={t1} style={{ background: "white", borderRadius: "0.6rem", padding: "0.55rem 0.8rem" }}>
            <strong>{t1}</strong>
            <div style={{ fontSize: "0.87rem", color: "var(--color-ink2)" }}>{t2}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontWeight: 800, margin: "0.8rem 0 0.4rem" }}>🎨 قواعد الأدوات (تغطي كل الأسماء بلا استثناء)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", direction: "rtl" }}>
        <tbody>
          {regeln.map(([a, b]) => (
            <tr key={a}>
              <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.4rem", fontWeight: 700, whiteSpace: "nowrap" }}>{a}</td>
              <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.4rem" }}>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "0.9rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => update((p) => ({ ...p, settings: { ...p.settings, placed: false } }))}>
          🏫 أعد اختبار تحديد المستوى
        </button>
      </div>
    </section>
  );
}

// ── 🏫 اختبار تحديد المستوى ───────────────────────────────────────────
export function Einstufung() {
  const { update } = useProgress();
  const fragen = useMemo(() => platzierungsFragen(grammarMap), []);
  const [grp, setGrp] = useState<Record<string, boolean>>({});

  const levelOfId = (id: string) => {
    const real = id.replace(/^pl-\d+-/, "");
    return grammarMap[real]?.level ?? "A1";
  };

  const fertig = Object.keys(grp).length >= fragen.length;
  const gruppen: Record<string, number> = {};
  for (const [id, ok] of Object.entries(grp)) {
    const lv = levelOfId(id);
    gruppen[lv] = (gruppen[lv] ?? 0) + (ok ? 1 : 0);
  }
  const vorschlag = vorschlagTag(gruppen);

  return (
    <section className="card fadein" style={{ padding: "1.2rem", borderInlineStart: "5px solid var(--color-b1)" }}>
      <h3 style={{ fontWeight: 900 }}>🏫 اختبار تحديد المستوى (اختياري — 12 سؤالاً)</h3>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", margin: "0.4rem 0 0.8rem" }}>
        يقترح المدرّس نقطة انطلاقك A1→B2 لتفادي ما تتقنه فعلاً. أخطاؤك هنا تدخل دفتر الأخطاء مباشرة (تشخيص!). لن يتغيّر يومك إلا بتأكيدك.
      </p>
      <div style={{ display: "grid", gap: "0.8rem" }}>
        {fragen.map((ex) => (
          <ExerciseSet
            key={ex.id}
            items={[ex]}
            onPoints={(p) => setGrp((g) => ({ ...g, [ex.id]: p > 0 }))}
          />
        ))}
      </div>
      {fertig && (
        <div style={{ marginTop: "1rem", background: "var(--color-gold-soft)", borderRadius: "0.7rem", padding: "0.9rem 1rem" }}>
          <strong>
            اقتراح المدرّس: ابدأ من اليوم <span className="rtl-num">{vorschlag}</span>
            {` (${levelAmTag(vorschlag)})`}
          </strong>
          <div style={{ fontSize: "0.85rem", margin: "0.3rem 0 0.6rem" }}>
            نتائجك: A1 {gruppen.A1 ?? 0}/2 · A2 {gruppen.A2 ?? 0}/3 · B1 {gruppen.B1 ?? 0}/3 · B2 {gruppen.B2 ?? 0}/4
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={() =>
                update((p) => ({
                  ...p,
                  settings: { ...p.settings, placed: true },
                  plan: { ...p.plan, day: Math.max(p.plan.day, vorschlag) },
                }))
              }
            >
              تابع من اليوم {vorschlag} ←
            </button>
            <button className="btn btn-ghost" onClick={() => update((p) => ({ ...p, settings: { ...p.settings, placed: true } }))}>
              أكمل من حيث أنا
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
