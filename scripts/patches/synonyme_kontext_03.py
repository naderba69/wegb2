#!/usr/bin/env python3
"""دفعة 3 لمرادفات السياق: 10 علاقات إضافية محدودة بأمثلة موثّقة."""
import json
import re
from pathlib import Path

OUT = Path("content/synonyme-kontext.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")
BEFORE = 20
AFTER = 30
BATCH = {
    "kommen": {
        "ankommen": {
            "basisKollokation": "nach Hause kommen",
            "alternativKollokation": "zu Hause ankommen",
            "basisDe": "Wir kommen heute gegen acht nach Hause.",
            "basisAr": "نعود إلى المنزل اليوم نحو الساعة الثامنة.",
            "alternativDe": "Wir kommen heute gegen acht zu Hause an.",
            "alternativAr": "نصل إلى المنزل اليوم نحو الساعة الثامنة.",
            "nuanceAr": "في سياق الوصول إلى المنزل يتقاربان؛ kommen أوسع، أمّا ankommen فيركّز على بلوغ الوجهة، وهو فعل منفصل (kommen … an). لا يتبادلان في كل استعمال.",
        }
    },
    "sagen": {
        "mitteilen": {
            "basisKollokation": "die Wahrheit sagen",
            "alternativKollokation": "jemandem die Wahrheit mitteilen",
            "basisDe": "Mina sagt ihrer Freundin die Wahrheit.",
            "basisAr": "تقول مينا لصديقتها الحقيقة.",
            "alternativDe": "Mina teilt ihrer Freundin die Wahrheit mit.",
            "alternativAr": "تُبلغ مينا صديقتها بالحقيقة.",
            "nuanceAr": "في هذا السياق كلاهما لإيصال الحقيقة؛ sagen أعمّ وأشيع، بينما mitteilen يركّز على نقل معلومة وقد يبدو أرسميّاً، وهو فعل منفصل (teilt … mit).",
        }
    },
    "verstehen": {
        "begreifen": {
            "basisKollokation": "alles verstehen",
            "alternativKollokation": "alles begreifen",
            "basisDe": "Nach der Erklärung verstehe ich endlich alles.",
            "basisAr": "بعد الشرح أفهم أخيراً كل شيء.",
            "alternativDe": "Nach der Erklärung begreife ich endlich alles.",
            "alternativAr": "بعد الشرح أستوعب أخيراً كل شيء.",
            "nuanceAr": "في سياق فهم الشرح يتقاربان؛ verstehen أعمّ، بينما begreifen يبرز الاستيعاب الذهني وقد يبدو أقوى تأكيداً.",
        }
    },
    "bezahlen": {
        "begleichen": {
            "basisKollokation": "bar bezahlen",
            "alternativKollokation": "eine Rechnung bar begleichen",
            "basisDe": "Ich bezahle die Rechnung bar.",
            "basisAr": "أدفع الفاتورة نقداً.",
            "alternativDe": "Ich begleiche die Rechnung bar.",
            "alternativAr": "أسدّد الفاتورة نقداً.",
            "nuanceAr": "عند تسديد فاتورة يتقاربان؛ bezahlen أوسع ويصلح للمشتريات عموماً، أمّا begleichen فيعني تسوية مبلغ أو دين مستحق، فلا يُستعمل بديلاً عاماً.",
        }
    },
    "finden": {
        "entdecken": {
            "basisKollokation": "den Weg finden",
            "alternativKollokation": "einen neuen Weg entdecken",
            "basisDe": "Beim Wandern finden wir einen neuen Weg zum See.",
            "basisAr": "نعثر أثناء التنزه على مسار جديد إلى البحيرة.",
            "alternativDe": "Beim Wandern entdecken wir einen neuen Weg zum See.",
            "alternativAr": "نكتشف أثناء التنزه مساراً جديداً إلى البحيرة.",
            "nuanceAr": "هنا فقط، عند العثور على مسار غير معروف للمتحدث، يتقاربان؛ finden أوسع وقد يعني تحديد مكان شيء، أمّا entdecken فيضيف معنى اكتشاف الجديد.",
        }
    },
    "reisen": {
        "verreisen": {
            "basisKollokation": "nach Tunesien reisen",
            "alternativKollokation": "nach Tunesien verreisen",
            "basisDe": "Wir reisen im Juli nach Tunesien.",
            "basisAr": "نسافر إلى تونس في يوليو.",
            "alternativDe": "Wir verreisen im Juli nach Tunesien.",
            "alternativAr": "نغادر في رحلة إلى تونس في يوليو.",
            "nuanceAr": "في سياق رحلة إلى وجهة يتقاربان؛ verreisen يبرز مغادرة مكان الإقامة في رحلة، غالباً للراحة، أمّا reisen فأوسع ولا يعني دائماً إجازة.",
        }
    },
    "besuchen": {
        "aufsuchen": {
            "basisKollokation": "die Großeltern besuchen",
            "alternativKollokation": "die Großeltern aufsuchen",
            "basisDe": "Am Sonntag besuchen wir unsere Großeltern.",
            "basisAr": "نزور جدّينا يوم الأحد.",
            "alternativDe": "Am Sonntag suchen wir unsere Großeltern auf.",
            "alternativAr": "نتوجّه لزيارة جدّينا يوم الأحد.",
            "nuanceAr": "في هذا المثال يمكن أن يصفا الذهاب إليهما؛ besuchen محايد وشائع للزيارة، أمّا aufsuchen فأكثر رسمية ويؤكد قصد التوجّه إلى شخص أو مكان.",
        }
    },
    "die Arbeit": {
        "der Job": {
            "basisKollokation": "die Arbeit beginnt um acht",
            "alternativKollokation": "der Job beginnt um acht",
            "basisDe": "Meine Arbeit beginnt morgen um acht Uhr.",
            "basisAr": "يبدأ عملي غداً الساعة الثامنة.",
            "alternativDe": "Mein Job beginnt morgen um acht Uhr.",
            "alternativAr": "يبدأ دوامي في الوظيفة غداً الساعة الثامنة.",
            "nuanceAr": "في سياق وقت بدء الدوام يتقاربان؛ Arbeit أوسع وتشمل العمل أو الوظيفة، أمّا Job فأشيع للوظيفة المدفوعة وهو أكثر يومية.",
        }
    },
    "der Brief": {
        "das Schreiben": {
            "basisKollokation": "einen Brief bekommen",
            "alternativKollokation": "ein Schreiben bekommen",
            "basisDe": "Ich habe gestern einen Brief von der Versicherung bekommen.",
            "basisAr": "تلقيت أمس رسالةً من شركة التأمين.",
            "alternativDe": "Ich habe gestern ein Schreiben von der Versicherung bekommen.",
            "alternativAr": "تلقيت أمس خطاباً رسمياً من شركة التأمين.",
            "nuanceAr": "عند تلقي مراسلة يتقاربان؛ Brief لفظ عام للرسالة، أمّا Schreiben فيوحي غالباً بخطاب أو وثيقة رسمية.",
        }
    },
    "der Kollege": {
        "der Mitarbeiter": {
            "basisKollokation": "mit dem Kollegen essen",
            "alternativKollokation": "mit dem Mitarbeiter essen",
            "basisDe": "Heute esse ich mit meinem Kollegen in der Kantine.",
            "basisAr": "أتناول الغداء اليوم مع زميلي في المقصف.",
            "alternativDe": "Heute esse ich mit einem Mitarbeiter in der Kantine.",
            "alternativAr": "أتناول الغداء اليوم مع أحد الموظفين في المقصف.",
            "nuanceAr": "في مكان العمل قد يشير الاثنان إلى الشخص نفسه؛ Kollege يركّز على علاقة الزمالة، بينما Mitarbeiter يعني موظفاً في المؤسسة وقد يكون تابعاً إدارياً.",
        }
    },
}


def load_json(path: str):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main() -> None:
    assert OUT.exists(), "ملف السياقات السابقة غير موجود؛ شغّل فحوص الدفعتين 1 و2 أولاً"
    current = load_json(str(OUT))
    current_count = sum(len(items) for items in current.values())
    assert len(BATCH) == 10 and sum(len(items) for items in BATCH.values()) == 10, "يجب أن تضم الدفعة الثالثة عشر علاقات بالضبط"
    already_applied = all(current.get(source, {}).get(target) == item for source, alternatives in BATCH.items() for target, item in alternatives.items())
    if already_applied:
        assert current_count >= AFTER, f"عدد السياقات أقل من المتوقع بعد تطبيق الدفعة: {current_count}"
    else:
        assert current_count == BEFORE, f"تغيّر أساس البنك: المتوقّع {BEFORE} علاقة قبل الدفعة، الموجود {current_count}"
        assert not set(BATCH).intersection(current), "مصدر مكرر بين الدفعات"

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
