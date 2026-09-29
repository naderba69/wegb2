"use client";

/**
 * BriefSchmiede (Modul Z · Verwaltung — Schritte 175–177)
 * ---------------------------------------------------------------------------
 * إدارة النصوص الرسمية الألمانية بأربعة قوالب حيوات: شكوى لجار · اعتذار لصديقة ·
 * استفسار لمكتبة · اعتراض على مخالفة — كل رسالة تُقدَّر كأوراق B2 Schreiben
 * الرسمية بأربعة معايير (Inhalt · Kommunikationsstil · Ausdruck · Correctness)،
 * كل منها 0–5، والمجموع ← نسبة ← مقياس ألماني مقلوب. الماسح النحوي هنا ليس
 * نسخة جديدة: إنه المصحّح الخماسي نفسه (selbstKorrektur من الوحدة O) — الأنابيب
 * أُعيد استخدامها، لا تكرارها. والنموذج الناجح يُطبع في «محضر» قابل للمراجعة.
 */

import { useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress, addFehlerNow } from "@/lib/store";
import { normalize } from "@/lib/grader";
import { logK } from "@/lib/kompetenz";
import { checkAbzeichen } from "@/lib/spiel";
import { activeProfile } from "@/lib/profiles";
import { selbstKorrektur } from "./lernstrategie";
import { drucke } from "./schulsim";

interface Brief {
  id: string;
  emoji: string;
  de: string;
  ar: string;
  lage: string;
  formell: boolean;
  punkte: [string, RegExp][];
  modell: string;
}

