#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const catSrc = readFileSync(join(ROOT, "lib", "tool-catalog.ts"), "utf8");
const entryRe = /\{\s*id:\s*(\d+),\s*family:\s*"([^"]+)",\s*titleDe:\s*"([^"]+)",\s*level:\s*"([^"]+)"[^}]*bloom:\s*"([^"]+)",\s*examRelevant:\s*(true|false),\s*fase:\s*"([^"]+)"\s*\}/g;
const entries = [];
let m;
while ((m = entryRe.exec(catSrc))) {
  const [, id, family, titleDe, level, bloom, examRelevant, fase] = m;
  entries.push({ id: Number(id), family, titleDe, level, bloom, examRelevant: examRelevant === "true", fase });
}
for (const e of entries) {
  const p = join(ROOT, "lib", `tool-${e.id}.ts`);
  try {
    const src = readFileSync(p, "utf8");
    const metaMatch = src.match(/export const TOOL_\d+\s*=\s*\{([\s\S]*?)\}\s*as const;/);
    if (metaMatch) {
      const inner = metaMatch[1];
      // Generic KV extraction
      const kvRe = /(\w+)\s*:\s*("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\[[^\]]*\]|true|false|\d+\.?\d*)/g;
      let kv;
      while ((kv = kvRe.exec(inner))) {
        const k = kv[1];
        let vRaw = kv[2].trim();
        if (k === "id") continue;
        let v;
        if ((vRaw.startsWith('"') && vRaw.endsWith('"')) || (vRaw.startsWith("'") && vRaw.endsWith("'"))) {
          // strip outer quotes, handle escape
          v = vRaw.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
        } else if (vRaw.startsWith("[")) {
          try { v = JSON.parse(vRaw); } catch { v = vRaw; }
        } else if (vRaw === "true") v = true;
        else if (vRaw === "false") v = false;
        else if (!isNaN(Number(vRaw))) v = Number(vRaw);
        else v = vRaw;
        e[k] = v;
      }
    }
    const parts = src.split("} as const;");
    if (parts.length > 1) {
      const tail = parts.slice(1).join("} as const;").trim();
      if (tail) e.code = tail;
    }
  } catch {}
}
writeFileSync(join(ROOT, "content", "tools.yaml"), yaml.stringify(entries), "utf8");
console.log(`extract_tools: ${entries.length} entries → content/tools.yaml`);
