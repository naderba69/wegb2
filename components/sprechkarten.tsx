"use client";
// 🎙️ بطاقات محادثة مسجّلة (E5/R174): أجزاء الامتحان الثلاثة + تحضير موقوت +
// تسجيل محلي (MediaRecorder) يعيش في ذاكرة الجلسة فقط + تقييم ذاتي بعد سماع نفسك.
// لا يوجد هنا أيّ تقييم آلي للنطق، ولا يغادر أيّ صوتٍ هذا الجهاز.
import { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import { kontaktKarten, muendlich } from "@/lib/content";
import { RUBRIK_LABELS } from "@/lib/simulation";
import {
  SPRECH_KRITERIEN,
  SPRECH_LEVELS,
  baueSprechRunde,
  selbstPunkte,
  sprechBudgetSekunden,
  type SprechLevel,
} from "@/lib/sprechkarten";
import { De, DeBlock } from "./De";

type Phase = "wahl" | "vorbereitung" | "sprechen" | "fertig";
type RecStatus = "bereit" | "aufnahme" | "hat-aufnahme" | "kein-mikro" | "ohne";

const MIME_KANDIDATEN = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", ""];
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

interface TeilSchritt {
  teil: 1 | 2 | 3;
  titelDe: string;
  titelAr: string;
  auftragDe: string;
  auftragAr?: string;
  stuetzen: string[];
  budgetS: number;
  karteId: string;
  bewertet: boolean;
}

export function SprechKartenStudio() {
  const { progress, update } = useProgress();
  const [level, setLevel] = useState<SprechLevel>("B2");
  const [rundenNr, setRundenNr] = useState(1);
  const [phase, setPhase] = useState<Phase>("wahl");
  const [prepRest, setPrepRest] = useState(0);
  const [notizen, setNotizen] = useState("");
  const [schritt, setSchritt] = useState(0);
  const [rundeEintraege, setRundeEintraege] = useState<{ teil: number; punkte: number; dauerS: number }[]>([]);

  const runde = useMemo(() => baueSprechRunde(rundenNr * 7919 + 11, level), [rundenNr, level]);
  const schritte: TeilSchritt[] = useMemo(() => {
    const out: TeilSchritt[] = [];
    if (runde.kontakt)
      out.push({
        teil: 1, titelDe: runde.kontakt.titel_de, titelAr: runde.kontakt.titel_ar,
        auftragDe: runde.kontakt.auftrag_de, auftragAr: runde.kontakt.auftrag_ar,
        stuetzen: runde.kontakt.stuetzen ?? [], budgetS: sprechBudgetSekunden(1, runde.kontakt),
        karteId: runde.kontakt.id, bewertet: false,
      });
    if (runde.teil2)
      out.push({
        teil: 2, titelDe: runde.teil2.titel_de, titelAr: runde.teil2.titel_ar,
        auftragDe: runde.teil2.auftrag_de ?? runde.teil2.titel_de, auftragAr: runde.teil2.auftrag_ar,
        stuetzen: runde.teil2.stuetzen ?? [], budgetS: sprechBudgetSekunden(2, runde.teil2),
        karteId: runde.teil2.id, bewertet: true,
      });
    if (runde.teil3)
      out.push({
        teil: 3, titelDe: runde.teil3.titel_de, titelAr: runde.teil3.titel_ar,
        auftragDe: runde.teil3.auftrag_de ?? runde.teil3.titel_de, auftragAr: runde.teil3.auftrag_ar,
        stuetzen: runde.teil3.stuetzen ?? [], budgetS: sprechBudgetSekunden(3, runde.teil3),
        karteId: runde.teil3.id, bewertet: true,
      });
    return out;
  }, [runde]);
  const aktuell = schritte[schritt];

  /* ── التسجيل المحلي ── */
  const [recStatus, setRecStatus] = useState<RecStatus>("bereit");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blobExt, setBlobExt] = useState("webm");
  const [dauerS, setDauerS] = useState(0);
  const [restS, setRestS] = useState(0);
  const [stufen, setStufen] = useState<(number | null)[]>([null, null, null, null]);
  const [gehoert, setGehoert] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const startRef = useRef(0);
  const mountedRef = useRef(false);

  const raeumeAuf = () => {
    const rec = recRef.current;
    if (rec && rec.state !== "inactive") { try { rec.stop(); } catch { /* انتهى */ } }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setBlobUrl(null);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; raeumeAuf(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetSchritt = () => {
    raeumeAuf();
    setRecStatus("bereit");
    setDauerS(0);
    setStufen([null, null, null, null]);
    setGehoert(false);
  };

  /* عدّاد التحضير */
  useEffect(() => {
    if (phase !== "vorbereitung") return;
    const t = setInterval(() => setPrepRest((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => { if (phase === "vorbereitung" && prepRest === 0) setPhase("sprechen"); }, [phase, prepRest]);

  /* إيقاف تلقائي عند نهاية ميزانية الجزء */
  useEffect(() => {
    if (recStatus !== "aufnahme") return;
    const t = setInterval(() => {
      const vergangen = Math.floor((Date.now() - startRef.current) / 1000);
      setRestS(Math.max(0, (aktuell?.budgetS ?? 0) - vergangen));
      if (aktuell && vergangen >= aktuell.budgetS) stopAufnahme();
    }, 400);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recStatus, aktuell]);

  const startAufnahme = async () => {
    raeumeAuf();
    setGehoert(false);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecStatus("kein-mikro");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
      streamRef.current = stream;
      const mime = MIME_KANDIDATEN.find((m) => m === "" || MediaRecorder.isTypeSupported?.(m)) ?? "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (!mountedRef.current) return;
        setDauerS(Math.max(1, Math.round((Date.now() - startRef.current) / 1000)));
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (!blob.size) { setRecStatus("kein-mikro"); return; }
        setBlobExt((rec.mimeType || "").includes("mp4") ? "mp4" : (rec.mimeType || "").includes("ogg") ? "ogg" : "webm");
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setBlobUrl(url);
        setRecStatus("hat-aufnahme");
      };
      startRef.current = Date.now();
      setRestS(aktuell?.budgetS ?? 0);
      rec.start();
      setRecStatus("aufnahme");
    } catch {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (mountedRef.current) setRecStatus("kein-mikro");
    }
  };

  const stopAufnahme = () => {
    const rec = recRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
  };

  const alleStufen = stufen.every((s) => s !== null);
  const punkteVorschau = alleStufen ? selbstPunkte(stufen as number[]) : null;

  const speichernUndWeiter = () => {
    if (!aktuell?.bewertet || !alleStufen || !gehoert) return;
    const punkte = selbstPunkte(stufen as number[]);
    update((p) => ({
      ...p,
      sprechUebungen: [
        ...(p.sprechUebungen ?? []),
        { datum: new Date().toISOString(), level, teil: aktuell.teil, karteId: aktuell.karteId, dauerS, punkte },
      ].slice(-50),
    }));
    setRundeEintraege((e) => [...e, { teil: aktuell.teil, punkte, dauerS }]);
    weiter();
  };

  const weiter = () => {
    resetSchritt();
    if (schritt + 1 >= schritte.length) setPhase("fertig");
    else setSchritt((s) => s + 1);
  };

  const starteRunde = () => {
    resetSchritt();
    setSchritt(0);
    setRundeEintraege([]);
    setNotizen("");
    setPrepRest(runde.vorbereitungMin * 60);
    setPhase("vorbereitung");
  };

  const kartenTitel = (id: string) =>
    muendlich.find((k) => k.id === id)?.titel_de ?? kontaktKarten.find((k) => k.id === id)?.titel_de ?? id;

  const historie = [...(progress.sprechUebungen ?? [])].reverse().slice(0, 8);

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🎙️ بطاقات محادثة مسجّلة — تدرّب بصوتك واسمع نفسك</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.6rem", lineHeight: 1.85 }}>
        أجزاء الامتحان الثلاثة من بنك مستواك: تحضيرٌ موقوت كما في القاعة، ثم تسجيلٌ محليّ تعيد سماعه وتقيّم نفسك بعده بشبكةٍ رباعية
        (طلاقة/مفردات/بنى/نطق كما سمعتَه أنت). <strong>صوتك لا يغادر هذا الجهاز أبدًا</strong>: التسجيل يعيش في ذاكرة هذه الجلسة فقط —
        لا رفع ولا خادم ولا حفظ في تقدّمك؛ ما يُحفَظ هو البطاقة وتقديرك الذاتي ومدّة التسجيل. والتطبيق لا يحكم على نطقك آليًّا في أيّ موضع.
      </div>

      {phase === "wahl" && (
        <>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            {SPRECH_LEVELS.map((l) => (
              <button key={l.id} type="button" className={level === l.id ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setLevel(l.id)}>
                {l.labelAr}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "0.85rem", marginBottom: "0.6rem" }}>
            {SPRECH_LEVELS.find((l) => l.id === level)?.formatAr}. الجولة {rundenNr}: بطاقة تعارف (إحماء) + بطاقة عرض Teil 2 + بطاقة مناقشة Teil 3.
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" onClick={starteRunde}>▶ ابدأ التحضير الموقوت</button>
            <button type="button" className="btn btn-ghost" onClick={() => setRundenNr((n) => n + 1)}>🎴 بطاقات أخرى</button>
          </div>
        </>
      )}

      {phase === "vorbereitung" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
            <strong>⏱️ التحضير — {runde.vorbereitungMin} دقيقة كما في صيغة امتحانك</strong>
            <span className="rtl-num" style={{ fontWeight: 900, fontSize: "1.2rem", color: prepRest < 60 ? "var(--color-cola)" : undefined }}>{mmss(prepRest)}</span>
          </div>
          <div style={{ display: "grid", gap: "0.5rem", margin: "0.6rem 0" }}>
            {schritte.map((s) => (
              <div key={s.teil} className="card" style={{ padding: "0.6rem 0.8rem" }}>
                <div style={{ fontWeight: 800 }}>Teil {s.teil} — <De>{s.titelDe}</De></div>
                <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{s.titelAr}{s.bewertet ? "" : " · إحماء غير مُقيَّم"}</div>
                <DeBlock>{s.auftragDe}</DeBlock>
                {s.stuetzen.length > 0 && (
                  <div style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>
                    عبارات مساندة: {s.stuetzen.map((x, i) => (<span key={i}> <De>{x}</De>{i < s.stuetzen.length - 1 ? " ·" : ""}</span>))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <textarea
            className="field" rows={3} dir="rtl" style={{ width: "100%", lineHeight: 1.8 }}
            placeholder="ملاحظاتك للتحضير (تبقى في هذه الشاشة فقط ولا تُحفظ)…"
            value={notizen} onChange={(e) => setNotizen(e.target.value)}
          />
          <button type="button" className="btn btn-primary" style={{ marginTop: "0.5rem" }} onClick={() => setPhase("sprechen")}>
            🎙️ جاهز — ابدأ التحدّث الآن
          </button>
        </>
      )}

      {phase === "sprechen" && aktuell && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
            <strong>Teil {aktuell.teil} من {schritte.length} — <De>{aktuell.titelDe}</De></strong>
            {recStatus === "aufnahme" && <span className="rtl-num" style={{ fontWeight: 900, color: "var(--color-cola)" }}>🔴 {mmss(restS)}</span>}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.4rem" }}>
            {aktuell.titelAr} · ميزانية التحدّث {mmss(aktuell.budgetS)}{aktuell.bewertet ? "" : " · إحماء غير مُقيَّم"}
          </div>
          <div className="card" style={{ padding: "0.6rem 0.8rem", marginBottom: "0.5rem" }}>
            <DeBlock>{aktuell.auftragDe}</DeBlock>
            {aktuell.auftragAr && <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>{aktuell.auftragAr}</div>}
            {aktuell.stuetzen.length > 0 && (
              <div style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>
                عبارات مساندة: {aktuell.stuetzen.map((x, i) => (<span key={i}> <De>{x}</De>{i < aktuell.stuetzen.length - 1 ? " ·" : ""}</span>))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            {recStatus !== "aufnahme" && (
              <button type="button" className="btn btn-primary" onClick={startAufnahme}>🔴 {recStatus === "hat-aufnahme" ? "أعد التسجيل" : "ابدأ التسجيل المحلي"}</button>
            )}
            {recStatus === "aufnahme" && (
              <button type="button" className="btn" onClick={stopAufnahme}>⏹️ أوقف — واستمع إلى نفسي</button>
            )}
            {recStatus === "bereit" && (
              <button type="button" className="btn btn-ghost" onClick={() => setRecStatus("ohne")}>تدرّب بصوت عالٍ دون تسجيل</button>
            )}
          </div>

          {recStatus === "kein-mikro" && (
            <div className="card" role="status" style={{ padding: "0.6rem 0.8rem", marginTop: "0.5rem", background: "var(--color-gold-soft)", fontSize: "0.88rem" }}>
              تعذّر التسجيل في هذا المتصفّح أو رُفض إذن الميكروفون — لا بأس: تحدّث بصوتٍ عالٍ كاملًا كما في القاعة، ثم قيّم نفسك بصدق.
            </div>
          )}
          {recStatus === "ohne" && (
            <div style={{ fontSize: "0.85rem", marginTop: "0.4rem" }}>وضع التدرّب دون تسجيل: حدّث نفسك بصوتٍ مسموع حتى نهاية الميزانية، ثم انتقل إلى التقييم.</div>
          )}

          {blobUrl && recStatus === "hat-aufnahme" && (
            <div className="card" style={{ padding: "0.6rem 0.8rem", marginTop: "0.5rem" }}>
              <strong style={{ display: "block", marginBottom: "0.3rem" }}>🎧 تسجيلك ({dauerS} ثانية) — استمع إليه كاملًا قبل أن تقيّم</strong>
              <audio controls preload="metadata" src={blobUrl} aria-label="تشغيل تسجيلك المحلي" style={{ width: "100%" }} />
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                <a className="btn btn-ghost" href={blobUrl} download={`sprechen-${aktuell.karteId}.${blobExt}`}>⬇️ نزّل التسجيل إلى جهازي</a>
                <button type="button" className="btn btn-ghost" onClick={() => { raeumeAuf(); setRecStatus("bereit"); }}>🗑️ احذف التسجيل</button>
              </div>
              <small>ملفٌّ مؤقّت في ذاكرة الجلسة؛ يزول عند حذفِه أو مغادرة الصفحة، ولا يوجد منه نسخة في تقدّمك.</small>
            </div>
          )}

          {aktuell.bewertet ? (
            <div style={{ marginTop: "0.7rem" }}>
              <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>شبكة تقييمك الذاتي (بعد السماع)</div>
              {SPRECH_KRITERIEN.map((k, ki) => (
                <div key={k.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.88rem" }}>{k.ar} <span style={{ color: "var(--color-ink2)" }}>({k.de})</span></span>
                  <span style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                    {RUBRIK_LABELS.map((l, s) => (
                      <button key={l} type="button" className="chip" style={{ cursor: "pointer", minHeight: 36, background: stufen[ki] === s ? "var(--color-cola)" : "var(--ui-surface-raised)", color: stufen[ki] === s ? "var(--ui-on-accent)" : undefined }} onClick={() => setStufen((st) => st.map((x, j) => (j === ki ? s : x)))}>
                        {l}
                      </button>
                    ))}
                  </span>
                </div>
              ))}
              <label style={{ display: "flex", gap: "0.5rem", cursor: "pointer", margin: "0.5rem 0", fontSize: "0.9rem" }}>
                <input type="checkbox" checked={gehoert} onChange={(e) => setGehoert(e.target.checked)} />
                <span>{recStatus === "hat-aufnahme" ? "استمعت إلى تسجيلي كاملًا بلا مقاطعة قبل هذا التقييم" : "تحدّثت بصوتٍ عالٍ فعلًا طوال الميزانية، وأقيّم نفسي بصدق دون تسجيل"}</span>
              </label>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                <button type="button" className="btn btn-primary" disabled={!alleStufen || !gehoert} onClick={speichernUndWeiter}>
                  💾 احفظ تقييمي{schritt + 1 >= schritte.length ? " وأنهِ الجولة" : " والجزء التالي ←"}
                </button>
                {punkteVorschau !== null && <span>تقييمك الذاتي لهذا الجزء: <b className="rtl-num">{punkteVorschau}</b>/100 (حكمك أنت لا حكم آلة)</span>}
                <button type="button" className="btn btn-ghost" onClick={weiter}>تخطّي هذا الجزء دون حفظ</button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "0.6rem" }}>
              <button type="button" className="btn btn-primary" onClick={weiter}>أنهيت الإحماء — إلى Teil 2 ←</button>
            </div>
          )}
        </>
      )}

      {phase === "fertig" && (
        <div className="fadein">
          <div style={{ fontWeight: 800, marginBottom: "0.4rem" }}>✅ أتممت جولة {level}</div>
          {rundeEintraege.length ? (
            <ul style={{ margin: "0 0 0.5rem", paddingInlineStart: "1.2rem", lineHeight: 1.9 }}>
              {rundeEintraege.map((e, i) => (
                <li key={i}>Teil {e.teil}: تقييمك الذاتي <b className="rtl-num">{e.punkte}</b>/100 · {e.dauerS > 0 ? <>سجّلت <span className="rtl-num">{e.dauerS}</span> ثانية</> : "دون تسجيل (صوت عالٍ فقط)"}</li>
              ))}
            </ul>
          ) : (
            <div style={{ marginBottom: "0.5rem" }}>تخطّيت الأجزاء المُقيَّمة دون حفظ — الجولة القادمة امنح نفسك سماعًا كاملًا وتقييمًا صادقًا.</div>
          )}
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.5rem" }}>
            تذكيرٌ صادق: هذه نقاطك أنت عن نفسك بعد سماعك — ليست درجة امتحان ولا قياسًا آليًّا لنطقك.
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" onClick={() => { setRundenNr((n) => n + 1); setPhase("wahl"); }}>🎴 جولة جديدة</button>
            <button type="button" className="btn btn-ghost" onClick={() => setPhase("wahl")}>↩︎ غيّر المستوى</button>
          </div>
        </div>
      )}

      {historie.length > 0 && (
        <div style={{ marginTop: "0.8rem" }}>
          <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>سجلّ جولاتك المسجّلة (بيانات وصفية فقط — لا صوت محفوظًا)</div>
          {historie.map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.2rem 0", flexWrap: "wrap", gap: "0.4rem" }}>
              <span>{e.level} · Teil {e.teil} — <De>{kartenTitel(e.karteId)}</De></span>
              <span className="rtl-num">ذاتي {e.punkte}/100 · {e.dauerS}ث · {e.datum.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
