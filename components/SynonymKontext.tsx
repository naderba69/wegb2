"use client";
import type { VocabCard } from "@/lib/types";
import { synonymKontexteFuer } from "@/lib/synonyme";
import { De } from "@/components/De";

/** يعرض التقارب المعجمي مع مثالين وملاحظة استعمال؛ لا يقدّم الكلمة كبديل مطلق. */
export function SynonymKontext({ karte, testId = "synonym-context" }: { karte: VocabCard; testId?: string }) {
  const eintraege = synonymKontexteFuer(karte);
  if (eintraege.length === 0) return null;

  return (
    <span data-testid={testId} style={{ display: "block", marginTop: "0.45rem", padding: "0.55rem 0.65rem", borderInlineStart: "3px solid var(--color-a1)", borderRadius: "0.45rem", background: "var(--color-a1-soft)", lineHeight: 1.8 }}>
      {eintraege.map(({ synonym, kontext }) => (
        <span key={synonym} style={{ display: "block" }}>
          <strong>🔁 قريب في هذا السياق: <De>{synonym}</De></strong>
          <span style={{ display: "block", fontSize: "0.84rem" }}>
            <De>{kontext.basisKollokation}</De> ↔ <De>{kontext.alternativKollokation}</De>
          </span>
          <span style={{ display: "grid", gap: "0.15rem", marginTop: "0.25rem", fontSize: "0.82rem" }}>
            <span><De>{kontext.basisDe}</De> — {kontext.basisAr}</span>
            <span><De>{kontext.alternativDe}</De> — {kontext.alternativAr}</span>
          </span>
          <small style={{ display: "block", color: "var(--color-ink2)", marginTop: "0.25rem" }}>{kontext.nuanceAr}</small>
        </span>
      ))}
    </span>
  );
}
