/**
 * 420 — Dictogloss Variants — تنويعات إملاء تفاعلي
 * Wajnryb 1990: classroom application with tasks
 * Level: A2-B1 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_420 = {
  id: 420,
  titleDe: "Dictogloss Variants",
  titleAr: "تنويعات إملاء تفاعلي",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A2-B1",
  research: "Wajnryb 1990",
  desc: "Dictogloss Variants classroom",
} as const;
export function tool420Gain(a:boolean):number{return a?1.2:1.0;}
export function tool420Check(v:number):boolean{return v>0;}
