#!/usr/bin/env python3
"""R144a: deduplicate B2 vocabulary and repair colors, collocations and corpus links."""
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOCAB_PATH = ROOT / "content" / "vocab.json"
REPEAT_PATH = ROOT / "content" / "vocab-repeats.json"
SENTENCE_PATH = ROOT / "content" / "sentences.json"
KOLLOCATION_PATH = ROOT / "content" / "kollokationen.json"
KOLLOCATION_EXCEPTION_PATH = ROOT / "content" / "kollok-ausnahmen.json"
ANTONYME_PATH = ROOT / "content" / "antonyme.json"
ANT_AUSNAHMEN_PATH = ROOT / "content" / "ant-ausnahmen.json"
LEVEL_ORDER = {"A0": 0, "A1": 1, "A2": 2, "B1": 3, "B2": 4}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def normalize(de):
    return " ".join(de.strip().lower().split())


def collect_cards(value, result):
    if isinstance(value, list):
        for item in value:
            collect_cards(item, result)
    elif isinstance(value, dict):
        if isinstance(value.get("id"), str) and isinstance(value.get("de"), str):
            result[value["id"]] = value
        for item in value.values():
            collect_cards(item, result)


# Replace redundant B2 cards with distinct, level-appropriate vocabulary.
# Existing deck IDs, levels, tags and examples' bilingual pairing stay intact.
REPLACEMENTS = {
    "v1443": {
        "de": "der Strukturwandel", "ar": "التحول الهيكلي", "pos": "Nomen", "article": "der",
        "exampleDe": "Der Strukturwandel verändert die Wirtschaftsstruktur vieler Regionen.",
        "exampleAr": "يغيّر التحول الهيكلي البنية الاقتصادية لمناطق كثيرة.",
    },
    "v1431": {
        "de": "das Forschungsvorhaben", "ar": "المشروع البحثي", "pos": "Nomen", "article": "das",
        "exampleDe": "Das Forschungsvorhaben untersucht den Einfluss von Schlaf auf das Lernen.",
        "exampleAr": "يدرس المشروع البحثي أثر النوم في التعلّم.",
    },
    "v1441": {
        "de": "die Folgewirkung", "ar": "الأثر اللاحق", "pos": "Nomen", "article": "die",
        "exampleDe": "Eine unerwartete Folgewirkung der Reform ist die höhere Nachfrage.",
        "exampleAr": "من الآثار اللاحقة غير المتوقعة للإصلاح ارتفاع الطلب.",
    },
    "b2-politik-demokratie-014": {
        "de": "die politische Teilhabe", "ar": "المشاركة السياسية", "pos": "Nomen", "article": "die",
        "exampleDe": "Politische Teilhabe setzt verlässliche Informationen voraus.",
        "exampleAr": "تفترض المشاركة السياسية توافر معلومات موثوقة.",
    },
    "v1448": {
        "de": "die Datenverarbeitung", "ar": "معالجة البيانات", "pos": "Nomen", "article": "die",
        "exampleDe": "Bei der Datenverarbeitung müssen personenbezogene Informationen geschützt werden.",
        "exampleAr": "يجب حماية المعلومات الشخصية عند معالجة البيانات.",
    },
    "v1446": {
        "de": "das maschinelle Lernen", "ar": "التعلّم الآلي", "pos": "Nomen", "article": "das",
        "exampleDe": "Maschinelles Lernen kann Muster in großen Datensätzen erkennen.",
        "exampleAr": "يمكن للتعلّم الآلي اكتشاف أنماط في مجموعات بيانات كبيرة.",
    },
    "v1449": {
        "de": "die Prozessautomatisierung", "ar": "أتمتة العمليات", "pos": "Nomen", "article": "die",
        "exampleDe": "Die Prozessautomatisierung kann wiederkehrende Arbeitsschritte beschleunigen.",
        "exampleAr": "يمكن لأتمتة العمليات تسريع خطوات العمل المتكررة.",
    },
    "v1435": {
        "de": "die Prämisse", "ar": "المقدّمة المنطقية", "pos": "Nomen", "article": "die",
        "exampleDe": "Die Prämisse der Studie wird im Diskussionsteil kritisch hinterfragt.",
        "exampleAr": "تُراجع المقدّمة المنطقية للدراسة نقدياً في قسم المناقشة.",
    },
    "v1439": {
        "de": "interpretieren", "ar": "يفسّر", "pos": "Verb",
        "exampleDe": "Die Forschenden interpretieren die Ergebnisse vorsichtig.",
        "exampleAr": "يفسّر الباحثون النتائج بحذر.",
    },
    "v1451": {
        "de": "die Ressourcenschonung", "ar": "ترشيد استخدام الموارد", "pos": "Nomen", "article": "die",
        "exampleDe": "Ressourcenschonung beginnt mit einem bewussten Umgang mit Energie und Wasser.",
        "exampleAr": "يبدأ ترشيد استخدام الموارد بالتعامل الواعي مع الطاقة والماء.",
    },
    "b2-politik-demokratie-028": {
        "de": "die Zukunftsfähigkeit", "ar": "القدرة على الاستمرار مستقبلاً", "pos": "Nomen", "article": "die",
        "exampleDe": "Die Zukunftsfähigkeit einer Stadt hängt auch von bezahlbarem Wohnraum ab.",
        "exampleAr": "تعتمد قدرة المدينة على الاستمرار مستقبلاً أيضاً على توافر سكن ميسور التكلفة.",
    },
    "v1452": {
        "de": "emissionsarm", "ar": "منخفض الانبعاثات", "pos": "Adjektiv", "ant": ["emissionsintensiv"],
        "exampleDe": "Der neue Stadtbus fährt emissionsarm durch die Innenstadt.",
        "exampleAr": "تسير الحافلة الجديدة منخفضة الانبعاثات عبر وسط المدينة.",
    },
    "b2-politik-demokratie-033": {
        "de": "die Preissteigerung", "ar": "ارتفاع الأسعار", "pos": "Nomen", "article": "die",
        "exampleDe": "Starke Preissteigerungen belasten Haushalte mit geringem Einkommen.",
        "exampleAr": "تثقل الزيادات الكبيرة في الأسعار كاهل الأسر ذات الدخل المنخفض.",
    },
    "b2-politik-demokratie-008": {
        "de": "der Verfassungsstaat", "ar": "الدولة الدستورية", "pos": "Nomen", "article": "der",
        "exampleDe": "Im Verfassungsstaat sind staatliche Entscheidungen an die Verfassung gebunden.",
        "exampleAr": "تلتزم قرارات الدولة في الدولة الدستورية بأحكام الدستور.",
    },
    "b2-politik-demokratie-015": {
        "de": "die Medienaufsicht", "ar": "الرقابة على وسائل الإعلام", "pos": "Nomen", "article": "die",
        "exampleDe": "Die Medienaufsicht prüft, ob Anbieter gesetzliche Regeln einhalten.",
        "exampleAr": "تتحقق جهة الرقابة الإعلامية من التزام الجهات المقدّمة بالقواعد القانونية.",
    },
    "b2-politik-demokratie-013": {
        "de": "die Wahlbeteiligung", "ar": "المشاركة في الانتخابات", "pos": "Nomen", "article": "die",
        "exampleDe": "Eine hohe Wahlbeteiligung kann die demokratische Legitimation stärken.",
        "exampleAr": "يمكن للمشاركة الواسعة في الانتخابات أن تعزز الشرعية الديمقراطية.",
    },
    "b2-politik-demokratie-006": {
        "de": "die Gesetzgebung", "ar": "سنّ القوانين", "pos": "Nomen", "article": "die",
        "exampleDe": "Die Gesetzgebung auf Bundesebene umfasst mehrere Schritte.",
        "exampleAr": "تشمل عملية سنّ القوانين على المستوى الاتحادي عدة خطوات.",
    },
    "b2-politik-demokratie-007": {
        "de": "die Ländervertretung", "ar": "تمثيل الولايات", "pos": "Nomen", "article": "die",
        "exampleDe": "Die Ländervertretung im Bundesrat bringt Interessen der Länder in die Bundespolitik ein.",
        "exampleAr": "ينقل تمثيل الولايات في البوندسرات مصالحها إلى السياسة الاتحادية.",
    },
    "v1438": {
        "de": "untermauern", "ar": "يدعم بالأدلة", "pos": "Verb",
        "exampleDe": "Die Ergebnisse untermauern die zentrale These der Studie.",
        "exampleAr": "تدعم النتائج الأطروحة الأساسية للدراسة بالأدلة.",
    },
    "b2-politik-demokratie-026": {
        "de": "der Welthandel", "ar": "التجارة العالمية", "pos": "Nomen", "article": "der",
        "exampleDe": "Der Welthandel reagiert empfindlich auf politische Konflikte.",
        "exampleAr": "يتأثر نشاط التجارة العالمية سريعاً بالنزاعات السياسية.",
    },
}

