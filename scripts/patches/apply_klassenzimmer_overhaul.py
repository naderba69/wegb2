import re

code = open("components/akademie/Klassenzimmer.tsx", "r", encoding="utf-8").read()

# 1. State additions
state_add = """  const act = activeProfile();
  const [extendedTime, setExtendedTime] = useState<boolean>(false);
  const [cardRevealed, setCardRevealed] = useState<Record<string, boolean>>({});
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [ratedCards, setRatedCards] = useState<Record<string, number>>({});"""

if "activeCardIdx" not in code:
    code = code.replace(
        """  const act = activeProfile();
  const [extendedTime, setExtendedTime] = useState<boolean>(false);
  const [cardRevealed, setCardRevealed] = useState<Record<string, boolean>>({});""",
        state_add
    )

# 2. Add handleCardRating function
rating_fn = """  // 5. جمل الإحماء من حصة الأمس (إن وُجدت)
  const warmupSaetze = useMemo(() => {
    if (day <= 1) return [];
    return kapselSaetze(day - 1);
  }, [day]);

  const handleCardRating = (quality: 0 | 2 | 4) => {
    const card = keyVocab[activeCardIdx];
    if (!card) return;
    const prev = progress.srs[card.id] ?? newCard();
    onSrs(card.id, reviewCard(prev, quality));
    if (quality === 0) {
      addFehlerNow({
        falsch: card.article ? `${card.article} ${card.de}` : card.de,
        richtig: card.ar,
        art: "wortschatz",
        ar: card.exampleDe ? `${card.ar} — مثال: ${card.exampleDe}` : card.ar,
        level: card.level,
        quelle: "فلاشكارد الحصة",
      });
    }
    setRatedCards((prev) => ({ ...prev, [card.id]: quality }));
    onPoints(quality >= 2 ? 1 : 0, 1);
    setIsCardFlipped(false);
    if (activeCardIdx < keyVocab.length - 1) {
      setActiveCardIdx(activeCardIdx + 1);
    }
  };

  const currentVocabCard = keyVocab[activeCardIdx];
  const currentKolloks = currentVocabCard ? kollokationenFuer(currentVocabCard) : [];"""

if "handleCardRating" not in code:
    code = code.replace(
        """  // 5. جمل الإحماء من حصة الأمس (إن وُجدت)
  const warmupSaetze = useMemo(() => {
    if (day <= 1) return [];
    return kapselSaetze(day - 1);
  }, [day]);""",
        rating_fn
    )

# 3. Replace Station 2 with 3D Flashcard Section
old_st2_pattern = re.compile(
    r'<section id="st-woerter" className="card fadein" style=\{\{ padding: "1\.4rem", border: "1px solid var\(--color-line\)" \}\}>.*?<\/section>',
    re.DOTALL
)

