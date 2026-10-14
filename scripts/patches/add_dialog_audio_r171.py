#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""يسجّل حوارَي A0 الأوّلين بصوتين ويحرس مانيفستو الحوار (R171)."""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "content" / "dialog-audio.json"
DIALOGUES = ROOT / "content" / "dialogues.json"
BASE_MANIFEST_SHA256 = "388561e80ffe47c47eb013daa5fb455df9359c272f8a4c984b407787801b2306"
VOICE = "voice-04+voice-05"
TARGETS = {
    "d-a0-01": "0993535f0337b79310bbf30b1b5780ed507d6ca366b5fb9108340667ba06d4cf",
    "d-a0-02": "e58f6a4e6e41aa50028c586b9da542610d84b780ec05ec3f3957a78b516993ea",
}

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_a0_hoeren_audio_02 import mp3_frame_count  # noqa: E402


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def manifest_bytes(value: dict) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def source_sha256(dialogue: dict) -> str:
    source = "\n".join(f"{line['who']}\t{line['de']}" for line in dialogue["lines"])
    return sha256(source.encode("utf-8"))


def expected_entry(dialogue: dict) -> dict:
    dialogue_id = dialogue["id"]
    audio_path = ROOT / "public" / "audio" / "dialog" / f"{dialogue_id}.mp3"
    data = audio_path.read_bytes()
    assert data[:3] == b"ID3", f"ID3v2 header missing: {audio_path}"
    assert len(data) > 40_000, (audio_path, len(data))
    frames = mp3_frame_count(data)
    assert frames > 0, f"no MPEG Layer III frames: {audio_path}"
    return {
        "id": dialogue_id,
        "file": f"/audio/dialog/{dialogue_id}.mp3",
        "bytes": len(data),
        "voice": VOICE,
        "level": dialogue["level"],
        "stimmen": 2,
    }


def main() -> None:
    dialogues = {item["id"]: item for item in json.loads(DIALOGUES.read_text(encoding="utf-8"))}
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    entries = manifest["einsaetze"]
    ids = [entry["id"] for entry in entries]
    assert len(ids) == len(set(ids)) == manifest["count"] == len(entries), "manifest count/IDs inconsistent"
    assert set(TARGETS).issubset(dialogues), "target dialogue missing"

    for dialogue_id, expected_source_sha in TARGETS.items():
        dialogue = dialogues[dialogue_id]
        assert dialogue["level"] == "A0", (dialogue_id, dialogue["level"])
        assert source_sha256(dialogue) == expected_source_sha, f"guarded source changed: {dialogue_id}"

    by_id = {entry["id"]: entry for entry in entries}
    present = set(by_id) & set(TARGETS)
    if not present:
        assert sha256(MANIFEST.read_bytes()) == BASE_MANIFEST_SHA256, "unexpected dialog manifest baseline"
        for dialogue_id in TARGETS:
            by_id[dialogue_id] = expected_entry(dialogues[dialogue_id])
        updated = {"count": len(by_id), "einsaetze": sorted(by_id.values(), key=lambda entry: entry["id"])}
        MANIFEST.write_bytes(manifest_bytes(updated))
        manifest = updated
        print(f"R171 dialog manifest: {len(present)} existing, {len(TARGETS)} added")
    else:
        assert present == set(TARGETS), f"partial R171 manifest state: {sorted(present)}"
        for dialogue_id in TARGETS:
            assert by_id[dialogue_id] == expected_entry(dialogues[dialogue_id]), f"stale entry: {dialogue_id}"
        base_entries = [entry for entry in entries if entry["id"] not in TARGETS]
        reconstructed_base = {"count": len(base_entries), "einsaetze": base_entries}
        assert sha256(manifest_bytes(reconstructed_base)) == BASE_MANIFEST_SHA256, "non-R171 manifest content changed"
        canonical_manifest = {"count": len(entries), "einsaetze": entries}
        canonical_bytes = manifest_bytes(canonical_manifest)
        if MANIFEST.read_bytes() != canonical_bytes:
            MANIFEST.write_bytes(canonical_bytes)
            print("R171 dialog manifest: 0 added, 0 refreshed (canonical JSON whitespace applied)")
        else:
            print("R171 dialog manifest: 0 added, 0 refreshed (stable reapply)")

    final = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert final["count"] == len(final["einsaetze"]) == 82
    assert set(TARGETS).issubset({entry["id"] for entry in final["einsaetze"]})
    for dialogue_id in TARGETS:
        audio = ROOT / "public" / "audio" / "dialog" / f"{dialogue_id}.mp3"
        print(f"{dialogue_id}: {audio.stat().st_size} bytes, {mp3_frame_count(audio.read_bytes())} MPEG frames, source={TARGETS[dialogue_id]}")


if __name__ == "__main__":
    main()
