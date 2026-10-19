import { levelAmTag } from "./phasen";
import { wartungsBericht } from "./wartung";
import type { Level, Progress } from "./types";

/**
 * 🌿 A20 (R296, Experten-Audit): Meisterschafts-Verzweigung im Plan —
 * Beschleunigen/Festigen als begründeter Vorschlag für das freie
 * Training. Der kanonische 378-Tage-Plan, seine Tore und Deckel
 * bleiben unangetastet (keine Sperren gebrochen).
 */
export type VerzweigungsArt = "beschleunigen" | "normal" | "festigen";

export interface Verzweigung {
  level: Level;
  retention: number | null;
  karten: number;
  art: VerzweigungsArt;
  grundAr: string;
}

export function planVerzweigung(p: Progress, jetzt = new Date()): Verzweigung {
  const level = levelAmTag(Math.min(Math.max(p.plan.day, 1), 378));
  const zeile = wartungsBericht(p, jetzt).zeilen.find((z) => z.level === level);
  const retention = zeile?.retention ?? null;
  const karten = zeile?.karten ?? 0;
  if (retention === null || karten < 15) {
    return { level, retention, karten, art: "normal", grundAr: "بطاقات هذا المستوى المُدخلة قليلة بعد — امضِ بالمسار العادي حتى تتكوّن صورة احتفاظ موثوقة." };
  }
  if (retention >= 0.88) {
    return { level, retention, karten, art: "beschleunigen", grundAr: "احتفاظك في هذا المستوى مرتفع ومستقر — فرع التسريع: وجّه تدريبك الحرّ إلى معاينة المستوى التالي ومهام تحقق إضافية، وخطة الأيام نفسها لا تتغيّر." };
  }
  if (retention <= 0.7) {
    return { level, retention, karten, art: "festigen", grundAr: "احتفاظ هذا المستوى متعثّر — فرع التثبيت: قدّم مراجعات الصيانة والبطاقات العنيدة في تدريبك الحرّ قبل أي محتوى جديد، وخطة الأيام نفسها لا تتغيّر." };
  }
  return { level, retention, karten, art: "normal", grundAr: "احتفاظك في النطاق الصحي — لا تسريع ولا تثبيت؛ امضِ بالمسار العادي." };
}
