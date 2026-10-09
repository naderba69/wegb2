#!/usr/bin/env python3
"""R118 — review report for fifth B1 batch d-b1-16..d-b1-18."""
from __future__ import annotations
import json, glob
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
D=json.loads((ROOT/"content/dialogues.json").read_text(encoding="utf-8"))
AUDIO=json.loads((ROOT/"content/dialog-audio.json").read_text(encoding="utf-8"))
SCOPE=[f"d-b1-{i:02d}" for i in range(16,19)]
OUT_JSON=ROOT/"docs/content-review-b1-dialogues-05-2026-10-08.json"
OUT_MD=ROOT/"docs/content-review-b1-dialogues-05-2026-10-08.md"

CORRECTIONS=[
 {"unit":"d-b1-16.lines[1].ar","old":"بخمسينَ لك خمسةَ عشرَ بالمئةِ من الثمن.","new":"عند خمسين دقيقة يحقّ لكم خمسةَ عشرَ بالمئةِ من الثمن.",
  "rationale":"«stehen Ihnen … zu» تعني الاستحقاق (يحقّ لكم)؛ والصياغة القديمة «بخمسينَ لك» ليست شرطاً ولا استحقاقاً. وضمير المخاطب الرسمي Ihnen (Schaffnerin Weiß تخاطب أمير بـSie: «bewahren Sie» في L5) يقابله عربي جمع «لكم» لا مفرد «لك»."},
 {"unit":"d-b1-16.lines[3].ar","old":"عبِّئْ نموذجَ «استردادِ المال» على الشبكة، والعِوَضُ ينزلُ حسابَك.","new":"عبِّئوا نموذجَ «استرداد المال» على الشبكة، والعِوَضُ ينزلُ حسابَكم.",
  "rationale":"«ausfüllen» أمر رسمي موجّه لأمير بـSie → «عبِّئوا» لا «عبِّئْ»، و«aufs Konto» → «حسابَكم» لا «حسابَك» (مطابقة صيغة الجمع العربية للرسمي)."},
 {"unit":"d-b1-16.lines[5].ar","old":"نسخةٌ تكفي، واحتفظْ بالأصل.","new":"نسخةٌ تكفي، واحتفظوا بالأصل.",
  "rationale":"«bewahren Sie das Original auf» أمر رسمي (Sie) → جمع «احتفظوا» بدل مفرد «احتفظْ»."},
 {"unit":"d-b1-16.lines[6].ar","old":"وقد فاتني القطارُ الموالي لهذا السبب!","new":"وأُلغي القطارُ الموالي أيضاً!",
  "rationale":"(أ) «Der Anschlusszug fiel auch aus» = أُلغِيَ قطار الوصل (ausfallen) لا «فاتني» (verpassen). (ب) أُعيدت «auch» = أيضاً. (ج) حُذفت إضافة «لهذا السبب» غير الموجودة في الألماني. ومفتاح Q3 نفسه يقول «kein Anspruch, weil der Anschlusszug ausfiel»."},
 {"unit":"d-b1-16.lines[7].ar","old":"يسري إذنِ التالي بلا زيادةٍ في الثمن — دوَّناه في النظام.","new":"يسري إذن القطارُ التالي بلا زيادةٍ في الثمن — دوَّناه.",
  "rationale":"(أ) «der nächste Zug» يسمّي القطار صراحةً فأُعيدت «القطار». (ب) «في النظام» إضافة غير موجودة في «wir haben es vermerkt» (سجّلناه/دوّناه) فحُذفت."},
 {"unit":"d-b1-17.lines[2].ar","old":"وبعضُ الآباءِ يقرؤون مع الأطفالَ أسبوعياً.","new":"ويمكن للآباء أيضاً المساعدة في القراءة بصوتٍ عالٍ.",
  "rationale":"(أ) «Eltern können auch beim Vorlesen helfen» = يمكن للآباء المساعدة في القراءة الجهرية؛ الصياغة القديمة حوّلتها إلى خبر عن «بعض الآباء» وأسقطت «können … helfen». (ب) حُذفت «أسبوعياً» المضافة غير الموجودة في الألماني. (ج) شرح Q1 نفسه يسمّيها «القراءة بصوت عالٍ اقتراح المعلّمة»."},
 {"unit":"d-b1-17.lines[4].ar","old":"وحفلُ الختامِ نجعلُه مجموعةَ عملٍ يومَ الجمعة.","new":"وحفلُ الختامِ فنُخطِّطُ له في مجموعةِ عملٍ يومَ الجمعة.",
  "rationale":"«planen wir als Arbeitsgruppe» = نُخطِّط له (بوصفنا/داخل) مجموعة عمل؛ «نجعلُه» عكس المعنى: الحفل لا يصبح مجموعة عمل، بل مجموعة العمل تخطّط يوم الجمعة."},
 {"unit":"d-b1-17.lines[7].ar","old":"الرسالةُ تُرسَل، وهم يُسجِّلون أطفالَ الأداءِ عندهم.","new":"الدعوةُ تُرسَل، وهي تُسجِّل أطفالَها المشاركين في العرضِ.",
  "rationale":"(أ) «Die Einladung» = الدعوة لا «الرسالة» (وشرح Q3 يقول «الدعوة يرسلها سليم»). (ب) «sie» تعود على Partnerschule المفردة المؤنثة → «هي» لا «هم»؛ و«عندهم» إضافة غير موجودة. (ج) «Auftrittskinder» وُضّحت بـ«أطفالها المشاركين في العرض»."},
 {"unit":"d-b1-18.lines[0].ar","old":"أمسَ بعدَ منتصفِ الليل علتِ الأصوات، ونظامُ البنايةِ يعرفُ سكوناً.","new":"أمسَ بعد منتصفِ الليل علتِ الأصوات، وتنصُّ لائحةُ البنايةِ على أوقاتِ السكون.",
  "rationale":"«die Hausordnung kennt Ruhezeiten» = اللائحة تنصّ على أوقات هدوء؛ «يعرفُ سكوناً» نقلت kennt حرفياً وأفردت الجمع Ruhezeiten (أوقات) في «سكوناً». مفتاح Q2 يثبّت 22:00 (Nachtruhe ab zweiundzwanzig)."},
 {"unit":"d-b1-18.lines[1].ar","old":"كان بثَّ مباراةِ أخي عبرَ مكبِّرٍ صوتيّ.","new":"كان بثُّ أخي مضخَّماً بصوتٍ عالٍ.",
  "rationale":"(أ) «مباراة» غير موجودة في الألماني (die Übertragung meines Bruders فقط) فحُذفت. (ب) «laut verstärkt» = مضخَّماً بصوتٍ عالٍ؛ وكلمة «laut» كانت مُسقطة في الصياغة القديمة."},
 {"unit":"d-b1-18.lines[3].ar","old":"عذراً — أحسنتَ بالكلامِ بدلَ الشكاة. لن تعودَ المباراةُ المنقولة.","new":"عذراً — أحسنتم بالكلامِ بدلَ التوبيخ. وسيظلُّ البثُّ متوقفاً من الآن فصاعداً.",
  "rationale":"(أ) «dass Sie sprechen» صيغة رسمية → «أحسنتم» جمع لا مفرد «أحسنتَ». (ب) «schelten» = tadeln/Vorwürfe machen (Duden/DWDS) = توبيخ لا «الشكاة» (شكوى). (ج) «المباراة» مضافة للمرة الثانية فحُذفت. (د) «bleibt künftig aus» = يظلّ متوقفاً من الآن فصاعداً لا «لن تعودَ»."},
 {"unit":"d-b1-18.lines[4].ar","old":"وإن نزلَ ضيوف، فأُنذِرُك قبلَها بعشرينَ دقيقة.","new":"وإن نزلَ ضيوف، أُخبِرُكم قبلَ وصولهم بعشرينَ دقيقة.",
  "rationale":"(أ) «Bescheid sagen» = إعلام/إخبار لا إنذار؛ والسيّدة ديتريش تخاطب أسامة بـSie («klopfen Sie» من جهته، و«dass Sie sprechen» منها) → جمع «أُخبِرُكم». (ب) «قبلَها» بلا مرجع مؤنث في الجملة؛ «zwanzig Minuten vorher» = قبل وصول الضيوف بعشرين دقيقة."},
 {"unit":"d-b1-18.lines[5].ar","old":"وإن تسرَّبَ منّا لحنٌ، فقَرِعَ مرّةً — نُخفِّضُه حالاً.","new":"وإن تسرَّبت منّا موسيقى عبرَ الجدار، فاطرقوا مرّةً — نُخفِّضُها حالاً.",
  "rationale":"(أ) «Musik» = موسيقى لا «لحن»، وشرح Q0 نفسه يقول «الموسيقى احتمال مستقبلي». (ب) «klopfen Sie einmal» أمر رسمي → «فاطرقوا» لا «فقَرِعَ» (فعل ماضٍ للغائب). (ج) أُعيدت «عبرَ الجدار» من «durch die Wand» فللطرق مرجعٌ مادي واضح."},
 {"unit":"d-b1-18.lines[6].ar","old":"عَهدٌ مُتفَق — الدرجَ والصمتَ نتقاسمهما.","new":"اتّفقنا — الدرجَ والهدوءَ نتقاسمهما.",
  "rationale":"(أ) «Abgemacht» كلمة اتفاق واحدة؛ «عَهدٌ مُتفَق» تركيب حرفيّ غير مألوف → «اتّفقنا». (ب) «Ruhe» في سياق لائحة البناية = هدوء لا «صمت» (silence). الحقل المقفول «Treppe und Ruhe teilen wir uns» بلا تغيير."},
]

