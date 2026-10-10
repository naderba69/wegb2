"use client";

/**
 * Zentrum Lernstrategien (Modul O — Schritte 118–125) — جناح التعهّد ④
 * ---------------------------------------------------------------------------
 * «مدرّس تعلّم التعلّم الموسّع»: لا يعلّم الألمانية بل كيف يتعلّمها دماغك.
 *  · 🧭 استراتيجيات كل Teil (118) — تكتيكات امتحانية لكل جزء + نظام العلامات (119).
 *  · 🍅 بومودورو (121) · 😮‍💨 تنفس 4-7-8 لقلق الامتحان (122) — إدارة الجلسة والجسد.
 *  · 🧠 فاينمان (123) — اشرح القاعدة كأنك معلّم؛ من لا يستطيع شرحها لم يفهمها.
 *  · 📅 الأسبوع الموزون (120) — توزيع دقائقك على الرادار: الأضعف يأخذ الأكثر.
 *  · ✅ المصحّح الخماسي (124–125) — فحص ذاتي بأربع عيون قبل أن يمسحها الممتحِن.
 * يستوعب هذا المركز بطاقات الحيل القديمة (SRS · التشفير المزدوج…) وقاعدة إعادة
 * تحديد المستوى — لا أداة مشتتة جديدة، بل نفس البيت موسّعاً.
 */

import { useEffect, useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress, addFehlerNow } from "@/lib/store";
import { levelOf, pickN, rng } from "@/lib/plan";
import { logK, KOMPETENZEN, KOMPETENZ_AR, kompetenzWerte } from "@/lib/kompetenz";
import { checkAbzeichen } from "@/lib/spiel";
import { grammarMap, alleVokabeln } from "@/lib/content";

const TAG = () => new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------ 118 · Teil-Strategien */

const TEIL: Record<string, { emoji: string; de: string; ar: string; tipps: [string, string][] }> = {
  hoeren: {
    emoji: "🎧",
    de: "Hören",
    ar: "الاستماع",
    tipps: [
      [" Lies die Fragen VOR dem Ton — markiere Schlüsselwörter.", "اقرأ الأسئلة قبل أن يبدأ الصوت ودوّر الكلمات المفتاحية — تسمع منتبهاً لا متفاجئاً."],
      ["Zahlen: zweimal hinhören — die Antwort kommt meist später nochmal.", "الأرقام تتكرر غالباً مرتين — إن فاتتك الأولى لا تتوقف، الجواب يعود."],
      ["Teil 2 (richtig/falsch): achte auf «gar nicht», «leider», «eigentlich».", "في صحيح/خطأ تتغير الإجابة كلها بكلمة واحدة: «إطلاقاً · للأسف · في الحقيقة»."],
      ["Unbekanntes Wort? die Bedeutung aus dem Satz raten, nicht daran kleben bleiben.", "كلمة مفقودة؟ اخمن من السياق وانتقل — التوقف دقيقة كاملة من عمرك الامتحاني."],
      ["Beim zweiten Durchgang nur die offenen Lücken fixieren.", "الاستماعة الثانية ليست متعة — أغلق الفراغات الناقصة فقط."],
    ],
  },
  lesen: {
    emoji: "📖",
    de: "Lesen",
    ar: "القراءة",
    tipps: [
      ["Titel + erster Satz = Thema. Lies sie zuerst, dann die Aufgabe.", "العنوان والسطر الأول يحملان الموضوع — اقرأهما قبل النص كله."],
      ["Matching: die Lösung liegt im Synonym, nie im gleichen Wort.", "في توثيق الفقرات الجواب يأتي بمترادف لا بنفس الكلمة — ابحث عن المعنى لا الحرف."],
      ["«nicht / falsch» umkehrt alles — unterstreiche solche Wörter.", "كلمة نفي واحدة تقلب السؤال — ظلّلها حين تراها."],
      ["Unbekanntes Wort? Komposition knacken: Chemiker = Chemie + -iker (Beruf).", "الكلمة المجهولة غالباً مركّبة — فكّكها: Chemiker = كيمياء + لاحقة مهنة."],
      ["Zeitlimit pro Text ≈ 8 Min — sonst stirbt Teil 5.", "ثمانية دقائق لكل نص كحد أقصى — وإلا ماتت الفقرة الأخيرة بلا قراءة."],
    ],
  },
  schreiben: {
    emoji: "✍️",
    de: "Schreiben",
    ar: "الكتابة",
    tipps: [
      ["Erst 4 Stichpunkte, dann schreiben — nie umgekehrt.", "نقاط المطلوب الأربع أولاً، ثم الكتابة — لا العكس؛ كل نقطة حصة من الدرجات."],
      ["Kurze klare Sätze > schöne lange Risiko-Sätze.", "جملة قصيرة سليمة أجمل من طويلة سقطت في الفخّ."],
      ["Ein Anschluss pro Absatz (weil, deshalb, trotzdem) wirkt — zweimal genügt.", "أداة ربط في كل فقرة (weil/deshalb/trotzdem) ترفع الانطباع — مرّتان تكفيان."],
      ["4 Minuten für Selbstkorrektur zurückbehalten (unten im Labor!).", "احتفظ بأربع دقائق للتصحيح الذاتي — عدّة الخمس عيون في هذا المركز تحت."],
      ["Anrede + Grußformel auswendig können — Gratispunkte.", "صيغة التحية والختام احفظها كما هي — درجات مجانية لا تُخسر."],
    ],
  },
  sprechen: {
    emoji: "🗣",
    de: "Sprechen",
    ar: "المحادثة",
    tipps: [
      ["Präsentation: Struktur > Perfektion (Einleitung–Hauptteil–Schluss).", "البنية أهم من الكمال: مقدمة — صلب — خاتمة؛ الممتحِن يعطي نقاطه على الأجزاء."],
      ["Unterbrochen werden? «Kurze Rückfrage erlaubt?» — kostet nichts.", "قاطعك شريكك؟ «هل تسمح بسؤال سريع؟» — عبارة منقذة لا تُنقصك."],
      ["Am Ende eine Frage an den Partner stellen — Interaktion zählt.", "اختم بسؤال لشريكك — التفاعل مُنقّط بحد ذاته."],
      ["Zustimmung/Einspruch in zwei Redemitteln auswendig haben.", "جهّز عبارة موافخة وعبارة اعتراض من حفظك — تفتح بهما أي نقاش."],
      ["Drei Sekunden Stille sind normal: Lächeln, Frage nochmal lesen.", "ثلاث صمت لا كارثة — ابتسم وأعد قراءة السؤال بصوت مسموع صغير."],
    ],
  },
};

