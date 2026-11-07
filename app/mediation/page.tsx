"use client";
import { useEffect, useState } from "react";
import { bankRoh } from "@/lib/bankload";

type Med = { id:string; level:string; titleDe:string; titleAr:string; taskDe:string; taskAr:string; quelle?:string };

export default function MediationPage(){
  const [tasks, setTasks] = useState<Med[]>([]);
  useEffect(()=>{
    try {
      const data = bankRoh("mediation.json") as Med[] | undefined;
      if (data) setTasks(Array.isArray(data) ? data : Object.values(data as any));
    } catch {}
  },[]);
  if (!tasks.length) return <div className="card" style={{padding:"1rem"}}>⏳ جارٍ تحميل Mediation...</div>;
  return (
    <main className="container" style={{padding:"1rem", maxWidth:"900px", margin:"0 auto"}}>
      <h1 style={{fontWeight:900, fontSize:"1.4rem", marginBottom:"0.4rem"}}>🔄 Mediation — CEFR Companion 2020</h1>
      <p style={{color:"var(--ui-muted)", lineHeight:1.7}}>10 مهام وسيطية (تلخيص، نقل معلومات، شرح رسم بياني، تبسيط، شفاعة) — مقاييس CEFR Companion 2020 فصل Mediation 19 — vgl. docs/PEDAGOGIK_REVIEW_2026-10-16.md — كل مهمة تُقيّم بـ Aufgabenerfüllung/Kommunikationsstrategie/Sprachmittel/Kohärenz.</p>
      {tasks.map(m=>(
        <section key={m.id} className="card" style={{padding:"1rem", margin:"0.8rem 0"}}>
          <h3 style={{fontWeight:800}}>{m.titleDe} <span style={{color:"var(--ui-muted)", fontWeight:400}}>— {m.titleAr}</span> <span className="chip">{m.id} · {m.level}</span></h3>
          <p style={{whiteSpace:"pre-wrap", lineHeight:1.9, background:"var(--color-paper2)", padding:"0.8rem", borderRadius:"8px"}}>{m.taskDe}</p>
          <p style={{color:"var(--color-ink2)"}}>{m.taskAr}</p>
          {m.quelle && <div style={{fontSize:"0.75rem", color:"var(--ui-muted)", borderInlineStart:"3px solid var(--color-ink2)", padding:"0.4rem 0.6rem", marginTop:"0.5rem"}}>📚 المصدر: <span lang="de" dir="ltr">{m.quelle}</span></div>}
        </section>
      ))}
    </main>
  );
}
