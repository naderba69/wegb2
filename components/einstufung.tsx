"use client";
/**
 * 🪪 M3/R183/PA-014 — فرز دخول تكيّفي لأربع حزم استقبال/صيغة.
 * أربعة مصادر لكل مستوى وعتبة 3/4 تمنع صعود تخمين واحد. لا كشف فوري،
 * ولا عينة كتابة/تحدث؛ الخلاصة اقتراح موضع داخلي لا حكم CEFR.
 */
import { lokalesDatum } from "@/lib/datum";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/store";
import {
  EINSTUFUNG_BESTANDEN_AB, EINSTUFUNG_ITEMS_PRO_STUFE, EINSTUFUNG_SCOPE,
  EINSTUFUNG_SKILLS, einstufungStart, einstufungAktuell, einstufungAntwort,
  einstufungsBandErgebnisse, einstiegsVorschlag, type EinstufungsBandErgebnis,
  type EinstufungsSkill, type EinstufungsLauf,
} from "@/lib/einstufung";
import type { Level } from "@/lib/types";
import { speakDe } from "@/lib/speech";

const SKILL_AR: Record<EinstufungsSkill, string> = {
  lesen: "📖 القراءة", hoeren: "🎧 الاستماع", grammatik: "🧩 القواعد", wortschatz: "🗂️ المفردات",
};
type EinstufungsProtokoll = {
  bands: EinstufungsBandErgebnis[];
  items: EinstufungsLauf["antworten"];
};

export function EinstufungTest() {
  const { progress, update } = useProgress();
  const [phase, setPhase] = useState<"intro" | "lauf" | "fertig">("intro");
  const [skillIdx, setSkillIdx] = useState(0);
  const [lauf, setLauf] = useState<EinstufungsLauf>(() => einstufungStart("lesen"));
  const [ergebnisse, setErgebnisse] = useState<Partial<Record<EinstufungsSkill, Level>>>({});
  const [protokolle, setProtokolle] = useState<Partial<Record<EinstufungsSkill, EinstufungsProtokoll>>>({});
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
    setProtokolle({});
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
      setProtokolle((current) => ({
        ...current,
        [skill]: { bands: einstufungsBandErgebnisse(neu), items: neu.antworten },
      }));
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
          tag: vorschlag.tag, datum: lokalesDatum(), scope: EINSTUFUNG_SCOPE,
          evidence: Object.fromEntries(EINSTUFUNG_SKILLS.map((entrySkill) => {
            const protocol = protokolle[entrySkill] ?? { bands: [], items: [] };
            return [entrySkill, { totalItems: protocol.items.length, bands: protocol.bands, items: protocol.items }];
          })),
        },
      },
    }));
    setAngewandt(true);
  };

  if (phase === "intro") {
    return (
      <div style={{ display: "grid", gap: "0.8rem" }} data-testid="einstufung">
        <p style={{ lineHeight: 2, margin: 0 }}>
          أربع حزم استقبال/صيغة تُفحص من بنوك التطبيق: القراءة والاستماع والتعرّف إلى القواعد والمفردات.
          لكل مستوى أربعة بنود من أربعة مصادر مختلفة، ويلزم <strong>3 من 4</strong> للصعود؛ إصابة بند واحد أو بندين لا تكفي.
          في النهاية نقترح يوم دخول محافظًا من أضعف حزمة، <strong>دون قفز فوق امتحان مرحلة لم تُجزه</strong>.
        </p>
        <p className="tiny muted" style={{ margin: 0, lineHeight: 1.9 }} data-testid="einstufung-scope">
          النطاق محدود صراحةً: لا توجد هنا عينة كتابة أو تحدث، لذلك لا تصدر النتيجة مستوى CEFR ولا حكماً على الإنتاج.
          هذا فرز داخلي غير معاير، وليس اختبار Goethe/telc رسميًا. يُطرح 4–16 بندًا لكل مجال، ولا تظهر صحة الإجابات أثناءه.
        </p>
        {progress.settings.einstufung && (
          <p className="tiny" style={{ margin: 0 }}>
            آخر فرز دخول ({progress.settings.einstufung.datum}): قراءة {progress.settings.einstufung.lesen} ·
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
        <h2 style={{ margin: 0, fontSize: "1.15rem" }}>اقتراح الدخول حسب الحزم الأربع</h2>
        <p className="tiny muted" style={{ margin: 0 }}>
          الرموز A1–B2 هنا أسماء حزم محتوى اجتزت فيها 3/4، وليست حكماً على مستواك العام.
        </p>
        <ul style={{ margin: 0, lineHeight: 2.1 }}>
          {EINSTUFUNG_SKILLS.map((entrySkill) => {
            const bands = protokolle[entrySkill]?.bands ?? [];
            const last = bands.at(-1);
            return (
              <li key={entrySkill}>
                {SKILL_AR[entrySkill]}: <strong>حزمة دخول {ergebnisse[entrySkill]}</strong>
                {last && <> · آخر حزمة مفحوصة {last.stufe}: {last.richtig}/{last.gesamt}</>}
              </li>
            );
          })}
        </ul>
        <p style={{ margin: 0, lineHeight: 2 }}>
          نقطة الدخول المحافظة: <strong>اليوم {vorschlag.tag}</strong> (بداية أضعف حزمة: {vorschlag.schwachStufe})
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
          الانتقال يغيّر موضعك في الخطة فقط؛ لا يثبت مستوى ولا يقيّم الكتابة أو التحدث. بطاقاتك ودفتر أخطائك ونقاطك محفوظة، ويمكنك إعادة الفرز متى شئت.
        </p>
      </div>
    );
  }

  if (!frage) return null;
  const bandAntworten = lauf.antworten.filter((antwort) => antwort.stufe === frage.stufe);
  return (
    <div style={{ display: "grid", gap: "0.8rem" }} data-testid="einstufung-lauf">
      <div className="tiny muted">
        المجال {skillIdx + 1}/4 · {SKILL_AR[skill]} · حزمة المحتوى {frage.stufe} ·
        بند {bandAntworten.length + 1}/{EINSTUFUNG_ITEMS_PRO_STUFE} · قاعدة الصعود {EINSTUFUNG_BESTANDEN_AB}/{EINSTUFUNG_ITEMS_PRO_STUFE}
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
        <div lang="de" dir="ltr" style={{ background: "var(--color-card2, #f6f1e7)", borderRadius: "10px", padding: "0.7rem 0.9rem", lineHeight: 1.8, textAlign: "left" }}>
          {frage.ex.text}
        </div>
      )}
      <div style={{ fontWeight: 800, lineHeight: 1.9 }}>
        <span lang="de" dir="ltr">{frage.ex.promptDe}</span>
        {frage.ex.promptAr && <div lang="ar" dir="rtl" className="tiny muted" style={{ fontWeight: 400 }}>{frage.ex.promptAr}</div>}
      </div>
      <div style={{ display: "grid", gap: "0.45rem" }}>
        {(frage.ex.options ?? []).map((opt) => (
          <button
            key={opt}
            type="button"
            className="btn"
            lang={/[\u0600-\u06ff]/u.test(opt) ? "ar" : "de"}
            dir={/[\u0600-\u06ff]/u.test(opt) ? "rtl" : "ltr"}
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
