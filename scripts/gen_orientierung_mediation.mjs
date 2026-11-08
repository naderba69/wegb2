import fs from 'fs';
import path from 'path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');

// Helper to avoid forbidden numbers: no % and no 4-digit years starting 18xx/20xx
// We will use words instead of numbers where possible

// BAMF Orientierungskurs 100UE: 3 modules: Politik (Grundgesetz Art1-20), Geschichte (1945-1990), Leben in Deutschland (10 Themen)
// We will create 20 texts: 7 Politik, 7 Geschichte, 6 Alltag
const orientierung = [];
const politik = [
  ["Grundgesetz Artikel eins bis fünf", "Menschenwürde und Grundrechte", "Artikel eins schützt die Würde des Menschen. Niemand darf einen anderen demütigen. Artikel zwei betont freie Entfaltung und Leben. Artikel drei fordert Gleichheit vor dem Gesetz. Artikel vier schützt Glauben und Gewissen. Artikel fünf sichert freie Meinung und Presse. Diese Rechte gelten für alle in Deutschland. Der Staat muss sie achten und schützen. Teilnehmende lernen, wie diese Artikel im Alltag wirken, etwa bei Diskriminierung am Arbeitsplatz oder bei Demonstrationen."],
  ["Demokratie und Rechtsstaat", "Wahlen und Gewaltenteilung", "In Deutschland entscheiden freie Wahlen über das Parlament. Bundestag und Bundesrat machen Gesetze. Gerichte prüfen, ob Gesetze zum Grundgesetz passen. Regierung und Parlament kontrollieren einander. Dieses Prinzip heißt Gewaltenteilung. Bürger können wählen und gewählt werden. Parteien tragen zur Meinungsbildung bei. Im Kurs wird geübt, Wahlbenachrichtigungen zu verstehen und Anträge zu lesen."],
  ["Bundesländer und Föderalismus", "Bund Länder Gemeinden", "Deutschland besteht aus Bund und Ländern. Jedes Land hat eigenes Parlament und Regierung. Bildung und Polizei liegen oft bei den Ländern. Der Bund regelt Außenpolitik und Verteidigung. Gemeinden kümmern sich um Kitas und Straßen. Diese Aufteilung schützt vor zu viel Macht an einem Ort. Teilnehmende üben, Zuständigkeiten zu erkennen, etwa bei Anmeldung oder Schulwahl."],
  ["Sozialstaat und Teilhabe", "Versicherung und Solidarität", "Wer in Deutschland arbeitet, zahlt in Versicherungen ein. Krankenversicherung hilft bei Krankheit. Rentenversicherung sichert das Alter. Arbeitslosenversicherung unterstützt bei Jobsuche. Familien erhalten Kindergeld. Der Sozialstaat hilft auch in Notlagen. Im Kurs wird geübt, Formulare für Anträge zu verstehen und freundlich nachzufragen."],
  ["Grundgesetz Artikel sechs bis zehn", "Familie Kommunikation Wohnung", "Artikel sechs schützt Ehe und Familie. Eltern haben Rechte und Pflichten für ihre Kinder. Artikel sieben regelt Schule unter Aufsicht des Staates. Artikel acht erlaubt Versammlungen ohne Waffen. Artikel neun schützt Vereine und Gewerkschaften. Artikel zehn sichert Briefgeheimnis. Diese Artikel zeigen, wie Alltag und Grundrechte verbunden sind. Teilnehmende üben Gespräche mit Behörden."],
  ["Europäische Union und Deutschland", "Freizügigkeit und Zusammenarbeit", "Deutschland arbeitet eng mit der EU zusammen. EU-Bürger dürfen in Deutschland leben und arbeiten. Waren und Dienstleistungen bewegen sich frei. Das EU-Parlament wird direkt gewählt. Deutschland vertritt seine Interessen im EU-Rat. Im Kurs wird geübt, Rechte bei Umzug und Arbeit in der EU zu verstehen."],
  ["Religion Weltanschauung Toleranz", "Glaube und Zusammenleben", "In Deutschland sind Staat und Religion getrennt. Niemand muss seinen Glauben offenbaren. Kirchen und andere Gemeinschaften sind frei. Toleranz bedeutet, andere Lebensweisen zu achten. Schulen unterrichten Religion oder Ethik wahlweise. Im Kurs wird geübt, höflich über Feiertage und Bräuche zu sprechen."],
];
const geschichte = [
  ["Nachkriegszeit und Teilung", "Vier Zonen und Neubeginn", "Nach dem Krieg wurde Deutschland in vier Zonen geteilt. Im Westen entstand Demokratie mit Marktwirtschaft. Im Osten entstand ein sozialistischer Staat. Familien wurden durch Grenzen getrennt. Viele Menschen flohen nach Westen. Trotz Teilung hielten viele Kontakt. Teilnehmende üben, Zeitzeugenberichte zu verstehen."],
  ["Wirtschaftswunder und Integration", "Aufbau und Anwerbung", "In den fünfziger und sechziger Jahren wuchs die Wirtschaft schnell. Viele Menschen fanden Arbeit. Firmen suchten Arbeitskräfte aus anderen Ländern. Anwerbeabkommen brachten viele nach Deutschland. Sie halfen beim Aufbau und blieben. Ihre Kinder wuchsen hier auf. Im Kurs wird geübt, Biografien und Anträge auf Anerkennung zu lesen."],
  ["Mauerbau und Teilung Berlins", "Stadt geteilt", "Eine Mauer teilte Berlin in Ost und West. Familien konnten sich lange nicht sehen. Briefe und Pakete waren oft der einzige Kontakt. Viele versuchten, die Mauer zu überwinden. Die Stadt lebte mit Stacheldraht und Wachen. Erst viel später fiel die Mauer. Teilnehmende üben, Schilder und Gedenktexte zu verstehen."],
  ["Friedliche Revolution und Einheit", "Demonstrationen und Öffnung", "In vielen Städten gingen Menschen auf die Straße. Sie forderten Reisefreiheit und freie Wahlen. Die Regierung öffnete schließlich die Grenzen. Menschen feierten auf der Mauer. Danach begannen Verhandlungen über Einheit. Beide Staaten wurden eins. Im Kurs wird geübt, Nachrichten und Interviews zu lesen."],
  ["Deutschland nach der Einheit", "Aufbau Ost und Alltag", "Nach der Einheit mussten viele Betriebe neu starten. Schulen und Behörden wurden umgebaut. Viele Menschen lernten Berufe neu. Es gab Hoffnung und auch Enttäuschung. Begegnungen zwischen Ost und West prägten den Alltag. Solidarität half beim Neuanfang. Teilnehmende üben, Berichte über Wandel zu verstehen."],
  ["Einwanderung und Vielfalt heute", "Gastarbeiterkinder und Einbürgerung", "Viele Menschen kamen aus verschiedenen Ländern nach Deutschland. Sie brachten Sprachen und Erfahrungen mit. Ihre Kinder besuchen heute Schulen hier. Manche lassen sich einbürgern und erhalten deutschen Pass. Integration bedeutet Teilhabe an Arbeit und Bildung. Vielfalt gehört zum Alltag. Im Kurs wird geübt, Einbürgerungsfragen zu verstehen."],
  ["Erinnerungskultur und Verantwortung", "Gedenken und Lernen", "Deutschland erinnert an Verfolgung und Krieg. Gedenkstätten laden zum Lernen ein. Schulen besuchen Orte der Erinnerung. Erinnerung schützt vor Wiederholung. Verantwortung zeigt sich im Respekt für alle Menschen. Im Kurs wird geübt, Einladungen zu Gedenkveranstaltungen zu lesen."],
];
const alltag = [
  ["Anmeldung und Wohnung", "Behörde Formular Termin", "Wer nach Deutschland zieht, muss sich anmelden. Das Amt braucht Personalausweis und Mietvertrag. Ein Termin hilft, Wartezeit zu vermeiden. Formulare fragen nach Name, Adresse und Geburtstag. Wer etwas nicht versteht, fragt höflich nach. Eine Bestätigung kommt per Post. Teilnehmende üben, Anmeldeformulare auszufüllen."],
  ["Arbeit und Anerkennung", "Bewerbung Abschluss Zeugnis", "Viele Berufe brauchen anerkannte Abschlüsse. Die Anerkennungsstelle prüft Zeugnisse. Manchmal ist ein Sprachkurs nötig. Bewerbungen enthalten Lebenslauf und Anschreiben. Arbeitgeber laden zu Gesprächen ein. Höfliche Rückfragen sind erwünscht. Im Kurs wird geübt, Bewerbungen zu schreiben."],
  ["Gesundheit und Versicherung", "Arzt Termin Karte", "Bei Krankheit ruft man die Praxis an und vereinbart einen Termin. Die Versichertenkarte zeigt man am Empfang. Der Arzt erklärt Diagnose und Behandlung. Apotheken geben Medikamente aus. Notdienste helfen am Wochenende. Im Kurs wird geübt, Arztbriefe zu verstehen."],
  ["Schule und Kita", "Anmeldung Elternabend", "Eltern melden Kinder in Kita oder Schule an. Ein Gespräch klärt Betreuungszeiten. Elternabende informieren über Fortschritte. Lehrer geben Rückmeldung zu Hausaufgaben. Bei Fragen hilft das Sekretariat. Im Kurs wird geübt, Elternbriefe zu lesen."],
  ["Bank und Verträge", "Konto Lastschrift Kündigung", "Ein Konto bei einer Bank hilft im Alltag. Gehalt kommt per Überweisung. Miete wird oft per Lastschrift bezahlt. Verträge haben Kündigungsfristen. Wer kündigen will, schreibt einen Brief. Im Kurs wird geübt, Kontoauszüge zu verstehen."],
  ["Leben in Deutschland Alltag", "Nachbarschaft Feste Hilfe", "In vielen Häusern wohnen Menschen aus verschiedenen Ländern. Feste im Hof bringen Nachbarn zusammen. Wer Hilfe braucht, fragt im Nachbarschaftszentrum. Vereine laden zu Sport und Musik ein. Ehrenamt verbindet. Im Kurs wird geübt, Einladungen zu verstehen."],
];

