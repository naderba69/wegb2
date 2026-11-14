"use client";
import { useEffect, useState } from "react";
import { bankRoh } from "@/lib/bankload";
import { HighRiskContentNotice } from "@/components/high-risk-notice";

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
      <h1 style={{fontWeight:900, fontSize:"1.4rem", marginBottom:"0.4rem"}}>🇩🇪 تدريب توجيهي داخلي — موضوعات مدنية في ألمانيا</h1>
      <p style={{color:"var(--ui-muted)", lineHeight:1.7}}>20 نصاً مؤلفاً داخلياً لتدريب القراءة والمفردات حول الحقوق والتاريخ والحياة المدنية. ليست دورة BAMF ولا نصوصاً قانونية أو نموذج «Leben in Deutschland» رسمياً، ولم تُثبت مواءمتها أو حداثتها خارجياً.</p>
      <HighRiskContentNotice surfaceId="orientierung" />
      {texts.map(t=>(
        <section key={t.id} className="card" style={{padding:"1rem", margin:"0.8rem 0"}}>
          <h3 style={{fontWeight:800}}>{t.titleDe} <span style={{color:"var(--ui-muted)", fontWeight:400}}>— {t.titleAr}</span> <span className="chip">{t.id} · {t.level}</span></h3>
          <article style={{whiteSpace:"pre-wrap", lineHeight:1.9, background:"var(--color-paper2)", padding:"0.8rem", borderRadius:"8px", margin:"0.6rem 0"}}>{t.de}</article>
          <p style={{color:"var(--color-ink2)"}}>{t.ar}</p>
          {t.quelle && <div style={{fontSize:"0.75rem", color:"var(--ui-muted)", borderInlineStart:"3px solid var(--color-ink2)", padding:"0.4rem 0.6rem", marginTop:"0.5rem"}}>📝 وصف تأليفي داخلي غير متحقق، وليس إحالة رسمية: <span lang="de" dir="ltr">{t.quelle}</span></div>}
          <details style={{marginTop:"0.5rem"}}><summary>الأسئلة ({t.questions.length})</summary><ul>{t.questions.map((q:any)=><li key={q.id} style={{margin:"0.4rem 0"}}><strong>{q.promptDe}</strong> — {q.answer}</li>)}</ul></details>
        </section>
      ))}
    </main>
  );
}