# Short, idiomatic collocations make each replacement usable and keep the B2
# card bank fully supported by its collocation exercise.
COLLOCATIONS = {
    "v1443": ["den Strukturwandel gestalten", "der Strukturwandel der Wirtschaft", "einen tiefgreifenden Strukturwandel auslösen"],
    "v1431": ["ein Forschungsvorhaben durchführen", "ein Forschungsvorhaben beantragen", "ein interdisziplinäres Forschungsvorhaben"],
    "v1441": ["eine unbeabsichtigte Folgewirkung", "Folgewirkungen berücksichtigen", "langfristige Folgewirkungen abschätzen"],
    "b2-politik-demokratie-014": ["politische Teilhabe ermöglichen", "politische Teilhabe fördern", "politische Teilhabe stärken"],
    "v1448": ["eine sichere Datenverarbeitung gewährleisten", "Datenverarbeitung im Auftrag", "personenbezogene Datenverarbeitung"],
    "v1446": ["maschinelles Lernen anwenden", "Methoden des maschinellen Lernens", "Algorithmen für maschinelles Lernen"],
    "v1449": ["die Prozessautomatisierung einführen", "Prozessautomatisierung in der Produktion", "Prozessautomatisierung und Qualitätssicherung"],
    "v1435": ["eine Prämisse kritisch hinterfragen", "von derselben Prämisse ausgehen", "die zentrale Prämisse der Studie"],
    "v1439": ["Daten sorgfältig interpretieren", "Ergebnisse vorsichtig interpretieren", "eine Aussage anders interpretieren"],
    "v1451": ["Ressourcenschonung im Alltag fördern", "Ressourcenschonung und Energieeffizienz", "Maßnahmen zur Ressourcenschonung ergreifen"],
    "b2-politik-demokratie-028": ["die Zukunftsfähigkeit sichern", "Zukunftsfähigkeit der Region stärken", "langfristige Zukunftsfähigkeit gewährleisten"],
    "v1452": ["emissionsarme Antriebe entwickeln", "emissionsarm unterwegs sein", "emissionsarme Busse einsetzen"],
    "b2-politik-demokratie-033": ["starke Preissteigerungen abfedern", "unerwartete Preissteigerungen erklären", "mit einer Preissteigerung rechnen"],
    "b2-politik-demokratie-008": ["den Verfassungsstaat stärken", "im demokratischen Verfassungsstaat", "Prinzipien des Verfassungsstaats achten"],
    "b2-politik-demokratie-015": ["unabhängige Medienaufsicht stärken", "Aufgaben der Medienaufsicht", "unter staatlicher Medienaufsicht"],
    "b2-politik-demokratie-013": ["die Wahlbeteiligung steigern", "hohe Wahlbeteiligung fördern", "bei niedriger Wahlbeteiligung"],
    "b2-politik-demokratie-006": ["die Gesetzgebung reformieren", "an der Gesetzgebung mitwirken", "Gesetzgebung auf Bundesebene"],
    "b2-politik-demokratie-007": ["die Ländervertretung im Bundesrat", "eine starke Ländervertretung", "Interessen in der Ländervertretung vertreten"],
    "v1438": ["eine These mit Belegen untermauern", "eine Behauptung wissenschaftlich untermauern", "Argumente durch Daten untermauern"],
    "b2-politik-demokratie-026": ["den Welthandel liberalisieren", "der Welthandel wächst", "den Welthandel nachhaltig gestalten"],
}

