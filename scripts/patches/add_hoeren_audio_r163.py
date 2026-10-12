# -*- coding: utf-8 -*-
"""دفعة R163: إكمال تسجيلات نصوص HörLabor الستة المتبقية في A1.

تُصلح الرقعة عدّ كلمتين وترجمة عربية واحدة، ثم تتحقق من تطابق نصوص المصدر
وملفات MP3 وإطاراتها، وتضيف الإدخالات إلى مانيفستو HörLabor وحده.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from add_a0_hoeren_audio_02 import mp3_frame_count

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
VOICE = "voice-00 (de-DE, Arena TTS)"

FIELD_EDITS = [
    ("t-a1-030", ("wordCountDe",), 117, 119),
    ("t-a1-035", ("ar",),
     "اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين. وهناك عصير أيضاً. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي زهوراً أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أرتب الفناجين. أنا متعب لكنني راضٍ.",
     "اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين. وهناك عصير أيضاً. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي زهوراً أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أجمع الفناجين وأضعها في مكانها. أنا متعب لكنني راضٍ."),
    ("t-a1-035", ("wordCountDe",), 109, 112),
]

AUDIO_TEXTS = {
    "t-a1-030": "Heute bin ich bei der Ärztin. Ich habe seit zwei Tagen Kopfschmerzen. Die Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh und ich habe ein bisschen Fieber.“ Sie untersucht mich und sagt: „Vielleicht ist es eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“ In der Praxis warten noch drei Personen. Ich sitze im Wartezimmer und lese eine Zeitschrift. Nach zwanzig Minuten ruft mich die Ärztin. Sie fragt: „Haben Sie auch Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie misst meine Temperatur. Dann schreibt sie ein Rezept. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir besser.",
    "t-a1-031": "Ich habe eine kleine Katze. Sie heißt Mimi und ist zwei Jahre alt. Sie ist schwarz-weiß und sehr süß. Jeden Morgen gebe ich ihr Futter und frisches Wasser. Am Abend spielt sie gern mit einem roten Ball. Wenn ich nach Hause komme, wartet sie schon vor der Tür. Am Morgen sitzt sie oft am Fenster und sieht die Vögel im Garten. Nach der Arbeit spiele ich zehn Minuten mit ihr. Dann schläft sie gern auf dem Sofa. Am Wochenende putze ich ihr Körbchen und fülle ihren Napf mit Wasser. Meine Familie mag Mimi auch. Wir lachen oft, wenn sie schnell durch die Wohnung läuft. Für uns ist sie ein liebes Tier.",
    "t-a1-032": "Am Wochenende schlafe ich länger als in der Woche. Am Samstag stehe ich um neun Uhr auf. Zuerst frühstücke ich und höre Musik. Dann putze ich die Wohnung und kaufe ein. Im Supermarkt kaufe ich Brot, Milch und Obst. Am Nachmittag treffe ich meine Freunde. Wir spielen Karten bei mir zu Hause und sprechen viel. Am Sonntag besuche ich meine Familie. Wir essen zusammen zu Mittag. Manchmal schaue ich am Abend einen Film. Am Sonntagabend koche ich etwas Leckeres. Danach bereite ich meine Sachen für Montag vor. Ich packe meine Tasche und stelle den Wecker. So beginnt die neue Woche ruhig.",
    "t-a1-033": "Zum Frühstück esse ich gern Brot mit Marmelade und trinke Kaffee. Am Morgen habe ich genug Zeit. Manchmal esse ich auch ein Ei. Zum Mittagessen gehe ich in die Kantine. Dort gibt es Fleisch mit Kartoffeln und Gemüse. An einem Tisch am Fenster esse ich oft mit meinen Kollegen. Nach dem Essen gehe ich kurz nach draußen. Zum Abendessen koche ich zu Hause Nudeln mit Tomatensauce oder Reis mit Gemüse. Am Samstag lade ich manchmal Freunde ein. Dann kochen wir zusammen und essen lange. Ich trinke viel Wasser und manchmal Apfelsaft. Nach dem Abendessen mache ich gern einen Tee.",
    "t-a1-034": "„Entschuldigung, wo ist der Bahnhof?“ – „Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab. Gehen Sie am Park und an einer Bäckerei vorbei. Nach etwa zweihundert Metern sehen Sie den Bahnhof auf der rechten Seite. Vor dem Bahnhof ist ein kleiner Platz. Auf dem Platz gibt es mehrere Bänke. Zu Fuß brauchen Sie etwa fünf Minuten. Alternativ nehmen Sie die Buslinie drei. Die Bushaltestelle ist direkt neben der Apotheke.“ – „Fährt der Bus direkt zum Bahnhof?“ – „Ja, genau.“ – „Vielen Dank!“ – „Bitte schön. Gute Fahrt!“",
    "t-a1-035": "Heute habe ich Geburtstag und bin dreißig Jahre alt. Ich habe sechs Freunde zum Geburtstag eingeladen. Sie kommen am Nachmittag um vier Uhr. Sie bringen Geschenke: ein Buch, eine Flasche Wein und eine Karte. Meine Frau hat einen Kuchen gebacken. Wir essen zusammen Kuchen und trinken Kaffee. Es ist ein schöner Tag und ich bin sehr glücklich. Auf dem Tisch stehen Teller und Tassen. Es gibt auch Saft. Meine Mutter ruft an und gratuliert mir. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Wir machen ein Foto im Garten. Am Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg. Ich bin müde, aber zufrieden.",
}


def get_field(item: dict, path: tuple) -> object:
    value: object = item
    for key in path:
        value = value[key]  # type: ignore[index]
    return value


def set_field(item: dict, path: tuple, value: object) -> None:
    parent = item
    for key in path[:-1]:
        parent = parent[key]  # type: ignore[index]
    parent[path[-1]] = value


def main() -> None:
    texts = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    text_by_id = {item["id"]: item for item in texts}
    if len(text_by_id) != len(texts):
        raise ValueError("duplicate text ids")

    changed = False
    for text_id, path, before, after in FIELD_EDITS:
        item = text_by_id.get(text_id)
        if item is None or item.get("level") != "A1":
            raise ValueError(f"missing A1 source text: {text_id}")
        current = get_field(item, path)
        if current == before:
            set_field(item, path, after)
            changed = True
        elif current != after:
            raise ValueError(f"unexpected source value for {text_id} {path}")
    if changed:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    existing = {entry["id"]: entry for entry in entries}
    if len(existing) != len(entries):
        raise ValueError("duplicate HörLabor manifest ids")
    if len(entries) not in (104, 110):
        raise ValueError(f"expected 104 before or 110 after R163, got {len(entries)}")

    dialog_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "dialog-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    diktat_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "diktat-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    added = 0
    for text_id, expected_text in AUDIO_TEXTS.items():
        source = text_by_id.get(text_id)
        if source is None or source.get("level") != "A1" or source.get("neu"):
            raise ValueError(f"unknown, wrong-level, or neu source: {text_id}")
        if source.get("de") != expected_text:
            raise ValueError(f"audio source text mismatch: {text_id}")
        if source.get("wordCountDe") != len(source["de"].split()):
            raise ValueError(f"wordCountDe mismatch: {text_id}")
        if text_id in dialog_ids or text_id in diktat_ids:
            raise ValueError(f"cross-manifest audio assignment: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        frames = mp3_frame_count(path.read_bytes())
        if frames <= 0:
            raise ValueError(f"no MPEG Layer III frames: {path}")
        expected_entry = {
            "id": text_id,
            "file": f"/audio/hoeren/{text_id}.mp3",
            "voice": VOICE,
            "level": "A1",
            "bytes": path.stat().st_size,
        }
        old = existing.get(text_id)
        if old is None:
            entries.append(expected_entry)
            existing[text_id] = expected_entry
            added += 1
        elif any(old.get(key) != value for key, value in expected_entry.items()):
            raise ValueError(f"manifest entry mismatch: {text_id}")
        print(f"✓ {text_id}: {len(source['de'].split())} words · {path.stat().st_size} bytes · {frames} MP3 frames")

    expected_new = set(AUDIO_TEXTS)
    disk_ids = {path.stem for path in AUDIO_DIR.glob("*.mp3")}
    manifest_ids = {entry["id"] for entry in entries}
    if disk_ids != manifest_ids:
        raise ValueError(f"manifest/disk mismatch: disk-only={disk_ids - manifest_ids}, manifest-only={manifest_ids - disk_ids}")
    if not expected_new.issubset(manifest_ids) or len(entries) != 110:
        raise ValueError(f"expected 110 HörLabor entries after R163, got {len(entries)}")

    manifest["count"] = len(entries)
    manifest["updated"] = date.today().isoformat()
    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R163: {added} new manifest entries · {manifest['count']} HörLabor files total")


if __name__ == "__main__":
    main()
