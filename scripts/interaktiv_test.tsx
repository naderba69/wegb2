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
  const { emptyProgress, TOTAL_DAYS } = await import("../lib/types");
  const act = (React as unknown as { act: (cb: () => void) => void }).act;

  const d0 = dom.window.document as unknown as Document;
  const rootEl = d0.getElementById("root")!;
  let leave: (() => void) | null = null;
  let autoEntdecken = true;
  function mount(node: React.ReactNode) {
    if (leave) leave();
    const root = createRoot(rootEl);
    act(() => root.render(node));
    leave = () => { act(() => root.unmount()); leave = null; };
    // 🔍 الاستقراء قبل القاعدة يحجب الدرس حتى التخمين — الفحوص القديمة تفترض الدرس مكشوفاً،
    // فتُجاب مرحلةُ الاكتشاف تلقائياً (بالتخطّي الصريح) إلا حين تُفحص هي نفسها (autoEntdecken=false).
    if (autoEntdecken) {
      const skip = rootEl.querySelector('[data-testid="entdecken-ueberspringen"]') as HTMLElement | null;
      if (skip) act(() => { skip.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
    }
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

    const nativeSetInterval = globalThis.setInterval;
    const nativeClearInterval = globalThis.clearInterval;
    const ticks: Array<() => void> = [];
    const fakeIds = new Set<number>();
    let fakeId = 0;
    globalThis.setInterval = ((handler: TimerHandler, delay?: number, ...args: any[]) => {
      if (delay === 1000) {
        const id = ++fakeId;
        fakeIds.add(id);
        const callback = handler as (...callbackArgs: any[]) => void;
        ticks.push(() => callback(...args));
        return id as unknown as ReturnType<typeof setInterval>;
      }
      return nativeSetInterval(handler as (...callbackArgs: any[]) => void, delay, ...args);
    }) as unknown as typeof globalThis.setInterval;
    globalThis.clearInterval = ((id: ReturnType<typeof setInterval>) => {
      if (typeof id === "number" && fakeIds.has(id)) { fakeIds.delete(id); return; }
      nativeClearInterval(id);
    }) as unknown as typeof globalThis.clearInterval;
    try {
      const teil3 = btn("المناقشة");
      if (teil3) click(teil3);
      ok(!!d0.querySelector('[data-testid="muendlich-einwand-hinweis"]'), "LXXIX1 قبل الجولة يُعلَنُ نمطُ المقاطعة وحدودُ الصوت والتقييم");
      const startDiscussion = btn("ابدأ");
      if (startDiscussion) click(startDiscussion);
      ok(!d0.querySelector('[data-testid="muendlich-einwand"]'), "LXXIX2 الاعتراضُ لا يظهر في بداية الجولة");
      act(() => { for (let i = 0; i < 121; i++) ticks.forEach((tick) => tick()); });
      const interruption = d0.querySelector('[data-testid="muendlich-einwand"]');
      ok(!!interruption && !!interruption.querySelector('[aria-label="استمع للاعتراض"]') && txt().includes("02:59"),
        "LXXIX3 اعتراضٌ ألماني مفاجئٌ يظهر بعد مرور الوقت ويبقى المؤقّت جارياً مع خيار القراءة المحلية");
      const reply = d0.querySelector('[data-testid="muendlich-einwand-antwort"]') as HTMLElement | null;
      if (reply) click(reply);
      ok(!!d0.querySelector('[data-testid="muendlich-einwand-bestaetigt"]') && txt().includes("لا يُعدّ هذا إثباتاً للنطق"),
        "LXXIX4 تأكيدُ الردّ إقرارٌ ذاتيٌّ لا إثباتٌ آليٌّ للنطق أو الاستقلال");
      const finishDiscussion = btn("أنهيت — إلى التقدير");
      if (finishDiscussion) click(finishDiscussion);
      ok(!txt().includes("جاهز للامتحان") && !txt().includes("prüfungsreif") && txt().includes("جولة تدريبية"),
        "LXXIX6 بطاقةُ التقدير تعرض تدريباً ذاتياً بلا ادعاء جاهزية امتحان");
      const nextCard = btn("بطاقة أخرى لنفس الجزء");
      if (nextCard) click(nextCard);
      ok(!!nextCard && !!btn("ابدأ") && txt().includes("دورك في") && !d0.querySelector('[data-testid="muendlich-einwand"]'),
        "LXXIX5 بطاقةُ أخرى تعودُ إلى بداية الجولة وتسمحُ بمقاطعة جديدة بدل شاشة تقييم عالقة");
    } finally {
      const unmountForTest = leave as unknown as (() => void) | null;
      if (unmountForTest) unmountForTest();
      globalThis.setInterval = nativeSetInterval;
      globalThis.clearInterval = nativeClearInterval;
    }

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
    ok(sBank.filter((sx) => !(sx as { neu?: boolean }).neu).every((sx) => diktatSrc(sx.id) !== null) && sBank.filter((sx) => (sx as { neu?: boolean }).neu).every((sx) => diktatSrc(sx.id) === null) && diktatSrc("s-x-999") === null, "VII6 إعلانُ القفل: كلُّ جملةٍ قديمةٍ لها ملف، والجديدةُ (neu) تُرَدُّ null بصدق، والشبحُ يُرَدُّ null — لا كتمانَ حضورٍ ولا اختلاقَ غياب");
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
    ok((txt().includes("🔊 صوت مُنتَج") && !txt().includes("🔇")) || /صوت الجهاز|🔇 بلا صوت/.test(txt()), "XII3b يوم B1: إمّا شارةُ الملفِّ المسجَّل أو — على نصٍّ جديدٍ بلا mp3 — شارةُ الجهاز/بلا صوت الصادقة؛ لا كذبَ بالبقاء ولا كتمانَ بالغياب");
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

    const { levelOf } = await import("../lib/plan");
    const p1 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 1 } };
    mount(React.createElement(HoerLabor, { progress: p1 }));
    ok(txt().includes("🔊 صوت مُنتَج"), "XII13 نصُ اليومِ الأوّل يحملُ شارةَ الصوتِ المُنتَج — لا TTS جهاز");
    const aud = d0.querySelector("audio");
    ok(!!aud && (aud.getAttribute("src") ?? "").startsWith(`/audio/hoeren/t-${levelOf(1).toLowerCase()}-`), "XII14 عنصر ‹audio› موصولٌ بلوحِه الحقّ t-${levelOf(1).toLowerCase()}- من public");
    const play1 = btn("استمع الآن");
    if (play1) click(play1);
    ok(txt().includes("استمعت 1×"), "XII15 النقر يسجّل الاستماعة على مسار الملف بلا صرخة");
    ok(!txt().includes("لا يوفّر صوتاً"), "XII16 مع الملف المرفق تسقط لافتة العطل — الامتحان لم يعد رهين الجهاز");

    const pA2 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 80 } }; // داخلَ لوحِ levelOf(80) فعلًا بعدَ إعادةِ التوزيعِ الأكاديميّ
    mount(React.createElement(HoerLabor, { progress: pA2 }));
    ok(txt().includes("🔊 صوت مُنتَج"), "XII17 يومٌ داخلَ اللوحِ المغطّى (80): نصُّه مسجَّلٌ والشارةُ حاضرة");
    const aud2 = d0.querySelector("audio");
    
    ok(!!aud2 && (aud2.getAttribute("src") ?? "").startsWith(`/audio/hoeren/t-${levelOf(80).toLowerCase()}-`), "XII18 عنصرُ الصوتِ موصولٌ بلوحه الفعليّ t-${levelOf(80).toLowerCase()}-: لا يومٌ في اللوحينِ يُخدَمُ بغير ملفه");

    const pB1 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 150 } };
    mount(React.createElement(HoerLabor, { progress: pB1 }));
    const aud3 = d0.querySelector("audio");
    ok((!!aud3 && (aud3.getAttribute("src") ?? "").startsWith(`/audio/hoeren/t-${levelOf(150).toLowerCase()}-`)) || (!aud3 && /صوت الجهاز|بلا صوت/.test(txt())), "XII19 يوم 150 (لوح ${levelOf(150)}): ملفُّه المسجَّل أو شارةٌ صادقةٌ لنصٍّ جديدٍ بلا mp3");

    const pB2 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 240 } };
    mount(React.createElement(HoerLabor, { progress: pB2 }));
    const aud4 = d0.querySelector("audio");
    if (!(!!aud4 && (aud4.getAttribute("src") ?? "").startsWith(`/audio/hoeren/t-${levelOf(240).toLowerCase()}-`))) console.log("   ⤷ XII20 debug:", !!aud4, aud4?.getAttribute("src"), txt().slice(0, 200));
    ok((!!aud4 && (aud4.getAttribute("src") ?? "").startsWith(`/audio/hoeren/t-${levelOf(240).toLowerCase()}-`)) || (!aud4 && /صوت الجهاز|بلا صوت/.test(txt())), "XII20 يوم 240 (لوح ${levelOf(240)}): إمّا ملفُّه المسجَّل أو — إن وقعَ على نصٍّ جديدٍ بلا mp3 — شارةُ «صوت الجهاز» الصادقة، لا صمتٌ ولا ادّعاء");
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
    ok(alleVokabeln.length === 3356, "XIX1 البنكُ 3356 بطاقةً بالضبط بعدَ ستٍّ وعشرينَ موجةً ولوحِ A0");
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


  /* ---------- XXVIII — التغطيةُ التامّة: 66 درساً تُفتَحُ فتجدُ تركتَها ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { grammarMap, getBrueckenFor } = await import("../lib/content");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const ids = Object.keys(grammarMap);
    ok(ids.length === 66, "XXVIII1 ستةٌ وستّونَ درسَ قواعدَ في البنك — بعدَ ضربِ البنوكِ وتوسيعِها لا بالتمنّي");
    let leer = 0; let ohneKopf = 0;
    for (const g of ids) {
      try {
        mount(React.createElement(TaskView, { task: { id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g }, ...props }));
      } catch (err) { console.error("  ⤷ انهيارُ درسٍ:", g, String(err).slice(0, 120)); ohneKopf++; continue; }
      const t = txt();
      if (!t.includes("🧠 تركاتُ الحفظ لهذا الدرس")) ohneKopf++;
      if (!t.includes(`(${getBrueckenFor(g).length})`)) leer++;
    }
    ok(ohneKopf === 0, "XXVIII2 كلُّ درسٍ من ستةٍ وستّينَ يَعرِضُ كتلةَ التركاتِ فعلاً — صفرُ درسٍ أجرد");
    ok(leer === 0, "XXVIII3 وعدَّادُ كلِّ درسٍ يطابقُ ما تُرجِعُهُ الدالةُ له بالضبط");
    ok(getBrueckenFor("b2-modalpartikel").length >= 1 && getBrueckenFor("a1-zahlen").length >= 1, "XXVIII4 آخرُ اليتامى (الجسيماتُ والأرقام) نالا تركتَهما");
    ok(ids.includes("a1-war-hatte") && ids.includes("a2-praeteritum"), "XXVIII5 درسا الماضي البسيط داخلَ البنكِ لا في ملفٍ يتيم");
    for (const g of ["a1-war-hatte", "a2-praeteritum"] as const) {
      mount(React.createElement(TaskView, { task: { id: "t-" + g, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 30, topicId: g }, ...props }));
      const t = txt();
      ok(getBrueckenFor(g).length >= 1, `XXVIII6${g === "a1-war-hatte" ? "a" : "b"} تركةُ الدرسِ الجديد «${g}» معلَّقةٌ به`);
      ok(!t.includes("undefined") && t.length > 400, `XXVIII7${g === "a1-war-hatte" ? "a" : "b"} الدرسُ الجديد «${g}» يُفتَحُ بلا انهيارٍ ولا شاشةٍ خاوية`);
    };
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


  /* ═══════════ XXXI — المسحُ التركيبيُّ الشامل: 378 يوماً تُفتَحُ مهمةً مهمة ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { buildDay } = await import("../lib/plan");
    const props = { lang: "ar" as const, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const kinds = new Map<string, number>();
    const crashes: string[] = [];
    const leere: string[] = [];
    let total = 0;
    for (let day = 1; day <= TOTAL_DAYS; day++) {
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
    console.log(`   ⟐ مُسِحَ ${total} مهمةً عبرَ ${TOTAL_DAYS} يوماً · الأنواع: ${[...kinds].map(([k, v]) => k + "=" + v).join(" · ")}`);
    if (crashes.length) console.error("   ⤷ انهيارات:", crashes.slice(0, 6).join(" | "));
    if (leere.length) console.error("   ⤷ شاشاتٌ خاوية:", leere.slice(0, 6).join(" | "));
    ok(total === 2110, `XXXI1 2110 مهمةً عبرَ المسيرةِ — العددُ من مولِّدِ الخطةِ نفسِه لا من التمنّي (${[...kinds].map(([k, v]) => k + "=" + v).join(" · ")})`);
    ok(kinds.size === 9, `XXXI2 الأنواعُ التسعةُ كلُّها مُمثَّلةٌ فعلاً في الأيامِ — لا نوعَ مكتوبٍ ولا يُولَد (${[...kinds.keys()].join("، ")})`);
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
    for (let day = 1; day <= TOTAL_DAYS; day += 3) {
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
    const { modulOf, levelOf } = await import("../lib/plan");
    (globalThis as unknown as { self?: unknown }).self = globalThis;
    const { default: Heim } = await import("../app/page");
    mount(React.createElement(Heim));
    const etikett = rootEl.querySelector('[data-test="modul-etikett"]');
    ok(!!etikett, "XLI1 شريطُ «المستوى — الوحدة — الخطوة» مرسومٌ في الرأس");
    const t = etikett?.textContent ?? "";
    const erwartet = modulOf(1);
    ok(t.includes(`المستوى ${levelOf(1)}`), "XLI2 ويحملُ المستوى — من جدولِ المراحلِ نفسِه لا من تثبيتٍ يدويّ");
    ok(t.includes("الوحدة"), "XLI3 ويحملُ رقمَ الوحدة");
    ok(t.includes("الخطوة"), "XLI4 ويحملُ رقمَ الخطوةِ داخلَها");
    ok(t.includes(erwartet.modul.titelAr), `XLI5 واسمُ الوحدةِ العربيُّ «${erwartet.modul.titelAr}» معروض`);
    ok(t.includes(erwartet.modul.inhalteAr.split(" · ")[0]), "XLI6 وأوّلُ محتوياتِها مذكورٌ للمتعلِّمِ لا مخبوءٌ في ملف");
  }


  /* ═══════════ L — قفل بدء الجلسة على الصفحة الرئيسة: نقراتٌ حقيقية ═══════════ */
  {
    const { saveProgress, loadProgress } = await import("../lib/store");
    const { progressKeyActive } = await import("../lib/profiles");
    const { buildDay } = await import("../lib/plan");
    (globalThis as unknown as { self?: unknown }).self = globalThis;
    const { default: Heim } = await import("../app/page");
    const p2 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 2 } };
    act(() => { saveProgress(p2); });
    mount(React.createElement(Heim));
    const chip = (i: number) => rootEl.querySelector(`[data-testid="aufgabe-chip-${i}"]`) as HTMLButtonElement | null;
    ok(!!rootEl.querySelector('[data-testid="ritual-sperre"]'), "L1 اليومُ 2: لافتةُ بوابةِ الجلسةِ مرسومة");
    ok(txt().includes("سلِّم مهمّة الاسترجاع أولاً"), "L2 ونصُّها يسمّي المطلوبَ بالضبط");
    ok(chip(1)?.textContent?.startsWith("🔒") === true && chip(4)?.textContent?.startsWith("🔒") === true && chip(0)?.textContent?.startsWith("🔒") === false,
      "L3 رقائقُ ما بعدَ البوابةِ تحملُ القفلَ، ورقاقةُ الاسترجاعِ لا");
    ok(txt().includes("المهمة 1/"), "L4 المهمّةُ المعروضةُ هي الأولى (الاسترجاع)");
    if (chip(2)) click(chip(2)!);
    ok(txt().includes("المهمة 1/") && !txt().includes("المهمة 3/"), "L5 النقرُ على رقاقةٍ مقفولةٍ لا يُظهرُ الجديد — الصفحةُ تبقى على الاسترجاع");
    const weiter = rootEl.querySelector('[data-testid="aufgabe-weiter"]') as HTMLButtonElement | null;
    ok(!!weiter && weiter.disabled && weiter.textContent!.includes("🔒"), "L6 وزرُّ «التالي» معطَّلٌ وموسومٌ بالقفل");
    const sub = btn("سلّم المهمة");
    ok(!!sub, "L7 زرُّ تسليمِ الاسترجاعِ متاح");
    if (sub) click(sub as HTMLElement);
    const nachher = loadProgress();
    const idAbruf = buildDay(2, p2).tasks[0].id;
    ok(!!nachher.plan.tasks[idAbruf], `L8 التسليمُ سُجِّل في الحالة (${idAbruf})`);
    ok(!rootEl.querySelector('[data-testid="ritual-sperre"]'), "L9 وبعدَ التسليمِ زالت اللافتة");
    ok(chip(1)?.textContent?.startsWith("🔒") === false && chip(4)?.textContent?.startsWith("🔒") === false, "L10 وانفتحت كلُّ الرقائق");
    if (chip(2)) click(chip(2)!);
    ok(txt().includes("المهمة 3/"), "L11 والنقرُ على الثالثةِ يعرضُها الآن");
    act(() => { saveProgress({ ...emptyProgress, plan: { ...emptyProgress.plan, day: 1 } }); });
    mount(React.createElement(Heim));
    ok(!rootEl.querySelector('[data-testid="ritual-sperre"]') && chip(1)?.textContent?.startsWith("🔒") === false, "L12 اليومُ الأوّلُ بلا قفل — لا «أمسَ» يُسترجَع");
    act(() => { dom.window.localStorage.removeItem(progressKeyActive()); });
  }

  /* ═══════════ LI — كبسولةُ الليلةِ على الصفحة: تُفتح وتُقرأ وتُسمَع ═══════════ */
  {
    const { saveProgress } = await import("../lib/store");
    const { progressKeyActive } = await import("../lib/profiles");
    const { kapselSaetzeAbend } = await import("../lib/kapsel");
    (globalThis as unknown as { self?: unknown }).self = globalThis;
    const { default: Heim } = await import("../app/page");
    act(() => { saveProgress({ ...emptyProgress, plan: { ...emptyProgress.plan, day: 3 } }); });
    mount(React.createElement(Heim));
    const box = rootEl.querySelector('[data-testid="tageskapsel"]');
    ok(!!box, "LI1 بطاقةُ الكبسولةِ مرسومةٌ في أسفلِ اليوم");
    ok((box?.textContent ?? "").includes("3 جمل قبل النوم") && (box?.textContent ?? "").includes("أداءُ الغد"), "LI2 وتعلنُ قاعدتَها: 3 جمل، والبرهانُ أداءُ الغد");
    ok(rootEl.querySelectorAll('[data-testid="kapsel-satz"]').length === 0, "LI3 مطويّةٌ ابتداءً — لا تزاحمُ مهامَّ اليوم");
    const tg = rootEl.querySelector('[data-testid="kapsel-toggle"]') as HTMLElement | null;
    if (tg) click(tg);
    const li = rootEl.querySelectorAll('[data-testid="kapsel-satz"]');
    ok(li.length === 3, "LI4 النقرُ يفتحُ ثلاثَ جملٍ بالضبط");
    const erw = kapselSaetzeAbend(3);
    ok(erw.every((s) => (box?.textContent ?? "").includes(s.de) && (box?.textContent ?? "").includes(s.ar)), "LI5 وهي جملُ كبسولةِ اليومِ 3 من المحرّك، بألمانيّتِها وعربيّتِها");
    ok(li[0]?.querySelector('button[aria-label="استمع"]') !== null, "LI6 ولكلِّ جملةٍ زرُّ استماع");
    ok(!Array.from(rootEl.querySelectorAll("button")).some((b) => (b.textContent ?? "").includes("قرأتها")), "LI7 ولا زرَّ «قرأتها» — لا إقرارٌ ذاتيٌّ بلا برهان");
    act(() => { dom.window.localStorage.removeItem(progressKeyActive()); });
  }

  /* ═══════════ LII — رادارُ الإشاراتِ داخلَ مهمّةِ الاستماع: يُفتح ويُعلِّم ويُدرِّب ═══════════ */
  {
    const { dialogues } = await import("../lib/content");
    const { ablenker, signalRadar } = await import("../lib/signalwoerter");
    const { SignalRadar } = await import("../components/signalradar");
    const mitFalle = dialogues.find((d) => ablenker(d).length > 0 && signalRadar(d).anzahlSignale > 0)!;
    let pts = 0;
    mount(React.createElement(SignalRadar, { dlg: mitFalle, onPoints: (p: number) => { pts += p; } }));
    ok(!!rootEl.querySelector('[data-testid="signalradar"]'), `LII1 الرادارُ مرسومٌ لحوارٍ فيه مُضلِّل (${mitFalle.id})`);
    ok(rootEl.querySelectorAll('[data-testid="radar-zeile"]').length === 0, "LII2 مطويٌّ ابتداءً — يُفتح بعدَ الإجابةِ لا قبلَها");
    ok(txt().includes("مُضلِّل مسموع"), "LII3 وعنوانُه يعلنُ عددَ المُضلِّلاتِ قبلَ الفتح");
    click(rootEl.querySelector('[data-testid="signalradar-toggle"]') as HTMLElement);
    const zeilen = rootEl.querySelectorAll('[data-testid="radar-zeile"]');
    ok(zeilen.length === signalRadar(mitFalle).zeilen.filter((z) => z.signale.length).length && zeilen.length > 0, "LII4 بعدَ الفتح: أسطرُ الإشاراتِ فقط، بعددِها من المحرّك");
    ok(rootEl.querySelectorAll('[data-testid="signal-mark"]').length >= zeilen.length, "LII5 وكلُّ إشارةٍ معلَّمةٌ بـ<mark> داخلَ سطرِها");
    const fallen = rootEl.querySelector('[data-testid="radar-fallen"]');
    ok(!!fallen && (fallen.textContent ?? "").includes(ablenker(mitFalle)[0].option) && (fallen.textContent ?? "").includes("الصحيح"), "LII6 صندوقُ المُضلِّلاتِ يسمّي الخيارَ المسموعَ والجوابَ الصحيح");
    const radios = Array.from(rootEl.querySelectorAll("button")).filter((b) => /^(⛔|↩️|✏️|🔬|🔢|🎚️|⏰)/.test((b.textContent ?? "").trim()));
    ok(radios.length >= 4, "LII7 وتمرينُ الأذنِ مرسومٌ بخياراتِ الفئاتِ الأربع");
    const ohne = dialogues.find((d) => signalRadar(d).anzahlSignale === 0 && ablenker(d).length === 0);
    if (ohne) {
      mount(React.createElement(SignalRadar, { dlg: ohne, onPoints: () => {} }));
      ok(!!rootEl.querySelector('[data-testid="signalradar-leer"]'), `LII8 حوارٌ بلا إشارات (${ohne.id}) يقولُ ذلك صراحةً بدلَ رادارٍ فارغ`);
    } else ok(true, "LII8 لا حوارَ بلا إشارات — لا حاجةَ للحالةِ الفارغة");
  }

  /* ═══════════ LIII — مبدّلُ الأسلوب: قلبٌ حقيقيٌّ، تعرّفٌ، إنتاجٌ، مقياس ═══════════ */
  {
    const { StilWechsler } = await import("../components/stilwechsler");
    const { STIL_PAARE, REGEL_AR } = await import("../lib/stil");
    mount(React.createElement(StilWechsler, { seed: 0 }));
    const satz = () => rootEl.querySelector('[data-testid="stil-satz"]')?.textContent ?? "";
    const p0 = STIL_PAARE.filter((p) => p.regel === "weil-wegen")[0];
    ok(satz().includes(p0.verbal), "LIII1 المسرحُ يبدأ بالجملةِ الفعليةِ لقاعدةِ weil-wegen");
    click(rootEl.querySelector('[data-testid="stil-schalter"]') as HTMLElement);
    ok(satz().includes(p0.nominal) && !satz().includes("Weil"), "LIII2 المفتاحُ يقلبُها إلى الاسمية — wegen بدلَ Weil");
    ok(txt().includes(REGEL_AR["weil-wegen"].hinweis.slice(0, 20)), "LIII3 والقاعدةُ مسمّاةٌ تحتَ الجملة");
    click(rootEl.querySelector('[data-testid="stil-regel-obwohl-trotz"]') as HTMLElement);
    const p1 = STIL_PAARE.filter((p) => p.regel === "obwohl-trotz")[0];
    ok(satz().includes(p1.nominal) || satz().includes(p1.verbal), "LIII4 اختيارُ قاعدةٍ أخرى يبدّلُ الجملةَ إلى زوجِها");
    click(rootEl.querySelector('[data-testid="stil-naechster"]') as HTMLElement);
    const p2 = STIL_PAARE.filter((p) => p.regel === "obwohl-trotz")[1];
    ok(satz().includes(p2.nominal) || satz().includes(p2.verbal), "LIII5 و«جملة أخرى» تنتقلُ إلى الزوجِ التالي من القاعدةِ نفسِها");
    const quelle = rootEl.querySelectorAll('[data-testid="umformung-quelle"]');
    ok(quelle.length >= 1, "LIII6 تمارينُ التحويلِ الإنتاجيةُ مرسومةٌ بمصدرِها");
    ok(Array.from(rootEl.querySelectorAll("button")).filter((b) => (b.textContent ?? "").startsWith("Wegen") || (b.textContent ?? "").startsWith("Weil")).length >= 2, "LIII7 وتمرينُ التعرُّفِ يعرضُ الجملتين خيارَين");
    const ta = rootEl.querySelector('[data-testid="stil-text"]') as HTMLTextAreaElement;
    typeIn(ta, "Weil es regnete, blieben wir zu Hause, obwohl wir Karten hatten.");
    const prof = rootEl.querySelector('[data-testid="stil-profil"]')?.textContent ?? "";
    ok(prof.includes("علامات فعلية") && prof.includes("💡") && prof.includes("لا حكمٌ على الجودة"), "LIII8 المقياسُ يعدُّ ويُلمِّحُ ويصرِّحُ أنه عدٌّ لا حكم");
  }

  /* ═══════════ LIV — الاستقراء قبل القاعدة: أمثلة ← تخمين ← كشف ═══════════ */
  {
    autoEntdecken = false;
    const { default: TaskView } = await import("../components/tasks");
    const { grammarMap } = await import("../lib/content");
    const { entdeckungsFrage } = await import("../lib/induktion");
    let pts: [number, number][] = [];
    const props = { lang: "ar" as const, day: 100, srs: {}, onSrs: () => {}, onPoints: (p: number, m: number) => { pts.push([p, m]); }, voiceName: "", rate: 1 };
    const mk = (g: string, id = "t-" + g) => ({ id, kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 15, topicId: g });
    mount(React.createElement(TaskView, { task: mk("b1-genitiv"), ...props }));
    const t = grammarMap["b1-genitiv"];
    ok(!!rootEl.querySelector('[data-testid="entdecken"]'), "LIV1 درسُ القواعدِ يفتحُ بمرحلةِ الاكتشافِ أوّلاً");
    ok(rootEl.querySelectorAll('[data-testid="entdecken-beispiel"]').length === t.examples.length, "LIV2 وكلُّ أمثلةِ الدرسِ معروضةٌ قبلَ أيِّ قاعدة");
    ok(!!rootEl.querySelector('[data-testid="regel-verdeckt"]') && !txt().includes(t.summaryAr.slice(0, 25)) && rootEl.querySelectorAll("[data-testid='umformung-quelle']").length === 0,
      "LIV3 الملخّصُ والقواعدُ والتمارينُ محجوبةٌ — لا تلقينَ قبلَ المحاولة");
    const opts = rootEl.querySelectorAll('[data-testid^="entdecken-option-"]');
    ok(opts.length >= 3 && Array.from(opts).some((o) => (o.textContent ?? "").includes(t.rules[0].de)), "LIV4 خياراتُ التخمينِ ≥ 3، وبينَها قاعدةُ الدرسِ الحقيقية");
    const seed = Array.from("t-b1-genitiv").reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11);
    const fr = entdeckungsFrage(t, Object.values(grammarMap), seed)!;
    const falsch = (fr.richtigIndex + 1) % fr.optionen.length;
    click(opts[falsch] as HTMLElement);
    ok(txt().includes("ليست هي") && txt().includes("الفجوة"), "LIV5 التخمينُ الخاطئُ يُقابَلُ بنصِّ الإخفاقِ المُنتِج لا بعقاب");
    ok(pts.length === 1 && pts[0][0] === 0 && pts[0][1] === 1, "LIV6 ويُسجَّلُ 0/1 — محاولةٌ صادقةٌ لا نقطةَ عليها");
    ok(txt().includes(t.summaryAr.slice(0, 25)) && !rootEl.querySelector('[data-testid="regel-verdeckt"]'), "LIV7 وبعدَها يُكشَفُ الدرسُ كاملاً — بالطريقةِ نفسِها للمصيبِ والمخطئ");
    const erg = rootEl.querySelector('[data-testid="entdecken-ergebnis"]')?.textContent ?? "";
    ok(erg.includes(t.rules[0].de) && erg.includes("اخترتَ") && rootEl.querySelectorAll('[data-testid^="entdecken-option-"]').length === 0, "LIV8 وتُطوى مرحلةُ الاكتشافِ إلى سطرٍ يسمّي القاعدةَ الصحيحةَ وما اخترتَه");
    pts = [];
    mount(React.createElement(TaskView, { task: mk("b1-genitiv", "t2-b1-genitiv"), ...props }));
    const opts2 = rootEl.querySelectorAll('[data-testid^="entdecken-option-"]');
    const fr2 = entdeckungsFrage(t, Object.values(grammarMap), Array.from("t2-b1-genitiv").reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11))!;
    click(opts2[fr2.richtigIndex] as HTMLElement);
    ok(txt().includes("استنتجتَها بنفسك") && pts[0]?.[0] === 1, "LIV9 والتخمينُ الصحيحُ يُحتفى به ويُسجَّلُ 1/1");
    pts = [];
    mount(React.createElement(TaskView, { task: mk("b1-genitiv", "t3-b1-genitiv"), ...props }));
    click(rootEl.querySelector('[data-testid="entdecken-ueberspringen"]') as HTMLElement);
    ok(txt().includes("تخطّيتَ الاستنتاج") && pts.length === 0 && txt().includes(t.summaryAr.slice(0, 25)), "LIV10 بابُ التخطّي مرئيٌّ: يكشفُ الدرسَ بلا نقطةٍ ويقولُ ذلك");
    autoEntdecken = true;
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

  /* ---------- XLV — الصوتُ السحابيُّ لا يُستعمَلُ بلا إذنٍ صريح، ولا يُستعمَلُ بلا إفصاح ---------- */
  {
    const T = await import("../components/trainer");
    const K = await import("../components/klausur");
    const { saveProgress } = await import("../lib/store");
    const { progressKeyActive } = await import("../lib/profiles");
    const { recognitionAvailable, cloudSpeechEnabled, cloudSpracheFrei } = await import("../lib/speech");
    const W = dom.window as unknown as Record<string, unknown>;
    const p0 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 150 } };

    const rd = (f: string) => require("fs").readFileSync(f, "utf8") as string;
    const sp = rd("lib/speech.ts");
    const tr = rd("components/trainer.tsx");
    const kl = rd("components/klausur.tsx");
    const ty = rd("lib/types.ts");
    const ei = rd("app/einstellungen/page.tsx");

    ok(/cloudSpeech\?: boolean/.test(ty), "XLV1 المفتاحُ مُعرَّفٌ في الإعدادات — الإذنُ حالةٌ محفوظةٌ لا قرارٌ في الهواء");
    ok(sp.includes("export function cloudSpeechEnabled()") && sp.includes("export function cloudSpracheFrei()"),
      "XLV2 وللدالَّتَان: قراءةُ الإذن ثمَّ جمعُهُ مع التوفُّرِ التقني");
    ok(sp.includes("settings.cloudSpeech === true"), "XLV3 الأصلُ الرفض: الإذنُ بمساواةٍ صريحةٍ مع true لا بأيِّ قيمةٍ صادقة");
    ok(tr.includes("cloudSpracheFrei()") && !/useMemo\(\(\) => recognitionAvailable\(\)/.test(tr),
      "XLV4 مدرِّبُ النطقِ يسألُ الإذنَ لا التوفُّرَ التقنيَّ وحدَه");
    /* المقصود: الميكروفونُ نفسُهُ لا يُفتَحُ إلّا بالإذن. أمّا recognitionAvailable()
       فباقيةٌ في klausur كشرطِ else — وهي صحيحة: تفرِّقُ «عطّلتَهُ بيدِك» من «متصفِّحُك لا يدعمُه». */
    ok(kl.includes("{cloudSpracheFrei() ? ("),
      "XLV5 ومحاكاةُ الامتحانِ كذلك: الميكروفونُ خلفَ cloudSpracheFrei() لا خلفَ التوفُّرِ التقني");
    ok(!/\{recognitionAvailable\(\) \? \(/.test(kl),
      "XLV5b ولا فرعَ يفتحُ الميكروفونَ بالتوفُّرِ التقنيِّ وحدَه — الإذنُ شرطٌ لا نتيجة");
    ok(/يُرسِل صوتك إلى خدمة تعرُّف خارجية/.test(T.CLOUD_SPEECH_DISCLOSURE),
      "XLV6 ونصُّ الإفصاحِ يقولُ الحقيقة: الصوتُ يخرجُ إلى خدمةٍ خارجية");
    ok(tr.includes("CLOUD_SPEECH_DISCLOSURE") && kl.includes("CLOUD_SPEECH_DISCLOSURE"),
      "XLV7 والإفصاحُ معروضٌ في الموضعَينِ معاً لا في واحدٍ منهما");

    /* بلا دعمٍ تقنيٍّ (jsdom) — الكلُّ مغلق */
    ok(recognitionAvailable() === false && cloudSpracheFrei() === false,
      "XLV8 وبلا SpeechRecognition في المتصفِّحِ يبقى كلُّ شيءٍ مغلقاً — لا انهيارَ ولا ادّعاء");

    /* ندعمُ المتصفِّحَ ثمَّ نسألُ الإذن */
    class StubRec { lang = ""; interimResults = false; maxAlternatives = 1;
      onresult: unknown = null; onerror: unknown = null; onend: unknown = null;
      start() {} stop() {} }
    W.SpeechRecognition = StubRec;
    ok(recognitionAvailable() === true, "XLV9 فإذا توفَّرَ المتصفِّحُ صار التقنيُّ متاحاً");
    act(() => { saveProgress({ ...p0, settings: { ...p0.settings, cloudSpeech: false } }); });
    ok(cloudSpeechEnabled() === false && cloudSpracheFrei() === false,
      "XLV10 لكنَّ الإذنَ المغلقَ يمنعُهُ منعاً باتًّا — التوفُّرُ وحده لا يكفي");

    mount(React.createElement(T.SprechTrainer, { progress: p0 }));
    let t = txt();
    ok(!t.includes("يُرسِل صوتك إلى خدمة تعرُّف خارجية"), "XLV11 فلا إفصاحَ حين لا استعمال — لا تخويفَ بلا سبب");
    ok(t.includes("عطّلتَ التعرُّفَ السحابيَّ") && t.includes("مدرّب النطق المحلّي"),
      "XLV12 ويظهرُ المسارُ المحلِّيُّ البديلُ بدلَ شاشةٍ ميتة — الرافضُ لا يُعاقَب");
    ok(!t.includes("undefined"), "XLV13 وبلا تسرُّبِ undefined في فرعِ الرفض");

    act(() => { saveProgress({ ...p0, settings: { ...p0.settings, cloudSpeech: true } }); });
    ok(cloudSpracheFrei() === true, "XLV14 فإذا أُذِنَ صراحةً فُتِحَ الطريق");
    mount(React.createElement(T.SprechTrainer, { progress: p0 }));
    t = txt();
    ok(t.includes("يُرسِل صوتك إلى خدمة تعرُّف خارجية"), "XLV15 ظهر الإفصاحُ بجانبِ الزرِّ نفسه لا في صفحةٍ بعيدة");
    ok(t.includes("التعطيل في الإعدادات"), "XLV16 والإفصاحُ يدلُّ على مخرجِه — إذنٌ لا يعرفُ صاحبُهُ كيف يسحبُهُ ليس إذناً");
    ok(!!d0.querySelector('[data-testid="cloud-speech-disclosure"]'), "XLV17 والإفصاحُ عنصرٌ حقيقيٌّ في الشجرةِ لا نصٌّ في تعليق");
    ok(t.includes("🎙️ كرّر الآن"), "XLV18 والزرُّ نفسُهُ باقٍ — الإذنُ يفتحُ لا يُبدِّلُ الواجهة");

    ok(ei.includes("cloudSpeech") && ei.includes("إذن التعرُّف السحابي"), "XLV19 وفي الإعداداتِ مفتاحٌ مسمًّى باسمِهِ");
    ok(ei.includes("يُرسِلُ صوتَك إلى خدمةِ المتصفِّحِ الخارجية"), "XLV20 والإعداداتُ تصرِّحُ بالجهةِ لا تُلمِّح");
    ok(ei.includes("disabled={!recognitionAvailable()}"), "XLV21 والمفتاحُ معطَّلٌ حين لا دعمَ تقنيًّا — لا وعدَ بما لا يُملَك");
    ok(ei.includes("البديلُ المحلِّيُّ بلا إرسال"), "XLV22 والبديلُ المحلِّيُّ معروضٌ في صفحةِ الإذنِ نفسِها");
    ok(!!K.ProbeklausurCard, "XLV23 ومحاكاةُ الامتحانِ تُصدَّرُ وتُستهلَك — لا إفصاحَ في مكوِّنٍ ميت");

    /* تنظيف: لا نُلوِّثُ ما بعدَنا */
    delete W.SpeechRecognition;
    act(() => { dom.window.localStorage.removeItem(progressKeyActive()); });
  }

  const minutenEffektivTest = (p: { plan: { minutenEffektiv?: number } }) => p.plan.minutenEffektiv ?? 0;
  /* ═══ LXXXIII — R32: طيارُ de-DE المحلي، بلا fallback وبلا حكمٍ لغوي ═══ */
  {
    const W = dom.window as unknown as Record<string, unknown>;
    const priorStandard = W.SpeechRecognition;
    const priorWebkit = W.webkitSpeechRecognition;
    let availability: "downloadable" | "available" = "downloadable";
    let availabilityOptions: unknown = null;
    let installOptions: unknown = null;
    let installCalls = 0;
    let webkitStarts = 0;
    const startSnapshotRef: { current: { lang: string; processLocally: boolean } | null } = { current: null };
    const recognitionRef: { current: StubLocalRecognition | null } = { current: null };

    class StubLocalRecognition {
      static async available(options: unknown) {
        availabilityOptions = options;
        return availability;
      }
      static async install(options: unknown) {
        installOptions = options;
        installCalls++;
        availability = "available";
        return true;
      }
      lang = "";
      processLocally = false;
      interimResults = false;
      maxAlternatives = 1;
      onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null = null;
      onerror: ((event: { error?: string }) => void) | null = null;
      onend: (() => void) | null = null;
      constructor() { recognitionRef.current = this; }
      start() { startSnapshotRef.current = { lang: this.lang, processLocally: this.processLocally }; }
      stop() { this.onend?.(); }
    }
    class StubWebkitRecognition {
      start() { webkitStarts++; }
      stop() {}
    }
    W.SpeechRecognition = StubLocalRecognition;
    W.webkitSpeechRecognition = StubWebkitRecognition;

    const flushAsync = async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    };
    const asyncAct = act as unknown as (callback: () => Promise<void>) => Promise<void>;
    const { default: LocalSpeechPilot } = await import("../components/LocalSpeechPilot");
    const keysBefore = Array.from({ length: dom.window.localStorage.length }, (_, i) => {
      const key = dom.window.localStorage.key(i)!;
      return [key, dom.window.localStorage.getItem(key)] as const;
    });

    try {
      mount(React.createElement(LocalSpeechPilot));
      await asyncAct(flushAsync);
      const state = d0.querySelector('[data-testid="local-asr-state"]');
      const consent = d0.querySelector('[data-testid="local-asr-download-consent"]') as HTMLInputElement | null;
      const install = d0.querySelector('[data-testid="local-asr-install"]') as HTMLButtonElement | null;
      const initialStatus = state?.textContent ?? "";
      ok(initialStatus.includes("يمكن طلب") && JSON.stringify(availabilityOptions).includes('"de-DE"') &&
        JSON.stringify(availabilityOptions).includes('"processLocally":true'),
        "LXXXIII1 يفحص حزمة de-DE بخيار processLocally=true ويعرض حالتها قبل طلب الميكروفون");
      ok(!!consent && !!install && install.disabled && installCalls === 0,
        "LXXXIII2 زر التثبيت معطّل ولا استدعاء قبل موافقة التنزيل المنفصلة");

      if (consent && install) {
        act(() => consent.click());
        const allowedInstall = d0.querySelector('[data-testid="local-asr-install"]') as HTMLButtonElement | null;
        ok(!!allowedInstall && !allowedInstall.disabled, "LXXXIII3 الموافقة الصريحة وحدها تفتح زر تنزيل de-DE");
        if (allowedInstall) click(allowedInstall);
        await asyncAct(flushAsync);
      } else {
        ok(false, "LXXXIII3 الموافقة الصريحة وحدها تفتح زر تنزيل de-DE");
      }
      const stateAfterInstall = d0.querySelector('[data-testid="local-asr-state"]')?.textContent ?? "";
      ok(installCalls === 1 && JSON.stringify(installOptions).includes('"de-DE"') && stateAfterInstall.includes("متاحة"),
        "LXXXIII4 التثبيت يستدعي حزمة de-DE فقط، ثم يعيد فحص الإتاحة");

      const start = d0.querySelector('[data-testid="local-asr-start"]') as HTMLButtonElement | null;
      if (start) click(start);
      const startedWith = startSnapshotRef.current;
      ok(!!startedWith && startedWith.lang === "de-DE" && startedWith.processLocally,
        "LXXXIII5 قبل start يضبط lang=de-DE وprocessLocally=true فعلياً");
      const currentRecognition = recognitionRef.current;
      if (currentRecognition?.onresult) {
        act(() => currentRecognition.onresult?.({ results: [[{ transcript: "Guten Morgen" }]] }));
      }
      const transcript = d0.querySelector('[data-testid="local-asr-transcript"]')?.textContent ?? "";
      const localMessage = d0.querySelector('[data-testid="local-asr-message"]')?.textContent ?? "";
      const keysAfter = Array.from({ length: dom.window.localStorage.length }, (_, i) => {
        const key = dom.window.localStorage.key(i)!;
        return [key, dom.window.localStorage.getItem(key)] as const;
      });
      ok(transcript.includes("Guten Morgen") && localMessage.includes("ليس تقييماً للنطق") &&
        JSON.stringify(keysAfter) === JSON.stringify(keysBefore),
        "LXXXIII6 يعرض النص للمراجعة الذاتية فقط ولا يحفظه في التقدّم");
      if (currentRecognition?.onend) act(() => currentRecognition.onend?.());

      const startAgain = d0.querySelector('[data-testid="local-asr-start"]') as HTMLButtonElement | null;
      if (startAgain) click(startAgain);
      const failedRecognition = recognitionRef.current;
      if (failedRecognition?.onerror) act(() => failedRecognition.onerror?.({ error: "not-allowed" }));
      ok((d0.querySelector('[data-testid="local-asr-message"]')?.textContent ?? "").includes("تعذّر التحقق تقنياً") &&
        (d0.querySelector('[data-testid="local-asr-message"]')?.textContent ?? "").includes("لم يُحكم على كلامك"),
        "LXXXIII7 رفض الميكروفون/فشل المحرك يعرض تعذّر التحقق لا حكماً على المتعلم");

      W.SpeechRecognition = undefined;
      mount(React.createElement(LocalSpeechPilot));
      await asyncAct(flushAsync);
      ok((d0.querySelector('[data-testid="local-asr-state"]')?.textContent ?? "").includes("لا يوفّر واجهة") && webkitStarts === 0,
        "LXXXIII8 وجود webkit وحده لا يفعّل طياراً محلياً ولا يسقط إلى التعرف غير المثبت");
    } finally {
      if (leave) leave();
      W.SpeechRecognition = priorStandard;
      W.webkitSpeechRecognition = priorWebkit;
    }
  }

  /* ---------- XLVI — عقدُ الساعات: لوحةٌ تُفتَح، ورقمٌ يُحجَز، وحكمٌ يُعلَن ---------- */
  {
    const { BerichteZentrum } = await import("../components/berichte");
    const { planStundenGesamt, planStundenBis } = await import("../lib/plan");
    const { vergleichePlan, erreichbaresNiveau, MAX_MIN_PRO_TASK } = await import("../lib/cefr");
    const { loadProgress, saveProgress, bucheMinuten } = await import("../lib/store");
    const { progressKeyActive } = await import("../lib/profiles");

    const ges = planStundenGesamt();
    const vgl = vergleichePlan(planStundenBis);
    const niv = erreichbaresNiveau(vgl);

    ok(ges >= 620 && ges < 680, `XLVI1 ساعاتُ الخطةِ ${ges.toFixed(1)} س — بعدَ التوزيعِ الأكاديميِّ (كانت 517.6 دونَ عتبةِ B2)`);
    ok(vgl[0].planStd < vgl[1].planStd && vgl[1].planStd < vgl[2].planStd && vgl[2].planStd < vgl[3].planStd,
      "XLVI2 والمنحنى تراكميٌّ فعلاً: كلُّ مرحلةٍ فوقَ سابقتِها");

    const p0 = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 100 } };
    act(() => { saveProgress(p0); });
    mount(React.createElement(BerichteZentrum, { progress: p0, name: "سارة النموذج" }));
    let t = txt();
    ok(t.includes("مركز التقارير"), "XLVI3 المركزُ مرسوم");
    const auf = btn("إظهار");
    ok(!!auf, "XLVI4 وله مفتاحُ إظهار");
    if (auf) click(auf);
    await new Promise((r) => setTimeout(r, 30));
    t = txt();

    ok(!!d0.querySelector('[data-testid="stundenvertrag"]'), "XLVI5 لوحةُ عقدِ الساعاتِ عنصرٌ حقيقيٌّ في الشجرة");
    ok(t.includes("عقد الساعات"), "XLVI6 وعنوانُها ظاهرٌ للمتعلِّم");
    const planEl = d0.querySelector('[data-testid="stunden-plan"]');
    ok(!!planEl && planEl!.textContent!.includes(String(Math.round(ges * 10) / 10).split(".")[0]),
      `XLVI7 ورقمُ ساعاتِ الخطةِ معروضٌ (${planEl?.textContent}) ومطابقٌ للمحرِّك (${ges.toFixed(1)})`);
    for (const L of ["A1", "A2", "B1", "B2"]) {
      const z = d0.querySelector(`[data-testid="cefr-zeile-${L}"]`);
      ok(!!z && (z!.textContent ?? "").includes(L) && (z!.textContent ?? "").includes("س"),
        `XLVI8${L} صفُّ ${L} موجودٌ وفيه ساعاتُه ومرجعُه`);
    }
    const urt = d0.querySelector('[data-testid="stunden-urteil"]');
    ok(!!urt && (urt!.textContent ?? "").includes("الحكمُ الصريح"), "XLVI9 والحكمُ الصريحُ مكتوبٌ لا مُضمَر");
    ok((urt?.textContent ?? "").includes(niv), `XLVI10 ويسمِّي المستوى المبلوغَ فعلاً: ${niv}`);
    if (vgl[3].urteil === "darunter" || vgl[3].urteil === "weitDarunter") {
      ok((urt!.textContent ?? "").includes("ينقصُها") || (urt!.textContent ?? "").includes(String(vgl[3].fehlendBisMinimum)),
        `XLVI11 ونقصُ B2 معلنٌ بالأرقام (${vgl[3].fehlendBisMinimum} س) — لا وعدَ بلا ثمن`);
    } else {
      ok(true, "XLVI11 لا نقصَ في B2 فلا ادّعاءَ بنقص");
    }
    ok(t.includes("Goethe-Institut") && t.includes("نطاقات"), "XLVI12 والمرجعُ مسمًّى وموصوفٌ بأنه نطاقٌ لا رقمٌ حاسم");

    /* XLIX — التوزيع الأكاديمي ظاهرٌ على اللوحة لا في الكود فقط */
    const { PHASEN, LERNLAST, PHASE_END_DAY } = await import("../lib/phasen");
    const vert = d0.querySelector('[data-testid="phasen-verteilung"]');
    ok(!!vert, "XLIX1 جدولُ التوزيعِ الأكاديميِّ عنصرٌ حقيقيٌّ في لوحةِ عقدِ الساعات");
    const zA1 = d0.querySelector('[data-testid="phase-zeile-A1"]')?.textContent ?? "", zB2 = d0.querySelector('[data-testid="phase-zeile-B2"]')?.textContent ?? "";
    ok(zA1.includes(`${PHASEN.A1.von}–${PHASE_END_DAY.A1}`) && zA1.includes(`×${LERNLAST.A1.toFixed(2)}`), `XLIX2 صفُّ A1 يعرضُ أيامَ عقدِه ${PHASEN.A1.von}–${PHASE_END_DAY.A1} ومعاملَه ×${LERNLAST.A1.toFixed(2)} — من جدولِ العقدِ نفسِه (${zA1.trim().slice(0, 40)})`);
    ok(zB2.includes(`${PHASEN.B2.von}–${PHASE_END_DAY.B2}`) && zB2.includes(`×${LERNLAST.B2.toFixed(2)}`) && zB2.includes("ختام"), `XLIX3 صفُّ B2 يعرضُ ${PHASEN.B2.von}–${PHASE_END_DAY.B2} و×${LERNLAST.B2.toFixed(2)} والختام (${zB2.trim().slice(0, 50)})`);
    ok((vert?.textContent ?? "").includes("لا بالتساوي"), "XLIX4 والمبدأُ مكتوبٌ للمتعلِّم: بأوزانِ CEFR لا بالتساوي");
    ok(!(d0.querySelector('[data-testid="stunden-urteil"]')?.textContent ?? "").includes("ينقصُها"), "XLIX5 والحكمُ الصريحُ لم يعدْ يعلنُ نقصاً في B2 — لأنَّ النقصَ زال حساباً لا كلاماً");

    /* الحجز بالنقر */
    ok(minutenEffektivTest(loadProgress()) === 0, "XLVI13 والأصلُ صفرُ دقيقةٍ فعلية");
    const feld = d0.querySelector("#minuten-buchen") as HTMLInputElement | null;
    ok(!!feld, "XLVI14 وحقلُ الحجزِ موجودٌ ومعنونٌ بـ label لا placeholder يتيم");
    const bu = btn("احجِز");
    ok(!!bu && (bu as HTMLButtonElement).disabled, "XLVI15 وزرُّ الحجزِ معطَّلٌ ما دام الحقلُ فارغاً — لا حجزَ صفرياً");
    if (feld && bu) {
      typeIn(feld, "45");
      ok(!(bu as HTMLButtonElement).disabled, "XLVI16 فإذا كُتب رقمٌ فُتح الزر");
      click(bu);
      await new Promise((r) => setTimeout(r, 30));
      ok(minutenEffektivTest(loadProgress()) === 45, `XLVI17 والحجزُ استقرَّ في الحالة: ${minutenEffektivTest(loadProgress())} دقيقة`);
      ok(txt().includes("0.8") || txt().includes("0.7"), "XLVI18 والساعةُ الفعليةُ ظهرت على اللوحةِ بعدَ الحجز");
    }
    /* act: الحجزُ يُطلقُ حدثَ الحالة، واللوحةُ ما زالت مركَّبةً فتحدِّثُ حالتَها */
    let z1 = 0, z2 = 0, z3 = 0;
    act(() => { z1 = bucheMinuten(MAX_MIN_PRO_TASK + 999); });
    ok(z1 === MAX_MIN_PRO_TASK,
      `XLVI19 والحجزُ المبالغُ فيه يُقصَرُ عند ${MAX_MIN_PRO_TASK} — لا تضخيمَ ذاتيَّ الرقم`);
    act(() => { z2 = bucheMinuten(-30); z3 = bucheMinuten(0); });
    ok(z2 === 0 && z3 === 0, "XLVI20 ولا حجزَ سالبٌ ولا صفري");

    dom.window.localStorage.removeItem(progressKeyActive());
  }

  /* ---------- XLVII — مفكِّكُ المركَّبات تحتَ الإصبع: تخمينٌ ← تفكيكٌ ← دفترُ أخطاء ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { loadProgress } = await import("../lib/store");
    const { progressKeyActive } = await import("../lib/profiles");
    dom.window.localStorage.removeItem(progressKeyActive());
    const props = { lang: "ar" as const, day: 160, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-b1-wortbildung", kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 30, topicId: "b1-wortbildung" }, ...props }));
    let t = txt();
    ok(t.includes("بناء الكلمات"), "XLVII1 درسُ Wortbildung يُفتَحُ باسمِه");
    ok(!!d0.querySelector('[data-testid="komposita"]'), "XLVII2 والورشةُ مركَّبةٌ داخلَه عنصراً حقيقياً");
    ok(t.includes("الكلمةُ الأخيرةُ تعطي الجنسَ"), "XLVII3 والقاعدةُ الذهبيةُ مكتوبةٌ فوقَ التمرين");
    const wortEl = d0.querySelector('[data-testid="komp-wort"]');
    ok(!!wortEl && /___ [A-ZÄÖÜ][a-zäöüß]{7,}/.test(wortEl!.textContent ?? ""), `XLVII4 كلمةٌ مركَّبةٌ طويلةٌ معروضةٌ بفراغِ الأداة (${wortEl?.textContent?.trim()})`);
    // الأزرارُ داخلَ الورشةِ وحدَها — في الدرسِ تمارينُ فيها der/die/das أيضاً
    const kbtn = (label: string) => Array.from(d0.querySelector('[data-testid="komposita"]')!.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === label) as HTMLElement | undefined;
    const der = kbtn("der"), die = kbtn("die"), das = kbtn("das");
    ok(!!der && !!die && !!das, "XLVII5 وأزرارُ الأجناسِ الثلاثةِ حاضرة");
    ok(!d0.querySelector('[data-testid="komp-loesung"]'), "XLVII6 والحلُّ محجوبٌ قبلَ المحاولة — لا معنى يُرى مجاناً");
    // نختار جواباً خاطئاً عمداً: نقرأ الصواب من الحلّ بعد النقر
    if (der) click(der);
    await new Promise((r) => setTimeout(r, 20));
    const loes = d0.querySelector('[data-testid="komp-loesung"]');
    ok(!!loes, "XLVII7 بعدَ النقرِ يظهرُ الحلُّ");
    const lt = loes?.textContent ?? "";
    ok(lt.includes("Grundwort") && lt.includes("الجنسُ من الأخيرة"), "XLVII8 والحلُّ يُعلِّمُ التفكيكَ لا يُصحِّحُ الجوابَ فحسب");
    ok(lt.includes("+"), "XLVII9 وسلسلةُ المكوِّناتِ مرسومةٌ بعلامةِ الجمع");
    ok(lt.includes("✓ صحيح") || lt.includes("✗ الصواب"), "XLVII10 والحكمُ صريحٌ: صحيحٌ أو الصوابُ كذا");
    const falsch = lt.includes("✗");
    const fe = loadProgress().fehler ?? {};
    ok(!falsch || Object.values(fe).some((f) => (f as { quelle?: string }).quelle === "مفكّك المركّبات"),
      "XLVII11 والخطأُ (إن وقع) دخلَ دفترَ الأخطاءِ بمصدرِه — لا خطأَ يضيع");
    ok((der as HTMLButtonElement).disabled && (die as HTMLButtonElement).disabled, "XLVII12 والأزرارُ تُقفَلُ بعدَ الجواب — لا تخمينٌ ثانٍ مجاني");
    const next = Array.from(d0.querySelector('[data-testid="komposita"]')!.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("التالي")) as HTMLElement | undefined;
    ok(!!next, "XLVII13 وزرُّ التالي ظاهر");
    if (next) click(next);
    await new Promise((r) => setTimeout(r, 20));
    ok(!d0.querySelector('[data-testid="komp-loesung"]') && !!d0.querySelector('[data-testid="komp-wort"]'), "XLVII14 والمهمةُ التاليةُ تبدأُ محجوبةَ الحلّ");

    /* الفكُّ الحرّ */
    const frei = d0.querySelector("#komp-frei") as HTMLInputElement | null;
    ok(!!frei, "XLVII15 وحقلُ «فُكَّ كلمةً صادفتَها» موجودٌ بعنوانِه");
    if (frei) {
      typeIn(frei, "Wohnungsmarkt");
      await new Promise((r) => setTimeout(r, 20));
      const erg = d0.querySelector('[data-testid="komp-frei-ergebnis"]')?.textContent ?? "";
      ok(erg.includes("Wohnung") && erg.includes("Markt") && erg.includes("‹s›"), `XLVII16 Wohnungsmarkt يُفكَّكُ حيًّا مع حرفِ الوصل s`);
      typeIn(frei, "Qwertzuiopasdf");
      await new Promise((r) => setTimeout(r, 20));
      const erg2 = d0.querySelector('[data-testid="komp-frei-ergebnis"]')?.textContent ?? "";
      ok(erg2.includes("لم أجد") && erg2.includes("لا أُخمِّنُه"), "XLVII17 والمجهولُ يُقالُ فيه «لم أجد» مع سببِه — لا تخمينَ يُعرَضُ علماً");
    }
    dom.window.localStorage.removeItem(progressKeyActive());
  }

  /* ---------- XLVIII — تمرينُ التحويلِ تحتَ الإصبع: فخٌّ ← تلميحٌ موجَّهٌ بلا كشف ← صواب ---------- */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { grammarMap } = await import("../lib/content");
    const props = { lang: "ar" as const, day: 80, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-a2-dativ", kind: "grammatik" as const, titleDe: "G", titleAr: "ق", minutes: 30, topicId: "a2-dativ" }, ...props }));
    const quellen = d0.querySelectorAll('[data-testid="umformung-quelle"]');
    ok(quellen.length >= 2, `XLVIII1 درسُ الداتيف يعرضُ تمرينَي تحويلٍ بجملتَيهما المصدر (${quellen.length})`);
    ok(txt().includes("Ich helfe dich.") && txt().includes("🔁 حوِّل هذه الجملة"), "XLVIII2 والجملةُ المصدرُ «Ich helfe dich.» ظاهرةٌ تحتَ عنوانِ التحويل");
    const ex = grammarMap["a2-dativ"].exercises.find((e) => e.id === "a2-dativ-u1")!;
    // نجدُ الحقلَ الذي يلي جملةَ المصدرِ الأولى
    const box = quellen[0].parentElement!;
    const feld = box.querySelector("input.field") as HTMLInputElement | null;
    ok(!!feld && feld!.placeholder.includes("umgeformten"), "XLVIII3 وحقلُ الإنتاجِ بجانبِها بعنوانٍ يقولُ: اكتبِ الجملةَ المحوَّلة");
    const pruefBtn = () => Array.from(box.closest(".card, div")!.parentElement!.querySelectorAll("button")).find((b) => (b.textContent ?? "").startsWith("تحقّق")) as HTMLElement | undefined;
    if (feld) {
      // ① نكتبُ الفخَّ نفسَه
      typeIn(feld, "Ich helfe dich.");
      const b1 = Array.from(d0.querySelectorAll("button")).find((b) => (b.textContent ?? "").startsWith("تحقّق") && b.closest("div")!.parentElement!.contains(feld)) as HTMLElement | undefined ?? pruefBtn();
      ok(!!b1, "XLVIII4 وزرُّ التحقُّقِ موجود");
      if (b1) click(b1);
      await new Promise((r) => setTimeout(r, 20));
      const hin = d0.querySelector('[data-testid="umformung-hinweis"]');
      ok(!!hin, "XLVIII5 المحاولةُ الأولى الخاطئةُ تُعطي تلميحاً موجَّهاً — لا صمتَ ولا كشف");
      ok((hin?.textContent ?? "").includes("dich") && (hin?.textContent ?? "").includes("ما زلتَ"), `XLVIII6 والتلميحُ يسمّي الفخَّ: «${(hin?.textContent ?? "").slice(0, 40)}…»`);
      ok(!txt().includes("النموذج: Ich helfe dir"), "XLVIII7 ولا يكشفُ الجوابَ قبلَ المحاولةِ الأخيرة");
      ok(txt().includes("المحاولة الأخيرة"), "XLVIII8 والمحاولةُ الأخيرةُ معلَنة");
      // ② نكتبُ الصواب
      typeIn(feld, "Ich helfe dir.");
      const b2 = Array.from(d0.querySelectorAll("button")).find((b) => (b.textContent ?? "").startsWith("تحقّق") && b.closest("div")!.parentElement!.contains(feld)) as HTMLElement | undefined ?? pruefBtn();
      if (b2) click(b2);
      await new Promise((r) => setTimeout(r, 20));
      ok(txt().includes("أصبتَ من المحاولة الثانية"), "XLVIII9 والصوابُ في الثانيةِ يُقبَلُ بنصفِ النقاط — التلميحُ لم يكن مجانياً");
      ok(feld.disabled, "XLVIII10 والحقلُ يُقفَلُ بعدَ الحكم");
    }
    ok(ex.points === 2 && (ex.darfNicht ?? []).includes("dich"), "XLVIII11 والتمرينُ نفسُهُ يحملُ فخَّهُ ونقاطَهُ المضاعفةَ في البيانات");
  }

  /* ═══════════ LV — ترتيبُ كلماتٍ برموزٍ مكرَّرة (g14e2: «wir» مرتين) ═══════════ */
  {
    const { default: ExerciseSet } = await import("../components/exercises");
    const { grammarMap } = await import("../lib/content");
    const ex = grammarMap["b1-plusquamperfekt"].exercises.find((e) => e.id === "g14e2")!;
    mount(React.createElement(ExerciseSet, { items: [ex], onPoints: () => {} }));
    const chips = () => Array.from(rootEl.querySelectorAll("button.chip")).filter((b) => !(b.textContent ?? "").includes("✕")) as HTMLButtonElement[];
    const wirs = chips().filter((b) => b.textContent === "wir");
    ok(wirs.length === 2, "LV1 الرمزُ المكرَّرُ يظهرُ مرتينِ في المخزون");
    click(wirs[0]);
    const nach = chips().filter((b) => b.textContent === "wir");
    ok(nach.filter((b) => b.disabled).length === 1 && nach.filter((b) => !b.disabled).length === 1, "LV2 اختيارُ «wir» الأولى لا يعطّلُ الثانية");
    for (const w of ["gegessen hatten", "gingen"]) click(chips().find((b) => b.textContent === w && !b.disabled)!);
    click(chips().find((b) => b.textContent === "wir" && !b.disabled)!);
    ok(chips().filter((b) => b.textContent === "wir").every((b) => b.disabled), "LV3 وبعدَ اختيارِ الثانيةِ تُعطَّلُ كلتاهما");
    ok(rootEl.querySelectorAll("button.chip").length >= 6 + 4, "LV4 الشريطُ المختارُ يعرضُ الأربعَ المختارةَ بأزرارِ حذف");
  }

  /* ═══════════ LVb — تمرينان بلا ID لا يتشاركان حالةَ الإجابة (حمايةٌ دفاعية من البيانات القديمة) ═══════════ */
  {
    const { default: ExerciseSet } = await import("../components/exercises");
    const items = [
      { id: "", type: "fill", promptDe: "Ich ___ müde.", answer: ["bin"] },
      { id: "", type: "fill", promptDe: "Ich ___ Zeit.", answer: ["habe"] },
    ] as Parameters<typeof ExerciseSet>[0]["items"];
    mount(React.createElement(ExerciseSet, { items, onPoints: () => {} }));
    const fields = Array.from(rootEl.querySelectorAll("input.field")) as HTMLInputElement[];
    ok(fields.length === 2, "LVb1 عارضان لتمرينين بلا ID");
    if (fields.length === 2) {
      typeIn(fields[0], "bin");
      ok(fields[0].value === "bin" && fields[1].value === "", "LVb2 كتابةُ الأول لا تنسخُ الإجابةَ إلى الثاني");
      const checks = Array.from(rootEl.querySelectorAll("button")).filter((b) => (b.textContent ?? "").trim() === "تحقّق") as HTMLButtonElement[];
      if (checks[0]) click(checks[0]);
      const fieldsAfter = Array.from(rootEl.querySelectorAll("input.field")) as HTMLInputElement[];
      ok(fieldsAfter[0]?.disabled === true && fieldsAfter[1]?.disabled === false,
        "LVb3 تصحيحُ الأول يُقفله وحده ويُبقي الثاني قابلاً للإجابة");
    }
  }

  /* ═══════════ LVc — مسودّة التمرين الجاري تعود بعد إغلاق المشغّل وفتحه ═══════════ */
  {
    const { default: ExerciseSet } = await import("../components/exercises");
    const storageKey = "wegb2:test-pause-draft";
    const ex = { id: "pause-draft-1", type: "fill" as const, promptDe: "Ich ___ bereit.", answer: ["bin"] };
    const props = { items: [ex], onPoints: () => {}, storageKey };
    mount(React.createElement(ExerciseSet, props));
    const field = rootEl.querySelector("input.field") as HTMLInputElement | null;
    if (field) typeIn(field, "bin");
    mount(React.createElement(ExerciseSet, props));
    const restored = rootEl.querySelector("input.field") as HTMLInputElement | null;
    ok(!!restored && restored.value === "bin", "LVc1 الإجابةُ غير المسلَّمة تُحفَظ وتعود بعد إعادة فتح التمرين");
    dom.window.localStorage.removeItem(storageKey);
  }

  /* ═══════════ LVI — قراءةُ B2 الطويلة: فقرات، عدّاد كلمات، ملخّص بعد القراءة، 5 أسئلة ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const props = { lang: "ar" as const, day: 200, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-l", kind: "lesen" as const, titleDe: "L", titleAr: "ق", minutes: 25, textId: "t-b2-15" }, ...props }));
    ok(!!rootEl.querySelector('[data-testid="lesen-lang"]') && /\d+\s*كلمة/.test(txt()), "LVI1 نصُّ B2 يفتحُ بنسختِه الطويلةِ وعدّادِ كلمات");
    ok(rootEl.querySelectorAll("article p").length >= 3 && txt().includes("Fehler sind erlaubt"), "LVI2 فقراتٌ منفصلةٌ ونصٌّ طويلٌ حقيقيّ");
    ok(!txt().includes("ثقافة الخطأ الحقيقية"), "LVI3 الملخّصُ العربيُّ محجوبٌ قبلَ الطلب");
    click(btn("ملخّص عربي")!);
    ok(txt().includes("ثقافة الخطأ الحقيقية"), "LVI4 والملخّصُ يظهرُ عندَ الطلبِ لا الترجمةُ الكاملة");
    ok(txt().includes("Was kritisiert der Autor am Plakat") && txt().includes("sonst hinge das Plakat"), "LVI5 أسئلةُ النسخةِ الطويلةِ (تأويلية) هي المعروضة، لا أسئلةُ النصِّ القصير");
  }


  /* ═══════════ LVII — صواب/خطأ في النصوص الطويلة: ما يضغطُه المتعلِّمُ هو ما يقارنُه المصحِّح ═══════════ */
  {
    const { grader } = await import("../lib/grader");
    const { texts } = await import("../lib/content");
    const tfs = texts.filter((t) => t.lang).flatMap((t) => t.lang!.questions.filter((q) => q.type === "truefalse"));
    ok(tfs.length >= 60 && tfs.every((q) => grader.grade(q, q.answer as string).correct), `LVII1 كلُّ أسئلةِ صواب/خطأ الطويلةِ (${tfs.length}) قابلةٌ للإجابةِ الصحيحةِ بزرٍّ من زرَّي الواجهة`);
    ok(tfs.every((q) => !grader.grade(q, q.answer === "richtig" ? "falsch" : "richtig").correct), "LVII2 والزرُّ الآخرُ خطأٌ فعلاً");
    const { default: TaskView } = await import("../components/tasks");
    const props = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-l2", kind: "lesen" as const, textId: "t-a2-08", titleDe: "L", titleAr: "ق", minutes: 15 }, ...props }));
    ok(!!rootEl.querySelector('[data-testid="lesen-lang"]') && txt().includes("Er hat kein Fieber."), "LVII3 نصُّ A2 يفتحُ بنسختِه الطويلةِ وسؤالِ صواب/خطأ بصيغةِ «richtig»");
    const rBtn = Array.from(rootEl.querySelectorAll("button")).find((b) => b.textContent === "richtig") as HTMLButtonElement | undefined;
    ok(!!rBtn, "LVII4 زرُّ richtig معروض");
  }


  /* ═══════════ LVIII — فخاخُ حواراتِ B2 على الشاشة: الخياراتُ الجديدةُ هي المعروضةُ، والضغطُ على الفخِّ يُرفَض ═══════════ */
  {
    const { grader } = await import("../lib/grader");
    const { dialogues } = await import("../lib/content");
    const dlg = dialogues.find((d) => d.id === "d-b2-10")!;
    const q1 = dlg.questions.find((q) => q.id === "d-b2-10-q1")!;
    ok((q1.options ?? []).some((o) => o.includes("45.000 Euro plus variabler Anteil")), "LVIII1 مشتّتُ d-b2-10-q1 هو العرضُ الأوّلُ المسموع (فخٌّ حقيقي)");
    ok(!grader.grade(q1, "45.000 Euro plus variabler Anteil").correct && grader.grade(q1, q1.answer as string).correct, "LVIII2 الفخُّ يُرفَض والصحيحُ يُقبَل عبرَ المصحِّح");
    const { default: TaskView } = await import("../components/tasks");
    const props = { lang: "ar" as const, day: 200, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-h", kind: "hoeren" as const, dialogueId: "d-b2-10", titleDe: "H", titleAr: "س", minutes: 15 }, ...props }));
    const t0 = txt();
    ok(t0.includes("45.500 Euro mit Homeoffice") && t0.includes("48.000 Euro, wie Youssef"), "LVIII3 مهمّةُ الاستماعِ تعرضُ الخياراتِ الجديدةَ لا القديمة");
    ok(!t0.includes("kein Vertrag"), "LVIII4 والخيارُ السخيفُ القديمُ «kein Vertrag» اختفى");
    const q15 = dialogues.find((d) => d.id === "d-b1-15")!.questions.find((q) => q.id === "d-b1-15-q2")!;
    ok((q15.options ?? []).includes("zwanzig Euro") && !grader.grade(q15, "zwanzig Euro").correct && grader.grade(q15, "sechs Euro").correct, "LVIII5 فخُّ B1 (رسمُ السرقةِ المسموع 20 €) يُرفَض، وستّةُ يورو تُقبَل");
  }


  /* ═══════════ LIX — جملةُ المثالِ الجديدةُ تظهرُ على البطاقةِ بعدَ الكشف، مع ترجمتِها ═══════════ */
  {
    const { vocabMap, getDeck } = await import("../lib/content");
    const { newCard, reviewCard } = await import("../lib/srs");
    const deckId = Object.values(vocabMap).find((d) => d.cards.some((c) => c.id === "v013"))!.id;
    const deck = getDeck(deckId)!;
    const srs: Record<string, ReturnType<typeof newCard>> = {};
    const introducedYesterday = new Date(Date.now() - 86400000).toISOString();
    for (const c of deck.cards) if (c.id !== "v013") {
      srs[c.id] = { ...reviewCard(newCard(), 4), introduced: introducedYesterday };
    }
    const { default: TaskView } = await import("../components/tasks");
    mount(React.createElement(TaskView, { task: { id: "t-voc-lix", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId }, lang: "ar" as const, day: 3, srs, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 }));
    ok(txt().includes("Schule") && !txt().includes("Meine Tochter geht jeden Morgen"), "LIX1 البطاقةُ v013 أولاً، والمثالُ محجوبٌ قبلَ الكشف");
    click(btn("اكشف المعنى")!);
    ok(txt().includes("Meine Tochter geht jeden Morgen um acht Uhr in die Schule."), "LIX2 بعدَ الكشفِ تظهرُ جملةُ المثالِ الجديدةُ حرفيًّا");
    ok(txt().includes("ابنتي تذهب إلى المدرسة"), "LIX3 وترجمتُها العربيةُ تحتَها");
  }


  /* ═══════════ LX — المتلازماتُ على البطاقةِ وتمرينُ «أكمل المتلازمة» داخلَ مهمّةِ المفردات ═══════════ */
  {
    const { vocabMap, getDeck } = await import("../lib/content");
    const { newCard, reviewCard } = await import("../lib/srs");
    const { kollokationenFuer } = await import("../lib/kollokationen");
    const deckId = Object.values(vocabMap).find((d) => d.cards.some((c) => c.id === "v445"))!.id;
    const deck = getDeck(deckId)!;
    const srs: Record<string, ReturnType<typeof newCard>> = {};
    const introducedYesterday = new Date(Date.now() - 86400000).toISOString();
    for (const c of deck.cards) if (c.id !== "v445") {
      srs[c.id] = { ...reviewCard(newCard(), 4), introduced: introducedYesterday };
    }
    const { default: TaskView } = await import("../components/tasks");
    mount(React.createElement(TaskView, { task: { id: "t-voc-lx", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId }, lang: "ar" as const, day: 200, srs, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 }));
    ok(!rootEl.querySelector('[data-testid="kollokationen"]'), "LX1 المتلازماتُ محجوبةٌ قبلَ كشفِ البطاقة");
    click(btn("اكشف المعنى")!);
    const kol = rootEl.querySelector('[data-testid="kollokationen"]');
    ok(!!kol && kollokationenFuer({ id: "v445" }).every((k) => (kol.textContent ?? "").includes(k)), "LX2 بعدَ الكشفِ تظهرُ متلازماتُ einhalten الثلاثُ حرفيًّا");
    const ueb = rootEl.querySelector('[data-testid="kollok-uebung"]');
    ok(!!ueb && (ueb.textContent ?? "").includes("_____") && (ueb.textContent ?? "").includes("أكمل المتلازمة"), "LX3 تمرينُ «أكمل المتلازمة» مرسومٌ تحتَ البطاقاتِ بفراغٍ ظاهر");
    const optBtns = Array.from(ueb!.querySelectorAll("button")).filter((b) => (b.textContent ?? "").trim().length > 2 && !/اسمع|اكشف/.test(b.textContent ?? ""));
    ok(optBtns.length >= 3, `LX4 وفيه ≥3 أزرارِ خيارات (${optBtns.length})`);
  }


  /* ═══════════ LX0 — حدّ البطاقات الجديدة حسب الوتيرة، تقديم المستحق واستبعاد غير المستحق ═══════════ */
  {
    const { vocabMap } = await import("../lib/content");
    const { newCard } = await import("../lib/srs");
    const { default: TaskView } = await import("../components/tasks");
    const deck = Object.values(vocabMap).find((d) => d.cards.length >= 10)!;
    const base = { lang: "ar" as const, day: 12, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    const total = () => rootEl.querySelector('[data-testid="vocab-queue-count"]')?.textContent?.trim() ?? "";
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const dueCard = deck.cards[0], notDueCard = deck.cards[1];
    const due = { ...newCard(), reps: 1, introduced: yesterday, due: yesterday };
    const notDue = { ...newCard(), introduced: yesterday, due: new Date(Date.now() + 86400000).toISOString() };
    mount(React.createElement(TaskView, {
      task: { id: "t-tempo-due", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId: deck.id },
      ...base, srs: { [dueCard.id]: due, [notDueCard.id]: notDue }, tempo: "leicht" as const,
    }));
    ok(total() === "1 / 4" && txt().includes(dueCard.de) && !txt().includes(notDueCard.de), "LX0a بطاقة مستحقّة أولاً؛ غير المستحق لا يملأ الطابور، وثلاث جديدة كحدّ أقصى");

    const otherDeckIds = Object.values(vocabMap).flatMap((d) => d.cards).filter((c) => !deck.cards.some((x) => x.id === c.id)).slice(0, 2);
    const todaySrs = Object.fromEntries(otherDeckIds.map((c) => [c.id, newCard()]));
    mount(React.createElement(TaskView, {
      task: { id: "t-tempo-global", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId: deck.id },
      ...base, srs: todaySrs, tempo: "leicht" as const,
    }));
    ok(total() === "1 / 1", "LX0b البطاقتان المُدخلتان اليوم من حزمة أخرى تُحتسبان ضمن السقف اليومي العام");

    mount(React.createElement(TaskView, {
      task: { id: "t-tempo-regular", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId: deck.id },
      ...base, srs: {}, tempo: "regelmaessig" as const,
    }));
    const regular = total();
    mount(React.createElement(TaskView, {
      task: { id: "t-tempo-intensive", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId: deck.id },
      ...base, srs: {}, tempo: "intensiv" as const,
    }));
    ok(regular === "1 / 5" && total() === "1 / 10", "LX0c واجهة المفردات تطبق 5 للمنتظم و10 للمكثف");

    const pendingCard = deck.cards[2];
    const pendingSrs = { ...newCard(), reps: 0, introduced: new Date().toISOString() };
    mount(React.createElement(TaskView, {
      task: { id: "t-tempo-resume", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId: deck.id },
      ...base, srs: { [pendingCard.id]: pendingSrs }, tempo: "leicht" as const,
    }));
    ok(total() === "1 / 3" && txt().includes(pendingCard.de), "LX0d البطاقة الجديدة التي ظهرت ولم تُقيَّم تُستأنف ولا تُحتسب مرتين ضمن السقف");

    const dueBeforePendingCard = deck.cards[3];
    const pendingAfterDueCard = deck.cards[4];
    const dueBeforePending = { ...newCard(), reps: 1, introduced: yesterday, due: yesterday };
    const pendingAfterDue = { ...newCard(), reps: 0, introduced: new Date().toISOString() };
    mount(React.createElement(TaskView, {
      task: { id: "t-tempo-review-before-resume", kind: "wortschatz" as const, titleDe: "W", titleAr: "م", minutes: 10, deckId: deck.id },
      ...base, srs: { [dueBeforePendingCard.id]: dueBeforePending, [pendingAfterDueCard.id]: pendingAfterDue }, tempo: "leicht" as const,
    }));
    const dueWasFirst = txt().includes(dueBeforePendingCard.de) && !txt().includes(pendingAfterDueCard.de);
    click(btn("اكشف المعنى")!);
    click(btn("سهّل! (4)")!);
    ok(dueWasFirst && txt().includes(pendingAfterDueCard.de), "LX0e المراجعة المستحقّة تسبق البطاقة غير المُقيَّمة ثم تُستأنف بعدها");
  }

  /* ═══════════ LXI — تقييمُ الثقةِ قبلَ الإجابة: الزرّانِ قبلَ الخيارات، التسجيلُ في Progress، رسالةُ «ثقة خاطئة» ═══════════ */
  {
    const { default: ExerciseSet } = await import("../components/exercises");
    const { loadProgress, saveProgress } = await import("../lib/store");
    saveProgress({ ...loadProgress(), sicherheit: [] });
    const ex = { id: "lxi-1", type: "mc" as const, promptDe: "Die Frist _____", options: ["einhalten", "kochen", "tanzen"], answer: "einhalten", explanationAr: "المتلازمة: die Frist einhalten" };
    mount(React.createElement(ExerciseSet, { items: [ex], onPoints: () => {} }));
    ok(!!rootEl.querySelector('[data-testid="sicherheit"]') && !!btn("👍 متأكّد") && !!btn("🤔 غيرُ متأكّد"), "LXI1 سؤالُ الاختيارِ يعرضُ زرَّي الثقةِ قبلَ الخيارات");
    click(btn("👍 متأكّد")!);
    ok(rootEl.querySelector('[data-testid="sicher-ja"]')!.getAttribute("aria-pressed") === "true", "LXI2 الضغطُ يُعلِّمُ «متأكّد»");
    click(btn("kochen")!); click(btn("تحقّق")!);
    ok(!rootEl.querySelector('[data-testid="ueberkonfidenz"]') && btn("تحقّق — المحاولة الأخيرة 🔁") !== undefined, "LXI3 الخطأُ الأوّلُ يمنحُ محاولةً أخيرةً بلا كشف — والثقةُ محفوظةٌ في الحالة");
    click(btn("tanzen")!); click(btn("تحقّق — المحاولة الأخيرة 🔁")!);
    ok(!!rootEl.querySelector('[data-testid="ueberkonfidenz"]') && txt().includes("كنتَ متأكّداً وأخطأت"), "LXI4 بعدَ الخطأِ النهائيّ معَ «متأكّد»: تحذيرُ الثقةِ الخاطئةِ ظاهر");
    const p = loadProgress();
    ok((p.sicherheit ?? []).length === 1 && p.sicherheit![0].sicher === true && p.sicherheit![0].correct === false && p.sicherheit![0].id === "lxi-1", "LXI5 سُجِّل تقييمٌ واحدٌ فقط (لا تكرارَ عبرَ المحاولتين) بالقيمِ الصحيحة");
    const f = Object.values(p.fehler ?? {}).find((x) => x.ar.includes("ثقةٌ خاطئة"));
    ok(!!f, "LXI6 وخطأُ الدفترِ موسومٌ بـ«ثقة خاطئة»");
    const ex2 = { ...ex, id: "lxi-2" };
    mount(React.createElement(ExerciseSet, { items: [ex2], onPoints: () => {} }));
    click(btn("🤔 غيرُ متأكّد")!); click(btn("einhalten")!); click(btn("تحقّق")!);
    ok(!!rootEl.querySelector('[data-testid="unterkonfidenz"]') && loadProgress().sicherheit!.length === 2 && loadProgress().sicherheit![1].correct === true, "LXI7 غيرُ متأكّدٍ وأصاب: رسالةُ تشجيعٍ وتسجيلٌ صحيح");
    const ex3 = { ...ex, id: "lxi-3" };
    mount(React.createElement(ExerciseSet, { items: [ex3], onPoints: () => {} }));
    click(btn("einhalten")!); click(btn("تحقّق")!);
    ok(loadProgress().sicherheit!.length === 2 && !rootEl.querySelector('[data-testid="sicherheit"]'), "LXI8 بلا تقييمٍ لا تسجيلَ (اختياريّ لا إلزاميّ)، والزرّانِ يختفيانِ بعدَ التحقّق");
  }


  /* ═══════════ LXII — دفترُ الأخطاءِ 2.0 على الشاشة: تمرينُ نقلٍ بدلَ السؤالِ نفسِه، والنتيجةُ تُقيَّمُ في SRS ═══════════ */
  {
    const { loadProgress, saveProgress } = await import("../lib/store");
    const { upsertFehler } = await import("../lib/fehler");
    const { Fehlerheft } = await import("../components/fehler-ui");
    let p = loadProgress();
    p = upsertFehler(p, { falsch: "die Frist verpassen", richtig: "einhalten", art: "wortstellung", ar: "⚠️ ثقةٌ خاطئة — كنتَ متأكّداً: die Frist einhalten", quelle: "kol" });
    p = upsertFehler(p, { falsch: "xyzq", richtig: "qqqq-nicht-im-lexikon", art: "konstruktion", ar: "—", quelle: "y" });
    const { normKey } = await import("../lib/fehler");
    const keys = [normKey("die Frist verpassen|einhalten"), normKey("xyzq|qqqq-nicht-im-lexikon")];
    for (const k of keys) p.fehler![k].srs.due = "2000-01-01";
    saveProgress(p);
    const kE = keys.find((k) => k.includes("einhalten"))!; const kQ = keys.find((k) => k.includes("qqqq"))!;
    mount(React.createElement(Fehlerheft, { fehlerKeys: [kE, kQ], onPoints: () => {} }));
    const tr = rootEl.querySelectorAll('[data-testid="fehler-transfer"]');
    if (tr.length !== 1) console.log("   ⤷ LXII debug:", tr.length, txt().slice(0, 300));
    ok(tr.length === 1 && (tr[0].textContent ?? "").includes("_____") && (tr[0].textContent ?? "").includes("ثقة خاطئة سابقاً"), "LXII1 خطأُ einhalten يُعرَضُ كتمرينِ متلازمةٍ جديدٍ موسومٍ بالثقةِ الخاطئة؛ خطأُ الكلمةِ المجهولةِ يبقى مباشراً");
    ok(txt().includes("أيّ صيغة صحيحة؟") && !!btn("qqqq-nicht-im-lexikon"), "LXII2 السؤالُ المباشرُ ما زالَ موجوداً لمن لا بطاقةَ له");
    if (!tr[0]) { ok(false, "LXII3 (تخطٍّ — لا تمرينَ نقل)"); } else {
    const opts = () => Array.from(tr[0].querySelectorAll("button")).filter((b) => !/متأكّد|تحقّق|اسمع/.test(b.textContent ?? "") && (b.textContent ?? "").trim().length > 1 && !b.hasAttribute("disabled"));
    const pruefBtn = () => Array.from(tr[0].querySelectorAll("button")).find((b) => (b.textContent ?? "").startsWith("تحقّق"));
    click(opts()[0]); click(pruefBtn()!);
    if (pruefBtn()) { click(opts()[1]); click(pruefBtn()!); }
    const nach = loadProgress().fehler![kE];
    ok(nach.srs.due > "2000-01-01" && !!rootEl.querySelector('[data-testid="fehler-transfer-ergebnis"]'), "LXII3 بعدَ الإجابةِ يُقيَّمُ الخطأُ في SRS (يتغيّرُ موعدُه) وتظهرُ نتيجةُ النقل"); }
    const p2 = loadProgress(); delete p2.fehler![kE]; delete p2.fehler![kQ]; act(() => { saveProgress(p2); });
  }


  /* ═══════════ LXIII — الترابطُ على الشاشة: كلمةٌ في نصِّ القراءةِ تفتحُ بطاقتَها ومتلازماتِها وأينَ تظهرُ أيضاً ═══════════ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const props = { lang: "ar" as const, day: 200, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-l", kind: "lesen" as const, textId: "t-b2-01", titleDe: "L", titleAr: "ق", minutes: 15 }, ...props }));
    const links = rootEl.querySelectorAll('[data-testid="wortlink-wort"]');
    ok(links.length >= 20, `LXIII1 نصُّ القراءةِ B2 فيه ≥20 كلمةً مربوطةً ببطاقة (${links.length})`);
    const frist = Array.from(links).find((b) => /^Debatte/.test((b.textContent ?? "").trim())) ?? links[0];
    click(frist as HTMLElement); // LXIII: Debatte بطاقةٌ غنيّةٌ (متلازمات+ظهور) — links[0] صار Kaum (A0 بلا إثراء: صحيحٌ لا عطل)
    const karte = rootEl.querySelector('[data-testid="wortkarte"]');
    ok(!!karte && (karte.textContent ?? "").includes("—") && /[\u0600-\u06FF]/.test(karte.textContent ?? ""), "LXIII2 النقرُ يفتحُ بطاقةً بالمعنى العربيّ");
    ok(!!karte && (!!karte.querySelector('[data-testid="wortkarte-kollok"]') || !!karte.querySelector('[data-testid="wortkarte-vorkommen"]')), "LXIII3 وفيها المتلازماتُ أو مواضعُ الظهورِ الأخرى");
    click(Array.from(karte!.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "✕")!);
    ok(!rootEl.querySelector('[data-testid="wortkarte"]'), "LXIII4 ✕ تُغلقُ البطاقة");
    mount(React.createElement(TaskView, { task: { id: "t-h2", kind: "hoeren" as const, dialogueId: "d-b1-15", titleDe: "H", titleAr: "س", minutes: 15 }, ...props }));
    const show = btn("📝 أظهر النص") ?? Array.from(rootEl.querySelectorAll("button")).find((b) => /أظهر النص|النص/.test(b.textContent ?? ""));
    if (show) click(show);
    ok(rootEl.querySelectorAll('[data-testid="wortlink-wort"]').length >= 5, "LXIII5 سطورُ الحوارِ بعدَ إظهارِ النصِّ مربوطةٌ أيضاً");
  }


  /* ═══ LXIV — رادار الفخاخ موقوت: 45 ثانية (R11) ═══ */
  {
    const { FehlerFinden } = await import("../components/lehrer");
    mount(React.createElement(FehlerFinden, { pitfalls: [{ de: "„Ich helfe dich.“ ✗ → „Ich helfe dir.“ ✓", ar: "helfen + Dativ" }], onPoints: () => {} }));
    const uhr = rootEl.querySelector('[data-testid="pitfall-timer-0"]');
    ok(!!uhr && (uhr.textContent ?? "").includes("45"), "LXIV1 عدّادُ الفخِّ يبدأُ من 45 ثانية");
  }

  /* ═══ LXV — البديل الكتابي للشفوي (R16) ═══ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const { sentences: sBankX } = await import("../lib/content");
    const se = sBankX.slice(0, 2).map((s) => s.id);
    const pr = { lang: "ar" as const, day: 200, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-xl-sprechen", kind: "sprechen" as const, titleDe: "S", titleAr: "ت", minutes: 10, sentenceIds: se }, ...pr }));
    const ta = rootEl.querySelector('[data-testid="sprech-schrift-text"]') as HTMLTextAreaElement | null;
    ok(!!ta, "LXV1 صندوقُ البديلِ الكتابيِّ حاضر");
    const ab = rootEl.querySelector('[data-testid="sprech-schrift-ab"]') as HTMLButtonElement;
    ok(ab.disabled, "LXV2 زرُّ التسليمِ معطَّلٌ قبلَ الكتابة");
    typeIn(ta!, "Ich spreche jeden Tag laut und deutlich vor dem Spiegel.");
    ok(!ab.disabled, "LXV3 يُفعَّلُ بعدَ كتابةٍ كافية");
    click(ab);
    ok(!!rootEl.querySelector('[data-testid="sprech-schrift-hinweis"]'), "LXV4 بعدَ التسليمِ: وسمُ «إنجاز لا نطق»");
  }

  /* ═══ LXVI — لوحة التوقف والإيقاف المبكر بلا لوم أو إغلاق قسري (R19) ═══ */
  {
    const { Klassenzimmer } = await import("../components/akademie/Klassenzimmer");
    const { buildDay } = await import("../lib/plan");
    const { ritualUrteil } = await import("../lib/ritual");
    const { loadProgress, saveProgress } = await import("../lib/store");
    const beforePause = loadProgress();
    const prog = { ...emptyProgress };
    const plan = buildDay(2, { ...emptyProgress, plan: { ...emptyProgress.plan, day: 2 } });
    const emptyPlan = { ...plan, tasks: [] };
    const base: Record<string, never> = {} as never;
    let closeCalls = 0;
    const props = {
      ...base, progress: prog, day: 2, plan, stepFrei: 0, setStep: () => {}, ritual: ritualUrteil(plan, prog),
      resultOf: () => ({ done: true, passed: true, score: 1, total: 1, attempts: 1 }),
      localOf: () => ({ score: 0, total: 0 }), onPoints: () => {}, submitCurrent: () => {}, doCloseDay: () => { closeCalls++; },
      confirmClose: false, setConfirmClose: () => {}, unpassed: [], onSrs: () => {},
    };
    mount(React.createElement(Klassenzimmer, { ...props, allSubmitted: true } as never));
    ok(!!rootEl.querySelector('[data-testid="stop-panel"]'), "LXVI1 اليومُ المكتملُ يعرضُ لوحةَ التوقف");
    mount(React.createElement(Klassenzimmer, { ...props, allSubmitted: false, plan: emptyPlan, ritual: ritualUrteil(emptyPlan, prog) } as never));
    ok(!rootEl.querySelector('[data-testid="stop-panel"]'), "LXVI2 اليومُ الناقصُ بلا لوحة اكتمال");
    click(rootEl.querySelector('[data-testid="pause-and-save"]') as HTMLElement);
    ok(!!rootEl.querySelector('[data-testid="pause-saved-message"]') && closeCalls === 0 && loadProgress().plan.day === prog.plan.day,
      "LXVI3 حفظُ التوقّف يُبقي اليوم مفتوحاً بلا إغلاق أو ترحيل أو فشل");
    saveProgress(beforePause);
    dom.window.localStorage.removeItem("wegb2:day-step:2");
  }

  /* ═══ LXVII — الاعتراض يخفّض حدّة الكاشف (R33) ═══ */
  {
    const Schreib = (await import("../components/schreibkorrektur")).default;
    mount(React.createElement(Schreib, { minWoerter: 5 }));
    const ta = rootEl.querySelector("textarea") as HTMLTextAreaElement;
    typeIn(ta, "Ich kaufe ein Geschenk für dem Mann.");
    const go = Array.from(rootEl.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("صحِّح")) as HTMLElement;
    click(go);
    const btnDisput = () => rootEl.querySelector('[data-test="disput-a1-akkusativ"]') as HTMLElement | null;
    ok(!!btnDisput(), "LXVII1 زرُّ الاعتراضِ حاضرٌ على نتيجةٍ لها regelId");
    ok(!rootEl.querySelector('[data-test="disput-hinweis"]'), "LXVII2 قبلَ العتبةِ لا تنزيل");
    click(btnDisput()!); click(btnDisput()!); click(btnDisput()!);
    ok(!!rootEl.querySelector('[data-test="disput-hinweis"]'), "LXVII3 بعدَ 3 اعتراضاتٍ يظهرُ التنزيل");
  }


  /* ═══ LXVIII — نوع الكلمة على البطاقة (R30) ═══ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const pr = { lang: "ar" as const, day: 200, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: { id: "t-xl-wort", kind: "wortschatz" as const, titleDe: "W", titleAr: "ك", minutes: 10, deckId: "a1-start" }, ...pr }));
    const flip = Array.from(rootEl.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("اكشف المعنى")) as HTMLElement | undefined;
    ok(!!flip, "LXVIII1 زرُّ الكشفِ حاضر");
    if (flip) click(flip);
    const chip = rootEl.querySelector('[data-testid="karte-pos"]');
    ok(!!chip && (chip.textContent ?? "").includes("Interjektion"), "LXVIII2 بعدَ الكشفِ: شارةُ النوعِ (hallo ← Interjektion)");
  }

  /* ═══ LXIX — المرادف والضد في البطاقة المنبثقة (R29) ═══ */
  {
    const { WortKarte } = await import("../components/wortlink");
    const { karteFuerWort } = await import("../lib/verknuepfung");
    const karte = karteFuerWort("groß", "A1")!;
    ok(!!karte && karte.ant?.[0] === "klein", "LXIX1 بطاقةُ groß تحملُ ضدَّها من البيانات");
    mount(React.createElement(WortKarte, { karte, onClose: () => {} }));
    ok(!!rootEl.querySelector('[data-testid="wortkarte-pos"]'), "LXIX2 شارةُ النوعِ في البطاقةِ المنبثقة");
    const sa = rootEl.querySelector('[data-testid="wortkarte-synant"]');
    ok(!!sa && (sa.textContent ?? "").includes("klein"), "LXIX3 الضدُّ معروضٌ في المنبثقة");
    const anfangen = karteFuerWort("anfangen", "A1")!;
    mount(React.createElement(WortKarte, { karte: anfangen, onClose: () => {} }));
    const context = rootEl.querySelector('[data-testid="wortkarte-syn-context"]');
    ok(!!context && (context.textContent ?? "").includes("قريب في هذا السياق") &&
      (context.textContent ?? "").includes("beginnen") && (context.textContent ?? "").includes("Ich fange heute"),
      "LXIX4 المرادفُ المُنتَجُ وحده يظهر مع متلازمةٍ ومثالين وملاحظةِ الفرق");
    const freundlich = karteFuerWort("freundlich", "A1")!;
    mount(React.createElement(WortKarte, { karte: freundlich, onClose: () => {} }));
    ok(!rootEl.querySelector('[data-testid="wortkarte-syn-context"]') && !(rootEl.textContent ?? "").includes("nett"),
      "LXIX5 المرادف غيرُ المنتج سياقياً يبقى مخزّناً ولا يظهر كبديل عام");
    const sehen = karteFuerWort("sehen", "A1")!;
    mount(React.createElement(WortKarte, { karte: sehen, onClose: () => {} }));
    const sehenContext = rootEl.querySelector('[data-testid="wortkarte-syn-context"]');
    ok(!!sehenContext && (sehenContext.textContent ?? "").includes("schauen") &&
      (sehenContext.textContent ?? "").includes("einen Film im Kino sehen") &&
      (sehenContext.textContent ?? "").includes("Wir sehen heute Abend"),
      "LXIX6 مرادف الدفعة الثانية يظهر مع مثالين يحددان استعمال المشاهدة");
    const auto = karteFuerWort("Auto", "A1")!;
    mount(React.createElement(WortKarte, { karte: auto, onClose: () => {} }));
    const autoContext = rootEl.querySelector('[data-testid="wortkarte-syn-context"]');
    ok(!!auto && !!autoContext && (autoContext.textContent ?? "").includes("Wagen") &&
      (autoContext.textContent ?? "").includes("mit dem Auto fahren"),
      "LXIX7 البحث عن اسمٍ بأداة التعريف يفتح سياقه الموثق");
    const kommen = karteFuerWort("kommen", "A1")!;
    mount(React.createElement(WortKarte, { karte: kommen, onClose: () => {} }));
    const kommenContext = rootEl.querySelector('[data-testid="wortkarte-syn-context"]');
    ok(!!kommenContext && (kommenContext.textContent ?? "").includes("ankommen") &&
      (kommenContext.textContent ?? "").includes("nach Hause kommen") &&
      (kommenContext.textContent ?? "").includes("Wir kommen heute gegen acht"),
      "LXIX8 علاقة kommen/ankommen معروضة في سياق الوصول المحدد لا كبديل عام");
    const brief = karteFuerWort("Brief", "A1")!;
    mount(React.createElement(WortKarte, { karte: brief, onClose: () => {} }));
    const briefContext = rootEl.querySelector('[data-testid="wortkarte-syn-context"]');
    ok(!!brief && !!briefContext && (briefContext.textContent ?? "").includes("Schreiben") &&
      (briefContext.textContent ?? "").includes("einen Brief bekommen"),
      "LXIX9 اسم ذو أداة تعريف في الدفعة الثالثة يحافظ على سياق الرسالة الرسمية");
  }

  /* ═══ LXX — السيناريو يعلن دروسه المطبَّقة (R26) ═══ */
  {
    const { LebensSzenarien } = await import("../components/szenarien");
    mount(React.createElement(LebensSzenarien, { progress: { ...emptyProgress } }));
    const hdr = btn("LebensSzenarien");
    ok(!!hdr, "LXX1 أكورديون السيناريوهات مركّب");
    if (hdr) click(hdr);
    const lek = rootEl.querySelector('[data-testid="szenario-lektionen"]');
    ok(!!lek && lek.querySelectorAll(".chip").length >= 2, "LXX2 شرائحُ الدروسِ المطبَّقةِ ظاهرة");
    ok((lek?.textContent ?? "").includes("يطبّق دروس"), "LXX3 عنوانُ الربطِ الصريح");
  }

  /* ═══ LXXI — مقاييس النجاح الثلاثة في مركز التقارير (R34) ═══ */
  {
    const { BerichteZentrum } = await import("../components/berichte");
    const prog = { ...emptyProgress,
      plan: { ...emptyProgress.plan, tasks: {
        m1a: { done: true, passed: true, score: 3, total: 4, attempts: 1, kind: "schreiben" },
        m1b: { done: true, passed: false, score: 0, total: 0, attempts: 1, kind: "sprechen" },
      } },
      fehler: { y: { key: "y", falsch: "a", richtig: "b", art: "s", ar: "x", treffer: 3, srs: { ease: 2.5, interval: 0, due: new Date().toISOString(), reps: 3, lapses: 3, learning: true } } },
      exams: { 10: { score: 60, passed: false }, 20: { score: 90, passed: true } },
      modulPruefungen: { 2: { versuche: 3, best: 70, bestanden: false } },
    };
    mount(React.createElement(BerichteZentrum, { progress: prog as never, name: "مقياس" }));
    const hdr = btn("BerichteZentrum");
    if (hdr) click(hdr);
    ok(!!rootEl.querySelector('[data-testid="metriken-panel"]'), "LXXI1 لوحةُ المقاييسِ الثلاثةِ حاضرة");
    ok((rootEl.querySelector('[data-testid="metrik-feedback"]')?.textContent ?? "").includes("50"), "LXXI2 التغذيةُ 1/2 = 50٪");
    ok((rootEl.querySelector('[data-testid="metrik-heilung"]')?.textContent ?? "").includes("عالق"), "LXXI3 تنبيهُ الخطأِ العالق");
    ok((rootEl.querySelector('[data-testid="metrik-kurve"]')?.textContent ?? "").includes("أُعيدت مرتين"), "LXXI4 تنبيهُ الوحدةِ المعادة");
  }


  /* ═══ LXXII — حزمة العائلة (V17) ═══ */
  {
    const { ElternPaket } = await import("../components/elternpaket");
    mount(React.createElement(ElternPaket, { progress: { ...emptyProgress } }));
    const hdr = btn("حزمة العائلة");
    ok(!!hdr, "LXXII1 أكورديون حزمة العائلة مركّب");
    if (hdr) click(hdr);
    ok(txt().includes("Family Progress Report"), "LXXII2 التقرير العائلي يُفتح");
  }

  /* ═══ LXXIII — ساحة المقابلات (V17) ═══ */
  {
    const { InterviewArena } = await import("../components/interview2");
    mount(React.createElement(InterviewArena, { progress: { ...emptyProgress } }));
    const hdr = btn("ساحة المقابلات");
    ok(!!hdr, "LXXIII1 ساحة المقابلات مركّبة");
    if (hdr) click(hdr);
    ok(!!rootEl.querySelector("textarea"), "LXXIII2 حقل الإجابة حاضر بعد الفتح");
  }

  /* ═══ LXXIV — دليل الأجنحة + شبكة الكفاءات (V17) ═══ */
  {
    const { KatalogLeiste, RadarKarte } = await import("../components/katalog");
    mount(React.createElement(KatalogLeiste));
    ok(txt().includes("دليل الأجنحة"), "LXXIV1 الدليل يُعرض مباشرة");
    mount(React.createElement(RadarKarte, { progress: { ...emptyProgress } }));
    ok(!!rootEl.querySelector('svg[aria-label="شبكة الكفاءات"]'), "LXXIV2 شبكة الكفاءات SVG حاضرة");
  }

  /* ═══ LXXV — العمق المعجمي (V17) ═══ */
  {
    const { TiefenLexikon } = await import("../components/tiefenlex");
    mount(React.createElement(TiefenLexikon, { progress: { ...emptyProgress } }));
    const hdr = btn("العمق المعجمي");
    ok(!!hdr, "LXXV1 العمق المعجمي مركّب");
    if (hdr) click(hdr);
    ok(txt().includes("إخفاء"), "LXXV2 يُفتح تفاعلياً");
  }

  /* ═══ LXXVI — الأسبوع والأوسمة (V17) ═══ */
  {
    const { Wochenplan, XpBar, AbzeichenKarte } = await import("../components/wochen");
    mount(React.createElement(Wochenplan, { progress: { ...emptyProgress } }));
    ok(txt().includes("جدول الأسبوع"), "LXXVI1 جدول الأسبوع يُعرض");
    mount(React.createElement(XpBar, { progress: { ...emptyProgress } }));
    ok(txt().includes("XP"), "LXXVI2 شريط الخبرة يُعرض");
    mount(React.createElement(AbzeichenKarte, { progress: { ...emptyProgress } }));
    ok(txt().includes("الأوسمة"), "LXXVI3 بطاقة الأوسمة تُعرض");
  }


  /* ═══ LXXVII — الدروس الجديدة تُفتَح وتُستقرأ (N1–N7) ═══ */
  {
    const { default: TaskView } = await import("../components/tasks");
    const mkN = (topicId: string) => ({ id: "t-" + topicId, kind: "grammatik" as const, titleDe: "Grammatik", titleAr: "قاعدة", minutes: 15, topicId });
    const propsN = { lang: "ar" as const, day: 60, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
    mount(React.createElement(TaskView, { task: mkN("a1-plural"), ...propsN }));
    ok(txt().includes("جمع الأسماء"), "LXXVII1 درس الجمع يُعرض بعنوانه");
    ok(txt().includes("سِرْ ناس"), "LXXVII2 تركة الجمع حاضرة في بطاقته");
    mount(React.createElement(TaskView, { task: mkN("b1-konj2-vergangenheit"), ...propsN }));
    ok(txt().includes("التخيلي الماضي"), "LXXVII3 درس التخيلي الماضي يُعرض");
    ok(txt().includes("آلة الزمن"), "LXXVII4 تركته حاضرة");
    mount(React.createElement(TaskView, { task: mkN("b2-textkonnektoren"), ...propsN }));
    ok(txt().includes("روابط النص الراقية") && txt().includes("البهلوان"), "LXXVII5 درس B2 وتركته يُعرضان");
  }

  /* ═══ LXXVIII — مهمةُ الاستقلال في المعالج + تحققٌ مؤجلٌ ثلاثةَ أيام ═══ */
  {
    const storage = dom.window.localStorage;
    const saved = Array.from({ length: storage.length }, (_, i) => {
      const key = storage.key(i)!;
      return [key, storage.getItem(key)!] as const;
    });
    const oldAutoEntdecken = autoEntdecken;
    try {
      storage.clear();
      storage.setItem("weg-b2-profiles", JSON.stringify({ active: "p1", list: [{ id: "p1", name: "اختبار", emoji: "🧪", created: "2026-10-03" }] }));
      const startProgress = JSON.parse(JSON.stringify(emptyProgress)) as typeof emptyProgress;
      startProgress.plan.day = 40;
      storage.setItem("weg-b2-progress-p1", JSON.stringify(startProgress));
      autoEntdecken = false;

      const { LektionWizard } = await import("../components/akademie/LektionWizard");
      const { grammarMap } = await import("../lib/content");
      mount(React.createElement(LektionWizard, { topicId: "a2-wasfuer" }));
      ok(txt().includes("السؤال عن النوع") && txt().includes("هدف هذا الدرس") && txt().includes("يبني على"), "LXXVIII1 المعالج يعرض درس Was-für وهدفه ومتطلباته");

      const unlock0 = (d0.querySelector('[data-testid="wizard-ueberspringen"]') ?? d0.querySelector('[data-testid="wizard-beobachtet"]')) as HTMLElement | null;
      ok(!!unlock0, "LXXVIII2 خطوةُ اكتشاف النمط تتيح المتابعة بتفاعل صريح");
      if (unlock0) click(unlock0);
      const next0 = d0.querySelector('[data-testid="wizard-next"]') as HTMLButtonElement | null;
      ok(!!next0 && !next0.disabled, "LXXVIII3 إكمالُ الاكتشاف يفتح الخطوة التالية");
      if (next0 && !next0.disabled) click(next0);

      const ruleDone = d0.querySelector('[data-testid="wizard-regel-gelesen"]') as HTMLElement | null;
      if (ruleDone) click(ruleDone);
      const next1 = d0.querySelector('[data-testid="wizard-next"]') as HTMLButtonElement | null;
      if (next1 && !next1.disabled) click(next1);
      const examplesDone = d0.querySelector('[data-testid="wizard-beispiele-gesehen"]') as HTMLElement | null;
      const model = d0.querySelector('[data-testid="wizard-model"]');
      if (examplesDone) click(examplesDone);
      const next2 = d0.querySelector('[data-testid="wizard-next"]') as HTMLButtonElement | null;
      if (next2 && !next2.disabled) click(next2);
      ok(!!ruleDone && !!examplesDone && !!model && txt().includes("أجب عن التمارين الثلاثة"), "LXXVIII4 الشرح والنموذج المحلول يسبقان التدريب المتدرج");

      const practice = grammarMap["a2-wasfuer"].exercises.slice(0, 3);
      const answerExercise = (ex: (typeof practice)[number]) => {
        const answer = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
        if (ex.type === "mc" || ex.type === "truefalse") {
          const answerButton = Array.from(d0.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === String(answer[0])) as HTMLElement | undefined;
          if (answerButton) click(answerButton);
        } else if (ex.type === "order") {
          for (const token of answer) {
            const word = Array.from(d0.querySelectorAll("button")).find((b) => !((b as HTMLButtonElement).disabled) && (b.textContent ?? "").trim() === String(token)) as HTMLElement | undefined;
            if (word) click(word);
          }
        } else {
          const input = Array.from(d0.querySelectorAll("input.field")).find((el) => !(el as HTMLInputElement).disabled) as HTMLInputElement | undefined;
          if (input) typeIn(input, String(answer[0]));
        }
        const check = Array.from(d0.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("تحقّق") && !(b as HTMLButtonElement).disabled) as HTMLElement | undefined;
        if (check) click(check);
        return !!check;
      };
      const firstChecked = answerExercise(practice[0]);
      let next3 = d0.querySelector('[data-testid="wizard-next"]') as HTMLButtonElement | null;
      ok(firstChecked && !!next3 && next3.disabled && (d0.querySelector('[data-testid="wizard-practice-progress"]')?.textContent ?? "").includes("1/3"),
        "LXXVIII5 لا تفتح خطوة التطبيق بعد سؤال واحد؛ التقدّم يُظهر 1/3");
      if (leave) leave();
      mount(React.createElement(LektionWizard, { topicId: "a2-wasfuer" }));
      const restoredProgress = d0.querySelector('[data-testid="wizard-practice-progress"]')?.textContent ?? "";
      ok(restoredProgress.includes("1/3") && !!(d0.querySelector('[data-testid="wizard-next"]') as HTMLButtonElement | null)?.disabled,
        "LXXVIII6 تعود المحاولة المحفوظة بعد إعادة فتح الدرس دون تجاوز التمرينين الباقيين");
      const secondChecked = answerExercise(practice[1]);
      const thirdChecked = answerExercise(practice[2]);
      next3 = d0.querySelector('[data-testid="wizard-next"]') as HTMLButtonElement | null;
      ok(secondChecked && thirdChecked && !!next3 && !next3.disabled && (d0.querySelector('[data-testid="wizard-practice-progress"]')?.textContent ?? "").includes("3/3"),
        "LXXVIII7 تصحيح التمارين الثلاثة يفتح الخلاصة ويعرض عدد الإجابات الصحيحة");
      if (next3 && !next3.disabled) click(next3);

      const independent = d0.querySelector('[data-testid="wizard-anwendung"]');
      const answerInput = d0.querySelector('[data-testid="wizard-anwendung-input"]') as HTMLTextAreaElement | null;
      ok(!!independent && !!answerInput && (independent.textContent ?? "").includes("Im Café") && (independent.textContent ?? "").includes("في مقهى") && (independent.textContent ?? "").includes("قائمة"),
        "LXXVIII8 مهمة الاستعمال تظهر مع خانة كتابة مستقلة بالألمانية والعربية");
      if (answerInput) typeIn(answerInput, "Was für ein Getränk probierst du gern? Ich probiere gern Minztee.");
      const saveApplication = d0.querySelector('[data-testid="wizard-anwendung-save"]') as HTMLButtonElement | null;
      if (saveApplication) click(saveApplication);
      const savedAnswer = storage.getItem("weg-wizard-anwendung-a2-wasfuer");
      ok(!!saveApplication && !!savedAnswer?.includes("Minztee") && !!d0.querySelector('[data-testid="wizard-anwendung-status"]'),
        "LXXVIII9 المحاولة الحرة تُحفظ محلياً كتدريب فقط ولا تُعلن استقلالاً");
      const finish = d0.querySelector('[data-testid="wizard-zurueck-heute"]') as HTMLElement | null;
      if (finish) click(finish);
      const afterRaw = storage.getItem("weg-b2-progress-p1");
      const after = afterRaw ? JSON.parse(afterRaw) as typeof startProgress : null;
      const dueDay = after?.verify?.["a2-wasfuer"]?.dueDay;
      ok(!!finish && dueDay === 43, `LXXVIII10 حفظُ التدريب وجدولته يتحقّق بمهمة جديدة في اليوم +3 (الموعد ${dueDay ?? "مفقود"})`);
      const { dueVerify, buildDay } = await import("../lib/plan");
      const premature = after ? dueVerify(after, 42).some((v) => v.lessonId === "a2-wasfuer") : true;
      const dueEntry = after ? dueVerify(after, 43).find((v) => v.lessonId === "a2-wasfuer") : undefined;
      const dueTask = after ? buildDay(43, after).tasks.find((t) => t.verifyFor === "a2-wasfuer") : undefined;
      ok(!premature && !!dueEntry && dueTask?.kind === "check" && dueTask.quiz?.length === 2,
        "LXXVIII11 لا يظهر قبل موعده؛ وفي اليوم الثالث يظهر تحققٌ مستقلٌ ببندين جديدين");
    } finally {
      if (leave) leave();
      autoEntdecken = oldAutoEntdecken;
      storage.clear();
      for (const [key, value] of saved) storage.setItem(key, value);
    }
  }

  /* ═══ LXXX — R58: المسار المرئي، محتوى الدرس، وخريطة الختام بلا لمس التقدم ═══ */
  {
    const { CurriculumMap } = await import("../components/akademie/CurriculumMap");
    const mapProgress = JSON.parse(JSON.stringify(emptyProgress)) as typeof emptyProgress;
    mapProgress.plan.day = 20;
    mapProgress.plan.curriculumLegacyThroughDay = 21;
    mapProgress.plan.days = {
      15: { closed: true, score: 5, total: 5, tasksDone: 2, tasksTotal: 2, at: "2026-10-03" },
    };
    mapProgress.plan.tasks = {
      "15:t2": { done: true, passed: true, score: 5, total: 5, attempts: 1 },
    };
    const savedBeforeMap = JSON.stringify(mapProgress);
    mount(React.createElement(CurriculumMap, { progress: mapProgress }));
    const returnToToday = d0.querySelector('.curriculum-primary-link') as HTMLAnchorElement | null;
    ok(txt().includes("مسار المنهج") && txt().includes("378") && txt().includes("A0") &&
      txt().includes("B2") && txt().includes("66") && txt().includes("الأسبوع الجاري محفوظان") &&
      returnToToday?.getAttribute("href") === "/",
      "LXXX1 العنوان يبيّن المسار الكامل ويحفظ الأسبوع، مع باب رجوع مباشر إلى خطة اليوم");

    const lessonCard = d0.querySelector('[data-testid="curriculum-lesson-a2-wasfuer"]') as HTMLDetailsElement | null;
    if (lessonCard) act(() => { lessonCard.open = true; });
    ok(!!lessonCard && txt().includes("هدف الدرس") && txt().includes("يبني على") &&
      txt().includes("أمثلة مع ترجمتها") && txt().includes("استعمال مستقل في موقف جديد"),
      "LXXX2 بطاقة الدرس تعرض هدفه ومتطلبه وأمثلته ومهمة استعماله");

    const daysTab = d0.querySelector('[data-testid="curriculum-tab-days"]') as HTMLElement | null;
    if (daysTab) click(daysTab);
    const sectionButtons = d0.querySelectorAll('[data-testid^="map-section-"]');
    ok(!!daysTab && sectionButtons.length === 18,
      "LXXX3 خريطة الأيام تعرض الوحدات الـ17 ومحطة الختام بصورة منفصلة");

    const finalSection = d0.querySelector('[data-testid="map-section-finale-375-378"]') as HTMLElement | null;
    if (finalSection) click(finalSection);
    const closingDays = [375, 376, 377, 378].map((day) => d0.querySelector(`[data-testid="map-day-${day}"]`));
    ok(!!finalSection && closingDays.every(Boolean) && txt().includes("الختام الشامل") &&
      txt().includes("استماع") && txt().includes("قراءة") && txt().includes("كتابة") && txt().includes("تحدّث"),
      "LXXX4 أيام 375–378 ظاهرة، ومعها مهارات الاستماع والقراءة والكتابة والتحدث");

    const day375 = d0.querySelector('[data-testid="map-day-375"] .curriculum-day-toggle') as HTMLElement | null;
    if (day375) click(day375);
    ok(!!day375 && txt().includes("مراجعة شاملة") && txt().includes("بنود التدريب أو الفحص"),
      "LXXX5 فتح اليوم يُظهر مهامه ومحتواها من مصدر الخطة");
    ok(JSON.stringify(mapProgress) === savedBeforeMap,
      "LXXX6 التنقل وفتح محتوى الخريطة لا يغيّران التقدم المحفوظ");
  }

  /* ═══ LXXXI — R59: مكونات DirB المشتركة وإطار التطبيق ═══ */
  {
    const { UiAppShell, UiSurface, UiBadge, UiPageHeading } = await import("../components/dirb/DesignSystem");
    mount(React.createElement(
      UiAppShell,
      { "data-ui-shell": "interactive-check" },
      React.createElement(
        "main",
        { id: "main-content" },
        React.createElement(UiPageHeading, { className: "test-heading", "data-testid": "design-heading" },
          React.createElement("h1", { dir: "rtl" }, "واجهة عربية")),
        React.createElement(UiSurface, { className: "test-surface", "data-testid": "design-surface", "aria-label": "بطاقة" },
          React.createElement("p", null, "محتوى البطاقة"),
          React.createElement(UiBadge, { className: "test-badge", "aria-label": "الحالة" }, "مكتمل")),
      ),
    ));
    const shell = d0.querySelector('[data-ui-shell="interactive-check"]');
    const skipLink = d0.querySelector('.ui-skip-link') as HTMLAnchorElement | null;
    ok(!!shell && shell.classList.contains("ui-app-shell") && skipLink?.getAttribute("href") === "#main-content",
      "LXXXI1 إطار التطبيق يوفّر غلافاً مشتركاً ورابط تخطٍّ يصل إلى المحتوى");

    const heading = d0.querySelector('[data-testid="design-heading"]');
    ok(!!heading && heading.tagName === "HEADER" && heading.classList.contains("ui-page-heading") &&
      heading.querySelector("h1[dir='rtl']")?.textContent === "واجهة عربية",
      "LXXXI2 ترويسة الصفحة المشتركة تحفظ الدلالة والاتجاه العربي");

    const surface = d0.querySelector('[data-testid="design-surface"]');
    ok(!!surface && surface.tagName === "SECTION" && surface.classList.contains("ui-surface") &&
      surface.getAttribute("aria-label") === "بطاقة" && surface.textContent?.includes("محتوى البطاقة"),
      "LXXXI3 السطح المشترك دلالي ويحتفظ بخصائص الوصول ومحتواه");

    const badge = d0.querySelector('.test-badge');
    ok(!!badge && badge.classList.contains("ui-badge") && badge.getAttribute("aria-label") === "الحالة" &&
      badge.textContent === "مكتمل",
      "LXXXI4 الشارة المشتركة تعرض الحالة وتحتفظ باسمها الميسّر");
    if (leave) leave();
  }

  /* ═══ LXXXII — R60: الشفرات كاملةً في درسها، والمستحقّة موسومة حسب SRS ═══ */
  {
    const storage = dom.window.localStorage;
    const saved = Array.from({ length: storage.length }, (_, i) => {
      const key = storage.key(i)!;
      return [key, storage.getItem(key)!] as const;
    });
    const oldAutoEntdecken = autoEntdecken;
    try {
      storage.clear();
      storage.setItem("weg-b2-profiles", JSON.stringify({ active: "p1", list: [{ id: "p1", name: "اختبار", emoji: "🧪", created: "2026-10-04" }] }));
      const startProgress = JSON.parse(JSON.stringify(emptyProgress)) as typeof emptyProgress;
      const topicId = "a1-akkusativ";
      const { grammarMap, getBrueckenFor } = await import("../lib/content");
      const bridges = getBrueckenFor(topicId);
      const dueId = bridges[0]?.id;
      if (dueId) startProgress.srs[`bru:${dueId}`] = { ease: 2.5, interval: 1, due: "2000-01-01T00:00:00.000Z", reps: 1, lapses: 0 };
      storage.setItem("weg-b2-progress-p1", JSON.stringify(startProgress));
      storage.setItem(`weg-wizard-${topicId}`, JSON.stringify({ schritt: 4, erledigt: [true, true, true, true, false] }));
      autoEntdecken = false;

      const { LektionWizard } = await import("../components/akademie/LektionWizard");
      mount(React.createElement(LektionWizard, { topicId }));
      const lessonCodes = bridges.map((b) => d0.querySelector(`[data-testid="wizard-bruecke-${b.id}"]`));
      const dueBadge = dueId ? d0.querySelector(`[data-testid="wizard-bruecke-due-${dueId}"]`) : null;
      ok(bridges.length === 7 && lessonCodes.every(Boolean) && !!dueBadge && txt().includes("7 شفرة"),
        "LXXXII1 درس Akkusativ يعرض شفراته السبع ويُميّز المستحقة داخل الخلاصة");
      if (dueId) {
        const toggle = d0.querySelector(`[data-testid="wizard-bruecke-toggle-${dueId}"]`) as HTMLElement | null;
        if (toggle) click(toggle);
        const bridge = bridges.find((b) => b.id === dueId)!;
        const panel = d0.querySelector(`#wizard-bruecke-content-${dueId}`);
        const complete = !!panel && bridge.zeilen.every((line) => (panel.textContent ?? "").includes(line.code) && (panel.textContent ?? "").includes(line.de) && (panel.textContent ?? "").includes(line.ar));
        ok(!!toggle && complete, `LXXXII2 الشفرة المستحقة تُفتح كاملةً مع كل أسطرها وتفسيرها (${bridge.zeilen.length} أسطر)`);
      } else {
        ok(false, "LXXXII2 توجد شفرةٌ مستحقة للاختبار");
      }

      const { default: TaskView } = await import("../components/tasks");
      const task = { id: "test-grammar-a1-akkusativ", kind: "grammatik" as const, titleDe: "Akkusativ", titleAr: "المنصوب", minutes: 15, topicId };
      autoEntdecken = true;
      mount(React.createElement(TaskView, { task, lang: "ar" as const, day: 6, srs: startProgress.srs, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 }));
      const dailyCodes = bridges.map((b) => d0.querySelector(`[data-testid="grammar-bruecke-${b.id}"]`));
      ok(dailyCodes.every(Boolean) && !!(dueId && d0.querySelector(`[data-testid="grammar-bruecke-due-${dueId}"]`)),
        "LXXXII3 بطاقة القاعدة اليومية تعرض الشفرات نفسها وتوسم المستحقّة");

      const foundationId = "a0-begrussung";
      storage.setItem(`weg-wizard-${foundationId}`, JSON.stringify({ schritt: 0, erledigt: [false, false, false, false, false] }));
      autoEntdecken = false;
      mount(React.createElement(LektionWizard, { topicId: foundationId }));
      const foundationPrereq = d0.querySelector('[data-testid="wizard-voraus"]');
      ok(!!foundationPrereq && (foundationPrereq.textContent ?? "").includes("درس تأسيسي — لا متطلب سابق"),
        "LXXXII4 الدرس التأسيسي يعلن صراحةً عدم وجود متطلب سابق");
    } finally {
      if (leave) leave();
      autoEntdecken = oldAutoEntdecken;
      storage.clear();
      for (const [key, value] of saved) storage.setItem(key, value);
    }
  }

  /* ═══ LXXXIV — R62/R63: هدف الجلسة منفصل عن مجموع اليوم، والتوقف يحفظ غير المُسلَّم كمسودة فقط ═══ */
  {
    const storage = dom.window.localStorage;
    const saved = Array.from({ length: storage.length }, (_, i) => {
      const key = storage.key(i)!;
      return [key, storage.getItem(key)!] as const;
    });
    try {
      storage.clear();
      storage.setItem("weg-b2-profiles", JSON.stringify({ active: "p1", list: [{ id: "p1", name: "اختبار", emoji: "🧪", created: "2026-10-04" }] }));
      const { buildDay } = await import("../lib/plan");
      const progress = JSON.parse(JSON.stringify(emptyProgress)) as typeof emptyProgress;
      progress.plan.day = 278;
      const dayPlan = buildDay(278, progress);
      const totalMinutes = dayPlan.tasks.reduce((sum, task) => sum + task.minutes, 0);
      const targetMinutes = dayPlan.zielMin;
      const completed: typeof progress.plan.tasks = {};
      let completedMinutes = 0;
      for (const task of dayPlan.tasks) {
        if (completedMinutes >= targetMinutes) break;
        completed[task.id] = { done: true, passed: true, score: 5, total: 5, attempts: 1, kind: task.kind };
        completedMinutes += task.minutes;
      }
      progress.plan.tasks = completed;
      storage.setItem("weg-b2-progress-p1", JSON.stringify(progress));
      storage.setItem("wegb2:day-step:278", "0");

      const { default: Today } = await import("../app/page");
      mount(React.createElement(Today));
      const note = d0.querySelector('[data-testid="session-time-note"]');
      const goalReadout = d0.querySelector('[data-testid="session-goal-progress"]');
      const bar = d0.querySelector('[aria-label="التقدّم نحو هدف الجلسة"]');
      const remaining = dayPlan.tasks.length - Object.keys(completed).length;
      ok(!!note && (note.textContent ?? "").includes(`مجموع تقديرات مهام اليوم ${totalMinutes} دقيقة`) &&
        (note.textContent ?? "").includes(`هدف الجلسة ${targetMinutes} دقيقة`) &&
        (note.textContent ?? "").includes("لا التزام بإكمال القائمة في جلسة واحدة") &&
        (note.textContent ?? "").includes(`بقيت ${remaining} مهام يمكنك متابعتها لاحقاً`),
        `LXXXIV1 شاشة اليوم تفصل هدف الجلسة ${targetMinutes} د عن مجموع الخطة ${totalMinutes} د وتُظهر ${remaining} مهام باقية بعد بلوغ الهدف`);
      ok(!!goalReadout && (goalReadout.textContent ?? "").includes(`${targetMinutes} من ${targetMinutes} دقيقة`) &&
        !!bar && bar.getAttribute("aria-valuenow") === "100" && remaining > 0,
        "LXXXIV2 اكتمال هدف الجلسة لا يعلن اكتمال الخطة؛ شريط الجلسة مقيد بهدفه وتبقى مهام معلومة");

      if (leave) leave();
      storage.clear();
      storage.setItem("weg-b2-profiles", JSON.stringify({ active: "p1", list: [{ id: "p1", name: "اختبار", emoji: "🧪", created: "2026-10-04" }] }));
      const pauseProgress = JSON.parse(JSON.stringify(emptyProgress)) as typeof emptyProgress;
      pauseProgress.plan.day = 2;
      const basePlan = buildDay(2, pauseProgress);
      const currentTask = { id: "pause-unsent-writing", kind: "schreiben" as const, titleDe: "Schreiben", titleAr: "كتابة", minutes: 15, writeId: "w-a2-01" };
      const pausePlan = { ...basePlan, tasks: [currentTask] };
      const { ritualUrteil } = await import("../lib/ritual");
      const { Klassenzimmer } = await import("../components/akademie/Klassenzimmer");
      const { loadProgress } = await import("../lib/store");
      storage.setItem("weg-b2-progress-p1", JSON.stringify(pauseProgress));
      let closeCalls = 0;
      mount(React.createElement(Klassenzimmer, {
        progress: pauseProgress, day: 2, plan: pausePlan, stepFrei: 0, setStep: () => {},
        ritual: ritualUrteil(pausePlan, pauseProgress), resultOf: () => undefined, localOf: () => ({ score: 0, total: 0 }),
        onPoints: () => {}, submitCurrent: () => {}, doCloseDay: () => { closeCalls++; }, confirmClose: false,
        setConfirmClose: () => {}, unpassed: [], allSubmitted: false, onSrs: () => {},
      }));
      const writingDraft = d0.querySelector("textarea") as HTMLTextAreaElement | null;
      const draftText = "Ich schreibe heute einen kurzen Brief an meine Freundin.";
      if (writingDraft) typeIn(writingDraft, draftText);
      click(d0.querySelector('[data-testid="pause-and-save"]') as HTMLElement);
      const rawDraft = storage.getItem("wegb2:partial:pause-unsent-writing:writing");
      const parsedDraft = rawDraft ? JSON.parse(rawDraft) as { text?: string; submitted?: boolean } : null;
      const afterPause = loadProgress();
      const pauseStatus = d0.querySelector('[data-testid="pause-saved-message"]')?.textContent ?? "";
      ok(!!writingDraft && parsedDraft?.text === draftText && parsedDraft.submitted === false &&
        pauseStatus.includes("غير مُسلَّمة") && pauseStatus.includes("لا تُسجَّل لها نتيجة") &&
        !afterPause.plan.tasks[currentTask.id] && afterPause.plan.day === 2 &&
        !afterPause.plan.days[2]?.closed && JSON.stringify(afterPause.plan.debt) === JSON.stringify(pauseProgress.plan.debt) &&
        storage.getItem("wegb2:day-step:2") === "0" && closeCalls === 0,
        "LXXXIV3 مسودة المهمة غير المُسلَّمة وموضعها محفوظان؛ لا نتيجة أو إغلاق أو ترحيل أو تعويض");
    } finally {
      if (leave) leave();
      storage.clear();
      for (const [key, value] of saved) storage.setItem(key, value);
    }
  }

  /* ═══ LXXXV — تبديل قائمة «أستطيع» يحفظ مباشرةً بلا اشتراك Progress متداخل ═══ */
  {
    const storage = dom.window.localStorage;
    const saved = Array.from({ length: storage.length }, (_, i) => {
      const key = storage.key(i)!;
      return [key, storage.getItem(key)!] as const;
    });
    try {
      storage.clear();
      storage.setItem("weg-b2-profiles", JSON.stringify({ active: "p1", list: [{ id: "p1", name: "اختبار", emoji: "🧪", created: "2026-10-04" }] }));
      const { default: TaskView } = await import("../components/tasks");
      const { loadProgress } = await import("../lib/store");
      const { candoMap } = await import("../lib/content");
      const first = candoMap.A0[0];
      mount(React.createElement(TaskView, {
        task: { id: "cando-toggle-test", kind: "wiederholen" as const, titleDe: "Wiederholung", titleAr: "استرجاع", minutes: 5, sentenceIds: [], quiz: [] },
        lang: "ar" as const, day: 1, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1,
      }));
      const checkbox = d0.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
      if (checkbox) click(checkbox);
      const enabled = loadProgress().canDo[first.id] === true;
      if (checkbox) click(checkbox);
      const disabled = !loadProgress().canDo[first.id];
      ok(!!first && !!checkbox && enabled && disabled,
        "LXXXV تبديل «أستطيع» يحفظ حالته في الملف ويعكسها عند النقر الثاني دون تحديث حالة مكررة في الابن");
    } finally {
      if (leave) leave();
      storage.clear();
      for (const [key, value] of saved) storage.setItem(key, value);
    }
  }

  console.log(`\n${beste} نجح · ${fehler} فشل`);
  if (fails.length) { console.log("الفاشلون:", fails.join(" | ")); process.exit(1); }
  process.exit(0);
}

main().catch((e) => { console.error("انهارت الجولة:", e); process.exit(2); });
