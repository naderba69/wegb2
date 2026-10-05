#!/usr/bin/env python3
"""الدفعة 7: استكمال السياقات العشرة المتبقية بمتلازمات أساس قابلة للتدريب."""
import json
import re
from pathlib import Path

CONTEXT = Path("content/synonyme-kontext.json")
KOLLOK = Path("content/kollokationen.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")
ARTICLE = re.compile(r"^(der|die|das)\s+", re.IGNORECASE)
BEFORE = 60
AFTER = 70

# أربع بطاقات A1 وثلاث بطاقات A2 خارج قوائم SOLL بلا متلازمات؛ عبارتان فريدتان لكل بطاقة.
KOLLOCATION_PATCH = {
    "v936": ["froh über die Nachricht", "froh über das Ergebnis"],
    "vb-abschl-048": ["nett zu Kindern", "nett zu Gästen"],
    "vw-a1sta-033": ["weit weg vom Bahnhof", "weit weg vom Zentrum"],
    "vy-natur-043": ["mit dem Ergebnis zufrieden", "mit der Antwort zufrieden"],
    "vf-kultur-010": ["altmodisch aussehen", "altmodisch wirken"],
    "vd-gesund-006": ["ein Spiel gewinnen", "das Finale gewinnen"],
    "vf-kultur-002": ["kräftig gebaut", "kräftig wirken"],
}

# بطاقتا A2 في SOLL تملكان إدخالين؛ نضيف عبارة سياقية ثالثة فقط، ضمن سقف K73.
KOLLOCATION_APPEND = {
    "v1427": "in den Urlaub fahren",
    "v075": "glauben, dass der Bus kommt",
}
KOLLOCATION_PRESERVE = {
    "v1427": ["Urlaub machen", "im Urlaub sein"],
    "v075": ["an die Zukunft glauben", "an Gott glauben"],
}

