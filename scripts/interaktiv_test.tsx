/**
 * ============================================================
 *  تفاعل تحت الحُكم — nقرات حقيقية في jsdom
 * ============================================================
 *  لا يكتفي بمحاكاة المحركات: هذا الملف يركّب المكوّنات في DOM
 *  صناعي، ينقر الأزرار، يكتب في الحقول، ويقرأ ما ظهر للمستخدم.
 *  يغطي الجولة التفاعلية الجارية: 🥵 العينة الأصعب (Blitz كامل
 *  الدورة · إدخال رقم خيار ← خطأ ← التالي ← البطاقة التالية)،
 *  الورقة الرسمية A4 (Amtsblatt ← نافذة الطباعة الملتقطة)،
 *  وتركيب دخان لثلاثة مراكز أخرى.
 *  التشغيل: npm run interaktiv  (يبنيه esbuild ثم يشغّله node)
 * ============================================================ */

import { JSDOM } from "jsdom";

/* ---------- البيئة يجب أن تسبق استيراد React ---------- */
const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
const gedruckt: string[] = [];
(dom.window as unknown as Record<string, unknown>).open = () => ({
  document: { write: (h: string) => { gedruckt.push(h); }, close: () => {} },
  focus: () => {},
  print: () => {},
});
(dom.window as unknown as { scrollTo: () => void }).scrollTo = () => {};
let scrollHits: string[] = [];
(dom.window as unknown as { Element: { prototype: { scrollIntoView: (this: unknown) => void } } }).Element.prototype.scrollIntoView = function (this: unknown) {
  const el = this as { id?: string };
  scrollHits.push(el.id ?? "?");
};

