"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useProgress } from "@/lib/store";
import { buildDay, grammarAssignmentForDay, COURSE_TOPIC_ORDER } from "@/lib/plan";
import { grammarMap } from "@/lib/content";
import { GGP_FEATURES, GGP_FAMILIEN, TOPIC_GGP, ggpForTopic } from "@/lib/ggp";
import { LektionWizard } from "@/components/akademie/LektionWizard";
import { FehlerGrenze } from "@/components/fehlergrenze";
import { useBankGeneration } from "@/lib/use-bank-generation";

const BIBLIOTHEK_LEVELS = Object.keys(COURSE_TOPIC_ORDER) as (keyof typeof COURSE_TOPIC_ORDER)[];

/**
 * 📖 وجهة «الدرس» (P2): بابُ المعالج الخمسي.
 * يفتح على درس اليوم نفسه — أي موضعٍ في الطابور — وبابه الوحيد «اليوم» (K109).
 * R145: في أيامٍ بلا مهمة قواعد، كان الاحتياطُ درسَ المرحلة الافتراضي نفسه أبداً
 * (a1-sein-haben طوال A1) في 162 يوماً — صار: آخرُ موضوعٍ مُسندٍ حتى اليوم،
 * وفوقه منتقي دروسٍ صريح يفتح أيَّ درسٍ من المنهج دون أن يمسّ الخطة.
 */
