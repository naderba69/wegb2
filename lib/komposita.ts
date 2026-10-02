/**
 * ═══════════════════════════════════════════════════════════════════
 *  مفكِّك المركَّبات — KompositaZerleger
 * ═══════════════════════════════════════════════════════════════════
 *  لماذا وُجد: العربيةُ لا مركَّباتَ فيها. المتعلِّمُ العربيُّ يقفُ أمامَ
 *  «Arbeitslosengeldanspruch» بلا آليةِ تفكيك، فيحفظُها كتلةً عمياءَ أو يتجاهلُها.
 *  هذه مهارةُ فكِّ شفرةٍ تُدرَّب لا درسٌ يُحفَظ.
 *
 *  القاعدةُ الذهبيةُ التي يعلِّمُها كلُّ تفكيك:
 *    الكلمةُ الأخيرةُ (Grundwort) تعطي الجنسَ والمعنى الأساس؛
 *    ما قبلَها (Bestimmungswort) يُحدِّد ويُخصِّص.
 *    die Bewegung → die Klimabewegung   ·   der Kauf → der Testkauf
 *
 *  المنهج: بحثٌ جشعٌ من اليمين إلى اليسار في معجمِ البطاقاتِ نفسِها (3316)
 *  مع أحرفِ الوصلِ (Fugenelemente): -s- · -es- · -n- · -en- · -er- · -e- · -ens-
 *  وحذفِ الـe الختامية (Schule+Hof → Schulhof).
 *
 *  الصدق: ما لا يُوجَدُ مكوِّنُهُ في المعجمِ لا يُفكَّك — يُقالُ «لم أجد» لا يُخمَّن.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Level, VocabCard as Vokabel } from "./types";

export const FUGEN = ["", "s", "es", "n", "en", "er", "e", "ens"] as const;
export type Fuge = (typeof FUGEN)[number];

export interface Teil {
  /** الشكل كما ظهر في المركَّب (قد يختلف عن رأس المعجم) */
  form: string;
  /** رأسُ المعجم إن وُجد */
  lemma: string;
  /** حرفُ الوصل الذي تلاه (إن وُجد) */
  fuge: Fuge;
  article?: string;
  ar?: string;
  level?: Level;
  /** هل هذا هو Grundwort (الأخير) */
  grund: boolean;
}

export interface Zerlegung {
  wort: string;
  teile: Teil[];
  /** الجنسُ المشتقُّ من Grundwort — والقاعدةُ التي يُعلِّمُها التفكيك */
  artikelAusGrundwort?: string;
  /** أخطأ الجنسُ المخزَّنُ على البطاقة؟ (مفيد لكشف أخطاء البيانات) */
  artikelStimmt?: boolean;
  /** درجةُ الثقة: كلُّ المكوِّناتِ من المعجم = 1 */
  sicher: boolean;
}

/* ── المعجم ─────────────────────────────────────────────────────── */

export interface Lexikon {
  /** بالحروف الصغيرة ← البطاقة */
  map: Map<string, Vokabel>;
  minLen: number;
}

const ARTIKEL_PREFIX = /^(der|die|das)\s+/i;

/** يُنظِّفُ «die Klimabewegung» → «Klimabewegung»؛ ويتجاهلُ المدخلاتِ متعدِّدةَ الكلمات */
export function kopfwort(de: string): string | null {
  const s = de.trim().replace(ARTIKEL_PREFIX, "").trim();
  if (!s || /\s|[-/(),]/.test(s)) return null;
  return s;
}

export function baueLexikon(vokabeln: readonly Vokabel[]): Lexikon {
  const map = new Map<string, Vokabel>();
  for (const v of vokabeln) {
    const k = kopfwort(v.de);
    if (!k || k.length < 3) continue;
    const key = k.toLowerCase();
    // نفضِّلُ الأسماءَ (لها أداة) ونحتفظُ بأوَّلِ ظهورٍ للأفعال/الصفات
    const alt = map.get(key);
    if (!alt || (!alt.article && v.article)) map.set(key, v);
  }
  return { map, minLen: 3 };
}

/* ── التفكيك ────────────────────────────────────────────────────── */

const MIN_TEIL = 3;

/** يبحثُ عن رأسٍ معجميٍّ لجزءٍ محتمَل، مع تسامحٍ في الـe الختامية المحذوفة */
function sucheLemma(lex: Lexikon, teil: string): Vokabel | null {
  const k = teil.toLowerCase();
  const direkt = lex.map.get(k);
  if (direkt) return direkt;
  // Schul- ← Schule · Sprach- ← Sprache · Erd- ← Erde
  const mitE = lex.map.get(k + "e");
  if (mitE) return mitE;
  return null;
}

function toTeil(form: string, v: Vokabel | null, fuge: Fuge, grund: boolean): Teil {
  const lemma = v ? (kopfwort(v.de) ?? form) : form;
  return { form, lemma, fuge, article: v?.article, ar: v?.ar, level: v?.level, grund };
}

