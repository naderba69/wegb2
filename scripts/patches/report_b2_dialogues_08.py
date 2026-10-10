#!/usr/bin/env python3
"""R130 — review report for eighth B2 batch d-b2-22..d-b2-24."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-22", "d-b2-23", "d-b2-24"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-08-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-08-2026-10-08.md"

CORRECTIONS = [
 {
  "unit": "d-b2-22.lines[0].ar",
  "old": "التحويلةُ إلى طبيبِ الأشعةِ تمتدُّ أسابيع — وألمي لا يرحم.",
  "new": "التحويلةُ إلى طبيبِ الأشعةِ تستغرقُ أسابيع — والألمُ لا يهدأ.",
  "rationale": "dauert=تستغرق، lassen nicht nach=لا يهدأ (لا «يرحم»)."
 },
 {
  "unit": "d-b2-22.lines[1].ar",
  "old": "نُدرجُها طارئة: رمزُ C على الوصفةِ يقصُمُ ظهرَ الانتظار.",
  "new": "نُصنِّفُها حادة: رمزُ الاستعجالِ C على التحويلةِ يُقصِّرُ الانتظار.",
  "rationale": "akut einstufen=نُصنّف حادة، Dringlichkeitscode C=رمز الاستعجال، verkürzt=يُقصّر (لا «يقصم ظهر»)."
 },
 {
  "unit": "d-b2-22.lines[2].ar",
  "old": "أنجدي تحويلَةٌ ثانيةً إلى مستشفى آخر؟",
  "new": "هل تُفيدُ تحويلةٌ ثانيةٌ إلى مستشفى آخر؟",
  "rationale": "Kann helfen?=هل تُفيد (لا «أنجدي»)."
 },
 {
  "unit": "d-b2-22.lines[3].ar",
  "old": "متوازياً نعم، على أن تتبادَلَ الملفاتُ بموافقتكِ الخطيةِ الموقَّعة.",
  "new": "نعم بالتوازي، لكن يجب أن تكون الملفاتُ قابلةً للتبادل — بموافقتكِ.",
  "rationale": "Parallel=بالتوازي، austauschbar=قابلة للتبادل، حذف «الخطية الموقعة» الزائد."
 },
 {
  "unit": "d-b2-22.lines[4].ar",
  "old": "ما النتائجُ التي لا غنى عنها للطبيبِ المختص؟",
  "new": "ما التقاريرُ التي يحتاجُها الاختصاصيُّ إلزامياً؟",
  "rationale": "Befunde zwingend=تقارير إلزامية، Facharzt=الاختصاصي."
 },
 {
  "unit": "d-b2-22.lines[5].ar",
  "old": "تحاليلَ الأسبوعِ الطازجة، وصورًا صيغة DICOM غيرَ مضغوطة.",
  "new": "تحاليلُ الأسبوع، والصورُ السابقةُ بصيغةِ DICOM دون ضغط.",
  "rationale": "Laborwerte der Woche=تحاليل الأسبوع، Voraufnahmen=صور سابقة، keine Komprimierung=دون ضغط."
 },
 {
  "unit": "d-b2-22.lines[6].ar",
  "old": "حُجِزَ الموعد — وإن فرَجَ الله قبلَه، فكيف ألغي؟",
  "new": "أُكِّد الموعد — كيف أُلغيه إن توفَّر موعدٌ أبكرُ؟",
  "rationale": "bestätigt=أُكِّد، früher klappt=توفّر موعد أبكر (لا «فرج الله»)."
 },
 {
  "unit": "d-b2-22.lines[7].ar",
  "old": "مكالمةٌ واحدة — فيقفزُ الصفُّ إلى قائمةِ المُستخلفين حالاً.",
  "new": "مكالمةٌ واحدة تكفي — فيُنقَلُ المقعدُ فوراً إلى قائمةِ الانتظارِ الاحتياطية.",
  "rationale": "wandert auf Nachrückliste=ينقل إلى قائمة انتظار احتياطية (لا «يقفز الصف»)."
 },
 {
  "unit": "d-b2-23.lines[1].ar",
  "old": "يجبُ تصفيةُ حسابِ العملِ شهريّاً؛ وقد نصَّت اتفاقُنا التنظيميُّ على ذلك.",
  "new": "يجبُ تسويةُ رصيدِ ساعاتِ العمل شهرياً — فنحن نستندُ إلى اتفاقيةِ المنشأة.",
  "rationale": "Arbeitszeitkonto=رصيد ساعات العمل، Betriebsvereinbarung=اتفاقية المنشأة."
 },
 {
  "unit": "d-b2-23.lines[2].ar",
  "old": "أتقترحون رصيداً زمنيّاً بدلَ النقد؟",
  "new": "أتقترحون جدولةً زمنيةً بدلَ الدفع النقدي؟",
  "rationale": "Zeitschiene=جدولة زمنية، statt Auszahlung=بدل الدفع النقدي."
 },
 {
  "unit": "d-b2-23.lines[3].ar",
  "old": "عطلةٌ متتابعة: يومانِ وعلاوةٌ لكلِّ ساعةٍ بحكمِ الاتفاقية.",
  "new": "إجازةٌ متصلة: يومان، إضافةً إلى علاوةٍ عن كلِّ ساعةٍ إضافيةٍ وفقَ الاتفاقيةِ الأجرية.",
  "rationale": "Frei im Block=إجازة متصلة، Zuschlag laut Tarif=علاوة وفق الاتفاقية الأجرية."
 },
 {
  "unit": "d-b2-23.lines[4].ar",
  "old": "جدولُ المناوباتِ لا يسمح — علينا تفكيكُ الرصيدِ قبلَ الفصح.",
  "new": "جدولُ المناوباتِ لا يسمحُ بذلك — علينا تصريفُ الرصيدِ قبلَ عيدِ الفصح.",
  "rationale": "Kontingent abbauen=تصريف الرصيد (لا «تفكيك»)."
 },
 {
  "unit": "d-b2-23.lines[5].ar",
  "old": "سنُنَفِّذُ القائمةَ الاثنين مع قائدِ المناوبة — بيقينٍ لا مع وعود.",
  "new": "سنُمرِّرُ القائمةَ يومَ الاثنين مع قائدِ المناوبة — بشكلٍ ملزم.",
  "rationale": "Liste durchsetzen=نُمرّر القائمة، verbindlich=بشكل ملزم (لا «بيقين»)."
 },
 {
  "unit": "d-b2-23.lines[7].ar",
  "old": "إذن لجنةُ التوفيق، وحكمُها يحلُّ محلَّ عنادِ صاحبِ العمل.",
  "new": "فهيئةُ التسوية؛ ويحلُّ قرارُها محلَّ رفضِ صاحبِ العمل.",
  "rationale": "Einigungsstelle=هيئة التسوية، Spruch ersetzt Weigerung=قرار يحل محل رفض صاحب العمل."
 },
 {
  "unit": "d-b2-24.lines[0].ar",
  "old": "نجحتُ بفارقٍ ضئيلٍ في امتحان telc B1 — أليَّ شهادة؟",
  "new": "نجحتُ في امتحانِ telc B1 بفارقٍ ضئيل — هل أحصلُ على الشهادة؟",
  "rationale": "Zertifikat oder nicht?=هل أحصل على الشهادة (لا «أليَّ»)."
 },
 {
  "unit": "d-b2-24.lines[1].ar",
  "old": "نجحتَ ولو شعرة: ستصلُك الشهادةُ بالبريدِ خلالَ أربعةِ أسابيع.",
  "new": "النجاحُ نجاح: ستصلُك الشهادةُ بالبريدِ بعدَ أربعةِ أسابيع.",
  "rationale": "Bestanden ist bestanden=النجاح نجاح (حذف «ولو شعرة»)."
 },
 {
  "unit": "d-b2-24.lines[2].ar",
  "old": "وليس مطلوباً منّي إثباتُ إعادةٍ لإقامتي؟",
  "new": "ألا يُشترطُ لإقامتي إثباتُ إعادةِ الامتحان؟",
  "rationale": "Fehlt nicht der Nachweis?=ألا يُشترط إثبات إعادة (كان النص يعكس المعنى)."
 },
 {
  "unit": "d-b2-24.lines[3].ar",
  "old": "عندَ النجاحِ لا شيء؛ والإعادةُ للحاصلِ فقط على الراسب، مرتينِ كحدٍّ أقصى.",
  "new": "عندَ النجاحِ لا شيء؛ والإعادةُ تكونُ فقط عندَ الرسوب، وبحدٍّ أقصى مرتين.",
  "rationale": "Wiederholungen nur bei Nichtbestehen=الإعادة عند الرسوب فقط."
 },
 {
  "unit": "d-b2-24.lines[4].ar",
  "old": "وإن أردتُ B2: التسجيلُ عبرَ جامعةِ الشعب؟",
  "new": "وإن أردتُ التقدُّمَ لامتحان B2: ألتسجيلُ عبرَ معهدِ تعليمِ الكبار؟",
  "rationale": "Volkshochschule=معهد تعليم الكبار (لا «جامعة الشعب»)."
 },
 {
  "unit": "d-b2-24.lines[5].ar",
  "old": "من مركزِ اللغاتِ مباشرة؛ موعدُ الربيع، وقائمةُ الانتظارِ مضمَّنةٌ لك.",
  "new": "عبرَ مركزِ اللغاتِ مباشرة؛ الموعدُ في الربيع، ومعه قائمةُ انتظار.",
  "rationale": "Warteliste inklusive=معه قائمة انتظار (لا «مضمَّنة لك»)."
 },
 {
  "unit": "d-b2-24.lines[6].ar",
  "old": "وما المنحُ لمن أُعيدَ كرَّةُ الفشل؟",
  "new": "وما وسائلُ الدعمِ المتاحةِ عندَ إعادةِ المحاولة؟",
  "rationale": "Fördermittel=وسائل الدعم، wiederholter Versuch=إعادة المحاولة (لا «كرة الفشل»)."
 },
 {
  "unit": "d-b2-24.lines[7].ar",
  "old": "قد يُخفِّضُ حاملو الدورةِ نصفَ الرسوم؛ فاطلبْ خلالَ أسبوعَين لا أكثر.",
  "new": "يستطيعُ منظمو الدورةِ تخفيضَ الرسومِ إلى النصف؛ قدِّم الطلبَ خلالَ أسبوعين.",
  "rationale": "Kursträger=منظمو الدورة، halbieren=تخفيض الرسوم إلى النصف."
 }
]

CONTEXT_NOTES = {
 "d-b2-22": [
  {"note": "«Dringlichkeitscode C» رمز الاستعجال على التحويلة يُقصّر الانتظار (Q0).", "source": "d-b2-22-q0"},
  {"note": "«Parallelüberweisung» تحويلة موازية بشرط تبادل الملفات بموافقة المريضة (Q1).", "source": "d-b2-22-q1"},
  {"note": "Voraufnahmen im DICOM-Format ohne Komprimierung = صور سابقة بصيغة DICOM دون ضغط (Q2).", "source": "d-b2-22-q2"},
 ],
 "d-b2-23": [
  {"note": "Arbeitszeitkonto monatlich ausgleichen = تسوية رصيد الساعات شهرياً وفق Betriebsvereinbarung (Q0).", "source": "d-b2-23-q0"},
  {"note": "Einigungsstelle = هيئة التسوية وقرارها يحل محل رفض صاحب العمل (Q1).", "source": "d-b2-23-q1"},
  {"note": "Kontingent vor Ostern abbauen = تصريف الرصيد قبل عيد الفصح (Q2).", "source": "d-b2-23-q2"},
 ],
 "d-b2-24": [
  {"note": "«knapp bestanden» نجاح بضيق → الشهادة بالبريد بعد 4 أسابيع (Q0).", "source": "d-b2-24-q0"},
  {"note": "Wiederholung nur bei Nichtbestehen max. zweimal (Q1).", "source": "d-b2-24-q1"},
  {"note": "B2-Prüfung direkt beim Sprachenzentrum (لا VHS)، مع قائمة انتظار (Q2).", "source": "d-b2-24-q2"},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b2-22": [
  {"phrase": "تستغرق أسابيع", "alternative": "تمتد أسابيع", "note": "«dauert»."},
  {"phrase": "لا يهدأ", "alternative": "لا يزول", "note": "«lassen nicht nach»."},
  {"phrase": "قائمة الانتظار الاحتياطية", "alternative": "قائمة البدلاء", "note": "«Nachrückliste»."},
 ],
 "d-b2-23": [
  {"phrase": "تسوية الرصيد", "alternative": "تصفية الرصيد", "note": "«ausgleichen»."},
  {"phrase": "إجازة متصلة", "alternative": "إجازة في كتلة", "note": "«Frei im Block»."},
  {"phrase": "تصريف الرصيد", "alternative": "إنهاك الرصيد", "note": "«abbauen»."},
 ],
 "d-b2-24": [
  {"phrase": "بفارق ضئيل", "alternative": "بالكاد", "note": "«knapp»."},
  {"phrase": "معهد تعليم الكبار", "alternative": "كلية الشعب", "note": "«Volkshochschule»."},
  {"phrase": "تخفيض الرسوم إلى النصف", "alternative": "نصف الرسوم", "note": "«halbieren»."},
 ],
}

SOURCES = {
 "d-b2-22": [
  {"id": "S1", "citation": "DWDS: Überweisung = تحويلة طبية.", "url": "https://www.dwds.de/wb/Facharzt"},
  {"id": "S2", "citation": "KBV: Dringlichkeitscode A/B/C يحدد أولوية الموعد.", "url": "https://www.kbv.de/html/terminservicestelle.php"},
  {"id": "S3", "citation": "Duden: nachlassen (Schmerz) = يهدأ/يخف.", "url": "https://www.duden.de/rechtschreibung/nachlassen"},
  {"id": "S4", "citation": "Duden: Nachrückliste = قائمة انتظار احتياطية.", "url": "https://www.duden.de/rechtschreibung/Nachruecker"},
 ],
 "d-b2-23": [
  {"id": "S5", "citation": "Duden: Arbeitszeitkonto = رصيد ساعات العمل.", "url": "https://www.duden.de/rechtschreibung/Arbeitszeitkonto"},
  {"id": "S6", "citation": "BetrVG §76: Einigungsstelle = هيئة تسوية.", "url": "https://www.gesetze-im-internet.de/betrvg/__76.html"},
  {"id": "S7", "citation": "Duden: abbauen (Überstunden) = تصريف.", "url": "https://www.duden.de/rechtschreibung/abbauen"},
  {"id": "S8", "citation": "Duden: Tarifvertrag = الاتفاقية الأجرية.", "url": "https://www.duden.de/rechtschreibung/Tarifvertrag"},
 ],
 "d-b2-24": [
  {"id": "S9", "citation": "BAMF: Zertifikat يصل بعد النجاح؛ Wiederholung فقط عند الرسوب (مرتين كحد أقصى).", "url": "https://www.bamf.de/"},
  {"id": "S10", "citation": "Duden: Volkshochschule (VHS) = معهد تعليم الكبار.", "url": "https://www.duden.de/rechtschreibung/Volkshochschule"},
  {"id": "S11", "citation": "DWDS: Fördermittel = وسائل دعم.", "url": "https://www.dwds.de/wb/Foerdermittel"},
  {"id": "S12", "citation": "Duden: Kursträger = منظم الدورة.", "url": "https://www.duden.de/rechtschreibung/Kurstraeger"},
 ],
}

CONTENT_CHECKS = [
 "d-b2-22: مسار الإحالة متسق: آلام لا تهدأ → تصنيف حاد برمز C يقصّر الانتظار، تحويلة موازية بموافقة وتبادل ملفات، DICOM دون ضغط، إلغاء بمكالمة ينقل المقعد إلى قائمة انتظار. Q0/Q1/Q2 مفاتيح مطابقة.",
 "d-b2-23: نزاع الساعات متسق: تكدس منذ مارس → تسوية شهرية وفق اتفاقية المنشأة → إجازة متصلة+علاوة → تصريف قبل الفصح → تمرير القائمة بشكل ملزم → هيئة التسوية عند التعنت. Q0/Q1/Q2 مفاتيح مطابقة.",
 "d-b2-24: الامتحانات متسقة: نجاح بضيق → شهادة بالبريد → لا إعادة، الإعادة عند الرسوب مرتين، B2 عبر مركز اللغات بالربيع مع قائمة انتظار، منظمو الدورة يخفضون الرسوم لنصف بالطلب خلال أسبوعين. Q0/Q1/Q2 مفاتيح مطابقة.",
 "لا تحذيرات محتوى جديدة؛ W1–W6 مفتوحة.",
]

CONTENT_WARNINGS = []

by = {d["id"]: d for d in D}
scope = []
units = lt = qt = dt = 0
for did in SCOPE:
    dlg = by[did]; lines = dlg["lines"]; qs = dlg["questions"]; dc = dlg.get("dictation") or []
    lu = sum(len([k for k in ln if k in ("who", "de", "ar")]) for ln in lines)
    qu = sum(len(q) for q in qs); u = 4 + lu + qu + len(dc)
    units += u; lt += len(lines); qt += len(qs); dt += len(dc)
    scope.append({"id": did, "level": dlg["level"], "titleDe": dlg["titleDe"], "titleAr": dlg["titleAr"],
                  "lines": len(lines), "questions": len(qs), "dictation": len(dc), "units": u,
                  "hasWaisenField": "waisen" in dlg, "who": sorted({ln["who"] for ln in lines})})

ah = []
def walk(n):
    if isinstance(n, dict):
        if isinstance(n.get("id"), str) and n["id"] in SCOPE: ah.append(n["id"])
        for v in n.values(): walk(v)
    elif isinstance(n, list):
        for v in n: walk(v)
walk(AUDIO)
mh = []
for tid in SCOPE: mh.extend(glob.glob(str(ROOT / "public" / "audio" / "**" / f"*{tid}*.mp3"), recursive=True))

rep = {
 "reviewRule": "R130", "date": "2026-10-08",
 "scope": "خامس دفعة B2: d-b2-13..15 (بدل الوالدية واستشارة، الإقرار الضريبي وتمديد المهلة، تلف الماء مع شركة التأمين) — الحوارات الثلاث بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - 22, "corrected": 22, "unresolved": 0,
  "note": "اثنان وعشرون تصحيحاً عربياً مؤكداً — d-b2-22 (8): dauert=تستغرق، nicht nachlassen=لا يهدأ، akut einstufen=نُصنِّف حادة، Dringlichkeitscode=رمز الاستعجال، verkürzt=يُقصِّر (لا «يقصم ظهر»)، helfen=تُفيد، Parallel/austauschbar=بالتوازي/قابلة للتبادل، Befunde zwingend=تقارير إلزامية، Voraufnahmen/DICOM=صور سابقة بصيغة DICOM دون ضغط، früher klappt=موعد أبكر، Nachrückliste=قائمة انتظار احتياطية؛ d-b2-23 (6): Arbeitszeitkonto/Betriebsvereinbarung=تسوية رصيد/اتفاقية المنشأة، Zeitschiene=جدولة زمنية، Frei im Block/Zuschlag=إجازة متصلة/علاوة وفق الأجرية، abbauen=تصريف الرصيد (لا «تفكيك»)، durchsetzen/verbindlich=نُمرِّر القائمة بشكل ملزم، Einigungsstelle/Spruch=هيئة التسوية/قرار يحل محل الرفض؛ d-b2-24 (8): Zertifikat=هل أحصل على الشهادة، Bestanden=النجاح نجاح، Nachweis Wiederholung=إثبات إعادة، bei Nichtbestehen=عند الرسوب فقط، Volkshochschule=معهد تعليم الكبار، Warteliste=قائمة انتظار، Fördermittel=وسائل الدعم، Kursträger/halbieren=منظمو الدورة/تخفيض الرسوم للنصف. لا تحذيرات محتوى جديدة؛ W1–W6 تبقى مفتوحة. الألماني/who/الأسئلة/المفاتيح/الإملاءات مقفلة."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "سياق قانوني/إداري عام (إعانات والدية، إقرار ضريبي، مطالبات تأمين): التصحيحات لغوية-مصطلحية، وليست مشورة قانونية أو ضريبية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مالية/مهنية؛ مفردات حوارات إدارية/تأمينية لا نصائح."},
 "gates": {"planned": "K204a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B2 دفعة 07: d-b2-19–d-b2-21\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R127 · **البوابات:** K204a–j\n\n")
md.append("## النطاق\n\n"); md.append(f"{rep['scope']}\n\n")
md.append("## الإجمالي\n\n"); t = rep["totals"]
md.append(f"- حوارات: **{t['dialogues']}** · أسطر: **{t['lines']}** · أسئلة: **{t['questions']}** · إملاءات: **{t['dictation']}** · وحدات≈**{t['approximateUnits']}**\n\n")
md.append("## الحكم\n\n"); j = rep["judgement"]
md.append(f"- **سليمة:** {j['correct']} · **مصححة:** {j['corrected']} · **غير محسومة:** {j['unresolved']}\n- {j['note']}\n\n")
md.append("## التصحيحات المطبقة\n\n")
for c in rep["corrections"]: md.append(f"- `{c['unit']}`: من «{c['old']}» إلى «{c['new']}» — {c['rationale']}\n")
md.append("\n## تحذيرات محتوى (غير معدّلة)\n\n")
if rep["contentWarnings"]:
    for w in rep["contentWarnings"]:
        md.append(f"### {w['id']} — {w['dialogue']} · `{w['field']}`\n")
        md.append(f"- **الملاحظة:** {w['statement']}\n- **الأدلة:** {w['evidence']}\n")
        md.append(f"- **معدّلة؟:** {'نعم' if w['modified'] else 'لا'} — {w['whyNotModified']}\n- **التوصية:** {w['recommendation']}\n")
else:
    md.append("- لا تحذيرات محتوى جديدة في هذه الدفعة. تظل التحذيرات W1–W6 (دفعات سابقة، وآخرها W6 في d-b2-11.L2 بسقف «11٪») مفتوحةً وموثّقة في مواضعها.\n")
md.append("\n## فحوص المحتوى\n\n")
for chk in rep["contentChecks"]: md.append(f"- {chk}\n")
md.append("\n## ملاحظات سياقية (غير معدّلة)\n\n")
for did, ns in rep["contextNotes"].items():
    md.append(f"### {did}\n")
    for n in ns: md.append(f"- {n['note']}\n  - المصدر: {n['source']}\n")
md.append("\n## بدائل أسلوبية (غير معدّلة)\n\n")
for did, al in rep["styleAlternatives"].items():
    md.append(f"### {did}\n")
    for a in al: md.append(f"- `{a['phrase']}` — بديل: `{a['alternative']}` — {a['note']}\n")
md.append("\n## المصادر\n\n"); ts = 0
for did, sl in rep["sources"].items():
    md.append(f"### {did}\n")
    for s in sl: md.append(f"- [{s['id']}] {s['citation']} — {s['url']}\n"); ts += 1
md.append(f"\n(مجموع المراجع: {ts}.)\n\n")
md.append("## الصوت\n\n")
md.append(f"- إدخالات بيان صوتي: {rep['audio']['manifestEntries'] or 'لا يوجد'}.\n- ملفات mp3: {rep['audio']['mp3Files'] or 'لا يوجد'}.\n- {rep['audio']['note']}\n\n")
md.append("## البطاقات اليتيمة\n\n- " + rep["waisen"]["note"] + "\n\n")
md.append("## الحدود\n\n")
for k, v in rep["limits"].items(): md.append(f"- **{k}:** {v}\n")
OUT_MD.write_text("".join(md), encoding="utf-8")
print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
print(f"  lines={lt} q={qt} dict={dt} ≈units={units} corrections={len(CORRECTIONS)} warnings={len(CONTENT_WARNINGS)}")
print(f"  sources={ts} audio={len(ah)}/{len(mh)}")

if __name__ == "__main__": pass
