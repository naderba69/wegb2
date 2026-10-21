/**
 * 112 XP Boost — مضاعف نقاط في عطلة نهاية الأسبوع.
 */
export function xpBoost(wochentag: number, xp: number): number { return (wochentag===6||wochentag===7) ? xp*2 : xp; }
