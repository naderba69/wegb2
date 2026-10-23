#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const gPath = join(ROOT,"content/grammar.json");
let grammar = JSON.parse(readFileSync(gPath,"utf8")); // object keyed by id
let arr = Object.values(grammar);

// Map of 29 missing umformung — each B2/A1 expert-crafted, GGP-aligned
const umformungen = {
  "a0-begrussung": {
    quelleDe: "Hallo Nader! Wie geht es dir?",
    promptDe: "Formuliere formell mit Sie:",
    answer: "Guten Tag Herr Nader! Wie geht es Ihnen?",
    mussEnthalten: ["Ihnen"],
    darfNicht: ["dir"],
    explanationAr: "du→Sie: dir (Dativ informell) → Ihnen (رسمي). التحية تتغير: Hallo→Guten Tag.",
    points: 1
  },
  "a1-modalverben": {
    quelleDe: "Ich will heute ins Kino gehen.",
    promptDe: "Höflicher mit möchten:",
    answer: "Ich möchte heute ins Kino gehen.",
    mussEnthalten: ["möchte"],
    darfNicht: ["will"],
    explanationAr: "wollen (إرادة قوية) → möchten (Konjunktiv II مهذب) — نفس القاعدة A2 höflich.",
    points: 1
  },
  "a1-dativ": {
    quelleDe: "Ich fahre zu die Schule.",
    promptDe: "Korrigiere den Kasus:",
    answer: "Ich fahre zu der Schule.",
    mussEnthalten: ["zu der"],
    darfNicht: ["zu die"],
    explanationAr: "zu + Dativ دائماً: die→der. لا تخلط مع nach Berlin (بدون أداة).",
    points: 1
  },
  "a1-wechsel": {
    quelleDe: "Ich hänge das Bild an die Wand. (Wohin)",
    promptDe: "Wo hängt das Bild? (Wo = Dativ)",
    answer: "Das Bild hängt an der Wand.",
    mussEnthalten: ["an der Wand"],
    darfNicht: ["an die Wand"],
    explanationAr: "Wohin Akk (حركة) → Wo Dativ (ثبات): an die → an der. Wechselpräposition.",
    points: 2
  },
  "a1-futur-einf": {
    quelleDe: "Morgen fahre ich nach Tunis.",
    promptDe: "Mit werden + Infinitiv (Futur I):",
    answer: "Morgen werde ich nach Tunis fahren.",
    mussEnthalten: ["werde","fahren"],
    darfNicht: [],
    explanationAr: "Futur I: werden (مصرف) + مصدر في الآخر. المعنى تنبؤ/خطة.",
    points: 1
  },
  "a1-war-hatte": {
    quelleDe: "Ich habe keine Zeit.",
    promptDe: "Präteritum (Erzählung):",
    answer: "Ich hatte keine Zeit.",
    mussEnthalten: ["hatte"],
    darfNicht: ["habe"],
    explanationAr: "Präsens habe → Präteritum hatte — شائع في Erzählung/Tagebuch.",
    points: 1
  },
  "b1-funktionsverben": {
    quelleDe: "Ich entscheide heute.",
    promptDe: "Als Funktionsverbgefüge:",
    answer: "Ich treffe heute eine Entscheidung.",
    mussEnthalten: ["treffe","Entscheidung"],
    darfNicht: ["entscheide"],
    explanationAr: "FVG B1: entscheiden → eine Entscheidung treffen — nominaler أسلوب رسمي.",
    points: 2
  },
  "a0-buchstaben": {
    quelleDe: "A – L – I",
    promptDe: "Als Name:",
    answer: "Ali",
    mussEnthalten: ["Ali"],
    darfNicht: ["A – L – I"],
    explanationAr: "Buchstabieren A-L-I = Ali. عكس Buchstabiere deinen Namen!",
    points: 1
  },
  "a0-zahlen": {
    quelleDe: "Es ist 13:00 Uhr.",
    promptDe: "Umgangssprachlich nachmittags:",
    answer: "Es ist ein Uhr mittags.",
    mussEnthalten: ["ein Uhr"],
    darfNicht: ["13:00"],
    explanationAr: "13:00 → ein Uhr (12h-System) + mittags. في A0 Uhrzeit دائماً بالألفاظ.",
    points: 1
  },
  "a2-konj2-hoflich": {
    quelleDe: "Kannst du mir bitte helfen?",
    promptDe: "Höflicher (Konjunktiv II):",
    answer: "Könntest du mir bitte helfen?",
    mussEnthalten: ["Könntest"],
    darfNicht: ["Kannst"],
    explanationAr: "können → könnten (Konj. II): Kannst→Könntest — أدب A2, ليس ماضي.",
    points: 1
  },
  "a2-adjektiv-einfach": {
    quelleDe: "Das ist ein große Haus.",
    promptDe: "Korrigiere die Endung:",
    answer: "Das ist ein großes Haus.",
    mussEnthalten: ["großes"],
    darfNicht: ["große Haus"],
    explanationAr: "ein + Neutrum → großes (‑es). Adjektivendung nach unbestimmtem Artikel.",
    points: 1
  },
  "a1-weil-dass": {
    quelleDe: "Ich bin krank. Deshalb bleibe ich zu Hause.",
    promptDe: "Mit weil verbinden:",
    answer: "Ich bleibe zu Hause, weil ich krank bin.",
    mussEnthalten: ["weil","krank bin"],
    darfNicht: [],
    explanationAr: "deshalb (Hauptsatz) → weil (Nebensatz Verb am Ende): bin krank → krank bin.",
    points: 2
  },
  "a2-verschmolzene": {
    quelleDe: "Ich gehe zu dem Bahnhof.",
    promptDe: "Verschmolzen:",
    answer: "Ich gehe zum Bahnhof.",
    mussEnthalten: ["zum Bahnhof"],
    darfNicht: ["zu dem Bahnhof"],
    explanationAr: "zu+dem→zum, zu+der→zur, an+dem→am. في Dativ الإدغام إلزامي عملياً.",
    points: 1
  },
  "a0-artikel": {
    quelleDe: "___ Lehrer ist nett. (m)",
    promptDe: "Mit Artikel:",
    answer: "Der Lehrer ist nett.",
    mussEnthalten: ["Der Lehrer"],
    darfNicht: [],
    explanationAr: "Lehrer مذكر → der. كل Nomen مع أداة + جمع في A1.",
    points: 1
  },
  "a0-du-sie": {
    quelleDe: "Wie heißt du? (formell)",
    promptDe: "An Chef/in formell:",
    answer: "Wie heißen Sie?",
    mussEnthalten: ["heißen Sie"],
    darfNicht: ["heißt du"],
    explanationAr: "du (مفرد غير رسمي) → Sie (رسمي جمعاً/احتراماً): heißt→heißen.",
    points: 1
  },
  "a0-aussprache-vowels": {
    quelleDe: "schon (bereits) vs schön (hübsch)",
    promptDe: "Welches hat langen Vokal ö? Schreibe schön:",
    answer: "schön",
    mussEnthalten: ["schön"],
    darfNicht: ["schon"],
    explanationAr: "o→schon (قصير) vs ö→schön (طويل ومُمال). Umlaut يغيّر المعنى تماماً.",
    points: 1
  },
  "a0-aussprache-umlaut": {
    quelleDe: "Mutter und Mütter",
    promptDe: "Welche Form hat Umlaut ä? (Plural)",
    answer: "Mütter",
    mussEnthalten: ["Mütter"],
    darfNicht: ["Mutter"],
    explanationAr: "Mutter→Mütter: Umlaut في الجمع. ä/ö/ü ليست زخرفة بل صرف.",
    points: 1
  },
  "a1-aussprache-ch": {
    quelleDe: "Ich spreche Deutsch. (ch nach i)",
    promptDe: "Welcher Laut: ich-Laut [ç] oder ach-Laut [x]?",
    answer: "ich-Laut",
    mussEnthalten: ["ich-Laut"],
    darfNicht: [],
    explanationAr: "ch بعد e/i/ä/ö/ü → ich-Laut [ç] (رقيق)، بعد a/o/u → ach-Laut [x] (خ).",
    points: 1
  },
  "a1-aussprache-r": {
    quelleDe: "Wir fahren nach Berlin.",
    promptDe: "Wie klingt r im Auslaut (fahren)? Vokalisiert?",
    answer: "fahren mit vokalisiertem r",
    mussEnthalten: ["vokalisiertem"],
    darfNicht: [],
    explanationAr: "r في النهاية/بعد a: fahren → [aɐ] مدغم vokalisiert، لا يُلفظ r صريح.",
    points: 1
  },
  "a1-aussprache-sp-st": {
    quelleDe: "Ich spiele im Park.",
    promptDe: "Wie spricht man sp am Anfang? (schp)",
    answer: "schp",
    mussEnthalten: ["schp"],
    darfNicht: [],
    explanationAr: "sp→[ʃp] schp, st→[ʃt] scht في بداية المقطع: spielen, Straße.",
    points: 1
  },
  "a1-aussprache-auslaut": {
    quelleDe: "Der Tag ist schön.",
    promptDe: "Wie klingt g am Ende (Tag)?",
    answer: "Tag mit k-Laut",
    mussEnthalten: ["k"],
    darfNicht: [],
    explanationAr: "Auslautverhärtung: b→p, d→t, g→k في النهاية: Tag [tak], Geld [gelt].",
    points: 1
  },
  "b2-genitiv-praep": {
    quelleDe: "Wegen dem Wetter bleibt er zu Hause.",
    promptDe: "Schriftdeutsch (Genitiv):",
    answer: "Wegen des Wetters bleibt er zu Hause.",
    mussEnthalten: ["Wegen des Wetters"],
    darfNicht: ["Wegen dem"],
    explanationAr: "wegen + Genitiv رسمي: des Wetters. Dativ محكي فقط.",
    points: 1
  },
  "b2-konzessiv": {
    quelleDe: "Obwohl es regnet, gehe ich spazieren.",
    promptDe: "Mit trotzdem (Hauptsatz):",
    answer: "Es regnet, trotzdem gehe ich spazieren.",
    mussEnthalten: ["trotzdem"],
    darfNicht: ["obwohl"],
    explanationAr: "obwohl (Nebensatz) → trotzdem (Adverb Pos1): Verb bleibt zweit: gehe ich.",
    points: 2
  },
  "b2-relativ-genitiv": {
    quelleDe: "Der Mann, sein Auto ist kaputt, wartet.",
    promptDe: "Mit dessen (Genitiv-Relativ):",
    answer: "Der Mann, dessen Auto kaputt ist, wartet.",
    mussEnthalten: ["dessen","kaputt ist"],
    darfNicht: ["sein Auto ist kaputt"],
    explanationAr: "Genitiv-Relativ: dessen (مذكر/محايد) / deren (مؤنث/جمع) + Verb am Ende.",
    points: 2
  },
  "a1-pruefungsstrategie": {
    quelleDe: "Hören Teil 3: Man hört einen Durchsagen-Satz einmal.",
    promptDe: "Strategie: Was machst du zuerst?",
    answer: "Ich lese die Fragen zuerst.",
    mussEnthalten: ["Fragen","zuerst"],
    darfNicht: [],
    explanationAr: "Hören: Fragen vor Hören lesen → Stichwörter markieren → beim 1. Hören antworten.",
    points: 1
  },
  "a2-pruefungsstrategie": {
    quelleDe: "Lesen Teil 2: Anzeigen mit Lücken.",
    promptDe: "Strategie (A2):",
    answer: "Ich lese die Anzeige und suche Schlüsselwörter.",
    mussEnthalten: ["Schlüsselwörter"],
    darfNicht: [],
    explanationAr: "Lesen A2: Schlüsselwörter (Datum, Ort, Preis) → Anzeige zuordnen, لا كل كلمة.",
    points: 1
  },
  "b1-pruefungsstrategie": {
    quelleDe: "Schreiben B1: E-Mail 80 Wörter.",
    promptDe: "Struktur (B1):",
    answer: "Anrede, Einleitung, drei Punkte, Schluss und Gruß.",
    mussEnthalten: ["Anrede","Gruß"],
    darfNicht: [],
    explanationAr: "B1 Schreiben: 3 Inhaltspunkte + Anrede/Gruß = 5 فقرات. كل نقطة جملة كاملة.",
    points: 1
  },
  "b2-pruefungsstrategie": {
    quelleDe: "Hören B2: Vortrag 5 Minuten.",
    promptDe: "Strategie:",
    answer: "Ich notiere Stichpunkte und höre auf Konnektoren.",
    mussEnthalten: ["Stichpunkte"],
    darfNicht: [],
    explanationAr: "B2 Hören: Notizen mit Abkürzungen + Konnektoren (jedoch, deshalb) = Struktur.",
    points: 1
  },
  "a0-satzbau": {
    quelleDe: "Ich heiße Anna.",
    promptDe: "Als Frage (Inversion):",
    answer: "Heißt du Anna?",
    mussEnthalten: ["Heißt du"],
    darfNicht: ["Ich heiße"],
    explanationAr: "Satz→Frage: Verb vor Subjekt. Wer+Verb+Was? → Verb+Wer+Was?",
    points: 1
  }
};