BATCH = {
    "altmodisch": {
        "veraltet": {
            "basisKollokation": "altmodisch aussehen",
            "alternativKollokation": "veraltet aussehen",
            "basisDe": "Das Handy sieht altmodisch aus.",
            "basisAr": "يبدو الهاتف قديماً في طرازه.",
            "alternativDe": "Das Handy sieht veraltet aus.",
            "alternativAr": "يبدو الهاتف متقادماً.",
            "nuanceAr": "عند وصف جهاز أو تقنيته قد يتقاربان؛ altmodisch يركّز على مظهر قديم الطراز، وveraltet على التقادم وعدم مواكبة الحاضر، لذلك لا يتبادلان في كل وصف للقديم.",
        }
    },
    "der Urlaub": {
        "die Ferien": {
            "basisKollokation": "in den Urlaub fahren",
            "alternativKollokation": "in die Ferien fahren",
            "basisDe": "Die Familie fährt im Sommer in den Urlaub.",
            "basisAr": "تسافر الأسرة في الصيف لقضاء إجازتها.",
            "alternativDe": "Die Familie fährt im Sommer in die Ferien.",
            "alternativAr": "تسافر الأسرة في الصيف لقضاء العطلة.",
            "nuanceAr": "في سياق السفر قد يتقاربان؛ Urlaub يركّز على إجازة الشخص أو الرحلة، وFerien اسم جمع لفترة عطلة، ولا سيما المدرسية أو الجامعية؛ لذلك لا يحل أحدهما محل الآخر في كل استعمال.",
        }
    },
    "die Rente": {
        "die Pension": {
            "basisKollokation": "in Rente gehen",
            "alternativKollokation": "in Pension gehen",
            "basisDe": "Die Angestellte geht nach vielen Arbeitsjahren in Rente.",
            "basisAr": "تتقاعد الموظفة بعد سنوات طويلة من العمل.",
            "alternativDe": "Die Beamtin geht nach vielen Dienstjahren in Pension.",
            "alternativAr": "تتقاعد الموظفة الحكومية بعد سنوات طويلة من الخدمة.",
            "nuanceAr": "في حديث التقاعد بألمانيا، Rente شائعة لمعاش التأمين القانوني للعاملين، وPension لمعاش موظفي الدولة؛ وفي النمسا قد تُستعمل Pension أوسع. يلتقيان في موضوع دخل التقاعد، لا بوصفهما بديلين مطلقين.",
        }
    },
    "froh": {
        "glücklich": {
            "basisKollokation": "froh über die Nachricht",
            "alternativKollokation": "glücklich über die Nachricht",
            "basisDe": "Sie ist froh über die Nachricht.",
            "basisAr": "هي مسرورة بالخبر.",
            "alternativDe": "Sie ist glücklich über die Nachricht.",
            "alternativAr": "هي سعيدة بالخبر.",
            "nuanceAr": "عند التعبير عن رد فعل إيجابي تجاه خبر يتقاربان؛ froh قد يبرز الارتياح، بينما glücklich أوسع وغالباً أقوى، فلا يتبادلان في كل معنى للسعادة.",
        }
    },
    "gewinnen": {
        "siegen": {
            "basisKollokation": "ein Spiel gewinnen",
            "alternativKollokation": "im Spiel siegen",
            "basisDe": "Unsere Mannschaft gewinnt das Spiel.",
            "basisAr": "يفوز فريقنا بالمباراة.",
            "alternativDe": "Unsere Mannschaft siegt im Spiel.",
            "alternativAr": "ينتصر فريقنا في المباراة.",
            "nuanceAr": "في سياق المنافسة يتقاربان؛ gewinnen يأخذ غالباً مفعولاً به لما يُفاز به، أما siegen فيصف إحراز النصر ولا يأخذ ذلك المفعول مباشرةً؛ فلا يُستبدل الفعلان مع بقاء التركيب نفسه.",
        }
    },
    "glauben": {
        "meinen": {
            "basisKollokation": "glauben, dass der Bus kommt",
            "alternativKollokation": "meinen, dass der Bus kommt",
            "basisDe": "Ich glaube, dass der Bus gleich kommt.",
            "basisAr": "أعتقد أن الحافلة ستأتي بعد قليل.",
            "alternativDe": "Ich meine, dass der Bus gleich kommt.",
            "alternativAr": "أرى أن الحافلة ستأتي بعد قليل.",
            "nuanceAr": "عند إبداء تقدير بشأن واقعة محتملة قد يتقاربان؛ meinen يقدّم الرأي أو التقدير، وglauben قد يدل أيضاً على الاعتقاد أو الثقة، فلا يتبادلان في كل معنى.",
        }
    },
    "kräftig": {
        "muskulös": {
            "basisKollokation": "kräftig gebaut",
            "alternativKollokation": "muskulös gebaut",
            "basisDe": "Der Mann ist kräftig gebaut.",
            "basisAr": "بنية الرجل قوية.",
            "alternativDe": "Der Mann ist muskulös gebaut.",
            "alternativAr": "بنية الرجل عضلية.",
            "nuanceAr": "في وصف بنية الجسم يتقاربان؛ kräftig أوسع وقد يدل على القوة أو المتانة، بينما muskulös يحدّد بروز العضلات؛ فلا يصفان بالطريقة نفسها كل جسم قوي.",
        }
    },
    "nett": {
        "freundlich": {
            "basisKollokation": "nett zu Kindern",
            "alternativKollokation": "freundlich zu Kindern",
            "basisDe": "Die Lehrerin ist nett zu den Kindern.",
            "basisAr": "المعلمة لطيفة مع الأطفال.",
            "alternativDe": "Die Lehrerin ist freundlich zu den Kindern.",
            "alternativAr": "المعلمة ودودة مع الأطفال.",
            "nuanceAr": "في وصف التعامل مع الأطفال يتقاربان؛ nett أعمّ وأقرب إلى «لطيف» في الحكم على الشخص، بينما freundlich يصف الود أو حسن المعاملة الظاهر، ولا يتبادلان في كل تركيب.",
        }
    },
    "weit": {
        "entfernt": {
            "basisKollokation": "weit weg vom Bahnhof",
            "alternativKollokation": "weit vom Bahnhof entfernt",
            "basisDe": "Das Dorf liegt weit weg vom Bahnhof.",
            "basisAr": "تقع القرية بعيداً عن محطة القطار.",
            "alternativDe": "Das Dorf liegt weit vom Bahnhof entfernt.",
            "alternativAr": "تقع القرية على مسافة بعيدة من محطة القطار.",
            "nuanceAr": "في وصف المسافة المكانية يتقاربان؛ entfernt يحدّد البعد عن نقطة، أما weit فأوسع وقد يصف الامتداد أو النطاق، فلا يكونان بديلين في كل استعمال.",
        }
    },
    "zufrieden": {
        "befriedigt": {
            "basisKollokation": "mit dem Ergebnis zufrieden",
            "alternativKollokation": "von dem Ergebnis sehr befriedigt",
            "basisDe": "Die Kundin ist mit dem Ergebnis zufrieden.",
            "basisAr": "الزبونة راضية عن النتيجة.",
            "alternativDe": "Die Kundin zeigt sich von dem Ergebnis sehr befriedigt.",
            "alternativAr": "تُظهر الزبونة رضاها الكبير عن النتيجة.",
            "nuanceAr": "في تقييم رسمي لنتيجة محددة قد يتقاربان؛ zufrieden أعمّ في وصف الرضا، بينما befriedigt يوحي بأن مطلباً أو توقعاً قد لُبّي، وهو أخصّ وقد يحمل مع الأشخاص إيحاءً آخر؛ فلا يُستبدل به عموماً.",
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

    assert len(BATCH) == 10 and sum(map(len, BATCH.values())) == 10, "يجب أن تضم الدفعة السابعة 10 علاقات بالضبط"
    context_present = all(current_context.get(source, {}).get(target) == item for source, alternatives in BATCH.items() for target, item in alternatives.items())
    context_absent = all(source not in current_context for source in BATCH)
    assert context_present or context_absent, "حالة جزئية أو متعارضة في سياقات الدفعة السابعة"
    if context_present:
        assert current_count == AFTER, f"الدفعة موجودة لكن المطلوب {AFTER} سياقاً: {current_count}"
    else:
        assert current_count == BEFORE, f"المتوقع {BEFORE} سياقاً قبل الدفعة، الموجود {current_count}"

    new_present = all(current_koll.get(card_id) == phrases for card_id, phrases in KOLLOCATION_PATCH.items())
    new_absent = all(card_id not in current_koll for card_id in KOLLOCATION_PATCH)
    append_present = all(current_koll.get(card_id) == KOLLOCATION_PRESERVE[card_id] + [phrase] for card_id, phrase in KOLLOCATION_APPEND.items())
    append_absent = all(current_koll.get(card_id) == KOLLOCATION_PRESERVE[card_id] for card_id in KOLLOCATION_APPEND)
    assert (new_present and append_present) or (new_absent and append_absent), "حالة جزئية أو متعارضة في دعم متلازمات الدفعة السابعة"

    vocab = load_json(Path("content/vocab.json"))
    packs = vocab if isinstance(vocab, list) else list(vocab.values())
    cards = [card for pack in packs for card in pack.get("cards", [])]
    by_id = {card["id"]: card for card in cards}
    by_de: dict[str, list[dict]] = {}
    for card in cards:
        by_de.setdefault(card["de"].strip().lower(), []).append(card)

    raw_syn = load_json(Path("content/synonyme.json"))
    raw_pairs = {(source, target) for source, targets in raw_syn.items() for target in targets}
    assert len(raw_pairs) == 70, "يجب أن تبقى قائمة syn الخام عند 70 علاقة"
    koll_soll = load_json(Path("content/kollok-a1a2-soll.json"))
    protected_soll = {level: {item["id"] for item in koll_soll[level]["karten"]} for level in ("A1", "A2")}
    assert len(protected_soll["A1"]) == 170 and len(protected_soll["A2"]) == 245, "قوائم SOLL الأساسية تغيّرت"

    proposed = {phrase for phrases in KOLLOCATION_PATCH.values() for phrase in phrases} | set(KOLLOCATION_APPEND.values())
    existing = {phrase for phrases in current_koll.values() for phrase in phrases}
    assert len(proposed) == 16 and len(existing) == sum(map(len, current_koll.values())), "صيغة بنك المتلازمات غير متوقعة"
    overlap = len(proposed & existing)
    assert overlap == (16 if new_present and append_present else 0), "متلازمة دعم مكررة أو تطبيق جزئي"

    final_koll = {card_id: list(phrases) for card_id, phrases in current_koll.items()}
    new_a1 = new_a2 = 0
    for card_id, phrases in KOLLOCATION_PATCH.items():
        card = by_id.get(card_id)
        assert card and card["de"].lower() in {source.lower() for source in BATCH}, f"بطاقة دعم غير مستخدمة في الدفعة: {card_id}"
        assert card["level"] in {"A1", "A2"} and card_id not in protected_soll[card["level"]], f"دعم خارج سياسة A1/A2 غير الأساسية: {card_id}"
        new_a1 += card["level"] == "A1"
        new_a2 += card["level"] == "A2"
        assert card_id not in current_koll or current_koll[card_id] == phrases, f"لن تُستبدل متلازمات قائمة: {card_id}"
        card_lemma = lemma(card["de"]).lower()
        for phrase in phrases:
            assert 2 <= len(phrase.split()) <= 6 and not has_arabic(phrase), f"متلازمة دعم فارغة أو طويلة أو عربية: {card_id}/{phrase}"
            assert card_lemma in phrase.lower(), f"كلمة البطاقة غائبة: {card['de']} / {phrase}"
        if card_id not in final_koll:
            final_koll[card_id] = list(phrases)
    assert new_a1 == 4 and new_a2 == 3, f"التوزيع المتوقع 4 A1 + 3 A2 خارج SOLL، الموجود {new_a1} + {new_a2}"

    for card_id, phrase in KOLLOCATION_APPEND.items():
        card = by_id.get(card_id)
        assert card and card["level"] == "A2" and card_id in protected_soll["A2"], f"إضافة ثالثة خارج بطاقة A2 الأساسية: {card_id}"
        assert current_koll[card_id] in (KOLLOCATION_PRESERVE[card_id], KOLLOCATION_PRESERVE[card_id] + [phrase]), f"لا يمكن إضافة عبارة ثالثة إلى {card_id}"
        assert 2 <= len(phrase.split()) <= 6 and not has_arabic(phrase) and lemma(card["de"]).lower() in phrase.lower(), f"عبارة A2 غير صالحة: {card_id}/{phrase}"
        if phrase not in final_koll[card_id]:
            final_koll[card_id].append(phrase)

    for source, alternatives in BATCH.items():
        hits = by_de.get(source.lower(), [])
        assert len(hits) == 1, f"البطاقة «{source}» موجودة {len(hits)} مرة"
        card = hits[0]
        assert card["level"] in {"A1", "A2", "B2"}, f"المستوى غير متوقع في الدفعة: {source}/{card['level']}"
        assert source in raw_syn, f"مصدر غير موجود في syn الخام: {source}"
        for target, item in alternatives.items():
            assert (source, target) in raw_pairs and target in (card.get("syn") or []), f"علاقة غير موجودة في syn الخام/البطاقة: {source}→{target}"
            assert item["basisKollokation"] in final_koll.get(card["id"], []), f"{source}: متلازمة الأساس غير موجودة"
            assert lemma(target).lower() in lemma(item["alternativKollokation"]).lower(), f"{source}→{target}: المقابل غائب عن المتلازمة البديلة"
            for key in ("basisDe", "alternativDe", "basisKollokation", "alternativKollokation"):
                assert item[key].strip() and not has_arabic(item[key]), f"حقل ألماني فارغ أو عربي: {source}/{key}"
            for key in ("basisAr", "alternativAr", "nuanceAr"):
                assert has_arabic(item[key]), f"غياب العربية في {source}/{key}"

    all_phrases = [phrase for phrases in final_koll.values() for phrase in phrases]
    assert len(all_phrases) == len(set(all_phrases)), "تكرار متلازمة في البنك النهائي"
    assert all(2 <= len(phrases) <= 3 for phrases in final_koll.values()), "خرق سقف K73: لكل بطاقة 2–3 متلازمات"
    assert len(final_koll) == 2122 and sum(map(len, final_koll.values())) == 4670, "أعداد البنك النهائي لا تطابق دفعة الدعم"
    a1_supported = sum(1 for card_id in final_koll if by_id[card_id]["level"] == "A1")
    a2_supported = sum(1 for card_id in final_koll if by_id[card_id]["level"] == "A2")
    assert a1_supported == 199 and a2_supported == 248, f"تغطية الدعم غير متوقعة: A1 {a1_supported}/A2 {a2_supported}"

    merged_context = {source: dict(alternatives) for source, alternatives in current_context.items()}
    if not context_present:
        for source, alternatives in BATCH.items():
            assert source not in merged_context, f"مصدر سياق متكرر: {source}"
            merged_context[source] = alternatives
    final_pairs = {(source, target) for source, alternatives in merged_context.items() for target in alternatives}
    assert len(final_pairs) == AFTER and final_pairs == raw_pairs, "يجب توثيق علاقات syn السبعين مرةً واحدةً بلا إضافة أو إسقاط"

    koll_text = json.dumps(final_koll, ensure_ascii=False, indent=1) + "\n"
    if KOLLOK.read_text(encoding="utf-8") != koll_text:
        KOLLOK.write_text(koll_text, encoding="utf-8")
    if not context_present:
        CONTEXT.write_text(json.dumps(merged_context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"نجح الفحص قبل الكتابة: السياقات {len(final_pairs)}/70؛ المتلازمات {len(final_koll)} بطاقة/{len(all_phrases)} عبارة؛ A1 {a1_supported} وA2 {a2_supported} مدعومة، وقوائم SOLL ثابتة")


if __name__ == "__main__":
    main()
