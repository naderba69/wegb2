# -*- coding: utf-8 -*-
"""C1 authoring aid: checks ladder drafts against A0/A1 vocab coverage (mirror of the TS gate logic)."""
import json, re, sys

vocab = json.load(open('content/vocab.json'))
cards = [c for pack in vocab.values() for c in pack['cards']]
TOK = re.compile(r'[a-zäöüß]+')

def fold(w):
    return w.replace('ä', 'a').replace('ö', 'o').replace('ü', 'u').replace('ß', 'ss')

SUFFIXE = ['en', 'ern', 'er', 'es', 'in', 'e', 't', 'st', 'n', 's']

FUNKTIONSWOERTER = set('''der die das den dem des ein eine einen einem einer eines keine kein keinen keinem
mein meine meinen meinem meiner meine dein deine deinen deinem seiner seine seinen seinem ihre ihren ihrem
ich du er sie es wir ihr mich dich sich uns euch mir dir ihm ihnen man
und oder aber denn auch nicht nur schon sehr heute morgen gestern dann jetzt hier dort
wo was wer wie viel viele alle mehr gern oft immer manchmal zusammen allein weiter wieder noch fast als jeden jede jedem jeder
ja nein ist von zu mit nach aus in an auf fuer um bei seit bis vor hinter ueber unter zwischen
am im ans ins zum zur vom beim'''.split())

KONTRAKTIONEN = {'zur': 'zu', 'zum': 'zu', 'im': 'in', 'am': 'an', 'ins': 'in', 'ans': 'an', 'vom': 'von', 'beim': 'bei'}
IRREG = {}
for forms, lemma in [
    (['bin','bist','ist','sind','seid','war','warst','waren','wart'], 'sein'),
    (['habe','hast','hat','haben','habt','hatte','hatten'], 'haben'),
    (['werde','wirst','wird','werden','werdet','wurde'], 'werden'),
    (['will','willst','wollen','wollt','wollte'], 'wollen'),
    (['kann','kannst','können','könnt','konnte'], 'können'),
    (['muss','musst','müssen','müsst','musste'], 'müssen'),
    (['möchte','möchtest','möchten','möchtet'], 'möchten'),
    (['darf','darfst','dürfen','dürft'], 'dürfen'),
    (['soll','sollst','sollen','sollt'], 'sollen'),
    (['weiß','weißt','wissen','wisst'], 'wissen'),
    (['gibt','gebe','gibst','geben','gebt','gab'], 'geben'),
    (['fährt','fahre','fährst','fahren','fahrt'], 'fahren'),
    (['läuft','laufe','läufst','laufen','lauft'], 'laufen'),
    (['schläft','schlafe','schläfst','schlafen','schlaft'], 'schlafen'),
    (['isst','esse','essen','esst','aß'], 'essen'),
    (['trinkt','trinke','trinken','trinkt'], 'trinken'),
    (['sieht','sehe','siehst','sehen','seht','sah'], 'sehen'),
    (['liest','lese','lesen','lest','las'], 'lesen'),
    (['spricht','spreche','sprechen','sprecht','sprach'], 'sprechen'),
    (['nimmt','nehme','nehmen','nehmt','nahm'], 'nehmen'),
    (['kommt','komme','kommen','kommt'], 'kommen'),
    (['geht','gehe','gehen','geht'], 'gehen'),
    (['steht','stehe','stehen','steht'], 'stehen'),
    (['sitzt','sitze','sitzen','sitzt'], 'sitzen'),
    (['liegt','liege','liegen','liegt'], 'liegen'),
    (['hilft','helfe','helfen','helft'], 'helfen'),
    (['findet','finde','finden','findet'], 'finden'),
    (['tut','tue','tun','tut','tu'], 'tun'),
    (['mag','magst','mögen','mögt','mochte'], 'mögen'),
    (['besser','beste','besten'], 'gut'),
]:
    for f in forms:
        IRREG[f] = lemma

def stamm_kandidaten(w):
    out = {w, fold(w)}
    cur = [w]
    for _ in range(2):
        nxt = []
        for c in cur:
            for suf in SUFFIXE:
                if c.endswith(suf) and len(c) - len(suf) >= 3:
                    nxt.append(c[:-len(suf)])
        cur = nxt
        for c in cur:
            out.add(c); out.add(fold(c))
    return out | {c + 'n' for c in out} | {c + 'en' for c in out} | {fold(c) + 'en' for c in out}

allowed = set()
for c in cards:
    if c.get('level') in ('A0', 'A1'):
        for tok in TOK.findall(c['de'].lower()):
            allowed.add(tok); allowed.add(fold(tok))

def abgedeckt(wort, glossar_stems):
    if wort.isdigit():
        return True
    kandidaten = stamm_kandidaten(wort)
    if wort in FUNKTIONSWOERTER or fold(wort) in FUNKTIONSWOERTER or kandidaten & allowed or kandidaten & glossar_stems:
        return True
    lemma = IRREG.get(wort)
    if lemma and (lemma in allowed or fold(lemma) in allowed or lemma in glossar_stems):
        return True
    kontr = KONTRAKTIONEN.get(wort)
    if kontr and kontr in allowed:
        return True
    return False

BAND = {1: (18, 28), 2: (28, 38), 3: (38, 50), 4: (50, 65), 5: (65, 82), 6: (82, 100)}

def pruefe(texte):
    probleme = 0
    for t in texte:
        glossar_stems = set()
        for g in t['glossar']:
            for tok in TOK.findall(g['de'].lower()):
                glossar_stems.add(tok)
        toks = TOK.findall(t['de'].lower())
        fehlend = sorted({w for w in toks if not abgedeckt(w, glossar_stems)})
        lo, hi = BAND[t['stufe']]
        ok_len = lo <= len(t['de'].split()) <= hi
        status = 'OK ' if (not fehlend and ok_len) else 'FIX'
        if fehlend or not ok_len:
            probleme += 1
        print(f"{status} {t['id']} S{t['stufe']} {len(t['de'].split())}w (band {lo}-{hi}) glossar={len(t['glossar'])} fehlend={fehlend}")
    print('Probleme:', probleme)

if __name__ == '__main__':
    data = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'scripts/patches/_ll_texte.json'))
    pruefe(data['texte'])
