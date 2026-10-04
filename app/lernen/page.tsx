"use client";
import Link from "next/link";
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
    <div className="today-screen fadein dirb ui-page" data-testid="lernen-screen">
      <header className="dirb-tabhead dirb-hero-anim">
        <h1 className="dirb-title">الدرس</h1>
        <div className="dirb-sub">افهم القاعدة، شاهد مثالاً، ثم تدرّب.</div>
      </header>
      <Link href="/masar" className="curriculum-entry-link" data-testid="curriculum-map-link">
        🧭 استكشف مسار المنهج الكامل · 378 يوماً
      </Link>
      <LektionWizard topicId={topicId} />
    </div>
  );
}
