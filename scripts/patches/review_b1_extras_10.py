#!/usr/bin/env python3
"""Apply the narrowly scoped R153 review to the five supplementary B1 resources."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path("content/dialogues.json")
TARGET_IDS = [
    "dlg-b1-kontoeroeffnung",
    "hoer-b1-01",
    "d-b1-ht01",
    "d-b1-ht02",
    "d-b1-ht03",
]

# Each edit is an exact, guarded field transition. Re-running the script is safe.
EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ("dlg-b1-kontoeroeffnung", ("lines", 0, "ar"), "نهارك سعيد! أريد فتح حساب جارٍ من فضلك.", "مرحباً! أودّ فتح حساب جارٍ."),
    ("dlg-b1-kontoeroeffnung", ("lines", 1, "ar"), "نهارك سعيد! أحضر معك بطاقتك الشخصية أو جواز سفرك وشهادة التسجيل في السكن من فضلك.", "مرحباً! يُرجى إحضار بطاقة هويتك أو جواز سفرك، بالإضافة إلى شهادة تسجيل السكن."),
    ("dlg-b1-kontoeroeffnung", ("lines", 2, "ar"), "نعم، هذه بطاقتي وشهادة التسجيل.", "نعم، تفضّلي؛ هذه بطاقة هويتي وشهادة تسجيل السكن."),
    ("dlg-b1-kontoeroeffnung", ("lines", 3, "ar"), "شكراً. هل تريد إدارة الحساب عبر الإنترنت أم تأتي بانتظام إلى الفرع؟", "شكراً. هل تفضّلين إدارة الحساب عبر الإنترنت أم زيارة الفرع بانتظام؟"),
    ("dlg-b1-kontoeroeffnung", ("lines", 4, "ar"), "عبر الإنترنت من فضلك. هل توجد رسوم شهرية؟", "أفضل إدارة الحساب عبر الإنترنت. هل توجد رسوم شهرية؟"),
    ("dlg-b1-kontoeroeffnung", ("lines", 5, "ar"), "الحساب الجاري مجاني للطلاب والمتدربين. خلاف ذلك يكلّف 4.90 يورو شهرياً.", "الحساب الجاري مجاني للطلاب والمتدربين. أما سائر العملاء فيدفعون 4.90 يورو شهرياً."),
    ("dlg-b1-kontoeroeffnung", ("lines", 7, "ar"), "ممتاز. املأ من فضلك هذه الاستمارة. ستصلك البطاقة والرمز السري بالبريد خلال أسبوع تقريباً.", "ممتاز. يُرجى ملء هذه الاستمارة. وستصلك البطاقة والرقم السري بالبريد خلال أسبوع تقريباً."),
    ("dlg-b1-kontoeroeffnung", ("questions", 0, "promptDe"), "Welche Dokumente braucht die Kundin?", "Welche Unterlagen soll die Kundin zu Beginn mitbringen?"),
    ("dlg-b1-kontoeroeffnung", ("questions", 0, "promptAr"), "ما الوثائق التي تحتاجها الزبونة؟", "ما المستندات التي ينبغي للزبونة إحضارها في بداية المحادثة؟"),
    ("dlg-b1-kontoeroeffnung", ("questions", 0, "explanationAr"), "الدليل: طلبت الموظفة بطاقة الهوية أو جواز السفر وشهادة تسجيل السكن. الفخّ: شهادة القيد الجامعي ذُكرت لإثبات صفة الطالبة، أما الاستمارة والرقم السري فيرتبطان بإجراءات الحساب ولا يحلّان محل الوثيقتين المطلوبتين.", "الدليل: طلبت الموظفة في بداية الحوار بطاقة الهوية أو جواز السفر مع شهادة تسجيل السكن. الفخّ: تظهر شهادة القيد الجامعي لاحقاً لإثبات الدراسة والاستفادة من الإعفاء؛ أما الاستمارة والرقم السري فجزء من الإجراء."),
    ("hoer-b1-01", ("lines", 0, "de"), "Hallo Karim, hier ist Sarah von der Arbeit. Ich rufe an, weil der Termin mit Herrn Becker am Mittwoch leider ausfällt. Er ist krank geworden. Ich habe schon einen neuen Termin für den 18. November um 10 Uhr vorgeschlagen. Bitte sag mir bis morgen Bescheid, ob dir das passt. Ansonsten ruf mich zurück auf dem Handy. Danke, bis dann!", "Hallo Karim, hier ist Sarah von der Arbeit. Ich rufe an, weil der Termin mit Herrn Becker am Mittwoch leider ausfällt. Er ist krank geworden. Ich habe schon einen neuen Termin für den 18. November um 10 Uhr vorgeschlagen. Bitte sag mir bis morgen Bescheid, ob dir das passt. Ansonsten ruf mich bitte auf dem Handy zurück. Danke, bis dann!"),
    ("hoer-b1-01", ("lines", 0, "ar"), "مرحباً كريم، سارة من العمل. أتصل لأن موعد الأربعاء مع السيد بيكر أُلغيَ، فهو مريض. اقترحتُ موعداً جديداً في 18 نوفمبر الساعة 10. من فضلك أبلغني بحلول الغد إن كان يناسبك، وإلا فاتصل بي على الجوال. شكراً، إلى اللقاء.", "مرحباً كريم، معك سارة من العمل. أتصل بك لأن موعد الأربعاء مع السيد بيكر لن يُعقد؛ فقد مرض. اقترحت بالفعل موعداً بديلاً في 18 نوفمبر عند الساعة العاشرة. يُرجى إبلاغي بحلول الغد إن كان يناسبك. وإلا فاتصل بي على هاتفي المحمول. شكراً، إلى اللقاء!"),
    ("hoer-b1-01", ("dictation", 0), "Ich habe schon einen neuen Termin für den 18. November vorgeschlagen.", "Ich habe schon einen neuen Termin für den 18. November um 10 Uhr vorgeschlagen."),
    ("d-b1-ht01", ("lines", 0, "de"), "Am morgigen Dienstag werden Busse und Bahnen in der Stadt wegen eines Warnstreiks der Gewerkschaft Verdi nur eingeschränkt fahren.", "Am morgigen Dienstag werden Busse und Bahnen in der Stadt wegen eines Warnstreiks einer Gewerkschaft nur eingeschränkt fahren."),
    ("d-b1-ht01", ("lines", 0, "ar"), "غداً الثلاثاء، ستسير الحافلات والقطارات في المدينة بشكل محدود بسبب إضراب تحذيري لنقابة فيردي.", "غداً الثلاثاء، ستعمل الحافلات والقطارات في المدينة على نحو محدود بسبب إضراب تحذيري تنظمه إحدى النقابات."),
    ("d-b1-ht01", ("lines", 1, "de"), "Besonders die U-Bahn-Linien U1 und U3 sind betroffen. Die S-Bahn soll nach Angaben der Deutschen Bahn fast vollständig fahren. Der Streik dauert von 4 bis 10 Uhr.", "Besonders die U-Bahn-Linien U1 und U3 sind betroffen. Die S-Bahn soll nach Angaben des Verkehrsunternehmens fast vollständig fahren. Der Streik dauert von 4 bis 10 Uhr morgens."),
    ("d-b1-ht01", ("lines", 1, "ar"), "خطوط المترو U1 وU3 هي الأكثر تأثراً، بينما قطارات الـS-Bahn تسير شبه كاملة حسب تصريحات دويتشه بان. الإضراب من الساعة ٤ حتى ١٠ صباحاً.", "وتتأثر خصوصاً خطوط المترو U1 وU3. ومن المتوقع أن تستمر خدمة قطارات إس-بان بصورة شبه كاملة، وفقاً لشركة النقل. ويستمر الإضراب من الرابعة حتى العاشرة صباحاً."),
    ("d-b1-ht01", ("dictation", 0), "Am morgigen Dienstag werden Busse und Bahnen in der Stadt wegen eines Warnstreiks der Gewerkschaft Verdi nur eingeschränkt fahren.", "Am morgigen Dienstag werden Busse und Bahnen in der Stadt wegen eines Warnstreiks einer Gewerkschaft nur eingeschränkt fahren."),
    ("d-b1-ht02", ("lines", 0, "de"), "Sehr geehrte Fahrgäste, wir bitten die Verspätung von etwa 15 Minuten zu entschuldigen. Grund sind Personen auf der Strecke, die die Bundespolizei gerade wegschickt.", "Sehr geehrte Fahrgäste, wir bitten Sie, die Verspätung von etwa 15 Minuten zu entschuldigen. Grund sind Personen auf der Strecke, die die Polizei gerade wegschickt."),
    ("d-b1-ht02", ("lines", 0, "ar"), "أيها الركاب، نعتذر عن التأخير بنحو ١٥ دقيقة بسبب أشخاص على السكة وتقوم الشرطة الاتحادية بإبعادهم.", "أيها الركاب، نعتذر عن تأخير يقارب 15 دقيقة. سببه وجود أشخاص على السكة تعمل الشرطة على إبعادهم حالياً."),
    ("d-b1-ht02", ("lines", 1, "ar"), "سنصل إلى المحطة الرئيسية حوالي ١٧:٤٥. ربط هامبورغ مهدد بسبب التأخير.", "من المتوقع أن نصل إلى المحطة الرئيسية للقطارات عند 17:45. ويهدد ذلك إمكانية اللحاق بقطار الربط إلى هامبورغ."),
    ("d-b1-ht02", ("questions", 0, "promptAr"), "لماذا القطار متأخر؟", "ما سبب تأخر القطار؟"),
    ("d-b1-ht02", ("questions", 0, "explanationAr"), "الدليل: ذُكر تأخير بنحو 15 دقيقة، وسببه أشخاص على السكة تُبعدهم الشرطة الاتحادية. الفخّ: لا يعزو الإعلان التأخير إلى عطل تقني أو طقس سيئ.", "الدليل: ذُكر تأخير بنحو 15 دقيقة، وسببه وجود أشخاص على السكة تعمل الشرطة على إبعادهم. الفخّ: لا يعزو الإعلان التأخير إلى عطل تقني أو سوء الطقس."),
    ("d-b1-ht02", ("dictation", 0), "Sehr geehrte Fahrgäste, wir bitten die Verspätung von etwa 15 Minuten zu entschuldigen.", "Sehr geehrte Fahrgäste, wir bitten Sie, die Verspätung von etwa 15 Minuten zu entschuldigen."),
    ("d-b1-ht03", ("lines", 1, "ar"), "الغابة مخزن مهم لثاني أكسيد الكربون ومسكن للحيوانات. نحتاج حافلات وقطارات أكثر لا طرقاً جديدة. على الحكومة الاستثمار في النقل العام.", "الغابة مستودع مهم للكربون وموطن لكثير من الحيوانات. وبدلاً من إنشاء طرق سريعة جديدة، نحتاج إلى مزيد من خدمات الحافلات والقطارات. وينبغي للحكومة الاستثمار في النقل العام."),
    ("d-b1-ht03", ("lines", 2, "ar"), "لكن الطريق سيُخفف الزحام.", "لكن الطريق السريع قد يخفف الضغط على حركة المرور."),
    ("d-b1-ht03", ("lines", 3, "de"), "Studien zeigen: Neue Straßen ziehen mehr Autos an – nach fünf Jahren ist der Stau zurück. Nur öffentlicher Verkehr hilft dauerhaft.", "Ich befürchte, dass neue Straßen noch mehr Autos anziehen. Dann könnte der Stau später zurückkehren. Meiner Meinung nach ist ein besseres Angebot im öffentlichen Verkehr eine langfristige Lösung."),
    ("d-b1-ht03", ("lines", 3, "ar"), "الطرق الجديدة تجذب سيارات أكثر فيعود الازدحام بعد 5 سنوات. النقل العام وحده هو الحل الدائم.", "أخشى أن تجذب الطرق الجديدة مزيداً من السيارات. وقد يعود الازدحام لاحقاً. وفي رأيي، يشكّل تحسين خدمات النقل العام حلاً على المدى الطويل."),
    ("d-b1-ht03", ("questions", 0, "promptAr"), "ماذا تقترح نويمان؟", "ماذا تقترح السيدة نويمان؟"),
    ("d-b1-ht03", ("questions", 0, "explanationAr"), "الدليل: دعت إلى مزيد من الحافلات والقطارات والاستثمار في النقل العام، وقالت إن الطرق الجديدة تجلب سيارات أكثر. الفخّ: حركة السيارات والطرق وردت في النقاش، لكن اقتراحها المحدد هو تعزيز النقل العام.", "الدليل: تدعو إلى مزيد من الحافلات والقطارات والاستثمار في النقل العام، وتقول إنها تخشى أن تجذب الطرق الجديدة سيارات أكثر. الفخّ: الحديث عن إنشاء الطريق السريع لا يعني أنه اقتراحها؛ اقتراحها هو تعزيز النقل العام."),
]


def get_parent(root: Any, path: tuple[Any, ...]) -> tuple[Any, Any]:
    node = root
    for key in path[:-1]:
        node = node[key]
    return node, path[-1]


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data}
    if len(by_id) != len(data):
        raise SystemExit("duplicate dialogue ids in content/dialogues.json")
    missing = [item for item in TARGET_IDS if item not in by_id]
    if missing:
        raise SystemExit(f"missing target ids: {missing}")
    for item_id in TARGET_IDS:
        if by_id[item_id].get("level") != "B1":
            raise SystemExit(f"unexpected level for {item_id}: {by_id[item_id].get('level')!r}")

    applied = 0
    for item_id, path, old, new in EDITS:
        parent, key = get_parent(by_id[item_id], path)
        current = parent[key]
        if current == new:
            continue
        if current != old:
            raise SystemExit(f"unexpected value at {item_id}.{path}: {current!r}")
        parent[key] = new
        applied += 1

    for item_id in TARGET_IDS:
        item = by_id[item_id]
        for question in item.get("questions", []):
            options = question.get("options", [])
            if question.get("type") != "mc" or len(options) != len(set(options)) or question.get("answer") not in options:
                raise SystemExit(f"invalid MC options/key in {item_id}:{question.get('id')}")
        for part in item.get("dictation", []):
            if not any(part in line.get("de", "") for line in item.get("lines", [])):
                raise SystemExit(f"dictation is not an exact German line fragment in {item_id}: {part!r}")

    if len(EDITS) != 30:
        raise SystemExit(f"expected 30 guarded edits, got {len(EDITS)}")
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R153> applied {applied}/{len(EDITS)} guarded B1 content edits; questions/dictation verified.")


if __name__ == "__main__":
    main()
