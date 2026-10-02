/* تدقيق ديناميكي: تركيب كلّ مهمّة من كلّ يوم (270 يوماً) + كلّ درس/نص/حوار — أيّ استثناء أو تحذير React يُسجَّل */
import { JSDOM } from "jsdom";
const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, { url: "http://localhost/", pretendToBeVisual: true });
(dom.window as unknown as { scrollTo: () => void }).scrollTo = () => {};
(dom.window as unknown as { Element: { prototype: { scrollIntoView: () => void } } }).Element.prototype.scrollIntoView = () => {};
const g = globalThis as unknown as Record<string, unknown>;
for (const key of ["window", "document", "navigator", "localStorage", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame"])
  Object.defineProperty(g, key, { value: key === "window" ? dom.window : (dom.window as Record<string, unknown>)[key], configurable: true, writable: true });
g.window = dom.window; g.IS_REACT_ACT_ENVIRONMENT = true;
const warnungen = new Map<string, number>();
const origErr = console.error;
let aktuell = "";
console.error = (...a: unknown[]) => { const k = String(a[0]).slice(0, 60) + " @ " + aktuell + " key=" + String(a[1] ?? "").slice(0, 40); warnungen.set(k, (warnungen.get(k) ?? 0) + 1); };

async function main() {
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const act = (React as unknown as { act: (cb: () => void) => void }).act;
  const { emptyProgress, TOTAL_DAYS } = await import("../lib/types");
  const { buildDay } = await import("../lib/plan");
  const { default: TaskView } = await import("../components/tasks");
  const rootEl = dom.window.document.getElementById("root")!;
  const fehler: string[] = []; let n = 0, leerN: string[] = [];
  const props = { lang: "ar" as const, srs: {}, onSrs: () => {}, onPoints: () => {}, voiceName: "", rate: 1 };
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const plan = buildDay(d, emptyProgress);
    for (const t of plan.tasks) {
      aktuell = `Tag ${d} ${t.kind} ${t.id}`;
      const root = createRoot(rootEl);
      try {
        act(() => root.render(React.createElement(TaskView, { task: t, day: d, ...props })));
        n++;
        const txt = rootEl.textContent ?? "";
        if (txt.trim().length < 40) leerN.push(`Tag ${d} ${t.kind} ${t.id} (${txt.trim().slice(0, 30)})`);
        if (/غير موجود|undefined|NaN|\[object Object\]/.test(txt)) fehler.push(`Tag ${d} ${t.kind} ${t.id}: نصّ مريب «${(txt.match(/.{0,30}(غير موجود|undefined|NaN|\[object Object\]).{0,30}/) ?? [""])[0]}»`);
        // انقر كلّ زر مرة (بلا أزرار صوت) لاصطياد استثناءات المعالجات
        const buttons = Array.from(rootEl.querySelectorAll("button")).filter((b) => !/🔊|▶|⏹|استمع|شغّل/.test(b.textContent ?? "")).slice(0, 25);
        for (const b of buttons) { try { act(() => { b.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); }); } catch (e) { fehler.push(`Tag ${d} ${t.kind} ${t.id}: نقر «${(b.textContent ?? "").slice(0, 25)}» → ${(e as Error).message.slice(0, 100)}`); } }
      } catch (e) { fehler.push(`Tag ${d} ${t.kind} ${t.id}: ${(e as Error).message.slice(0, 160)}`); }
      finally { act(() => root.unmount()); }
    }
  }
  console.log(`مهام مركَّبة: ${n}`);
  console.log(`\n### أخطاء تركيب/نقر (${fehler.length})`); for (const f of fehler.slice(0, 40)) console.log("  - " + f);
  console.log(`\n### مهام شبه فارغة (${leerN.length})`); for (const f of leerN.slice(0, 20)) console.log("  - " + f);
  console.log(`\n### تحذيرات React/console.error (${warnungen.size} نوعاً)`); for (const [k, v] of [...warnungen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  - ×${v} ${k}`);
  origErr("done");
}
main();
