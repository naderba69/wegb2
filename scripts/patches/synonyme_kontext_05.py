#!/usr/bin/env python3
"""الدفعة 5: متلازمتان مساعدتان وسياق موثق لكل بطاقة A1 جديدة."""
import json
import re
from pathlib import Path

CONTEXT = Path("content/synonyme-kontext.json")
KOLLOK = Path("content/kollokationen.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")
ARTICLE = re.compile(r"^(der|die|das)\s+", re.IGNORECASE)
BEFORE = 40
AFTER = 50

# بطاقات A1 الآتية بلا متلازمات بعد مراجعة البنك. تُضاف عبارتان فريدتان
# لكل بطاقة كي يظل لكل سياق متلازمة أساس من بنك البطاقة نفسه.
KOLLOCATION_PATCH = {
    "vx-zeit--037": ["oft spazieren gehen", "oft Musik hören"],
    "vx-zeit--040": ["nie zu spät kommen", "nie rauchen"],
    "vx-haus--092": ["vielleicht morgen kommen", "vielleicht später gehen"],
    "vz-welt-b-056": ["ein Buch wieder lesen", "wieder von vorn anfangen"],
    "vz-welt-b-054": ["schon angekommen", "schon am Morgen"],
    "vx-zeit--033": ["jetzt anfangen", "jetzt weiterarbeiten"],
    "vx-haus--090": ["zusammen kochen", "zusammen lernen"],
    "vb-abschl-049": ["freundlich zu Gästen sein", "freundlich antworten"],
    "vw-a1koe-051": ["schmutzige Hände", "schmutzige Schuhe"],
    "v033": ["eine Wohnung mieten", "in der Wohnung wohnen"],
}