const BRIEFE: Brief[] = [
  {
    id: "beschwerde", emoji: "📮", de: "Beschwerde an Herrn Weber", ar: "شكوى — جارك يقيم السهرات",
    lage: "جارك Herr Weber يعيد حفلات صاخبة حتى الثالثة فجراً، وغداً امتحانك. اكتب له رسالة شكوى رسمية (≈90 كلمة): اذكر المشكلة بتاريخها · بيّن أثرها · اطلب حداً للهدوء 22:00 · ومهّد بخطوتك التالية إن تكرر الأمر.",
    formell: true,
    punkte: [
      ["① المشكلة بتاريخ محدد (Lärm/الليلة/السبت)", /sams|lärms?|lärm|feier|nachts|drei uhr/i],
      ["② أثرها عليك (عمل/نوم/امتحان)", /arbeit|schlaf|montag|ermüdet|folgen|prüfung|lernen/i],
      ["③ الطلب: 22:00 والهدوء المستقبلي", /(bitte|ruhe|22 uhr|beenden|geschlossen halten)/i],
      ["④ التلميح للخطوة التالية (Hausverwaltung)", /hausverwaltung|weitere schritte|gezwungen|amt|verwaltungs/i],
    ],
    modell: `Sehr geehrter Herr Weber,

leider muss ich mich an Sie wenden, weil der Lärm aus Ihrer Wohnung die Grenze überschritten hat. Am vergangenen Samstag fand Ihre Feier bis drei Uhr nachts statt; am Montag konnte ich der Vorlesung kaum folgen.

Ich bitte Sie freundlich, künftige Feste spätestens um 22 Uhr zu beenden und die Türen geschlossen zu halten. Sollte sich das Problem wiederholen, sehe ich mich gezwungen, die Hausverwaltung einzuschalten.

Auf ein ruhiges Miteinander im Haus freue ich mich.

Mit freundlichen Grüßen
Max Mustermann`,
  },
  {
    id: "entschuldigung2", emoji: "🙇", de: "Entschuldigung an Lisa", ar: "اعتذار لصديقة — فاتك عيد ميلادها",
    lage: "فاتك عيد ميلاد صديقتك Lisa لأنك أصبت بحمى مفاجئة. اكتب لها اعتذاراً (≈90 كلمة) — انتبه: هنا du وليس Sie! اذكر أسفك وسببك · اعرض تعويضاً · واسألها عن موعد بديل.",
    formell: false,
    punkte: [
      ["① الأسف الصريح (es tut mir leid)", /(leid|entschuldig|schlimm)/i],
      ["② السبب الصادق (حمى/مفاجأة)", /fieber|krank|plötzlich|nicht kommen/i],
      ["③ التعويض (عشاء · هدية)", /einlad|essen|geschenk|nächste woche|wochenende|treffe/i],
      ["④ السؤال عن موعد بديل", /passt|uhr|wann|freitag|samstag|termin/i],
    ],
    modell: `Liebe Lisa,

es tut mir wirklich leid, dass ich gestern nicht zu deinem Geburtstag kommen konnte. Am Abend bekam ich plötzlich Fieber — und krank am Kuchen vorbeizuschauen wäre dir gegenüber unfair gewesen.

Ich schäme mich ein wenig, weil du dir so viel Mühe gemacht hast. Deshalb lade ich dich nächste Woche zum Essen ein, diesmal ohne jede Ausrede! Das Geschenk bringe ich mit; es steckt seit Monatsbeginn in meiner Tasche.

Sag mir bitte, ob dir Freitag um sieben passt.

Herzliche Grüße
Ali`,
  },
  {
    id: "anfrage", emoji: "❓", de: "Anfrage an die Stadtbibliothek", ar: "استفسار رسمي — مواعيد المكتبة وتجديد البطاقة",
    lage: "تدرس في دورة الاندماج وتراجع في Zweigstelle Nordstadt. اكتب استفساراً رسمياً (≈90 كلمة): عرّف بنفسك · اسأل عن فتح السبت · اسأل عن التجديد أونلاين أم شخصياً · واختم بالشكر المسبق.",
    formell: true,
    punkte: [
      ["① التعريف (Kursteilnehmer/VHS)", /teilnehmer|kurs|vhs|volkshochschule|lerne/i],
      ["② سؤال السبت/المواعيد", /ge\s?öffnet|öffnungszeit|samstag/i],
      ["③ سؤال التجديد online/persönlich", /verl[äa]ngern|online|pers[öo]nlich|erscheinen/i],
      ["④ الشكر المسبق", /vielen dank|dank im voraus|bedanke/i],
    ],
    modell: `Sehr geehrte Damen und Herren,

ich bin Teilnehmer des Integrationskurses an der Volkshochschule und lerne regelmäßig in Ihrer Zweigstelle in der Nordstadt. Deshalb hätte ich zwei Bitten.

Könnten Sie mir mitteilen, ob die Zweigstelle samstags geöffnet ist? Außerdem würde ich gern erfahren, ob ich meinen Ausweis online verlängern kann oder ob ich persönlich erscheinen muss.

Falls es eine Familienkarte gibt, wäre ich für Informationen sehr dankbar. Vielen Dank im Voraus für Ihre Mühe.

Mit freundlichen Grüßen
Max Mustermann`,
  },
  {
    id: "widerspruch", emoji: "⚖️", de: "Widerspruch gegen einen Bescheid", ar: "اعتراض على مخالفة — وكنت مريضاً بدليل",
    lage: "وصلك Bußgeld 45 Euro لمخالفة وقت الوقوف — في اليوم الذي كنت فيه مريضاً عند الطبيب. اكتب اعتراضاً (≈90 كلمة): حدّد القرار تاريخاً ورقماً · اذكر العذر مع Attest · اطلب إلغاء الغرامة · واختم بطلب التأكيد كتابياً.",
    formell: true,
    punkte: [
      ["① تحديد القرار (Datum + Zeichen)", /bescheid|3. märz|aktenzeichen|bußgeld|\d{1,2}\.\s?\d{1,2}\./i],
      ["② العذر + Attest مرفق", /krank|attest|ärztlich|arzt/i],
      ["③ الطلب: Aufhebung", /(aufheb|stornier|erlassen|verzichten)/i],
      ["④ طلب التأكيد schriftlich", /schriftlich|bestätig|mitteilen/i],
    ],
    modell: `Sehr geehrte Damen und Herren,

gegen den Bußgeldbescheid vom 3. März, Aktenzeichen 45/226, lege ich hiermit Widerspruch ein.

Am genannten Tag war ich nachweislich krank; das ärztliche Attest für diesen Zeitraum füge ich in Kopie bei. Das Parkschein-Ende konnte ich wegen des Arzttermins nicht mehr verlängern.

Ich bitte Sie, das Bußgeld in Höhe von 45 Euro aufzuheben und mir schriftlich zu bestätigen, dass der Vorgang damit erledigt ist.

Mit freundlichen Grüßen
Max Mustermann`,
  },
];

const KONN = ["leider", "deshalb", "deswegen", "außerdem", "zudem", "trotzdem", "dennoch", "selbstverständlich", "bezüglich", "aufgrund", "falls", "somit", "jedoch", "jedenfalls", "zunächst"];
const NEBEN = /\b(weil|dass|obwohl|wenn|damit|bevor|nachdem|indem|sobald)\b/g;

