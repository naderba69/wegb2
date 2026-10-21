/**
 * 037 Flipped معكوس — فيديو/نص قصير قبل الدرس + تطبيق في الصف.
 */
export interface FlippedEinheit { id: string; level: string; vorVideoDe: string; vorVideoAr: string; aufgabeDe: string; }
export const FLIPPED: FlippedEinheit[] = [
  { id: "flip-01", level: "B1", vorVideoDe: "Video: Nebensätze mit weil", vorVideoAr: "فيديو: الجمل التابعة بـweil", aufgabeDe: "Bilde 5 Sätze im Unterricht" },
  { id: "flip-02", level: "B2", vorVideoDe: "Video: Passiv-Alternativen", vorVideoAr: "فيديو: بدائل المبني للمجهول", aufgabeDe: "Beschreibe den Prozess" },
];
export function flippedFuer(level: string): FlippedEinheit | undefined { return FLIPPED.find(f=>f.level===level); }
