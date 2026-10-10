#!/usr/bin/env python3
"""Transform the skeleton report_b2_dialogues_07.py (copied from _06) for R129."""
import re, json, ast
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
REP=ROOT/"scripts/patches/report_b2_dialogues_07.py"
s=REP.read_text(encoding="utf-8")

# Simple string substitutes
simple=[
 ('R128 — review report for sixth B2 batch d-b2-16..d-b2-18."""',
  'R129 — review report for seventh B2 batch d-b2-19..d-b2-21."""'),
 ('SCOPE = ["d-b2-16", "d-b2-17", "d-b2-18"]',
  'SCOPE = ["d-b2-19", "d-b2-20", "d-b2-21"]'),
 ('OUT_JSON = ROOT / "docs/content-review-b2-dialogues-06-2026-10-08.json"',
  'OUT_JSON = ROOT / "docs/content-review-b2-dialogues-07-2026-10-08.json"'),
 ('OUT_MD = ROOT / "docs/content-review-b2-dialogues-06-2026-10-08.md"',
  'OUT_MD = ROOT / "docs/content-review-b2-dialogues-07-2026-10-08.md"'),
 ('"reviewRule": "R128"','"reviewRule": "R129"'),
 ('"gates": {"planned": "K202a–j"}','"gates": {"planned": "K203a–j"}'),
 ('K202','K203'),
 ('# مراجعة حوارات B2 دفعة 06: d-b2-16–d-b2-18','# مراجعة حوارات B2 دفعة 07: d-b2-19–d-b2-21'),
 ('**القاعدة:** R128 · **البوابات:** K202a–j','**القاعدة:** R129 · **البوابات:** K203a–j'),
]
for a,b in simple:
    if a not in s: print("MISS",a[:60])
    s=s.replace(a,b)

# Replace title in docstring/scope phrase
s=s.replace("سابع عشرة دفعة B2 (d-b2-16–d-b2-18)",
            "ثامن عشرة دفعة B2 (d-b2-19–d-b2-21)")
s=s.replace("خامس دفعة B2","سابع دفعة B2")  # leftover if any
s=s.replace("سادس دفعة B2: d-b2-16..18 (تبديل موعد دورة، تكاليف التدريب مع صاحب العمل، إنهاء عقد التأمين الصحي)",
            "سابع دفعة B2: d-b2-19..21 (نزاع فريق وتوسّط، تأمين الرعاية وتقدير اللجنة، تفاوض على قرض تعليمي)")

# Build CORRECTIONS from the review patch
patch_src=(ROOT/"scripts/patches/review_b2_dialogues_07.py").read_text(encoding="utf-8")
m=re.search(r"^FIXES = (\{.*?^\})",patch_src,re.MULTILINE|re.DOTALL)
FIXES=ast.literal_eval(m.group(1))
order={"d-b2-19":[0,1,2,3,4,5,6,7],  # 8 lines
       "d-b2-20":[0,2,3,4,6,7],      # 6
       "d-b2-21":[1,2,6,7]}          # 4
