"use client";

/**
 * Schul-Simulator (Modul Y — Schritte 169–172) — جناح الكورس ①
 * ---------------------------------------------------------------------------
 * المدرسة الألمانية تُدار بالورق: مَن يعرف أوراقها ينجو من نصف المتاعب.
 *  · 📝 Entschuldigung (169) — رسالة الغياب الرسمية: نموذج جُمل، ماسح بنية من
 *    ستّ عيون، ثم طبعٌ حقيقي باسمك وطاريخ اليوم — ورقة تُسلَّم فعلاً.
 *  · 🏛 Antrag Klassenfahrt (170) — طلب المشاركة في رحلة المتحف: أربع نقاط
 *    مفقّطة بمفاتيح كلمات + حدّ 80 كلمة، بنفس منطق مهمة كتابة Goethe.
 *  · 🎓 Zeugnis-Spiegel (171) — شهادتك الحية: رادارك الستّة مُحوّلة للنظام
 *    الألماني المقلوب (1=sehr gut…5)، مع تعليق مدرسي رسمي وكويز قراءة الشهادة.
 *  · 🏫 Amtsdeutsch-Entschlüssler (172) — فكّ شيفرة خطاب المكتب المدرسي:
 *    fernbleiben · bescheinigen · unaufschiebbar… خمس بطاقات يومياً بوجوهها الثلاثة.
 * الأنابيب: الكتابتان تُسجَّلان Schreiben، المفردات الرسمية Wortschatz، والخطأ
 * في فكّ الشيفرة يدخل الدفتر — ولا شيء هنا يصدّق بالكلام: كل فحص محلي deterministic.
 */

import { useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress, addFehlerNow } from "@/lib/store";
import { normalize } from "@/lib/grader";
import { pickN, rng } from "@/lib/plan";
import { logK, KOMPETENZEN, kompetenzWerte } from "@/lib/kompetenz";
import { checkAbzeichen } from "@/lib/spiel";
import { activeProfile } from "@/lib/profiles";

