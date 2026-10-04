"use client";
// 🔒 بوّابة الوحدة: امتحان أربع مهارات · 80٪ مجموعاً ولا مهارة دون 60٪ · تهدئة 24 ساعة · مسار إنقاذ
import { useMemo, useState } from "react";
import { De } from "@/components/De";
import { loadProgress, saveProgress } from "@/lib/store";
import { modulOf, MODULE } from "@/lib/plan";
import {
  buildModulPruefung, bewerte, darfWiederholen, modulFrei, modulIndex, rettungsplan,
  GESAMT_SCHWELLE, FACH_SCHWELLE, TEIL_AR, type PruefTeil, type PruefErgebnis,
} from "@/lib/modulpruefung";
import { getDialogue, dialogAudioSrc } from "@/lib/content";

const LEER: Record<PruefTeil, number> = { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 };

export default function ModulTor({ day }: { day: number }) {
  const progress = loadProgress();
  const idx = modulIndex(modulOf(day).modul);
  const modul = MODULE[idx - 1];
  const stand = progress.modulPruefungen?.[idx];
  const wieder = darfWiederholen(stand);
  const [offen, setOffen] = useState(false);
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [selbst, setSelbst] = useState<Record<string, boolean>>({});
  const [erg, setErg] = useState<PruefErgebnis | null>(null);
  const versuch = stand?.versuche ?? 0;
  const pruefung = useMemo(() => buildModulPruefung(idx, versuch), [idx, versuch]);

  const abgeben = () => {
    const teile = { ...LEER };
    for (const ab of pruefung.abschnitte) {
      if (ab.teil === "lesen" || ab.teil === "hoeren") {
        const richtig = ab.fragen.filter((f) => (antworten[f.id] ?? "").trim().toLowerCase() === f.answer.trim().toLowerCase()).length;
        teile[ab.teil] = ab.fragen.length ? Math.round((richtig / ab.fragen.length) * 100) : 0;
      }
      if (ab.teil === "schreiben") {
        const woerter = text.trim().split(/\s+/).filter(Boolean).length;
        const laenge = Math.min(100, Math.round((woerter / ab.minWoerter) * 100));
        const erfuellt = ab.kriterien.filter((k) => selbst[`k:${k}`]).length;
        const kriterien = ab.kriterien.length ? (erfuellt / ab.kriterien.length) * 100 : 0;
        teile.schreiben = Math.round(laenge * 0.5 + kriterien * 0.5);
      }
      if (ab.teil === "sprechen") {
        const gelesen = ab.saetze.filter((_, i) => selbst[`s:${i}`]).length;
        teile.sprechen = ab.saetze.length ? Math.round((gelesen / ab.saetze.length) * 100) : 0;
      }
    }
    const e = bewerte(teile);
    setErg(e);
    const p = loadProgress();
    const alt = p.modulPruefungen?.[idx];
    p.modulPruefungen = {
      ...(p.modulPruefungen ?? {}),
      [idx]: {
        versuche: (alt?.versuche ?? 0) + 1,
        best: Math.max(alt?.best ?? 0, e.gesamt),
        bestanden: (alt?.bestanden ?? false) || e.bestanden,
        zuletzt: new Date().toISOString(),
        teile,
      },
    };
    saveProgress(p);
  };

  const farbe = stand?.bestanden ? "#15803d" : wieder.erlaubt ? "var(--color-cola)" : "#be123c";

  return (
    <section className="card" data-test="modultor" style={{ padding: "1rem 1.2rem", display: "grid", gap: "0.6rem", borderInlineStart: `5px solid ${farbe}` }}>
      <h3 style={{ margin: 0 }}>
        {stand?.bestanden ? "✅" : "🔒"} بوّابة الوحدة {modul.nr} — {modul.titelAr}
      </h3>
      <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-ink2)" }}>
        امتحانٌ بأربع مهارات · {GESAMT_SCHWELLE}٪ مجموعاً · <strong>ولا مهارة دون {FACH_SCHWELLE}٪</strong> — لا تُفتَح الوحدة التالية قبله.
        {stand && <> · محاولات: {stand.versuche} · أفضل نتيجة: {stand.best}٪</>}
      </p>

      {!modulFrei(progress, idx) && (
        <div className="card" style={{ padding: "0.6rem 0.8rem", background: "var(--color-rosa-soft)", color: "var(--color-die)" }}>
          🚧 هذه الوحدة مقفلة: عليك أوّلاً اجتياز امتحان الوحدة {idx - 1}.
        </div>
      )}

      {!offen && (
        <button className="btn btn-primary" disabled={!wieder.erlaubt} onClick={() => setOffen(true)}>
          {stand?.bestanden ? "🔁 إعادة للتثبيت" : wieder.erlaubt ? "▶️ ابدأ امتحان الوحدة" : `⏳ تهدئة — بقيت ${wieder.restStunden} ساعة`}
        </button>
      )}

      {offen && (
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {pruefung.abschnitte.map((ab) => (
            <div key={ab.teil} className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper2)" }}>
              <div style={{ fontWeight: 800, marginBottom: "0.4rem" }}>{TEIL_AR[ab.teil]} — {ab.titelAr}</div>

              {ab.teil === "lesen" && (
                <>
                  {ab.passagen.map((p, i) => (
                    <De key={i} style={{ display: "block", fontSize: "0.86rem", marginBottom: "0.4rem" }}>{p.de}</De>
                  ))}
                  {ab.fragen.map((f) => (
                    <div key={f.id} style={{ marginBottom: "0.35rem" }}>
                      <De style={{ fontSize: "0.88rem" }}>{f.promptDe}</De>
                      {f.options ? (
                        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                          {f.options.map((o) => (
                            <button key={o} className="chip" style={{ minHeight: "44px", borderColor: antworten[f.id] === o ? "var(--color-cola)" : undefined }}
                              onClick={() => setAntworten({ ...antworten, [f.id]: o })}>{o}</button>
                          ))}
                        </div>
                      ) : (
                        <input value={antworten[f.id] ?? ""} onChange={(e) => setAntworten({ ...antworten, [f.id]: e.target.value })}
                          style={{ minHeight: "44px", width: "100%", padding: "0.3rem" }} dir="ltr" />
                      )}
                    </div>
                  ))}
                </>
              )}

              {ab.teil === "hoeren" && (
                <>
                  {ab.dialogIds.map((id) => {
                    const src = dialogAudioSrc(id);
                    return src ? <audio key={id} controls src={src} style={{ width: "100%", marginBottom: "0.3rem" }} /> : null;
                  })}
                  {ab.fragen.map((f) => (
                    <div key={f.id} style={{ marginBottom: "0.35rem" }}>
                      <De style={{ fontSize: "0.88rem" }}>{f.promptDe}</De>
                      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                        {(f.options ?? ["richtig", "falsch"]).map((o) => (
                          <button key={o} className="chip" style={{ minHeight: "44px", borderColor: antworten[f.id] === o ? "var(--color-cola)" : undefined }}
                            onClick={() => setAntworten({ ...antworten, [f.id]: o })}>{o}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {ab.teil === "schreiben" && (
                <>
                  <De style={{ display: "block", fontSize: "0.88rem" }}>{ab.aufgabeDe}</De>
                  <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)" }}>{ab.aufgabeAr} — الحد الأدنى {ab.minWoerter} كلمة</div>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} dir="ltr" rows={5}
                    style={{ width: "100%", marginTop: "0.3rem", padding: "0.4rem" }} />
                  <div style={{ fontSize: "0.82rem", marginTop: "0.2rem" }}>
                    الكلمات: {text.trim().split(/\s+/).filter(Boolean).length} / {ab.minWoerter}
                  </div>
                  {ab.kriterien.map((k) => (
                    <label key={k} style={{ display: "block", fontSize: "0.84rem", minHeight: "44px", lineHeight: "44px" }}>
                      <input type="checkbox" checked={!!selbst[`k:${k}`]} onChange={(e) => setSelbst({ ...selbst, [`k:${k}`]: e.target.checked })} /> {k}
                    </label>
                  ))}
                </>
              )}

              {ab.teil === "sprechen" && ab.saetze.map((s, i) => (
                <label key={i} style={{ display: "block", minHeight: "44px", marginBottom: "0.3rem" }}>
                  <input type="checkbox" checked={!!selbst[`s:${i}`]} onChange={(e) => setSelbst({ ...selbst, [`s:${i}`]: e.target.checked })} />{" "}
                  <De>{s.de}</De> <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>— {s.ar}</span>
                </label>
              ))}
            </div>
          ))}

          <button className="btn btn-primary" onClick={abgeben}>📤 سلّم الورقة</button>
        </div>
      )}

      {erg && (
        <div className="card" data-test="tor-ergebnis" style={{ padding: "0.7rem 0.9rem", background: erg.bestanden ? "var(--ui-green-soft)" : "var(--ui-gold-soft)", borderColor: erg.bestanden ? "var(--ui-green)" : "var(--ui-gold)" }}>
          <div style={{ fontWeight: 900 }}>
            {erg.bestanden ? `🎉 عبرتَ البوّابة — ${erg.gesamt}٪` : `⏳ لم تعبر بعد — ${erg.gesamt}٪`}
          </div>
          <div style={{ fontSize: "0.86rem", marginTop: "0.2rem" }}>
            {(["lesen", "hoeren", "schreiben", "sprechen"] as PruefTeil[]).map((t) => (
              <span key={t} style={{ marginInlineEnd: "0.7rem", color: (erg.teile[t] ?? 0) < FACH_SCHWELLE ? "#be123c" : "inherit" }}>
                {TEIL_AR[t]}: {erg.teile[t] ?? 0}٪
              </span>
            ))}
          </div>
          {!erg.bestanden && (
            <>
              <div style={{ fontSize: "0.86rem", marginTop: "0.3rem" }}>السبب: {erg.grund}</div>
              <div style={{ fontWeight: 800, marginTop: "0.4rem" }}>🛟 مسار الإنقاذ — ثلاثة أيام:</div>
              <ol style={{ margin: "0.2rem 1rem", fontSize: "0.85rem" }}>
                {rettungsplan(erg).map((r) => (
                  <li key={r.tag}>اليوم {r.tag} — {r.fokusAr}: {r.aufgabeAr}</li>
                ))}
              </ol>
              <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
                الإعادة متاحة بعد {24} ساعة، وبأسئلة مختلفة من البنك نفسه.
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