# Compute actual line indices in FIXES order (FIXES lists pairs in sequence; determine each line index by searching the original AR)
orig=json.loads((ROOT/"content/dialogues.json").read_text(encoding="utf-8"))
# But current content/dialogues.json is already patched — check it out to read original
import subprocess
subprocess.run(["git","checkout","content/dialogues.json"],check=True,cwd=ROOT)
orig=json.loads((ROOT/"content/dialogues.json").read_text(encoding="utf-8"))
by_id={d["id"]:d for d in orig}
rat={
 ("d-b2-19",0):"zweimal gekippt=أُلغي مرتين، ohne Rückmeldung=دون رد.",
 ("d-b2-19",1):"selbst unternommen=فعلتِ بنفسك.",
 ("d-b2-19",2):"Kritik sachlich formuliert=صغتُ النقدَ بموضوعية (لا «اعتراض»).",
 ("d-b2-19",3):"setzen wir einen runden Tisch=نُقيم طاولة مستديرة.",
 ("d-b2-19",4):"Lieferfristen statt Zurufe im Flur=مواعيد مُلزِمة بدلاً من مناداة في الممر.",
 ("d-b2-19",5):"gegenzeichnen=يوقِّعُه (توقيع مقابل)، حذف «جميعاً» الزائد.",
 ("d-b2-19",6):"bis Mittwoch=بحلول الأربعاء (لا «إلى»); حذف «لا أكثر».",
 ("d-b2-19",7):"Wiedervorlage=إعادة طرح، verpufft=يذهب سدى.",
 ("d-b2-20",0):"Schlaganfall=سكتة دماغية (لا جلطة=Thrombose).",
 ("d-b2-20",2):"braucht Hilfe beim Waschen und Anziehen=يحتاج مساعدة في الغسل والارتداء.",
 ("d-b2-20",3):"Nächtliche Unruhe=اضطراب ليلي، Sturzangst=خوف السقوط، Tagebuch=اليوميات.",
 ("d-b2-20",4):"zweiwöchige Liste=قائمة الأسبوعين (لا الأسبوعية).",
 ("d-b2-20",6):"Bescheid=الرد، zu knapp=متدنياً (لا «بخيل»).",
 ("d-b2-20",7):"Schriftlich binnen 25 AT=خطياً خلال 25 يوم عمل، Widerspruch=اعتراض عند التدني.",
 ("d-b2-21",1):"Höchstbetrag staatlich gedeckelt=مسقوف حكومياً (لا «مكفول اتحادياً»)، zinsgünstig=ميسَّر الفائدة (لا «الربا»)، Bürgschaft=كفالة.",
 ("d-b2-21",2):"zweites Berufsjahr=سنتين من مزاولة المهنة.",
 ("d-b2-21",6):"Sonderzahlung=دفعات استثنائية (لا «مكافأة»)، Sondertilgung=تسديد إضافي.",
 ("d-b2-21",7):"im Bescheid fixieren=نُثبِّته في الإشعار، eID=الهوية الرقمية.",
}
corr=[]
for did,pairs in FIXES.items():
    lines=by_id[did]["lines"]; used=set()
    for j,(o,n) in enumerate(pairs):
        li=None
        for i,ln in enumerate(lines):
            if i in used: continue
            if ln["ar"]==o: li=i; used.add(i); break
        assert li is not None, f"unmatched in {did}: {o[:40]}"
        corr.append({"unit":f"{did}.lines[{li}].ar","old":o,"new":n,"rationale":rat[(did,li)]})
assert len(corr)==18

# Re-apply patch now that we've captured originals
subprocess.run(["python3","scripts/patches/review_b2_dialogues_07.py"],check=True,cwd=ROOT)

# Replace CORRECTIONS block
m=re.search(r"^CORRECTIONS = \[.*?^\]", s, re.MULTILINE|re.DOTALL); assert m
s=s[:m.start()]+"CORRECTIONS = "+json.dumps(corr,ensure_ascii=False,indent=1)+s[m.end():]

# Replace judgement note
note=("ثمانية عشر تصحيحاً عربياً مؤكداً — d-b2-19 (8): gekippt=أُلغي، Rückmeldung=ردّ، selbst=بنفسك، Kritik=النقد (لا اعتراض)، runden Tisch=طاولة مستديرة/نُقيم، Lieferfristen statt Zurufe=بدلاً من المناداة، gegenzeichnen=توقيع مقابل (حذف «جميعاً»)، bis Mittwoch=بحلول الأربعاء، Wiedervorlage=إعادة طرح/verpufft=سدىً؛ "
      "d-b2-20 (6): Schlaganfall=سكتة دماغية (لا جلطة)، Hilfe beim Waschen/Anziehen=مساعدة غسل/ارتداء، Nächtliche Unruhe=اضطراب ليلي/Tagebuch=اليوميات، zweiwöchige Liste=قائمة الأسبوعين، Bescheid=رد/zu knapp=متدنياً (لا بخيل)، Widerspruch=اعتراض؛ "
      "d-b2-21 (4): gedeckelt=مسقوف حكومياً/zinsgünstig=ميسَّر الفائدة (لا ربا)/Bürgschaft=كفالة، zweites Berufsjahr=سنتين مزاولة، Sonderzahlung/Sondertilgung=دفعات استثنائية/تسديد إضافي، Bescheid=إشعار/eID=هوية رقمية. "
      "لا تحذيرات محتوى جديدة؛ W1–W6 تبقى مفتوحة. الألماني/who/الأسئلة/المفاتيح/الإملاءات مقفلة.")
m=re.search(r'"note": ".*?"limits"', s, re.DOTALL)
# simpler: find '"note": "' near top after "judgement"
i=s.find('"note": "', s.find('"judgement"'))
j=s.find('","limits"',i)
assert i>0 and j>0
s=s[:i]+'"note": "'+note+s[j:]

# Set corrected/correct counts
s=s.replace('"correct": units - 19, "corrected": 19,', '"correct": units - 18, "corrected": 18,')

# Replace content blocks (CONTEXT_NOTES / STYLE_ALTERNATIVES / SOURCES / CONTENT_CHECKS) via line-boundary replace
def replace_block(s, name, replacement):
    start=s.find(f"{name} = ")
    if start<0: return s
    m=re.search(r"\n[A-Z_]+ = ", s[start+20:])
    end=start+20+m.start() if m else len(s)
    return s[:start]+replacement+s[end:]

