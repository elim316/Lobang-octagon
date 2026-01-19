"use client";

import LogoutButton from "@/app/components/LogoutButton";
import { type MonthItem } from "@/lib/utils/months";

const ui = {
  pageBg: "#f6f7fb",
  panelBg: "#ffffff",
  border: "#e7e9ee",
  text: "#111827",
  muted: "#6b7280",
  primary: "#1677ff",
  primarySoft: "#eaf2ff",
  hover: "#f3f4f6",
  shadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  radius: 16,
};

export default function VolunteerShell({
  children,
  months,
}: {
  children: React.ReactNode;
  months: MonthItem[];
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: ui.pageBg,
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          minHeight: "calc(100vh - 28px)",
          borderRadius: ui.radius,
          overflow: "hidden",
          border: `1px solid ${ui.border}`,
          boxShadow: ui.shadow,
          background: ui.panelBg,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 16,
            borderBottom: `1px solid ${ui.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: ui.muted }}>
              DASHBOARD
            </div>
            <div style={{ marginTop: 6, fontSize: 20, fontWeight: 900, color: ui.text }}>
              Volunteer
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: ui.muted, lineHeight: 1.4 }}>
              Browse and sign up for care events.
            </div>
          </div>
          <LogoutButton />
        </div>

        {/* Main Content */}
        <main style={{ padding: 16 }}>
          {/* Content card */}
          <div
            style={{
              border: `1px solid ${ui.border}`,
              borderRadius: ui.radius,
              padding: 16,
              minHeight: 420,
              background: ui.panelBg,
              boxShadow: "0 6px 18px rgba(17, 24, 39, 0.05)",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
