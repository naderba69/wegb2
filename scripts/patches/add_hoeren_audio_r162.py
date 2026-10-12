# -*- coding: utf-8 -*-
"""دفعة R162: إكمال نصوص A0 الصوتية وإضافة تسعة نصوص A1 إلى HörLabor.

تتحقق الرقعة من تطابق المصدر، وحجم كل MP3 وإطاراته، ثم تحدّث مانيفستو
الاستماع فقط. تغييرات النصوص محروسة بالقيمة السابقة وقابلة لإعادة التشغيل.
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
    (
        "t-a1-026",
        ("de",),
        "Heute ist das Wetter sehr schön. Die Sonne scheint und der Himmel ist blau. Es ist nicht zu kalt und nicht zu heiß. Es sind etwa zwanzig Grad. Ich ziehe ein T-Shirt und eine leichte Jacke an. Am Nachmittag gehe ich spazieren und höre Musik. Ich rufe meine Freundin an, und wir treffen uns im Park. Dort sitzen wir auf einer Bank, sprechen und lachen. Wir sehen viele Kinder und einen kleinen Hund. Später kaufen wir ein Eis. Am Abend koche ich zu Hause Nudeln. Danach sehe ich aus dem Fenster: Der Himmel ist noch blau. Ich öffne das Fenster und höre die Vögel. So ein Tag gefällt mir sehr.",
        "An einem sonnigen Tag ist das Wetter sehr schön. Die Sonne scheint und der Himmel ist blau. Es ist nicht zu kalt und nicht zu heiß. Es sind etwa zwanzig Grad. Ich ziehe ein T-Shirt und eine leichte Jacke an. Am Nachmittag gehe ich spazieren und höre Musik. Ich rufe meine Freundin an, und wir treffen uns im Park. Dort sitzen wir auf einer Bank, sprechen und lachen. Wir sehen viele Kinder und einen kleinen Hund. Später kaufen wir ein Eis. Am Abend koche ich zu Hause Nudeln. Danach sehe ich aus dem Fenster: Der Himmel ist noch blau. Ich öffne das Fenster und höre die Vögel. So ein Tag gefällt mir sehr.",
    ),
    (
        "t-a1-026",
        ("ar",),
        "الطقس اليوم جميل جداً. الشمس مشرقة والسماء زرقاء. الجو ليس بارداً جداً ولا حاراً جداً. الحرارة نحو عشرين درجة. أرتدي تيشيرت وسترة خفيفة. أتمشى بعد الظهر وأستمع إلى الموسيقى. أتصل بصديقتي ونلتقي في الحديقة. نجلس هناك على مقعد ونتحدث ونضحك. نرى كثيراً من الأطفال وكلباً صغيراً. ثم نشتري بوظة. أطبخ المعكرونة في البيت مساءً. بعد ذلك أنظر من النافذة: ما زالت السماء زرقاء. أفتح النافذة وأسمع العصافير. يعجبني كثيراً يوم كهذا.",
        "الطقس جميل جداً في يوم مشمس. الشمس مشرقة والسماء زرقاء. الجو ليس بارداً جداً ولا حاراً جداً. الحرارة نحو عشرين درجة. أرتدي تيشيرت وسترة خفيفة. أتمشى بعد الظهر وأستمع إلى الموسيقى. أتصل بصديقتي ونلتقي في الحديقة. نجلس هناك على مقعد ونتحدث ونضحك. نرى كثيراً من الأطفال وكلباً صغيراً. ثم نشتري بوظة. أطبخ المعكرونة في البيت مساءً. بعد ذلك أنظر من النافذة: ما زالت السماء زرقاء. أفتح النافذة وأسمع العصافير. يعجبني كثيراً يوم كهذا.",
    ),
    (
        "t-a1-026",
        ("questions", 1, "promptAr"),
        "ماذا يفعل المتحدث بعد الظهر؟",
        "ماذا أفعل بعد الظهر؟",
    ),
    ("t-a1-023", ("wordCountDe",), 114, 113),
    ("t-a1-025", ("wordCountDe",), 118, 119),
    ("t-a1-026", ("wordCountDe",), 110, 113),
]

AUDIO_TEXTS = {
    "t-a0-015": "Ich wohne in einer kleinen Wohnung in der Stadt. Die Wohnung hat ein Wohnzimmer, ein Schlafzimmer, eine Küche und ein Bad. Im Wohnzimmer steht ein Sofa vor dem Fernseher. In der Küche mache ich Kaffee. Die Wohnung ist ruhig und hell.",
    "t-a1-021": "Ich heiße Karim und bin 28 Jahre alt. Ich wohne in Köln mit meiner Frau Amina. Unsere Tochter Sara ist drei Jahre alt. Mein Vater wohnt in Tunesien, aber er besucht uns jedes Jahr im Sommer. Am Freitag essen wir zusammen Couscous und trinken Minztee. Meine Frau arbeitet am Vormittag in einer Schule. Sara geht am Morgen in den Kindergarten. Am Nachmittag spielen wir oft zu Hause oder gehen in den Park. Am Sonntag rufe ich meine Mutter in Tunesien an. Wir sprechen lange über die Familie. Ich liebe meine Familie sehr und freue mich auf jeden Besuch.",
    "t-a1-022": "Ich stehe jeden Tag um halb sieben auf. Zuerst trinke ich einen Kaffee, dann dusche ich und ziehe mich an. Um acht Uhr frühstücke ich mit meiner Frau: Brot mit Käse und ein Ei. Danach räume ich den Tisch ab und packe meine Tasche. Um halb neun fahre ich mit dem Bus zur Arbeit. Die Haltestelle ist vor dem Haus. Im Büro begrüße ich meine Kollegen und beginne meine Arbeit. Um zwölf Uhr essen wir zusammen. Nach der Arbeit gehe ich manchmal noch einkaufen. Um sechs Uhr komme ich nach Hause. Am Abend erzählen meine Frau und ich uns von unserem Tag. Dann lese ich ein Buch oder sehe fern.",
    "t-a1-023": "Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer. Am Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern. Die Warmmiete beträgt sechshundert Euro. Die Wohnung liegt nahe an einer Bushaltestelle. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung.",
    "t-a1-024": "Ich wohne in Leipzig, einer Stadt im Osten von Deutschland. In der Stadt gibt es viele Parks, Cafés und Geschäfte. Am Wochenende gehe ich gern in die Innenstadt und trinke einen Kaffee mit Freunden. Die Straßenbahn fährt direkt vor meiner Haustür, das ist sehr praktisch. In meiner Straße gibt es auch eine Bäckerei und einen kleinen Supermarkt. Am Morgen kaufe ich dort manchmal frisches Brot. Der Park ist zehn Minuten zu Fuß entfernt. Im Sommer sitzen viele Menschen auf den Bänken. Am Samstag fahre ich mit Freunden in die Stadtmitte. Wir essen in einem Café und gehen danach in ein Geschäft. Am Abend fahre ich mit der Straßenbahn nach Hause. Die Haltestelle ist gleich neben meinem Haus. Leipzig gefällt mir sehr.",
    "t-a1-025": "Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser. Die Äpfel sind heute im Angebot. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter. Dann gehe ich zur Kasse. Vor mir stehen zwei Personen. Die Verkäuferin sagt: „Guten Tag.“ An der Kasse bezahle ich mit Karte. Die Verkäuferin gibt mir den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank.",
    "t-a1-026": "An einem sonnigen Tag ist das Wetter sehr schön. Die Sonne scheint und der Himmel ist blau. Es ist nicht zu kalt und nicht zu heiß. Es sind etwa zwanzig Grad. Ich ziehe ein T-Shirt und eine leichte Jacke an. Am Nachmittag gehe ich spazieren und höre Musik. Ich rufe meine Freundin an, und wir treffen uns im Park. Dort sitzen wir auf einer Bank, sprechen und lachen. Wir sehen viele Kinder und einen kleinen Hund. Später kaufen wir ein Eis. Am Abend koche ich zu Hause Nudeln. Danach sehe ich aus dem Fenster: Der Himmel ist noch blau. Ich öffne das Fenster und höre die Vögel. So ein Tag gefällt mir sehr.",
    "t-a1-027": "Mein Hobby ist Fußball. Jeden Freitagabend spiele ich mit meinen Kollegen. Wir spielen in einer Halle in der Nähe meiner Wohnung. Die Halle ist groß und hat zwei Tore. Wir treffen uns um sieben Uhr. Vor dem Spiel ziehen wir unsere Sportsachen an und trinken Wasser. Dann spielen wir eine Stunde. Ich bin nicht sehr gut, aber ich spiele gern. Mein Freund Paul ist der Torwart und hält viele Bälle. Nach dem Spiel trinken wir zusammen ein Bier. Manchmal sitzen wir noch eine Weile zusammen und sprechen über die Arbeit. Am Samstag bin ich oft müde, aber ich freue mich schon auf das nächste Spiel.",
    "t-a1-028": "Ich arbeite als Ingenieur in einer kleinen Firma in der Stadt. Die Firma macht Maschinen für Autos. Jeden Tag stehe ich um halb sieben auf und fahre mit dem Bus zur Arbeit. Meine Kollegen sind sehr nett. Ich beginne um acht Uhr. Zuerst lese ich meine E-Mails. Dann spreche ich mit meinem Chef über den Tag. In der Werkstatt prüfen wir die Maschinen. Um zwölf Uhr mache ich eine Pause und esse Brot mit Käse. Am Nachmittag arbeite ich mit einem Kollegen. Manchmal haben wir viel Arbeit, aber mein Beruf gefällt mir. Um fünf Uhr fahre ich nach Hause. Am Wochenende mache ich Sport oder besuche meine Eltern.",
    "t-a1-029": "Heute trage ich eine blaue Jeans, ein weißes T-Shirt und schwarze Schuhe. Im Winter ziehe ich eine warme Jacke an, manchmal auch einen Schal und Handschuhe. Im Sommer trage ich kurze Hosen und T-Shirts. Zu Hause trage ich gern eine bequeme Hose und ein altes T-Shirt. Für die Arbeit brauche ich keine besondere Kleidung. Am Samstag gehe ich mit meiner Freundin in ein Geschäft. Sie sucht ein Kleid, und ich brauche neue Socken. Im Geschäft probiere ich eine grüne Jacke an. Sie passt gut, aber sie ist ein bisschen teuer. Ich kaufe sie nicht. Am Ende fahren wir mit dem Bus nach Hause.",
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
        raise ValueError("duplicate manifest ids before R162")
    added = 0
    for text_id, expected_text in AUDIO_TEXTS.items():
        source = text_by_id.get(text_id)
        expected_level = "A0" if text_id == "t-a0-015" else "A1"
        if source is None or source.get("level") != expected_level or source.get("neu"):
            raise ValueError(f"unknown, wrong-level, or neu source: {text_id}")
        if source.get("de") != expected_text:
            raise ValueError(f"audio source text mismatch: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        frames = mp3_frame_count(path.read_bytes())
        expected_entry = {
            "id": text_id,
            "file": f"/audio/hoeren/{text_id}.mp3",
            "voice": VOICE,
            "level": expected_level,
            "bytes": path.stat().st_size,
        }
        old = existing.get(text_id)
        if old is None:
            entries.append(expected_entry)
            existing[text_id] = expected_entry
            added += 1
        elif any(old.get(key) != value for key, value in expected_entry.items()):
            raise ValueError(f"manifest entry mismatch: {text_id}")
        print(f"✓ {text_id}: {path.stat().st_size} bytes · {frames} MP3 frames")

    disk_ids = {path.stem for path in AUDIO_DIR.glob("*.mp3")}
    manifest_ids = {entry["id"] for entry in entries}
    if disk_ids != manifest_ids:
        raise ValueError(f"manifest/disk mismatch: disk-only={disk_ids - manifest_ids}, manifest-only={manifest_ids - disk_ids}")
    if len(entries) != 104:
        raise ValueError(f"expected 104 HörLabor entries after R162, got {len(entries)}")

    manifest["count"] = len(entries)
    manifest["updated"] = date.today().isoformat()
    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R162: {added} neue Manifest-Einträge · {manifest['count']} Hördateien insgesamt")


if __name__ == "__main__":
    main()
