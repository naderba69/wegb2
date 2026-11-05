#!/usr/bin/env node
/**
 * Real-Chromium production/PWA gate without a browser npm dependency.
 * Uses Node 22's WebSocket and the Chrome DevTools Protocol directly so the
 * root dependency audit stays clean. It proves browser rendering, nonce-CSP,
 * Service Worker activation, complete shell caching, and offline routes/banks.
 */
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const HOST = "127.0.0.1";
const PORT = Number(process.env.BROWSER_E2E_PORT || 3100);
const ORIGIN = `http://${HOST}:${PORT}`;
const ROUTES = ["/", "/lernen", "/ueben", "/fortschritt", "/pruefen", "/einstellungen", "/masar", "/drucken", "/datenschutz", "/qualitaet"];
const BANKS = ["/banks.json", "/banks-vertiefung.json", "/banks-lang.json"];
const TIMEOUT = 120_000;

function fail(message) {
  throw new Error(message);
}

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/tmp/chromium",
  ].filter(Boolean);
  for (const candidate of candidates) if (existsSync(candidate)) return candidate;
  for (const name of ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser"]) {
    try {
      const found = execFileSync("which", [name], { encoding: "utf8" }).trim();
      if (found && existsSync(found)) return found;
    } catch { /* nächster Kandidat */ }
  }
  fail("Kein Chrome/Chromium gefunden. Setze CHROME_PATH auf ein ausführbares Binary.");
}

async function waitHttp(url, timeout = TIMEOUT) {
  const ende = Date.now() + timeout;
  let letzterFehler = "";
  while (Date.now() < ende) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) return response;
      letzterFehler = `HTTP ${response.status}`;
    } catch (error) {
      letzterFehler = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  fail(`Server nicht erreichbar: ${url} (${letzterFehler})`);
}

async function beende(child) {
  if (!child || child.exitCode !== null) return;
  try { child.kill("SIGTERM"); } catch { return; }
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  if (child.exitCode === null) {
    try { child.kill("SIGKILL"); } catch { /* bereits beendet */ }
    await new Promise((resolve) => child.once("exit", resolve));
  }
}

