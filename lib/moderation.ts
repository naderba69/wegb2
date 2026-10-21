/**
 * 085 Moderation معايرة — مصححان، ثالث يحسم.
 */
export function moderiere(note1: number, note2: number): number { return Math.abs(note1-note2)<=1 ? (note1+note2)/2 : -1; }
