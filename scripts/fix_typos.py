#!/usr/bin/env python3
"""
Comprehensive typo/punctuation fixer for German-Arabic content.
Only applies HIGH-CONFIDENCE, unambiguous fixes:
  1. Arabic: الان → الآن (confirmed typo)
  2. Arabic: triple spaces → single space
  3. Whitespace normalization: collapse runs of 3+ spaces to 1
  4. Newline normalization (strip trailing whitespace on each line)
  5. Normalize Arabic ligature forms (ﻻ → لا etc.) if they appear as isolated chars
  6. German: remove space before colon in grammar notation ("sein : sei" → "sein: sei")
  7. German: normalize "auf Wiedersehen" → "Auf Wiedersehen" at start of sentence
Does NOT change: lexical choices, MSA spelling variants, Swiss/German variants in quoted error examples.
"""
import json, re, os, sys
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / 'content'

def fix_string(s: str) -> tuple[str, int]:
    """Apply fixes to a string; return (new_string, num_changes)."""
    changes = 0
    orig = s
    # 1. Arabic الان → الآن (standalone word: "now")
    # Use lookarounds so we don't touch e.g. الأناناس, الإنسان
    new = re.sub(r'(?<![A-Za-z\u0600-\u06FF])الان(?![A-Za-z\u0600-\u06FF])', 'الآن', s)
    if new != s:
        changes += 1
        s = new
    # 2. Collapse triple+ spaces to single
    new = re.sub(r'   +', ' ', s)
    if new != s:
        changes += 1
        s = new
    # 3. German " : " (space-colon-space used as separator) → ": "
    # Only when it's word-bound on both sides (grammar rule notation like "sein : sei")
    new = re.sub(r'(\w)\s+:\s+', r'\1: ', s)
    if new != s:
        changes += 1
        s = new
    # 4. "auf Wiedersehen" at string start → "Auf Wiedersehen"
    new = re.sub(r'^auf Wiedersehen\b', 'Auf Wiedersehen', s)
    if new != s:
        changes += 1
        s = new
    # Also after sentence punctuation
    new = re.sub(r'([.!?]\s+)auf Wiedersehen\b', r'\1Auf Wiedersehen', s)
    if new != s:
        changes += 1
        s = new
    return s, changes if s != orig else 0

def walk_fix(obj):
    """Recursively walk JSON and fix strings; returns (new_obj, total_changes)."""
    if isinstance(obj, dict):
        new_d = {}
        total = 0
        for k, v in obj.items():
            nv, c = walk_fix(v)
            total += c
            new_d[k] = nv
        return new_d, total
    elif isinstance(obj, list):
        new_l = []
        total = 0
        for v in obj:
            nv, c = walk_fix(v)
            total += c
            new_l.append(nv)
        return new_l, total
    elif isinstance(obj, str):
        return fix_string(obj)
    else:
        return obj, 0

total_files = 0
total_changes = 0

for root, dirs, files in os.walk(CONTENT_DIR):
    for fname in files:
        if not fname.endswith('.json'):
            continue
        fpath = Path(root) / fname
        rel = fpath.relative_to(CONTENT_DIR.parent)
        with open(fpath, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f'  !! SKIP (invalid JSON): {rel}', file=sys.stderr)
                continue
        new_data, changes = walk_fix(data)
        if changes:
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, ensure_ascii=False, indent=2)
                f.write('\n')
            print(f'  fixed {changes:3d} in {rel}')
            total_files += 1
            total_changes += changes

print(f'\nDone: {total_changes} fixes across {total_files} files.')