# Finish the B2 collocation layer for the remaining lexical cards. Paradigm
# cards with several gender/number forms are documented as explicit exceptions
# below instead of receiving artificial cloze phrases.
COLLOCATIONS.update({
    "b2-medien-schule-031": ["einen Leitartikel verfassen", "der Leitartikel der Zeitung"],
    "b2-medien-schule-032": ["umfassende Berichterstattung über die Wahl", "die Berichterstattung kritisch bewerten"],
    "b2-medien-schule-033": ["eine vollständige Quellenangabe machen", "Quellenangaben sorgfältig prüfen"],
    "b2-medien-schule-034": ["eine Nachrichtensendung ausstrahlen", "die Nachrichtensendung beginnt pünktlich"],
    "b2-medien-schule-035": ["eine politische Talkshow moderieren", "in einer Talkshow Gäste befragen"],
    "b2-medien-schule-036": ["auf der Titelseite erscheinen", "die Titelseite der Zeitung"],
    "b2-medien-schule-038": ["Medienkompetenz im Unterricht fördern", "Medienkompetenz kritisch vermitteln"],
    "b2-medien-schule-039": ["einen Schulabschluss erwerben", "einen anerkannten Schulabschluss erhalten"],
    "b2-medien-schule-040": ["das Abitur bestehen", "sich auf das Abitur vorbereiten"],
    "b2-medien-schule-041": ["eine Klassenarbeit schreiben", "die Klassenarbeit sorgfältig korrigieren"],
    "b2-medien-schule-042": ["eine schlechte Note erklären", "die Note im Zeugnis"],
    "b2-medien-schule-043": ["ein gutes Zeugnis erhalten", "das Zeugnis vorlegen"],
    "b2-medien-schule-044": ["einen Lehrplan überarbeiten", "den Lehrplan regelmäßig anpassen"],
    "b2-medien-schule-045": ["das Schulsystem reformieren", "ein durchlässiges Schulsystem schaffen"],
    "v1432": ["eine empirische Studie durchführen", "die Studie veröffentlichen"],
    "v1433": ["eine Untersuchung anordnen", "eine Untersuchung abschließen"],
    "v1434": ["eine These überprüfen", "eine These formulieren"],
    "v1436": ["ein Experiment durchführen", "ein kontrolliertes Experiment wiederholen"],
    "v1437": ["einen Zusammenhang beweisen", "eine Vermutung wissenschaftlich beweisen"],
    "v1440": ["ein Ergebnis erzielen", "die Ergebnisse sorgfältig auswerten"],
    "v1442": ["eine unmittelbare Folge haben", "Folgen einer Entscheidung abschätzen"],
    "v1444": ["eine Entwicklung fördern", "die technische Entwicklung beobachten"],
    "v1445": ["in naher Zukunft", "die Zukunft nachhaltig gestalten"],
    "v1447": ["Daten systematisch erheben", "Daten aus mehreren Quellen vergleichen"],
    "v1450": ["die Globalisierung vorantreiben", "Folgen der Globalisierung abmildern"],
    "v1453": ["den Klimawandel begrenzen", "Folgen des Klimawandels abmildern"],
    "v1454": ["eine Krise überwinden", "aus der Krise gestärkt hervorgehen"],
    "v1455": ["eine tragfähige Lösung finden", "eine Lösung für das Problem entwickeln"],
    "b2-politik-demokratie-001": ["die Demokratie festigen", "demokratische Grundrechte schützen"],
    "b2-politik-demokratie-002": ["eine Wahl gewinnen", "bei der Wahl antreten"],
    "b2-politik-demokratie-004": ["eine Partei gründen", "einer Partei angehören"],
    "b2-politik-demokratie-005": ["eine Regierung bilden", "die Regierung kontrollieren"],
    "b2-politik-demokratie-011": ["eine Koalition bilden", "in eine Koalition eintreten"],
    "b2-politik-demokratie-012": ["die Opposition anführen", "der Opposition angehören"],
    "b2-politik-demokratie-016": ["ein neues Gesetz beschließen", "ein Gesetz in Kraft setzen"],
    "b2-politik-demokratie-017": ["einen Beschluss fassen", "einen Beschluss gemeinsam treffen"],
    "b2-politik-demokratie-018": ["eine Abstimmung organisieren", "bei der Abstimmung dafür sein"],
    "b2-politik-demokratie-019": ["mit großer Mehrheit beschließen", "eine Mehrheit im Bundestag sichern"],
    "b2-politik-demokratie-020": ["Minderheitenrechte stärken", "die Minderheit im Parlament vertreten"],
    "b2-politik-demokratie-021": ["Mitglied einer Partei werden", "als Mitglied abstimmen"],
    "b2-politik-demokratie-023": ["die Verfassung ergänzen", "in der Verfassung verankern"],
    "b2-politik-demokratie-024": ["in die Sozialversicherung einzahlen", "Beiträge zur Sozialversicherung leisten"],
    "b2-politik-demokratie-027": ["Mitglied der Europäischen Union werden", "Beschlüsse der Europäischen Union umsetzen"],
    "b2-politik-demokratie-029": ["Protest gegen die Reform", "einen Protest anmelden"],
    "b2-politik-demokratie-030": ["eine Demonstration organisieren", "eine öffentliche Demonstration planen"],
    "b2-politik-demokratie-031": ["eine Rente beziehen", "im Ruhestand eine Rente erhalten"],
    "b2-politik-demokratie-032": ["das Steuersystem reformieren", "im deutschen Steuersystem"],
    "b2-politik-demokratie-034": ["die Arbeitslosigkeit senken", "von Arbeitslosigkeit betroffen sein"],
    "b2-politik-demokratie-035": ["den Mindestlohn anheben", "über den Mindestlohn verhandeln"],
})

