/**
 * 079 Rasch/IRT — تقدير الصعوبة والقدرة (مبسط).
 */
export function raschWahrscheinlichkeit(faehigkeit: number, schwierigkeit: number): number { return 1/(1+Math.exp(-(faehigkeit-schwierigkeit))); }
