import type { Progress } from "./types";

/**
 * 💾 M16 (R289, Experten-Audit): monatliche Backup-Erinnerung lokal +
 * Import-Prüfung mit verständlichen arabischen Fehlermeldungen.
 * Kein Server, keine Cloud — die Datei bleibt beim Lernenden.
 */
export type ImportUrteil = { ok: true } | { ok: false; fehlerAr: string };

export function pruefeImportText(text: string): ImportUrteil {
  if (!text || text.trim().length < 10) {
    return { ok: false, fehlerAr: "الملف فارغ — اختر ملف النسخة الاحتياطية الذي صدّرته من هذا التطبيق." };
  }
  let daten: unknown;
  try {
    daten = JSON.parse(text);
  } catch {
    return { ok: false, fehlerAr: "الملف ليس JSON سليمًا — ربما انقطع أثناء النقل. أعد تصدير النسخة ثم استوردها من جديد." };
  }
  if (!daten || typeof daten !== "object" || Array.isArray(daten)) {
    return { ok: false, fehlerAr: "محتوى الملف ليس بيانات تقدّم من هذا التطبيق — تأكد أنك اخترت الملف الصحيح." };
  }
  const p = daten as Partial<Progress>;
  if (!p.plan || typeof p.plan !== "object") {
    return { ok: false, fehlerAr: "الملف ناقص: لا يحتوي خطة الأيام (plan) — ليس نسخة احتياطية من هذا التطبيق." };
  }
  const tag = (p.plan as { day?: unknown }).day;
  if (typeof tag !== "number" || !Number.isFinite(tag) || tag < 1 || tag > 379) {
    return { ok: false, fehlerAr: "رقم اليوم في الملف خارج النطاق (1–379) — الملف تالف أو من تطبيق آخر، ولم يُستورد شيء." };
  }
  if (p.srs !== undefined && (typeof p.srs !== "object" || p.srs === null || Array.isArray(p.srs))) {
    return { ok: false, fehlerAr: "قسم البطاقات (srs) في الملف تالف — لم يُستورد شيء." };
  }
  if (p.kompetenzLog !== undefined && !Array.isArray(p.kompetenzLog)) {
    return { ok: false, fehlerAr: "سجلّ الكفاءات في الملف تالف — لم يُستورد شيء." };
  }
  if (p.settings !== undefined && (typeof p.settings !== "object" || p.settings === null)) {
    return { ok: false, fehlerAr: "قسم الإعدادات في الملف تالف — لم يُستورد شيء." };
  }
  return { ok: true };
}

/** Erinnerung fällig: echter Fortschritt vorhanden, aber keine oder >30 Tage alte Sicherung */
export function sicherungFaellig(p: Progress, jetzt = new Date()): boolean {
  const hatFortschritt = p.plan.day > 3 || (p.xp ?? 0) > 0 || Object.keys(p.srs ?? {}).length > 20;
  if (!hatFortschritt) return false;
  if (!p.letzteSicherung) return true;
  const alter = jetzt.getTime() - new Date(p.letzteSicherung).getTime();
  return alter > 30 * 86400000;
}
