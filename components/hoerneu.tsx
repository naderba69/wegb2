"use client";
// 🎧 استماع متنوّع (C5/R179): أخبار قصيرة وإعلانات ومقابلات بصوت مولّد بالذكاء
// الاصطناعي وموسوم به (KI)، مع فحص صوت آلي موثّق (R169). السرعات من المشغّل نفسه
// (playbackRate) لا من ملفات جديدة. خارج خطة الـ378 يومًا؛ النتائج للجلسة فقط.
import { useMemo, useRef, useState } from "react";
import { hoerneu, type HoerNeuItem } from "@/lib/content";
import { gemischteOptionen } from "@/lib/optionen";
import { speakDe } from "@/lib/speech";
import type { Modus } from "@/lib/hoeren";
import { ModusAbzeichen, ModusUmschalter } from "./modus";
import { RauschSteuerung } from "./rauschen";
import { De } from "./De";

const FORMAT_AR: Record<HoerNeuItem["format"], string> = {
  nachrichten: "أخبار قصيرة",
  durchsage: "إعلان صوتي",
  werbung: "إعلان تجاري",
  interview: "مقابلة",
};
const TEMPI = [0.75, 0.9, 1, 1.15] as const;

function clipText(item: HoerNeuItem, clipIdx: number): string {
  const c = item.clips[clipIdx];
  return c ? c.zeilen.map((z) => item.zeilen[z]?.de ?? "").join(" ") : "";
}

function ItemAnsicht({ item }: { item: HoerNeuItem }) {
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [gezeigt, setGezeigt] = useState(false);
  // 🎓/⚙️ M6+M20 (R289): وضع امتحان معمَّم — استماعة واحدة ونص مقفل حتى كشف النتيجة
  const [modus, setModus] = useState<Modus>("training");
  const [plays, setPlays] = useState(0);
  const pruefungGesperrt = modus === "pruefung" && !gezeigt;
  const wechselModus = (m: Modus) => { setModus(m); setPlays(0); setSkript(false); setSpielt(false); };
  const [skript, setSkript] = useState(false);
  const [tempo, setTempo] = useState<number>(1);
  const [spielt, setSpielt] = useState(false);
  const [clipIdx, setClipIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const punkte = item.fragen.filter((f) => antworten[f.id] === f.answer).length;
  const hatDateien = item.clips.every((c) => !!c.datei);

  const spieleClip = (idx: number, rate: number) => {
    const el = audioRef.current;
    const clip = item.clips[idx];
    if (!el || !clip?.datei) return;
    setClipIdx(idx);
    el.src = clip.datei;
    el.playbackRate = rate;
    const pr = el.play();
    if (pr && typeof pr.catch === "function") pr.catch(() => setSpielt(false));
    setSpielt(true);
  };

  const abspielen = () => {
    if (pruefungGesperrt && plays >= 1) return;
    setPlays((z) => z + 1);
    if (hatDateien) spieleClip(0, tempo);
    else speakDe(item.zeilen.map((z) => z.de).join(" "), { rate: tempo });
  };

  const onEnded = () => {
    if (clipIdx + 1 < item.clips.length) spieleClip(clipIdx + 1, tempo);
    else setSpielt(false);
  };

  return (
    <div>
      <audio ref={audioRef} onEnded={onEnded} preload="none" />
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", margin: "0.6rem 0" }}>
        <ModusUmschalter modus={modus} onWechsel={wechselModus} />
        <ModusAbzeichen modus={modus} />
        <button type="button" className="btn btn-primary" onClick={abspielen} disabled={pruefungGesperrt && plays >= 1}>
          {pruefungGesperrt && plays >= 1 ? "🔒 استُمعت المرة الواحدة (وضع الامتحان)" : spielt ? "↻ إعادة الاستماع" : "▶ استمع"}
        </button>
        <label className="small">
          السرعة:{" "}
          <select
            value={tempo}
            onChange={(e) => {
              const r = Number(e.target.value);
              setTempo(r);
              if (audioRef.current) audioRef.current.playbackRate = r;
            }}
          >
            {TEMPI.map((t) => (
              <option key={t} value={t}>
                {t === 1 ? "طبيعية (1×)" : `${t}×`}
              </option>
            ))}
          </select>
        </label>
        <RauschSteuerung />
        <button type="button" className="btn btn-ghost" disabled={pruefungGesperrt} onClick={() => setSkript((s) => !s)}>
          {pruefungGesperrt ? "🔒 النص مقفل حتى كشف النتيجة" : skript ? "إخفاء النص" : "إظهار النص (بعد الاستماع أولًا)"}
        </button>
      </div>
      {!hatDateien && (
        <p className="small">لا ملفَّ صوتَ لهذه المادة بعد — زرّ الاستماع يستخدم نطق متصفّح جهازك الآلي.</p>
      )}
      {skript && (
        <div style={{ margin: "0.5rem 0" }}>
          {item.zeilen.map((z, i) => (
            <p key={i} style={{ margin: "0.3rem 0" }}>
              <b>{z.who}:</b> <De>{z.de}</De>
              <br />
              <span className="small">{z.ar}</span>
            </p>
          ))}
        </div>
      )}
      <div style={{ marginTop: "0.8rem" }}>
        {item.fragen.map((f, i) => {
          const optionen = gemischteOptionen(f.options, item.id + f.id);
          const gewaehlt = antworten[f.id];
          return (
            <div key={f.id} className="card" style={{ padding: "0.7rem 0.9rem", marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: 600 }}>{i + 1}. <De>{f.promptDe}</De></div>
              <div className="small" style={{ marginBottom: "0.4rem" }}>{f.promptAr}</div>
              <div style={{ display: "grid", gap: "0.3rem" }}>
                {optionen.map((o) => {
                  const aktiv = gewaehlt === o;
                  const richtig = gezeigt && o === f.answer;
                  const falsch = gezeigt && aktiv && o !== f.answer;
                  return (
                    <button
                      key={o}
                      type="button"
                      className="btn"
                      disabled={gezeigt}
                      onClick={() => setAntworten((a) => ({ ...a, [f.id]: o }))}
                      style={{
                        textAlign: "start",
                        border: richtig ? "2px solid var(--color-good, #2e7d32)" : falsch ? "2px solid #c62828" : undefined,
                        fontWeight: aktiv ? 700 : 400,
                      }}
                    >
                      <De>{o}</De>
                    </button>
                  );
                })}
              </div>
              {gezeigt && <p className="small" style={{ marginTop: "0.4rem" }}>{f.explanationAr}</p>}
            </div>
          );
        })}
        {!gezeigt ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={Object.keys(antworten).length < item.fragen.length}
            onClick={() => setGezeigt(true)}
          >
            إظهار النتيجة
          </button>
        ) : (
          <p style={{ fontWeight: 700 }}>
            نتيجتك في هذه الجلسة: {punkte}/{item.fragen.length}
          </p>
        )}
      </div>
    </div>
  );
}

