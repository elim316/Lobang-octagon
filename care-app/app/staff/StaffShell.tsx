"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MONTHS = [
  { label: "Jan 2026", slug: "2026-01" },
  { label: "Feb 2026", slug: "2026-02" },
  { label: "Mar 2026", slug: "2026-03" },
];

function isDataTab(pathname: string) {
  return pathname.includes("/data");
}

function getActiveMonth(pathname: string) {
  const parts = pathname.split("/").filter(Boolean); // ["staff", "2026-01", "data"]
  return parts[1] || "2026-01";
}

export default function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeMonth = getActiveMonth(pathname);
  const activeIsData = isDataTab(pathname);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          borderRight: "1px solid #eee",
          padding: 16,
          background: "#fafafa",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0" }}>STAFF</h2>

        <div style={{ display: "grid", gap: 8 }}>
          {MONTHS.map((m) => {
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
          })}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 16 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Link
            href={`/staff/${activeMonth}`}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid #eee",
              textDecoration: "none",
              color: "#111",
              background: activeIsData ? "#f7f7f7" : "#fff",
              fontWeight: activeIsData ? 400 : 600,
            }}
          >
            Events
          </Link>

          <Link
            href={`/staff/${activeMonth}/data`}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid #eee",
              textDecoration: "none",
              color: "#111",
              background: activeIsData ? "#fff" : "#f7f7f7",
              fontWeight: activeIsData ? 600 : 400,
            }}
          >
            Data
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
