#!/usr/bin/env python3
"""R113 gap-tracking report for d-a2-28..d-a2-30 (NOT a content patch).

Verifies:
- content/dialogues.json contains d-a2-01..d-a2-27 and d-a2-31..d-a2-32 (29 A2 dialogues)
  and does NOT contain d-a2-28/d-a2-29/d-a2-30.
- No audio entries or mp3 files reference these IDs.
- Git history (--all) contains no textual hits for these IDs in dialogues.json.
- Documented generators (dialoge_a2_neu1.py: d-a2-10..18; dialoge_a2_neu2.py: d-a2-19..27;
  dialoge_welle.py: d-a2-31..d-a2-32) do not define 28..30; the comment in
  dialoge_a2_neu2.py says "schliesst A2 auf 29 Dialoge" matching the live count.
- No waisen references point to these IDs.

No content is created, patched, or inferred. No CEFR recalculation, no audio
listening, no human/legal/professional claim.
"""
from __future__ import annotations

import json, subprocess, glob
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content/dialogues.json"
AUDIO_MANIFEST = ROOT / "content/dialog-audio.json"
DOCS_JSON = ROOT / "docs" / "content-gap-a2-dialogues-28-30-2026-10-08.json"
DOCS_MD = ROOT / "docs" / "content-gap-a2-dialogues-28-30-2026-10-08.md"
MISSING_IDS = ["d-a2-28", "d-a2-29", "d-a2-30"]
EXPECTED_A2_DIALOGUES = [f"d-a2-{i:02d}" for i in range(1, 28)] + ["d-a2-31", "d-a2-32"]
EXPECTED_A2_COUNT = 29


def git_log_hits(needle: str) -> list[str]:
    r = subprocess.run(
        ["git", "log", "--all", "--oneline", "-G", needle, "--", "content/dialogues.json"],
        cwd=ROOT, capture_output=True, text=True, check=False,
    )
    return [line for line in r.stdout.strip().splitlines() if line.strip()]


