#!/usr/bin/env python3
"""Apply the guarded R156 review to fifteen uncovered A1 reading texts."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path("content/texts.json")
TARGET_IDS = [
    "t-a1-021", "t-a1-022", "t-a1-023", "t-a1-024", "t-a1-025",
    "t-a1-026", "t-a1-027", "t-a1-028", "t-a1-029", "t-a1-030",
    "t-a1-031", "t-a1-032", "t-a1-033", "t-a1-034", "t-a1-035",
]

# Each transition carries an exact old value so unexpected edits are rejected.
EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ('t-a1-023', ('de',), 'Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer. Am Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern. Die Miete ist sechshundert Euro warm. Die Wohnung liegt nahe an einer Bushaltestelle. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung.', 'Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer. Am Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern. Die Warmmiete beträgt sechshundert Euro. Die Wohnung liegt nahe an einer Bushaltestelle. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung.'),
    ('t-a1-023', ('ar',), 'شقتي ليست كبيرة لكنها مشرقة جداً. فيها غرفتان ومطبخ وحمّام وشرفة صغيرة. في غرفة المعيشة أريكة وطاولة وتلفاز. أنام مع زوجتي في إحدى الغرف. والغرفة الثانية مكتبنا. يدخل ضوء كثير من النوافذ صباحاً. أطبخ كل مساء في المطبخ. وهناك أيضاً طاولة صغيرة وأربعة كراسٍ. في الشرفة كرسيان وكثير من الزهور. أحب تناول الفطور هناك في الصيف. الإيجار الشامل للتدفئة ستمئة يورو. تقع الشقة قرب موقف حافلات. يزورنا أصدقاؤنا في نهاية الأسبوع ونشرب القهوة في غرفة المعيشة. أنا راضٍ جداً عن شقتي.', 'شقتي ليست كبيرة لكنها مشرقة جداً. فيها غرفتان ومطبخ وحمام وشرفة صغيرة. في غرفة المعيشة أريكة وطاولة وتلفاز. أنام مع زوجتي في إحدى الغرف. والغرفة الثانية مكتبنا. يدخل ضوء كثير من النوافذ صباحاً. أطبخ كل مساء في المطبخ. وهناك أيضاً طاولة صغيرة وأربعة كراسٍ. في الشرفة كرسيان وكثير من الزهور. أحب تناول الفطور هناك في الصيف. يبلغ الإيجار الشامل (Warmmiete) ستمئة يورو. تقع الشقة قرب موقف حافلات. يزورنا أصدقاؤنا في نهاية الأسبوع ونشرب القهوة في غرفة المعيشة. أنا راضٍ جداً عن شقتي.'),
    ('t-a1-023', ('questions', 1, 'promptDe'), 'Wie hoch ist die Miete warm?', 'Wie hoch ist die Warmmiete?'),
    ('t-a1-023', ('questions', 1, 'promptAr'), 'كم الإيجار شاملاً التدفئة؟', 'كم تبلغ قيمة الإيجار الشامل؟'),
    ('t-a1-023', ('questions', 1, 'explanationAr'), 'الدليل في النص: «Die Miete ist sechshundert Euro warm.» — الإيجار 600 يورو warm.', '«Die Warmmiete beträgt sechshundert Euro.» — الإيجار الشامل يبلغ 600 يورو.'),
    ('t-a1-025', ('de',), 'Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser. Die Äpfel sind heute im Angebot. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter. Dann gehe ich zur Kasse. Vor mir stehen zwei Personen. Die Verkäuferin sagt: „Guten Tag.“ An der Kasse bezahle ich mit Karte. Sie gibt mir den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank.', 'Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser. Die Äpfel sind heute im Angebot. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter. Dann gehe ich zur Kasse. Vor mir stehen zwei Personen. Die Verkäuferin sagt: „Guten Tag.“ An der Kasse bezahle ich mit Karte. Die Verkäuferin gibt mir den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank.'),
    ('t-a1-025', ('ar',), 'اليوم أذهب إلى السوبرماركت. أحتاج إلى الحليب والخبز والبيض والتفاح والجبن. المتجر كبير وفيه منتجات كثيرة. أبحث عن الحليب أولاً، ثم آخذ الخبز والبيض. أشتري أيضاً الطماطم وزجاجة ماء. التفاح عليه عرض اليوم. أقارن الأسعار وآخذ كيساً صغيراً معي. ألتقي جارتي في المتجر. نتحدث قليلاً عن الطقس. ثم أذهب إلى الصندوق. يقف أمامي شخصان. تقول البائعة: «مرحباً». أدفع بالبطاقة عند الصندوق وتعطيني الإيصال. المجموع اثنا عشر يورو. في البيت أضع الحليب والماء في الثلاجة، وأضع الخبز في الخزانة.', 'اليوم أذهب إلى السوبرماركت. أحتاج إلى الحليب والخبز والبيض والتفاح والجبن. المتجر كبير وفيه منتجات كثيرة. أبحث عن الحليب أولاً، ثم آخذ الخبز والبيض. أشتري أيضاً الطماطم وزجاجة ماء. التفاح عليه عرض اليوم. أقارن الأسعار وآخذ كيساً صغيراً معي. ألتقي جارتي في المتجر. نتحدث قليلاً عن الطقس. ثم أذهب إلى الصندوق. يقف أمامي شخصان. تقول البائعة: «مرحباً». أدفع بالبطاقة عند الصندوق، ثم تعطيني البائعة الإيصال. المجموع اثنا عشر يورو. في البيت أضع الحليب والماء في الثلاجة، وأضع الخبز في الخزانة.'),
    ('t-a1-029', ('ar',), 'أرتدي اليوم بنطال جينز أزرق وقميصاً أبيض وحذاءً أسود. أرتدي في الشتاء سترة دافئة، وأحياناً وشاحاً وقفازات أيضاً. ألبس في الصيف سراويل قصيرة وقمصاناً قصيرة الأكمام. أحب في البيت ارتداء بنطال مريح وقميص قديم. لا أحتاج إلى ملابس خاصة للعمل. أذهب يوم السبت مع صديقتي إلى متجر. تبحث هي عن فستان وأحتاج أنا إلى جوارب جديدة. أجرب سترة خضراء في المتجر. إنها تناسبني لكنها غالية قليلاً. لا أشتريها. نعود إلى البيت بالحافلة في النهاية.', 'أرتدي اليوم بنطال جينز أزرق وقميصاً أبيض وزوجاً من الأحذية السوداء. أرتدي في الشتاء سترة دافئة، وأحياناً وشاحاً وقفازات أيضاً. ألبس في الصيف سراويل قصيرة وقمصاناً قصيرة الأكمام. أحب في البيت ارتداء بنطال مريح وقميص قديم. لا أحتاج إلى ملابس خاصة للعمل. أذهب يوم السبت مع صديقتي إلى متجر. تبحث هي عن فستان وأحتاج أنا إلى جوارب جديدة. أجرب سترة خضراء في المتجر. إنها تناسبني لكنها غالية قليلاً. لا أشتريها. نعود إلى البيت بالحافلة في النهاية.'),
    ('t-a1-030', ('de',), 'Heute bin ich beim Arzt. Ich habe seit zwei Tagen Kopfschmerzen. Die Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh und ich habe ein bisschen Fieber.“ Sie untersucht mich und sagt: „Das ist eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“ In der Praxis warten noch drei Personen. Ich sitze im Wartezimmer und lese eine Zeitschrift. Nach zwanzig Minuten ruft mich die Ärztin. Sie fragt: „Haben Sie auch Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie misst meine Temperatur. Dann schreibt sie ein Rezept. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir besser.', 'Heute bin ich bei der Ärztin. Ich habe seit zwei Tagen Kopfschmerzen. Die Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh und ich habe ein bisschen Fieber.“ Sie untersucht mich und sagt: „Vielleicht ist es eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“ In der Praxis warten noch drei Personen. Ich sitze im Wartezimmer und lese eine Zeitschrift. Nach zwanzig Minuten ruft mich die Ärztin. Sie fragt: „Haben Sie auch Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie misst meine Temperatur. Dann schreibt sie ein Rezept. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir besser.'),
    ('t-a1-030', ('ar',), 'أنا في عيادة الطبيبة اليوم. أعاني من الصداع منذ يومين. تسأل الطبيبة: «ماذا يؤلمك؟» أجيب: «رأسي يؤلمني وعندي حمى خفيفة.» تفحصني وتقول: «إنها نزلة برد. اشرب الكثير من الماء واسترح.» ينتظر ثلاثة أشخاص آخرون في العيادة. أجلس في غرفة الانتظار وأقرأ مجلة. تناديني الطبيبة بعد عشرين دقيقة. تسأل: «هل لديك سعال أيضاً؟» أقول: «قليلاً، لكن حلقي لا يؤلمني.» تقيس حرارتي. ثم تكتب وصفة. أشتري الأقراص من الصيدلية. أشرب الماء في البيت وأذهب إلى النوم باكراً. أشعر بتحسن في صباح اليوم التالي.', 'أنا عند الطبيبة اليوم. أعاني من الصداع منذ يومين. تسألني الطبيبة: «ماذا يؤلمك؟» أجيب: «رأسي يؤلمني وعندي حمى خفيفة.» تفحصني وتقول: «ربما تكون نزلة برد. اشرب الكثير من الماء واسترح.» ينتظر ثلاثة أشخاص آخرون في العيادة. أجلس في غرفة الانتظار وأقرأ مجلة. تناديني الطبيبة بعد عشرين دقيقة. تسألني: «هل لديك سعال أيضاً؟» أقول: «قليلاً، لكن حلقي لا يؤلمني.» تقيس حرارتي. ثم تكتب وصفة طبية. أشتري الأقراص من الصيدلية. أشرب الماء في البيت وأذهب إلى النوم باكراً. أشعر بتحسن في صباح اليوم التالي.'),
    ('t-a1-032', ('questions', 0, 'promptDe'), 'Was macht die Person am Samstag?', 'Was mache ich am Samstag?'),
    ('t-a1-032', ('questions', 0, 'promptAr'), 'ماذا يفعل المتحدث يوم السبت؟', 'ماذا أفعل يوم السبت؟'),
    ('t-a1-032', ('questions', 0, 'options'), ['Sie putzt die Wohnung und kauft ein', 'Sie fährt zur Arbeit', 'Sie besucht einen Arzt'], ['Ich putze die Wohnung und kaufe ein', 'Ich fahre zur Arbeit', 'Ich besuche einen Arzt']),
    ('t-a1-032', ('questions', 0, 'answer'), 'Sie putzt die Wohnung und kauft ein', 'Ich putze die Wohnung und kaufe ein'),
    ('t-a1-032', ('questions', 0, 'explanationAr'), 'الدليل في النص: «Dann putze ich die Wohnung und kaufe ein.» — ينظف الشقة ويتسوق بعد الإفطار يوم السبت.', '«Dann putze ich die Wohnung und kaufe ein.» — أنظف الشقة وأتسوّق يوم السبت.'),
    ('t-a1-032', ('questions', 1, 'promptDe'), 'Was macht die Person am Sonntagabend?', 'Was mache ich am Sonntagabend?'),
    ('t-a1-032', ('questions', 1, 'promptAr'), 'ماذا يفعل المتحدث مساء الأحد؟', 'ماذا أفعل مساء الأحد؟'),
    ('t-a1-032', ('questions', 1, 'options'), ['Sie kocht und bereitet ihre Sachen für Montag vor', 'Sie geht ins Kino', 'Sie arbeitet im Supermarkt'], ['Ich koche und bereite meine Sachen für Montag vor', 'Ich gehe ins Kino', 'Ich arbeite im Supermarkt']),
    ('t-a1-032', ('questions', 1, 'answer'), 'Sie kocht und bereitet ihre Sachen für Montag vor', 'Ich koche und bereite meine Sachen für Montag vor'),
    ('t-a1-032', ('questions', 1, 'explanationAr'), 'الدليل في النص: «Danach bereite ich meine Sachen für Montag vor.» — تحضّر أشياءها ليوم الاثنين بعد أن تطهو.', '«Am Sonntagabend koche ich etwas Leckeres. Danach bereite ich meine Sachen für Montag vor.» — أطبخ شيئاً لذيذاً مساء الأحد، ثم أجهّز أشيائي ليوم الاثنين.'),
    ('t-a1-034', ('questions', 0, 'explanationAr'), 'الدليل في النص: «Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab.» — بعد الإشارة انعطف يساراً.', 'الدليل في النص: «Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab.» — سر مباشرةً حتى الإشارة ثم انعطف يساراً عندها.'),
    ('t-a1-035', ('de',), 'Heute habe ich Geburtstag und bin dreißig Jahre alt. Ich habe sechs Freunde zum Geburtstag eingeladen. Sie kommen am Nachmittag um vier Uhr. Sie bringen Geschenke: ein Buch, eine Flasche Wein und eine Karte. Meine Frau hat einen Kuchen gebacken. Wir essen zusammen Kuchen und trinken Kaffee. Es ist ein schöner Tag und ich bin sehr glücklich. Auf dem Tisch stehen Teller, Tassen und Saft. Meine Mutter ruft an und gratuliert mir. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Wir machen ein Foto im Garten. Am Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg. Ich bin müde, aber zufrieden.', 'Heute habe ich Geburtstag und bin dreißig Jahre alt. Ich habe sechs Freunde zum Geburtstag eingeladen. Sie kommen am Nachmittag um vier Uhr. Sie bringen Geschenke: ein Buch, eine Flasche Wein und eine Karte. Meine Frau hat einen Kuchen gebacken. Wir essen zusammen Kuchen und trinken Kaffee. Es ist ein schöner Tag und ich bin sehr glücklich. Auf dem Tisch stehen Teller und Tassen. Es gibt auch Saft. Meine Mutter ruft an und gratuliert mir. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Wir machen ein Foto im Garten. Am Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg. Ich bin müde, aber zufrieden.'),
    ('t-a1-035', ('ar',), 'اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين وعصير. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي باقة زهور أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أرتب الفناجين. أنا متعب لكنني راضٍ.', 'اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين. وهناك عصير أيضاً. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي زهوراً أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أرتب الفناجين. أنا متعب لكنني راضٍ.'),
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
        if by_id[item_id].get("level") != "A1":
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
        for question in item.get("questions", []):
            options = question.get("options", [])
            if (question.get("type") != "mc" or not question.get("promptDe", "").strip() or
                    not question.get("promptAr", "").strip() or not question.get("explanationAr", "").strip() or
                    len(options) < 2 or len(options) != len(set(options)) or question.get("answer") not in options):
                raise SystemExit(f"invalid MC question/options/key in {item_id}:{question.get('id')}")

    if len(EDITS) != 23 or len({(item_id, path) for item_id, path, _old, _new in EDITS}) != 23:
        raise SystemExit(f"expected 23 unique guarded edits, got {len(EDITS)}")
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R156> applied {applied}/23 guarded A1 text edits; questions verified.")


if __name__ == "__main__":
    main()
