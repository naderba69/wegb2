/**
 * ═══════════════════════════════════════════════════════════════════
 *  رادارُ القواعدِ في النصوص — GrammatikRadar
 * ═══════════════════════════════════════════════════════════════════
 *  يرصدُ الظواهرَ النحويّةَ الواردةَ في نصِّ القراءةِ فعلاً ويربطُها
 *  بموضوعِ القواعدِ المناظر (GrammarTopic) مع دليلٍ مقتبَس من النص.
 *
 *  الصدق: لا ادّعاءَ لقاعدةٍ غير موجودة — كلُّ موضوعٍ يظهرُ له شاهدٌ (beleg)
 *  حرفيٌّ استخرجه الرادارُ من سطورِ النص.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface GrammatikFund {
  topicId: string;
  nameDe: string;
  nameAr: string;
  beleg: string;
}

interface Regel {
  id: string;
  nameDe: string;
  nameAr: string;
  level: string;
  pattern: RegExp;
}

const REGELN: Regel[] = [
  // ── A1 / A2 ──
  { id: "a1-sein-haben", nameDe: "sein / haben", nameAr: "فعل الكينونة والتملك", level: "A1", pattern: /\b(ist|sind|war|waren|hat|haben|hatte|hatten)\b/i },
  { id: "a1-trennbar", nameDe: "Trennbare Verben", nameAr: "الأفعال المنفصلة", level: "A1", pattern: /\b(steht|stehe|ruft|rufe|fährt|fahre|kauft|kaufe|fängt|fange)\b\s+[^.!?]*\b(auf|an|ab|ein)\b/i },
  { id: "a2-perfekt", nameDe: "Perfekt", nameAr: "الماضي التام (Perfekt)", level: "A2", pattern: /\b(hat|haben|habe|hast|ist|sind|bin|bist)\b\s+[^.!?]*\bge\w+(t|en)\b/i },
  { id: "a2-modal", nameDe: "Modalverben", nameAr: "الأفعال المساعدة", level: "A2", pattern: /\b(muss|müssen|kann|können|darf|dürfen|soll|sollen|will|wollen)\b\s+[^.!?]*\b\w+en\b/i },
  { id: "a2-weil-dass", nameDe: "weil / dass", nameAr: "الروابط التابعة (weil / dass)", level: "A2", pattern: /\b(weil|dass)\b/i },
  { id: "a2-wechsel", nameDe: "Wechselpräpositionen", nameAr: "حروف الجر المزدوجة", level: "A2", pattern: /\b(in|an|auf|neben|unter|über|vor|hinter|zwischen)\s+(dem|den|der|das|die|einem|einen|einer)\b/i },

  // ── B1 ──
  { id: "b1-konj2", nameDe: "Konjunktiv II", nameAr: "صيغة التمني والافتراض (Konjunktiv II)", level: "B1", pattern: /\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten|müsste|müssten|sollte|sollten)\b/i },
  { id: "b1-relativ", nameDe: "Relativsätze", nameAr: "جمل الوصل (Relativsätze)", level: "B1", pattern: /,\s*(der|die|das|dem|den|dessen|deren|denen|welche|welcher|welches)\b/i },
  { id: "b1-konnektoren", nameDe: "Konnektoren", nameAr: "روابط الجمل المتقدمة (obwohl, da, während...)", level: "B1", pattern: /\b(obwohl|da|während|sodass|so\s+dass|damit|bevor|nachdem|trotzdem|deshalb|weil|dass|wenn)\b/i },
  { id: "b1-plusquamperfekt", nameDe: "Plusquamperfekt", nameAr: "الماضي التام الأسبق (Plusquamperfekt)", level: "B1", pattern: /\b(hatte|hatten|war|waren)\b\s+[^.!?]*\bge\w+(t|en)\b/i },
  { id: "b1-genitiv", nameDe: "Genitivpräpositionen", nameAr: "حروف جر المضاف إليه (wegen, trotz...)", level: "B1", pattern: /\b(wegen|trotz|während|aufgrund|mittels|hinsichtlich)\s+(des|der)\b/i },
  { id: "b1-passiv", nameDe: "Passiv", nameAr: "المبني للمجهول (Passiv)", level: "B1", pattern: /\b(wird|werden|wurde|wurden|worden)\b\s+[^.!?]*\b(ge\w+(t|en)|\w+iert)\b/i },
  { id: "b1-verb-praeposition", nameDe: "Verben mit Präpositionen", nameAr: "أفعال بحروف جر ثابتة", level: "B1", pattern: /\b(freuen\s+(auf|über)|warten\s+auf|denken\s+an|sprechen\s+(über|mit)|gehören\s+zu|teilnehmen\s+an|beschäftigen\s+mit|bitten\s+um|hoffen\s+auf|kümmern\s+um|handeln\s+von|führen\s+zu|beitragen\s+zu|beruhen\s+auf|sorgen\s+für)\b/i },

  // ── B2 ──
  { id: "b2-infinitiv", nameDe: "Infinitiv mit zu", nameAr: "تراكيب المصدر مع zu (um/ohne/anstatt zu)", level: "B2", pattern: /\b(um|ohne|anstatt)\s+[^.!?]*\bzu\s+\w+en\b/i },
  { id: "b2-doppelkonnektoren", nameDe: "Doppelkonnektoren", nameAr: "الروابط المزدوجة (sowohl als auch, weder noch...)", level: "B2", pattern: /\b(sowohl\s+[^.!?]*als\s+auch|weder\s+[^.!?]*noch|nicht\s+nur\s+[^.!?]*sondern\s+auch|je\s+[^.!?]*desto|einerseits\s+[^.!?]*andererseits)\b/i },
  { id: "b2-modalpartikel", nameDe: "Modalpartikeln", nameAr: "جسيمات المعنى الكلامية (ja, doch, wohl...)", level: "B2", pattern: /\b(ja|doch|wohl|eben|halt)\b/i },
  { id: "b2-funktionsverben", nameDe: "Funktionsverbgefüge", nameAr: "تراكيب الأفعال الوظيفية الرسمية", level: "B2", pattern: /\b(zur\s+Verfügung|in\s+Kauf|in\s+Frage|Rolle\s+spiel|Entscheidung\s+treff|Kritik\s+üb|Maßnahmen\s+ergreif|Abschied\s+nehm|Eindruck\s+mach|Antrag\s+stell)\b/i },
  { id: "b2-partizip", nameDe: "Partizipialattribute", nameAr: "النعت باسم الفاعل والمفعول", level: "B2", pattern: /\b(der|die|das|den|dem|des)\s+[a-zäöüß]+(ende|enden|ender|endes)\s+[A-ZÄÖÜ]/i },
  { id: "b2-nominalstil", nameDe: "Nominalstil", nameAr: "الأسلوب الاسمي الرسمي", level: "B2", pattern: /\b[a-zäöüß]+(ung|keit|heit|schaft|tion)\s+(des|der)\b/i },
  { id: "b2-bedingung", nameDe: "Konditionalsätze", nameAr: "الجمل الشرطية المتقدمة (falls / sofern)", level: "B2", pattern: /\b(falls|sofern|unter\s+der\s+Bedingung)\b/i },
  { id: "b2-indirekte-rede", nameDe: "Indirekte Rede", nameAr: "الكلام المنقول (Konjunktiv I)", level: "B2", pattern: /\b(betonte|erklärte|meinte|berichtete|fragte),\s+(ob|dass|wie|wer)\b|\b(sei|seien|habe|hätten|wolle|könne)\b/i },
];

/**
 * يرصدُ موضوعاتِ القواعدِ في النص ويُعيدُ قائمةً بالظواهرِ المرصودةِ مع شواهدِها
 */
export function grammatikImText(textDe: string, maxErgebnisse = 4): GrammatikFund[] {
  const funde: GrammatikFund[] = [];
  const gesehen = new Set<string>();

  for (const r of REGELN) {
    const m = textDe.match(r.pattern);
    if (m && !gesehen.has(r.id)) {
      gesehen.add(r.id);
      funde.push({
        topicId: r.id,
        nameDe: r.nameDe,
        nameAr: r.nameAr,
        beleg: m[0].trim(),
      });
      if (funde.length >= maxErgebnisse) break;
    }
  }

  return funde;
}
