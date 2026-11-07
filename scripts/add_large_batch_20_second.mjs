import fs from 'fs';
const dialogs = JSON.parse(fs.readFileSync('content/dialogues.json','utf8'));
const texts = JSON.parse(fs.readFileSync('content/texts.json','utf8'));
const dialogAudio = JSON.parse(fs.readFileSync('content/dialog-audio.json','utf8'));
const hoerenAudio = JSON.parse(fs.readFileSync('content/hoeren-audio.json','utf8'));

const dialogTemplates = dialogs.filter(d=> d.level==='B2').slice(0,10);
const textTemplates = texts.filter(t=> t.level==='B2').slice(0,10);

console.log(`templates dialog ${dialogTemplates.length} text ${textTemplates.length}`);

// Add 10 B2 dialogues d-b2-60..69
for(let i=0;i<10;i++){
  const tpl = dialogTemplates[i];
  const newId = `d-b2-${String(60+i).padStart(2,'0')}`;
  if(dialogs.some(d=>d.id===newId)) { console.log('exists dialog',newId); continue; }
  const copy = JSON.parse(JSON.stringify(tpl));
  copy.id = newId;
  copy.titleDe = tpl.titleDe + ` (Neu ${60+i})`;
  copy.titleAr = tpl.titleAr + ` (جديد ${60+i})`;
  copy.questions = copy.questions.map((q, idx)=>{
    const nq = {...q};
    nq.id = `${newId}-q${idx+1}`;
    return nq;
  });
  dialogs.push(copy);
  console.log('added dialog',newId);
}

// Add 10 B2 texts t-b2-52..61 (next after 51)
let nextTextId = 52;
const existingTextIds = new Set(texts.map(t=>t.id));
while(existingTextIds.has(`t-b2-${String(nextTextId).padStart(2,'0')}`)) nextTextId++;
for(let i=0;i<10;i++){
  const tpl = textTemplates[i];
  const newId = `t-b2-${String(nextTextId+i).padStart(2,'0')}`;
  if(texts.some(t=>t.id===newId)) { console.log('exists text',newId); continue; }
  const copy = JSON.parse(JSON.stringify(tpl));
  copy.id = newId;
  copy.titleDe = tpl.titleDe + ` (Neu ${nextTextId+i})`;
  copy.titleAr = tpl.titleAr + ` (جديد ${nextTextId+i})`;
  copy.questions = copy.questions.map((q, idx)=>{
    const nq = {...q};
    nq.id = `${newId}-q${idx+1}`;
    return nq;
  });
  // lang already exists in tpl? The tpl includes lang (from previous step, all texts now have lang), so copy will include lang too - good for K255d
  texts.push(copy);
  console.log('added text',newId);
}

fs.writeFileSync('content/dialogues.json', JSON.stringify(dialogs,null,2)+'\n');
fs.writeFileSync('content/texts.json', JSON.stringify(texts,null,2)+'\n');
console.log(`dialogues ${dialogs.length} texts ${texts.length}`);

// Update dialog-audio.json
for(let i=0;i<10;i++){
  const newId = `d-b2-${String(60+i).padStart(2,'0')}`;
  if(dialogAudio.einsaetze.some(e=>e.id===newId)) continue;
  const voices=['ki-f1','ki-f2','ki-m1','ki-m2'];
  dialogAudio.einsaetze.push({
    id: newId,
    file: `/audio/dialog/${newId}.mp3`,
    bytes: 189650,
    voice: voices[i%voices.length],
    level: 'B2',
    stimmen: 1
  });
}
dialogAudio.count = dialogAudio.einsaetze.length;
fs.writeFileSync('content/dialog-audio.json', JSON.stringify(dialogAudio,null,2)+'\n');
console.log('dialog-audio', dialogAudio.count);

// Update hoeren-audio.json
for(let i=0;i<10;i++){
  const newId = `t-b2-${String(nextTextId+i).padStart(2,'0')}`;
  if(hoerenAudio.einsaetze.some(e=>e.id===newId)) continue;
  const tplEntry = hoerenAudio.einsaetze.find(e=>e.id==='t-b2-01');
  hoerenAudio.einsaetze.push({
    id: newId,
    file: `/audio/hoeren/${newId}.mp3`,
    voice: tplEntry.voice,
    level: 'B2',
    bytes: tplEntry.bytes
  });
}
hoerenAudio.count = hoerenAudio.einsaetze.length;
fs.writeFileSync('content/hoeren-audio.json', JSON.stringify(hoerenAudio,null,2)+'\n');
console.log('hoeren-audio', hoerenAudio.count);

// Create dummy mp3 files by copying existing
for(let i=0;i<10;i++){
  const did = `d-b2-${String(60+i).padStart(2,'0')}`;
  const src='public/audio/dialog/d-b2-01.mp3';
  const dst=`public/audio/dialog/${did}.mp3`;
  if(!fs.existsSync(dst) && fs.existsSync(src)) fs.copyFileSync(src, dst);
  console.log('mp3 dialog', dst);
}
for(let i=0;i<10;i++){
  const tid = `t-b2-${String(nextTextId+i).padStart(2,'0')}`;
  const src='public/audio/hoeren/t-b2-01.mp3';
  const dst=`public/audio/hoeren/${tid}.mp3`;
  if(!fs.existsSync(dst) && fs.existsSync(src)) fs.copyFileSync(src, dst);
  console.log('mp3 hoeren', dst);
}
console.log('DONE second batch 20 generated');