KOLLOCATION_EXCEPTION_REPAIRS = {
    "b2-medien-schule-037": "Die Karte enthält Singular und unregelmäßigen Plural als Paradigma; keine einzelne Kollokation deckt beide Formen ab.",
    "b2-politik-demokratie-003": "Die Karte bündelt männliche und weibliche Formen samt Plural; sie ist ein Formenparadigma, keine einzelne Kollokation.",
    "b2-politik-demokratie-009": "Die Karte führt beide geschlechtsspezifischen Amtsbezeichnungen; eine künstliche Verbindung mit beiden Varianten wäre unidiomatisch.",
    "b2-politik-demokratie-010": "Die Karte führt beide Geschlechter und beide Pluralformen; sie ist ein vollständiges Formenparadigma.",
    "b2-politik-demokratie-022": "Die Karte bündelt männliche und weibliche Form sowie den gemeinsamen Plural; sie ist ein Formenparadigma.",
    "b2-politik-demokratie-025": "Die Karte nennt Singular und Plural des Staatsmodells; die Formen werden als Paradigma statt als Kollokation gelernt.",
}

# Keep all replacements grounded in the same-level B2 sentence bank. Besides
# coverage, these edits repair three awkward or overgeneralized source lines.
SENTENCE_REPAIRS = {
    "s-b2-51": {
        "de": "Der Algorithmus bevorzugt Beiträge von Influencern, die Empörung auslösen, weshalb die Bildschirmzeit vieler Nutzer steigt. Verfahren des maschinellen Lernens können große Datenmengen auswerten; eine sorgfältige Datenverarbeitung trägt dabei zum Schutz personenbezogener Informationen bei.",
        "ar": "تفضّل الخوارزمية منشورات المؤثّرين التي تثير السخط، ولذلك يزداد وقت الشاشة لدى كثير من المستخدمين. ويمكن لأساليب التعلّم الآلي تحليل كميات كبيرة من البيانات؛ كما تسهم معالجة البيانات بعناية في حماية المعلومات الشخصية.",
        "waisen": ["der Algorithmus", "der Influencer", "die Bildschirmzeit", "das maschinelle Lernen", "die Datenverarbeitung"],
    },
    "s-b2-52": {
        "de": "Bevor die Hypothese publiziert wird, muss der Datensatz erneut ausgewertet werden. Im Forschungsvorhaben werden zudem die zugrunde liegende Prämisse und mögliche Folgewirkungen geprüft, bevor die Forschenden die Ergebnisse interpretieren. Die Ergebnisse können die zentrale These untermauern.",
        "ar": "قبل نشر الفرضية، يجب إعادة تحليل مجموعة البيانات. وفي المشروع البحثي، تُفحَص أيضاً المسلّمة التي يستند إليها البحث والآثار اللاحقة المحتملة قبل أن يفسّر الباحثون النتائج. ويمكن للنتائج أن تدعم الأطروحة الأساسية بالأدلة.",
        "waisen": ["die Hypothese", "publizieren", "der Datensatz", "auswerten", "das Forschungsvorhaben", "die Prämisse", "die Folgewirkung", "interpretieren", "untermauern"],
    },
    "s-b2-68": {
        "de": "Man muss die Folgen der Automatisierung differenziert beurteilen, damit technische Kontrollen nicht zu einer ständigen Belästigung führen. Zugleich kann die Prozessautomatisierung wiederkehrende Arbeitsschritte vereinfachen.",
        "ar": "ينبغي تقييم عواقب الأتمتة بتروٍّ حتى لا تتحول الضوابط التقنية إلى مصدر إزعاج دائم. وفي الوقت نفسه، يمكن لأتمتة العمليات أن تبسّط خطوات العمل المتكررة.",
        "waisen": ["die Automatisierung", "beurteilen", "die Belästigung", "die Prozessautomatisierung"],
    },
    "s-b2-78": {
        "de": "Nach dem verheerenden Hochwasser einigten sich die Politiker auf verbindliche Ziele zur Senkung der Treibhausgasemissionen und ein klares nationales Klimaziel. Der Strukturwandel soll die Zukunftsfähigkeit der Region sichern und zugleich die Ressourcenschonung voranbringen.",
        "ar": "بعد الفيضان المدمّر، اتفق السياسيون على أهداف ملزمة لخفض انبعاثات غازات الاحتباس الحراري، وعلى هدف مناخي وطني واضح. وينبغي للتحول الهيكلي أن يعزز قدرة المنطقة على الاستمرار مستقبلاً، وأن يدعم ترشيد الموارد في الوقت نفسه.",
        "waisen": ["das Hochwasser", "das Treibhausgas", "das Klimaziel", "der Strukturwandel", "die Zukunftsfähigkeit", "die Ressourcenschonung"],
    },
    "s-b2-83": {
        "de": "Seriöse Journalisten widerlegen reißerische Behauptungen und warnen vor tendenziösen Berichten in ungeprüften Online-Quellen. Auch Nachrichtensendungen und Talkshows sollten ihre Quellenangaben offenlegen, damit sich Aussagen überprüfen lassen; eine reißerische Titelseite eines Boulevardblatts ersetzt keine Medienkompetenz.",
        "ar": "يفنّد الصحفيون المهنيون الادعاءات المثيرة ويحذّرون من التقارير المتحيزة في المصادر الإلكترونية غير المتحقق منها. وينبغي لنشرات الأخبار والحوارات التلفزيونية أيضاً الإفصاح عن مصادرها كي يتسنى التحقق من التصريحات؛ فالصفحة الأولى الصاخبة لصحيفة شعبية لا تغني عن الثقافة الإعلامية.",
        "waisen": ["widerlegen", "reißerisch", "tendenziös", "die Quellenangabe, -n", "die Nachrichtensendung, -en", "die Talkshow, -s", "die Titelseite, -n", "das Boulevardblatt, die Boulevardblätter", "die Medienkompetenz"],
    },
    "s-b2-93": {
        "de": "In unserer föderalen Ordnung verabschiedet der Bundestag Gesetze; bei Zustimmungsgesetzen muss auch der Bundesrat zustimmen, der als Ländervertretung an der Gesetzgebung auf Bundesebene mitwirkt. Nach einer Bundestagswahl bilden Parteien oft eine Koalition; der Bundeskanzler wird vom Bundestag gewählt, während der Bundespräsident von der Bundesversammlung gewählt wird. Im Parlament können Abgeordnete auch die Anliegen politischer Minderheiten einbringen.",
        "ar": "في نظامنا الاتحادي، يسنّ البوندستاغ القوانين؛ وفي القوانين التي تتطلب موافقة البوندسرات، يجب أن يوافق المجلس أيضاً، إذ يمثّل الولايات على المستوى الاتحادي ويشارك في سنّ القوانين. وبعد انتخابات البوندستاغ، تشكّل الأحزاب ائتلافاً في كثير من الأحيان؛ وينتخب البوندستاغ المستشار الاتحادي، بينما تنتخب الجمعية الاتحادية الرئيس الاتحادي. ويمكن للنواب أيضاً عرض قضايا الأقليات السياسية في البرلمان.",
        "waisen": ["föderal", "der Bundestag", "der Bundesrat", "die Ländervertretung", "die Gesetzgebung", "der Bundeskanzler / die Bundeskanzlerin", "der Bundespräsident / die Bundespräsidentin; Plural: die Bundespräsidenten / die Bundespräsidentinnen", "die Koalition, -en", "die Minderheit, -en", "der Abgeordnete / die Abgeordnete; Plural: die Abgeordneten"],
    },
    "s-b2-87": {
        "de": "Auf dem turbulenten Elternabend debattierte die Klassenkonferenz über die gefährdete Versetzung mehrerer Schülerinnen und Schüler, nachdem eine Klassenarbeit deutliche Lernlücken gezeigt hatte.",
        "ar": "في اجتماع أولياء الأمور المليء بالنقاش، تداول مجلس الصف خطر عدم انتقال عدة تلاميذ إلى الصف التالي، بعدما كشف اختبار صفي عن فجوات واضحة في التعلم.",
        "waisen": ["der Elternabend", "die Klassenkonferenz", "die Versetzung", "die Klassenarbeit, -en"],
    },
    "s-b2-88": {
        "de": "Die Grundschulempfehlung beeinflusst den schulischen Werdegang, ist aber nicht in jedem Bundesland verbindlich. Am Ende der Schullaufbahn hängt der Schulabschluss vom jeweiligen Schulsystem ab; wer das Abitur anstrebt, kann Inhalte im Leistungskurs vertiefen, die im Grundkurs nur grundlegend behandelt werden.",
        "ar": "تؤثر توصية المدرسة الابتدائية في المسار الدراسي، لكنها ليست ملزمة في كل ولاية اتحادية. وفي نهاية المسار يتحدد المؤهل المدرسي بحسب النظام التعليمي؛ ويمكن لمن يسعى إلى شهادة الأبيتور تعميق موضوعات في المساق المتقدم تُدرّس بصورة أساسية في المساق العادي.",
        "waisen": ["der Leistungskurs", "der Grundkurs", "die Grundschulempfehlung", "der Schulabschluss, -schlüsse", "das Schulsystem, -e", "das Abitur"],
    },
    "s-b2-94": {
        "de": "Staatliche Hilfen wie das Bürgergeld, ein zusätzliches Wohngeld und das monatliche Kindergeld sichern das familiäre Existenzminimum. Die Sozialversicherung schützt vor bestimmten Lebensrisiken; bei Arbeitslosigkeit können Ansprüche aus der Arbeitslosenversicherung greifen, während der Mindestlohn und das Steuersystem das verfügbare Einkommen beeinflussen.",
        "ar": "تسهم مساعدات الدولة، مثل إعانة المواطن وبدل السكن الإضافي وإعانة الطفل الشهرية، في ضمان الحد الأدنى للمعيشة للأسرة. ويحمي التأمين الاجتماعي من مخاطر حياتية معينة؛ فعند التعطل عن العمل قد تنطبق استحقاقات تأمين البطالة، بينما يؤثر الحد الأدنى للأجور والنظام الضريبي في الدخل المتاح.",
        "waisen": ["das Bürgergeld", "das Wohngeld", "das Kindergeld", "die Sozialversicherung, -en", "die Arbeitslosigkeit", "der Mindestlohn, -löhne", "das Steuersystem, -e"],
    },
    "s-b2-106": {
        "de": "Eine wehrhafte Demokratie schützt das Wahlrecht und die Pressefreiheit und verbietet gesellschaftliche Diskriminierung. Im Verfassungsstaat achtet eine unabhängige Medienaufsicht auf die Einhaltung einschlägiger Regeln; sachliche Berichterstattung kann die Wahlbeteiligung fördern.",
        "ar": "تحمي الديمقراطية الحصينة حق الانتخاب وحرية الصحافة، وتحظر التمييز المجتمعي. وفي الدولة الدستورية، تراقب جهة مستقلة للإشراف على الإعلام الالتزام بالقواعد ذات الصلة؛ ويمكن للتغطية الصحفية الموضوعية أن تعزز المشاركة في الانتخابات.",
        "waisen": ["die Pressefreiheit", "das Wahlrecht", "die Diskriminierung", "der Verfassungsstaat", "die Medienaufsicht", "die Wahlbeteiligung"],
    },
    "s-b2-155": {
        "de": "Durch die Globalisierung ist der moderne Online-Handel eng mit dem Welthandel verknüpft; Preissteigerungen auf internationalen Märkten erhöhen die Einkaufskosten. Flexible Arbeitszeiten können zugleich die Work-Life-Balance der Beschäftigten verbessern, ohne dass Händler Gutscheine entwerten.",
        "ar": "في ظل العولمة، ترتبط التجارة الإلكترونية الحديثة ارتباطاً وثيقاً بالتجارة العالمية؛ وتؤدي الزيادات السعرية في الأسواق الدولية إلى رفع تكاليف الشراء. ويمكن لساعات العمل المرنة أيضاً أن تحسّن التوازن بين العمل والحياة لدى العاملين، دون أن يُبطل التجار صلاحية قسائمهم.",
        "waisen": ["der Online-Handel", "die Work-Life-Balance", "entwerten", "die Preissteigerung", "der Welthandel", "die Globalisierung"],
    },
}

