# Tool Catalog — 822 أداة — تحليل التكرار واقتراح YAML

**التاريخ:** 2026-10-22 · **الحالة:** R402d · **الإحصاء:** `lib/tool-*.ts 822` = 9972 سطر (Ø 12 سطر/أداة) + `tool-catalog.ts 830` + `tool-injector.ts 90`

## النمط الحالي

**822 ملفًا، نمط واحد متكرر:**

```ts
// lib/tool-181.ts — 18 سطر
export const TOOL_181 = { id: 181, titleDe: "...", titleAr: "...", family: "الذاكرة", bloom: "طبّق", level: "B2", research: "..." } as const;
export function getOptimalInterval(...) { ... }
export function isOptimalDue(...) { ... }
```

**العائلات الـ6 × Bloom الـ6 × المستويات الـ5:**
- عائلات: الذاكرة، الانتباه، التقويم، اللغة، الدافعية، التنظيم
- Bloom: تذكر، فهم، طبق، حلل، قيم، أبدع
- مستويات: A0/A1/A2/B1/B2

**الحقن:** `tool-injector.ts` يختار أداة/يوم حسب `weekday` + `phase` + `SRS` — يُحقن كـ `wiederholen` 5 دقائق في `lib/plan.ts`.

## المشكلة: 16k سطر مكرر — لا DRY

- **822 × 12 سطر = 9972 سطر** — كلها `export const TOOL_N = { id, titleDe, titleAr, family, bloom, level, research }`
- **الصيانة:** تعديل عائلة واحدة يتطلب 822 ملفًا
- **الاختبار:** لا بوابة واحدة تتحقق من 822 (فقط `K260` يتحقق من عدم تجاوز السقف B2)
- **الحجم:** `public/banks.json 4.55MB` يحمل 822 أداة كـ JSON مضغوط — كل متعلم يحمل 16k سطر أدوات لا يراها إلا 1/أسبوع

## المقترح: YAML مولد — 1 ملف مصدر + 1 مولد

**الخطوة 1: تجميع في `content/tools.yaml`:**

```yaml
- id: 181
  titleDe: Optimales Intervall (FSRS)
  titleAr: الفاصل الأمثل
  family: الذاكرة
  bloom: طبق
  level: B2
  research: Wozniak 1990, FSRS 2023
  formel: "I = S * ln(R) / ln(0.9)"
  code: |
    export function getOptimalInterval(stability: number, desiredRetention = 0.9): number {
      const k = Math.log(desiredRetention) / Math.log(0.9);
      return Math.max(1, Math.round(stability * k));
    }
```

**الخطوة 2: مولد `scripts/gen_tools.mjs`:**

```js
import yaml from "yaml";
import fs from "fs";
const tools = yaml.parse(fs.readFileSync("content/tools.yaml","utf8"));
for (const t of tools) {
  fs.writeFileSync(`lib/tool-${String(t.id).padStart(4,"0")}.ts`, gen(t));
}
fs.writeFileSync("lib/tool-catalog.ts", genCatalog(tools));
```

**المكسب:**
- 9972 سطر → 822 سطر YAML (8× اختزال)
- تعديل عائلة/مستوى = سطر واحد في YAML
- بوابة واحدة `K-tool` تتحقق من YAML بدل 822 ملفًا
- `banks.json` يبقى 4.55MB لكن بلا تكرار كود ميت

## الخطة (P2 — ليس لـ vB2.0-perfect)

1. **الأسبوع 7:** `tools.yaml` + `gen_tools.mjs` — 4h
2. **الأسبوع 8:** `banks 4.55M → 3.5M` (إزالة `lang` المكرر) + `Lighthouse CI` — 8h
3. **الاختبار:** `smoke 1916` يجب أن يبقى 0 — لا منطق جديد، فقط توليد

**المرجع:** `lib/phasen.ts` LERNLAST + `lib/plan.ts` inject — لا تُمس إلا عبر `tools.yaml`.
