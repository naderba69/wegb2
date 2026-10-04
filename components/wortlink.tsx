"use client";
import { useState } from "react";
import type { VocabCard } from "@/lib/types";
import { POS_AR } from "@/lib/types";
import { karteFuerWort, verknuepfung } from "@/lib/verknuepfung";
import { erklaereAr } from "@/lib/komposita";
import { speakAny } from "@/lib/speech";
import { SynonymKontext } from "./SynonymKontext";

/**
 * نصٌّ ألمانيٌّ قابلٌ للنقر: كلُّ كلمةٍ لها بطاقةٌ تصيرُ زرًّا يفتحُ البطاقةَ (المعنى، المثال، المتلازمات، أين تظهرُ أيضاً).
 * الترابطُ ديناميكيٌّ: يُحسَبُ من الجذوعِ وقتَ العرض — لا روابطَ يدويّة.
 */
export function WortLinkText({ text, level, testid = "wortlink" }: { text: string; level?: string; testid?: string }) {
  const [offen, setOffen] = useState<VocabCard | null>(null);
  const tokens = text.split(/(\s+)/);
  return (
    <span data-testid={testid}>
      {tokens.map((tk, i) => {
        if (/^\s+$/.test(tk) || !tk) return <span key={i}>{tk}</span>;
        const kern = tk.replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
        const karte = kern.length >= 3 ? karteFuerWort(kern, level) : null;
        if (!karte) return <span key={i}>{tk}</span>;
        const aktiv = offen?.id === karte.id;
        return (
          <button key={i} type="button" data-testid="wortlink-wort" onClick={() => setOffen(aktiv ? null : karte)}
            style={{ all: "unset", cursor: "pointer", display: "inline-block", minHeight: "44px", lineHeight: "44px", padding: "0 0.05rem", borderBottom: aktiv ? "2px solid var(--color-gold)" : "1px dotted var(--color-ink2)", background: aktiv ? "var(--color-gold-soft)" : undefined }}
            aria-label={`${kern}: ${karte.ar}`}>{tk}</button>
        );
      })}
      {offen && <WortKarte karte={offen} onClose={() => setOffen(null)} />}
    </span>
  );
}

export function WortKarte({ karte, onClose }: { karte: VocabCard; onClose: () => void }) {
  const v = verknuepfung(karte);
  return (
    <span data-testid="wortkarte" dir="rtl" style={{ display: "block", margin: "0.5rem 0", padding: "0.7rem 0.9rem", borderRadius: "0.6rem", background: "var(--color-sand, #f3ede2)", fontSize: "0.9rem", lineHeight: 1.8 }}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "baseline" }}>
        <strong><span lang="de" dir="ltr">{karte.de}</span> — {karte.ar} <span style={{ fontSize: "0.75rem", color: "var(--color-ink2)" }}>({karte.level})</span>{" "}
        {karte.pos && <span data-testid="wortkarte-pos" className="chip" style={{ fontSize: "0.72rem" }}>🏷️ {karte.pos}{POS_AR[karte.pos] ? ` · ${POS_AR[karte.pos]}` : ""}</span>}</strong>
        <span>
          <button type="button" className="chip" onClick={() => speakAny(karte.de)}>🔊</button>{" "}
          <button type="button" className="chip" onClick={onClose} aria-label="إغلاق">✕</button>
        </span>
      </span>
      {karte.exampleDe && <span style={{ display: "block" }}><span lang="de" dir="ltr">{karte.exampleDe}</span><span style={{ display: "block", color: "var(--color-ink2)" }}>{karte.exampleAr}</span></span>}
      {(karte.ant?.length ?? 0) > 0 && (
        <span data-testid="wortkarte-synant" style={{ display: "block" }}>
          <span style={{ display: "block" }}>↔️ ضدّ: <span lang="de" dir="ltr">{karte.ant!.join(" · ")}</span></span>
        </span>
      )}
      <SynonymKontext karte={karte} testId="wortkarte-syn-context" />
      {v.komposita && (
        <span data-testid="wortkarte-komposita" style={{ display: "block", color: "var(--color-ink2)", fontSize: "0.85rem" }}>
          🧩 أصل المركّب: {v.komposita.teile.map((t, idx) => (
            <span key={idx}>
              {idx > 0 && " + "}
              <strong lang="de" dir="ltr">{t.article ? t.article + " " : ""}{t.lemma}</strong>{t.ar ? ` (${t.ar.split(/[:：/]/)[0].trim()})` : ""}
            </span>
          ))}
          <span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-ink3)" }}>
            {erklaereAr(v.komposita)}
          </span>
        </span>
      )}
      {v.kollokationen.length > 0 && <span data-testid="wortkarte-kollok" style={{ display: "block" }}>🧩 <span lang="de" dir="ltr">{v.kollokationen.join(" · ")}</span></span>}
      {v.partnerKarten.length > 0 && (
        <span data-testid="wortkarte-partner" style={{ display: "block", color: "var(--color-ink2)", fontSize: "0.85rem" }}>
          🔗 بطاقات شريكة: {v.partnerKarten.map((p) => (
            <span key={p.id} className="chip" style={{ fontSize: "0.78rem", marginInlineEnd: "0.25rem" }}>
              <span lang="de" dir="ltr"><strong>{p.de}</strong></span> ({p.ar})
            </span>
          ))}
        </span>
      )}
      {v.saetze.length > 0 && v.texte.length === 0 && v.dialoge.length === 0 && (
        <span data-testid="wortkarte-satz" style={{ display: "block", color: "var(--color-ink2)" }}>✍️ جملة تمرين: <span lang="de" dir="ltr">{v.saetze[0].de}</span></span>
      )}
      {(v.texte.length > 0 || v.dialoge.length > 0) && (
        <span data-testid="wortkarte-vorkommen" style={{ display: "block", color: "var(--color-ink2)" }}>
          📚 تظهر أيضاً في: {v.texte.map((t) => t.titleDe).slice(0, 3).join(" · ")}{v.texte.length && v.dialoge.length ? " · " : ""}{v.dialoge.map((d) => d.titleDe).slice(0, 3).join(" · ")}
        </span>
      )}
    </span>
  );
}