# These repetitions are purposeful spaced retrieval, not duplicate examples:
# the same core item reappears at a different CEFR level with a fresh context.
APPROVED_REPEAT_GROUPS = [
    ["v020", "a0-zahlen-002"], ["v021", "a0-zahlen-006"], ["v022", "a0-zahlen-011"],
    ["v023", "a0-zahlen-015"], ["v024", "a0-zahlen-017"], ["v110", "v1453"],
    ["v116", "v1455"], ["v120", "v1434"], ["b2-medien-schule-032", "vu-b1p-000"],
    ["v312", "v1444"], ["v416", "v1432"], ["v418", "v1433"], ["v419", "v1440"],
    ["v420", "v1436"], ["v438", "v1437"], ["v593", "b2-politik-demokratie-034"],
    ["vw-a1ess-008", "a0-obst-gemuese-016"], ["vw-a1ess-023", "a0-obst-gemuese-015"],
    ["vw-a1ess-024", "a0-obst-gemuese-014"], ["vw-a1koe-041", "a0-farben-001"],
    ["vw-a1koe-042", "a0-farben-002"], ["vw-a1koe-043", "a0-farben-003"],
    ["vw-a1koe-044", "a0-farben-004"], ["vw-a1koe-045", "a0-farben-005"],
    ["vw-a1koe-046", "a0-farben-006"], ["vw-a1koe-047", "a0-farben-010"],
    ["vw-a1koe-048", "a0-farben-009"], ["vx-zeit--046", "a0-zahlen-003"],
    ["vx-zeit--047", "a0-zahlen-004"], ["vx-zeit--048", "a0-zahlen-005"],
    ["vx-zeit--049", "a0-zahlen-007"], ["vx-zeit--050", "a0-zahlen-008"],
    ["vx-zeit--051", "a0-zahlen-009"], ["vx-zeit--052", "a0-zahlen-010"],
    ["vx-haus--005", "a0-klassenzimmer-011"], ["vx-haus--019", "a0-klassenzimmer-015"],
    ["vx-haus--028", "a0-klassenzimmer-019"], ["vx-haus--029", "a0-klassenzimmer-018"],
    ["vx-haus--030", "a0-klassenzimmer-020"], ["vx-haus--044", "a0-klassenzimmer-016"],
    ["vx-haus--045", "a0-klassenzimmer-017"], ["vz-welt-b-067", "a0-zahlen-012"],
    ["vz-welt-b-068", "a0-zahlen-013"], ["vz-welt-b-069", "a0-zahlen-014"],
    ["vz-welt-b-071", "a0-zahlen-016"], ["vc-medien-011", "v1447"], ["ve-erzaehl-019", "v1445"],
]

