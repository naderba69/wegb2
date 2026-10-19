"use client";
// 🎮 R300: محطة ألعاب الكلمات — شبكة كلمات من مفرداتك، أكمل الحوار من حوارات البنوك، ترجم بنفسك من جمل البنوك
import { useEffect, useMemo, useState } from "react";
import { vocabMap, dialogues, sentences } from "@/lib/content";
import { bankenBereit, beiBankenBereit } from "@/lib/bankload";
import { baueWortgitter, dialogLuecke, uebersetzRunde, uebersetzQuote, fehlendeWoerter } from "@/lib/spiele";
import { STOFF_STUFEN } from "@/lib/lesestoff";
import { De } from "@/components/De";
import { useProgress } from "@/lib/store";
import { logK } from "@/lib/kompetenz";
import type { Level } from "@/lib/types";

type Spiel = "gitter" | "dialog" | "uebersetz";

const SPIELE: { id: Spiel; titel: string }[] = [
  { id: "gitter", titel: "🔤 شبكة الكلمات" },
  { id: "dialog", titel: "💬 أكمل الحوار" },
  { id: "uebersetz", titel: "✍️ ترجم بنفسك" },
];

/* ─────────────────────────── شبكة الكلمات ─────────────────────────── */
function WortGitterSpiel({ stufe }: { stufe: Level }) {
  const { update } = useProgress();
  const [samen, setSamen] = useState(1);
  const [auswahl, setAuswahl] = useState<[number, number][]>([]);
  const [gefundene, setGefundene] = useState<string[]>([]);
  const [meldung, setMeldung] = useState("");

  const pool = useMemo(() => {
    const out: { wort: string; ar: string }[] = [];
    for (const deck of Object.values(vocabMap)) {
      if (deck.level !== stufe) continue;
      for (const c of deck.cards) out.push({ wort: c.de, ar: c.ar });
    }
    return out;
  }, [stufe]);

  const runde = useMemo(() => baueWortgitter(pool, samen * 97 + stufe.charCodeAt(1)), [pool, samen, stufe]);

  useEffect(() => { setAuswahl([]); setGefundene([]); setMeldung(""); }, [runde]);

  const gefundeneZellen = useMemo(() => {
    const set = new Set<string>();
    for (const t of runde.treffer) if (gefundene.includes(t.wort)) for (const [r, c] of t.zellen) set.add(`${r}-${c}`);
    return set;
  }, [runde, gefundene]);

  const tippen = (r: number, c: number) => {
    setMeldung("");
    setAuswahl((alt) => {
      const key = (x: [number, number]) => `${x[0]}-${x[1]}`;
      const idx = alt.findIndex((x) => x[0] === r && x[1] === c);
      if (idx >= 0) return alt.slice(0, idx); // إعادة النقر تلغي من هنا
      if (alt.length > 0) {
        const [lr, lc] = alt[alt.length - 1];
        if (Math.abs(lr - r) > 1 || Math.abs(lc - c) > 1) return alt; // يجب أن تكون مجاورة
      }
      void key;
      return [...alt, [r, c] as [number, number]];
    });
  };

  const pruefen = () => {
    const wort = auswahl.map(([r, c]) => runde.gitter[r][c]).join("");
    const rueck = [...wort].reverse().join("");
    const treffer = runde.treffer.find((t) => !gefundene.includes(t.wort) && (t.wort === wort || t.wort === rueck));
    if (treffer) {
      if (gefundene.length + 1 === runde.treffer.length) update((p) => logK(p, "Wortschatz", true));
      setGefundene((g) => [...g, treffer.wort]);
      setMeldung(`✅ وجدتَ «${treffer.wort}» — ${treffer.ar}`);
    } else {
      setMeldung("💡 ليست كلمة من القائمة. راجع الحروف وحاول من جديد.");
    }
    setAuswahl([]);
  };

  if (pool.length < 8) return <div style={{ fontSize: "0.86rem" }}>لا كلمات كافية في هذا المستوى بعد — جرّب مستوى آخر.</div>;

  return (
    <div style={{ display: "grid", gap: "0.6rem" }} data-testid="spiel-gitter">
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
        الكلمات مخبأة أفقيًا وعموديًا. انقر الحروف بالترتيب (كل حرف بجانب الذي قبله) ثم «تحقق».
        وجدتَ <strong className="rtl-num">{gefundene.length}</strong> من <strong className="rtl-num">{runde.treffer.length}</strong>.
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {runde.treffer.map((t) => (
          <span key={t.wort} className="chip" style={{ textDecoration: gefundene.includes(t.wort) ? "line-through" : undefined, opacity: gefundene.includes(t.wort) ? 0.6 : 1 }}>
            {gefundene.includes(t.wort) ? "✓ " : ""}<De style={{ fontWeight: 700 }}>{t.wort}</De> · {t.ar}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "3px", maxWidth: "430px" }} role="grid" aria-label="شبكة الكلمات">
        {runde.gitter.map((zeile, r) =>
          zeile.map((buchstabe, c) => {
            const gewaehlt = auswahl.some(([ar, ac]) => ar === r && ac === c);
            const gefunden = gefundeneZellen.has(`${r}-${c}`);
            return (
              <button key={`${r}-${c}`} type="button" data-testid={`spiel-gitter-zelle-${r}-${c}`}
                onClick={() => tippen(r, c)} aria-label={`حرف ${buchstabe}`}
                style={{
                  minHeight: "40px", fontWeight: 800, fontSize: "1rem", borderRadius: "8px", cursor: "pointer",
                  border: "1px solid var(--color-line)",
                  background: gewaehlt ? "var(--color-gold)" : gefunden ? "var(--color-mint, #d1fae5)" : "var(--ui-surface-raised)",
                  color: gewaehlt ? "var(--ui-on-accent)" : undefined,
                }}>
                {buchstabe}
              </button>
            );
          })
        )}
      </div>
      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="btn btn-primary" data-testid="spiel-gitter-pruefen" style={{ minHeight: "46px" }} disabled={auswahl.length < 2} onClick={pruefen}>✔ تحقق</button>
        <button type="button" className="btn btn-ghost" data-testid="spiel-gitter-loeschen" style={{ minHeight: "46px" }} onClick={() => setAuswahl([])}>مسح الاختيار</button>
        <button type="button" className="btn btn-ghost" data-testid="spiel-gitter-neu" style={{ minHeight: "46px" }} onClick={() => setSamen((s) => s + 1)}>🔀 شبكة جديدة</button>
        {auswahl.length > 0 && <De style={{ fontWeight: 700 }}>{auswahl.map(([r, c]) => runde.gitter[r][c]).join("")}</De>}
      </div>
      {meldung && <div style={{ fontSize: "0.86rem" }} data-testid="spiel-gitter-meldung">{meldung}</div>}
      {gefundene.length === runde.treffer.length && runde.treffer.length > 0 && (
        <div style={{ fontSize: "0.9rem" }}>🏆 وجدتَ كل الكلمات! اضغط «شبكة جديدة» لجولة أخرى.</div>
      )}
    </div>
  );
}

/* ─────────────────────────── أكمل الحوار ─────────────────────────── */
function DialogSpiel({ stufe }: { stufe: Level }) {
  const { update } = useProgress();
  const [samen, setSamen] = useState(1);
  const [wahl, setWahl] = useState<string | null>(null);
  const runde = useMemo(
    () => dialogLuecke(dialogues.filter((d) => d.level === stufe), samen * 57 + 3),
    [samen, stufe]
  );
  useEffect(() => { setWahl(null); }, [runde]);

  if (!runde) return <div style={{ fontSize: "0.86rem" }}>لا حوار طويلًا بما يكفي في هذا المستوى — جرّب مستوى آخر.</div>;
  const { dialog, loch, optionen, richtig } = runde;

  return (
    <div style={{ display: "grid", gap: "0.6rem" }} data-testid="spiel-dialog">
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)" }}>
        💬 <De style={{ fontWeight: 700 }}>{dialog.titleDe}</De> — {dialog.titleAr} · اختر الجملة الناقصة:
      </div>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        {dialog.lines.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", padding: "0.35rem 0.55rem", borderRadius: "8px", background: i === loch ? "var(--color-gold-soft)" : undefined }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-ink2)", minWidth: "4.5rem" }}>{l.who}</span>
            {i === loch ? (
              <span style={{ fontWeight: 800 }}>{wahl ? <De>{richtig}</De> : "❓ ………………"}</span>
            ) : (
              <De>{l.de}</De>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: "0.4rem" }}>
        {optionen.map((opt) => {
          const istRichtig = wahl !== null && opt === richtig;
          const istFalsch = wahl === opt && opt !== richtig;
          return (
            <button key={opt} type="button" className="btn btn-ghost" data-testid={`spiel-dialog-opt-${opt.slice(0, 12)}`}
              disabled={wahl !== null} onClick={() => { setWahl(opt); update((p) => logK(p, "Lesen", opt === richtig)); }}
              style={{ minHeight: "48px", textAlign: "start", background: istRichtig ? "var(--color-mint, #d1fae5)" : istFalsch ? "var(--color-blush, #fee2e2)" : undefined }}>
              <De>{opt}</De> {istRichtig ? "✓" : istFalsch ? "✗" : ""}
            </button>
          );
        })}
      </div>
      {wahl && (
        <div style={{ fontSize: "0.86rem", lineHeight: 1.8 }} data-testid="spiel-dialog-feedback">
          {wahl === richtig ? "✅ أحسنت! هذه هي الجملة الأصلية من الحوار." : `💡 الجملة الصحيحة: «${richtig}» — ولاحظ معناها وارتباطها بما قبلها وبعدها.`}
          <div>المعنى: {dialog.lines[loch].ar}</div>
          <div>
            <button type="button" className="btn btn-primary" data-testid="spiel-dialog-neu" style={{ minHeight: "44px", marginTop: "0.35rem" }} onClick={() => setSamen((s) => s + 1)}>🔀 حوار آخر</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── ترجم بنفسك ─────────────────────────── */
function UebersetzSpiel({ stufe }: { stufe: Level }) {
  const { update } = useProgress();
  const [samen, setSamen] = useState(1);
  const [eingabe, setEingabe] = useState("");
  const [ergebnis, setErgebnis] = useState<number | null>(null);
  const satz = useMemo(() => uebersetzRunde(sentences, stufe, samen * 41 + 5), [samen, stufe]);
  useEffect(() => { setEingabe(""); setErgebnis(null); }, [satz]);

  if (!satz) return <div style={{ fontSize: "0.86rem" }}>لا جمل في هذا المستوى بعد — جرّب مستوى آخر.</div>;
  const fehlend = ergebnis !== null ? fehlendeWoerter(eingabe, satz.de) : [];

  return (
    <div style={{ display: "grid", gap: "0.6rem" }} data-testid="spiel-uebersetz">
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>اكتب الترجمة الألمانية لهذه الجملة بنفسك (بلا خيارات — الإنتاج الحقيقي):</div>
      <div style={{ fontSize: "1.15rem", fontWeight: 800, lineHeight: 1.9 }}>{satz.ar}</div>
      <textarea value={eingabe} onChange={(e) => { setEingabe(e.target.value); setErgebnis(null); }}
        data-testid="spiel-uebersetz-input" dir="ltr" lang="de" rows={2}
        placeholder="Schreibe den deutschen Satz hier …"
        style={{ width: "100%", padding: "0.6rem", borderRadius: "10px", border: "1px solid var(--color-line)", fontSize: "1rem", textAlign: "left" }} />
      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary" data-testid="spiel-uebersetz-pruefen" style={{ minHeight: "46px" }}
          disabled={!eingabe.trim()}
          onClick={() => { const q = uebersetzQuote(eingabe, satz.de); setErgebnis(q); update((p) => logK(p, "Schreiben", q >= 85)); }}>✔ صحّح</button>
        <button type="button" className="btn btn-ghost" data-testid="spiel-uebersetz-neu" style={{ minHeight: "46px" }} onClick={() => setSamen((s) => s + 1)}>🔀 جملة أخرى</button>
      </div>
      {ergebnis !== null && (
        <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.88rem", lineHeight: 1.85 }} data-testid="spiel-uebersetz-ergebnis">
          <div>
            تطابق الكلمات: <strong className="rtl-num">{ergebnis}%</strong> —{" "}
            {ergebnis >= 85 ? "🏆 ممتاز! ترجمتك شبه مطابقة." : ergebnis >= 60 ? "👍 قريب جدًا — راجع الكلمات الناقصة." : "💡 قارن مع الجملة النموذجية وحاول مرة أخرى."}
          </div>
          <div>الجملة النموذجية من البنك: <De style={{ fontWeight: 700 }}>{satz.de}</De></div>
          {fehlend.length > 0 && <div>كلمات ناقصة في ترجمتك: <De>{fehlend.join(" · ")}</De></div>}
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>التصحيح هنا آليّ بعدّ الكلمات المطابقة (يتسامح مع كتابة ae/oe/ue) — لا يقيّم كل بدائل الترجمة الصحيحة الممكنة.</div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── المحطة ─────────────────────────── */
export function SpieleStation() {
  const [spiel, setSpiel] = useState<Spiel>("gitter");
  const [stufe, setStufe] = useState<Level>("A1");
  const [bereit, setBereit] = useState(bankenBereit());

  useEffect(() => {
    if (bereit) return;
    beiBankenBereit(() => setBereit(true));
  }, [bereit]);

  return (
    <section className="card" data-testid="spiele-station" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>🎮 ألعاب الكلمات الحرة (من بنوك التطبيق نفسها)</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        ثلاث ألعاب قصيرة تثبّت ما تعلّمته: ابحث عن الكلمات، أكمِل الحوار، وترجم بكتابتك. للمتعة والثبيت — خارج خطة الـ378 يومًا.
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {SPIELE.map((s) => (
          <button key={s.id} type="button" className="chip" data-testid={`spiel-tab-${s.id}`}
            onClick={() => setSpiel(s.id)}
            style={{ cursor: "pointer", minHeight: "44px", background: spiel === s.id ? "var(--color-gold)" : undefined, color: spiel === s.id ? "var(--ui-on-accent)" : undefined }}>
            {s.titel}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }} role="group" aria-label="المستوى">
        {STOFF_STUFEN.map((s) => (
          <button key={s} type="button" className="chip" data-testid={`spiel-stufe-${s}`}
            onClick={() => setStufe(s)}
            style={{ cursor: "pointer", minHeight: "40px", background: stufe === s ? "var(--color-gold)" : undefined, color: stufe === s ? "var(--ui-on-accent)" : undefined }}>
            {s}
          </button>
        ))}
      </div>
      {!bereit ? (
        <div style={{ fontSize: "0.86rem" }}>البنوك تُحمَّل… لحظات وتبدأ اللعب.</div>
      ) : spiel === "gitter" ? (
        <WortGitterSpiel stufe={stufe} />
      ) : spiel === "dialog" ? (
        <DialogSpiel stufe={stufe} />
      ) : (
        <UebersetzSpiel stufe={stufe} />
      )}
    </section>
  );
}
