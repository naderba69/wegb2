# -*- coding: utf-8 -*-
"""دفعة R161: ملفات HörLabor لنصوص A0، مع تصحيحات ألمانية صغيرة لازمة قبل التسجيل.

تُولَّد ملفات MP3 أولاً بصوت de-DE المختار، ثم يتحقق هذا السكربت من النصوص
والإطارات والبيانات الوصفية ويحدّث مانيفستو الاستماع وحده. التشغيل آمن ومتكرر.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
VOICE = "voice-00 (de-DE, Arena TTS)"

TEXT_EDITS = {
    "t-a0-07": (
        "Am Montag gehe ich zur Arbeit. Am Dienstag habe ich Deutschkurs. Am Mittwoch kaufe ich ein. Am Donnerstag treffe ich meine Freunde. Am Freitag sehe ich fern. Am Samstag schlafe ich lange. Am Sonntag besuche ich meine Familie.",
        "Am Montag gehe ich zur Arbeit. Am Dienstag habe ich einen Deutschkurs. Am Mittwoch kaufe ich ein. Am Donnerstag treffe ich meine Freunde. Am Freitag sehe ich fern. Am Samstag schlafe ich lange. Am Sonntag besuche ich meine Familie.",
    ),
    "t-a0-08": (
        "Ich esse gern Brot mit Käse zum Frühstück. Zum Mittag esse ich gern Reis mit Gemüse und Fleisch. Zum Abendbrot trinke ich Tee und esse Obst. Ich trinke nicht viel Kaffee. Mein Lieblingsobst ist der Apfel. Ich mag Bananen und Orangen auch.",
        "Ich esse gern Brot mit Käse zum Frühstück. Zum Mittag esse ich gern Reis mit Gemüse und Fleisch. Zum Abendbrot trinke ich Tee und esse Obst. Ich trinke nicht viel Kaffee. Mein Lieblingsobst ist der Apfel. Ich mag auch Bananen und Orangen.",
    ),
    "t-a0-10": (
        "Im Winter ist es kalt und es schneit. Ich trage eine dicke Jacke. Im Frühling blühen die Blumen. Im Sommer ist es heiß, ich gehe schwimmen. Im Herbst sind die Blätter bunt: rot, gelb und braun. Ich mag den Frühling am liebsten.",
        "Im Winter ist es kalt und es schneit. Ich trage eine dicke Jacke. Im Frühling blühen die Blumen. Im Sommer ist es heiß. Ich gehe schwimmen. Im Herbst sind die Blätter bunt: rot, gelb und braun. Ich mag den Frühling am liebsten.",
    ),
}

AUDIO_TEXTS = {
    "t-a0-01": "Hallo! Ich heiße Ali. Ich komme aus Tunesien. Ich wohne in Berlin. Ich lerne Deutsch. Guten Tag! Wie heißt du?",
    "t-a0-06": "Das ist mein Klassenzimmer. Hier lerne ich Deutsch. Die Lehrerin heißt Frau Schulz. Sie ist sehr nett. Im Kurs sind 12 Studenten. Sie kommen aus Syrien, aus der Türkei, aus Polen und aus Italien. Wir sprechen zusammen Deutsch. Manchmal lachen wir viel.",
    "t-a0-07": TEXT_EDITS["t-a0-07"][1],
    "t-a0-08": TEXT_EDITS["t-a0-08"][1],
    "t-a0-09": "Ich stehe um 7 Uhr auf. Um 8 Uhr frühstücke ich. Um 9 Uhr beginne ich mit der Arbeit. Um 12 Uhr esse ich zu Mittag. Um 17 Uhr gehe ich nach Hause. Um 19 Uhr esse ich zu Abend. Um 23 Uhr gehe ich ins Bett.",
    "t-a0-10": TEXT_EDITS["t-a0-10"][1],
    "t-a0-011": "Ich habe eine Schultasche. Sie ist blau und rot. In der Tasche sind drei Hefte, ein Kugelschreiber, ein Bleistift und ein Radiergummi. Ich habe auch ein Buch für den Deutschunterricht. Die Tasche ist nicht schwer. Ich nehme sie jeden Morgen in die Schule.",
    "t-a0-012": "Am Samstag stehe ich spät auf. Ich trinke Kaffee und lese die Zeitung. Am Nachmittag gehe ich mit meinem Hund im Park spazieren. Am Sonntag besuche ich meine Mutter. Wir essen zusammen Kuchen und trinken Tee. Das Wochenende ist schön.",
    "t-a0-013": "An einem Montag ist der Himmel blau und die Sonne scheint. Es sind etwa 20 Grad. Ich ziehe ein T-Shirt und eine Jeans an. Ich brauche keine Jacke. Ich freue mich auf den Nachmittag im Garten.",
    "t-a0-014": "Ich gehe gern ins Restaurant. Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln. Dazu trinke ich ein Glas Wasser. Der Kellner ist freundlich. Das Essen schmeckt sehr gut. Ich bezahle und gehe nach Hause.",
}

BITRATES_KBPS = {
    3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
    2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
    0: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
}
SAMPLE_RATES = [44100, 48000, 32000]


def mp3_frame_count(data: bytes) -> int:
    """تحقّق من إطار ID3 ورؤوس MP3 المتصلة، لا من الامتداد وحده."""
    if len(data) < 14 or data[:3] != b"ID3":
        raise ValueError("ID3v2 header missing")
    tag_size = 0
    for byte in data[6:10]:
        if byte & 0x80:
            raise ValueError("invalid ID3 sync-safe size")
        tag_size = (tag_size << 7) | byte
    offset = 10 + tag_size
    frames = 0
    while offset + 4 <= len(data):
        header = int.from_bytes(data[offset : offset + 4], "big")
        if header >> 21 != 0x7FF:
            break
        version = (header >> 19) & 0b11
        layer = (header >> 17) & 0b11
        bitrate_index = (header >> 12) & 0b1111
        sample_index = (header >> 10) & 0b11
        padding = (header >> 9) & 1
        if version == 1 or layer != 1 or bitrate_index in (0, 15) or sample_index == 3:
            break
        sample_rate = SAMPLE_RATES[sample_index] // (1 if version == 3 else 2 if version == 2 else 4)
        bitrate = BITRATES_KBPS[version][bitrate_index] * 1000
        frame_size = (144 if version == 3 else 72) * bitrate // sample_rate + padding
        if frame_size < 4 or offset + frame_size > len(data):
            break
        offset += frame_size
        frames += 1
    if frames == 0 or offset != len(data):
        raise ValueError(f"invalid/truncated MP3 stream: {frames} frames, {len(data) - offset} trailing bytes")
    return frames


def main() -> None:
    texts = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    text_by_id = {item["id"]: item for item in texts}
    changed_texts = False
    for text_id, (before, after) in TEXT_EDITS.items():
        item = text_by_id.get(text_id)
        if item is None or item.get("level") != "A0":
            raise ValueError(f"missing A0 source text: {text_id}")
        current = item.get("de", "")
        if current == before:
            item["de"] = after
            changed_texts = True
        elif current != after:
            raise ValueError(f"unexpected German source for {text_id}")
    if changed_texts:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    existing = {entry["id"]: entry for entry in entries}
    added = 0
    for text_id, expected_text in AUDIO_TEXTS.items():
        source = text_by_id.get(text_id)
        if source is None or source.get("level") != "A0" or source.get("neu"):
            raise ValueError(f"unknown, wrong-level, or neu source: {text_id}")
        if source.get("de") != expected_text:
            raise ValueError(f"MP3 source text does not match manifest source: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        frames = mp3_frame_count(path.read_bytes())
        expected_entry = {
            "id": text_id,
            "file": f"/audio/hoeren/{text_id}.mp3",
            "voice": VOICE,
            "level": "A0",
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

    manifest["count"] = len(entries)
    manifest["updated"] = date.today().isoformat()
    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R161: {added} neue Manifest-Einträge · {manifest['count']} Hördateien insgesamt")


if __name__ == "__main__":
    main()
