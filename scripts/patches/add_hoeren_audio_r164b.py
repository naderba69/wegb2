# -*- coding: utf-8 -*-
"""متابعة R164b: إكمال آخر نصي A2 في HörLabor.

تصقل الرقعة ترجمة fitter مع حراسة القيمة السابقة، ثم تتحقق من الملفين
وإطارات MPEG وتلحقهما بمانيفستو الاستماع فقط. آمنة لإعادة التشغيل.
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
        "t-a2-032",
        ("ar",),
        "غيّر لوكاس روتينه اليومي كثيراً خلال الأشهر الماضية. كان يستيقظ متأخراً، ويشرب ثلاثة أكواب من القهوة على الفطور، ويتناول غالباً الوجبات السريعة على الغداء. وكان يجلس ساعات أمام التلفاز في المساء. أما الآن فيستيقظ في السابعة، ويمارس اليوغا عشرين دقيقة، ويفطر موسلي مع الفاكهة. يطبخ الخضار مع الأرز على الغداء بنفسه. يركض ثلاث مرات في الأسبوع وينام قبل منتصف الليل. ومنذ ذلك الحين يشعر بنشاط أكبر ويكون أكثر تركيزاً في العمل. يقول إن أصعب شيء كان الامتناع عن أكل الشوكولاتة مساءً. في البداية كان من الصعب عليه أن ينام أبكر. لذلك يضع هاتفه في غرفة أخرى مساءً ويقرأ كتاباً قبل النوم. يخطط لوجبات الأسبوع ويشتري الخضار الطازجة يوم السبت. لاحظ زملاؤه هذا التغيير. ويتمشون معاً أحياناً في استراحة الغداء. يقول لوكاس إن الخطوات الصغيرة تناسب حياته اليومية أكثر من خطة صارمة. ويريد المحافظة على روتينه الجديد في الشتاء أيضاً.",
        "غيّر لوكاس روتينه اليومي كثيراً خلال الأشهر الماضية. كان يستيقظ متأخراً، ويشرب ثلاثة أكواب من القهوة على الفطور، ويتناول غالباً الوجبات السريعة على الغداء. وكان يجلس ساعات أمام التلفاز في المساء. أما الآن فيستيقظ في السابعة، ويمارس اليوغا عشرين دقيقة، ويفطر موسلي مع الفاكهة. يطبخ الخضار مع الأرز على الغداء بنفسه. يركض ثلاث مرات في الأسبوع وينام قبل منتصف الليل. ومنذ ذلك الحين يشعر بأنه أصبح أكثر لياقة بكثير، كما أصبح أكثر تركيزاً في العمل. يقول إن أصعب شيء كان الامتناع عن أكل الشوكولاتة مساءً. في البداية كان من الصعب عليه أن ينام أبكر. لذلك يضع هاتفه في غرفة أخرى مساءً ويقرأ كتاباً قبل النوم. يخطط لوجبات الأسبوع ويشتري الخضار الطازجة يوم السبت. لاحظ زملاؤه هذا التغيير. ويتمشون معاً أحياناً في استراحة الغداء. يقول لوكاس إن الخطوات الصغيرة تناسب حياته اليومية أكثر من خطة صارمة. ويريد المحافظة على روتينه الجديد في الشتاء أيضاً.",
    ),
]

AUDIO_TEXTS = {
    "t-a2-031": "Letzten Monat ist Sara von München nach Leipzig gezogen. Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch, deshalb suchte sie eine Wohnung im Osten. In Leipzig fand sie eine schöne Altbauwohnung mit drei Zimmern und Balkon für 650 Euro warm. Am Anfang vermisste sie ihre Freunde in München, aber sie lernte schnell neue Kollegen kennen. Jetzt gefällt ihr Leipzig gut: Die Stadt ist grün, die Menschen sind freundlich und die Mieten sind bezahlbar. Ihre neue Wohnung liegt in einem ruhigen Viertel. Vom Balkon sieht sie einen kleinen Park. Am ersten Tag hat sie die Kartons ausgepackt und die Küche eingerichtet. Eine Nachbarin hat ihr geholfen, die Möbel ins Haus zu tragen. Bei der Arbeit hat Sara neue Aufgaben bekommen. Sie vermisst ihre Familie noch, telefoniert aber am Wochenende oft mit ihrer Schwester. Am Samstag erkundet sie die Stadt mit dem Fahrrad und probiert neue Cafés aus.",
    "t-a2-032": "Lukas hat seinen Tagesablauf in den letzten Monaten stark verändert. Früher stand er spät auf, trank drei Tassen Kaffee zum Frühstück und aß mittags oft Fast Food. Abends saß er stundenlang vor dem Fernseher. Jetzt steht er um sieben Uhr auf, macht zwanzig Minuten Yoga und frühstückt Müsli mit Obst. Mittags kocht er selbst Gemüse mit Reis. Er geht dreimal pro Woche laufen und schläft vor Mitternacht. Seitdem fühlt er sich viel fitter und ist bei der Arbeit konzentrierter. Er sagt, die größte Schwierigkeit war, abends keine Schokolade zu essen. Am Anfang fiel es ihm schwer, früher ins Bett zu gehen. Deshalb legt er sein Handy abends in einen anderen Raum und liest vor dem Schlafen ein Buch. Er plant seine Mahlzeiten für die Woche und kauft am Samstag frisches Gemüse. Seine Kollegen haben die Veränderung bemerkt. In der Mittagspause gehen sie manchmal gemeinsam spazieren. Lukas sagt, dass kleine Schritte besser zu seinem Alltag passen als ein strenger Plan. Er möchte die neue Routine auch im Winter beibehalten.",
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

    changed_texts = False
    for text_id, path, before, after in FIELD_EDITS:
        item = text_by_id.get(text_id)
        if item is None or item.get("level") != "A2":
            raise ValueError(f"missing A2 source text: {text_id}")
        current = get_field(item, path)
        if current == before:
            set_field(item, path, after)
            changed_texts = True
        elif current != after:
            raise ValueError(f"unexpected source value for {text_id} {path}")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    existing = {entry["id"]: entry for entry in entries}
    if len(existing) != len(entries) or manifest.get("count") != len(entries) or len(entries) < 120:
        raise ValueError(f"unexpected HörLabor manifest state: count={manifest.get('count')} entries={len(entries)}")

    dialog_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "dialog-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    diktat_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "diktat-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    added = 0
    for text_id, expected_text in AUDIO_TEXTS.items():
        source = text_by_id.get(text_id)
        if source is None or source.get("level") != "A2" or source.get("neu"):
            raise ValueError(f"unknown, wrong-level, or neu source: {text_id}")
        if source.get("de") != expected_text:
            raise ValueError(f"audio source text mismatch: {text_id}")
        if source.get("wordCountDe") != len(source["de"].split()):
            raise ValueError(f"wordCountDe mismatch: {text_id}")
        if len(source.get("questions", [])) != 2 or any(q.get("type") != "mc" or q.get("answer") not in q.get("options", []) for q in source["questions"]):
            raise ValueError(f"question/key mismatch: {text_id}")
        if text_id in dialog_ids or text_id in diktat_ids:
            raise ValueError(f"cross-manifest audio assignment: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        frames = mp3_frame_count(path.read_bytes())
        expected_entry = {
            "id": text_id,
            "file": f"/audio/hoeren/{text_id}.mp3",
            "voice": VOICE,
            "level": "A2",
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
    if not expected_new.issubset(manifest_ids) or len(entries) < 122:
        raise ValueError(f"R164b sources absent from HörLabor manifest: {expected_new - manifest_ids}")

    if changed_texts:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if added:
        manifest["count"] = len(entries)
        manifest["updated"] = date.today().isoformat()
        MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R164b: {added} new manifest entries · {manifest['count']} HörLabor files total")


if __name__ == "__main__":
    main()
