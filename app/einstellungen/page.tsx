"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useProgress, loadProgress } from "@/lib/store";
import { LANG_LABEL, effectiveLang } from "@/lib/i18n";
import { noteFromPct } from "@/lib/grader";
import { Fehlerkartei, Lernstrategien } from "@/components/fehler-ui";
import { AbzeichenKarte, ElternBriefView, XpBar } from "@/components/wochen";
import { ProfilVerwaltung } from "@/components/profil";
import { speakDe, germanVoices, warmVoices, speechAvailable , recognitionAvailable } from "@/lib/speech";
import type { UiLang, Tempo } from "@/lib/types";
import { TEMPO_LABEL } from "@/lib/types";

export default function Einstellungen() {
  const { progress, update, importProgress, reset } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lang = effectiveLang(progress);

  useEffect(() => {
    warmVoices((vs) => setVoices(vs));
  }, []);

  const exportJson = () => {
    const data = JSON.stringify(loadProgress(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weg-b2-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("تم تصدير ملف التقدّم — احفظه في مكان آمن.");
  };

  const onImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importProgress(String(reader.result));
        setMsg("تم استيراد التقدّم بنجاح ✓");
      } catch {
        setMsg("ملف غير صالح — تأكد أنه ملف JSON مُصدَّر من التطبيق.");
      }
    };
    reader.readAsText(file);
  };

  const langOption = (v: "auto" | UiLang, label: string) => (
    <button
      key={v}
      className="btn btn-ghost"
      style={{
        background: progress.settings.uiLang === v ? "var(--color-gold-soft)" : "white",
        borderColor: progress.settings.uiLang === v ? "var(--color-gold)" : undefined,
      }}
      onClick={() => update((p) => ({ ...p, settings: { ...p.settings, uiLang: v } }))}
    >
      {label}
    </button>
  );

  return (
    <div className="fadein" style={{ display: "grid", gap: "1.2rem", maxWidth: "46rem", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.4rem" }}>⚙️ الإعدادات</h1>
        <Link href="/" className="btn btn-ghost">← اليوم</Link>
      </div>

      <ProfilVerwaltung />

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>📅 موعد الامتحان الخارجي</h2>
        <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>
          حدّد موعد امتحانك (Goethe / telc …) ليظهر العدّاد في الصفحة الرئيسية — وتناسب «المحاكاة» ورشّة عملك قرب الموعد.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            className="field"
            type="date"
            value={progress.settings.examDate ?? ""}
            onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, examDate: e.target.value || undefined } }))}
          />
          <input
            className="field"
            style={{ flex: 1, minWidth: "10rem" }}
            placeholder="الاسم — مثلاً: Goethe-Zertifikat B2"
            value={progress.settings.examName ?? ""}
            onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, examName: e.target.value || undefined } }))}
          />
        </div>
        {progress.settings.examDate && (
          <div style={{ marginTop: "0.6rem", fontWeight: 700, color: "var(--color-b2)" }}>
            📅{" "}
            {(() => {
              const days = Math.ceil((new Date(`${progress.settings.examDate}T00:00:00`).getTime() - Date.now()) / 86400000);
              if (days > 1) return `بقي ${days} يوماً — استعمل Probeklausur أسبوعياً واقرب للموعد كل 3 أيام.`;
              if (days >= 0) return "الامتحان الآن! راجع دفتر أخطائك ونم مبكراً.";
              return "انقضى الموعد — حدّد موعداً جديداً للامتحان التالي.";
            })()}
          </div>
        )}
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>⏱️ وتيرة التعلّم اليومية</h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
          اختر الوتيرة التي تناسب يومك. يضبط المحرّك تلقائياً طولَ الدرس وعدد البطاقات الجديدة وحدَّ المراجعة:
          خفيف <strong>15</strong> دقيقة (3 بطاقات جديدة)، منتظم <strong>30</strong> دقيقة (5 بطاقات)، مكثّف <strong>60</strong> دقيقة (10 بطاقات).
          لا توجد عقاب على تخفيف الوتيرة — وزر «يوم سيّئ» يجمّد السلسلة بلا ديون.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
          {(["leicht", "regelmaessig", "intensiv"] as Tempo[]).map((v) => (
            <button
              key={v}
              className="btn"
              onClick={() => update((p) => ({ ...p, settings: { ...p.settings, tempo: v } }))}
              style={{
                padding: "0.85rem 0.6rem",
                textAlign: "center",
                background: progress.settings.tempo === v ? "var(--color-gold-soft)" : "white",
                border: `2px solid ${progress.settings.tempo === v ? "var(--color-gold)" : "var(--color-line)"}`,
                borderRadius: "0.75rem",
                cursor: "pointer",
                boxShadow: progress.settings.tempo === v ? "0 4px 14px rgba(212,160,23,0.25)" : "none",
              }}
            >
              <div style={{ fontSize: "1.6rem" }}>{v === "leicht" ? "🌤️" : v === "regelmaessig" ? "⛅" : "🔥"}</div>
              <div style={{ fontWeight: 800 }}>{TEMPO_LABEL[v].ar}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>{TEMPO_LABEL[v].de}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🔊 النطق والتسميع (داخل المتصفح)</h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginBottom: "0.7rem" }}>
          {speechAvailable()
            ? "**التسميع** يعمل بصوت ألماني من متصفحك — صفر اتصال خارجي. اختر الصوت وسرعة النطق. أمّا **الاستماع إلى نطقك** فله إذنٌ مستقلٌّ أدناه:"
            : "متصفحك لا يدعم Web Speech — التمارين تبقى نصية بالكامل."}
        </p>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          <select
            className="field"
            value={progress.settings.voiceName ?? ""}
            onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, voiceName: e.target.value || undefined } }))}
          >
            <option value="">الصوت الألماني الافتراضي</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <span style={{ minWidth: "6rem" }}>سرعة النطق:</span>
            <input
              type="range"
              min={0.65}
              max={1.0}
              step={0.05}
              value={Math.max(0.65, Math.min(1.0, progress.settings.rate))}
              onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, rate: Math.max(0.65, Math.min(1.0, Number(e.target.value))) } }))}
              style={{ flex: 1 }}
            />
            <span className="rtl-num">{Math.max(0.65, Math.min(1.0, progress.settings.rate)).toFixed(2)}×</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-ink2)" }}>
            النطاق من <strong>0.65×</strong> (بطيء واضح للمبتدئين) إلى <strong>1.0×</strong> (سرعة طبيعية). لا سرعة أسرع من الطبيعي في الخطة الأساسية.
          </p>
          <button className="btn btn-primary" onClick={() => speakDe("Hallo! Ich bin dein Lehrer. Heute lernen wir gemeinsam.", { voiceName: progress.settings.voiceName, rate: progress.settings.rate })}>
            ▶️ تجربة النطق
          </button>
        </div>
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🎙️ إذن التعرُّف السحابي على الكلام</h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginBottom: "0.7rem" }}>
          مدرِّبُ النطق ومحاكاةُ الامتحان يستطيعان أن يسمعا ما تنطقُ ويقيساه كلمةً كلمة — لكنَّ
          <code> Web Speech API</code> في Chrome/Edge <strong>يُرسِلُ صوتَك إلى خدمةِ المتصفِّحِ الخارجية</strong> ليعيدَه نصًّا.
          هذا هو الاتصالُ الخارجيُّ الوحيدُ في المشروعِ كلِّه، وهو <strong>بإذنِك وحدَك</strong> ومغلقٌ ما لم تفتحه.
          الخدمة <strong>مجّانية 100٪</strong> (لا مفاتيح API، لا اشتراك، لا حساب، ولا بيانات تُجمَّع من طرف التطبيق) ولا يُرسَل أيُّ صوتٍ ما دام المفتاحُ مغلقاً.
        </p>
        <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", cursor: "pointer", minHeight: "44px" }}>
          <input
            type="checkbox"
            style={{ marginTop: "0.25rem", width: "20px", height: "20px" }}
            checked={progress.settings.cloudSpeech === true}
            disabled={!recognitionAvailable()}
            onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, cloudSpeech: e.target.checked } }))}
          />
          <span>
            <strong>أُذِنُ بإرسال صوتي إلى خدمة التعرُّف الخارجية</strong>
            <span style={{ display: "block", fontSize: "0.82rem", color: "var(--color-ink2)" }}>
              {recognitionAvailable()
                ? "متوفِّرٌ في متصفِّحِك. إن أبقيتَه مغلقاً فُتِحَ لك المسارُ المحلِّيُّ البديل."
                : "غيرُ متوفِّرٍ في متصفِّحِك أصلاً — المفتاحُ معطَّلٌ ولا أثرَ له."}
            </span>
          </span>
        </label>
        <div style={{ marginTop: "0.7rem", padding: "0.6rem 0.75rem", background: "var(--color-paper2)", borderInlineStart: "3px solid var(--color-gold)", borderRadius: "6px", fontSize: "0.85rem" }}>
          <strong>البديلُ المحلِّيُّ بلا إرسال:</strong> «مدرِّبُ النطق» يقيسُ مقاطعَك ووقفاتِك وسرعتَك ونسبةَ كلامِك إلى صمتِك
          مقابلَ النموذج — كلُّ ذلك من مغلِّفِ الطاقة داخلَ جهازِك، ولا يخرجُ منه شيء.
          وهو متاحٌ لك سواءٌ أَذِنتَ أم لا.
        </div>
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🌐 لغة الواجهة (تدرّج تلقائي)</h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginBottom: "0.7rem" }}>
          «تلقائي» يحوّل الواجهة من العربية إلى المختلطة (B1) ثم الألمانية الكاملة (B2) مع تقدّمك في الخطة. الحالى:{" "}
          <strong>{LANG_LABEL[lang]}</strong>
        </p>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {langOption("auto", "🤖 تلقائي")}
          {langOption("ar", LANG_LABEL.ar)}
          {langOption("mix", LANG_LABEL.mix)}
          {langOption("de", LANG_LABEL.de)}
        </div>
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>💾 التقدّم والنسخ الاحتياطي</h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginBottom: "0.7rem" }}>
          كل شيء في متصفحك — بدون خوادم ولا حسابات. صدّر نسخة قبل تنظيف المتصفح أو تغيير الجهاز.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={exportJson}>⬇️ تصدير (JSON)</button>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>⬆️ استيراد</button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          <button
            className="btn btn-ghost"
            style={{ color: "var(--color-cola)", borderColor: "var(--color-cola)" }}
            onClick={() => {
              if (confirm("هل تريد فعلاً حذف كل التقدّم والعودة إلى اليوم 1؟ لا يمكن التراجع.")) {
                reset();
                setMsg("تم التصفير.");
              }
            }}
          >
            🗑️ تصفير كامل
          </button>
        </div>
        {msg && <p style={{ marginTop: "0.7rem", color: "var(--color-a1)", fontWeight: 700 }}>{msg}</p>}
      </section>

      <section className="card" style={{ padding: "1.3rem", background: "var(--color-paper2)" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>📐 الميثاق المنهجي للخطة</h2>
        <ul style={{ lineHeight: 1.9, fontSize: "0.92rem", paddingInlineStart: "1.2rem" }}>
          <li><strong>270 يوماً بتوزيعٍ أكاديمي</strong> (أوزان ساعات CEFR لا التساوي): A1 (1–42) ← A2 (43–91) ← B1 (92–168) ← B2 (169–266) ← ختام (267–270)؛ والحمل اليومي يتصاعد ×1.0 ← ×1.1 ← ×1.25 ← ×1.35.</li>
          <li><strong>الإيقاع الأسبوعي</strong>: 5 أيام تعلّم · يوم تثبيت (كتابة/تحدّث/أخطاء) · يوم فحص أسبوعي.</li>
          <li><strong>بنية الحصة الثابتة</strong>: استرجاع ← قواعد ← مفردات ← مهارة (تسميع/قراءة/كتابة/تحدّث) ← فحص.</li>
          <li><strong>قفل تسلسلي</strong>: لا غد قبل إغلاق اليوم.</li>
          <li><strong>التعويض الإلزامي</strong>: ما لم يُتقَن (≥80%) يُرحَّل إلى أول الغد — يتولّاه المحرّك آلياً.</li>
          <li><strong>حتمية كاملة</strong>: «اليوم 47» يظهر بنفس المهام دائماً — لا عشوائية ولا توهان.</li>
          <li><strong>التكرار المتباعد</strong>: بطاقات مجدولة بخوارزمية SM-2 داخل الحصص اليومية.</li>
          <li><strong>التأسيس العلمي</strong>: CEFR/GERR · استرجاع استباقي · تكرار متباعد · تكامل المهارات الأربع · سُلّم تدريجي من السند إلى الغمر.</li>
        </ul>
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🧠 محرك التصحيح</h2>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
          deterministic (مطابقة، تطبيع، ترتيب، كلمات مفتاحية، تسميع ≥85%) عبر <code>lib/grader.ts</code> بواجهة{" "}
          <code>Grader</code> جاهزة لاستبدالها بـ <code>LLMGrader</code> لاحقاً دون تغيير أي شاشة. صفر خدمات خارجية اليوم.
          يرافقه «مراجعة المدرّس العميقة»: مقارنة كلمة-بكلمة مع تصنيف الخطأ (أداة/إملاء/همزة/فعل/ترتيب…) وشرح عربي.
        </p>
      </section>

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🤖 مدرّس الذكاء الاصطناعي (اختياري)</h2>
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem", marginBottom: "0.7rem" }}>
          أضف خدمة متوافقة مع OpenAI لتحصل على تصحيح تحريري لمقالاتك وملاحظات مفصّلة. يعمل التطبيق كاملاً بدونها،
          والمفتاح يبقى في متصفحك فقط (لا خوادم لنا).
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <input
            className="field"
            dir="ltr"
            placeholder="Base URL — مثال: https://api.openai.com/v1"
            value={progress.settings.llm?.baseUrl ?? ""}
            onChange={(e) =>
              update((p) => ({
                ...p,
                settings: {
                  ...p.settings,
                  llm: {
                    baseUrl: e.target.value,
                    apiKey: p.settings.llm?.apiKey ?? "",
                    model: p.settings.llm?.model ?? "",
                  },
                },
              }))
            }
          />
          <input
            className="field"
            dir="ltr"
            type="password"
            placeholder="API Key (يبقى محلياً في متصفحك)"
            value={progress.settings.llm?.apiKey ?? ""}
            onChange={(e) =>
              update((p) => ({
                ...p,
                settings: {
                  ...p.settings,
                  llm: {
                    baseUrl: p.settings.llm?.baseUrl ?? "",
                    apiKey: e.target.value,
                    model: p.settings.llm?.model ?? "",
                  },
                },
              }))
            }
          />
          <input
            className="field"
            dir="ltr"
            placeholder="Model — مثال: gpt-4o-mini"
            value={progress.settings.llm?.model ?? ""}
            onChange={(e) =>
              update((p) => ({
                ...p,
                settings: {
                  ...p.settings,
                  llm: {
                    baseUrl: p.settings.llm?.baseUrl ?? "",
                    apiKey: p.settings.llm?.apiKey ?? "",
                    model: e.target.value,
                  },
                },
              }))
            }
          />
          <button
            className="btn btn-primary"
            onClick={async () => {
              const cfg = progress.settings.llm;
              if (!cfg?.apiKey) return setMsg("أدخل مفتاح API أولاً.");
              setMsg("جارٍ الاختبار…");
              const { llmKorrigieren } = await import("@/lib/grader");
              const res = await llmKorrigieren(cfg, "Schreibe 2 Sätze über dich.", "Ich habe müde und ich bin arbeiten.");
              setMsg(res ? "✅ الاتصال يعمل — المدرّس الذكي جاهز في مستشار الكتابة." : "❌ لم ينجح الاتصال — راجع القيم.");
            }}
          >
            ▶️ اختبر الاتصال
          </button>
        </div>
      </section>

      <Lernstrategien />
      <Fehlerkartei />

      <section className="card" style={{ padding: "1.3rem" }}>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>⭐ مستوى التحفيز</h2>
        <XpBar progress={progress} />
      </section>
      <AbzeichenKarte progress={progress} />
      <ElternBriefView progress={progress} />

      <Zeugnis />
    </div>
  );
}

