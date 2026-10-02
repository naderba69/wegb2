# -*- coding: utf-8 -*-
"""
دفعةُ التغطيةِ التامّةِ — سدادُ دينِ XXVIII:
  14 شفرةً قائمةً تُلْحَقُ بدرسِها الشقيقِ الذي أنشأته إعادةُ الهيكلة،
  و6 شفراتٍ جديدةٌ تُملأُ الفجواتِ الستَّ الباقية (A0×2 · Futur · verb-praep · verschmolzen · redew).
البنك: 51 → 57 · ثمانيةٌ وخمسونَ درساً كلُّها تفتحُ فتجدُ تركتَها.
لا يُمسُّ سوى content/eselsbruecken.json (بندَين مُعلنَين).
"""
import json, sys, io

PATH = "content/eselsbruecken.json"

ATTACH = {
    "zahlen-umgekehrt": ["a0-zahlen"],
    "modal-2ende": ["a1-modalverben"],
    "praep-dat": ["a1-dativ"],
    "praep-tekamolo": ["a1-dativ"],
    "praep-wechsel": ["a1-wechsel"],
    "imperativ-3": ["a1-imperativ"],
    "perf-sein": ["a1-perfekt-einf"],
    "satz-ende": ["a1-weil-dass", "b1-indirekte-fragen"],
    "satz-pos0": ["a1-weil-dass"],
    "praeteritum-buchzeit": ["a2-praeteritum-grund"],
    "konj2-hoeflich": ["a2-konj2-hoflich"],
    "adj-chef": ["a2-adjektiv-einfach"],
    "partizip": ["b1-partizip1", "b2-adjektiv-partizip"],
    "funktionsverb": ["b1-funktionsverben"],
}

