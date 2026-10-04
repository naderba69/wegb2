#!/usr/bin/env python3
"""دفعة 1 لمرادفات السياق: أمثلة متقابلة لـ10 أزواج A1/A2.

مصدر إنتاج قابل لإعادة التشغيل؛ يتحقق من البطاقة والمرادف والمتلازمة الأصلية
والثنائية الألمانية/العربية قبل كتابة content/synonyme-kontext.json.
"""
import json
import re
from pathlib import Path

OUT = Path("content/synonyme-kontext.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")

# لا تعني هذه الأزواج تطابقاً عاماً؛ الأمثلة والملاحظات تحصر التقارب في السياق.
BATCH = {
    "anfangen": {
        "beginnen": {
            "basisKollokation": "mit der Arbeit anfangen",
            "alternativKollokation": "mit der Arbeit beginnen",
            "basisDe": "Ich fange heute mit der Arbeit an.",
            "basisAr": "أبدأ العمل اليوم.",
            "alternativDe": "Ich beginne heute mit der Arbeit.",
            "alternativAr": "أبدأ العمل اليوم.",
            "nuanceAr": "في هذا السياق المعنى قريب. anfangen فعلٌ منفصل في الحاضر (fange … an)، أمّا beginnen فلا ينفصل؛ ويشيع beginnen أكثر في الأسلوب الرسمي.",
        }
    },
    "antworten": {
        "beantworten": {
            "basisKollokation": "auf die Frage antworten",
            "alternativKollokation": "die Frage beantworten",
            "basisDe": "Sie antwortet auf die Frage.",
            "basisAr": "تجيب عن السؤال.",
            "alternativDe": "Sie beantwortet die Frage.",
            "alternativAr": "تجيب عن السؤال.",
            "nuanceAr": "المعنى التواصلي متقارب، لكن antworten يأتي هنا مع auf + Akkusativ، بينما يأخذ beantworten السؤالَ مباشرةً مفعولاً به.",
        }
    },
    "helfen": {
        "unterstützen": {
            "basisKollokation": "der Mutter helfen",
            "alternativKollokation": "die Mutter unterstützen",
            "basisDe": "Ich helfe meiner Schwester beim Umzug.",
            "basisAr": "أساعد أختي في الانتقال.",
            "alternativDe": "Ich unterstütze meine Schwester beim Umzug.",
            "alternativAr": "أساند أختي في الانتقال.",
            "nuanceAr": "كلاهما يدل على تقديم العون في هذا الموقف. helfen يأخذ الشخص بالداتيف، أمّا unterstützen فيأخذه مفعولاً مباشراً وقد يوحي بمساندة أوسع أو أطول.",
        }
    },
    "wohnen": {
        "leben": {
            "basisKollokation": "in Berlin wohnen",
            "alternativKollokation": "in Berlin leben",
            "basisDe": "Ich wohne in Berlin.",
            "basisAr": "أسكن في برلين.",
            "alternativDe": "Ich lebe in Berlin.",
            "alternativAr": "أعيش في برلين.",
            "nuanceAr": "في جملة المكان قد يتقاربان: wohnen يركّز على السكن أو محل الإقامة، أمّا leben فأوسع ويصف مكان الحياة عموماً.",
        }
    },
    "sprechen": {
        "reden": {
            "basisKollokation": "langsam sprechen",
            "alternativKollokation": "langsam reden",
            "basisDe": "Er spricht heute langsam.",
            "basisAr": "يتحدث ببطء اليوم.",
            "alternativDe": "Er redet heute langsam.",
            "alternativAr": "يتكلم ببطء اليوم.",
            "nuanceAr": "في هذا المثال كلاهما يصف طريقة الكلام؛ sprechen محايد ويشيع أيضاً عند الحديث عن مهارة لغة، أمّا reden فأكثر يومية ويركّز غالباً على المحادثة.",
        }
    },
    "treffen": {
        "begegnen": {
            "basisKollokation": "Freunde treffen",
            "alternativKollokation": "einem Freund begegnen",
            "basisDe": "Ich treffe meinen Freund am Samstag im Café.",
            "basisAr": "ألتقي صديقي في المقهى يوم السبت.",
            "alternativDe": "Ich bin meinem Freund am Samstag zufällig im Café begegnet.",
            "alternativAr": "صادفت صديقي في المقهى يوم السبت.",
            "nuanceAr": "قد يتقاربان عند رؤية شخص، لكن treffen قد يكون لقاءً مرتباً؛ أمّا begegnen فيصف غالباً مصادفة اللقاء، ويأخذ الشخص بالداتيف.",
        }
    },
    "erzählen": {
        "berichten": {
            "basisKollokation": "von der Reise erzählen",
            "alternativKollokation": "von der Reise berichten",
            "basisDe": "Er erzählt von der Reise.",
            "basisAr": "يحكي عن الرحلة.",
            "alternativDe": "Er berichtet von der Reise.",
            "alternativAr": "يقدّم تقريراً عن الرحلة.",
            "nuanceAr": "erzählen يميل إلى سرد الحكاية أو التجربة؛ berichten أقرب إلى عرض الوقائع أو تقديم تقرير، وقد يكون أرسميّاً.",
        }
    },
    "erklären": {
        "erläutern": {
            "basisKollokation": "die Regel erklären",
            "alternativKollokation": "die Regel erläutern",
            "basisDe": "Die Lehrerin erklärt die Regel.",
            "basisAr": "تشرح المعلمة القاعدة.",
            "alternativDe": "Die Lehrerin erläutert die Regel.",
            "alternativAr": "توضّح المعلمة القاعدة.",
            "nuanceAr": "في هذا المثال كلاهما للشرح. erläutern غالباً يضيف تفصيلاً أو مثالاً لتوضيح الفكرة، ونبرته أميل إلى الرسمية.",
        }
    },
    "schreiben": {
        "verfassen": {
            "basisKollokation": "einen Brief schreiben",
            "alternativKollokation": "einen Brief verfassen",
            "basisDe": "Sie schreibt einen Brief an ihre Freundin.",
            "basisAr": "تكتب رسالة إلى صديقتها.",
            "alternativDe": "Sie verfasst einen Brief an ihre Freundin.",
            "alternativAr": "تحرّر رسالة إلى صديقتها.",
            "nuanceAr": "كلاهما ممكن هنا؛ schreiben أعمّ وأشيع، أمّا verfassen فيوحي بإعداد نصٍّ مكتوب ويشيع أكثر في السياق الرسمي.",
        }
    },
    "sparen": {
        "ansparen": {
            "basisKollokation": "Geld sparen",
            "alternativKollokation": "Geld für eine Reise ansparen",
            "basisDe": "Ich spare Geld für die Reise.",
            "basisAr": "أدّخر المال للرحلة.",
            "alternativDe": "Ich spare Geld für die Reise an.",
            "alternativAr": "أجمع المال تدريجياً للرحلة.",
            "nuanceAr": "sparen ادّخار عام؛ ansparen يركّز على جمع المال تدريجياً لغرض أو مبلغ مستهدف، وهو فعل منفصل (spare … an).",
        }
    },
}


