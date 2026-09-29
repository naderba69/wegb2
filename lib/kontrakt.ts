/**
 * ============================================================
 *  🔒 عقد الانضباط — Tagesvertrag (ردم ثغرة المدرّس البشري)
 * ============================================================
 *  كل دوال هذه الطبقة نقية حتمية: (progress, now) ← verdict.
 *  لا ساعة داخلية، لا عشوائية، لا روابط. المحرك الأخلاقي هنا
 *  يعمل بالقواعد نفسها التي يعمل بها المصحّح: برهان أو براءة.
 *
 *  المبادئ المحكومة (K22):
 *  1. الإلغاء فوري ومحدد: مزّق ← لا أثر، ومزّق بلا عقد = لا عمل.
 *  2. الغرامة مقيّدة: XP لا ينزل تحت الصفر؛ الرقعة تُنزع فقط إن وُجدت.
 *  3. لا كسر بلا دليل: يُبرّأ المتعلم إن سجّل الدفتر أي إتمام في اليوم.
 *  4. لا عقاب مزدوج: غرامة واحدة لكل يوم (lastPenalty).
 *  5. العار مولَّد من سجلّ صاحبه فقط — لا من قوالب جاهزة.
 * ============================================================
 */
import type { Progress, Kontrakt } from "./types";

export type Strafe = Kontrakt["strafe"];
export type Status = "kein" | "laufend" | "erfuellt" | "gebrochen";

export interface Urteil {
  status: Status;
  /** دقائق متبقية حتى الإغلاق (laufend فقط) */
  minuten?: number;
  /** نص العار المولَّد — فقط عند gebrochen */
  scham?: string | null;
}

/** مفتاح اليوم المحلي YYYY-MM-DD — بلا انزلاق UTC */
export function tagLokal(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function minutenHHMM(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => Number(x) || 0);
  return h * 60 + m;
}

/** التوقيع (أو التجديد): يبسط كل آثار اليوم السابق عدا السلسلة */
export function signKontrakt(p: Progress, uhrzeit: string, strafe: Strafe, now: Date): Progress {
  const alt = p.kontrakt;
  const k: Kontrakt = {
    uhrzeit,
    strafe,
    seit: tagLokal(now),
    streak: alt?.streak ?? 0,
    streakTag: alt?.streakTag,
    lastPenalty: alt?.lastPenalty,
    bruchTag: alt?.bruchTag,
    lastShame: alt?.lastShame ?? null,
  };
  return { ...p, kontrakt: k };
}

/** الفكّ: محو كامل — ومحو بلا عقد لا يغيّر شيئاً (idempotent) */
export function voidKontrakt(p: Progress): Progress {
  if (!p.kontrakt) return p;
  const { kontrakt: _entfernt, ...rest } = p;
  return rest as Progress;
}

/** الدليل البريء: أي إتمام مهام مسجَّل في يوم التقويم هذا */
export function tagAktiv(p: Progress, tag: string): boolean {
  const inDays = Object.values(p.plan.days ?? {}).some((d) => (d.at ?? "").slice(0, 10) === tag && d.tasksDone > 0);
  if (inDays) return true;
  return Object.values(p.plan.tasks ?? {}).some((t) => t.done && (t.at ?? "").slice(0, 10) === tag);
}

/** أعلى عائلة أخطاء × تكراراتها — مادة العار الوحيدة المسموح بها */
export function groetsterFehler(p: Progress): { art: string; n: number } | null {
  const counts = new Map<string, number>();
  for (const f of Object.values(p.fehler ?? {})) {
    const art = (f as { art?: string }).art ?? "sonst";
    counts.set(art, (counts.get(art) ?? 0) + Math.max(1, (f as { treffer?: number }).treffer ?? 1));
  }
  let best: { art: string; n: number } | null = null;
  for (const [art, n] of [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!best || n > best.n) best = { art, n };
  }
  return best;
}

export function schamText(p: Progress, now: Date): string {
  const tag = tagLokal(now);
  const k = p.kontrakt;
  const gf = groetsterFehler(p);
  const ausDemLog = gf
    ? `دفترك يقول: «${gf.art}» تكرّر ${gf.n} مرات — وهو أول ما يبتلعه الإهمال`
    : "دفترك صامت حتى الآن — فلا عار يُروى، فقط يومٌ ضاع";
  return `يوم ${tag} انقضى بعد ${k?.uhrzeit ?? "—"} بلا إتمامٍ واحد، و${ausDemLog}.`;
}

/** الحكم الوحيد — دالة نقية لا تكتب شيئاً */
export function pruefeKontrakt(p: Progress, now: Date): Urteil {
  const k = p.kontrakt;
  if (!k) return { status: "kein" };
  const tag = tagLokal(now);
  if (tag < k.seit) return { status: "kein" }; // عقد من أمسٍ منقضٍ لا يدين اليوم
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const frist = minutenHHMM(k.uhrzeit);
  if (nowMin < frist) return { status: "laufend", minuten: frist - nowMin };
  if (tagAktiv(p, tag)) return { status: "erfuellt" };
  return { status: "gebrochen", scham: k.lastPenalty === tag ? (k.lastShame ?? null) : schamText(p, now) };
}

/** الوفاء يُسجَّل مرة واحدة في اليوم: streak+1 محروس بـstreakTag */
export function anwendenErfuellt(p: Progress, now: Date): Progress {
  const k = p.kontrakt;
  if (!k) return p;
  const tag = tagLokal(now);
  if (k.streakTag === tag) return p;
  return { ...p, kontrakt: { ...k, streak: k.streak + 1, streakTag: tag, lastShame: null } };
}

/** تنفيذ الغرامة — مرة واحدة لكل يوم، لا سالب تحت الصفر، رقعة فقط إن وُجدت */
export function anwendenStrafe(p: Progress, now: Date): { p: Progress; text: string } {
  const k = p.kontrakt;
  if (!k) return { p, text: "" };
  const tag = tagLokal(now);
  if (k.lastPenalty === tag) return { p, text: k.lastShame ?? "" };
  let q = { ...p };
  let text = "";
  const abzeichen = Object.entries(q.abzeichen ?? {});
  if (k.strafe === "flecken1" && abzeichen.length > 0) {
    const [neuestes, datum] = abzeichen.sort((a, b) => b[1].localeCompare(a[1]))[0];
    q = { ...q, abzeichen: Object.fromEntries(abzeichen.filter(([id]) => id !== neuestes)) };
    text = `نُزعت حلقة «${neuestes}» الممنوحة في ${datum} — الجدار يذكى ما لا يوفى.`;
  } else {
    const vorher = q.xp ?? 0;
    q = { ...q, xp: Math.max(0, vorher - 30) };
    text = k.strafe === "flecken1"
      ? "ما من رقعة تُنزع — فألغيت ثلاثون نقطة عوضاً عنها."
      : `انطفأت ${Math.min(30, vorher)} نقطة من ${vorher}.`;
  }
  q = { ...q, kontrakt: { ...k, lastPenalty: tag, bruchTag: k.bruchTag ?? tag, lastShame: schamText(p, now) } };
  return { p: q, text };
}