NEU = [
    {
        "id": "gruss-formeln",
        "emoji": "👋",
        "sektion": "satzbau",
        "level": "A0",
        "titleAr": "التحيّاتُ الأربع ➔ شفرةُ «التاجُ والسَّرُّ والرُّؤيَة»",
        "storyAr": "زائرٌ جديدٌ في الأسبوعِ الأوّلِ يقولُ نهارَ التاجِ (Guten Tag) فيُردُّ عليه، وحين يرحلُ يودِّعُ بما يعني «أراكَ ثانِيَة» (Wiedersehen = wieder ثانيةً + sehen يرى)، ويُعرِّفُ بنفسِه بقولِه: «يُسَرُّني» (Freut mich) — ثلاثُ مفاتيحَ: تاجٌ للتحيّةِ ورؤيةٌ للوداعِ وسُرُورٌ للتعارفِ، وأوّلُها Hallo قصيرةٌ كصوتِ التحيةِ المجرَّدة.",
        "zeilen": [
            {"code": "التاجُ نهارَك", "de": "Guten Tag! Wie heißen Sie?", "ar": "تحيّةُ النهارِ الدارجة: نهارُكَ بالتاجِ سعيد — والمُخاطَبُ الكبيرُ يُسْألُ: ما اسمُك؟"},
            {"code": "سَأرَى ثانِيَتَك", "de": "Auf Wiedersehen, bis morgen!", "ar": "الوداعُ ليسْ فِراقاً: wieder ثانيةً وsehen يُرى — أقولُ لَكَ: أراكَ ثانِيَةً غداً."},
            {"code": "مُش يُسَرُّني", "de": "Freut mich, dass Sie da sind!", "ar": "تعارُفٌ مهذَّب: Freut mich = يُسَرُّني — mich ضميرُ المفعولِ فالذِي يُسَرُّ هوَ المُعرِّفُ لا الضيفُ."},
        ],
        "gramIds": ["a0-begrussung"],
        "warnung": "Hallo للقريبِ غيرِ الرسميِّ، Guten Tag للشأنِ العامِّ — فلا يُخلَطُ بينهما في العرضِ مهما قَصُرَ السَّبيل.",
    },
    {
        "id": "alphabet-jw",
        "emoji": "🔤",
        "sektion": "satzbau",
        "level": "A0",
        "titleAr": "حروفُ اللبسِ ➔ شفرةُ «آيْ وإيهٍ وأويْ»",
        "storyAr": "مبتدئٌ يسمعُ ei فيقولُ «آيْ» ثمّ يرى ie فيظنُّها هيَها ذاتُها! والأصلُ: ei تُنكَسَرُ البيضةُ فتخرجُ آيْ (Ei بيضة)، وie تُطيلُ قلبُها كأنَّ hً خفيّةً وراءها، وäu تلفُّ الألفَينِ فتصيرُ أويْ — ثمّ J تمشي ياءً وW تخرجُ ڤاً لا واواً: خمسُ مفاتيحَ تنقذُ التهجئةَ والأذنَ معاً.",
        "zeilen": [
            {"code": "البيضةُ آيْ", "de": "Ei, sein, Zeit, Dienstag", "ar": "الـ ei تُنطقُ آيْ: تكسرُها فتخرجُ بيضةً E+i صوتاً واحداً طويلاً."},
            {"code": "الهاءُ خفيَّةٌ طويلة", "de": "Liebe, Biene, dienen, vier", "ar": "الـ ie تُنطقُ إيهْ طويلةً بقلبٍ هامدٍ — ف Lieb يصيرُ Liebę مثلَ أُنثى يطولُ صوتها."},
            {"code": "أويْ من ألفٍ زائدَة", "de": "Bäume, Mäuse, Fräulein", "ar": "الـ äu تُلفُّ ألفاً قبلَ الـ u فتصيرُ أويْ — ثمّ J تمشي ياءً وW تخرجُ ڤاً: لا واوَ ولا فاءَ شاذاة."},
        ],
        "gramIds": ["a0-buchstaben"],
        "warnung": "الحروفُ الصوتيةُ ei وie مقلوبتانِ في الكتابةِ عمّا يُظنُّ — ف ei = آيْ وie = إيهْ طويلا.",
    },
    {
        "id": "futur-werden",
        "emoji": "⏳",
        "sektion": "verb",
        "level": "A1",
        "titleAr": "المستقبلُ ➔ شفرةُ «وَرْدٌ يَفْتَحُ الغد»",
        "storyAr": "لا يقولُ الألماني «سـ» ولا «will» بل يستعينُ بفعلٍ ثالثٍ: werden — فكلُّ جملةٍ مستقبليةٍ تبدأُ بوَرْدَةٍ (وَرْدٌ على وزنِ werden) حمراءَ تُزهِرُ في آخرِ الجملةِ: الوردةُ أولاً والمصدرُ بعدها ثابتاً لا يتغيّر، وفي السؤالِ تتقدَّمُ الوردةُ وحدها فيصيرُ: Wirst du...?",
        "zeilen": [
            {"code": "وَرْد + المصدر", "de": "Ich werde lernen.", "ar": "أنا سَأَتَعَلَّم: الوردةُ werden أولاً ثمّ المصدرُ ليرِ كأنَّ مستقبلاً يُنضِجُ ما بَعْدَه."},
            {"code": "وردةٌ واحدةٌ للكلّ", "de": "Morgen werde ich kommen.", "ar": "متى بدَأْتَ الجملةَ فالمستقبلُ في آخرِها: werden ثمّ مصدرُ التعليقِ kommen دون تغيير."},
            {"code": "السؤالُ يقلبُ الطاولة", "de": "Wirst du kommen?", "ar": "في السؤالِ تُصدِّرُ الوردةُ وحدها (Wirst) فالمصدرُ يبقى حارساً لآخرِ الجملةِ."},
        ],
        "gramIds": ["a1-futur-einf"],
        "warnung": "معَ الغائبِ الـ w من werden يسقط: Er wird kommen — لا تَطْرُحْها مع أنتَ.",
    },
    {
        "id": "fest-praep",
        "emoji": "🎣",
        "sektion": "praeposition",
        "level": "A2",
        "titleAr": "الجارُّ الثابت ➔ شفرةُ «عَلى · عَنْ · فِي»",
        "storyAr": "العَرَبيُّ ينقلُ الفعلَ وأداتَه معاً: تنتظِرُ عَلى، تفكُّرُ عَنْ، تهتمُّ فِي — وكذلكَ الألمانيُّ يلزِقُ الجارَّ بفعلِه فلا يتغيَّرُ بعدَها: warten أبداً مع auf، وdenken مع an، وsich interessieren مع für. والصوتُ يساوِي العربيَّةَ في ثَلاثةٍ: auf كالعَلى، وan كالعَنْ، وfür كالفِي — فالجارُّ سِوارٌ لا يَنحِلُّ عن معصمِ فعلِه.",
        "zeilen": [
            {"code": "auf = عَلى", "de": "Ich warte auf den Bus.", "ar": "warten تلزِقُ بـ auf تلزِقُ العَلى: أنتَ مُعلَّقٌ عَلَى الحافلةِ تانتظِرُها."},
            {"code": "an = عَنْ", "de": "Ich denke oft an meine Familie.", "ar": "denken تمشي مع an كالعَنْ: ذِكْرُكَ صادرٌ عن شَخْصٍ لا إليه."},
            {"code": "für = فِي", "de": "Ich interessiere mich für Deutsch.", "ar": "sich interessieren für: تَهتمُّ «فِي» الشيءِ — والفاءُ في für تشبهُ فِي العربيةِ في القلب."},
        ],
        "gramIds": ["a2-verb-praep"],
        "warnung": "الجارُّ لا ينفصلُ عن فعلِه ولا يُترجَمُ بحَرْفِ الجرِّ الذي يلائِمُ معناه العربيَّ — بل بِثابتِ الفعلِ هكذا.",
    },
    {
        "id": "zusammen-schmelz",
        "emoji": "🧊",
        "sektion": "b2",
        "level": "B2",
        "titleAr": "الأدواتُ المنصهرة ➔ شفرةُ «الجارُّ يبتلعُ أداةَه»",
        "storyAr": "زمنُ العَجَلَةِ يذيبُ الأداةَ داخلَ الجارِّ كمكعّبٍ سُكَّرٍ في الماء: in+dem صارَ am، وin+das صارَ ins، وzu+dem صارَ zum، وan+das صارَ ans — والذوبانُ يحفظُ معنى السكونِ والحركةِ: am Kino لِما ضَمِرَ وins Kino لِما اتَّجَه. ومن فَهِمَ هذا فَهِمَ ثلاثينَ تركيبةً بقاعدةٍ واحدة.",
        "zeilen": [
            {"code": "in + das = ins · in + dem = am", "de": "Ich gehe ins Kino, aber ich bin im Kino.", "ar": "الحركةُ تنكسرُ ساكِنة: ins لِمن يدخلُ وim لِمن هو داخلٌ أصلاً — الحرفُ يبتلعُ الأداةَ ولا يُغيِّرُ الجهة."},
            {"code": "zu + dem = zum · zu + der = zur", "de": "Ich gehe zum Arzt und zur Ärztin.", "ar": "الذوبانُ يحفظُ الجنس: zum للمذكرِ المعيَّنِ وzur للمؤنثِ — فلا يُقالُ zu dem ببطءِ الزمنِ."},
            {"code": "an + das = ans", "de": "Er hängt das Bild an die Wand und geht ans Fenster.", "ar": "الصورةُ على الجدارِ للمكثِ (an die) ثمّ ينتقلُ اتّجاهياً (ans) — الفرقُ حركةٌ لا حرفٌ جديد."},
        ],
        "gramIds": ["b2-verschmolzene"],
        "warnung": "zum لا يُكتَبُ طويلاً في الكلامِ اليوميِّ «zu dem» — النَّثْرُ الألمانيُّ يلغيها إلا في التوكيدِ.",
    },
    {
        "id": "redew-bild",
        "emoji": "🤞",
        "sektion": "b2",
        "level": "B2",
        "titleAr": "الاصطلاحُ ➔ شفرةُ «صورةٌ تُقالُ لا تُترجَم»",
        "storyAr": "ألمانيٌّ يَقولُ: Ich drücke dir die Daumen — فتَتَحَيَّرُ: لماذا يضغطُ إبهامَيك؟ هذا هو مَحَلُّ الفخّ: التعابيرُ الاصطلاحيةُ صورٌ مُشَحَّنةٌ لا تُفكَّكُ حَرْفاً، بل تُحفَظُ صورةً حيَّةً ثمّ تُقالُ عَمّا تَقُلُهُ العربيَّةُ من معنى: الإبهامانِ مضغوطانِ لِلتوفيق، والقفزُ في الماءِ الباردِ لِبِدءٍ بلا خطة، والنَّخْبةُ على الرأسِ لِصَوابِ القولِ.",
        "zeilen": [
            {"code": "الإبهامانِ مضغوطان", "de": "Ich drücke dir die Daumen.", "ar": "بالتوفيقُ لك: قَبَضُ الإبهامينِ صورةُ الإمساكِ بالحظِّ قبلَ الاختبارِ لا عادةٌ في الصيد."},
            {"code": "قَفْزٌ في الماءِ البارد", "de": "Sie ist ins kalte Wasser gesprungen.", "ar": "بدأتْ بلا خطةٍ ولا تمرينٍ كمَن يَنغِمُ في ماءٍ باردٍ فجأةً — sprungen في آخرِها صوتُ القَفْز."},
            {"code": "النَّخْبةُ على الرأسِ", "de": "Er hat den Nagel auf den Kopf getroffen.", "ar": "أصابَ الحَبْرَ: صَوَّبَ القولَ على مَحَلِّه تماماً كمن يُصيبُ نَخْبَةَ السَّطرِ."},
        ],
        "gramIds": ["b2-redew"],
        "warnung": "الاصطلاحُ لا يُرجمُ بالحَرْف: «يدٌ مضغوطتان» وحدها لا معنى لها عندَ الألمانيِّ إلا بسياقِ التوفيقِ.",
    },
]