/** 119 · نظام العلامات الألماني — معرفة توفّر الأعصاب */
const NOTEN: [string, string][] = [
  ["90–100٪", "sehr gut (1) — ممتاز"],
  ["80–89٪", "gut (2) — جيد جداً"],
  ["65–79٪", "befriedigend (3) — جيد"],
  ["60–64٪", "ausreichend (4) — مقبول: هذا خط النجاة"],
  ["< 60٪", "nicht bestanden (5–6) — يُعاد الجزء الراسب وحده"],
];

function TeilStrategien() {
  const { update } = useProgress();
  const heute = TAG();
  const [lokal, setLokal] = useState<Record<string, boolean>>({});
  // الحالة المحفوظة اليوم (tag مضبوط) — وإلا محلية للجلسة
  const prog = useProgress();
  const gelernt = prog.progress.lernen?.tag === heute ? prog.progress.lernen : undefined;
  const an = (id: string) => !!gelernt?.teile?.includes(id) || !!lokal[id];

  function toggle(id: string) {
    const neu = !an(id);
    setLokal((s) => ({ ...s, [id]: neu }));
    update((p) => {
      const alt = p.lernen?.tag === heute ? p.lernen : { tag: heute, teile: [] };
      const teile = Array.from(new Set([...(alt.teile ?? []), id]));
      const voll = teile.length === 4 && (alt.teile?.length ?? 0) < 4;
      return voll ? checkAbzeichen({ ...p, lernen: { ...alt, teile }, xp: (p.xp ?? 0) + 4 }) : { ...p, lernen: { ...alt, teile } };
    });
  }

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      {Object.entries(TEIL).map(([id, t]) => (
        <div key={id} className="card" style={{ padding: "0.7rem 0.95rem", background: "var(--color-paper)", borderInlineStart: an(id) ? "4px solid var(--color-a1)" : "4px solid var(--color-line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <b style={{ fontSize: "0.92rem" }}>
              {t.emoji} {t.de} — {t.ar}
            </b>
            <button className="chip" style={{ cursor: "pointer", background: an(id) ? "var(--color-a1)" : "var(--ui-surface-raised)", color: an(id) ? "var(--ui-on-accent)" : undefined, border: 0 }} onClick={() => toggle(id)}>
              {an(id) ? "✓ طُبّقت اليوم" : "✓ طبّقتها هذا الأسبوع"}
            </button>
          </div>
          <ol style={{ margin: "0.4rem 0 0", paddingInlineStart: "1.2rem", fontSize: "0.8rem", lineHeight: 1.9 }}>
            {t.tipps.map(([de, ar], k) => (
              <li key={k}>
                <b className="de">{de.trim()}</b>
                <div style={{ color: "var(--color-ink2)" }} dir="rtl">{ar}</div>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <div className="card" style={{ padding: "0.7rem 0.95rem", background: "var(--color-gold-soft)" }}>
        <b style={{ fontSize: "0.85rem" }}>📐 نظام العلامات — حتى لا تُفاجأ بورقة النتائج</b>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", marginTop: 4 }} dir="rtl">
          <tbody>
            {NOTEN.map(([a, b]) => (
              <tr key={a}>
                <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.25rem 0.4rem", fontWeight: 800, whiteSpace: "nowrap" }}>{a}</td>
                <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.25rem 0.4rem" }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)", marginTop: 4 }} dir="rtl">
          أربعة أجزاء متساوية الثقل · خط النجاة 60٪ · الجزء الراسب وحده يُعاد — لا يعاد الامتحان كاملاً إلا حيث تُشترط الدورة الكاملة.
        </div>
      </div>
      <details style={{ fontSize: "0.78rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 800 }}>🎯 لماذا تنجح هذه الطرق؟ (بطاقات الحيل — SRS · التشفير · الجرعات)</summary>
        <div style={{ display: "grid", gap: 4, marginTop: 6 }} dir="rtl">
          {[
            ["⏱ التكرار المتباعد", "البطاقات والأخطاء تعود في مواعيدها العلمية: 1 ← 3 ← 7 ← 15 يوماً — لا تحفظ الشيء مرتين في يوم واحد."],
            ["🖼 التشفير المزدوج", "صورة + كلمة + نطق + مثال: كل قناة حسية خيط تذكّر مستقل."],
            ["🔁 الاسترجاع النشط", "غطِّ الجواب وحاول: أقوى من إعادة القراءة بثلاث مرات (ولهذا كل أدوات الوحدة W بلا خيارات)."],
            ["🩸 الجرعات الصغيرة", "3–5 كلمات جديدة في الجلسة — أثبت علمياً من حشو 50."],
          ].map(([a, b]) => (
            <div key={a} style={{ background: "var(--color-paper)", borderRadius: 8, padding: "0.4rem 0.6rem" }}>
              <b>{a}</b> — <span style={{ color: "var(--color-ink2)" }}>{b}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ------------------------------------------- 121–122 · Pomodoro + Atemübung */

function PomoCoach() {
  const { update } = useProgress();
  const heute = TAG();
  const prog = useProgress();
  const pomoHeute = prog.progress.lernen?.tag === heute ? (prog.progress.lernen.pomoHeute ?? 0) : 0;
  const [phase, setPhase] = useState<"arbeit" | "pause">("arbeit");
  const [rest, setRest] = useState(25 * 60);
  const [lauf, setLauf] = useState(false);

  useEffect(() => {
    if (!lauf) return;
    const t = setInterval(() => setRest((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [lauf]);

  useEffect(() => {
    if (rest > 0 || !lauf) return;
    if (phase === "arbeit") {
      update((p) => {
        const alt = p.lernen?.tag === heute ? p.lernen : { tag: heute };
        return checkAbzeichen({ ...p, lernen: { ...alt, pomoHeute: (alt.pomoHeute ?? 0) + 1 }, xp: (p.xp ?? 0) + 2 });
      });
      setPhase("pause");
      setRest(5 * 60);
    } else {
      setPhase("arbeit");
      setRest(25 * 60);
      setLauf(false);
    }
  }, [rest, lauf, phase, heute, update]);

  // 4-7-8
  const [atm, setAtm] = useState<number | null>(null);
  useEffect(() => {
    if (atm === null) return;
    const t = setInterval(() => setAtm((a) => (a === null ? null : a + 1)), 1000);
    return () => clearInterval(t);
  }, [atm !== null]);
  const zyklus = atm === null ? null : atm % 19;
  const atemPhase = zyklus === null ? "" : zyklus < 4 ? "شهيق من الأنف 👃" : zyklus < 11 ? "احبس 🤫" : "زفير بطيء من الفم 😮‍💨";
  const runde = atm === null ? 0 : Math.min(4, Math.floor(atm / 19) + 1);
  const fertigAtmen = atm !== null && atm >= 19 * 4;

  const mm = Math.max(0, Math.floor(rest / 60));
  const ss = String(Math.max(0, rest % 60)).padStart(2, "0");

  return (
    <div style={{ display: "grid", gap: "0.7rem" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", background: "var(--color-paper)", border: "1px solid var(--color-line)", borderRadius: 12, padding: "0.7rem 0.9rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-ink2)" }} dir="rtl">
            🍅 {phase === "arbeit" ? "عمل مركز — هاتفك بعيداً" : "استراحة 5 دقائق — قُم، اشرب، انظر للبعيد"}
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
            {String(mm).padStart(2, "0")}:{ss}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }} dir="rtl">
            أنجزت اليوم <span className="rtl-num">{pomoHeute}</span> بومودورو (٢ XP لكل واحد)
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-primary" onClick={() => setLauf((v) => !v)}>{lauf ? "⏸ إيقاف" : "▶ تشغيل"}</button>
          <button className="btn btn-ghost" onClick={() => { setLauf(false); setPhase("arbeit"); setRest(25 * 60); }}>↺ تصفير</button>
        </div>
      </div>
      <div style={{ background: "var(--color-a2-light, #eff6ff)", border: "1px solid var(--color-line)", borderRadius: 12, padding: "0.7rem 0.9rem" }} dir="rtl">
        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>😮‍💨 بروتوكول ما قبل الامتحان — تنفّس 4-7-8 (يهدّئ تسارع القلب أمام الورقة)</div>
        <div style={{ fontSize: "0.8rem", marginTop: 6, minHeight: "1.4rem" }}>
          {fertigAtmen ? (
            <b style={{ color: "var(--color-a1)" }}>✓ أكملت أربع دورات — جسدك الآن في وضع «عرض» لا «تهديد». ابدأ بأول سؤال قراءة، لا الأصعب.</b>
          ) : atm === null ? (
            <span style={{ color: "var(--color-ink2)" }}>شهيق 4 ثوانٍ ← حبس 7 ← زفير 8 · أربع دورات قبل أن تلمس ورقة الأسئلة.</span>
          ) : (
            <b>
              الدورة <span className="rtl-num">{runde}</span>/4 — {atemPhase}
            </b>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button className="btn btn-ghost" onClick={() => setAtm(fertigAtmen || atm === null ? 0 : null)}>
            {atm === null ? "▶ ابدأ التنفس" : fertigAtmen ? "↺ أعد" : "⏹ توقف"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------- 123 · فاينمان — اشرح لتفهم */

const AR_STOP = new Set("على عن في من إلى أن إنّ لكن ما هذا التي الذي مع قد لم لن حتى بين عند عن كل بعض كما إذا كان كانت يكون هناك".split(" "));

function arNorm(s: string): string {
  return s
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function Feynman() {
  const { update, progress } = useProgress();
  const day = progress.plan.day;
  const lvl = levelOf(day);
  const topic = useMemo(() => {
    const pool = Object.values(grammarMap).filter((g) => g.level === lvl && (g.rules?.length ?? 0) >= 2);
    const rand = rng(day * 887 + 13);
    return pickN(pool.length ? pool : Object.values(grammarMap), 1, rand)[0];
  }, [day, lvl]);

  const regeln = useMemo(
    () =>
      topic.rules.map((r) => {
        const kws = arNorm(r.ar)
          .split(" ")
          .filter((w) => w.length > 3 && !AR_STOP.has(w));
        return { r, kws: kws.slice(0, 4) };
      }),
    [topic]
  );

  const [text, setText] = useState("");
  const [geprüft, setGeprüft] = useState(false);

  const deckung = useMemo(() => {
    if (!geprüft) return null;
    const t = " " + arNorm(text) + " ";
    return regeln.map(({ r, kws }) => {
      const hit = kws.filter((k) => t.includes(" " + k + " ")).length;
      return { de: r.de, ok: kws.length > 0 && hit / kws.length >= 0.34 };
    });
  }, [geprüft, regeln, text]);

  const getroffen = deckung ? deckung.filter((d) => d.ok).length : 0;
  const anteil = deckung && deckung.length ? Math.round((100 * getroffen) / deckung.length) : 0;

  function prüfen() {
    setGeprüft(true);
    const ok = anteil >= 50;
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 3 : anteil >= 25 ? 1 : 0) }), "Grammatik", ok));
  }

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ background: "var(--color-paper2)", borderRadius: 10, padding: "0.55rem 0.8rem", fontSize: "0.78rem" }} dir="rtl">
        <b>🧠 طريقة فاينمان:</b> {topic.titleAr} <span className="de" style={{ opacity: 0.7 }}>({topic.titleDe})</span> — اشرح القاعدة بلسانك كأنك تعلّمها لتلميذ في الثانية عشرة. من لا يبسطها لم يملكها.
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        {regeln.map(({ r }, k) => (
          <div key={k} style={{ border: "1px solid var(--color-line)", borderRadius: 10, padding: "0.4rem 0.7rem", fontSize: "0.78rem" }}>
            <div className="de" style={{ fontWeight: 800 }}>{r.de}</div>
            <div style={{ color: "var(--color-ink2)" }} dir="rtl">{r.ar}</div>
          </div>
        ))}
      </div>
      <textarea className="field" rows={5} style={{ direction: "rtl", width: "100%", resize: "vertical" }} placeholder="اشرح هنا بصوتك أنت — بلا نسخ من الأعلى…" value={text} onChange={(e) => setText(e.target.value)} />
      {!geprüft ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" disabled={text.trim().length < 20} onClick={prüfen}>قيس الشرح ← تغطية القواعد</button>
          <span style={{ fontSize: "0.7rem", color: "var(--color-ink2)" }}>(الفحص محلي: مدى استعمالك كلمات القواعد المفتاحية)</span>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 900, color: anteil >= 50 ? "var(--color-a1)" : "var(--color-gold)" }} dir="rtl">
            غطّيت {anteil}٪ من القواعد بمفرداتك — {anteil >= 50 ? "✓ الشرح يمسك المادة؛ ارفع السقف بشرح جارك الوهمي غداً" : "✗ الشرح عامّ؛ انزل للقاعدة الناقصة بمثال من حياتك"}
          </div>
          {deckung?.map((d, k) => (
            <div key={k} style={{ fontSize: "0.75rem", display: "flex", gap: 6, alignItems: "baseline" }}>
              <span style={{ color: d.ok ? "var(--color-a1)" : "#b91c1c", fontWeight: 900 }}>{d.ok ? "✓" : "✗"}</span>
              <span className="de" style={{ opacity: d.ok ? 0.75 : 1 }}>{d.de}</span>
              {!d.ok && <span style={{ color: "var(--color-ink2)" }} dir="rtl">— لم تظهر في شرحك</span>}
            </div>
          ))}
          <button className="btn btn-ghost" onClick={() => { setGeprüft(false); }}>↺ عدّل واعد الشرح</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------- 120 · الأسبوع الموزون */

const MINUTE_POOL: [number, string][] = [
  [120, "خفيف — ٢٠ د/يوم"],
  [180, "منتظم — ٢٦ د/يوم"],
  [240, "جادّ — ٣٤ د/يوم"],
  [300, "غمر — ٤٣ د/يوم"],
];

const TASK_FUER: Record<string, string> = {
  Wortschatz: "⚡ بطاقات SRS + 5 كلمات جديدة من الأسبوع",
  Grammatik: "📐 فاينمان هنا + كلوز درس اليوم (R)",
  Hoeren: "🎧 دِكتات 10 د + ظلّل حوار اليوم صوتياً",
  Lesen: "📖 فجوات النص (W) + نصّان من الخطة",
  Schreiben: "✍️ بريد 40 كلمة ثم المصحّح الخماسي هنا",
  Sprechen: "🗣 سيناريو (Q) بست جمل — سجّل هاتفك واستمع",
};

function WochenPlan({ progress }: { progress: Progress }) {
  const [min, setMin] = useState(180);
  const werte = kompetenzWerte(progress);
  const gew = KOMPETENZEN.map((h) => ({ h, g: Math.max(18, 112 - (werte[h]?.wert ?? 50)), wert: Math.round(werte[h]?.wert ?? 0) }));
  const sum = gew.reduce((a, x) => a + x.g, 0);
  const verteil = gew.map((x) => ({ ...x, min: Math.max(10, Math.round((min * x.g) / sum)) }));
  const schwach = [...verteil].sort((a, b) => a.wert - b.wert).slice(0, 2);

  function drucke() {
    const html = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>الأسبوع الموزون — Weg nach B2</title>
<style>body{font-family:system-ui,sans-serif;padding:1.4rem;color:#1c1917}td,th{border-bottom:1px solid #ddd;padding:.4rem;font-size:.9rem}h1{font-size:1.1rem}@media print{button{display:none}}</style></head><body>
<h1>📅 خطتي الأسبوعية الموزونة — ${min} دقيقة</h1>
<table style="width:100%;border-collapse:collapse"><tr><th>الكفاءة</th><th>مستواك الآن</th><th>دقائق الأسبوع</th><th>المهمة</th></tr>
${verteil.map((x) => `<tr><td>${KOMPETENZ_AR[x.h]} (${x.h})</td><td>${x.wert}٪</td><td><b>${x.min}</b></td><td style="font-size:.8rem">${TASK_FUER[x.h]}</td></tr>`).join("")}
</table>
<p style="font-size:.8rem;color:#57534e">وُلّدت من رادارك: ${schwach.map((x) => `«${KOMPETENZ_AR[x.h]}» الأضعف (${x.wert}٪) — يأخذ حصة الأسد`).join("، ")} · عدّل الخطة أسبوعاً أسبوعاً فتتبعك.</p>
<button onclick="print()" style="margin-top:1rem">🖨 طباعة</button></body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.78rem" }} dir="rtl">
        كم دقيقة أسبوعياً تملك فعلاً؟ نوزّعها على رادارك — <b>الأضعف يأخذ الأكثر</b>، لا ما تحب.
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {MINUTE_POOL.map(([m, label]) => (
          <button key={m} className="chip" style={{ cursor: "pointer", background: min === m ? "var(--color-cola)" : "var(--ui-surface-raised)", color: min === m ? "var(--ui-on-accent)" : undefined }} onClick={() => setMin(m)}>
            {label}
          </button>
        ))}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }} dir="rtl">
        <thead>
          <tr>
            {["الكفاءة", "اليوم", "مهمتك المحددة", "دقائق"].map((h) => (
              <th key={h} style={{ textAlign: "right", padding: "0.3rem 0.4rem", borderBottom: "2px solid var(--color-line)", fontSize: "0.72rem", color: "var(--color-ink2)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {verteil.map((x, k) => (
            <tr key={x.h} style={{ background: schwach.some((s) => s.h === x.h) ? "var(--color-gold-soft)" : undefined }}>
              <td style={{ padding: "0.35rem 0.4rem", borderBottom: "1px solid var(--color-line)", fontWeight: 800 }}>
                {KOMPETENZ_AR[x.h]} <span style={{ opacity: 0.6, fontWeight: 600 }}>({x.wert}٪)</span>
              </td>
              <td style={{ padding: "0.35rem 0.4rem", borderBottom: "1px solid var(--color-line)", whiteSpace: "nowrap" }}>
                {["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"][k % 7]}
              </td>
              <td style={{ padding: "0.35rem 0.4rem", borderBottom: "1px solid var(--color-line)", fontSize: "0.72rem" }}>{TASK_FUER[x.h]}</td>
              <td style={{ padding: "0.35rem 0.4rem", borderBottom: "1px solid var(--color-line)", fontWeight: 900 }}>{x.min}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn btn-gold" onClick={drucke}>🖨 اطبع الورقة وألصقها</button>
        <span style={{ fontSize: "0.7rem", color: "var(--color-ink2)" }} dir="rtl">الخطة حية: رادارك يتحرّك فتتحرّك الأرقام معه.</span>
      </div>
    </div>
  );
}

/* ------------------------------------- 124–125 · المصحّح الخماسي الذاتي */

const NOUN_KLEIN = new Map(
  alleVokabeln
    .filter((v) => v.article)
    .map((v) => [v.de.replace(/^(der|die|das)\s+/i, "").toLowerCase(), v])
);

const UMLAUT: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/\bfuer\b/gi, () => "für"],
  [/\bueber\b/gi, () => "über"],
  [/\bueberhaupt\b/gi, () => "überhaupt"],
  [/\bmoechte(n|st)?\b/gi, (m) => `möchte${m[1] ?? ""}`],
  [/\bschoen\b/gi, () => "schön"],
  [/\bstrasse\b/gi, () => "Straße"],
  [/\bwaehrend\b/gi, () => "während"],
  [/\bgroesse\b/gi, () => "Größe"],
];

const ENDVERB = new Set(["sein", "haben", "werden", "können", "müssen", "dürfen", "sollen", "wollen", "mögen", "machen", "gehen", "kommen", "sagen", "denken", "glauben", "brauchen", "bleiben", "heissen", "heißen", "lernen", "arbeiten", "wohnen", "spielen", "fahren", "lesen", "schreiben", "verstehen", "sprechen", "treffen", "bestellen", "abholen", "einladen", "vorstellen", "anfangen", "bitten", "gehören"]);
/* أدوات تجريد ملزِمة-الفاصلة فقط — «seit» استُبعدت: كحرف جر (seit einem Jahr) لا تأخذ فاصلة أصلاً */
const KONJ = ["weil", "dass", "obwohl", "wenn", "damit", "während", "bevor", "nachdem", "falls"];

export function selbstKorrektur(text: string) {
  const saetze = text
    .replace(/([.!?])(\s+)/g, "$1\n")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
  const funde: { dim: string; was: string; besser: string }[] = [];

  // ① groß — كل اسم معروف بحرف صغير
  for (const s of saetze) {
    for (const w of s.split(/\s+/)) {
      const clean = w.replace(/[.,!?;:"“”()]/g, "");
      if (!clean || clean[0] === clean[0].toUpperCase()) continue;
      const v = NOUN_KLEIN.get(clean.toLowerCase());
      if (v && clean === clean.toLowerCase()) funde.push({ dim: "الأسماء الكبيرة", was: clean, besser: `${clean[0].toUpperCase()}${clean.slice(1)}` });
    }
  }
  // ② أوملاوت بديلة
  for (const [re, fix] of UMLAUT) {
    for (const m of text.matchAll(re)) {
      const besser = fix(m);
      if (m[0].toLowerCase() !== besser.toLowerCase()) funde.push({ dim: "أوملاوت/ß", was: m[0], besser });
    }
  }
  saetze.forEach((s) => {
    const first = s.replace(/^[^\p{L}]+/u, "");
    // ③ بداية الجملة كبيرة
    if (first && first[0] === first[0].toLowerCase() && /\p{L}/u.test(first[0])) funde.push({ dim: "أول الجملة", was: s.slice(0, 24) + "…", besser: first[0].toUpperCase() + first.slice(1, 24) });
    const low = s.toLowerCase();
    // ④ الفاصلة قبل أدوات التعليل
    for (const k of KONJ) {
      const re = new RegExp(`[^,]\\s+${k}\\b`, "i");
      if (re.test(low) && !low.trimStart().startsWith(k)) funde.push({ dim: "فاصلة قبل " + k, was: s.slice(0, 30) + "…", besser: "ضع فاصلة قبل «" + k + "» — الجملة الجانبية تُفصل" });
    }
    // ⑤ V2 — تلميح فقط
    const ws = s.replace(/[.!?]$/, "").split(/\s+/);
    if (ws.length >= 3) {
      const start = ws[0].toLowerCase();
      const z2 = (ws[1] ?? "").toLowerCase().replace(/[^a-zäöüß]/g, "");
      const fraglich = /\?/.test(s) || ["wer", "was", "wann", "wie", "wo", "warum", "ob"].includes(start);
      const neben = KONJ.includes(start);
      const verb2 = ["ist", "hat", "bin", "bist", "sind", "sei", "war", "hatte", "habe", "haben", "wird", "werden", "kann", "können", "muss", "müssen", "darf", "soll", "will", "mag", "möchte", "moechte"].includes(z2) || /(st|et|en|te|e|t)$/.test(z2) || ws[1]?.toUpperCase() === ws[1];
      if (!fraglich && !neben && !verb2) funde.push({ dim: "الفعل الثاني (تلميح)", was: s.slice(0, 34) + "…", besser: "راجع: الفعل المصروف يجب أن يكون الكلمة الثانية في الاستهلالية" });
    }
  });

  const hart = funde.filter((f) => !f.dim.includes("تلميح"));
  const hints = funde.filter((f) => f.dim.includes("تلميح"));
  const woerter = text.trim().split(/\s+/).filter(Boolean).length || 1;
  const sauberPct = Math.max(0, Math.round(100 - (hart.length / woerter) * 100 * 8));
  return { funde, hart, hints, sauberPct, woerter };
}

function SelbstLinter() {
  const { update } = useProgress();
  const [text, setText] = useState("");
  const [geprüft, setGeprüft] = useState(false);
  const r = useMemo(() => (geprüft ? selbstKorrektur(text) : null), [geprüft, text]);

  function prüfen() {
    setGeprüft(true);
    if (!text.trim()) return;
    const res = selbstKorrektur(text);
    const clean = res.hart.length === 0;
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (clean ? 3 : res.hart.length <= 2 ? 1 : 0) }), "Schreiben", clean));
    res.funde.filter((f) => f.dim === "الأسماء الكبيرة").slice(0, 3).forEach((f) =>
      addFehlerNow({ falsch: f.was, richtig: f.besser.replace(/^(der|die|das)\s+/, ""), art: "schreibung", ar: "المصحّح الخماسي — اسم كتب صغيراً", quelle: "Lernstrategie" })
    );
  }

  const DIMS = ["الأسماء الكبيرة", "أوملاوت/ß", "أول الجملة", "فاصلة قبل", "الفعل الثاني"];
  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div style={{ background: "var(--color-paper2)", borderRadius: 10, padding: "0.55rem 0.8rem", fontSize: "0.78rem" }} dir="rtl">
        <b>✅ بروتوكول الأربع دقائق بعد أي كتابة:</b> الصق نصّك هنا ويطمس أمامك خمس عيون مدرسة — الأسماء، الأوملاوت، أول الجملة، فواصل التعليل، وموضع الفعل. نظيف؟ أنت جاهز لتسلّم.
      </div>
      <textarea className="field" rows={6} style={{ direction: "ltr", width: "100%", resize: "vertical" }} placeholder="Deinen Text hier einfügen — z. B. die letzte E-Mail aus Schreiben…" value={text} onChange={(e) => setText(e.target.value)} />
      {!geprüft ? (
        <button className="btn btn-primary" disabled={text.trim().split(/\s+/).length < 8} onClick={prüfen}>امسح النص بالخمسة ✨</button>
      ) : r && (
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="chip" style={{ background: r.hart.length === 0 ? "var(--color-a1)" : r.hart.length <= 2 ? "var(--color-gold)" : "#b91c1c", color: r.hart.length > 2 ? "white" : "var(--ui-on-accent)", border: 0 }}>
              نظافة {r.sauberPct}٪ · {r.hart.length} خطأ · {r.hints.length} تلميح · {r.woerter} كلمة
            </span>
          </div>
          {r.funde.length === 0 && (
            <div style={{ background: "var(--color-a1)", color: "var(--ui-on-accent)", borderRadius: 10, padding: "0.5rem 0.8rem", fontWeight: 900, fontSize: "0.82rem" }} dir="rtl">
              ✓ صفر ملاحظات! هذه علامة «جاهز للتسليم» الحقيقية.
            </div>
          )}
          {r.funde.slice(0, 10).map((f, k) => (
            <div key={k} style={{ border: "1px solid var(--color-line)", borderInlineStart: `4px solid ${f.dim.includes("تلميح") ? "var(--color-a2)" : "#b91c1c"}`, borderRadius: 10, padding: "0.35rem 0.7rem", fontSize: "0.78rem" }} dir="rtl">
              <b>{DIMS.find((d) => f.dim.startsWith(d)) ?? f.dim}</b> — <span className="de" style={{ textDecoration: "line-through", color: "#b91c1c" }}>{f.was}</span>{" "}
              ← <span className="de" style={{ fontWeight: 900, color: "var(--color-a1)" }}>{f.besser}</span>
            </div>
          ))}
          <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }} dir="rtl">
            لا يكشف هذا المصحّح كل شيء — إنه تدريب على <b>عادة الفحص</b>، والفاحص الحقيقي (المدرس الآلي) لا يزال في نهاية كل تسليم.
          </div>
          <button className="btn btn-ghost" onClick={() => setGeprüft(false)}>↺ عدّل النص وأعد المسح</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- المركز */

export function LernStrategieZentrum({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"teile" | "pomo" | "feynman" | "plan" | "linter">("teile");

  return (
    <div className="card fadein" id="lernstrategie" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🎓 مدرّس تعلّم التعلّم — LernStrategien-Zentrum <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul O)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        استراتيجيات كل Teil · نظام العلامات · بومودورو وتنفس 4-7-8 · فاينمان · أسبوع موزون من رادارك · ومصحّح خماسي لكتابتك — كيف تذاكر، قبل ماذا تذاكر.
      </div>
      {open && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(
              [
                ["teile", "🧭 استراتيجيات الأجزاء"],
                ["pomo", "🍅 الوقت والتنفس"],
                ["feynman", "🧠 فاينمان"],
                ["plan", "📅 الأسبوع الموزون"],
                ["linter", "✅ المصحّح الخماسي"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} className="chip" style={{ cursor: "pointer", background: tab === id ? "var(--color-cola)" : "var(--ui-surface-raised)", color: tab === id ? "var(--ui-on-accent)" : undefined }} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
          {tab === "teile" && <TeilStrategien />}
          {tab === "pomo" && <PomoCoach />}
          {tab === "feynman" && <Feynman />}
          {tab === "plan" && <WochenPlan progress={progress} />}
          {tab === "linter" && <SelbstLinter />}
        </div>
      )}
    </div>
  );
}