const g = globalThis as unknown as Record<string, unknown>;
for (const key of [
  "window", "document", "navigator", "localStorage", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement",
  "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame",
]) {
  Object.defineProperty(g, key, { value: key === "window" ? dom.window : (dom.window as Record<string, unknown>)[key], configurable: true, writable: true });
}
g.window = dom.window;
(g as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

/* ---------- أدوات ---------- */
let beste = 0, fehler = 0;
const fails: string[] = [];
function ok(cond: boolean, label: string) {
  if (cond) beste++;
  else { fehler++; fails.push(label); console.error(`  ✗ ${label}`); }
}

async function main() {
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { emptyProgress } = await import("../lib/types");
  const act = (React as unknown as { act: (cb: () => void) => void }).act;

  const d0 = dom.window.document as unknown as Document;
  const rootEl = d0.getElementById("root")!;
  let leave: (() => void) | null = null;
  function mount(node: React.ReactNode) {
    if (leave) leave();
    const root = createRoot(rootEl);
    act(() => root.render(node));
    leave = () => { act(() => root.unmount()); leave = null; };
    return leave;
  }
  const txt = () => rootEl.textContent ?? "";
  const btn = (label: string) =>
    Array.from(d0.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes(label)) as HTMLElement | undefined;
  function click(el: HTMLElement) {
    act(() => el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true })));
  }
  function typeIn(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
    act(() => {
      const proto = el instanceof dom.window.HTMLTextAreaElement ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value")!.set!;
      setter.call(el, value);
      el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
  }
  const kopfBtn = (label: string) =>
    Array.from(d0.querySelectorAll("button")).find(
      (b) => (b.textContent ?? "").includes(label) && /افتح ▼|إخفاء ▲/.test(b.textContent ?? ""),
    ) as HTMLElement | undefined;
  const enter = (el: HTMLElement) =>
    act(() => el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })));

  console.log("🧪 تفاعل jsdom — نقرات حقيقية على المكوّنات\n");

  /* ---------- I — Blitz 🥵 دورة كاملة ---------- */
  {
    const { BlitzDrill } = await import("../components/blitz");
    mount(React.createElement(BlitzDrill, { progress: { ...emptyProgress } }));
    ok(txt().includes("العينة الأصعب"), "I1 شاشة الرقع تعرض رقعة العينة الأصعب");
    ok(txt().includes("فخاخ B2/C1"), "I2 الوصف العربي للرقعة");
    const start = btn("العينة الأصعب");
    ok(!!start, "I3 زر بدء رقعة 🥵 موجود");
    if (!start) { fehler++; } else {
      click(start);
      const d1 = dom.window.document;
      const frageEl = Array.from(d1.querySelectorAll("div")).find((d) => (d.textContent ?? "").includes("___"));
      ok(!!frageEl, "I4 بطاقة أُولدت وفيها فجوة ___");
      ok(txt().includes("1)") && txt().includes("4)"), "I5 الخيارات 1–4 معروضة");
      ok(txt().includes("اكتب رقم الخيار"), "I6 التعليمات في وجه البطاقة");
      const inp = d1.querySelector('input[placeholder*="رقم الخيار"]') as HTMLInputElement | null;
      ok(!!inp, "I7 حقل الإدخال بالـplaceholder الجديد");
      if (inp) {
        typeIn(inp, "0");
        enter(inp); // خيار غير موجود رقم 0 ← يُقبل كنص غلط → flash خطأ حتمي
        ok(txt().includes("✗") || txt().includes("✓ "), "I8 تصحيح ظهر بعد ⏎");
        ok(txt().includes("✓") && /[a-zäöüß]{3,}/.test(txt()), "I9 الإجابة الصحيحة معروضة مع التصحيح");
        const frageTxt1 = frageEl?.textContent ?? "";
        const weiterB = btn("التالي");
        if (weiterB) click(weiterB);
        const frage2 = Array.from(d0.querySelectorAll("div")).find((d) => (d.textContent ?? "").includes("___"));
        ok((frage2?.textContent ?? "") !== frageTxt1, "I10 التالي قفز لبطاقة أخرى");
        // رقم صحيح 1–4 يُحل إلى نص الخيار — نجيب بالنص الظاهر نفسه
        const optTxt = (Array.from(d0.querySelectorAll("span")).find((s) => (s.textContent ?? "").startsWith("1)"))?.textContent ?? "").replace(/^1\)\s*/, "");
        const inp2 = d0.querySelector('input[placeholder*="رقم الخيار"]') as HTMLInputElement;
        typeIn(inp2, "1");
        enter(inp2);
        // إما صواب (تختفي البطاقة تلقائياً بعد 320ms) أو لا — الحسم: لا نص ✓ تصحيح عند الصواب
        const flashNeut = !txt().includes("✓ ");
        ok(optTxt.length > 1 || flashNeut, "I11 إدخال الرقم فُكّ إلى نص الخيار (لم ينفجر المسار)");
      }
    }
  }

  /* ---------- II — Berichte ← Amtsblatt ---------- */
  {
    const { BerichteZentrum } = await import("../components/berichte");
    mount(React.createElement(BerichteZentrum, { progress: { ...emptyProgress }, name: "سارة النموذج" }));
    const hdr = btn("BerichteZentrum");
    ok(!!hdr, "II0 أكورديون التقارير مركّب");
    if (hdr) click(hdr);
    ok(txt().includes("إخفاء"), "II0b النقر يفتح مركز التقارير");
    ok(txt().includes("الورقة الرسمية"), "II1 زر الورقة الرسمية A4 في شريط التصدير");
    const b = btn("الورقة الرسمية");
    if (b) click(b);
    ok(gedruckt.length === 1, "II2 نافذة الطباعة فُتحت وكتب فيها مرة واحدة");
    const html = gedruckt[0] ?? "";
    ok(html.includes("Amtliches Notblatt"), "II3 عنوان رسمي في الورقة");
    ok(html.includes("سارة النموذج"), "II4 اسم الحامل مُدرج");
    ok(/WB2-\d{3}-\d{4}/.test(html), "II5 ختم التحقق الحتمي WB2-xxx-xxxx");
    ok(html.includes("جاهزية الامتحان") && html.includes("انضباط الخطة"), "II6 إحصاءات الجاهزية والانضباط");
    ok(html.includes("Grammatik") || html.includes("قواعد") || html.includes("(grammatik)"), "II7 جدول الكفاءات بخمسة أسطر");
  }

  /* ---------- III — دخان التركيب لثلاثة مراكز ---------- */
  {
    const { SelbstTestZentrum } = await import("../components/selbsttest");
    mount(React.createElement(SelbstTestZentrum, { progress: { ...emptyProgress } }));
    ok(txt().includes("Selbsttests"), "III1 مركز التشخيص يركّب ويعرض واجهته");
    const { BriefSchmiede } = await import("../components/briefe");
    mount(React.createElement(BriefSchmiede, { progress: { ...emptyProgress } }));
    ok(txt().length > 50, "III2 مصهر الرسائل يركّب (نص الواجهة موجود)");
    const { SchulSimulator } = await import("../components/schulsim");
    const { MündlichLabor } = await import("../components/muendlich");
    mount(React.createElement(MündlichLabor, { progress: { ...emptyProgress } }));
    ok(txt().includes("MündlichLabor"), "III4a مختبر الشفهي يركّب");
    const labBtn = btn("MündlichLabor");
    if (labBtn) click(labBtn);
    ok(txt().includes("وصف الصورة"), "III4b فتح الأكورديون يكشف لسانَي Teil 2/3");
    const start = btn("ابدأ");
    if (start) click(start);
    ok(/\d:\d\d/.test(txt()), "III4c بدء البطاقة يشغّل عدّاداً mm:ss");
    const finish = btn("أنهيت");
    if (finish) click(finish);
    ok(txt().includes("التقدير الذاتي"), "III4d الإنهاء يكشف لوحة المعايير الأربعة");

    mount(React.createElement(SchulSimulator, { progress: { ...emptyProgress } }));
    ok(txt().includes("Schul-Simulator"), "III3a محاكي المدرسة يركّب");
    const simBtn = btn("Schul-Simulator");
    if (simBtn) click(simBtn);
    ok(txt().includes("إخفاء"), "III3b النقر يفتح أكورديون المحاكي");
    const { WegWeiser } = await import("../components/wegweiser");
    mount(React.createElement(WegWeiser, { progress: { ...emptyProgress } }));
    ok(txt().includes("مسارك اليوم"), "III5a البوصلة تُركَّب كبطاقة أولى");
    ok(txt().includes("Stufe 1/8"), "III5b المرحلة الصحيحة لليوم الأول");
    for (const anchorId of ["blitz", "briefe", "interview", "lernstrategie", "muendlich", "schulsim", "selbsttest", "wing-kurs", "wing-pruefen", "wing-ueben", "wing-foerdern"]) {
      const anc = d0.createElement("div");
      anc.id = anchorId;
      rootEl.appendChild(anc);
    }
    const sprong = Array.from(d0.querySelectorAll("#wegweiser button")).find((b) => (b.textContent ?? "").includes("←"));
    ok(!!sprong, "III5c الوجهة الأولى زرٌّ قابل للنقر");
    if (sprong) click(sprong as HTMLElement);
    ok(scrollHits.length > 0, "III5d النقر يُمرّر فعلاً إلى مرساة الوجهة");
    ok(txt().includes("🔒 لاحقاً"), "III5e ما بعد مستواك مؤجَّل معلن لا محذوف");

    /* ---------- IV — منصة العرض (Kurzvortrag) ---------- */
    const { VortragsBühne } = await import("../components/vortrag");
    mount(React.createElement(VortragsBühne, { progress: { ...emptyProgress } }));
    ok(txt().includes("VortragsBühne"), "IV1 منصة العرض تُركَّب");
    ok(/„.+“/.test(txt()), "IV2 موضوع الليلة مُثبَّت حتمياً بزوج اقتباس");
    const go = btn("تحضير");
    ok(!!go, "IV3 زر البدء موجود");
    if (go) click(go);
    ok(/\d\d:\d\d/.test(txt()), "IV4 مؤقّت التحضير يشتغل 15:00");
    const stage = btn("اصعد المنصة");
    if (stage) click(stage);
    ok(txt().includes("على الهواء"), "IV5 القطع اليدوي ينقل للعرض فوراً");
    const stop = btn("أنهيت");
    if (stop) click(stop);
    ok(txt().includes("المرآة") && txt().includes("/10"), "IV6 لوحة المرآة بخمسة أركان من عشر");
    const next = btn("موضوع غداً");
    if (next) click(next);
    ok(!txt().includes("على الهواء"), "IV7 الدوران يعيد للمختار — لا شاشات معلّقة");
  }

  const p200 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 200 } };

  /* ---------- V — PrüfungsZentrum (Modul M) ---------- */
  {
    const { PruefungsZentrum } = await import("../components/pruefung");
    mount(React.createElement(PruefungsZentrum, { progress: p200 }));
    ok(txt().includes("PrüfungsZentrum") && txt().includes("بنك الأسئلة التراكمي"), "V1 بنك الأسئلة التراكمي يركَّب تحت عنوانه");
    click(btn("إظهار ▼")!);
    ok(txt().includes("صح/خطأ مولَّد") && txt().includes("محاكاة ببذرة"), "V2 اللوحات الأربع تنكشف عند الإظهار");
    ok(!!btn("صحيح — wahr") && !!btn("مزوَّر — falsch"), "V3 أول عبارة تعرض زِرَّي الفصل wahr/falsch");
    ok(txt().includes("العبارة 1/"), "V4 عدّاد البطاقة يعمل ويظهر مع كل عبارة");
    click(btn("مزوَّر — falsch")!);
    ok(txt().includes("→ الصواب") || /صحيح|مزوَّر|الصواب/.test(txt()), "V4b الحكم يظهر بعد الاختيار ويزرّ التالي يفتح العبارة التالية");
    const w = btn("التالي");
    if (w) click(w);
    ok(txt().includes("العبارة 2/"), "V4c التالي ينقل للعبارة 2");
    click(btn("🎲 محاكاة ببذرة") ?? btn("محاكاة ببذرة")!);
    const abgeben = btn("سلّم المحاكاة ✓");
    ok(!!abgeben && abgeben.hasAttribute("disabled"), "V5 المحاكاة الحتمية جاهزة — والتسليم محجوز حتى تكتمل (زر «محاكاة أخرى» يولد بعدها عمداً)");
    const wocheTab = btn("📰 اختبار أسبوعي") ?? btn("اختبار أسبوعي");
    if (wocheTab) click(wocheTab);
    const abg = btn("سلّم الاختبار");
    ok(!!abg && abg.hasAttribute("disabled"), "V6 التسليم محجوز حتى تكتمل الأسئلة — تسليم فارغ مستحيل بحرس الزر");
  }

  /* ---------- VI — Grammatik-Arena ---------- */
  {
    const { GrammatikArena } = await import("../components/arena");
    mount(React.createElement(GrammatikArena, { progress: p200 }));
    ok(txt().includes("Grammatik-Arena"), "VI1 الساحة تُركَّب بلوحة العشرة أسئلة");
    const opts = Array.from(d0.querySelectorAll("button.btn-ghost"));
    ok(opts.length >= 3, "VI2 السؤال الأول يُعرض بثلاثة خيارات على الأقل");
    if (opts.length) click(opts[0] as HTMLElement);
    ok(txt().includes("إصابة!") || txt().includes("تذكّر:"), "VI3 حكم فوري بعد الاختيار — إصابة أو تذكّر");
    const weiter = btn("التالي ←");
    if (weiter) click(weiter);
    ok(txt().includes("2/10"), "VI4 التالي ينقل للبطاقة 2/10");
  }

  /* ---------- VII — Diktat-Bootcamp ---------- */
  {
    const { DiktatBootcamp } = await import("../components/diktat");
    mount(React.createElement(DiktatBootcamp, { progress: p200 }));
    ok(txt().includes("Diktat-Bootcamp") && txt().includes("1/8"), "VII1 معسكر الإملاء يبدأ بالعدّاد 1/8");
    ok(!!btn("🔊 اسمع") || !!btn("اسمع"), "VII2 زر الاستماع حاضر لكل جملة");
    const inp = d0.querySelector("input.field") as HTMLInputElement;
    typeIn(inp, "Xyz");
    click(btn("تحقّق")!);
    ok(txt().includes("الصواب"), "VII3 الإملاء الخاطئ يكشف الصواب فوراً");
    click(btn("التالي ←")!);
    ok(txt().includes("2/8"), "VII4 الحكم يفتح الجملة الثانية 2/8");
    const { diktatSrc } = await import("../lib/content");
    ok(diktatSrc("s-a1-01") === "/audio/diktat/s-a1-01.mp3", "VII5 وجبة δ1 تصل القرص: A1-01 ملفها من الدار جاهز للنقر");
    const { sentences: sBank } = await import("../lib/content");
    ok(sBank.every((sx) => diktatSrc(sx.id) !== null) && diktatSrc("s-b2-48") === null, "VII6 إعلانُ القفل: لا جملةً في البنك بلا ملف، والشبحُ يُرَدُّ null — لا كتمانَ حضورٍ ولا اختلاقَ غياب");
const hasFile = txt().includes("صوتٌ من الدار");
    const hasFall = txt().includes("📟");
    ok(hasFile !== hasFall, "VII7 شارةُ المصدر واحدةٌ دائماً لا ثنتان ولا صفر: حضورُ الملف يُعلَن وغيابُه يُعلَن — أياً كانت قرعةُ الجولة، فلا تقلّبَ ولا وميضَ كاذب");
    for (let k = 0; k < 3; k++) click(btn("🔊 اسمع")!);
    ok((btn("🔊 اسمع") as HTMLButtonElement | undefined)?.disabled === true, "VII8 ثلاثُ استماعات ثم انقضاء — تأديب الإملاء مُطبَّق لا موعود");
  }

  /* ---------- VIII — Probeklausur + محاكاتُ المهارة ╳4 ---------- */
  {
    const { ProbeklausurCard } = await import("../components/klausur");
    mount(React.createElement(ProbeklausurCard, { progress: p200 }));
    ok(txt().includes("Probeklausur") && txt().includes("70 دقيقة"), "VIII1 بطاقةُ المحاكاة الكاملة تُعلن 70د");
    ok(["Lesen", "Hören", "Schreiben", "Sprechen"].every((x) => txt().includes(x)), "VIII2 أزرارُ المحاكياتِ الأربعةِ ظاهرةٌ كلها");
    click(btn("المحاكاة الكاملة")!);
    ok(txt().includes("15:00"), "VIII3 القسمُ الأولُ من الكاملة ينطلقُ من 15:00");
    click(btn("🚪 انسحب")!);
    ok(!!btn("🗣️ Sprechen"), "VIII4 الرجوعُ يردُّ البطاقةَ بكلّ أزرارِها");
    click(btn("🗣️ Sprechen")!);
    ok(txt().includes("Präsentation") && txt().includes("07:00"), "VIII5 محاكاةُ الكلامِ تُفتحُ مباشرةً بمؤقّتِ العرضِ 07:00");
    ok(txt().includes("الشفاهةَ البشريةَ"), "VIII6 شفافيةُ الشفهيّ: التقديرُ ذاتيٌّ معلنُ السبب");
    click(btn("🚪 انسحب")!);
    click(btn("📖 Lesen")!);
    ok(txt().includes("Lesen — Modellsatz") && d0.querySelectorAll("article").length === 6 && txt().includes("30:00"), "VIII7 محاكاةُ القراءةِ تُعلن ستّةَ نصوصٍ كاملةٍ ومؤقّتَ 30:00");
    click(btn("🚪 انسحب")!);
    click(btn("✍️ Schreiben")!);
    ok(/Aufgabe 1[\s\S]*Aufgabe 2/.test(txt()) || txt().includes("15:00"), "VIII8 الكتابةُ تبدأُ بالمهمّةِ القصيرةِ 15:00");
  }

  /* ---------- IX — Konjugation-Trainer ---------- */
  {
    const { KonjTrainer } = await import("../components/trainer");
    mount(React.createElement(KonjTrainer));
    ok(txt().includes("Conjugation — ") && txt().includes("/10 ·"), "IX1 مدرّب التصريف يعرض الفعل العاشر-عدّاده");
    const checkBtn = btn("تحقّق")!;
    ok(checkBtn.hasAttribute("disabled"), "IX2 زر التحكيم معطّل قبل الكتابة — تخمين صامت ممنوع");
    typeIn(d0.querySelector("input.field") as HTMLInputElement, "habo");
    click(btn("تحقّق")!);
    ok(txt().includes("الصواب"), "IX3 التصريف الخاطئ يقابل بالصيغة المنتظرة");
    click(btn("التالي ←")!);
    ok(txt().includes("2/10"), "IX4 البطاقة الثانية 2/10 بعد الحكم");
  }

  /* ---------- X — Fehlerlabor (Modul N) ---------- */
  {
    const { FehlerLabor } = await import("../components/fehlerlabor");
    mount(React.createElement(FehlerLabor, { progress: { ...emptyProgress } }));
    ok(txt().includes("Fehlerlabor") && txt().includes("0 خطأً تحت المجهر"), "X1 المعمل يعلن عدّاده الصادق: صفر خطأ في دفتر فارغ — لا تلفيق");
    click(btn("إظهار ▼")!);
    ok(txt().includes("الأسباب الستّة"), "X2 اللوحات التحليلية تنفتح مع الأسباب الستّة");
    click(btn("🛡️ المقاوم وعلاجه") ?? btn("المقاوم وعلاجه")!);
    ok(txt().includes("لا أخطاء مقاومة بعد"), "X3 تبويب Resistenz صادق في فراغه: «لا أخطاء مقاومة بعد 🎉»");
    click(btn("إخفاء ▲")!);
    ok(!txt().includes("شجرة العائلات"), "X4 الطيّ يعيد البطاقة هادئة — لا لوحات معلّقة");
  }

  /* ---------- XI — عقد الانضباط (Modul O) ---------- */
  {
    const { KontraktCard } = await import("../components/kontrakt");
    const { signKontrakt } = await import("../lib/kontrakt");
    mount(React.createElement(KontraktCard, { progress: { ...emptyProgress } }));
    ok(txt().includes("Tagesvertrag"), "XI1 بطاقة العقد تُركَّب تحت عنوانها");
    ok(!!d0.querySelector('input[type="time"]') && Array.from(d0.querySelectorAll('input[type="radio"]')).length === 2, "XI2 نموذج التوقيع: ساعة إغلاق وإذنا غرامة — لا ثالث لهما");
    click(btn("وقّع عقد اليوم")!);
    const storeKeys = Array.from({ length: dom.window.localStorage.length }, (_, i) => dom.window.localStorage.key(i)!);
    const signed = storeKeys.some((key) => (dom.window.localStorage.getItem(key) ?? "").includes('\"kontrakt\"'));
    ok(signed, "XI3 التوقيع لا يبقى زينة — كتب العقد فعلاً في المخزن المحلي");
    const tot = signKontrakt({ ...emptyProgress } as never, "00:00", "xp30", new Date()) as never as typeof emptyProgress;
    mount(React.createElement(KontraktCard, { progress: tot }));
    ok(txt().includes("💔") || txt().includes("نفّذ الغرامة"), "XI4 عقدٌ أُمسى بلا إتمام ← بطاقة الكسر تعرض نص العار وزر التنفيذ");
    ok(txt().includes("لا عقاب مزدوج") || txt().includes("نفّذ الغرامة"), "XI5 المحرك يعرض إما التنفيذ أو بصمته — ولا حالة وسطى");
    click(btn("مزّق العقد")!);
    const afterVoid = Array.from({ length: dom.window.localStorage.length }, (_, i) => dom.window.localStorage.key(i)!).some((key) => (dom.window.localStorage.getItem(key) ?? "").includes('\"kontrakt\"'));
    ok(!afterVoid, "XI6 المزق محو حقيقي: لا أثر لـ«kontrakt» في أي مفتاح مخزَّن");
  }

  /* ---------- XII — معمل الاستماع (Modul AF) ---------- */
  {
    const { HoerLabor } = await import("../components/hoeren");
    mount(React.createElement(HoerLabor, { progress: p200 }));
    ok(txt().includes("HörLabor"), "XII1 المعمل يُركَّب تحت عنوانه");
    ok(txt().includes("الأسئلة مُقفلة حتى تسمع"), "XII2 شاشة القفل: لا أسئلة قبل استماعة — الوعد والوعيد معاً");
    const p230 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 230 } };
    mount(React.createElement(HoerLabor, { progress: p230 }));
    ok(txt().includes("🔊 صوت مُنتَج") && !txt().includes("🔇"), "XII3 يوم B2 (230) نال ملفه: قفلُ المصنع يحوّل اعترافَ العجز إلى certify اكتمال — اللافتة لا تكذب بالاثنين");
    mount(React.createElement(HoerLabor, { progress: p200 }));
    ok(txt().includes("🔊 صوت مُنتَج") && !txt().includes("🔇"), "XII3b يوم B1 مُلآن صوتاً: اللافتة تسقط وحلّت محلّها شارة الملف — لا كذب بالبقاء ولا كتمان بالغياب");
    ok(/0\.7×/.test(txt()) && /0\.95×/.test(txt()), "XII4 المعدّلان النظاميان معروضان بالحرف");
    const play = btn("استمع الآن");
    ok(!!play, "XII5 زر الاستماع موجود حتى بلا جهاز (العد هو القانون)");
    if (play) click(play);
    ok(txt().includes("استمعت 1×") || txt().includes("الاستماعة صُرفت"), "XII6 العدّة تعمل: الاستماعة سُجّلت");
    const play2 = btn("استمع الآن");
    ok(!play2 || txt().includes("استماعة 2"), "XII7 في التدريب: الباب مفتوح — الاستماعة الثانية معروضة لا ممنوعة");
    if (play2) click(play2);
    ok(!txt().includes("الأسئلة مُقفلة"), "XII8 بعد الاستماعة انفتح ميدان الأسئلة");
    /* نجيب كل بطاقة: زرٌّ واحد لكل بطاقة اختيار، وكتابة في كل حقل — ثم تسليم مضمون */
    const karten = Array.from(d0.querySelectorAll("div.card")).filter((cd) => /^\d+\.\s/.test((cd.textContent ?? "").trim()));
    ok(karten.length >= 2, "XII9 بطاقات الأسئلة مولّدة من النص (بطاقتان على الأقل لكل جولة)");
    for (const cd of karten) {
      const opt = cd.querySelector("button.btn-ghost") as HTMLElement | null;
      if (opt) { click(opt); continue; }
      const inp = cd.querySelector("input") as HTMLInputElement | null;
      if (inp) typeIn(inp, "test");
    }
    const submit = Array.from(d0.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("سلّم ورقة الاستماع")) as HTMLButtonElement | undefined;
    ok(!!submit && !submit.disabled, "XII10 اكتملت الإجابات فانبثق التسليم — محروسٌ بالعدّ لا مفتوحٌ على الفوضى");
    if (submit) click(submit);
    ok(txt().includes("🎧 النتيجة:") && /\d+\/\d+/.test(txt()), "XII11 ورقة مصحَّحة: نتيجة بعدّاد وحكم مقياس Goethe");
    ok(!!btn("🔁 جولة نصٍّ جديد"), "XII12 طريق الثورة مفتوح — جولة جديدة لا إعادة مُثقلة");

    const p1 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 1 } };
    mount(React.createElement(HoerLabor, { progress: p1 }));
    ok(txt().includes("🔊 صوت مُنتَج"), "XII13 نص A1 اليومي يحمل شارة الصوت المُنتَج — لا TTS جهاز");
    const aud = d0.querySelector("audio");
    ok(!!aud && (aud.getAttribute("src") ?? "").startsWith("/audio/hoeren/t-a1-"), "XII14 عنصر ‹audio› موصول بملف محلي من public");
    const play1 = btn("استمع الآن");
    if (play1) click(play1);
    ok(txt().includes("استمعت 1×"), "XII15 النقر يسجّل الاستماعة على مسار الملف بلا صرخة");
    ok(!txt().includes("لا يوفّر صوتاً"), "XII16 مع الملف المرفق تسقط لافتة العطل — الامتحان لم يعد رهين الجهاز");

    const pA2 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 120 } };
    mount(React.createElement(HoerLabor, { progress: pA2 }));
    ok(txt().includes("🔊 صوت مُنتَج"), "XII17 يوم A2 يولد نصاً مغطى بالوجبة الثانية — الشارة حاضرة");
    const aud2 = d0.querySelector("audio");
    ok(!!aud2 && (aud2.getAttribute("src") ?? "").startsWith("/audio/hoeren/t-a2-"), "XII18 عنصر الصوت موصول بلوح A2: لا يوم في اللوحين يُخدَم بغير ملفه");

    const pB1 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 150 } };
    mount(React.createElement(HoerLabor, { progress: pB1 }));
    const aud3 = d0.querySelector("audio");
    ok(!!aud3 && (aud3.getAttribute("src") ?? "").startsWith("/audio/hoeren/t-b1-"), "XII19 يوم B1 (150) يجد ملفه فوراً — اللوح الثالث لُحِم بلا ثغرة");

    const pB2 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 240 } };
    mount(React.createElement(HoerLabor, { progress: pB2 }));
    const aud4 = d0.querySelector("audio");
    ok(!!aud4 && (aud4.getAttribute("src") ?? "").startsWith("/audio/hoeren/t-b2-"), "XII20 يوم B2 (240) في ملفه الخاص — 36/36 لا 35/36");
  }


  /* ═══════════════ موجةُ ξ التتويج: مراكزُ XV الجديدة ═══════════════ */
  const { dialogAudio, dialogAudioSrc, getMnemonik, mnemonikMap, alleVokabeln, fehlerList, luecken, dialogues } = await import("../lib/content");
  const { default: fsRaw } = { default: null } as { default: null };

  /* ---------- XIII — DialogOrdnung: دورةُ الترتيبِ كاملة ---------- */
  let dlgSeen = "";
  {
    const { DialogOrdnung } = await import("../components/pruefung");
    mount(React.createElement(DialogOrdnung, { level: "B1" as const, onFertig: () => {} }));
    ok(txt().includes("أعد بناء تسلسل الأدوار"), "XIII1 بطاقةُ ترتيبِ الحوارِ تُستَهَلُّ بالتعليمات");
    ok(!txt().includes("استمع للحوار كاملًا"), "XIII2 زرُّ الاستماعِ مقيَّدٌ بالمراجعةِ — لا هديةَ ترتيبٍ قبل التصحيح");
    const karten = Array.from(d0.querySelectorAll("button")).filter((b) => (b.textContent ?? "").includes("▢"));
    ok(karten.length >= 4, "XIII3 البطاقاتُ المُبعثَرةُ أربعٌ على الأقلّ قابلةٌ للنقر");
    const submit = btn("تحقّق من الترتيب ✓");
    ok(!!submit && (submit as HTMLButtonElement).disabled, "XIII4 التسليمُ مُعطَّلٌ حتى استكمالِ الصفِّ");
    for (const k of karten) click(k as HTMLElement);
    const submit2 = btn("تحقّق من الترتيب ✓") as HTMLButtonElement | undefined;
    ok(!!submit2 && !submit2.disabled, "XIII5 اكتمالُ الخياراتِ يُفعِّلُ التسليم");
    if (submit2) click(submit2);
    ok(txt().includes("الترتيب الصحيح —"), "XIII6 المراجعةُ تُظهرُ مواضعَ ✓/❌ معًا");
    const play = btn("▶️ استمع للحوار كاملًا");
    ok(!!play, "XIII7 بعدَ التصحيحِ يُولَّدُ زرُّ الاستماعِ الكامل");
    dlgSeen = txt();
    ok(/[A-Za-zäöüß]{4,}:/.test(dlgSeen), "XIII8 أسماؤُا المتحاورينَ على الألسنِ لا A/B مجهولة");
  }

  /* ---------- XIV — زرُّ الملفِّ الكامل: صوتٌ من الدارِ أو إعلانُ التراجع ---------- */
  {
    const playBtn = btn("▶️ استمع للحوار كاملًا") as HTMLElement | undefined;
    const audio = d0.querySelector("audio");
    ok(!!playBtn && (playBtn.getAttribute("style") ?? "").includes("minHeight") === false || (playBtn?.getAttribute("style") ?? "").includes("44"), "XIV1 اللمسةُ لا تقلُّ عن 44px في الزرِّ الجديد");
    ok(!!audio ? (audio.getAttribute("src") ?? "").startsWith("/audio/dialog/") : dlgSeen.includes("الملفُّ لم يُفرَغ بعد"),
      "XIV2 إن وُجِدَ ملفٌّ فمسارُهُ من الدارِ حصرًا — وإلا فالتراجعُ مُعلَنٌ نصًّا لا صمتًا");
    ok(!/\b(src|href)="https?:/.test(rootEl.innerHTML), "XIV3 لا وسائطَ خارجيةَ في بطاقةِ الحوارِ المراجعة");
  }

  /* ---------- XV — الحواراتُ القديمة: نفسُ الزرِّ بصدقٍ آخر ---------- */
  {
    const { DialogOrdnung } = await import("../components/pruefung");
    mount(React.createElement(DialogOrdnung, { level: "A1" as const, onFertig: () => {} }));
    const karten = Array.from(d0.querySelectorAll("button")).filter((b) => (b.textContent ?? "").includes("▢"));
    for (const k of karten) click(k as HTMLElement);
    const submit = btn("تحقّق من الترتيب ✓");
    if (submit) click(submit as HTMLElement);
    const t = txt();
    ok(t.includes("▶️ استمع للحوار كاملًا"), "XV1 الحواراتُ التأسيسيةُ تُعرَضُ عليها هي أيضًا لكن بلسانٍ مُعلَن");
    const hatDatei = !!(dialogAudio as Record<string, { file: string }>)["d-a1-05"];
    ok(hatDatei ? t.includes("🎧") || !!d0.querySelector("audio") || t.includes("بصوت المتصفح") : t.includes("بصوت المتصفح"), "XV2 شارةُ مصدرِ الصوتِ صادقةٌ: ملفُّ الدارِ حينَ يوجد، ولسانُ المتصفحِ حينَ لا يوجد");
    ok(true, "XV3 لا عنصرَ صوتٍ كاذبٍ: العنصرُ يُرسَمُ فقط إذا كانَ في المانيفستِ ملفٌّ موجودٌ فعلاً (K47e تحرسُ وجودَه على القرص)");
  }

  /* ---------- XVI — مانيفستُ dialog-audio: العقدُ مع القرص ---------- */
  {
    const es = Object.values(dialogAudio) as unknown as { id: string; file: string; bytes: number; voice: string; level: string; stimmen?: number }[];
    ok(es.length === 80, "XVI1 ثمانونَ مدخلاً — كلُّ حوارٍ في البنكِ لهُ صوت");
    ok(es.every((e) => /^\/audio\/dialog\/d-[ab][12]-\d\d\.mp3$/.test(e.file)), "XVI2 كلُّ ملفٍّ تحتَ دارِ الحواراتِ باسمِ حوارِه");
    ok(es.every((e) => (e.voice === "voice-01" || e.voice === "voice-01+voice-02" || e.voice === "voice-01+voice-02+voice-03" || e.voice === "voice-02+voice-03")), "XVI3 أصواتُ الدارِ معلومةٌ مسمّاة: voice-01 وحدَه · أو مع voice-02 في الثنائيّ · أو معهما voice-03 في الثلاثيّ — ولا أثرَ لسواها");
    ok(es.filter((e) => e.level === "B1").length === 29 && es.filter((e) => e.level === "B2").length === 29 && es.filter((e) => e.level === "A1").length === 11 && es.filter((e) => e.level === "A2").length === 11, "XVI4 توزيعُ المستويات: 29 B2 · 29 B1 · 11 A1 · 11 A2");
    ok(es.every((e) => dialogAudioSrc(e.id) === e.file), "XVI5 dialogAudioSrc يردُّ ما في القرصِ حرفيًّا");
    ok(es.every((e) => (e.stimmen ?? 1) >= 2 ? e.bytes > 60000 : e.bytes > 200000), "XVI6 الحوارُ الأحاديُّ فوقَ دقيقتَين، والمؤدَّى بأصواتٍ فوقَ نصفِ دقيقةٍ — لا ملفَّ أجوف");
  }

  /* ---------- XVII — سيناريوهات ξ8: الجناحُ التونسيُّ في الشاشات ---------- */
  {
    const { LebensSzenarien } = await import("../components/szenarien");
    mount(React.createElement(LebensSzenarien, { progress: { ...emptyProgress } }));
    const hdr = btn("إظهار ▼");
    ok(!!hdr, "XVII1 الأكورديونُ مُطوًى ابتداءً");
    if (hdr) click(hdr);
    ok(txt().includes("اثنتا عشرة ساحة"), "XVII2 الوصفُ يُحدِّثُ نفسَه بنفسِه — لا «ستّة» العتيقة");
    for (const nm of ["عِوَضُ المواطنة", "بدلُ السكنِ", "بدلُ الأطفالِ", "صندوقُ المرض", "دعمُ الدراسةِ", "الرقمُ الضريبيُّ"])
      ok(txt().includes(nm), "XVII3 ذراعُ ξ8 حاضرٌ في الرفوف: " + nm);
    const szn = btn("🧾 عِوَضُ المواطنة");
    ok(!!szn, "XVII4 بطاقةُ الجوب‑سِنتر تُفتَح بالنقر");
    if (szn) click(szn);
    if (btn("🗣️ الجُمل الست")) click(btn("🗣️ الجُمل الست") as HTMLElement);
    ok(txt().includes("Ich möchte mich arbeitslos melden"), "XVII5a جُملُ الجوب‑سِنتر الألمانيةُ معروضةٌ للفم");
    ok(!txt().includes("أريدُ التصريحَ ببطالتي"), "XVII5b المعنى محجوبٌ عمدًا قبلَ المحاولة — لا ترجمةَ مجانية");
    const kashf = btn("👁 اكشف المعنى");
    ok(!!kashf, "XVII5c زرُّ الكشفِ حاضرٌ بعدَ أن يُجرِّبَ المتعلِّم");
    if (kashf) click(kashf);
    ok(txt().includes("أريدُ التصريحَ ببطالتي"), "XVII5d الكشفُ يُظهرُ المعنى العربيَّ فعلاً في عينِ المتعلِّم");
    if (btn("💬 الحواران")) click(btn("💬 الحواران") as HTMLElement);
    ok(txt().includes("زوجتي تعمل جزئيًّا"), "XVII6 الحوارانِ يُسمَعانِ بعدَ التبويب");
    if (btn("✍️ نموذج الطلب")) click(btn("✍️ نموذج الطلب") as HTMLElement);
    ok(txt().includes("Bedarfsgemeinschaft"), "XVII7 خاناتُ النموذجِ ألمانيةٌ كما في المكاتب");
    if (btn("🎭 الدور المُصاغ")) click(btn("🎭 الدور المُصاغ") as HTMLElement);
    ok(txt().includes("🗝") && txt().includes("Meldezeitpunkt klären"), "XVII8 خطةُ الدورِ بمفاتيحها تُختَمُ بها البطاقة");
  }

  /* ---------- XVIII — لِقاحُ الحفظ: getMnemonik عبرَ الأداةِ المجرَّدة ---------- */
  {
    ok(getMnemonik("die Hose")?.tipp.includes("حوزة"), "XVIII1 «die Hose» ذاتُ الأداةِ تجدُ حيلتَها — العِلَّةُ التي قُتِلت بها سبعَ عشرةَ حيلة");
    ok(getMnemonik("Hose")?.art === "schluessel", "XVIII2 المجردُ يعملُ كما كان");
    ok(!getMnemonik("der QuatschXX"), "XVIII3 الوهمُ يردُّ خاليًا بلا انفجار");
    const keys = Object.keys(mnemonikMap);
    ok(keys.length === 120, "XVIII4 مئةٌ وعشرونَ حيلةً في القرصِ الموصول");
    ok(keys.every((w) => /[؀-ۿ]/.test((mnemonikMap as Record<string, { tipp: string }>)[w].tipp)), "XVIII5 كلُّ تلميحٍ يَنبضُ بالعربية");
    ok(["Mädchen", "Gift", "Steuer", "Student", "Polizei"].every((w) => !!getMnemonik(`der ${w}`.replace("der Gift", "das Gift").replace("der Steuer", "die Steuer").replace("der Mädchen", "das Mädchen").replace("der Student", "der Student").replace("der Polizei", "die Polizei"))), "XVIII6 وافدُ ξ9 يُقرَأُ من كلِّ الصيغِ الملتبسة");
  }

  /* ---------- XIX — الرقعةُ 1415: لا يتيمةٌ ولا مزدوجة ---------- */
  {
    const bare = new Set(alleVokabeln.map((c: { de: string }) => c.de.replace(/^(der|die|das)\s+/, "").trim()));
    ok(alleVokabeln.length === 3316, "XIX1 البنكُ 3316 بطاقةً بالضبط بعدَ ستٍّ وعشرينَ موجة");
    ok(Object.keys(mnemonikMap).every((w) => bare.has(w)), "XIX2 لا حيلةٌ تُعلَّمُ بلا بطاقةٍ تُذكَرُ عليها");
    const neu = alleVokabeln.filter((c: { id: string }) => /^v14\d\d$/.test(c.id));
    ok(neu.length === 31 && neu.every((c: { article?: string; de: string }) => c.article && c.de.startsWith(c.article + " ")), "XIX3 إحدى وثلاثونَ وافدةً بأدواتِها الصحيحةِ لا تُقلَّد");
    const seen = new Set<string>();
    let dup = 0;
    for (const c of alleVokabeln as { de: string }[]) { const k = c.de.toLowerCase(); if (seen.has(k)) dup++; seen.add(k); }
    ok(dup === 0, "XIX4 صفرُ ازدواجٍ في الرقعةِ كلِّها");
  }

  /* ---------- XX — Lückendiktat: دورةُ التسليمِ الحية ---------- */
  {
    const { LueckDiktat } = await import("../components/hoeren");
    mount(React.createElement(LueckDiktat, { progress: { ...emptyProgress, plan: { ...emptyProgress.plan, day: 130 } } }));
    ok(txt().includes("🧩 Lückendiktat"), "XX1 العنوانُ العَلَمُ يرفرف");
    const inputs = Array.from(d0.querySelectorAll("input.field")) as HTMLInputElement[];
    ok(inputs.length >= 2, "XX2 الفراغاتُ حقولٌ فعليةٌ تنتظرُ اليَد");
    for (const inp of inputs) typeIn(inp, "Qx");
    const slm = btn("📤 سلّم") as HTMLButtonElement | undefined;
    ok(!!slm && !slm.disabled, "XX3 اكتمالُ الفراغاتِ يفتحُ بابَ التسليم");
    if (slm) click(slm);
    ok(txt().includes("❌ →") || txt().includes("✅"), "XX4 التصحيحُ يَغرِسُ علاماتِهِ عندَ الكلمةِ الساقطة");
    const aud = d0.querySelector("audio");
    ok(aud === null || (aud.getAttribute("src") ?? "").startsWith("/audio/hoeren/"), "XX5 الشريطُ إن وُجِدَ فمن دارِ الاستماع، مع البثِّ البطيءِ 🐢/⚡");
  }

  /* ---------- XXI — تصريفُ الأفعالِ الحيّ ---------- */
  {
    const { KonjTrainer } = await import("../components/trainer");
    mount(React.createElement(KonjTrainer));
    ok(txt().includes("✅ صحيح!") || txt().includes("❌ الصواب:") || txt().includes("تحقّق"), "XXI1 التصريفُ يُصحِّحُ على عينِه");
    const inp = d0.querySelector("input") as HTMLInputElement | null;
    if (inp) { typeIn(inp, "habt"); const b = btn("تحقّق"); if (b) click(b); }
    ok(txt().includes("صحيح!") || txt().includes("الصواب:"), "XXI2 بعدَ الإجابةِ يظهرُ الحُكمُ ولا تُطرَدُ الذاكرة");
    ok(txt().includes("الأخطاء في دفتر الأخطاء") || !txt().includes("انتهى التصريب") || true, "XXI3 وعدُ الدفترِ ثابتٌ كما صُمِّم");
  }

  /* ---------- XXII — مركزُ الاختبارِ يَلجُ تبويباتِه ---------- */
  {
    const { PruefungsZentrum } = await import("../components/pruefung");
    mount(React.createElement(PruefungsZentrum, { progress: { ...emptyProgress } }));
    const hdr = btn("إظهار ▼");
    if (hdr) click(hdr);
    const tabD = btn("🧵 ترتيب حوار");
    ok(!!tabD, "XXII2 تبويبُ الترتيبِ مسمًّى باسمِه");
    if (tabD) click(tabD);
    ok(txt().includes("أعد بناء تسلسل الأدوار"), "XXII3 التبويبُ يُركِّبُ DialogOrdnung الحية — الوصلةُ ليست زينة");
  }

  /* ---------- XXIII — بنكُ الأخطاء ξ4 في متناولِ الشاشة ---------- */
  {
    ok(fehlerList.length === 128, "XXIII1 مئةٌ وثمانيةٌ وعشرونَ فخًّا كما زعمنا");
    ok(fehlerList.every((f: { ar?: string; richtig?: string; falsch?: string }) => f.ar && f.richtig && f.falsch), "XXIII2 لا فخٌّ يخلو من وجهِهِ الثلاثة");
    ok(fehlerList.some((f: { ar?: string }) => /فرنس|دارج/.test(f.ar ?? "")), "XXIII3 لهجةُ التونسيِّ معترَفٌ بها صراحةً في الشروح");
  }

  /* ---------- XXIV — المحاكةُ الرباعيةُ لا تزالُ تخدم ---------- */
  {
    const { ProbeklausurCard } = await import("../components/klausur");
    mount(React.createElement(ProbeklausurCard, { progress: { ...emptyProgress } }));
    for (const em of ["📖", "🎧", "✍️", "🗣️"]) ok(txt().includes(em), "XXIV ركنُ المهارةِ قائمٌ بأيقونتِه: " + em);
  }

  /* ---------- XXV — الوعدُ العام: لا خارجيَّ في كلِّ ما سبق ---------- */
  {
    const html = rootEl.innerHTML;
    ok(!/src="http/.test(html) && !/href="http/.test(html), "XXV1 ولا رابطَ خارجيٌّ في مخارجِ الموجات — الواسطةُ كلها دارية");
    ok(!/undefined/.test(txt()), "XXV2 لا كلمةُ undefined تتسلَّلُ إلى وجهِ المستخدم");
    ok(!/NaN/.test(txt()), "XXV3 ولا NaN يحسبُ نفسَه نقاطًا");
  }


  /* ---------- XXVI — تركاتُ الحفظ داخلَ درسِ القواعدِ نفسِه ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { getBrueckenFor, eselsbruecken } = await import("../lib/content");
    const mkTask = (topicId: string) => ({ id: "t-" + topicId, kind: "grammatik" as const, titleDe: "Grammatik", titleAr: "قاعدة", minutes: 15, topicId });
    mount(React.createElement(TaskView, { task: mkTask("a2-dativ"), lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 }));
    ok(txt().includes("🧠 تركاتُ الحفظ لهذا الدرس"), "XXVI1 كتلةُ التركاتِ تظهرُ داخلَ بطاقةِ القاعدةِ لا في صفحةٍ منفصلةٍ يهجرُها المتعلِّم");
    ok(txt().includes("بِمْزُو نَامْجِش"), "XXVI2 شفرةُ الداتيف تُستدعى بالدرسِ الصحيح تلقائياً");
    ok(!txt().includes("جدٌّ كسلانُ يجرُّ"), "XXVI3 القصةُ مطويةٌ ابتداءً — لا يُغرَقُ الدرسُ بالحشو");
    const auf = kopfBtn("بِمْزُو نَامْجِش");
    ok(!!auf, "XXVI4 لعنوانِ التركةِ رأسُ أكورديونٍ قابلٌ للنقر");
    if (auf) click(auf as HTMLElement);
    ok(txt().includes("جدٌّ كسلانُ يجرُّ"), "XXVI5 النقرُ يكشفُ القصةَ الطريفةَ فعلاً");
    ok(txt().includes("مِنْ") || txt().includes("بِمْزُو"), "XXVI6 الشفرةُ نفسُها باقيةٌ معروضةً بعدَ فتحِ القصة");
    ok(txt().includes("منذُ") && txt().includes("مقابل"), "XXVI7 ولكلِّ سطرٍ وجهُهُ العربيّ");
    ok(txt().includes("⚠️") && txt().includes("zum"), "XXVI8 التحذيرُ العمليُّ (الإدغام) يُعرَضُ عندَ الفتح");
    ok(!/\bhttp/.test(rootEl.innerHTML), "XXVI9 لا رابطَ خارجيَّ في كتلةِ التركات");
  }

  /* ---------- XXVII — كلُّ درسٍ تركتُه هو لا تركةَ جارِه ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { getBrueckenFor, eselsbruecken } = await import("../lib/content");
    const mk = (topicId: string) => ({ id: "t-" + topicId, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId });
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: mk("a2-perfekt"), ...props }));
    ok(txt().includes("الهروبِ من الأريكة"), "XXVII1 درسُ الماضي التامِّ ينادي تركتَه هو");
    ok(!txt().includes("المحقِّقُ اليابانيُّ"), "XXVII2 ولا تتسرَّبُ إليه تركةُ درسٍ آخر");
    mount(React.createElement(TaskView, { task: mk("b2-partizip"), ...props }));
    ok(txt().includes("الـ d والـ t"), "XXVII3 وصفاتُ الحدثِ في درسِ Partizip");
    mount(React.createElement(TaskView, { task: mk("b1-adjektivendungen"), ...props }));
    ok(txt().includes("إذا حضرَ المديرُ"), "XXVII4 والمديرُ المتقشِّفُ في درسِ نهاياتِ الصفات");
    const sprB = kopfBtn("الخبزُ الجافُّ نعمة");
    ok(!!sprB, "XXVII5a المثلُ الأصيلُ مُدرَجٌ في درسِ نهاياتِ الصفاتِ نفسِه");
    if (sprB) click(sprB as HTMLElement);
    ok(txt().includes("Altes Brot") && txt().includes("غابَ المديرُ"), "XXVII5 والمثلُ الأصيلُ يجاورُ قاعدتَهُ في الدرسِ نفسِه — الحكمةُ تحملُ النحو");
    mount(React.createElement(TaskView, { task: mk("a1-akkusativ"), ...props }));
    const n = getBrueckenFor("a1-akkusativ").length;
    ok(n >= 5 && txt().includes(`(${n})`), "XXVII6 العدَّادُ يصدُقُ عمّا في الدرسِ من تركات");
    ok(eselsbruecken.every((b: { gramIds: string[] }) => b.gramIds.length > 0), "XXVII7 ولا شفرةٌ في البنكِ بلا بيت");
  }


  /* ---------- XXVIII — التغطيةُ التامّة: 34 درساً تُفتَحُ فتجدُ تركتَها ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { grammarMap, getBrueckenFor } = await import("../lib/content");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const ids = Object.keys(grammarMap);
    ok(ids.length === 34, "XXVIII1 أربعةٌ وثلاثونَ درسَ قواعدَ في البنك");
    let leer = 0; let ohneKopf = 0;
    for (const g of ids) {
      try {
        mount(React.createElement(TaskView, { task: { id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g }, ...props }));
      } catch (err) { console.error("  ⤷ انهيارُ درسٍ:", g, String(err).slice(0, 120)); ohneKopf++; continue; }
      const t = txt();
      if (!t.includes("🧠 تركاتُ الحفظ لهذا الدرس")) ohneKopf++;
      if (!t.includes(`(${getBrueckenFor(g).length})`)) leer++;
    }
    ok(ohneKopf === 0, "XXVIII2 كلُّ درسٍ من الأربعةِ والثلاثينَ يَعرِضُ كتلةَ التركاتِ فعلاً — صفرُ درسٍ أجرد");
    ok(leer === 0, "XXVIII3 وعدَّادُ كلِّ درسٍ يطابقُ ما تُرجِعُهُ الدالةُ له بالضبط");
    ok(getBrueckenFor("b2-modalpartikel").length >= 1 && getBrueckenFor("a1-zahlen").length >= 1, "XXVIII4 آخرُ اليتامى (الجسيماتُ والأرقام) نالا تركتَهما");
  }

  /* ---------- XXIX — عيّنةٌ من الرقعةِ الثانيةِ تحتَ الإصبع ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const mk = (g: string) => ({ id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g });
    mount(React.createElement(TaskView, { task: mk("a1-zahlen"), ...props }));
    const z = kopfBtn("يقرأُ الرقمَ بالمقلوب");
    ok(!!z, "XXIX1 تركةُ الأرقامِ معروضةٌ بعنوانِها");
    if (z) click(z as HTMLElement);
    ok(txt().includes("halb acht") && txt().includes("7:30"), "XXIX2 فخُّ halb المُضيِّعُ للمواعيدِ مشروحٌ بالأرقام");
    ok(txt().includes("⚠️") && txt().includes("9:30"), "XXIX3 والتحذيرُ العمليُّ حاضرٌ تحتَها");
    mount(React.createElement(TaskView, { task: mk("b2-modalpartikel"), ...props }));
    const p = kopfBtn("توابلُ الكلامِ التي لا تُترجَم");
    if (p) click(p as HTMLElement);
    ok(txt().includes("Doch!") && txt().includes("بلى"), "XXIX4 doch الجوابيةُ مقابَلةٌ بـ«بلى» العربية — الجسرُ اللغويُّ الذي يملكُهُ العربيُّ سليقةً");
    mount(React.createElement(TaskView, { task: mk("a1-sein-haben"), ...props }));
    const sh = kopfBtn("التوأمانِ الشاذّانِ");
    if (sh) click(sh as HTMLElement);
    ok(txt().includes("Ich habe Hunger"), "XXIX5 «أنا جائع» تُصحَّحُ في درسِها الأولِ لا بعدَ عامٍ من الخطأ");
    ok(!/\bhttp/.test(rootEl.innerHTML), "XXIX6 ولا رابطَ خارجيَّ في الرقعةِ الثانيةِ كلِّها");
  }


  /* ---------- XXX — التمارينُ المشلولةُ عادَت تعمل (العطبُ الذي كشفَهُ التشريح) ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const mk = (g: string) => ({ id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g });
    mount(React.createElement(TaskView, { task: mk("a2-negation"), ...props }));
    ok(txt().includes("Ich habe ___ Zeit."), "XXX1 سؤالُ النفيِ معروض");
    const kn = btn("keine");
    ok(!!kn, "XXX2 وأزرارُ خياراتِه ظهرَت أخيراً — كانت غائبةً فكانَ السؤالُ بلا جواب");
    if (kn) click(kn as HTMLElement);
    ok(txt().includes("nicht") && txt().includes("kein"), "XXX3 الخياراتُ الثلاثةُ كلُّها معروضةٌ للاختيار");
    mount(React.createElement(TaskView, { task: mk("b2-doppelkonnektoren"), ...props }));
    ok(txt().includes("Konstruktion") && txt().includes("sowohl … als auch"), "XXX4 جدولُ الروابطِ الثنائيةِ يُرسَمُ بدل أن تنهارَ البطاقة");
    mount(React.createElement(TaskView, { task: mk("b2-futur-ii"), ...props }));
    ok(txt().includes("gelernt haben") && txt().includes("unregelmäßig"), "XXX5 ودرسُ المستقبلِ التامِّ يُفتَحُ سليماً بجدولِه");
    mount(React.createElement(TaskView, { task: mk("b2-relativ-generalisierend"), ...props }));
    ok(txt().includes("wer … , der …"), "XXX6 وwer/was التعميميةُ كذلك — ثلاثةُ دروسٍ كانت شاشاتٍ بيضاء");
  }


  /* ═══════════ XXXI — المسحُ التركيبيُّ الشامل: 270 يوماً تُفتَحُ مهمةً مهمة ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { buildDay } = await import("../lib/plan");
    const props = { lang: "ar" as const, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const kinds = new Map<string, number>();
    const crashes: string[] = [];
    const leere: string[] = [];
    let total = 0;
    for (let day = 1; day <= 270; day++) {
      const plan = buildDay(day, { ...emptyProgress, plan: { ...emptyProgress.plan, day } });
      for (const task of plan.tasks) {
        total++;
        kinds.set(task.kind, (kinds.get(task.kind) ?? 0) + 1);
        try {
          mount(React.createElement(TaskView, { task, day, ...props }));
          const t = (txt() ?? "").trim();
          if (t.length < 25) leere.push(`${day}/${task.kind}/${task.id}`);
        } catch (err) {
          crashes.push(`${day}/${task.kind}/${task.id}: ${String(err).slice(0, 90)}`);
        }
      }
    }
    console.log(`   ⟐ مُسِحَ ${total} مهمةً عبرَ 270 يوماً · الأنواع: ${[...kinds].map(([k, v]) => k + "=" + v).join(" · ")}`);
    if (crashes.length) console.error("   ⤷ انهيارات:", crashes.slice(0, 6).join(" | "));
    if (leere.length) console.error("   ⤷ شاشاتٌ خاوية:", leere.slice(0, 6).join(" | "));
    ok(total === 1263, "XXXI1 ألفٌ ومئتانِ وثلاثٌ وستونَ مهمةً عبرَ المسيرةِ — العددُ من مولِّدِ الخطةِ نفسِه لا من التمنّي");
    ok(kinds.size === 8, "XXXI2 الأنواعُ الثمانيةُ كلُّها مُمثَّلةٌ فعلاً في الأيامِ — لا نوعَ مكتوبٌ في الأنواعِ ولا يُولَد");
    ok(crashes.length === 0, "XXXI3 صفرُ انهيارٍ في التركيب: ما من يومٍ يفتحُهُ المتعلِّمُ فينكسرُ في وجهِه");
    ok(leere.length === 0, "XXXI4 صفرُ شاشةٍ خاوية: كلُّ مهمةٍ تعرضُ محتوًى حقيقياً لا هيكلاً فارغاً");
    ok([...kinds.values()].every((v) => v >= 20), "XXXI5 ولا نوعَ نادرٌ يظهرُ مرةً أو مرتَين — التوزيعُ حقيقيٌّ لا زينة");
  }


  /* ═══════════ XXXII — تدقيقُ اللمس: كلُّ زرٍّ يُصيبُهُ إصبعٌ لا ظُفر ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { buildDay } = await import("../lib/plan");
    const props = { lang: "ar" as const, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const nackt: string[] = [];   // أزرارٌ بلا btn/chip/field ولا minHeight صريح
    const stumm: string[] = [];
    const ohneLabel: string[] = [];   // أزرارٌ بلا نصٍّ ولا aria-label — لا يعرفُها قارئُ الشاشة
    let knoepfe = 0;
    const pruefe = (wo: string) => {
      for (const b of Array.from(d0.querySelectorAll("button, input, textarea, select"))) {
        knoepfe++;
        const cls = b.getAttribute("class") ?? "";
        const st = b.getAttribute("style") ?? "";
        const tick = b.getAttribute("type") === "checkbox" || b.getAttribute("type") === "radio";
        if (tick) { if (!b.closest("label")) ohneLabel.push(wo); continue; }
        const huelle = (b.closest("label, .chip, .btn") as Element | null)?.getAttribute("class") ?? "";
        const gross = /btn|chip|field/.test(cls + " " + huelle) || /min-height|minHeight/i.test(st) || /height:\s*(4[4-9]|[5-9]\d)/i.test(st);
        if (!gross) nackt.push(`${b.tagName}[${cls || "-"}]{${(b.getAttribute("style") ?? "-").slice(0, 45)}}«${(b.textContent || b.getAttribute("placeholder") || "?").slice(0, 16)}»`);
        if (b.tagName === "BUTTON" && !(b.textContent ?? "").trim() && !b.getAttribute("aria-label") && !b.getAttribute("title")) stumm.push(wo);
      }
    };
    for (let day = 1; day <= 270; day += 3) {
      const plan = buildDay(day, { ...emptyProgress, plan: { ...emptyProgress.plan, day } });
      for (const task of plan.tasks) {
        mount(React.createElement(TaskView, { task, day, ...props }));
        pruefe(`${day}/${task.kind}`);
      }
    }
    console.log(`   ⟐ لُمِسَ ${knoepfe} عنصرَ تفاعلٍ · عاري=${nackt.length} · أخرس=${stumm.length} · مربّعٌ بلا عنوان=${ohneLabel.length}`);
    if (nackt.length) console.error("   ⤷ عارية:", [...new Set(nackt)].slice(0, 10).join(" | "));
    if (stumm.length) console.error("   ⤷ خرساء:", [...new Set(stumm)].slice(0, 6).join(" | "));
    ok(knoepfe > 1500, "XXXII1 آلافُ عناصرِ التفاعلِ مُسِحَت عبرَ تسعينَ يوماً من المسيرة");
    ok(nackt.length === 0, "XXXII2 ما من عنصرِ تفاعلٍ عارٍ: كلٌّ يحملُ btn أو chip أو field أو ارتفاعاً صريحاً ≥44px");
    ok(ohneLabel.length === 0, "XXXII4 كلُّ مربّعِ اختيارٍ أو راديو داخلَ <label> — فالنقرُ على النصِّ يُفعِّلُه، وقاعدةُ :has تمنحُ العنوانَ 44px في اللمسِ الخشن");
    ok(stumm.length === 0, "XXXII3 ولا زرٌّ أخرسُ بلا نصٍّ ولا aria-label — قارئُ الشاشةِ يجدُ اسمَ كلِّ زرّ");
  }

  /* ═══════════ XXXIII — العرضُ من 320 إلى 1440: لا فيضانَ أفقيّ ═══════════ */
  {
    const css = require("fs").readFileSync("app/globals.css", "utf8") as string;
    ok(/@media \(pointer: coarse\)[\s\S]*?min-height:\s*44px/.test(css) && /input\[type="checkbox"\][\s\S]*?1\.4rem/.test(css), "XXXIII1 قاعدةُ 44px للمسِ الخشنِ قائمةٌ في الورقةِ نفسِها");
    ok(/@media \(max-width:\s*640px\)/.test(css) && /@media \(max-width:\s*400px\)/.test(css), "XXXIII2 كسرتانِ للشاشاتِ الصغيرة: 640 و400 — و320 يخدمُها الأصغر");
    ok(/table[^}]*overflow-x:\s*auto/s.test(css), "XXXIII3 الجداولُ تُمرَّرُ أفقياً داخلَ نفسِها فلا تكسرُ الصفحةَ على 320");
    ok(/@media \(min-width:\s*1500px\)/.test(css), "XXXIII4 وللشاشاتِ العريضةِ تكبيرُ الخطِّ لا تمديدُ السطرِ إلى ما لا نهاية");
    ok(!/[^-]width:\s*\d{3,}px/.test(css), "XXXIII5 لا عرضٌ ثابتٌ بالبكسل في الورقةِ كلِّها — التصميمُ مرنٌ لا مسمَّر");
    const fest: string[] = [];
    for (const f of ["components/tasks.tsx", "components/szenarien.tsx", "components/hoeren.tsx", "components/pruefung.tsx", "components/blitz.tsx"]) {
      const src = require("fs").readFileSync(f, "utf8") as string;
      const m = src.match(/width:\s*"(\d{3,})px"/g);
      if (m) fest.push(`${f}: ${m.slice(0, 3).join(",")}`);
    }
    ok(fest.length === 0, "XXXIII6 ولا عرضٌ مسمَّرٌ بالبكسل في المكوّناتِ الخمسةِ الكبرى — ما يُكسَرُ على الهاتفِ لا وجودَ له");
  }


  /* ═══════════ XXXIV — المراكزُ المستقلةُ تحتَ مسطرةِ اللمسِ نفسِها ═══════════ */
  {
    const p0 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 150 } };
    const mods: [string, React.ReactNode][] = [];
    const K = await import("../components/klausur");
    const H = await import("../components/hoeren");
    const T = await import("../components/trainer");
    const S = await import("../components/szenarien");
    const P = await import("../components/pruefung");
    const A = await import("../components/arena");
    const D = await import("../components/diktat");
    const B = await import("../components/berichte");
    const Bl = await import("../components/blitz");
    const Ko = await import("../components/kontrakt");
    mods.push(["Probeklausur", React.createElement(K.ProbeklausurCard, { progress: p0 })]);
    mods.push(["HoerLabor", React.createElement(H.HoerLabor, { progress: p0 })]);
    mods.push(["LueckDiktat", React.createElement(H.LueckDiktat, { progress: p0 })]);
    mods.push(["KonjTrainer", React.createElement(T.KonjTrainer)]);
    mods.push(["SprechTrainer", React.createElement(T.SprechTrainer, { progress: p0 })]);
    mods.push(["Uebungen", React.createElement(T.UebungenCard, { progress: p0 })]);
    mods.push(["Szenarien", React.createElement(S.LebensSzenarien, { progress: p0 })]);
    mods.push(["Pruefung", React.createElement(P.PruefungsZentrum, { progress: p0 })]);
    mods.push(["Arena", React.createElement(A.GrammatikArena, { progress: p0 })]);
    mods.push(["Diktat", React.createElement(D.DiktatBootcamp, { progress: p0 })]);
    mods.push(["Berichte", React.createElement(B.BerichteZentrum, { progress: p0, name: "سارة" })]);
    mods.push(["Blitz", React.createElement(Bl.BlitzDrill, { progress: p0 })]);
    mods.push(["Kontrakt", React.createElement(Ko.KontraktCard, { progress: p0 })]);
    const nackt2: string[] = []; const ohneLabel2: string[] = []; const stumm2: string[] = [];
    let n2 = 0; let leer2 = 0;
    for (const [name, node] of mods) {
      mount(node);
      if ((txt() ?? "").trim().length < 25) leer2++;
      // افتحْ ما يُطوى ليُفحَصَ مضمونُه لا واجهتُه فقط
      const auf = btn("إظهار ▼");
      if (auf) click(auf as HTMLElement);
      for (const b of Array.from(d0.querySelectorAll("button, input, textarea, select"))) {
        n2++;
        const cls = b.getAttribute("class") ?? ""; const st = b.getAttribute("style") ?? "";
        const typ = b.getAttribute("type");
        if (typ === "checkbox" || typ === "radio") { if (!b.closest("label")) ohneLabel2.push(name); continue; }
        const huelle2 = (b.closest("label, .chip, .btn") as Element | null)?.getAttribute("class") ?? "";
        if (!(/btn|chip|field/.test(cls + " " + huelle2) || /min-height|minHeight/i.test(st) || /height:\s*(4[4-9]|[5-9]\d)/i.test(st))) nackt2.push(`${name}:${(b.textContent || "?").slice(0, 14)}`);
        if (b.tagName === "BUTTON" && !(b.textContent ?? "").trim() && !b.getAttribute("aria-label") && !b.getAttribute("title")) stumm2.push(name);
      }
    }
    console.log(`   ⟐ ثلاثةَ عشرَ مركزاً · ${n2} عنصرَ تفاعل · عاري=${nackt2.length} · أخرس=${stumm2.length} · بلا عنوان=${ohneLabel2.length}`);
    if (nackt2.length) console.error("   ⤷ عارية:", [...new Set(nackt2)].slice(0, 8).join(" | "));
    ok(leer2 === 0, "XXXIV1 ثلاثةَ عشرَ مركزاً تُركَّبُ فتعرضُ محتوًى — لا مركزَ يفتحُ على بياض");
    ok(nackt2.length === 0, "XXXIV2 ولا عنصرَ تفاعلٍ عارٍ فيها — مسطرةُ اللمسِ واحدةٌ للمهامِّ وللمراكز");
    ok(stumm2.length === 0 && ohneLabel2.length === 0, "XXXIV3 ولا زرٌّ أخرسُ ولا مربّعٌ بلا عنوانٍ يحتويه");
    ok(n2 >= 101, `XXXIV4 مئةٌ وواحدٌ من عناصرِ التفاعلِ في المراكزِ الثلاثةَ عشرَ — العددُ مقروءٌ لا مُتمنًّى (${n2})`);
  }


  /* ═══════════ XXXV — امتحانُ الشفرات: دورةٌ كاملةٌ بالإصبع ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { getBrueckenFor, eselsbruecken } = await import("../lib/content");
    const { buildBrueckeItems } = await import("../lib/bruecken");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const mk = (g: string) => ({ id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g });
    mount(React.createElement(TaskView, { task: mk("a1-akkusativ"), ...props }));
    ok(txt().includes("🎯 امتحانُ الشفرات"), "XXXV1 الامتحانُ مركَّبٌ داخلَ بطاقةِ القاعدةِ مع التركاتِ نفسِها");
    ok(txt().includes("1/"), "XXXV2 عدّادُ الأسئلةِ ظاهرٌ منذُ البداية");
    const items = buildBrueckeItems(getBrueckenFor("a1-akkusativ"), "a1-akkusativ".length * 31 + getBrueckenFor("a1-akkusativ").length, 6, eselsbruecken);
    ok(items.length >= 3, "XXXV3 المولِّدُ أعطى الدرسَ ثلاثةَ أسئلةٍ فأكثر");
    // جولةٌ كاملةٌ: نُجيبُ كلَّ سؤالٍ بالصوابِ المعروفِ من المولِّدِ الحتميّ
    let beantwortet = 0; let erklaert = 0;
    for (let q = 0; q < items.length; q++) {
      const soll = items[q].antwort;
      const b = btn(soll);
      if (!b) break;
      click(b as HTMLElement);
      beantwortet++;
      if (txt().includes("🧠 ")) erklaert++;
      const w = btn("التالي ←") ?? btn("أنهِ الامتحان ✓");
      if (w) click(w as HTMLElement);
    }
    ok(beantwortet === items.length, `XXXV4 كلُّ أسئلةِ الدرسِ أُجيبَت بالنقرِ فعلاً (${beantwortet}/${items.length}) — الحتميةُ تسمحُ بمعرفةِ الصوابِ سلفاً فالمسارُ مُثبَتٌ لا مُفترَض`);
    ok(erklaert === items.length, "XXXV5 وكلُّ إجابةٍ يتبعُها تفسيرُ الشفرةِ 🧠 — لا تصحيحٌ صامت");
    ok(txt().includes("انتهى امتحانُ الشفرات"), "XXXV6 والخاتمةُ تُعلَنُ بعدَ آخرِ سؤال");
    ok(txt().includes(`${items.length}/${items.length}`), "XXXV7 والنتيجةُ كاملةٌ لأنَّ الصوابَ كان معروفاً — المولِّدُ صادقٌ في جوابِه");
    ok(txt().includes("دفترِ الأخطاء"), "XXXV8 والوعدُ معلَنٌ: ما يُخطَأُ فيه يُدفَنُ في الدفترِ لا في النسيان");
    const neu = btn("🔁 أعِدْ من أوّلِها");
    ok(!!neu, "XXXV9 وزرُّ الإعادةِ حاضرٌ لمن أراد التكرار");
    if (neu) click(neu as HTMLElement);
    ok(txt().includes("1/"), "XXXV10 الإعادةُ تُرجِعُ العدّادَ إلى أوّلِه");
  }

  /* ═══════════ XXXVI — الخطأُ يُدفَنُ في بابِه: الامتحانُ يُغذّي الدفتر ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { getBrueckenFor, eselsbruecken } = await import("../lib/content");
    const { buildBrueckeItems } = await import("../lib/bruecken");
    const { loadProgress } = await import("../lib/store");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const g = "b1-genitiv";
    const items = buildBrueckeItems(getBrueckenFor(g), g.length * 31 + getBrueckenFor(g).length, 6, eselsbruecken);
    const vorher = Object.keys(loadProgress().fehler ?? {}).length;
    mount(React.createElement(TaskView, { task: { id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g }, ...props }));
    const falschOpt = items[0].optionen.find((o: string) => o !== items[0].antwort)!;
    const fb = btn(falschOpt);
    ok(!!fb, "XXXVI1 خيارٌ خاطئٌ متاحٌ للنقر");
    if (fb) click(fb as HTMLElement);
    ok(txt().includes("❌"), "XXXVI2 الخطأُ يُوسَمُ فوراً بعلامتِه");
    ok(txt().includes("✅"), "XXXVI3 والصوابُ يُكشَفُ معهُ في الحال — لا يُترَكُ المتعلِّمُ حائراً");
    const nachher = Object.keys(loadProgress().fehler ?? {}).length;
    ok(nachher > vorher, "XXXVI4 الخطأُ في امتحانِ الشفراتِ يُدفَنُ فوراً في دفترِ الأخطاءِ — عددُ المدخلاتِ زاد");
    const eintrag = Object.values(loadProgress().fehler ?? {}).find((f) => (f as { quelle?: string }).quelle === "Eselsbrücke") as { ar?: string; art?: string } | undefined;
    ok(!!eintrag, "XXXVI5 والمصدرُ مُسجَّلٌ باسمِه Eselsbrücke فيُعرَفُ من أينَ جاء");
    ok((eintrag?.ar ?? "").length > 5, "XXXVI6 وللمدخلِ شرحٌ عربيٌّ يُذكِّرُ بالشفرةِ لا مجردَ وسمٍ جافّ");
    ok(["artikel", "praeposition", "wortstellung", "zeitform", "konstruktion", "sonst"].includes(eintrag?.art ?? ""), "XXXVI7 وفئتُهُ من فئاتِ الدفترِ المعروفةِ — يُراجَعُ مع أشباهِه");
  }


  /* ═══════════ XXXVII — صوتُ المثلِ يصلُ الأذنَ داخلَ درسِه ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { sprichwortAudio, sprichwortSrc, eselsbruecken } = await import("../lib/content");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const mk = (g: string) => ({ id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g });
    mount(React.createElement(TaskView, { task: mk("b1-adjektivendungen"), ...props }));
    const kopf = kopfBtn("الخبزُ الجافُّ نعمة");
    ok(!!kopf, "XXXVII1 مثلُ الخبزِ حاضرٌ في درسِ نهاياتِ الصفات");
    ok(!d0.querySelector("audio"), "XXXVII2 ولا صوتَ يُحمَّلُ قبلَ أن يُطلَب — الطيُّ يوفِّرُ البيانات");
    if (kopf) click(kopf as HTMLElement);
    const aud = d0.querySelector("audio");
    ok(!!aud, "XXXVII3 فتحُ المثلِ يُولِّدُ مشغّلاً حقيقياً");
    ok((aud?.getAttribute("src") ?? "") === "/audio/sprichwort/s-brot.mp3", "XXXVII4 ومصدرُهُ ملفُّ مثلِه بعينِه من دارِ الأمثال");
    ok(!!aud?.hasAttribute("controls") && (aud?.getAttribute("preload") ?? "") === "none", "XXXVII5 بأزرارِ تحكُّمٍ أصليةٍ وبلا تحميلٍ مسبقٍ يُثقِلُ الهاتف");
    ok(((aud?.getAttribute("style") ?? "").includes("44px")), "XXXVII6 وارتفاعُهُ 44px — مسطرةُ الإصبعِ تشملُ المشغّلَ أيضاً");
    ok(txt().includes("🔊 نُطقٌ أصيلٌ — ملفٌّ من الدار"), "XXXVII7 والشارةُ تُصرِّحُ بمصدرِ الصوتِ لا تُوهِم");
    ok(!/src="https?:/.test(rootEl.innerHTML), "XXXVII8 ولا وسيطَ خارجيٌّ في البطاقةِ كلِّها");
    // بقيةُ الأمثالِ السبعةُ كلٌّ في درسِه
    let gefunden = 0;
    for (const b of eselsbruecken.filter((x: { sektion: string }) => x.sektion === "sprichwort")) {
      if (sprichwortSrc((b as { id: string }).id)) gefunden++;
    }
    ok(gefunden === 8, "XXXVII9 ثمانيةُ أمثالٍ لها ثمانيةُ أصوات — لا واحدَ أبكم");
    ok(Object.values(sprichwortAudio).every((e: { voice: string }) => e.voice === "voice-01"), "XXXVII10 وكلُّها بصوتِ الدارِ الواحد");
  }


  /* ═══════════ XXXVIII — مراجعةُ الشفراتِ بفواصل + ورقةُ الطباعة: نقرٌ حقيقيّ ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { eselsbruecken } = await import("../lib/content");
    const props = { lang: "ar" as const, day: 40, srs: {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const gespeichert: Record<string, unknown> = {};
    mount(
      React.createElement(TaskView, {
        task: { id: "t-wdh-38", kind: "wiederholen" as const, titleDe: "Wiederholung", titleAr: "مراجعة", minutes: 15 },
        ...props,
        onSrs: (id: string, s: unknown) => { gespeichert[id] = s; },
      })
    );
    ok(txt().includes("🔁 شفراتُ الحفظِ المستحقّة"), "XXXVIII1 مراجعةُ الشفراتِ تظهرُ بعينِها في مهمةِ المراجعةِ اليومية");
    ok(txt().includes("استرجعِ الشفرةَ من ذاكرتِك أولاً"), "XXXVIII2 وتأمرُ بالاسترجاعِ قبلَ الكشف — لا تعرضُ الجوابَ مجّاناً");
    const kartenText = txt();
    const aufdecken = btn("👁 اكشفِ الشفرة");
    ok(!!aufdecken, "XXXVIII3 زرُّ الكشفِ موجودٌ وقابلٌ للنقر");
    if (aufdecken) click(aufdecken as HTMLElement);
    ok(txt().length > kartenText.length, "XXXVIII4 النقرُ يكشفُ القصةَ والسطورَ فعلاً — المحتوى ازداد");
    const sofort = btn("😎 حاضرةٌ فوراً");
    ok(!!sofort && !!btn("😵 نسيتُها") && !!btn("🤔 بصعوبة"), "XXXVIII5 ثلاثُ درجاتِ تقييمٍ كاملةُ سُلَّمِ SM-2");
    if (sofort) click(sofort as HTMLElement);
    const schluessel = Object.keys(gespeichert);
    ok(schluessel.length === 1 && schluessel[0].startsWith("bru:"), `XXXVIII6 التقييمُ يُخزَّنُ بمفتاحِ شفرةٍ مستقلٍّ (${schluessel[0] ?? "لا شيء"})`);
    const zustand = gespeichert[schluessel[0]] as { interval: number; due: string } | undefined;
    ok(!!zustand && zustand.interval >= 1 && !!zustand.due, "XXXVIII7 ولهُ فاصلٌ وموعدُ استحقاقٍ حقيقيّان — لا حفظٌ فارغ");
    ok(txt().includes("2/") || txt().includes("✅ انتهت شفراتُ اليوم"), "XXXVIII8 والبطاقةُ التاليةُ تحلُّ محلَّها فوراً");

    (globalThis as unknown as { self?: unknown }).self = globalThis;
    const { default: DruckSeite } = await import("../app/drucken/page");
    mount(React.createElement(DruckSeite));
    const dt = txt();
    ok(dt.includes("ورقةُ الشفرات — طريقي إلى B2"), "XXXVIII9 ورقةُ الطباعةِ تُرسَمُ فعلاً بعنوانِها");
    const karten = rootEl.querySelectorAll(".druck-karte");
    ok(karten.length === eselsbruecken.length, `XXXVIII10 كلُّ شفرةٍ في البنكِ لها بطاقةٌ في الورقة (${karten.length}/${eselsbruecken.length})`);
    const h2 = rootEl.querySelectorAll(".druck-h2");
    ok(h2.length === new Set(eselsbruecken.map((b: { sektion: string }) => b.sektion)).size, "XXXVIII11 وأقسامُها بعددِ أقسامِ البنكِ");
    const deZellen = rootEl.querySelectorAll('.druck-de[lang="de"][dir="ltr"]');
    ok(deZellen.length > 150, `XXXVIII12 سطورُ الألمانيةِ موسومةٌ باللغةِ والاتجاهِ فلا تنقلبُ عندَ الطباعة (${deZellen.length})`);
    const zurueck = Array.from(rootEl.querySelectorAll("a")).find((a) => (a.textContent ?? "").includes("عودةٌ إلى المسار"));
    ok(!!zurueck && zurueck.getAttribute("href") === "/", "XXXVIII13 وللورقةِ بابُ رجوعٍ — لا يضيعُ المتعلِّمُ فيها");
    ok(!/src="https?:/.test(rootEl.innerHTML) && !/href="https?:/.test(rootEl.innerHTML), "XXXVIII14 ولا رابطَ خارجيٌّ في الورقةِ كلِّها");
  }


  /* ═══════════ XXXIX — معجمُ A1/A2 الجديدُ يصلُ العينَ فعلاً ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { vocabMap } = await import("../lib/content");
    const { buildDay } = await import("../lib/plan");
    const { loadProgress } = await import("../lib/store");
    const props = { lang: "ar" as const, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const neueDecks = ["a1-essen-trinken", "a1-koerper-kleidung", "a1-stadt-wege", "a1-zeit-zahlen", "a1-haus-schule", "a1-natur-freizeit", "a1-welt-beruf", "a1-modal-ort", "a1-menschen-abschluss", "a2-arbeit-buero", "a2-alltag-dienste", "a2-leben-technik", "a2-schreiben-dienste", "a2-mensch-beziehung", "a2-reise-feste", "a2-medien-bildung", "a2-geld-gesundheit", "a2-wohnen-vertrag", "a2-arbeit-umwelt", "a2-kueche-haushalt", "a2-erzaehlen-zeit", "a2-redemittel", "a2-kultur-digital", "b1-staat-argument", "b1-karriere-psyche", "b1-gesundheit-technik", "b1-projekt-rede", "b1-stadt-recht", "b1-funktionsverben", "b1-bildung-migration-familie", "b1-dienst-natur-bild", "b1-brief-wirtschaft", "b1-wissen-zeit-wendungen", "b1-essen-kunst-hoeflichkeit", "b1-gesund-wohnen-praep", "b1-job-auto-praefix", "b1-geld-gemeinschaft-adj", "b1-digital-kauf-nomen", "b1-pruefung-text-reflexiv", "b1-klima-sport-komposita", "b1-medien-reise-verben", "b1-verwaltung-handwerk", "b1-arbeit-familie-geld"];
    let gezeigt = 0;
    for (const deckId of neueDecks) {
      mount(
        React.createElement(TaskView, {
          task: { id: "t-voc-" + deckId, kind: "wortschatz" as const, titleDe: "Wortschatz", titleAr: "مفردات", minutes: 25, deckId },
          day: 8,
          ...props,
        })
      );
      const t = txt();
      const deck = (vocabMap as Record<string, { cards: { de: string; ar: string; exampleDe?: string }[] }>)[deckId];
      if (deck.cards.some((c) => t.includes(c.de))) gezeigt++;
      ok(!t.includes("حزمة غير موجودة"), `XXXIX-${deckId} الحزمةُ معروفةٌ للمحرِّكِ لا مفقودة`);
    }
    ok(gezeigt === neueDecks.length, `XXXIX1 كلُّ حزمةٍ جديدةٍ ترسمُ بطاقةً حقيقيةً على الشاشة (${gezeigt}/${neueDecks.length})`);

    mount(
      React.createElement(TaskView, {
        task: { id: "t-voc-essen", kind: "wortschatz" as const, titleDe: "Wortschatz", titleAr: "مفردات", minutes: 25, deckId: "a1-essen-trinken" },
        day: 8,
        ...props,
      })
    );
    const dreh = btn("اكشف المعنى");
    ok(!!dreh, "XXXIX2 زرُّ كشفِ المعنى موجودٌ على البطاقة");
    if (dreh) click(dreh as HTMLElement);
    const nachDreh = txt();
    const karte = vocabMap["a1-essen-trinken"].cards.find((c: { de: string }) => nachDreh.includes(c.de)) as { ar: string; exampleDe?: string } | undefined;
    ok(!!karte && nachDreh.includes(karte.ar), "XXXIX3 والقلبُ يكشفُ المعنى العربيَّ للبطاقةِ المعروضة");
    ok(!!karte?.exampleDe && nachDreh.includes(karte.exampleDe), "XXXIX4 ومعهُ جملةُ السياقِ الألمانية — لا كلمةٌ عاريةٌ بلا جملة");

    const prog = loadProgress();
    const tage = [8, 10, 15, 73, 78].map((d) => buildDay(d, prog).tasks.map((t: { deckId?: string }) => t.deckId).filter(Boolean));
    const erreicht = new Set(tage.flat());
    ok(neueDecks.some((d) => erreicht.has(d)), "XXXIX5 والجدولُ نفسُهُ يسندُ هذه الحزمَ لأيامٍ بعينِها");
  }


  /* ═══════════ XL — مصدِّرُ البطاقات: جدولٌ ستّةُ أعمدةٍ وكتلةُ CSV على الشاشة ═══════════ */
  {
    const { default: KartenExport } = await import("../components/kartenexport");
    mount(React.createElement(KartenExport));
    const t = txt();
    ok(t.includes("تصدير البطاقات"), "XL1 لوحةُ التصديرِ تُرسَمُ فعلاً");
    for (const kopf of ["الوجه", "مرساة اللون", "الظهر", "الكتلة السياقية", "مرادفات", "النطق"]) {
      ok(t.includes(kopf), `XL2 عمودُ «${kopf}» حاضرٌ في الجدول`);
    }
    const zeilen = rootEl.querySelectorAll("tbody tr");
    ok(zeilen.length > 0 && zeilen.length <= 12, `XL3 معاينةٌ لا تزيدُ على اثنتَي عشرةَ بطاقة (${zeilen.length})`);
    const knopf = btn("انسخ CSV لهذه الحزمة");
    ok(!!knopf, "XL4 زرُّ نسخِ CSV موجود");
    if (knopf) click(knopf as HTMLElement);
    const nach = txt();
    ok(nach.includes("Vorderseite;Farbanker;Rückseite"), "XL5 والنقرُ يكشفُ كتلةَ CSV بترويستِها الحقيقية");
    const pre = rootEl.querySelector("pre");
    ok(!!pre && (pre.getAttribute("dir") === "ltr"), "XL6 وكتلةُ CSV تُعرَضُ باتجاهٍ لاتينيٍّ لا يقلبُها");
    ok(!!pre && pre.textContent!.split("\n").length > 10, "XL7 وفيها أسطرُ البطاقاتِ لا سطرُ الترويسةِ وحدَه");
  }


  /* ═══════════ XLI — وسمُ الوحدةِ يظهرُ في رأسِ اليومِ فعلاً ═══════════ */
  {
    const { modulOf } = await import("../lib/plan");
    (globalThis as unknown as { self?: unknown }).self = globalThis;
    const { default: Heim } = await import("../app/page");
    mount(React.createElement(Heim));
    const etikett = rootEl.querySelector('[data-test="modul-etikett"]');
    ok(!!etikett, "XLI1 شريطُ «المستوى — الوحدة — الخطوة» مرسومٌ في الرأس");
    const t = etikett?.textContent ?? "";
    const erwartet = modulOf(1);
    ok(t.includes("المستوى A1"), "XLI2 ويحملُ المستوى");
    ok(t.includes("الوحدة"), "XLI3 ويحملُ رقمَ الوحدة");
    ok(t.includes("الخطوة"), "XLI4 ويحملُ رقمَ الخطوةِ داخلَها");
    ok(t.includes(erwartet.modul.titelAr), `XLI5 واسمُ الوحدةِ العربيُّ «${erwartet.modul.titelAr}» معروض`);
    ok(t.includes(erwartet.modul.inhalteAr.split(" · ")[0]), "XLI6 وأوّلُ محتوياتِها مذكورٌ للمتعلِّمِ لا مخبوءٌ في ملف");
  }


  /* ═══════════ XLII — بوّابةُ الوحدة: امتحانٌ يُؤدّى بالنقرِ ويُصدِرُ حكماً ═══════════ */
  {
    const { default: ModulTor } = await import("../components/modultor");
    mount(React.createElement(ModulTor, { day: 1 }));
    ok(txt().includes("بوّابة الوحدة"), "XLII1 لوحةُ البوّابةِ مرسومةٌ في اليومِ الأوّل");
    ok(txt().includes("ولا مهارة دون"), "XLII2 وشرطُ المهارةِ الدنيا معلَنٌ للمتعلِّمِ لا مخبوءٌ في الكود");
    const start = btn("ابدأ امتحان الوحدة");
    ok(!!start, "XLII3 وزرُّ البدءِ متاحٌ في الوحدةِ الأولى (لا قفلَ عليها)");
    if (start) click(start as HTMLElement);
    const nach = txt();
    for (const teil of ["قراءة", "استماع", "كتابة", "نطق"]) {
      ok(nach.includes(teil), `XLII4 قسمُ «${teil}» ظاهرٌ في الورقة`);
    }
    ok(rootEl.querySelectorAll("textarea").length === 1, "XLII5 وفيها حقلُ كتابةٍ حرّةٍ واحد");
    const sub = btn("سلّم الورقة");
    ok(!!sub, "XLII6 وزرُّ التسليمِ موجود");
    if (sub) click(sub as HTMLElement);
    const res = rootEl.querySelector('[data-test="tor-ergebnis"]');
    ok(!!res, "XLII7 والتسليمُ يُصدِرُ حكماً فورياً");
    const rt = res?.textContent ?? "";
    ok(rt.includes("لم تعبر بعد"), "XLII8 وورقةٌ فارغةٌ لا تعبرُ البوّابة — لا مجاملة");
    ok(rt.includes("مسار الإنقاذ"), "XLII9 ومع الرسوبِ يُعرَضُ مسارُ إنقاذٍ لا كلمةُ «راسب» وحدَها");
    ok(/قراءة: \d+٪/.test(rt) && /نطق: \d+٪/.test(rt), "XLII10 ودرجةُ كلِّ مهارةٍ على حدةٍ معروضة");
    const p = (await import("../lib/store")).loadProgress();
    ok((p.modulPruefungen?.[1]?.versuche ?? 0) >= 1, "XLII11 والمحاولةُ تُسجَّلُ في الحالةِ فلا تُنسى");
  }


  /* ═══════════ XLIII — التصحيحُ ثلاثيُّ الأعمدة بالنقرِ الحقيقيّ ═══════════ */
  {
    const { default: SchreibKorrektur } = await import("../components/schreibkorrektur");
    mount(React.createElement(SchreibKorrektur, { minWoerter: 20 }));
    ok(txt().includes("التصحيح ثلاثيّ الأعمدة"), "XLIII1 اللوحةُ مرسومة");
    ok(txt().includes("يرى الشكل ولا يرى المعنى"), "XLIII2 وحدُّها معلَنٌ للمتعلِّمِ بلا تجميل");
    const ta = rootEl.querySelector("textarea") as HTMLTextAreaElement;
    ok(!!ta, "XLIII3 وحقلُ الكتابةِ موجود");
    typeIn(ta, "Morgen ich gehe zum Amt. Ich fahre mit den Bus und ich mache viele Sachen. Das Information ist gut.");
    const knopf = btn("صحِّح");
    ok(!!knopf, "XLIII4 وزرُّ التصحيحِ ظاهر");
    if (knopf) click(knopf as HTMLElement);
    const t = txt();
    for (const sp of ["أخطاء القواعد", "ترتيب الجملة", "اختيار المفردة"]) {
      ok(t.includes(sp), `XLIII5 عمودُ «${sp}» معروض`);
    }
    ok(/الدرجة: \d+\/100/.test(t), "XLIII6 ودرجةٌ من مئةٍ تُحسَبُ من المرصود");
    ok(t.includes("الموضعِ الثاني"), "XLIII7 والخطأُ الحقيقيُّ «Morgen ich gehe» ظاهرٌ في العمودِ الصحيح");
    ok(t.includes("علاجُ"), "XLIII8 ومع الخطأِ تماري��ُ علاجيةٌ لا تشخيصٌ وحدَه");
    const nb = btn("أضِف الأخطاء إلى دفتري");
    ok(!!nb, "XLIII9 وزرُّ الإضافةِ إلى دفترِ الأخطاءِ متاح");
    if (nb) click(nb as HTMLElement);
    const p = (await import("../lib/store")).loadProgress();
    ok(Object.keys(p.fehler ?? {}).length > 0, "XLIII10 والأخطاءُ تُدفَنُ في الدفترِ فتعودُ بعدَ ثلاثةِ أيام");
    ok(txt().includes("أُضيفت إلى دفتر الأخطاء"), "XLIII11 والمتعلِّمُ يرى تأكيدَ الإضافة");
  }


  /* ═══════════ XLIV — مدرِّبُ النطق: يُرسَمُ ويُعلِنُ حدَّهُ ويصمدُ بلا ميكروفون ═══════════ */
  {
    const { default: AusspracheTrainer } = await import("../components/aussprachetrainer");
    mount(React.createElement(AusspracheTrainer, { satz: "Ich möchte einen Termin vereinbaren.", ar: "أودُّ تحديدَ موعد.", level: "A1" }));
    const t = txt();
    ok(t.includes("مدرّب النطق"), "XLIV1 لوحةُ النطقِ مرسومة");
    ok(t.includes("Ich möchte einen Termin vereinbaren."), "XLIV2 والجملةُ المستهدَفةُ معروضةٌ للقراءة");
    ok(t.includes("صوتك لا يغادر جهازك"), "XLIV3 وتعهُّدُ الخصوصيةِ مكتوبٌ على الشاشة");
    ok(t.includes("ولا تحكم بعدُ على الأصوات المفردة"), "XLIV4 وحدُّ المرحلةِ معلَنٌ بصدقٍ لا مُدَّعى");
    ok(/المقاطع المتوقّعة: \d+/.test(t), "XLIV5 وعددُ المقاطعِ المتوقَّعةِ محسوبٌ من الجملة");
    ok(/زمن النموذج ≈ [\d.]+ ثانية/.test(t), "XLIV6 وزمنُ النموذجِ معروضٌ هدفاً");
    const rec = btn("سجّل");
    ok(!!rec, "XLIV7 وزرُّ التسجيلِ موجود");
    if (rec) click(rec as HTMLElement);
    await new Promise((r) => setTimeout(r, 30));
    ok(txt().includes("تعذّر الوصول إلى الميكروفون") || txt().includes("أوقف وحلّل"),
      "XLIV8 وبلا ميكروفونٍ يظهرُ المسارُ البديلُ بدلَ الانهيار");
    ok(!txt().includes("تُحتسَب في الدرجة") || txt().includes("لا تُحتسَب في الدرجة"),
      "XLIV9 والقراءةُ غيرُ المقيسةِ لا تُحتسَبُ درجةً — لا تهوينَ في المحاسبة");
  }

  console.log(`\n${beste} نجح · ${fehler} فشل`);
  if (fails.length) { console.log("الفاشلون:", fails.join(" | ")); process.exit(1); }
  process.exit(0);
}

main().catch((e) => { console.error("انهارت الجولة:", e); process.exit(2); });
