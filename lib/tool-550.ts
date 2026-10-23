/**
 * 550 — Creative Thinking — تفكير إبداعي
 * Family: تلقين | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_550 = {
  id: 550,
  titleDe: "Creative Thinking",
  titleAr: "تفكير إبداعي",
  family: "تلقين",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Guilford 1967",
  desc: "Creative Thinking",
} as const;

export function tool550Gain(a:boolean):number{return a?1.2:1.0;}
export function tool550Check(v:number):boolean{return v>0;}
