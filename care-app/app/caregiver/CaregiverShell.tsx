"use client";

import LogoutButton from "@/app/components/LogoutButton";
import { type MonthItem } from "@/lib/utils/months";
import { designSystem } from "@/lib/ui/design-system";

export default function CaregiverShell({
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
        background: designSystem.colors.background,
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          minHeight: "calc(100vh - 28px)",
          borderRadius: designSystem.borderRadius.lg,
          overflow: "hidden",
          border: `1px solid ${designSystem.colors.border}`,
          boxShadow: designSystem.shadows.lg,
          background: designSystem.colors.surface,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: designSystem.spacing.lg,
            borderBottom: `1px solid ${designSystem.colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: designSystem.typography.fontSize.caption, fontWeight: designSystem.typography.fontWeight.extrabold, color: designSystem.colors.text.secondary }}>
              DASHBOARD
            </div>
            <div style={{ marginTop: 6, fontSize: designSystem.typography.fontSize.h3, fontWeight: designSystem.typography.fontWeight.black, color: designSystem.colors.text.primary }}>
              Caregiver
            </div>
            <div style={{ marginTop: 6, fontSize: designSystem.typography.fontSize.bodySmall, color: designSystem.colors.text.secondary, lineHeight: 1.4 }}>
              Browse and sign up for care events.
            </div>
          </div>
          <LogoutButton />
        </div>

        {/* Main Content */}
        <main style={{ padding: designSystem.spacing.lg }}>
          {/* Content card */}
          <div
            style={{
              border: `1px solid ${designSystem.colors.border}`,
              borderRadius: designSystem.borderRadius.lg,
              padding: designSystem.spacing.lg,
              minHeight: 420,
              background: designSystem.colors.surface,
              boxShadow: designSystem.shadows.md,
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
