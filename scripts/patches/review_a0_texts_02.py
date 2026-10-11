#!/usr/bin/env python3
"""Apply the guarded R155 review to ten supplementary A0 reading texts."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path("content/texts.json")
TARGET_IDS = [
    "t-a0-06", "t-a0-07", "t-a0-08", "t-a0-09", "t-a0-10",
    "t-a0-011", "t-a0-012", "t-a0-013", "t-a0-014", "t-a0-015",
]

# (resource id, JSON path, exact old value, exact reviewed value)
EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ("t-a0-06", ("ar",), "هذا فصلي. أتعلم فيه الألمانية. المعلمة اسمها فراوله شولتس وهي لطيفة جداً. في الدورة 12 طالباً من سوريا وتركيا وبولندا وإيطاليا. نتكلم الألمانية معاً، وأحياناً نضحك كثيراً.", "هذا فصلي. أتعلم فيه الألمانية. اسم المعلمة السيدة شولتس، وهي لطيفة جداً. يضمّ الصف 12 طالباً من سوريا وتركيا وبولندا وإيطاليا. نتحدث الألمانية معاً، وأحياناً نضحك كثيراً."),
    ("t-a0-06", ("questions", 0, "explanationAr"), "اسمها Frau Schulz.", "اسمها السيدة شولتس."),

    ("t-a0-07", ("questions", 0, "promptDe"), "Was macht er am Mittwoch?", "Was mache ich am Mittwoch?"),
    ("t-a0-07", ("questions", 0, "promptAr"), "ماذا يفعل الأربعاء؟", "ماذا أفعل يوم الأربعاء؟"),
    ("t-a0-07", ("questions", 0, "options"), ["Er arbeitet.", "Er kauft ein.", "Er sieht fern.", "Er schläft."], ["Ich arbeite.", "Ich kaufe ein.", "Ich sehe fern.", "Ich schlafe."]),
    ("t-a0-07", ("questions", 0, "answer"), "Er kauft ein.", "Ich kaufe ein."),
    ("t-a0-07", ("questions", 0, "explanationAr"), "يتسوّق.", "«Am Mittwoch kaufe ich ein.» — أتسوّق يوم الأربعاء."),
    ("t-a0-07", ("questions", 1, "promptDe"), "Wann besucht die Person ihre Familie?", "Wann besuche ich meine Familie?"),
    ("t-a0-07", ("questions", 1, "promptAr"), "متى يزور المتحدث عائلته؟", "متى أزور عائلتي؟"),
    ("t-a0-07", ("questions", 1, "explanationAr"), "«Am Sonntag besuche ich meine Familie.» — يزور عائلته يوم الأحد.", "«Am Sonntag besuche ich meine Familie.» — أزور عائلتي يوم الأحد."),

    ("t-a0-08", ("questions", 0, "promptDe"), "Was ist sein Lieblingsobst?", "Was ist mein Lieblingsobst?"),
    ("t-a0-08", ("questions", 0, "promptAr"), "ما فاكهته المفضلة؟", "ما فاكهتي المفضلة؟"),
    ("t-a0-08", ("questions", 0, "explanationAr"), "التفاح.", "«Mein Lieblingsobst ist der Apfel.» — فاكهتي المفضلة هي التفاح."),
    ("t-a0-08", ("questions", 1, "promptDe"), "Was isst die Person zum Abendbrot?", "Was esse ich zum Abendbrot?"),
    ("t-a0-08", ("questions", 1, "promptAr"), "ماذا يأكل المتحدث في العشاء؟", "ماذا آكل في وجبة العشاء؟"),
    ("t-a0-08", ("questions", 1, "explanationAr"), "«Zum Abendbrot trinke ich Tee und esse Obst.» — يأكل الفاكهة في العشاء.", "«Zum Abendbrot trinke ich Tee und esse Obst.» — أشرب الشاي وآكل الفاكهة في وجبة العشاء."),

    ("t-a0-09", ("ar",), "أستيقظ في السابعة. أفطر في الثامنة. أبدأ العمل التاسعة. آكل الغداء 12. أذهب للبيت 17. أتعشى 19. أذهب للسرير 23.", "أستيقظ عند السابعة صباحاً. أتناول الفطور عند الثامنة. أبدأ العمل عند التاسعة. أتناول الغداء عند الثانية عشرة ظهراً. أعود إلى البيت عند الخامسة مساءً. أتناول العشاء عند السابعة مساءً. أذهب إلى الفراش عند الحادية عشرة ليلاً."),
    ("t-a0-09", ("questions", 0, "promptDe"), "Wann beginnt er zu arbeiten?", "Wann beginne ich mit der Arbeit?"),
    ("t-a0-09", ("questions", 0, "promptAr"), "متى يبدأ العمل؟", "متى أبدأ العمل؟"),
    ("t-a0-09", ("questions", 0, "options"), ["Um 7", "Um 8", "Um 9", "Um 12"], ["Um 7 Uhr", "Um 8 Uhr", "Um 9 Uhr", "Um 12 Uhr"]),
    ("t-a0-09", ("questions", 0, "answer"), "Um 9", "Um 9 Uhr"),
    ("t-a0-09", ("questions", 0, "explanationAr"), "التاسعة.", "«Um 9 Uhr beginne ich mit der Arbeit.» — أبدأ العمل عند التاسعة."),
    ("t-a0-09", ("questions", 1, "promptDe"), "Wann geht die Person nach Hause?", "Wann gehe ich nach Hause?"),
    ("t-a0-09", ("questions", 1, "promptAr"), "متى يعود المتحدث إلى البيت؟", "متى أعود إلى البيت؟"),
    ("t-a0-09", ("questions", 1, "explanationAr"), "«Um 17 Uhr gehe ich nach Hause.» — يعود إلى البيت في الساعة الخامسة مساءً.", "«Um 17 Uhr gehe ich nach Hause.» — أعود إلى البيت عند الخامسة مساءً."),

    ("t-a0-10", ("ar",), "في الشتاء بارد ويتساقط الثلج، أرتدي سترة سميكة. في الربيع تتفتح الأزهار. في الصيف حار وأذهب للسباحة. في الخريف الأوراق ملونة: أحمر وأصفر وبني. أحب الربيع أكثر من غيره.", "الجو بارد في الشتاء ويتساقط الثلج. أرتدي سترة سميكة. تتفتح الأزهار في الربيع. الجو حار في الصيف وأذهب للسباحة. أوراق الأشجار ملوّنة في الخريف: حمراء وصفراء وبنية. أحب الربيع أكثر من غيره."),
    ("t-a0-10", ("questions", 0, "promptDe"), "Welche Jahreszeit mag er am liebsten?", "Welche Jahreszeit mag ich am liebsten?"),
    ("t-a0-10", ("questions", 0, "promptAr"), "أي فصل يحب أكثر؟", "أي فصل أحب أكثر؟"),
    ("t-a0-10", ("questions", 0, "explanationAr"), "الربيع.", "«Ich mag den Frühling am liebsten.» — أحب الربيع أكثر من غيره."),
    ("t-a0-10", ("questions", 1, "promptDe"), "Was trägt die Person im Winter?", "Was trage ich im Winter?"),
    ("t-a0-10", ("questions", 1, "promptAr"), "ماذا يرتدي المتحدث في الشتاء؟", "ماذا أرتدي في الشتاء؟"),
    ("t-a0-10", ("questions", 1, "explanationAr"), "«Ich trage eine dicke Jacke.» — يرتدي سترة سميكة.", "«Ich trage eine dicke Jacke.» — أرتدي سترة سميكة."),

    ("t-a0-011", ("questions", 0, "promptDe"), "Was ist in der Schultasche?", "Wie viele Hefte sind in der Schultasche?"),
    ("t-a0-011", ("questions", 0, "promptAr"), "ماذا يوجد في الحقيبة؟", "كم دفتراً في الحقيبة المدرسية؟"),
    ("t-a0-011", ("questions", 0, "options"), ["Ein Apfel", "Drei Hefte und Stifte", "Ein Telefon"], ["Ein Heft", "Zwei Hefte", "Drei Hefte"]),
    ("t-a0-011", ("questions", 0, "answer"), "Drei Hefte und Stifte", "Drei Hefte"),
    ("t-a0-011", ("questions", 0, "explanationAr"), "في النص: drei Hefte, Kugelschreiber, Bleistift.", "في النص: ثلاثة دفاتر."),

    ("t-a0-012", ("ar",), "يوم السبت أستيقظ متأخراً. أشرب القهوة وأقرأ الجريدة. بعد الظهر أتنزه مع كلبي في الحديقة. يوم الأحد أزور أمي. نأكل الكيك معاً ونشرب الشاي. نهاية الأسبوع جميلة.", "أستيقظ في وقت متأخر يوم السبت. أشرب القهوة وأقرأ الجريدة. بعد الظهر أتنزه مع كلبي في الحديقة. يوم الأحد أزور أمي. نأكل الكعك معاً ونشرب الشاي. نهاية الأسبوع جميلة."),
    ("t-a0-012", ("questions", 0, "promptDe"), "Was macht die Person am Sonntag?", "Was mache ich am Sonntag?"),
    ("t-a0-012", ("questions", 0, "promptAr"), "ماذا يفعل الشخص يوم الأحد؟", "ماذا أفعل يوم الأحد؟"),
    ("t-a0-012", ("questions", 0, "options"), ["Die Person arbeitet.", "Die Person besucht die Mutter.", "Die Person schläft den ganzen Tag."], ["Ich arbeite.", "Ich besuche meine Mutter.", "Ich schlafe den ganzen Tag."]),
    ("t-a0-012", ("questions", 0, "answer"), "Die Person besucht die Mutter.", "Ich besuche meine Mutter."),
    ("t-a0-012", ("questions", 0, "explanationAr"), "«Am Sonntag besuche ich meine Mutter.» — يزور الشخص أمه يوم الأحد.", "«Am Sonntag besuche ich meine Mutter.» — أزور أمي يوم الأحد."),
    ("t-a0-012", ("questions", 1, "promptDe"), "Mit welchem Tier geht die Person am Samstag im Park spazieren?", "Mit welchem Tier gehe ich am Samstag im Park spazieren?"),
    ("t-a0-012", ("questions", 1, "promptAr"), "مع أي حيوان يتمشى المتحدث في الحديقة يوم السبت؟", "مع أي حيوان أتمشى في الحديقة يوم السبت؟"),
    ("t-a0-012", ("questions", 1, "options"), ["Mit einer Katze", "Mit einem Hund", "Mit einem Pferd", "Mit einem Vogel"], ["Mit einer Katze", "Mit meinem Hund", "Mit einem Pferd", "Mit einem Vogel"]),
    ("t-a0-012", ("questions", 1, "answer"), "Mit einem Hund", "Mit meinem Hund"),
    ("t-a0-012", ("questions", 1, "explanationAr"), "«Am Nachmittag gehe ich mit meinem Hund im Park spazieren.» — يتمشى مع كلبه.", "«Am Nachmittag gehe ich mit meinem Hund im Park spazieren.» — أتمشى مع كلبي في الحديقة."),

    ("t-a0-013", ("titleDe",), "Das Wetter heute", "Wetterbeispiel: Ein warmer Montag"),
    ("t-a0-013", ("titleAr",), "الطقس اليوم", "مثال عن الطقس: يوم اثنين دافئ"),
    ("t-a0-013", ("de",), "Heute ist Montag. Der Himmel ist blau und die Sonne scheint. Es ist warm, etwa 20 Grad. Ich ziehe ein T-Shirt und eine Jeans an. Ich brauche keine Jacke. Ich freue mich auf den Nachmittag im Garten.", "An einem Montag ist der Himmel blau und die Sonne scheint. Es sind etwa 20 Grad. Ich ziehe ein T-Shirt und eine Jeans an. Ich brauche keine Jacke. Ich freue mich auf den Nachmittag im Garten."),
    ("t-a0-013", ("ar",), "اليوم الإثنين. السماء زرقاء والشمس مشرقة. الجو دافئ، حوالي ٢٠ درجة. ألبس قميصاً وبنطلون جينز. لا أحتاج إلى سترة. أنا متشوق لقضاء بعد الظهر في الحديقة.", "في يوم اثنين، السماء زرقاء والشمس مشرقة. درجة الحرارة نحو 20 درجة. أرتدي قميصاً وبنطال جينز. لا أحتاج إلى سترة. وأتطلع إلى قضاء فترة بعد الظهر في الحديقة."),
    ("t-a0-013", ("questions", 0, "promptDe"), "Welche Temperatur hat es heute?", "Wie warm ist es an diesem Montag?"),
    ("t-a0-013", ("questions", 0, "promptAr"), "كم درجة الحرارة اليوم؟", "كم تبلغ درجة الحرارة يوم الاثنين في هذا المثال؟"),
    ("t-a0-013", ("questions", 0, "explanationAr"), "النص: etwa 20 Grad.", "النص يذكر نحو 20 درجة («etwa 20 Grad»)."),
    ("t-a0-013", ("questions", 1, "promptDe"), "Was zieht die Person an?", "Was ziehe ich an?"),
    ("t-a0-013", ("questions", 1, "promptAr"), "ماذا يرتدي المتحدث؟", "ماذا أرتدي؟"),
    ("t-a0-013", ("questions", 1, "explanationAr"), "«Ich ziehe ein T-Shirt und eine Jeans an.» — يرتدي قميصاً وبنطال جينز.", "«Ich ziehe ein T-Shirt und eine Jeans an.» — أرتدي قميصاً وبنطال جينز."),

    ("t-a0-014", ("ar",), "أحب الذهاب إلى المطعم. اليوم أطلب شوربة وشريحة لحم مع بطاطس. وأشرب معها ماءً. النادل لطيف. الأكل لذيذ جداً. أدفع وأذهب إلى البيت.", "أحب الذهاب إلى المطعم. اليوم أطلب حساءً وقطعة شنيتسل مع البطاطس. وأشرب مع الوجبة كأساً من الماء. النادل ودود. الطعام لذيذ جداً. أدفع الحساب وأعود إلى البيت."),
    ("t-a0-014", ("questions", 0, "promptDe"), "Was trinkt er?", "Was trinke ich dazu?"),
    ("t-a0-014", ("questions", 0, "promptAr"), "ماذا يشرب؟", "ماذا أشرب مع الطعام؟"),
    ("t-a0-014", ("questions", 0, "options"), ["Bier", "Wasser", "Cola"], ["Bier", "Ein Glas Wasser", "Cola"]),
    ("t-a0-014", ("questions", 0, "answer"), "Wasser", "Ein Glas Wasser"),
    ("t-a0-014", ("questions", 0, "explanationAr"), "النص يقول: «Dazu trinke ich ein Glas Wasser.» — ويشرب معه كأساً من الماء.", "«Dazu trinke ich ein Glas Wasser.» — أشرب كأساً من الماء مع الطعام."),
    ("t-a0-014", ("questions", 1, "promptDe"), "Was bestellt die Person zu essen?", "Was bestelle ich zu essen?"),
    ("t-a0-014", ("questions", 1, "promptAr"), "ماذا يطلب المتحدث ليأكل؟", "ماذا أطلب من الطعام؟"),
    ("t-a0-014", ("questions", 1, "explanationAr"), "«Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln.» — يطلب حساءً وشنيتسل مع البطاطس.", "«Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln.» — أطلب حساءً وقطعة شنيتسل مع البطاطس."),

    ("t-a0-015", ("ar",), "أسكن في شقة صغيرة في المدينة. فيها غرفة معيشة وغرفة نوم ومطبخ وحمّام. في غرفة المعيشة كنبة أمام التلفاز. في المطبخ أصنع القهوة. الشقة هادئة ومشرقة.", "أسكن في شقة صغيرة في المدينة. فيها غرفة معيشة وغرفة نوم ومطبخ وحمام. توجد أريكة أمام التلفاز في غرفة المعيشة. أُحضّر القهوة في المطبخ. الشقة هادئة ومشرقة."),
]

# Follow-up refinements: normalize Arabic word order and align remaining questions with first-person passages.
REVISION_EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ("t-a0-011", ("ar",), "عندي حقيبة مدرسية. هي زرقاء وحمراء. في الحقيبة ثلاثة دفاتر وقلم حبر وقلم رصاص وممحاة. عندي أيضاً كتاب لحصة الألمانية. الحقيبة ليست ثقيلة. آخذها كل صباح إلى المدرسة.", "عندي حقيبة مدرسية. هي زرقاء وحمراء. في الحقيبة ثلاثة دفاتر وقلم حبر جاف وقلم رصاص وممحاة. عندي أيضاً كتاب لحصة الألمانية. الحقيبة ليست ثقيلة. آخذها كل صباح إلى المدرسة."),
    ("t-a0-012", ("ar",), "أستيقظ في وقت متأخر يوم السبت. أشرب القهوة وأقرأ الجريدة. بعد الظهر أتنزه مع كلبي في الحديقة. يوم الأحد أزور أمي. نأكل الكعك معاً ونشرب الشاي. نهاية الأسبوع جميلة.", "أستيقظ في وقت متأخر يوم السبت. أشرب القهوة وأقرأ الجريدة. بعد الظهر أتنزه مع كلبي في الحديقة. يوم الأحد أزور أمي. نتناول الكعكة معاً ونشرب الشاي. نهاية الأسبوع جميلة."),
    ("t-a0-07", ("ar",), "الاثنين أذهب إلى العمل. الثلاثاء لدي درس ألمانية. الأربعاء أتسوّق. الخميس أقابل أصدقائي. الجمعة أشاهد التلفاز. السبت أنام طويلاً. الأحد أزور عائلتي.", "أذهب إلى العمل يوم الاثنين. لدي دورة في اللغة الألمانية يوم الثلاثاء. أتسوّق يوم الأربعاء. أقابل أصدقائي يوم الخميس. أشاهد التلفاز يوم الجمعة. أنام وقتاً طويلاً يوم السبت. أزور عائلتي يوم الأحد."),
    ("t-a0-011", ("questions", 1, "promptDe"), "Wohin nimmt die Person die Tasche jeden Morgen?", "Wohin nehme ich die Tasche jeden Morgen?"),
    ("t-a0-011", ("questions", 1, "promptAr"), "إلى أين يأخذ المتحدث الحقيبة كل صباح؟", "إلى أين آخذ الحقيبة كل صباح؟"),
    ("t-a0-011", ("questions", 1, "explanationAr"), "«Ich nehme sie jeden Morgen in die Schule.» — يأخذها إلى المدرسة كل صباح.", "«Ich nehme sie jeden Morgen in die Schule.» — آخذها إلى المدرسة كل صباح."),
    ("t-a0-013", ("ar",), "في يوم اثنين، السماء زرقاء والشمس مشرقة. درجة الحرارة نحو 20 درجة. أرتدي قميصاً وبنطال جينز. لا أحتاج إلى سترة. وأتطلع إلى قضاء فترة بعد الظهر في الحديقة.", "في يوم اثنين تكون السماء زرقاء والشمس مشرقة. تبلغ الحرارة نحو 20 درجة. أرتدي قميصاً وبنطال جينز. لا أحتاج إلى سترة. وأتطلع إلى قضاء فترة بعد الظهر في الحديقة."),
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
        raise SystemExit("duplicate text ids in content/texts.json")
    missing = [item_id for item_id in TARGET_IDS if item_id not in by_id]
    if missing:
        raise SystemExit(f"missing text ids: {missing}")
    for item_id in TARGET_IDS:
        if by_id[item_id].get("level") != "A0":
            raise SystemExit(f"unexpected level for {item_id}: {by_id[item_id].get('level')!r}")

    applied = 0
    final_values = {(item_id, path): final for item_id, path, _old, final in REVISION_EDITS}
    for item_id, path, old, new in EDITS:
        parent, key = get_parent(by_id[item_id], path)
        current = parent[key]
        if current == new or current == final_values.get((item_id, path)):
            continue
        if current != old:
            raise SystemExit(f"unexpected value at {item_id}.{path}: {current!r}")
        parent[key] = new
        applied += 1

    for item_id, path, old, new in REVISION_EDITS:
        parent, key = get_parent(by_id[item_id], path)
        current = parent[key]
        if current == new:
            continue
        if current != old:
            raise SystemExit(f"unexpected revision value at {item_id}.{path}: {current!r}")
        parent[key] = new
        applied += 1

    for item_id in TARGET_IDS:
        item = by_id[item_id]
        if not item.get("de", "").strip() or not item.get("ar", "").strip():
            raise SystemExit(f"empty text in {item_id}")
        for question in item.get("questions", []):
            options = question.get("options", [])
            if question.get("type") != "mc" or len(options) != len(set(options)) or question.get("answer") not in options:
                raise SystemExit(f"invalid MC options/key in {item_id}:{question.get('id')}")

    expected_edits = 75
    if len(EDITS) != 68 or len(REVISION_EDITS) != 7 or len(EDITS) + len(REVISION_EDITS) != expected_edits:
        raise SystemExit(f"expected {expected_edits} guarded transitions, got {len(EDITS) + len(REVISION_EDITS)}")
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R155> applied {applied}/{expected_edits} guarded A0 text transitions; questions verified.")


if __name__ == "__main__":
    main()