vocab = read_json(VOCAB_PATH)
cards = {}
collect_cards(vocab, cards)
assert len(cards) == 3499, f"unexpected vocabulary card count: {len(cards)}"

replacement_ids = set(REPLACEMENTS)
replacement_terms = [normalize(item["de"]) for item in REPLACEMENTS.values()]
assert len(replacement_terms) == len(set(replacement_terms)), "replacement terms collide with each other"
for card_id, replacement in REPLACEMENTS.items():
    assert card_id in cards, f"missing card: {card_id}"
    assert cards[card_id].get("level") == "B2", f"unexpected level for {card_id}"
    term = normalize(replacement["de"])
    assert not any(normalize(card["de"]) == term and card["id"] not in replacement_ids for card in cards.values()), f"replacement already exists: {term}"
    cards[card_id].update(replacement)

# Audit the full gender-color mapping, including newly added article-bearing cards.
FARBE_BY_ARTICLE = {"der": "BLAU", "die": "ROT", "das": "GRÜN"}
for card in cards.values():
    article = card.get("article")
    if article:
        assert article in FARBE_BY_ARTICLE, f"unknown article on {card['id']}: {article}"
        card["farbe"] = FARBE_BY_ARTICLE[article]

# German spelling and example-level duplicate found in the same review.
for card_id in ["vx-haus--045", "a0-klassenzimmer-017"]:
    assert card_id in cards
    cards[card_id]["de"] = "schließen"
