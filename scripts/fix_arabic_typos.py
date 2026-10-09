#!/usr/bin/env python3
"""Fix CONFIRMED Arabic typos in all JSON content files.
Only fixes: الان→الآن  (the only confirmed high-frequency typo).
Other patterns were false positives in the audit."""
import json, re, sys

FILES = [
    "content/grammar.json",
    "content/dialogues.json",
    "content/texts.json",
    "content/writing.json",
    "content/fehler.json",
    "content/cando.json",
    "content/eselsbruecken.json",
    "content/vocab.json",
    "content/sentences.json",
    "content/muendlich.json",
    "content/kollokationen.json",
    "content/ant-ausnahmen.json",
    "content/antonyme.json",
    "content/synonyme.json",
    "content/synonyme-kontext.json",
    "content/sprichwort-audio.json",
    "content/hoeren-audio.json",
    "content/diktat-audio.json",
    "content/dialog-audio.json",
    "content/beispiele-batches.json",
    "content/szenarien.json",
]

def fix_text(s):
    if not isinstance(s, str): return s, 0
    n = 0
    orig = s
    # Fix "الان" when it's standalone (ال + ان = الآن)
    # Don't match words like الانعكاسي (they contain الان but legitimately)
    new = re.sub(r'(?<![A-Za-z\u0600-\u06FF])الان(?![A-Za-z\u0600-\u06FF])', 'الآن', s)
    new = re.sub(r'الان(?=[،.؟!:\s])', 'الآن', new)
    new = re.sub(r'(?<=\s)الان(?=\s)', 'الآن', new)
    # Start of string
    if new.startswith('الان '): new = 'الآن' + new[4:]
    if new.endswith(' الان'): new = new[:-4] + ' الآن'
    if new != orig:
        n = 1
    return new, n

def walk(o):
    fixed = 0
    if isinstance(o, dict):
        no = {}
        for k,v in o.items():
            nv, nf = walk(v)
            no[k] = nv
            fixed += nf
        return no, fixed
    elif isinstance(o, list):
        no = []
        for v in o:
            nv, nf = walk(v)
            no.append(nv)
            fixed += nf
        return no, fixed
    elif isinstance(o, str):
        nv, nf = fix_text(o)
        return nv, nf
    else:
        return o, 0

total = 0
for fp in FILES:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        continue
    except Exception as e:
        print(f"SKIP {fp}: {e}")
        continue
    data, n = walk(data)
    if n > 0:
        with open(fp, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"  {fp}: fixed {n} occurrences of الان→الآن")
        total += n

print(f"\nTotal fixes: {total}")
