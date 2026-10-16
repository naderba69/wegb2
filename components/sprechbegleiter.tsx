"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadProgress } from "@/lib/store";
import { llmBereit, type LlmCfg } from "@/lib/grader";
import { SPRECH_SZENARIEN, begleiterAntworten, type BegleiterZeile, type SprechSzenario } from "@/lib/sprechbegleiter";
import { speakAny, listenDe, cloudSpracheFrei } from "@/lib/speech";
import { CLOUD_SPEECH_DISCLOSURE } from "@/components/trainer";
import { De } from "@/components/De";

/**
 * 🤖 رفيق المحادثة (R198): تدريب Sprechen حر مع شريك ذكاء اصطناعي بدورٍ مهني.
 * BYOK + موافقة فقط (بوابة llmBereit ذاتها)، لا حفظ للمحادثة (تبقى في الذاكرة)،
 * لا حكم نطق — ملاحظات لغوية على النص فقط وموسومة بمصدرها الآلي.
 * الميكروفون لا يعمل إلا عبر بوابة الموافقة السحابية القائمة (cloudSpracheFrei).
 */
export function SprechBegleiter() {
  const [cfg, setCfg] = useState<LlmCfg | null>(null);
  const [szenario, setSzenario] = useState<SprechSzenario | null>(null);
  const [verlauf, setVerlauf] = useState<BegleiterZeile[]>([]);
  const [eingabe, setEingabe] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [micAn, setMicAn] = useState(false);
  const stopMic = useRef<() => void>(() => {});
  const bereit = llmBereit(cfg);

  useEffect(() => {
    setCfg(loadProgress().settings.llm ?? null);
    return () => stopMic.current();
  }, []);

  const starten = (s: SprechSzenario) => {
    setSzenario(s);
    setVerlauf([{ wer: "ki", text: s.startDe }]);
    setFehler(null);
    setEingabe("");
    try {
      const n = Number(localStorage.getItem("weg-begleiter-sitzungen") ?? "0") || 0;
      localStorage.setItem("weg-begleiter-sitzungen", String(n + 1));
    } catch { /* عدّاد جلسات محلي فقط */ }
  };

  const senden = async () => {
    const text = eingabe.trim();
    if (!text || !szenario || !cfg || laedt) return;
    const neu: BegleiterZeile[] = [...verlauf, { wer: "ich", text }];
    setVerlauf(neu);
    setEingabe("");
    setLaedt(true);
    setFehler(null);
    const antwort = await begleiterAntworten(cfg, szenario, neu);
    setLaedt(false);
    if (!antwort) {
      setFehler("تعذّر الوصول إلى المزوّد — تحقّق من المفتاح والنموذج والاتصال في الإعدادات، ثم حاول ثانية.");
      return;
    }
    setVerlauf([...neu, { wer: "ki", text: antwort.text, tipp: antwort.tipp }]);
  };

  const micToggle = () => {
    if (micAn) {
      stopMic.current();
      setMicAn(false);
      return;
    }
    setMicAn(true);
    // التعرّف الصوتي لا يبدأ إلا بعد بوابة الموافقة الصريحة القائمة (K122e)
    stopMic.current = listenDe(
      (txt) => { if (txt) setEingabe((e) => (e ? `${e} ${txt}` : txt)); setMicAn(false); },
      () => setMicAn(false)
    );
  };

  return (
    <div data-testid="sprechbegleiter" style={{ display: "grid", gap: "0.9rem" }}>
      <p style={{ fontSize: "0.86rem", color: "var(--color-ink2)", margin: 0 }}>
        🤖 شريك محادثة ذكي يلعب دورًا مهنيًا (طبيب، مريضة قلقة، زميل، أهل…) لتتدرّب على الكلام بحرّية.
        يردّ بالألمانية ويضيف ملاحظة لغوية عربية قصيرة على جملتك. <strong>لا حكم على النطق</strong> — هو يقرأ نصًّا لا يسمع صوتك الحقيقي.
      </p>

      {!bereit ? (
        <div className="card" style={{ padding: "0.9rem 1rem" }} data-testid="begleiter-nicht-bereit">
          <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🔑 الرفيق يعمل بمفتاحك أنت (BYOK)</div>
          <p style={{ fontSize: "0.87rem", margin: "0 0 0.6rem" }}>
            لا خدمة خارجية افتراضيًا في هذا التطبيق. فعّل «المدرّس الذكي» من الإعدادات: اختر مزوّدًا
            (OpenRouter أو Gemini — لهما طبقة مجانية)، ضع مفتاحك، وسجّل موافقتك الصريحة على إرسال نصوصك إليه.
            عندها تُفتح هذه المحطة بنفس المفتاح والموافقة.
          </p>
          <Link className="btn btn-primary" href="/einstellungen" style={{ minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
            ⚙️ افتح الإعدادات لتفعيل المفتاح
          </Link>
          <div style={{ display: "grid", gap: "0.35rem", marginTop: "0.8rem" }}>
            {SPRECH_SZENARIEN.map((s) => (
              <div key={s.id} style={{ fontSize: "0.85rem" }}>
                <strong>{s.titelAr}</strong> — {s.beschreibungAr}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }} role="group" aria-label="اختر سيناريو المحادثة">
            {SPRECH_SZENARIEN.map((s) => (
              <button key={s.id} type="button" className="chip" data-testid={`begleiter-szenario-${s.id}`}
                onClick={() => starten(s)}
                style={{ cursor: "pointer", minHeight: "42px", fontWeight: 700, background: szenario?.id === s.id ? "var(--color-cola)" : undefined, color: szenario?.id === s.id ? "var(--ui-on-accent)" : undefined }}>
                {s.titelAr}
              </button>
            ))}
          </div>

          {!szenario ? (
            <p className="tiny muted" role="status">اختر سيناريو لبدء المحادثة — الأولوية هنا لمواقف التمريض التي طلبتها، وآخرها محاكاة امتحان.</p>
          ) : (
            <div className="card" style={{ padding: "0.8rem 1rem" }}>
              <div style={{ fontWeight: 800, marginBottom: "0.5rem" }}>{szenario.titelAr} · مستوى {szenario.niveau}</div>
              <div style={{ display: "grid", gap: "0.55rem" }} aria-live="polite">
                {verlauf.map((z, i) => (
                  <div key={i} data-testid={z.wer === "ki" ? "begleiter-ki" : "begleiter-ich"}
                    style={{ justifySelf: z.wer === "ki" ? "start" : "end", maxWidth: "92%", background: z.wer === "ki" ? "var(--color-paper2)" : "var(--color-gold-soft)", borderRadius: "0.7rem", padding: "0.55rem 0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "start" }}>
                      <De style={{ lineHeight: 1.8 }}>{z.text}</De>
                      {z.wer === "ki" && (
                        <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px", flexShrink: 0 }} onClick={() => speakAny(z.text)} aria-label="استمع إلى ردّ الشريك">🔊</button>
                      )}
                    </div>
                    {z.tipp && (
                      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.3rem" }}>
                        💡 ملاحظة لغوية من نموذج ذكاء اصطناعي (ليست تقييمًا رسميًا): {z.tipp}
                      </div>
                    )}
                  </div>
                ))}
                {laedt && <div className="tiny muted" role="status">…الشريك يكتب</div>}
              </div>

              {fehler && <p style={{ color: "var(--color-cola)", fontSize: "0.85rem" }} role="alert">⚠️ {fehler}</p>}

              <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.7rem", flexWrap: "wrap" }}>
                <input className="field" value={eingabe} onChange={(e) => setEingabe(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void senden(); }}
                  placeholder="اكتب ردّك بالألمانية…" aria-label="ردّك بالألمانية" data-testid="begleiter-eingabe"
                  style={{ flex: "1 1 220px", minHeight: "48px" }} />
                {cloudSpracheFrei() && (
                  <button type="button" className="btn btn-ghost" style={{ minHeight: "48px" }} onClick={micToggle} data-testid="begleiter-mic">
                    {micAn ? "⏹ أوقف الإملاء" : "🎤 تكلّم"}
                  </button>
                )}
                <button type="button" className="btn btn-primary" style={{ minHeight: "48px" }} onClick={() => void senden()} disabled={laedt || !eingabe.trim()} data-testid="begleiter-senden">
                  أرسل ⬅
                </button>
              </div>
              {cloudSpracheFrei() ? (
                <span data-testid="cloud-speech-disclosure" style={{ fontSize: "0.76rem", color: "var(--color-cola)", display: "block", marginTop: "0.35rem" }}>{CLOUD_SPEECH_DISCLOSURE}</span>
              ) : (
                <span style={{ fontSize: "0.76rem", color: "var(--color-ink2)", display: "block", marginTop: "0.35rem" }}>
                  🎤 الإملاء الصوتي مقفل: فعّل «الإذن بإرسال الصوت» من الإعدادات إن أردته — الكتابة تعمل دائمًا.
                </span>
              )}
              <p style={{ fontSize: "0.76rem", color: "var(--color-ink2)", margin: "0.5rem 0 0" }}>
                🔒 تُرسل رسائلك النصية إلى المزوّد الذي اخترته ومفتاحك المسجّل في الإعدادات بموافقتك؛
                المحادثة لا تُحفظ في التطبيق ولا تدخل في أيّ نتيجة. ردّ الشريك صوتُه نطق متصفّح.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
