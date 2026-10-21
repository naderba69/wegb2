/**
 * 072 Portfolio — محفظة الأعمال
 * يجمع المتعلم نصوصه/كتاباته/تسجيلاته في محفظة قابلة للتصدير (CEFR Portfolio).
 * يتوافق مع European Language Portfolio (ELP) — 3 أجزاء: Passport/Linguistic Biography/Dossier.
 */
export type PortfolioEintragTyp = "text" | "writing" | "dialog" | "fehler" | "klausur";

export interface PortfolioEintrag {
  id: string;
  typ: PortfolioEintragTyp;
  titelDe: string;
  titelAr: string;
  level: string;
  datum: string; // ISO
  bewertung?: number; // 0-100
  artefakt: string; // نص/رابط
}

export interface Portfolio {
  version: 1;
  eintraege: PortfolioEintrag[];
}

export function neuerEintrag(
  typ: PortfolioEintragTyp,
  titelDe: string,
  titelAr: string,
  level: string,
  artefakt: string,
  bewertung?: number,
): PortfolioEintrag {
  return {
    id: `pf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    typ,
    titelDe,
    titelAr,
    level,
    datum: new Date().toISOString().slice(0, 10),
    bewertung,
    artefakt,
  };
}

export function portfolioFortschritt(p: Portfolio): { total: number; byLevel: Record<string, number> } {
  const byLevel: Record<string, number> = {};
  for (const e of p.eintraege) byLevel[e.level] = (byLevel[e.level] ?? 0) + 1;
  return { total: p.eintraege.length, byLevel };
}
