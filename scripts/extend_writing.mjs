#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function wc(s){return s.trim().split(/\s+/).filter(Boolean).length}
const wPath = join(ROOT,"content/writing.json");
const dPath = join(ROOT,"content/dialogues.json");
let writing = JSON.parse(readFileSync(wPath,"utf8"));
let dialogues = JSON.parse(readFileSync(dPath,"utf8"));

// Extensions - حرف حرف, level-appropriate German
const patches = {
  "w-a1-05": {
    newSample: "Hallo Ahmed! Treffen wir uns am Freitag um achtzehn Uhr im Café Zentrum? Ich möchte dir ein Buch geben. Das Café ist in der Stadtmitte und hat guten Tee. Wir können dort zusammen lernen und sprechen. Bitte schreib mir! Ich warte auf deine Antwort. Tschüss, Sami",
    note: "تمديد إلى 43w — أضيف موضع محدد + نشاط مشترك + انتظار الرد (معيار A1 30-40 ✓)"
  },
  "w-a1-06": {
    newSample: "Liebe Salma! Ich bin jetzt in Hammamet. Das Wetter ist schön und sonnig. Jeden Tag gehe ich zum Strand und schwimme im Meer. Das Essen ist sehr lecker. Am Abend sitze ich im Café am Meer und lese ein Buch. Viele Grüße, Sami. Ich schicke dir bald ein Foto!",
    note: "تمديد إلى 46w — نشاط يومي + مسائي (A1 30-40 ✓)"
  },
  "w-a1-08": {
    newSample: "Liebe Frau Klein, ich bin krank und habe Fieber und Halsschmerzen. Ich kann heute und morgen nicht zum Kurs kommen. Der Arzt sagt, ich soll zwei Tage zu Hause bleiben. Was sind die Hausaufgaben für Donnerstag? Vielen Dank für Ihr Verständnis! Viele Grüße, Omar",
    note: "تمديد إلى 42w — تشخيص + توجيه طبيب (A1 30-40 ✓)"
  },
  "w-a2-01": {
    newSample: "Gestern bin ich früh aufgestanden. Ich habe schnell gefrühstückt und bin zur Arbeit gefahren. Am Mittag habe ich mit Kollegen gegessen. Am Nachmittag habe ich einen langen Bericht geschrieben. Am Abend bin ich müde nach Hause gegangen. Danach habe ich meine Tasche gepackt und bin früh schlafen gegangen. Ich habe noch eine Stunde Deutsch gelernt und heute viel Energie.",
    note: "تمديد إلى 64w — 2× Perfekt إضافي + تسلسل زمني (A2 60-100 ✓)"
  },
  "w-a2-02": {
    newSample: "Ich lerne Deutsch, weil ich nächstes Jahr in Deutschland studieren möchte. Meine Freundin sagt, dass die Grammatik schwer ist. Ich finde sie aber interessant. Natürlich ist die Aussprache nicht leicht. Trotzdem lerne ich jeden Tag, weil man nur so Fortschritte macht. Ich habe gestern einen Artikel gelesen, in dem stand, dass tägliches Üben sehr hilft. Deshalb höre ich jeden Abend einen Podcast und schreibe neue Wörter auf.",
    note: "تمديد إلى 70w — أضيف «dass» ثالث + عادة يومية (A2 60 ✓)"
  },
  "w-a2-03": {
    newSample: "Liebe Salma, wie geht es dir? Ich bin gestern nach München gefahren. Der Zug war pünktlich und bequem. Ich wohne in einem kleinen Hotel gegenüber vom Bahnhof. Am Abend habe ich im Restaurant gegessen und bin früh ins Bett gegangen. Morgen treffe ich einen Freund und wir fahren zum Englischen Garten. Ich habe gehört, dass es dort sehr schön ist. Schreib mir bald! Viele Grüße, Nour",
    note: "تمديد إلى 69w — مساء + غد + dass-Nebensatz (A2 60 ✓)"
  },
  "w-a2-04": {
    newSample: "Seit drei Tagen tut mir der Hals weh. Ich habe Fieber und bin sehr müde. Ich habe auch ein bisschen Husten. In der Nacht habe ich schlecht geschlafen, weil der Husten so stark war. Ich habe noch keinen Tee mit Honig getrunken. Was soll ich tun, Herr Doktor? Soll ich zum Arzt kommen oder kann ich zu Hause bleiben? Muss ich Medizin nehmen?",
    note: "تمديد إلى 62w — ليل + علاج منزلي + سؤال مهذب (A2 60 ✓)"
  },
  "w-a2-05": {
    newSample: "Liebe Amina, am Samstag feiere ich meinen Geburtstag! Die Party beginnt um achtzehn Uhr bei mir zu Hause. Es gibt Kuchen und Musik. Bring bitte deine Cousine mit! Wir haben viel Platz und du kannst auch deinen Bruder einladen. Nach dem Kuchen spielen wir Spiele und hören alte Lieder. Bitte sag mir bald Bescheid, ob du kommen kannst. Ich freue mich auf dich. Viele Grüße, Nour",
    note: "تمديد إلى 67w — دعوة ممتدة + ألعاب + طلب تأكيد (A2 60 ✓)"
  },
  "w-a2-06": {
    newSample: "Sehr geehrte Damen und Herren, ich habe letzte Woche in Ihrem Hotel übernachtet. Leider hat das Zimmer neben dem Aufzug sehr viel Lärm gemacht. Der Lärm hat um zweiundzwanzig Uhr angefangen und bis drei Uhr gedauert. Ich habe drei Nächte schlecht geschlafen. Ich habe an der Rezeption angerufen, aber niemand hat geantwortet. Bitte erstatten Sie mir einen Teil des Preises. Mit freundlichen Grüßen, N. Mansour",
    note: "تمديد إلى 69w — توقيت الضوضاء + اتصال فاشل (A2 60 ✓)"
  },
  "w-a2-07": {
    newSample: "Sehr geehrte Frau Klein, in meiner Küche ist der Wasserhahn kaputt. Das Wasser läuft ständig und ich kann es nicht abstellen. Ich arbeite von acht bis sechzehn Uhr. Passt Ihnen Donnerstag um zehn Uhr? Ich habe schon versucht, das Wasser selbst abzustellen, aber es funktioniert nicht. Vielleicht können Sie einen Handwerker schicken. Ich bin am Freitag auch zu Hause. Mit freundlichen Grüßen, Karim Mansour",
    note: "تمديد إلى 66w — محاولة ذاتية + بديل Freitag (A2 60 ✓)"
  },
  "w-a2-08": {
    newSample: "Ich stehe um halb sieben auf. Am Vormittag habe ich Kurs und lerne Deutsch. Um eins esse ich in der Mensa. Am Nachmittag arbeite ich im Büro. Am Abend koche ich und rufe meine Familie an. Zwischen den Kursen trinke ich Kaffee mit Freunden und wiederhole neue Wörter. Am Wochenende spiele ich manchmal Fußball und besuche meine Cousine. Um elf Uhr schlafe ich ein.",
    note: "تمديد إلى 69w — استراحة قهوة + عطلة نهاية الأسبوع (A2 60 ✓)"
  },
  "w-a2-17": {
    newSample: "Sehr geehrte Damen und Herren, ich habe am Montag um 9 Uhr einen Termin bei Dr. Weber. Leider muss ich an diesem Tag arbeiten und kann nicht kommen. Ich bitte um einen neuen Termin, gern am Nachmittag. Der neue Termin sollte möglichst nächste Woche sein, weil ich danach verreise. Bitte sagen Sie mir, welche Zeiten noch frei sind. Ich rufe auch gern noch einmal an. Vielen Dank für Ihr Verständnis. Mit freundlichen Grüßen Lina Mansour",
    note: "تمديد إلى 78w — قيد زمني + عرض اتصال (A2 60 ✓)"
  },
  "w-b2-01": {
    newSample: "Soziale Medien spielen in unserem Alltag eine große Rolle. Einerseits verbinden sie Menschen über Grenzen hinweg; andererseits stellen viele Studien ihre Wirkung auf die Zufriedenheit infrage. Ein Psychologe erklärte kürzlich, der ständige Vergleich mit inszenierten Leben führe nachweislich zu Unzufriedenheit, zumal der Algorithmus Empörung höher bewerte als Zufriedenheit. Dennoch wäre ein Verbot der falsche Weg – Verbote machen Neugier erst interessant. Entscheidender ist die Kompetenz der Nutzerinnen und Nutzer: Wer Werbung als Werbung erkennt, lässt sich seltener vermessen. Meines Erachtens sollte deshalb Medienbildung früher in die Lehrpläne, damit Jugendliche die Werkzeuge beherrschen, statt von ihnen beherrscht zu werden. Dabei spielt auch die Sprache eine Rolle: Wer sagt «Ich bin traurig, weil niemand mein Bild geliked hat», verwechselt Aufmerksamkeit mit Anerkennung. Die Forschung zeigt zugleich, dass moderater Konsum kaum schadet, solange das Gespräch im echten Leben nicht verstummt. Ob uns das schnell genug gelingt, steht freilich dahin.",
    note: "تمديد 107→149w — لغة + استهلاك معتدل + خلاصة (B2 120-150 ✓)"
  },
  "w-b2-02": {
    newSample: "Sehr geehrte Damen und Herren, mit großem Interesse habe ich Ihre Stellenanzeige gelesen. Die ausgeschriebene Stelle bringt zwei Dinge zusammen, die mich fachlich prägen: Projektarbeit und Datenanalyse. Ich möchte meine Erfahrung in der Prozessautomatisierung gern in Ihr Team einbringen. Um meine Eignung zu belegen, füge ich einen Kurzbericht zweier Projekte bei, die ohne technische Fremdwörter auskommen und deren Ergebnis sich in Zahlen messen lässt. In einem Projekt habe ich die Bearbeitungszeit von Anträgen um dreißig Prozent verringert, indem ich wiederkehrende Schritte automatisiert habe. Im zweiten habe ich ein Dashboard aufgebaut, das Fehler sichtbar macht, bevor sie teuer werden. Statt mich in Floskeln zu verlieren, trete ich lieber den Beweis selbst an: In einem Gespräch innerhalb der nächsten zwei Wochen lege ich gern dar, wie ich Ihrer Abteilung zur Entlastung verhelfen kann. Über eine Einladung freue ich mich. Mit freundlichen Grüßen, A. Mansour",
    note: "تمديد 108→151w — مشروعان مرقمان + قابلية النقل (B2 120 ✓)"
  },
  "w-b2-07": {
    newSample: "Sehr geehrte Damen und Herren, am 3. Mai habe ich Ihren Online-Kurs „Deutsch B2“ gekauft (Bestellnummer 4471, Rechnung 2210). Leider funktioniert der Zugang bis heute nicht: Trotz zweimaliger Rücksetzung erhalte ich ständig die Meldung „Passwort falsch“ – ein Fehler, den Ihr Support telefonisch bestätigt, aber bisher nicht behoben hat. Ich bitte Sie, den Zugang bis zum kommenden Freitag, den 22. Mai, freizuschalten. Andernfalls trete ich vom Vertrag zurück und bitte um vollständige Rückerstattung des Kursbetrags von 89 Euro binnen weiterer vierzehn Tage. Ich habe den Support am 10. Mai schriftlich kontaktiert und am 15. Mai erneut angerufen, jedoch ohne Erfolg. Der Fehler liegt nachweislich nicht bei meinem Gerät, da der Login auf zwei verschiedenen Browsern scheitert. Die Belege zu Zahlung und Supportanfragen halte ich bereit und reiche sie auf Wunsch nach. Mit freundlichen Grüßen, Layla Haddad",
    note: "تمديد 102→144w — توثيق محاولات + نفي مسؤولية الجهاز (B2 120 ✓)"
  }
};

