#!/usr/bin/env python3
"""دفعة 2 لمرادفات السياق: 10 علاقات إضافية من بنك syn الحالي."""
import json
import re
from pathlib import Path

OUT = Path("content/synonyme-kontext.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")
BEFORE = 10
BATCH = {
    "sehen": {
        "schauen": {
            "basisKollokation": "einen Film im Kino sehen",
            "alternativKollokation": "einen Film im Kino schauen",
            "basisDe": "Wir sehen heute Abend einen Film im Kino.",
            "basisAr": "نشاهد فيلماً في السينما مساء اليوم.",
            "alternativDe": "Wir schauen heute Abend einen Film im Kino.",
            "alternativAr": "نتفرج على فيلم في السينما مساء اليوم.",
            "nuanceAr": "عند مشاهدة فيلم بقصد يتقاربان؛ sehen أعمّ ويعني أيضاً الإدراك بالبصر، أمّا schauen فيبرز توجيه النظر ويشيع في الحديث اليومي.",
        }
    },
    "holen": {
        "abholen": {
            "basisKollokation": "die Kinder holen",
            "alternativKollokation": "die Kinder von der Schule abholen",
            "basisDe": "Ich hole heute die Kinder von der Schule.",
            "basisAr": "أذهب اليوم لأخذ الأطفال من المدرسة.",
            "alternativDe": "Ich hole heute die Kinder von der Schule ab.",
            "alternativAr": "أصطحب الأطفال اليوم من المدرسة.",
            "nuanceAr": "في هذا الموقف يتقاربان؛ holen يعني الإحضار أو الأخذ عموماً، أمّا abholen فيحدد أخذ شخص من مكان معيّن، وهو فعل منفصل (hole … ab).",
        }
    },
    "das Auto": {
        "der Wagen": {
            "basisKollokation": "mit dem Auto fahren",
            "alternativKollokation": "mit dem Wagen fahren",
            "basisDe": "Wir fahren mit dem Auto nach Hause.",
            "basisAr": "نعود إلى المنزل بالسيارة.",
            "alternativDe": "Wir fahren mit dem Wagen nach Hause.",
            "alternativAr": "نعود إلى المنزل بالسيارة.",
            "nuanceAr": "في هذا المثال كلاهما سيارة؛ Auto هو اللفظ المحايد الشائع، أمّا Wagen فقد يعني مركبة أو عربة بحسب السياق، وقد يبدو أقدم أو أسلوبيّاً.",
        }
    },
    "das Wort": {
        "der Ausdruck": {
            "basisKollokation": "ein neues Wort",
            "alternativKollokation": "ein neuer Ausdruck",
            "basisDe": "Im Text steht ein neues Wort.",
            "basisAr": "توجد في النص كلمة جديدة.",
            "alternativDe": "Im Text steht ein neuer Ausdruck.",
            "alternativAr": "يوجد في النص تعبير جديد.",
            "nuanceAr": "Wort غالباً كلمة مفردة؛ أمّا Ausdruck فقد يكون تركيباً من كلمات أو طريقةً لصياغة المعنى، لذا لا يتبادلان دائماً.",
        }
    },
    "das Problem": {
        "die Schwierigkeit": {
            "basisKollokation": "kein Problem",
            "alternativKollokation": "keine Schwierigkeit",
            "basisDe": "Das ist für mich kein Problem.",
            "basisAr": "لا تمثل هذه مشكلةً بالنسبة لي.",
            "alternativDe": "Das ist für mich keine Schwierigkeit.",
            "alternativAr": "لا تشكّل هذه صعوبةً بالنسبة إليّ.",
            "nuanceAr": "يتقاربان عند وصف أمر يمكن التعامل معه؛ Problem أوسع للدلالة على مسألة أو عائق، بينما Schwierigkeit تركز على الصعوبة أو العقبة.",
        }
    },
    "die Idee": {
        "der Gedanke": {
            "basisKollokation": "eine gute Idee",
            "alternativKollokation": "ein guter Gedanke",
            "basisDe": "Das ist eine gute Idee.",
            "basisAr": "هذه فكرة جيدة.",
            "alternativDe": "Das ist ein guter Gedanke.",
            "alternativAr": "هذه فكرة وجيهة.",
            "nuanceAr": "في سياق اقتراحٍ مقبول يتقاربان؛ Idee تميل إلى خطة أو اقتراح، وGedanke إلى فكرة أو تأمّل، ولا يتطابقان في كل السياقات.",
        }
    },
    "die Firma": {
        "das Unternehmen": {
            "basisKollokation": "in einer Firma arbeiten",
            "alternativKollokation": "in einem Unternehmen arbeiten",
            "basisDe": "Meine Schwester arbeitet in einer Firma.",
            "basisAr": "تعمل أختي في شركة.",
            "alternativDe": "Meine Schwester arbeitet in einem Unternehmen.",
            "alternativAr": "تعمل أختي في مؤسسة تجارية.",
            "nuanceAr": "في سياق مكان العمل يتقاربان؛ Firma شائع للشركة، وUnternehmen أوسع أو أميل إلى الرسمية وقد يشير إلى النشاط التجاري كله.",
        }
    },
    "der Chef": {
        "der Vorgesetzte": {
            "basisKollokation": "mit dem Chef sprechen",
            "alternativKollokation": "mit dem Vorgesetzten sprechen",
            "basisDe": "Ich spreche morgen mit meinem Chef.",
            "basisAr": "أتحدث غداً مع مديري.",
            "alternativDe": "Ich spreche morgen mit meinem Vorgesetzten.",
            "alternativAr": "أتحدث غداً مع مشرفي.",
            "nuanceAr": "في العمل يتقاربان؛ Chef شائع وأقل رسمية وقد يعني رئيس العمل، أمّا Vorgesetzter فيحدد المشرف ضمن التسلسل الإداري ولا يعني بالضرورة مالك الشركة.",
        }
    },
    "höflich": {
        "zuvorkommend": {
            "basisKollokation": "höflich sein",
            "alternativKollokation": "zuvorkommend sein",
            "basisDe": "Die Bedienung ist höflich.",
            "basisAr": "النادلة مهذبة.",
            "alternativDe": "Die Bedienung ist zuvorkommend.",
            "alternativAr": "النادلة لبقة ومهتمة بخدمة الضيوف.",
            "nuanceAr": "كلاهما يتصل بحسن التعامل؛ höflich يصف الأدب والاحترام، وzuvorkommend يضيف المبادرة إلى مراعاة حاجة الآخر ومساعدته.",
        }
    },
    "das Mittagessen": {
        "das Mittagsmahl": {
            "basisKollokation": "zum Mittagessen gehen",
            "alternativKollokation": "zum Mittagsmahl gehen",
            "basisDe": "Wir gehen um zwölf zum Mittagessen.",
            "basisAr": "نذهب عند الثانية عشرة لتناول الغداء.",
            "alternativDe": "Wir gehen um zwölf zum Mittagsmahl.",
            "alternativAr": "نذهب عند الثانية عشرة إلى وجبة الظهيرة.",
            "nuanceAr": "يدلان هنا على وجبة منتصف النهار، لكن Mittagsmahl أندر وأفخم أو أدبيّ النبرة؛ في الحديث اليومي يُفضَّل Mittagessen.",
        }
    },
}


