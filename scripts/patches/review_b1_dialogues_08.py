#!/usr/bin/env python3
"""R121 — review patch for eighth B1 batch d-b1-25..d-b1-27.

Scope: 3 dialogues (Ummeldung nach dem Umzug, Stromanbieter wechseln,
Führerschein: Theorie und Übung).
Structure: 8+8+8 = 24 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 4 metadata + 24 lines ×3 + 9 questions (7 fields) + 6 dictations ≈ 153.

Confirmed Arabic corrections (meaning accuracy, register, missing currency,
hidden trap numbers, invented additions):

d-b1-25 (Meldeamt — the officer uses explicit Sie: L5 "ich gebe Ihnen"):
  L0 ar: "قبلَ أسبوعَين انتقلتُ، فأريدُ تحديثَ إقامتي."
      → "قبلَ أسبوعَين انتقلتُ، فأريدُ تسجيلَ العنوانِ الجديد."
    (Ummeldung meldeamtlich = تسجيل العنوان الجديد (§ 17 BMG) لا «تحديث الإقامة»
     التي تُلبِس مع تصريح الإقامة/Aufenthaltstitel كما في d-b1-19.)
  L1 ar: "الأسبوعان هما الميعاد تماماً — حانَ فيهما. النموذجُ والهويّةُ وشهادةُ المؤجِّر."
      → "المهلةُ أسبوعان بالضبط — وفي الوقت. النموذجُ والهويّةُ وشهادةُ المؤجِّر."
    ((أ) "Genau zwei Wochen Frist" جملة اسمية: Frist=المهلة (نمط d-b1-21)؛ و«الأسبوعان
     هما الميعاد» قلبٌ للمعنى و«حانَ فيهما» غير فصيحة. (ب) rechtzeitig=في الوقت.)
  L3 ar: "ورقةٌ يوقِّعُها المؤجِّرُ ويُثبِتُ فيها بدءَ سُكنانا."
      → "ورقةٌ يوقِّعُها المؤجِّرُ ويُثبِتُ فيها الانتقالَ إلى المسكن."
    ((أ) "über den Einzug" = عن الانتقال/الانتقال إلى المسكن. (ب) «بدء سُكنانا» إضافة
     بضمير جمع لا مقابل لها في الألماني.)
  L5 ar: "بلا شهادةٍ لا تسجيل — لكنْ خُذ مني الآنَ ورقةً مؤقَّتة."
      → "بدونها لا تسجيل — سأُعطيكم شهادةً مؤقَّتة."
    ((أ) "ich gebe Ihnen" ضمير Sie صريح → «سأُعطيكم» لا أمر مفرد «خُذ مني». (ب) «لكنْ»
     زائدة لا مقابل لها. (ج) Bescheinigung=شهادة (نمط d-b1-06 «شهادة تسجيل»).)
  L6 ar: "وبكم هي؟"
      → "وكم تكلِّفُ؟"
    ("Was kostet sie?" سؤال عن الكلفة؛ «وبكم هي؟» ركيكة بلا مرجع واضح لضمير المؤنث.)
  L7 ar: "التسجيلُ مجاناً، وستةٌ لخاصيةِ الهويّةِ الإلكترونية."
      → "التسجيلُ مجاناً، وستةُ يورو لخاصيةِ الهويةِ الإلكترونية."
    ("sechs Euro" نصّ على العملة فتُذكر «يورو» ولا تُترك مجرّدة (نمط R119/R120:
     Fünfzehn Euro/acht Euro fünfzig)؛ وشرح Q0 يعتمد الرقم. يُسجَّل W3 حول مبلغ
     الستة يورو نفسه مقابل المصادر (التفعيل مجاني رسمياً).)

d-b1-26 (Strom-Hotline):
  L0 ar: "أُنهي عقدي أولَ الشهرِ المقبل وأنتقلُ إليكم."
      → "أُنهي عقدي اعتباراً من أولِ الشهر — وأريدُ كهرباءَكم."
    ((أ) zum Monatsersten=اعتباراً من أول الشهر؛ و«المقبل» إضافة غير موجودة. (ب) "will
     Ihren Strom"=أريد كهرباءكم لا «أنتقل إليكم» (إضافة معنى).)
  L1 ar: "مدةُ عقدِك العتيقِ أربعةُ أسابيع، ونحن نتولّى كلَّ إجراء."
      → "مهلةُ إنهاءِ عقدِك القديم أربعةُ أسابيع — ونحن نتولّى كلَّ الإجراءات."
    ((أ) Altvertragsfrist=مهلة العقد القديم (Frist=مهلة)؛ و«مدة العقد» تُلغي الإنهاء.
     (ب) «عتيق» للمهترئ لا للقديم. (ج) «كلَّ إجراء» مفردة ركيكة.)
  L2 ar: "وكيف أُعلِنُ قراءةَ العدّادِ يومَ التبديل؟"
      → "وكيف أُبلِغُ قراءةَ العدّادِ يومَ التبديل؟"
    (Zählerstand melden=إبلاغ القراءة (melden=إبلاغ، نمط d-b1-19)؛ «أُعلِن» إعلان عام.)
  L3 ar: "صورةٌ بالنموذجِ الشبكيّ، أقصاها العاشرةُ ليلاً."
      → "صورةٌ بالنموذجِ الإلكترونيّ، في موعدٍ أقصاه العاشرةُ مساءً."
    ((أ) Onlineformular=النموذج الإلكتروني؛ و«الشبكيّ» خطأ مفرداتي (shabaki ≠ online).
     (ب) spätestens zweiundzwanzig Uhr=في موعد أقصاه العاشرة مساءً (نمط أوقات الملف).)
  L4 ar: "أنُقطَعُ عن الإمداد؟"
      → "وهل ينقطعُ الإمداد؟"
    ("Wird die Versorgung unterbrochen?" مبني للمجهول عن الإمداد؛ «أنُقطَعُ» تجعل
     المتكلّم مفعولاً وتُشوّه الفاعل.)
  L5 ar: "أبداً — فالمِلكيةُ العامةُ تسدُّ الفجوةَ بلا ثانيةٍ واحدة."
      → "أبداً — التزويدُ الأساسيُّ يتدخّلُ دون ثانيةِ انقطاعٍ واحدة."
    ((أ) Grundversorgung=التزويد الأساسي (تعريفة المزوّد الأساسي، § 36 EnWG) لا
     «الملكية العامة» — خطأ معنى صريح؛ والـErsatzversorgung (§ 38 EnWG) هي التي تهبّ
     عند الثغرة. (ب) springt ein=يتدخّل؛ «تسد الفجوة» تفسيرية أُبدلت بالمعنى المباشر.)
  L7 ar: "مكافأتُنا لمن يلبثُ سنة — وضمانُ السعرِ مشروطٌ بثباتِه."
      → "المكافأةُ فقط عندَ ارتباطِ اثني عشرَ شهراً — وضمانُ السعرِ مشروطٌ بتثبيتِ السعر."
    ((أ) "zwölf Monate"=اثنا عشر شهراً والرقم محور فخّ Q2 («an zwölf Monaten
     Preisbindung») فلا تُخفيه «سنة» (نمط R119/R120). (ب) Bindung=ارتباط/التزام بالمدة،
     وPreisbindung=تثبيت السعر لا «ثباته».)

d-b1-27 (Fahrschule — explicit list, trap numbers 40/14):
  L0 ar: "متى يحينُ نظريُّ الامتحان؟ وقد أتمتُ أربعينَ ساعة."
      → "متى يمكنني التقدّمُ للامتحانِ النظريّ — وقد أتممتُ أربعينَ ساعةَ تدريب؟"
    ((أ) "Wann kann ich zur Theorieprüfung"=متى يمكنني التقدّم للامتحان النظري؛
     «نظريُّ الامتحان» تركيب ركيك. (ب) Übungsstunden=ساعات تدريب، والرقم 40 طرف فخّ Q0.)
  L1 ar: "بعدَ أسبوعَين على الأقلّ — ومعه دورةُ الإسعافِ شرطٌ سابق."
      → "في أقربِ الأحوال بعد أسبوعَين — ودورةُ الإسعافِ مطلوبةٌ قبلَ الامتحان."
    ((أ) Frühestens in zwei Wochen=في أقرب الأحوال بعد أسبوعين. (ب) "Erste-Hilfe-Kurs
     vorher nötig"=دورة الإسعاف مطلوبة قبل الامتحان؛ و«ومعه… شرطٌ سابق» ركيكة وملتبسة.)
  L2 ar: "وكم تعيشُ شهادةُ الإسعاف؟"
      → "وما مدةُ صلاحيةِ شهادةِ الإسعاف؟"
    ("Wie lange ist diese Bescheinigung gültig?" سؤال عن مدة الصلاحية؛ «كم تعيشُ»
     ترجمة حرفية غير فصيحة.)
  L4 ar: "وما الوثائقُ عندَ المُمتحِن؟"
      → "وما الوثائقُ التي يطلبُها الممتحِن؟"
    ("verlangt"=يطلب؛ و«عند الممتحن» تُلغي الفعل وتغيّر المعنى.)
  L5 ar: "هويّة، نظارةُ قياس، إسعاف، سجلُّ التدريب، صورةٌ شمسية — والرسومُ في المكان."
      → "هويّة، اختبارُ نظر، إسعاف، سجلُّ التدريب، صورةٌ شخصية — والرسومُ في المكان."
    ((أ) Sehtest=اختبار/فحص النظر لا «نظارة قياس». (ب) Passfoto=صورة شخصية/جواز؛
     «صورة شمسية» تعبير مهجور ملتبس.)
  L7 ar: "أسبوعان انتظاراً والرسومُ نافذة — لا إعادةَ تسجيل."
      → "حظرُ أربعةَ عشرَ يوماً — والرسومُ نافذة، ولا إعادةَ تسجيل."
    ((أ) "Vierzehn Tage"=أربعة عشر يوماً (والرقم فخّ Q2) لا «أسبوعان» (نمط
     R119/R120). (ب) Sperre=حظر/منع مؤقّت لا «انتظار». ويُسجَّل W4 حول «الرسوم تبقى
     نافذة»: تُعاد الرسوم لكل محاولة، والساري هو الطلب/Prüfauftrag.)
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-25": {
        0: {"ar": "قبلَ أسبوعَين انتقلتُ، فأريدُ تسجيلَ العنوانِ الجديد."},
        1: {"ar": "المهلةُ أسبوعان بالضبط — وفي الوقت. النموذجُ والهويّةُ وشهادةُ المؤجِّر."},
        3: {"ar": "ورقةٌ يوقِّعُها المؤجِّرُ ويُثبِتُ فيها الانتقالَ إلى المسكن."},
        5: {"ar": "بدونها لا تسجيل — سأُعطيكم شهادةً مؤقَّتة."},
        6: {"ar": "وكم تكلِّفُ؟"},
        7: {"ar": "التسجيلُ مجاناً، وستةُ يورو لخاصيةِ الهويةِ الإلكترونية."},
    },
    "d-b1-26": {
        0: {"ar": "أُنهي عقدي اعتباراً من أولِ الشهر — وأريدُ كهرباءَكم."},
        1: {"ar": "مهلةُ إنهاءِ عقدِك القديم أربعةُ أسابيع — ونحن نتولّى كلَّ الإجراءات."},
        2: {"ar": "وكيف أُبلِغُ قراءةَ العدّادِ يومَ التبديل؟"},
        3: {"ar": "صورةٌ بالنموذجِ الإلكترونيّ، في موعدٍ أقصاه العاشرةُ مساءً."},
        4: {"ar": "وهل ينقطعُ الإمداد؟"},
        5: {"ar": "أبداً — التزويدُ الأساسيُّ يتدخّلُ دون ثانيةِ انقطاعٍ واحدة."},
        7: {"ar": "المكافأةُ فقط عندَ ارتباطِ اثني عشرَ شهراً — وضمانُ السعرِ مشروطٌ بتثبيتِ السعر."},
    },
    "d-b1-27": {
        0: {"ar": "متى يمكنني التقدّمُ للامتحانِ النظريّ — وقد أتممتُ أربعينَ ساعةَ تدريب؟"},
        1: {"ar": "في أقربِ الأحوال بعد أسبوعَين — ودورةُ الإسعافِ مطلوبةٌ قبلَ الامتحان."},
        2: {"ar": "وما مدةُ صلاحيةِ شهادةِ الإسعاف؟"},
        4: {"ar": "وما الوثائقُ التي يطلبُها الممتحِن؟"},
        5: {"ar": "هويّة، اختبارُ نظر، إسعاف، سجلُّ التدريب، صورةٌ شخصية — والرسومُ في المكان."},
        7: {"ar": "حظرُ أربعةَ عشرَ يوماً — والرسومُ نافذة، ولا إعادةَ تسجيل."},
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-25": {
        "level": "B1", "titleDe": "Ummeldung nach dem Umzug", "titleAr": "تحديثُ الإقامةِ بعدَ الانتقال",
        "lines": [
            ("Toufik", "Ich bin vor zwei Wochen umgezogen — Ummeldung, bitte."),
            ("Amtsfrau Berg", "Genau zwei Wochen Frist — rechtzeitig. Formular, Ausweis, Vermieterbestätigung."),
            ("Toufik", "Was ist diese Bestätigung?"),
            ("Amtsfrau Berg", "Ein Blatt mit der Unterschrift des Vermieters über den Einzug."),
            ("Toufik", "Der Vermieter weilt in Tunesien; die Post braucht Tage."),
            ("Amtsfrau Berg", "Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung."),
            ("Toufik", "Was kostet sie?"),
            ("Amtsfrau Berg", "Anmeldung gratis; die eID-Funktion kostet sechs Euro."),
        ],
        "questions": [
            ("mc", "innerhalb von zwei Wochen", ["sobald der Vermieter zurück ist", "innerhalb von sechs Tagen", "innerhalb von zwei Wochen"]),
            ("mc", "der Vermieter", ["der Vermieter", "Toufik als Mieter", "Amtsfrau Berg"]),
            ("mc", "eine vorläufige Bescheinigung", ["eine Anmeldung für sechs Euro", "eine vorläufige Bescheinigung", "die eID-Funktion gratis"]),
        ],
        "dictation": [
            "Genau zwei Wochen Frist — rechtzeitig. Formular, Ausweis, Vermieterbestätigung.",
            "Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung.",
        ],
    },
    "d-b1-26": {
        "level": "B1", "titleDe": "Stromanbieter wechseln", "titleAr": "تبديلُ مورِّدِ الكهرباء",
        "lines": [
            ("Fatma", "Ich kündige zum Monatsersten und will Ihren Strom."),
            ("Hotline", "Die Altvertragsfrist sind vier Wochen — wir übernehmen alles."),
            ("Fatma", "Wie melde ich den Zählerstand am Umschalttag?"),
            ("Hotline", "Foto per Onlineformular, spätestens zweiundzwanzig Uhr."),
            ("Fatma", "Wird die Versorgung unterbrochen?"),
            ("Hotline", "Nie — die Grundversorgung springt ohne eine Sekunde Pause ein."),
            ("Fatma", "Was sagt die Bonusklausel?"),
            ("Hotline", "Bonus nur bei zwölf Monaten Bindung; Preisgarantie braucht Preisbindung."),
        ],
        "questions": [
            ("mc", "der neue Anbieter", ["Fatma selbst zum Monatsersten", "die Grundversorgung", "der neue Anbieter"]),
            ("mc", "per Foto im Onlineformular bis 22 Uhr", ["per Foto im Onlineformular bis 22 Uhr", "per Anruf bei der Hotline", "der Zähler meldet automatisch"]),
            ("mc", "an zwölf Monaten Preisbindung", ["an der Grundversorgung", "an zwölf Monaten Preisbindung", "am Zählerstand am Umschalttag"]),
        ],
        "dictation": [
            "Nie — die Grundversorgung springt ohne eine Sekunde Pause ein.",
            "Bonus nur bei zwölf Monaten Bindung; Preisgarantie braucht Preisbindung.",
        ],
    },
    "d-b1-27": {
        "level": "B1", "titleDe": "Führerschein: Theorie und Übung", "titleAr": "رخصةُ السياقة: نظريٌّ وتطبيقي",
        "lines": [
            ("Sonda", "Wann kann ich zur Theorieprüfung — vierzig Übungsstunden?"),
            ("Fahrlehrer", "Frühestens in zwei Wochen — Erste-Hilfe-Kurs vorher nötig."),
            ("Sonda", "Wie lange ist diese Bescheinigung gültig?"),
            ("Fahrlehrer", "Einmal im Leben: sie läuft nie ab."),
            ("Sonda", "Welche Papiere verlangt der Prüfer?"),
            ("Fahrlehrer", "Ausweis, Sehtest, Erste-Hilfe, Ausbildungsprotokoll, Passfoto — Gebühr vor Ort."),
            ("Sonda", "Und nach zweimaligem Nichtbestehen?"),
            ("Fahrlehrer", "Vierzehn Tage Sperre — die Gebühr bleibt gültig, keine Neuanmeldung."),
        ],
        "questions": [
            ("mc", "die Erste-Hilfe-Bescheinigung", ["vierzig Übungsstunden", "das Ausbildungsprotokoll", "die Erste-Hilfe-Bescheinigung"]),
            ("mc", "sie läuft nie ab", ["sie läuft nie ab", "zwei Wochen", "vierzehn Tage nach der Prüfung"]),
            ("mc", "vierzehn Tage Sperre, Gebühr bleibt gültig", ["Neuanmeldung mit neuer Gebühr", "vierzehn Tage Sperre, Gebühr bleibt gültig", "Sperre auf Lebenszeit"]),
        ],
        "dictation": [
            "Einmal im Leben: sie läuft nie ab.",
            "Vierzehn Tage Sperre — die Gebühr bleibt gültig, keine Neuanmeldung.",
        ],
    },
}


def apply_patch() -> dict:
    data = json.loads(D_PATH.read_text(encoding="utf-8"))
    changes = []
    locked = {"linesDE": 0, "questions": 0, "dictations": 0}
    by_id = {d["id"]: d for d in data}
    for did, exp in EXPECTED.items():
        dlg = by_id[did]
        assert dlg["level"] == exp["level"], f"{did} level"
        assert dlg["titleDe"] == exp["titleDe"], f"{did} titleDe"
        assert dlg["titleAr"] == exp["titleAr"], f"{did} titleAr"
        assert "waisen" not in dlg or dlg["waisen"] in (None, [], {})
        assert len(dlg["lines"]) == len(exp["lines"]), f"{did} line count"
        assert len(dlg["questions"]) == len(exp["questions"]), f"{did} question count"
        assert len(dlg.get("dictation") or []) == len(exp["dictation"]), f"{did} dictation count"
        for i, (who, de) in enumerate(exp["lines"]):
            ln = dlg["lines"][i]
            assert ln["who"] == who, f"{did}.L{i} who: {ln['who']!r} vs {who!r}"
            assert ln["de"] == de, f"{did}.L{i} de: {ln['de']!r} vs {de!r}"
            locked["linesDE"] += 1
        for i, (qtype, ans, opts) in enumerate(exp["questions"]):
            q = dlg["questions"][i]
            assert q["type"] == qtype and q["answer"] == ans, f"{did}.q{i} mismatch"
            assert q["options"] == opts, f"{did}.q{i} options mismatch"
            locked["questions"] += 1
        for i, s in enumerate(exp["dictation"]):
            assert dlg["dictation"][i] == s, f"{did}.dict[{i}] mismatch"
            locked["dictations"] += 1
        for idx, patch in CORRECTIONS[did].items():
            ln = dlg["lines"][idx]
            if ln["ar"] != patch["ar"]:
                changes.append({"unit": f"{did}.lines[{idx}].ar", "old": ln["ar"], "new": patch["ar"]})
                ln["ar"] = patch["ar"]
    D_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"changes": changes, "locked": locked}


def main() -> None:
    r = apply_patch()
    print("<R121> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
