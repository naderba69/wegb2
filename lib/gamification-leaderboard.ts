/**
 * 109 Leaderboard — لوحة صدارة أسبوعية (محلية، بلا خادم).
 */
export function leaderboardSort(punkte: {name:string, xp:number}[]): typeof punkte { return [...punkte].sort((a,b)=>b.xp-a.xp); }
