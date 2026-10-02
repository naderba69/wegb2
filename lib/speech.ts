"use client";
/**
 * محرّك النطق والتسميع — يعمل داخل المتصفح (Web Speech API)
 * صفر روابط خارجية، صفر تكلفة، صوت ألماني أصلي.
 */

import { loadProgress } from "./store";

let cached: SpeechSynthesisVoice[] | null = null;

export function speechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function germanVoices(): SpeechSynthesisVoice[] {
  if (!speechAvailable()) return [];
  const all = window.speechSynthesis.getVoices();
  cached = all.filter((v) => v.lang.toLowerCase().startsWith("de"));
  return cached;
}

export function pickVoice(name?: string): SpeechSynthesisVoice | null {
  const vs = germanVoices();
  if (name) {
    const found = vs.find((v) => v.name === name);
    if (found) return found;
  }
  return vs[0] ?? null;
}

/** ينطق نصاً ألمانياً */
export function speakDe(text: string, opts?: { rate?: number; voiceName?: string }): boolean {
  if (!speechAvailable()) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  const v = pickVoice(opts?.voiceName);
  if (v) u.voice = v;
  u.rate = opts?.rate ?? 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}

/** ينطق سطراً ثم يستدعي callback عند الانتهاء (لتسلسل الحوار) */
export function speakLine(
  text: string,
  onEnd?: () => void,
  opts?: { rate?: number; voiceName?: string }
): boolean {
  if (!speechAvailable()) {
    onEnd?.();
    return false;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  const v = pickVoice(opts?.voiceName);
  if (v) u.voice = v;
  u.rate = opts?.rate ?? 0.9;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeech() {
  if (speechAvailable()) window.speechSynthesis.cancel();
}

/** احمِ تحميل الأصوات (Chrome يحمّلها بشكل غير متزامن) */
export function warmVoices(cb?: (vs: SpeechSynthesisVoice[]) => void) {
  if (!speechAvailable()) return;
  const fire = () => cb?.(germanVoices());
  fire();
  window.speechSynthesis.onvoiceschanged = fire;
}

/** إصغاء ألماني (SpeechRecognition) — يعيد دالة إيقاف؛ يُبلّغ بالنص المسموع أو "" */
export function listenDe(
  onResult: (text: string) => void,
  onEnd: () => void
): () => void {
  const W = window as unknown as {
    SpeechRecognition?: new () => Record<string, unknown>;
    webkitSpeechRecognition?: new () => Record<string, unknown>;
  };
  const Rec = W.SpeechRecognition ?? W.webkitSpeechRecognition;
  if (!Rec) {
    onResult("");
    onEnd();
    return () => {};
  }
  const rec = new Rec() as unknown as {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: (e: { results: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void;
    onerror: () => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
  };
  rec.lang = "de-DE";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  let got = false;
  rec.onresult = (e) => {
    got = true;
    onResult(String(e.results[0][0].transcript ?? ""));
  };
  rec.onerror = () => {
    if (!got) onResult("");
  };
  rec.onend = () => onEnd();
  try {
    rec.start();
  } catch {
    onEnd();
  }
  return () => {
    try {
      rec.stop();
    } catch {
      /* */
    }
  };
}

/** قرارُ استعمالِ التعرّفِ السحابي — لا يُستعمَلُ أبداً بلا إذنٍ صريحٍ في الإعدادات */
export function cloudSpeechEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return loadProgress().settings.cloudSpeech === true;
}

/** متاحٌ تقنياً **و** مأذونٌ صراحةً — هذا وحده ما يفتح الميكروفون السحابي */
export function cloudSpracheFrei(): boolean {
  return recognitionAvailable() && cloudSpeechEnabled();
}

export function recognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  const W = window as unknown as Record<string, unknown>;
  return !!(W.SpeechRecognition || W.webkitSpeechRecognition);
}
export function speakAny(
  text: string | string[] | null | undefined,
  opts?: { rate?: number; voiceName?: string }
): boolean {
  const s = Array.isArray(text) ? text[0] : text;
  if (!s) return false;
  if (opts?.voiceName !== undefined || opts?.rate !== undefined) {
    return speakDe(String(s), opts);
  }
  const st = loadProgress().settings;
  return speakDe(String(s), { voiceName: st.voiceName, rate: st.rate });
}
