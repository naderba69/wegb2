# -*- coding: utf-8 -*-
import re
PREF=("voraus","zusammen","zurück","durch","über","unter","wieder","weiter","ab","an","auf","aus","bei","ein","mit","nach","vor","zu","weg","um","fest","statt","teil","kennen","fern","hin","her","fort","los","frei")
AR=re.compile(r'[\u0600-\u06FF]')
def norm(s): return " "+re.sub(r'[^a-zäöüß0-9 ]'," ",s.lower().replace("é","e"))+" "
def part_ok(w,low):
    base=w[:-2] if w.endswith("en") and len(w)>4 else (w[:-1] if w.endswith("n") and len(w)>4 else w)
    if base[:max(4,len(base)-2)] in low: return True
    for p in PREF:
        if w.startswith(p) and len(w)>len(p)+2:
            rest=w[len(p):]; rb=rest[:-2] if rest.endswith("en") else rest
            if rb[:max(3,len(rb)-2)] in low and (f" {p} " in low or (p+"ge"+rb[:3]) in low or (p+rb[:3]) in low): return True
    return False
def ok_word(word,de):
    low=norm(de); w=re.sub(r'^(der|die|das|sich)\s+','',word.lower().replace('é','e')).strip(); w=re.sub(r'\s+(auf|über|um|von|an|für)$','',w); w=re.sub(r'\b(jdn|jdm|etwas|seine|sich)\b','',w)
    return all(part_ok(p,low) for p in re.split(r"[\s-]+",w) if len(p)>2)
