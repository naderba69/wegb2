/**
 * ═══════════════════════════════════════════════════════════════════
 *  🔍 M5/R185 · مقارنة النسختين (Wort-Diff)
 * ═══════════════════════════════════════════════════════════════════
 *  فرق كلمات حتمي (LCS) بين مسودّة المتعلّم وإعادة كتابته: ما بقي،
 *  ما حُذف، ما أُضيف — ليرى المتعلّم أثر التصحيح بعينه لا بإحساسه.
 *  لا حكم هنا على الصواب: الفرق وصفٌ محايد لما تغيّر فقط.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface DiffStueck {
  art: "gleich" | "weg" | "neu";
  text: string;
}

export function woerterVon(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/** فرق كلمات بين نسختين (تجميع متجاورات من النوع نفسه) */
export function wortDiff(a: string, b: string): DiffStueck[] {
  const wa = woerterVon(a);
  const wb = woerterVon(b);
  const n = wa.length;
  const m = wb.length;
  // LCS-Längen (n,m ≤ wenige Hundert Wörter im Werkstatt-Alltag)
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = wa[i] === wb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const roh: DiffStueck[] = [];
  const schiebe = (art: DiffStueck["art"], wort: string) => {
    const last = roh[roh.length - 1];
    if (last && last.art === art) last.text += " " + wort;
    else roh.push({ art, text: wort });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (wa[i] === wb[j]) { schiebe("gleich", wa[i]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { schiebe("weg", wa[i]); i++; }
    else { schiebe("neu", wb[j]); j++; }
  }
  while (i < n) { schiebe("weg", wa[i]); i++; }
  while (j < m) { schiebe("neu", wb[j]); j++; }
  return roh;
}

export interface DiffStatistik {
  woerterV1: number;
  woerterV2: number;
  gleich: number;
  entfernt: number;
  hinzugefuegt: number;
  /** Anteil geänderter Wörter an der längeren Fassung (0..1) */
  geaendertAnteil: number;
}

export function diffStatistik(a: string, b: string): DiffStatistik {
  const stuecke = wortDiff(a, b);
  const zaehl = (art: DiffStueck["art"]) =>
    stuecke.filter((s) => s.art === art).reduce((sum, s) => sum + woerterVon(s.text).length, 0);
  const gleich = zaehl("gleich");
  const entfernt = zaehl("weg");
  const hinzugefuegt = zaehl("neu");
  const maxWoerter = Math.max(gleich + entfernt, gleich + hinzugefuegt, 1);
  return {
    woerterV1: woerterVon(a).length,
    woerterV2: woerterVon(b).length,
    gleich,
    entfernt,
    hinzugefuegt,
    geaendertAnteil: Math.round(((entfernt + hinzugefuegt) / (2 * maxWoerter)) * 100) / 100,
  };
}
