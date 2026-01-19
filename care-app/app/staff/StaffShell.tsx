"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import { designSystem } from "@/lib/ui/design-system";

type MonthItem = { label: string; slug: string };

function getActiveMonth(pathname: string, fallback: string) {
  const parts = pathname.split("/").filter(Boolean); // ["staff", "2026-01", "data"]
  return parts[1] || fallback;
}

function getActiveTab(pathname: string) {
  if (pathname.includes("/data")) return "data";
  if (pathname.includes("/calendar")) return "calendar";
  return "events";
}

export default function StaffShell({
  children,
  months,
  error,
}: {
  children: React.ReactNode;
  months: MonthItem[];
  error?: string;
}) {
  const pathname = usePathname();

  const fallbackMonth = months[0]?.slug ?? "2026-01";
  const activeMonth = getActiveMonth(pathname, fallbackMonth);
  const activeTab = getActiveTab(pathname);

  const tabStyle = (isActive: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: designSystem.spacing.sm,
    padding: "10px 12px",
    borderRadius: designSystem.borderRadius.md,
    border: `1px solid ${designSystem.colors.border}`,
    textDecoration: "none",
    color: designSystem.colors.text.primary,
    background: isActive ? designSystem.colors.surface : designSystem.colors.hover,
    fontWeight: isActive ? designSystem.typography.fontWeight.bold : designSystem.typography.fontWeight.medium,
    whiteSpace: "nowrap" as const,
    transition: `background ${designSystem.transitions.fast}, transform ${designSystem.transitions.fast}`,
  });

  const monthItemStyle = (isActive: boolean) => ({
    padding: "10px 12px",
    borderRadius: designSystem.borderRadius.md,
    border: `1px solid ${designSystem.colors.border}`,
    background: isActive ? designSystem.colors.primarySoft : designSystem.colors.surface,
    textDecoration: "none",
    color: designSystem.colors.text.primary,
    fontWeight: isActive ? designSystem.typography.fontWeight.extrabold : designSystem.typography.fontWeight.semibold,
    display: "block",
    transition: `background ${designSystem.transitions.fast}, transform ${designSystem.transitions.fast}`,
  });

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
          display: "flex",
          minHeight: "calc(100vh - 28px)",
          borderRadius: designSystem.borderRadius.lg,
          overflow: "hidden",
          border: `1px solid ${designSystem.colors.border}`,
          boxShadow: designSystem.shadows.lg,
          background: designSystem.colors.surface,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            borderRight: `1px solid ${designSystem.colors.border}`,
            padding: designSystem.spacing.lg,
            background: designSystem.colors.surface,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <div style={{ fontSize: designSystem.typography.fontSize.caption, fontWeight: designSystem.typography.fontWeight.extrabold, color: designSystem.colors.text.secondary }}>
              DASHBOARD
            </div>
            <div style={{ marginTop: 6, fontSize: designSystem.typography.fontSize.h3, fontWeight: designSystem.typography.fontWeight.black, color: designSystem.colors.text.primary }}>
              Staff
            </div>
            <div style={{ marginTop: 6, fontSize: designSystem.typography.fontSize.bodySmall, color: designSystem.colors.text.secondary, lineHeight: 1.4 }}>
              Manage monthly events, volunteer coverage, and exports.
            </div>
          </div>

          {error ? (
            <div
              style={{
                padding: 10,
                borderRadius: designSystem.borderRadius.md,
                border: `1px solid ${designSystem.colors.border}`,
                background: designSystem.colors.semantic.errorBg,
                color: designSystem.colors.semantic.errorText,
                fontSize: designSystem.typography.fontSize.bodySmall,
              }}
            >
              Failed to load months: {error}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: designSystem.spacing.sm }}>
            <div style={{ fontSize: designSystem.typography.fontSize.caption, fontWeight: designSystem.typography.fontWeight.extrabold, color: designSystem.colors.text.secondary }}>
              MONTHS
            </div>

            {months.length ? (
              <div style={{ display: "grid", gap: designSystem.spacing.sm }}>
                {months.map((m) => {
                  const active = m.slug === activeMonth;
                  return (
                    <Link
                      key={m.slug}
                      href={`/staff/${m.slug}`}
                      style={monthItemStyle(active)}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                        (e.currentTarget as HTMLAnchorElement).style.background = active
                          ? designSystem.colors.primarySoft
                          : designSystem.colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
                        (e.currentTarget as HTMLAnchorElement).style.background = active
                          ? designSystem.colors.primarySoft
                          : designSystem.colors.surface;
                      }}
                    >
                      {m.label}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: designSystem.typography.fontSize.bodySmall, color: designSystem.colors.text.secondary, margin: 0 }}>
                No months available yet.
              </p>
            )}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 10 }}>
            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: designSystem.spacing.lg }}>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link
              href={`/staff/${activeMonth}`}
              style={tabStyle(activeTab === "events")}
              aria-current={activeTab === "events" ? "page" : undefined}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
              }}
            >
              Events
            </Link>

            <Link
              href={`/staff/${activeMonth}/data`}
              style={tabStyle(activeTab === "data")}
              aria-current={activeTab === "data" ? "page" : undefined}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
              }}
            >
              Data
            </Link>

            <Link
              href={`/staff/${activeMonth}/calendar`}
              style={tabStyle(activeTab === "calendar")}
              aria-current={activeTab === "calendar" ? "page" : undefined}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
              }}
            >
              Calendar
            </Link>

            <div style={{ marginLeft: "auto", fontSize: designSystem.typography.fontSize.bodySmall, color: designSystem.colors.text.secondary }}>
              Viewing: <span style={{ fontWeight: designSystem.typography.fontWeight.extrabold, color: designSystem.colors.text.primary }}>{activeMonth}</span>
            </div>
          </div>

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
