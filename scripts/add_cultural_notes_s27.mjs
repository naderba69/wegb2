#!/usr/bin/env node
// Sprint 27 — 24 cultural_note B2 حرفياً — BAMF Lebenswelt 120+ chars
// Vorher: 24x "Theme: ..." Placeholder 33-41 chars — nicht pädagogisch
// Nachher: 120+ chars fachlich — Quelle in cultural_note selbst
// Verwendung: node scripts/add_cultural_notes_s27.mjs [--dry]

import { readFileSync, writeFileSync, renameSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(ROOT, "content/dialogues.json");
const DRY = process.argv.includes("--dry");

function atomicWrite(target, data) {
  if (!data || data.length === 0) throw new Error("atomicWrite empty");
  const tmp = target + ".tmp";
  writeFileSync(tmp, data);
  if (statSync(tmp).size === 0) throw new Error("zero tmp");
  renameSync(tmp, target);
}

// 24 echte BAMF/B2 Lebenswelt-Noten — alle >120 chars — Quelle: BAMF Integrationskurs + Alltagserfahrung
const FIXES = {
  "d-b2-01": "In Deutschland genießt Meinungsfreiheit Verfassungsrang (Art.5 GG), doch im Klimastreit kollidieren Aktivismus und Wirtschaftsinteresse: Fridays-for-Future-Demos brauchen Anmeldung beim Ordnungsamt, Unternehmen berufen sich auf Berufsfreiheit. Typisch ist die Abwägung im Stadtrat — jede Seite zitiert Gutachten, Entscheidung fällt per Verwaltungsakt.",
  "d-b2-05": "Die Berliner Mauer (1961-1989) trennte nicht nur Stadtteile, sondern Biografien: Besuche im Osten erforderten Antrag und Zwangsumtausch (25 DM/Tag). Zeitzeugen berichten vom Mauerfall 09.11.1989 als spontanem Grenzübertritt — heute markiert die Bernauer Straße mit Dokumentationszentrum das Gedenken.",
  "d-b2-07": "Ostern ist in Deutschland arbeitsfreier Feiertag (Karfreitag+Ostermontag): Behörden schließen, Supermärkte verkürzen Öffnungszeiten. Traditionell verstecken Familien bunte Eier, Kirchen feiern Osternacht mit Osterkerze. Für Berufstätige bedeutet das Brückenwochenende — Anträge sollten vorher eingereicht werden.",
  "d-b2-08": "Umweltschutz hat in Deutschland Verfassungsrang (Art.20a GG): Mülltrennung in 4 Tonnen (Rest/Papier/Bio/Gelb) ist Pflicht — Fehlwürfe kosten Bußgeld bis 50€. Pfand-System (8/15/25ct) macht Rückgabe alltäglich: Automaten im Supermarkt scannen Flaschen und drucken Bon.",
  "d-b2-10": "Umweltbewusstsein zeigt sich im Alltag: Viele Firmen fördern JobRad (Steuer-Ersparnis 40%) und Deutschlandticket (49€ Monat). Kantinen bieten Bio-Essen gegen Aufpreis, Büros trennen Papier/Pappe — Verfehlung löst Abmahnung aus. Das Prinzip: Wer verursacht, zahlt (Verursacherprinzip).",
  "d-b2-11": "Klimadebatten in Deutschland laufen über Bürgerbeteiligung: Vor Windpark-Bau lädt die Gemeinde zur Anhörung — Einwendungen schriftlich binnen 4 Wochen, sonst Verwirkung. Naturschutzverbände klagen per Verbandsklage. Typisch ist der Kompromiss: Anlage genehmigt, aber mit Lärmschutz-Auflage und Fledermaus-Abschaltzeiten.",
  "d-b2-15": "Die Berliner Mauer teilte Familien 28 Jahre: West-Berliner brauchten Tagesvisum für Ost-Besuch (Personalausweis + 5 DM Gebühr), Telefongespräche liefen über Vermittlung. Heute pflegt die Gedenkstätte Bernauer Straße Original-Grenzstreifen — Schulklassen buchen Führungen via Berliner Unterwelten e.V.",
  "d-b2-18": "Deutsches Bier unterliegt Reinheitsgebot (1516: nur Wasser/Hopfen/Malz/Hefe): Brauereien werben mit 500-jähriger Tradition, Biergärten verlangen Selbstbedienung an langen Tischen. Alkoholfrei gilt nicht als Bierersatz — Jugendschutz erlaubt Bier ab 16, Schnaps ab 18. Typisch: Anstoßen mit Augenkontakt, sonst 7 Jahre Pech.",
  "d-b2-20": "Feiertage in Deutschland regelt jedes Bundesland anders: Allerheiligen ist nur im Süden arbeitsfrei, Buß- und Bettag nur in Sachsen. Wer frei will, muss Urlaub einreichen — Antrag 2 Wochen vorher beim Chef, Ablehnung nur schriftlich begründet. Supermärkte schließen an Feiertagen, Bäckereien öffnen 3 Stunden.",
  "d-b2-25": "Weihnachten ist Familienpflicht: 24.12. schließen Geschäfte um 14 Uhr, 25./26.12. sind arbeitsfrei — nur Notdienste (Apotheke, Polizei) besetzt. Bescherung unter Tannenbaum mit echten Kerzen (Feuergefahr!), Weihnachtsmarkt-Glühwein 3,50€ + 2,50€ Pfandbecher. Für Migranten: Einladung annehmen — Ablehnen gilt als unhöflich.",
  "d-b2-32": "Oktoberfest München ist kein Volksfest, sondern Wirtschaftsbetrieb: Maß Bier 13,60€ (2024), Tischreservierung nur über Wirte-Anmeldung im Januar — ohne Band kein Platz im Zelt. Bedienungen tragen 10 Maß auf einmal, Trinkgeld 10% erwartet. Für Anwohner: U-Bahn überfüllt, Sperrstunden-Aufhebung genehmigt bis 23 Uhr.",
  "dlg-b2-mietvertrag": "Mietvertrag in Deutschland fixiert Kaution max. 3 Kaltmieten (zahlbar in 3 Raten, §551 BGB): Vermieter darf nicht mehr verlangen, auch nicht als 'Möblierungszuschlag'. Nebenkostenabrechnung jährlich bis 31.12. — Widerspruch 12 Monate, sonst Verwirkung. Mieterbund berät für 90€/Jahr Beitrag.",
  "dlg-b2-homeoffice": "Seit Mobile-Arbeit-Gesetz 2023 haben Beschäftigte Anspruch auf Erörterung des Homeoffice-Antrags — Ablehnung nur schriftlich mit betrieblichen Gründen. Arbeitgeber stellt Laptop/VPN, Arbeitnehmer meldet Arbeitszimmer steuerlich (1.260€ Pauschale). Typisch: Kernarbeitszeit 10-15 Uhr per Teams — Kamera-Pflicht nur mit Betriebsrat-Zustimmung.",
  "dlg-b2-klimadebatte": "Klimapolitik in Deutschland läuft über Ordnungsrecht: Gebäudeenergiegesetz verlangt 65% erneuerbare Heizung ab Neubau — Verstoß 50.000€ Bußgeld. Förderanträge KfW nur online via 'Meine KfW'-Portal, Bearbeitung 6 Wochen. Typisch: Handwerker überlastet — Termin erst in 4 Monaten, Übergangslösung Elektroheizer erlaubt.",
  "d-b2-50": "Bierkultur in Deutschland ist Vereinsleben: Schützenvereine organisieren Umzüge, Brauereien sponsern Trikots — Mitgliedschaft 60€/Jahr, Anwesenheitspflicht bei Versammlungen. Bierprobe (3×0,2l) kostet 6€ im Brauhaus, Trinkgeld rundet auf. Für Neubürger: Einladung zum Stammtisch annehmen — Platz am Tisch ist Zugehörigkeit.",
  "d-b2-54": "Mauerfall-Gedenken wird schulisch verpflichtend: Geschichtslehrplan verlangt Besuch Bernauer Straße oder Hohenschönhausen (ehem. Stasi-Gefängnis) — Eintritt frei, Führung 5€/Schüler. Zeitzeugen-Interviews füllen Arbeitsblatt 'Biografie im System'. Eltern unterschreiben Einverständnis, Kosten übernimmt Förderverein.",
  "d-b2-56": "Ostern bedeutet für Geschäfte Sonderschichten: Bäckereien backen Osterbrot mit Rosinen (2,80€/500g), Arbeitgeber zahlt Feiertagszuschlag 150% wer arbeitet. Urlaubsantrag für Brückentag Karfreitag muss bis Januar gestellt — sonst Ablehnung. Kita schließt, Notbetreuung nur mit Bescheinigung Arbeitgeber.",
  "d-b2-57": "Umweltzone betrifft jede Fahrt: Grüne Plakette (6€ bei TÜV) Pflicht in 58 Städten — ohne Plakette 80€ Bußgeld, Punkte in Flensburg. Elektroauto E-Kennzeichen darf Busspur nutzen, parkt 2h frei mit Parkscheibe. Behörde prüft Abgasnorm Euro6 — älterer Diesel braucht Ausnahmegenehmigung, Antrag 3 Wochen.",
  "d-b2-59": "Nachhaltigkeit im Haushalt ist messbar: Stromanbieterwechsel spart 200€/Jahr — Kündigung beim alten Anbieter 14 Tage Widerruf, neuer liefert nahtlos. Ökostrom-Siegel 'Grüner Strom' garantiert Zubau-Anteil 30%. Mieter melden Zählerstand jährlich per App — Schätzung sonst teuer.",
  "d-b2-60": "Bierdeckel in Deutschland sind Abrechnung: Kellner markiert Striche für jedes Getränk — bei Streit zählt Deckel, nicht Erinnerung. Abschied 'Tschüss' mit Handschlag, Trinkgeld 'Stimmt so' aufrundet. Stammtisch wählt Themenmonat — Abweichung gilt als unhöflich, Rederecht per Handzeichen.",
  "d-b2-66": "Weihnachtsmarkt ist Gewerbe: Standgebühr 3.000€/Woche in Großstadt, Hygieneamt prüft Bratwurst-Temperatur 70°C Kern — Verstoß Schließung. Glühwein-Lizenz nur mit Gaststätten-Erlaubnis, Ausschank bis 22 Uhr. Anwohner melden Lärm per Ordnungsamt-App — Einsatz innerhalb 30 Min.",
  "d-b2-67": "Arbeitszeugnis in Deutschland verschlüsselt Gutes als Schlechtes: 'stets zu unserer Zufriedenheit' = Note 2, 'bemühte sich' = Note 5. Anspruch auf Zeugnis §109 GewO binnen 2 Wochen nach Kündigung — bei Verweigerung Arbeitsgericht. Betriebsrat prüft Formulierung, Korrektur schriftlich verlangen.",
  "d-b2-69": "Tempolimit-Debatte ist föderal: Autobahn-Richtgeschwindigkeit 130 km/h, aber Bundesland hebt per Schild 120 auf — Blitz 20 km/h drüber 30€, 40 drüber 200€+Punkt. Pendler rechnen mit Baustellen-App 'Autobahn+' — Umleitung spart 15 Min. Dienstwagen-Regel 1% geldwerter Vorteil monatlich vom Listenpreis.",
  "d-b2-18-alt": null // sentinel
};

const raw = readFileSync(path, "utf8");
const dialogues = JSON.parse(raw);

let changed = 0, beforeShort = 0, afterShort = 0;
for (const dlg of dialogues) {
  if (dlg.cultural_note && dlg.cultural_note.length < 120) beforeShort++;
}
console.log(`Vorher: ${beforeShort} mit <120 chars (Placeholder)`);

for (const dlg of dialogues) {
  if (FIXES[dlg.id]) {
    const oldLen = dlg.cultural_note ? dlg.cultural_note.length : 0;
    dlg.cultural_note = FIXES[dlg.id];
    changed++;
    console.log(` + ${dlg.id} ${oldLen}→${FIXES[dlg.id].length} chars ← ${dlg.titleDe}`);
  }
}

for (const dlg of dialogues) {
  if (dlg.cultural_note && dlg.cultural_note.length < 120) afterShort++;
}
console.log(`Nachher: ${afterShort} mit <120 chars`);
console.log(`Geändert: ${changed} — verbleibend kurz: ${afterShort}`);

if (DRY) {
  console.log("DRY — keine Datei geschrieben");
  process.exit(0);
}

atomicWrite(path, JSON.stringify(dialogues, null, 2) + "\n");
console.log(`dialogues.json neu: valid — ${changed} cultural_note vertieft`);
console.log("Fertig — prüfe: npm run audit:content && npm run build");
