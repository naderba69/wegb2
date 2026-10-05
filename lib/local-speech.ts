"use client";

/** تجربة تعرّف محلي اختيارية ومستقلة عن listenDe وإذن التعرّف السحابي. */
export const LOCAL_SPEECH_LANGUAGE = "de-DE" as const;

export type LocalSpeechAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable"
  | "unsupported"
  | "error"
  | "checking";

export type LocalSpeechError =
  | "unsupported"
  | "local-mode-unavailable"
  | "start-failed"
  | string;

type NativeAvailability = "available" | "downloadable" | "downloading" | "unavailable";
type LocalResultEvent = { results?: ArrayLike<ArrayLike<{ transcript?: string }>> };
type LocalErrorEvent = { error?: string };

type LocalRecognitionInstance = {
  lang: string;
  processLocally?: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: LocalResultEvent) => void) | null;
  onerror: ((event: LocalErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type LocalRecognitionConstructor = {
  new (): LocalRecognitionInstance;
  available?: (options: { langs: string[]; processLocally: true }) => Promise<NativeAvailability>;
  install?: (options: { langs: string[] }) => Promise<boolean>;
};

function localRecognitionConstructor(): LocalRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  // لا نستخدم webkitSpeechRecognition: وجوده لا يثبت دعمه للمعالجة المحلية.
  const nativeWindow = window as unknown as { SpeechRecognition?: LocalRecognitionConstructor };
  return nativeWindow.SpeechRecognition ?? null;
}

/** يفحص حزمة de-DE المحلية فقط؛ لا يطلب الميكروفون ولا يثبّت نموذجاً. */
export async function checkLocalGermanAvailability(): Promise<LocalSpeechAvailability> {
  const Recognition = localRecognitionConstructor();
  if (!Recognition || typeof Recognition.available !== "function") return "unsupported";
  try {
    const status = await Recognition.available({ langs: [LOCAL_SPEECH_LANGUAGE], processLocally: true });
    if (status === "available" || status === "downloadable" || status === "downloading" || status === "unavailable") {
      return status;
    }
    return "error";
  } catch {
    return "error";
  }
}

/** لا يُستدعى install إلا من زر ظاهر وبعد موافقة تنزيل صريحة غير محفوظة. */
export function installLocalGermanModel(consented: boolean): Promise<boolean> {
  if (!consented) return Promise.reject(new Error("consent-required"));
  const Recognition = localRecognitionConstructor();
  if (!Recognition || typeof Recognition.install !== "function") {
    return Promise.reject(new Error("install-unsupported"));
  }
  // استدعاء مباشر قبل أول await كي يبقى ضمن نقرة المستخدم التي وافقت على التنزيل.
  try {
    return Recognition.install({ langs: [LOCAL_SPEECH_LANGUAGE] }).then((installed) => installed === true);
  } catch {
    return Promise.reject(new Error("install-failed"));
  }
}

/** يبدأ جلسة محلية فقط: processLocally=true قبل start، بلا webkit أو fallback. */
export function startLocalGermanRecognition(
  onText: (text: string) => void,
  onError: (error: LocalSpeechError) => void,
  onEnd: () => void,
): () => void {
  const Recognition = localRecognitionConstructor();
  if (!Recognition) {
    onError("unsupported");
    onEnd();
    return () => {};
  }

  let recognition: LocalRecognitionInstance;
  try {
    recognition = new Recognition();
    if (!("processLocally" in recognition)) {
      onError("local-mode-unavailable");
      onEnd();
      return () => {};
    }
    recognition.lang = LOCAL_SPEECH_LANGUAGE;
    recognition.processLocally = true;
    if (recognition.processLocally !== true) {
      onError("local-mode-unavailable");
      onEnd();
      return () => {};
    }
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const text = String(event.results?.[0]?.[0]?.transcript ?? "").trim();
      if (text) onText(text);
    };
    recognition.onerror = (event) => {
      onError(String(event.error || "recognition-failed"));
    };
    recognition.onend = onEnd;
    // لا تُستدعى start إلا بعد تثبيت اللغة والتحقق من وضع المعالجة المحلية.
    recognition.start();
  } catch {
    onError("start-failed");
    onEnd();
    return () => {};
  }

  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    try {
      recognition.stop();
    } catch {
      /* انتهت الجلسة بالفعل؛ لا نحوّل ذلك إلى نتيجة لغوية. */
    }
  };
}
