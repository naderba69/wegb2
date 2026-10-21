/**
 * 010 Overlearning — الترسيخ الزائد
 * الفكرة: بعد أن يصل المتعلم إلى 100% (أو 3 إجابات صحيحة متتالية)، نضيف 1-2 تكرار إضافي بفاصل متزايد
 * لمنع «وهم الإتقان». بحث Rohrer & Taylor 2007: overlearning بنسبة 10-15% يحسن الاحتفاظ 30 يومًا بنسبة 25%.
 */
export interface OverlearningItem {
  id: string; // cardId
  extraDue: number; // day index
}

const EXTRA_DELAYS = [2, 7]; // يوم+2، يوم+7 بعد الإتقان

export function extraDueDays(masterDay: number): number[] {
  return EXTRA_DELAYS.map((d) => masterDay + d);
}

export function isOverlearningDue(item: OverlearningItem, today: number): boolean {
  return today >= item.extraDue;
}

// نسبة الترسيخ الزائد الحالية (1.1 = 110% من المحاولات اللازمة)
export const OVERLEARNING_RATIO = 1.15;

export function shouldOverlearn(attempts: number, streak: number): boolean {
  // بعد 3 صح متتالية، نطلب تكرارًا واحدًا إضافيًا
  return streak >= 3 && attempts >= 3;
}
