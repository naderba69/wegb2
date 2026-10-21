/**
 * 256 — Virtual Immersion — الانغماس الافتراضي
 * Lan 2015: VR immersion improves presence → vocabulary retention +20%
 * Level: A1-B2 | Bloom: طبّق | Family: Immersion
 */
export const TOOL_256 = {
  id: 256,
  titleDe: "Virtuelle Immersion",
  titleAr: "الانغماس الافتراضي",
  family: "Immersion",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lan 2015 +20%",
  tools: "360° Video, VR Cardboard, Virtuelle Tour",
} as const;
export function immersionScene(level: string): string { const m: Record<string,string>={A1:"Supermarkt VR", B1:"Bewerbung VR"}; return m[level]??"Stadt VR"; }
export function immersionGain(vr: boolean): number { return vr?1.2:1.0; }
