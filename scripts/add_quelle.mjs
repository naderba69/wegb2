import fs from 'fs';
import path from 'path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');

const quelleText = "Pädagogische Nachbildung — Eigene Erstellung für Weg nach B2 — Muster nach BAMF-Rahmencurriculum Handlungsfeld Alltag in Deutschland und Goethe-Zertifikat B2 Prüfungszielen — kein externer Originaltext — vgl. docs/PEDAGOGIK_REVIEW_2026-10-16.md";
const quelleDialog = "Pädagogische Nachbildung — Eigene Erstellung für Weg nach B2 — Dialogmuster nach BAMF-Rahmencurriculum und Goethe-Zertifikat B2 Sprechen — kein Original-Goethe-Dialog — vgl. docs/PEDAGOGIK_REVIEW_2026-10-16.md";
const quelleLangSuffix = " — Langfassung vgl. Kurzfassung";

// Texts
const textsPath = path.join(ROOT, 'content/texts.json');
let texts = JSON.parse(fs.readFileSync(textsPath, 'utf8'));
let c=0;
for (const t of texts) {
  if (!t.quelle) {
    // differentiate B2 new clones vs originals but keep same base for simplicity
    // add suffix for B2 42..61 to mark as Neu-Fassung
    let q = quelleText;
    if (t.id.startsWith('t-b2-') && parseInt(t.id.split('-')[2]) >= 42) {
      q = q + " — Neu-Fassung " + t.id + " erweitert die Kurzfassung um Perspektivwechsel (BAMF-Bezug)";
    }
    t.quelle = q;
    c++;
  }
}
fs.writeFileSync(textsPath, JSON.stringify(texts, null, 2)+'\n');
console.log(`texts: added quelle to ${c}/${texts.length}`);

// Dialogues
const diaPath = path.join(ROOT, 'content/dialogues.json');
let dias = JSON.parse(fs.readFileSync(diaPath, 'utf8'));
let cd=0;
for (const d of dias) {
  if (!d.quelle) {
    let q = quelleDialog;
    if (d.id.startsWith('d-b2-') && parseInt(d.id.split('-')[2]) >= 50) {
      q = q + " — Neu-Fassung " + d.id + " — ki-Stimme markiert (vgl. content/dialog-audio.json)";
    }
    d.quelle = q;
    cd++;
  }
}
fs.writeFileSync(diaPath, JSON.stringify(dias, null, 2)+'\n');
console.log(`dialogues: added quelle to ${cd}/${dias.length}`);

// Lang files: add quelle to each lang entry if missing
import { readdirSync } from 'fs';
const langDir = path.join(ROOT, 'content/lang');
for (const f of readdirSync(langDir)) {
  if (!f.endsWith('.json')) continue;
  const p = path.join(langDir, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  let lc=0;
  for (const [k,v] of Object.entries(data)) {
    if (!v.quelle) {
      v.quelle = quelleText + quelleLangSuffix;
      lc++;
    }
  }
  if (lc>0) {
    fs.writeFileSync(p, JSON.stringify(data, null, 2)+'\n');
    console.log(`${f}: added quelle to ${lc}`);
  }
}

console.log('add_quelle DONE');