export function HoerNeu() {
  const [offenId, setOffenId] = useState<string | null>(null);
  const offen = useMemo(() => hoerneu.find((i) => i.id === offenId) ?? null, [offenId]);

  if (hoerneu.length === 0) {
    return <div className="card" style={{ padding: "0.9rem 1rem" }}>تُحمَّل موادّ الاستماع…</div>;
  }

  return (
    <section className="card" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)" }}>
      <h3 style={{ margin: 0 }}>🎧 استماع متنوّع — أخبار وإعلانات ومقابلات</h3>
      <p className="small" style={{ marginTop: "0.5rem", lineHeight: 1.9 }}>
        موادّ سماع جديدة بصيغ حقيقية (موجز أخبار، إعلان محطّة، إعلان تجاري، مقابلة) —{" "}
        <b>الصوت مولّد آليًا بالذكاء الاصطناعي (KI)</b> وخضع لفحص صوتٍ آليٍّ موثّق (اكتمال ووضوح وسرعة
        كلام)، وهو ليس تسجيلًا بشريًا. السرعة من المشغّل نفسه لا من ملفات جديدة. هذه الموادّ{" "}
        <b>خارج خطة الـ378 يومًا</b> ونتائجها للجلسة فقط.
      </p>
      {!offen ? (
        <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.6rem" }}>
          {hoerneu.map((i) => (
            <button
              key={i.id}
              type="button"
              className="card"
              style={{ padding: "0.7rem 0.9rem", textAlign: "start", cursor: "pointer" }}
              onClick={() => setOffenId(i.id)}
            >
              <De><b>{i.titelDe}</b></De>{" "}
              <span className="small">· صوت KI</span>
              <div className="small">
                {i.titelAr} · {FORMAT_AR[i.format]} · مستوى {i.level} · {i.fragen.length} أسئلة
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button type="button" className="btn btn-ghost" onClick={() => setOffenId(null)}>
            ← عودة إلى الموادّ
          </button>
          <h4 style={{ margin: "0.5rem 0" }}>
            <De>{offen.titelDe}</De> <span className="small">· {offen.titelAr} · {FORMAT_AR[offen.format]} · {offen.level} · صوت KI مولّد آليًا</span>
          </h4>
          <ItemAnsicht item={offen} />
        </div>
      )}
    </section>
  );
}
