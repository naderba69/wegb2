"use client";

/**
 * InterviewArena (Modul Z · Teil 1 der Mündlichen — Schritte 173–174)
 * ---------------------------------------------------------------------------
 * مقابلات B2 Teil 1 بأربع ساحات لم تكن في الحزمة الأولى: الأرقام · بحث صغير ·
 * صحة · مقابلة عمل. الممتحِن يسأل (🔊 صوتياً)، الطالب يجيب، و«CriticRadar»
 * يمسح الجواب من أربعة محاور كمحاور التقدير الرسمية:
 *   Inhalt (تغطية الكلمات المطلوبة) · Struktur (أدوات الربط) ·
 *   Ausdruck (جمل جانبية ومفردات راقية) · Umfang (طولٌ لا هزيل ولا ثرثار).
 * كل محور رقمنةٌ محلية deterministic — لا LLM مطلوب — والناتج رادار معيّن
 * بمضلع SVG حيّ. عند بلوغ المتوسط يهنّئ الممتحِن بصوته الألماني.
 */

import { useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { normalize } from "@/lib/grader";
import { rng } from "@/lib/plan";
import { logK } from "@/lib/kompetenz";
import { checkAbzeichen } from "@/lib/spiel";
import { speakDe } from "@/lib/speech";

interface Frage {
  f: string;
  ar: string;
  kw: string[];
  modell: string;
}
interface Arena {
  id: string;
  emoji: string;
  de: string;
  ar: string;
  redemittel: string[];
  fragen: Frage[];
}

const ARENEN: Arena[] = [
  {
    id: "zahlen", emoji: "📊", de: "Zahlen & Fakten", ar: "تقديم أرقام وإحصاء",
    redemittel: ["etwa / ungefähr / rund", "mehr als · weniger als · genau", "im Vergleich zu + Dat.", "die Hälfte · ein Drittel · 40 Prozent"],
    fragen: [
      { f: "Wie viele Einwohner hat Ihre Heimatstadt ungefähr?", ar: "كم عدد سكان مدينتك تقريباً؟", kw: ["etwa", "ungefähr", "einwohner", "rund", "millionen", "stadt"], modell: "Meine Heimatstadt hat etwa 750.000 Einwohner — das sind rund 200.000 mehr als vor zehn Jahren." },
      { f: "Wie hoch war Ihr letztes Monatsbudget für Lernmaterialien?", ar: "كم كان ميزانيك الشهري لمواد التعلم؟", kw: ["euro", "monat", "budget", "ausgegeben", "für", "ungefähr"], modell: "Letzten Monat lag mein Budget bei etwa 40 Euro; das meiste habe ich für zwei Lehrbücher ausgegeben." },
      { f: "Wie viele Stunden pro Woche lernen Sie Deutsch — und seit wann?", ar: "كم ساعة أسبوعياً تدرس الألمانية، ومنذ متى؟", kw: ["stunden", "woche", "pro", "seit", "monaten", "jahren"], modell: "Ich lerne ungefähr acht Stunden pro Woche, und zwar seit anderthalb Jahren — erst drei, dann mehr." },
      { f: "Vergleichen Sie: Haben Sie früher mehr oder weniger gelernt als heute?", ar: "قارن: هل كنت تدرس أكثر أم أقل من اليوم؟", kw: ["früher", "als", "heute", "mehr", "weniger", "weil"], modell: "Früher habe ich weniger gelernt als heute, weil die Prüfung näher rückt und ich die Grammatik wiederholen muss." },
      { f: "Welche Zahl überrascht Sie an sich selbst?", ar: "أي رقمٍ فيك يفاجئك؟", kw: ["zahl", "überrascht", "prozent", "weil", "eigentlich"], modell: "Die Zahl, die mich überrascht: 90 von 100 Vokabeln behalte ich — dabei dachte ich früher, ich hätte ein schlechtes Gedächtnis." },
    ],
  },
  {
    id: "forschung", emoji: "🔬", de: "Mini-Forschung", ar: "عرض استطلاع أجرَيته",
    redemittel: ["ich habe … untersucht", "die Mehrheit / ein Drittel antwortete…", "das überraschende Ergebnis", "aufgrund der Daten empfehle ich"],
    fragen: [
      { f: "Was haben Sie untersucht — und mit wie vielen Teilnehmern?", ar: "ماذا درست وبكم مشاركاً؟", kw: ["umfrage", "untersucht", "teilnehmer", "befragt", "personen"], modell: "Ich habe das Lernverhalten untersucht: Befragt wurden 35 Personen aus meinem Kurs — 28 Männer und Frauen gemischt." },
      { f: "Was war das häufigste Ergebnis?", ar: "ما النتيجة الأكثر تكراراً؟", kw: ["häufigste", "mehrheit", "prozent", "antworteten", "sagten"], modell: "Das häufigste Ergebnis: 70 Prozent lernten abends, weil sie sich da am besten konzentrieren können." },
      { f: "Was hat Sie an den Daten überrascht?", ar: "ما الذي فاجأك في البيانات؟", kw: ["überrascht", "unerwartet", "obwohl", "dagegen"], modell: "Überrascht hat mich, dass die Jüngeren länger lernten als die Älteren — obwohl sie weniger Zeit hatten." },
      { f: "Wie haben Sie die Zahlen dargestellt?", ar: "كيف عرضت الأرقام؟", kw: ["diagramm", "tabelle", "balken", "kurve", "dargestellt"], modell: "Ich habe die Zahlen in drei Balkendiagrammen dargestellt, damit man die Gruppen sofort vergleichen kann." },
      { f: "Was empfehlen Sie aufgrund Ihrer Ergebnisse?", ar: "ماذا توصي بناءً على نتائجك؟", kw: ["empfehle", "deshalb", "sollte", "aufgrund", "ergebnis"], modell: "Aufgrund der Ergebnisse empfehle ich, morgens nur zu wiederholen — Neues lernt man abends besser." },
    ],
  },
  {
    id: "gesundheit", emoji: "🩺", de: "Gesundheit & Leben", ar: "مقابلة نمط حياة",
    redemittel: ["ich achte darauf, dass …", "im Vergleich zu früher", "damit ich …", "verzichten auf + Akk."],
    fragen: [
      { f: "Was tun Sie täglich für Ihre Gesundheit?", ar: "ماذا تفعل يومياً لصحتك؟", kw: ["jeden tag", "trinke", "schlafe", "bewege", "esse", "wasser"], modell: "Jeden Tag trinke ich zwei Liter Wasser und gehe eine halbe Stunde spazieren — das ist wenig, aber es hilft." },
      { f: "Wie viel Schlaf brauchen Sie — und warum gerade so viel?", ar: "كم نوم تحتاج ولماذا بالضبط؟", kw: ["stunden", "schlaf", "brauche", "weil", "konzentrieren", "erhole"], modell: "Ich brauche sieben Stunden Schlaf, weil ich sonst am nächsten Tag nicht denken kann, egal wie viel Kaffee ich trinke." },
      { f: "Was ist schädlicher für Sie: Zucker oder Stress? Begründen Sie.", ar: "الأضرك عليك: السكر أم التوتر؟ برّر.", kw: ["schädlicher", "stress", "zucker", "weil", "obwohl"], modell: "Stress ist schädlicher als Zucker, weil ich dabei nicht nur nasche, sondern auch nicht schlafe — beides zusammen." },
      { f: "Wie bleiben Sie beim Deutschlernen gesund?", ar: "كيف تحافظ على صحتك أثناء التعلم؟", kw: ["pausen", "frische luft", "augen", "20", "bewegung"], modell: "Ich mache alle 20 Minuten eine kurze Pause und schaue aus dem Fenster, damit meine Augen nicht brennen." },
      { f: "Welche Gewohnheit wollen Sie ab sofort ändern?", ar: "أي عادة ستغيّرها من الآن؟", kw: ["gewohnheit", "ändern", "ab sofort", "verzichten", "vornehmen"], modell: "Ich will ab sofort aufs Handy verzichten, während ich lerne — ich habe mir vorgenommen, es in einen anderen Raum zu legen." },
    ],
  },
  {
    id: "beruf", emoji: "💼", de: "Vorstellungsgespräch", ar: "مقابلة عمل",
    redemittel: ["meine Stärke ist, dass …", "damals … schließlich …", "ich bin überzeugt, dass …", "in fünf Jahren werde ich …"],
    fragen: [
      { f: "Warum möchten Sie diese Stelle haben?", ar: "لماذا تريد هذه الوظيفة؟", kw: ["weil", "interessiert", "erfahrung", "passen", "stelle"], modell: "Diese Stelle interessiert mich, weil sie meine Erfahrung mit Sprachen und Organisation perfekt verbindet." },
      { f: "Was können Sie besonders gut?", ar: "ما الذي تتقنه بامتياز؟", kw: ["stärke", "gut", "besonders", "kann", "team"], modell: "Meine größte Stärke ist, dass ich schwierige Termine ruhig koordiniere — auch wenn drei Abteilungen gleichzeitig anrufen." },
      { f: "Erzählen Sie von einem Problem bei der Arbeit — und wie Sie es lösten.", ar: "احكِ عن مشكلة في العمل وكيف حللتها.", kw: ["damals", "problem", "gelöst", "schließlich", "deshalb"], modell: "Damals fehlte am Eröffnungstag das Personal. Ich habe kurz umorganisiert, und schließlich kamen wir trotzdem pünktlich an." },
      { f: "Wie stellen Sie sich Ihre Arbeit in fünf Jahren vor?", ar: "كيف ترى عملك بعد خمس سنوات؟", kw: ["fünf jahren", "werde", "möchte", "entwickeln", "sehen"], modell: "In fünf Jahren sehe ich mich im Team als Ansprechpartnerin für Deutschkurse — mit mehr Verantwortung und weniger Angst vor Präsentationen." },
      { f: "Welche Frage möchten Sie uns zum Schluss stellen?", ar: "ما سؤالك لك في الختام؟", kw: ["frage", "würde gern", "erfahren", "wie", "ob"], modell: "Ich würde gern erfahren, wie die Einarbeitung abläuft und ob es eine feste Ansprechperson in den ersten Wochen gibt." },
    ],
  },
];

const KONNEKTOREN = ["zuerst", "außerdem", "dann", "deshalb", "trotzdem", "obwohl", "zusammenfassend", "meiner meinung nach", "einerseits", "andererseits", "schließlich", "natürlich", "das heißt", "weil"];
const NEBEN = /\b(weil|dass|obwohl|wenn|damit|bevor|nachdem|seit)\b/g;

function bewerten(answer: string, q: Frage) {
  const t = " " + normalize(answer) + " ";
  const woerter = answer.trim().split(/\s+/).filter(Boolean).length;
  const inhalt = Math.min(100, Math.round((100 * q.kw.filter((k) => t.includes(k)).length) / Math.max(1, q.kw.length)));
  const konekt = KONNEKTOREN.filter((k) => t.includes(k)).length;
  const struktur = Math.min(100, konekt * 35);
  const neben = (answer.match(NEBEN) || []).length;
  const edel = answer.split(/\s+/).filter((w) => w.replace(/[^a-zA-ZäöüßÄÖÜ]/g, "").length >= 9).length;
  const ausdruck = Math.min(100, neben * 30 + edel * 20);
  const umfang = woerter < 10 ? 0 : woerter < 26 ? 45 : woerter <= 90 ? 100 : woerter <= 130 ? 65 : 30;
  const ges = Math.round((inhalt + struktur + ausdruck + umfang) / 4);
  const achse = [
    { name: "Inhalt", v: inhalt, tip: "أجبت عن السؤال نفسه؟ استخدم كلمات الممتحِن مفتاحياً — هو يبحث عنها." },
    { name: "Struktur", v: struktur, tip: "زِد أدوات ربط (zuerst · außerdem · deshalb): محاور التقدير الأربعة تقرأها أولاً." },
    { name: "Ausdruck", v: ausdruck, tip: "جملة جانبية واحدة بـ weil/dass + مفردة طويلة واحدة = انطباع B2." },
    { name: "Umfang", v: umfang, tip: "بين 26 و90 كلمة منطقة ذهبية — القصير لا يُقيَّم، والثرثار يتوه." },
  ];
  return { ges, achse };
}

/** CriticRadar — مضلع رباعي على أربعة محاور */
function Radar({ achse }: { achse: { name: string; v: number }[] }) {
  const pts = [
    [50, 50 - 44 * (achse[0].v / 100)],
    [50 + 44 * (achse[1].v / 100), 50],
    [50, 50 + 44 * (achse[2].v / 100)],
    [50 - 44 * (achse[3].v / 100), 50],
  ];
  return (
    <svg viewBox="0 0 100 100" style={{ width: 148, height: 148, flexShrink: 0 }} role="img" aria-label="CriticRadar">
      {[1, 0.66, 0.33].map((f) => (
        <polygon key={f} points={`50,${50 - 44 * f} ${50 + 44 * f},50 50,${50 + 44 * f} ${50 - 44 * f},50`} fill="none" stroke="#d6d3d1" strokeWidth={f === 1 ? 1 : 0.5} />
      ))}
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="rgba(124,58,237,0.28)" stroke="var(--color-b2)" strokeWidth={1.4} />
      {pts.map((p, k) => (
        <circle key={k} cx={p[0]} cy={p[1]} r={2} fill="var(--color-b2)" />
      ))}
      <text x="50" y="8" textAnchor="middle" fontSize="7" fontWeight="800">{achse[0].name}</text>
      <text x="97" y="52" textAnchor="end" fontSize="7" fontWeight="800">{achse[1].name}</text>
      <text x="50" y="98" textAnchor="middle" fontSize="7" fontWeight="800">{achse[2].name}</text>
      <text x="3" y="52" textAnchor="start" fontSize="7" fontWeight="800">{achse[3].name}</text>
    </svg>
  );
}

export function InterviewArena({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [open, setOpen] = useState(false);
  const [arena, setArena] = useState(ARENEN[0].id);
  const [qi, setQi] = useState(0);
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | ReturnType<typeof bewerten>>(null);
  const [log, setLog] = useState<{ arena: string; ges: number }[]>([]);
  const a = ARENEN.find((x) => x.id === arena)!;
  const rotation = useMemo(() => {
    const rand = rng(progress.plan.day * 311 + 5);
    return a.fragen.map((f) => ({ ...f, kw: f.kw })).sort(() => rand() - 0.5);
  }, [a.id, progress.plan.day]);
  const qRot = rotation[qi % rotation.length];

  function pruefen() {
    const r = bewerten(text, qRot);
    setResult(r);
    setLog((L) => [...L, { arena: a.id, ges: r.ges }]);
    update((p) => logK(checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (r.ges >= 55 ? 2 : r.ges >= 35 ? 1 : 0) }), "Sprechen", r.ges >= 55));
    if (r.ges >= 75) speakDe("Gut. Das habe ich gerne gehört.");
  }
  function weiter() {
    setQi((i) => i + 1);
    setText("");
    setResult(null);
  }
  const schnitt = log.length ? Math.round(log.reduce((s2, x) => s2 + x.ges, 0) / log.length) : null;

  return (
    <div className="card fadein" id="interview2" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-b2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          🎭 ساحة المقابلات — InterviewArena <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul Z · Teil 1)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        أربع ساحات لم تكن في الحزمة الأولى: أرقام · بحث صغير · صحة · مقابلة عمل — والسؤال يُقرأ بصوت الممتحِن، والجواب يُشخَّص برادار ناقِد محلي.
      </div>
      {open && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ARENEN.map((x) => (
              <button key={x.id} className="chip" style={{ cursor: "pointer", background: x.id === arena ? "var(--color-cola)" : "var(--ui-surface-raised)", color: x.id === arena ? "var(--ui-on-accent)" : undefined }} onClick={() => { setArena(x.id); setQi(0); setText(""); setResult(null); }}>
                {x.emoji} {x.de}
              </button>
            ))}
          </div>
          <div style={{ background: "var(--color-paper2)", borderRadius: 10, padding: "0.5rem 0.75rem", fontSize: "0.74rem", display: "flex", gap: 6, flexWrap: "wrap" }} dir="rtl">
            <b>🧰 Redemittel:</b>
            {a.redemittel.map((r2) => (
              <span key={r2} className="chip de" style={{ background: "var(--color-card)" }}>{r2}</span>
            ))}
          </div>
          <div style={{ border: "1px solid var(--color-line)", borderRadius: 12, padding: "0.7rem 0.9rem", background: "var(--color-paper)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 900, fontSize: "0.72rem", color: "var(--color-b2)" }}>سؤال {qi + 1}</span>
              <div className="de" style={{ flex: 1, fontWeight: 800, fontSize: "0.98rem" }}>{qRot.f}</div>
              <button title="اسمع السؤال من الممتحِن" onClick={() => speakDe(qRot.f)} style={{ border: "1px solid var(--color-line)", background: "var(--color-card)", borderRadius: 8, padding: "0.25rem 0.45rem", cursor: "pointer" }}>🔊</button>
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--color-ink2)", margin: "2px 0 8px" }} dir="rtl">{qRot.ar} — بصوتك الآن، ثم اكتبه كما قلته.</div>
            <textarea className="field" rows={4} style={{ width: "100%", direction: "ltr", resize: "vertical" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Antworte frei — sprich laut, dann tippe…" />
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              {!result ? (
                <button className="btn btn-primary" disabled={text.trim().split(/\s+/).filter(Boolean).length < 5} onClick={pruefen}>⚖️ شخّص الجواب</button>
              ) : (
                <button className="btn btn-primary" onClick={weiter}>السؤال التالي ↻</button>
              )}
              <details style={{ fontSize: "0.72rem", marginInlineStart: "auto" }}>
                <summary style={{ cursor: "pointer", opacity: 0.8 }}>🪞 نموذج إجابة (بعد التشخيص فقط!)</summary>
                <p className="de" style={{ fontSize: "0.76rem", maxWidth: "34rem" }}>{qRot.modell}</p>
              </details>
            </div>
            {result && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
                <Radar achse={result.achse} />
                <div style={{ flex: 1, minWidth: "13rem", display: "grid", gap: 4 }}>
                  <div style={{ fontWeight: 900, fontSize: "1.05rem", color: result.ges >= 55 ? "var(--color-a1)" : "var(--color-gold)" }}>
                    {result.ges}/100 {result.ges >= 75 ? "— „sehr gut gemacht“ 🎉" : result.ges >= 55 ? "— على خط النجاح" : "— بعيد عن النجاح بعد"}
                  </div>
                  {result.achse
                    .slice()
                    .sort((x, y) => x.v - y.v)
                    .slice(0, 2)
                    .map((x) => (
                      <div key={x.name} style={{ fontSize: "0.74rem", color: "var(--color-ink2)" }} dir="rtl">
                        <b className="de" style={{ color: "#b91c1c" }}>{x.name} ({x.v})</b> — {x.tip}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          {log.length >= 3 && (
            <div className="chip" style={{ justifySelf: "start" }} dir="rtl">
              📈 متوسطك في هذه الجلسة: <b>{schnitt}</b>/100 من {log.length} إجابات {schnitt !== null && schnitt >= 60 ? "— الممتحِن سيرضيك اليوم." : "— واصل، سؤالان آخران يكفيان."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
