// R163 + R402 P2: Erzeugt public/banks.json (core 19) + banks-vertiefung.json (15) + banks-lang.json (20) — vocab+grammar B2 lazy
import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { gzipSync } from "zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const bankSrc = readFileSync(join(ROOT, "lib", "bankload.ts"), "utf8");
const extract = (name) => {
  const m = bankSrc.match(new RegExp(`export const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
};
const BANK_DATEIEN = extract("BANK_DATEIEN");
const VERTIEFUNG_DATEIEN = extract("VERTIEFUNG_DATEIEN");
const LANG_DATEIEN = extract("LANG_DATEIEN");

function readBank(rel) {
  if (rel === "vocab-core.json" || rel === "vocab-b2.json") {
    const voll = JSON.parse(readFileSync(join(ROOT, "content", "vocab.json"), "utf8"));
    const core={}, b2={};
    for (const [k,v] of Object.entries(voll)) { if (v.level === "B2") b2[k]=v; else core[k]=v; }
    return rel === "vocab-core.json" ? core : b2;
  }
  if (rel === "grammar-core.json" || rel === "grammar-b2.json") {
    const voll = JSON.parse(readFileSync(join(ROOT, "content", "grammar.json"), "utf8"));
    const core={}, b2={};
    for (const [k,v] of Object.entries(voll)) { if (v.level === "B2") b2[k]=v; else core[k]=v; }
    return rel === "grammar-core.json" ? core : b2;
  }
  if (rel === "vocab.json" || rel === "grammar.json") return JSON.parse(readFileSync(join(ROOT,"content",rel),"utf8"));
  return JSON.parse(readFileSync(join(ROOT,"content",...rel.split("/")), "utf8"));
}

function build(list) {
  const inhalt = {}; let bytes=0;
  for (const rel of list) { const data=readBank(rel); const raw=JSON.stringify(data); inhalt[rel]=data; bytes+=raw.length; }
  const json=JSON.stringify(inhalt); const gz=gzipSync(Buffer.from(json)).length;
  return { inhalt, bytes, json, gz, n: list.length };
}
mkdirSync(join(ROOT,"public"),{recursive:true});
const main = build(BANK_DATEIEN);
const vert = build(VERTIEFUNG_DATEIEN);
const lang = build(LANG_DATEIEN);
writeFileSync(join(ROOT,"public","banks.json"), main.json);
writeFileSync(join(ROOT,"public","banks-vertiefung.json"), vert.json);
writeFileSync(join(ROOT,"public","banks-lang.json"), lang.json);
console.log(`banks.json: ${main.n} Banken, ${(main.bytes/1048576).toFixed(2)} MB roh -> ${(main.json.length/1048576).toFixed(2)} MB minifiziert (${(main.gz/1048576).toFixed(2)} MB gz)`);
console.log(`banks-vertiefung.json: ${vert.n} Banken, ${(vert.bytes/1048576).toFixed(2)} MB roh -> ${(vert.json.length/1048576).toFixed(2)} MB minifiziert (${(vert.gz/1048576).toFixed(2)} MB gz) — lazy inkl. vocab-b2+grammar-b2`);
console.log(`banks-lang.json: ${lang.n} Banken, ${(lang.bytes/1048576).toFixed(2)} MB roh -> ${(lang.json.length/1048576).toFixed(2)} MB minifiziert (${(lang.gz/1048576).toFixed(2)} MB gz) — lazy B2-Lang`);
{
  const audio=[]; const laufe=(rel)=>{ for(const f of readdirSync(join(ROOT,"public",...rel.split("/"))).sort()){ const r2=`${rel}/${f}`; const st=statSync(join(ROOT,"public",...r2.split("/"))); if(st.isDirectory()) laufe(r2); else if(f.endsWith(".mp3")) audio.push({p:`/${r2}`,b:st.size}); } };
  try{ laufe("audio"); }catch{}
  writeFileSync(join(ROOT,"public","audio-manifest.json"), JSON.stringify(audio));
  console.log(`audio-manifest.json: ${audio.length} Dateien, ${(audio.reduce((a,x)=>a+x.b,0)/1048576).toFixed(1)} MB`);
}