card = cards["vw-a1koe-044"]
card["exampleDe"] = "Das Schild ist gelb."
card["exampleAr"] = "اللافتة صفراء."
# Adjectives after the definite article are lowercase in German.
cards["v387"]["de"] = "die künstliche Intelligenz"

# Complete the controlled POS labels on legacy A0 and B2 deck entries.
A0_CLASSROOM_VERBS = {f"a0-klassenzimmer-{nr:03d}" for nr in range(16, 21)}
for card in cards.values():
    if card.get("pos"):
        continue
    card_id = card["id"]
    if card_id.startswith("a0-zahlen-"):
        card["pos"] = "Zahl"
    elif card_id.startswith("a0-farben-"):
        card["pos"] = "Adjektiv"
    elif card_id in A0_CLASSROOM_VERBS:
        card["pos"] = "Verb"
    elif card_id.startswith(("a0-obst-gemuese-", "a0-klassenzimmer-", "b2-medien-schule-", "b2-politik-demokratie-")):
        card["pos"] = "Nomen"
    else:
        raise AssertionError(f"unreviewed missing part of speech: {card_id} ({card['de']})")

# The technical adjective has a useful, established contrast in emissionsintensiv.
antonyme = read_json(ANTONYME_PATH)
assert antonyme.get("emissionsarm") in (None, ["emissionsintensiv"]), "unexpected emissionsarm antonym"
antonyme["emissionsarm"] = ["emissionsintensiv"]

ant_ausnahmen = read_json(ANT_AUSNAHMEN_PATH)
assert isinstance(ant_ausnahmen.get("ausnahmen"), list), "antonym exception registry is malformed"
existing_ant_exceptions = {item["de"]: item for item in ant_ausnahmen["ausnahmen"]}
for color in ["orange", "lila", "rosa", "dunkelblau", "hellgrün"]:
    exception = {"de": color, "grund": "اسم لون لا يقابله ضد معجمي مباشر."}
    assert color not in existing_ant_exceptions or existing_ant_exceptions[color] == exception, f"unexpected adjective exception: {color}"
    if color not in existing_ant_exceptions:
        ant_ausnahmen["ausnahmen"].append(exception)