const noteVon = (pct: number) => (pct >= 90 ? 1 : pct >= 80 ? 2 : pct >= 65 ? 3 : pct >= 50 ? 4 : 5);
const NOTE_TEXT = ["", "sehr gut", "gut", "befriedigend", "ausreichend", "nicht bestanden"];

function bewertenBrief(b: Brief, text: string) {
  const t = " " + normalize(text) + " ";
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  const punktGetroffen = b.punkte.map(([, re]) => re.test(text));
  const anzahl = punktGetroffen.filter(Boolean).length;
  const inhalt = anzahl === 4 ? 5 : anzahl === 3 ? 4 : anzahl === 2 ? 2 : anzahl === 1 ? 1 : 0;

  let stil = 0;
  if (b.formell) {
    if (/sehr geehrte/i.test(text)) stil += 2;
    if (/mit freundlichen gr/i.test(text)) stil += 2;
    if (anzahl >= 3) stil += 1;
  } else {
    if (/liebe|lieber/i.test(text)) stil += 2;
    if (/gr[üu][ßs]e?|herzlich/i.test(text)) stil += 2;
    if (!/sehr geehrte/i.test(text)) stil += 1;
  }

  const konekt = KONN.filter((k) => t.includes(k)).length;
  const neben = (text.match(NEBEN) || []).length;
  let ausdruck = Math.min(5, Math.round((konekt * 0.9 + neben * 1.1) * 10) / 10);
  if (woerter < 45) ausdruck = Math.min(ausdruck, 2);

  const lint = selbstKorrektur(text);
  const fehler = lint.hart.length;
  const correctness = fehler === 0 ? 5 : fehler <= 1 ? 4 : fehler <= 2 ? 3 : fehler <= 3 ? 2 : fehler <= 5 ? 1 : 0;

  const summe = inhalt + stil + ausdruck + correctness;
  const pct = Math.round((summe / 20) * 100);
  const note = noteVon(pct);
  const laengeOk = woerter >= 70 && woerter <= 130;
  return { inhalt, stil, ausdruck, correctness, summe, pct, note, anzahl, punktGetroffen, lint, woerter, laengeOk };
}