BATCH = {
    "oft": {
        "häufig": {
            "basisKollokation": "oft spazieren gehen",
            "alternativKollokation": "häufig spazieren gehen",
            "basisDe": "Wir gehen oft im Park spazieren.",
            "basisAr": "كثيراً ما نتمشّى في الحديقة.",
            "alternativDe": "Wir gehen häufig im Park spazieren.",
            "alternativAr": "كثيراً ما نتمشّى في الحديقة.",
            "nuanceAr": "في وصف تكرار التنزّه يتقاربان؛ oft أشيع في الكلام اليومي، بينما häufig قد يبدو أرسميّ أو أدقّ قليلاً، ولا يتبادلان آلياً في كل تركيب.",
        }
    },
    "nie": {
        "niemals": {
            "basisKollokation": "nie zu spät kommen",
            "alternativKollokation": "niemals zu spät kommen",
            "basisDe": "Sie kommt nie zu spät zur Arbeit.",
            "basisAr": "إنها لا تتأخر أبداً عن العمل.",
            "alternativDe": "Sie kommt niemals zu spät zur Arbeit.",
            "alternativAr": "إنها لا تتأخر مطلقاً عن العمل.",
            "nuanceAr": "كلاهما ينفي حدوث الشيء في أي وقت؛ niemals قد يشدّد النفي أكثر، وnie هو الشكل اليومي الأقصر والأشيع.",
        }
    },
    "vielleicht": {
        "möglicherweise": {
            "basisKollokation": "vielleicht morgen kommen",
            "alternativKollokation": "möglicherweise morgen kommen",
            "basisDe": "Vielleicht kommt der Bus morgen früh.",
            "basisAr": "ربما تأتي الحافلة صباح الغد.",
            "alternativDe": "Möglicherweise kommt der Bus morgen früh.",
            "alternativAr": "من المحتمل أن تأتي الحافلة صباح الغد.",
            "nuanceAr": "كلاهما يقدّم الاحتمال لا اليقين؛ vielleicht أشيع ومحايد في الحديث، أمّا möglicherweise فأرسميّ أو أكثر تصريحاً بالاحتمال.",
        }
    },
    "wieder": {
        "erneut": {
            "basisKollokation": "ein Buch wieder lesen",
            "alternativKollokation": "ein Buch erneut lesen",
            "basisDe": "Ich lese dieses Buch wieder.",
            "basisAr": "أقرأ هذا الكتاب من جديد.",
            "alternativDe": "Ich lese dieses Buch erneut.",
            "alternativAr": "أعيد قراءة هذا الكتاب.",
            "nuanceAr": "في معنى التكرار يتقاربان؛ wieder أشيع ومرنّ، بينما erneut أرسميّ قليلاً ويبرز حدوث الفعل مرة أخرى.",
        }
    },
    "schon": {
        "bereits": {
            "basisKollokation": "schon angekommen",
            "alternativKollokation": "bereits angekommen",
            "basisDe": "Der Zug ist schon angekommen.",
            "basisAr": "لقد وصل القطار بالفعل.",
            "alternativDe": "Der Zug ist bereits angekommen.",
            "alternativAr": "وصل القطار في وقت مبكر أو قبل المتوقع.",
            "nuanceAr": "كلاهما يفيد أن الوصول حصل قبل الآن؛ bereits أرسميّ نسبياً وقد يبرز أن الحدث وقع قبل الموعد أو المتوقع، وschon أشيع في الكلام.",
        }
    },
    "jetzt": {
        "nun": {
            "basisKollokation": "jetzt anfangen",
            "alternativKollokation": "nun anfangen",
            "basisDe": "Wir fangen jetzt mit der Aufgabe an.",
            "basisAr": "نبدأ المهمة الآن.",
            "alternativDe": "Nun fangen wir mit der Aufgabe an.",
            "alternativAr": "والآن نبدأ المهمة.",
            "nuanceAr": "في هذا السياق كلاهما يحدّد وقت البدء؛ jetzt يومي ومباشر، بينما nun أميل إلى الرسمية أو السرد ويصلح للانتقال إلى خطوة جديدة.",
        }
    },
    "zusammen": {
        "gemeinsam": {
            "basisKollokation": "zusammen kochen",
            "alternativKollokation": "gemeinsam kochen",
            "basisDe": "Heute kochen wir zusammen.",
            "basisAr": "نطبخ معاً اليوم.",
            "alternativDe": "Heute kochen wir gemeinsam.",
            "alternativAr": "نطبخ سوياً اليوم.",
            "nuanceAr": "عند وصف الطبخ مع أشخاص آخرين يتقاربان؛ zusammen أشيع وقد يشير إلى الفعل في صحبة بعضنا، وgemeinsam يبرز المشاركة في نشاط واحد.",
        }
    },
    "freundlich": {
        "nett": {
            "basisKollokation": "freundlich zu Gästen sein",
            "alternativKollokation": "nett zu Gästen sein",
            "basisDe": "Die Verkäuferin ist freundlich zu den Gästen.",
            "basisAr": "البائعة ودودة مع الضيوف.",
            "alternativDe": "Die Verkäuferin ist nett zu den Gästen.",
            "alternativAr": "البائعة لطيفة مع الضيوف.",
            "nuanceAr": "في وصف التعامل مع الضيوف يتقاربان؛ freundlich يركّز على الودّ وحسن المعاملة، بينما nett أعمّ وانطباعيّ أكثر، وقد يعني لطيفاً أو محبّباً.",
        }
    },
    "schmutzig": {
        "dreckig": {
            "basisKollokation": "schmutzige Hände",
            "alternativKollokation": "dreckige Hände",
            "basisDe": "Nach der Gartenarbeit sind meine Hände schmutzig.",
            "basisAr": "يداي متّسختان بعد العمل في الحديقة.",
            "alternativDe": "Nach der Gartenarbeit sind meine Hände dreckig.",
            "alternativAr": "يداي متّسختان بعد العمل في الحديقة.",
            "nuanceAr": "كلاهما يصف عدم النظافة؛ schmutzig محايد وأشيع في السياقات العامة، أمّا dreckig فأكثر تداولاً وقد يبدو أقوى أو أشدّ عامية.",
        }
    },
    "die Wohnung": {
        "das Appartement": {
            "basisKollokation": "eine Wohnung mieten",
            "alternativKollokation": "ein Appartement mieten",
            "basisDe": "Wir mieten eine Wohnung in der Stadt.",
            "basisAr": "نستأجر مسكناً في المدينة.",
            "alternativDe": "Wir mieten ein Appartement in der Stadt.",
            "alternativAr": "نستأجر شقّة من نوع أبارتمون في المدينة.",
            "nuanceAr": "في سياق الاستئجار قد يتقاربان، لكن Wohnung اسم عام للمسكن، وAppartement يوحي غالباً بوحدة أصغر أو مؤثثة؛ كما يتغيّر المقال إلى ein بسبب جنس Appartement المحايد.",
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

    assert len(BATCH) == 10 and sum(map(len, BATCH.values())) == 10, "يجب أن تضم الدفعة الخامسة عشر علاقة"
    assert len(KOLLOCATION_PATCH) == 10 and all(len(items) == 2 for items in KOLLOCATION_PATCH.values()), "متلازمتان بالضبط لكل بطاقة مساندة"
    context_present = all(current_context.get(source, {}).get(target) == item for source, alternatives in BATCH.items() for target, item in alternatives.items())
    context_absent = all(source not in current_context for source in BATCH)
    assert context_present or context_absent, "حالة جزئية أو متعارضة في سياقات الدفعة الخامسة"
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
    assert len(proposed) == 20 and len(existing) == sum(map(len, current_koll.values())), "صيغة بنك المتلازمات غير متوقعة"
    assert len(proposed & existing) == (20 if len(coll_present) == 10 else len(coll_present) * 2), "متلازمة مساندة مكررة في البنك"

    final_koll = {card_id: list(phrases) for card_id, phrases in current_koll.items()}
    batch_sources = {source.lower() for source in BATCH}
    for card_id, phrases in KOLLOCATION_PATCH.items():
        card = by_id.get(card_id)
        assert card and card["level"] == "A1" and card["de"].lower() in batch_sources, f"بطاقة مساندة غير متوقعة أو خارج A1: {card_id}"
        assert card_id not in protected_soll, f"البطاقة موجودة مسبقاً في قائمة SOLL الأساسية: {card_id}"
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
        assert card["level"] == "A1", f"المستوى خارج الدفعة: {source}/{card['level']}"
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
            assert source not in merged_context, f"مصدر مكرر: {source}"
            merged_context[source] = alternatives

    koll_text = json.dumps(final_koll, ensure_ascii=False, indent=1) + "\n"
    if KOLLOK.read_text(encoding="utf-8") != koll_text:
        KOLLOK.write_text(koll_text, encoding="utf-8")
    if not context_present:
        CONTEXT.write_text(json.dumps(merged_context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"نجح الفحص قبل الكتابة: متلازمات مساندة {len(KOLLOCATION_PATCH)} بطاقة/20 عبارة؛ سياقات {sum(map(len, merged_context.values()))}/70؛ قائمة syn الخام بقيت {sum(map(len, raw_syn.values()))}")


if __name__ == "__main__":
    main()