CONTEXT_NOTES={
 "d-b1-16":[
  {"note":"اسم النموذج الألماني «Geld zurück» اسم دارج في موقع/تطبيق الناقل، والنموذج الرسمي يُسمّى Fahrgastrechte-Formular ويُقدَّم إلكترونياً أو في مركز خدمة أو بالبريد؛ والنص التعليمي لا يتوسّع في ذلك.","source":"Verbraucherzentrale: Erstattung bei Zugverspätung · Süddeutsche: Rechte für Bahnkunden (garantiert Geld zurück)."},
  {"note":"«Bar oder aufs Konto?» صحيح واقعياً: الصرف نقداً (Barauszahlung) أو التحويل على الحساب شائعان في مسار Fahrgastrechte.","source":"familie.de: Deutsche Bahn — So gibt's Geld zurück bei Verspätungen · SZ: Garantiert Geld zurück."},
  {"note":"«Eine Kopie genügt — bewahren Sie das Original auf» يوافق المسار الورقي الفعلي: يُقبل أصل التذكرة أو نسخة، والأصل يبقى بحوزة الراكب عند الإرسال البريدي للنسخ.","source":"SZ: Garantiert Geld zurück · FNP: Deutsche Bahn — Ärger bei Verspätungen."},
  {"note":"الرقم «15% عند 50 دقيقة» لا يطابق اللائحة الحيّة (EU) 2021/782 (25% عند ≥60 دقيقة، 50% عند ≥120 دقيقة). لم يُعدّل الألماني (محمي بقاعدة المراجعة) ولا مفتاح السؤال («fünfzehn Prozent des Preises»)؛ سُجّل التحذير في قسم «تحذيرات محتوى» مع مصادره، ويُوصى بمهمة محتوى منفصلة (تغييره يمسّ السؤال والإملاء والمفتاح).","source":"Verbraucherzentrale · EBA (Fahrgastrechte im Bahnverkehr) · Finanztip (EU/2021/782)."},
  {"note":"قواعد الإلغاء/الإصلاح العام في L6–L7 (قطار بديل بلا زيادة سعر عند إلغاء الوصل) مدعومة: Weiterreise mit geänderter Streckenführung بلا تكلفة إضافية.","source":"bahn.de: Ihre Rechte als Fahrgast (AJC/Art. 18) · buzer.de: Art. 18 der VO (EU) 2021/782."},
 ],
 "d-b1-17":[
  {"note":"سياق Elternabend/Lesetag تربوي واقعي: ركن قراءة في الصف، مكتبة ناقصة راعياً، إسهام الأهالي في القراءة الجهرية، وحفل ختام يُعدّه فريق عمل — كلها أنماط موثقة في أدبيات إشراك الأهالي في تعزيز القراءة.","source":"Bildungsserver Berlin-Brandenburg: «Gemeinsame Sache machen — Eltern als Partner der Leseförderung» · family-literacy.at: «Gemeinsam lesen»."},
  {"note":"«Auftrittskinder» مركّب غير مُثبت في المعاجم العامة لكنه مفهوم من مكوّنيه (Auftritt + Kinder)؛ لم يُعدّل الألماني لأنه ليس خطأً مؤكداً، ووُضّح معناه في العربية.","source":"Persen Verlag: Erfolgreiche Elternarbeit (مفردات الحفل والأداء) · القاعدة نفسها: لا تعديل إلا لخطأ ألماني مؤكد."},
  {"note":"«mein Dienst beginnt früher» = دوامي/ورديتي يبدأ أبكر؛ الترجمة الحالية «فخدمتي تسبقُها» مفهومة وسُجّلت بديلاً أسلوبياً (دوامي/نوبتي) لا خطأً.","source":"DWDS: Dienst (Arbeitsdienst/Schicht) — اختيار أسلوبي."},
  {"note":"الحوار لا يذكر عدد أطفال العرض ولا موعد الحفل تفصيلاً؛ هذا مستوى تبسيط دراسي مقصود ولا يُعدّ نقصاً.","source":"الأنماط التربوية المرجعية أعلاه — لا ادّعاء اكتمال سيناريو."},
 ],
 "d-b1-18":[
  {"note":"الرقم في الحوار مطابق للمعيار الألماني: Nachtruhe من 22:00 إلى 06:00 (Landes-Immissionsschutzgesetze/lائحة البناية)، وشرح Q2 يثبّته (um zweiundzwanzig Uhr).","source":"wohnen-mit-kopf.de: Hausordnung Ruhezeiten · ImmobilienScout24: Nachtruhe in Mietwohnungen · fachanwalt.de: Ruhezeiten bei der Mietwohnung."},
  {"note":"«schelten» فعل رفيع بمعنى التوبيخ واللوم (tadeln, Vorwürfe machen) لا الشكوى — أُخذ في التصحيح L3.","source":"DWDS: schelten · wissen.de (Wahrig): zurechtweisen/tadeln/rügen."},
  {"note":"مسار الحل الودّي في الحوار (اعتذار، إعلام مسبق عند الضيوف، طرق واحد عند تسرّب الصوت، خفض فوري) يوافق النصائح العملية لحلّ نزاعات الجيرة بلا تصعيد رسمي.","source":"ImmobilienScout24: Ruhestörung — ما يُنصح به · fachanwalt.de: Ruhezeiten (حدود التصعيد)."},
  {"note":"الحوار تعليمي ولا يُعدّ مشورة قانونية: التقاضي المحلي وحالات المبالغة (dauerhafte Lärmbelästigung/Erheblichkeit) خارج نطاق النص.","source":"القاعدة R118 نفسها (حدود قانونية معلنة)."},
 ],
}

