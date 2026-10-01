import re

code = open("components/akademie/Klassenzimmer.tsx", "r", encoding="utf-8").read()

# 1. Add activeStation state
if "activeStation" not in code:
    code = code.replace(
        "const [activeCardIdx, setActiveCardIdx] = useState<number>(0);",
        "const [activeStation, setActiveStation] = useState<number>(1);\n  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);"
    )

# 2. Update scrollToStation to also set activeStation
old_scroll = """  const scrollToStation = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };"""

new_scroll = """  const scrollToStation = (id: string, stNum?: number) => {
    if (stNum) setActiveStation(stNum);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };"""

code = code.replace(old_scroll, new_scroll)

# 3. Update the navigation bar to highlight ONLY activeStation dynamically
old_nav_pattern = re.compile(
    r'<nav aria-label="محطات الحصة اليومية".*?<\/nav>',
    re.DOTALL
)

new_nav = """<nav
        aria-label="محطات الحصة اليومية"
        style={{
          position: "sticky",
          top: "0.5rem",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: "0.85rem",
          padding: "0.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-line)",
          display: "flex",
          gap: "0.35rem",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <button
          type="button"
          onClick={() => scrollToStation("st-ziele", 1)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 1 ? 900 : 700,
            background: activeStation === 1 ? "var(--color-cola)" : "white",
            color: activeStation === 1 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 1 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 1 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          🎯 1. الأهداف
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-woerter", 2)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 2 ? 900 : 700,
            background: activeStation === 2 ? "var(--color-cola)" : "white",
            color: activeStation === 2 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 2 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 2 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          📚 2. المفردات ({keyVocab.length})
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-grammatik", 3)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 3 ? 900 : 700,
            background: activeStation === 3 ? "var(--color-cola)" : "white",
            color: activeStation === 3 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 3 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 3 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          📘 3. القاعدة والتريك
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-fallen", 4)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 4 ? 900 : 700,
            background: activeStation === 4 ? "var(--color-cola)" : "white",
            color: activeStation === 4 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 4 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 4 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          ⚠️ 4. فخاخ الامتحان
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-training", 5)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 5 ? 900 : 700,
            background: activeStation === 5 ? "var(--color-cola)" : "white",
            color: activeStation === 5 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 5 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 5 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          ✍️ 5. التدريب ({stepFrei + 1}/{plan.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => scrollToStation("st-abschluss", 6)}
          className="chip"
          style={{
            cursor: "pointer",
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "0.85rem",
            fontWeight: activeStation === 6 ? 900 : 700,
            background: activeStation === 6 ? "var(--color-cola)" : "white",
            color: activeStation === 6 ? "white" : "var(--color-ink)",
            borderColor: activeStation === 6 ? "var(--color-cola)" : "var(--color-line)",
            boxShadow: activeStation === 6 ? "0 2px 8px rgba(124, 45, 18, 0.25)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          🎓 6. الختام والترديد
        </button>
      </nav>"""

code = old_nav_pattern.sub(lambda m: new_nav, code, count=1)

# 4. Add transition buttons at the bottom of stations
# Station 1 bottom
st1_button = """        <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-woerter", 2)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            الانتقال إلى مفردات الدرس (المحطة 2) ←
          </button>
        </div>
      </section>"""

code = code.replace(
    '        {/* ── تسخين استرجاعي من حصة الأمس ── */}\n        {warmupSaetze.length > 0 && (\n',
    '        {/* ── تسخين استرجاعي من حصة الأمس ── */}\n        {warmupSaetze.length > 0 && (\n'
)

# Replace end of st-ziele
if 'الانتقال إلى مفردات الدرس (المحطة 2) ←' not in code:
    code = re.sub(
        r'(<section id="st-ziele".*?)(<\/section>)',
        r'\1' + st1_button,
        code,
        count=1,
        flags=re.DOTALL
    )

# Replace end of st-woerter
st2_button = """        <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToStation("st-ziele", 1)}
            style={{ minHeight: "48px" }}
          >
            ← العودة للأهداف
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-grammatik", 3)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            الانتقال إلى القاعدة وتريكة الحفظ (المحطة 3) ←
          </button>
        </div>
      </section>"""

if 'الانتقال إلى القاعدة وتريكة الحفظ (المحطة 3) ←' not in code:
    code = re.sub(
        r'(<section id="st-woerter".*?)(<\/section>)',
        r'\1' + st2_button,
        code,
        count=1,
        flags=re.DOTALL
    )

# Replace end of st-grammatik
st3_button = """        <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToStation("st-woerter", 2)}
            style={{ minHeight: "48px" }}
          >
            ← العودة للمفردات
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-fallen", 4)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            الانتقال إلى فخاخ الامتحان (المحطة 4) ←
          </button>
        </div>
      </section>"""

if 'الانتقال إلى فخاخ الامتحان (المحطة 4) ←' not in code:
    code = re.sub(
        r'(<section id="st-grammatik".*?)(<\/section>)',
        r'\1' + st3_button,
        code,
        count=1,
        flags=re.DOTALL
    )

# Replace end of st-fallen
st4_button = """        <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => scrollToStation("st-grammatik", 3)}
            style={{ minHeight: "48px" }}
          >
            ← العودة للقاعدة
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToStation("st-training", 5)}
            style={{ minHeight: "48px", padding: "0.6rem 1.4rem", fontWeight: 800 }}
          >
            بدء معمل التطبيق للمهارات الأربع (المحطة 5) ←
          </button>
        </div>
      </section>"""

if 'بدء معمل التطبيق للمهارات الأربع (المحطة 5) ←' not in code:
    code = re.sub(
        r'(<section id="st-fallen".*?)(<\/section>)',
        r'\1' + st4_button,
        code,
        count=1,
        flags=re.DOTALL
    )

open("components/akademie/Klassenzimmer.tsx", "w", encoding="utf-8").write(code)
print("Updated Klassenzimmer station transitions successfully!")
