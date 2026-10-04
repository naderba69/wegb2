"use client";
/**
 * 🎧 معمل الاستماع — HörLabor (Modul AF)
 * المادة نفسها التي تقرأها عينك يسمعها أذنك: بنك texts، لا موازٍ له.
 * القانون كله في lib/hoeren (دارف_شبييلن/فراغن_فراي) — هذه البطاقة
 * تنفّذه فقط: وضعان، معدّلان، استماعة واحدة في الامتحان بلا استثناءات.
 */
import { useMemo, useRef, useState } from "react";
import type { Progress } from "@/lib/types";
import { addFehlerNow, useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { speakAny, stopSpeech, speechAvailable } from "@/lib/speech";
import { hoerenAudio, type LkGap } from "@/lib/content";
import { pickLk } from "@/lib/luecken";
import { normalize } from "@/lib/grader";
import { bauHoerRunde, darfSpielen, fragenFrei, werteItem, werteRunde, hoerNote, RATE, type Modus, type Tempo } from "@/lib/hoeren";

export function HoerLabor({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [modus, setModus] = useState<Modus>("training");
  const [tempo, setTempo] = useState<Tempo>("lern");
  const [rundeNr, setRundeNr] = useState(0);
  const runde = useMemo(() => bauHoerRunde(progress.plan.day + rundeNr * 13), [progress.plan.day, rundeNr]);
  const [plays, setPlays] = useState(0);
  const [started, setStarted] = useState(false);
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [geprueft, setGeprueft] = useState(false);
  const [skript, setSkript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mitAudio = !!hoerenAudio[runde.textId];

  const reset = (m: Modus) => {
    setModus(m);
    stopSpeech();
    audioRef.current?.pause();
    setPlays(0);
    setStarted(false);
    setAntworten({});
    setGeprueft(false);
    setSkript(false);
  };

  const abspielen = () => {
    if (!darfSpielen(modus, plays)) return;
    setPlays((n) => n + 1);
    setStarted(true);
    const el = audioRef.current;
    if (mitAudio && el) {
      el.playbackRate = RATE[tempo];
      el.currentTime = 0;
      const pr = el.play();
      if (pr && typeof pr.catch === "function") pr.catch(() => {});
    } else {
      speakAny(runde.de, { rate: RATE[tempo] });
    }
  };

  const frei = fragenFrei(plays);
  const fertig = antworten && Object.keys(antworten).length === runde.items.length;
  const ergebnis = werteRunde(runde.items, antworten);
  const note = hoerNote(Math.round((ergebnis.ok / Math.max(1, ergebnis.n)) * 100));

  const abgeben = () => {
    setGeprueft(true);
    stopSpeech();
    update((p) => {
      let q = checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (ergebnis.ok === ergebnis.n ? 12 : 4 + ergebnis.ok * 2) });
      q = logK(q, "Hoeren", ergebnis.ok >= Math.ceil(ergebnis.n / 2));
      return q;
    });
    for (const it of runde.items) {
      if (!werteItem(it, antworten[it.id] ?? "")) {
        addFehlerNow({
          falsch: `${it.promptDe} → ${antworten[it.id]?.trim() || "(leer)"}`,
          richtig: it.options ? it.answers.join(" / ") : it.answers[0],
          art: "hoeren",
          ar: `استماع — «${runde.titleAr}» — ${it.explanationAr}`,
          quelle: "HörLabor",
        });
      }
    }
  };

  const weiter = () => {
    setRundeNr((n) => n + 1);
    reset(modus);
  };

  return (
    <div className="card fadein" style={{ padding: "1rem 1.2rem", borderInlineStart: "5px solid var(--color-mid)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong style={{ fontSize: "1.02rem" }}>🎧 معمل الاستماع — HörLabor</strong>
        <span className="chip">{runde.saat} · {runde.items.length} أسئلة · {mitAudio ? "🔊 صوت مُنتَج" : speechAvailable() ? "🔈 صوت الجهاز" : "🔇 بلا صوت"}</span>
      </div>
      <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", margin: "0.3rem 0 0.55rem", lineHeight: 1.75 }}>
        نصوص بنكك تُنطَق بصوت جهازك — وضع التدريب بلا حدّ للمرات، ووضع الامتحان: <strong>استماعة واحدة، ثم الأسئلة عمياناً</strong>.
        {geprueft && " ما سقط منك ذهب للدفتر بفئة استماع."}
      </div>

      {!speechAvailable() && !mitAudio && (
        <div className="card" style={{ padding: "0.55rem 0.8rem", background: "var(--color-gold-soft)", fontSize: "0.84rem", marginBottom: "0.55rem" }}>
          🔇 جهازك لا يوفّر صوتاً ألمانياً ولا ملف صوتي لهذا النص — التدريب يعمل بالقراءة الصامتة عبر «📜 السكربت»، ووضع الامتحان يبقى مؤجَّلاً عمداً حتى يتوفّر الصوت أو الملف.
        </div>
      )}

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
        <button className="chip" style={{ cursor: "pointer", background: modus === "training" ? "var(--color-cola)" : "var(--ui-surface-raised)", color: modus === "training" ? "var(--ui-on-accent)" : undefined, padding: "0.45rem 0.75rem", minHeight: "44px" }} onClick={() => reset("training")}>🎓 تدريب — مرات بلا حد</button>
        <button className="chip" style={{ cursor: "pointer", background: modus === "pruefung" ? "var(--color-cola)" : "var(--ui-surface-raised)", color: modus === "pruefung" ? "var(--ui-on-accent)" : undefined, padding: "0.45rem 0.75rem", minHeight: "44px" }} onClick={() => reset("pruefung")}>⚙️ امتحان — استماعة واحدة 🔒</button>
        <button className="chip" style={{ cursor: "pointer", background: tempo === "lern" ? "var(--color-mid)" : "var(--ui-surface-raised)", color: tempo === "lern" ? "var(--ui-on-accent)" : undefined, padding: "0.45rem 0.7rem", minHeight: "44px" }} onClick={() => setTempo("lern")}>🐢 {RATE.lern}×</button>
        <button className="chip" style={{ cursor: "pointer", background: tempo === "pruefung" ? "var(--color-mid)" : "var(--ui-surface-raised)", color: tempo === "pruefung" ? "var(--ui-on-accent)" : undefined, padding: "0.45rem 0.7rem", minHeight: "44px" }} onClick={() => setTempo("pruefung")}>⚡ {RATE.pruefung}× Prüfungstempo</button>
      </div>

      {mitAudio && <audio ref={audioRef} src={hoerenAudio[runde.textId].file} preload="auto" />}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.6rem" }}>
        {darfSpielen(modus, plays) ? (
          <button className="btn btn-gold" onClick={abspielen} disabled={!speechAvailable() && !mitAudio && modus === "pruefung"}>
            ▶️ {plays === 0 ? "استمع الآن" : `استماعة ${plays + 1}`}
          </button>
        ) : (
          <span className="chip" style={{ background: "var(--color-cola-soft)", padding: "0.5rem 0.8rem" }}>🔒 استُنفدت الاستماعة — هذه قواعد Goethe، لا مزاج التطبيق</span>
        )}
        {started && (
          <button className="btn btn-ghost" style={{ padding: "0.35rem 0.7rem" }} onClick={() => setSkript((s) => !s)}>
            📜 {skript ? "أخفِ السكربت" : "السكربت (تدريب فقط)"}
          </button>
        )}
        <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
          {modus === "training" ? `استمعت ${plays}×` : plays === 0 ? "بقيت استماعة واحدة" : "الاستماعة صُرفت"}
        </span>
      </div>

      {skript && (
        <div className="card" style={{ padding: "0.8rem 1rem", marginBottom: "0.6rem", fontSize: "0.95rem", lineHeight: 2, direction: "ltr", textAlign: "left" }}>
          {runde.de}
        </div>
      )}

      {!started ? (
        <div className="card" style={{ padding: "0.85rem 1rem", color: "var(--color-ink2)" }}>
          «{runde.titleDe}» — {runde.titleAr}. اضغط ▶️ أولاً: الأسئلة مُقفلة حتى تسمع، كما في القاعة الحقيقية.
        </div>
      ) : !geprueft ? (
        <div style={{ display: "grid", gap: "0.55rem", opacity: frei || modus === "training" ? 1 : 0.4 }}>
          {runde.items.map((it, i) => (
            <div key={it.id} className="card" style={{ padding: "0.75rem 0.95rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>
                <span className="rtl-num">{i + 1}</span>. {it.promptDe}
              </div>
              {it.options ? (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {it.options.map((o) => (
                    <button
                      key={o}
                      className="btn btn-ghost"
                      style={{ padding: "0.35rem 0.8rem", background: antworten[it.id] === o ? "var(--color-cola)" : "var(--ui-surface-raised)", color: antworten[it.id] === o ? "var(--ui-on-accent)" : undefined, minHeight: "44px" }}
                      onClick={() => setAntworten((a) => ({ ...a, [it.id]: o }))}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="field"
                  style={{ direction: "ltr" }}
                  placeholder="Schreibe, was du gehört hast …"
                  value={antworten[it.id] ?? ""}
                  onChange={(e) => setAntworten((a) => ({ ...a, [it.id]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <button className="btn btn-primary" onClick={abgeben} disabled={!fertig}>📤 سلّم ورقة الاستماع{fertig ? "" : ` (${Object.keys(antworten).length}/${runde.items.length})`}</button>
        </div>
      ) : geprueft ? (
        <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-gold-soft)" }}>
          <strong>
            🎧 النتيجة: <span className="rtl-num">{ergebnis.ok}</span>/<span className="rtl-num">{ergebnis.n}</span> — {note.note} {note.bestanden ? "✓" : "✗"}
          </strong>
          <div style={{ display: "grid", gap: "0.35rem", marginTop: "0.5rem", fontSize: "0.88rem" }}>
            {runde.items.map((it) => {
              const gut = werteItem(it, antworten[it.id] ?? "");
              return (
                <div key={it.id}>
                  {gut ? "✅" : "❌"} {it.promptDe} — <strong>{it.options ? it.answers.join(" / ") : it.answers[0]}</strong> · {it.explanationAr}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "0.55rem", display: "flex", gap: "0.45rem" }}>
            <button className="btn btn-gold" onClick={weiter}>🔁 جولة نصٍّ جديد</button>
            {modus === "training" && <button className="btn btn-ghost" onClick={() => { setGeprueft(false); }}>👁 راجع إجاباتك</button>}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** 🧩 Lückendiktat — السماعُ يُبيِّضُ الكتابةَ: استمع، ثم املأ ما سقط من الجُمل */
export function LueckDiktat({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const [nivel, setNivel] = useState<"B1" | "B2">("B2");
  const [nr, setNr] = useState(0);
  const item = useMemo(() => pickLk(nivel, progress.plan.day + nr * 7), [nivel, progress.plan.day, nr]);
  const [plays, setPlays] = useState(0);
  const [tempo, setTempo] = useState<Tempo>("lern");
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [geprueft, setGeprueft] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const file = hoerenAudio[item.textId]?.file;

  const reset = () => { setPlays(0); setAntworten({}); setGeprueft(false); audioRef.current?.pause(); };
  const abspielen = () => {
    if (!file) return;
    setPlays((n) => n + 1);
    const el = audioRef.current;
    if (el) {
      el.playbackRate = RATE[tempo];
      el.currentTime = 0;
      const pr = el.play();
      if (pr && typeof pr.catch === "function") pr.catch(() => {});
    }
  };
  const fertig = Object.keys(antworten).length === item.gaps.length;
  const richtig = (g: LkGap) => normalize(antworten[g.id] ?? "") === normalize(g.answer);
  const score = item.gaps.filter((g) => richtig(g)).length;

  const abgeben = () => {
    setGeprueft(true);
    audioRef.current?.pause();
    update((p) => {
      let q = checkAbzeichen({ ...p, xp: (p.xp ?? 0) + (score === item.gaps.length ? 10 : 2 + score * 2) });
      q = logK(q, "Hoeren", score >= Math.ceil(item.gaps.length / 2));
      return q;
    });
    for (const g of item.gaps) {
      if (!richtig(g)) {
        addFehlerNow({
          falsch: antworten[g.id]?.trim() || "(leer)",
          richtig: g.answer,
          art: "schreibung",
          ar: `إملاءٌ فراغيّ — «${item.titleAr}» — الساقطةُ تُكتب كما تُسمع`,
          quelle: "Lückendiktat",
        });
      }
    }
  };

  return (
    <div className="card fadein" style={{ padding: "1rem 1.2rem", borderInlineStart: "5px solid var(--color-mid)", marginTop: "0.8rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong style={{ fontSize: "1.02rem" }}>🧩 Lückendiktat — أذنُك تسمع، يدُك تُبيِّض</strong>
        <span className="chip">{item.titleDe} · <span className="rtl-num">{item.gaps.length}</span> فراغات</span>
      </div>
      <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)", margin: "0.3rem 0 0.45rem", lineHeight: 1.75 }}>
        شريطُ النصِّ الكامل يدور، وأنت تملأ الكلمة الساقطة في كل جملة — لا سكربتَ قبل التسليم، ولا رحمةَ بالإملاء.
      </div>
      {file && <audio ref={audioRef} src={file} preload="auto" />}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.4rem 0 0.6rem", alignItems: "center" }}>
        {(["B1", "B2"] as const).map((L) => (
          <button key={L} className="chip" style={{ cursor: "pointer", background: nivel === L ? "var(--color-cola)" : "var(--ui-surface-raised)", color: nivel === L ? "var(--ui-on-accent)" : undefined, padding: "0.45rem 0.75rem", minHeight: "44px" }} onClick={() => { setNivel(L); setNr(0); reset(); }}>🎚 {L}</button>
        ))}
        <button className="btn btn-gold" onClick={abspielen} disabled={!file}>▶️ {plays === 0 ? "استمع" : `إعادة ${plays + 1}`}</button>
        <button className="chip" style={{ cursor: "pointer", padding: "0.45rem 0.7rem", minHeight: "44px", background: tempo === "lern" ? "var(--color-mid)" : "var(--ui-surface-raised)", color: tempo === "lern" ? "var(--ui-on-accent)" : undefined }} onClick={() => setTempo(tempo === "lern" ? "pruefung" : "lern")}>
          {tempo === "lern" ? `🐢 ${RATE.lern}×` : `⚡ ${RATE.pruefung}×`}
        </button>
        {!file && <span className="chip">🔇 لا شريطَ لهذا النص — تُركت الوحدةُ عمداً بلا تمرير</span>}
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {item.gaps.map((g, i) => {
          const gut = geprueft && richtig(g);
          const bad = geprueft && !richtig(g);
          return (
            <div key={g.id} className="card" style={{ padding: "0.6rem 0.85rem", background: gut ? "var(--color-gold-soft)" : bad ? "var(--color-cola-soft)" : undefined }}>
              <div style={{ direction: "ltr", textAlign: "left", fontSize: "0.95rem", lineHeight: 2.1 }}>
                <span className="rtl-num" style={{ fontWeight: 800, marginInlineEnd: "0.35rem" }}>{i + 1}.</span>
                {g.blanked.split("____")[0]}
                <input
                  className="field"
                  style={{ direction: "ltr", width: "10ch", margin: "0 0.3rem", display: "inline-block", textAlign: "center" }}
                  value={antworten[g.id] ?? ""}
                  onChange={(e) => setAntworten((a) => ({ ...a, [g.id]: e.target.value }))}
                  disabled={geprueft}
                />
                {g.blanked.split("____").slice(1).join("____")}
                {geprueft ? (gut ? " ✅" : ` ❌ → ${g.answer}`) : ""}
              </div>
            </div>
          );
        })}
      </div>
      {!geprueft ? (
        <button className="btn btn-primary" style={{ marginTop: "0.6rem" }} onClick={abgeben} disabled={!fertig}>
          📤 سلّم{fertig ? "" : ` (${Object.keys(antworten).length}/${item.gaps.length})`}
        </button>
      ) : (
        <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <strong><span className="rtl-num">{score}</span>/<span className="rtl-num">{item.gaps.length}</span> — {score >= Math.ceil(item.gaps.length / 2) ? "✓ تجاوزتَ القبول" : "✗ دون القبول — والساقطاتُ إلى الدفتر"}</strong>
          <button className="btn btn-gold" onClick={() => { setNr((n) => n + 1); reset(); }}>🔁 قطعةٌ وفراغاتُها</button>
          <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{plays > 0 ? `سمعتَ ${plays}× — الساقطُ مُسجَّلٌ كتابةً` : ""}</span>
        </div>
      )}
    </div>
  );
}