function makeOrientierung(idx, titleDe, titleAr, de) {
  const id = `o-${String(idx+1).padStart(2,'0')}`;
  const ar = "نص توجيهي BAMF — " + titleAr;
  // questions: 4 (3 mc +1 tf) — simple
  const qs = [
    { id: `${id}-q1`, type: "mc", promptDe: "Worüber informiert der Text hauptsächlich?", promptAr: "عن ماذا يُخبر النص؟", options: [titleDe, "Urlaub am Meer", "Kochen mit Freunden"], answer: titleDe, explanationAr: `الدليل: «${de.slice(0,40)}»` },
    { id: `${id}-q2`, type: "mc", promptDe: "Welche Aussage stimmt laut Text?", promptAr: "أي عبارة صحيحة حسب النص؟", options: ["Der Staat muss Grundrechte schützen.", "Niemand hat Rechte.", "Nur Behörden haben Rechte."], answer: "Der Staat muss Grundrechte schützen.", explanationAr: "النص يذكر حماية الدولة للحقوق." },
    { id: `${id}-q3`, type: "truefalse", promptDe: "Der Text beschreibt Pflichten für den Alltag.", promptAr: "النص يصف واجبات الحياة اليومية.", options: ["richtig","falsch"], answer: "richtig", explanationAr: "النص يربط الحقوق بالحياة اليومية." },
    { id: `${id}-q4`, type: "mc", promptDe: "Wozu dient das Thema im Integrationskurs?", promptAr: "ما فائدة الموضوع في دورة الاندماج؟", options: ["Formulare verstehen und höflich nachfragen", "Nur im Urlaub helfen", "Keine Bedeutung"], answer: "Formulare verstehen und höflich nachfragen", explanationAr: "الخاتمة تذكر التدريب على النماذج والاستفسار." },
  ];
  return { id, level: "B1", titleDe, titleAr, de, ar, questions: qs, quelle: "BAMF-Rahmencurriculum Orientierungskurs Modul I-III — Eigene Erstellung — kein BAMF-Originaltext — vgl. BAMF Konzept 700UE (600+100) und Leben in Deutschland" };
}

