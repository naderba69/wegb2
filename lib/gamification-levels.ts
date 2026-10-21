/**
 * 110 Levels — مستويات اللاعب: 0-99 Anfänger ... 900+ Meister.
 */
export function levelAusXp(xp: number): string { if(xp<100) return "Anfänger"; if(xp<500) return "Fortgeschritten"; return "Meister"; }