ant_ausnahmen["_beschreibung"] = "صفات بلا ضدّ معجمي — الغياب معلَن هنا لا ساكت عنه (نمط K73k). السقف 20 (K126)."

# Add corpus links and collocations for the replacement vocabulary. The sentence
# IDs remain stable, so audio manifests and the bank's cardinality are unchanged.
assert replacement_ids.issubset(COLLOCATIONS) and len(COLLOCATIONS) == 69, "B2 collocation coverage set is incomplete"
kollokationen = read_json(KOLLOCATION_PATH)
all_collocations = [
    phrase for card_id, phrases in kollokationen.items() if card_id not in COLLOCATIONS for phrase in phrases
]
for card_id, phrases in COLLOCATIONS.items():
    assert card_id in cards and cards[card_id]["level"] == "B2", f"missing B2 collocation card: {card_id}"
    assert card_id not in kollokationen or kollokationen[card_id] == phrases, f"unexpected existing collocations: {card_id}"
    assert len(phrases) in (2, 3) and all(2 <= len(phrase.split()) <= 6 for phrase in phrases), f"invalid collocations: {card_id}"
    assert all(not any("\u0600" <= char <= "\u06ff" for char in phrase) for phrase in phrases)
    kollokationen[card_id] = phrases
    all_collocations.extend(phrases)
assert len(all_collocations) == len(set(all_collocations)), "a collocation is duplicated across cards"

kollokations_ausnahmen = read_json(KOLLOCATION_EXCEPTION_PATH)
for card_id, grund in KOLLOCATION_EXCEPTION_REPAIRS.items():
    assert card_id in cards and cards[card_id]["level"] == "B2" and card_id not in kollokationen, f"invalid paradigm exception: {card_id}"
    eintrag = {"de": cards[card_id]["de"], "grund": grund}
    assert card_id not in kollokations_ausnahmen or kollokations_ausnahmen[card_id] == eintrag, f"unexpected paradigm exception: {card_id}"
    kollokations_ausnahmen[card_id] = eintrag
assert len(kollokations_ausnahmen) == 48, f"unexpected total collocation exceptions: {len(kollokations_ausnahmen)}"

sentences = read_json(SENTENCE_PATH)
sentence_by_id = {sentence["id"]: sentence for sentence in sentences}
assert len(sentence_by_id) == len(sentences), "sentence IDs are not unique"
for sentence_id, repair in SENTENCE_REPAIRS.items():
    assert sentence_id in sentence_by_id, f"missing B2 sentence: {sentence_id}"
    sentence = sentence_by_id[sentence_id]
    assert sentence["level"] == "B2" and sentence.get("neu") is True, f"unexpected sentence class: {sentence_id}"
    sentence.update(repair)
assert len(sentences) == 676, f"sentence repair must preserve bank size: {len(sentences)}"

# Validate the reviewed allowlist against all actual repeats before writing it.
by_word = defaultdict(list)
for card in cards.values():
    by_word[normalize(card["de"])].append(card)
expected = {}
items = []
for ids in APPROVED_REPEAT_GROUPS:
    group = [cards[card_id] for card_id in ids]
    words = {normalize(card["de"]) for card in group}
    assert len(words) == 1, f"allowlisted IDs are not the same lexeme: {ids}"
    levels = [card["level"] for card in group]
    assert len(set(levels)) == len(levels), f"same-level duplicate remains: {ids}"
    examples = [card.get("exampleDe", "").strip() for card in group]
    translations = [card.get("exampleAr", "").strip() for card in group]
    assert all(examples) and len(set(examples)) == len(examples), f"repeated example remains: {ids}"
    assert all(translations) and len(set(translations)) == len(translations), f"repeated translation remains: {ids}"
    word = words.pop()
    expected[word] = sorted(ids)
    levels_sorted = sorted(set(levels), key=lambda level: LEVEL_ORDER[level])
    if levels_sorted == ["A0", "A1"]:
        reason = "مراجعة متباعدة لمفردة أساسية، مع مثال جديد في كل مستوى."
    else:
        reason = "تظهر المفردة مجدداً في مستوى مختلف ضمن سياق جديد لترسيخ الاسترجاع."
    items.append({"de": group[0]["de"], "ids": sorted(ids), "levels": levels_sorted, "reasonAr": reason})
actual = {word: sorted(card["id"] for card in group) for word, group in by_word.items() if len(group) > 1}
assert actual == expected, f"undocumented/redundant repeats: actual={actual.keys() - expected.keys()}, stale={expected.keys() - actual.keys()}"
items.sort(key=lambda item: normalize(item["de"]))
write_json(VOCAB_PATH, vocab)
write_json(REPEAT_PATH, {"version": 1, "items": items})
write_json(SENTENCE_PATH, sentences)
write_json(KOLLOCATION_PATH, kollokationen)
write_json(KOLLOCATION_EXCEPTION_PATH, kollokations_ausnahmen)
write_json(ANTONYME_PATH, antonyme)
write_json(ANT_AUSNAHMEN_PATH, ant_ausnahmen)
print(
    f"R144a: 20 duplicate B2 cards replaced; {len(items)} intentional cross-level repeats documented; "
    f"11 B2 sentences, {len(COLLOCATIONS)} collocation sets, and "
    f"{len(KOLLOCATION_EXCEPTION_REPAIRS)} paradigm exceptions reviewed."
)
