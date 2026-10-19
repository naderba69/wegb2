import { buildDay } from "./plan";
import type { Progress } from "./types";

/**
 * 🔔 A27 (R293, Experten-Audit): lokale Erinnerungen —
 * Browser-Benachrichtigung zur gewählten Uhrzeit (solange die App
 * offen/installiert läuft) + Kalender-Export (.ics) der nächsten
 * sieben Plantage. Kein Server, kein Push-Dienst.
 */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const dt = (d: Date, uhrzeit: string): string => {
  const [h, m] = uhrzeit.split(":").map((x) => parseInt(x, 10) || 0);
  const lokal = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${lokal.getFullYear()}${pad(lokal.getMonth() + 1)}${pad(lokal.getDate())}T${pad(lokal.getHours())}${pad(lokal.getMinutes())}00`;
};

const dtPlusMin = (basis: string, minuten: number): string => {
  const jahr = Number(basis.slice(0, 4)); const monat = Number(basis.slice(4, 6)) - 1; const tagN = Number(basis.slice(6, 8));
  const h = Number(basis.slice(9, 11)); const m = Number(basis.slice(11, 13));
  const d = new Date(jahr, monat, tagN, h, m + minuten, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
};

export function icsText(p: Progress, jetzt = new Date()): string {
  const uhrzeit = p.settings.erinnerung?.uhrzeit || "18:00";
  const zeilen: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//weg-nach-b2//Erinnerung//AR",
    "CALSCALE:GREGORIAN",
  ];
  for (let i = 0; i < 7; i++) {
    const tagPlan = p.plan.day + i;
    if (tagPlan > 378) break;
    const datum = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + i);
    const plan = buildDay(tagPlan, p);
    const start = dt(datum, uhrzeit);
    zeilen.push(
      "BEGIN:VEVENT",
      `UID:wegb2-tag-${tagPlan}-${datum.toISOString().slice(0, 10)}@lokal`,
      `DTSTAMP:${dt(jetzt, "00:00")}`,
      `DTSTART:${start}`,
      `DTEND:${dtPlusMin(start, plan.zielMin)}`,
      `SUMMARY:${esc(`🇩🇪 طريقي إلى B2 — اليوم ${tagPlan} (${plan.phase})`)}`,
      `DESCRIPTION:${esc(`جلسة اليوم ${tagPlan}: هدف ${plan.zielMin} دقيقة · ${plan.tasks.length} مهمة مخططة. افتح التطبيق وابدأ بمهمة الاسترجاع.`)}`,
      "END:VEVENT",
    );
  }
  if (p.settings.examDate) {
    const [j, m, t] = p.settings.examDate.split("-").map((x) => parseInt(x, 10));
    if (j && m && t) {
      const datum = new Date(j, m - 1, t);
      const start = dt(datum, "09:00");
      zeilen.push(
        "BEGIN:VEVENT",
        `UID:wegb2-examen-${p.settings.examDate}@lokal`,
        `DTSTAMP:${dt(jetzt, "00:00")}`,
        `DTSTART:${start}`,
        `DTEND:${dtPlusMin(start, 240)}`,
        `SUMMARY:${esc(`🎓 موعد الامتحان الخارجي${p.settings.examName ? ` — ${p.settings.examName}` : ""}`)}`,
        "END:VEVENT",
      );
    }
  }
  zeilen.push("END:VCALENDAR");
  return zeilen.join("\r\n");
}

export function erinnerungFaellig(p: Progress, jetzt = new Date()): boolean {
  const e = p.settings.erinnerung;
  if (!e?.aktiv) return false;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(jetzt.getHours())}:${pad(jetzt.getMinutes())}` === e.uhrzeit;
}
