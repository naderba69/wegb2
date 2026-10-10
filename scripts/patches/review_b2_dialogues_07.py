#!/usr/bin/env python3
"""R128 → R129 patch: B2 d-b2-19 (نزاع/توسط)، d-b2-20 (تأمين الرعاية/تقدير)، d-b2-21 (قرض تعليمي).
18 Arabic-only corrections. German/who/questions/dictation/explanations LOCKED.
Run on a clean dialogues.json: applies exactly 18 replacements, idempotent (0 on re-run).
"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

# (old_ar, new_ar) per dialogue, in line-index order within each dialogue.
FIXES = {
    "d-b2-19": [
        # L0: ist zweimal gekippt = أُلغي/فُشل مرتين (لا «انقلب»); ohne Rückmeldung = دون رد/إشعار
        ("اتفاقُنا مع قسمِ المشترياتِ انقلبَ مرتين، دونَ إخطار.",
         "اتفاقُنا مع قسمِ المشترياتِ أُلغيَ مرتين، دونَ ردٍّ."),
        # L1: Was haben Sie selbst unternommen? = ماذا فعلتِ أنتِ بنفسك (selbst=بنفسك)
        ("وما الذي فعلتِه أنتِ؟",
         "وماذا فعلتِ أنتِ بنفسِك؟"),
        # L2: Kritik sachlich formuliert = وصغتُ النقد بموضوعية (لا «اعتراض»)
        ("وثَّقتُ المحاضرَ بالتواريخ وكتبتُ الاعتراضَ بموضوعيةٍ بالبريدِ لا بالمحادثة.",
         "وثَّقتُ المحاضرَ بالتاريخ وصغتُ النقدَ بموضوعيةٍ بالبريدِ لا بالمحادثة."),
        # L3: setzen wir einen runden Tisch = نُقيم طاولة مستديرة
        ("أحسنتِ — نجعلُ طاولةً مستديرة: كلُّ جهةٍ تُسمِّي ثلاثَ حاجات.",
         "أحسنتِ — نُقيمُ طاولةً مستديرة: كلُّ جهةٍ تذكر ثلاثَ حاجات."),
        # L4: verbindliche Lieferfristen statt Zurufen im Flur = مواعيد تسليم ملزمة بدلاً من مناداة في الممر
        ("أولويتي: مواعيدُ تسليمٍ مُلزِمةٌ لا نداءاتٌ في الممرّ.",
         "أولويتي: مواعيدُ تسليمٍ مُلزِمةٌ بدلاً من المناداةِ في الممر."),
        # L5: beide gegenzeichnen = الطرفان يوقعان معاً (جميعاً زائد)
        ("نُثبِتُ في المحضرِ المواعيدَ ويوقِّعُها الطرفانِ جميعاً.",
         "يُثبَّتُ في المحضرِ المواعيدَ ويوقِّعُه الطرفان."),
        # L6: bis Mittwoch = بحلول الأربعاء (delete spurious «لا أكثر»)
        ("فهمتُ — وأُحضِرُ أرقامَ المقارنةِ إلى الأربعاءِ لا أكثر.",
         "فهمتُ — وسأُحضِرُ أرقامَ المقارنةِ بحلول الأربعاء."),
        # L7: Wiedervorlage = إعادة طرح (not إعادة عرض); verpufft = يذهب سدى
        ("بنّاءٌ الأمر. نُعيدُ العرضَ بعدَ ستةِ أسابيع لئلا يخبوَ الأثر.",
         "بنّاء. إعادةُ الطرحِ بعدَ ستةِ أسابيع لئلا يذهبَ الأثرُ سدىً."),
    ],
    "d-b2-20": [
        # L0: Schlaganfall = سكتة دماغية (لا جلطة=Thrombose)
        ("أصابَ أبي جلطةٌ قبلَ أربعةِ أسابيع — فما درجةُ رعايتِه المتوقعة؟",
         "أصابَ أبي سكتةٌ دماغيةٌ قبلَ أربعةِ أسابيع — فما درجةُ رعايتِه المتوقعة؟"),
        # L2: braucht Hilfe beim Waschen und Anziehen, mittags reicht Aufsicht
        ("صباحًا يُعينُ على الغسلِ واللباس، وعندَ الظهرِ يكفي الإشراف.",
         "صباحاً يحتاجُ إلى مساعدةٍ في الغسلِ والارتداء، وفي الظهرِ يكفي الإشراف."),
        # L3: Nächtliche Unruhe = اضطراب ليلي (لا قلق); dokumentieren im Tagebuch = دوّنوا في اليوميات
        ("قلقٌ ليليٌّ وخوفُ سقوط — دوّنوا ذلك في المذكرةِ من فضلكم.",
         "اضطرابٌ ليليٌّ وخوفُ السقوط — دوّنوا ذلك في اليومياتِ من فضلكم."),
        # L4: zweiwöchige Liste = قائمة الأسبوعين (لا الأسبوعية); mit Uhrzeiten = مع الأوقات
        ("القائمةُ الأسبوعيةُ جاهزةٌ بساعاتِها.",
         "قائمةُ الأسبوعينِ جاهزةٌ بمواعيدِها."),
        # L6: zu knapp ausfällt = كان التقدير متدنياً (بخيل مجازي بعيد عن سياق التأمين)
        ("وكم يستغرقُ القرار — وإن جاءَ التقديرُ بخيلًا؟",
         "وكم يستغرقُ الرد — وإن جاءَ التقديرُ متدنياً؟"),
        # L7: Schriftlich binnen 25 Arbeitstagen; bei zu knapper Bewertung: Widerspruch
        ("خطيًّا خلالَ خمسةٍ وعشرين يومَ عمل؛ ومع التقديرِ البخيل: اعتراض.",
         "خطياً خلالَ خمسةٍ وعشرين يومَ عمل؛ وإن كان التقديرُ متدنياً فالاعتراضُ."),
    ],
    "d-b2-21": [
        # L1: Höchstbetrag staatlich gedeckelt = الحد الأقصى مسقوف حكومياً; zinsgünstiges Darlehen = قرض ميسر الفائدة; Bürgschaft=كفالة
        ("الحدُّ الأقصى مكفولٌ اتحادياً؛ وقرضٌ مصرفيٌّ ميسَّرُ الربا بضمانٍ شخصيٍّ منا.",
         "الحدُّ الأقصى مسقوفٌ حكومياً؛ وقرضٌ مصرفيٌّ ميسَّرُ الفائدةِ بكفالةٍ شخصية."),
        # L2: nach dem zweiten Berufsjahr = بعد سنتين من مزاولة المهنة
        ("يسرُّني بدءُ السدادِ بعدَ سنتَين من المزاول.",
         "أودُّ بدءَ السدادِ بعدَ سنتينِ من مزاولةِ المهنة."),
        # L6: Sonderzahlung zweimal jährlich = دفعتان استثنائيتان (لا مكافأة); Sondertilgung vereinbart = تسديد إضافي متفق عليه
        ("ومكافأتانِ سنويّاً تجعلُ سدادَ دفعةٍ إضافيةٍ كلَّ عامٍ بديلاً.",
         "وبدفعتينِ استثنائيتينِ سنوياً يُتَّفقُ على تسديدٍ إضافيٍّ كلَّ عام."),
        # L7: fixieren wir es im Bescheid = نثبّته في الإشعار; Unterschrift online per eID = التوقيع إلكترونياً بالهوية الرقمية
        ("سنثبِّتُه في القرار؛ فالتوقيعُ على المنصّةِ بالهويّةِ الإلكترونية.",
         "هكذا نُثبِّته في الإشعار؛ والتوقيعُ إلكترونيٌّ بالهويةِ الرقمية."),
    ],
}

D = json.loads(D_PATH.read_text(encoding="utf-8"))
by_id = {d["id"]: d for d in D}

applied = 0
locked_de = 0
locked_mc = 0
locked_dict = 0
remaining = 0

for did, pairs in FIXES.items():
    dlg = by_id[did]
    # Count locks
    locked_de += len(dlg["lines"])
    for q in dlg.get("questions", []):
        locked_mc += 1
    locked_dict += len(dlg.get("dictation", []))
    # We apply in order of lines — figure out which line index each old_ar belongs to
    used = set()
    for old_ar, new_ar in pairs:
        found = False
        for i, ln in enumerate(dlg["lines"]):
            if i in used:
                continue
            if ln["ar"] == old_ar:
                ln["ar"] = new_ar
                applied += 1
                used.add(i)
                found = True
                break
        if not found:
            # Verify already-patched (new_ar present)
            if any(ln["ar"] == new_ar for ln in dlg["lines"]):
                continue
            remaining += 1
            print(f"!! MISS in {did}: {old_ar[:60]}")

D_PATH.write_text(json.dumps(D, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"\n<R129> patch complete · changes applied: {applied} · locked DE lines: {locked_de} · remaining old strings: {remaining}")
assert applied in (18, 0), f"expected 18 fixes (or 0 on already-patched file), applied {applied}"
assert remaining == 0, f"still {remaining} old strings present"
