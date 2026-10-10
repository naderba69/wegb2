#!/usr/bin/env python3
"""R140b: ensure legacy mm01–mm06 are teil=2 (Bild), mm07–mm12 are teil=3 (Diskussion)."""
import json
m = json.load(open('content/muendlich.json',encoding='utf-8'))
for k in m['karten']:
    if k['id'].startswith('mm') and k['id'][2:].isdigit():
        n = int(k['id'][2:])
        if 1 <= n <= 6:
            k['teil'] = 2
        elif 7 <= n <= 12:
            k['teil'] = 3
# ensure new monolog cards have auftrag_de
for k in m['karten']:
    k.setdefault('auftrag_de', k.get('titel_de',''))
    k.setdefault('auftrag_ar', k.get('titel_ar',''))
    k.setdefault('stuetzen', [])
    k.setdefault('kriterien', [])
    k.setdefault('zeit_s', 180)
for k in m.get('kontakt',[]):
    k.setdefault('stuetzen', [])
    k.setdefault('kriterien', [])
    k.setdefault('zeit_s', 180)
json.dump(m, open('content/muendlich.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/muendlich.json','a',encoding='utf-8').write('\n')
print('re-tagged legacy cards teil 2/3')
