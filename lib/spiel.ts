// محرّك التحفيز — XP وأوسمة (حتمي، محلي بالكامل، بلا خدمات خارجية)
import type { Progress } from "./types";

export const XP_LEVELS: { xp: number; name: string; ar: string; icon: string }[] = [
  { xp: 0, name: "Anfänger", ar: "مبتدئ", icon: "🌱" },
  { xp: 150, name: "Fleißig", ar: "مجتهد", icon: "🐝" },
  { xp: 400, name: "Fokus", ar: "مركّز", icon: "🎯" },
  { xp: 900, name: "Meister", ar: "متقن", icon: "🥋" },
  { xp: 1800, name: "B2-Profi", ar: "محترف B2", icon: "🏆" },
  { xp: 3000, name: "Legende", ar: "أسطورة", icon: "👑" },
];

export function levelOfXp(xp: number) {
  let i = 0;
  for (let k = 0; k < XP_LEVELS.length; k++) if (xp >= XP_LEVELS[k].xp) i = k;
  const cur = XP_LEVELS[i];
  const next = XP_LEVELS[i + 1];
  const pct = next
    ? Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100))
    : 100;
  return { ...cur, index: i + 1, next, pct };
}

export interface AbzeichenDef {
  id: string;
  icon: string;
  de: string;
  ar: string;
  test: (p: Progress) => boolean;
}

export const ABZEICHEN: AbzeichenDef[] = [
  {
    id: "erster-schritt",
    icon: "🌱",
    de: "Erster Schritt",
    ar: "أول خطوة — سلّمتَ مهمتك الأولى",
    test: (p) => Object.keys(p.plan.tasks).length >= 1,
  },
  {
    id: "woche",
    icon: "🔥",
    de: "Sieben Tage",
    ar: "أسبوع كامل متتالٍ",
    test: (p) => (p.streak?.count ?? 0) >= 7,
  },
  {
    id: "monat",
    icon: "🗓️",
    de: "Dreißig Tage",
    ar: "شهر من الالتزام",
    test: (p) => (p.streak?.count ?? 0) >= 30,
  },
  {
    id: "hundert",
    icon: "💯",
    de: "100 Aufgaben",
    ar: "100 مهمة مُسلَّمة",
    test: (p) => Object.keys(p.plan.tasks).length >= 100,
  },
  {
    id: "fehlerjaeger",
    icon: "🪤",
    de: "Fehlerjäger",
    ar: "عالجتَ 10 أخطاء بمراجعات ناجحة",
    test: (p) =>
      Object.values(p.fehler ?? {}).filter((f) => f.srs.reps >= 2).length >= 10,
  },
  {
    id: "kartenmeister",
    icon: "🃏",
    de: "Kartenmeister",
    ar: "50 بطاقة في محفظتك",
    test: (p) => Object.keys(p.srs).length >= 50,
  },
  {
    id: "bestnote",
    icon: "🎓",
    de: "Bestnote",
    ar: "امتحان مرحلة بنتيجة 90%+",
    test: (p) => Object.values(p.exams ?? {}).some((e) => e.score >= 90),
  },
  {
    id: "durchhalter",
    icon: "📘",
    de: "Durchhalter",
    ar: "30 يوماً مُغلقاً",
    test: (p) => Object.keys(p.plan.days).length >= 30,
  },
  {
    id: "sprecher",
    icon: "🗣️",
    de: "Sprecher",
    ar: "20 تمرين تحدّث",
    test: (p) =>
      Object.values(p.plan.tasks).filter((r) => r.kind === "sprechen" && r.done)
        .length >= 20,
  },
  {
    id: "b2-ankunft",
    icon: "🏆",
    de: "B2 erreicht",
    ar: "وصلتَ إلى مرحلة B2",
    test: (p) => p.plan.day >= 211,
  },
];

/** امنح الأوسمة المستحقة فوراً (حتمي — يُستدعى بعد كل تحديث) */
export function checkAbzeichen(p: Progress): Progress {
  const owned = { ...(p.abzeichen ?? {}) };
  let changed = false;
  for (const a of ABZEICHEN) {
    if (!owned[a.id] && a.test(p)) {
      owned[a.id] = new Date().toISOString().slice(0, 10);
      changed = true;
    }
  }
  return changed ? { ...p, abzeichen: owned } : p;
}
