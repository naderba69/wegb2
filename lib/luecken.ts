/**
 * 🧩 محرّك Lückendiktat — مُنتقيٌ حتميٌّ نقيّ: يومٌ عينُه، قطعٌ أعينُها.
 * البياناتُ (content/luecken.json) بُنِيَت من نصوص البنك وأصواتها نفسها؛ هنا الاختيارُ فقط.
 */
import { luecken, type LkItem } from "./content";
import { rng } from "./plan";

export function pickLk(level: "B1" | "B2", seed: number): LkItem {
  const pool = luecken.filter((i) => i.level === level);
  const rand = rng(seed * 31 + 7);
  return pool[Math.floor(rand() * pool.length)];
}
