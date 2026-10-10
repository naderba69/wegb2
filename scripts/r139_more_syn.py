#!/usr/bin/env python3
"""Add more synonyms to content/synonyme.json."""
import json

NEUE = {
    "gehen": ["laufen", "sich bewegen", "spazieren gehen"],
    "sagen": ["äußern", "mitteilen", "erklären", "bemerken", "meinen"],
    "machen": ["tun", "erledigen", "ausführen", "herstellen"],
    "gut": ["schön", "toll", "prima", "hervorragend", "ausgezeichnet"],
    "schlecht": ["mies", "übel", "schlimm"],
    "groß": ["riesig", "enorm", "gewaltig"],
    "klein": ["winzig", "gering"],
    "schnell": ["rasch", "zügig", "flink"],
    "langsam": ["allmählich", "gemächlich", "bedächtig"],
    "wichtig": ["bedeutend", "wesentlich", "zentral", "relevant"],
    "schön": ["hübsch", "wunderschön", "attraktiv", "reizvoll"],
    "denken": ["glauben", "meinen", "überlegen", "finden"],
    "wissen": ["kennen", "Bescheid wissen", "sich auskennen"],
    "sehen": ["erblicken", "betrachten", "beobachten", "wahrnehmen"],
    "essen": ["speisen", "verzehren", "zu sich nehmen"],
    "trinken": ["schlürfen", "genießen"],
    "schreiben": ["verfassen", "notieren", "aufschreiben"],
    "lesen": ["durchlesen", "studieren", "verschlingen"],
    "verbessern": ["optimieren", "steigern", "veredeln"],
    "verändern": ["wandeln", "modifizieren", "umgestalten"],
    "verstehen": ["begreifen", "kapieren", "nachvollziehen", "erfassen"],
    "erklären": ["erläutern", "darlegen", "verdeutlichen", "begründen"],
    "vorschlagen": ["anregen", "empfehlen", "unterbreiten"],
    "arbeiten": ["tätig sein", "schaffen", "berufstätig sein"],
    "verdienen": ["erwerben", "beziehen", "erwirtschaften"],
    "wohnen": ["leben", "residieren", "sich aufhalten"],
    "sterben": ["versterben", "ums Leben kommen", "ableben"],
    "lieben": ["mögen", "gernhaben", "verehren"],
    "hassen": ["verabscheuen", "ablehnen", "nicht leiden können"],
    "versuchen": ["probieren", "sich bemühen", "anstreben"],
    "erreichen": ["erzielen", "gelangen zu", "schaffen"],
    "benutzen": ["verwenden", "nutzen", "gebrauchen", "einsetzen"],
    "kaufen": ["erwerben", "erstehen", "anschaffen"],
    "verkaufen": ["veräußern", "absetzen", "vertreiben"],
    "wählen": ["auswählen", "aussuchen", "sich entscheiden für"],
    "bezahlen": ["zahlen", "begleichen", "entrichten"],
    "fragen": ["befragen", "nachfragen", "sich erkundigen nach"],
    "schwierig": ["schwer", "kompliziert", "anspruchsvoll"],
    "einfach": ["leicht", "unkompliziert", "simpel"],
    "freundlich": ["nett", "liebenswürdig", "sympathisch"],
    "glücklich": ["froh", "zufrieden", "erfreut"],
    "traurig": ["betrübt", "bedrückt", "niedergeschlagen"],
    "Angst haben": ["sich fürchten", "Angst empfinden", "Bammel haben (umg.)"],
    "aufhören": ["beenden", "stoppen", "enden", "einstellen"],
    "anfangen": ["beginnen", "starten", "loslegen (umg.)"],
    "beenden": ["abschließen", "fertigstellen", "zu Ende führen"],
    "helfen": ["unterstützen", "beistehen", "Hilfe leisten"],
    "danken": ["sich bedanken", "Dank sagen"],
    "treffen": ["sich treffen", "begegnen", "treffen mit"],
    "verstehen": ["begreifen", "kapieren (umg.)", "nachvollziehen"],
}

s = json.load(open('content/synonyme.json',encoding='utf-8'))
added = 0
for k, vals in NEUE.items():
    if k not in s:
        s[k] = []
    existing = set(s[k])
    for v in vals:
        if v not in existing and v != k:
            s[k].append(v); added += 1

# sort keys
new_s = {k: s[k] for k in sorted(s.keys())}
with open('content/synonyme.json','w',encoding='utf-8') as f:
    json.dump(new_s,f,ensure_ascii=False,indent=2); f.write('\n')
print(f"Added {added} new synonym entries. Total headwords: {len(new_s)}")