/** الشهادة/كشوف الدرجات — تقدير ألماني 1–6 لكل مهارة من نتائجك */
function Zeugnis() {
  const { progress } = useProgress();
  const names: Record<string, string> = {
    wiederholen: "الاسترجاع والمراجعة",
    grammatik: "القواعد",
    wortschatz: "المفردات",
    hoeren: "الاستماع",
    lesen: "القراءة",
    schreiben: "الكتابة",
    sprechen: "التحدّث",
    check: "الفحوصات",
  };
  const rows = Object.entries(
    Object.values(progress.plan.tasks).reduce<Record<string, { s: number; t: number }>>((acc, r) => {
      const k = r.kind ?? "check";
      const cur = acc[k] ?? { s: 0, t: 0 };
      acc[k] = { s: cur.s + r.score, t: cur.t + r.total };
      return acc;
    }, {})
  )
    .map(([k, v]) => ({ k, pct: v.t ? Math.round((v.s / v.t) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);
  const exams = Object.entries(progress.exams ?? {});
  const note = (p: number) => noteFromPct(p).split(" — ")[0];

  return (
    <section className="card" style={{ padding: "1.3rem", background: "var(--color-paper2)" }}>
      <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>🎓 Zeugnis — كشوف الدرجات</h2>
      {rows.length === 0 ? (
        <p style={{ color: "var(--color-ink2)", fontSize: "0.9rem" }}>لا نتائج بعد — ابدأ يومك الأول وتُملأ الجداول تلقائياً.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem", direction: "rtl" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid var(--color-line)", padding: "0.4rem", textAlign: "start" }}>المهارة</th>
              <th style={{ borderBottom: "2px solid var(--color-line)", padding: "0.4rem" }}>%</th>
              <th style={{ borderBottom: "2px solid var(--color-line)", padding: "0.4rem" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k}>
                <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.4rem" }}>{names[r.k] ?? r.k}</td>
                <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.4rem", textAlign: "center" }} className="rtl-num">
                  {r.pct}
                </td>
                <td style={{ borderBottom: "1px solid var(--color-line)", padding: "0.4rem", textAlign: "center", fontWeight: 800 }}>
                  {note(r.pct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {exams.length > 0 && (
        <div style={{ marginTop: "0.7rem", fontSize: "0.92rem" }}>
          <strong>امتحانات المراحل:</strong>{" "}
          {exams.map(([d, e]) => (
            <span key={d} className="chip" style={{ margin: "0.15rem" }}>
              اليوم <span className="rtl-num">{d}</span>: <span className="rtl-num">{e.score}%</span> {e.passed ? "✅" : "🔁"}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
