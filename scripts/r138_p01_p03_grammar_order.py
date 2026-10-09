#!/usr/bin/env python3
"""
Apply pedagogical fixes from PEDAGOGICAL_AUDIT.md P-01 and P-03.

P-01 Reorder A1 grammar:
  - Require a1-akkusativ BEFORE a1-trennbar
  - Move a1-futur-einf to A2 (renamed a2-futur was already there; remove duplicate a1-futur-einf from A1 phase list)
  - Move a1-weil-dass to A2 (a2-weil-dass exists; remove a1-weil-dass from A1 list)
  - Add plural early: a1-plural prerequisite on a0-artikel (new)
P-03 Add der/die/das in A0:
  - Insert new topic a0-artikel (gender/der-die-das + initial plurals)
  - Schedule a0-artikel after a0-buchstaben, before a1-sein-haben
"""
import json
from collections import OrderedDict

GRAMMAR = 'content/grammar.json'

with open(GRAMMAR, 'r', encoding='utf-8') as f:
    g = json.load(f, object_pairs_hook=OrderedDict)

# 1. Add new topic a0-artikel if missing
if 'a0-artikel' not in g:
    g['a0-artikel'] = OrderedDict([
        ("id", "a0-artikel"),
        ("titleDe", "der · die · das — Geschlecht der Nomen"),
        ("titleAr", "أدوات التعريف: der/die/das وجنس الاسم"),
        ("level", "A0"),
        ("ziel", "تتعرّف على أن كل اسم ألماني له جنس (مذكر/مؤنث/محايد) وتحفظ مع كل كلمة أداة التعريف معها من اليوم الأول، وتجمع أول 20 اسماً جمعاً بسيطاً."),
        ("voraus", ["a0-buchstaben"]),
        ("anwendung", OrderedDict([
            ("ar", "خذ 10 أسماء من قائمة اليوم (مثل der Mann, die Frau, das Kind) وردّدها مع أداتها خمس مرات. ثم حاول أن تقولها من الذاكرة."),
            ("de", "Lerne 10 Nomen aus der heutigen Liste (z. B. der Mann, die Frau, das Kind) und wiederhole jedes Nomen mit seinem Artikel fünfmal. Dann sag sie aus dem Gedächtnis."),
            ("candoIds", ["a0-6"])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a0-artikel-v1"),
                ("type", "choice"),
                ("promptDe", "___ Mann kommt aus Berlin."),
                ("options", ["Der", "Die", "Das"]),
                ("answer", ["Der"]),
                ("explanationAr", "Mann مذكر → der Mann.")
            ]),
            OrderedDict([
                ("id", "a0-artikel-v2"),
                ("type", "choice"),
                ("promptDe", "___ Frau heißt Anna."),
                ("options", ["Der", "Die", "Das"]),
                ("answer", ["Die"]),
                ("explanationAr", "Frau مؤنثة → die Frau.")
            ]),
            OrderedDict([
                ("id", "a0-artikel-v3"),
                ("type", "choice"),
                ("promptDe", "___ Kind ist drei Jahre alt."),
                ("options", ["Der", "Die", "Das"]),
                ("answer", ["Das"]),
                ("explanationAr", "Kind محايد → das Kind.")
            ])
        ]),
        ("summaryAr", "الدرس الأهم في الألمانية: كل اسم له جنس دائماً يُحفظ مع الكلمة من أول مرة (der/die/das)، لا تُحفظ الاسم وحده. الجمع يُحفظ مع الأداة die جمعاً. أهم شيفرة: الأسماء المنتهية بـ -er/-en/-ig/-ling غالباً مذكر؛ -in/-ung/-heit/-keit/-schaft/-ei/-tion مؤنثة؛ -chen/-lein/-um/-ium محايدة."),
        ("rules", [
            OrderedDict([
                ("de", "der = المذكر · die = المؤنث · das = المحايد · die (pl) = الجمع"),
                ("ar", "أدوات التعريف: der للمذكر، die للمؤنث، das للمحايد، die للجميع في الجمع.")
            ]),
            OrderedDict([
                ("de", "der Mann — die Männer · die Frau — die Frauen · das Kind — die Kinder"),
                ("ar", "الرجل/الرجال · المرأة/النساء · الطفل/الأطفال — مثال أولي للجمع.")
            ]),
            OrderedDict([
                ("de", "Regel: Lerne IMMER das Nomen mit Artikel, nie allein!"),
                ("ar", "قاعدة ذهبية: احفظ الاسم مع أداتها دائماً، لا تحفظ الاسم منفرداً أبداً.")
            ])
        ]),
        ("tables", [
            OrderedDict([
                ("captionDe", "Erste 12 Nomen mit Artikel"),
                ("captionAr", "أول 12 اسماً مع أدواتها"),
                ("headers", ["Artikel", "Nomen", "Arabisch", "Plural"]),
                ("rows", [
                    ["der", "Mann", "رجل", "die Männer"],
                    ["die", "Frau", "امرأة", "die Frauen"],
                    ["das", "Kind", "طفل", "die Kinder"],
                    ["der", "Vater", "أب", "die Väter"],
                    ["die", "Mutter", "أم", "die Mütter"],
                    ["der", "Sohn", "ابن", "die Söhne"],
                    ["die", "Tochter", "ابنة", "die Töchter"],
                    ["das", "Haus", "بيت", "die Häuser"],
                    ["der", "Tag", "يوم", "die Tage"],
                    ["die", "Zeit", "وقت", "die Zeiten"],
                    ["das", "Jahr", "سنة", "die Jahre"],
                    ["der", "Name", "اسم", "die Namen"],
                ])
            ])
        ]),
        ("examples", [
            OrderedDict([("de", "Der Mann heißt Omar."), ("ar", "الرجل اسمه عمر.")]),
            OrderedDict([("de", "Die Frau kommt aus Tunesien."), ("ar", "المرأة من تونس.")]),
            OrderedDict([("de", "Das Kind ist drei Jahre alt."), ("ar", "الطفل عمره ثلاث سنوات.")]),
        ]),
        ("eselsbruecke", "شفرة أولية سريعة: الـ«der» كلمة مذكر والـ«die» مؤنث والـ«das» محايد — اعتبر الأداة جزءاً من الكلمة (derMann, dieFrau, dasKind)."),
    ])
    print('+ Added new topic a0-artikel')

