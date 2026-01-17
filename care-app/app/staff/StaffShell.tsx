"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid #eee",
    textDecoration: "none",
    color: "#111",
    background: isActive ? "#fff" : "#f7f7f7",
    fontWeight: isActive ? 600 : 400,
    whiteSpace: "nowrap" as const,
    flex: "0 0 auto",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          borderRight: "1px solid #eee",
          padding: 16,
          background: "#fafafa",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0" }}>STAFF</h2>

        {error ? (
          <p style={{ color: "crimson", fontSize: 13 }}>
            Failed to load months: {error}
          </p>
        ) : null}

        <div style={{ display: "grid", gap: 8 }}>
          {months.length ? (
            months.map((m) => {
              const active = m.slug === activeMonth;
              return (
                <Link
                  key={m.slug}
                  href={`/staff/${m.slug}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #eee",
                    background: active ? "#fff" : "#f7f7f7",
                    textDecoration: "none",
                    color: "#111",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {m.label}
                </Link>
              );
            })
          ) : (
            <p style={{ fontSize: 13, opacity: 0.75 }}>
              No months available yet.
            </p>
          )}
        </div>
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "nowrap",
            alignItems: "center",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Link href={`/staff/${activeMonth}`} style={tabStyle(activeTab === "events")}>
            Events
          </Link>

          <Link
            href={`/staff/${activeMonth}/data`}
            style={tabStyle(activeTab === "data")}
          >
            Data
          </Link>

          <Link
            href={`/staff/${activeMonth}/calendar`}
            style={tabStyle(activeTab === "calendar")}
          >
            Calendar
          </Link>
        </div>

        {/* Content */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 16,
            minHeight: 400,
            background: "#fff",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
