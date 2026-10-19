"use client";
/**
 * 🪪 M3/R183 — واجهة التشخيص التكيّفي: أربع مهارات متتابعة، إجابة تُقفل
 * عند النقر بلا كشفٍ فوري (حتى لا يتأثر الأداء بالتعلّم أثناء الاختبار)،
 * ثم خلاصة بكلّ مهارة ويوم الدخول الآمن مع زرّ تطبيقٍ صريح.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/store";
import {
  EINSTUFUNG_SKILLS, einstufungStart, einstufungAktuell, einstufungAntwort,
  einstiegsVorschlag, type EinstufungsSkill, type EinstufungsLauf,
} from "@/lib/einstufung";
import type { Level } from "@/lib/types";
import { speakDe } from "@/lib/speech";

const SKILL_AR: Record<EinstufungsSkill, string> = {
  lesen: "📖 القراءة", hoeren: "🎧 الاستماع", grammatik: "🧩 القواعد", wortschatz: "🗂️ المفردات",
};

export function EinstufungTest() {
  const { progress, update } = useProgress();
  const [phase, setPhase] = useState<"intro" | "lauf" | "fertig">("intro");
  const [skillIdx, setSkillIdx] = useState(0);
  const [lauf, setLauf] = useState<EinstufungsLauf>(() => einstufungStart("lesen"));
  const [ergebnisse, setErgebnisse] = useState<Partial<Record<EinstufungsSkill, Level>>>({});
  const [angewandt, setAngewandt] = useState(false);

  const skill = EINSTUFUNG_SKILLS[skillIdx];
  const frage = phase === "lauf" ? einstufungAktuell(lauf) : null;
  const vorschlag = useMemo(
    () => (phase === "fertig" && EINSTUFUNG_SKILLS.every((s) => ergebnisse[s])
      ? einstiegsVorschlag(ergebnisse as Record<EinstufungsSkill, Level>, progress)
      : null),
    [phase, ergebnisse, progress],
  );

  const starten = () => {
    setErgebnisse({});
    setSkillIdx(0);
    setLauf(einstufungStart(EINSTUFUNG_SKILLS[0]));
    setAngwandtF();
    setPhase("lauf");
  };
  const setAngwandtF = () => setAngewandt(false);

  const antworten = (opt: string) => {
    if (!frage) return;
    const neu = einstufungAntwort(lauf, opt === frage.ex.answer);
    if (neu.fertig) {
      const erg = { ...ergebnisse, [skill]: (neu.schaetzung ?? "A0") as Level };
      setErgebnisse(erg);
      if (skillIdx + 1 < EINSTUFUNG_SKILLS.length) {
        setSkillIdx(skillIdx + 1);
        setLauf(einstufungStart(EINSTUFUNG_SKILLS[skillIdx + 1]));
      } else {
        setPhase("fertig");
      }
    } else {
      setLauf(neu);
    }
  };

  const anwenden = () => {
    if (!vorschlag) return;
    const erg = ergebnisse as Record<EinstufungsSkill, Level>;
    update((p) => ({
      ...p,
      plan: { ...p.plan, day: vorschlag.tag },
      settings: {
        ...p.settings,
        placed: true,
        einstufung: {
          lesen: erg.lesen, hoeren: erg.hoeren, grammatik: erg.grammatik, wortschatz: erg.wortschatz,
          tag: vorschlag.tag, datum: new Date().toISOString().slice(0, 10),
        },
      },
    }));
    setAngewandt(true);
  };

  if (phase === "intro") {
    return (
      <div style={{ display: "grid", gap: "0.8rem" }} data-testid="einstufung">
        <p style={{ lineHeight: 2, margin: 0 }}>
          أربع مهارات تُقاس مستقلّة بأسئلة حقيقية من بنوك التطبيق نفسه، متدرّجة من A1 إلى B2:
          كلّما أصبتَ صعدتَ، وحين تخفق في سؤالَي مستوىً تتوقّف تلك المهارة. في النهاية نقترح
          يوم دخولٍ آمنًا: بداية أضعف مهاراتك، <strong>دون قفزٍ فوق أيّ امتحان مرحلةٍ لم تُجزه</strong>.
        </p>
        <p className="tiny muted" style={{ margin: 0, lineHeight: 1.9 }}>
          تقديرٌ آلي مبني على محتوى هذا التطبيق — ليس اختبار Goethe/telc رسميًا ولا يغني عنه.
          نحو 4–8 أسئلة للمهارة (دقائق معدودة)، ولا تظهر صحّة الإجابات أثناء الاختبار حتى لا يتغيّر أداؤك.
        </p>
        {progress.settings.einstufung && (
          <p className="tiny" style={{ margin: 0 }}>
            آخر تشخيص ({progress.settings.einstufung.datum}): قراءة {progress.settings.einstufung.lesen} ·
            سماع {progress.settings.einstufung.hoeren} · قواعد {progress.settings.einstufung.grammatik} ·
            مفردات {progress.settings.einstufung.wortschatz} ← اليوم {progress.settings.einstufung.tag}
          </p>
        )}
        <button type="button" className="btn primary" onClick={starten} style={{ minHeight: "48px", justifySelf: "start" }}>
          🪪 ابدأ التشخيص
        </button>
      </div>
    );
  }

  if (phase === "fertig" && vorschlag) {
    return (
      <div style={{ display: "grid", gap: "0.8rem" }} data-testid="einstufung-ergebnis">
        <h2 style={{ margin: 0, fontSize: "1.15rem" }}>نتيجتك بمهارة</h2>
        <ul style={{ margin: 0, lineHeight: 2.1 }}>
          {EINSTUFUNG_SKILLS.map((s) => (
            <li key={s}>{SKILL_AR[s]}: <strong>{ergebnisse[s]}</strong></li>
          ))}
        </ul>
        <p style={{ margin: 0, lineHeight: 2 }}>
          نقطة الدخول الآمنة: <strong>اليوم {vorschlag.tag}</strong> (بداية أضعف مهارة: {vorschlag.schwachStufe})
          {vorschlag.pruefungsTag
            ? <> — ويقف قبلها امتحان مرحلةٍ غير مُجاز (يوم {vorschlag.pruefungsTag})، فستبدأ منه لتثبّت القفزة باجتيازه داخل الخطة.</>
            : <>.</>}
        </p>
        {!angewandt ? (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" className="btn primary" onClick={anwenden} style={{ minHeight: "48px" }}>
              🚀 انتقل إلى اليوم {vorschlag.tag}
            </button>
            <button type="button" className="btn" onClick={() => setPhase("intro")} style={{ minHeight: "48px" }}>
              إعادة التشخيص
            </button>
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            ✅ طُبّق — خطّتك الآن في اليوم {vorschlag.tag}. <Link href="/">إلى يومك ←</Link>
          </p>
        )}
        <p className="tiny muted" style={{ margin: 0 }}>
          الانتقال يغيّر موضعك في الخطة فقط؛ بطاقاتك ودفتر أخطائك ونقاطك محفوظة، ويمكنك إعادة التشخيص متى شئت.
        </p>
      </div>
    );
  }

  if (!frage) return null;
  return (
    <div style={{ display: "grid", gap: "0.8rem" }} data-testid="einstufung-lauf">
      <div className="tiny muted">
        المهارة {skillIdx + 1}/4 · {SKILL_AR[skill]} · المستوى المُختبَر الآن {frage.stufe} ·
        سؤال {lauf.antworten.length + 1} في هذه المهارة
      </div>
      {frage.skill === "hoeren" && (
        <div style={{ display: "grid", gap: "0.35rem" }}>
          {frage.audioSrc ? (
            <>
              <audio controls src={frage.audioSrc} style={{ width: "100%" }} />
              {frage.kiAudio && <span className="tiny muted">🔊 صوت مولّد آليًا (KI) — ليس تسجيلًا بشريًا</span>}
            </>
          ) : (
            <button type="button" className="btn" onClick={() => frage.ex.text && speakDe(frage.ex.text)} style={{ minHeight: "44px", justifySelf: "start" }}>
              🔊 استمع (نطق آلي من جهازك)
            </button>
          )}
        </div>
      )}
      {frage.skill === "lesen" && frage.ex.text && (
        <div dir="ltr" style={{ background: "var(--color-card2, #f6f1e7)", borderRadius: "10px", padding: "0.7rem 0.9rem", lineHeight: 1.8, textAlign: "left" }}>
          {frage.ex.text}
        </div>
      )}
      <div style={{ fontWeight: 800, lineHeight: 1.9 }}>
        <span dir="ltr">{frage.ex.promptDe}</span>
        {frage.ex.promptAr && <div className="tiny muted" style={{ fontWeight: 400 }}>{frage.ex.promptAr}</div>}
      </div>
      <div style={{ display: "grid", gap: "0.45rem" }}>
        {(frage.ex.options ?? []).map((opt) => (
          <button
            key={opt}
            type="button"
            className="btn"
            style={{ minHeight: "48px", textAlign: "start" }}
            onClick={() => antworten(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
