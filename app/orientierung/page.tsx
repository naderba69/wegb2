"use client";
import { useEffect, useState } from "react";
import { bankRoh } from "@/lib/bankload";

type OriText = { id:string; level:string; titleDe:string; titleAr:string; de:string; ar:string; quelle?:string; questions:any[] };

export default function OrientierungPage(){
  const [texts, setTexts] = useState<OriText[]>([]);
  useEffect(()=>{
    try {
      const data = bankRoh("orientierung.json") as OriText[] | undefined;
      if (data) setTexts(Array.isArray(data) ? data : Object.values(data as any));
    } catch {}
  },[]);
  if (!texts.length) return <div className="card" style={{padding:"1rem"}}>⏳ جارٍ تحميل Orientierungskurs...</div>;
  return (
    <main className="container" style={{padding:"1rem", maxWidth:"900px", margin:"0 auto"}}>
      <h1 style={{fontWeight:900, fontSize:"1.4rem", marginBottom:"0.4rem"}}>🇩🇪 Orientierungskurs — BAMF 100UE</h1>
      <p style={{color:"var(--ui-muted)", lineHeight:1.7}}>20 نصًا (Grundgesetz Art.1-10, Geschichte 1945-1990, Leben in Deutschland) — pädagogische Nachbildung nach BAMF-Rahmencurriculum 700UE (600+100) — kein BAMF-Originaltext — vgl. BAMF Konzept 700UE S.12-34 und docs/PEDAGOGIK_REVIEW_2026-10-16.md — 100UE = 25 يومًا × 60 دقيقة (خارج 378 يومًا، مسار إضافي اختياري).</p>
      {texts.map(t=>(
        <section key={t.id} className="card" style={{padding:"1rem", margin:"0.8rem 0"}}>
          <h3 style={{fontWeight:800}}>{t.titleDe} <span style={{color:"var(--ui-muted)", fontWeight:400}}>— {t.titleAr}</span> <span className="chip">{t.id} · {t.level}</span></h3>
          <article style={{whiteSpace:"pre-wrap", lineHeight:1.9, background:"var(--color-paper2)", padding:"0.8rem", borderRadius:"8px", margin:"0.6rem 0"}}>{t.de}</article>
          <p style={{color:"var(--color-ink2)"}}>{t.ar}</p>
          {t.quelle && <div style={{fontSize:"0.75rem", color:"var(--ui-muted)", borderInlineStart:"3px solid var(--color-ink2)", padding:"0.4rem 0.6rem", marginTop:"0.5rem"}}>📚 المصدر: <span lang="de" dir="ltr">{t.quelle}</span></div>}
          <details style={{marginTop:"0.5rem"}}><summary>الأسئلة ({t.questions.length})</summary><ul>{t.questions.map((q:any)=><li key={q.id} style={{margin:"0.4rem 0"}}><strong>{q.promptDe}</strong> — {q.answer}</li>)}</ul></details>
        </section>
      ))}
    </main>
  );
}
