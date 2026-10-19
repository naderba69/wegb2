"use client";
// 🛟 R303/ب1: حدّ أخطاء لكل محطة — عطل مكوّن واحد لا يُسقط التطبيق كله
import { Component, type ReactNode } from "react";

interface Zustand {
  fehler: boolean;
}

export class FehlerGrenze extends Component<{ children: ReactNode }, Zustand> {
  state: Zustand = { fehler: false };

  static getDerivedStateFromError(): Zustand {
    return { fehler: true };
  }

  componentDidCatch(): void {
    // بلا أي إرسال خارجي: الخطأ يبقى على جهاز المتعلم (خصوصية المشروع)
  }

  render() {
    if (this.state.fehler) {
      return (
        <div className="card" data-testid="fehlergrenze-karte" style={{ padding: "1rem 1.1rem", display: "grid", gap: "0.6rem", background: "var(--color-paper2)" }}>
          <strong style={{ fontSize: "1.05rem" }}>⚠️ حدث عطل في هذه المحطة</strong>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
            بقية التطبيق وتقدّمك سليمة — العطل داخل هذه الشاشة فقط. جرّب إعادة فتحها، وإن تكرّر العطل أعد تحميل التطبيق.
          </p>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" data-testid="fehlergrenze-retry" style={{ minHeight: "46px" }} onClick={() => this.setState({ fehler: false })}>
              🔄 أعد فتح المحطة
            </button>
            <button type="button" className="btn btn-ghost" style={{ minHeight: "46px" }} onClick={() => window.location.reload()}>
              ↻ إعادة تحميل التطبيق
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
