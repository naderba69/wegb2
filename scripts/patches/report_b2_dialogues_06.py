#!/usr/bin/env python3
"""R128 — review report for sixth B2 batch d-b2-16..d-b2-18."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = json.loads((ROOT / "content/dialogues.json").read_text(encoding="utf-8"))
AUDIO = json.loads((ROOT / "content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE = ["d-b2-16", "d-b2-17", "d-b2-18"]
OUT_JSON = ROOT / "docs/content-review-b2-dialogues-06-2026-10-08.json"
OUT_MD = ROOT / "docs/content-review-b2-dialogues-06-2026-10-08.md"

CORRECTIONS = [
 {
  "unit": "d-b2-16.lines[0].ar",
  "old": "موعدُ السبتِ يتصادمُ مع مناوبتي — أيجوزُ تبديلٌ؟",
  "new": "موعدُ السبت يتعارض مع مناوبتي — هل أنتم منفتحون على تبديل؟",
  "rationale": "kollidiert mit=يتعارض، وwäre offen gegen einen Tausch=منفتح على التبديل."
 },
 {
  "unit": "d-b2-16.lines[1].ar",
  "old": "مقاعدُ شاغرةٌ في مجموعةِ الخميسِ من الساعة 18؛ والتحويلُ بـ15 يورو.",
  "new": "أماكن شاغرة في مجموعة الخميس من الساعة 18؛ وإعادةُ الحجز تكلّف 15 يورو.",
  "rationale": "Umbuchung=إعادة الحجز، kostet=تكلّف."
 },
 {
  "unit": "d-b2-16.lines[2].ar",
  "old": "إن أعنتُ في استكمالِ قائمةِ الانتظار — فتتنازلون عنِ الرسم؟",
  "new": "إن ساعدتُ في ملء قائمة الانتظار — أتعفونني من الرسم؟",
  "rationale": "beim Füllen helfen=المساعدة في ملء، erlassen=إعفاء من الرسم."
 },
 {
  "unit": "d-b2-16.lines[3].ar",
  "old": "منصف — بلا رسوم، لكنَّ إلزامَ الحضورِ يبقى مقدَّسًا.",
  "new": "منصف — إذن تبديل بلا رسم، لكنّ إلزامَ الحضور يظلّ غيرَ قابل للإسقاط.",
  "rationale": "bleibt heilig=غير قابل للإسقاط، Tausch ohne Gebühr=تبديل بلا رسم."
 },
 {
  "unit": "d-b2-16.lines[5].ar",
  "old": "يشترطُ الختامُ ثمانينَ بالمئةِ حضورًا لا أقلّ.",
  "new": "تتطلّب الشهادةُ حضورَ ثمانينَ بالمئة على الأقلّ.",
  "rationale": "setzt voraus=تتطلّب، nicht weniger=على الأقل."
 },
 {
  "unit": "d-b2-17.lines[0].ar",
  "old": "دوراتُ الاعتمادِ بـ2.400 يورو — أيتحمَّلُ المصنعُ جزءاً؟",
  "new": "دوراتُ الاعتماد بـ2.400 يورو — هل تتحمَّل الشركةُ جزءاً؟",
  "rationale": "تصحيح صرفي + Firma=الشركة (لا المصنع)."
 },
 {
  "unit": "d-b2-17.lines[1].ar",
  "old": "لصلتها بمجالنا — بنُدَّ عنك إن انتقلتَ قبلَ أربعةَ وعشرين شهراً.",
  "new": "نعم، إن كانت ذات صلةٍ بمجال عملنا؛ ويوجد شرطُ استردادٍ إن تركتَ الشركة قبل أربعة وعشرين شهراً.",
  "rationale": "Bei Branchennähe ja=نعم إن ذات صلة، Rückzahlungsklausel=شرط استرداد."
 },
 {
  "unit": "d-b2-17.lines[3].ar",
  "old": "يومانِ شهريّاً بإجازةٍ مدفوعةٍ مقابلَ ارتباطِ سنةٍ كاملة.",
  "new": "يومانِ شهرياً إجازةً مدفوعةً مقابل التزامٍ بسنة تدريب.",
  "rationale": "Bindung an ein Jahr Weiterbildung=التزام بسنة تدريب."
 },
 {
  "unit": "d-b2-17.lines[4].ar",
  "old": "وإن أخذتُ بدلَ الوالدية أثناءَ الدورة — نُبقيها مجمَّدة؟",
  "new": "وإن أخذتُ بدلَ الوالدية أثناء الدورة — هل يُوقَف الاستحقاق؟",
  "rationale": "Der Anspruch ruht=يُوقَف الاستحقاق (لا «مجمّدة»)."
 },
 {
  "unit": "d-b2-17.lines[5].ar",
  "old": "يتوقفُ الاستحقاق؛ نُطيلُ الارتباطَ بمقدارِ الغيابِ لا المال.",
  "new": "يتوقّف الاستحقاق؛ نُمدّد فترة الالتزام بمدة التوقف، لا التكاليف.",
  "rationale": "nicht die Kosten=لا التكاليف، und um die Pause verlängern=تمديد الالتزام بمدة التوقف."
 },
 {
  "unit": "d-b2-17.lines[6].ar",
  "old": "اتفاقٌ خطيٌّ للاثنين، وحينئذٍ أسجِّلُ اسمي.",
  "new": "اتفاقٌ خطيّ يغطّي كلا الأمرَين، وعندها أسجّل نفسي.",
  "rationale": "Vereinbarung über beides=اتفاق يغطي كلا الأمرين، mich anmelden=أسجّل نفسي."
 },
 {
  "unit": "d-b2-17.lines[7].ar",
  "old": "غداً في قسمِ الأفراد، وستُدرَجُ الساعاتُ الإضافيةُ في عقدك.",
  "new": "غداً في قسم شؤون الأفراد، وستصلكم الأوراق بعد إدراج الساعات الإضافية في عقدكم.",
  "rationale": "Personalbüro=قسم شؤون الأفراد، Sie→ستصلكم/عقدكم."
 },
 {
  "unit": "d-b2-18.lines[1].ar",
  "old": "الميعادُ جارٍ؛ وصندوقُك الجديدُ يتولّى الإبلاغَ رقمياً.",
  "new": "المهلةُ لا تزال سارية؛ والصندوق الجديد يتولّى تقديمَ طلبِ الإنهاء رقميّاً.",
  "rationale": "Frist läuft=المهلة سارية، reicht die Kündigung ein=يتولى تقديم طلب الإنهاء."
 },
 {
  "unit": "d-b2-18.lines[2].ar",
  "old": "ماذا يحدثُ لدفترِ المكافآتِ والأدويةِ المزمنة؟",
  "new": "ماذا يحدث لدفترِ نقاطِ المكافآت وأدوية الأمراض المزمنة؟",
  "rationale": "Bonusheft=دفتر نقاط المكافآت، Dauermedikamente=أدوية الأمراض المزمنة."
 },
 {
  "unit": "d-b2-18.lines[3].ar",
  "old": "يبقى الدفترُ سارياً، والأدويةُ تنتقلُ دونَ انقطاعٍ عبرَ الوصفةِ الإلكترونية.",
  "new": "يبقى الدفترُ سارياً، وتُصرفُ الأدويةُ دون انقطاع عبر الوصفة الإلكترونية.",
  "rationale": "laufen nahtlos über=تُصرف دون انقطاع عبر (لا تنتقل)."
 },
 {
  "unit": "d-b2-18.lines[4].ar",
  "old": "تغطيةٌ متواصلة — أأذهبُ للطبيبِ في شهرِ العبور؟",
  "new": "التغطيةُ بلا فجوات — هل أستطيع زيارة الطبيب في شهر الانتقال؟",
  "rationale": "lückenlos=بلا فجوات، Übergangsmonat=شهر الانتقال."
 },
 {
  "unit": "d-b2-18.lines[5].ar",
  "old": "نعم — تظلُّ الحمايةُ ساريةً إلى آخرِ يومٍ من العقد.",
  "new": "نعم — التغطيةُ التأمينية تظلُّ سارية حتى آخر يوم من العقد.",
  "rationale": "Versicherungsschutz=التغطية التأمينية، bis zum letzten Tag=حتى آخر يوم."
 },
 {
  "unit": "d-b2-18.lines[6].ar",
  "old": "وحصةُ صاحبِ العملِ من الاشتراكات — مَن يُسَوِّيها؟",
  "new": "أما حصة صاحب العمل من الاشتراكات فمن يجري تسويتَها محاسبياً؟",
  "rationale": "wer rechnet ab=من يجري التسوية المحاسبية."
 },
 {
  "unit": "d-b2-18.lines[7].ar",
  "old": "يتصالحُ محاسبو الصندوقَين بينهما، وتصلُك شهادةٌ إجماليةٌ موحَّدة.",
  "new": "يقوم محاسبا الصندوقين بتسوية الحسابات فيما بينهما، وستصلكم شهادةٌ إجمالية.",
  "rationale": "unter sich=فيما بينهما، Sammelbescheinigung=شهادة إجمالية، Sie→ستصلكم."
 }
]

CONTEXT_NOTES = {
 "d-b2-16": [
  {"note": "«gegen einen Tausch wäre offen» = منفتح على التبديل؛ «Anwesenheitspflicht bleibt heilig» تعبير إداري = غير قابل للإسقاط (شاهد Q0 «واجب الحضور لا يسقط أبداً»)", "source": "d-b2-16-q0.explanationAr"},
  {"note": "«Ärztliches Attest bis Montag» شهادة طبية حتى الاثنين؛ «Nachtermin am Monatsersten» موعد بديل في أول الشهر — Q2 يفرق بينهما.", "source": "d-b2-16-q2"},
  {"note": "«80 Prozent Teilnahme» النسبة مكتوبة حروفاً «بالمئة» باتساق سنّة R125.", "source": "d-b2-16.L5"},
 ],
 "d-b2-17": [
  {"note": "«Bei Branchennähe ja» شرط تمويل متى كانت الدورة ذات صلة بالمجال؛ «Rückzahlungsklausel bei Wechsel unter 24 Monaten» بند استرداد عند المغادرة.", "source": "d-b2-17-q0"},
  {"note": "«Der Anspruch ruht» يتوقف الاستحقاق مؤقتاً؛ «Bindung um die Pause, nicht die Kosten» يُمدَّد الالتزام لا التكاليف — شاهد Q1.", "source": "d-b2-17-q1"},
  {"note": "«Zwei Tage pro Monat frei gegen Bindung an ein Jahr» يومان إجازة شهرياً مقابل التزام بسنة (شاهد Q2).", "source": "d-b2-17-q2"},
 ],
 "d-b2-18": [
  {"note": "«die neue Kasse reicht die Kündigung digital ein» الصندوق الجديد يقدّم طلب الإنهاء رقميّاً (لا يكتفي بالإبلاغ).", "source": "d-b2-18-q0"},
  {"note": "«Versicherungsschutz bleibt bis zum letzten Tag» لا فجوة تأمينية في شهر الانتقال (Q1)، و«Sammelbescheinigung» شهادة مجمّعة لحصص الاشتراك (Q2).", "source": "d-b2-18-q1/q2"},
  {"note": "«Medikamente laufen nahtlos über die elektronische Verordnung» تصرف بلا انقطاع عبر الوصفة الإلكترونية.", "source": "d-b2-18.L3"},
 ],
}

STYLE_ALTERNATIVES = {
 "d-b2-16": [
  {"phrase": "غيرَ قابل للإسقاط", "alternative": "مصون/لا يمسّ", "note": "«bleibt heilig» — الثانية أوجز."},
  {"phrase": "إعادةُ الحجز تكلّف", "alternative": "رسم إعادة الحجز", "note": "«Umbuchung kostet»."},
  {"phrase": "أتعفونني من الرسم؟", "alternative": "هل تُعفونني من الرسم؟", "note": "«erlassen Sie»."},
 ],
 "d-b2-17": [
  {"phrase": "شرطُ استرداد", "alternative": "بندُ الاسترداد", "note": "«Rückzahlungsklausel»."},
  {"phrase": "فترة الالتزام", "alternative": "مدة الارتباط", "note": "«Bindung»."},
  {"phrase": "أسجّل نفسي", "alternative": "أتسجّل", "note": "«mich anmelden»."},
 ],
 "d-b2-18": [
  {"phrase": "المهلة لا تزال سارية", "alternative": "المهلة جارية", "note": "«Frist läuft»."},
  {"phrase": "تُصرف الأدوية", "alternative": "تستمر الأدوية", "note": "«laufen über»."},
  {"phrase": "تسوية الحسابات فيما بينهما", "alternative": "تتوليان التصفية", "note": "«unter sich tun»."},
 ],
}

SOURCES = {
 "d-b2-16": [
  {"id": "S1", "citation": "Duden: Umbuchung = إعادة الحجز؛ kosten = يكلّف.", "url": "https://www.dwds.de/wb/Umbuchung"},
  {"id": "S2", "citation": "Duden: erlassen (jemandem eine Gebühr) = إعفاء من الرسم.", "url": "https://www.duden.de/rechtschreibung/erlassen"},
  {"id": "S3", "citation": "مقارنة داخلية: Anwesenheitspflicht لا تُسقط (d-b2-16-q0)؛ kollidiert mit=يتعارض (d-b1-19.L4).", "url": "content/dialogues.json"},
  {"id": "S4", "citation": "Duden: voraussetzen = تتطلّب/تشترط (80٪ Teilnahme).", "url": "https://www.duden.de/rechtschreibung/voraussetzen"},
 ],
 "d-b2-17": [
  {"id": "S5", "citation": "Duden: Rückzahlungsklausel = شرط/بند استرداد.", "url": "https://www.duden.de/rechtschreibung/Rueckzahlungsklausel"},
  {"id": "S6", "citation": "DWDS: ruhen (Anspruch) = يتوقف مؤقتاً.", "url": "https://www.dwds.de/wb/ruhen"},
  {"id": "S7", "citation": "Duden: Personalbüro = قسم شؤون الأفراد؛ Zusatzstunden = ساعات إضافية.", "url": "https://www.dwds.de/wb/Personalbuero"},
  {"id": "S8", "citation": "مقارنة داخلية: schriftlich=خطي، Bindung=التزام (d-b2-17-q2.explanationAr، R125/R124).", "url": "content/dialogues.json"},
 ],
 "d-b2-18": [
  {"id": "S9", "citation": "Duden: Kündigung einreichen = تقديم طلب الإنهاء (تقوم به الجهة الجديدة رقميّاً).", "url": "https://www.duden.de/rechtschreibung/Kuendigung"},
  {"id": "S10", "citation": "DWDS: Versicherungsschutz = التغطية التأمينية؛ lückenlos = بلا فجوات.", "url": "https://www.dwds.de/wb/Versicherungsschutz"},
  {"id": "S11", "citation": "DWDS: unter sich = فيما بينهم؛ Sammelbescheinigung = شهادة مجمَّعة.", "url": "https://www.dwds.de/wb/Sammelbescheinigung"},
  {"id": "S12", "citation": "مقارنة داخلية: Quartalsende=نهاية الربع، elektronische Verordnung=الوصفة الإلكترونية.", "url": "content/dialogues.json: d-b2-18"},
 ],
}

CONTENT_CHECKS = [
 "d-b2-16: الرسوم/النسب متسقة: 15 € رسم Umbuchung يُلغى عند المساعدة في Warteliste، 80% حضور للشهادة، Anwesenheitspflicht غير قابلة للإسقاط، Nachtermin في أول الشهر بشهادة طبية حتى الاثنين — مفاتيح Q0/Q1/Q2 مطابقة.",
 "d-b2-17: الشروط متسقة: تمويل بشرط الصلة بالمجال، بند استرداد عند المغادرة قبل 24 شهراً، يومان شهرياً مقابل سنة، ويتوقف الاستحقاق ويمتد الالتزام بمدة التوقف (لا التكاليف) — مفاتيح Q0/Q1/Q2 مطابقة.",
 "d-b2-18: الانتقال بلا فجوة: صندوق جديد يتولى الإنهاء رقميّاً، Bonusheft سارٍ، أدوية بلا انقطاع عبر eRezept، التغطية حتى آخر يوم، المحاسبة بين الصندوقين وSammelbescheinigung — مفاتيح Q0/Q1/Q2 مطابقة.",
 "لا تحذيرات محتوى جديدة؛ W1–W6 مفتوحة في مواضعها.",
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
 "reviewRule": "R128", "date": "2026-10-08",
 "scope": "خامس دفعة B2: d-b2-13..15 (بدل الوالدية واستشارة، الإقرار الضريبي وتمديد المهلة، تلف الماء مع شركة التأمين) — الحوارات الثلاث بلا waisen.",
 "dialogues": scope,
 "totals": {"dialogues": 3, "lines": lt, "questions": qt, "dictation": dt, "approximateUnits": units},
 "corrections": CORRECTIONS, "contextNotes": CONTEXT_NOTES, "styleAlternatives": STYLE_ALTERNATIVES, "sources": SOURCES,
 "contentWarnings": CONTENT_WARNINGS, "contentChecks": CONTENT_CHECKS,
 "audio": {"manifestEntries": ah, "mp3Files": mh, "note": "لا استماع ولا ادعاء صوتي."},
 "waisen": {"present": False, "note": "الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement": {"correct": units - 19, "corrected": 19, "unresolved": 0,
  "note": "سبعة عشر تصحيحاً عربياً مؤكّداً: d-b2-13 (5): «ما المهل» (Frist=مهلة)، وتصويب «تعملُ مكافأة الشراكة» وحذف «الزوجية» وذكر «أنا وزوجي»، و«هل تُحسَب على صافي دخل» (Berechnung مؤنث + حذف المثنى)، و«بنسبة أعلى حتى» (prozentual/bis)، و«بصيغة PDF، مستنداً لكل شهر… المسوحات بلا ختم فلا نقبلها» (Dokument/Scans/akzeptieren wir nicht)؛ d-b2-14 (6): «مهلة التقديم… ولن ألحقها» (Abgabefrist/schaffen)، و«مع تعيين مستشار ضريبي تُمدَّد المهلة إلى أبريل من العام القادم» (Beratung=مستشار ضريبي، Frist=مهلة)، و«مخطط غرفة العمل… حصة النفقات الجانبية؛ وفي نظام المبلغ المقطوع» (Arbeitszimmer/Nebenkostenanteil/pauschal)، و«زِيدَت الدفعة… هل يمكنني الاعتراض؟» (مجهول/Widerspruch لا انقلاب فاعل/مفعول)، و«الإرسال عبر ELSTER لإثبات الاستلام» (Übermittlung/Eingang لا منصة/وصل)، و«واحتفظوا… فهو مستند الاستلام الوحيد» (Sie→جمع أمر + Quittungsdokument=مستند استلام)؛ d-b2-15 (6): «أبلغتُ عن الضرر، والرقم 7714» (Schaden melden)، و«فني الطوارئ بالفعل استُدعي» (Handwerker-Notdienst/bereits beauftragt لا السباك)، و«نسوّي المطالبة بعد موعد الخبير، خلال أسبوعين» (Gutachtertermin/binnen zwei Wochen لا موعدين)، و«نحتفظ بحق الرجوع على المؤجِّر؛ وستصلكم سلفة» (Rückgriff/Vorschuss + Sie→جمع + عربون↔سلفة)، و«فوات الإيجار أثناء مدة التجفيف — هل تدفعه التأمين؟» (Mietausfall لا بدل انتفاع)، و«تأمين المنقولات يدفع… حتى يعود المسكن صالحاً للسكن؛ وتخفيض الإيجار على المؤجِّر» (Hausrat=تأمين المنقولات، Wiederbewohnbarkeit، Vermieter=المؤجِّر). لا تحذيرات محتوى جديدة؛ W1–W6 (d-b1-16، d-b1-24، d-b1-25، d-b1-27، d-b2-02.Q0، d-b2-11.L2) تبقى مفتوحة. الألماني/who/الأسئلة/المفاتيح/الإملاءات/الخيارات/الشرح مقفلة لم تُعدَّل."},
 "limits": {"cefr": "لم يُعد تقييم CEFR أو النسبة.", "audio": "لا استماع ولا توليد صوتي.", "human": "ليست مراجعة بشرية.",
            "legal": "سياق قانوني/إداري عام (إعانات والدية، إقرار ضريبي، مطالبات تأمين): التصحيحات لغوية-مصطلحية، وليست مشورة قانونية أو ضريبية.",
            "medical": "لا محتوى طبي في هذه الدفعة.",
            "professional": "لا توصيات مالية/مهنية؛ مفردات حوارات إدارية/تأمينية لا نصائح."},
 "gates": {"planned": "K202a–j"},
}
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

md = []
md.append("# مراجعة حوارات B2 دفعة 06: d-b2-16–d-b2-18\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R127 · **البوابات:** K202a–j\n\n")
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
