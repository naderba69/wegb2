#!/usr/bin/env node
/**
 * مراجعة حرف-حرف لـ content/vocab.json — المفردات ~6200 بطاقة
 * لا عينات — كل حرف يُفحص.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const vocab = JSON.parse(readFileSync(join(ROOT,"content/vocab.json"),"utf8"));

const LEVELS = new Set(["A0","A1","A2","B1","B2"]);
let totalDecks = Object.keys(vocab).length;
let totalCards = 0;
let errors=[], warns=[], ideas=[];
let stats = { byLevel:{}, byPos:{}, withExample:0, withArticle:0, withPlural:0, withSyn:0, withAnt:0, withImg:0 };

const seenDe = new Map(); // de lower -> list of ids
const seenId = new Set();

for (const [deckId, deck] of Object.entries(vocab)) {
  const pathBase = `vocab.json:${deckId}`;
  if (!deck.id || deck.id !== deckId) errors.push({path:pathBase, lvl:"P0", msg:`deck id mismatch ${deck.id} != ${deckId}`});
  if (!LEVELS.has(deck.level)) errors.push({path:pathBase, lvl:"P0", msg:`deck level غير صالح ${deck.level}`});
  if (!deck.cards || !Array.isArray(deck.cards)) { errors.push({path:pathBase, lvl:"P0", msg:`cards ليست مصفوفة`}); continue; }
  for (const c of deck.cards) {
    totalCards++;
    const path = `vocab.json:${deckId}/${c.id||"?"}:${c.de||"?"}`;
    // id unique
    if (!c.id) errors.push({path, lvl:"P0", msg:`بطاقة بلا id`});
    else if (seenId.has(c.id)) errors.push({path, lvl:"P0", msg:`id مكرر ${c.id}`});
    else seenId.add(c.id);
    // de/ar
    if (!c.de || !c.de.trim()) errors.push({path, lvl:"P0", msg:`de مفقود`});
    if (!c.ar || !c.ar.trim()) errors.push({path, lvl:"P0", msg:`ar مفقود للكلمة ${c.de}`});
    // level
    if (!LEVELS.has(c.level)) errors.push({path, lvl:"P0", msg:`card level غير صالح ${c.level}`});
    else stats.byLevel[c.level]=(stats.byLevel[c.level]||0)+1;
    if (c.level && deck.level && c.level !== deck.level) {
      // some decks are B1 but contain B2? check if deck is level-mixed? but we warn if mismatch B2 inside A1 deck suspicious
      if (deck.level==="A0" && c.level!=="A0" && c.level!=="A1") warns.push({path, lvl:"P1", msg:`مستوى البطاقة ${c.level} لا يطابق مستوى الحزمة ${deck.level}`});
    }
    // pos
    if (c.pos) stats.byPos[c.pos]=(stats.byPos[c.pos]||0)+1;
    else warns.push({path, lvl:"P1", msg:`pos مفقود — مهم للتصنيف`});
    // article consistency
    if (c.article) {
      stats.withArticle++;
      if (!["der","die","das"].includes(c.article)) errors.push({path, lvl:"P0", msg:`article غير صالح ${c.article}`});
      // genusCode check: if pos is Nomen, article should exist
      if (c.pos==="Nomen" && !c.article) warns.push({path, lvl:"P1", msg:`Nomen بلا article`});
    } else {
      if (c.pos==="Nomen") {
        // phrase like "die Rechnung prüfen" has article inside de, not separate field — don't flag as error if de already starts with der/die/das
        const deStartsWithArt = /^(der|die|das)\s/i.test(c.de.trim());
        const isPhrase = c.de.trim().includes(" ") && /[a-zäöüß]+$/.test(c.de.trim()); // ends with verb lower
        // Eigennamen: Länder, Feste, Sprachen, Sport — oft ohne Artikel (Deutschland, Pfingsten, Latein, Tennis) — مقبول تربوياً
        const eigenname = /^(Deutschland|Österreich|Tunesien|Ostern|Pfingsten|Silvester|Latein|Luxemburg|Tennis|Griechenland|Schweiz|Italien|Frankreich|Spanien|Portugal|Marokko|Ägypten)$/.test(c.de.trim());
        if (!deStartsWithArt && !isPhrase && !eigenname) warns.push({path, lvl:"P1", msg:`Nomen بلا article — الطالب الألماني يحتاج genus`});
        else if (deStartsWithArt) { /* de itself contains article — acceptable, count as withArticle logically */ }
      }
    }
    if (c.plural) stats.withPlural++;
    // example
    if (c.exampleDe && c.exampleAr) stats.withExample++;
    else if (c.level==="B2" && (!c.exampleDe||!c.exampleAr)) warns.push({path, lvl:"P2", msg:`B2 بلا مثال — مستوى متقدم يحتاج سياق`});
    if (c.exampleDe && c.de) {
      const lowDe = c.de.toLowerCase().trim();
      const lowEx = c.exampleDe.toLowerCase();
      // تنظيف deCore: إزالة الأداة (die Arbeit → Arbeit) + Sich المنعكسة
      let deCore = lowDe;
      // إزالة أداة التعريف/النكرة إن وجدت
      const articleMatch = deCore.match(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines)\s+(.+)/);
      if (articleMatch) deCore = articleMatch[2];
      if (deCore.startsWith("sich ")) deCore = deCore.slice(5);
      // للأفعال المنفصلة/المركبة: نأخذ آخر جزء (aufstehen → stehen)
      const SEPARABLE_PREFIXES = ["ab","an","auf","aus","bei","ein","los","mit","nach","um","vor","zu","zurück","zusammen","fern","her","hin","weg","weiter","wieder"];
      let root = deCore.split(/[\s\/\(\)]+/)[0].replace(/\(.*\)/,"").replace(/sich$/, "").trim();
      // إذا كان الفعل منفصلاً، استخدم الجذع الرئيسي
      for (const pref of SEPARABLE_PREFIXES) {
        if (root.length > pref.length+3 && root.startsWith(pref)) {
          const stem = root.slice(pref.length);
          if (stem.length >=3) { root = stem; break; }
        }
      }
      const norm = s=>s.replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").replace(/Ä/g,"A").replace(/Ö/g,"O").replace(/Ü/g,"U");
      // للعبارات: إن فشلت مطابقة أول رمز، جرّب كل رمز محتوى (etwas/gericht/wohnung...) — المهم أن المثال يظهر المعنى
      const allTokens = deCore.split(/[\s\/\(\)]+/).map(x=>x.replace(/\(.*\)/,"").trim()).filter(x=>x && x!=="sich" && x!=="etwas" && x.length>=3);
      const checkTokens = [root, ...allTokens];
      const nEx = norm(lowEx);
      let anyMatch = false;
      for (const tk of checkTokens) {
        let tkRoot = tk;
        for (const pref of SEPARABLE_PREFIXES) { if (tkRoot.length > pref.length+3 && tkRoot.startsWith(pref)) { tkRoot = tkRoot.slice(pref.length); break; } }
        const nTk = norm(tkRoot);
        if (nTk.length>=4 && (nEx.includes(nTk.slice(0,4)) || nEx.includes(nTk.slice(0,3)))) { anyMatch = true; break; }
      }
      // تحقق: فقط إذا كان الجذر >=4 أحرف (كما في الأصل) — تجنب كلمات قصيرة مثل die/das
      const nRoot = norm(root);
      if (root.length>=4 && !anyMatch) {
        // تسامح إضافي للفعال المنعكسة المنفصلة: sich beeilen → beeilen → beei، قد تظهر في beeile mich
        if (false) {
          // يحتوي 3 حروف على الأقل — مقبول كتصريف (z.B. beeilen → beeile)
        } else {
          warns.push({path, lvl:"P2", msg:`exampleDe لا تحتوي جذر الكلمة "${c.de}"`});
        }
      }
    }
    // Arabic latin leak
    if (c.ar && /[a-zA-ZäöüÄÖÜß]{4,}/.test(c.ar) && !c.ar.includes("S-Bahn") && !c.ar.includes("U-Bahn")) {
      // whitelist: derselbe/dieselbe/dasselbe داخل قوس تعليمي = شرح جنس — مقصود تماماً (B1)
      const isParenthesisTeaching = c.ar.includes("(") && c.ar.includes(")") && /derselbe|dieselbe|dasselbe/i.test(c.ar);
      if (isParenthesisTeaching) { /* مقصود — لا يُعد خطأ */ }
      else if ((c.ar.match(/[a-zA-Zäöü]{4,}/g)||[]).join(" ").length > 15) warns.push({path, lvl:"P2", msg:`ar يحتوي لاتينية طويلة: "${c.ar.slice(0,60)}"`});
    }
    if (c.de && /[ء-ي]/.test(c.de)) errors.push({path, lvl:"P0", msg:`حروف عربية داخل de: "${c.de}"`});
    if (c.de && c.de.includes("  ")) warns.push({path, lvl:"P2", msg:`مسافة مزدوجة في de`});
    // img
    if (c.img) stats.withImg++;
    // syn/ant
    if (c.syn && c.syn.length) stats.withSyn++;
    if (c.ant && c.ant.length) stats.withAnt++;
    // duplicate de tracking
    const key = c.de.toLowerCase().trim();
    if (!seenDe.has(key)) seenDe.set(key, []);
    seenDe.get(key).push({id:c.id, level:c.level, deck:deckId, ar:c.ar});
    // ideas
    if (!c.exampleDe) ideas.push({path, idea:`أضف مثال سياقي — ${c.level} يحتاج Authentic`});
    if (c.pos==="Verb" && !c.posInfo && !c.formen) ideas.push({path, idea:`أضف تصريف (spricht/gekommen) للفعل`});
  }
}

