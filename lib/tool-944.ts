/**
 * 944 — Trade-off Skehan — مقايضة سكيهان
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_944 = {
  id: 944,
  titleDe: "Trade-off Skehan",
  titleAr: "مقايضة سكيهان",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Skehan 2009",
  desc: "Trade-off Skehan",
} as const;

export function tool944Gain(a:boolean):number{return a?1.2:1.0;}
export function tool944Check(v:number):boolean{return v>0;}
