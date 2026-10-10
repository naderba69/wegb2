/**
 * ═══════════════════════════════════════════════════════════════════
 *  📡 رادار الكلمات الإشارية — Signalwörter im Hörverstehen
 * ═══════════════════════════════════════════════════════════════════
 *  في امتحانات Goethe/telc لا تُخطئ الإجابةَ لأنك لم تفهم الكلمات، بل لأنك
 *  فاتتك **كلمةٌ واحدة قلبت المعنى**: «nicht am Montag, sondern am Dienstag»
 *  — من يسمع «Montag» ويختارها يقع في الفخّ الكلاسيكي: خيارٌ يُسمَع حرفياً
 *  ثم يُنفى أو يُصحَّح.
 *
 *  هذه الوحدة نقية وحتمية، وتفعل ثلاثة أشياء مشتقّةً من الحوارات الـ156 نفسها:
 *   (١) `signaleIn(text)`  — تكشف الكلمات الإشارية في سطر وتصنّفها (7 فئات).
 *   (٢) `ablenker(dialog)` — **المُضلِّلات الموسومة**: خيارٌ خاطئٌ من سؤال
 *       الفهم يظهر حرفياً في سطرٍ من الحوار ⇒ فخٌّ مسموع، مع الإشارة التي
 *       تكشفه إن وُجدت في السطر نفسه.
 *   (٣) `signalDrill(dialog)` — تمارين «ما وظيفة هذه الكلمة؟» من أسطر الحوار.
 *
 *  حدود معلَنة (لا تُخفى): المُضلِّل يُشتقّ بمطابقة حرفية، فما لا يُشتقّ لا
 *  يُدَّعى؛ بعض الحوارات بلا مُضلِّل مسموع أصلاً — والرادار يقول ذلك.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Hoerdialog as Dialogue, Exercise } from "./types";

export type SignalKategorie = "negation" | "kontrast" | "korrektur" | "einschraenkung" | "reihenfolge" | "sicherheit" | "zeitfalle";

export const KATEGORIE_AR: Record<SignalKategorie, { name: string; hinweis: string; emoji: string }> = {
  negation:       { name: "نفي",            emoji: "⛔", hinweis: "ما بعدها ليس الجواب — ولو سمعتَه بوضوح" },
  kontrast:       { name: "استدراك",        emoji: "↩️", hinweis: "الجواب الحقيقي يأتي بعدها لا قبلها" },
  korrektur:      { name: "تصحيح ذاتي",     emoji: "✏️", hinweis: "المتكلّم يلغي ما قاله للتوّ — خذ الرواية الأخيرة" },
  einschraenkung: { name: "تقييد",          emoji: "🔬", hinweis: "الحكم لا يعمّ — انتبه إلى «فقط/ما زال/بالفعل»" },
  reihenfolge:    { name: "ترتيب",          emoji: "🔢", hinweis: "أسئلة «ماذا أولاً/بعد ذلك؟» تُحسَم هنا" },
  sicherheit:     { name: "درجة اليقين",    emoji: "🎚️", hinweis: "«ربما» ≠ «بالتأكيد» — خيارات الامتحان تفرّق بينهما" },
  zeitfalle:      { name: "فخّ زمني",       emoji: "⏰", hinweis: "زمنان أو مكانان في جملة واحدة — أحدهما مُضلِّل" },
};

/** المعجم: صيغٌ حرفية (تُطابَق بحدود الكلمة، بلا حساسية لحالة الحرف) */
export const SIGNALE: Record<SignalKategorie, string[]> = {
  negation:       ["nicht", "kein", "keine", "keinen", "keinem", "keiner", "nie", "niemals", "nichts", "niemand", "nirgends", "weder"],
  kontrast:       ["aber", "sondern", "doch", "jedoch", "allerdings", "trotzdem", "dennoch", "obwohl", "zwar", "stattdessen", "dagegen", "hingegen"],
  korrektur:      ["eigentlich", "ich meine", "nein", "moment", "das heißt", "genauer gesagt", "also nein", "ach so", "quatsch", "lieber"],
  einschraenkung: ["nur", "erst", "schon", "noch", "bloß", "lediglich", "kaum", "fast", "höchstens", "mindestens", "außer"],
  reihenfolge:    ["zuerst", "zunächst", "dann", "danach", "anschließend", "schließlich", "zum schluss", "am ende", "vorher", "bevor", "nachdem", "später"],
  sicherheit:     ["vielleicht", "wahrscheinlich", "möglicherweise", "bestimmt", "sicher", "auf jeden fall", "auf keinen fall", "eventuell", "vermutlich", "wohl"],
  zeitfalle:      ["statt", "anstatt", "nicht mehr", "nicht am", "nicht um", "nicht im", "verschoben", "geändert", "früher als", "später als"],
};