STYLE_ALTERNATIVES={
 "d-b1-16":[
  {"phrase":"أريدُ حقوقي كراكب.","alternative":"أرغب في حقوقي كمسافر (حقوق المسافرين).","note":"Fahrgastrechte مصطلح مؤسسي = حقوق المسافرين؛ الصياغة الحالية سليمة مفهومة."},
  {"phrase":"على الشبكة","alternative":"عبر الإنترنت","note":"كلاهما فصيح؛ «عبر الإنترنت» أوسع شيوعاً في التعليم."},
  {"phrase":"العِوَضُ ينزلُ حسابَكم.","alternative":"ويُحوَّل الاسترداد إلى حسابكم.","note":"Erstattung أدقّ بـ«الاسترداد» من «العوض» (تعويض)؛ تركناها لأن المعنى قائم ولم نوسّع التعديل."},
  {"phrase":"بلا زيادةٍ في الثمن","alternative":"بلا رسومٍ إضافية","note":"ohne Aufpreis — الصياغتان صحيحتان."},
 ],
 "d-b1-17":[
  {"phrase":"أهلاً بالجميع","alternative":"أهلاً بكم","note":"الألماني «Willkommen» بلا «الجميع»؛ الإضافة تليق بمقام اللقاء فلم تُعدّل."},
  {"phrase":"جهةٌ راعية","alternative":"راعٍ / مموّل","note":"Sponsor — «راعٍ» أدقّ اختصاراً؛ «جهة راعية» مفهومة."},
  {"phrase":"فخدمتي تسبقُها","alternative":"فدوامي يبدأ أبكر","note":"Dienst = دوام/وردية؛ الصياغة الحالية مفهومة وسُجّلت بديلاً."},
 ],
 "d-b1-18":[
  {"phrase":"وسكونَ ليلٍ من العاشرة","alternative":"والهدوء الليلي من العاشرة مساءً","note":"التوضيح «مساءً» يزيل غموض صيغة 12 ساعة؛ الألماني يذكر 22 صراحةً."},
  {"phrase":"فلتبقَ مرّةً واحدة","alternative":"وليكن هذا مرّةً واحدة لا تتكرّر","note":"Das bleibt einmalig — الصياغة الحالية فصيحة ومفهومة."},
  {"phrase":"وإن نزلَ ضيوف","alternative":"وإن زارنا ضيوف","note":"Bei Gästen — «زارنا» أوسع فصاحة؛ «نزل» صحيحة."},
 ],
}