const norm = (s: string) => normalize(s).replace(/[.!?,;:"“”„]/g, "").trim();

export function drucke(html: string, titel: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!doctype html><html dir="ltr"><head><meta charset="utf-8"><title>${titel} — Weg nach B2</title>
<style>body{font-family:Georgia,'Times New Roman',serif;padding:2.5rem 3rem;color:#111;font-size:12pt;line-height:1.7}h1{font-size:14pt;letter-spacing:.06em;text-transform:uppercase}pre{white-space:pre-wrap;font:inherit;margin:0}.ar{direction:rtl;font-family:system-ui,sans-serif;font-size:.8rem;color:#666;margin-top:2.5rem;border-top:1px solid #ccc;padding-top:.6rem}@media print{.noprint{display:none}}</style></head><body>${html}<div class="noprint" style="margin-top:1.6rem"><button onclick="print()" style="font-size:1rem;padding:.4rem 1rem;cursor:pointer">🖨 طباعة / PDF</button></div></body></html>`);
  win.document.close();
}

/* ------------------------------------------- 169 · Entschuldigung */

function Entschuldigung({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const name = activeProfile().name;
  const heute = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const [kind, setKind] = useState(name);
  const [klasse, setKlasse] = useState("");
  const [lehrer, setLehrer] = useState("");
  const [von, setVon] = useState(iso(heute));
  const [bis, setBis] = useState(iso(new Date(heute.getTime() + 86400000)));
  const [grund, setGrund] = useState("krank");
  const [text, setText] = useState("");
  const [gescannt, setGescannt] = useState<null | boolean[]>(null);

  const CHECKS: [string, (t: string) => boolean][] = [
    ["Anrede: „Sehr geehrte…“", (t) => /sehr geehrte/i.test(t)],
    [`Name des Kindes (${kind})`, (t) => t.toLowerCase().includes(norm(kind).toLowerCase())],
    ["Zeitraum (Datum von–bis)", (t) => /\d{1,2}[.]\s?\d{1,2}[.]\s?\d{2,4}/.test(t) || /\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag)\b/.test(t)],
    ["Grund („wegen / da … krank“)", (t) => /(krank|Arzt|Feier|Termin|wegen|da )/i.test(t)],
    ["Bitte um Entschuldigung", (t) => /entschuldig/i.test(t)],
    ["Grußformel + Unterschrift", (t) => /mit freundlichen gr[üu][ßs]en/i.test(t)],
  ];

  const modelle = [
    `Sehr geehrte${lehrer ?(" " + lehrer) : "r Lehrer / sehr geehrte Frau Lehrerin"},`,
    `hiermit möchte ich mitteilen, dass ${kind}${klasse ? ` aus der Klasse ${klasse}` : ""} am ${von}${bis !== von ? ` bis ${bis}` : ""} dem Unterricht fernbleiben wird.`,
    grund === "krank" ? `${kind.charAt(0).toUpperCase() + kind.slice(1)} ist krank und kann die Schule nicht besuchen.` :
    grund === "Termin" ? `Ein unaufschiebbarer Arzttermin legt diesen Zeitraum fest.` :
    `Aus familiären Gründen (${grund}) ist ein Besuch der Schule in diesem Zeitraum leider nicht möglich.`,
    `Bitte entschuldigen Sie das Versäumnis. Ein Attest reiche ich nach, falls erforderlich.`,
    `Mit freundlichen Grüßen\n${name}`,
  ].join("\n\n");

  function scan() {
    const res = CHECKS.map(([, fn]) => fn(text));
    setGescannt(res);
    const gut = res.every(Boolean);
    const teil = res.filter(Boolean).length;
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (gut ? 3 : teil >= 4 ? 1 : 0) }), "Schreiben", gut));
  }

  function druck() {
    drucke(
      `<h1>Entschuldigung</h1><p>${iso(heute).split("-").reverse().join(".")} · ${kind}${klasse ? `, Klasse ${klasse}` : ""}</p><pre>${text.replace(/[<&]/g, (c) => (c === "<" ? "&lt;" : "&amp;"))}</pre><div class="ar">وُلّدت عبر محاكاة المدرسة في «طريقي إلى B2» — الوحدة Y · بنية مفحوصة: ${gescannt?.filter(Boolean).length ?? 0}/6</div>`,
      "Entschuldigung"
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div className="grid2" style={{ gap: 6 }}>
        {[
          ["الطالب/الطفلة", kind, setKind, "Max Mustermann"],
          ["Klasse", klasse, setKlasse, "10b"],
          ["الأساتذة (Anrede)", lehrer, setLehrer, "Frau Wagner / Herrn Bauer"],
        ].map(([label, val, set, ph], k) => (
          <label key={k} style={{ fontSize: "0.72rem", display: "grid", gap: 2 }}>
            <span dir="rtl" style={{ fontWeight: 800, opacity: 0.75 }}>{label as string}</span>
            <input className="field" style={{ width: "100%" }} value={val as string} placeholder={ph as string} onChange={(e) => (set as (v: string) => void)(e.target.value)} />
          </label>
        ))}
        <label style={{ fontSize: "0.72rem", display: "grid", gap: 2 }}>
          <span dir="rtl" style={{ fontWeight: 800, opacity: 0.75 }}>السبب</span>
          <select className="field" value={grund} onChange={(e) => setGrund(e.target.value)}>
            <option value="krank">krank — وعكة/حمّى</option>
            <option value="Termin">unaufschiebbarer Termin — موعد لا يُؤجَّل</option>
            <option value="Familienfeier">Familienfeier — مناسبة عائلية</option>
          </select>
        </label>
        <label style={{ fontSize: "0.72rem", gridColumn: "span 2", display: "flex", gap: 8, alignItems: "center" }} dir="rtl">
          من <input type="date" className="field" style={{ flex: 1 }} value={von} onChange={(e) => setVon(e.target.value)} /> إلى
          <input type="date" className="field" style={{ flex: 1 }} value={bis} onChange={(e) => setBis(e.target.value)} />
        </label>
      </div>
      <textarea className="field" rows={7} style={{ width: "100%", resize: "vertical", direction: "ltr" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Schreibe deinen Brief hier — auf Deutsch, im Stil des Amts…" />
      <details style={{ fontSize: "0.76rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 800, opacity: 0.8 }}>🪞 نماذج الجُمل الخمسة — انظر فقط إن جمّدت (الأفضل أن تكتب أولاً)</summary>
        <pre className="de" style={{ background: "var(--color-paper)", borderRadius: 8, padding: "0.5rem 0.7rem", fontSize: "0.74rem", whiteSpace: "pre-wrap" }}>{modelle}</pre>
      </details>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={scan}>🔍 امسح البنية — ست عيون</button>
        {gescannt && gescannt.every(Boolean) && <button className="btn btn-gold" onClick={druck}>🖨 اطبع الرسالة المسلَّمة</button>}
      </div>
      {gescannt && (
        <div style={{ display: "grid", gap: 3 }}>
          {CHECKS.map(([c], k) => (
            <div key={k} style={{ fontSize: "0.74rem", fontWeight: 800, color: gescannt[k] ? "var(--color-a1)" : "#b91c1c" }} dir="rtl">
              {gescannt[k] ? "✓" : "✗"} {c}
            </div>
          ))}
          {!gescannt.every(Boolean) && (
            <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }} dir="rtl">
              عيون ناقصة تُرجم إلى نصيحة مكتب: رتّب الناقص من الأعلى لأسفل — ثم أعد المسح.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------- 170 · Antrag Klassenfahrt */

const PUNKTE: [string, RegExp, string][] = [
  ["① Vorhaben — ما هي الرحلة ومتى", /museum|fahrt|exkursion|ausflug|besichtigen|samstag|montag|dienstag|mittwoch|donnerstag|freitag|\d{1,2}\.\d{1,2}\./i, "اذكر الوجهة واليوم"],
  ["② Kosten — كم تكلّف وكيف تُدفع", /kost\w*|beitr\w*|€|euro|zahlen|kasse/i, "المبلغ وطريقة الدفع"],
  ["③ Begleitung — من يرافق", /begleit\w*|lehrer\w*|erwachsene|herrn|frau/i, "الأستاذ المرافق"],
  ["④ Notfallkontakt — رقم للطوارئ", /notfall\w*|telefon|\d{5,}|erreichen|eltern/i, "هاتف الأبوين"],
];

function Antrag({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [text, setText] = useState("");
  const [geprueft, setGeprueft] = useState<null | (boolean | null)[]>(null);

  function pruefen() {
    const woerter = text.trim().split(/\s+/).filter(Boolean).length;
    const res = PUNKTE.map(([, re]) => re.test(text));
    const laenge = woerter >= 70;
    setGeprueft([...res, laenge]);
    const ok = res.every(Boolean) && laenge;
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ok ? 3 : res.filter(Boolean).length) }), "Schreiben", ok));
    if (!ok && woerter > 8) {
      const fehlt = PUNKTE.filter((_, k) => !res[k]).map(([c]) => c.split("—")[1]?.trim() || c);
      addFehlerNow({ falsch: `Antrag: ${fehlt.length ? fehlt.join(" + ") : "Länge <70 Wörter"}`, richtig: "Antrag komplett (4 Punkte + 70 Wörter)", art: "konstruktion", ar: "طلب الرحلة — نقاط ناقصة", quelle: "Schulsim" });
    }
  }

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ background: "var(--color-paper2)", borderRadius: 10, padding: "0.5rem 0.75rem", fontSize: "0.78rem" }} dir="rtl">
        🏛 <b>الإطار:</b> مدرستك تنظّم رحلة إلى متحف المدينة. اكتب طلب مشاركة لأهلك (90 كلمة تقريباً) بأربع نقاط: المشروع · التكلفة · المرافق · رقم الطوارئ. نفس تقييم B2 Schreiben Teil 1.
      </div>
      <textarea className="field" rows={7} style={{ width: "100%", resize: "vertical", direction: "ltr" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Liebe Eltern, am nächsten Freitag fährt unsere Klasse ins Stadtmuseum …" />
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={pruefen}>✓ قيّم الطلب — 4 نقاط + طول</button>
        <span style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }} dir="rtl">
          كلماتك: <b className="rtl-num">{text.trim() ? text.trim().split(/\s+/).length : 0}</b>
        </span>
      </div>
      {geprueft && (
        <div style={{ display: "grid", gap: 3 }}>
          {PUNKTE.map(([c], k) => (
            <div key={k} style={{ fontSize: "0.75rem", fontWeight: 800, color: geprueft[k] ? "var(--color-a1)" : "#b91c1c" }} dir="rtl">
              {geprueft[k] ? "✓" : "✗"} {c}
            </div>
          ))}
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: geprueft[4] ? "var(--color-a1)" : "var(--color-gold)" }} dir="rtl">
            {geprueft[4] ? "✓" : "✗"} ⑤ الطول ≥70 كلمة — تحت هذا الحد تفقد النقاط تلقائياً في الامتحان
          </div>
          {geprueft.every(Boolean) && (
            <div style={{ background: "var(--color-a1)", color: "var(--ui-on-accent)", borderRadius: 8, padding: "0.4rem 0.7rem", fontWeight: 900, fontSize: "0.78rem" }} dir="rtl">
              🎉 طلبك مكتمل البنية — سلّمه لأهلك، فقد حوّلته لورقة منزلية حقيقية.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------- 171 · Zeugnis-Spiegel + كويز */

function noteVon(v: number): number {
  return v >= 90 ? 1 : v >= 80 ? 2 : v >= 65 ? 3 : v >= 50 ? 4 : 5;
}
const NOTE_AR = ["", "ممتاز — sehr gut", "جيد جداً — gut", "جيد — befriedigend", "مقبول — ausreichend", "راسب — nicht bestanden"];
const FACH_DE: Record<string, string> = { Lesen: "Deutsch – Lesen & Textarbeit", Hoeren: "Deutsch – Hörverstehen", Schreiben: "Deutsch – Aufsatz & Briefe", Sprechen: "Mündliche Beteiligung", Grammatik: "Sprachwissen & Grammatik", Wortschatz: "Wortschatz & Rechtschreibung" };

function Zeugnis({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const w = kompetenzWerte(progress);
  const faecher = KOMPETENZEN.map((h) => ({ h, wert: Math.round(w[h]?.wert ?? 0), note: noteVon(w[h]?.wert ?? 0) }));
  const beste = [...faecher].sort((a, b) => a.note - b.note || b.wert - a.wert)[0];
  const schwach = [...faecher].sort((a, b) => b.note - a.note)[0];
  const an4plus = faecher.filter((f) => f.note >= 4).length;

  const [gabBeste, setGabBeste] = useState("");
  const [gabAnz, setGabAnz] = useState("");
  const [mc, setMc] = useState<null | number>(null);
  const [geprueft, setGeprueft] = useState(false);

  const punkte = useMemo(() => {
    let n = 0;
    if (norm(gabBeste).toLowerCase().includes(norm(beste.h).toLowerCase().split(" ")[0].toLowerCase()) || beste.h.toLowerCase().includes(norm(gabBeste).toLowerCase())) n++;
    if (parseInt(gabAnz, 10) === an4plus) n++;
    if (mc === 0) n++;
    return n;
  }, [gabBeste, gabAnz, mc, beste.h, an4plus]);

  function abgeben() {
    setGeprueft(true);
    update((p) => checkAbzeichen({ ...p, xp: (p.xp ?? 0) + punkte }));
  }

  return (
    <div style={{ display: "grid", gap: "0.6rem" }}>
      <div className="card" style={{ padding: "0.8rem 1rem", background: "var(--color-paper)" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid var(--color-cola)", paddingBottom: 4, marginBottom: 8 }}>
          <b style={{ letterSpacing: "0.05em", fontSize: "0.95rem" }}>🎓 Zeugnispiegel — شهادة رادارك بالنظام الألماني</b>
          <div style={{ fontSize: "0.7rem", color: "var(--color-ink2)" }} dir="rtl">العكس المعتاد: 1 ممتازة و5 راسب — اقرأها بعين ألمانية</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <tbody>
            {faecher.map((f) => (
              <tr key={f.h}>
                <td style={{ padding: "0.28rem 0.4rem", borderBottom: "1px solid var(--color-line)" }} className="de">{FACH_DE[f.h]}</td>
                <td style={{ padding: "0.28rem 0.4rem", borderBottom: "1px solid var(--color-line)", textAlign: "center", width: 52 }} dir="rtl">{f.wert}٪</td>
                <td style={{ padding: "0.28rem 0.4rem", borderBottom: "1px solid var(--color-line)", fontWeight: 900, textAlign: "center", width: 42, color: f.note <= 2 ? "var(--color-a1)" : f.note >= 4 ? "#b91c1c" : "var(--color-gold)" }}>
                  {f.note}
                </td>
                <td style={{ padding: "0.28rem 0.4rem", borderBottom: "1px solid var(--color-line)", fontSize: "0.7rem", color: "var(--color-ink2)" }} dir="rtl">{NOTE_AR[f.note]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 8, fontSize: "0.76rem", lineHeight: 1.8, background: "var(--color-gold-soft)", borderRadius: 8, padding: "0.5rem 0.7rem" }} dir="rtl">
          <b>المرشد الصفي:</b> {activeProfile().name} zeigt besondere Sicherheit im Fach <span className="de" dir="ltr">{FACH_DE[beste.h]}</span> — هكذا يبدأ التعليق الرسمي. Und muss im Fach <span className="de" dir="ltr">{FACH_DE[schwach.h]}</span> regelmäßig zu Hause üben (15 Minuten täglich): <span dir="ltr" className="de">„mit Auffassungsgabe, aber wechselnder Sorgfalt“</span>.
        </div>
      </div>
      <div style={{ fontSize: "0.82rem", fontWeight: 900 }} dir="rtl">📋 قراءة الشهادة — ثلاث سؤالاً امتحانية عن وثيقتك أنت:</div>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: "0.78rem" }} dir="rtl">
          <b>1.</b> Was steht als <span className="de">Note 1</span> — ما درجة «١» في ألمانيا؟
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }} dir="ltr">
            {["sehr gut", "gut", "nicht bestanden"].map((o, k) => (
              <button key={o} className="chip" style={{ cursor: "pointer", border: mc === k ? "1.5px solid var(--color-a1)" : "1px solid var(--color-line)", background: mc === k ? "var(--color-a1)" : "var(--ui-surface-raised)", color: mc === k ? "var(--ui-on-accent)" : undefined }} onClick={() => setMc(k)}>{o}</button>
            ))}
          </div>
        </div>
        <label style={{ fontSize: "0.78rem", display: "grid", gap: 3 }} dir="rtl">
          <b>2.</b> Welches Fach hat die beste Note? اكتب اسمها (من الجدول — كلمة واحدة تكفي):
          <input className="field" style={{ width: "100%", maxWidth: "22rem" }} value={gabBeste} onChange={(e) => setGabBeste(e.target.value)} placeholder="z. B. Wortschatz" />
        </label>
        <label style={{ fontSize: "0.78rem", display: "grid", gap: 3 }} dir="rtl">
          <b>3.</b> كم مادة درجتها 4 فأدنى؟ رقم واحد:
          <input className="field" style={{ width: 90 }} inputMode="numeric" value={gabAnz} onChange={(e) => setGabAnz(e.target.value)} placeholder="0" />
        </label>
      </div>
      {!geprueft ? (
        <button className="btn btn-primary" onClick={abgeben}>أجب الأسئلة الثلاثة</button>
      ) : (
        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: punkte >= 2 ? "var(--color-a1)" : "var(--color-gold)" }} dir="rtl">
          {punkte}/3 صحيحة — {punkte === 3 ? "تقرأ الشهادة الألمانية كما يقرأها ابن برلين." : "أعد قراءة السطر الصغير أول امتحانك الحقيقي: كشف الدرجات."}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------- 172 · Amtsdeutsch-Entschlüssler */

interface Amt {
  amt: string;
  meaning: string; // Alltagdeutsch
  ar: string;
  satz: string;
}
const AMTS: Amt[] = [
  { amt: "fernbleiben", meaning: "nicht zur Schule kommen", ar: "يتغيّب عن المدرسة", satz: "Ein Fernbleiben vom Unterricht ohne Entschuldigung gilt als Schulpflichtverstoß." },
  { amt: "die Beurlaubung", meaning: "Erlaubnis, der Schule fernzubleiben", ar: "إذن رسمي بالغياب", satz: "Für die Beurlaubung am Freitag brauchen wir einen Antrag der Erziehungsberechtigten." },
  { amt: "bescheinigen", meaning: "schriftlich bestätigen", ar: "يُثبت بالكتابة", satz: "Der Arzt bescheinigt die Krankheit bitte auf Papier." },
  { amt: "das Attest", meaning: "die ärztliche Bescheinigung", ar: "الشهادة الطبية", satz: "Ohne Attest ab Tag drei zählt der Fehltag als unentschuldigt." },
  { amt: "unaufschiebbar", meaning: "das kann man nicht verschieben", ar: "لا يحتمل التأجيل", satz: "Ein unaufschiebbarer Behördentermin ist ein gültiger Grund." },
  { amt: "nachreichen", meaning: "später abgeben", ar: "يُسلَّم لاحقاً", satz: "Das Attest darfst du zwei Tage nachreichen." },
  { amt: "die Mahnung", meaning: "die schriftliche Erinnerung: „Sie müssen zahlen!“", ar: "إنذار/مطالبة رسمية", satz: "Nach der Mahnung für den Beitrag kommt das Gespräch im Sekretariat." },
  { amt: "erziehungsberechtigt", meaning: "die Person, die rechtlich über das Kind entscheidet", ar: "وليّ الأمر القانوني", satz: "Unterschreiben muss eine erziehungsberechtigte Person." },
  { amt: "das Versäumnis", meaning: "das, was man verpasst/versäumt hat", ar: "ما فاتك (غياب/واجب)", satz: "Jedes Versäumnis wird in die Klassenarbeit-Liste eingetragen." },
  { amt: "der Schulpflichtverstoß", meaning: "gegen die Pflicht verstoßen: unentschuldigt fehlen", ar: "مخالفة إلزامية المدرسة", satz: "Drei unentschuldigte Tage sind ein gemeldeter Verstoß." },
];

function Amtsdeutsch({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const day = progress.plan.day;
  const runde = useMemo(() => {
    const rand = rng(day * 541 + 13);
    return pickN(AMTS, 5, rand).map((a, k) => {
      const falsche = pickN(AMTS.filter((x) => x.amt !== a.amt), 2, rng(day * 541 + k * 7 + 3));
      const opts = [a.meaning, ...falsche.map((f) => f.meaning)];
      const shuffled = opts
        .map((o, i) => ({ o, s: rng(day * 97 + k * 11 + i)() }))
        .sort((x, y) => x.s - y.s);
      return { a, opts: shuffled.map((s) => s.o), correct: shuffled.findIndex((s) => s.o === a.meaning) };
    });
  }, [day]);

  const [antworten, setAntworten] = useState<Record<number, number>>({});
  const fertig = Object.keys(antworten).length === runde.length;
  const richtig = runde.filter((r, k) => antworten[k] === r.correct).length;

  function antworte(k: number, opt: number) {
    if (antworten[k] !== undefined) return;
    const neu = { ...antworten, [k]: opt };
    setAntworten(neu);
    if (opt !== runde[k].correct) {
      addFehlerNow({ falsch: runde[k].a.amt, richtig: runde[k].a.meaning, art: "wortschatz", ar: `Amtsdeutsch — ${runde[k].a.ar}`, quelle: "Schulsim" });
    }
    if (Object.keys(neu).length === runde.length) {
      const hits = runde.filter((r, i) => neu[i] === r.correct).length;
      update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + hits }), "Wortschatz", hits >= 4));
    }
  }

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ background: "var(--color-paper2)", borderRadius: 10, padding: "0.5rem 0.75rem", fontSize: "0.78rem" }} dir="rtl">
        🏫 المكتب المدرسي يكتب بألمانيةٍ لا تُشبه شارعها. من يفكّ <span className="de"><b>fernbleiben · bescheinigen · unaufschiebbar</b></span> لا يوقّع ما لا يفهم — خمس بطاقات اليوم.
      </div>
      {runde.map((r, k) => {
        const gewaehlt = antworten[k];
        return (
          <div key={k} style={{ border: "1px solid var(--color-line)", borderRadius: 12, padding: "0.55rem 0.8rem" }}>
            <div className="de" style={{ fontSize: "0.78rem", color: "var(--color-ink2)", background: "var(--color-paper)", borderRadius: 8, padding: "0.3rem 0.55rem" }}>
              “… {r.a.satz}”
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", margin: "0.4rem 0" }}>
              <b className="de" style={{ fontSize: "0.9rem" }}>{r.a.amt}</b>
              <span style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }} dir="rtl">— ماذا تعني في الواقع؟</span>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {r.opts.map((o, j) => {
                const markiert = gewaehlt === j;
                const istRichtig = j === r.correct;
                const farbe = gewaehlt === undefined ? undefined : istRichtig ? "var(--color-a1)" : markiert ? "#b91c1c" : undefined;
                return (
                  <button key={j} disabled={gewaehlt !== undefined} onClick={() => antworte(k, j)} className="de" style={{ fontSize: "0.72rem", textAlign: "start", borderRadius: 9, padding: "0.3rem 0.55rem", cursor: gewaehlt === undefined ? "pointer" : "default", border: `1px solid ${farbe ?? "var(--color-line)"}`, background: farbe ?? "var(--ui-surface-raised)", color: farbe ? "white" : undefined, opacity: gewaehlt !== undefined && !istRichtig && !markiert ? 0.55 : 1 }}>
                    {o}
                  </button>
                );
              })}
            </div>
            {gewaehlt !== undefined && <div style={{ fontSize: "0.72rem", marginTop: 4 }} dir="rtl">{gewaehlt === r.correct ? "✓ فككتها" : `✗ المعنى: ${r.a.ar}`}</div>}
          </div>
        );
      })}
      {fertig && (
        <div style={{ background: "var(--color-paper2)", borderRadius: 10, padding: "0.5rem 0.75rem", fontWeight: 900, fontSize: "0.8rem", color: richtig >= 4 ? "var(--color-a1)" : "var(--color-cola)" }} dir="rtl">
          🏫 {richtig}/5 — {richtig >= 4 ? "تقرأ خطاب المكتب كما يقرأه أولادهم. انسخ كل خطأ أخفته في دفترك وراجعه." : "المفردات الرسمية تُفهم من السياق — الغلط هنا يدخل الدفتر ويُراجع غداً."}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- المركز */

export function SchulSimulator({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"brief" | "antrag" | "zeugnis" | "amt">("brief");
  return (
    <div className="card fadein" id="schulsim" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🎒 محاكاة المدرسة — Schul-Simulator <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul Y)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        أربع أوراق مدرسية ألمانية: رسالة غياب بطبعٍ حقيقي · طلب رحلة بأربع نقاط · شهادة من رادارك بنظام العلامات المقلوب · وفكّ شيفرة المكتب.
      </div>
      {open && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(
              [
                ["brief", "📝 رسالة الغياب"],
                ["antrag", "🏛 طلب الرحلة"],
                ["zeugnis", "🎓 شهادة الرادار"],
                ["amt", "🏫 شيفرة المكتب"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} className="chip" style={{ cursor: "pointer", background: tab === id ? "var(--color-cola)" : "var(--ui-surface-raised)", color: tab === id ? "var(--ui-on-accent)" : undefined }} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
          {tab === "brief" && <Entschuldigung progress={progress} />}
          {tab === "antrag" && <Antrag progress={progress} />}
          {tab === "zeugnis" && <Zeugnis progress={progress} />}
          {tab === "amt" && <Amtsdeutsch progress={progress} />}
        </div>
      )}
    </div>
  );
}