class Cdp {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.waiters = [];
    this.ws = null;
  }

  async open() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("CDP WebSocket timeout")), 15_000);
      this.ws.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
      this.ws.addEventListener("error", () => { clearTimeout(timer); reject(new Error("CDP WebSocket error")); }, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(typeof event.data === "string" ? event.data : Buffer.from(event.data).toString("utf8"));
      if (data.id) {
        const pending = this.pending.get(data.id);
        if (!pending) return;
        this.pending.delete(data.id);
        clearTimeout(pending.timer);
        if (data.error) pending.reject(new Error(`${pending.method}: ${data.error.message}`));
        else pending.resolve(data.result ?? {});
        return;
      }
      for (const waiter of [...this.waiters]) {
        if (waiter.method !== data.method || waiter.sessionId !== (data.sessionId ?? null)) continue;
        if (waiter.predicate && !waiter.predicate(data.params ?? {})) continue;
        this.waiters.splice(this.waiters.indexOf(waiter), 1);
        clearTimeout(waiter.timer);
        waiter.resolve(data.params ?? {});
      }
    });
  }

  send(method, params = {}, sessionId = undefined, timeout = TIMEOUT) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method}: timeout`));
      }, timeout);
      this.pending.set(id, { method, resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  event(method, sessionId = null, predicate = null, timeout = TIMEOUT) {
    return new Promise((resolve, reject) => {
      const waiter = { method, sessionId, predicate, resolve, reject, timer: null };
      waiter.timer = setTimeout(() => {
        this.waiters.splice(this.waiters.indexOf(waiter), 1);
        reject(new Error(`${method}: event timeout`));
      }, timeout);
      this.waiters.push(waiter);
    });
  }

  close() {
    try { this.ws?.close(); } catch { /* Ende */ }
  }
}

async function evalJs(cdp, sessionId, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  }, sessionId);
  if (result.exceptionDetails) fail(`Browser-Auswertung fehlgeschlagen: ${result.exceptionDetails.text}`);
  return result.result?.value;
}

async function navigate(cdp, sessionId, url) {
  const geladen = cdp.event("Page.loadEventFired", sessionId);
  const dokument = cdp.event("Network.responseReceived", sessionId, (params) => params.type === "Document" && params.response?.url?.startsWith(url));
  const nav = await cdp.send("Page.navigate", { url }, sessionId);
  if (nav.errorText) fail(`${url}: ${nav.errorText}`);
  const [, response] = await Promise.all([geladen, dokument]);
  if (response.response.status !== 200) fail(`${url}: HTTP ${response.response.status}`);
}

async function poll(cdp, sessionId, expression, beschreibung, timeout = TIMEOUT) {
  const ende = Date.now() + timeout;
  let wert;
  while (Date.now() < ende) {
    wert = await evalJs(cdp, sessionId, expression);
    if (wert) return wert;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  fail(`${beschreibung}: timeout (letzter Wert ${JSON.stringify(wert)})`);
}

async function main() {
  const chrome = chromePath();
  const profil = mkdtempSync(join(tmpdir(), "wegb2-browser-e2e-"));
  let server;
  let browser;
  let cdp;
  const serverLog = [];
  const chromeLog = [];
  try {
    server = spawn(process.execPath, [join(ROOT, "node_modules/next/dist/bin/next"), "start", "-H", HOST, "-p", String(PORT)], {
      cwd: ROOT,
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    server.stdout.on("data", (chunk) => serverLog.push(String(chunk)));
    server.stderr.on("data", (chunk) => serverLog.push(String(chunk)));
    await waitHttp(`${ORIGIN}/datenschutz`);

    const policyResponse = await fetch(`${ORIGIN}/datenschutz`);
    const policyHtml = await policyResponse.text();
    const csp = policyResponse.headers.get("content-security-policy") ?? "";
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1] ?? "";
    if (!nonce || !policyHtml.includes(`nonce="${nonce}"`) || /script-src[^;]*'unsafe-inline'/.test(csp)) {
      fail("Nonce-CSP stimmt nicht mit dem HTML überein oder erlaubt unsafe-inline Scripts");
    }
    if (!csp.includes("frame-ancestors 'self'")) fail("Produktions-CSP begrenzt frame-ancestors nicht auf self");

    const ldParts = [process.env.LD_LIBRARY_PATH];
    if (existsSync("/tmp/nsslibs")) ldParts.push("/tmp/nsslibs");
    if (existsSync("/tmp/aws/lib")) ldParts.push("/tmp/aws/lib");
    const env = { ...process.env, LD_LIBRARY_PATH: ldParts.filter(Boolean).join(":"), HOME: profil };
    let wsUrl = "";
    browser = spawn(chrome, [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--no-first-run",
      `--user-data-dir=${profil}`,
      "--remote-debugging-port=0",
      "about:blank",
    ], { env, stdio: ["ignore", "pipe", "pipe"] });
    browser.stderr.on("data", (chunk) => {
      const text = String(chunk);
      chromeLog.push(text);
      const match = text.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) wsUrl = match[1];
    });
    const wsEnde = Date.now() + 30_000;
    while (!wsUrl && Date.now() < wsEnde && browser.exitCode === null) await new Promise((resolve) => setTimeout(resolve, 50));
    if (!wsUrl) fail(`Chrome startete nicht mit CDP. ${chromeLog.join("").slice(-1500)}`);

    cdp = new Cdp(wsUrl);
    await cdp.open();
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send("Network.enable", {}, sessionId);
    await navigate(cdp, sessionId, `${ORIGIN}/datenschutz`);
    const privacy = await poll(cdp, sessionId,
      `document.body?.textContent?.includes("الخصوصية والبيانات") && !document.body?.textContent?.includes("تعذّر تحميل المحتوى")`,
      "Datenschutzseite ohne Banken verfügbar");
    if (!privacy) fail("Datenschutzseite fehlt");

    await navigate(cdp, sessionId, `${ORIGIN}/qualitaet`);
    const quality = await poll(cdp, sessionId,
      `document.body?.textContent?.includes("لا يحمل اعتماداً رسمياً من Goethe-Institut أو telc gGmbH") && document.body?.textContent?.includes("ما يمنع الاعتماد الآن؟") && !document.body?.textContent?.includes("تعذّر تحميل المحتوى")`,
      "Qualitätsseite mit ehrlicher Akkreditierungsgrenze");
    if (!quality) fail("Qualitätsseite oder Akkreditierungsgrenze fehlt");

    const sw = await poll(cdp, sessionId, `(async()=>{const r=await navigator.serviceWorker.getRegistration();return r?.active?.state==="activated"&&!!navigator.serviceWorker.controller})()`, "Service Worker activation");
    if (!sw) fail("Service Worker nicht aktiv");

    const online = await evalJs(cdp, sessionId, `(async()=>{
      const required=${JSON.stringify([...ROUTES, ...BANKS])};
      const cache=await caches.open("wegb2-v5");
      const missing=[];
      for(const path of required) if(!(await cache.match(path))) missing.push(path);
      const keys=(await caches.keys()).filter((key)=>key.startsWith("wegb2-"));
      const entries={};
      for(const key of keys) entries[key]=(await (await caches.open(key)).keys()).length;
      return {missing,keys,entries};
    })()`);
    if (online.missing.length) fail(`Offline-Shell unvollständig: ${online.missing.join(", ")}`);

    await cdp.send("Network.emulateNetworkConditions", {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0,
      connectionType: "none",
    }, sessionId);

    const offlineRoutes = [];
    for (const route of ROUTES) {
      await navigate(cdp, sessionId, `${ORIGIN}${route}`);
      const bereit = await poll(cdp, sessionId,
        `location.pathname===${JSON.stringify(route)} && !!document.querySelector("[data-ui-shell='ui-app-shell']") && !document.body.textContent.includes("تعذّر تحميل المحتوى")`,
        `Offline route ${route}`);
      offlineRoutes.push({ route, bereit: !!bereit, title: await evalJs(cdp, sessionId, "document.title") });
    }

    const offlineBanks = await evalJs(cdp, sessionId, `(async()=>{
      const out={};
      for(const path of ${JSON.stringify(BANKS)}){const response=await fetch(path);out[path]={status:response.status,bytes:(await response.text()).length};}
      return out;
    })()`);
    for (const [path, result] of Object.entries(offlineBanks)) {
      if (result.status !== 200 || result.bytes < 1000) fail(`Offline bank ${path} ungültig: ${JSON.stringify(result)}`);
    }

    console.log(JSON.stringify({
      chrome,
      csp: { nonce: true, scriptUnsafeInline: false, frameAncestorsSelf: true },
      serviceWorker: { active: true, caches: online.entries, missing: online.missing },
      offlineRoutes,
      offlineBanks,
    }, null, 2));
    console.log(`browser:e2e ✓ ${ROUTES.length} Routen + ${BANKS.length} Banken im echten Chromium offline`);
  } catch (error) {
    console.error(serverLog.join("").slice(-2000));
    console.error(chromeLog.join("").slice(-2000));
    throw error;
  } finally {
    cdp?.close();
    await beende(browser);
    await beende(server);
    rmSync(profil, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
