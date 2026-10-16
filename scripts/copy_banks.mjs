// R163: Erzeugt public/banks.json aus content/**.json (eine Datei, ein Fetch, ein JSON.parse).
// Node/Tests/Prerender lesen weiterhin direkt content/ (Quelle der Wahrheit bleibt content/).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const inhalt = {};
let bytes = 0;
const nimm = (rel) => {
  const roh = readFileSync(join(ROOT, "content", ...rel.split("/")), "utf8");
  inhalt[rel] = JSON.parse(roh);
  bytes += roh.length;
};
for (const f of readdirSync(join(ROOT, "content")).filter((f) => f.endsWith(".json")).sort()) nimm(f);
for (const f of readdirSync(join(ROOT, "content", "lang")).filter((f) => f.endsWith(".json")).sort()) nimm("lang/" + f);
mkdirSync(join(ROOT, "public"), { recursive: true });
writeFileSync(join(ROOT, "public", "banks.json"), JSON.stringify(inhalt));
console.log(`banks.json: ${Object.keys(inhalt).length} Banken, ${(bytes / 1048576).toFixed(2)} MB roh -> ${(JSON.stringify(inhalt).length / 1048576).toFixed(2)} MB minifiziert`);

// R202: Audio-Manifest für den optionalen Voll-Download (OfflineKarte).
// public/audio-manifest.json = [{p:"/audio/...", b:Bytes}] — erzeugt, nicht versioniert.
{
  const { statSync } = await import("fs");
  const audio = [];
  const laufe = (rel) => {
    for (const f of readdirSync(join(ROOT, "public", ...rel.split("/"))).sort()) {
      const r2 = `${rel}/${f}`;
      const st = statSync(join(ROOT, "public", ...r2.split("/")));
      if (st.isDirectory()) laufe(r2);
      else if (f.endsWith(".mp3")) audio.push({ p: `/${r2}`, b: st.size });
    }
  };
  try { laufe("audio"); } catch { /* kein Audio-Verzeichnis */ }
  writeFileSync(join(ROOT, "public", "audio-manifest.json"), JSON.stringify(audio));
  console.log(`audio-manifest.json: ${audio.length} Dateien, ${(audio.reduce((a, x) => a + x.b, 0) / 1048576).toFixed(1)} MB`);
}
