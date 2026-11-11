#!/usr/bin/env python3
"""Apply the guarded R162 plural review to content/vocab.json.

Every transition is scoped to one card ID and its exact current lemma, POS, and
plural value.  ``None`` means removing the plural field after an explicit
case decision; it is not a bulk rule.  Re-running the patch is idempotent.
"""
from __future__ import annotations

import json
from pathlib import Path

VOCAB = Path(__file__).resolve().parents[2] / "content" / "vocab.json"

# id: (expected lemma, expected POS, expected old plural, reviewed new plural)
# A reviewed new value of None deliberately removes the field for this ID only.
EDITS: dict[str, tuple[str, str, str, str | None]] = {
    "v053": ("die Medizin", "Nomen", "die Medikamente", None),
    "v330": ("umziehen", "Verb", "die Kooperationen", None),
    "v334": ("der Stadtteil", "Nomen", "die Strategien", "die Stadtteile"),
    "v340": ("die Hypothek", "Nomen", "die Institutionen", "die Hypotheken"),
    "v346": ("die Besichtigung", "Nomen", "die Reformen", "die Besichtigungen"),
    "v350": ("unbefristet", "Adjektiv", "die Petitionen", None),
    "v355": ("der Wohnraum", "Nomen", "die Resolutionen", None),
    "v360": ("die Möblierung", "Nomen", "die Konferenzen", "die Möblierungen"),
    "v365": ("sich beschweren über", "Verb", "die Debatten", None),
    "v370": ("die Plattform", "Nomen", "die Fraktionen", "die Plattformen"),
    "v375": ("der Bildschirm", "Nomen", "die Koalitionen", "die Bildschirme"),
    "v380": ("das Nutzerkonto", "Nomen", "die Abgeordneten", "die Nutzerkonten"),
    "v385": ("die DSGVO", "Nomen", "die Ministerien", None),
    "v390": ("die Kluft", "Nomen", "die Behörden", "die Klüfte"),
    "v395": ("der Online-Handel", "Nomen", "die Verträge", None),
    "v400": ("die Cloud", "Nomen", "die Vereinbarungen", "die Clouds"),
    "v405": ("der Nutzer", "Nomen", "die Verhandlungen", "die Nutzer"),
    "v410": ("die Influencerin", "Nomen", "die Richtlinien", "die Influencerinnen"),
    "v415": ("forschen", "Verb", "die Maßnahmen", None),
    "v420": ("das Experiment", "Nomen", "die Initiativen", "die Experimente"),
    "v425": ("das Labor", "Nomen", "die Kampagnen", "die Labore"),
    "v430": ("die Auswertung", "Nomen", "die Proteste", "die Auswertungen"),
    "v435": ("zitieren", "Verb", "die Demonstrationen", None),
    "v440": ("das Studium", "Nomen", "die Kundgebungen", "die Studien"),
    "v445": ("einhalten", "Verb", "die Streiks", None),
    "v450": ("die Nachhaltigkeit", "Nomen", "die Versammlungen", None),
    "v455": ("die Glaubwürdigkeit", "Nomen", "die Beschlüsse", None),
    "v460": ("hässlich", "Adjektiv", "die Anträge", None),
    "v465": ("die Pflege", "Nomen", "die Urteile", None),
    "v470": ("das Alter", "Nomen", "die Gutachten", None),
    "v475": ("modisch", "Adjektiv", "die Berichte", None),
    "v480": ("die Marke", "Nomen", "die Protokolle", "die Marken"),
    "v485": ("stilvoll", "Adjektiv", "die Zeugenaussagen", None),
    "v490": ("retuschieren", "Verb", "die Ermittlungen", None),
    "v495": ("beeindrucken", "Verb", "die Sanktionen", None),
    "v500": ("übertreiben", "Verb", "die Geldstrafen", None),
    "v505": ("das Museum", "Nomen", "die Verwarnungen", "die Museen"),
    "v510": ("die Skulptur", "Nomen", "die Bußgelder", "die Skulpturen"),
    "v515": ("die Oper", "Nomen", "die Auflagen", "die Opern"),
    "v520": ("drehen", "Verb", "die Bestimmungen", None),
    "v525": ("die Rolle", "Nomen", "die Vorschriften", "die Rollen"),
    "v530": ("kritisieren", "Verb", "die Normen", None),
    "v535": ("die Lyrik", "Nomen", "die Kriterien", None),
    "v540": ("das Kapitel", "Nomen", "die Richtwerte", "die Kapitel"),
    "v545": ("die Tradition", "Nomen", "die Grenzwerte", "die Traditionen"),
    "v550": ("die Weiterbildung", "Nomen", "die Schätzungen", "die Weiterbildungen"),
    "v555": ("die Vergütung", "Nomen", "die Prognosen", "die Vergütungen"),
    "v560": ("die Vollzeit", "Nomen", "die Berechnungen", None),
    "v565": ("die Konferenz", "Nomen", "die Statistiken", "die Konferenzen"),
    "v570": ("der Arbeitsplatz", "Nomen", "die Umfragen", "die Arbeitsplätze"),
    "v575": ("das Burnout", "Nomen", "die Studien", "die Burnouts"),
    "v580": ("das Einkommen", "Nomen", "die Analysen", "die Einkommen"),
    "v585": ("streiken", "Verb", "die Auswertungen", None),
    "v590": ("der Quereinsteiger", "Nomen", "die Synthesen", "die Quereinsteiger"),
    "v595": ("der Ruhestand", "Nomen", "die Schlussfolgerungen", None),
    "v600": ("verschmutzt", "Adjektiv", "die Publikationen", None),
    "v605": ("der Plastikmüll", "Nomen", "die Veröffentlichungen", None),
    "v610": ("sparsam", "Adjektiv", "die Beiträge", None),
    "v615": ("das Windrad", "Nomen", "die Kommentare", "die Windräder"),
    "v620": ("das Erdgas", "Nomen", "die Rezensionen", None),
    "v625": ("das Umweltbewusstsein", "Nomen", "die Dokumentationen", None),
    "v630": ("der Naturschutz", "Nomen", "die Archive", None),
    "v635": ("die Biodiversität", "Nomen", "die Verzeichnisse", None),
    "v640": ("die Dürre", "Nomen", "die Register", "die Dürren"),
    "v645": ("der Regenwald", "Nomen", "die Karteien", "die Regenwälder"),
    "v650": ("das Klimaziel", "Nomen", "die Datenbanken", "die Klimaziele"),
    "v655": ("die Landschaft", "Nomen", "die Plattformen", "die Landschaften"),
    "v660": ("die Überweisung", "Nomen", "die Netzwerke", "die Überweisungen"),
    "v665": ("versteuern", "Verb", "die Portale", None),
    "v670": ("abheben", "Verb", "die Anwendungen", None),
    "v675": ("die Schulden", "Nomen", "die Schnittstellen", None),
    "v680": ("der Kunde", "Nomen", "die Algorithmen", "die Kunden"),
    "v685": ("die Qualität", "Nomen", "die Systeme", "die Qualitäten"),
    "v690": ("werben", "Verb", "die Strukturen", None),
    "v695": ("der Haushaltsplan", "Nomen", "die Prozesse", "die Haushaltspläne"),
    "v700": ("die Garantie", "Nomen", "die Abläufe", "die Garantien"),
    "v705": ("zurückgeben", "Verb", "die Methoden", None),
    "v710": ("der Geldautomat", "Nomen", "die Verfahren", "die Geldautomaten"),
    "v715": ("die Insolvenz", "Nomen", "die Konzepte", "die Insolvenzen"),
    "v720": ("das Elektroauto", "Nomen", "die Modelle", "die Elektroautos"),
    "v725": ("das Ticket", "Nomen", "die Entwürfe", "die Tickets"),
    "v730": ("das Gleis", "Nomen", "die Pläne", "die Gleise"),
    "v735": ("die Ampel", "Nomen", "die Projekte", "die Ampeln"),
    "v740": ("die Mitfahrgelegenheit", "Nomen", "die Programme", "die Mitfahrgelegenheiten"),
    "v745": ("die Mobilität", "Nomen", "die Module", None),
    "v750": ("das Tempolimit", "Nomen", "die Einheiten", "die Tempolimits"),
    "v755": ("das Parkhaus", "Nomen", "die Komponenten", "die Parkhäuser"),
    "v760": ("der Führerschein", "Nomen", "die Faktoren", "die Führerscheine"),
    "v765": ("die Fluggesellschaft", "Nomen", "die Aspekte", "die Fluggesellschaften"),
    "v770": ("die Rückkehr", "Nomen", "die Dimensionen", None),
    "v775": ("das Grundgesetz", "Nomen", "die Perspektiven", "die Grundgesetze"),
    "v780": ("die Behörde", "Nomen", "die Ansätze", "die Behörden"),
    "v785": ("bewilligen", "Verb", "die Theorien", None),
    "v790": ("das Verbot", "Nomen", "die Thesen", "die Verbote"),
    "v795": ("der Widerspruch", "Nomen", "die Hypothesen", "die Widersprüche"),
    "v800": ("der Richter", "Nomen", "die Prämissen", "die Richter"),
    "v805": ("die Anwältin", "Nomen", "die Argumente", "die Anwältinnen"),
    "v810": ("die Pressefreiheit", "Nomen", "die Einwände", None),
    "v815": ("die Staatsbürgerschaft", "Nomen", "die Gegenvorschläge", "die Staatsbürgerschaften"),
    "v820": ("die Abschiebung", "Nomen", "die Alternativen", "die Abschiebungen"),
    "v825": ("die Straftat", "Nomen", "die Optionen", "die Straftaten"),
    "v830": ("die Korruption", "Nomen", "die Präferenzen", None),
    "v835": ("die Bescheinigung", "Nomen", "die Prioritäten", "die Bescheinigungen"),
    "v840": ("die Beglaubigung", "Nomen", "die Ziele", "die Beglaubigungen"),
    "v845": ("zulassen", "Verb", "die Vorgaben", None),
    "v850": ("die Klausur", "Nomen", "die Erwartungen", "die Klausuren"),
    "v855": ("die Note", "Nomen", "die Anforderungen", "die Noten"),
    "v860": ("sich einschreiben", "Verb", "die Bedingungen", None),
    "v865": ("die Leihfrist", "Nomen", "die Voraussetzungen", "die Leihfristen"),
    "v870": ("die Wiederholung", "Nomen", "die Qualifikationen", "die Wiederholungen"),
    "v875": ("ablenken", "Verb", "die Kompetenzen", None),
    "v880": ("effizient", "Adjektiv", "die Fähigkeiten", None),
    "v885": ("sich überprüfen", "Verb", "die Fertigkeiten", None),
    "v890": ("die Rechtschreibung", "Nomen", "die Talente", None),
    "v895": ("die Dozentin", "Nomen", "die Begabungen", "die Dozentinnen"),
    "v900": ("die Abschlussarbeit", "Nomen", "die Neigungen", "die Abschlussarbeiten"),
    "v905": ("stolz auf", "Adjektiv", "die Interessen", None),
    "v910": ("ärgerlich", "Adjektiv", "die Motive", None),
    "v915": ("angespannt", "Adjektiv", "die Beweggründe", None),
    "v920": ("unsicher", "Adjektiv", "die Ursachen", None),
    "v925": ("belasten", "Verb", "die Anlässe", None),
    "v930": ("die Stimmung", "Nomen", "die Auslöser", "die Stimmungen"),
    "v935": ("riskieren", "Verb", "die Impulse", None),
    "v940": ("betroffen", "Adjektiv", "die Reize", None),
    "v945": ("die Gleichgültigkeit", "Nomen", "die Reaktionen", None),
    "v950": ("die Kränkung", "Nomen", "die Folgen", "die Kränkungen"),
    "v955": ("die Sehnsucht", "Nomen", "die Konsequenzen", "die Sehnsüchte"),
    "v960": ("geborgen", "Adjektiv", "die Wirkungen", None),
    "v965": ("loben", "Verb", "die Effekte", None),
    "v970": ("der Vorwurf", "Nomen", "die Resultate", "die Vorwürfe"),
    "v975": ("die Sorge", "Nomen", "die Ergebnisse", "die Sorgen"),
    "v980": ("die Kondition", "Nomen", "die Erträge", None),
    "v985": ("anstrengend", "Adjektiv", "die Gewinne", None),
    "v990": ("die Grenze", "Nomen", "die Verluste", "die Grenzen"),
    "v995": ("die Dosis", "Nomen", "die Risiken", "die Dosen"),
    "v1000": ("der Wettkampf", "Nomen", "die Gefahren", "die Wettkämpfe"),
}