SOURCES={
 "d-b1-16":[
  {"id":"S1","citation":"Verbraucherzentrale: Erstattung bei Zugverspätung — 25% ab 60 Min., 50% ab 120 Min. (VO 2021/782)","url":"https://www.verbraucherzentrale.de/wissen/reise-mobilitaet/unterwegs-sein/erstattung-bei-zugverspaetung-so-gibts-geld-zurueck-12080"},
  {"id":"S2","citation":"EBA (Eisenbahn-Bundesamt): Fahrgastrechte im Bahnverkehr — Beispiele und Ausnahmen","url":"https://www.eba.bund.de/DE/Themen/Fahrgastrechte/Bahn/Beispiele_Ausnahmen/beispiele_ausnahmen_node.html"},
  {"id":"S3","citation":"bahn.de: Ihre Rechte als Fahrgast im Eisenbahnverkehr (Art. 18 Weiterreise/AJC, 3-Monats-Frist)","url":"https://www.bahn.de/service/informationen-buchung/fahrgastrechte/rechtliche-regelungen"},
  {"id":"S4","citation":"Süddeutsche Zeitung: Rechte für Bahnkunden — Garantiert Geld zurück (Formular, Kopie, Auszahlungsweg)","url":"https://www.sueddeutsche.de/reise/rechte-fuer-bahnkunden-garantiert-geld-zurueck-1.175938"},
 ],
 "d-b1-17":[
  {"id":"S5","citation":"Bildungsserver Berlin-Brandenburg: «Gemeinsame Sache machen — Eltern als Partner der Leseförderung» (Elternabend Lesen، Leseecke، Vorlesen)","url":"https://bildungsserver.berlin-brandenburg.de/fileadmin/bbb/schule/grundschulportal/publikationen_grundschule/Gemeinsame_Sache_machen_2015.pdf"},
  {"id":"S6","citation":"family-literacy.at: «Gemeinsam lesen» — Elternabend zum Leseprojekt، Vorlesen، Lesetagebuch","url":"https://www.family-literacy.at/static/media/familyliteracy/material/gemeinsam_lesen.pdf"},
  {"id":"S7","citation":"Persen Verlag: Erfolgreiche Elternarbeit — Ablauf des Elternabends (AGs، Lesestunden، Abschlussfeier)","url":"https://www.persen.de/media/ntx/persen/sample/23548DA1_Musterseite.pdf"},
 ],
 "d-b1-18":[
  {"id":"S8","citation":"wohnen-mit-kopf.de: Hausordnung & Ruhezeiten — Nachtruhe 22–6، Mittagsruhe","url":"https://wohnen-mit-kopf.de/mieten-kaufen/hausordnung-ruhezeiten/"},
  {"id":"S9","citation":"ImmobilienScout24: Nachtruhe in Mietwohnungen — 22 bis 6 Uhr، §117 OWiG، Ruhestörung","url":"https://www.immobilienscout24.de/wissen/mieten/nachtruhe.html"},
  {"id":"S10","citation":"fachanwalt.de: Ruhezeiten bei der Mietwohnung — Hausordnung hat Vorrang، Kinderlärm-Ausnahme","url":"https://www.fachanwalt.de/magazin/mietrecht/ruhezeiten-mietwohnung"},
  {"id":"S11","citation":"DWDS: schelten — jmdn. tadeln، Vorwürfe machen (Bedeutungsübersicht)","url":"https://www.dwds.de/wb/schelten"},
 ],
}

