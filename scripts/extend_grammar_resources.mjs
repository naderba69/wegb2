#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const gPath = join(ROOT,"content/grammar.json");
let grammar = JSON.parse(readFileSync(gPath,"utf8"));
let arr = Object.values(grammar);

// Authentic resource mapping — BAMF + Zeitungen + Behörden, CEFR B1/B2 relevant
const resourceMap = {
  "b1-konj2": ["deutsche-welle-nachrichten","goethe-institut-b1"],
  "b1-relativ": ["tagesschau-leichte-sprache","bamf-orientierung-leben-in-deutschland"],
  "b1-konnektoren": ["zeit-online","deutsch-perfekt"],
  "b1-plusquamperfekt": ["duden-grammatik","goethe-b1-modelltest"],
  "b2-indirekte-rede": ["tagesschau-konferenz","deutschlandfunk-interview"],
  "b2-partizip": ["faz-artikel","bamf-berufssprache"],
  "b2-bedingung": ["bundestag-drucksache","deutsche-welle-wirtschaft"],
  "b2-funktionsverben": ["verwaltungssprache-bmi","arbeitsagentur-berufenet"],
  "b2-infinitiv": ["uni-daad-infoseite","goethe-b2-training"],
  "b1-genitiv": ["grundgesetz-artikel","einbuergerungstest-fragen"],
  "b1-adjektivendungen": ["duden-rechtschreibung","leo-woerterbuch"],
  "b1-wortbildung": ["dwds-komposita","wortwarte-de"],
  "b1-unbestimmte": ["goethe-a2-uebung","bamf-rahmen-curriculum"],
  "b1-verb-praeposition": ["pons-verben-mit-praeposition","arbeitsagentur-bewerbung"],
  "b1-passiv": ["tagesschau-video","industrie-4.0-plattform"],
  "b2-modalpartikel": ["spoken-german-corpus","atlas-alltagssprache"],
  "b2-futur-ii": ["zeit-wissen-futur","duden-zukunft"],
  "b2-relativ-generalisierend": ["grundgesetz-wer","goethe-b2-lesen"],
  "b2-doppelkonnektoren": ["deutschlandfunk-kultur","spiegel-online"],
  "b2-nominalstil": ["bundesregierung-presse","wissenschaftssprache-tubingen"],
  "b1-partizip1": ["vhs-lehrplan","goethe-b1-hoeren"],
  "b1-indirekte-fragen": ["buergeramt-berlin-faq","auswaertiges-amt-faq"],
  "b2-redew": ["redensarten-index","duden-redewendungen"],
  "b1-funktionsverben": ["diHK-ausbildung-lexikon","arbeitsvertrag-musste"],
  "b2-adjektiv-partizip": ["faz-feuilleton","duden-partizipien"],
  "b1-absicht": ["bamf-integrationskurs-leitfaden","goethe-b1-brief"],
  "b1-konj2-vergangenheit": ["zeit-geschichte","spiegel-archiv"],
  "b2-textkonnektoren": ["deutschlandfunk-essay","tagesspiegel-meinung"],
  "b2-genitiv-praep": ["verwaltung-bayern-service","bmi-behoerdendeutsch"],
  "b2-konzessiv": ["taz-kommentar","zeit-debatte"],
  "b2-relativ-genitiv": ["standesamt-formular","mietvertrag-berlin"],
  "b1-pruefungsstrategie": ["goethe-modelltest-b1","telc-uebung-b1"],
  "b2-pruefungsstrategie": ["goethe-modelltest-b2","telc-uebung-b2"],
  "b2-n-deklination": ["duden-n-deklination","canoonet-grammatik"],
  "b2-passiv": ["tagesschau-bundestag","bamf-berufsbezogen-b2"],
  "b2-konjunktiv2-vht": ["zeit-zeugen-interview","deutschlandfunk-geschichte"],
  "b2-nominalisierung": ["bundestag-protokoll","wissenschaft-de-nominalstil"],
  "b2-partizipial": ["faz-wissenschaft","uni-leipzig-korpus"]
};

let patched=0;
for (const [id, res] of Object.entries(resourceMap)){
  const lesson = grammar[id];
  if(!lesson){ console.log("MISSING",id); continue; }
  if((lesson.resources||[]).length>0){ console.log(id,"already has resources — skip"); continue; }
  lesson.resources = res;
  patched++;
  console.log(`${id}: + resources ${res.join(", ")}`);
}
console.log(`\n✓ grammar patched ${patched}/38`);

writeFileSync(gPath, JSON.stringify(grammar,null,2)+"\n","utf8");

// verify
let after = JSON.parse(readFileSync(gPath,"utf8"));
let still = Object.values(after).filter(x=> (x.level==="B1"||x.level==="B2") && !(x.resources||[]).length).length;
console.log(`still missing resources: ${still}`);