export interface SignalTreffer { wort: string; kategorie: SignalKategorie; index: number }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** ترتيب الفحص: الفئات المركّبة أولاً حتى لا تبتلع «nicht» وحدَها «nicht mehr» */
const REIHENFOLGE: SignalKategorie[] = ["zeitfalle", "korrektur", "sicherheit", "reihenfolge", "kontrast", "einschraenkung", "negation"];

export function signaleIn(text: string): SignalTreffer[] {
  const out: SignalTreffer[] = [];
  const belegt: [number, number][] = [];
  const frei = (a: number, b: number) => belegt.every(([x, y]) => b <= x || a >= y);
  for (const kat of REIHENFOLGE) {
    for (const w of SIGNALE[kat]) {
      const re = new RegExp(`(^|[^\\p{L}])(${esc(w)})(?=$|[^\\p{L}])`, "giu");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        const start = m.index + m[1].length, end = start + m[2].length;
        if (!frei(start, end)) continue;
        belegt.push([start, end]);
        out.push({ wort: m[2], kategorie: kat, index: start });
      }
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

export interface Ablenker {
  frageId: string;
  /** الخيار الخاطئ الذي يُسمَع حرفياً */
  option: string;
  /** رقم السطر الذي يُسمَع فيه */
  zeile: number;
  /** الإشارة الكاشفة في السطر نفسه (إن وُجدت) */
  signal?: SignalTreffer;
  /** الجواب الصحيح — للمقارنة في التغذية الراجعة */
  richtig: string;
  /** كيف سُمِع: حرفيًّا كمقطع، أو بجذوعِ كلماتِه (فخٌّ مركّب: كلمةُ الحوارِ في دورٍ خاطئ) */
  art: "woertlich" | "stamm";
  /** الكلماتُ المسموعةُ التي تُرسي المُضلِّل في السطر */
  anker: string[];
}

const STOP = new Set(["eine", "einen", "einer", "eines", "einem", "nicht", "dass", "wird", "werden", "wenn", "aber", "auch", "sich", "über", "ohne", "nach", "durch", "oder", "noch", "dann", "beim", "vom", "zum", "zur", "mit", "und", "der", "die", "das", "den", "dem", "des", "als", "für", "auf", "ist", "sind", "war", "weil", "damit", "statt", "trotz", "nur", "sein", "seine", "seiner", "ihre", "ihr", "kein", "keine", "keinen", "sehr", "mehr", "schon", "noch", "erst", "ganz", "alle", "allen", "diese", "dieser", "dieses", "jede", "jeden", "jeder", "morgen", "heute", "gestern"]);
const stamm = (w: string) => w.slice(0, Math.max(4, w.length - 2));
const GENERISCH = new Set(["euro", "uhr", "tage", "tagen", "jahr", "jahre", "woche", "wochen", "monat", "monate", "prozent", "minute", "minuten", "stunde", "stunden", "person", "personen", "leute", "mensch", "menschen", "zeit"].map(stamm));
/** جذوعُ كلماتِ المحتوى في خيار: ≥4 أحرف، خارجَ قائمةِ الوقف */
export function inhaltsStaemme(s: string): string[] {
  return norm(s).split(" ").filter((w) => w.length >= 4 && !STOP.has(w)).map(stamm);
}

const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:„“"()]/g, " ").replace(/\s+/g, " ").trim();

/** المُضلِّلات الموسومة: خيار خاطئ مسموع حرفياً في سطرٍ ما */
export function ablenker(d: Dialogue): Ablenker[] {
  const out: Ablenker[] = [];
  for (const q of d.questions ?? []) {
    if (q.type !== "mc" || !q.options) continue;
    const richtig = Array.isArray(q.answer) ? q.answer[0] : q.answer;
    for (const o of q.options) {
      if (o === richtig) continue;
      const on = norm(o);
      if (on.length < 3) continue;
      const zeile = d.lines.findIndex((l) => norm(l.de).includes(on));
      if (zeile >= 0) {
        const sig = signaleIn(d.lines[zeile].de);
        out.push({ frageId: q.id, option: o, zeile, signal: sig[0], richtig, art: "woertlich", anker: [o] });
        continue;
      }
      // فخٌّ مركّب: كلماتُ الخيارِ (بجذوعِها) مسموعةٌ في سطرٍ واحد — نختارُ السطرَ الأكثرَ تطابقاً
      const st = inhaltsStaemme(o);
      if (!st.length) continue;
      let best = -1, bestAnker: string[] = [];
      d.lines.forEach((l, i) => {
        const woerter = norm(l.de).split(" ");
        const treffer = st.map((x) => woerter.find((w) => w.startsWith(x))).filter((w): w is string => !!w);
        if (treffer.length > bestAnker.length) { best = i; bestAnker = treffer; }
      });
      const noetig = st.length === 1 ? 1 : Math.ceil(st.length / 2);
      if (best < 0 || bestAnker.length < noetig) continue;
      // مرساةٌ وحيدةٌ عامّة (euro, uhr, tage…) لا تكفي وحدَها لفخٍّ مركّب
      if (bestAnker.length === 1 && st.length > 1 && GENERISCH.has(stamm(bestAnker[0]))) continue;
      const sig = signaleIn(d.lines[best].de);
      out.push({ frageId: q.id, option: o, zeile: best, signal: sig[0], richtig, art: "stamm", anker: [...new Set(bestAnker)] });
    }
  }
  return out;
}

export interface RadarZeile { zeile: number; who: string; de: string; signale: SignalTreffer[]; falle: boolean }

/** الرادار الكامل لحوار: كل سطر بإشاراته وعلامة الفخّ */
export function signalRadar(d: Dialogue): { zeilen: RadarZeile[]; fallen: Ablenker[]; anzahlSignale: number } {
  const fallen = ablenker(d);
  const fallenZeilen = new Set(fallen.map((f) => f.zeile));
  const zeilen = d.lines.map((l, i) => ({ zeile: i, who: l.who, de: l.de, signale: signaleIn(l.de), falle: fallenZeilen.has(i) }));
  return { zeilen, fallen, anzahlSignale: zeilen.reduce((a, z) => a + z.signale.length, 0) };
}

const ALLE_KAT: SignalKategorie[] = ["negation", "kontrast", "korrektur", "einschraenkung", "reihenfolge", "sicherheit", "zeitfalle"];

/** تمارين حتمية: «ما وظيفة الكلمة المعلَّمة في هذا السطر؟» — حتى 3 لكل حوار، من أسطره هو */
export function signalDrill(d: Dialogue, max = 3): Exercise[] {
  const out: Exercise[] = [];
  const benutzt = new Set<SignalKategorie>();
  for (const [i, l] of d.lines.entries()) {
    for (const t of signaleIn(l.de)) {
      if (benutzt.has(t.kategorie)) continue;
      benutzt.add(t.kategorie);
      const markiert = l.de.slice(0, t.index) + "»" + t.wort + "«" + l.de.slice(t.index + t.wort.length);
      // مشتّتات ثابتة: الفئات الثلاث التالية دورياً — حتمي بلا عشوائية
      const k0 = ALLE_KAT.indexOf(t.kategorie);
      const optKats = [t.kategorie, ALLE_KAT[(k0 + 1) % 7], ALLE_KAT[(k0 + 3) % 7], ALLE_KAT[(k0 + 5) % 7]];
      const options = optKats.map((k) => `${KATEGORIE_AR[k].emoji} ${KATEGORIE_AR[k].name}`);
      // ترتيب حتمي: يدور حسب رقم السطر
      const rot = i % 4;
      const gedreht = [...options.slice(rot), ...options.slice(0, rot)];
      out.push({
        id: `${d.id}-sig${i}-${t.kategorie}`,
        type: "mc",
        promptDe: `${l.who}: ${markiert}`,
        promptAr: `ما وظيفة الكلمة بين »« في هذا السطر المسموع؟`,
        options: gedreht,
        answer: options[0],
        explanationAr: `«${t.wort}» = ${KATEGORIE_AR[t.kategorie].name}: ${KATEGORIE_AR[t.kategorie].hinweis}.`,
        explanationDe: l.de,
      });
      if (out.length >= max) return out;
    }
  }
  return out;
}

/** نصّ صادق لتغطية الرادار عبر البنك كلّه — يُعرَض لا يُخفى */
export function radarAbdeckung(alle: Dialogue[]): { dialoge: number; mitSignal: number; mitFalle: number; fallen: number } {
  let mitSignal = 0, mitFalle = 0, fallen = 0;
  for (const d of alle) {
    const r = signalRadar(d);
    if (r.anzahlSignale > 0) mitSignal++;
    if (r.fallen.length > 0) { mitFalle++; fallen += r.fallen.length; }
  }
  return { dialoge: alle.length, mitSignal, mitFalle, fallen };
}
