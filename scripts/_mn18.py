# -*- coding: utf-8 -*-
"""ξ9 — رقعةُ mnemonik (102→120): فخاخُ الجنسِ والجمعِ والأصدقاءِ المزيفينِ التي لم تدخلِ البنكَ بعد.
كلُّ حيلةٍ قاعدةٌ مُثبَّتةٌ مصدرُها النحوُ القياسيُّ لا الذوق: -chen محايد، -ung مؤنَّثٌ مطلق،
-ة الـ-ei مؤنَّثةٌ إلا der Brei، مجموعةُ -ent تنحني بالنون، والقائمةُ الجريحةُ المعروفة.
"""
import json, re

ROOT = "/home/user/weg-nach-b2"
CJK = re.compile(r"[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]")
ARc = re.compile(r"[\u0600-\u06ff]")

NEU = {
 # ── فخاخُ الجنسِ التي تضحكُ على المنطقِ العربي/الفرنسي ──
 "Mädchen": ("schluessel",
  "das Mädchen — صيغةُ التصغيرِ -chen/-lein محايدةٌ دائمًا مهما كانَ المعنى: das Brötchen، das Häuschen. الجنسُ يحكمُهُ الختمُ لا صاحبُهُ."),
 "Militär": ("geschichte",
  "das Militär — الخواتمُ اللاتينيةُ -är/-ment/-at محايدة: das Experiment، das Parlament، das Militär؛ ومؤنَّثُ العائلةِ ما خُتِمَ بـ-tät: die Universität."),
 "Polizei": ("arabisch",
  "die Polizei — كلُّ خاتمةِ -ei مؤنَّثٌ استثناءهُ الوحيدُ المعروفُ der Brei (العصيدة): die Polizei، die Bastelei. احفظِ القاعدةَ واحفظِ العصيدةَ معها."),
 "Löffel": ("farbe",
  "der Löffel — -el الغالبةُ ذكر: der Löffel، der Apfel، der Vogel (وبالجمعِ die Vögel بنقلةٍ صوتية)؛ الأنثى في -el حالاتٌ محفوظة: die Gabel، die Gabel، die Schüssel."),
 "Gericht": ("geschichte",
  "das Gericht — كلمةٌ واحدةٌ وجهان: الطبقُ والقاعةُ معًا محايدان: das Gericht kommt aus der Küche und aus dem Recht؛ الجمعُ die Gerichte بـ-e بلا نقلة."),
 "Gebäude": ("schluessel",
  "das Gebäude — إطارُ ge- … -e محايد: das Gemüse، das Gefühl، das Gebäude؛ والجمعُ لا يزيدُ شيئًا على المفرد: die Gebäude كما هي — لا «Gebäuden»."),
 "Geschichte": ("arabisch",
  "die Geschichte — مؤنَّثٌ وإن بدا حكايةً تُروى، والجمعُ بـ-en: die Geschichten؛ اللاحقةُ -e لا تحذفُ أبدًا من اللفظ: « zwei Geschichte» خطأ فادح."),
 "Kühlschrank": ("geschichte",
  "der Kühlschrank — ليس «kalt» الباردَ بل kühl المائلَ للبرودة: kühl + der Schrank؛ والجنسُ لآخرِ عنصرٍ من المركَّب؛ الجمعُ ينقلُ الشقَّ الثاني: die Kühlschränke."),
 "Handschuh": ("farbe",
  "der Handschuh — حذاءُ اليد: der Schuh يحكمُ der؛ لكنَّ الجمعَ -e بلا نقلةٍ صوتيةٍ رغم ما يوحي: die Handschuhe — لا أُمlaut فيه ولا نون."),
 "Flugzeug": ("schluessel",
  "das Flugzeug — ختمُ -zeug لآلاتِ الصُّنعِ محايد: das Werkzeug، das Feuerzeug، das Flugzeug؛ والجمعُ die Flugzeuge بـ-e صريح."),
 "Student": ("arabisch",
  "der Student — عائلةُ -ent/-ant تنحني بالنونِ في كلِّ حالٍ غيرِ الرفعِ المفرد: den Studenten، dem Studenten، die Studenten؛ الطالبُ لا يسقطُ نونَهُ أبدًا إلا في «der Student» الأولى."),
 "Herz": ("geschichte",
  "das Herz — قلبٌ لا يسلمُ من النونِ إلا في الرفعِ الواحد: des Herzens، dem Herzen، die Herzen؛ أي: -ens للإضافةِ المفردةِ و-n لجمعِ الداتيفِ لا غير."),
 "Staat": ("farbe",
  "der Staat — في الإضافةِ يلحقُهُ es وحده: des Staates؛ والمنصوبُ المفردُ عارٍ: den Staat بلا نونٍ ولا سين؛ والجمعُ -en صريحٌ: die Staaten وليس die Staate."),
 "Gift": ("arabisch",
  "das Gift — الصديقُ المزيفُ القاتل: Gift بالألمانيةِ سُمٌّ لا هدية؛ إن أردتَ العطاءَ فdie Gabe أو das Geschenk، وGiftُ وحدهُ يمضي إلى المحكمة: «Vergiftung»."),
 "Steuer": ("schluessel",
  "die Steuer — الضريبةُ أنثى أبدًا؛ لكنْ لنفسِ اللفظِ وجهٌ محايدٌ في السيارة: das Steuer (عجلةُ القيادة). ادفعْ die واقُدْ das، وأما الفرملُ فلهُ اسمٌ آخر: die Bremse."),
 "Frist": ("geschichte",
  "die Frist — المهلةُ أنثى كـ«المُدَّة»: die Frist، plural die Fristen؛ انقضتْ تقول: Die Frist ist abgelaufen — ولا تُذَكَّرُ abgelaufen مع أنثاها: Die Frist ist abgelaufen."),
 "Bescheinigung": ("arabisch",
  "die Bescheinigung — ختمُ -ung أنثى بالمطلقِ بلا استثناءٍ واحد: die Anmeldung، die Kündigung، die Bescheinigung؛ كلُّ ورقةٍ إداريةٍ تقريبًا -ung فضعِ التاجَ die على جبينِها."),
 "Macht": ("farbe",
  "die Macht — خواتمُ -cht مؤنَّثٌ غالبًا: die Nacht، die Schacht، die Macht؛ وجمعُها بنقلة: die Mächte. استثناءٌ حائرٌ يجبُ حفظُهُ: der Bericht مذكرٌ رغم -cht — لأنَّهُ من « berichten » المشتقِّ بـge-."),
}

d = json.load(open(f"{ROOT}/content/mnemonik.json", encoding="utf8"))
assert len(d) == 102, f"البنكُ ليس 102 بل {len(d)}"
conflict = [w for w in NEU if w in d]
assert not conflict, f"مُكرَّراتٌ عندها: {conflict}"
for w, (art, tipp) in NEU.items():
    assert ARc.search(tipp) and not CJK.search(tipp), (w, "حيلةٌ بلا عربيةٍ أو مع تلويث")
    assert not ARc.search(w) and not CJK.search(w) and w[0].isupper() and " " not in w, w
    assert art in ("schluessel", "geschichte", "arabisch", "farbe"), (w, art)
    assert not ARc.search(w) and not CJK.search(w), w
d.update({w: {"art": a, "tipp": t} for w, (a, t) in NEU.items()})
assert len(d) == 120, len(d)
json.dump(d, open(f"{ROOT}/content/mnemonik.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("mnemonik ← 120 بالضبط")
