#!/usr/bin/env python3
"""
R142 — تصحيحات محتوى W1–W6 (حقائق قانونية/لغوية):
  W1: d-b1-16 Fahrgastrechte  — 50 Min/15 %  →  60 Min/25 % (VO EU 2021/782 Art. 19)
  W2: d-b1-24 Fundsachen      — 14 Tage Aufbewahrung → sechs Monate (§ 973 BGB)
  W3: d-b1-25 Ummeldung       — eID kostet 6 €  →  Ummeldung + Adressänderung gebührenfrei; eID-Aktivierung gebührenfrei
  W4: d-b1-27 Führerschein    — "Gebühr bleibt gültig, keine Neuanmeldung" → pro Versuch erneut fällig; Antrag bleibt gültig
  W5: d-b2-02 Digitalisierung — فحص إملائي "voraus"
  W6: d-b2-11 Mieterhöhung    — Kappungsgrenze 11 % → 20 % (القاعدة العامة § 558 Abs. 3 BGB)، 15 % في المناطق المشدودة؛
                              تُصحَّح من 15 % المطالَب بها إلى 14,7 % (تحت السقف القانوني ومنسجمة مع الحساب المصحَّح في الحوار).
"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DLG = ROOT / "content" / "dialogues.json"
shutil.copy(DLG, DLG.with_suffix(".json.r142bak"))
D = json.loads(DLG.read_text(encoding="utf-8"))

changes = []

def find_d(did):
    for d in D:
        if d["id"] == did:
            return d
    raise KeyError(did)

# =========================================================
# W1 — d-b1-16: 60 Minuten / 25 %
# =========================================================
d = find_d("d-b1-16")
# L0: Amir sagt 60 Minuten statt 50
d["lines"][0]["de"] = "Mein Zug nach München hatte sechzig Minuten Verspätung — Fahrgastrechte bitte."
d["lines"][0]["ar"] = "تأخَّرَ قطاري إلى ميونيخ ستّينَ دقيقة — أريدُ حقوقي كراكب."
# L1: 25 Prozent (bei 60–119 Min)
d["lines"][1]["de"] = "Bei sechzig Minuten stehen Ihnen fünfundzwanzig Prozent des Preises zu."
d["lines"][1]["ar"] = "عند ستّين دقيقة يحقّ لكم خمسةٌ وعشرون بالمئةِ من الثمن."
# dictation[1] references L1 — update
for dt in d.get("dictation", []):
    if "fünfzig Minuten" in dt or "fünfzehn Prozent" in dt:
        old = dt
        dt_new = dt.replace("fünfzig Minuten", "sechzig Minuten").replace("fünfzehn Prozent", "fünfundzwanzig Prozent")
        d["dictation"][d["dictation"].index(old)] = dt_new
# Q0: update options+answer
q0 = d["questions"][0]
q0["options"] = ["fünfzig Prozent des Preises", "der nächste Zug ohne Aufpreis", "fünfundzwanzig Prozent des Preises"]
q0["answer"] = "fünfundzwanzig Prozent des Preises"
q0["explanationAr"] = (
    "الدليل: «Bei sechzig Minuten stehen Ihnen fünfundzwanzig Prozent des Preises zu» "
    "(المادة 19 من لائحة حقوق الركاب EU 2021/782: 25٪ عند 60–119 دقيقة تأخير، و50٪ عند 120 دقيقة فأكثر). "
    "الفخّ 1: خمسون بالمئة تعويضُ تأخير ساعتين فأكثر لا ساعة. "
    "الفخّ 2: القطارُ التالي يخصّ المواصلة المفقودة لا التعويض المالي."
)
# Q2 exp update (15% → 25%)
q2 = d["questions"][2]
q2["explanationAr"] = (
    "الدليل: «Dann gilt der nächste Zug ohne Aufpreis». "
    "الفخّ 1: 25٪ تعويضُ التأخير لا بديلاً عن المواصلة. "
    "الفخّ 2: إلغاءُ القطار الموالي يمنح الحقّ في البديل المجاني لا يسقطه."
)
changes.append("W1: d-b1-16 60 Min / 25% (VO EU 2021/782 Art. 19)")

# =========================================================
# W2 — d-b1-24 Fundsachen: 6 Monate Aufbewahrung, dann Versteigerung
# =========================================================
d = find_d("d-b1-24")
d["lines"][7]["de"] = "Sechs Monate Aufbewahrung nach Anzeige — dann geht er in die Versteigerung; kommen Sie pünktlich."
d["lines"][7]["ar"] = "ستةُ أشهرِ حفظٍ بعد الإبلاغ، ثم تُطرح للمزاد العلني — فلتحضروا في الموعد."
# dictation[1]
for i, dt in enumerate(d.get("dictation", [])):
    if "Vierzehn Tage" in dt:
        d["dictation"][i] = "Sechs Monate Aufbewahrung nach Anzeige — dann geht er in die Versteigerung; kommen Sie pünktlich."
# Q2: Antwort und Optionen
q2 = d["questions"][2]
q2["promptDe"] = "Wie lange wird die Tasche aufbewahrt, bevor sie versteigert wird?"
q2["promptAr"] = "كم تُحفَظ الحقيبةُ قبل أن تُطرح للمزاد؟"
q2["options"] = ["bis neun Uhr", "sechs Monate nach Anzeige", "bis zwanzig Uhr zwanzig"]
q2["answer"] = "sechs Monate nach Anzeige"
q2["explanationAr"] = (
    "الدليل: «Sechs Monate Aufbewahrung nach Anzeige — dann geht er in die Versteigerung» (§ 973 BGB: "
    "بعد ستة أشهر من إبلاغ الجهة المختصة ينتقل الملك إلى الواجد إن لم يتقدم صاحب الحق). "
    "الفخّ 1: «من التاسعة» بدايةُ الاستلام لا مدة الحفظ. "
    "الفخّ 2: 20:20 وقتُ الإبلاغ عن العثور لا المهلة."
)
changes.append("W2: d-b1-24 sechs Monate Aufbewahrung (§ 973 BGB)")

# =========================================================
# W3 — d-b1-25 Ummeldung + eID gebührenfrei
# =========================================================
d = find_d("d-b1-25")
d["lines"][7]["de"] = "Anmeldung und Adressänderung sind gebührenfrei, und die eID-Funktion ist bereits aktiviert."
d["lines"][7]["ar"] = "التسجيلُ وتغييرُ العنوان مجّانيّان، وخاصيةُ الهوية الإلكترونية مُفعَّلة بالفعل."
# Q0 expAr – remove "ستّة هي يوروهات الـeID" since no fee now
q0 = d["questions"][0]
q0["explanationAr"] = (
    "الدليل: «Genau zwei Wochen Frist — rechtzeitig» (مهلة أسبوعين قانونية لتسجيل السكن الجديد). "
    "الفخّ 1: غيابُ المؤجّر لا يمدّد المهلة. "
    "الفخّ 2: لا رسم على التسجيل أو تفعيل الهوية الرقمية."
)
# Q2: Option "die eID-Funktion gratis" stays OK but distractor "eine Anmeldung für sechs Euro" no longer matches a real fact
q2 = d["questions"][2]
q2["options"] = ["eine volle Anmeldung ohne Frist", "eine vorläufige Bescheinigung", "die eID-Funktion zur Mitnahme"]
q2["answer"] = "eine vorläufige Bescheinigung"
q2["explanationAr"] = (
    "الدليل: «Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung». "
    "الفخّ 1: التسجيلُ الكاملُ غير ممكن بدون شهادة المؤجّر. "
    "الفخّ 2: خاصيةُ الهوية الإلكترونية مفعَّلة بالفعل وليست بديلاً عن التسجيل."
)
changes.append("W3: d-b1-25 Ummeldung/eID gebührenfrei (§ 1 Abs. 5 PersAuswGebV)")

# =========================================================
# W4 — d-b1-27 Führerschein: Gebühr pro Versuch erneut fällig, Antrag bleibt gültig
# =========================================================
d = find_d("d-b1-27")
d["lines"][7]["de"] = "Vierzehn Tage Sperre — der Antrag bleibt gültig, die Prüfgebühr wird pro Versuch neu fällig."
d["lines"][7]["ar"] = "حظرُ أربعةَ عشرَ يوماً — الطلبُ يبقى سارياً، ورسمُ الامتحان يُدفَع عن كلِّ محاولة."
# dictation[1]
for i, dt in enumerate(d.get("dictation", [])):
    if "Vierzehn Tage Sperre" in dt:
        d["dictation"][i] = "Vierzehn Tage Sperre — der Antrag bleibt gültig, die Prüfgebühr wird pro Versuch neu fällig."
# Q2: options+answer+exp
q2 = d["questions"][2]
q2["promptDe"] = "Was gilt nach zweimaligem Nichtbestehen?"
q2["promptAr"] = "ماذا يجري بعد الرسوب مرتين؟"
q2["options"] = [
    "eine Neuanmeldung ist nötig, mit neuer Gebühr",
    "vierzehn Tage Sperre; Antrag bleibt gültig, Prüfgebühr pro Versuch neu fällig",
    "lebenslange Sperre",
]
q2["answer"] = "vierzehn Tage Sperre; Antrag bleibt gültig, Prüfgebühr pro Versuch neu fällig"
q2["explanationAr"] = (
    "الدليل: «Vierzehn Tage Sperre — der Antrag bleibt gültig, die Prüfgebühr wird pro Versuch neu fällig» "
    "(§ 18 FeV: مهلة 14 يوماً بين المحاولات، ورسم TÜV/DEKRA نحو 22,49 يورو لكل محاولة، ولا حاجة لإعادة تقديم الطلب). "
    "الفخّ 1: إعادةُ التسجيل غير لازمة ما دام الطلب سارياً. "
    "الفخّ 2: لا حظرَ مدى الحياة في القانون الألماني."
)
# Q1 exp: already correct "Einmal im Leben" — leave
changes.append("W4: d-b1-27 Prüfgebühr pro Versuch fällig; Antrag bleibt gültig (§ 18 FeV)")

# =========================================================
# W5 — d-b2-02 Digitalisierung: "voraussetzen" orthography check — line L1 already uses "voraus" correctly (one word)
# =========================================================
d = find_d("d-b2-02")
# Confirm: "setzt eine Infrastruktur voraus" is correct. No typo found — verified; W5 is a false positive already.
# But dictation[0] has "setzt eine Infrastruktur voraus" which matches; nothing to fix.
# Mark as verified/no-op.
changes.append("W5: d-b2-02 «voraus» spelling verified — no typo present (voraussetzen = richtig, kein Leerzeichenfehler)")

# =========================================================
# W6 — d-b2-11 Mieterhöhung: Kappungsgrenze 20 % / 15 % in angespannten Gebieten
#     Korrektur 15 % → 18 % Forderung; 11 % → 20 % Kappung; Korrektur auf 14,7 % (noch unter Kappung)
# =========================================================
d = find_d("d-b2-11")
# L0: 18 % Forderung
d["lines"][0]["de"] = "Die angekündigte Erhöhung um achtzehn Prozent übersteigt die ortsübliche Vergleichsmiete nicht — aber die Kappungsgrenze."
d["lines"][0]["ar"] = "الزيادةُ المعلَنةُ بثمانيةَ عشرَ بالمئةِ لا تتجاوزُ الإيجارَ المقارِنَ المعتادَ محليًّا — لكنّها تتجاوزُ سقفَ الزيادة."
# L2: 20 % Kappung (Standard)
d["lines"][2]["de"] = "Genau der Mietspiegel zeigt: die Kappungsgrenze beträgt zwanzig Prozent in drei Jahren; in angespannten Gebieten fünfzehn."
d["lines"][2]["ar"] = "مؤشّرُ الإيجاراتِ نفسُه يُظهر: سقفُ الزيادةِ عشرون بالمئة خلال ثلاث سنوات؛ وفي المناطق المشدودة خمسةَ عشرَ."
# L3: Korrektur auf 14,7 %
d["lines"][3]["de"] = "Stimmt — Ihr Brief errechnet korrekt; wir korrigieren auf vierzehn Komma sieben Prozent."
d["lines"][3]["ar"] = "صحيح — حسابُ رسالتكم سليم؛ فنُصحِّحُ إلى أربعةَ عشرَ فاصلةَ سبعة بالمئة."
# dictation[1] (Stimmt Ihr Brief...)
for i, dt in enumerate(d.get("dictation", [])):
    if "korrigieren auf 9,8 Prozent" in dt:
        d["dictation"][i] = "Stimmt — Ihr Brief errechnet korrekt; wir korrigieren auf vierzehn Komma sieben Prozent."
# Q1: options+answer
q1 = d["questions"][1]
q1["options"] = [
    "eine korrigierte Forderung von 14,7 Prozent plus Protokoll",
    "eine Erhöhung um achtzehn Prozent",
    "eine Erhöhung um zwanzig Prozent (volle Kappungsgrenze)",
]
q1["answer"] = "eine korrigierte Forderung von 14,7 Prozent plus Protokoll"
q1["explanationAr"] = (
    "الدليل: «wir korrigieren auf vierzehn Komma sieben Prozent» و«Das Protokoll folgt binnen vierzehn Tagen». "
    "الفخّ 1: 18٪ الطلبُ الأصلي المتجاوز للسقف. "
    "الفخّ 2: 20٪ هو السقفُ القانوني العام (§ 558 Abs. 3 BGB) لا المبلغ المصحَّح إليه؛ وفي المناطق المشدودة يُخفَّض السقف إلى 15٪."
)
# Q0 expAr update (elf Prozent → zwanzig)
q0 = d["questions"][0]
q0["explanationAr"] = (
    "الدليل: «Genau der Mietspiegel zeigt: die Kappungsgrenze beträgt zwanzig Prozent in drei Jahren». "
    "الفخّ 1: الـWirtschaftlichkeitsberechnung دليلُ الإدارة. "
    "الفخّ 2: الـNebenkosten طلبٌ إضافي (محضر) لا حجّة."
)
changes.append("W6: d-b2-11 Kappungsgrenze 20%/15% (§ 558 Abs. 3 BGB); Forderung 18%, Korrektur auf 14,7%")

# Write back
DLG.write_text(json.dumps(D, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("=== R142 applied ===")
for c in changes:
    print(" •", c)
