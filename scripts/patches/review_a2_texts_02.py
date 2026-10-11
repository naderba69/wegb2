#!/usr/bin/env python3
"""Apply the guarded R157 review to twelve uncovered A2 reading texts."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path("content/texts.json")
TARGET_IDS = [
    "t-a2-21", "t-a2-22", "t-a2-23", "t-a2-24", "t-a2-25", "t-a2-26",
    "t-a2-27", "t-a2-28", "t-a2-29", "t-a2-30", "t-a2-031", "t-a2-032",
]

# Exact source values guard every content transition.
EDITS: list[tuple[str, tuple[Any, ...], Any, Any]] = [
    ('t-a2-031', ('questions', 0, 'answer'), 'Wegen einer neuen Stelle und niedrigeren Mieten', 'Wegen einer neuen Stelle und der hohen Miete in München'),
    ('t-a2-031', ('questions', 0, 'explanationAr'), 'الدليل في النص: «Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch» — وجدت وظيفة جديدة وكانت إيجارات ميونخ عالية.', 'الدليل في النص: «Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch.» — وجدت وظيفة جديدة، وكان إيجار ميونخ مرتفعاً أكثر من اللازم.'),
    ('t-a2-031', ('questions', 0, 'options'), ['Wegen einer neuen Stelle und niedrigeren Mieten', 'Wegen des Wetters', 'Weil ihre Familie dort wohnt'], ['Wegen einer neuen Stelle und der hohen Miete in München', 'Wegen des Wetters', 'Weil ihre Familie dort wohnt']),
    ('t-a2-031', ('titleAr',), 'انتقال إلى لايبزيغ', 'مثال: الانتقال إلى لايبزيغ'),
    ('t-a2-031', ('titleDe',), 'Ein Umzug nach Leipzig', 'Beispiel: Ein Umzug nach Leipzig'),
    ('t-a2-032', ('titleAr',), 'يوم صحي', 'روتين يومي صحي'),
    ('t-a2-21', ('ar',), 'اسمي لينا. لديّ اليوم موعد مع الدكتور مولر. أشعر بتوعّك منذ ثلاثة أيام. لديّ سعال وزكام ورأسي يؤلمني. أكون في العيادة عند التاسعة. يجب أولاً أن أُظهر بطاقة التأمين عند الاستقبال. ثم أنتظر في غرفة الانتظار. بعد خمس عشرة دقيقة تناديني المساعدة الطبية. يقيس الطبيب حرارتي ويستمع إلى رئتيّ. يقول إن لديّ إنفلونزا. يكتب لي وصفة وينصحني بشرب الكثير من الشاي والبقاء في السرير يومين. تشرح لي المساعدة الطبية في أي صيدلية أستطيع صرف الوصفة. أشتري الأقراص من هناك لاحقاً. أخبر مديري على الهاتف أنني مريضة ولن أذهب إلى العمل اليوم. ثم أعود مباشرة إلى البيت. أستريح وأشرب كوباً من الشاي. إذا لم أشعر بتحسن غداً، أتصل بالعيادة مرة أخرى.', 'اسمي لينا. لديّ اليوم موعد مع الدكتور مولر. أشعر بتوعّك منذ ثلاثة أيام. لديّ سعال وزكام ورأسي يؤلمني. أكون في العيادة عند التاسعة. يجب أولاً أن أُظهر بطاقة التأمين عند الاستقبال. ثم أنتظر في غرفة الانتظار. بعد خمس عشرة دقيقة تناديني المساعدة الطبية. يقيس الطبيب حرارتي ويستمع إلى رئتيّ. يرجّح الطبيب إصابتي بالإنفلونزا. يكتب لي وصفة وينصحني بشرب الكثير من الشاي والبقاء في السرير يومين. تشرح لي المساعدة الطبية في أي صيدلية أستطيع صرف الوصفة. أشتري الأقراص من هناك لاحقاً. أخبر مديري على الهاتف أنني مريضة ولن أذهب إلى العمل اليوم. ثم أعود مباشرة إلى البيت. أستريح وأشرب كوباً من الشاي. إذا لم أشعر بتحسن غداً، أتصل بالعيادة مرة أخرى.'),
    ('t-a2-21', ('de',), 'Mein Name ist Lina. Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um neun Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Er sagt, ich habe eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben. Die Arzthelferin erklärt mir, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Ich sage meinem Chef am Telefon, dass ich krank bin und heute nicht zur Arbeit komme. Danach fahre ich direkt nach Hause. Ich ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an.', 'Mein Name ist Lina. Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um neun Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Der Arzt vermutet eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben. Die Arzthelferin erklärt mir, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Ich sage meinem Chef am Telefon, dass ich krank bin und heute nicht zur Arbeit komme. Danach fahre ich direkt nach Hause. Ich ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an.'),
    ('t-a2-21', ('titleAr',), 'موعد لينا عند الطبيب والإنفلونزا', 'موعد لينا عند الطبيب: اشتباه بالإنفلونزا'),
    ('t-a2-21', ('titleDe',), 'Linas Arzttermin und Grippe', 'Linas Arzttermin: Verdacht auf Grippe'),
    ('t-a2-23', ('titleAr',), 'وصف الطريق إلى المحطة', 'مثال: وصف الطريق إلى المحطة'),
    ('t-a2-23', ('titleDe',), 'Wegbeschreibung zum Bahnhof', 'Beispiel: Wegbeschreibung zum Bahnhof'),
    ('t-a2-24', ('ar',), 'استيقظت يوم السبت في التاسعة. شربت القهوة وقرأت الجريدة أولاً. ثم نظفت الشقة وتسوقت. كان الطقس لطيفاً، لذلك ذهبت إلى السوبرماركت سيراً على الأقدام. اشتريت هناك خبزاً وفاكهة وحليباً. جاءت صديقتي إلى بيتي بعد الظهر. تسكن في الشارع نفسه. ذهبنا معاً إلى مقهى عند الثالثة وتحدثنا كثيراً. طلبنا القهوة أولاً. ثم تحدثنا عن العمل وخططنا للصيف. تناولت العشاء في البيت مع عائلتي مساءً. نمت طويلاً يوم الأحد وتمشيت في الحديقة. استمعت هناك إلى الموسيقى ومشيت دورة حول البحيرة. درست الألمانية مساءً لأن لديّ اختباراً يوم الاثنين. جهزت حقيبتي لليوم التالي قبل النوم. كانت عطلة نهاية أسبوع هادئة وجميلة إجمالاً.', 'استيقظت يوم السبت في التاسعة. شربت القهوة وقرأت الجريدة أولاً. ثم نظفت الشقة وتسوقت. كان الطقس لطيفاً، لذلك ذهبت إلى السوبرماركت سيراً على الأقدام. اشتريت هناك خبزاً وفاكهة وحليباً. جاءت صديقتي إلى بيتي بعد الظهر. تسكن في الشارع نفسه. ذهبنا معاً إلى مقهى عند الثالثة وتحدثنا كثيراً. طلبنا القهوة أولاً. ثم تحدثنا عن العمل وخططنا للصيف. تناولت العشاء في البيت مع عائلتي مساءً. نمت طويلاً يوم الأحد وتمشيت في الحديقة. استمعت هناك إلى الموسيقى وقمت بجولة حول البحيرة. درست الألمانية مساءً لأن اختباري كان يوم الاثنين. جهزت حقيبتي لليوم التالي قبل النوم. كانت عطلة نهاية أسبوع هادئة وجميلة إجمالاً.'),
    ('t-a2-25', ('titleAr',), 'محادثة في السوبرماركت', 'مثال: محادثة في السوبرماركت'),
    ('t-a2-25', ('titleDe',), 'Ein Gespräch im Supermarkt', 'Beispiel: Ein Gespräch im Supermarkt'),
    ('t-a2-26', ('titleAr',), 'دعوة لعيد ميلاد', 'مثال: دعوة إلى عيد ميلاد'),
    ('t-a2-26', ('titleDe',), 'Eine Einladung zum Geburtstag', 'Beispiel: Eine Einladung zum Geburtstag'),
    ('t-a2-27', ('titleAr',), 'البحث عن شقة', 'مثال: البحث عن شقة'),
    ('t-a2-27', ('titleDe',), 'Eine Wohnung suchen', 'Beispiel: Eine Wohnung suchen'),
    ('t-a2-28', ('ar',), 'نهارك سعيد، معك خدمة AOK. اسمي كلاين. كيف أستطيع مساعدتك؟ — نهارك سعيد، معكم نادية صالح. سجلت أمس، لكنني لم أحصل على رقم التأمين بعد. كيف يصلني؟ — نرسل الرقم بالبريد بعد معالجة طلبك. وقد يستغرق ذلك بضعة أيام. — هل يمكنني الذهاب إلى الطبيب في هذه الأثناء؟ وهل يجب أن أدفع الفاتورة بنفسي؟ — إذا كان تأمينك سارياً بالفعل، فعادةً ما تتعامل العيادة معنا مباشرةً. يمكنك طلب شهادة عضوية منا وإبرازها للطبيب. — وهل سأحصل على بطاقة التأمين لاحقاً أيضاً؟ — نعم، نرسل البطاقة بالبريد بعد معالجة الطلب. من فضلك تحققي من صحة عنوانك. — سأفعل ذلك. أدوّن المعلومات في دفتري كي لا أنساها. شكراً على المعلومة. — على الرحب والسعة. يمكنك معاودة الاتصال بنا إن كانت لديك أسئلة أخرى. — إلى اللقاء عبر الهاتف!', 'مرحباً، معك صندوق التأمين الصحي. كيف أستطيع مساعدتك؟ — نهارك سعيد، معكم نادية صالح. سجلت أمس، لكنني لم أحصل على رقم التأمين بعد. كيف يصلني؟ — نرسل الرقم بالبريد بعد معالجة طلبك. وقد يستغرق ذلك بضعة أيام. — هل يمكنني الذهاب إلى الطبيب في هذه الأثناء؟ وهل يجب أن أدفع الفاتورة بنفسي؟ — إذا كان تأمينك سارياً بالفعل، فعادةً ما تتولى العيادة تسوية الحساب معنا مباشرةً. يمكنك طلب شهادة عضوية منا وإبرازها للطبيب. — وهل سأحصل على بطاقة التأمين لاحقاً أيضاً؟ — نعم، نرسل البطاقة بالبريد بعد معالجة الطلب. من فضلك تحققي من صحة عنوانك. — سأفعل ذلك. أدوّن المعلومات في دفتري كي لا أنساها. شكراً على المعلومة. — على الرحب والسعة. يمكنك معاودة الاتصال بنا إن كانت لديك أسئلة أخرى. — إلى اللقاء عبر الهاتف!'),
    ('t-a2-28', ('de',), 'Guten Tag, hier ist die AOK. Mein Name ist Klein. Wie kann ich Ihnen helfen? — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber meine Versicherungsnummer noch nicht bekommen. Wie erhalte ich sie? — Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist. Das kann einige Tage dauern. — Kann ich in der Zwischenzeit trotzdem zum Arzt gehen? Muss ich die Rechnung selbst bezahlen? — Wenn Ihre Versicherung bereits aktiv ist, rechnet die Praxis normalerweise direkt mit uns ab. Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen. — Bekomme ich die Versichertenkarte später auch? — Ja, die Karte kommt nach der Bearbeitung ebenfalls per Post. Bitte prüfen Sie, ob Ihre Adresse richtig ist. — Das mache ich. Ich schreibe die Informationen in mein Notizbuch, damit ich sie nicht vergesse. Vielen Dank für die Information. — Gern. Wenn Sie noch Fragen haben, können Sie uns wieder anrufen. — Auf Wiederhören!', 'Guten Tag, hier ist Ihre Krankenkasse. Wie kann ich Ihnen helfen? — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber meine Versicherungsnummer noch nicht bekommen. Wie erhalte ich sie? — Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist. Das kann einige Tage dauern. — Kann ich in der Zwischenzeit trotzdem zum Arzt gehen? Muss ich die Rechnung selbst bezahlen? — Wenn Ihre Versicherung bereits aktiv ist, rechnet die Praxis normalerweise direkt mit uns ab. Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen. — Bekomme ich die Versichertenkarte später auch? — Ja, die Karte kommt nach der Bearbeitung ebenfalls per Post. Bitte prüfen Sie, ob Ihre Adresse richtig ist. — Das mache ich. Ich schreibe die Informationen in mein Notizbuch, damit ich sie nicht vergesse. Vielen Dank für die Information. — Gern. Wenn Sie noch Fragen haben, können Sie uns wieder anrufen. — Auf Wiederhören!'),
    ('t-a2-28', ('titleAr',), 'مكالمة مع التأمين الصحي', 'مثال: اتصال بصندوق تأمين صحي'),
    ('t-a2-28', ('titleDe',), 'Ein Anruf bei der Krankenversicherung', 'Beispielanruf bei einer Krankenkasse'),
    ('t-a2-29', ('questions', 1, 'answer'), 'Für ihren Job', 'Für meinen Job'),
    ('t-a2-29', ('questions', 1, 'explanationAr'), 'الدليل في النص: «Das Zertifikat brauche ich für meinen Job.» — تحتاج إلى الشهادة من أجل عملها.', '«Das Zertifikat brauche ich für meinen Job.» — أحتاج إلى الشهادة من أجل عملي.'),
    ('t-a2-29', ('questions', 1, 'options'), ['Für ihren Job', 'Für eine Reise', 'Für die Universität'], ['Für meinen Job', 'Für eine Reise', 'Für die Universität']),
    ('t-a2-29', ('questions', 1, 'promptAr'), 'لماذا تحتاج المتحدثة إلى الشهادة؟', 'لماذا أحتاج إلى الشهادة؟'),
    ('t-a2-29', ('questions', 1, 'promptDe'), 'Wofür braucht die Person das Zertifikat?', 'Wofür brauche ich das Zertifikat?'),
    ('t-a2-29', ('titleAr',), 'دورة ألمانية جديدة', 'مثال: دورة ألمانية جديدة'),
    ('t-a2-29', ('titleDe',), 'Ein neuer Deutschkurs', 'Beispiel: Ein neuer Deutschkurs'),
    ('t-a2-30', ('ar',), 'طبختي المفضلة هي الكسكس بالخضار ولحم الضأن. تطبخه أمي كل يوم جمعة في تونس. نحتاج إلى الكسكس والجزر والكوسا والحمص والطماطم والبصل والثوم وتوابل مثل الكمون والفلفل الأحمر. تضيف أمي التوابل حسب الذوق. تحضّر الخضار أولاً. تقشّر الجزر وتقطّع الكوسا إلى قطع. يُفرم البصل ناعماً ويُحمّر بقليل من الزيت. ثم يُضاف لحم الضأن والماء والتوابل إلى القدر. يُطهى كل شيء على نار هادئة حتى يطرى اللحم. يُطهى الكسكس على البخار في مصفاة فوق القدر. ويُطهى الحمص معه حتى يطرى. في النهاية تضع أمي الكسكس في طبق كبير وتضع اللحم والخضار فوقه. يكون طعمه لذيذاً جداً مع الهريسة الحارة. توضع الصلصة جانباً كي يختار كل شخص درجة حرارة طعامه. تتناول العائلة كلها الطعام معاً يوم الجمعة.', 'طبقي المفضل هو الكسكس بالخضار ولحم الضأن. تطبخه أمي كل يوم جمعة في تونس. نحتاج إلى الكسكس والجزر والكوسا والحمص والطماطم والبصل والثوم وتوابل مثل الكمون والبابريكا. تضيف أمي التوابل حسب الذوق. تحضّر الخضار أولاً. تقشّر الجزر وتقطّع الكوسا إلى قطع. يُفرم البصل ناعماً ويُحمّر بقليل من الزيت. ثم يُضاف لحم الضأن والماء والتوابل إلى القدر. يُطهى كل شيء على نار هادئة حتى يطرى اللحم. يُطهى الكسكس على البخار في مصفاة فوق القدر. ويُطهى الحمص معه حتى يطرى. في النهاية تضع أمي الكسكس في طبق كبير وتضع اللحم والخضار فوقه. يكون طعمه لذيذاً جداً مع الهريسة الحارة. توضع الصلصة جانباً كي يختار كل شخص بنفسه كمية الهريسة الحارة التي تناسبه. تتناول العائلة كلها الطعام معاً يوم الجمعة.'),
    ('t-a2-30', ('titleAr',), 'طبختي المفضلة', 'طبقي المفضل'),
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
        if by_id[item_id].get("level") != "A2":
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

    if len(EDITS) != 32 or len({(item_id, path) for item_id, path, _old, _new in EDITS}) != 32:
        raise SystemExit(f"expected 32 unique guarded edits, got {len(EDITS)}")
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R157> applied {applied}/32 guarded A2 text edits; questions verified.")


if __name__ == "__main__":
    main()