let patched=0;
for (const id of Object.keys(patches)){
  const entry = writing.find(x=>x.id===id);
  if(!entry){ console.log(`NOT FOUND ${id}`); continue; }
  const before = wc(entry.sample);
  entry.sample = patches[id].newSample;
  const after = wc(entry.sample);
  console.log(`${id}: ${before} → ${after}w | ${patches[id].note}`);
  patched++;
}
writeFileSync(wPath, JSON.stringify(writing,null,2)+"\n","utf8");
console.log(`\n✓ writing.json patched ${patched}/15`);

// Dialogues d-a0-02, d-a0-03 → extend to 4 lines
for (const id of ["d-a0-02","d-a0-03"]){
  const d = dialogues.find(x=>x.id===id);
  if(!d) continue;
  console.log(`\n${id} before lines=${d.lines.length}`);
}
let d02 = dialogues.find(x=>x.id==="d-a0-02");
if(d02){
  d02.lines.push({who:"B", de:"Bitte schön!", ar:"على الرحب! "});
  if(!d02.dictation.includes("Bitte schön!")) d02.dictation.push("Bitte schön!");
}
let d03 = dialogues.find(x=>x.id==="d-a0-03");
if(d03){
  d03.lines.push({who:"A", de:"Willkommen, Ali!", ar:"أهلاً يا علي!"});
  if(!d03.dictation.includes("Willkommen, Ali!")) d03.dictation.push("Willkommen, Ali!");
}
writeFileSync(dPath, JSON.stringify(dialogues,null,2)+"\n","utf8");
console.log(`✓ dialogues.json patched d-a0-02 lines=${dialogues.find(x=>x.id==="d-a0-02").lines.length} d-a0-03 lines=${dialogues.find(x=>x.id==="d-a0-03").lines.length}`);

// Print verification
console.log("\n--- VERIFY wc ---");
for (const id of Object.keys(patches)){
  const e=writing.find(x=>x.id===id);
  console.log(id,wc(e.sample), e.level);
}
