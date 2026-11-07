/**
 * Kultur-Notizen für B1/B2 — Sprint 4C (لا بيانات جديدة للامتحان)
 * كل درس B1/B2 له لمسة ثقافية قصيرة: كيف يُستعمل النمط في الحياة الألمانية.
 * المرجع: Goethe/Rahmencurriculum + مستوى الاستعمال الحقيقي (Schriftlich vs Mündlich)
 */
export const KULTUR_NOTIZEN: Record<string, { de: string; ar: string }> = {
  // B1 Konnektoren
  "b1-konnektoren": { de: "In E-Mails an Behörden: „deshalb“ wirkt förmlich, „darum“ neutral — im Amt lieber „deshalb“. Mündlich reicht „also“.", ar: "في مراسلات الإدارات: deshalb رسمي، darum محايد، mündlich يكفي also." },
  "b1-konnektoren-v1": { de: "Trotz + Genitiv klingt in Anträgen sehr förmlich (‚trotz des Fehlers‘) — mündlich sagen viele ‚trotz dem Fehler‘.", ar: "trotz + Genitiv رسمي جداً في الطلبات — شفهياً يقال trotz dem Fehler." },
  "b1-passiv": { de: "Auf Baustellen-Schildern: ‚Wird gebaut‘ = Vorgangspassiv — im Amt Standard. Mündlich: ‚Man baut hier.‘", ar: "على لوحات البناء: Wird gebaut = مبني للمجهول — في الإدارة أساسي." },
  "b1-genitiv": { de: "Genitiv in Briefen: ‚wegen des Wetters‘ — in Chats schreiben Deutsche oft ‚wegen dem Wetter‘ (kolloquial). Prüfung will Genitiv.", ar: "Genitiv في الرسائل: wegen des Wetters — في الدردشة يكتبون wegen dem Wetter عامي." },
  "b1-relativ": { de: "Relativsätze mit ‚die/der‘ sind in Bewerbungen Standard: ‚die Stelle, die ich suche.‘", ar: "الجمل الموصولة بـ die/der أساسية في طلبات التوظيف." },
  "b1-plusquamperfekt": { de: "‚Nachdem ich gegessen hatte, ging ich…‘ — Zeitfolge in Berichten; mündlich oft vereinfacht.", ar: "بعد أن أكلت ذهبت — التسلسل الزمني في التقارير." },
  "b1-konj2": { de: "Höfliche Bitte: ‚Könnten Sie mir helfen?‘ — ohne Konjunktiv wirkt unhöflich im Amt.", ar: "طلب مهذب: Könnten Sie…؟ — بدون Konjunktiv يبدو غير مهذب في الإدارة." },
  // B2
  "b2-nominalstil": { de: "Behördenbriefe lieben Nominalstil: ‚Zur Prüfung der Unterlagen…‘ — im Gespräch sagt man ‚Weil wir prüfen…‘.", ar: "رسائل الإدارات تحب Nominalstil: Zur Prüfung… — شفهياً: Weil wir prüfen…" },
  "b2-indirekte-rede": { de: "Presse: ‚Er sagte, er sei krank‘ — Konjunktiv I signalisiert Distanz, nicht Lüge. In Chats wird oft Indikativ genutzt.", ar: "الصحافة: Er sagte, er sei krank — Konjunktiv I يعني نقلاً لا تكذيباً." },
  "b2-bedingung": { de: "Verträge: ‚Sollte es regnen, entfällt…‘ — Konjunktiv II als Bedingung ohne ‚wenn‘, typisch Rechtstexte.", ar: "العقود: Sollte es regnen… — شرط بدون wenn، شائع قانونياً." },
  "b2-funktionsverben": { de: "Amt/Mail: ‚in Kraft treten‘ statt ‚anfangen zu gelten‘ — Funktionsverbgefüge = Verwaltungssprache.", ar: "الإدارة: in Kraft treten = يدخل حيز التنفيذ — لغة إدارية." },
  "b2-infinitiv": { de: "Anleitungen: ‚ohne zu fragen‘ vs ‚damit man nicht fragt‘ — Infinitiv kürzer = schriftlich bevorzugt.", ar: "التعليمات: ohne zu fragen أقصر = مفضل كتابياً." },
  "b2-partizip": { de: "Zeitung: ‚die gestern getroffene Entscheidung‘ — vorangestelltes Partizip = kompakte Information.", ar: "الصحف: die getroffene Entscheidung — النعت قبل الاسم = تكثيف." },
  "b2-textkonnektoren": { de: "Wissenschaftliche E-Mails: ‚einerseits… andererseits‘, ‚dennoch‘ — zeigen Struktur, nicht nur Inhalt.", ar: "المراسلات العلمية: einerseits… andererseits تظهر الهيكل." },
  "b2-genitiv-praep": { de: "‚trotz des Streiks‘ (Genitiv) vs ‚trotz dem Streik‘ (Dativ, umgangssprachlich) — Prüfung testet Genitiv, Alltag toleriert Dativ.", ar: "trotz des Streiks رسمي Genitiv، trotz dem Streik عامي Dativ — الامتحان يطلب Genitiv." },
  "b2-konzessiv": { de: "Debatten: ‚obwohl es regnete, kamen wir‘ — Konzession ohne Genitiv-Präposition, mündlich häufig.", ar: "المناظرات: obwohl es regnete… — تنازل بدون حرف جر Genitiv." },
  "b2-doppelkonnektoren": { de: "Vorträge: ‚einerseits gut, andererseits teuer‘ — Doppelkonnektoren strukturieren Argumente B2 mündlich.", ar: "المحاضرات: einerseits… andererseits — روابط مزدوجة تنظم الحجج." },
  "b2-modalpartikel": { de: "‚Das ist ja interessant!‘ — Modalpartikel ja/doch geben Bewertung, nicht Information. In Prüfungen vorsichtig nutzen.", ar: "ja/doch تعطي تقييماً لا معلومة — في الامتحان استخدمها بحذر." },
  "b2-futur-ii": { de: "Vermutung Vergangenheit: ‚Er wird es vergessen haben‘ — Futur II als Vermutung, typisch B2+, nicht Alltag.", ar: "تخمين ماضٍ: wird vergessen haben — تخمين، نمط B2+." },
  // fallback generic
  "__b1__": { de: "In Anträgen: Genitiv + Nebensätze = förmlich. In Chats kürzer. B1 prüft den Wechsel.", ar: "في الطلبات: Genitiv + جمل ثانوية = رسمي. في الدردشة أقصر." },
  "__b2__": { de: "Schriftlich: Nominalstil + Passiv + Genitiv-Präpositionen. Mündlich: aktiv + Verbalstil. B2 prüft Registerwechsel.", ar: "كتابياً: Nominalstil + مبني للمجهول + حروف Genitiv. شفهياً: مبني للمعلوم. B2 يختبر التبديل." },
};

export function kulturFuer(topicId: string, level: string): { de: string; ar: string } | null {
  if (KULTUR_NOTIZEN[topicId]) return KULTUR_NOTIZEN[topicId];
  if (level === "B1") return KULTUR_NOTIZEN["__b1__"];
  if (level === "B2") return KULTUR_NOTIZEN["__b2__"];
  return null;
}