CONTENT_WARNINGS=[
 {"id":"W1","dialogue":"d-b1-16","field":"lines[1].de + questions[0].answer","statement":"«Bei fünfzig Minuten … fünfzehn Prozent des Preises» — نسبة 15% عند 50 دقيقة لا تطابق اللائحة السارية (EU) 2021/782: 25% عند تأخّر ≥60 دقيقة و50% عند ≥120 دقيقة، مع إلغاءات إضافية لـ«الظروف الاستثنائية» منذ 7 يونيو 2023.",
  "evidence":"Verbraucherzentrale (S1) · EBA (S2) · Finanztip/069verreist: Art. 19 VO 2021/782.","modified":False,
  "whyNotModified":"الألماني وأسئلة الحوار ومفاتيحها وإملاءاته محمية في هذه الدفعة (مراجعة عربية)؛ تصحيح الرقم يمسّ السؤال Q1 («fünfzehn Prozent des Preises») والإملاء L2 وسطر L1 معاً ويستلزم قرار محتوى مستقلاً.",
  "recommendation":"مهمة محتوى منفصلة (تعديل الرقم إلى 25% عند 60 دقيقة مع تحديث السؤال والخيار والإملاء والشرح) أو إبقاء السيناريو معلَّماً كأنه قديم/تبسيطي."},
]

