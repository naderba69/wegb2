// ✍️ كاشفُ الكتابة ثلاثيُّ الأعمدة — [قواعد] · [ترتيبُ الجملة] · [اختيارُ المفردة]
// صدقُ الادّعاء: هذا **كاشفُ أنماطٍ** يرى الشكلَ ولا يرى المعنى. كلُّ قاعدةٍ هنا مكتوبةٌ صراحةً،
// ولا يوجدُ نموذجٌ لغويٌّ ولا اتصالٌ بالشبكة.
import { vocabMap } from "./content";
import fehlerBank from "@/content/fehler.json";

export type Spalte = "grammatik" | "syntax" | "wortwahl";
export type Schwere = "sicher" | "wahrscheinlich" | "stil";

export type Befund = {
  spalte: Spalte;
  schwere: Schwere;
  stelle: string;        // المقطعُ المرصود
  meldungAr: string;     // ما الخطأ
  vorschlagDe?: string;  // البديلُ الجاهز
  regelId?: string;      // درسُ القاعدةِ للعلاج
};

export const SPALTE_AR: Record<Spalte, string> = {
  grammatik: "أخطاء القواعد", syntax: "ترتيب الجملة", wortwahl: "اختيار المفردة",
};
export const SCHWERE_AR: Record<Schwere, string> = {
  sicher: "🔴 مؤكَّد", wahrscheinlich: "🟡 تحقَّقْ", stil: "🔵 أسلوب",
};

/* ═══ جداولُ القاعدة — كلُّها صريحةٌ قابلةٌ للمراجعة ═══ */
const AKK_PRAEP = ["für", "ohne", "gegen", "durch", "um"];
const DAT_PRAEP = ["mit", "bei", "seit", "von", "zu", "aus", "nach", "gegenüber"];
const DAT_ART = ["dem", "der", "den"];   // der = مؤنّثٌ داتيف
const AKK_ART = ["den", "das", "die", "einen"];
const NEBEN_KONJ = ["weil", "dass", "wenn", "obwohl", "damit", "während", "seitdem", "bevor", "nachdem", "sobald", "falls", "ob"];
const POSITION_ANFANG = ["morgen", "heute", "gestern", "jetzt", "dann", "danach", "später", "manchmal", "oft", "immer", "vielleicht", "leider", "deshalb", "trotzdem", "zuerst"];
const PRONOMEN = ["ich", "du", "er", "sie", "es", "wir", "ihr", "man"];
const TRENNBAR = ["auf", "an", "aus", "ein", "mit", "vor", "zu", "ab", "nach", "zurück", "weiter", "los", "her", "hin"];

/** مصفوفةُ المرادفات: الكلمةُ المبتذلة ← ثلاثةُ بدائلَ راقية. */
export const SYNONYM_MATRIX: Record<string, { ersatz: string[]; hinweisAr: string }> = {
  gut: { ersatz: ["ausgezeichnet", "hervorragend", "vorteilhaft"], hinweisAr: "«gut» تُخفِّضُ درجةَ المفرداتِ في شبكةِ التقييم" },
  schön: { ersatz: ["ansprechend", "beeindruckend", "reizvoll"], hinweisAr: "استبدلْها بصفةٍ دقيقةٍ تصفُ ما رأيتَ فعلاً" },
  machen: { ersatz: ["durchführen", "erledigen", "verursachen"], hinweisAr: "«machen» فعلٌ عامّ — اختَرِ الفعلَ الدقيق" },
  Sachen: { ersatz: ["Gegenstände", "Angelegenheiten", "Aspekte"], hinweisAr: "«Sachen» عاميّةٌ في نصٍّ امتحانيّ" },
  Dinge: { ersatz: ["Aspekte", "Faktoren", "Gesichtspunkte"], hinweisAr: "ارفعْها إلى مفردةٍ أكاديمية" },
  sehr: { ersatz: ["äußerst", "überaus", "ausgesprochen"], hinweisAr: "«sehr» مكرَّرةٌ في كلِّ نصّ — نوِّعْ مُشدِّدَك" },
  toll: { ersatz: ["bemerkenswert", "überzeugend", "gelungen"], hinweisAr: "«toll» عاميّةٌ لا تُكتَبُ في امتحان" },
  bekommen: { ersatz: ["erhalten", "beziehen", "erlangen"], hinweisAr: "«erhalten» أرقى في الرسائلِ الرسمية" },
  kriegen: { ersatz: ["erhalten", "bekommen", "beziehen"], hinweisAr: "«kriegen» عاميّةٌ صِرفة" },
};