def load_json(path: str):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main() -> None:
    assert OUT.exists(), "ملف الدفعة الأولى غير موجود؛ شغّل فحص الدفعة 1 أولاً"
    current = load_json(str(OUT))
    current_count = sum(len(items) for items in current.values())
    assert len(BATCH) == 10 and sum(len(items) for items in BATCH.values()) == 10, "يجب أن تضم الدفعة الثانية عشر علاقات بالضبط"
    already_applied = current_count == BEFORE + 10 and all(current.get(source, {}).get(target) == item for source, alternatives in BATCH.items() for target, item in alternatives.items())
    assert current_count == BEFORE or already_applied, f"تغيّر أساس البنك: المتوقّع {BEFORE} علاقة قبل الدفعة أو {BEFORE + 10} بعدها، الموجود {current_count}"
    if not already_applied:
        assert not set(BATCH).intersection(current), "مصدر مكرر بين الدفعتين"

    vocab = load_json("content/vocab.json")
    packs = vocab if isinstance(vocab, list) else list(vocab.values())
    cards = [card for pack in packs for card in pack.get("cards", [])]
    by_de: dict[str, list[dict]] = {}
    for card in cards:
        by_de.setdefault(card["de"].strip().lower(), []).append(card)
    raw_syn = load_json("content/synonyme.json")
    koll = load_json("content/kollokationen.json")

    for source, alternatives in BATCH.items():
        hits = by_de.get(source.lower(), [])
        assert len(hits) == 1, f"البطاقة «{source}» موجودة {len(hits)} مرة (المطلوب مرة واحدة)"
        card = hits[0]
        assert card["level"] in ("A1", "A2"), f"المستوى خارج الدفعة: {source} / {card['level']}"
        assert source in raw_syn and all(alt in raw_syn[source] for alt in alternatives), f"مرادف غير موجود في سجل syn: {source}"
        for alt, item in alternatives.items():
            target_lemma = re.sub(r"^(der|die|das)\s+", "", alt, flags=re.IGNORECASE)
            assert card.get("syn") and alt in card["syn"], f"{source}→{alt}: لا تطابق بين البطاقة والمرادف"
            assert item["basisKollokation"] in koll.get(card["id"], []), f"{source}: المتلازمة الأصلية ليست في بنك البطاقة"
            assert target_lemma.lower() in item["alternativKollokation"].lower(), f"{source}→{alt}: البديل غائب عن المتلازمة المقابلة"
            for key in ("basisDe", "alternativDe", "basisKollokation", "alternativKollokation"):
                assert item[key].strip() and not ARABIC.search(item[key]), f"عربية/حقل فارغ في {source}/{key}"
            for key in ("basisAr", "alternativAr", "nuanceAr"):
                assert ARABIC.search(item[key]), f"غياب العربية في {source}/{key}"

    merged = {source: dict(alternatives) for source, alternatives in current.items()}
    if not already_applied:
        for source, alternatives in BATCH.items():
            merged[source] = alternatives
        OUT.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    action = "الدفعة موجودة مسبقاً وتم التحقق منها" if already_applied else "أضيفت 10 علاقات"
    print(f"نجح الفحص السابق للكتابة: {action}؛ الإجمالي {sum(map(len, merged.values()))}/70 → {OUT}")


if __name__ == "__main__":
    main()
