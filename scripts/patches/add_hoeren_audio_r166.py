# -*- coding: utf-8 -*-
"""R166: review and add the final five B1 texts to HörLabor.

Run --prepare before TTS; after generating MP3s from the final German source,
run without arguments to verify hashes/frames and update only hoeren-audio.json.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import date
from pathlib import Path

from add_a0_hoeren_audio_02 import mp3_frame_count

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
VOICE = "voice-01 (de-DE, Arena TTS)"
TARGET_IDS = [f"t-b1-{number}" for number in range(31, 36)]

# Guard each editorial refinement against its reviewed before/after value.
FIELD_EDITS = [
    (
        "t-b1-31", ("questions", 1, "options", 1),
        "Die vielen Grünflächen und günstige Mieten",
        "Die vielen Grünflächen und die günstigen Mieten",
    ),
    (
        "t-b1-31", ("questions", 1, "answer"),
        "Die vielen Grünflächen und günstige Mieten",
        "Die vielen Grünflächen und die günstigen Mieten",
    ),
    (
        "t-b1-35", ("questions", 1, "promptAr"),
        "ما الإجراء الآخر الذي يقترحه الكاتب؟",
        "ما الإجراء الآخر الذي تقترحه كاتبة الرسالة؟",
    ),
]

# Guarded, single-occurrence Arabic refinements within the full translation fields.
TEXT_REPLACEMENTS = [
    (
        "t-b1-32", ("ar",),
        "لأن عائلتي تطهو اللحم كثيراً",
        "لأن عائلتي، بحكم عاداتها، تطهو اللحم كثيراً",
    ),
    (
        "t-b1-34", ("ar",),
        "وعزّز ذلك لديّ الإحساس بأهمية الانتباه في الطريق",
        "وذكّرني هذا الحادث مجدداً بأهمية الانتباه في حركة المرور",
    ),
]

# Exact German fields spoken by Arena TTS after editorial review.
SOURCE_SHA256: dict[str, str] = {
    "t-b1-31": "12a75b414fb8fd0a015e04bd822a6e25b3eb7052e967d002897fa4b998830541",
    "t-b1-32": "13f4e7fdbf5688e68b39b31921cde323aa7a458520ca09835c931832f40d028a",
    "t-b1-33": "79e28ded84a8fbda0c73ea98d291fa842be02bbeef8d013355baf22e8985e3f3",
    "t-b1-34": "3170bb0fa9bb0df776e963e7f0f135ff56162c04d7fbf77c5ea1b7e0534e5929",
    "t-b1-35": "5a743e99e85b624f3a7b87893c355ab9c2bbf833a2f320202cf1b13559d6956e",
}


def get_path(root: object, path: tuple) -> object:
    value = root
    for key in path:
        value = value[key]  # type: ignore[index]
    return value


def set_path(root: dict, path: tuple, value: object) -> None:
    parent = root
    for key in path[:-1]:
        parent = parent[key]  # type: ignore[index]
    parent[path[-1]] = value


def apply_edits(by_id: dict[str, dict]) -> int:
    changed = 0
    for text_id, path, before, after in FIELD_EDITS:
        item = by_id.get(text_id)
        if item is None or item.get("level") != "B1":
            raise ValueError(f"missing or wrong-level source text: {text_id}")
        current = get_path(item, path)
        if current == before:
            set_path(item, path, after)
            changed += 1
        elif current != after:
            raise ValueError(f"unexpected source value for {text_id} {path}: {current!r}")
    for text_id, path, before, after in TEXT_REPLACEMENTS:
        item = by_id.get(text_id)
        if item is None or item.get("level") != "B1":
            raise ValueError(f"missing or wrong-level text for substring edit: {text_id}")
        current = get_path(item, path)
        if not isinstance(current, str):
            raise ValueError(f"non-text replacement target: {text_id} {path}")
        before_count, after_count = current.count(before), current.count(after)
        if before_count == 1 and after_count == 0:
            set_path(item, path, current.replace(before, after, 1))
            changed += 1
        elif before_count == 0 and after_count == 1:
            continue
        else:
            raise ValueError(f"unexpected substring state for {text_id} {path}: before={before_count}, after={after_count}")
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare", action="store_true", help="apply reviewed text/question edits before TTS")
    args = parser.parse_args()

    texts = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in texts}
    if len(by_id) != len(texts):
        raise ValueError("duplicate text ids")
    changed = apply_edits(by_id)
    batch = [by_id[text_id] for text_id in TARGET_IDS]
    if any(item.get("level") != "B1" for item in batch):
        raise ValueError("R166 targets must all be B1")

    for item in batch:
        if not item.get("titleDe", "").startswith("Beispiel:") or not item.get("titleAr", "").startswith("مثال:"):
            raise ValueError(f"example framing missing: {item['id']}")
        if len(item.get("questions", [])) != 2:
            raise ValueError(f"expected two questions: {item['id']}")
        for question in item["questions"]:
            options = question.get("options", [])
            if (question.get("type") != "mc" or not question.get("promptDe", "").strip() or
                    not question.get("promptAr", "").strip() or not question.get("explanationAr", "").strip() or
                    len(options) < 2 or len(options) != len(set(options)) or question.get("answer") not in options):
                raise ValueError(f"invalid MC options/key: {item['id']}:{question.get('id')}")

    if changed:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    word_counts = {item["id"]: len(item["de"].split()) for item in batch}
    print("R166 reviewed German word counts:", json.dumps(word_counts, ensure_ascii=False))
    print("R166 guarded field edits:", len(FIELD_EDITS) + len(TEXT_REPLACEMENTS), "applied:", changed)
    print("R166 question count:", sum(len(item["questions"]) for item in batch))
    if args.prepare:
        print("R166 prepare complete; generate audio from the current de fields before finalizing the manifest.")
        return

    if set(SOURCE_SHA256) != set(TARGET_IDS):
        raise ValueError("populate SOURCE_SHA256 after reviewing/generating the exact German source strings")
    for item in batch:
        digest = hashlib.sha256(item["de"].encode("utf-8")).hexdigest()
        if SOURCE_SHA256.get(item["id"]) != digest:
            raise ValueError(f"R166 audio/source hash mismatch: {item['id']}")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    by_audio_id = {entry["id"]: entry for entry in entries}
    if len(by_audio_id) != len(entries) or manifest.get("count") != len(entries):
        raise ValueError("HörLabor count/ID mismatch")
    dialog_ids = {e["id"] for e in json.loads((ROOT / "content" / "dialog-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    diktat_ids = {e["id"] for e in json.loads((ROOT / "content" / "diktat-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    added = updated = 0
    for item in batch:
        text_id = item["id"]
        if text_id in dialog_ids or text_id in diktat_ids:
            raise ValueError(f"cross-manifest audio assignment: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        data = path.read_bytes()
        if data[:3] != b"ID3":
            raise ValueError(f"missing ID3v2 header: {text_id}")
        frames = mp3_frame_count(data)
        if frames < 1:
            raise ValueError(f"no MPEG Layer III frames: {text_id}")
        expected = {"id": text_id, "file": f"/audio/hoeren/{text_id}.mp3", "voice": VOICE, "level": "B1", "bytes": len(data)}
        old = by_audio_id.get(text_id)
        if old is None:
            entries.append(expected)
            by_audio_id[text_id] = expected
            added += 1
        elif any(old.get(key) != value for key, value in expected.items()):
            if old.get("id") != text_id or old.get("file") != expected["file"] or old.get("level") != "B1":
                raise ValueError(f"refusing to change unrelated manifest identity: {text_id}")
            old.update(expected)
            updated += 1
        print(f"✓ {text_id}: {len(item['de'].split())} words · {len(data)} bytes · {frames} MPEG Layer III frames")

    manifest_ids = {entry["id"] for entry in entries}
    disk_ids = {path.stem for path in AUDIO_DIR.glob("*.mp3")}
    if manifest_ids != disk_ids:
        raise ValueError(f"manifest/disk mismatch: disk-only={disk_ids - manifest_ids}, manifest-only={manifest_ids - disk_ids}")
    if not set(TARGET_IDS).issubset(manifest_ids):
        raise ValueError("R166 target IDs missing from HörLabor")
    if added or updated:
        manifest["count"] = len(entries)
        manifest["updated"] = date.today().isoformat()
        MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R166: {added} new manifest entries · {updated} refreshed entries · {manifest['count']} HörLabor files total")


if __name__ == "__main__":
    main()
