/**
 * 564 — Virtual Exchange 2.0 — تبادل افتراضي 2.0
 * O'Dowd 2018: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: Immersion
 */
export const TOOL_564 = { id: 564, titleDe: "Virtual Exchange 2.0", titleAr: "تبادل افتراضي 2.0", family: "Immersion", bloom: "أنشئ", level: "B1-B2", research: "O'Dowd 2018", desc: "Virtual Exchange 2.0" } as const;
export function tool564Gain(a:boolean):number{return a?1.2:1.0;}
export function tool564Check(v:number):boolean{return v>0;}
