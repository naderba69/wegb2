import fs from 'fs';
const path='content/texts.json';
const texts=JSON.parse(fs.readFileSync(path,'utf8'));
const ext={
"t-b1-01": {
 de_add: "Lehrkräfte berichten, dass die Konzentration sinkt, weil Benachrichtigungen ständig unterbrechen, obwohl Regeln existieren. Eltern dagegen erwarten Erreichbarkeit, weil Sicherheit im Alltag wichtig ist. Deshalb erproben Schulen Kompromisse: Handys im Spind während des Unterrichts, Nutzung nur in Pausen. So bleibt der Vorteil, ohne den Unterricht zu stören, was die meisten als fair empfinden.",
 ar_add: "يذكر المعلمون أن التركيز ينخفض لأن الإشعارات تقطع باستمرار رغم القواعد. وينتظر الأهل إمكانية الوصول لأن الأمان مهم. لذا تجرب مدارس حلولاً وسطى: الهواتف في الخزانة أثناء الدرس والاستخدام في الاستراحة فقط."
},
"t-b1-03": {
 de_add: "Obwohl der Anteil des Radverkehrs gestiegen ist, weil neue Wege gebaut wurden, nutzen viele noch das Auto, weil die Anschlüsse fehlen. Deshalb fordert der Verkehrsclub, Bus und Rad zu verknüpfen, damit Umstieg leicht wird. Wer mit dem Rad zum Bahnhof fährt und dort abstellt, spart nicht nur CO₂, sondern auch Zeit im Stau.",
 ar_add: "رغم ارتفاع حصة الدراجات لأن طرقاً جديدة بُنيت، لا يزال كثيرون يستخدمون السيارة لغياب الروابط. لذا يطالب نادي المرور بربط الحافلة بالدراجة لتسهيل التغيير."
},
"t-b1-06": {
 de_add: "Vorausgesetzt werden Deutsch B1 und ein Führerschein Klasse B, weil Lieferungen auch kurzfristig verteilt werden müssen. Bewerberinnen und Bewerber sollten zuverlässig sein, obwohl das Team flexibel arbeitet. Wer Interesse hat, sendet Lebenslauf und Zeugnisse per E-Mail, weil die Bearbeitung digital erfolgt.",
 ar_add: "يشترط ألمانية B1 ورخصة قيادة B لأن التوصيلات قد توزع فجأة. ويجب أن يكون المتقدمون موثوقين رغم مرونة الفريق."
},
"t-b1-07": {
 de_add: "Experten erklären, dass Ausbildung Einkommen früher bringt, weil Azubis vom ersten Monat an verdienen, während Studierende oft länger ohne Lohn bleiben. Obwohl das Studium später höhere Gehälter verspricht, schreckt die Dauer manche ab. Deshalb raten Berater, Praktika zu machen, damit Jugendliche beide Wege vergleichen.",
 ar_add: "يوضح الخبراء أن التكوين يجلب دخلاً مبكراً لأن المتدربين يكسبون من الشهر الأول بينما يبقى الطلبة بلا أجر أطول. ورغم وعد الدراسة برواتب أعلى لاحقاً، تردع مدتها البعض."
},
"t-b1-08": {
 de_add: "In München kostet eine Einzimmerwohnung oft über 1000 Euro, weil Nachfrage hoch und Angebot knapp ist. Obwohl WGs günstiger sind, bringen sie Konflikte, weil Putzpläne und Lärm unterschiedlich empfunden werden. Wer auszieht, prüft deshalb nicht nur den Preis, sondern auch Lage und Hausordnung.",
 ar_add: "في ميونخ تكلف شقة غرفة واحدة أكثر من 1000 يورو لأن الطلب عال والعرض شحيح. ورغم رخص السكن المشترك، يجلب خلافات لأن خطط التنظيف والضوضاء تُحس بشكل مختلف."
},
"t-b1-09": {
 de_add: "In Schulen trennen Kinder Papier und Plastik, weil Lehrpläne Umwelt als Querschnittsthema enthalten. Zu Hause fällt die Umsetzung schwerer, obwohl Behälter farbig markiert sind, weil Gewohnheiten stark sind. Deshalb setzen Kampagnen auf Wiederholung und Belohnung, damit aus Wissen Handeln wird.",
 ar_add: "في المدارس يفصل الأطفال الورق والبلاستيك لأن المناهج تتضمن البيئة كموضوع عرضي. في البيت يصعب التطبيق رغم الحاويات الملونة لأن العادات قوية."
},
};
let c=0;
for(let t of texts){
  if(ext[t.id]){
    const b=t.de.split(/\s+/).length;
    t.de=t.de.trim()+"\n\n"+ext[t.id].de_add;
    t.ar=t.ar.trim()+"\n\n"+ext[t.id].ar_add;
    const a=t.de.split(/\s+/).length;
    console.log(t.id+": "+b+" -> "+a);
    c++;
  }
}
fs.writeFileSync(path, JSON.stringify(texts,null,2),'utf8');
console.log("updated "+c);
