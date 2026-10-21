/**
 * 123 Interleaving Variations — تنويع الخلط: نوعين داخل الدرس الواحد.
 */
export function mische<T>(a: T[], b: T[]): T[] { const r: T[]=[]; for(let i=0;i<Math.max(a.length,b.length);i++){ if(a[i]) r.push(a[i]); if(b[i]) r.push(b[i]); } return r; }