let patched=0;
for (const [id, um] of Object.entries(umformungen)){
  const lesson = grammar[id];
  if(!lesson){ console.log("MISSING",id); continue; }
  if(lesson.exercises?.some(e=> e.type==="umformung")){ console.log(id,"already has umformung — skip"); continue; }
  const newId = `${id}-ex${String((lesson.exercises?.length||0)+1).padStart(2,"0")}-umformung`;
  const ex = {
    id: newId,
    type: "umformung",
    quelleDe: um.quelleDe,
    promptDe: um.promptDe,
    answer: um.answer,
    mussEnthalten: um.mussEnthalten,
    darfNicht: um.darfNicht,
    explanationAr: um.explanationAr,
    points: um.points,
    promptAr: "حوّل الجملة حسب القاعدة."
  };
  lesson.exercises = lesson.exercises || [];
  lesson.exercises.push(ex);
  patched++;
  console.log(`${id}: + umformung ${newId} — ${um.answer.slice(0,50)}`);
}
console.log(`\n✓ grammar patched ${patched}/29`);

writeFileSync(gPath, JSON.stringify(grammar,null,2)+"\n","utf8");
console.log("grammar.json written — checking...");

// quick verification
let after = JSON.parse(readFileSync(gPath,"utf8"));
let afterArr = Object.values(after);
let stillMissing = afterArr.filter(x=> !x.exercises?.some(e=> e.type==="umformung")).length;
console.log(`still missing umformung: ${stillMissing}`);
