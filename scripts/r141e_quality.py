#!/usr/bin/env python3
"""R141e: normalize content to runtime schemas, complete vocabulary records, and audit recent grammar examples."""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(name):
    return json.loads((ROOT / 'content' / name).read_text(encoding='utf-8'))

def save(name, data):
    (ROOT / 'content' / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def normalize_mc_answers(value):
    """The UI grader receives the clicked option text, never its numeric index."""
    if isinstance(value, dict):
        if value.get('type') == 'choice':
            value['type'] = 'mc'
        if value.get('type') == 'mc' and type(value.get('answer')) is int:
            options = value.get('options')
            answer = value['answer']
            if isinstance(options, list) and 0 <= answer < len(options):
                value['answer'] = options[answer]
        if value.get('type') == 'mc' and isinstance(value.get('answer'), list) and len(value['answer']) == 1:
            value['answer'] = value['answer'][0]
        for child in value.values():
            normalize_mc_answers(child)
    elif isinstance(value, list):
        for child in value:
            normalize_mc_answers(child)

# ---------------------------------------------------------------------------
# 1) Schreib-/Lesetext schema: runtime expects de/ar/questions, not bodyDe etc.
texts = load('texts.json')
for t in texts:
    if t.get('id', '').startswith(('t-a0-011', 't-a0-012', 't-a0-013', 't-a0-014', 't-a0-015', 't-a2-031', 't-a2-032')):
        if 'bodyDe' in t:
            t['de'] = t.pop('bodyDe')
        if 'bodyAr' in t:
            t['ar'] = t.pop('bodyAr')
        comp = t.pop('comprehension', None)
        if comp is not None and 'questions' not in t:
            t['questions'] = [
                {
                    'id': f"{t['id']}-q{index + 1}",
                    'type': 'mc',
                    'promptDe': q['frage_de'],
                    'promptAr': q['frage_ar'],
                    'options': q['options'],
                    'answer': q['answer'],
                    'explanationAr': q['erklaerung_ar'],
                }
                for index, q in enumerate(comp)
            ]
        # Glossary metadata was not consumed by the reading UI; avoid storing a dead field.
        t.pop('gloss', None)

# Small accuracy/style corrections in the newly added A0/A2 texts.
for t in texts:
    if t.get('id') == 't-a0-011':
        t['de'] = t['de'].replace('Ich habe auch ein Buch für Deutsch.', 'Ich habe auch ein Buch für den Deutschunterricht.')
        t['ar'] = t['ar'].replace('ثلاث دفاتر', 'ثلاثة دفاتر').replace('كتاب للألمانية', 'كتاب لحصة الألمانية')
    elif t.get('id') == 't-a2-031':
        t['de'] = t['de'].replace('aber sie hat schnell neue Kollegen kennengelernt.', 'aber sie lernte schnell neue Kollegen kennen.')
        t['de'] = t['de'].replace('Am Wochenende erkundet sie mit dem Fahrrad die Viertel und probiert neue Cafés aus.', 'Am Wochenende erkundet sie die Stadt mit dem Fahrrad und probiert neue Cafés aus.')
        t['ar'] = t['ar'].replace('تستكشف الأحياء بالدراجة', 'تستكشف المدينة بالدراجة')
    elif t.get('id') == 't-a1-030':
        t['de'] = t['de'].replace('Heute bin ich beim Arzt, weil ich seit zwei Tagen Kopfschmerzen habe.', 'Heute bin ich beim Arzt. Ich habe seit zwei Tagen Kopfschmerzen.')
        t['ar'] = t['ar'].replace('اليوم أنا عند الطبيب لأنني أعاني من الصداع منذ يومين.', 'اليوم أنا عند الطبيب. أعاني من الصداع منذ يومين.')
    elif t.get('id') == 't-a1-031':
        t['de'] = t['de'].replace('Jeden Morgen gibt ich ihr Futter', 'Jeden Morgen gebe ich ihr Futter')

# Fifteen A1 reading records added earlier had no comprehension items. Restore
# two answerable questions per text so LesenTask always receives an Exercise[].
a1_questions = {
    't-a1-021': [
        ('Mit wem wohnt Karim in Köln?', 'مع من يسكن كريم في كولونيا؟', ['Mit seiner Frau und seiner Tochter', 'Mit seinem Vater', 'Allein'], 0, 'يعيش كريم مع زوجته أمينة وابنته سارة.'),
        ('Wann besucht sein Vater die Familie?', 'متى يزور والده العائلة؟', ['Jeden Sommer', 'Jeden Freitag', 'Jeden Monat'], 0, 'والده يزوره كل صيف.'),
    ],
    't-a1-022': [
        ('Wann steht der Erzähler auf?', 'متى يستيقظ المتحدث؟', ['Um halb sechs', 'Um halb sieben', 'Um acht Uhr'], 1, 'النص يقول: um halb sieben.'),
        ('Was frühstückt er mit seiner Frau?', 'ماذا يفطر مع زوجته؟', ['Brot mit Käse und ein Ei', 'Müsli und Obst', 'Nur Kaffee'], 0, 'يفطران خبزاً بالجبن وبيضة.'),
    ],
    't-a1-023': [
        ('Wie viele Zimmer hat die Wohnung?', 'كم غرفة في الشقة؟', ['Ein Zimmer', 'Zwei Zimmer', 'Drei Zimmer'], 1, 'للشقة غرفتان.'),
        ('Wie hoch ist die Miete warm?', 'كم الإيجار شاملاً التدفئة؟', ['500 Euro', '600 Euro', '700 Euro'], 1, 'الإيجار 600 يورو warm.'),
    ],
    't-a1-024': [
        ('In welcher Stadt wohnt die Person?', 'في أي مدينة يسكن المتحدث؟', ['Leipzig', 'Köln', 'Berlin'], 0, 'النص يبدأ: Ich wohne in Leipzig.'),
        ('Was fährt direkt vor der Haustür?', 'ماذا يمر مباشرة أمام المنزل؟', ['Der Bus', 'Die Straßenbahn', 'Der Zug'], 1, 'الترام يمر مباشرة أمام البيت.'),
    ],
    't-a1-025': [
        ('Wie viel kostet alles zusammen?', 'كم يكلف كل شيء؟', ['Zehn Euro', 'Zwölf Euro', 'Zwanzig Euro'], 1, 'المجموع 12 يورو.'),
        ('Wie bezahlt die Person an der Kasse?', 'كيف يدفع المتحدث عند الصندوق؟', ['Mit Karte', 'Mit Bargeld', 'Mit dem Handy'], 0, 'يدفع بالبطاقة.'),
    ],
    't-a1-026': [
        ('Wie warm ist es ungefähr?', 'كم درجة الحرارة تقريباً؟', ['Zehn Grad', 'Zwanzig Grad', 'Dreißig Grad'], 1, 'درجة الحرارة حوالي 20 درجة.'),
        ('Was macht die Person am Nachmittag?', 'ماذا يفعل المتحدث بعد الظهر؟', ['Er geht spazieren und hört Musik', 'Er arbeitet im Büro', 'Er besucht einen Arzt'], 0, 'بعد الظهر يتمشى ويستمع إلى الموسيقى.'),
    ],
    't-a1-027': [
        ('Wo spielt die Person Fußball?', 'أين يلعب المتحدث كرة القدم؟', ['In einer Halle in der Nähe der Wohnung', 'Im Garten', 'In einer Schule'], 0, 'يلعبون في قاعة قريبة من الشقة.'),
        ('Was machen die Kollegen nach dem Spiel?', 'ماذا يفعل الزملاء بعد المباراة؟', ['Sie trinken zusammen ein Bier', 'Sie gehen zur Arbeit', 'Sie essen Kuchen'], 0, 'يشربون معاً بيرة بعد المباراة.'),
    ],
    't-a1-028': [
        ('Was ist der Beruf des Erzählers?', 'ما مهنة المتحدث؟', ['Ingenieur', 'Lehrer', 'Arzt'], 0, 'يقول إنه يعمل مهندساً.'),
        ('Was produziert die Firma?', 'ماذا تنتج الشركة؟', ['Maschinen für Autos', 'Kleidung', 'Bücher'], 0, 'الشركة تصنع آلات للسيارات.'),
    ],
    't-a1-029': [
        ('Was trägt die Person heute?', 'ماذا يلبس المتحدث اليوم؟', ['Eine blaue Jeans, ein weißes T-Shirt und schwarze Schuhe', 'Eine rote Hose und einen Mantel', 'Ein Kleid und Sandalen'], 0, 'هذه هي الملابس المذكورة في بداية النص.'),
        ('Was trägt die Person im Winter manchmal zusätzlich?', 'ماذا يرتدي المتحدث أحياناً في الشتاء إضافةً إلى السترة؟', ['Einen Schal und Handschuhe', 'Eine kurze Hose', 'Ein T-Shirt'], 0, 'يذكر النص وشاحاً وقفازات.'),
    ],
    't-a1-030': [
        ('Was tut dem Patienten weh?', 'ما الذي يؤلم المريض؟', ['Der Kopf', 'Der Bauch', 'Der Fuß'], 0, 'يقول: Mein Kopf tut weh.'),
        ('Was empfiehlt die Ärztin?', 'بماذا تنصح الطبيبة؟', ['Viel Wasser trinken und sich ausruhen', 'Lange spazieren gehen', 'Keinen Tee trinken'], 0, 'تنصحه بشرب الماء والراحة.'),
    ],
    't-a1-031': [
        ('Wie heißt die Katze?', 'ما اسم القطة؟', ['Mimi', 'Luna', 'Mia'], 0, 'اسم القطة Mimi.'),
        ('Womit spielt die Katze am Abend gern?', 'بماذا تحب القطة اللعب مساءً؟', ['Mit einem roten Ball', 'Mit einem Buch', 'Mit einer Tasche'], 0, 'تلعب مساءً بكرة حمراء.'),
    ],
    't-a1-032': [
        ('Was macht die Person am Samstag?', 'ماذا يفعل المتحدث يوم السبت؟', ['Sie putzt die Wohnung und kauft ein', 'Sie fährt zur Arbeit', 'Sie besucht einen Arzt'], 0, 'يوم السبت ينظف الشقة ويتسوق.'),
        ('Was macht die Person am Sonntagabend?', 'ماذا يفعل المتحدث مساء الأحد؟', ['Sie kocht und bereitet sich auf die neue Woche vor', 'Sie geht ins Kino', 'Sie arbeitet im Supermarkt'], 0, 'يطهو ويستعد للأسبوع الجديد.'),
    ],
    't-a1-033': [
        ('Was isst und trinkt die Person zum Frühstück?', 'ماذا يأكل ويشرب المتحدث على الفطور؟', ['Brot mit Marmelade und Kaffee', 'Reis und Wasser', 'Fleisch und Tee'], 0, 'الفطور خبز بالمربى وقهوة.'),
        ('Was trinkt die Person manchmal?', 'ماذا يشرب المتحدث أحياناً؟', ['Apfelsaft', 'Milch', 'Limonade'], 0, 'يشرب أحياناً عصير التفاح.'),
    ],
    't-a1-034': [
        ('Was soll man an der Ampel tun?', 'ماذا ينبغي أن يفعل المرء عند الإشارة؟', ['Links abbiegen', 'Rechts abbiegen', 'Geradeaus zurückgehen'], 0, 'بعد الإشارة انعطف يساراً.'),
        ('Welche Buslinie fährt zum Bahnhof?', 'أي خط حافلة يذهب إلى المحطة؟', ['Linie zwei', 'Linie drei', 'Linie fünf'], 1, 'النص يذكر Buslinie drei.'),
    ],
    't-a1-035': [
        ('Wie alt wird die Person heute?', 'كم يصبح عمر المتحدث اليوم؟', ['Zwanzig', 'Dreißig', 'Vierzig'], 1, 'يقول: Ich bin dreißig Jahre alt.'),
        ('Wer hat den Kuchen gemacht?', 'من أعدّ الكعكة؟', ['Seine Frau', 'Sein Vater', 'Seine Tochter'], 0, 'زوجته صنعت الكعكة.'),
    ],
}
for t in texts:
    qspec = a1_questions.get(t['id'])
    if qspec and not t.get('questions'):
        t['questions'] = [
            {'id': f"{t['id']}-q{idx + 1}", 'type': 'mc', 'promptDe': prompt_de,
             'promptAr': prompt_ar, 'options': options, 'answer': answer, 'explanationAr': explanation}
            for idx, (prompt_de, prompt_ar, options, answer, explanation) in enumerate(qspec)
        ]
    for index, question in enumerate(t.get('questions', []), start=1):
        question.setdefault('id', f"{t['id']}-q{index}")
reading_evidence = {
    't-a1-021-q1': 'Ich wohne in Köln mit meiner Frau Amina. Unsere Tochter Sara ist drei Jahre alt.',
    't-a1-021-q2': 'Mein Vater wohnt in Tunesien, aber er besucht uns jedes Jahr im Sommer.',
    't-a1-022-q1': 'Ich stehe jeden Tag um halb sieben auf.',
    't-a1-022-q2': 'Um acht Uhr frühstücke ich mit meiner Frau: Brot mit Käse und ein Ei.',
    't-a1-023-q1': 'Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon.',
    't-a1-023-q2': 'Die Miete ist sechshundert Euro warm.',
    't-a1-024-q1': 'Ich wohne in Leipzig, einer Stadt im Osten von Deutschland.',
    't-a1-024-q2': 'Die Straßenbahn fährt direkt vor meiner Haustür',
    't-a1-025-q1': 'Alles kostet zusammen zwölf Euro.',
    't-a1-025-q2': 'An der Kasse bezahle ich mit Karte.',
    't-a1-026-q1': 'etwa zwanzig Grad.',
    't-a1-026-q2': 'Am Nachmittag gehe ich spazieren und höre Musik.',
    't-a1-027-q1': 'Wir spielen in einer Halle in der Nähe meiner Wohnung.',
    't-a1-027-q2': 'Nach dem Spiel trinken wir zusammen ein Bier.',
    't-a1-028-q1': 'Ich arbeite als Ingenieur in einer kleinen Firma in der Stadt.',
    't-a1-028-q2': 'Die Firma macht Maschinen für Autos.',
    't-a1-029-q1': 'Heute trage ich eine blaue Jeans, ein weißes T-Shirt und schwarze Schuhe.',
    't-a1-029-q2': 'Im Winter ziehe ich eine warme Jacke an, manchmal auch einen Schal und Handschuhe.',
    't-a1-030-q1': 'Ich habe seit zwei Tagen Kopfschmerzen.',
    't-a1-030-q2': 'Trinken Sie viel Wasser und ruhen Sie sich aus.',
    't-a1-031-q1': 'Sie heißt Mimi und ist zwei Jahre alt.',
    't-a1-031-q2': 'Am Abend spielt sie gern mit einem roten Ball.',
    't-a1-032-q1': 'Dann putze ich die Wohnung und kaufe ein.',
    't-a1-032-q2': 'Danach bereite ich meine Sachen für Montag vor.',
    't-a1-033-q1': 'Zum Frühstück esse ich gern Brot mit Marmelade und trinke Kaffee.',
    't-a1-033-q2': 'Ich trinke viel Wasser und manchmal Apfelsaft.',
    't-a1-034-q1': 'Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab.',
    't-a1-034-q2': 'nehmen Sie die Buslinie drei.',
    't-a1-035-q1': 'Heute habe ich Geburtstag und bin dreißig Jahre alt.',
    't-a1-035-q2': 'Meine Frau hat einen Kuchen gebacken.',
    't-a2-031-q1': 'Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch',
    't-a2-032-q1': 'die größte Schwierigkeit war, abends keine Schokolade zu essen.',
    't-a2-21-q1': 'Ich fühle mich seit drei Tagen nicht gut.',
    't-a2-21-q2': 'ich soll viel Tee trinken und zwei Tage im Bett bleiben.',
    't-a2-22-q1': 'weil meine Tochter krank ist.',
    't-a2-23-q1': 'Sie brauchen zu Fuß ungefähr acht Minuten.',
    't-a2-24-q1': 'weil ich am Montag einen Test hatte.',
    't-a2-25-q1': 'ein Kilo für 1,49 Euro.',
    't-a2-26-q1': 'Bitte sag mir bis Donnerstag Bescheid, ob du kommen kannst.',
    't-a2-27-q1': 'Die Kaltmiete beträgt 580 Euro.',
    't-a2-28-q1': 'Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist.',
    't-a2-29-q1': 'Der Kurs ist dreimal pro Woche: montags, mittwochs und freitags',
    't-a2-30-q1': 'Das kocht meine Mutter jeden Freitag in Tunesien.',
    't-b1-31-q1': 'Der Grund war ein neues Jobangebot als Softwareentwicklerin.',
    't-b1-31-q2': 'Was ich an Leipzig besonders mag, sind die vielen Grünflächen und die günstigen Mieten im Vergleich zu Hamburg.',
    't-b1-32-q1': 'Seit einem Jahr esse ich kein Fleisch mehr.',
    't-b1-32-q2': 'Natürlich muss ich darauf achten, genügend Eisen und Eiweiß zu essen',
    't-b1-33-q1': 'bei einer Marketingfirma in Köln.',
    't-b1-34-q1': 'verletzte sich leicht am Knie.',
    't-b1-35-q1': 'Ich schlage vor, dass die Stadt mehr Kontrollen durchführt und höhere Geldstrafen verhängt.',
    't-b2-36-q1': 'Kritiker wenden ein, dass späterer Unterricht die Eltern vor organisatorische Probleme stellt',
    't-b2-37-q1': 'war ich überrascht, wie direkt Kollegen und Nachbarn ihre Meinung sagten.',
    't-b2-38-q1': 'Arbeitgeberverbände warnen davor, dass in produzierenden Branchen Maschinen stillstehen könnten und die Dienstleistungsqualität sinken könnte.',
    't-b2-39-q1': 'Gründe sind hohe Mieten, beengte Wohnverhältnisse und der Wunsch nach mehr Natur und Ruhe.',
    't-b2-40-q1': 'Andere sollen Mitmenschen schonen.',
}
for t in texts:
    for question in t.get('questions', []):
        evidence = reading_evidence.get(question.get('id'))
        if evidence:
            assert evidence in t.get('de', ''), f"evidence not found: {question['id']}"
            explanation = question.get('explanationAr', '')
            marker = f'«{evidence}»'
            if marker not in explanation:
                question['explanationAr'] = f'الدليل في النص: {marker} — {explanation}'
normalize_mc_answers(texts)
save('texts.json', texts)

# ---------------------------------------------------------------------------
# 2) Hörtexte had been stored in a draft schema. Convert every type=hoer item
#    to the exact Hoerdialog interface consumed by HoerenTask.
dialogues = load('dialogues.json')
for d in dialogues:
    if d.get('type') != 'hoer':
        continue
    d['titleDe'] = d.get('titleDe') or d.get('situationDe') or d['id']
    d['titleAr'] = d.get('titleAr') or d.get('situationAr') or ''
    for line in d.get('lines', []):
        if 'speaker' in line:
            line['who'] = line.pop('speaker')
        line.setdefault('who', 'Sprecher')
        line.setdefault('ar', '')
    comp = d.pop('comprehension', None)
    if comp is not None:
        d['questions'] = [
            {
                'id': f"{d['id']}-q{index + 1}",
                'type': 'mc',
                'promptDe': q['frage_de'],
                'promptAr': q['frage_ar'],
                'options': q['options'],
                'answer': q['answer'],
                'explanationAr': q['erklaerung_ar'],
            }
            for index, q in enumerate(comp)
        ]
    else:
        d.setdefault('questions', [])
    if not d.get('dictation'):
        candidates = []
        for line in d.get('lines', []):
            for part in re.findall(r'[^.!?]+[.!?]?', line.get('de', '')):
                sentence = part.strip()
                if len(re.findall(r"[A-Za-zÄÖÜäöüß0-9]+", sentence)) >= 3 and sentence not in candidates:
                    candidates.append(sentence)
        d['dictation'] = candidates[:1]

# Normalize the remaining historical dialogue variants to Hoerdialog too.
# A few early records stored a multiline transcript or used `sp` instead of `who`.
roles = {
    'dlg-a1-fahrkarte': ['Kunde', 'Mitarbeiter', 'Kunde', 'Mitarbeiter', 'Kunde', 'Mitarbeiter', 'Kunde', 'Mitarbeiter', 'Kunde'],
    'dlg-a1-reklamation-hotel': ['Gast', 'Rezeptionistin', 'Gast', 'Rezeptionistin', 'Gast', 'Rezeptionistin', 'Gast'],
    'dlg-a2-terminabsage': ['Mitarbeiterin', 'Patient', 'Mitarbeiterin', 'Patient', 'Mitarbeiterin', 'Patient', 'Mitarbeiterin'],
    'dlg-a2-krankenversicherung': ['Kundin', 'Mitarbeiterin', 'Kundin', 'Mitarbeiterin', 'Kundin', 'Mitarbeiterin', 'Kundin', 'Mitarbeiterin'],
}
question_ar = {
    'dlg-a1-fahrkarte': [
        'أي نوع من التذاكر يشتري؟', 'من أي رصيف ينطلق القطار؟', 'كم ثمن التذكرة؟',
    ],
    'dlg-a2-terminabsage': ['لماذا يتصل سامي؟', 'متى الموعد الجديد؟'],
    'dlg-a2-krankenversicherung': ['كم تبلغ مساهمة التأمين تقريباً؟', 'ما المستندات التي تحتاجها الموظفة؟'],
}
for d in dialogues:
    if d.get('id') in roles and not d.get('lines'):
        de_lines = [line.strip() for line in d.pop('de', '').splitlines() if line.strip()]
        ar_lines = [line.strip().lstrip('—–- ').strip() for line in d.pop('ar', '').splitlines() if line.strip()]
        role_list = roles[d['id']]
        d['lines'] = [
            {'who': role_list[i] if i < len(role_list) else 'Sprecher', 'de': text,
             'ar': ar_lines[i] if i < len(ar_lines) else ''}
            for i, text in enumerate(de_lines)
        ]
    for line in d.get('lines', []):
        if 'sp' in line:
            line['who'] = line.pop('sp')
        line.setdefault('who', 'Sprecher')
    for index, q in enumerate(d.get('questions', []), start=1):
        if 'q' in q and 'promptDe' not in q:
            q['promptDe'] = q.pop('q')
        q.setdefault('type', 'mc')
        q.setdefault('id', f"{d['id']}-q{index}")
        if not q.get('promptAr'):
            translations = question_ar.get(d['id'], [])
            q['promptAr'] = translations[index - 1] if index <= len(translations) else 'اختر الإجابة الصحيحة.'
    if d.get('id') == 'dlg-a1-reklamation-hotel' and not d.get('questions'):
        d['questions'] = [
            {'id': 'dlg-a1-reklamation-hotel-q1', 'type': 'mc',
             'promptDe': 'Welche Probleme hat der Gast im Zimmer?', 'promptAr': 'ما المشكلتان في غرفة النزيل؟',
             'options': ['Das Zimmer ist schmutzig und das Licht im Bad funktioniert nicht', 'Das Bett ist zu klein', 'Das Fenster ist kaputt'],
             'answer': 0, 'explanationAr': 'يذكر الضيف أن الغرفة غير نظيفة وأن ضوء الحمام لا يعمل.'},
            {'id': 'dlg-a1-reklamation-hotel-q2', 'type': 'mc',
             'promptDe': 'Was bietet die Rezeptionistin an?', 'promptAr': 'ماذا تعرض موظفة الاستقبال؟',
             'options': ['Ein anderes Zimmer', 'Ein kostenloses Frühstück', 'Eine spätere Abreise'],
             'answer': 0, 'explanationAr': 'تعرض غرفة أخرى، رقم 214.'},
        ]
    if not isinstance(d.get('dictation'), list):
        d['dictation'] = []
    if not d['dictation']:
        candidates = []
        for line in d.get('lines', []):
            for part in re.findall(r'[^.!?]+[.!?]?', line.get('de', '')):
                sentence = part.strip()
                if len(re.findall(r"[A-Za-zÄÖÜäöüß0-9]+", sentence)) >= 3 and sentence not in candidates:
                    candidates.append(sentence)
        d['dictation'] = candidates[:1]
# Repair the road location and replace an unsourced, invented employment statistic.
for d in dialogues:
    if d.get('id') == 'd-a2-ht03':
        d['lines'][0]['de'] = (
            'Die Polizei meldet einen Unfall auf der A3 kurz hinter der Anschlussstelle Lohmar '
            'in Fahrtrichtung Frankfurt. Drei Fahrzeuge sind beteiligt, die linke Spur ist gesperrt. '
            'Es gibt zurzeit einen Stau von acht Kilometern. Autofahrer werden gebeten, bei der '
            'nächsten Ausfahrt abzufahren.'
        )
        d['lines'][0]['ar'] = (
            'تُبلغ الشرطة عن حادث على الطريق السريع A3 بعد مخرج لومار بقليل باتجاه فرانكفورت. '
            'اشتركت فيه ثلاث سيارات، والمسار الأيسر مغلق. يبلغ طول الازدحام حالياً ثمانية كيلومترات. '
            'ويُرجى من السائقين الخروج عند المخرج التالي.'
        )
        if d.get('questions'):
            d['questions'][0]['promptDe'] = 'Warum sollen Autofahrer an der nächsten Ausfahrt abfahren?'
            d['questions'][0]['promptAr'] = 'لماذا ينبغي للسائقين الخروج عند المخرج التالي؟'
    elif d.get('id') == 'd-b2-ht03':
        d['situationDe'] = d['titleDe'] = 'Wissenschaftsmeldung: KI und der Arbeitsmarkt'
        d['situationAr'] = d['titleAr'] = 'خبر علمي: الذكاء الاصطناعي وسوق العمل'
        d['lines'][0]['de'] = (
            'Eine neue Untersuchung des Instituts für Arbeitsmarkt- und Berufsforschung analysiert, '
            'wie künstliche Intelligenz berufliche Aufgaben verändert. Die Forschenden erwarten, dass '
            'einige Tätigkeiten automatisiert werden, während in anderen Bereichen neue Aufgaben '
            'entstehen. Besonders betroffen sein könnten wiederkehrende Büro- und Verwaltungsaufgaben. '
            'Aus der Untersuchung lässt sich jedoch keine sichere Zahl künftig wegfallender Stellen '
            'ableiten. Entscheidend seien Weiterbildung und die Frage, ob Unternehmen KI unterstützend '
            'statt ersetzend einsetzen.'
        )
        d['lines'][0]['ar'] = (
            'تحلل دراسة جديدة لمعهد بحوث سوق العمل والمهن كيف يغيّر الذكاء الاصطناعي المهام المهنية. '
            'ويتوقع الباحثون أتمتة بعض الأنشطة، في حين تنشأ مهام جديدة في مجالات أخرى. وقد تتأثر '
            'خصوصاً المهام المكتبية والإدارية المتكررة. لكن لا يمكن استنتاج رقم مؤكد للوظائف التي '
            'ستختفي مستقبلاً. ويعتمد الأمر على التدريب المستمر وعلى ما إذا كانت الشركات تستخدم الذكاء '
            'الاصطناعي للمساعدة أم للاستبدال.'
        )
        d['questions'] = [{
            'id': f"{d['id']}-q1", 'type': 'mc',
            'promptDe': 'Was lässt sich laut Sprecher NICHT sicher aus der Untersuchung ableiten?',
            'promptAr': 'ما الذي لا يمكن استنتاجه على نحو مؤكد من الدراسة؟',
            'options': [
                'Die genaue Zahl künftig wegfallender Arbeitsplätze',
                'Dass sich berufliche Aufgaben verändern können',
                'Dass Weiterbildung wichtig bleibt',
            ],
            'answer': 0,
            'explanationAr': 'يقول المتحدث صراحةً إنه لا يمكن استنتاج عدد مؤكد للوظائف التي ستختفي.',
        }]
        d['dictation'] = ['Eine neue Untersuchung analysiert, wie künstliche Intelligenz berufliche Aufgaben verändert.']
normalize_mc_answers(dialogues)
save('dialogues.json', dialogues)

# ---------------------------------------------------------------------------
# 3) Fix unambiguous grammar/usage traps added in R141. Correct sentences are
#    not labelled as errors merely because another wording is more formal.
fehler = load('fehler.json')
repairs = {
    'f-a1-034': {
        'falsch': '*Mein Bruder seit drei Jahren in Berlin wohnt.',
        'richtig': 'Mein Bruder wohnt seit drei Jahren in Berlin.',
        'regelAr': 'في الجملة الرئيسية يأتي الفعل المصرف في الموقع الثاني: Mein Bruder (1) wohnt (2). لا يوضع الفعل في النهاية لمجرد وجود عبارة seit drei Jahren.',
        'kategorie': 'Wortstellung / Verbzweit',
    },
    'f-a1-040': {
        'falsch': '*Gestern habe ich zur Arbeit gefahren.',
        'richtig': 'Gestern bin ich zur Arbeit gefahren.',
        'regelAr': 'fahren بمعنى الانتقال من مكان إلى آخر يأخذ sein في Perfekt: ich bin gefahren.',
        'kategorie': 'Perfekt / Hilfsverb',
    },
    'f-a1-041': {
        'falsch': '*Meine Schwester hat ein neu Auto.',
        'richtig': 'Meine Schwester hat ein neues Auto.',
        'regelAr': 'Auto محايد وفي المفعول به يأتي بعد ein؛ لذلك تأخذ الصفة النهاية -es: ein neues Auto.',
        'kategorie': 'Adjektivdeklination',
    },
    'f-b1-048': {
        'falsch': '*Der Mann, der ich gestern getroffen habe, ist mein Nachbar.',
        'richtig': 'Der Mann, den ich gestern getroffen habe, ist mein Nachbar.',
        'regelAr': 'ضمير الوصل يأخذ الحالة بحسب وظيفته داخل جملة الوصل: هنا مفعول به مذكر، لذا den؛ ولا نكرر المفعول بضمير ihn.',
        'kategorie': 'Relativsatz / Akkusativ',
    },
    'f-b1-049': {
        'falsch': '*Trotz des stark Regen gingen wir spazieren.',
        'richtig': 'Trotz des starken Regens gingen wir spazieren.',
        'regelAr': 'trotz يأخذ Genitiv؛ ومع الاسم المذكر المفرد: des Regens. وبعد أداة des تنتهي الصفة بـ -en: des starken Regens.',
        'kategorie': 'Genitiv / Adjektivdeklination',
    },
    'f-b1-050': {
        'falsch': '*Als ich nach Hause kam, ich kochte das Abendessen.',
        'richtig': 'Als ich nach Hause kam, kochte ich das Abendessen.',
        'regelAr': 'إذا بدأت الجملة الرئيسية بجملة زمنية تابعة، تأتي بعدها فاصلة ثم الفعل المصرف مباشرة: ..., kochte ich ... (الفعل في الموقع الثاني).',
        'kategorie': 'Wortstellung nach Nebensatz',
    },
    'f-b1-053': {
        'falsch': '*Ich lerne Deutsch, um ich in Berlin arbeiten kann.',
        'richtig': 'Ich lerne Deutsch, um in Berlin arbeiten zu können. / Ich lerne Deutsch, damit ich in Berlin arbeiten kann.',
        'regelAr': 'um … zu تأتي عادةً مع الفاعل نفسه ولا يتبع um ضمير فاعل؛ أما damit فتأخذ جملةً بفعل مصرف في النهاية.',
        'kategorie': 'Zweck / um…zu · damit',
    },
    'f-b1-054': {
        'falsch': '*Mir bin heute langweilig.',
        'richtig': 'Mir ist heute langweilig.',
        'regelAr': 'للتعبير عن الشعور بالملل نقول Mir ist langweilig (Dativ + sein). أمّا Ich bin langweilig فهي جملة صحيحة أخرى معناها «أنا شخص ممل»، وليست «أشعر بالملل».',
        'kategorie': 'Dativ / Bedeutungsunterschied',
    },
    'f-b2-036': {
        'falsch': '*Im Vergleich zu das letzte Jahr ist der Umsatz gestiegen.',
        'richtig': 'Im Vergleich zum letzten Jahr ist der Umsatz gestiegen.',
        'regelAr': 'zu يأخذ Dativ: das Jahr يصبح dem Jahr؛ وzu dem تختصر عادةً إلى zum. لذلك: im Vergleich zum letzten Jahr.',
        'kategorie': 'Präposition / Dativ',
    },
    'f-b2-037': {
        'falsch': '*Indem es stark regnete, fiel das Fest aus.',
        'richtig': 'Weil es stark regnete, fiel das Fest aus. / Wegen des starken Regens fiel das Fest aus.',
        'regelAr': 'indem يشرح الوسيلة أو الكيفية (كيف حدث الفعل)، أما السبب فيُعبَّر عنه هنا بـ weil أو wegen. الخطأ دلالي في اختيار الرابط، لا في ترتيب الكلمات.',
        'kategorie': 'Konnektor / Bedeutung',
    },
    'f-b2-038': {
        'falsch': '*Die Zahl der Anträge sind im letzten Jahr gestiegen.',
        'richtig': 'Die Zahl der Anträge ist im letzten Jahr gestiegen.',
        'regelAr': 'رأس الفاعل هو Zahl وهو مفرد؛ أما Anträge فجاءت في Genitiv مضافاً إليه، لذلك يطابقه الفعل المفرد ist.',
        'kategorie': 'Subjekt-Verb-Kongruenz',
    },
    'f-b2-041': {
        'falsch': '*Die Behörde erklärte, dass sie die Entscheidung morgen teilt mit.',
        'richtig': 'Die Behörde erklärte, dass sie die Entscheidung morgen mitteilt.',
        'regelAr': 'في الجملة التابعة بـ dass يبقى الفعل المنفصل متصلاً في آخر الجملة: mitteilt؛ لا تُفصل البادئة mit عن الفعل.',
        'kategorie': 'Nebensatz / trennbare Verben',
    },
    'f-b2-042': {
        'falsch': '*Nachdem er hat die Prüfung bestanden, feierte er mit seiner Familie.',
        'richtig': 'Nachdem er die Prüfung bestanden hatte, feierte er mit seiner Familie.',
        'regelAr': 'في جملة nachdem التابعة يذهب الفعل المصرف إلى النهاية؛ وعند سرد فعل أسبق من حدثٍ ماضٍ نستخدم Plusquamperfekt: bestanden hatte.',
        'kategorie': 'Nachdem-Satz / Plusquamperfekt',
    },
    'f-b2-044': {
        'falsch': '*Ich bin daran interessiert das Projekt zu leiten.',
        'richtig': 'Ich bin daran interessiert, das Projekt zu leiten.',
        'regelAr': 'عندما يشير daran إلى مجموعة المصدر الموسعة، توضع فاصلة قبلها: daran interessiert, das Projekt zu leiten. الفعل zu leiten هو المصدر مع zu.',
        'kategorie': 'Komma / Infinitivgruppe',
    },
    'f-b2-045': {
        'falsch': '*Die Ergebnisse sind besser wie im Vorjahr.',
        'richtig': 'Die Ergebnisse sind besser als im Vorjahr.',
        'regelAr': 'في المقارنة غير المتساوية يأتي als بعد صيغة المقارنة: besser als. أما wie فتستعمل للمساواة: so gut wie. «besser wie» لهجي في بعض المناطق، وليس الصيغة المعيارية للكتابة والامتحان.',
        'kategorie': 'Vergleich / als oder wie',
    },
}
fehler_by_id = {x['id']: x for x in fehler}
for fid, fields in repairs.items():
    if fid in fehler_by_id:
        fehler_by_id[fid].update(fields)
save('fehler.json', fehler)

# Two R140i mnemonics were inserted with a draft-only shape. Convert them to
# the Eselsbruecke schema, and correct the grammatical nuance in both.
esels = load('eselsbruecken.json')
esel_repairs = {
    'es-b2-16': {
        'id': 'es-b2-16', 'emoji': '⚖️', 'sektion': 'genus', 'level': 'B2',
        'titleAr': 'der Nutzen: الفائدة، وdas Nutzen: عملية الاستخدام',
        'storyAr': 'ميّز بين «الفائدة» وهي اسم مذكر: der Nutzen، وبين الفعل حين يُحوَّل إلى اسم: das Nutzen. لا تحفظ «das Nutzen» خطأً مطلقاً؛ فله معنى صحيح مختلف، وإن كانت Nutzung أكثر شيوعاً في كثير من السياقات.',
        'zeilen': [
            {'code': 'der Nutzen = الفائدة', 'de': 'Der Nutzen der Reform ist umstritten.', 'ar': 'فائدة الإصلاح محل خلاف.'},
            {'code': 'das Nutzen = فعل الاستخدام بعد تحويله إلى اسم', 'de': 'Das Nutzen sozialer Medien kann Risiken mit sich bringen.', 'ar': 'قد ينطوي استخدام وسائل التواصل الاجتماعي على مخاطر.'},
            {'code': 'nutzen = فعل', 'de': 'Wir nutzen die Zeit sinnvoll.', 'ar': 'نستثمر الوقت بشكل مفيد.'},
        ],
        'gramIds': ['b2-nominalstil', 'b2-funktionsverben'],
        'stichwort': 'der Nutzen / das Nutzen',
    },
    'es-b2-17': {
        'id': 'es-b2-17', 'emoji': '🧭', 'sektion': 'satzbau', 'level': 'B2',
        'titleAr': 'الفاصلة قبل und/or: ليست واجبة بسبب اختلاف الفاعل وحده',
        'storyAr': 'مع und وoder لا نضع فاصلة عادة بين الكلمات أو عناصر الجملة. وبين جملتين مستقلتين يجوز استعمالها للتوضيح، لكنه ليس واجباً لمجرد اختلاف الفاعلين. أمّا قبل جملة تابعة مثل weil فالفاصلة واجبة.',
        'zeilen': [
            {'code': 'عناصر متعاطفة — بلا فاصلة', 'de': 'Ich kaufe Brot und Käse.', 'ar': 'لا فاصلة بين الاسمين المرتبطين بـund.'},
            {'code': 'جملتان مستقلتان — الفاصلة للتوضيح اختيارية', 'de': 'Er fährt mit dem Bus, und seine Schwester nimmt das Fahrrad.', 'ar': 'يجوز وضع فاصلة لتوضيح حدّ الجملتين، ويجوز أيضاً حذفها.'},
            {'code': 'من دون فاصلة — صيغة صحيحة كذلك', 'de': 'Er fährt mit dem Bus und seine Schwester nimmt das Fahrrad.', 'ar': 'حذف الفاصلة في المثال السابق مقبول أيضاً.'},
            {'code': 'جملة تابعة — الفاصلة واجبة', 'de': 'Er blieb zu Hause, weil er krank war.', 'ar': 'الفاصلة واجبة قبل جملة weil التابعة.'},
        ],
        'gramIds': ['a2-neben', 'b2-textkonnektoren'],
        'warnung': 'القول إن الفاصلة تُستعمل فقط عند اختلاف الفاعلين تبسيط غير دقيق؛ بين الجملتين المستقلتين مع und/or تكون الفاصلة للتوضيح اختيارية.',
        'stichwort': 'Komma vor und/oder',
    },
}
esel_by_id = {item['id']: item for item in esels}
for eid, fields in esel_repairs.items():
    if eid in esel_by_id:
        esel_by_id[eid].update(fields)
save('eselsbruecken.json', esels)

# Restore examples/rules for strategy topics and the A0 sentence lesson. These
# fields are consumed directly by GrammarTask, not just by static type checks.
grammar = load('grammar.json')
# Repair stale prerequisites and a B2 participle cycle so every grammar topic is reachable.
grammar['a1-futur-einf']['voraus'] = ['a1-praesens', 'a2-perfekt']
grammar['b1-partizip1']['voraus'] = ['b1-adjektivendungen']
grammar['a0-satzbau']['examples'] = [
    {'de': 'Ich heiße Sara.', 'ar': 'اسمي سارة — الفعل في الموقع الثاني بعد الفاعل.'},
    {'de': 'Heute wohne ich in Tunis.', 'ar': 'أسكن اليوم في تونس — بعد Heute يأتي الفعل ثم الفاعل.'},
    {'de': 'Am Morgen trinke ich Tee.', 'ar': 'أشرب الشاي صباحاً — ظرف الزمان في البداية ولا يغيّر موقع الفعل الثاني.'},
]
grammar['a1-aussprache-sp-st']['examples'] = [
    {'de': 'spielen · sprechen · Straße · Schule', 'ar': 'في بداية المقطع: sp تُنطق shp، وst تُنطق sht، وsch تُنطق ش.'},
    {'de': 'Wespe · Fenster · ist', 'ar': 'في وسط الكلمة أو نهايتها لا تتحول sp/st تلقائياً إلى shp/sht.'},
]
strategy_rules = {
    'a2-pruefungsstrategie': [
        {'de': 'Lies zuerst die Aufgabenstellung und markiere dann gezielt passende Schlüsselwörter.', 'ar': 'اقرأ المطلوب أولاً ثم ابحث في النص عن الكلمات المفتاحية المناسبة.'},
        {'de': 'Beantworte beim Schreiben jeden vorgegebenen Punkt.', 'ar': 'أجب في الكتابة عن كل نقطة مطلوبة.'},
        {'de': 'Wenn ein Wort im Hörtext unbekannt ist, höre auf den Sinn des ganzen Satzes.', 'ar': 'إذا جهلت كلمة في المسموع، فركّز على معنى الجملة كلها.'},
    ],
    'b1-pruefungsstrategie': [
        {'de': 'Gliedere einen Beitrag in Einleitung, Argumente und Schluss.', 'ar': 'قسّم المشاركة إلى مقدمة وحجج وخاتمة.'},
        {'de': 'Begründe deine Meinung und verbinde die Argumente nachvollziehbar.', 'ar': 'علّل رأيك واربط حججك بوضوح.'},
        {'de': 'Reagiere im Gespräch auf den Beitrag des Partners.', 'ar': 'تفاعل في الحوار مع كلام الشريك.'},
    ],
    'b2-pruefungsstrategie': [
        {'de': 'Unterscheide im Kommentar klar zwischen These, Begründung und Beispiel.', 'ar': 'ميّز بوضوح في التعليق بين الأطروحة والتعليل والمثال.'},
        {'de': 'Wäge Gegenpositionen ab, bevor du dein Fazit formulierst.', 'ar': 'وازن الرأي المقابل قبل صياغة خلاصة موقفك.'},
        {'de': 'Nutze die Vorbereitungszeit, um eine kurze Gliederung zu notieren.', 'ar': 'استعمل وقت التحضير لكتابة مخطط قصير.'},
    ],
}
strategy_examples = {
    'a1-pruefungsstrategie': [
        {'de': '«Wann fährt der Zug?» — Ich suche im Text eine Uhrzeit.', 'ar': '«متى ينطلق القطار؟» — أبحث في النص عن وقت.'},
        {'de': 'Eine kurze Nachricht hat eine Anrede, die nötigen Informationen und einen Gruß.', 'ar': 'تتضمن الرسالة القصيرة تحية ومعلومات مطلوبة وختاماً.'},
    ],
    'a2-pruefungsstrategie': [
        {'de': 'Frage: «Wie viel kostet das Zimmer?» — Schlüsselwort: Preis.', 'ar': 'السؤال: «كم تكلف الغرفة؟» — الكلمة المفتاحية: السعر.'},
        {'de': 'Ich antworte auf alle drei Punkte in der E-Mail.', 'ar': 'أجيب عن النقاط الثلاث كلها في البريد الإلكتروني.'},
    ],
    'b1-pruefungsstrategie': [
        {'de': 'Meiner Meinung nach ist der Vorschlag sinnvoll, weil er Zeit spart.', 'ar': 'في رأيي الاقتراح مفيد لأنه يوفر الوقت.'},
        {'de': 'Einerseits ist die Lösung günstig, andererseits kostet sie viel Zeit.', 'ar': 'من جهة الحل غير مكلف، ومن جهة أخرى يستغرق وقتاً طويلاً.'},
    ],
    'b2-pruefungsstrategie': [
        {'de': 'Die Maßnahme ist zwar kostspielig, könnte langfristig jedoch Vorteile bringen.', 'ar': 'الإجراء مكلف، لكنه قد يحقق فوائد على المدى الطويل.'},
        {'de': 'Ein Beispiel verdeutlicht, warum diese Position überzeugend ist.', 'ar': 'يوضح المثال سبب قوة هذا الموقف.'},
    ],
}
for topic_id, examples_list in strategy_examples.items():
    grammar[topic_id]['examples'] = examples_list
for topic_id, rules_list in strategy_rules.items():
    grammar[topic_id]['rules'] = rules_list
extra_examples = {
    'a0-aussprache-vowels': {'de': 'Bett — Beet', 'ar': 'سرير — حوض زهور (e قصيرة في Bett وطويلة في Beet).'},
    'a0-aussprache-umlaut': {'de': 'der Hut — die Hüte · schon — schön', 'ar': 'قبعة — قبعات · بالفعل/جميل (أمثلة على u/ü وo/ö).'},
    'a1-aussprache-ch': {'de': 'ich · Milch · machen · Buch', 'ar': 'صوت ch ناعم بعد i، وخشن بعد a أو u.'},
    'a1-aussprache-r': {'de': 'Rita reist am Freitag nach Rom.', 'ar': 'راء بداية الكلمات Rita وreist وRom تُنطق احتكاكياً.'},
    'a1-aussprache-auslaut': {'de': 'lieb — Liebe · Kind — Kinder · Tag — Tage', 'ar': 'عند إضافة حركة تظهر العلاقة بين b/p وd/t وg/k.'},
    'b2-konzessiv': {'de': 'Wenngleich die Kosten gestiegen sind, wurde das Projekt fortgesetzt.', 'ar': 'على الرغم من ارتفاع التكاليف، استمر المشروع.'},
    'b2-relativ-genitiv': {'de': 'Die Firma, deren Produkte im Ausland verkauft werden, wächst.', 'ar': 'الشركة التي تُباع منتجاتها في الخارج تنمو.'},
}
for topic_id, example in extra_examples.items():
    current = grammar[topic_id].get('examples') or []
    if example not in current:
        grammar[topic_id]['examples'] = current + [example]

production_exercises = {
    'a0-artikel': {'id': 'a0-artikel-r141e-prod', 'type': 'fill', 'promptDe': '___ Frau kommt aus Tunis.', 'promptAr': 'أكمل بأداة التعريف المناسبة: المرأة من تونس.', 'answer': 'Die', 'explanationAr': 'Frau مؤنث، لذلك نقول die Frau.'},
    'a0-du-sie': {'id': 'a0-du-sie-r141e-prod', 'type': 'fill', 'promptDe': 'Guten Tag, Frau Meier. Wie geht es ___?', 'promptAr': 'أكمل بصيغة المخاطبة الرسمية.', 'answer': 'Ihnen', 'explanationAr': 'مع المخاطبة الرسمية نقول: Wie geht es Ihnen? وIhnen تُكتب بحرف كبير.'},
    'a0-aussprache-vowels': {'id': 'a0-aussprache-vowels-r141e-prod', 'type': 'fill', 'promptDe': 'Welches Wort hat ein langes a: Stadt oder ___?', 'promptAr': 'أي الكلمتين فيها a طويلة: Stadt أم ___؟', 'answer': 'Staat', 'explanationAr': 'Staat تُكتب بـaa وتُنطق بحركة طويلة؛ Stadt فيها a قصيرة.'},
    'a0-aussprache-umlaut': {'id': 'a0-aussprache-umlaut-r141e-prod', 'type': 'fill', 'promptDe': 'Der Hut — zwei ___.', 'promptAr': 'اكتب جمع Hut مع الأوملاوت.', 'answer': 'Hüte', 'explanationAr': 'يتحوّل u إلى ü في الجمع: der Hut, die Hüte.'},
    'a1-aussprache-ch': {'id': 'a1-aussprache-ch-r141e-prod', 'type': 'fill', 'promptDe': 'Ich trinke eine Tasse ___. (ch nach i)', 'promptAr': 'أكمل بكلمة فيها ch الناعمة بعد i.', 'answer': 'Milch', 'explanationAr': 'في Milch يأتي ch بعد i، فيُنطق ich-Laut الناعم.'},
    'a1-aussprache-r': {'id': 'a1-aussprache-r-r141e-prod', 'type': 'fill', 'promptDe': 'Das unbetonte -er am Wortende in «Vater» klingt ungefähr wie ein schwaches ___.', 'promptAr': 'بماذا يشبه تقريباً صوت -er غير المشدد في آخر Vater؟', 'answer': 'a', 'explanationAr': 'في نهاية كلمات مثل Vater تُختزل -er غالباً إلى صوت a خفيف [ɐ].'},
    'a1-aussprache-sp-st': {'id': 'a1-aussprache-sp-st-r141e-prod', 'type': 'fill', 'promptDe': 'Er geht über die ___raße. (st am Wortanfang)', 'promptAr': 'أكمل الكلمة التي يبدأ فيها st بصوت sht.', 'answer': 'St', 'explanationAr': 'الكلمة Straße تبدأ بـst، وتُنطق في أول الكلمة /ʃt/.'},
    'a1-aussprache-auslaut': {'id': 'a1-aussprache-auslaut-r141e-prod', 'type': 'fill', 'promptDe': 'Am Ende klingt das g in «Tag» wie ___.', 'promptAr': 'كيف يُنطق g في نهاية Tag؟', 'answer': 'k', 'explanationAr': 'تُهمس g في نهاية الكلمة وتُنطق كـk: Tag [taːk].'},
    'a0-satzbau': {'id': 'a0-satzbau-r141e-prod', 'type': 'fill', 'promptDe': 'Heute ___ ich Tee.', 'promptAr': 'أكمل بالفعل trinken في الجملة.', 'answer': 'trinke', 'explanationAr': 'بعد الظرف Heute يأتي الفعل المصرف مباشرة في الموقع الثاني: Heute trinke ich Tee.'},
    'b2-genitiv-praep': {'id': 'b2-genitiv-praep-r141e-prod', 'type': 'fill', 'promptDe': 'Wegen ___ Regens bleiben wir zu Hause.', 'promptAr': 'أكمل بأداة Genitiv المناسبة قبل Regens.', 'answer': 'des', 'explanationAr': 'wegen يأخذ Genitiv؛ الاسم المذكر المفرد: wegen des Regens.'},
    'b2-konzessiv': {'id': 'b2-konzessiv-r141e-prod', 'type': 'fill', 'promptDe': 'Obwohl es regnet, ___ wir spazieren.', 'promptAr': 'أكمل الفعل في الجملة الرئيسية بعد obwohl.', 'answer': 'gehen', 'explanationAr': 'بعد الجملة التابعة التي بدأت بـobwohl تأتي الجملة الرئيسية مع الفعل في الموقع الثاني: gehen wir.'},
    'b2-relativ-genitiv': {'id': 'b2-relativ-genitiv-r141e-prod', 'type': 'fill', 'promptDe': 'Der Mann, ___ Auto vor der Tür steht, wartet.', 'promptAr': 'أكمل بضمير الوصل في Genitiv للمذكر.', 'answer': 'dessen', 'explanationAr': 'dessen يعود إلى الاسم المذكر Mann ويعبّر عن الملكية.'},
    'a1-pruefungsstrategie': {'id': 'a1-pruefungsstrategie-r141e-prod', 'type': 'fill', 'promptDe': 'Eine kurze Nachricht braucht Anrede, Informationen und einen ___.', 'promptAr': 'أكمل: تحتاج الرسالة القصيرة إلى تحية ومعلومات و…', 'answer': 'Gruß', 'explanationAr': 'اختم الرسالة بتحية وداع مناسبة مثل Viele Grüße.'},
    'a2-pruefungsstrategie': {'id': 'a2-pruefungsstrategie-r141e-prod', 'type': 'fill', 'promptDe': 'Lies zuerst die Aufgabe und achte auf wichtige ___.', 'promptAr': 'ما الذي تبحث عنه في النص بعد قراءة السؤال؟', 'answer': 'Schlüsselwörter', 'explanationAr': 'الكلمات المفتاحية تساعدك على العثور على المعلومة المطلوبة.'},
    'b1-pruefungsstrategie': {'id': 'b1-pruefungsstrategie-r141e-prod', 'type': 'fill', 'promptDe': 'Ein Kommentar hat eine Einleitung, Argumente und einen ___.', 'promptAr': 'أكمل بنية التعليق: مقدمة وحجج و…', 'answer': 'Schluss', 'explanationAr': 'اختم التعليق بخلاصة أو موقف نهائي واضح.'},
    'b2-pruefungsstrategie': {'id': 'b2-pruefungsstrategie-r141e-prod', 'type': 'fill', 'promptDe': 'Ein überzeugendes Argument besteht aus These, Begründung und ___.', 'promptAr': 'أكمل مكوّنات الحجة المقنعة: أطروحة وتعليل و…', 'answer': 'Beispiel', 'explanationAr': 'المثال يوضح التعليل ويدعم الأطروحة.'},
}
production_exercises_2 = {
    'a0-artikel': {'id': 'a0-artikel-r141e-prod2', 'type': 'fill', 'promptDe': 'Singular: das Kind. Plural: die ___ sind hier.', 'promptAr': 'اكتب جمع Kind.', 'answer': 'Kinder', 'explanationAr': 'جمع das Kind هو die Kinder.'},
    'a0-du-sie': {'id': 'a0-du-sie-r141e-prod2', 'type': 'fill', 'promptDe': 'Hallo Ali! Wie geht es ___?', 'promptAr': 'أكمل بصيغة المخاطبة غير الرسمية.', 'answer': 'dir', 'explanationAr': 'مع الصديق نستخدم Dativ: Wie geht es dir? أما الرسمي فهو Ihnen.'},
    'a0-aussprache-vowels': {'id': 'a0-aussprache-vowels-r141e-prod2', 'type': 'fill', 'promptDe': 'Welches Wort hat ein langes e: Bett oder ___?', 'promptAr': 'أي الكلمتين فيها e طويلة: Bett أم ___؟', 'answer': 'Beet', 'explanationAr': 'في Beet تُنطق ee طويلة، وفي Bett الحركة قصيرة.'},
    'a0-aussprache-umlaut': {'id': 'a0-aussprache-umlaut-r141e-prod2', 'type': 'fill', 'promptDe': 'Der Sohn — die ___.', 'promptAr': 'اكتب جمع Sohn مع الأوملاوت.', 'answer': 'Söhne', 'explanationAr': 'في الجمع تتحول o إلى ö: der Sohn, die Söhne.'},
    'a1-aussprache-ch': {'id': 'a1-aussprache-ch-r141e-prod2', 'type': 'fill', 'promptDe': 'Der ___ ist neu. (ch nach u)', 'promptAr': 'أكمل باسم فيه ch الخشنة بعد u.', 'answer': 'Buch', 'explanationAr': 'في Buch يأتي ch بعد u، فيُنطق ach-Laut الخشن.'},
    'a1-aussprache-r': {'id': 'a1-aussprache-r-r141e-prod2', 'type': 'fill', 'promptDe': 'Welches Wort beginnt mit deutschem r: Regen oder sehen? ___', 'promptAr': 'اكتب الكلمة التي تبدأ بصوت r الألماني: Regen أم sehen؟', 'answer': 'Regen', 'explanationAr': 'Regen تبدأ بحرف r، أما sehen فتبدأ بصوت z/ز.'},
    'a1-aussprache-sp-st': {'id': 'a1-aussprache-sp-st-r141e-prod2', 'type': 'fill', 'promptDe': 'Wir ___ Deutsch. (sp am Wortanfang)', 'promptAr': 'أكمل بالفعل sprechen؛ في بدايته sp تُنطق shp.', 'answer': 'sprechen', 'explanationAr': 'في بداية sprechen تُنطق sp بصوت shp.'},
    'a1-aussprache-auslaut': {'id': 'a1-aussprache-auslaut-r141e-prod2', 'type': 'fill', 'promptDe': 'Am Ende klingt das d in «Kind» wie ___.', 'promptAr': 'كيف يُنطق d في نهاية Kind؟', 'answer': 't', 'explanationAr': 'في نهاية Kind تُهمس d وتُنطق مثل t.'},
    'a0-satzbau': {'id': 'a0-satzbau-r141e-prod2', 'type': 'fill', 'promptDe': 'Am Morgen ___ ich Musik.', 'promptAr': 'أكمل بالفعل hören في المضارع.', 'answer': 'höre', 'explanationAr': 'بعد Am Morgen يأتي الفعل المصرف في الموقع الثاني: Am Morgen höre ich Musik.'},
    'b2-genitiv-praep': {'id': 'b2-genitiv-praep-r141e-prod2', 'type': 'fill', 'promptDe': 'Während ___ Sitzung blieb das Telefon aus.', 'promptAr': 'أكمل أداة Genitiv قبل Sitzung.', 'answer': 'der', 'explanationAr': 'während يأخذ Genitiv؛ Sitzung مؤنث، لذلك während der Sitzung.'},
    'b2-konzessiv': {'id': 'b2-konzessiv-r141e-prod2', 'type': 'fill', 'promptDe': 'Es regnet, ___ gehen wir spazieren.', 'promptAr': 'أكمل بالرابط المستقل trotzdem.', 'answer': 'trotzdem', 'explanationAr': 'trotzdem يبدأ جملة رئيسية؛ يأتي الفعل المصرف بعدها في الموقع الثاني.'},
    'b2-relativ-genitiv': {'id': 'b2-relativ-genitiv-r141e-prod2', 'type': 'fill', 'promptDe': 'Die Frau, ___ Tochter Ärztin ist, wohnt hier.', 'promptAr': 'أكمل بضمير الوصل في Genitiv للمؤنث.', 'answer': 'deren', 'explanationAr': 'deren يعود إلى الاسم المؤنث Frau ويعبّر عن الملكية.'},
    'a1-pruefungsstrategie': {'id': 'a1-pruefungsstrategie-r141e-prod2', 'type': 'fill', 'promptDe': 'Zum Schluss schreibe ich: «Viele ___.»', 'promptAr': 'أكمل صيغة الختام في رسالة شخصية: Viele …', 'answer': 'Grüße', 'explanationAr': 'من صيغ الختام الشخصية: Viele Grüße.'},
    'a2-pruefungsstrategie': {'id': 'a2-pruefungsstrategie-r141e-prod2', 'type': 'fill', 'promptDe': 'Bei einem unbekannten Wort achte ich auf den Sinn des ganzen ___.', 'promptAr': 'أكمل استراتيجية الاستماع: أركز على معنى … كله.', 'answer': 'Satzes', 'explanationAr': 'السياق ومعنى الجملة كلها يساعدان على فهم الكلمة.'},
    'b1-pruefungsstrategie': {'id': 'b1-pruefungsstrategie-r141e-prod2', 'type': 'fill', 'promptDe': 'Im Gespräch sollte ich auf den Beitrag meines Partners ___.', 'promptAr': 'أكمل استراتيجية النقاش: ينبغي أن … على مساهمة الشريك.', 'answer': 'reagieren', 'explanationAr': 'يجب أن تتفاعل مع ما يقوله الشريك.'},
    'b2-pruefungsstrategie': {'id': 'b2-pruefungsstrategie-r141e-prod2', 'type': 'fill', 'promptDe': 'Vor dem Schreiben notiere ich eine kurze ___.', 'promptAr': 'أكمل استراتيجية الكتابة: أدوّن مخططاً قصيراً قبل الكتابة.', 'answer': 'Gliederung', 'explanationAr': 'مخطط قصير يساعد على تنظيم الحجة والنص.'},
}
for topic_id, exercise in production_exercises.items():
    topic = grammar[topic_id]
    if not any(item.get('id') == exercise['id'] for item in topic['exercises']):
        topic['exercises'].append(exercise)
for topic_id, exercise in production_exercises_2.items():
    topic = grammar[topic_id]
    if not any(item.get('id') == exercise['id'] for item in topic['exercises']):
        topic['exercises'].append(exercise)
for topic_id, topic in grammar.items():
    for index, exercise in enumerate(topic.get('exercises', []), start=1):
        exercise.setdefault('id', f'{topic_id}-r141e-e{index:02d}')
normalize_mc_answers(grammar)
save('grammar.json', grammar)

# ---------------------------------------------------------------------------
# 4) Complete every newly-added vocab card to VocabCard shape. Give each card
#    a stable ID, level, and a contextual bilingual example.
vocab = load('vocab.json')
# Remove accidental duplicate headwords from the R140 expansion while keeping
# the promised 45-card size.
media = vocab['b2-medien-schule']['cards']
media[30]['de'] = 'der Leitartikel, -'
media[30]['ar'] = 'المقال الافتتاحي'
media[32]['de'] = 'die Quellenangabe, -n'
media[32]['ar'] = 'الإحالة إلى المصدر / بيانات المصدر'
media[35]['de'] = 'die Titelseite, -n'
media[35]['ar'] = 'الصفحة الأولى للصحيفة'
media[36]['de'] = 'das Boulevardblatt, die Boulevardblätter'
media[37]['ar'] = 'الكفاءة الإعلامية / مهارات فهم الإعلام وتقييمه'
politics = vocab['b2-politik-demokratie']['cards']
politics[2]['de'] = 'der Wähler / die Wählerin; Plural: die Wähler / die Wählerinnen'
politics[8]['de'] = 'der Bundeskanzler / die Bundeskanzlerin'
politics[9]['de'] = 'der Bundespräsident / die Bundespräsidentin; Plural: die Bundespräsidenten / die Bundespräsidentinnen'
politics[21]['de'] = 'der Abgeordnete / die Abgeordnete; Plural: die Abgeordneten'
politics[24]['de'] = 'der Sozialstaat, die Sozialstaaten'

# Use complete, transparent plural forms in the A0 classroom deck.
classroom = vocab['a0-klassenzimmer']['cards']
classroom[0]['de'] = 'der Stuhl, die Stühle'
classroom[1]['de'] = 'der Tisch, die Tische'
classroom[2]['de'] = 'die Tafel, die Tafeln'
classroom[3]['de'] = 'die Kreide'
classroom[4]['de'] = 'der Kugelschreiber, die Kugelschreiber'
classroom[5]['de'] = 'das Heft, die Hefte'
classroom[6]['de'] = 'das Buch, die Bücher'
classroom[7]['de'] = 'der Lehrer / die Lehrerin'
classroom[8]['de'] = 'der Schüler / die Schülerin'
classroom[9]['de'] = 'die Tür, die Türen'
classroom[10]['de'] = 'das Fenster'
classroom[11]['de'] = 'die Lampe, die Lampen'
classroom[12]['de'] = 'die Tasche, die Taschen'
classroom[13]['de'] = 'der Bleistift, die Bleistifte'
classroom[14]['de'] = 'das Papier'

examples = {
'a0-zahlen': [
 ('Die Zahl null steht auf dem Display.', 'يظهر العدد صفر على الشاشة.'),
 ('Eins plus zwei ist drei.', 'واحد زائد اثنين يساوي ثلاثة.'),
 ('Ich habe zwei Hefte.', 'لديّ دفتران.'),
 ('Wir sind drei Freunde.', 'نحن ثلاثة أصدقاء.'),
 ('Das kostet vier Euro.', 'هذا يكلف أربعة يورو.'),
 ('Der Bus kommt um fünf Uhr.', 'تأتي الحافلة الساعة الخامسة.'),
 ('Die Klasse beginnt um sechs Uhr.', 'يبدأ الصف الساعة السادسة.'),
 ('Der Zug fährt um sieben Uhr ab.', 'ينطلق القطار الساعة السابعة.'),
 ('Acht Personen warten vor der Tür.', 'ينتظر ثمانية أشخاص أمام الباب.'),
 ('Es ist neun Uhr.', 'الساعة التاسعة.'),
 ('Die Kinder sind zehn Jahre alt.', 'أعمار الأطفال عشر سنوات.'),
 ('Der Deutschkurs beginnt um elf Uhr.', 'تبدأ دورة الألمانية الساعة الحادية عشرة.'),
 ('Es ist zwölf Uhr.', 'الساعة الثانية عشرة.'),
 ('Der Zug fährt um dreizehn Uhr ab.', 'ينطلق القطار الساعة الثالثة عشرة.'),
 ('Das Wörterbuch kostet zwanzig Euro.', 'يكلف القاموس عشرين يورو.'),
 ('Sie ist dreißig Jahre alt.', 'عمرها ثلاثون سنة.'),
 ('Ein Euro hat hundert Cent.', 'اليورو الواحد فيه مئة سنت.'),
 ('Das Wörterbuch kostet einhundert Euro.', 'يكلف القاموس مئة يورو.'),
],
'a0-farben': [
 ('Die Tomate ist rot.', 'الطماطم حمراء.'),
 ('Das Meer ist blau.', 'البحر أزرق.'),
 ('Das Gras ist grün.', 'العشب أخضر.'),
 ('Die Sonne ist gelb.', 'الشمس صفراء.'),
 ('Die Nacht ist schwarz.', 'الليل أسود.'),
 ('Der Schnee ist weiß.', 'الثلج أبيض.'),
 ('Die Orange ist orange.', 'البرتقالة برتقالية.'),
 ('Die Blume ist lila.', 'الزهرة بنفسجية.'),
 ('Der Tisch ist braun.', 'الطاولة بنية.'),
 ('Der Himmel ist grau.', 'السماء رمادية.'),
 ('Das Kleid ist rosa.', 'الفستان وردي.'),
 ('Das Meer ist dunkelblau.', 'البحر أزرق داكن.'),
 ('Das T-Shirt ist hellgrün.', 'القميص أخضر فاتح.'),
],
'a0-obst-gemuese': [
 ('Der Apfel ist rot.', 'التفاحة حمراء.'),
 ('Die Banane ist gelb.', 'الموزة صفراء.'),
 ('Die Orange ist süß.', 'البرتقالة حلوة.'),
 ('Die Tomate ist reif.', 'الطماطم ناضجة.'),
 ('Die Kartoffel ist heiß.', 'البطاطا ساخنة.'),
 ('Der Salat ist frisch.', 'السلطة طازجة.'),
 ('Die Möhre ist orange.', 'الجزرة برتقالية.'),
 ('Ich schneide eine Zwiebel.', 'أقطع بصلة.'),
 ('Der Apfelsinensaft ist kalt.', 'عصير البرتقال بارد.'),
 ('Die Gurke ist grün.', 'الخيار أخضر.'),
 ('Die Erdbeere ist süß.', 'الفراولة حلوة.'),
 ('Ich esse gern Apfelstrudel.', 'أحب أكل فطيرة التفاح.'),
 ('Die Zitrone ist sauer.', 'الليمونة حامضة.'),
 ('Ich esse jeden Tag Obst.', 'آكل الفاكهة كل يوم.'),
 ('Wir essen Gemüse zum Mittagessen.', 'نأكل الخضار في الغداء.'),
 ('Ich koche Reis.', 'أطبخ الأرز.'),
 ('Das Brot ist frisch.', 'الخبز طازج.'),
],
'a0-klassenzimmer': [
 ('Der Stuhl ist blau.', 'الكرسي أزرق.'),
 ('Der Tisch ist groß.', 'الطاولة كبيرة.'),
 ('Die Tafel ist grün.', 'السبورة خضراء.'),
 ('Die Kreide ist weiß.', 'الطبشور أبيض.'),
 ('Der Kugelschreiber ist blau.', 'قلم الحبر أزرق.'),
 ('Mein Heft ist neu.', 'دفتري جديد.'),
 ('Das Buch ist interessant.', 'الكتاب ممتع.'),
 ('Die Lehrerin kommt heute.', 'تأتي المعلمة اليوم.'),
 ('Der Schüler lernt Deutsch.', 'يتعلم التلميذ الألمانية.'),
 ('Die Tür ist offen.', 'الباب مفتوح.'),
 ('Das Fenster ist groß.', 'النافذة كبيرة.'),
 ('Die Lampe ist hell.', 'المصباح مضيء.'),
 ('Meine Tasche ist schwarz.', 'حقيبتي سوداء.'),
 ('Der Bleistift ist kurz.', 'قلم الرصاص قصير.'),
 ('Das Papier ist weiß.', 'الورق أبيض.'),
 ('Bitte öffnen Sie das Buch.', 'افتح الكتاب من فضلك.'),
 ('Bitte schließen Sie die Tür.', 'أغلق الباب من فضلك.'),
 ('Ich schreibe meinen Namen.', 'أكتب اسمي.'),
 ('Ich lese ein Buch.', 'أقرأ كتاباً.'),
 ('Ich höre den Lehrer.', 'أسمع المعلم.'),
],
'b2-medien-schule': [
 ('Der Leitartikel der Zeitung kommentiert die neue Bildungsreform.', 'يعلّق المقال الافتتاحي في الصحيفة على إصلاح التعليم الجديد.'),
 ('Eine ausgewogene Berichterstattung stellt unterschiedliche Positionen dar.', 'تعرض التغطية الإخبارية المتوازنة مواقف مختلفة.'),
 ('Jede Grafik braucht eine genaue Quellenangabe.', 'يحتاج كل رسم بياني إلى إحالة دقيقة إلى المصدر.'),
 ('Die Nachrichtensendung berichtet heute über die Wahl.', 'تقدم نشرة الأخبار اليوم تقريراً عن الانتخابات.'),
 ('In der Talkshow diskutieren Fachleute über die Reform.', 'يناقش الخبراء الإصلاح في البرنامج الحواري.'),
 ('Auf der Titelseite steht heute ein wichtiges Thema.', 'يتصدر موضوع مهم الصفحة الأولى اليوم.'),
 ('Das Boulevardblatt veröffentlichte eine zugespitzte Schlagzeile.', 'نشرت الصحيفة الشعبية عنواناً مثيراً ومبالغاً فيه.'),
 ('Medienkompetenz hilft, verlässliche von falschen Informationen zu unterscheiden.', 'تساعد الكفاءة الإعلامية على التمييز بين المعلومات الموثوقة والخاطئة.'),
 ('Mit einem Schulabschluss kann man sich um eine Ausbildung bewerben.', 'يمكن التقدم لتدريب مهني بعد الحصول على شهادة إنهاء المدرسة.'),
 ('Nach dem Abitur kann sie an einer Universität studieren.', 'يمكنها الدراسة في جامعة بعد شهادة الثانوية المؤهلة للجامعة.'),
 ('Vor der Klassenarbeit wiederholt die Klasse den Stoff.', 'تراجع الصف المادة قبل الامتحان.'),
 ('Sie bekam eine gute Note in Deutsch.', 'حصلت على علامة جيدة في الألمانية.'),
 ('Im Zeugnis stehen die Noten des Schuljahres.', 'تظهر درجات العام الدراسي في كشف العلامات.'),
 ('Der Lehrplan legt die Lernziele für das Schuljahr fest.', 'يحدد المنهاج الدراسي أهداف التعلم للعام.'),
 ('Das Schulsystem unterscheidet sich von Bundesland zu Bundesland.', 'يختلف النظام المدرسي من ولاية اتحادية إلى أخرى.'),
],
'b2-politik-demokratie': [
 ('In einer Demokratie können Bürgerinnen und Bürger ihre Vertreter wählen.', 'في الديمقراطية يستطيع المواطنون انتخاب ممثليهم.'),
 ('Die nächste Wahl findet im Herbst statt.', 'تُجرى الانتخابات القادمة في الخريف.'),
 ('Jede Wählerin und jeder Wähler gibt eine Stimme ab.', 'تدلي كل ناخبة وكل ناخب بصوت.'),
 ('Die Partei stellte ihr Programm vor.', 'عرض الحزب برنامجه.'),
 ('Die Regierung legt dem Bundestag einen Gesetzentwurf vor.', 'تقدم الحكومة مشروع قانون إلى البوندستاغ.'),
 ('Der Bundestag berät über den Gesetzentwurf.', 'يناقش البوندستاغ مشروع القانون.'),
 ('Der Bundesrat vertritt die Länder auf Bundesebene.', 'يمثل البوندسرات الولايات على المستوى الاتحادي.'),
 ('Das Grundgesetz schützt die Grundrechte.', 'يحمي القانون الأساسي الحقوق الأساسية.'),
 ('Die Bundeskanzlerin leitet die Bundesregierung.', 'تقود المستشارة الاتحادية الحكومة الاتحادية.'),
 ('Der Bundespräsident repräsentiert Deutschland nach außen.', 'يمثل الرئيس الاتحادي ألمانيا في الخارج.'),
 ('Nach der Wahl bildeten zwei Parteien eine Koalition.', 'بعد الانتخابات شكّل حزبان ائتلافاً.'),
 ('Die Opposition kontrolliert die Arbeit der Regierung.', 'تراقب المعارضة عمل الحكومة.'),
 ('Das Wahlrecht ermöglicht die Teilnahme an einer Wahl.', 'يتيح حق الانتخاب المشاركة في الانتخابات.'),
 ('Die Meinungsfreiheit schützt auch unbequeme Ansichten.', 'تحمي حرية الرأي حتى الآراء غير المريحة.'),
 ('Die Pressefreiheit schützt unabhängige Berichterstattung.', 'تحمي حرية الصحافة التغطية الإخبارية المستقلة.'),
 ('Das Gesetz tritt im Januar in Kraft.', 'يدخل القانون حيز التنفيذ في يناير.'),
 ('Der Beschluss wurde mit großer Mehrheit angenommen.', 'اعتُمد القرار بأغلبية كبيرة.'),
 ('Vor der Abstimmung begründeten die Abgeordneten ihre Position.', 'برر النواب موقفهم قبل التصويت.'),
 ('Die Mehrheit stimmte für den Vorschlag.', 'صوّتت الأغلبية لصالح الاقتراح.'),
 ('Eine Minderheit der Abgeordneten lehnte den Vorschlag ab.', 'رفضت أقلية من النواب الاقتراح.'),
 ('Jedes Mitglied darf an der Sitzung teilnehmen.', 'يحق لكل عضو المشاركة في الجلسة.'),
 ('Die Abgeordnete stellte eine Frage an den Minister.', 'طرحت النائبة سؤالاً على الوزير.'),
 ('Die Verfassung legt die Grundordnung eines Staates fest.', 'يحدد الدستور النظام الأساسي للدولة.'),
 ('Die Sozialversicherung umfasst unter anderem die Kranken- und Rentenversicherung.', 'يشمل التأمين الاجتماعي، من بين أمور أخرى، التأمين الصحي وتأمين التقاعد.'),
 ('Der Sozialstaat unterstützt Menschen in schwierigen Lebenslagen.', 'تدعم دولة الرعاية الأشخاص في ظروف معيشية صعبة.'),
 ('Die Globalisierung verbindet Märkte und Arbeitsplätze weltweit.', 'تربط العولمة الأسواق وفرص العمل في أنحاء العالم.'),
 ('Die Europäische Union ermöglicht gemeinsame Entscheidungen in vielen Politikfeldern.', 'يتيح الاتحاد الأوروبي اتخاذ قرارات مشتركة في مجالات سياسية كثيرة.'),
 ('Nachhaltigkeit berücksichtigt ökologische, soziale und wirtschaftliche Folgen.', 'تراعي الاستدامة الآثار البيئية والاجتماعية والاقتصادية.'),
 ('Der Protest richtete sich gegen die geplante Gebühr.', 'وُجّه الاحتجاج ضد الرسوم المخطط لها.'),
 ('Viele Menschen nahmen an der Demonstration teil.', 'شارك كثير من الناس في المظاهرة.'),
 ('Viele Menschen erhalten nach dem Berufsleben eine Rente.', 'يتلقى كثير من الناس معاشاً بعد الحياة المهنية.'),
 ('Das Steuersystem finanziert öffentliche Aufgaben.', 'يموّل النظام الضريبي المهام العامة.'),
 ('Hohe Inflation verringert die Kaufkraft des Geldes.', 'يقلل التضخم المرتفع القدرة الشرائية للنقود.'),
 ('Die Arbeitslosigkeit stieg im Winter leicht.', 'ارتفعت البطالة قليلاً في الشتاء.'),
 ('Der Mindestlohn legt eine gesetzliche Lohnuntergrenze fest.', 'يحدد الحد الأدنى للأجور أدنى أجر قانوني.'),
],
}

for deck_id in ['a0-zahlen', 'a0-farben', 'a0-obst-gemuese', 'a0-klassenzimmer', 'b2-politik-demokratie']:
    deck = vocab[deck_id]
    if 'titelDe' in deck:
        deck['titleDe'] = deck.pop('titelDe')
    if 'titelAr' in deck:
        deck['titleAr'] = deck.pop('titelAr')

for deck_id, pairs in examples.items():
    deck = vocab[deck_id]
    start_index = 30 if deck_id == 'b2-medien-schule' else 0
    cards_to_complete = deck['cards'][start_index:]
    assert len(pairs) == len(cards_to_complete), (deck_id, len(pairs), len(cards_to_complete))
    for offset, (card, (example_de, example_ar)) in enumerate(zip(cards_to_complete, pairs)):
        index = start_index + offset
        card.setdefault('id', f'{deck_id}-{index + 1:03d}')
        card['level'] = deck['level']
        card['exampleDe'] = example_de
        card['exampleAr'] = example_ar
        card.setdefault('tags', [deck_id])
save('vocab.json', vocab)

# ---------------------------------------------------------------------------
# 5) cando.json is already correctly map-shaped; expand A0 outcomes to reflect
#    the new beginner food, colour, classroom and interaction content.
cando = load('cando.json')
new_cando = [
    {'id': 'a0-8', 'de': 'Ich kann Farben und einfache Dinge aus dem Klassenzimmer benennen.', 'ar': 'أستطيع تسمية الألوان والأشياء البسيطة في غرفة الصف.'},
    {'id': 'a0-9', 'de': 'Ich kann im Café ein einfaches Getränk oder Gericht bestellen.', 'ar': 'أستطيع طلب مشروب أو وجبة بسيطة في المقهى.'},
    {'id': 'a0-10', 'de': 'Ich kann um Wiederholung oder langsameres Sprechen bitten.', 'ar': 'أستطيع طلب إعادة الكلام أو التحدث ببطء أكثر.'},
    {'id': 'a0-11', 'de': 'Ich kann einfache Lebensmittel und Getränke benennen und sagen, was ich gern esse oder trinke.', 'ar': 'أستطيع تسمية أطعمة ومشروبات بسيطة وذكر ما أحب أكله أو شربه.'},
]
seen_cando = {item['id'] for item in cando.get('A0', [])}
cando.setdefault('A0', []).extend(item for item in new_cando if item['id'] not in seen_cando)
save('cando.json', cando)

# ---------------------------------------------------------------------------
# 6) Add one more appropriately levelled discussion card to A1/A2/B1.
muendlich = load('muendlich.json')
new_cards = [
    {
        'id': 'mm-a1-07', 'teil': 3, 'level': 'A1',
        'titel_de': 'Kaffee oder Tee?', 'titel_ar': 'القهوة أم الشاي؟',
        'auftrag_de': 'Sie sind in einem Café. Wählen Sie gemeinsam ein Getränk: Kaffee oder Tee. Fragen Sie Ihren Partner, was er gern trinkt, und einigen Sie sich auf eine Bestellung.',
        'auftrag_ar': 'أنتما في مقهى. اختارا معاً مشروباً: القهوة أم الشاي؟ اسأل شريكك عمّا يحب أن يشرب، واتفقا على طلب.',
        'stuetzen': ['Ich trinke gern …', 'Ich möchte lieber …', 'Was trinkst du gern?', 'Dann nehmen wir …', 'Gute Idee!'],
        'kriterien': [
            {'de': 'einen Wunsch nennen', 'ar': 'ذكر ما يفضّله'},
            {'de': 'eine einfache Frage stellen', 'ar': 'طرح سؤال بسيط'},
            {'de': 'auf den Partner reagieren', 'ar': 'التفاعل مع الشريك'},
            {'de': 'sich auf ein Getränk einigen', 'ar': 'الاتفاق على مشروب'},
        ],
        'zeit_s': 120,
    },
    {
        'id': 'mm-a2-07', 'teil': 3, 'level': 'A2',
        'titel_de': 'Tagesausflug: Zug oder Auto?', 'titel_ar': 'رحلة ليوم واحد: بالقطار أم بالسيارة؟',
        'auftrag_de': 'Sie planen einen Tagesausflug. Entscheiden Sie gemeinsam: Fahren Sie mit dem Zug oder mit dem Auto? Sprechen Sie über Zeit, Kosten und den Treffpunkt und einigen Sie sich.',
        'auftrag_ar': 'تخططان لرحلة ليوم واحد. قررا معاً: هل تذهبان بالقطار أم بالسيارة؟ تحدثا عن الوقت والتكلفة ومكان اللقاء ثم اتفقا.',
        'stuetzen': ['Mit dem Zug sind wir …', 'Das Auto ist …', 'Ich bin dafür, weil …', 'Was hältst du davon?', 'Dann treffen wir uns um …'],
        'kriterien': [
            {'de': 'beide Möglichkeiten vergleichen', 'ar': 'مقارنة الخيارين'},
            {'de': 'mindestens einen Grund nennen', 'ar': 'ذكر سبب واحد على الأقل'},
            {'de': 'auf den Vorschlag des Partners eingehen', 'ar': 'التفاعل مع اقتراح الشريك'},
            {'de': 'Zeit und Treffpunkt festlegen', 'ar': 'تحديد الوقت ومكان اللقاء'},
        ],
        'zeit_s': 180,
    },
    {
        'id': 'mm-b1-07', 'teil': 3, 'level': 'B1',
        'titel_de': 'Autofreie Innenstadt – sinnvoll oder nicht?', 'titel_ar': 'مركز مدينة خالٍ من السيارات: فكرة مفيدة أم لا؟',
        'auftrag_de': 'Diskutieren Sie, ob Innenstädte für private Autos gesperrt werden sollten. Nennen Sie Vor- und Nachteile, reagieren Sie auf die Meinung Ihres Partners und formulieren Sie am Ende eine gemeinsame Position.',
        'auftrag_ar': 'ناقشا ما إذا كان ينبغي منع السيارات الخاصة من دخول مراكز المدن. اذكرا الإيجابيات والسلبيات، وتفاعلا مع رأي الشريك، ثم صوغا موقفاً مشتركاً في النهاية.',
        'stuetzen': ['Einerseits …, andererseits …', 'Ein Vorteil/Nachteil besteht darin, dass …', 'Ich stimme teilweise zu, denn …', 'Wie siehst du das?', 'Wir könnten uns darauf einigen, dass …'],
        'kriterien': [
            {'de': 'eine klare Position ausdrücken', 'ar': 'التعبير عن موقف واضح'},
            {'de': 'mindestens je einen Vor- und Nachteil begründen', 'ar': 'تعليل ميزة وعيب على الأقل'},
            {'de': 'auf Argumente des Partners eingehen', 'ar': 'التفاعل مع حجج الشريك'},
            {'de': 'ein gemeinsames Fazit formulieren', 'ar': 'صياغة خلاصة مشتركة'},
        ],
        'zeit_s': 240,
    },
]
ids = {card['id'] for card in muendlich.get('karten', [])}
muendlich['karten'].extend(card for card in new_cards if card['id'] not in ids)
save('muendlich.json', muendlich)

# ---------------------------------------------------------------------------
# Structural assertions for the deliverable.
texts = load('texts.json')
dialogues = load('dialogues.json')
vocab = load('vocab.json')
grammar = load('grammar.json')
esels = load('eselsbruecken.json')
assert all({'de', 'ar', 'questions'} <= t.keys() and isinstance(t['questions'], list) for t in texts), 'Lesetext schema incomplete'
assert all(q.get('id', '').startswith(t['id'] + '-q') and q.get('promptDe') and q.get('promptAr') for t in texts for q in t['questions']), 'Lesetext question incomplete'
assert all({'titleDe', 'titleAr', 'lines', 'questions', 'dictation'} <= d.keys() for d in dialogues), 'Hoerdialog schema incomplete'
assert all(all({'who', 'de', 'ar'} <= line.keys() for line in d['lines']) for d in dialogues), 'Hoerdialog line incomplete'
assert all(q.get('id', '').startswith(d['id'] + '-q') and q.get('promptDe') and q.get('promptAr') for d in dialogues for q in d['questions']), 'Hoerdialog question incomplete'
all_cards = [card for deck in vocab.values() for card in deck['cards']]
assert all(card.get('id') and card.get('level') and card.get('exampleDe') and card.get('exampleAr') for card in all_cards), 'VocabCard incomplete'
assert len({card['id'] for card in all_cards}) == len(all_cards), 'duplicate vocab IDs'
assert all(len(topic.get('examples', [])) >= 2 and topic.get('rules') and topic.get('exercises') for topic in grammar.values()), 'GrammarTopic incomplete'
production = {'fill', 'umformung', 'order', 'translate'}
assert all(sum(ex.get('type') in production for ex in topic['exercises']) >= 2 for topic in grammar.values()), 'grammar production practice missing'
assert all(ex.get('type') != 'mc' or (isinstance(ex.get('answer'), str) and ex['answer'] in (ex.get('options') or [])) for topic in grammar.values() for ex in topic['exercises']), 'MC answer not selectable'
assert all({'emoji', 'sektion', 'titleAr', 'storyAr', 'zeilen', 'gramIds'} <= item.keys() for item in esels), 'Eselsbruecke schema incomplete'
print('Lesetexte:', len(texts), 'Hoerdialoge:', len(dialogues), 'Hörtexte:', sum(d.get('type') == 'hoer' for d in dialogues))
print('Grammar topics/exercises validated:', len(grammar), sum(len(t['exercises']) for t in grammar.values()))
print('Vocab cards validated:', len(all_cards), 'fehler corrections:', len(repairs))
print('Can-do A0:', len(cando['A0']), 'Mündlich cards:', len(muendlich['karten']))
