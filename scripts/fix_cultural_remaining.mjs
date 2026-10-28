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
 "d-a0-04": "Einkaufen: 'Geben Sie mir bitte...' + Akkusativ. An Kasse 'Das macht zusammen...' — passend zahlen oder 'Stimmt so' für Trinkgeld. Bon aufheben für Umtausch innerhalb 14 Tagen mit Kassenbon."
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