by={d["id"]:d for d in D}
scope=[];units=lt=qt=dt=0
for did in SCOPE:
    dlg=by[did];lines=dlg["lines"];qs=dlg["questions"];dc=dlg.get("dictation") or []
    lu=sum(len([k for k in ln if k in ("who","de","ar")]) for ln in lines)
    qu=sum(len(q) for q in qs);u=4+lu+qu+len(dc)
    units+=u;lt+=len(lines);qt+=len(qs);dt+=len(dc)
    scope.append({"id":did,"level":dlg["level"],"titleDe":dlg["titleDe"],"titleAr":dlg["titleAr"],"lines":len(lines),"questions":len(qs),"dictation":len(dc),"units":u,"hasWaisenField":"waisen" in dlg,"who":sorted({ln["who"] for ln in lines})})

ah=[]
def walk(n):
    if isinstance(n,dict):
        if isinstance(n.get("id"),str) and n["id"] in SCOPE: ah.append(n["id"])
        for v in n.values(): walk(v)
    elif isinstance(n,list):
        for v in n: walk(v)
walk(AUDIO)
mh=[]
for tid in SCOPE: mh.extend(glob.glob(str(ROOT/"public"/"audio"/"**"/f"*{tid}*.mp3"),recursive=True))

rep={
 "reviewRule":"R118","date":"2026-10-08",
 "scope":"الدفعة B1 الخامسة d-b1-16..18 (شباك القطار/حقوق المسافر، لقاء أولياء الأمور/يوم القراءة، فضّ ضجيج الجيرة) — حوارات قصيرة بلا waisen.",
 "dialogues":scope,
 "totals":{"dialogues":3,"lines":lt,"questions":qt,"dictation":dt,"approximateUnits":units},
 "corrections":CORRECTIONS,"contextNotes":CONTEXT_NOTES,"styleAlternatives":STYLE_ALTERNATIVES,"sources":SOURCES,
 "contentWarnings":CONTENT_WARNINGS,
 "audio":{"manifestEntries":ah,"mp3Files":mh,"note":"لا استماع ولا ادعاء صوتي."},
 "waisen":{"present":False,"note":"الحوارات الثلاثة بلا حقل waisen (فحص صريح لكل كائن)."},
 "judgement":{"correct":units-len(CORRECTIONS),"corrected":len(CORRECTIONS),"unresolved":0,
  "note":"أربعة عشر تصحيحاً عربياً مؤكداً: اتفاق صيغة Sie→جمع (d-b1-16: لكم/عبِّئوا/حسابَكم/احتفظوا — d-b1-18: أحسنتم/أُخبِرُكم/فاطرقوا)، تصحيح معانٍ (ausfallen=أُلغي لا فاتني، Erstattung-Verweis، Einladung=الدعوة لا الرسالة، planen=نُخطِّط لا نجعل، Ruhezeiten=أوقات السكون، Ruhe=هدوء، Musik=موسيقى، Bescheid sagen=إخبار لا إنذار، schelten=توبيخ لا شكوى)، إزالة إضافات غير موجودة في الألماني (أسبوعياً/بعض الآباء، عندهم، في النظام، لهذا السبب، مباراة ×2، الجميع متروك كبديل)، وإصلاح أفعال موضوعة في غير صيغتها (فقَرِعَ→فاطرقوا، عهد متفق→اتفقنا، نجعلُه→نُخطِّط). الألماني/who/الأسئلة/المفاتيح/الإملاءات/الخيارات/الشرح مقفلة لم تُعدَّل."},
 "limits":{"cefr":"لم يُعد تقييم CEFR أو النسبة.","audio":"لا استماع ولا توليد صوتي.","human":"ليست مراجعة بشرية.","legal":"حقوق المسافر (فارغاسترخت) وسكون البناية سياق تعليمي ولا يُعدّان مشورة قانونية.","professional":"سياق المدرسة/الأهالي دراسي ولا يُعدّ دليلاً تربوياً معتمداً."},
 "gates":{"planned":"K192a–j"},
}
OUT_JSON.parent.mkdir(parents=True,exist_ok=True)
OUT_JSON.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
md=[]
md.append("# مراجعة حوارات B1 دفعة 05: d-b1-16–d-b1-18\n\n")
md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R118 · **البوابات:** K192a–j\n\n")
md.append("## النطاق\n\n");md.append(f"{rep['scope']}\n\n")
md.append("## الإجمالي\n\n");t=rep["totals"]
md.append(f"- حوارات: **{t['dialogues']}** · أسطر: **{t['lines']}** · أسئلة: **{t['questions']}** · إملاءات: **{t['dictation']}** · وحدات≈**{t['approximateUnits']}**\n\n")
md.append("## الحكم\n\n");j=rep["judgement"]
md.append(f"- **سليمة:** {j['correct']} · **مصححة:** {j['corrected']} · **غير محسومة:** {j['unresolved']}\n- {j['note']}\n\n")
md.append("## التصحيحات المطبقة\n\n")
for c in rep["corrections"]: md.append(f"- `{c['unit']}`: من «{c['old']}» إلى «{c['new']}» — {c['rationale']}\n")
md.append("\n## تحذيرات محتوى (غير معدّلة)\n\n")
for w in rep["contentWarnings"]:
    md.append(f"### {w['id']} — {w['dialogue']} · `{w['field']}`\n")
    md.append(f"- **الملاحظة:** {w['statement']}\n")
    md.append(f"- **الأدلة:** {w['evidence']}\n")
    md.append(f"- **معدّلة؟:** {'نعم' if w['modified'] else 'لا'} — {w['whyNotModified']}\n")
    md.append(f"- **التوصية:** {w['recommendation']}\n")