new_st2 = """<section id="st-woerter" className="card fadein" style={{ padding: "1.4rem", border: "1px solid var(--color-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ background: "var(--color-cola-soft)", color: "var(--color-cola)", fontWeight: 800 }}>
            المحطة 2 · 🃏 صالة الفلاشكارد التفاعلية المدمجة
          </span>
          <span className="chip" style={{ fontWeight: 800 }}>
            البطاقة {activeCardIdx + 1} من {keyVocab.length}
          </span>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--color-ink2)", margin: "0 0 1rem" }}>
          انقر على البطاقة لقلبها واكتشاف المعنى والجمع، واستمع للنطق الفوري، ثم قيّم حفظك لتغذية نظام التكرار المتباعد:
        </p>

        {currentVocabCard && (
          <div style={{ display: "grid", gap: "1rem", maxWidth: "34rem", margin: "0 auto" }}>
            <div
              className="flip-card-container"
              onClick={() => setIsCardFlipped(!isCardFlipped)}
            >
              <div className={`flip-card ${isCardFlipped ? "is-flipped" : ""}`}>
                {/* ── الوجه الأمامي (Front): الكلمة الألمانية + أداة ملونة + النطق + المتلازمة ── */}
                <div
                  className="flip-face flip-face-front"
                  style={{
                    borderTop: `6px solid ${
                      currentVocabCard.article === "der"
                        ? "var(--color-der)"
                        : currentVocabCard.article === "die"
                        ? "var(--color-die)"
                        : currentVocabCard.article === "das"
                        ? "var(--color-das)"
                        : "var(--color-plural)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    {currentVocabCard.article ? (
                      <span className={
                        currentVocabCard.article === "der"
                          ? "badge-der"
                          : currentVocabCard.article === "die"
                          ? "badge-die"
                          : currentVocabCard.article === "das"
                          ? "badge-das"
                          : "badge-plural"
                      }>
                        {currentVocabCard.article}
                      </span>
                    ) : <span />}
                    <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
                      🔄 انقر للقلب
                    </span>
                  </div>

                  <div style={{ margin: "1.2rem 0 0.8rem" }}>
                    <De style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-ink)" }}>
                      {currentVocabCard.de}
                    </De>
                  </div>

                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakDe(currentVocabCard.de, { voiceName, rate });
                      }}
                      style={{ minHeight: "44px", fontSize: "0.9rem", padding: "0.4rem 1rem" }}
                    >
                      🔊 استمع للنطق
                    </button>
                    {currentKolloks.length > 0 && (
                      <span className="chip" style={{ background: "var(--color-gold-soft)", borderColor: "var(--color-gold)" }}>
                        🤝 <De style={{ fontWeight: 800 }}>{currentKolloks[0]}</De>
                      </span>
                    )}
                  </div>
                </div>

                {/* ── الوجه الخلفي (Back): المعنى العربي + صيغة الجمع + المثال المترجم ── */}
                <div className="flip-face flip-face-back">
                  <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--color-cola)", marginBottom: "0.4rem" }}>
                    {currentVocabCard.ar}
                  </div>

                  {currentVocabCard.plural && (
                    <div style={{ marginBottom: "0.6rem" }}>
                      <span className="badge-plural">
                        صيغة الجمع: <De style={{ fontWeight: 900 }}>{currentVocabCard.plural}</De>
                      </span>
                    </div>
                  )}

                  {currentVocabCard.exampleDe && (
                    <div style={{ background: "white", padding: "0.7rem 0.9rem", borderRadius: "0.6rem", border: "1px solid var(--color-line)", margin: "0.4rem 0", width: "100%", textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                        <De style={{ fontWeight: 800, fontSize: "0.98rem" }}>{currentVocabCard.exampleDe}</De>
                        <button
                          type="button"
                          className="chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakDe(currentVocabCard.exampleDe!, { voiceName, rate });
                          }}
                          style={{ cursor: "pointer", minHeight: "36px" }}
                        >
                          🔊
                        </button>
                      </div>
                      {currentVocabCard.exampleAr && (
                        <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
                          {currentVocabCard.exampleAr}
                        </div>
                      )}
                    </div>
                  )}

                  {/* أزرار التقييم الفوري SRS */}
                  <div style={{ display: "flex", gap: "0.4rem", width: "100%", marginTop: "0.8rem", justifyContent: "center" }}>
                    <button
                      type="button"
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardRating(0);
                      }}
                      style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #f87171", flex: 1, minHeight: "44px", fontSize: "0.82rem", fontWeight: 800 }}
                    >
                      🔴 نسيتها
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardRating(2);
                      }}
                      style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", flex: 1, minHeight: "44px", fontSize: "0.82rem", fontWeight: 800 }}
                    >
                      🟡 بصعوبة
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardRating(4);
                      }}
                      style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac", flex: 1, minHeight: "44px", fontSize: "0.82rem", fontWeight: 800 }}
                    >
                      🟢 سهلة ومتقنة
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* شريط مؤشرات البطاقات */}
            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
              {keyVocab.map((c, i) => {
                const rated = ratedCards[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    className="chip"
                    onClick={() => {
                      setActiveCardIdx(i);
                      setIsCardFlipped(false);
                    }}
                    style={{
                      cursor: "pointer",
                      minHeight: "40px",
                      background: i === activeCardIdx ? "var(--color-cola)" : rated !== undefined ? (rated === 0 ? "#fee2e2" : "#dcfce7") : "white",
                      color: i === activeCardIdx ? "white" : undefined,
                      fontWeight: 800,
                    }}
                  >
                    {rated !== undefined ? (rated === 0 ? "✕ " : "✓ ") : ""}{i + 1}. <De>{c.de.replace(/^(der|die|das)\s+/, "").slice(0, 8)}</De>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>"""

code = old_st2_pattern.sub(lambda m: new_st2, code, count=1)

# 4. In Station 3: Add the Phonetics & Pronunciation Master (دليل مخارج الحروف الألمانية)
phonetics_box = """            {/* ── دليل مخارج الحروف الألمانية للأستاذ ── */}
            <div
              style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "2px solid #86efac",
                borderRadius: "0.9rem",
                padding: "1rem 1.2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "1.3rem" }}>🎙️</span>
                <strong style={{ fontSize: "1rem", color: "#166534" }}>
                  سر النطق ومخارج الحروف الألمانية (Aussprache-Tipp):
                </strong>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#14532d", margin: 0 }}>
                {plan.phase === "A1"
                  ? "صوت ch بعد الحروف الصوتية e, i, ä ينطق بابتسامة خفيفة وملامسة وسط اللسان لسقف الحلق (ich-Laut مثل: ich, nicht)، بينما بعد a, o, u ينطق خاءً عميقة من الحلق (ach-Laut مثل: machen, Buch)."
                  : plan.phase === "A2"
                  ? "أسرار الـ Umlaute: انطق صوت ö بضم شفتيك كأنك تنطق الواو مع وضع لسانك في موضع الياء؛ ونهاية الكلمات -er تُنطق كفتحة مخففة (vokalisiertes r مثل: Wasser -> Vassa)."
                  : plan.phase === "B1"
                  ? "التنغيم والنبر الصوتي (Satzmelodie): ينخفض نبر الصوت في نهاية الجمل الخبرية وجمل W-Fragen، بينما يرتفع بنبرة تساؤلية حادة في نهاية أسئلة Ja/Nein."
                  : "الوقفات الحنجرية الأكاديمية (Knacklaut): فصل البوادئ والكلمات المركبة بهمسة حنجرية واضحة (Glottal Stop) لتبدو لغتك في النقاشات كمتحدث ألماني أصيل."}
              </p>
            </div>"""

if "دليل مخارج الحروف الألمانية للأستاذ" not in code:
    code = code.replace(
        "            {/* ── تريك الحفظ وشفرة الذاكرة المدمجة (Eselsbrücke) ── */}",
        f"{phonetics_box}\n\n            {{/* ── تريك الحفظ وشفرة الذاكرة المدمجة (Eselsbrücke) ── */}}"
    )

open("components/akademie/Klassenzimmer.tsx", "w", encoding="utf-8").write(code)
print("Applied Klassenzimmer overhaul successfully!")
