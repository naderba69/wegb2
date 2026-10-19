"use client";
import Link from "next/link";
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { buildDay, grammarAssignmentForDay, COURSE_TOPIC_ORDER } from "@/lib/plan";
import { grammarMap } from "@/lib/content";
import { LektionWizard } from "@/components/akademie/LektionWizard";
import { FehlerGrenze } from "@/components/fehlergrenze";

/**
 * 📖 وجهة «الدرس» (P2): بابُ المعالج الخمسي.
 * يفتح على درس اليوم نفسه — أي موضعٍ في الطابور — وبابه الوحيد «اليوم» (K109).
 * R145: في أيامٍ بلا مهمة قواعد، كان الاحتياطُ درسَ المرحلة الافتراضي نفسه أبداً
 * (a1-sein-haben طوال A1) في 162 يوماً — صار: آخرُ موضوعٍ مُسندٍ حتى اليوم،
 * وفوقه منتقي دروسٍ صريح يفتح أيَّ درسٍ من المنهج دون أن يمسّ الخطة.
 */
export default function Lernen() {
  const { progress } = useProgress();
  const day = progress.plan.day;
  const plan = buildDay(day, progress);
  const [wahl, setWahl] = useState<string>("");

  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  const topicId =
    wahl ||
    gramTask?.topicId ||
    grammarAssignmentForDay(day, progress)?.topicId ||
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
      <label style={{ display: "grid", gap: "0.35rem", margin: "0.8rem 0" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>📚 افتح درساً آخر من المنهج (استكشاف حر — لا يغيّر يومك ولا خطّتك):</span>
        <select
          className="field"
          data-testid="lektion-wahl"
          value={wahl}
          onChange={(e) => setWahl(e.target.value)}
          style={{ minHeight: "48px", width: "100%" }}
        >
          <option value="">درس اليوم / آخر درس وصلتَ إليه</option>
          {(Object.keys(COURSE_TOPIC_ORDER) as (keyof typeof COURSE_TOPIC_ORDER)[]).map((lvl) => (
            <optgroup key={lvl} label={`المستوى ${lvl}`}>
              {COURSE_TOPIC_ORDER[lvl].map((id) => (
                <option key={id} value={id}>
                  {grammarMap[id]?.titleAr ?? id} — {grammarMap[id]?.titleDe ?? ""}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <FehlerGrenze><LektionWizard topicId={topicId} /></FehlerGrenze>
    </div>
  );
}
