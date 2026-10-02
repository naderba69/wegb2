"use client";
import { useState, useRef } from "react";
import { activeProfile, renameProfile } from "@/lib/profiles";
import { PHASE_START, levelAmTag } from "@/lib/phasen";
import { modulOf, planPct } from "@/lib/plan";
import { LEVEL_COLORS, type Progress } from "@/lib/types";

interface SchultorProps {
  progress: Progress;
  /** الوضعُ السلبيُّ (محطةُ «تقدّمي»): عرضُ البطاقةِ وحدها — الأبوابُ الثلاثةُ مطبوعةٌ خلف passiv */
  passiv?: boolean;
  onUpdate?: (updater: (p: Progress) => Progress) => void;
  onImport?: (jsonStr: string) => void;
  onEnterClassroom?: () => void;
}

export function Schultor({ progress, passiv = false, onUpdate, onImport, onEnterClassroom }: SchultorProps) {
  const act = activeProfile();
  const [name, setName] = useState(act.name === "الأساسي" ? "" : act.name);
  const [editingName, setEditingName] = useState(act.name === "الأساسي");
  const [statusMsg, setStatusMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const currentLevel = levelAmTag(progress.plan.day);
  const currentModul = modulOf(progress.plan.day);
  const pct = planPct(progress);
  const srsCount = Object.keys(progress.srs || {}).length;

  const saveName = () => {
    const finalName = name.trim() || "طالب الألمانية";
    renameProfile(act.id, finalName, act.emoji);
    setEditingName(false);
    setStatusMsg("تم تحديث اسمك في بطاقة الطالب بنجاح ✓");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const setLevel = (lvl: "A1" | "A2" | "B1" | "B2") => {
    const startDay = PHASE_START[lvl];
    onUpdate?.((p) => ({
      ...p,
      plan: {
        ...p.plan,
        day: startDay,
      },
      settings: {
        ...p.settings,
        placed: true,
      },
    }));
    setStatusMsg(`تم ضبط نقطة الانطلاق على المستوى ${lvl} (اليوم ${startDay}) ✓`);
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const handleExport = () => {
    try {
      const data = JSON.stringify(progress, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanName = (act.name || "student").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_");
      a.download = `wegb2-student-${cleanName}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg("تم تنزيل حقيبة دراستك محلياً بنجاح 💾");
      setTimeout(() => setStatusMsg(""), 4000);
    } catch {
      setStatusMsg("تعذر التصدير حالياً.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport?.(String(reader.result));
        setStatusMsg("تم استرجاع حقيبة دراستك بنجاح! مرحباً بعودتك ✓");
        setTimeout(() => setStatusMsg(""), 4000);
      } catch {
        setStatusMsg("الملف غير صالح أو تالف.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <section
      className="card fadein"
      style={{
        padding: "1.4rem",
        background: "linear-gradient(145deg, #ffffff 40%, #faf5ee 100%)",
        border: "1px solid var(--color-line)",
        borderRadius: "1.2rem",
        boxShadow: "0 8px 30px rgba(124, 45, 18, 0.08)",
      }}
    >
      {/* ── عنوان الاستقبال ── */}
      <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "2.8rem", marginBottom: "0.2rem" }}>🏫</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--color-cola)", margin: 0 }}>
          {passiv ? "بطاقة الطالب — من ملفك" : "استقبال الأكاديمية — طريقي إلى B2"}
        </h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.92rem", margin: "0.3rem auto 0", maxWidth: "30rem" }}>
          {passiv ? "هويّتك ومسارك كما هي في ملفك — مشاهدةٌ من «تقدّمي»؛ التغييرُ من مكانِه لا من هنا." : "مرحباً بك! هنا مدرستك الخاصة لتعلم الألمانية خطوة بخطوة حتى B2. سجّل اسمك وحدد مستواك لنبدأ الحصة فوراً."}</p>
      </div>

      {/* ── بطاقة الطالب الرسمية (Studentenausweis) ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
          color: "#fafaf9",
          borderRadius: "1rem",
          padding: "1.2rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          marginBottom: "1.4rem",
          border: "1px solid rgba(255,255,255,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-15px",
            left: "-15px",
            fontSize: "6rem",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        >
          🇩🇪
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              style={{
                fontSize: "2.4rem",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {act.emoji || "🎓"}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", letterSpacing: "1px", color: "#a8a29e", textTransform: "uppercase" }}>
                STUDENTENAUSWEIS · بطاقة الطالب
              </div>
              {editingName ? (
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.2rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={name}
                    placeholder="اكتب اسمك هنا…"
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      padding: "0.35rem 0.6rem",
                      borderRadius: "0.4rem",
                      border: "1px solid #d97706",
                      background: "#1c1917",
                      color: "#fff",
                      fontSize: "1rem",
                    }}
                    autoFocus
                  />
                  <button
                    className="btn btn-gold"
                    style={{ padding: "0.35rem 0.8rem", fontSize: "0.85rem", minHeight: "36px" }}
                    onClick={saveName}
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff" }}>
                    {act.name && act.name !== "الأساسي" ? act.name : "طالب الألمانية"}
                  </span>
                  {!passiv && (
                  <button
                    onClick={() => setEditingName(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fbbf24",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    ✏️ تعديل
                  </button>
                  )}
                </div>
              )}
              <div style={{ fontSize: "0.82rem", color: "#d6d3d1", marginTop: "0.15rem" }}>
                المستوى الحالي: <strong style={{ color: LEVEL_COLORS[currentLevel] }}>{currentLevel}</strong> · اليوم {progress.plan.day} من 270
              </div>
            </div>
          </div>

          <div style={{ textAlign: "start", background: "rgba(255,255,255,0.06)", padding: "0.5rem 0.8rem", borderRadius: "0.6rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>الوحدة الدراسية</div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#fef3c7" }}>
              {currentModul.etikett}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#d6d3d1" }}>
              {currentModul.modul.titelAr}
            </div>
          </div>
        </div>

        {/* ── إحصائيات سريعة في بطاقة الطالب ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
            gap: "0.6rem",
            marginTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "0.8rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.7rem", color: "#a8a29e" }}>نسبة الإنجاز</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#34d399" }}>{pct}%</div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#a8a29e" }}>بطاقات مثبتة</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#60a5fa" }}>{srsCount}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#a8a29e" }}>سلسلة الالتزام</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fbbf24" }}>{progress.streak?.count || 0} أيام 🔥</div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#a8a29e" }}>نقاط الخبرة</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#c084fc" }}>{progress.xp || 0} XP</div>
          </div>
        </div>
      </div>

      {/* ── اختيار نقطة الانطلاق والمستوى ── */}
      {!passiv && (
      <div style={{ marginBottom: "1.4rem" }}>
        <label style={{ display: "block", fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--color-cola)" }}>
          🎯 اختر نقطة الانطلاق في دراستك:
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.6rem" }}>
          {(["A1", "A2", "B1", "B2"] as const).map((lvl) => {
            const isSelected = currentLevel === lvl;
            const startDay = PHASE_START[lvl];
            return (
              <button
                key={lvl}
                type="button"
                className="btn"
                onClick={() => setLevel(lvl)}
                style={{
                  padding: "0.75rem 0.5rem",
                  minHeight: "52px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.2rem",
                  border: isSelected ? `2px solid ${LEVEL_COLORS[lvl]}` : "1px solid var(--color-line)",
                  background: isSelected ? "var(--color-paper2)" : "white",
                  boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                  borderRadius: "0.8rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: "1.05rem", color: LEVEL_COLORS[lvl] }}>
                  {lvl} {isSelected && "✓"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }}>
                  بداية {lvl} — يوم {PHASE_START[lvl]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* ── الحفظ المحلي والاسترداد (Local Vault) ── */}
      {!passiv && (
      <div
        style={{
          background: "var(--color-paper2)",
          padding: "0.9rem 1.1rem",
          borderRadius: "0.8rem",
          marginBottom: "1.4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--color-ink)" }}>
            💾 حقيبة دراستك محفوظة محلياً في جهازك
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
            لا خوادم ولا ضياع للبيانات: يمكنك تحميل حقيبتك ونقلها لأي جهاز آخر بنقرة واحدة.
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleExport}
            style={{ fontSize: "0.82rem", minHeight: "44px", padding: "0.4rem 0.8rem" }}
            title="تحميل ملف التقدّم بصيغة JSON"
          >
            📥 تحميل حقيبتي
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fileRef.current?.click()}
            style={{ fontSize: "0.82rem", minHeight: "44px", padding: "0.4rem 0.8rem" }}
            title="استرجاع التقدّم من ملف JSON سابق"
          >
            📤 استرجاع الحقيبة
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>
      )}

      {statusMsg && (
        <div
          className="fadein"
          style={{
            padding: "0.65rem 1rem",
            marginBottom: "1.2rem",
            borderRadius: "0.6rem",
            background: "var(--color-gold-soft)",
            border: "1px solid var(--color-gold)",
            color: "var(--color-cola)",
            fontWeight: 700,
            fontSize: "0.88rem",
            textAlign: "center",
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* ── زر الدخول الكبير إلى قاعة الدرس ── */}
      {!passiv && (() => {
        const needsName = editingName || !name.trim();
        return (
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (needsName) {
                  setStatusMsg("من فضلك اكتب اسمك أولاً — يناديك الأستاذ به طوال الرحلة.");
                  setTimeout(() => setStatusMsg(""), 3500);
                  return;
                }
                saveName();
                onEnterClassroom?.();
              }}
              aria-disabled={needsName}
              style={{
                width: "100%",
                maxWidth: "28rem",
                fontSize: "1.15rem",
                fontWeight: 900,
                padding: "0.95rem 1.5rem",
                minHeight: "56px",
                borderRadius: "0.9rem",
                boxShadow: needsName ? "none" : "0 6px 20px rgba(124, 45, 18, 0.25)",
                opacity: needsName ? 0.55 : 1,
                cursor: needsName ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
              }}
            >
              <span>{needsName ? "✍️ اكتب اسمك ثم ادخل" : "👨‍🏫 دخول قاعة الدرس مع الأستاذ"}</span>
              {!needsName && <span style={{ fontSize: "1.3rem" }}>←</span>}
            </button>
            <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.45rem" }}>
              حصة اليوم {progress.plan.day} جاهزة ومؤطرة بالكامل (أهداف · مفردات · قاعدة وتريك · تدريب · ختام)
            </div>
          </div>
        );
      })()}
    </section>
  );
}
