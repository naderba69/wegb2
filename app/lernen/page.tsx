"use client";
import { useProgress } from "@/lib/store";
import { buildDay } from "@/lib/plan";
import { LektionWizard } from "@/components/akademie/LektionWizard";

/**
 * 📖 وجهة «الدرس» (P2): بابُ المعالج الخمسي.
 * يفتح على درس اليوم نفسه — أي موضعٍ في الطابور — وبابه الوحيد «اليوم» (K109).
 */
export default function Lernen() {
  const { progress } = useProgress();
  const day = progress.plan.day;
  const plan = buildDay(day, progress);

  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  const topicId =
    gramTask?.topicId ??
    (plan.phase === "A1"
      ? "a1-sein-haben"
      : plan.phase === "A2"
      ? "a2-perfekt"
      : plan.phase === "B1"
      ? "b1-passiv"
      : "b2-nominalstil");

  return (
    <div className="today-screen fadein" style={{ display: "grid", gap: "1rem" }} data-testid="lernen-screen">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.2rem", margin: 0 }}>📖 الدرس</h1>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
          معالجُ خمسِ خطواتٍ — درسُ اليوم يُفتح هنا ولا يُقفزُ منه
        </span>
      </header>
      <LektionWizard topicId={topicId} />
    </div>
  );
}
