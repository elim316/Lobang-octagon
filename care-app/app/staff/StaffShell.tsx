"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";

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

const ui = {
  pageBg: "#f6f7fb",
  panelBg: "#ffffff",
  sidebarBg: "#ffffff",
  border: "#e7e9ee",
  text: "#111827",
  muted: "#6b7280",
  primary: "#1677ff",
  primarySoft: "#eaf2ff",
  hover: "#f3f4f6",
  shadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  radius: 16,
};

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
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${ui.border}`,
    textDecoration: "none",
    color: ui.text,
    background: isActive ? ui.panelBg : ui.hover,
    fontWeight: isActive ? 700 : 500,
    whiteSpace: "nowrap" as const,
    transition: "background 120ms ease, transform 120ms ease",
  });

  const monthItemStyle = (isActive: boolean) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${ui.border}`,
    background: isActive ? ui.primarySoft : ui.panelBg,
    textDecoration: "none",
    color: ui.text,
    fontWeight: isActive ? 800 : 600,
    display: "block",
    transition: "background 120ms ease, transform 120ms ease",
  });

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
          display: "flex",
          minHeight: "calc(100vh - 28px)",
          borderRadius: ui.radius,
          overflow: "hidden",
          border: `1px solid ${ui.border}`,
          boxShadow: ui.shadow,
          background: ui.panelBg,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            borderRight: `1px solid ${ui.border}`,
            padding: 16,
            background: ui.sidebarBg,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: ui.muted }}>
              DASHBOARD
            </div>
            <div style={{ marginTop: 6, fontSize: 20, fontWeight: 900, color: ui.text }}>
              Staff
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: ui.muted, lineHeight: 1.4 }}>
              Manage monthly events, volunteer coverage, and exports.
            </div>
          </div>

          {error ? (
            <div
              style={{
                padding: 10,
                borderRadius: 12,
                border: `1px solid ${ui.border}`,
                background: "#fff5f5",
                color: "#b42318",
                fontSize: 13,
              }}
            >
              Failed to load months: {error}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: ui.muted }}>
              MONTHS
            </div>

            {months.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                {months.map((m) => {
                  const active = m.slug === activeMonth;
                  return (
                    <Link
                      key={m.slug}
                      href={`/staff/${m.slug}`}
                      style={monthItemStyle(active)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                        (e.currentTarget as HTMLAnchorElement).style.background = active
                          ? ui.primarySoft
                          : ui.hover;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
                        (e.currentTarget as HTMLAnchorElement).style.background = active
                          ? ui.primarySoft
                          : ui.panelBg;
                      }}
                    >
                      {m.label}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: ui.muted, margin: 0 }}>
                No months available yet.
              </p>
            )}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 10 }}>
            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: 16 }}>
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
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
              }}
            >
              Calendar
            </Link>

            <div style={{ marginLeft: "auto", fontSize: 13, color: ui.muted }}>
              Viewing: <span style={{ fontWeight: 800, color: ui.text }}>{activeMonth}</span>
            </div>
          </div>

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
