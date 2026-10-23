#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const YAML_PATH = join(ROOT, "content", "tools.yaml");
const LIB_DIR = join(ROOT, "lib");
const raw = readFileSync(YAML_PATH, "utf8");
const tools = yaml.parse(raw);
if (!Array.isArray(tools)) { console.error("tools.yaml must be array"); process.exit(1); }
function genToolFile(t) {
  const header = `/**\n * ${t.id} — ${t.titleDe} — ${t.titleAr || ""}\n * Family: ${t.family} | Bloom: ${t.bloom} | Level: ${t.level}\n * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools\n */\n`;
  let metaInner = "";
  // core fields in stable order
  metaInner += `  id: ${t.id},\n`;
  metaInner += `  titleDe: ${JSON.stringify(t.titleDe)},\n`;
  if (t.titleAr != null) metaInner += `  titleAr: ${JSON.stringify(t.titleAr)},\n`;
  if (t.family) metaInner += `  family: ${JSON.stringify(t.family)},\n`;
  if (t.bloom) metaInner += `  bloom: ${JSON.stringify(t.bloom)},\n`;
  if (t.level) metaInner += `  level: ${JSON.stringify(t.level)},\n`;
  // extra meta fields (research, formel, etc.) — emit after core
  const core = new Set(["id","titleDe","titleAr","family","bloom","level","examRelevant","fase","code"]);
  for (const k of Object.keys(t)) {
    if (core.has(k)) continue;
    const v = t[k];
    if (typeof v === "string") metaInner += `  ${k}: ${JSON.stringify(v)},\n`;
    else if (typeof v === "number" || typeof v === "boolean") metaInner += `  ${k}: ${JSON.stringify(v)},\n`;
    else if (Array.isArray(v)) metaInner += `  ${k}: ${JSON.stringify(v)},\n`;
    else metaInner += `  ${k}: ${JSON.stringify(v)},\n`;
  }
  const meta = `export const TOOL_${t.id} = {\n${metaInner}} as const;\n`;
  const code = t.code ? `\n${t.code.trim()}\n` : "";
  return header + meta + code;
}
function genCatalog(tools) {
  const header = `/**\n * tool-catalog — سجل مركزي — مُولد من content/tools.yaml\n * run: npm run gen:tools — لا تعديل يدوي\n */\nexport type ToolLevel = "A0"|"A1"|"A2"|"B1"|"B2"|"A0-B2"|"A1-B2"|"A2-B1"|"A2-B2"|"B1-B2"|"A0-B1"|"A1-B1"|"A0-A2";\nexport interface ToolMeta { id:number; family:string; titleDe:string; level:ToolLevel; bloom:string; examRelevant: boolean; fase:string; }\n`;
  const entries = tools.map(t => `  { id:${t.id}, family:${JSON.stringify(t.family)}, titleDe:${JSON.stringify(t.titleDe)}, level:${JSON.stringify(t.level)} as ToolLevel, bloom:${JSON.stringify(t.bloom)}, examRelevant:${!!t.examRelevant}, fase:${JSON.stringify(t.fase || "any")} }`).join(",\n");
  return header + `export const TOOL_CATALOG: ToolMeta[] = [\n${entries}\n];\nexport function toolsForLevel(level:string):ToolMeta[]{ return TOOL_CATALOG.filter(t=> t.level===level || t.level==="A0-B2" || t.level.includes(level)); }\nexport function toolsByFamily(fam:string):ToolMeta[]{ return TOOL_CATALOG.filter(t=> t.family===fam); }\n`;
}
for (const t of tools) writeFileSync(join(LIB_DIR, `tool-${t.id}.ts`), genToolFile(t), "utf8");
writeFileSync(join(LIB_DIR, "tool-catalog.ts"), genCatalog(tools), "utf8");
console.log(`gen_tools: ${tools.length} tools → lib/tool-*.ts + lib/tool-catalog.ts`);
