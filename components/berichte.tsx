"use client";
// 📊 مركز التقارير — BerichteZentrum (Modul T) في جناح التقوية
// ثلاثة تقارير في محرّك واحد (لا أدوات شاردة):
//   🔎 تغطية الدليل مع فصل measured / self_report / activity
//   🕳️ فجوات التدريب + توصيات لا تتحول إلى حكم مستوى
//   📄 تقرير شهري مطبوع (PDF عبر الطباعة) + تصدير CSV للأرقام
import { lokalesDatum } from "@/lib/datum";
import { useState } from "react";
import type { Kompetenz, Progress } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import { kompetenzWerte, evidenzUebersicht, KOMPETENZEN, KOMPETENZ_AR } from "@/lib/kompetenz";
import { fehlerFamilien, resistenteFehler, schwere, URSACHEN, ursacheVon } from "@/lib/fehler";
import { planPct } from "@/lib/plan";
import { feedbackQuote, fehlerHeilung, pruefungsKurve, todayUxSummary } from "@/lib/metriken";
import { prognose } from "@/lib/prognose";
import { sprechHeute } from "@/lib/sprechziel";
import { FLUENZ_ZIEL } from "@/lib/fluenz";
import { skillBilanz } from "@/lib/skillbilanz";
import { wochenBericht } from "@/lib/wochenbericht";
import { KalibrierungPanel, type ProgressUpdater } from "./kalibrierung";
import { VerzweigungPanel } from "./verzweigung";
import { wartungsBericht } from "@/lib/wartung";
import { wochenBilanz } from "@/lib/motivation";
import { StundenVertrag } from "./stundenvertrag";

const HAND: Record<string, string> = { Lesen: "📖", Hoeren: "👂", Schreiben: "✍️", Sprechen: "🗣️", Grammatik: "🧩", Wortschatz: "🗂️" };

type TrainingsFokus = { hand: Kompetenz; basis: "measured" | "activity" | "none" };

function trainingsFokus(p: Progress): TrainingsFokus {
  const werte = kompetenzWerte(p);
  const measured = KOMPETENZEN
    .filter((hand) => werte[hand].wert !== null)
    .sort((a, b) => (werte[a].wert ?? 0) - (werte[b].wert ?? 0) || a.localeCompare(b));
  if (measured[0]) return { hand: measured[0], basis: "measured" };
  const activity = [...KOMPETENZEN]
    .filter((hand) => werte[hand].versuche > 0)
    .sort((a, b) => werte[a].versuche - werte[b].versuche || a.localeCompare(b));
  return activity[0] ? { hand: activity[0], basis: "activity" } : { hand: "Lesen", basis: "none" };
}

/** توصيات تدريب؛ الاختيار من أداء مقاس أو من حجم النشاط، مع إعلان الأساس. */
export function empfehlungen(p: Progress): { dringend: string; text: string }[] {
  const out: { dringend: string; text: string }[] = [];
  const fokus = trainingsFokus(p);
  const map: Record<Kompetenz, string> = {
    Lesen: "📖 القراءة: نصّان مع أسئلة فهم وتصحيح معلن.",
    Hoeren: "👂 الاستماع: حوار بالتسميع ثم إملاء مصحح.",
    Schreiben: "✍️ الكتابة: مهمة قصيرة مع rubric وأثر تصحيح منفصل عن التقييم الذاتي.",
    Sprechen: "🗣️ المحادثة: عينة صوت أو مقيّم بشري؛ زر الإكمال وحده لا يقيس الأداء.",
    Grammatik: "🧩 القواعد: استرجاع قصير مصحح قبل إعادة الشرح.",
    Wortschatz: "🗂️ المفردات: بطاقات مستحقة ثم اختبار استرجاع مصحح.",
  };
  const basis = fokus.basis === "measured"
    ? "أدنى أداء تدريبي مقاس في العينة الحالية"
    : fokus.basis === "activity"
      ? "أقل مجال حضوراً في سجل النشاط؛ ليس حكماً بأنه الأضعف"
      : "اقتراح بداية لعدم وجود دليل بعد";
  out.push({ dringend: "تركيز مقترح", text: `${map[fokus.hand]} (${basis})` });
  const resis = resistenteFehler(p);
  if (resis.length) out.push({ dringend: "علاج مقاوم", text: `🛡️ ${resis.length} خطأً يقاوم المراجعة — نفّذ بروتوكول الثلاث خطوات في معمل الأخطاء هذا الأسبوع.` });
  const fams = fehlerFamilien(p);
  if (fams.length) out.push({ dringend: "عائلات", text: `👨‍👩‍👧 عائلة «${fams[0].titel}» أثقل عائلاتك (${fams[0].gl.length} فرداً) — درّبها ببطاقات العائلة حتى تصير صفراً.` });
  const schwere1 = Object.values(p.fehler ?? {})[0];
  if (fams.length && schwere1) {
    const u = URSACHEN.find((x) => x.id === ursacheVon([...Object.values(p.fehler ?? {})].sort((a, b) => schwere(b) - schwere(a))[0]));
    if (u && out.length < 3) out.push({ dringend: "سبب جذري", text: `🧭 السبب المسيطر: ${u.titel} — ${u.plan[0]}` });
  }
  return out.slice(0, 3);
}