md.append("\n## ملاحظات سياقية (غير معدّلة)\n\n")
for did,ns in rep["contextNotes"].items():
    md.append(f"### {did}\n")
    for n in ns: md.append(f"- {n['note']}\n  - المصدر: {n['source']}\n")
md.append("\n## بدائل أسلوبية (غير معدّلة)\n\n")
for did,al in rep["styleAlternatives"].items():
    md.append(f"### {did}\n")
    for a in al: md.append(f"- `{a['phrase']}` — بديل: `{a['alternative']}` — {a['note']}\n")
md.append("\n## المصادر\n\n");ts=0
for did,sl in rep["sources"].items():
    md.append(f"### {did}\n")
    for s in sl: md.append(f"- [{s['id']}] {s['citation']} — {s['url']}\n");ts+=1
md.append(f"\n(مجموع المراجع: {ts}.)\n\n")
md.append("## الصوت\n\n")
md.append(f"- إدخالات بيان صوتي: {rep['audio']['manifestEntries'] or 'لا يوجد'}.\n- ملفات mp3: {rep['audio']['mp3Files'] or 'لا يوجد'}.\n- {rep['audio']['note']}\n\n")
md.append("## البطاقات اليتيمة\n\n- "+rep["waisen"]["note"]+"\n\n")
md.append("## الحدود\n\n")
for k,v in rep["limits"].items(): md.append(f"- **{k}:** {v}\n")
OUT_MD.write_text("".join(md),encoding="utf-8")
print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
print(f"  lines={lt} q={qt} dict={dt} ≈units={units} corrections={len(CORRECTIONS)} warnings={len(CONTENT_WARNINGS)}")
print(f"  sources={ts} audio={len(ah)}/{len(mh)}")

if __name__=="__main__": pass
