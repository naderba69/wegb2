#!/usr/bin/env python3
"""Repository-wide structural audit.

Scans every Git-tracked file, including historical scripts and binary assets.
This is deliberately independent from the application/content gates: it catches
broken source syntax, malformed data, stale conflict markers, invalid asset
headers, and broken local Markdown links anywhere in the repository.
"""

from __future__ import annotations

import ast
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
TEXT_SUFFIXES = {
    ".css", ".gitignore", ".html", ".js", ".json", ".md", ".mjs",
    ".py", ".ts", ".tsx", ".txt", ".yaml", ".yml",
}
NODE_SUFFIXES = {".js", ".mjs"}
MEDIA_SUFFIXES = {".ico", ".mp3", ".png", ".webp"}
LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
CONFLICT_RE = re.compile(r"^(?:<{7}(?: .*)?|={7}|>{7}(?: .*)?)$", re.MULTILINE)


def tracked_files() -> list[Path]:
    # Include not-yet-staged deliverables as well as tracked files; ignored build
    # products stay outside the audit.
    raw = subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], cwd=ROOT)
    return [Path(part.decode("utf-8")) for part in raw.split(b"\0") if part]


def media_header_ok(path: Path, head: bytes) -> bool:
    suffix = path.suffix.lower()
    if suffix == ".png":
        return head.startswith(b"\x89PNG\r\n\x1a\n")
    if suffix == ".webp":
        return len(head) >= 12 and head[:4] == b"RIFF" and head[8:12] == b"WEBP"
    if suffix == ".ico":
        return head.startswith(b"\x00\x00\x01\x00")
    if suffix == ".mp3":
        return head.startswith(b"ID3") or (len(head) >= 2 and head[0] == 0xFF and head[1] & 0xE0 == 0xE0)
    return True


def markdown_target_exists(source: Path, raw_target: str, tracked: set[str]) -> bool:
    target = raw_target.strip()
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1]
    # Strip an optional Markdown title: path "title" or path 'title'.
    target = re.split(r"\s+[\"']", target, maxsplit=1)[0]
    if not target or target.startswith(("#", "http://", "https://", "mailto:", "data:", "javascript:")):
        return True
    target = unquote(target.split("#", 1)[0].split("?", 1)[0])
    if not target:
        return True
    if target.startswith("/"):
        candidates = [target.lstrip("/"), "public/" + target.lstrip("/")]
    else:
        candidates = [os.path.normpath(source.parent / target)]
    return any(str(candidate) in tracked or (ROOT / candidate).is_dir() for candidate in candidates)


def main() -> int:
    files = tracked_files()
    tracked = {str(path) for path in files}
    issues: list[str] = []
    counts = {
        "files": len(files), "bytes": 0, "lines": 0, "text": 0, "json": 0,
        "python": 0, "node": 0, "yaml": 0, "markdownLinks": 0, "media": 0,
    }

    folded: dict[str, str] = {}
    yaml_files: list[str] = []

    for rel in files:
        path = ROOT / rel
        if not path.exists():
            issues.append(f"missing tracked file: {rel}")
            continue
        if path.is_dir():
            issues.append(f"tracked path is a directory: {rel}")
            continue

        folded_name = str(rel).casefold()
        if folded_name in folded and folded[folded_name] != str(rel):
            issues.append(f"case-insensitive path collision: {folded[folded_name]} <> {rel}")
        folded[folded_name] = str(rel)

        data = path.read_bytes()
        counts["bytes"] += len(data)
        if not data:
            issues.append(f"zero-byte tracked file: {rel}")

        suffix = rel.suffix.lower()
        is_text = suffix in TEXT_SUFFIXES or rel.name == ".gitignore"
        if is_text:
            counts["text"] += 1
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError as error:
                issues.append(f"non-UTF-8 text: {rel}: {error}")
                continue
            counts["lines"] += len(text.splitlines())
            if data.startswith(b"\xef\xbb\xbf"):
                issues.append(f"UTF-8 BOM: {rel}")
            if b"\r\n" in data:
                issues.append(f"CRLF line endings: {rel}")
            if CONFLICT_RE.search(text):
                issues.append(f"merge-conflict marker: {rel}")
            for line_no, line in enumerate(text.splitlines(), 1):
                if any(ord(char) < 32 and char != "\t" for char in line):
                    issues.append(f"raw control character: {rel}:{line_no}")

            if suffix == ".json":
                counts["json"] += 1
                try:
                    json.loads(text)
                except (json.JSONDecodeError, UnicodeDecodeError) as error:
                    issues.append(f"invalid JSON: {rel}: {error}")
            elif suffix == ".py":
                counts["python"] += 1
                try:
                    ast.parse(text, filename=str(rel))
                except SyntaxError as error:
                    issues.append(f"invalid Python: {rel}:{error.lineno}:{error.offset}: {error.msg}")
            elif suffix in NODE_SUFFIXES:
                counts["node"] += 1
                proc = subprocess.run(
                    ["node", "--check", str(rel)], cwd=ROOT,
                    stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
                )
                if proc.returncode:
                    detail = (proc.stderr or proc.stdout).strip().splitlines()[-1]
                    issues.append(f"invalid JavaScript: {rel}: {detail}")
            elif suffix in {".yaml", ".yml"}:
                counts["yaml"] += 1
                yaml_files.append(str(rel))

            if suffix == ".md":
                for line_no, line in enumerate(text.splitlines(), 1):
                    for match in LINK_RE.finditer(line):
                        target = match.group(1)
                        if target.strip().startswith(("#", "http://", "https://", "mailto:", "data:")):
                            continue
                        counts["markdownLinks"] += 1
                        if not markdown_target_exists(rel, target, tracked):
                            issues.append(f"broken local Markdown link: {rel}:{line_no}: {target}")

        if suffix in MEDIA_SUFFIXES:
            counts["media"] += 1
            if not media_header_ok(rel, data[:16]):
                issues.append(f"invalid {suffix} header: {rel}")

    if yaml_files:
        yaml_probe = """
const fs = require('fs');
const YAML = require('yaml');
for (const file of process.argv.slice(1)) YAML.parse(fs.readFileSync(file, 'utf8'));
"""
        proc = subprocess.run(
            ["node", "-e", yaml_probe, *yaml_files], cwd=ROOT,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )
        if proc.returncode:
            issues.append("invalid YAML: " + (proc.stderr or proc.stdout).strip().splitlines()[-1])

    print("=== REPOSITORY AUDIT ===")
    print(
        f"files={counts['files']} · text={counts['text']} · lines={counts['lines']} · "
        f"bytes={counts['bytes']} · JSON={counts['json']} · Python={counts['python']} · "
        f"JS/MJS={counts['node']} · YAML={counts['yaml']} · media={counts['media']} · "
        f"local-links={counts['markdownLinks']}"
    )
    if issues:
        print(f"\n{len(issues)} blocker(s):")
        for issue in issues:
            print(f"  ✗ {issue}")
        return 1
    print("✓ Every tracked file passed repository structure, syntax, encoding, asset-header, and local-link checks.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
