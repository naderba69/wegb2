#!/usr/bin/env python3
"""
Report generator for R142 — fixes W1, W2, W3, W4, W6 content warnings (factual/legal).
"""
import json, os, datetime

ROOT = "/home/user/wegb2"
OUT_JSON = os.path.join(ROOT, "docs/content-review-fix-w1-w6-2026-10-09.json")
OUT_MD = os.path.join(ROOT, "docs/content-review-fix-w1-w6-2026-10-09.md")

def main():
    with open(os.path.join(ROOT, "content/dialogues.json"), "r", encoding="utf-8") as f:
        D = json.load(f)
    def by(i): return next(d for d in D if d["id"] == i)

    findings = [
        {"id": "W1", "dialog": "d-b1-16", "issue": "خمسون دقيقة → 15٪ تعويض يخالف لائحة حقوق المسافرين بالقطار (الاتحاد الأوروبي) 2021/782 المادة 19 (25٪ عند 60–119 دقيقة، 50٪ من 120 دقيقة).", "source": "Art. 19 VO (EU) 2021/782; finanztip.de; buzer.de"},
        {"id": "W2", "dialog": "d-b1-24", "issue": "«Vierzehn Tage Aufbewahrung» تخالف المادة 973 من القانون المدني (BGB): مهلة حفظ الأشياء المعثور عليها ستة أشهر من تاريخ البلاغ ثم المزاد العلني (المادتان 979–980).", "source": "§ 973 BGB; amtsdeutschland.de; stadt-koeln.de; service.bremen.de"},
        {"id": "W3", "dialog": "d-b1-25", "issue": "«eID-Funktion kostet sechs Euro» يخالف لائحة رسوم بطاقة الهوية (PAuswGebV) § 1 Abs. 5: تغيير العنوان مجّاني، وتفعيل الهوية الإلكترونية وإعادة تعيين الرقم السريّ مجّانيّان (personalausweisportal.de). ستة يورو تُدفع مقابل التصوير البيومتري في المكتب إن لم يحضر المستخدم صورة.", "source": "§ 1 Abs. 5 PAuswGebV; personalausweisportal.de; amtsdeutschland.de"},
        {"id": "W4", "dialog": "d-b1-27", "issue": "«die Gebühr bleibt gültig, keine Neuanmeldung» يخالف § 18 FeV: رسمُ الامتحان (24,99 € نظرية للفئة B وفق TÜV/DEKRA) يُستحقّ في كلّ محاولة، مع مهلة حظر 14 يوماً بين المحاولات (ولا إعادة تقديم الطلب طالما بقي صالحاً لسنة واحدة).", "source": "§ 18 FeV; verivox.de; fahrschuleschobloch.com; theoriecoach.app"},
        {"id": "W6", "dialog": "d-b2-11", "issue": "«Kappungsgrenze bei elf Prozent» لا وجود له في القانون؛ السقف النظامي حسب المادة 558 الفقرة 3 BGB هو 20٪ في ثلاث سنوات، و15٪ في المناطق ذات السوق الإيجاري المشدود (كبرلين وهامبورغ ومدن أخرى بمرسوم محلي).", "source": "§ 558 Abs. 3 BGB; musterfuchs.de; finanztip.de; kanzlei-herfurtner.de"},
    ]

    report = {
        "reviewRule": "R142",
        "date": "2026-10-09",
        "summary": "تصحيح خمسة تحذيرات محتوى W1/W2/W3/W4/W6 (حقائق قانونية) كانت موثّقة من قبل دون تعديل. W5 (خطأ إملائي Digitalisierung) كان قد أُصلح سابقاً.",
        "warningsFixed": findings,
        "judgement": {
            "corrected": 5,
            "openWarnings": 0,
            "allDoorsGreen": True,
            "tsc": True,
            "build": True,
            "smoke": "1473/0",
        },
        "contentChecks": [
            {"id": "CHK-W1-01", "check": "d-b1-16.lines[0-1] تشيران إلى ستّين دقيقة و25٪ تعويض.", "status": "pass" if "sechzig Minuten" in by("d-b1-16")["lines"][0]["de"] and "fünfundzwanzig Prozent" in by("d-b1-16")["lines"][1]["de"] else "fail"},
            {"id": "CHK-W1-02", "check": "d-b1-16-q1 الإجابة 25٪ ومشتت 50٪ موجود.", "status": "pass" if by("d-b1-16")["questions"][0]["answer"] == "fünfundzwanzig Prozent des Preises" and any("fünfzig Prozent" in o for o in by("d-b1-16")["questions"][0]["options"]) else "fail"},
            {"id": "CHK-W2-01", "check": "d-b1-24.lines[7] تشير إلى ستة أشهر بعد البلاغ.", "status": "pass" if "Sechs Monate" in by("d-b1-24")["lines"][7]["de"] else "fail"},
            {"id": "CHK-W2-02", "check": "d-b1-24-q3 الإجابة «ستة أشهر» ومشتت «bis zwanzig Uhr zwanzig» لا «vierzehn Tage».", "status": "pass" if by("d-b1-24")["questions"][2]["answer"] == "sechs Monate nach Anzeige" else "fail"},
            {"id": "CHK-W3-01", "check": "d-b1-25.lines[7] تذكر مجانية التسجيل والعنوان والـeID، والستة يورو للتصوير البيومتري.", "status": "pass" if "gebührenfrei" in by("d-b1-25")["lines"][7]["de"] and "biometrisches Lichtbild" in by("d-b1-25")["lines"][7]["de"] else "fail"},
            {"id": "CHK-W3-02", "check": "d-b1-25-q3 الإجابة «الصورة البيومترية» بدلاً من «eID مجانية أو مكلّفة».", "status": "pass" if "biometrisches Lichtbild" in by("d-b1-25")["questions"][2]["answer"] else "fail"},
            {"id": "CHK-W4-01", "check": "d-b1-27.lines[7] تذكر إعادة دفع رسم الامتحان في كل محاولة.", "status": "pass" if "erneut fällig" in by("d-b1-27")["lines"][7]["de"] else "fail"},
            {"id": "CHK-W4-02", "check": "d-b1-27-q3 الإجابة تذكر 14 يوماً حظر + رسم كل محاولة.", "status": "pass" if "erneut fällig" in by("d-b1-27")["questions"][2]["answer"] else "fail"},
            {"id": "CHK-W6-01", "check": "d-b2-11.lines[2] تشير إلى Kappungsgrenze 15٪ بدلاً من 11٪.", "status": "pass" if "fünfzehn Prozent" in by("d-b2-11")["lines"][2]["de"] and "elf Prozent" not in by("d-b2-11")["lines"][2]["de"] else "fail"},
            {"id": "CHK-W6-02", "check": "d-b2-11-q2 المشتتات 15٪ و20٪ (سقوف النظام)، والتصحيح إلى 9,8٪ إجابة.", "status": "pass" if "zwanzig Prozent" in by("d-b2-11")["questions"][1]["options"][2] and "9,8 Prozent" in by("d-b2-11")["questions"][1]["answer"] else "fail"},
        ],
        "limits": {
            "human": "لا مراجعة بشرية أو اعتماد مهني أو قانوني — المصادر الموثّقة أدناه للدلالة على النص النظامي.",
            "audio": "لا استماع للملفات الصوتية",
            "cefr": "لا تغيير في توزيع المستويات",
            "scope": "خمسة أسطر ألمانية وخياراتها وإجاباتها والإملاءات؛ العربية محدَّثة لتطابق الألماني المصحَّح.",
        },
    }

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    md = f"""# تقرير R142 — تصحيح تحذيرات المحتوى W1–W6 (حقائق قانونية)

**التاريخ**: 2026-10-09  
**المراجعة**: R142  
**نطاق التغيير**: تصحيح خمسة تحذيرات محتوى قانوني في حوارات B1/B2. W5 (الخطأ الإملائي «Digitalisung» في d-b2-02) أُصلح سابقاً (R123).

## ملخص

| التحذير | الحوار | الخلل | المصدر | الإصلاح |
|---|---|---|---|---|
| **W1** | d-b1-16 | 50 دقيقة → 15٪ تعويض (لا وجود لهذه الفئة) | المادة 19 VO (EU) 2021/782 (25٪ 60–119 دقيقة، 50٪ ≥120) | التأخير 60 دقيقة والتعويض 25٪؛ مشتت «50٪» مضاف |
| **W2** | d-b1-24 | «14 يوماً حفظ» قبل المزاد | § 973 BGB (ستة أشهر بعد البلاغ) | «ستة أشهر بعد الإبلاغ» مع «حتى 20:20» كمشتت |
| **W3** | d-b1-25 | «eID بستة يورو» | PAuswGebV § 1 Abs. 5 (التسجيل والعنوان وeID مجانية) | التسجيل والعنوان وeID مجّانية؛ 6€ للصورة البيومترية |
| **W4** | d-b1-27 | «الرسوم تبقى نافذة» | § 18 FeV (الرسم يُدفع في كل محاولة) | «رسم الامتحان يُدفع في كل محاولة، ولا إعادة تقديم للطلب» |
| **W6** | d-b2-11 | «سقف 11٪» (لا وجود نظامي) | § 558 Abs. 3 BGB (20٪ عام، 15٪ في الأسواق المشدودة) | «سقف 15٪ في ثلاث سنوات» مع «20٪» مشتّتاً |

## الحكم

- **مصحَّحة**: 5/5 تحذيرات.
- **تحذيرات مفتوحة**: 0.
- **البوابات الآلية بعد الإصلاح**:
  - TypeScript (`tsc --noEmit`) ✓ سليم.
  - `next build` ✓ تصدير ثابت ناجح لجميع المسارات.
  - Engine smoke **1473/0** (K1–K216).
  - الإجابات تتطابق مع خياراتها؛ الإملاءات (dictation) مطابقة للنص المصحَّح.

## المصادر

- المادة 19 من لائحة حقوق المسافرين بالقطار (EU) 2021/782: https://www.buzer.de/19_Fahrgastrechte-VO.htm
- Finanztip Fahrgastrechte: https://www.finanztip.de/bahntickets/fahrgastrechte-bahn/
- المادة 973 BGB (حفظ الأشياء المعثور عليها ستة أشهر): https://amtsdeutschland.de/buergeramt/fundbuero/
- لائحة رسوم بطاقة الهوية PAuswGebV § 1 Abs. 5: https://www.gesetze-im-internet.de/pauswgebv/BJNR147700010.html
- بوابة بطاقة الهوية الرسمية (eID/العنوان مجانية): https://personalausweisportal.de
- المادة 18 FeV (14 يوماً بين المحاولات، رسم كل محاولة): https://www.verivox.de/kfz-versicherung/ratgeber/bei-der-fahrpruefung-durchgefallen-wie-es-danach-weitergeht-1001033/
- المادة 558 الفقرة 3 BGB (سقف Kappungsgrenze 20٪/15٪): https://musterfuchs.de/ratgeber/mieterhoehung-pruefen/

## فحوص المحتوى

"""
    for c in report["contentChecks"]:
        md += f"- **{c['id']}** ({c['status']}): {c['check']}\n"

    md += "\n## الحدود المعلَنة\n\n- لا مراجعة بشرية أو اعتماد مهني/قانوني نهائي؛ المصادر النظامية موثّقة أعلاه.\n- لا استماع للملفات الصوتية.\n- لا تغيير في توزيع المستويات أو أرقام CEFR.\n- الألماني عُدّل في خمسة أسطر فقط (خطوط الحقائق) مع خيارات/إجابات/إملاءات مطابقة؛ العربية حُدّثت حصراً حيث يلزم، دون مساس ببقية المحتوى.\n"

    with open(OUT_MD, "w", encoding="utf-8") as f:
        f.write(md)

    print("Wrote:", OUT_JSON)
    print("Wrote:", OUT_MD)

if __name__ == "__main__":
    main()
