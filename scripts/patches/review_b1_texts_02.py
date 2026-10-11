#!/usr/bin/env python3
"""Apply the guarded R158 review to five uncovered B1 reading texts."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path("content/texts.json")
TARGET_IDS = ["t-b1-31", "t-b1-32", "t-b1-33", "t-b1-34", "t-b1-35"]
EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ('t-b1-31', ('questions', 1, 'explanationAr'), 'الدليل في النص: «Was ich an Leipzig besonders mag, sind die vielen Grünflächen und die günstigen Mieten im Vergleich zu Hamburg.» — المساحات الخضراء والإيجارات الرخيصة.', 'الدليل في النص: «Was ich an Leipzig besonders mag, sind die vielen Grünflächen und die günstigen Mieten im Vergleich zu Hamburg.» — المساحات الخضراء الكثيرة والإيجارات الأقل مقارنة بهامبورغ.'),
    ('t-b1-31', ('titleAr',), 'انتقال إلى مدينة جديدة', 'مثال: الانتقال إلى مدينة جديدة'),
    ('t-b1-31', ('titleDe',), 'Ein Umzug in eine neue Stadt', 'Beispiel: Ein Umzug in eine neue Stadt'),
    ('t-b1-32', ('questions', 1, 'explanationAr'), 'الدليل في النص: «Natürlich muss ich darauf achten, genügend Eisen und Eiweiß zu essen» — الانتباه للحديد والبروتين.', 'الدليل في النص: «Natürlich muss ich darauf achten, genügend Eisen und Eiweiß zu essen» — الحرص على تناول كمية كافية من الحديد والبروتين.'),
    ('t-b1-32', ('questions', 1, 'promptAr'), 'علام يجب أن تنتبه؟', 'ما الذي يجب أن تنتبه إليه؟'),
    ('t-b1-32', ('titleAr',), 'العيش نباتياً — تجربتي', 'مثال: العيش نباتياً — تجربتي'),
    ('t-b1-32', ('titleDe',), 'Vegetarisch leben — meine Erfahrung', 'Beispiel: Vegetarisch leben — meine Erfahrung'),
    ('t-b1-33', ('ar',), 'أجريت الأسبوع الماضي مقابلة عمل في شركة تسويق في كولونيا. كنت متوترة جداً قبلها بأيام. قرأت سيرتي الذاتية مرات عدة، وجمعت معلومات عن الشركة، وتدربت على أسئلة شائعة عن نقاط قوتي وضعفي وخبرتي وتوقعاتي للراتب. وصلت في العاشرة تماماً. كانت المحاوِرة ودودة وقدمت لي الشركة أولاً. سألتني عن دراستي وتدريباتي العملية، وأرادت أن تعرف أيضاً لماذا أريد العمل في هذه الشركة تحديداً. أتيحت لي في النهاية فرصة طرح أسئلتي. سألت عن الفريق وأوقات العمل وإمكانية العمل جزئياً من المنزل. كان يهمني خصوصاً أن أعرف كيف يبدو يوم العمل العادي وما المهام التي سأبدأ بها. أجابت المحاوِرة عن كل الأسئلة. شعرت بعدها بهدوء أكبر. ورغم أنني لم أحصل على قبول بعد، كنت راضية عن المقابلة. بعد ثلاثة أيام وصلتني رسالة إلكترونية: دعوني إلى مقابلة ثانية. أسعدتني الدعوة إلى المقابلة الثانية كثيراً.', 'أجريت الأسبوع الماضي مقابلة عمل في شركة تسويق في كولونيا. كنت متوترة جداً قبلها بأيام. قرأت سيرتي الذاتية مرات عدة، وجمعت معلومات عن الشركة، وتدربت على أسئلة شائعة عن نقاط قوتي وضعفي وخبرتي وتوقعاتي للراتب. وصلت في العاشرة تماماً. كانت المحاوِرة ودودة وقدمت لي الشركة أولاً. سألتني عن دراستي وتدريباتي العملية، وأرادت أن تعرف أيضاً لماذا أريد العمل في هذه الشركة تحديداً. أتيحت لي في النهاية فرصة طرح أسئلتي. سألت عن الفريق وأوقات العمل وإمكانية العمل جزئياً من المنزل. كان يهمني خصوصاً أن أعرف كيف يبدو يوم العمل العادي وما المهام التي سأبدأ بها. أجابت المحاوِرة عن كل الأسئلة. شعرت بعدها بهدوء أكبر. ورغم أنني لم أتلقَّ عرض عمل بعد، كنت راضية عن المقابلة. بعد ثلاثة أيام وصلتني رسالة إلكترونية: دعوني إلى مقابلة ثانية. أسعدتني الدعوة إلى المقابلة الثانية كثيراً.'),
    ('t-b1-33', ('titleAr',), 'مقابلة عمل', 'مثال: مقابلة عمل'),
    ('t-b1-33', ('titleDe',), 'Ein Bewerbungsgespräch', 'Beispiel: Ein Bewerbungsgespräch'),
    ('t-b1-34', ('ar',), 'رأيت أمس حادثاً بسيطاً في طريقي إلى العمل. أراد سائق سيارة أن ينعطف يميناً عند تقاطع، لكنه لم ينتبه إلى راكب دراجة كان يسير إلى الأمام. سقط راكب الدراجة وأُصيب في ركبته. لحسن الحظ كان يرتدي خوذة وظل واعياً. ساعد المارة فوراً واتصلوا بالإسعاف وأبلغوا الشرطة. بقيت امرأة قرب راكب الدراجة، بينما حذّر رجل آخر السيارات من الاقتراب. كان السائق منفعلاً جداً واعتذر مرات عدة. وبعد وقت قصير استطاع راكب الدراجة الوقوف من جديد. تحدث شرطي مع الأطراف وأخذ أقوالهم. لم يعرف أحد في البداية إن كانت الإصابة خطيرة. لذلك انتظر المارة حتى وصلت فرق الإنقاذ. بقيت واقفة قليلاً وتحدثت مع امرأة شاهدت الحادث أيضاً. ثم واصلت طريقي إلى العمل وفكرت في الموقف. وعزّز ذلك لديّ الإحساس بأهمية الانتباه في الطريق، سواء أكنت ماشية أم سائقة. ومنذ ذلك الحين أنتبه كثيراً إلى السيارات التي تنعطف عند التقاطعات.', 'رأيت أمس حادثاً بسيطاً في طريقي إلى العمل. أراد سائق سيارة أن ينعطف يميناً عند تقاطع، لكنه لم ينتبه إلى راكب دراجة كان يقود دراجته في خط مستقيم. سقط راكب الدراجة وأُصيب إصابة طفيفة في ركبته. لحسن الحظ كان يرتدي خوذة وظل واعياً. ساعد المارة فوراً واتصلوا بالإسعاف وأبلغوا الشرطة. بقيت امرأة قرب راكب الدراجة، بينما نبّه رجل آخر السائقين إلى الحادث. كان السائق منفعلاً جداً واعتذر مرات عدة. وبعد وقت قصير استطاع راكب الدراجة الوقوف من جديد. تحدث شرطي مع الأطراف وأخذ أقوالهم. لم يعرف أحد في البداية إن كانت الإصابة خطيرة. لذلك انتظر المارة حتى وصلت فرق الإنقاذ. بقيت واقفة قليلاً وتحدثت مع امرأة شاهدت الحادث أيضاً. ثم واصلت طريقي إلى العمل وفكرت في الموقف. وعزّز ذلك لديّ الإحساس بأهمية الانتباه في الطريق، سواء أكنت ماشية أم سائقة. ومنذ ذلك الحين أنتبه كثيراً إلى السيارات التي تنعطف عند التقاطعات.'),
    ('t-b1-34', ('titleAr',), 'حادث في الطريق', 'مثال: حادث مروري'),
    ('t-b1-34', ('titleDe',), 'Ein Unfall im Straßenverkehr', 'Beispiel: Ein Unfall im Straßenverkehr'),
    ('t-b1-35', ('ar',), 'إلى السادة في هيئة التحرير،\n\nأكتب إليكم لأنني مستاءة من حالة الحديقة العامة في حيي. أرى فيها مراراً نفايات على المروج وفي ملاعب الأطفال: زجاجات فارغة وأكياساً بلاستيكية وأعقاب سجائر وعبوات طعام. ورغم وجود سلال مهملات كافية، يرمي كثير من الناس نفاياتهم على الأرض. هذا ليس قبيحاً فحسب، بل خطير أيضاً على الأطفال والحيوانات. تستخدم العائلات وكبار السن والرياضيون الحديقة. وإذا بقيت النفايات على الأرض، فقد تتأذى الحيوانات منها، كما تصبح الحديقة أقل راحة للجميع. أقترح أن تزيد المدينة أعمال الرقابة وأن تفرض غرامات أعلى. ويمكن أيضاً دعوة الصفوف المدرسية والمتطوعين إلى حملات تنظيف منتظمة. وقد تساعد كذلك إضافة سلال مهملات عند المداخل وبجانب المقاعد. يستطيع الزوار أخذ نفاياتهم معهم وتنبيه الآخرين بلطف. الحديقة المشتركة مهمة للحي لأن الناس يحبون قضاء أوقات فراغهم فيها. لا تبقى الحديقة مكاناً جميلاً للجميع إلا إذا تحمّل كل شخص مسؤوليته.\n\nمع خالص التحية،\nإحدى سكان الحي', 'إلى السادة في هيئة التحرير،\n\nأكتب إليكم لأنني مستاءة من حالة الحديقة العامة في حيي. أرى فيها مراراً نفايات على المروج وفي ملاعب الأطفال: زجاجات فارغة وأكياساً بلاستيكية وأعقاب سجائر وعبوات طعام. ورغم وجود سلال مهملات كافية، يرمي كثير من الناس نفاياتهم على الأرض. هذا ليس قبيحاً فحسب، بل خطير أيضاً على الأطفال والحيوانات. تستخدم العائلات وكبار السن والرياضيون الحديقة. وإذا بقيت النفايات على الأرض، فقد تتأذى الحيوانات منها، كما تصبح الحديقة أقل راحة للجميع. أقترح أن تزيد المدينة أعمال الرقابة وأن تفرض غرامات أعلى. ويمكن أيضاً دعوة الصفوف المدرسية والمتطوعين إلى حملات تنظيف منتظمة. وقد تساعد كذلك إضافة سلال مهملات عند المداخل وبجانب المقاعد. يستطيع الزوار أخذ نفاياتهم معهم وتنبيه الآخرين بلطف. الحديقة العامة مهمة للحي لأن الناس يحبون قضاء أوقات فراغهم فيها. لا تبقى الحديقة مكاناً جميلاً للجميع إلا إذا تحمّل كل شخص مسؤوليته.\n\nمع خالص التحية،\nإحدى سكان الحي'),
    ('t-b1-35', ('questions', 0, 'promptAr'), 'ماذا يقترح الكاتب؟', 'ماذا تقترح كاتبة الرسالة؟'),
    ('t-b1-35', ('questions', 0, 'promptDe'), 'Was schlägt der Autor vor?', 'Was schlägt die Autorin vor?'),
    ('t-b1-35', ('titleAr',), 'رسالة إلى الجريدة: النفايات في الحديقة', 'مثال: رسالة إلى الجريدة: النفايات في الحديقة'),
    ('t-b1-35', ('titleDe',), 'Ein Brief an die Zeitung: Müll im Park', 'Beispiel: Ein Brief an die Zeitung: Müll im Park'),
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
        if not item.get("de", "").strip() or not item.get("ar", "").strip():
            raise SystemExit(f"empty text in {item_id}")
        if len(item.get("questions", [])) != 2:
            raise SystemExit(f"expected exactly two questions in {item_id}")
        for question in item["questions"]:
            options = question.get("options", [])
            if (question.get("type") != "mc" or not question.get("promptDe", "").strip() or
                    not question.get("promptAr", "").strip() or not question.get("explanationAr", "").strip() or
                    len(options) < 2 or len(options) != len(set(options)) or question.get("answer") not in options):
                raise SystemExit(f"invalid MC question/options/key in {item_id}:{question.get('id')}")

    if len(EDITS) != 18 or len({(item_id, path) for item_id, path, _old, _new in EDITS}) != 18:
        raise SystemExit(f"expected 18 unique guarded edits, got {len(EDITS)}")
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R158> applied {applied}/18 guarded B1 text edits; questions verified.")


if __name__ == "__main__":
    main()
