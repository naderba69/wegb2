"""
Adversarial-Read-Fix (Package 2b): a1-weil-e3 war mehrdeutig.
„Ich weiß, ___ du kommst“ — weil ist dort grammatisch möglich (kausal),
wird aber als falsch markiert. Ersetzt durch eine eindeutige Wahl:
Nebensatz-Bedingung -> nur „Weil“ passt; plus fill für dass-Verb-Ende.
"""
import json, pathlib, sys, re
ROOT = pathlib.Path(__file__).resolve().parents[2]
G = ROOT / "content" / "grammar.json"
data = json.loads(G.read_text(encoding="utf-8"))
les = data["a1-weil-dass"]
AR = re.compile(r"[\u0600-\u06FF]")

e3 = next((e for e in les["exercises"] if e.get("id") == "a1-weil-e3"), None)
assert e3 is not None, "a1-weil-e3 nicht gefunden"
e3["promptDe"] = "___ du krank bist, darfst du heute zuhause bleiben."
e3["options"] = ["Weil", "Dass", "Ob"]
e3["answer"] = "Weil"
e3["explanationAr"] = "weil يفتح سبباً: «لأنّك مريض…». dass/ob لا يفتحان جملة شرط في هذا التركيب."

if not any(e.get("id") == "a1-weil-e6" for e in les["exercises"]):
    les["exercises"].append({
        "id": "a1-weil-e6",
        "type": "fill",
        "promptDe": "Sie sagt, dass sie morgen früh ___. (kommen)",
        "answer": ["kommt"],
        "explanationAr": "بعد dass: المصرَّف kommt في نهاية الجملة التابعة.",
    })

viol = []
for ex in les["exercises"]:
    if ex["type"] in ("mc", "order", "umformung", "truefalse", "dictation") and AR.search(ex.get("promptDe", "") or ""):
        viol.append(f"{ex.get('id')}: arabisch in promptDe")
    if not AR.search(ex.get("explanationAr", "") or ""):
        viol.append(f"{ex.get('id')}: explanationAr ohne Arabisch")
    if ex["type"] == "mc":
        if ex.get("answer") not in (ex.get("options") or []): viol.append(f"{ex.get('id')}: Antwort nicht in Optionen")
        if not (3 <= len(ex.get("options") or []) <= 4): viol.append(f"{ex.get('id')}: Optionenzahl")
ids = [e.get("id") for e in les["exercises"] if e.get("id")]
if len(ids) != len(set(ids)): viol.append("doppelte IDs in a1-weil-dass")
if viol:
    print("PRE-FLIGHT:"); [print(" -", v) for v in viol]; sys.exit(2)

G.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"ok: a1-weil-dass jetzt {len(les['exercises'])} Uebungen, mc eindeutig")