def load_json(path: str):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main() -> None:
    vocab = load_json("content/vocab.json")
    packs = vocab if isinstance(vocab, list) else list(vocab.values())
    cards = [card for pack in packs for card in pack.get("cards", [])]
    by_de: dict[str, list[dict]] = {}
    for card in cards:
        by_de.setdefault(card["de"].strip().lower(), []).append(card)
    raw_syn = load_json("content/synonyme.json")
    koll = load_json("content/kollokationen.json")

    assert len(BATCH) == 10, f"عدد الأزواج تغيّر دون تحديث بوابة الدفعة: {len(BATCH)}"
    for source, alternatives in BATCH.items():
        hits = by_de.get(source.lower(), [])
        assert len(hits) == 1, f"البطاقة «{source}» موجودة {len(hits)} مرة (المطلوب مرة واحدة)"
        card = hits[0]
        assert card["level"] in ("A1", "A2"), f"المستوى خارج الدفعة: {source} / {card['level']}"
        assert source in raw_syn and all(alt in raw_syn[source] for alt in alternatives), f"مرادف غير معتمد في سجل syn: {source}"
        for alt, item in alternatives.items():
            assert card.get("syn") and alt in card["syn"], f"{source}→{alt}: لا تطابق بين البطاقة والمرادف"
            assert item["basisKollokation"] in koll.get(card["id"], []), f"{source}: المتلازمة الأصلية ليست في بنك البطاقة"
            assert alt.lower() in item["alternativKollokation"].lower(), f"{source}→{alt}: البديل غائب عن المتلازمة المقابلة"
            for key in ("basisDe", "alternativDe", "basisKollokation", "alternativKollokation"):
                assert item[key].strip() and not ARABIC.search(item[key]), f"عربية/حقل فارغ في {source}/{key}"
            for key in ("basisAr", "alternativAr", "nuanceAr"):
                assert ARABIC.search(item[key]), f"غياب العربية في {source}/{key}"

    existing = load_json(str(OUT)) if OUT.exists() else {}
    merged = {source: dict(alternatives) for source, alternatives in existing.items()}
    for source, alternatives in BATCH.items():
        prior = merged.setdefault(source, {})
        for alt, item in alternatives.items():
            assert alt not in prior or prior[alt] == item, f"تعارض سياق موجود: {source}→{alt}"
            prior[alt] = item
    OUT.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    total = sum(map(len, merged.values()))
    print(f"نجح الفحص السابق للكتابة: تحقق {sum(map(len, BATCH.values()))} سياقات من الدفعة 1، الإجمالي {total}/70 → {OUT}")


if __name__ == "__main__":
    main()
