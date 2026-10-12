# -*- coding: utf-8 -*-
"""دفعة R164a: أول عشرة تسجيلات A2 في HörLabor.

تصحح حقلي wordCountDe اللذين لا يطابقان النص، ثم تتحقق من مطابقة كل
MP3 للنص الألماني الحالي وتلحقه بمانيفستو الاستماع وحده. تبقى t-a2-031
وt-a2-032 للمتابعة R164b؛ لذلك لا تعلن هذه الدفعة اكتمال تغطية A2.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from add_a0_hoeren_audio_02 import mp3_frame_count

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
VOICE = "voice-00 (de-DE, Arena TTS)"

FIELD_EDITS = [
    ("t-a2-21", ("wordCountDe",), 155, 154),
    ("t-a2-28", ("wordCountDe",), 158, 154),
]

AUDIO_TEXTS = {
    "t-a2-21": "Mein Name ist Lina. Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um neun Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Der Arzt vermutet eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben. Die Arzthelferin erklärt mir, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Ich sage meinem Chef am Telefon, dass ich krank bin und heute nicht zur Arbeit komme. Danach fahre ich direkt nach Hause. Ich ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an.",
    "t-a2-22": "Liebe Frau Becker,\n\nich kann heute leider nicht zum Unterricht kommen, weil meine Tochter krank ist. Sie hat Fieber und muss zu Hause bleiben. Der Kinderarzt hat gesagt, dass sie sich ausruhen soll. Deshalb bleibe ich heute bei ihr. Sie trinkt viel Wasser und ruht sich aus. Ich bleibe in ihrer Nähe und lese ihr eine Geschichte vor, wenn sie wach ist. Mein Mann ist auf Geschäftsreise und kann nicht helfen. Kann ich bitte die Hausaufgaben von einer Mitschülerin bekommen? Ich möchte den Stoff nachholen. Könnten Sie mir bitte auch mitteilen, welche Seiten wir heute im Buch lesen und welche Wörter ich lernen soll? Meine Mitschülerin Sara kann mir am Abend ein Foto von ihren Notizen schicken. Wenn es meiner Tochter morgen besser geht, komme ich wieder in den Kurs. Falls nicht, informiere ich Sie rechtzeitig. Ich erledige die Aufgaben zu Hause, damit ich nicht zu viel verpasse. Vielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nFatima",
    "t-a2-23": "Entschuldigung, wie komme ich am besten zum Hauptbahnhof? — Gehen Sie hier geradeaus bis zur Ampel. Dort biegen Sie links in die Goethestraße. Dann gehen Sie etwa 300 Meter. Sie sehen eine Bäckerei auf der rechten Seite. Überqueren Sie die Straße und gehen Sie durch die Unterführung. Der Bahnhof liegt direkt gegenüber. Sie brauchen zu Fuß ungefähr acht Minuten. Der Weg ist einfach, wenn Sie auf die Straßenschilder achten. Die Ampel steht vor einem großen Geschäft. Nachdem Sie links abgebogen sind, bleiben Sie auf dem Gehweg und folgen der Goethestraße. Auf der rechten Seite sehen Sie zuerst ein kleines Hotel und später die Bäckerei. Gehen Sie bis zur nächsten großen Straße und überqueren Sie sie an der Ampel. Danach gehen Sie durch die Unterführung. Der Tunnel ist hell und es gibt dort Wegweiser zum Bahnhof. Am Ende der Unterführung sehen Sie den Haupteingang. Dort stehen ein Fahrkartenautomat und ein Stadtplan. Wenn Sie ein Gleis suchen, können Sie die Anzeige in der Bahnhofshalle lesen oder am Informationsschalter fragen.",
    "t-a2-24": "Am Samstag bin ich um neun Uhr aufgestanden. Zuerst habe ich Kaffee getrunken und Zeitung gelesen. Dann habe ich die Wohnung geputzt und eingekauft. Das Wetter war angenehm, deshalb bin ich zu Fuß zum Supermarkt gegangen. Dort habe ich Brot, Obst und Milch gekauft. Nachmittags ist meine Freundin zu mir gekommen. Sie wohnt in derselben Straße. Um drei Uhr sind wir zusammen in ein Café gegangen und haben viel geredet. Zuerst haben wir einen Kaffee bestellt. Danach haben wir über die Arbeit und unsere Pläne für den Sommer gesprochen. Abends habe ich mit meiner Familie zu Hause gegessen. Am Sonntag habe ich lange geschlafen und war im Park spazieren. Dort habe ich Musik gehört und eine Runde um den See gemacht. Abends habe ich Deutsch gelernt, weil ich am Montag einen Test hatte. Vor dem Schlafengehen habe ich meine Tasche für den nächsten Tag vorbereitet. Insgesamt war es ein ruhiges und schönes Wochenende.",
    "t-a2-25": "Guten Tag! Wo finde ich bitte die Milch? — Die Milch ist im Kühlregal ganz hinten links. — Danke. Und wo ist das Brot? — Das Brot ist am Eingang bei der Bäckereiabteilung. — Haben Sie heute keine Tomaten? — Doch, die Tomaten sind heute im Angebot, ein Kilo für 1,49 Euro. Sie liegen gleich beim Gemüse. — Vielen Dank! — Bitte schön. — Ich möchte heute einen Salat für meine Familie machen. Das Gemüse brauche ich für das Abendessen. Gibt es auch Gurken und Paprika? — Ja, beides liegt neben den Tomaten. — Dann nehme ich ein Kilo von den Tomaten. Sind sie frisch? — Ja, die Lieferung kam heute Morgen. Sie können die Tomaten einzeln auswählen. — Können Sie mir bitte auch sagen, wo der Käse ist? — Der Käse liegt im Kühlregal direkt neben der Milch. — Und wo kann ich bezahlen? — Die Kasse ist vorne rechts. Sie können bar oder mit Karte bezahlen. — Gut, dann gehe ich jetzt zur Kasse. Auf Wiedersehen! — Auf Wiedersehen!",
    "t-a2-26": "Hallo Ahmed,\n\nich feiere am Samstag um 19 Uhr meinen Geburtstag bei mir zu Hause. Ich wohne in der Schillerstraße 14 im dritten Stock. Du kannst mit der U-Bahn-Linie 3 bis zur Haltestelle Markt fahren. Von dort sind es fünf Minuten zu Fuß. Meine Wohnung ist auf der rechten Seite im dritten Stock. Ich mache Pizza und einen Salat. Es gibt auch Kuchen und Saft. Wir möchten zusammen essen, Musik hören und Karten spielen. Bitte komm pünktlich, damit das Essen nicht kalt wird. Meine Schwester hilft mir bei der Vorbereitung. Ich stelle genug Stühle ins Wohnzimmer, damit alle bequem sitzen können. Du musst nichts mitbringen. Wenn du etwas nicht essen kannst, sag mir bitte vorher Bescheid. Bitte sag mir bis Donnerstag Bescheid, ob du kommen kannst. Ich freue mich, wenn wir uns wiedersehen. Wenn du den Weg nicht findest, ruf mich bitte an. Ich öffne die Haustür ab halb sieben.\n\nViele Grüße\nLena",
    "t-a2-27": "Ich suche seit zwei Monaten eine kleine Wohnung in der Stadt. Sie muss nicht groß sein, aber hell und ruhig. Ein Balkon wäre schön. Die Kaltmiete sollte nicht über 600 Euro liegen. Ich habe schon viele Anzeigen gelesen und mehrere Wohnungen besichtigt. Gestern habe ich eine schöne Zwei-Zimmer-Wohnung gesehen. Sie liegt in einem Altbau, hat 50 Quadratmeter, einen Balkon und eine Einbauküche. Die Kaltmiete beträgt 580 Euro. Bei der Besichtigung hat mir besonders das helle Wohnzimmer gefallen. Die Küche ist schon eingebaut, und im Bad gibt es ein Fenster. Vom Balkon sieht man auf einen ruhigen Innenhof. Die Vermieterin war freundlich und hat mir die Nebenkosten erklärt. Ich habe meine Unterlagen vorbereitet und ihr eine Nachricht geschickt. Sie möchte mir nächste Woche Bescheid geben. Bis dahin suche ich weiter, denn ich möchte sicher sein, dass die neue Wohnung wirklich passt. Wenn ich eine Zusage bekomme, kann ich im nächsten Monat umziehen.",
    "t-a2-28": "Guten Tag, hier ist Ihre Krankenkasse. Wie kann ich Ihnen helfen? — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber meine Versicherungsnummer noch nicht bekommen. Wie erhalte ich sie? — Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist. Das kann einige Tage dauern. — Kann ich in der Zwischenzeit trotzdem zum Arzt gehen? Muss ich die Rechnung selbst bezahlen? — Wenn Ihre Versicherung bereits aktiv ist, rechnet die Praxis normalerweise direkt mit uns ab. Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen. — Bekomme ich die Versichertenkarte später auch? — Ja, die Karte kommt nach der Bearbeitung ebenfalls per Post. Bitte prüfen Sie, ob Ihre Adresse richtig ist. — Das mache ich. Ich schreibe die Informationen in mein Notizbuch, damit ich sie nicht vergesse. Vielen Dank für die Information. — Gern. Wenn Sie noch Fragen haben, können Sie uns wieder anrufen. — Auf Wiederhören!",
    "t-a2-29": "Nächste Woche beginnt ein neuer Deutschkurs an der Volkshochschule. Der Kurs ist dreimal pro Woche: montags, mittwochs und freitags von 18 bis 20 Uhr. Viele von uns lernen nach der Arbeit, deshalb ist der Abendkurs praktisch. Am Ende der Woche wiederholen wir gemeinsam den Wortschatz. Der Lehrer heißt Herr Neumann. Er ist freundlich und erklärt die Grammatik mit einfachen Beispielen. Im Kurs sprechen wir viel miteinander. Wir üben kurze Gespräche, hören Dialoge und schreiben kleine Texte. In der Pause trinke ich Tee mit zwei anderen Teilnehmenden. Wir helfen einander bei den Hausaufgaben. Ich freue mich auf den Kurs, weil ich für die A2-Prüfung üben möchte. Das Zertifikat brauche ich für meinen Job. Heute habe ich das Lehrbuch gekauft und mein Heft vorbereitet. Ich möchte vor dem ersten Unterricht noch einmal die wichtigsten Wörter wiederholen. So kann ich besser mitarbeiten und den Lehrer verstehen. Nach dem Kurs fahre ich mit dem Bus nach Hause.",
    "t-a2-30": "Mein Lieblingsgericht ist Couscous mit Gemüse und Lamm. Das kocht meine Mutter jeden Freitag in Tunesien. Für das Gericht braucht man Couscous, Karotten, Zucchini, Kichererbsen, Tomaten, Zwiebeln, Knoblauch und Gewürze wie Kreuzkümmel und Paprika. Meine Mutter würzt das Gericht nach Geschmack. Sie bereitet zuerst das Gemüse vor. Sie schält die Karotten und schneidet die Zucchini in Stücke. Die Zwiebeln werden klein geschnitten und mit etwas Öl angebraten. Danach kommen das Lamm, Wasser und die Gewürze in den Topf. Alles kocht langsam, bis das Fleisch weich ist. Der Couscous wird in einem Siebeinsatz über dem Dampf gegart. Die Kichererbsen kochen mit, bis sie weich sind. Am Schluss legt man den Couscous auf einen großen Teller und gibt Fleisch und Gemüse darüber. Es schmeckt besonders gut mit scharfer Harissa. Die Soße steht extra auf dem Tisch, damit jeder selbst entscheiden kann, wie scharf sein Essen sein soll. Am Freitag isst die ganze Familie gemeinsam.",
}


def get_field(item: dict, path: tuple) -> object:
    value: object = item
    for key in path:
        value = value[key]  # type: ignore[index]
    return value


def set_field(item: dict, path: tuple, value: object) -> None:
    parent = item
    for key in path[:-1]:
        parent = parent[key]  # type: ignore[index]
    parent[path[-1]] = value


def main() -> None:
    texts = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    text_by_id = {item["id"]: item for item in texts}
    if len(text_by_id) != len(texts):
        raise ValueError("duplicate text ids")

    changed = False
    for text_id, path, before, after in FIELD_EDITS:
        item = text_by_id.get(text_id)
        if item is None or item.get("level") != "A2":
            raise ValueError(f"missing A2 source text: {text_id}")
        current = get_field(item, path)
        if current == before:
            set_field(item, path, after)
            changed = True
        elif current != after:
            raise ValueError(f"unexpected source value for {text_id} {path}")
    if changed:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    existing = {entry["id"]: entry for entry in entries}
    if len(existing) != len(entries):
        raise ValueError("duplicate HörLabor manifest ids")
    if manifest.get("count") != len(entries) or len(entries) not in (110, 120):
        raise ValueError(f"expected 110 before or 120 after R164a, got count={manifest.get('count')} entries={len(entries)}")

    dialog_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "dialog-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    diktat_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "diktat-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    added = 0
    for text_id, expected_text in AUDIO_TEXTS.items():
        source = text_by_id.get(text_id)
        if source is None or source.get("level") != "A2" or source.get("neu"):
            raise ValueError(f"unknown, wrong-level, or neu source: {text_id}")
        if source.get("de") != expected_text:
            raise ValueError(f"audio source text mismatch: {text_id}")
        if source.get("wordCountDe") != len(source["de"].split()):
            raise ValueError(f"wordCountDe mismatch: {text_id}")
        if len(source.get("questions", [])) != 2 or any(q.get("type") != "mc" or q.get("answer") not in q.get("options", []) for q in source["questions"]):
            raise ValueError(f"question/key mismatch: {text_id}")
        if text_id in dialog_ids or text_id in diktat_ids:
            raise ValueError(f"cross-manifest audio assignment: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        frames = mp3_frame_count(path.read_bytes())
        expected_entry = {
            "id": text_id,
            "file": f"/audio/hoeren/{text_id}.mp3",
            "voice": VOICE,
            "level": "A2",
            "bytes": path.stat().st_size,
        }
        old = existing.get(text_id)
        if old is None:
            entries.append(expected_entry)
            existing[text_id] = expected_entry
            added += 1
        elif any(old.get(key) != value for key, value in expected_entry.items()):
            raise ValueError(f"manifest entry mismatch: {text_id}")
        print(f"✓ {text_id}: {len(source['de'].split())} words · {path.stat().st_size} bytes · {frames} MP3 frames")

    expected_new = set(AUDIO_TEXTS)
    disk_ids = {path.stem for path in AUDIO_DIR.glob("*.mp3")}
    manifest_ids = {entry["id"] for entry in entries}
    if disk_ids != manifest_ids:
        raise ValueError(f"manifest/disk mismatch: disk-only={disk_ids - manifest_ids}, manifest-only={manifest_ids - disk_ids}")
    if not expected_new.issubset(manifest_ids) or len(entries) != 120:
        raise ValueError(f"expected 120 HörLabor entries after R164a, got {len(entries)}")

    manifest["count"] = len(entries)
    manifest["updated"] = date.today().isoformat()
    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R164a: {added} new manifest entries · {manifest['count']} HörLabor files total")


if __name__ == "__main__":
    main()
