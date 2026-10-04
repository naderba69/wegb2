"use client";

import { useProgress } from "@/lib/store";
import { CurriculumMap } from "@/components/akademie/CurriculumMap";

export default function MasarPage() {
  const { progress, ready } = useProgress();

  if (!ready) {
    return (
      <section className="curriculum-page ui-page" data-testid="curriculum-loading" role="status">
        <p>لحظات، نجهّز مسارك المحفوظ دون تغيير خطتك.</p>
      </section>
    );
  }

  return <CurriculumMap progress={progress} />;
}
