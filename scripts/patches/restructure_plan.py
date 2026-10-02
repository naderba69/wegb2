"""Restrukturierungspatch 2: plant.ts — neue Phasen, neue MODULE-Aufteilung."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLAN = ROOT / "lib" / "plan.ts"
text = PLAN.read_text(encoding="utf-8")

# Phase ranges einfügen
old_ranges = """const PHASE_RANGES: { phase: Phase; from: number; to: number; level: Level }[] = [
  { phase: \"A1\", from: PHASEN.A1.von, to: PHASEN.A1.bis, level: \"A1\" },
  { phase: \"A2\", from: PHASEN.A2.von, to: PHASEN.A2.bis, level: \"A2\" },
  { phase: \"B1\", from: PHASEN.B1.von, to: PHASEN.B1.bis, level: \"B1\" },
  { phase: \"B2\", from: PHASEN.B2.von, to: PHASEN.B2.bis, level: \"B2\" },
  { phase: \"Abschluss\", from: ABSCHLUSS_VON, to: TOTAL_DAYS, level: \"B2\" },
];"""
new_ranges = """const PHASE_RANGES: { phase: Phase; from: number; to: number; level: Level }[] = [
  { phase: \"A0\", from: PHASEN.A0.von, to: PHASEN.A0.bis, level: \"A0\" },
  { phase: \"A1\", from: PHASEN.A1.von, to: PHASEN.A1.bis, level: \"A1\" },
  { phase: \"A2\", from: PHASEN.A2.von, to: PHASEN.A2.bis, level: \"A2\" },
  { phase: \"B1\", from: PHASEN.B1.von, to: PHASEN.B1.bis, level: \"B1\" },
  { phase: \"B2\", from: PHASEN.B2.von, to: PHASEN.B2.bis, level: \"B2\" },
  { phase: \"Abschluss\", from: ABSCHLUSS_VON, to: TOTAL_DAYS, level: \"B2\" },
];"""
assert old_ranges in text, "PHASE_RANGES nicht gefunden"
text = text.replace(old_ranges, new_ranges)

# PHASE_TOPICS
old_topics = """const PHASE_TOPICS: Record<Phase, string[]> = {
  A1: [\"a1-sein-haben\", \"a1-war-hatte\", \"a1-pronomen\", \"a1-praesens\", \"a1-trennbar\", \"a1-zahlen\", \"a1-akkusativ\"],
  A2: [\"a2-perfekt\", \"a2-praeteritum\", \"a2-negation\", \"a2-imperativ\", \"a2-weil-dass\", \"a2-dativ\", \"a2-modal\", \"a2-wechsel\", \"a2-reflexiv\", \"a2-steigerung\", \"a2-futur\"],
  B1: [\"b1-konj2\", \"b1-relativ\", \"b1-konnektoren\", \"b1-plusquamperfekt\", \"b1-genitiv\", \"b1-adjektivendungen\", \"b1-wortbildung\", \"b1-unbestimmte\", \"b1-verb-praeposition\", \"b1-passiv\"],
  B2: [\"b2-indirekte-rede\", \"b2-funktionsverben\", \"b2-partizip\", \"b2-infinitiv\", \"b2-bedingung\", \"b2-doppelkonnektoren\", \"b2-relativ-generalisierend\", \"b2-modalpartikel\", \"b2-futur-ii\", \"b2-nominalstil\"],
  Abschluss: [],
};"""
new_topics = """const PHASE_TOPICS: Record<Phase, string[]> = {
  A0: [\"a0-begrussung\", \"a1-pronomen\", \"a1-sein-haben\", \"a1-praesens\", \"a1-zahlen\"],
  A1: [\"a1-praesens\", \"a1-pronomen\", \"a1-sein-haben\", \"a1-trennbar\", \"a1-zahlen\", \"a1-akkusativ\", \"a1-modalverben\", \"a1-dativ\", \"a1-wechsel\", \"a1-imperativ\", \"a1-perfekt-einf\", \"a1-futur-einf\"],
  A2: [\"a2-praeteritum-grund\", \"a2-perfekt\", \"a2-dativ\", \"a2-wechsel\", \"a2-weil-dass\", \"a2-reflexiv\", \"a2-negation\", \"a2-steigerung\", \"a2-modal\", \"a2-imperativ\", \"a2-futur\"],
  B1: [\"b1-konj2\", \"b1-passiv\", \"b1-genitiv\", \"b1-relativ\", \"b1-adjektivendungen\", \"b1-konnektoren\", \"b1-plusquamperfekt\", \"b1-wortbildung\", \"b1-verb-praeposition\", \"b1-partizip1\", \"b1-indirekte-fragen\", \"b1-unbestimmte\", \"b1-funktionsverben\"],
  B2: [\"b2-indirekte-rede\", \"b2-bedingung\", \"b2-funktionsverben\", \"b2-partizip\", \"b2-infinitiv\", \"b2-doppelkonnektoren\", \"b2-modalpartikel\", \"b2-futur-ii\", \"b2-relativ-generalisierend\", \"b2-nominalstil\", \"b2-verschmolzene\", \"b2-redew\"],
  Abschluss: [],
};"""
assert old_topics in text, "PHASE_TOPICS nicht gefunden"
text = text.replace(old_topics, new_topics)

# PHASE_DECKS
old_decks = """const PHASE_DECKS: Record<Phase, string[]> = {
  A1: [\"a1-start\", \"a1-familie-alltag\", \"a1-essen-trinken\", \"a1-koerper-kleidung\", \"a1-stadt-wege\", \"a1-zeit-zahlen\", \"a1-haus-schule\", \"a1-natur-freizeit\", \"a1-welt-beruf\", \"a1-modal-ort\", \"a1-menschen-abschluss\"],
"""
new_decks = """const PHASE_DECKS: Record<Phase, string[]> = {
  A0: [\"a1-start\"],
  A1: [\"a1-start\", \"a1-familie-alltag\", \"a1-zeit-zahlen\", \"a1-essen-trinken\", \"a1-koerper-kleidung\", \"a1-stadt-wege\", \"a1-haus-schule\", \"a1-natur-freizeit\", \"a1-welt-beruf\", \"a1-modal-ort\", \"a1-menschen-abschluss\"],
"""
assert old_decks in text, "PHASE_DECKS nicht gefunden"
text = text.replace(old_decks, new_decks)

# Kommentarzeile mit Zahlen
text = text.replace(
    "* 270 يوماً بتوزيعٍ أكاديمي (lib/phasen.ts): A1 (1-42) · A2 (43-91) · B1 (92-168) · B2 (169-266) · ختام (267-270)",
    "* 378 يوماً بتوزيعٍ أكاديمي (lib/phasen.ts): A0 (1-10) · A1 (11-94) · A2 (95-178) · B1 (179-276) · B2 (277-374) · ختام (375-378)",
)
text = text.replace(
    "* (القرعةُ القديمةُ تركت 20 نصاً و20 حواراً بلا موعدٍ في 270 يوماً)",
    "* (القرعةُ القديمةُ تركت نصوصاً وحوارات كثيرة بلا موعدٍ في الخطة الأصلية)",
)

# MODULE-Aufteilung neu schreiben — zwischen dem Kommentar und modulOf
old_mod_start = "export const MODULE: Modul[] = ["
old_mod_end = "];"
i = text.index(old_mod_start)
j = text.index(old_mod_end, i)
new_modules = """export const MODULE: Modul[] = [
  // ── A0: 10 Tage ──
  { nr: 1, level: \"A0\", von: 1,  bis: 10,  titelDe: \"Einstieg & Alphabet\",       titelAr: \"الأبجدية والأصوات\",    inhalteAr: \"الأبجدية · ä/ö/ü/ß · الأصوات · التحيات · الضمائر · sein · الأرقام حتى 100 · أدوات التعريف\" },
  // ── A1: 12 Wochen / 84 Tage ──
  { nr: 1, level: \"A1\", von: 11, bis: 31,  titelDe: \"Lektion 1–2: Begrüßung & Zahlen\",  titelAr: \"التعارف والأرقام\",      inhalteAr: "التحيات · sein/haben · تصريف منتظم · ضمائر · أرقام 0-100 · Ja/nein/W-Fragen\" },
  { nr: 2, level: \"A1\", von: 32, bis: 52,  titelDe: \"Lektion 3–4: Familie & Gegenstände\", titelAr: \"العائلة والأشياء\",      inhalteAr: \"العائلة · أدوات الملكية · أفعال شاذة · der/die/das/kein · ألوان · صفات\" },
  { nr: 3, level: \"A1\", von: 53, bis: 73,  titelDe: \"Lektion 5–6: Zeit & Essen\",        titelAr: \"الوقت والطعام\",        inhalteAr: \"الساعة · أفعال منفصلة · جر الوقت · المأكولات · Akkusativ · möchten\" },
  { nr: 4, level: \"A1\", von: 74, bis: 94,  titelDe: \"Lektion 7–8: Hobbys & Wohnen\",     titelAr: \"الهوايات والسكن\",      inhalteAr: "الهوايات · können · الطقس · الشقة · Dativ أساسي · Wechselpräpositionen · Modalverben · مقدمة Perfekt/Futur · Imperativ\" },
  // ── A2: 12 Wochen / 84 Tage ──
  { nr: 1, level: \"A2\", von: 95,  bis: 115, titelDe: \"Lektion 9–10: Vergangenheit & Orientierung\", titelAr: \"الماضي والتوجّه\",  inhalteAr: "Perfekt كامل · Präteritum للناقصة · Dativ كامل · وصف الطريق · المواصلات\" },
  { nr: 2, level: \"A2\", von: 116, bis: 136, titelDe: \"Lektion 11–12: Gesundheit & Kleidung\", titelAr: \"الصحة والملابس\",       inhalteAr: "الطبيب · أفعال انعكاسية · تبديل الجر · صيغة الأمر (تثبيت) · المقارنة · الملابس والألوان\" },
  { nr: 3, level: \"A2\", von: 137, bis: 157, titelDe: \"Lektion 13–14: Reisen & Briefe\", titelAr: "السفر والمراسلات",         inhalteAr: "السفر والفنادق · Präteritum · الجمل التابعة weil/dass/wenn/als · الرسائل والدعوات · الروابط البسيطة\" },
  { nr: 4, level: \"A2\", von: 158, bis: 178, titelDe: \"Lektion 15–16: Gefühle & Beruf\", titelAr: "المشاعر والعمل",         inhalteAr: "الأفعال الانعكاسية · deshalb/trotzdem · العمل المكتبي · الهوايات · مقدمة Passiv · مقدمة Genitiv · مراجعة\" },
  // ── B1: 14 Wochen / 98 Tage ──
  { nr: 1, level: \"B1\", von: 179, bis: 203, titelDe: \"Lektion 17–18: Beziehungen & Ausbildung\", titelAr: "العلاقات والتعليم",  inhalteAr: "الصداقات والنزاعات · Relativsätze · obwohl/trotzdem · السيرة الذاتية · Präteritum كامل · تصريف الصفات\" },
  { nr: 2, level: \"B1\", von: 204, bis: 228, titelDe: \"Lektion 19–20: Bewerbung & Umwelt\", titelAr: "البحث عن عمل والبيئة",   inhalteAr: "Konjunktiv II حاضر · um…zu/damit · Passiv بكل الأزمنة · أفعال بحروف جر · البيئة والطبيعة\" },
  { nr: 3, level: \"B1\", von: 229, bis: 252, titelDe: \"Lektion 21–22: Konsum & Gesundheit\", titelAr: "الاستهلاك والصحة",      inhalteAr: "Genitiv كامل · Futur I · Infinitiv mit zu · الصحة النفسية واللياقة · Nominalisierung أساسي\" },
  { nr: 4, level: \"B1\", von: 253, bis: 276, titelDe: \"Lektion 23–24: Politik & Zukunft\", titelAr: "السياسة والمستقبل",      inhalteAr: "الروابط الزمنية · صفات كأسماء · Konjunktiv II ماضي (مقدمة) · الأسئلة غير المباشرة · Partizip I · أحلام ومستقبل · مراجعة B1\" },
  // ── B2: 14 Wochen / 98 Tage ──
  { nr: 1, level: \"B2\", von: 277, bis: 301, titelDe: \"Lektion 25–26: Globalisierung & Arbeitswelt\", titelAr: "العولمة وسوق العمل", inhalteAr: "الروابط المزدوجة · Funktionsverbgefüge · بدائل Passiv · الشركات الناشئة · الذكاء الاصطناعي · اندماج حروف جر\" },
  { nr: 2, level: \"B2\", von: 302, bis: 326, titelDe: \"Lektion 27–28: Hochschule & Medien\", titelAr: "الجامعة والإعلام",       inhalteAr: "الجامعة والبحث · Konjunktiv I (كلام غير مباشر) · Partizipattribute مطوّلة · الصحافة ووسائل التواصل · حرية الصحافة\" },
  { nr: 3, level: \"B2\", von: 327, bis: 350, titelDe: \"Lektion 29–30: Medizin & Recht\", titelAr: "الطب والقانون",            inhalteAr: "الطب الحديث · Modalverben ذاتية متقدمة · القانون · الجريمة · Konjunktiv II ماضي كامل · شرط ohne wenn\" },
  { nr: 4, level: \"B2\", von: 351, bis: 374, titelDe: \"Lektion 31–32: Kunst & Nachhaltigkeit\", titelAr: "الفنون والاستدامة",  inhalteAr: "الفن والأدب والعمارة · سوابق/لواحق · الاستدامة والطاقة · Nominalstil ↔ Verbalstil · Redewendungen/Kollokationen · مراجعة B2\" },
];"""
text = text[:i] + old_mod_start + "\n" + new_modules + "\n" + text[j + len(old_mod_end):]

# Abschluss-Tage anpassen: 375–378 (4 Tage)
old_finals = """    // أيام الختام 267-270
    const finals: Record<number, DayTask[]> = {
      267: ["""
new_finals = """    // أيام الختام 375-378
    const finals: Record<number, DayTask[]> = {
      375: ["""
assert old_finals in text, "Finals-Block nicht gefunden"
text = text.replace(old_finals, new_finals)
text = text.replace("          quiz: buildQuiz(270, \"Abschluss\", 5),", "          quiz: buildQuiz(378, \"Abschluss\", 5),")
text = text.replace("    tasks.push(...(finals[day] ?? finals[270]));", "    tasks.push(...(finals[day] ?? finals[378]));")

# Kommentar zu 270 Tage
text = text.replace(
    "/** إجمالي ساعات الخطة كاملةً (270 يوماً) */",
    "/** إجمالي ساعات الخطة كاملةً (378 يوماً) */",
)

PLAN.write_text(text, encoding="utf-8")
print("✓ plan.ts aktualisiert (A0-Phasen, neue Module, 378 Tage)")