export default function Lernen() {
  const bankGeneration = useBankGeneration();
  const { progress } = useProgress();
  const day = progress.plan.day;
  const plan = buildDay(day, progress);
  const [wahl, setWahl] = useState<string>("");
  const [q, setQ] = useState("");
  const [ggpFilter, setGgpFilter] = useState<string>("");
  const [familieFilter, setFamilieFilter] = useState<string>("");
  const qNorm = q.trim().toLowerCase();
  const familieTopicIds = useMemo(() => {
    if (!familieFilter) return null;
    const codes = new Set(GGP_FEATURES.filter((feature) => feature.familie === familieFilter).map((feature) => feature.code));
    return new Set(Object.entries(TOPIC_GGP)
      .filter(([, topicCodes]) => topicCodes.some((code) => codes.has(code)))
      .map(([topicId]) => topicId));
  }, [familieFilter]);
  const visibleByLevel = useMemo(() => {
    void bankGeneration; // neue Bank-Schicht invalidiert die mutierten Content-Container
    const sichtbar = {} as Record<keyof typeof COURSE_TOPIC_ORDER, string[]>;
    for (const level of BIBLIOTHEK_LEVELS) {
      sichtbar[level] = ggpFilter && level !== ggpFilter
        ? []
        : COURSE_TOPIC_ORDER[level].filter((id) => {
          if (familieTopicIds && !familieTopicIds.has(id)) return false;
          if (!qNorm) return true;
          const topic = grammarMap[id];
          const haystack = `${topic?.titleAr ?? ""} ${topic?.titleDe ?? ""} ${topic?.id ?? ""} ${level}`.toLowerCase();
          return haystack.includes(qNorm);
        });
    }
    return sichtbar;
  // bankGeneration invalidiert die aus stufenweise mutierten Banken gelesenen Ableitungen.
  }, [bankGeneration, familieTopicIds, ggpFilter, qNorm]);
  const filteredByAll = useMemo(
    () => BIBLIOTHEK_LEVELS.flatMap((level) => visibleByLevel[level] ?? []),
    [visibleByLevel]
  );
  useEffect(() => {
    try {
      const g = localStorage.getItem("weg-lernen-ggp");
      if (g) setGgpFilter(g);
      const f = localStorage.getItem("weg-lernen-familie");
      if (f) setFamilieFilter(f);
    } catch {}
  }, []);
  useEffect(() => {
    try { if (ggpFilter) localStorage.setItem("weg-lernen-ggp", ggpFilter); else localStorage.removeItem("weg-lernen-ggp"); } catch {}
  }, [ggpFilter]);
  useEffect(() => {
    try { if (familieFilter) localStorage.setItem("weg-lernen-familie", familieFilter); else localStorage.removeItem("weg-lernen-familie"); } catch {}
  }, [familieFilter]);

  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  const topicId =
    wahl ||
    gramTask?.topicId ||
    grammarAssignmentForDay(day, progress)?.topicId ||
    (plan.phase === "A0"
      ? "a0-buchstaben"
      : plan.phase === "A1"
      ? "a1-sein-haben"
      : plan.phase === "A2"
      ? "a2-perfekt"
      : plan.phase === "B1"
      ? "b1-passiv"
      : "b2-nominalstil");

  return (
    <div className="today-screen fadein dirb ui-page" data-testid="lernen-screen">
      <header className="dirb-tabhead dirb-hero-anim">
        <h1 className="dirb-title">المكتبة — الدروس</h1>
        <div className="dirb-sub">افهم القاعدة، شاهد مثالاً، ثم تدرّب. — مكتبة الدروس الـ 87 (بحث فوري حسب المستوى والعنوان)</div>
      </header>
      <Link href="/masar" className="curriculum-entry-link" data-testid="curriculum-map-link">
        🧭 استكشف مسار المنهج الكامل · 378 يوماً
      </Link>
      {/* B2 Hinweis — ثابت Verlag */}
      <div className="card" style={{ padding: '0.6rem 0.8rem', borderInlineStart: '4px solid #a78bfa', background: 'linear-gradient(180deg, #FFFCF0, #FDF8E8)' }} data-testid="b2-authentic-hinweis">
        <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#1A2E4A' }}>📖 الجديد B2: نص أصيل 286 كلمة</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--ui-muted)', lineHeight: 1.7 }}>
          مع تظليل <span className="b2-konnektor b2-konnektor--weil">weil</span> و <span className="b2-konnektor b2-konnektor--obwohl">obwohl</span> — اقرأ في <span style={{ color: '#113A5F', fontWeight: 800 }}>اليوم › الخطوة 3: Hören & Lesen</span>
        </div>
      </div>
      <div className="card" style={{ padding: "0.6rem 0.8rem", marginTop: "0.7rem", display: "grid", gap: "0.45rem" }}>
        <label htmlFor="lernen-search" style={{ fontSize: "0.84rem", fontWeight: 800 }}>
          🔍 ابحث في الدروس (بالعربية أو الألمانية):
        </label>
        <input
          id="lernen-search"
          data-testid="lernen-search"
          className="field"
          dir="auto"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="مثال: sein / الأفعال / Nebensatz"
          style={{ minHeight: "44px" }}
        />
        {qNorm && (
          <div style={{ fontSize: "0.78rem", color: "var(--ui-muted)" }}>
            نتائج البحث تُفلتر القائمة أدناه — امسح الحقل لإظهار الكل.
          </div>
        )}
        {/* GGP 150 Filter — لا بيانات جديدة، تصنيف عرضي فقط */}
        <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.4rem" }} data-testid="ggp-filter">
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>📑 GGP 150:</span>
            {["", "A1", "A2", "B1", "B2"].map((lvl) => (
              <button key={lvl || "all"} type="button" data-testid={`ggp-level-${lvl || "all"}`} className="chip" style={{ minHeight: "36px", background: ggpFilter === lvl ? "var(--ui-green)" : undefined, color: ggpFilter === lvl ? "white" : undefined, fontWeight: ggpFilter === lvl ? 800 : 600 }} onClick={() => setGgpFilter(lvl)}>{lvl || "الكل"} {lvl ? `· ${GGP_FEATURES.filter((f) => f.level === lvl).length}` : `· 150`}</button>
            ))}
            {(ggpFilter || familieFilter) && <button type="button" className="chip" style={{ minHeight: "36px" }} onClick={() => { setGgpFilter(""); setFamilieFilter(""); setQ(""); }}>✕ مسح</button>}
          </div>
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
            {GGP_FAMILIEN.map((fam) => (
              <button key={fam} type="button" data-testid={`ggp-familie-${fam}`} className="chip" style={{ minHeight: "32px", fontSize: "0.74rem", background: familieFilter === fam ? "var(--color-gold-soft)" : undefined, borderColor: familieFilter === fam ? "var(--color-gold)" : undefined }} onClick={() => setFamilieFilter((v) => v === fam ? "" : fam)}>{fam}</button>
            ))}
          </div>
          {familieFilter && <div style={{ fontSize: "0.75rem", color: "var(--ui-muted)" }}>الفصيلة: {familieFilter} — {GGP_FEATURES.filter((f) => f.familie === familieFilter && (!ggpFilter || f.level === ggpFilter)).length} بنية</div>}
        </div>
      </div>
      {/* ── Sprint 3D — المكتبة البحثية: شبكة بطاقات فورية + العداد ── */}
      <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0.7rem 0 0.3rem", fontSize: "0.8rem", color: "var(--ui-muted)" }}>
              <span data-testid="bibliothek-zaehler">📚 {filteredByAll.length} / 87 درساً {qNorm || ggpFilter || familieFilter ? "· مفلتر" : ""}</span>
              <span>{filteredByAll.length < 87 && "✨ بحث فوري"}</span>
            </div>
            <label style={{ display: "grid", gap: "0.35rem", margin: "0 0 0.6rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>📚 افتح درساً آخر من المنهج (استكشاف حر — لا يغيّر يومك ولا خطّتك):</span>
              <select
                className="field"
                data-testid="lektion-wahl"
                value={wahl}
                onChange={(e) => setWahl(e.target.value)}
                style={{ minHeight: "48px", width: "100%" }}
              >
                <option value="">درس اليوم / آخر درس وصلتَ إليه</option>
                {BIBLIOTHEK_LEVELS.map((lvl) => {
                  const visible = visibleByLevel[lvl] ?? [];
                  if (visible.length === 0) return null;
                  return (
                    <optgroup key={lvl} label={`المستوى ${lvl} — ${visible.length}`}>
                      {visible.map((id) => (
                        <option key={id} value={id}>
                          {grammarMap[id]?.titleAr ?? id} — {grammarMap[id]?.titleDe ?? ""}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </label>
            {/* شبكة المكتبة — بطاقات سريعة */}
            <div data-testid="bibliothek-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.6rem", margin: "0.6rem 0 0.8rem" }}>
              {filteredByAll.slice(0, 48).map((id) => {
                const t = grammarMap[id];
                if (!t) return null;
                const active = id === topicId;
                return (
                  <button
                    key={id}
                    type="button"
                    data-testid={`bibliothek-card-${id}`}
                    onClick={() => setWahl(id)}
                    style={{
                      textAlign: "start",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.85rem",
                      border: active ? "2px solid var(--ui-green)" : "1px solid var(--ui-border)",
                      background: active ? "var(--ui-green-soft)" : "var(--ui-surface)",
                      cursor: "pointer",
                      display: "grid",
                      gap: "0.3rem",
                    }}
                  >
                    <span style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span className={`lesson-level-badge lesson-level-${t.level}`} style={{ fontSize: "0.68rem", padding: "0.1rem 0.35rem" }}>{t.level}</span>
                      <span className="ggp-chip" style={{ fontSize: "0.62rem" }}>{ggpForTopic(id)[0]?.code ?? "GGP"}</span>
                      {active && <span style={{ fontSize: "0.7rem", color: "var(--ui-green)", fontWeight: 800 }}>● مفتوح</span>}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "0.86rem", lineHeight: 1.4 }}>{t.titleAr}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--ui-muted)", direction: "ltr" }}>{t.titleDe}</span>
                  </button>
                );
              })}
            </div>
            {filteredByAll.length > 48 && <div style={{ fontSize: "0.78rem", color: "var(--ui-muted)", textAlign: "center", marginBottom: "0.6rem" }}>+ {filteredByAll.length - 48} نتيجة أخرى — ضيّق البحث لرؤيتها</div>}
      </>
      <FehlerGrenze><LektionWizard topicId={topicId} /></FehlerGrenze>
    </div>
  );
}
