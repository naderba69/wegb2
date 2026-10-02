"use client";
// واجهة الملفات العائلية — تبديل سريع + إدارة كاملة
import { useState } from "react";
import {
  listProfiles,
  activeProfile,
  addProfile,
  renameProfile,
  removeProfile,
  switchProfile,
} from "@/lib/profiles";

const EMOJIS = ["🎓", "🌟", "🦉", "🦊", "🐼", "🐧", "🚀", "⚽"];

/** مبدّل صغير لشريط الترويسة */
export function ProfilWahl() {
  const list = listProfiles();
  const act = activeProfile();
  return (
    <select
      className="chip"
      style={{ cursor: "pointer", background: "var(--color-card)", padding: "0.15rem 0.4rem" }}
      value={act.id}
      title="تبديل الملف العائلي"
      onChange={(e) => {
        switchProfile(e.target.value);
        window.location.reload();
      }}
    >
      {list.map((p) => (
        <option key={p.id} value={p.id}>
          {p.emoji} {p.name}
        </option>
      ))}
    </select>
  );
}

/** قسم الإدارة الكامل في الإعدادات */
export function ProfilVerwaltung() {
  const [, setTick] = useState(0);
  const bump = () => setTick((t) => t + 1);
  const list = listProfiles();
  const act = activeProfile();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[1]);

  return (
    <section className="card" style={{ padding: "1.3rem" }}>
      <h2 style={{ fontWeight: 800, marginBottom: "0.3rem" }}>👨‍👩‍👧‍👦 الملفات العائلية</h2>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>
        لكل متعلّم ملفّه المستقل: خطة يومية ودفتر أخطاء وبطاقات وأوسمة خاصة — بلا تداخل. بدّل الملف من أعلى
        الصفحة الرئيسية.
      </p>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {list.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
              background: "var(--color-paper2)",
              borderRadius: "0.6rem",
              padding: "0.5rem 0.7rem",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>{p.emoji}</span>
            <input
              className="field"
              style={{ flex: 1, minWidth: "8rem" }}
              value={p.name}
              onChange={(e) => {
                renameProfile(p.id, e.target.value, p.emoji);
                bump();
              }}
            />
            {p.id === act.id ? (
              <span className="chip" style={{ color: "var(--color-a1)", borderColor: "var(--color-a1)" }}>
                نشط ✓
              </span>
            ) : (
              <button
                className="chip"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  switchProfile(p.id);
                  window.location.reload();
                }}
              >
                تفعيل
              </button>
            )}
            <button
              className="chip"
              style={{ cursor: "pointer" }}
              disabled={list.length <= 1}
              title={list.length <= 1 ? "يبقى ملف واحد على الأقل" : "حذف الملف"}
              onClick={() => {
                if (confirm(`حذف ملف «${p.name}» وكل تقدّمه؟ لا يمكن التراجع.`)) {
                  removeProfile(p.id);
                  bump();
                }
              }}
            >
              🗑
            </button>
            <span className="rtl-num" style={{ fontSize: "0.72rem", color: "var(--color-ink2)" }}>
              {p.created}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.7rem", flexWrap: "wrap" }}>
        <input
          className="field"
          style={{ flex: 1, minWidth: "9rem" }}
          placeholder="اسم المتعلّم الجديد…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="field" style={{ width: "4.5rem" }} value={emoji} onChange={(e) => setEmoji(e.target.value)}>
          {EMOJIS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (name.trim()) {
              addProfile(name, emoji);
              setName("");
              bump();
              window.location.reload();
            }
          }}
        >
          ➕ أضف ملفاً
        </button>
      </div>
    </section>
  );
}
