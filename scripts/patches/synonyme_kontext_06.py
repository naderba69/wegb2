#!/usr/bin/env python3
"""الدفعة 6: متلازمتان مساعدتان ومرادف سياقي موثق لكل بطاقة A1 غير مغطاة."""
import json
import re
from pathlib import Path

CONTEXT = Path("content/synonyme-kontext.json")
KOLLOK = Path("content/kollokationen.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")
ARTICLE = re.compile(r"^(der|die|das)\s+", re.IGNORECASE)
BEFORE = 50
AFTER = 60

# بطاقات A1 الخمس الآتية لا تملك متلازمات؛ أُضيفت عبارتان فريدتان لكل منها
# بعد فحص البنك وقائمة SOLL، كي يكون لكل سياق أساس قابل للتدريب.
KOLLOCATION_PATCH = {
    "vx-haus--042": ["an die Zukunft denken", "denken, dass der Bus kommt"],
    "vy-natur-046": ["die Familie lieben", "seine Kinder lieben"],
    "vy-natur-048": ["Gewalt hassen", "Lügen hassen"],
    "vw-a1koe-050": ["sauberes Wasser", "saubere Hände"],
    "vx-zeit--036": ["immer verfügbar", "immer geöffnet"],
}

BATCH = {
    "denken": {
        "glauben": {
            "basisKollokation": "denken, dass der Bus kommt",
            "alternativKollokation": "glauben, dass der Bus kommt",
            "basisDe": "Ich denke, dass der Bus gleich kommt.",
            "basisAr": "أظن أن الحافلة ستأتي بعد قليل.",
            "alternativDe": "Ich glaube, dass der Bus gleich kommt.",
            "alternativAr": "أعتقد أن الحافلة ستأتي بعد قليل.",
            "nuanceAr": "عند التعبير عن توقع أو رأي غير محسوم يتقاربان؛ denken أوسع وقد يعني إعمال الفكر، بينما glauben يبرز الاعتقاد أو الترجيح، فلا يتبادلان في كل معنى.",
        }
    },
    "lieben": {
        "liebhaben": {
            "basisKollokation": "die Familie lieben",
            "alternativKollokation": "die Familie liebhaben",
            "basisDe": "Ich liebe meine Familie.",
            "basisAr": "أحب عائلتي.",
            "alternativDe": "Ich habe meine Familie lieb.",
            "alternativAr": "أكنّ لعائلتي مودةً.",
            "nuanceAr": "في التعبير عن المودة للعائلة يتقاربان؛ lieben أوسع وقد يدل على حب عميق، أمّا liebhaben فغالباً أحنّ وأقل رسمية، ولا يصلح بديلاً في كل استعمال.",
        }
    },
    "mögen": {
        "gern haben": {
            "basisKollokation": "Kinder mögen Schokolade",
            "alternativKollokation": "Schokolade gern haben",
            "basisDe": "Viele Kinder mögen Schokolade.",
            "basisAr": "يحب كثير من الأطفال الشوكولاتة.",
            "alternativDe": "Viele Kinder haben Schokolade gern.",
            "alternativAr": "يستطيب كثير من الأطفال الشوكولاتة.",
            "nuanceAr": "في معنى الاستحسان يتقاربان؛ mögen أشيع ومحايد، وgern haben يعبّر عن المودة أو الاستحسان بنبرة شخصية أكثر، ويشيع خصوصاً مع الأشخاص.",
        }
    },
    "hassen": {
        "verabscheuen": {
            "basisKollokation": "Gewalt hassen",
            "alternativKollokation": "Gewalt verabscheuen",
            "basisDe": "Sie hasst Gewalt.",
            "basisAr": "هي تكره العنف.",
            "alternativDe": "Sie verabscheut Gewalt.",
            "alternativAr": "هي تمقت العنف.",
            "nuanceAr": "كلاهما يعبّر عن نفور شديد من العنف؛ verabscheuen أفصح وأقوى نبرةً، بينما hassen أشيع في الحديث ولا يتبادلان في كل تركيب.",
        }
    },
    "die Universität": {
        "die Hochschule": {
            "basisKollokation": "an der Universität studieren",
            "alternativKollokation": "an der Hochschule studieren",
            "basisDe": "Sie studiert an der Universität.",
            "basisAr": "هي تدرس في الجامعة.",
            "alternativDe": "Sie studiert an der Hochschule.",
            "alternativAr": "هي تدرس في مؤسسة للتعليم العالي.",
            "nuanceAr": "في سياق الدراسة يتقاربان، لكن Hochschule أوسع وقد تشمل أنواعاً مختلفة من مؤسسات التعليم العالي، بينما Universität نوع محدد منها؛ لذلك لا يُستبدل أحدهما بالآخر دائماً.",
        }
    },
    "das Gehalt": {
        "der Lohn": {
            "basisKollokation": "ein gutes Gehalt",
            "alternativKollokation": "einen guten Lohn bekommen",
            "basisDe": "Die Angestellte bekommt ein gutes Gehalt.",
            "basisAr": "تتقاضى الموظفة راتباً جيداً.",
            "alternativDe": "Die Angestellte bekommt einen guten Lohn.",
            "alternativAr": "تتقاضى الموظفة أجراً جيداً.",
            "nuanceAr": "كلاهما مقابل مالي للعمل؛ Gehalt يوحي غالباً براتب دوري ثابت، وLohn قد يرتبط بالأجر بالساعة أو بالمهمة، ويختلف الاستعمال باختلاف الوظيفة والسياق.",
        }
    },
    "schön": {
        "hübsch": {
            "basisKollokation": "schön aussehen",
            "alternativKollokation": "hübsch aussehen",
            "basisDe": "Das Kleid sieht schön aus.",
            "basisAr": "يبدو الفستان جميلاً.",
            "alternativDe": "Das Kleid sieht hübsch aus.",
            "alternativAr": "يبدو الفستان أنيقاً وجميلاً.",
            "nuanceAr": "عند وصف مظهر الفستان يتقاربان؛ schön أوسع وقد يصف الجمال عموماً، أمّا hübsch فيركّز غالباً على المظهر اللطيف أو الجذاب.",
        }
    },
    "modisch": {
        "modern": {
            "basisKollokation": "ein modischer Mantel",
            "alternativKollokation": "ein moderner Mantel",
            "basisDe": "Sie trägt einen modischen Mantel.",
            "basisAr": "ترتدي معطفاً مواكباً للموضة.",
            "alternativDe": "Sie trägt einen modernen Mantel.",
            "alternativAr": "ترتدي معطفاً ذا تصميم عصري.",
            "nuanceAr": "في وصف المعطف قد يتقاربان؛ modisch يركّز على مواكبة الموضة، بينما modern يصف التصميم أو الطابع العصري، فلا يلزم أن يكون كل حديثٍ مواكباً للموضة.",
        }
    },
    "sauber": {
        "rein": {
            "basisKollokation": "sauberes Wasser",
            "alternativKollokation": "reines Wasser",
            "basisDe": "Wir brauchen sauberes Wasser.",
            "basisAr": "نحتاج إلى ماء نظيف.",
            "alternativDe": "Wir brauchen reines Wasser.",
            "alternativAr": "نحتاج إلى ماء نقي.",
            "nuanceAr": "في وصف الماء يتقاربان؛ sauber ينفي الاتساخ، بينما rein يركّز أكثر على الخلو من الشوائب، ولذلك لا يتبادلان في كل وصف للنظافة.",
        }
    },
    "immer": {
        "stets": {
            "basisKollokation": "immer verfügbar",
            "alternativKollokation": "stets verfügbar",
            "basisDe": "Die Hilfe ist immer verfügbar.",
            "basisAr": "المساعدة متاحة دائماً.",
            "alternativDe": "Die Hilfe ist stets verfügbar.",
            "alternativAr": "المساعدة متاحة على الدوام.",
            "nuanceAr": "في معنى الاستمرار يتقاربان؛ immer أشيع في الكلام اليومي، أمّا stets فأكثر رسمية أو كتابية، ولا يحمل دائماً النبرة نفسها.",
        }
    },
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def has_arabic(text: str) -> bool:
    return bool(ARABIC.search(text))


def lemma(text: str) -> str:
    return ARTICLE.sub("", text.strip())


def main() -> None:
    assert CONTEXT.exists() and KOLLOK.exists(), "بنك السياقات والمتلازمات السابقة مطلوب"
    current_context = load_json(CONTEXT)
    current_koll = load_json(KOLLOK)
    current_count = sum(len(items) for items in current_context.values())

    assert len(BATCH) == 10 and sum(map(len, BATCH.values())) == 10, "يجب أن تضم الدفعة السادسة 10 علاقات بالضبط"
    assert len(KOLLOCATION_PATCH) == 5 and all(len(items) == 2 for items in KOLLOCATION_PATCH.values()), "متلازمتان بالضبط لكل بطاقة A1 غير مغطاة"
    context_present = all(current_context.get(source, {}).get(target) == item for source, alternatives in BATCH.items() for target, item in alternatives.items())
    context_absent = all(source not in current_context for source in BATCH)
    assert context_present or context_absent, "حالة جزئية أو متعارضة في سياقات الدفعة السادسة"
    if context_present:
        assert current_count >= AFTER, f"الدفعة موجودة لكن عدد السياقات أقل من {AFTER}: {current_count}"
    else:
        assert current_count == BEFORE, f"المتوقع {BEFORE} سياقاً قبل الدفعة، الموجود {current_count}"

    coll_present = {card_id for card_id, phrases in KOLLOCATION_PATCH.items() if current_koll.get(card_id) == phrases}
    coll_absent = {card_id for card_id in KOLLOCATION_PATCH if card_id not in current_koll}
    coll_conflict = set(KOLLOCATION_PATCH) - coll_present - coll_absent
    assert not coll_conflict, f"متلازمات موجودة بصيغة مختلفة: {sorted(coll_conflict)}"

    vocab = load_json(Path("content/vocab.json"))
    packs = vocab if isinstance(vocab, list) else list(vocab.values())
    cards = [card for pack in packs for card in pack.get("cards", [])]
    by_id = {card["id"]: card for card in cards}
    by_de: dict[str, list[dict]] = {}
    for card in cards:
        by_de.setdefault(card["de"].strip().lower(), []).append(card)
    raw_syn = load_json(Path("content/synonyme.json"))
    assert sum(map(len, raw_syn.values())) == 70, "يجب أن تبقى قائمة syn الخام عند 70 علاقة"
    koll_a1a2 = load_json(Path("content/kollok-a1a2-soll.json"))
    protected_soll = {item["id"] for item in koll_a1a2["A1"]["karten"] + koll_a1a2["A2"]["karten"]}

    proposed = {phrase for phrases in KOLLOCATION_PATCH.values() for phrase in phrases}
    existing = {phrase for phrases in current_koll.values() for phrase in phrases}
    assert len(proposed) == 10 and len(existing) == sum(map(len, current_koll.values())), "صيغة بنك المتلازمات غير متوقعة"
    assert len(proposed & existing) == (10 if len(coll_present) == 5 else len(coll_present) * 2), "متلازمة دعم مكررة في البنك"

    final_koll = {card_id: list(phrases) for card_id, phrases in current_koll.items()}
    batch_sources = {source.lower() for source in BATCH}
    for card_id, phrases in KOLLOCATION_PATCH.items():
        card = by_id.get(card_id)
        assert card and card["level"] == "A1" and card["de"].lower() in batch_sources, f"بطاقة دعم غير متوقعة أو خارج A1: {card_id}"
        assert card_id not in protected_soll, f"البطاقة موجودة في قائمة SOLL الأساسية: {card_id}"
        assert card_id not in current_koll or current_koll[card_id] == phrases, f"لن تُستبدل متلازمات قائمة: {card_id}"
        card_lemma = lemma(card["de"]).lower()
        for phrase in phrases:
            assert 2 <= len(phrase.split()) <= 6 and not has_arabic(phrase), f"متلازمة مساندة فارغة أو طويلة أو عربية: {card_id}/{phrase}"
            assert card_lemma in phrase.lower(), f"كلمة البطاقة غائبة: {card['de']} / {phrase}"
        if card_id not in final_koll:
            final_koll[card_id] = list(phrases)

    for source, alternatives in BATCH.items():
        hits = by_de.get(source.lower(), [])
        assert len(hits) == 1, f"البطاقة «{source}» موجودة {len(hits)} مرة"
        card = hits[0]
        assert card["level"] in {"A1", "B1", "B2"}, f"المستوى غير متوقع في الدفعة: {source}/{card['level']}"
        assert source in raw_syn and all(target in raw_syn[source] for target in alternatives), f"علاقة غير موجودة في syn الخام: {source}"
        for target, item in alternatives.items():
            assert target in (card.get("syn") or []), f"{source}→{target}: العلاقة غير موجودة على البطاقة"
            assert item["basisKollokation"] in final_koll.get(card["id"], []), f"{source}: متلازمة الأساس غير موجودة"
            assert lemma(target).lower() in lemma(item["alternativKollokation"]).lower(), f"{source}→{target}: المقابل غائب عن المتلازمة البديلة"
            for key in ("basisDe", "alternativDe", "basisKollokation", "alternativKollokation"):
                assert item[key].strip() and not has_arabic(item[key]), f"حقل ألماني فارغ أو عربي: {source}/{key}"
            for key in ("basisAr", "alternativAr", "nuanceAr"):
                assert has_arabic(item[key]), f"غياب العربية في {source}/{key}"

    all_phrases = [phrase for phrases in final_koll.values() for phrase in phrases]
    assert len(all_phrases) == len(set(all_phrases)), "تكرار متلازمة في البنك النهائي"
    merged_context = {source: dict(alternatives) for source, alternatives in current_context.items()}
    if not context_present:
        for source, alternatives in BATCH.items():
            assert source not in merged_context, f"مصدر متكرر: {source}"
            merged_context[source] = alternatives

    koll_text = json.dumps(final_koll, ensure_ascii=False, indent=1) + "\n"
    if KOLLOK.read_text(encoding="utf-8") != koll_text:
        KOLLOK.write_text(koll_text, encoding="utf-8")
    if not context_present:
        CONTEXT.write_text(json.dumps(merged_context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"نجح الفحص قبل الكتابة: دعم {len(KOLLOCATION_PATCH)} بطاقات A1/10 عبارات؛ السياقات {sum(map(len, merged_context.values()))}/70؛ قائمة syn الخام بقيت {sum(map(len, raw_syn.values()))}")


if __name__ == "__main__":
    main()