def main() -> int:
    with io.open(PATH, encoding="utf-8") as f:
        bank = json.load(f)
    assert isinstance(bank, list), "بنكُ التركاتِ يجب أن يكون قائمة"
    before = len(bank)
    ids = {b["id"] for b in bank}
    if before == 57:
        print("البنكُ سبعٌ وخمسونَ مسبقاً — لا شيءَ بعْدُ.")
        return 0

    # 1) اللَّحْقُ بالشقيقين
    by_id = {b["id"]: b for b in bank}
    attached = 0
    for bid, extra in ATTACH.items():
        b = by_id.get(bid)
        if b is None:
            print(f"خطأ: شفرةٌ مفقودة {bid}")
            return 1
        for gid in extra:
            if gid not in b["gramIds"]:
                b["gramIds"].append(gid)
                attached += 1

    # 2) الشفراتُ الستُّ الجديدة
    for b in NEU:
        if b["id"] in ids:
            print(f"خطأ: تكرارُ معرِّف {b['id']}")
            return 1
        bank.append(b)

    with io.open(PATH, "w", encoding="utf-8") as f:
        json.dump(bank, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"تمَّ: {before} → {len(bank)} تركةً · {attached} لاحِقةً · {len(NEU)} جديدةً")
    return 0


if __name__ == "__main__":
    sys.exit(main())