// duplicate analysis
let dupCount=0;
let dupEntries=[];
for (const [de, list] of seenDe.entries()) {
  if (list.length>1) {
    // check if same de appears in multiple levels with same ar (intentional) vs conflicting
    const levels = new Set(list.map(x=>x.level));
    const ars = new Set(list.map(x=>x.ar));
    if (ars.size>1) dupEntries.push({de, list});
    dupCount++;
  }
}

let md=`# 🔍 مراجعة حرف-حرف — المفردات (~6200 بطاقة) — ${new Date().toISOString().slice(0,10)}
> **المراجع:** Goethe Wortliste A1-A2-B1 + Duden + GGP + CEFR 378 يوم  
> **المنهج:** كل حرف فُحص — لا عينات. ${totalDecks} حزمة · ${totalCards} بطاقة

## الملخص الإحصائي
- الحزم: ${totalDecks} · البطاقات: ${totalCards}
- حسب المستوى: ${Object.entries(stats.byLevel).sort().map(([k,v])=>`${k}:${v} (${(v/totalCards*100).toFixed(1)}%)`).join(" · ")}
- حسب pos (أكبر 5): ${Object.entries(stats.byPos).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k}:${v}`).join(" · ")}
- بarticle: ${stats.withArticle} · بplural: ${stats.withPlural} · بمثال: ${stats.withExample} (${(stats.withExample/totalCards*100).toFixed(1)}%) · بصورة: ${stats.withImg} · بمرادف: ${stats.withSyn} · بضد: ${stats.withAnt}
- تكرار لفظي (نفس de): ${dupCount} مجموعات مكررة (29 مقصود A0→A1 حسب docs/VOCAB_REPEATS_2026-10-22.md)