/* خريطةُ الأجناسِ من دفترِ المفردات — 3316 بطاقةً تصنعُ المسطرة. */
const GENUS: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const deck of Object.values(vocabMap as unknown as Record<string, { cards: { de: string; article?: string }[] }>)) {
    for (const c of deck.cards) {
      if (!c.article) continue;
      const nomen = c.de.split(" ").slice(1).join(" ");
      if (nomen && !nomen.includes(" ")) m[nomen.toLowerCase()] = c.article;
    }
  }
  return m;
})();

const FEHLER = fehlerBank as { id: string; kat: string; falsch: string; richtig: string; ar: string }[];
const woerter = (s: string) => s.split(/\s+/).filter(Boolean);
const rein = (w: string) => w.replace(/[.,;:!?»«"()]/g, "");

/** الفحصُ الكامل — يرجعُ قائمةَ المرصودِ مصنَّفةً في الأعمدةِ الثلاثة. */
export function pruefeText(text: string): Befund[] {
  const b: Befund[] = [];
  const saetze = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());

  // ① أخطاءُ العربِ المعروفة — 128 نمطاً من البنك
  for (const f of FEHLER) {
    if (f.falsch.length > 6 && text.toLowerCase().includes(f.falsch.toLowerCase())) {
      b.push({ spalte: f.kat === "wortstellung" ? "syntax" : f.kat === "wortschatz" || f.kat === "falsche-freunde" ? "wortwahl" : "grammatik",
        schwere: "sicher", stelle: f.falsch, meldungAr: f.ar, vorschlagDe: f.richtig.split(" — ")[0] });
    }
  }

  for (const satz of saetze) {
    const w = woerter(satz);
    const klein = w.map((x) => rein(x).toLowerCase());

    // ② الأداةُ تخالفُ جنسَ الاسمِ في الدفتر
    for (let i = 0; i < w.length - 1; i++) {
      const art = klein[i], nomen = rein(w[i + 1]);
      if (["der", "die", "das"].includes(art) && GENUS[nomen.toLowerCase()]) {
        const richtig = GENUS[nomen.toLowerCase()];
        if (richtig !== art && /^[A-ZÄÖÜ]/.test(nomen)) {
          b.push({ spalte: "grammatik", schwere: "sicher", stelle: `${w[i]} ${nomen}`,
            meldungAr: `جنسُ «${nomen}» في دفترِك هو ${richtig}`, vorschlagDe: `${richtig} ${nomen}`, regelId: "a1-akkusativ" });
        }
      }
    }

    // ③ حرفُ الجرِّ يفرضُ حالةً واحدة
    for (let i = 0; i < w.length - 1; i++) {
      const p = klein[i], a = klein[i + 1];
      if (AKK_PRAEP.includes(p) && ["dem", "einem"].includes(a)) {
        b.push({ spalte: "grammatik", schwere: "sicher", stelle: `${p} ${a}`,
          meldungAr: `«${p}» تفرضُ الأكوزاتيف لا الداتيف`, vorschlagDe: `${p} ${a === "dem" ? "den" : "einen"}`, regelId: "a1-akkusativ" });
      }
      if (DAT_PRAEP.includes(p) && ["den", "einen"].includes(a) && !/(en|n)$/.test(rein(w[i + 2] ?? ""))) {
        b.push({ spalte: "grammatik", schwere: "wahrscheinlich", stelle: `${p} ${a}`,
          meldungAr: `«${p}» تفرضُ الداتيف (إلّا أن يكونَ الاسمُ جمعاً)`, vorschlagDe: `${p} ${a === "den" ? "dem" : "einem"}`, regelId: "a2-dativ" });
      }
    }

    // ④ الفعلُ يجبُ أن يكونَ ثانياً: «Morgen ich gehe» — في أوّلِ الجملةِ أو بعدَ فاصلة
    for (let i = 0; i < w.length - 2; i++) {
      const anfang = i === 0 || /[,;]$/.test(w[i - 1] ?? "");
      if (anfang && POSITION_ANFANG.includes(klein[i]) && PRONOMEN.includes(klein[i + 1])) {
        b.push({ spalte: "syntax", schwere: "sicher", stelle: `${w[i]} ${w[i + 1]} ${w[i + 2]}`,
          meldungAr: "الفعلُ المصرَّفُ يجبُ أن يكونَ في الموضعِ الثاني حينَ تبدأُ بظرف",
          vorschlagDe: `${w[i]} ${rein(w[i + 2])} ${rein(w[i + 1])} …`, regelId: "a1-praesens" });
      }
    }

    // ④ج أسئلة W-: أداة الاستفهام في البداية ثم الفعل المصرّف (Wann gehst du؟ لا Wann du gehst؟)
    const W_FRAGE = ["wo","wann","warum","wer","wie","was","wohin","woher","welche","welcher","welches","wem","wen","wessen"];
    if (w.length >= 3 && W_FRAGE.includes(klein[0])) {
      // الموضع الثاني يجب أن يكون فعلاً مصروفاً (ليس ضميراً)
      if (PRONOMEN.includes(klein[1])) {
        b.push({ spalte: "syntax", schwere: "sicher", stelle: `${w[0]} ${w[1]} ${w[2]}`,
          meldungAr: "في أسئلة W- يأتي الفعل المصرَّف ثانياً بعد أداة السؤال، لا الضمير",
          vorschlagDe: `${w[0]} ${rein(w[2])} ${rein(w[1])} …?`, regelId: "a1-praesens" });
      }
    }
    // ④د أسئلة نعم/لا (بدون W-): الفعل في البداية «Gehst du؟» — راقب «Du gehst؟» المبتدئ بضمير متبوع بظرف
    if (satz.trim().endsWith("?") && !W_FRAGE.includes(klein[0]) && PRONOMEN.includes(klein[0]) && w.length >= 2) {
      // ابحث عن فعل مصرَّف في موضع ليس الأول (نمط «Du gehst؟» جائز في العامية فقط)
      const finites = /^(gehst|gehst|bist|hast|habe|kannst|willst|machst|kommst|sagst|heißt|ist|sind|haben|kann|muss|soll)/i;
      if (finites.test(klein[1] ?? "")) {
        b.push({ spalte: "syntax", schwere: "wahrscheinlich", stelle: `${w[0]} ${w[1]} …`,
          meldungAr: "سؤال نعم/لا يبدأ بالفعل لا بالفاعل (رسمياً): «Gehst du؟» بدل «Du gehst؟»",
          vorschlagDe: `${rein(w[1])} ${rein(w[0])} …?`, regelId: "a1-praesens" });
      }
    }

    // ④ب اسمُ المفعولِ في الماضي المركَّبِ يذهبُ إلى آخرِ الجملة: «Ich habe gesehen die Frau»
    const hilfIdx = klein.findIndex((x) => /^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)$/.test(x));
    if (hilfIdx >= 0) {
      const pIdx = klein.findIndex((x, j) => j > hilfIdx && /^(ge\w{2,}(t|en)|\w{3,}(iert))$/.test(x));
      if (pIdx > 0 && pIdx < w.length - 2) {
        b.push({ spalte: "syntax", schwere: "sicher", stelle: `${w[pIdx]} ${w[pIdx + 1]} …`,
          meldungAr: "اسمُ المفعولِ (Partizip II) مكانُهُ آخرُ الجملةِ لا وسطُها",
          vorschlagDe: `… ${w.slice(pIdx + 1).map(rein).join(" ")} ${rein(w[pIdx])}`, regelId: "a2-perfekt" });
      }
    }

    // ⑤ الجملةُ التابعة: الفعلُ إلى الآخر
    for (const k of NEBEN_KONJ) {
      const idx = klein.indexOf(k);
      if (idx >= 0 && idx < w.length - 2) {
        const rest = w.slice(idx + 1);
        const letzte = rein(rest[rest.length - 1]).toLowerCase();
        const finitesMuster = /^(ist|sind|war|waren|habe|hat|haben|hatte|kann|muss|will|soll|darf|mag|werde|wird|bin|bist)$/;
        const hatFinitesFrueh = rest.slice(0, -1).some((x) => finitesMuster.test(rein(x).toLowerCase()));
        if (hatFinitesFrueh && !finitesMuster.test(letzte)) {
          b.push({ spalte: "syntax", schwere: "wahrscheinlich", stelle: rest.slice(0, 4).join(" "),
            meldungAr: `بعدَ «${k}» يذهبُ الفعلُ المصرَّفُ إلى آخرِ الجملة`, regelId: "a2-weil-dass" });
        }
      }
      // ⑥ الفاصلةُ قبلَ أداةِ الربط
      const pos = satz.toLowerCase().indexOf(` ${k} `);
      if (pos > 0 && satz[pos - 1] !== ",") {
        b.push({ spalte: "syntax", schwere: "wahrscheinlich", stelle: `… ${k} …`,
          meldungAr: `الألمانيةُ تضعُ فاصلةً قبلَ «${k}»`, vorschlagDe: `, ${k}`, regelId: "a2-weil-dass" });
      }
    }

    // ⑦ البادئةُ المنفصلةُ بقيت ملتصقة: «Ich aufstehe»
    for (let i = 0; i < w.length; i++) {
      const x = rein(w[i]).toLowerCase();
      const pre = TRENNBAR.find((p) => x.startsWith(p) && x.length > p.length + 3);
      if (pre && /^(ich|du|er|sie|es|wir)$/.test(klein[i - 1] ?? "") && /(e|st|t|en)$/.test(x)) {
        b.push({ spalte: "syntax", schwere: "wahrscheinlich", stelle: w[i],
          meldungAr: `البادئةُ «${pre}» تنفصلُ وتذهبُ إلى آخرِ الجملة`,
          vorschlagDe: `${x.slice(pre.length)} … ${pre}`, regelId: "a1-trennbar" });
      }
    }

    // ⑧ جملةٌ أطولُ من ثلاثينَ كلمة
    if (w.length > 30) {
      b.push({ spalte: "syntax", schwere: "stil", stelle: `${w.slice(0, 5).join(" ")} …`,
        meldungAr: `جملةٌ من ${w.length} كلمةً — اقسِمْها جملتَين ليتضحَ ترتيبُك` });
    }
  }

  // ⑨ مصفوفةُ المرادفات
  const zaehler: Record<string, number> = {};
  for (const x of woerter(text)) {
    const k = rein(x);
    if (SYNONYM_MATRIX[k]) zaehler[k] = (zaehler[k] ?? 0) + 1;
  }
  for (const [wort, n] of Object.entries(zaehler)) {
    const m = SYNONYM_MATRIX[wort];
    b.push({ spalte: "wortwahl", schwere: "stil", stelle: `${wort}${n > 1 ? ` (×${n})` : ""}`,
      meldungAr: `${m.hinweisAr} — بدائل: ${m.ersatz.join(" · ")}`, vorschlagDe: m.ersatz[0] });
  }

  return b;
}

