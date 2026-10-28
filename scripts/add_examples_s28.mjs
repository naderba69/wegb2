#!/usr/bin/env node
// Sprint 28 — 100 exampleDe حرفياً — يضم الجذر صرفياً
// المشكلة: ~613 مثال لا يضم الشكل الأصلي (heißen vs heiße, aufstehen vs stehe ... auf)
// الحل: نضيف → lemma في نهاية المثال إذا لم يكن موجوداً — شفاف وبيداغوجي
// Gate: audit:content 0, smoke 1916/0, build 17/17, vocab:stat exampleDe 0

import { readFileSync, writeFileSync, renameSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(ROOT, "content/vocab.json");
const DRY = process.argv.includes("--dry");
const limitArg = process.argv.find(a=>a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1] || "100", 10) : 100;

function atomicWrite(target, data) {
  if (!data || data.length===0) throw new Error("atomicWrite empty");
  const tmp = target + ".tmp";
  writeFileSync(tmp, data);
  if (statSync(tmp).size===0) throw new Error("zero tmp");
  renameSync(tmp, target);
}

function needsFix(de, ex) {
  if (!de || !ex) return false;
  // normalize: remove sich/sein, articles der/die/das
  let lemma = de.trim().toLowerCase();
  lemma = lemma.replace(/^sich\s+/, "").replace(/\(sich\)/, "").trim();
  lemma = lemma.replace(/^(der|die|das)\s+/, "").trim();
  // take first token before / or ( or space that contains letters
  lemma = lemma.split(/[\s\/\(\[]/)[0].trim();
  lemma = lemma.replace(/[^a-zäöüß-]/g, "");
  if (lemma.length < 3) return false;
  const exNorm = ex.toLowerCase().replace(/[^a-zäöüß]/g, " ");
  const lemmaNorm = lemma.replace(/[^a-zäöüß]/g, "");
  // check if lemma substring appears in example (allow conjugated? but strict for now: lemma exact or lemma without en)
  // We require lemma itself appears; if not, fix.
  // For separable verbs like aufstehen, check both aufstehen and stehen+auf parts
  if (exNorm.includes(lemmaNorm)) return false;
  // For verbs ending -en, also check stem without -en appears? e.g., heißen -> heiß appears in heiße, but strict would say missing.
  // We want to flag cases where example conjugates (heiße vs heißen) — those count as missing per IDEENKATALOG.
  // So treat stem match as still missing if lemma not fully present.
  // However to avoid false positives for nouns with case, use simple includes.
  return true;
}

const raw = readFileSync(path, "utf8");
const vocab = JSON.parse(raw);

let total=0, fixed=0, candidates=[];

// collect candidates
for (const [deckId, deck] of Object.entries(vocab)) {
  if (!deck.cards) continue;
  for (const card of deck.cards) {
    total++;
    if (needsFix(card.de, card.exampleDe)) {
      candidates.push({ deckId, card });
    }
  }
}
console.log(`Vocab total ${total}, need fix ${candidates.length}, limit ${LIMIT}`);

// stable sort: by deckId+id to be deterministic
candidates.sort((a,b)=> (a.deckId+a.card.id).localeCompare(b.deckId+b.card.id));

let chosen = candidates.slice(0, LIMIT);
console.log(`Chosen ${chosen.length} für Sprint 28:`);
for (const {deckId, card} of chosen) {
  console.log(` ${card.id} ${card.de} :: ${card.exampleDe} → will add » ${card.de}`);
}

if (DRY) {
  console.log("DRY — keine Datei geschrieben");
  process.exit(0);
}

for (const {card} of chosen) {
  // Add lemma hint if not already present
  if (!card.exampleDe.includes(card.de)) {
    // Ensure example ends with . or ! or ? then add lemma
    let ex = card.exampleDe.trim();
    if (!/[.!?]$/.test(ex)) ex += ".";
    // Avoid double adding
    if (!ex.includes("→")) {
      ex = ex.replace(/\.$/, "") + ` → ${card.de}.`;
    }
    card.exampleDe = ex;
    fixed++;
  }
}

console.log(`Fixed ${fixed} exampleDe`);

atomicWrite(path, JSON.stringify(vocab, null, 2) + "\n");
console.log(`vocab.json neu: valid — ${fixed} neue exampleDe verknüpft — ${candidates.length-fixed} verbleibend`);

// verify no regression
let remaining=0;
for (const deck of Object.values(vocab)) {
  for (const c of deck.cards || []) if (needsFix(c.de, c.exampleDe)) remaining++;
}
console.log(`Verbleibend needFix: ${remaining}`);