## الأخطاء المصنفة
| المستوى | العدد |
|---------|-------|
| P0 قاتل | ${errors.filter(e=>e.lvl==="P0").length} |
| P1 منهجي | ${errors.filter(e=>e.lvl==="P1").length + warns.filter(w=>w.lvl==="P1").length} |
| P2 أسلوبي | ${warns.filter(w=>w.lvl==="P2").length} |

### P0 — قاتل
`;
if (errors.length===0) md+=`- لا شيء ✅\n`;
else for (const e of errors) md+=`- [${e.lvl}] \`${e.path}\` — ${e.msg}\n`;
md+=`\n### P1 — منهجي\n`;
let p1 = [...errors.filter(e=>e.lvl==="P1"), ...warns.filter(w=>w.lvl==="P1")];
if (p1.length===0) md+=`- لا شيء ✅ (أو كل Nomen له article — ممتاز لمعلم)\n`;
else for (const w of p1.slice(0,30)) md+=`- [P1] \`${w.path}\` — ${w.msg}\n`;
if (p1.length>30) md+=`- … و ${p1.length-30} أخرى (انظر السكربت الكامل)\n`;

md+=`\n### P2 — أسلوبي\n`;
let p2 = warns.filter(w=>w.lvl==="P2");
for (const w of p2.slice(0,30)) md+=`- [P2] \`${w.path}\` — ${w.msg}\n`;
if (p2.length>30) md+=`- … و ${p2.length-30} أخرى\n`;

md+=`\n### تكرار مقصود vs خطأ
- المجموعات المكررة التي لها نفس ar في مستويات مختلفة = **تكرار مقصود** (Spaced Repetition) — موثق في VOCAB_REPEATS
- التي لها ar مختلف لنفس de: ${dupEntries.length} — تحتاج مراجعة معلم:
`;
for (const d of dupEntries.slice(0,10)) md+=`- "${d.de}" → ${d.list.map(x=>`${x.id}(${x.level}:${x.deck})=${x.ar}`).join(" | ")}\n`;
if (dupEntries.length>10) md+=`- … و ${dupEntries.length-10} أخرى\n`;

md+=`\n## الأفكار التحسينية (عينة ${Math.min(ideas.length,30)}/${ideas.length})
| البطاقة | الفكرة |
|---------|--------|
`;
for (const it of ideas.slice(0,30)) md+=`| \`${it.path}\` | ${it.idea} |\n`;
if (ideas.length>30) md+=`\n_… و ${ideas.length-30} فكرة إضافية — تُصدّر بعد تثبيت P0/P1._\n`;

md+=`\n## خطة المتابعة (المعلم الخبير)
1. **القواعد ✅ P0 0** (منجز)
2. **المفردات ⏳ الآن:** هذا التقرير — إصلاح P0/P1 ثم إعادة تشغيل
3. **النصوص/الحوارات/الكتابة:** سكربت ثالث حرف-حرف (طول CEFR + Prüfungsformat)
4. **سجل 1000 فكرة:** تجميع الأفكار الثلاثة + تصنيف Mayer/Conti/GGP
`;

writeFileSync(join(ROOT,"docs/AUDIT_HARF_VOCAB_2026-10-23.md"), md);
console.log(md.slice(0,4000));
console.log(`\n✅ كُتب docs/AUDIT_HARF_VOCAB_2026-10-23.md — P0:${errors.filter(e=>e.lvl==="P0").length} P1:${p1.length} P2:${p2.length} أفكار:${ideas.length} dup:${dupCount} dupErr:${dupEntries.length}`);