# 2. Move a1-futur-einf to A2 (change its level)
if g.get('a1-futur-einf'):
    g['a1-futur-einf']['level'] = 'A2'
    # Rename to a2-futur-einf to keep naming consistent with A2
    # But existing a2-futur is already there (covers Futur I more deeply). Mark this as duplicate/intro.
    # Actually: keep id but change level; PHASE_TOPICS[A1] will filter it out because level mismatch.
    # Also update prerequisites to reflect later introduction.
    g['a1-futur-einf']['voraus'] = ['a2-praesens-wdh', 'a2-perfekt']
    print('~ Moved a1-futur-einf → level A2')

# 3. a1-weil-dass stays A1? Audit says move to A2. But a2-weil-dass already exists. Remove from A1 list; change level to A2.
if g.get('a1-weil-dass'):
    g['a1-weil-dass']['level'] = 'A2'
    g['a1-weil-dass']['voraus'] = ['a2-perfekt']
    print('~ Moved a1-weil-dass → level A2')

# 4. Update prerequisites for better pedagogical order:
#    - a1-trennbar should follow a1-akkusativ
g['a1-trennbar']['voraus'] = ['a1-praesens', 'a1-akkusativ']
print('~ Set a1-trennbar voraus=[a1-praesens, a1-akkusativ]')

#    - a1-pronomen should follow a0-artikel (so articles/personal pronouns come before conjugation)
g['a1-pronomen']['voraus'] = ['a0-artikel', 'a0-begrussung']
print('~ Set a1-pronomen voraus to include a0-artikel')

#    - a1-sein-haben should follow a0-artikel (so der/die/das introduced before sentences)
g['a1-sein-haben']['voraus'] = ['a0-artikel', 'a0-begrussung']
print('~ Set a1-sein-haben voraus to include a0-artikel')

#    - a1-plural prereq a1-akkusativ is fine, but push it earlier: depend on a0-artikel
g['a1-plural']['voraus'] = ['a0-artikel', 'a1-akkusativ']
print('~ Set a1-plural voraus=[a0-artikel, a1-akkusativ]')

#    - a1-praesens should come after pronomen so conjugation has subjects
g['a1-praesens']['voraus'] = ['a1-pronomen', 'a1-sein-haben']
print('~ Set a1-praesens voraus=[a1-pronomen, a1-sein-haben]')

#    - a1-perfekt-einf should come AFTER a1-trennbar (because Perfekt uses ge- + Partizip II, which must know trennbar)
# Actually Perfekt of trennbare Verben is separable but Perfekt basics (regelmäßig: ge-...-t with haben) can precede. Let's keep but require akkusativ.
g['a1-perfekt-einf']['voraus'] = ['a1-sein-haben', 'a1-akkusativ']
print('~ Set a1-perfekt-einf voraus=[a1-sein-haben, a1-akkusativ]')

#    - a1-imperativ after modalverben is not needed; after praesens+akkusativ is fine (currently correct).

with open(GRAMMAR, 'w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(f'\nWrote {GRAMMAR}')