ctx="""CONTEXT_NOTES = {
 "d-b2-19": [
  {"note": "«Die Absprache ist zweimal gekippt» = أُلغي الاتفاق مرتين؛ «ohne Rückmeldung» من دون رد/إشعار.", "source": "DWDS: kippen (Vereinbarung)"},
  {"note": "«Kritik sachlich formuliert — per Mail nicht im Chat» = صياغة النقد بموضوعية بالبريد لا بالمحادثة (شاهد Q1 «per Mail mit datierten Protokollen»).", "source": "d-b2-19-q1"},
  {"note": "«Protokoll mit Fristen, das beide gegenzeichnen / Wiedervorlage nach sechs Wochen» = محضر بمواعيد بتوقيع الطرفين وإعادة طرح بعد ستة أسابيع لئلا يذهب سدى — هو ما يُولّد الضغط (Q3).", "source": "d-b2-19-q3"},
 ],
 "d-b2-20": [
  {"note": "«Schlaganfall» = سكتة دماغية (لا جلطة/Thrombose). Pflegegrad يُقدَّر بالاستقلالية لا بالتشخيص.", "source": "d-b2-20-q0"},
  {"note": "«zweiwöchige Liste mit Uhrzeiten» قائمة أسبوعين بالمواعيد؛ «Tagebuch» يوميات الحالة لليلي والخوف من السقوط.", "source": "d-b2-20-q1"},
  {"note": "«schriftlich binnen 25 Arbeitstagen / bei zu knapper Bewertung: Widerspruch» الرد خطياً خلال 25 يوم عمل، والاعتراض عند التدني.", "source": "d-b2-20-q2"},
 ],
 "d-b2-21": [
  {"note": "«Höchstbetrag staatlich gedeckelt» الحد الأقصى مسقوف حكومياً؛ «zinsgünstiges Darlehen mit Bürgschaft» قرض ميسَّر الفائدة بكفالة.", "source": "d-b2-21-q0"},
  {"note": "«Karenzzeit bis 18 Monate/Zinsen gestundet» مهلة سماح 18 شهراً والفوائد مؤجَّلة (Q1). «Tilgungsrate 120–200 € عند راتب البداية» (Q2).", "source": "d-b2-21-q1/q2"},
  {"note": "«Sonderzahlung zweimal jährlich/Sondertilgung» دفعات استثنائية مرتين سنوياً وتسديد إضافي متفق عليه.", "source": "d-b2-21.L6"},
 ],
}"""
s=replace_block(s,"CONTEXT_NOTES",ctx)

style="""STYLE_ALTERNATIVES = {
 "d-b2-19": [
  {"phrase": "نُقيمُ طاولةً مستديرة", "alternative": "ندعو إلى طاولة مستديرة", "note": "«setzen wir»."},
  {"phrase": "لئلا يذهبَ الأثرُ سدىً", "alternative": "كي لا يتبخّر", "note": "«verpufft»."},
  {"phrase": "بدلاً من المناداة", "alternative": "لا مناداة", "note": "«statt Zurufen»."},
 ],
 "d-b2-20": [
  {"phrase": "سكتةٌ دماغيةٌ", "alternative": "سكتة دماغيّة", "note": "«Schlaganfall»."},
  {"phrase": "متدنياً", "alternative": "متدنّ", "note": "«zu knapp»."},
  {"phrase": "قائمة الأسبوعين", "alternative": "قائمة أسبوعين", "note": "«zweiwöchige Liste»."},
 ],
 "d-b2-21": [
  {"phrase": "مسقوفٌ حكومياً", "alternative": "محدد بقانون", "note": "«staatlich gedeckelt»."},
  {"phrase": "ميسَّرُ الفائدة", "alternative": "مخفّض الفائدة", "note": "«zinsgünstig»."},
  {"phrase": "دفعتين استثنائيتين", "alternative": "سدادين خاصّين", "note": "«Sonderzahlung/Sondertilgung»."},
 ],
}"""
s=replace_block(s,"STYLE_ALTERNATIVES",style)