/** بنيةُ الرسالةِ الامتحانية: تحيةٌ وختامٌ وطولٌ كافٍ. */
export function pruefeBrief(text: string, minWoerter: number): Befund[] {
  const b: Befund[] = [];
  const n = woerter(text).length;
  if (n < minWoerter) {
    b.push({ spalte: "syntax", schwere: "sicher", stelle: `${n} كلمة`,
      meldungAr: `النصُّ دونَ الحدِّ المطلوب (${minWoerter}) — الناقصُ يُخصَمُ مباشرةً` });
  }
  if (!/(Sehr geehrte|Liebe|Hallo|Guten Tag)/i.test(text)) {
    b.push({ spalte: "syntax", schwere: "sicher", stelle: "التحية", meldungAr: "لا تحيةَ في مطلعِ الرسالة", vorschlagDe: "Sehr geehrte Damen und Herren," });
  }
  if (!/(Mit freundlichen Grüßen|Viele Grüße|Liebe Grüße|Herzliche Grüße)/i.test(text)) {
    b.push({ spalte: "syntax", schwere: "sicher", stelle: "الختام", meldungAr: "لا عبارةَ ختامٍ في نهايةِ الرسالة", vorschlagDe: "Mit freundlichen Grüßen" });
  }
  const konnektoren = ["weil", "deshalb", "außerdem", "trotzdem", "zuerst", "danach", "jedoch", "einerseits"];
  if (!konnektoren.some((k) => new RegExp(`\\b${k}\\b`, "i").test(text))) {
    b.push({ spalte: "syntax", schwere: "stil", stelle: "الروابط", meldungAr: "بلا روابطَ حِجاجية — أضِفْ weil / außerdem / deshalb" });
  }
  return b;
}