/** تقرير HTML مطبوع — يُفتح في نافذة ويُطبع كـ PDF */
function berichtHtml(p: Progress, name: string): string {
  const w = kompetenzWerte(p);
  const evidence = evidenzUebersicht(p);
  const fehler = Object.values(p.fehler ?? {});
  const resis = resistenteFehler(p);
  const tage = Object.values(p.plan.days ?? {});
  const heute = lokalesDatum();
  const rows = KOMPETENZEN.map((h) => `<tr><td>${HAND[h]} ${KOMPETENZ_AR[h]} <small>(${h})</small></td><td class="n">${w[h].wert === null ? "—" : w[h].wert + "٪"}</td><td class="n">${w[h].measured} مقاس · ${w[h].selfReported} ذاتي · ${w[h].activity} نشاط</td></tr>`).join("");
  const gaps = empfehlungen(p).map((e) => `<li><b>${e.dringend}:</b> ${e.text}</li>`).join("");
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>تقرير تدريب شهري — ${name}</title>
<style>
body{font-family:system-ui,sans-serif;color:#2c2a25;background:#fff;margin:2rem;max-width:46rem}
h1{color:#355E3B;font-size:1.4rem;margin:0 0 .2rem}h2{color:#B03A2E;font-size:1.05rem;margin:1.2rem 0 .4rem}
.kopf{border-bottom:3px solid #355E3B;padding-bottom:.6rem;margin-bottom:.8rem}
.kacheln{display:flex;gap:.8rem;flex-wrap:wrap;margin:.6rem 0}
.kachel{border:1px solid #ddd;border-radius:.6rem;padding:.5rem .9rem;text-align:center}
.kachel b{display:block;font-size:1.4rem;color:#355E3B}
table{border-collapse:collapse;width:100%;font-size:.9rem}td,th{border:1px solid #ddd;padding:.3rem .5rem;text-align:start}
.n{text-align:center;font-weight:700}ul{line-height:1.9}small{color:#777}
.fuss{margin-top:1.4rem;font-size:.75rem;color:#777;border-top:1px solid #ddd;padding-top:.5rem}
</style></head><body>
<div class="kopf">
<h1>📊 تقرير التدريب الشهري</h1>
<div>طريقي إلى B2 — <b>${name}</b> · تاريخ الإصدار: ${heute} · اليوم <b>${p.plan.day}</b>/${TOTAL_DAYS}</div>
</div>
<div class="kacheln">
<div class="kachel"><b>${evidence.measuredSkills}/${evidence.requiredSkills}</b>مجالات بعينة أداء كافية</div>
<div class="kachel"><b>${evidence.completeTrainingPerformance ?? "—"}</b>متوسط أداء تدريبي مكتمل<small>ليس مستوى CEFR</small></div>
<div class="kachel"><b>${evidence.activityEntries}</b>أحداث نشاط</div>
<div class="kachel"><b>${evidence.selfReportedEntries}</b>تقييمات ذاتية</div>
<div class="kachel"><b>${tage.filter((d) => d.closed).length}</b>أيام مُغلقة</div>
<div class="kachel"><b>${fehler.length}</b>خطأً بالدفتر<small> (${resis.length} مقاوم)</small></div>
</div>
<h2>🔎 حدود الدليل</h2>
<p><b>جاهزية الامتحان: غير مقاسة.</b> لا يحوّل هذا التقرير XP أو إغلاق الأيام أو SRS أو التقييم الذاتي إلى حكم مستوى. يلزم لذلك اختبار مُعاير وتحقق خارجي.</p>
<h2>📈 المجالات الستة</h2>
<table><tr><th>المجال</th><th class="n">أداء تدريبي</th><th class="n">مصدر السجل</th></tr>${rows}</table>
<h2>🕳️ أولويات التدريب</h2>
<ul>${gaps}</ul>
<div class="fuss">تقرير وصفي آلي من بيانات الجهاز. ليس شهادة مستوى ولا نتيجة Goethe/telc ولا تنبؤاً بالجاهزية.</div>
</body></html>`;
}

function csvHtml(p: Progress): string {
  const w = kompetenzWerte(p);
  const evidence = evidenzUebersicht(p);
  const fehler = Object.values(p.fehler ?? {});
  const zeilen: string[] = ["kennzahl,wert"];
  zeilen.push(`tag,${p.plan.day}`);
  zeilen.push(`tage_geschlossen,${Object.values(p.plan.days ?? {}).filter((d) => d.closed).length}`);
  zeilen.push(`plan_pct,${planPct(p)}`);
  zeilen.push(`xp,${p.xp ?? 0}`);
  zeilen.push(`training_performance_complete,${evidence.completeTrainingPerformance ?? ""}`);
  zeilen.push(`exam_readiness,not_assessed`);
  zeilen.push(`evidence_measured_skills,${evidence.measuredSkills}/${evidence.requiredSkills}`);
  zeilen.push(`evidence_measured_entries,${evidence.measuredEntries}`);
  zeilen.push(`evidence_self_report_entries,${evidence.selfReportedEntries}`);
  zeilen.push(`evidence_activity_entries,${evidence.activityEntries}`);
  for (const h of KOMPETENZEN) {
    zeilen.push(`training_performance_${h},${w[h].wert ?? ""}`);
    zeilen.push(`evidence_${h}_measured,${w[h].measured}`);
    zeilen.push(`evidence_${h}_self_report,${w[h].selfReported}`);
    zeilen.push(`evidence_${h}_activity,${w[h].activity}`);
  }
  zeilen.push(`fehler_gesamt,${fehler.length}`);
  zeilen.push(`fehler_resistent,${resistenteFehler(p).length}`);
  const m1 = feedbackQuote(p), m2 = fehlerHeilung(p), m3 = pruefungsKurve(p);
  zeilen.push(`metrik_feedback_pct,${m1.pct ?? ""}`);
  zeilen.push(`metrik_feedback_basis,${m1.graded}/${m1.done}`);
  zeilen.push(`metrik_heilung_pct,${m2.pct ?? ""}`);
  zeilen.push(`metrik_heilung_stuck,${m2.stuck}`);
  zeilen.push(`metrik_kurve_trend,${m3.trend ?? ""}`);
  zeilen.push(`metrik_kurve_wiederholt,${m3.wiederholt.join("|")}`);
  const ux = todayUxSummary(p);
  zeilen.push(`ux_erste_erfolg_median_min,${ux.medianFirstSuccessMin ?? ""}`);
  zeilen.push(`ux_erste_erfolg_basis,${ux.firstSuccessDays}/${ux.attemptedDays}`);
  zeilen.push(`ux_schritt5_erreicht_pct,${ux.step5ReachedPct ?? ""}`);
  zeilen.push(`ux_schritt5_basis,${ux.step5ReachedDays}/${ux.step5EligibleDays}`);
  zeilen.push(`ux_tag_abgeschlossen_pct,${ux.closedPct ?? ""}`);
  zeilen.push(`ux_tag_abgeschlossen_basis,${ux.closedDays}/${ux.attemptedDays}`);
  for (const f of fehlerFamilien(p)) zeilen.push(`familie_${f.art},${f.gl.length}`);
  zeilen.push(`srs_karten,${Object.keys(p.srs ?? {}).length}`);
  for (const [k, v] of Object.entries(p.exams ?? {})) zeilen.push(`pruefung_tag_${k},${v.score}`);
  return zeilen.join("\n");
}


/** ورقة A4 وصفية من سجل الجهاز؛ ليست وثيقة رسمية ولا شهادة مستوى. */
function lernnachweisHtml(p: Progress, name: string): string {
  const w = kompetenzWerte(p);
  const evidence = evidenzUebersicht(p);
  const day = p.plan.day;
  const rows = KOMPETENZEN.map((h) => `<tr><td>${KOMPETENZ_AR[h]} <span dir="ltr" style="color:#888">(${h})</span></td><td style="text-align:center"><b>${w[h].wert === null ? "—" : w[h].wert + "٪"}</b></td><td style="text-align:center">${w[h].measured} / ${w[h].selfReported} / ${w[h].activity}</td></tr>`).join("");
  const exams = Object.values(p.exams ?? {});
  const best = exams.length ? Math.max(...exams.map((e) => e.score)) : null;
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>إثبات تدريب داخلي — ${name}</title>
<style>@page{size:A4;margin:14mm}body{font-family:Georgia,serif;color:#1c1917;padding:2rem 2.4rem}
.frame{border:3px double #7c2d12;padding:1.6rem 1.9rem}h1{font-size:1.05rem;text-align:center;letter-spacing:.05em;margin:.2rem 0}
.sub{text-align:center;color:#777;font-size:.72rem;margin-bottom:1rem}table{width:100%;border-collapse:collapse;font-size:.85rem}
td,th{border-bottom:1px solid #ccc;padding:.35rem .5rem}th{background:#faf7f2;text-align:right}
.box{display:flex;gap:1rem;flex-wrap:wrap;margin:.9rem 0}.stat{flex:1;min-width:8rem;text-align:center;border:1px solid #e5e0d8;border-radius:10px;padding:.5rem}
.stat b{font-size:1.3rem;display:block}.notice{text-align:center;margin-top:1rem;font-size:.75rem;color:#7c2d12;line-height:1.7}
@media print{button{display:none}}button{position:fixed;inset-block-start:8px;inset-inline-end:8px;padding:.4rem .9rem;cursor:pointer}</style></head><body>
<button onclick="print()">🖨️ طباعة / PDF</button><div class="frame">
<h1>📚 إثبات تدريب داخلي — Lernnachweis</h1><div class="sub">«طريقي إلى B2» · اليوم <b>${day}</b> من ${TOTAL_DAYS} · ${lokalesDatum()}</div>
<p style="text-align:center;font-size:1rem">المتعلّم/ة: <b>${name}</b></p>
<table><tr><th>المجال</th><th>أداء تدريبي</th><th>مقاس / ذاتي / نشاط</th></tr>${rows}</table>
<div class="box">
<div class="stat"><b>${evidence.measuredSkills}/${evidence.requiredSkills}</b>مجالات بعينة كافية</div>
<div class="stat"><b>${evidence.completeTrainingPerformance ?? "—"}</b>متوسط تدريب مكتمل</div>
<div class="stat"><b>${planPct(p)}٪</b>إكمال الخطة</div>
<div class="stat"><b>${p.streak.count}🔥</b>سلسلة الأيام</div>
<div class="stat"><b>${p.xp ?? 0}</b>XP نشاط</div>
${best !== null ? `<div class="stat"><b>${best}</b>أعلى محاكاة داخلية (${exams.length} محاولات)</div>` : ""}
</div>
<div class="notice"><b>جاهزية الامتحان غير مقاسة.</b> هذه ورقة وصفية مولّدة محلياً، وليست شهادة مستوى أو وثيقة رسمية أو اعتماد Goethe/telc. لا تدخل XP والأيام المغلقة والتقييمات الذاتية في أداء اللغة المقاس.</div>
</div></body></html>`;
}

function ladeCsv(text: string) {
  const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `weg-nach-b2-bericht-${lokalesDatum()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** 🗓️ A33 (R284): بطاقة تقدّم أسبوعية قابلة للطباعة/المشاركة — كل رقم من سجلّ المتعلم المحلي */
export function wochenKarteHtml(p: Progress, name: string): string {
  const heute = lokalesDatum();
  const wb = wochenBilanz(p, heute);
  const pr = prognose(p.srs ?? {});
  const sb = skillBilanz(p);
  const fl = (p.fluenz ?? []).slice(-1)[0];
  const bericht = wochenBericht(p);
  const minRows = bericht.minutenProArt.map((m) => `<tr><td>${m.art}</td><td class="n">${m.minuten}</td></tr>`).join("");
  const fehlerRows = bericht.fehlerWiederholt.map((f) => `<tr><td>${f.falsch}</td><td>${f.richtig}</td><td class="n">${f.treffer}</td></tr>`).join("");
  const planRows = bericht.naechsteWoche.map((d) => `<tr><td class="n">${d.day}</td><td>${d.phase}</td><td>${d.typ}</td><td class="n">${d.kernMinuten}</td><td class="n">${d.vertiefungMinuten}</td><td class="n">${d.minuten}</td></tr>`).join("");
  const rows = sb.zeilen.map((z) => `<tr><td>${KOMPETENZ_AR[z.hand] ?? z.hand}</td><td class="n">${z.versuche}</td><td class="n">${z.gemessen}</td><td class="n">${Math.round(z.anteil * 100)}٪</td><td class="n">${z.quote === null ? "—" : z.quote + "٪"}</td></tr>`).join("");
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>بطاقة تقدّم الأسبوع — ${name}</title>
<style>body{font-family:system-ui,sans-serif;margin:2rem;color:#222}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:.4rem .6rem;text-align:right}td.n{text-align:center}h1{font-size:1.3rem}</style></head><body>
<h1>🗓️ بطاقة تقدّم الأسبوع — ${name}</h1>
<p>الأسبوع ابتداءً من ${wb.montag} · حتى ${heute} — أرقام محلية من سجلّ التعلّم، لا نتيجة رسمية.</p>
<p>أيام مغلقة: <b>${wb.aktiveTage}/${wb.zielTage}</b> · مهام منجزة: <b>${wb.aufgabenErledigt}</b> · دقائق مقاسة بالمؤقّت: <b>${wb.minutenGemessen}</b></p>
<p>احتفاظ البطاقات الحالي (نموذج FSRS): <b>${pr.retention === null ? "—" : Math.round(pr.retention * 100) + "٪"}</b> · آخر سرعة قراءة: <b>${fl ? fl.wpm + " كلمة/دقيقة" : "—"}</b></p>
<h2>توازن المهارات (${sb.fenster === "7-tage" ? "آخر 7 أيام" : "آخر المحاولات"})</h2>
<table><tr><th>المهارة</th><th>أحداث</th><th>مقاسة</th><th>حصة النشاط</th><th>إصابة المقاس</th></tr>${rows}</table>
${sb.warnung ? `<p>⚖️ ${sb.warnung}</p>` : ""}
<h2>دقائق هذا الأسبوع بحسب نوع المهمة (مقاسة حيث توفّرت، وإلا مخططة معلنة)</h2>
<table><tr><th>النوع</th><th>دقائق</th></tr>${minRows || '<tr><td colspan="2">لا مهام مسلّمة هذا الأسبوع بعد</td></tr>'}</table>
<h2>كلمات إنتاجية جديدة هذا الأسبوع: ${bericht.produktivNeu.anzahl}</h2>
<p>${bericht.produktivNeu.woerter.join(" · ") || "—"}</p>
<h2>أخطاء متكررة (ظهرت مرتين فأكثر)</h2>
<table><tr><th>خطأك</th><th>الصواب</th><th>مرات</th></tr>${fehlerRows || '<tr><td colspan="3">لا أخطاء متكررة هذا الأسبوع</td></tr>'}</table>
<h2>خطة الأسبوع القادم (من اليوم ${p.plan.day + 1})</h2>
<table><tr><th>اليوم</th><th>المستوى</th><th>النوع</th><th>أساسي</th><th>تعميق اختياري</th><th>الكل</th></tr>${planRows}</table>
</body></html>`;
}

export function BerichteZentrum({ progress, name = "المتعلّم", updateProgress }: { progress: Progress; name?: string; updateProgress: ProgressUpdater }) {
  const [open, setOpen] = useState(false);
  const evidence = evidenzUebersicht(progress);
  const werte = kompetenzWerte(progress);
  const gaps = empfehlungen(progress);
  const fams = fehlerFamilien(progress);

  const drucken = () => {
    const fenster = window.open("", "_blank");
    if (!fenster) return;
    fenster.document.write(berichtHtml(progress, name));
    fenster.document.close();
    fenster.focus();
    setTimeout(() => fenster.print(), 350);
  };

  return (
    <div className="card fadein" style={{ padding: "1.1rem 1.3rem", borderInlineStart: "5px solid var(--color-b2)" }}>
      <button style={{ background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", minHeight: "44px", font: "inherit", color: "inherit", textAlign: "start" }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--color-cola)" }}>
          📊 مركز التقارير — BerichteZentrum <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>(Modul T)</span>
        </span>
        <span className="chip">{open ? "إخفاء ▲" : "إظهار ▼"}</span>
      </button>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", margin: "0.2rem 0 0.6rem" }}>
        تغطية الدليل بحسب مصدره · ⏱️ وقت مقاس منفصل عن الوقت اليدوي · أولويات تدريب · تقرير PDF وCSV وصفيان — بلا تحويل XP أو الإكمال إلى مستوى أو جاهزية.
      </div>
      {open && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {/* ⏱️ عقد الساعات — أوّل ما يُفتَح، لأنّه الإطار الذي تُقاس فيه كلُّ الأرقام الباقية */}
          <StundenVertrag progress={progress} />

          {/* 📊 مقاييس النجاح الثلاثة (R34) — من البيانات نفسها، بلا تجميل */}
          {(() => {
            const m1 = feedbackQuote(progress);
            const m2 = fehlerHeilung(progress);
            const m3 = pruefungsKurve(progress);
            const trendTxt = m3.trend === "steigend" ? "📈 تصاعدي" : m3.trend === "fallend" ? "📉 تنازلي" : m3.trend === "stabil" ? "➡️ مستقر" : "—";
            return (
              <div data-testid="metriken-panel" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)" }}>
                <div style={{ fontWeight: 900, marginBottom: "0.35rem" }}>📊 مقاييس النجاح الثلاثة</div>
                <div data-testid="metrik-feedback" style={{ fontSize: "0.85rem", padding: "0.3rem 0", borderTop: "1px dashed var(--color-line)" }}>
                  <strong>1. التغذية الراجعة للمهام الحرّة:</strong>{" "}
                  {m1.pct === null ? (
                    <span style={{ color: "var(--color-ink2)" }}>لا بيانات بعد — تبدأ مع أول مهمة حرّة مسلَّمة.</span>
                  ) : (
                    <>
                      <span className="rtl-num" style={{ fontWeight: 900 }}>{m1.pct}٪</span>
                      <span style={{ color: "var(--color-ink2)" }}> ({m1.graded}/{m1.done} بتقييم مسجّل)</span>{" "}
                      <span className="chip" style={{ fontSize: "0.7rem" }}>{m1.pct >= 90 ? "🟢 الهدف ≥90٪" : "🟡 دون الهدف 90٪"}</span>
                    </>
                  )}
                </div>
                <div data-testid="metrik-heilung" style={{ fontSize: "0.85rem", padding: "0.3rem 0", borderTop: "1px dashed var(--color-line)" }}>
                  <strong>2. شفاء الأخطاء خلال 3 إعادات:</strong>{" "}
                  {m2.pct === null ? (
                    <span style={{ color: "var(--color-ink2)" }}>الدفتر فارغ — لا أخطاء بعد. 🌱</span>
                  ) : (
                    <>
                      <span className="rtl-num" style={{ fontWeight: 900 }}>{m2.pct}٪</span>
                      <span style={{ color: "var(--color-ink2)" }}> ({m2.geheilt}/{m2.total} شُفيت)</span>{" "}
                      {m2.stuck > 0 && <span className="chip" style={{ fontSize: "0.7rem", borderColor: "var(--color-cola)", color: "var(--color-cola)" }}>🛑 {m2.stuck} عالق (3+ تعثّر)</span>}
                    </>
                  )}
                </div>
                <div data-testid="metrik-kurve" style={{ fontSize: "0.85rem", padding: "0.3rem 0", borderTop: "1px dashed var(--color-line)" }}>
                  <strong>3. منحنى المحاكاة:</strong>{" "}
                  {m3.punkte.length === 0 ? (
                    <span style={{ color: "var(--color-ink2)" }}>لا امتحانات بعد.</span>
                  ) : (
                    <>
                      <span style={{ fontWeight: 800 }}>{trendTxt}</span>{" "}
                      <span style={{ color: "var(--color-ink2)" }}>
                        {m3.punkte.map((x) => `ي${x.day}:${x.score}`).join(" · ")}
                      </span>{" "}
                      {m3.wiederholt.length > 0 && (
                        <span className="chip" style={{ fontSize: "0.7rem", borderColor: "var(--color-cola)", color: "var(--color-cola)" }}>
                          🔧 الوحدة {m3.wiederholt.join("، ")} أُعيدت مرتين — خلل في تصميمنا
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* قياسات تجربة «اليوم»: محلية وصفية، لا تحليلات جماعية ولا ادعاء نتيجة ميدانية. */}
          {(() => {
            const ux = todayUxSummary(progress);
            return (
              <div data-testid="today-ux-metrics" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 900, marginBottom: "0.35rem" }}>🧭 قياس تجربة «اليوم» — على هذا الجهاز فقط</div>
                {ux.attemptedDays === 0 ? (
                  <p style={{ margin: 0, color: "var(--color-ink2)", lineHeight: 1.8 }}>
                    لا عيّنة بعد. يبدأ القياس مع أول مهمة تُسلَّم بعد هذا التحديث، ويحسب وقت الجلسة النشط فقط.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: "0.3rem" }}>
                    <div data-testid="ux-first-success">
                      <strong>أول نجاح:</strong>{" "}
                      {ux.medianFirstSuccessMin === null
                        ? `لم يحدث نجاح بعد في ${ux.attemptedDays} يوم مقاس.`
                        : <><span className="rtl-num" style={{ fontWeight: 900 }}>{ux.medianFirstSuccessMin.toFixed(1)}</span> دقيقة وسيطًا · <span className="rtl-num">{ux.firstSuccessDays}/{ux.attemptedDays}</span> أيام لها نجاح مسجّل.</>}
                    </div>
                    <div data-testid="ux-step5-reached">
                      <strong>بلوغ المحطة ⑤:</strong>{" "}
                      {ux.step5ReachedPct === null
                        ? "لا يوم مقاس احتوى محطة ⑤ بعد."
                        : <><span className="rtl-num" style={{ fontWeight: 900 }}>{ux.step5ReachedPct}٪</span> · <span className="rtl-num">{ux.step5ReachedDays}/{ux.step5EligibleDays}</span> من الأيام المؤهلة.</>}
                    </div>
                    <div data-testid="ux-day-closed">
                      <strong>إكمال مسار اليوم:</strong>{" "}
                      <span className="rtl-num" style={{ fontWeight: 900 }}>{ux.closedPct ?? 0}٪</span> · <span className="rtl-num">{ux.closedDays}/{ux.attemptedDays}</span> أيام أُغلقت عاديًا.
                    </div>
                  </div>
                )}
                <p style={{ margin: "0.45rem 0 0", color: "var(--color-ink2)", fontSize: "0.75rem", lineHeight: 1.75 }}>
                  بيانات وصفية محلية بلا نصوص إجابات ولا إرسال شبكي. الأيام السابقة للتحديث غير مفبركة ولا تدخل العيّنة؛ وهذه ليست نتيجة عامة لمستخدمين آخرين.
                </p>
              </div>
            );
          })()}

          {/* ⏱️ طلاقة القراءة المقاسة (A3/R283): من سلّم القراءة — آخر قياس وعدد القياسات */}
          {(() => {
            const fl = progress.fluenz ?? [];
            const letzt = fl[fl.length - 1];
            const ziel = letzt ? FLUENZ_ZIEL[letzt.stufe] ?? FLUENZ_ZIEL[3] : null;
            return (
              <div data-testid="metrik-fluenz" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.85rem" }}>
                ⏱️ <strong>طلاقة القراءة (A3):</strong>{" "}
                {!letzt || !ziel ? (
                  <span style={{ color: "var(--color-ink2)" }}>لا قياس بعد — تُقاس سرعتك (كلمات/دقيقة) في «سلّم القراءة» عند تسليم أي نصّ.</span>
                ) : (
                  <>آخر قياس: <strong className="rtl-num">{letzt.wpm}</strong> كلمة/دقيقة في محطة سلّم {letzt.stufe} (نطاقها التوجيهي <span className="rtl-num">{ziel.von}–{ziel.bis}</span>) · من <span className="rtl-num">{fl.length}</span> قياسًا محفوظًا. <span style={{ color: "var(--color-ink2)" }}>(تقيس الوتيرة لا الفهم؛ فهمك يُقاس بأسئلة النصّ نفسها.)</span></>
                )}
              </div>
            );
          })()}

          {/* ⚖️ توازن المهارات (A30/R284): حارس أسبوعي من سجلّ محاولاتك المؤرّخ */}
          {(() => {
            const sb = skillBilanz(progress);
            return (
              <div data-testid="skill-balance" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 900, marginBottom: "0.3rem" }}>⚖️ توازن المهارات ({sb.fenster === "7-tage" ? "آخر 7 أيام" : "نافذة آخر المحاولات"})</div>
                {sb.eintraege === 0 ? (
                  <span style={{ color: "var(--color-ink2)" }}>لا أحداث مسجّلة بعد في سجل مجالات التدريب.</span>
                ) : (
                  <div style={{ display: "grid", gap: "0.25rem" }}>
                    {sb.zeilen.map((z) => (
                      <div key={z.hand} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                        <span>{KOMPETENZ_AR[z.hand] ?? z.hand}</span>
                        <span><span className="rtl-num">{z.versuche}</span> حدث · <span className="rtl-num">{Math.round(z.anteil * 100)}٪</span> من النشاط · مقاس <span className="rtl-num">{z.gemessen}</span>{z.quote !== null && <> · إصابة المقاس <span className="rtl-num">{z.quote}٪</span></>}</span>
                      </div>
                    ))}
                    {sb.warnung && <div style={{ color: "var(--color-cola)" }}>⚠️ {sb.warnung}</div>}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 🎚️ معايرة صعوبة من البيانات + بطاقات عنيدة (M4/R288) */}
          <KalibrierungPanel progress={progress} updateProgress={updateProgress} />
          <VerzweigungPanel progress={progress} />

          {/* 🔧 صيانة المستويات المنتهية (A17/R284): ما أُتقن لا يتحلّل بصمت */}
          {(() => {
            const wb2 = wartungsBericht(progress);
            return (
              <div data-testid="wartung-panel" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 900, marginBottom: "0.3rem" }}>🔧 صيانة المستويات المنتهية (A17)</div>
                {wb2.zeilen.length === 0 ? (
                  <span style={{ color: "var(--color-ink2)" }}>لا بطاقات مُدخلة بعد — تبدأ الصيانة مع أول مستوى يُدرَس.</span>
                ) : (
                  <div style={{ display: "grid", gap: "0.25rem" }}>
                    {wb2.zeilen.map((z) => (
                      <div key={z.level} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                        <span>{z.level}{z.abgeschlossen ? " ✅ منتهٍ" : ""}</span>
                        <span><span className="rtl-num">{z.karten}</span> بطاقة · احتفاظ {z.retention === null ? "—" : `${Math.round(z.retention * 100)}٪`} · مستحقّ الآن <span className="rtl-num">{z.faellig}</span></span>
                      </div>
                    ))}
                    <div style={{ color: "var(--color-ink2)", fontSize: "0.78rem" }}>البطاقات المستحقّة تدخل طابور مراجعتك اليومي أولًا تلقائيًا — الصيانة تعمل ما دمت تراجع.</div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 📈 الاحتفاظ والتوقّع (A2+A13/R281): نموذج FSRS من حالات بطاقاتك — تقدير آلي لا ملاحظة بشرية */}
          {(() => {
            const pr = prognose(progress.srs ?? {});
            const pct = (x: number | null) => (x === null ? "—" : `${Math.round(x * 100)}٪`);
            return (
              <div data-testid="retention-panel" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)" }}>
                <div style={{ fontWeight: 900, marginBottom: "0.35rem" }}>📈 الاحتفاظ والتوقّع (نموذج FSRS)</div>
                {pr.karten === 0 ? (
                  <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>لا بطاقات مُدخلة بعد — يبدأ القياس مع أول بطاقة تُراجَع.</div>
                ) : (
                  <div style={{ fontSize: "0.85rem", display: "grid", gap: "0.3rem" }}>
                    <div>احتمال استدعاء بطاقاتك الآن (متوسط <span className="rtl-num">{pr.karten}</span> بطاقة): <strong>{pct(pr.retention)}</strong></div>
                    <div>متأخرة اليوم: <strong className="rtl-num">{pr.ueberfaellig}</strong> · ذروة الأيام السبعة القادمة: <strong className="rtl-num">{pr.spitze}</strong> بطاقة/يوم{pr.spitzenWarnung ? " ⚠️ فوق سقف 150 — وزّع الجديد اليوم" : ""}</div>
                    <div>المستحقّ قادمًا: {pr.tage.map((t) => `${t.datum.slice(5)}: ${t.faellig}`).join(" · ")}</div>
                    <div>إن توقّفت عن المراجعة: بعد 7 أيام {pct(pr.kurve[0].retention)} · 14 يومًا {pct(pr.kurve[1].retention)} · 30 يومًا {pct(pr.kurve[2].retention)}</div>
                    {pr.kohorten.map((k) => (
                      <div key={k.tage}>فحص احتفاظ {k.tage} يومًا (A13): {k.n === 0 ? "لا بطاقات في هذه الفئة العمرية بعد" : <>من <span className="rtl-num">{k.n}</span> بطاقة قُدّمت قبل ~{k.tage} يومًا ما زال <strong>{pct(k.quote)}</strong> فوق عتبة 85٪</>}</div>
                    ))}
                    <div style={{ color: "var(--color-ink2)", fontSize: "0.78rem" }}>أرقام نموذج FSRS من حالات بطاقاتك المحلية — تقدير آلي لضبط الإيقاع، لا قياس بشري ولا حكم إتقان.</div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 🎙️ هدف التحدّث اليومي (A4/R282): يُقاس من بطاقات التحدّث المسجّلة محليًا فقط */}
          {(() => {
            const sz = sprechHeute(progress);
            return (
              <div data-testid="metrik-sprechen" className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)", fontSize: "0.85rem" }}>
                🎙️ <strong>هدف التحدّث اليومي (A4):</strong>{" "}
                {sz.sek === 0 ? (
                  <span style={{ color: "var(--color-ink2)" }}>لا تحدّث مسجّل اليوم بعد — الهدف <span className="rtl-num">{Math.round(sz.ziel / 60)}</span> دقائق من بطاقات التحدّث المسجّلة.</span>
                ) : (
                  <>سجّلت اليوم <strong className="rtl-num">{Math.floor(sz.sek / 60)}:{String(sz.sek % 60).padStart(2, "0")}</strong> دقيقة تحدّث في <span className="rtl-num">{sz.eintraege}</span> بطاقة {sz.erreicht ? "— ✅ بلغت هدف الـ5 دقائق" : <>— تبقّى <span className="rtl-num">{Math.ceil((sz.ziel - sz.sek) / 60)}</span> دقيقة للهدف</>}. <span style={{ color: "var(--color-ink2)" }}>(يُقاس المسجّل فقط؛ الكلام الحرّ بلا تسجيل لا نراه ولا ندّعيه.)</span></>
                )}
              </div>
            );
          })()}

          {/* 🔎 تغطية الدليل — لا مؤشر جاهزية مشتق من النشاط */}
          <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)" }} data-testid="evidence-provenance-panel">
            <div style={{ fontWeight: 900, marginBottom: "0.3rem" }}>🔎 دليل الأداء وحدوده</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--color-cola)", lineHeight: 1 }}>
                <span className="rtl-num">{evidence.completeTrainingPerformance ?? "—"}</span>
              </span>
              <span className="chip" style={{ fontWeight: 800 }}>
                {evidence.completeTrainingPerformance === null ? "عينة الأداء غير مكتملة" : "متوسط أداء تدريبي داخلي"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>
                مجالات مكتملة: <span className="rtl-num">{evidence.measuredSkills}/{evidence.requiredSkills}</span>
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.25rem", marginTop: "0.55rem" }}>
              {KOMPETENZEN.map((hand) => (
                <div key={hand} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                  <span style={{ width: "6rem" }}>{KOMPETENZ_AR[hand]}</span>
                  <span className="progressbar" style={{ flex: 1, height: 7 }}>
                    <span style={{ display: "block", width: `${werte[hand].wert ?? 0}%`, height: "100%", background: werte[hand].wert === null ? "var(--color-line)" : "var(--color-b2)" }} />
                  </span>
                  <span className="rtl-num" style={{ width: "2.2rem", textAlign: "end", fontWeight: 700 }}>{werte[hand].wert === null ? "—" : `${werte[hand].wert}%`}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-ink2)", minWidth: "9rem" }}>
                    مقاس {werte[hand].measured} · ذاتي {werte[hand].selfReported} · نشاط {werte[hand].activity}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.55rem", lineHeight: 1.8 }} data-testid="exam-readiness-not-assessed">
              <strong>جاهزية الامتحان: غير مقاسة.</strong> لا تمنح الأيام المغلقة أو XP أو SRS أو غياب الأخطاء نقاط أداء. يتطلب حكم المستوى بنوداً موسومة ومُعايرة، عينات إنتاج مقاسة، وتحققاً خارجياً غير متوافر هنا.
            </div>
          </div>

          {/* 🕳️ الفجوات */}
          <div className="card" style={{ padding: "0.9rem 1.1rem" }}>
            <div style={{ fontWeight: 900, marginBottom: "0.35rem" }}>🕳️ فجوات المواضيع — العوائق الثلاثة الكبرى</div>
            {gaps.map((g, i) => (
              <div key={i} style={{ borderTop: i ? "1px dashed var(--color-line)" : "none", padding: "0.35rem 0", fontSize: "0.88rem", lineHeight: 1.8 }}>
                <strong style={{ color: "var(--color-cola)" }}>{i + 1}. {g.dringend}:</strong> {g.text}
              </div>
            ))}
            {fams.length > 0 && (
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                {fams.slice(0, 5).map((f) => (
                  <span key={f.art} className="chip" style={{ fontSize: "0.72rem" }}>👨‍👩‍👧 {f.titel}: <span className="rtl-num">{f.gl.length}</span></span>
                ))}
              </div>
            )}
            {fams.length === 0 && <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>لا فجوات بعد — التقرير يتشكّل مع أول أسبوع كامل. 🌱</div>}
          </div>

          {/* 📄 التصدير */}
          <div className="card" style={{ padding: "0.9rem 1.1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "14rem", fontSize: "0.85rem" }}>
              📄 <strong>التقرير الشهري</strong> — يفتح نافذة طباعة: اختر «حفظ كـ PDF» أو اطبعه ورقاً. يشمل كل جداول هذه الصفحة + الخطة.
            </div>
            <button className="btn btn-gold" onClick={drucken}>🖨️ تقرير PDF شهري</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const win = window.open("", "_blank");
                if (!win) return;
                win.document.write(lernnachweisHtml(progress, name));
                win.document.close();
              }}
            >
              📚 إثبات تدريب A4
            </button>
            <button className="btn btn-ghost" onClick={() => ladeCsv(csvHtml(progress))}>📥 CSV للأرقام</button>
            <button
              className="btn btn-ghost"
              data-testid="wochenkarte-btn"
              onClick={() => {
                const win = window.open("", "_blank");
                if (!win) return;
                win.document.write(wochenKarteHtml(progress, name));
                win.document.close();
              }}
            >
              🗓️ بطاقة تقدّم الأسبوع (A33)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
