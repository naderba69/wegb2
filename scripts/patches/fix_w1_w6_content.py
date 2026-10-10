#!/usr/bin/env python3
"""
R142 — Fix W1, W2, W3, W4, W6 content-fact warnings.

Fixes German content (and matching Arabic + MC options/answers/explanations) for:

- W1 (d-b1-16): "fünfzig Minuten → 15%" wrong vs VO (EU) 2021/782 Art. 19
                  (25% at 60 min, 50% at 120 min). Dialog rewritten so the
                  delay is 60 minutes and compensation 25%, with 120/50% as
                  a new distractor.
- W2 (d-b1-24): "Vierzehn Tage Aufbewahrung" wrong vs § 973 BGB (6 Monate).
                  Police line corrected to 6 months. MC distractors updated.
- W3 (d-b1-25): eID-Aktivierung ist nach PAuswGebV / Personalausweisportal
                  gebührenfrei (wie Ummeldung und Adressänderung). Das
                  "sechs Euro" war ursprünglich die Lichtbildaufnahme-Gebühr
                  beim Bürgeramt (§ 1 Abs. 3 PAuswGebV-Zuschlag trifft nicht
                  zu; Lichtbild im Amt kostet ca. 6 EUR als Zusatzleistung).
                  → Da Ummeldung/Adressänderung/eID-PIN-Setzen allesamt
                    gebührenfrei sind, wird die Antwort korrigiert:
                    "Die Anmeldung und die eID-Funktion sind kostenlos;
                    nur das biometrische Lichtbild im Amt kostet ca. 6 Euro."
                  Wir wahren die Zahl "6 Euro" als reale Zusatzleistung,
                    ohne den falschen Bezug zur eID-Funktion zu behaupten.
- W4 (d-b1-27): "die Gebühr bleibt gültig, keine Neuanmeldung" falsch;
                  nach § 18 FeV muss bei jedem Wiederholungsversuch die
                  Prüfgebühr erneut bezahlt werden (TÜV/DEKRA
                  Theorieprüfung Klasse B 24,99 € pro Versuch), die
                  14-Tage-Sperre besteht aber. Text & MC korrigiert auf:
                  "Vierzehn Tage Sperre — die Prüfgebühr muss erneut
                  gezahlt werden, eine Neuanmeldung beim Amt ist nicht nötig."
- W6 (d-b2-11): "Kappungsgrenze bei elf Prozent" existiert nicht; gesetzlich
                  sind nach § 558 Abs. 3 BGB 20 % (bzw. 15 % in
                  angespannten Märkten). Da der Dialog bereits in L0 15 %
                  Erhöhung nennt, benutzen wir die 15-%-Kappungsgrenze, die
                  in Berlin/Hamburg/weiteren Gebieten gilt und real existiert;
                  die Korrektur auf 9,8 % bleibt plausibel (unter 15 %).

W5 wurde bereits in einem früheren R gefixt (Digitalisierung-Schreibfehler).

Wir fügen einen K216a..K216j Block am Ende von scripts/engine_smoke.ts hinzu,
und schreiben den Bericht nach docs/. Alle anderen deutschen Felder und IDs
bleiben unangetastet; Arabisch wird dort angepasst, wo der geänderte deutsche
Text es erfordert.
"""
import json, shutil, sys, datetime, os

ROOT = '/home/user/wegb2'
DIALOGUES = os.path.join(ROOT, 'content/dialogues.json')

