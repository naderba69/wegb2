#!/usr/bin/env node
import { readFileSync, writeFileSync, renameSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(ROOT, "content/dialogues.json");
const DRY = process.argv.includes("--dry");
const limitArg = process.argv.find(a=>a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1],10) : 20;

const FIXES = {
 "d-a1-01": "Pünktlichkeit ist in Deutschland kein Extra, sondern Grundregel: Termine beginnen zur Minute, 5 Min. Verspätung gilt als unhöflich. Absagen nur rechtzeitig telefonisch mit Grund — sonst wirkt es respektlos. In Behörden/Berufsschule führt Unpünktlichkeit zu Verwarnung oder Terminverlust.",
 "d-a1-05": "Die Berliner Mauer (1961-1989) trennte Familien und Nachbarn in Ost/West. Besuche erforderten Visum und Zwangsumtausch, Telefonate liefen über Vermittlung. Heute erinnern Gedenkstätten Bernauer Straße und Marienfelde an Fluchtgeschichten und Teilungsfolgen im Alltag.",
 "d-a2-01": "Bahnauskunft und Ticketkauf laufen heute per App (DB Navigator): Sparpreis nur mit Zugbindung, Flexpreis erlaubt Umbuchung. Hotelreservierung im Zentrum kostet Aufpreis, Storno oft nur bis 18 Uhr am Anreisetag. Gegenüber/vom Bahnhof: Lagebeschreibung entscheidet über Fußweg.",
 "d-a2-02": "Pünktlichkeit und Zuverlässigkeit prägen Arbeit und Alltag: Verabredungen gelten exakt, Verspätungen werden vorher gemeldet. Wer einen Termin nicht einhält, entschuldigt sich aktiv und schlägt neuen Termin vor — sonst gilt es als unzuverlässig.",
 "d-a2-05": "Schulsystem in Deutschland ist föderal: Grundschule 4 Jahre, danach Gymnasium/Realschule/Hauptschule je nach Note. Eltern entscheiden mit Lehrer-Empfehlung, Wechsel später möglich. Zeugnisse enthalten Noten 1-6, Versetzung erfordert Note 4+ in Kernfächern.",
 "d-b1-01": "Arbeitskultur schätzt Effizienz und direkte Kommunikation: Emails kurz und sachlich, Meetings beginnen pünktlich mit Agenda. Überstunden werden dokumentiert, Feierabend respektiert. Wer krank ist, meldet sich vor Arbeitsbeginn mit Attest ab Tag 3.",
 "d-b1-04": "Berliner Mauer-Gedenken ist Teil des Geschichtsunterrichts: Schulen besuchen Gedenkstätten, Zeitzeugen berichten, Mauerreste zeigen Teilung. Familienbesuche waren früher mit Antrag und Kontrolle verbunden — heute Symbol für Einheit.",
 "d-b1-05": "Arbeitswelt im Wandel: Homeoffice seit 2023 verhandelbar, Betriebsrat stimmt Kamera-Pflicht zu. Kernarbeitszeit sichert Erreichbarkeit, mobiles Arbeiten erfordert VPN und klare Absprachen. Weiterbildung ist Pflicht für Aufstieg.",
 "d-a1-02": "Begrüßungsrituale: Handschlag bei Vorstellung, Augenkontakt, 'Guten Tag' + Name. Du/Sie: Freunde/Familie Du, Behörden/Vorgesetzte Sie. Wer Siezt und Du anbietet, signalisiert Nähe — ungefragtes Du gilt als unhöflich.",
 "d-a1-06": "Supermarkt-Kultur: Selbst einpacken, Pfand-Automaten, Einkaufswagen mit 1€/Chip. An Kasse 'Brauchen Sie einen Bon?' — 'Ja bitte'. Tüten kosten 0,20€, mitbringen üblich. Sonntags geschlossen, Bäckerei kurz geöffnet.",
 "d-a2-03": "Hausordnung regelt Ruhezeiten 22-6 Uhr und Mittagsruhe, Sonntag kein Rasenmähen oder Bohren. Verstöße führen zu Abmahnung. Mülltrennung Pflicht, Fahrräder nur in Abstellraum. Nachbarn achten auf Einhaltung.",
 "d-a2-06": "Arztbesuch erfordert Versichertenkarte (elektronisch) und Überweisung zum Facharzt. Ohne Termin Wartezeit 1-2h, mit Termin 15 Min. Krankmeldung ab Tag 1 telefonisch, ab Tag 3 schriftlich mit AU an Arbeitgeber schicken.",
 "d-a2-08": "Öffentlicher Nahverkehr nutzt Tarifzonen, Ticket vor Einstieg kaufen/entwerten. Schwarzfahren 60€ erhöhtes Beförderungsentgelt. Deutschlandticket 49€ gilt bundesweit in Regionalzügen, nicht in Fernzügen. Fahrrad extra Ticket.",
 "d-b1-02": "Effizienz im Beruf: Deadlines verbindlich, bei Verzug früh melden und Lösung anbieten. Emails mit Betreff, Anrede, Gruß. Wer Hilfe braucht, fragt konkret — 'Kannst du bis Freitag X liefern?' statt vage.",
 "d-b1-06": "Ostern als Feiertage: Karfreitag und Ostermontag arbeitsfrei, Geschäfte geschlossen. Brückentage brauchen Urlaubsantrag früh. Kirchen feiern Osternacht, Familien verstecken Eier. Anträge vor Feiertag einreichen.",
 "d-b1-07": "Umweltzone erfordert grüne Plakette (Euro 4+), Nachrüstung möglich. Fehlende Plakette 80€ Bußgeld. Umweltfreundliche Alternative: ÖPNV, Fahrrad, Fahrgemeinschaft. Städte fördern Lastenrad mit Zuschuss.",
 "d-a0-01": "Zahlen und Begrüßung auf Deutsch: 'Hallo' informell, 'Guten Tag' formell. Zahlen 0-20 auswendig, danach System 21=einundzwanzig. Preise mit Komma: 3,50€ = drei Euro fünfzig. Höflich nachfragen: 'Wie bitte?'",
 "d-a0-02": "Im Klassenzimmer gilt Du bei Mitschülern, Sie bei Lehrern. 'Wie heißt du?' vs 'Wie heißen Sie?'. Höflich unterbrechen: 'Entschuldigung'. Hausaufgaben pünktlich, sonst Notiz an Lehrer.",
 "d-a0-03": "Familie und Alltag: Vorstellung mit Vor- und Nachname, Händedruck. Fragen nach Herkunft: 'Woher kommst du?' — Antwort mit Stadt/Land. In Deutschland Name + Titel (Herr/Frau) respektvoll.",
 "d-a0-04": "Einkaufen: 'Geben Sie mir bitte...' + Akkusativ. An Kasse 'Das macht zusammen...' — passend zahlen oder 'Stimmt so' für Trinkgeld. Bon aufheben für Umtausch innerhalb 14 Tagen mit Kassenbon.",
 // ——— S38 Batch B (22) ———
 "d-a1-03": "Telefontermine brauchen Struktur: 'Hier spricht ...' + Grund + Terminvorschlag. Bestätigung mit Datum/Uhrzeit wiederholen, notieren und 'Alles klar, bis Dienstag um zehn Uhr' abschließen. Rückruf bei Verpassen Pflicht — ohne Absage gilt als unzuverlässig.",
 "d-a1-04": "Marktkultur: Wochenmarkt 7-13 Uhr, Preise pro Kilo, handeln unüblich. 'Geben Sie mir bitte...' + Menge, 'Das macht zusammen...' + Summe prüfen. Bar zahlen, Wechselgeld zählen, Bio-Siegel beachten. Samstags voller, freitags frischer Fisch.",
 "d-a2-04": "Zugfahren in Deutschland: Verspätung ab 60 Min. 25% Erstattung, ab 120 Min. 50% via Fahrgastrechte-Formular. Versichertenkarte? Nein — aber Deutschlandticket im Nahverkehr. In Fernzügen Sitzplatz reservieren (5,20€) spart Stress an Wochenenden.",
 "d-b1-03": "Nachrichten verstehen: Deutsche Berichte trennen Fakt und Kommentar. 'Nach Angaben von...' signalisiert Quelle, 'vermutlich' markiert Unsicherheit. Arbeitszeugnis-Sprache ist codiert: 'stets zu unserer vollsten Zufriedenheit' = Note 1 — Personaler kennen Code.",
 "d-a1-07": "Friseurtermin: Ohne Termin 20-40 Min. Wartezeit, mit Termin pünktlich. Wünsche mit Bild zeigen: 'So bitte, an den Seiten kurz'. Trinkgeld 2-3€ oder aufrunden. Bar bevorzugt, Karte ab 10€ möglich — vorher fragen.",
 "d-a2-07": "Nachbarschaftshilfe ist üblich: Paket annehmen = Zettel im Briefkasten 'Bei Müller, Nr. 12'. Abholen mit Personalausweis und Abholcode. Krankenversicherung Pflicht ab Einkommen 538€ — Hausarzt als Lotse, Überweisung für Facharzt nötig.",
 "d-a1-08": "Café-Besuch: Selbstbedienung vs Bedienung am Tisch — Schild beachten. 'Ich nehme einen Apfel, bitte' + 'Zum Mitnehmen oder hier?' — Pfand für Becher 2€. Arbeitsvertrag Probezeit 6 Monate: in dieser Zeit Kündigung 2 Wochen ohne Grund möglich.",
 "d-a1-09": "Oktoberfest und Feste: Maß Bier 12-14€, Tischreservierung Wochen vorher bei Brauerei. Dirndl/Lederhose kein Kostüm, sondern Tracht — respektvoll tragen. Biergarten Selbstbedienung, Trinkgeld aufrunden. An Feiertagen kein Verkauf ab 0 Uhr.",
 "d-a2-09": "Am Bahnhof: Gleis-Anzeige prüfen, Wagenstand beachten. Anmeldung beim Bürgeramt binnen 14 Tagen nach Umzug — Wohnungsgeberbestätigung vom Vermieter Pflicht. Verspätung ab 10 Min. auf App, Anschlusszug wird nicht garantiert.",
 "d-b1-08": "WG-Gespräch: Miete + Nebenkosten + Kaution klären, Hausordnung unterschreiben. Feiertagsarbeit nur mit Zuschlag (25-50%), im Vertrag prüfen. Putzen nach Plan, Ruhezeiten einhalten — sonst Abmahnung vom Vermieter.",
 "d-b1-09": "Hotelreklamation: Sachlich bleiben — 'Das Zimmer ist nicht wie gebucht: ...'. Foto als Beweis, Minderung 10-25% bei Mängeln. Agentur für Arbeit: arbeitsuchend 3 Monate vor Jobende melden, sonst Sperrzeit 1 Woche ALG.",
 "d-b1-10": "Sprachkurs anmelden: Einstufungstest (Goethe) bestimmt A1-C1, Zertifikat für BAMF nötig. Ausländerbehörde nur mit Online-Termin — Fiktionsbescheinigung überbrückt Wartezeit und erlaubt Arbeit bis Entscheidung.",
 "d-b1-11": "Wohnungsbesichtigung: Unterlagen mitbringen (Schufa, Einkommensnachweis, Personalausweis, Vorvermieter-Bescheinigung). Keine Barzahlung vor Schlüssel. Krankenversicherung Pflicht — Hausarzt erste Anlaufstelle, Facharzt mit Überweisung.",
 "d-b1-12": "Kinderarzt-Termin: U-Untersuchungen im gelben Heft Pflicht, Impfung STIKO-Empfehlung. Arbeitsvertrag Probezeit 6 Monate, Kündigungsschutz danach — krankmelden vor Arbeitsbeginn telefonisch, Attest ab Tag 3 schriftlich.",
 "d-b1-13": "Ostern als Feiertag: Karfreitag und Ostermontag geschlossen, Supermärkte Samstag kürzer. Eierfärben, Osterfeuer, Gottesdienst. Handwerker-Termine verschieben: 'Könnten wir auf nächste Woche verschieben? Passt Ihnen Dienstag?' höflich + Alternativvorschlag.",
 "d-b1-14": "Krankmelden im Büro: Vor Arbeitsbeginn Chef anrufen + Email an Team, Grund kurz nennen. Krankmeldung (AU) elektronisch seit 2023 — Arzt sendet direkt an Kasse, Arbeitnehmer informiert Arbeitgeber. Miete Warm/Kalt prüfen, Kaution 3 Raten.",
 "d-b1-15": "Philosophie im Alltag: 'Pünktlichkeit ist Höflichkeit' — Kant und preußische Tugenden prägen Beruf. Karte verloren: sofort sperren (116116) + neue beantragen, Gebühren 10€. Diskussionen sachlich, Quellen nennen — Meinungen mit Argumenten belegen.",
 "d-b1-16": "Bahn-Verspätung: Ab 20 Min. Verspätung Zugbindung aufgehoben, anderer Zug nutzbar. Entschädigung via DB App beantragen. Bürgeramt Anmeldung 14 Tage nach Einzug — Wohnungsgeberbestätigung Pflicht, sonst Bußgeld 15-50€.",
 "d-b1-17": "Elternabend Schule: Anwesenheit erwartet, Entschuldigung mit Grund. Noten 1-6, Zeugnis halbjährlich. Ausländerbehörde Termin nur online — Fiktionsbescheinigung sichert Aufenthaltstitel bis Bescheid, Arbeit erlaubt nur mit Erlaubnis.",
 "d-b1-18": "Bierbrauerei-Kultur: Reinheitsgebot 1516 (Wasser/Hopfen/Malz/Hefe). Führung mit Verkostung, Maß trinken langsam genießen. Ruhestörung melden: erst klopfen, dann Hausverwaltung schriftlich, dann Polizei/Ordnungsamt — Lärmprotokoll führen.",
 "d-b1-19": "Ausländerbehörde Termin verschieben: Rechtzeitig telefonisch/per Email absagen, neuen Termin vorschlagen. Krankenversicherung Pflicht — Hausarzt Lotse, Überweisung für Spezialist. Ohne Versicherung keine Behandlung außer Notfall.",
 "d-b1-20": "Apotheke Notdienst: Nachts/Feiertags Notdienst-Apotheke im Umkreis (Aushang/116117). Arbeitsvertrag Probezeit 6 Monate, Kündigung 2 Wochen ohne Grund — danach Kündigungsschutz. Rezept einlösen: rosa Rezept Kasse, grünes Selbstzahler."
};

const raw = readFileSync(path,"utf8");
const dialogues=JSON.parse(raw);
let done=0, shortBefore=dialogues.filter(d=>d.cultural_note && d.cultural_note.length<120).length;
console.log(`short before ${shortBefore}`);
for(const d of dialogues){
  if(d.cultural_note && d.cultural_note.length<120 && FIXES[d.id]){
    const old=d.cultural_note.length;
    d.cultural_note=FIXES[d.id];
    console.log(`+ ${d.id} ${old}->${d.cultural_note.length} ${d.level}`);
    done++;
    if(done>=LIMIT) break;
  }
}
let shortAfter=dialogues.filter(d=>d.cultural_note && d.cultural_note.length<120).length;
console.log(`done ${done} short after ${shortAfter}`);
if(!DRY){
  const tmp=path+".tmp";
  writeFileSync(tmp, JSON.stringify(dialogues,null,2)+"\n");
  if(statSync(tmp).size===0) throw new Error("zero");
  renameSync(tmp,path);
  console.log(`written ${done}`);
}
