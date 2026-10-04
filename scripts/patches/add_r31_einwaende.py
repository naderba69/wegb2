#!/usr/bin/env python3
"""Add the R31 surprise objections to the six Teil-3 speaking cards.

Run without arguments for a dry-run; pass --apply to write content/muendlich.json.
The patch is idempotent only when the current data exactly matches this source.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "muendlich.json"
PATCH: dict[str, list[dict[str, str]]] = {
    "mm07": [
        {
            "id": "mm07-einwand-1",
            "de": "Ganz so einfach ist es nicht: Im Homeoffice fehlen oft der direkte Austausch und die schnelle Hilfe im Team. Wie wollen Sie das ausgleichen?",
            "ar": "ليس الأمر بهذه البساطة: قد يغيب عن العمل من المنزل التواصل المباشر والمساعدة السريعة داخل الفريق. كيف تعوّضون ذلك؟",
        },
        {
            "id": "mm07-einwand-2",
            "de": "Ich verstehe Ihren Punkt, aber wer zu Hause keinen ruhigen Arbeitsplatz hat, ist benachteiligt. Sollte Homeoffice wirklich für alle gelten?",
            "ar": "أفهم وجهة نظرك، لكن من لا يملك مكاناً هادئاً للعمل في المنزل يكون في وضع أضعف. هل ينبغي أن ينطبق العمل من المنزل على الجميع فعلاً؟",
        },
    ],
    "mm08": [
        {
            "id": "mm08-einwand-1",
            "de": "Ein Verbot löst das Problem nicht unbedingt: Manche Schülerinnen und Schüler brauchen ihr Handy auf dem Schulweg oder für wichtige Absprachen. Wie sollte die Schule damit umgehen?",
            "ar": "الحظر لا يحل المشكلة بالضرورة: قد يحتاج بعض التلاميذ إلى هواتفهم في طريق المدرسة أو للتنسيق في أمور مهمة. كيف ينبغي للمدرسة أن تتعامل مع ذلك؟",
        },
        {
            "id": "mm08-einwand-2",
            "de": "Das klingt nach mehr Ruhe, aber ein pauschales Verbot behandelt alle gleich, obwohl sie das Handy unterschiedlich nutzen. Wäre eine klare Nutzungsregel nicht fairer?",
            "ar": "قد يبدو ذلك باعثاً على الهدوء، لكن الحظر الشامل يعامل الجميع بالطريقة نفسها رغم اختلاف استخدامهم للهاتف. ألن تكون قاعدة واضحة للاستخدام أعدل؟",
        },
    ],
    "mm09": [
        {
            "id": "mm09-einwand-1",
            "de": "Kostenlos heißt nicht, dass keine Kosten entstehen: Die Ausgaben müssten anders finanziert werden. Wer sollte dafür bezahlen?",
            "ar": "كون النقل مجانياً لا يعني انعدام تكلفته؛ فلا بد من تمويل النفقات بطريقة أخرى. فمن ينبغي أن يدفع؟",
        },
        {
            "id": "mm09-einwand-2",
            "de": "Ein kostenloses Ticket nützt wenig, wenn die Verbindung für manche Menschen nicht passt. Wie berücksichtigen Sie diese Gruppen?",
            "ar": "لا تفيد البطاقة المجانية كثيراً إذا لم يناسب خطّ النقل بعض الناس. كيف تراعون هذه الفئات؟",
        },
    ],
    "mm10": [
        {
            "id": "mm10-einwand-1",
            "de": "Eine Pflicht kann Widerstand auslösen, wenn die Regeln kompliziert sind. Wie verhindern Sie, dass Menschen nur aus Angst vor Strafen trennen?",
            "ar": "قد يثير الإلزام مقاومةً إذا كانت القواعد معقّدة. كيف تمنعون الناس من الفرز لمجرد الخوف من العقوبة؟",
        },
        {
            "id": "mm10-einwand-2",
            "de": "Nicht jeder Haushalt hat Platz für mehrere Behälter. Sollte man zuerst bessere Bedingungen schaffen, bevor man Kontrollen einführt?",
            "ar": "ليس في كل منزل متّسع لعدة حاويات. ألا ينبغي توفير ظروف أفضل أولاً قبل فرض الرقابة؟",
        },
    ],
    "mm11": [
        {
            "id": "mm11-einwand-1",
            "de": "Weniger Hausaufgaben bedeuten nicht automatisch mehr Erholung: Vielleicht verbringen manche Kinder die zusätzliche Zeit am Bildschirm. Woran würden Sie erkennen, dass Ihr Versuch wirkt?",
            "ar": "تقليل الواجبات لا يعني تلقائياً مزيداً من الراحة؛ فقد يقضي بعض الأطفال الوقت الإضافي أمام الشاشة. كيف تعرفون أن التجربة حققت أثرها؟",
        },
        {
            "id": "mm11-einwand-2",
            "de": "Wenn Hausaufgaben wegfallen, könnte selbstständiges Üben seltener werden. Wie ließe sich dieser Nachteil ausgleichen?",
            "ar": "إذا أُلغيت الواجبات، فقد تقلّ فرص التدريب المستقل. كيف يمكن تعويض هذا الجانب السلبي؟",
        },
    ],
    "mm12": [
        {
            "id": "mm12-einwand-1",
            "de": "Ein früher Beginn allein garantiert keinen Lernerfolg. Entscheidend ist auch, ob genügend qualifizierte Lehrkräfte da sind. Wie würden Sie das sicherstellen?",
            "ar": "البدء المبكر وحده لا يضمن نجاح التعلّم؛ فالأمر يتوقف أيضاً على توافر عدد كافٍ من المعلمين المؤهلين. كيف تضمنون ذلك؟",
        },
        {
            "id": "mm12-einwand-2",
            "de": "Wenn der Unterricht zu früh beginnt, könnten andere Grundlagen zu kurz kommen. Warum sollte eine Fremdsprache trotzdem Vorrang haben?",
            "ar": "إذا بدأ تعليم اللغة مبكراً جداً، فقد لا تحظى أسس أخرى بما يكفي من الوقت. فلماذا ينبغي أن تتقدم اللغة الأجنبية رغم ذلك؟",
        },
    ],
}


def validate(data: dict) -> tuple[list[dict], bool]:
    cards = data.get("karten")
    if not isinstance(cards, list):
        raise ValueError("Expected content/muendlich.json to contain a karten list")
    by_id = {card.get("id"): card for card in cards if isinstance(card, dict)}
    if len(by_id) != len(cards):
        raise ValueError("Card IDs are missing or duplicated")
    targets = {card_id: by_id.get(card_id) for card_id in PATCH}
    if any(card is None for card in targets.values()):
        missing = [card_id for card_id, card in targets.items() if card is None]
        raise ValueError(f"Missing target cards: {missing}")
    if any(targets[card_id].get("teil") != 3 for card_id in PATCH):
        raise ValueError("Every target must be a Teil-3 discussion card")

    already = ["einwaende" in card for card in targets.values()]
    if all(already):
        if any(targets[card_id]["einwaende"] != PATCH[card_id] for card_id in PATCH):
            raise ValueError("Existing R31 objections differ from the patch source; refusing to overwrite")
        return cards, True
    if any(already):
        raise ValueError("Only some target cards already have objections; refusing a partial patch")

    seen_ids: set[str] = set()
    seen_text: set[str] = set()
    for card_id, objections in PATCH.items():
        if len(objections) != 2:
            raise ValueError(f"{card_id} must have exactly two objections")
        for objection in objections:
            if not objection["id"].startswith(f"{card_id}-einwand-") or objection["id"] in seen_ids:
                raise ValueError(f"Invalid or duplicate objection ID: {objection['id']}")
            seen_ids.add(objection["id"])
            if len(objection["de"]) < 45 or not re.search(r"[.!?]$", objection["de"]):
                raise ValueError(f"German objection is incomplete: {objection['id']}")
            if re.search(r"[\u0600-\u06ff]", objection["de"]):
                raise ValueError(f"Arabic leaked into German objection: {objection['id']}")
            if not objection["ar"].strip() or not re.search(r"[\u0600-\u06ff]", objection["ar"]):
                raise ValueError(f"Arabic translation is missing: {objection['id']}")
            normalized = re.sub(r"\W+", " ", objection["de"].lower()).strip()
            if normalized in seen_text:
                raise ValueError(f"Duplicate German objection: {objection['id']}")
            seen_text.add(normalized)
    return cards, False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write the validated patch")
    args = parser.parse_args()

    with TARGET.open(encoding="utf-8") as f:
        data = json.load(f)
    cards, already_applied = validate(data)
    if already_applied:
        print("R31 preflight: the exact patch is already present; no write needed.")
        return
    print(f"R31 preflight passed: {len(PATCH)} Teil-3 cards, {sum(map(len, PATCH.values()))} unique objections, German/Arabic fields valid.")
    if not args.apply:
        print("Dry run only. Re-run with --apply to write content/muendlich.json.")
        return

    by_id = {card["id"]: card for card in cards}
    for card_id, objections in PATCH.items():
        by_id[card_id]["einwaende"] = objections
    TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Applied R31 to content/muendlich.json.")


if __name__ == "__main__":
    main()