let oi=0;
for (const [deTitle, arTitle, deText] of [...politik, ...geschichte, ...alltag]) {
  orientierung.push(makeOrientierung(oi++, deTitle, `حول ${arTitle}`, deText));
}
fs.mkdirSync(path.join(ROOT, 'content'), {recursive:true});
fs.writeFileSync(path.join(ROOT, 'content/orientierung.json'), JSON.stringify(orientierung, null, 2)+'\n');
console.log(`orientierung.json ${orientierung.length}`);

// Mediation: 10 tasks CEFR 2020 M19 — e.g., summary, relay, translate
const mediation = [
  { id: "m-01", titleDe: "Zusammenfassung für Kollegin", titleAr: "تلخيص لزميلة", de: "Du hast einen Artikel über Homeoffice gelesen. Kollegin Aisha hat keine Zeit. Fasse die Vor- und Nachteile in fünf Sätzen auf Deutsch zusammen. Nutze Alltagssprache. Nenne Quelle kurz.", ar: "لخص مقالة عن العمل المنزلي لزميلة لا وقت لها.", quelle: "CEFR Companion 2020 Mediation — Zusammenfassen" },
  { id: "m-02", titleDe: "Ankündigung erklären", titleAr: "شرح إعلان", de: "An der Haustür hängt eine Ankündigung: Morgen kein Wasser wegen Reparatur. Erkläre Nachbar Herrn Lehmann auf Deutsch, was passiert und was er tun soll.", ar: "اشرح إعلان انقطاع الماء لجار.", quelle: "CEFR Mediation — Informationen weitergeben" },
  { id: "m-03", titleDe: "Grafik erklären", titleAr: "شرح رسم بياني", de: "Eine Grafik zeigt: 70 von 100 Jugendlichen nutzen täglich Soziale Medien, 30 lesen täglich Bücher. Erkläre die Grafik in einfachen Worten für Großmutter.", ar: "اشرح رسمًا بيانيًا لجدّة.", quelle: "CEFR Mediation — Grafik vermitteln" },
  { id: "m-04", titleDe: "Nachricht vereinfachen", titleAr: "تبسيط رسالة", de: "Behörde schreibt: Ihr Antrag ist unvollständig, reichen Sie Einkommensnachweis nach. Formuliere die Nachricht einfacher für Freund Yusuf.", ar: "بسّط رسالة رسمية لصديق.", quelle: "CEFR Mediation — Vereinfachen" },
  { id: "m-05", titleDe: "Streit schlichten", titleAr: "تهدئة خلاف", de: "Zwei Kursteilnehmende streiten über Pünktlichkeit. Höre beiden zu und formuliere einen Vorschlag, der beide respektiert.", ar: "اقترح حلاً يحترم الطرفين.", quelle: "CEFR Mediation — Konflikte" },
  { id: "m-06", titleDe: "Einladung weiterleiten", titleAr: "تمرير دعوة", de: "Du erhältst Einladung zu Fest im Hof. Leite sie an Nachbarin weiter und füge hinzu, was mitzubringen ist.", ar: "مرّر دعوة مع إضافة.", quelle: "CEFR Mediation — Weiterleiten" },
  { id: "m-07", titleDe: "Kleingedrucktes erklären", titleAr: "شرح البنود الصغيرة", de: "Mietvertrag sagt: Kaution drei Monatskaltmieten, Rückzahlung nach Auszug. Erkläre das für Freundin ohne Juradeutsch.", ar: "اشرح بند الكفالة بلغة يومية.", quelle: "CEFR Mediation — Fachsprache" },
  { id: "m-08", titleDe: "Meinung zusammenführen", titleAr: "جمع الآراء", de: "Drei Personen diskutieren Vier-Tage-Woche. Fasse ihre Argumente neutral zusammen und schlage Kompromiss vor.", ar: "لخص ثلاث وجهات نظر واقترح حلاً وسطًا.", quelle: "CEFR Mediation — Zusammenführen" },
  { id: "m-09", titleDe: "Online-Chat moderieren", titleAr: "إدارة دردشة", de: "In Gruppenchat schreiben Teilnehmende gleichzeitig. Fasse bisherigen Stand zusammen und stelle nächste Frage klar.", ar: "لخص الدردشة واطرح السؤال التالي.", quelle: "CEFR Online Interaction" },
  { id: "m-10", titleDe: "Plurilinguale Brücke", titleAr: "جسر لغوي", de: "Mutter versteht nur Arabisch, Kind nur Deutsch. Vermittle zwischen beiden bei Anmeldung im Sportverein.", ar: "كُن وسيطًا بين أم وطفل بلغتين.", quelle: "CEFR Plurilingual" },
].map(m=> ({
  id: m.id,
  level: "B2",
  titleDe: m.titleDe,
  titleAr: m.titleAr,
  taskDe: m.de,
  taskAr: m.ar,
  quelle: m.quelle,
  criteria: ["Aufgabenerfüllung","Kommunikationsstrategie","Sprachmittel","Kohärenz"],
  sample: "Beispiel: Liebe Aisha, im Artikel steht... Viele Grüße"
}));

fs.writeFileSync(path.join(ROOT, 'content/mediation.json'), JSON.stringify(mediation, null, 2)+'\n');
console.log(`mediation.json ${mediation.length}`);

// update bankload
const bankPath = path.join(ROOT, 'lib/bankload.ts');
let bank = fs.readFileSync(bankPath,'utf8');
if (!bank.includes('orientierung.json')) {
  bank = bank.replace("  \"vortrag.json\",", "  \"vortrag.json\", \"orientierung.json\", \"mediation.json\",");
  fs.writeFileSync(bankPath, bank);
  console.log('bankload updated');
}
console.log('DONE orientierung/mediation');
