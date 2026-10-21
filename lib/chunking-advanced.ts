/**
 * 136 Chunking Advanced — تجميع 7±2 في كتل معنوية.
 */
export function chunk<T>(arr: T[], size=4): T[][] { const r:T[][]=[]; for(let i=0;i<arr.length;i+=size) r.push(arr.slice(i,i+size)); return r; }