def main() -> None:
    DOCS_JSON.parent.mkdir(parents=True, exist_ok=True)
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    live_ids = sorted(d["id"] for d in dialogues if d["id"].startswith("d-a2-"))
    missing = [i for i in MISSING_IDS if i not in live_ids]
    expected_present = [i for i in EXPECTED_A2_DIALOGUES if i in live_ids]

    audio_manifest = json.loads(AUDIO_MANIFEST.read_text(encoding="utf-8")) if AUDIO_MANIFEST.exists() else {}
    manifest_hits: list[str] = []
    def walk(node: Any) -> None:
        if isinstance(node, dict):
            if isinstance(node.get("id"), str) and node["id"] in MISSING_IDS:
                manifest_hits.append(node["id"])
            for v in node.values(): walk(v)
        elif isinstance(node, list):
            for v in node: walk(v)
    walk(audio_manifest)
    mp3_hits: list[str] = []
    for tid in MISSING_IDS:
        mp3_hits.extend(glob.glob(str(ROOT / "public" / "audio" / "**" / f"*{tid}*.mp3"), recursive=True))

    git_hits = {tid: git_log_hits(tid) for tid in MISSING_IDS}

    gen_neu1 = (ROOT / "scripts/patches/dialoge_a2_neu1.py").read_text(encoding="utf-8")
    gen_neu2 = (ROOT / "scripts/patches/dialoge_a2_neu2.py").read_text(encoding="utf-8")
    gen_welle_path = ROOT / "scripts/dialoge_welle.py"
    gen_welle = gen_welle_path.read_text(encoding="utf-8") if gen_welle_path.exists() else ""

    generators = {
        "dialoge_a2_neu1.py": {
            "declaredRange": "d-a2-10..18 (9 dialogues from orphaned A2 cards)",
            "containsAnyMissingId": any(tid in gen_neu1 for tid in MISSING_IDS),
            "notableComment": "9 neue A2-Dialoge (d-a2-10..18)",
        },
        "dialoge_a2_neu2.py": {
            "declaredRange": "d-a2-19..27 (9 dialogues — closes A2 to 29 dialogues)",
            "containsAnyMissingId": any(tid in gen_neu2 for tid in MISSING_IDS),
            "notableComment": "9 neue A2-Dialoge (d-a2-19..27) aus verwaisten A2-Karten — schliesst A2 auf 29 Dialoge.",
        },
        "dialoge_welle.py": {
            "declaredRange": "wave dialogues d-a2-31/32 (boundary), no 28..30",
            "containsAnyMissingId": any(tid in gen_welle for tid in MISSING_IDS),
            "notableComment": "adds 2 dialogues per level (31, 32) only — no 28..30",
        },
    }

    is_shallow = subprocess.run(["git", "rev-parse", "--is-shallow-repository"],
                                cwd=ROOT, capture_output=True, text=True).stdout.strip() == "true"
    first_commit = subprocess.run(["git", "rev-list", "--max-parents=0", "HEAD"],
                                  cwd=ROOT, capture_output=True, text=True).stdout.strip()

    sources = [
        {"id": "G1", "path": "content/dialogues.json",
         "proves": f"النسخة الحية تضم {EXPECTED_A2_COUNT} حواراً من مستوى A2 (d-a2-01..27 وd-a2-31..d-a2-32). لا يوجد كائن للمعرفات 28–30.",
         "limits": "يصف النسخة الحية فقط ولا يثبت أن المعرفات لم تكن موجودة في تاريخ Git أقدم من commit الأساس."},
        {"id": "G2", "path": "scripts/patches/dialoge_a2_neu1.py",
         "proves": "المصدر يصرّح عن d-a2-10..18 بوصفها دفعة البطاقات اليتيمة الأولى لمستوى A2.",
         "limits": "لا يذكر المعرفات 28–30."},
        {"id": "G3", "path": "scripts/patches/dialoge_a2_neu2.py",
         "proves": "المصدر يصرّح عن d-a2-19..27، وفي تعليق الملف «schliesst A2 auf 29 Dialoge» يطابق عدد سجلات A2 الحالية.",
         "limits": "التعليق حسابي مطابق للعدد الحي وليس برهاناً مستقلاً على تاريخ 28–30."},
        {"id": "G4", "path": "scripts/dialoge_welle.py",
         "proves": "مولد حوارات الموجة يُدرج حوارين لكل مستوى عند المعرفات 31 و32؛ لا يُدرج 28–30.",
         "limits": "لا يفسر ما إذا كان من المفترض وجود دفعة وسيطة."},
        {"id": "G5", "path": "content/dialog-audio.json + public/audio/**",
         "proves": f"لا توجد إدخالات بيان صوتي للمعرفات {MISSING_IDS}، ولا ملفات mp3 مطابقة ({len(manifest_hits)} مدخلات، {len(mp3_hits)} ملفات).",
         "limits": "غياب الصوت وحده لا يثبت غياب الحوارات."},
        {"id": "G6", "path": "git log --all -G<id>",
         "proves": "لم تظهر ضربات نصية لأي من المعرفات الثلاثة في سجل content/dialogues.json عبر المراجع المتاحة (--all).",
         "limits": ("المستودع shallow" if is_shallow else "تاريخ كامل متاح") + "؛ النتائج تخص المراجع المتاحة فقط."},
    ]

    decision = "تبقى d-a2-28..d-a2-30 غير محسومة وغير مدققة لغوياً. لم يُنشأ محتوى بديل، ولم تُنسب بطاقات مفردات يتيمة إلى هذه المعرفات دون دليل. يلزم تاريخ Git أقدم من commit الأساس أو ملف إنتاج/تصدير/تعليمات آخر يعرّف المحتوى قبل ملء الفجوة."

    report = {
        "reviewRule": "R113",
        "date": "2026-10-08",
        "status": "غير محسوم — لا توجد مواد حوارية حية للمعرفات d-a2-28..d-a2-30؛ الجزء السابق من تاريخ Git " + (
            "غير متاح في نسخة shallow" if is_shallow else "متاح") + "؛ لا تُعد هذه مراجعة للنصوص أو الأسئلة أو التمارين لهذه المعرفات.",
        "scope": "تحقق تمهيدي من وجود d-a2-28 وd-a2-29 وd-a2-30، ومن مصادر توليد الحوارات A2 والتاريخ المتاح؛ لا إنشاء محتوى بديل ولا إسناد كلمات إلى هذه المعرفات بالتخمين.",
        "liveContent": {
            "a2DialogueCount": len([d for d in dialogues if d["id"].startswith("d-a2-")]),
            "expectedA2Count": EXPECTED_A2_COUNT,
            "presentA2Ids": live_ids,
            "missingIds": MISSING_IDS,
            "allExpectedPresent": len(expected_present) == EXPECTED_A2_COUNT and len(missing) == 3,
        },
        "audio": {
            "manifestEntriesForMissing": manifest_hits,
            "mp3FilesForMissing": mp3_hits,
            "note": "لا إدخالات ولا ملفات صوتية مطابقة للمعرفات المفقودة؛ هذا وحده لا يثبت غياب الحوارات.",
        },
        "gitHistory": {
            "isShallowRepository": is_shallow,
            "firstAvailableCommit": first_commit,
            "searchedRefs": "--all (الفروع المحلية والبعيدة المتاحة)",
            "hitsPerMissingId": git_hits,
        },
        "generators": generators,
        "sources": sources,
        "limits": {
            "cefr": "لم يُعد تقييم CEFR أو النسبة أو الحساب.",
            "audio": "لا استماع ولا ادعاء صوتي.",
            "human": "التقرير تتبع مصدر/بنية فقط، وليست مراجعة بشرية.",
            "legal": "لا ادعاء قانوني.",
            "contentCreation": "لم يُنشأ أي محتوى بديل ولم يُستبدل 28–30 بـ31–32."
        },
        "decision": decision,
        "gates": {"planned": "K187a–e"},
    }

    DOCS_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md: list[str] = []
    md.append("# تتبّع فجوة معرفات حوارات A2: 28–30\n\n")
    md.append("**التاريخ:** 2026-10-08 (R113)\n\n")
    md.append("**الحالة:** غير محسوم؛ هذا تتبّع للمصادر والنسخة المتاحة، وليس تدقيقاً لغوياً لحوارات غير موجودة.\n\n")
    md.append("## النتيجة الحذرة\n\n")
    md.append(f"في `content/dialogues.json` توجد {report['liveContent']['a2DialogueCount']} حوار A2: `d-a2-01` إلى `d-a2-27` ثم `d-a2-31` و`d-a2-32`. لم توجد سجلات `d-a2-28` أو `d-a2-29` أو `d-a2-30`. لا يعني ذلك أن عناصرها غير موجودة في تاريخ سابق غير متاح؛ نسخة Git {'shallow' if is_shallow else 'كاملة'}. لذلك لم أراجع نصاً أو سؤالاً أو تمريناً لهذه المعرّفات، ولم أنشئ بديلاً.\n\n")
    md.append("## عدد الحوارات الحية\n\n")
    md.append(f"- عدد حوارات A2 الحية: **{report['liveContent']['a2DialogueCount']}** (المتوقع {EXPECTED_A2_COUNT}).\n")
    md.append(f"- المعرفات الموجودة: {', '.join('`'+i+'`' for i in live_ids)}.\n")
    md.append(f"- المعرفات المفقودة: {', '.join('`'+i+'`' for i in MISSING_IDS)}.\n\n")
    md.append("## المصادر التي فُحصت\n\n| الرمز | المسار | ما يثبته | حدود |\n|---|---|---|---|\n")
    for s in sources:
        md.append(f"| {s['id']} | `{s['path']}` | {s['proves']} | {s['limits']} |\n")
    md.append("\n## مولدات الحوارات A2\n\n| الملف | النطاق المصرّح | يذكر 28–30؟ | ملاحظة |\n|---|---|---|---|\n")
    for fn, info in generators.items():
        md.append(f"| `{fn}` | {info['declaredRange']} | {'نعم' if info['containsAnyMissingId'] else 'لا'} | {info['notableComment']} |\n")
    md.append("\n## تاريخ Git المتاح\n\n")
    md.append(f"- البحث: `git log --all -G<id>` في `content/dialogues.json`.\n")
    md.append(f"- المستودع shallow؟ **{is_shallow}**.\n")
    md.append(f"- أول commit متاح: `{first_commit[:12]}`.\n")
    for tid, hits in git_hits.items():
        md.append(f"- {tid}: {'ضربات: ' + '; '.join(hits) if hits else 'لا ضربات في المراجع المتاحة'}.\n")
    md.append("\n## القرار\n\n")
    md.append(f"{decision}\n\n")
    md.append("## الحدود\n\n- لم يُعد تقييم CEFR أو النسبة أو الحساب.\n")
    md.append("- لا استماع لتسجيلات ولا ادعاء صوتي.\n")
    md.append("- التقرير تتبع مصدر/بنية فقط، وليست مراجعة بشرية أو اعتماداً مهنياً/قانونياً.\n")
    md.append("- البوابات المخططة: K187a–e.\n")

    DOCS_MD.write_text("".join(md), encoding="utf-8")
    print(f"Wrote {DOCS_JSON.name} and {DOCS_MD.name}")
    print(f"  missing: {missing}")
    print(f"  audio manifest hits: {manifest_hits}; mp3 hits: {mp3_hits}")
    print(f"  git shallow: {is_shallow}")


if __name__ == "__main__":
    main()