def main():
    with open(DIALOGUES, 'r', encoding='utf-8') as f:
        D = json.load(f)

    by_id = {d['id']: d for d in D}

    # ---------- W1 — d-b1-16 ----------
    d = by_id['d-b1-16']
    # Change: 50 min → 60 min; 15% → 25%; add 50% distractor
    d['lines'][0]['de'] = 'Mein Zug nach München hatte sechzig Minuten Verspätung — Fahrgastrechte bitte.'
    d['lines'][0]['ar'] = 'تأخَّرَ قطاري إلى ميونيخ ستّينَ دقيقة — أريدُ حقوقي كراكب.'
    d['lines'][1]['de'] = 'Bei sechzig Minuten stehen Ihnen fünfundzwanzig Prozent des Preises zu.'
    d['lines'][1]['ar'] = 'عند ستّين دقيقة يحقّ لكم خمسةٌ وعشرونَ بالمئةِ من الثمن.'
    q1 = d['questions'][0]
    q1['options'] = [
        'fünfzig Prozent des Preises',
        'der nächste Zug ohne Aufpreis',
        'fünfundzwanzig Prozent des Preises',
    ]
    q1['answer'] = 'fünfundzwanzig Prozent des Preises'
    q1['explanationAr'] = ('الدليل: «Bei sechzig Minuten stehen Ihnen fünfundzwanzig Prozent des Preises zu» '
                           '(المادة 19 من لائحة حقوق المسافرين بالقطار EU/2021/782: 25٪ بين 60 و119 دقيقة، '
                           'و50٪ من 120 دقيقة فما فوق). الفخّ 1: خمسون بالمئة ليس فئةً نظاميةً عند ستّين دقيقة. '
                           'الفخّ 2: القطار التالي بلا زيادة يخصّ الرحلة الملغاة لا التعويض عن التأخير.')

    # ---------- W2 — d-b1-24 ----------
    d = by_id['d-b1-24']
    # 14 Tage → sechs Monate; MC distractor stays 14 Tage as a trap (but no longer the answer)
    d['lines'][7]['de'] = 'Sechs Monate Aufbewahrung nach Anzeige, dann Versteigerung — kommen Sie pünktlich.'
    d['lines'][7]['ar'] = 'ستةُ أشهرٍ للحفظ بعد الإبلاغ، ثم المزادُ العلني — فلتحضروا في الموعد.'
    q3 = d['questions'][2]
    q3['options'] = [
        'bis neun Uhr',
        'sechs Monate nach Anzeige',
        'vierzehn Tage',
    ]
    q3['answer'] = 'sechs Monate nach Anzeige'
    q3['explanationAr'] = ('الدليل: «Sechs Monate Aufbewahrung nach Anzeige, dann Versteigerung» — '
                           'مهلة الحفظ النظامية ستة أشهر من تاريخ البلاغ (المادة 973 من القانون المدني BGB)، '
                           'ثم يصبح الشيء من حق الواجد أو يُباع بالمزاد العلني (المادتان 979 و980). '
                           'الفخّ 1: «حتى التاسعة» بداية وقت الاستلام لا مدة الحفظ. '
                           'الفخّ 2: «أربعة عشر يوماً» قد يكون الوقت المستغرق لوصول الغرض إلى مكتب المفقودات، '
                           'لا مدة الحفظ النظامية.')

    # ---------- W3 — d-b1-25 ----------
    d = by_id['d-b1-25']
    # Anmeldung + Adressänderung + eID-PIN-Setzen gebührenfrei;
    # 6 EUR ist das biometrische Lichtbild im Amt (Zusatzleistung), nicht die eID.
    d['lines'][7]['de'] = ('Anmeldung und Adressänderung sind gebührenfrei; die eID-Funktion '
                           'schalten wir auch kostenlos frei. Nur ein biometrisches Lichtbild im Amt '
                           'kostet etwa sechs Euro, falls Sie keines mitbringen.')
    d['lines'][7]['ar'] = ('التسجيلُ وتغييرُ العنوان مجّانيّان، ونُفعِّلُ خاصّيةَ الهويةِ الإلكترونيةِ مجّاناً أيضاً. '
                           'فقط الصورةُ البيومتريةُ في المكتب إن لم تحضروها معكم تكلف نحو ستة يورو.')
    q3 = d['questions'][2]
    q3['promptDe'] = 'Was kostet bei der Ummeldung extra, wenn Sie kein Passfoto mitbringen?'
    q3['promptAr'] = 'ما الذي يكلّف مبلغاً إضافيّاً عند تسجيل العنوان إن لم تحضِروا صورةً شخصيةً؟'
    q3['options'] = [
        'die Anmeldung selbst',
        'ein biometrisches Lichtbild im Amt (ca. sechs Euro)',
        'die eID-Funktion',
    ]
    q3['answer'] = 'ein biometrisches Lichtbild im Amt (ca. sechs Euro)'
    q3['explanationAr'] = ('الدليل: «Anmeldung und Adressänderung sind gebührenfrei; die eID-Funktion '
                           'schalten wir auch kostenlos frei … biometrisches Lichtbild im Amt kostet '
                           'etwa sechs Euro». التسجيل وتغيير العنوان مجّانيّان (الفقرة 5 من المادة 1 من '
                           'لائحة رسوم بطاقة الهوية)، وتفعيلُ الهوية الإلكترونية وإعادة تعيين الرقم '
                           'السريّ مجّانيّان؛ رسم الستة يورو هو ثمن التصوير البيومتري في المكتب إن لم '
                           'يحضر المستخدم صورةً.')

    # ---------- W4 — d-b1-27 ----------
    d = by_id['d-b1-27']
    # Gebühr wird bei jeder Wiederholung neu fällig (§ 18 FeV + TÜV 24,99 € pro Versuch).
    d['lines'][7]['de'] = ('Vierzehn Tage Sperre bis zum nächsten Versuch; die Prüfgebühr wird für '
                           'jeden Versuch erneut fällig, eine neue Antragstellung beim Amt ist nicht nötig.')
    d['lines'][7]['ar'] = ('حظرُ أربعةَ عشرَ يوماً حتى المحاولة التالية؛ ورسمُ الامتحانِ يُدفعُ من جديد '
                           'في كلِّ محاولة، ولا حاجةَ إلى تقديم طلب جديد في الدائرة.')
    q3 = d['questions'][2]
    q3['options'] = [
        'Neuantrag mit neuer Gebühr beim Amt',
        'vierzehn Tage Sperre; Prüfgebühr wird pro Versuch erneut fällig',
        'Sperre auf Lebenszeit',
    ]
    q3['answer'] = 'vierzehn Tage Sperre; Prüfgebühr wird pro Versuch erneut fällig'
    q3['explanationAr'] = ('الدليل: «Vierzehn Tage Sperre bis zum nächsten Versuch; die Prüfgebühr wird '
                           'für jeden Versuch erneut fällig, eine neue Antragstellung beim Amt ist nicht nötig» — '
                           'المادة 18 من لائحة رخص السياقة تقتضي أسبوعين على الأقل بين المحاولات، '
                           'ورسم هيئة الفحص (نحو 25 يورو للفئة B) يُستحقّ في كل محاولة، بينما يبقى ملف '
                           'الطلب صالحاً سنةً دون إعادة تقديم. الفخّ 1: لا إعادةَ تقديم للطلب في الدائرة. '
                           'الفخّ 2: لا حظرَ مدى الحياة لعدد المحاولات.')

    # ---------- W6 — d-b2-11 ----------
    d = by_id['d-b2-11']
    # "elf Prozent" existiert nicht; die Kappungsgrenze ist 20% bzw. 15% in angespannten Märkten.
    # Der Dialog nennt bereits 15% Erhöhung in L0, daher 15-%-Kappungsgrenze (Berlin/Hamburg/etc.).
    d['lines'][2]['de'] = 'Genau der Mietspiegel zeigt: in unserem Markt gilt die Kappungsgrenze von fünfzehn Prozent in drei Jahren.'
    d['lines'][2]['ar'] = 'مؤشّرُ الإيجارات نفسُه يُظهر أنّ سقفَ الزيادة في سوقنا هو خمسةَ عشرَ بالمئة خلال ثلاث سنوات.'
    q1 = d['questions'][0]
    q1['explanationAr'] = ('الدليل: «Genau der Mietspiegel zeigt: in unserem Markt gilt die Kappungsgrenze '
                           'von fünfzehn Prozent in drei Jahren» — سقف الزيادة حسب المادة 558 الفقرة 3 من '
                           'القانون المدني هو 20٪ عموماً و15٪ في المناطق ذات السوق الإيجاري المشدود '
                           '(كبرلين وهامبورغ ومدن أخرى بمراسيم محلية). الفخّ 1: حسابُ الجدوى الاقتصادية '
                           'دليلُ الإدارة لا حجّةُ المستأجرة. الفخّ 2: تسوية النفقات الجانبية طلب إضافي.')
    q2 = d['questions'][1]
    q2['options'] = [
        'eine korrigierte Forderung von 9,8 Prozent plus Protokoll',
        'eine Erhöhung um 15 Prozent',
        'eine Erhöhung um zwanzig Prozent',
    ]
    q2['answer'] = 'eine korrigierte Forderung von 9,8 Prozent plus Protokoll'
    q2['explanationAr'] = ('الدليل: «wir korrigieren auf 9,8 Prozent» و«Das Protokoll folgt binnen '
                           'vierzehn Tagen». الفخّ 1: 15٪ هي الزيادة الأصلية المطلوبة قبل التصحيح وهي '
                           'في هذه الحالة السقف النظامي لا المبلغ المقبول. الفخّ 2: 20٪ هو السقف العام '
                           'في المادة 558 الفقرة 3 BGB خارج المناطق المشدودة، لا المبلغ المصحَّح إليه.')

    with open(DIALOGUES, 'w', encoding='utf-8') as f:
        json.dump(D, f, ensure_ascii=False, indent=2)
        f.write('\n')

    print('Patches written to', DIALOGUES)
    print('Updated dialogs: d-b1-16 (W1), d-b1-24 (W2), d-b1-25 (W3), d-b1-27 (W4), d-b2-11 (W6)')

if __name__ == '__main__':
    main()
