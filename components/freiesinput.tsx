"use client";
// 📻 A16 (R296): مدخل حرّ موسّع — جلسة استماع/قراءة حرّة من البنوك، وKI موسوم بندًا بندًا
import { useMemo, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import { getText, leseText } from "@/lib/content";
import { inputPaket } from "@/lib/freiesinput";
import { speakAny } from "@/lib/speech";
import type { Level } from "@/lib/types";

const STUFEN: (Level | "alle")[] = ["alle", "A1", "A2", "B1", "B2"];
const DAUERN = [10, 20, 30];

export function FreiesInput() {
  const { progress } = useProgress();
  const [stufe, setStufe] = useState<Level | "alle">("alle");
  const [dauer, setDauer] = useState(20);
  const [samen, setSamen] = useState(1);
  const [gehoert, setGehoert] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const paket = useMemo(() => inputPaket(stufe, dauer, progress.plan.day * 3 + samen), [stufe, dauer, samen, progress.plan.day]);
  const minuten = paket.reduce((a, i) => a + i.minuten, 0);
  const kiAnzahl = paket.filter((i) => i.ki).length;

  const spiele = (audio: string | null, textId?: string) => {
    if (audio && audioRef.current) {
      audioRef.current.src = audio;
      const pr = audioRef.current.play();
      if (pr && typeof pr.catch === "function") pr.catch(() => {});
      return;
    }
    if (textId) {
      const t = getText(textId);
      if (t) speakAny(leseText(t).de);
    }
  };

  return (
    <section className="card" data-testid="freies-input" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>📻 مدخل حرّ موسّع (A16) — استمع واقرأ بحرّية خارج خطة اليوم</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        جرعة إدخال ممتدة من بنوك التطبيق نفسها: حوارات ومواد ونصوص. كل بند مولّد بالذكاء الاصطناعي موسوم 🤖 KI كما هو، والتسجيلات المنزلية بلا وسم. تدريب استقبالي حرّ — بلا درجات.
      </div>
      <audio ref={audioRef} preload="none" />
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
        {STUFEN.map((s) => (
          <button key={s} type="button" className="chip" data-testid={`input-stufe-${s}`} onClick={() => setStufe(s)} style={{ cursor: "pointer", minHeight: "44px", background: stufe === s ? "var(--color-gold)" : undefined, color: stufe === s ? "var(--ui-on-accent)" : undefined }}>{s === "alle" ? "كل المستويات" : s}</button>
        ))}
        {DAUERN.map((d) => (
          <button key={d} type="button" className="chip" data-testid={`input-dauer-${d}`} onClick={() => setDauer(d)} style={{ cursor: "pointer", minHeight: "44px", background: dauer === d ? "var(--color-gold)" : undefined, color: dauer === d ? "var(--ui-on-accent)" : undefined }}>{d} دقيقة</button>
        ))}
        <button type="button" className="btn" data-testid="input-neu" onClick={() => { setSamen((s) => s + 1); setGehoert(new Set()); }}>🔀 تشكيلة أخرى</button>
      </div>
      <div style={{ fontSize: "0.85rem" }}>
        جلستك: <strong className="rtl-num">{paket.length}</strong> بندًا · نحو <strong className="rtl-num">{minuten}</strong> دقيقة · منها <strong className="rtl-num">{kiAnzahl}</strong> مولّد KI وموسوم.
      </div>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        {paket.map((item) => (
          <div key={`${item.art}-${item.id}`} style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", fontSize: "0.88rem" }}>
            <button type="button" className="btn btn-ghost" data-testid={`input-play-${item.id}`} onClick={() => { spiele(item.audio, item.art === "text" ? item.id : undefined); setGehoert((g) => new Set(g).add(`${item.art}-${item.id}`)); }}>
              {gehoert.has(`${item.art}-${item.id}`) ? "↻ أعد" : "▶ شغّل"}
            </button>
            <span><span className="de" dir="ltr" style={{ fontWeight: 700 }}>{item.titelDe}</span> · {item.titelAr} · {item.level} · ~{item.minuten} د</span>
            {item.ki && <span className="chip" style={{ fontSize: "0.72rem" }}>🤖 صوت KI مولّد</span>}
            {item.art === "dialog" && !item.ki && <span className="chip" style={{ fontSize: "0.72rem" }}>🏠 تسجيل دار بأدوار</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
