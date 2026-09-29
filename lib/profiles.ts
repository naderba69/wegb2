// إدارة الملفات العائلية — كل متعلّم ملفّه المستقل (خطة/دفتر/بطاقات/أوسمة بلا تداخل)
export interface ProfileInfo {
  id: string;
  name: string;
  emoji: string;
  created: string;
}

type ProfilesData = { active: string; list: ProfileInfo[] };

const PROFILES_KEY = "weg-b2-profiles";
const LEGACY_KEY = "weg-b2-progress";
const EVT = "weg-progress-changed";

export function progressKey(id: string): string {
  return `weg-b2-progress-${id}`;
}

function write(data: ProfilesData) {
  try {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(data));
  } catch {
    /* التخزين ممتلئ أو محظور */
  }
}

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}

export function initProfiles(): ProfilesData {
  if (typeof window === "undefined")
    return { active: "p1", list: [{ id: "p1", name: "الأساسي", emoji: "🎓", created: "" }] };
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const d = JSON.parse(raw) as ProfilesData;
      if (d && d.list && d.list.length) return d;
    }
  } catch {
    /* بيانات تالفة — تُعاد التهيئة */
  }
  // ترحيل: بيانات «weg-b2-progress» القديمة تصبح الملف الأساسي
  const data: ProfilesData = {
    active: "p1",
    list: [{ id: "p1", name: "الأساسي", emoji: "🎓", created: new Date().toISOString().slice(0, 10) }],
  };
  try {
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      window.localStorage.setItem(progressKey("p1"), legacy);
      window.localStorage.removeItem(LEGACY_KEY);
    }
  } catch {
    /* */
  }
  write(data);
  return data;
}

export function listProfiles(): ProfileInfo[] {
  return initProfiles().list;
}

export function activeProfile(): ProfileInfo {
  const d = initProfiles();
  return d.list.find((p) => p.id === d.active) ?? d.list[0];
}

export function progressKeyActive(): string {
  return progressKey(activeProfile().id);
}

export function switchProfile(id: string) {
  const d = initProfiles();
  if (!d.list.some((p) => p.id === id)) return;
  d.active = id;
  write(d);
  emit();
}

export function addProfile(name: string, emoji: string) {
  const d = initProfiles();
  const id = `p${Date.now().toString(36)}`;
  d.list.push({
    id,
    name: name.trim() || `ملف ${d.list.length + 1}`,
    emoji: emoji || "📘",
    created: new Date().toISOString().slice(0, 10),
  });
  d.active = id;
  write(d);
  emit();
}

export function renameProfile(id: string, name: string, emoji: string) {
  const d = initProfiles();
  const p = d.list.find((x) => x.id === id);
  if (!p) return;
  if (name.trim()) p.name = name.trim();
  if (emoji) p.emoji = emoji;
  write(d);
  emit();
}

export function removeProfile(id: string) {
  const d = initProfiles();
  if (d.list.length <= 1) return; // يبقى ملف واحد دائماً
  const i = d.list.findIndex((p) => p.id === id);
  if (i < 0) return;
  d.list.splice(i, 1);
  try {
    window.localStorage.removeItem(progressKey(id));
  } catch {
    /* */
  }
  if (d.active === id) d.active = d.list[0].id;
  write(d);
  emit();
}