export function BriefSchmiede({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(BRIEFE[0].id);
  const [text, setText] = useState("");
  const [res, setRes] = useState<null | ReturnType<typeof bewertenBrief>>(null);
  const b = BRIEFE.find((x) => x.id === sel)!;

  function pruefen() {
    const r = bewertenBrief(b, text);
    setRes(r);
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + Math.max(0, Math.round(r.summe / 4)) }), "Schreiben", r.pct >= 60));
    if (r.anzahl < 4)
      addFehlerNow({ falsch: `«${b.de}»: ${b.punkte.filter((_, k) => !r.punktGetroffen[k]).map(([c]) => c).join(" · ").slice(0, 90)}`, richtig: "vier Punkte + Anrede + Grußformel + 70–130 Wörter", art: "konstruktion", ar: "رسالة رسمية — نقاط/بنية مفقودة", quelle: "BriefSchmiede" });
  }

  function druckProtokoll() {
    if (!res) return;
    drucke(
      `<h1>Prüfungsprotokoll — ${b.de}</h1>
<p><b>Verfasser:</b> ${activeProfile().name} · <b>Text:</b> ${res.woerter} Wörter · <b>Punkte:</b> ${res.anzahl}/4</p>
<pre>${b.lage.replace(/</g, "&lt;")}</pre>
<h1>Dein Brief</h1><pre>${text.replace(/</g, "&lt;")}</pre>
<h1>Bewertung</h1>
<pre>Inhalt ${res.inhalt}/5 · Stil ${res.stil}/5 · Ausdruck ${res.ausdruck}/5 · Correctness ${res.correctness}/5
Gesamt ${res.summe}/20 → ${res.pct}% → Note ${res.note} (${NOTE_TEXT[res.note]})
${res.pct >= 60 ? "BESTANDEN ✓" : "Nicht bestanden — nach 4-Punkte-Regel üben."}</pre>`,
      "Brief-Protokoll"
    );
  }

  return (
    <div className="card fadein" id="briefe" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-a2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          ✉️ ورشة الرسائل الرسمية — BriefSchmiede <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul Z · Verwaltung)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        شكوى · اعتذار · استفسار · اعتراض — بأربع نقاط، ومقياس تقدير كغرفة الامتحانات، ومصّحح الوحدة O نفسه خلف الخطأ النحوي.
      </div>
      {open && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BRIEFE.map((x) => (
              <button key={x.id} className="chip" style={{ cursor: "pointer", background: x.id === sel ? "var(--color-cola)" : "white", color: x.id === sel ? "white" : undefined }} onClick={() => { setSel(x.id); setText(""); setRes(null); }}>
                {x.emoji} {x.ar.split("—")[0]}
              </button>
            ))}
          </div>
          <div style={{ background: "var(--color-gold-soft)", borderRadius: 10, padding: "0.55rem 0.8rem", fontSize: "0.78rem" }} dir="rtl">
            <b>{b.emoji} المهمة:</b> {b.lage}
          </div>
          <textarea className="field" rows={8} style={{ width: "100%", direction: "ltr", resize: "vertical" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Sehr geehrte… (Dein Brief, ≈90 Wörter)" />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {!res ? (
              <button className="btn btn-primary" disabled={text.trim().split(/\s+/).filter(Boolean).length < 25} onClick={pruefen}>
                📋 قدِّر — أربعة معايير رسمية
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => { setRes(null); setText(""); }}>✍️ رسالة أخرى</button>
                <button className="btn btn-gold" onClick={druckProtokoll}>🖨 اطبع المحضر</button>
              </>
            )}
            <span style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }} dir="rtl">
              كلماتك <b className="rtl-num">{text.trim() ? text.trim().split(/\s+/).length : 0}</b> · النطاق المثالي 70–130
            </span>
          </div>
          {res && (
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.7rem", fontWeight: 900, color: res.pct >= 60 ? "var(--color-a1)" : "#b91c1c" }}>
                  Note {res.note}
                </span>
                <span className="chip" style={{ background: res.pct >= 60 ? "var(--color-a1)" : "#b91c1c", color: "white", border: 0 }}>
                  {res.pct}٪ — {NOTE_TEXT[res.note]}{res.pct >= 60 ? " · bestanden ✓" : " · nicht bestanden"}
                </span>
                {!res.laengeOk && <span style={{ fontSize: "0.7rem", color: "var(--color-gold)" }} dir="rtl">⚠️ خارج نطاق الطول — يُخصم من Ausdruck</span>}
              </div>
              {(
                [
                  ["Inhalt — الأربع نقاط", res.inhalt, `نقاطك في الورقة: ${res.anzahl}/4 — ${res.anzahl < 4 ? "كل نقطة غائبة = شريحة كاملة من الدرجات" : "كامل الطيف"}`],
                  ["Kommunikationsstil — الأداة والختام", res.stil, b.formell ? "Sehr geehrte + Mit freundlichen Grüßen = الوقار المطلوب" : "Liebe + Herzliche Grüße — ودّ بلا رَسْمِيّة زائدة"],
                  ["Ausdruck — أدوات وربط", res.ausdruck, "zudem · dennoch · deshalb + جملة جانبية واحدة = صوت B2"],
                  ["Correctness — المصحّح الخماسي", res.correctness, `${res.lint.hart.length} أخطاء صلبة · ${res.lint.hints.length} تلميحات — نفسها عيون وحدة O`],
                ] as [string, number, string][]
              ).map(([name, val, tip]) => (
                <div key={name} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.76rem" }} dir="rtl">
                  <span style={{ flex: "0 0 15.5rem", fontWeight: 800 }}>{name}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--color-line)" }}>
                    <div style={{ width: `${(val / 5) * 100}%`, height: "100%", borderRadius: 4, background: val >= 4 ? "var(--color-a1)" : val >= 2.5 ? "var(--color-gold)" : "#b91c1c" }} />
                  </div>
                  <b style={{ width: "3.2rem", textAlign: "center" }}>{val}/5</b>
                  <span style={{ flex: "1 1 12rem", color: "var(--color-ink2)", fontSize: "0.7rem" }}>{tip}</span>
                </div>
              ))}
              {res.lint.hart.slice(0, 3).map((f, k) => (
                <div key={k} className="de" style={{ fontSize: "0.72rem", color: "#b91c1c" }}>
                  {f.dim}: <s>{f.was}</s> → <b>{f.besser}</b>
                </div>
              ))}
              <details style={{ fontSize: "0.78rem" }}>
                <summary style={{ cursor: "pointer", fontWeight: 800 }}>📜 نموذج غرفة الامتحان — قارن سطراً سطراً بعد أن تُقيَّم أنت</summary>
                <pre className="de" style={{ background: "var(--color-paper)", borderRadius: 10, padding: "0.6rem 0.8rem", fontSize: "0.76rem", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{b.modell}</pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