/**
 * تفكيكٌ تكراريٌّ من اليمين: نجرِّبُ أطولَ Grundwort موجودٍ في المعجم،
 * ثم نُعالجُ الباقي (الذي قد ينتهي بحرفِ وصل).
 * الحدُّ الأقصى 4 أجزاء — الألمانيةُ الواقعيةُ نادراً ما تتجاوزُها.
 */
export function zerlege(wort: string, lex: Lexikon, maxTeile = 4): Zerlegung {
  const w = kopfwort(wort) ?? wort.trim();
  const ganz = sucheLemma(lex, w);
  const fail = (): Zerlegung => ({ wort: w, teile: [toTeil(w, ganz, "", true)], artikelAusGrundwort: ganz?.article, sicher: false });

  const rek = (rest: string, tiefe: number): Teil[] | null => {
    if (tiefe > maxTeile) return null;
    // أطولُ جزءٍ أخيرٍ أوّلاً (Grundwort الأطول أصدقُ من الأقصر: «bewegung» لا «ung»)
    for (let len = rest.length - MIN_TEIL; len >= MIN_TEIL; len--) {
      const rechts = rest.slice(rest.length - len);
      const vR = sucheLemma(lex, rechts);
      if (!vR) continue;
      const linksRoh = rest.slice(0, rest.length - len);
      // الباقي قد يكون كلمةً كاملةً أو كلمةً + حرفَ وصل
      for (const f of FUGEN) {
        if (f && !linksRoh.endsWith(f)) continue;
        const links = f ? linksRoh.slice(0, -f.length) : linksRoh;
        if (links.length < MIN_TEIL) continue;
        const vL = sucheLemma(lex, links);
        if (vL) return [toTeil(links, vL, f, false), toTeil(rechts, vR, "", true)];
        const tiefer = rek(links, tiefe + 1);
        if (tiefer) {
          tiefer[tiefer.length - 1] = { ...tiefer[tiefer.length - 1], fuge: f, grund: false };
          return [...tiefer, toTeil(rechts, vR, "", true)];
        }
      }
    }
    return null;
  };

  const teile = rek(w, 1);
  if (!teile || teile.length < 2) return fail();
  const grund = teile[teile.length - 1];
  return {
    wort: w,
    teile,
    artikelAusGrundwort: grund.article,
    artikelStimmt: ganz?.article && grund.article ? ganz.article === grund.article : undefined,
    sicher: teile.every((t) => t.article !== undefined || t.ar !== undefined),
  };
}

/** صياغةٌ عربيةٌ للتفكيك — واحدةٌ لكلِّ الشاشات */
export function erklaereAr(z: Zerlegung): string {
  if (z.teile.length < 2) return `لم أجد مكوِّناتِ «${z.wort}» في معجمِ البطاقات — ليست كلُّ كلمةٍ طويلةٍ مركَّبة.`;
  const kette = z.teile.map((t) => (t.article ? `${t.article} ${t.lemma}` : t.lemma) + (t.fuge ? ` + ‹${t.fuge}›` : "")).join(" + ");
  const grund = z.teile[z.teile.length - 1];
  const best = z.teile.slice(0, -1).map((t) => t.lemma).join(" + ");
  return `${kette}. الجنسُ من الأخيرة (${grund.article ?? "؟"} ${grund.lemma})، والمعنى الأساس «${grund.ar ?? grund.lemma}» تُخصِّصُه «${best}».`;
}

/* ── التمرين: من معجمِ البطاقات ─────────────────────────────────── */

export interface KompositaAufgabe {
  id: string;
  wort: string;
  article: string;
  ar: string;
  level: Level;
  zerlegung: Zerlegung;
  /** خياراتُ الجنس مع المشتِّتَين */
  optionen: ["der", "die", "das"];
}

/** يختارُ من البطاقاتِ مركَّباتٍ تُفكَّكُ بثقةٍ تامّةٍ — لا سؤالَ عن كلمةٍ لا نعرفُ جوابَها */
export function baueAufgaben(vokabeln: readonly Vokabel[], lex: Lexikon, level: Level, n: number, seed: number): KompositaAufgabe[] {
  const ordnung: Level[] = ["A1", "A2", "B1", "B2"];
  const erlaubt = new Set(ordnung.slice(0, ordnung.indexOf(level) + 1));
  const kandidaten = vokabeln.filter((v) => v.article && erlaubt.has(v.level) && (kopfwort(v.de)?.length ?? 0) >= 8);
  // ترتيبٌ حتميٌّ بالبذرة
  let s = seed >>> 0 || 1;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const gemischt = [...kandidaten].sort(() => rnd() - 0.5);
  const out: KompositaAufgabe[] = [];
  for (const v of gemischt) {
    if (out.length >= n) break;
    const z = zerlege(v.de, lex);
    if (z.teile.length < 2 || !z.sicher || !z.artikelAusGrundwort) continue;
    // نستبعدُ ما يخالفُ فيه الجنسُ المخزَّنُ الجنسَ المشتقَّ — بياناتُه مشكوكٌ فيها
    if (z.artikelStimmt === false) continue;
    out.push({ id: `komp-${v.id}`, wort: z.wort, article: v.article!, ar: v.ar, level: v.level, zerlegung: z, optionen: ["der", "die", "das"] });
  }
  return out;
}
