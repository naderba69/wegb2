export interface PitfallContrast {
  wrongDe: string;
  rightDe: string;
}

/**
 * يستخرج مقارنة ✗/✓ فقط عندما تكون الصيغتان مكتوبتين صراحةً في المصدر.
 * لا نخمن «الصواب» من الشرح العربي، لأن بعض التنبيهات فروق استعمال لا أخطاء.
 */
export function parsePitfallContrast(de: string): PitfallContrast | null {
  const arrow = de.indexOf("→");
  if (arrow < 0) return null;

  const clean = (value: string) => value
    .replace(/^\s*[✗✓]\s*/u, "")
    .replace(/^\s*(?:Falsch|خطأ)\s*:\s*/iu, "")
    .replace(/^\s*(?:Richtig|الصواب)\s*:\s*/iu, "")
    .replace(/\s*[✗✓]\s*$/u, "")
    .trim();

  const wrongDe = clean(de.slice(0, arrow));
  const rightDe = clean(de.slice(arrow + 1));
  if (!wrongDe || !rightDe) return null;

  const comparable = (value: string) => value
    .replace(/[„“"'’.,!?;:()\s]/gu, "");
  if (comparable(wrongDe) === comparable(rightDe)) return null;

  return { wrongDe, rightDe };
}
