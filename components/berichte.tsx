"use client";
// 📊 مركز التقارير — BerichteZentrum (Modul T) في جناح التقوية
// ثلاثة تقارير في محرّك واحد (لا أدوات شاردة):
//   🎯 مؤشر Prüfungsbereitschaft بأربعة عوامل موزونة من شبكة الكفاءات
//   🕳️ فجوات المواضيع + توصيات علاج مرتّبة بالعوائق الكبرى
//   📄 تقرير شهري مطبوع (PDF عبر الطباعة) + تصدير CSV للأرقام
import { useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import { kompetenzWerte, b2Score, pruefungsBereitschaft, bereitBand, KOMPETENZEN, KOMPETENZ_AR, band } from "@/lib/kompetenz";
import { fehlerFamilien, resistenteFehler, schwere, weakTopics, URSACHEN, ursacheVon } from "@/lib/fehler";
import { planPct } from "@/lib/plan";
import { feedbackQuote, fehlerHeilung, pruefungsKurve } from "@/lib/metriken";
import { noteFromPct } from "@/lib/grader";
import { levelOfXp } from "@/lib/spiel";
import { De } from "./De";
import { StundenVertrag } from "./stundenvertrag";

const HAND: Record<string, string> = { Lesen: "📖", Hoeren: "👂", Schreiben: "✍️", Sprechen: "🗣️", Grammatik: "🧩", Wortschatz: "🗂️" };

/** توصيات العلاج الثلاث — حتمية من البيانات (قانون العوائق الكبرى) */
export function empfehlungen(p: Progress): { dringend: string; text: string }[] {
  const out: { dringend: string; text: string }[] = [];
  const w = kompetenzWerte(p);
  const schwach = [...KOMPETENZEN].sort((a, b) => w[a].wert - w[b].wert || a.localeCompare(b))[0];
  const map: Record<string, string> = {
    Lesen: "📖 القراءة أضعف حلقاتك: نصّين يومياً مع سؤالين (جناح الاختبار/الحصص).",
    Hoeren: "👂 الاستماع أضعف حلقاتك: حوار واحد بالتسميع + إملاء يومي (مدرّب الدِكتات/آلة الاستماع).",
    Schreiben: "✍️ الكتابة أضعف حلقاتك: تمرين Teil-1 بتوقّت 15د مرتين أسبوعياً.",
    Sprechen: "🗣️ المحادثة أضعف حلقاتك: تسميع جُمل بصوت عالٍ + دور واحد من سيناريو كل يوم.",
    Grammatik: "🧩 القواعد أضعف حلقاتك: ميادين القواعد + تصريف يومي قبل النوم.",
    Wortschatz: "🗂️ المفردات أضعف حلقاتك: 10 بطاقات SRS يومياً + عمق معجمي مرتين أسبوعياً.",
  };
  out.push({ dringend: "أولوية قصوى", text: map[schwach] });
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
  const b2 = b2Score(p);
  const bereit = pruefungsBereitschaft(p);
  const bb = bereitBand(bereit.gesamt);
  const fehler = Object.values(p.fehler ?? {});
  const resis = resistenteFehler(p);
  const tage = Object.values(p.plan.days ?? {});
  const heute = new Date().toISOString().slice(0, 10);
  const rows = KOMPETENZEN.map((h) => `<tr><td>${HAND[h]} ${KOMPETENZ_AR[h]} <small>(${h})</small></td><td class="n">${w[h].wert}</td><td class="n">${w[h].kern !== null ? w[h].versuche + " محاولة" : "تقديري"}</td></tr>`).join("");
  const teile = bereit.teile.map((t) => `<tr><td>${t.ar}</td><td class="n">${t.wert}</td><td class="n">${Math.round(t.gewicht * 100)}%</td></tr>`).join("");
  const gaps = empfehlungen(p).map((e) => `<li><b>${e.dringend}:</b> ${e.text}</li>`).join("");
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>تقرير شهري — ${name}</title>
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
<h1>📊 التقرير الشهري — Monatsbericht</h1>
<div>طريقي إلى B2 — <b>${name}</b> · تاريخ الإصدار: ${heute} · اليوم <b>${p.plan.day}</b>/${TOTAL_DAYS}</div>
</div>
<div class="kacheln">
<div class="kachel"><b>${bereit.gesamt}%</b>جاهزية الامتحان<small> ${bb.name}</small></div>
<div class="kachel"><b>${b2}</b>B2-Score<small> ${band(b2).name}</small></div>
<div class="kachel"><b>${tage.filter((d) => d.closed).length}</b>أيام مُغلقة</div>
<div class="kachel"><b>${p.xp ?? 0}</b>XP</div>
<div class="kachel"><b>${fehler.length}</b>خطأً بالدفتر<small> (${resis.length} مقاوم)</small></div>
<div class="kachel"><b>${Object.keys(p.srs ?? {}).length}</b>بطاقة SRS</div>
</div>
<h2>🎯 عوامل الجاهزية (40/25/20/15)</h2>
<table><tr><th>العامل</th><th class="n">القيمة</th><th class="n">الوزن</th></tr>${teile}</table>
<h2>📈 شبكة الكفاءات الست</h2>
<table><tr><th>الكفاءة</th><th class="n">0-100</th><th class="n">الأساس</th></tr>${rows}</table>
<h2>🕳️ العوائق الكبرى وخطتها</h2>
<ul>${gaps}</ul>
<div class="fuss">تقرير آلي حتمي يولّده التطبيق من بيانات المتعلّم مباشرة — بلا خوادم ولا خصوصية مهدَّدة. يُطبع أو يُحفظ PDF من نافذة الطباعة.</div>
</body></html>`;
}

function csvHtml(p: Progress): string {
  const w = kompetenzWerte(p);
  const bereit = pruefungsBereitschaft(p);
  const fehler = Object.values(p.fehler ?? {});
  const zeilen: string[] = ["kennzahl,wert"];
  zeilen.push(`tag,${p.plan.day}`);
  zeilen.push(`tage_geschlossen,${Object.values(p.plan.days ?? {}).filter((d) => d.closed).length}`);
  zeilen.push(`plan_pct,${planPct(p)}`);
  zeilen.push(`xp,${p.xp ?? 0}`);
  zeilen.push(`b2_score,${b2Score(p)}`);
  zeilen.push(`pruefungsbereitschaft,${bereit.gesamt}`);
  for (const t of bereit.teile) zeilen.push(`faktor_${t.name},${t.wert}`);
  for (const h of KOMPETENZEN) zeilen.push(`kompetenz_${h},${w[h].wert}`);
  zeilen.push(`fehler_gesamt,${fehler.length}`);
  zeilen.push(`fehler_resistent,${resistenteFehler(p).length}`);
  const m1 = feedbackQuote(p), m2 = fehlerHeilung(p), m3 = pruefungsKurve(p);
  zeilen.push(`metrik_feedback_pct,${m1.pct ?? ""}`);
  zeilen.push(`metrik_feedback_basis,${m1.graded}/${m1.done}`);
  zeilen.push(`metrik_heilung_pct,${m2.pct ?? ""}`);
  zeilen.push(`metrik_heilung_stuck,${m2.stuck}`);
  zeilen.push(`metrik_kurve_trend,${m3.trend ?? ""}`);
  zeilen.push(`metrik_kurve_wiederholt,${m3.wiederholt.join("|")}`);
  for (const f of fehlerFamilien(p)) zeilen.push(`familie_${f.art},${f.gl.length}`);
  zeilen.push(`srs_karten,${Object.keys(p.srs ?? {}).length}`);
  for (const [k, v] of Object.entries(p.exams ?? {})) zeilen.push(`pruefung_tag_${k},${v.score}`);
  return zeilen.join("\n");
}


/** ورقة رسمية A4 — ختم التحقّق حتمي: رمز من الاسم+اليوم (لا خادم، لا تزوير عابر) */
function amtsblattHtml(p: Progress, name: string): string {
  const w = kompetenzWerte(p);
  const pb = pruefungsBereitschaft(p);
  const day = p.plan.day;
  const code = (([...name].reduce((s2, c) => s2 + c.charCodeAt(0), 0) + day * 7919) % 9000) + 1000;
  const rows = KOMPETENZEN.map((h) => `<tr><td>${KOMPETENZ_AR[h]} <span dir="ltr" style="color:#888">(${h})</span></td><td style="text-align:center"><b>${w[h].wert}٪</b></td><td style="text-align:center">${noteFromPct(w[h].wert)}</td></tr>`).join("");
  const exams = Object.values(p.exams ?? {});
  const best = exams.length ? Math.max(...exams.map((e) => e.score)) : null;
  const lvl = levelOfXp(p.xp ?? 0);
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>Amtsblatt — ${name}</title>
<style>@page{size:A4;margin:14mm}body{font-family:Georgia,serif;color:#1c1917;padding:2rem 2.4rem}
.frame{border:3px double #7c2d12;padding:1.6rem 1.9rem}h1{font-size:1.05rem;text-align:center;letter-spacing:.05em;margin:.2rem 0}
.sub{text-align:center;color:#777;font-size:.72rem;margin-bottom:1rem}table{width:100%;border-collapse:collapse;font-size:.85rem}
td,th{border-bottom:1px solid #ccc;padding:.35rem .5rem}th{background:#faf7f2;text-align:right}
.box{display:flex;gap:1rem;flex-wrap:wrap;margin:.9rem 0}.stat{flex:1;min-width:8rem;text-align:center;border:1px solid #e5e0d8;border-radius:10px;padding:.5rem}
.stat b{font-size:1.3rem;display:block}.seal{text-align:center;margin-top:1rem;font-size:.72rem;color:#7c2d12}
code{background:#faf7f2;border:1px solid #ddd;border-radius:6px;padding:.1rem .4rem;font-size:.75rem}
@media print{button{display:none}}button{position:fixed;inset-block-start:8px;inset-inline-end:8px;padding:.4rem .9rem;cursor:pointer}</style></head><body>
<button onclick="print()">🖨️ طباعة / PDF</button><div class="frame">
<h1>🎓 وثيقة مستوى — Amtliches Notblatt</h1><div class="sub">«طريقي إلى B2» · اليوم <b>${day}</b> من ${TOTAL_DAYS} · ${new Date().toISOString().slice(0, 10)}</div>
<p style="text-align:center;font-size:1rem">الحامل/ة: <b>${name}</b></p>
<table><tr><th>الكفاءة</th><th>القيمة</th><th>المعادل الألماني</th></tr>${rows}</table>
<div class="box">
<div class="stat"><b>${pb.gesamt}٪</b>جاهزية الامتحان<br><span style="font-size:.7rem;color:#777">${bereitBand(pb.gesamt).name}</span></div>
<div class="stat"><b>${b2Score(p)}</b>B2-Score شبكة</div>
<div class="stat"><b>${planPct(p)}٪</b>انضباط الخطة</div>
<div class="stat"><b>${p.streak.count}🔥</b>سلسلة الأيام</div>
<div class="stat"><b>${p.xp ?? 0}</b>XP — ${lvl.name}</div>
${best !== null ? `<div class="stat"><b>${best}</b>أعلى محاكاة (${exams.length} tries)</div>` : ""}
<div class="stat"><b>${Object.keys(p.abzeichen ?? {}).length}</b>أوسمة</div>
</div>
<div class="seal">رمز التحقّق الحتمي: <code>WB2-${String(day).padStart(3, "0")}-${code}</code> — يُعاد إنتاجه من الاسم واليوم وحدهما؛ غيّر اليوم واحدًا فيتغيّر الختم. لا يُقبل في المزاد، يُقبل عند المرشد.</div>
</div></body></html>`;
}

function ladeCsv(text: string) {
  const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `weg-nach-b2-bericht-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function BerichteZentrum({ progress, name = "المتعلّم" }: { progress: Progress; name?: string }) {
  const [open, setOpen] = useState(false);
  const bereit = useMemo(() => pruefungsBereitschaft(progress), [progress]);
  const bb = bereitBand(bereit.gesamt);
  const w = kompetenzWerte(progress);
  const gaps = empfehlungen(progress);
  const fams = fehlerFamilien(progress);
  const b2 = b2Score(progress);

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
        جاهزية الامتحان بأربعة عوامل · ⏱️ عقد الساعات مقابل مرجع CEFR · فجوات المواضيع بخططها · تقرير شهري يُطبع PDF · أرقام CSV — كلها من شبكة الكفاءات ذاتها.
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

          {/* 🎯 الجاهزية */}
          <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)" }}>
            <div style={{ fontWeight: 900, marginBottom: "0.3rem" }}>🎯 جاهزية الامتحان — Prüfungsbereitschaft</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "2.4rem", fontWeight: 900, color: bb.farbe, lineHeight: 1 }}><span className="rtl-num">{bereit.gesamt}</span></span>
              <span className="chip" style={{ borderColor: bb.farbe, color: bb.farbe, fontWeight: 800 }}>{bb.name} — {bb.ar}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>B2-Score: <span className="rtl-num">{b2}</span> ({band(b2).name})</span>
            </div>
            <div className="progressbar" style={{ margin: "0.5rem 0" }}>
              <div style={{ width: `${bereit.gesamt}%`, background: bb.farbe }} />
            </div>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              {bereit.teile.map((t) => (
                <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                  <span style={{ width: "8.5rem" }}>{t.ar}</span>
                  <span className="progressbar" style={{ flex: 1, height: 7 }}>
                    <span style={{ display: "block", width: `${t.wert}%`, height: "100%", background: "var(--color-b2)" }} />
                  </span>
                  <span className="rtl-num" style={{ width: "1.8rem", textAlign: "end", fontWeight: 700 }}>{t.wert}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-ink2)", width: "2.4rem" }}>وزن {Math.round(t.gewicht * 100)}%</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)", marginTop: "0.35rem" }}>
              المعادلة حتمية موثّقة: شبكة الكفاءات 40% · انضباط الخطة 25% · صحّة الأخطاء 20% · نضج البطاقات 15%.
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
                win.document.write(amtsblattHtml(progress, name));
                win.document.close();
              }}
            >
              📜 الورقة الرسمية A4
            </button>
            <button className="btn btn-ghost" onClick={() => ladeCsv(csvHtml(progress))}>📥 CSV للأرقام</button>
          </div>
        </div>
      )}
    </div>
  );
}