def main() -> None:
    data = json.loads(VOCAB.read_text(encoding="utf-8"))
    cards = {card["id"]: card for deck in data.values() for card in deck["cards"]}
    if len(cards) != sum(len(deck["cards"]) for deck in data.values()):
        raise SystemExit("duplicate vocabulary IDs make an ID-scoped patch unsafe")
    if len(EDITS) != 136:
        raise SystemExit(f"expected 136 reviewed edits, got {len(EDITS)}")

    applied = already = 0
    for card_id, (lemma, pos, before, after) in EDITS.items():
        card = cards.get(card_id)
        if card is None:
            raise SystemExit(f"{card_id}: missing guarded card")
        if card.get("de") != lemma or card.get("pos") != pos:
            raise SystemExit(f"{card_id}: guarded lemma/POS drifted")
        current = card.get("plural")
        if current == before:
            if after is None:
                del card["plural"]
            else:
                card["plural"] = after
            applied += 1
        elif current == after or (after is None and "plural" not in card):
            already += 1
        else:
            raise SystemExit(f"{card_id}: plural drifted; expected {before!r} or {after!r}, got {current!r}")

    # Keep the repository's one-space JSON indentation to avoid whole-file churn.
    VOCAB.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"<R162> applied {applied}/136 guarded plural edits; {already} already current")


if __name__ == "__main__":
    main()