sources="""SOURCES = {
 "d-b2-19": [
  {"id": "S1", "citation": "DWDS: kippen (Vereinbarung) = إلغاء/إفشال.", "url": "https://www.dwds.de/wb/kippen"},
  {"id": "S2", "citation": "DWDS: gegenzeichnen = توقيع مقابل/توقيع مضاد.", "url": "https://www.dwds.de/wb/gegenzeichnen"},
  {"id": "S3", "citation": "DWDS: Wiedervorlage=إعادة طرح/عرض؛ verpuffen=يذهب سدى.", "url": "https://www.dwds.de/wb/verpuffen"},
  {"id": "S4", "citation": "مقارنة داخلية: Protokoll=محضر، sachlich=بموضوعية (R127).", "url": "content/dialogues.json"},
 ],
 "d-b2-20": [
  {"id": "S5", "citation": "Duden: Schlaganfall = سكتة دماغية (ليست «جلطة»).", "url": "https://www.duden.de/rechtschreibung/Schlaganfall"},
  {"id": "S6", "citation": "DWDS: Pflegegrad (1–5) يقيّم الاستقلالية؛ MD/Begutachtung.", "url": "https://www.duden.de/rechtschreibung/Pflegegrad"},
  {"id": "S7", "citation": "DWDS: Widerspruch = اعتراض (قفل سابق في R127).", "url": "https://www.dwds.de/wb/Widerspruch"},
  {"id": "S8", "citation": "Duden: binnen 25 Arbeitstagen = خلال 25 يوم عمل.", "url": "https://www.duden.de/rechtschreibung/binnen"},
 ],
 "d-b2-21": [
  {"id": "S9", "citation": "DWDS: deckeln = تحديد/سقف الحد الأقصى.", "url": "https://www.dwds.de/wb/deckeln"},
  {"id": "S10", "citation": "Duden: zinsgünstig = ميسَّر الفائدة (لا علاقة بـ«الربا» المحرّم).", "url": "https://www.duden.de/rechtschreibung/zinsguenstig"},
  {"id": "S11", "citation": "DWDS: Bürgschaft=كفالة؛ Karenzzeit=مهلة سماح؛ Sondertilgung=تسديد استثنائي.", "url": "https://www.dwds.de/wb/Sondertilgung"},
  {"id": "S12", "citation": "Duden: Bescheid = إشعار/قرار إداري.", "url": "https://www.duden.de/rechtschreibung/Bescheid"},
 ],
}"""
s=replace_block(s,"SOURCES",sources)

checks="""CONTENT_CHECKS = [
 "d-b2-19: سير الوساطة متسق: شكوى من إلغاء اتفاق مرتين دون رد → توثيق بالبريد (لا بالشات) → طاولة مستديرة كل جهة تذكر 3 حاجات → محضر بمواعيد بتوقيع الطرفين + إعادة طرح بعد 6 أسابيع. Q1/Q2/Q3 مفاتيح مطابقة.",
 "d-b2-20: إجراءات تقدير Pflegegrad متسقة: سكتة دماغية → تقييم الاستقلالية (لا التشخيص) → حاجة صباحية للغسل/الارتداء، اضطراب ليلي وخوف السقوط في اليوميات → قائمة أسبوعين → درجة 2–3 بحسب المسافة داخل الشقة → رد خلال 25 يوم عمل واعتراض عند التدني. Q0/Q1/Q2 مفاتيح مطابقة.",
 "d-b2-21: تفاوض القرض التعليمي متسق: الحد الأقصى مسقوف + قرض ميسَّر بكفالة → سداد بعد سنتين من مزاولة المهنة → مهلة سماح 18 شهراً والفوائد مؤجلة → قسط 120–200€ → دفعات استثنائية مرتين → تثبيت في الإشعار بتوقيع إلكتروني بهوية رقمية. Q0/Q1/Q2 مفاتيح مطابقة.",
 "لا تحذيرات محتوى جديدة؛ W1–W6 مفتوحة في مواضعها.",
]"""
# Replace CONTENT_WARNINGS [] before CONTENT_CHECKS placeholder insert
# First empty CONTENT_WARNINGS (keep empty list at its current spot):
s=re.sub(r"^CONTENT_WARNINGS = \[.*?^\]\n", "CONTENT_WARNINGS = []\n", s, count=1, flags=re.MULTILINE|re.DOTALL)
# Insert CONTENT_CHECKS right before 'def build_report' or before "CORRECTIONS_BY_DIALOGUE" — find the '"""' docstring end + first use
# Easier: look for existing CONTENT_CHECKS = [...] block and replace; if none, insert after CONTENT_WARNINGS
m=re.search(r"^CONTENT_CHECKS = \[.*?^\]\n", s, re.MULTILINE|re.DOTALL)
if m:
    s=s[:m.start()]+checks+"\n"+s[m.end():]
else:
    i=s.find("CONTENT_WARNINGS = []\n")+len("CONTENT_WARNINGS = []\n")
    s=s[:i]+checks+"\n"+s[i:]

REP.write_text(s,encoding="utf-8")
print("report_b2_dialogues_07.py rewritten for R129")