/** عتبة التنزيل التلقائي: 3 اعتراضات صادقة على القاعدة تخفّض حدّتها (R33) */
export const DISPUT_SCHWELLE = 3;

/** الحدّة الفعلية بعد اعتراضات المتعلم: sicher→wahrscheinlich→stil (بلا regelId لا تنزيل). */
export function effektiveSchwere(b: Befund, disputes?: Record<string, number>): Schwere {
  const key = b.regelId ?? "";
  const n = key ? (disputes?.[key] ?? 0) : 0;
  if (b.schwere === "sicher") return n >= DISPUT_SCHWELLE * 2 ? "stil" : n >= DISPUT_SCHWELLE ? "wahrscheinlich" : "sicher";
  if (b.schwere === "wahrscheinlich") return n >= DISPUT_SCHWELLE ? "stil" : "wahrscheinlich";
  return "stil";
}

/** درجةٌ من مئة: كلُّ مؤكَّدٍ −8 · مرجَّحٍ −4 · أسلوبيٍّ −1 (بحدٍّ أدنى صفر) — بالحدّة الفعلية بعد الاعتراضات. */
export function bewerteSchreiben(befunde: Befund[], disputes?: Record<string, number>): number {
  const abzug = befunde.reduce((s, f) => {
    const e = effektiveSchwere(f, disputes);
    return s + (e === "sicher" ? 8 : e === "wahrscheinlich" ? 4 : 1);
  }, 0);
  return Math.max(0, 100 - abzug);
}

/** ثلاثةُ تمارينَ علاجيةٍ تُولَّدُ من الخطأِ نفسِه — لا نصيحةٌ عامّة. */
export function heilUebungen(f: Befund): string[] {
  const s = f.vorschlagDe ? `الصواب: ${f.vorschlagDe}` : "";
  return [
    `أعِدْ كتابةَ الجملةِ التي فيها «${f.stelle}» صحيحةً. ${s}`,
    `اكتبْ جملتَينِ جديدتَينِ على النمطِ نفسِه بلا الخطأ.`,
    `ابحثْ في نصِّك عن كلِّ موضعٍ مشابهٍ وصحِّحْهُ قبلَ التسليمِ القادم.`,
  ];
}
