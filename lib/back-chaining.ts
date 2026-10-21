/**
 * 061 Back-Chaining تقطيع عكسي — نبدأ من آخر كلمة للجملة الطويلة.
 */
export function backChain(satz: string): string[] { const w=satz.split(" "); return w.map((_,i)=> w.slice(-1-i).join(" ")); }
