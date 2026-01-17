import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EventRow = {
  id: number;
  Name: string | null;
  "No. of people": number | null;
  "Date and Time": string;
  Duration?: number | null;
};

function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { start, end, startISO: start.toISOString(), endISO: end.toISOString() };
}

function daysInMonthUTC(start: Date, end: Date) {
  const days: Date[] = [];
  let d = new Date(start);
  while (d < end) {
    days.push(new Date(d));
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
  }
  return days;
}

function ymdUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekdayIndexSun0(d: Date) {
  // UTC day-of-week: 0 Sun..6 Sat
  return d.getUTCDay();
}

export default async function StaffMonthCalendarPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const { start, end, startISO, endISO } = monthRange(month);

  const supabase = await createSupabaseServerClient();

  // 1) Events in month
  const { data: eventsRaw, error: eventsErr } = await supabase
    .from("Events")
    .select(`id, Name, "No. of people", "Date and Time"`)
    .gte("Date and Time", startISO)
    .lt("Date and Time", endISO)
    .order("Date and Time", { ascending: true });

  if (eventsErr) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Calendar for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load events: {eventsErr.message}</p>
      </div>
    );
  }

  const events = (eventsRaw ?? []) as EventRow[];
  const eventIds = events.map((e) => e.id);

  // 2) Signups for counts
  const { data: signups, error: signupsErr } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .in("event_id", eventIds.length ? eventIds : [0]);

  if (signupsErr) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Calendar for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load signups: {signupsErr.message}</p>
      </div>
    );
  }

  const counts = new Map<number, number>();
  for (const s of signups ?? []) {
    counts.set(s.event_id, (counts.get(s.event_id) ?? 0) + 1);
  }

  // Group events by day
  const byDay = new Map<string, Array<{ id: number; name: string; ok: boolean; signed: number; needed: number }>>();

  for (const e of events) {
    const startDt = new Date(e["Date and Time"]);
    const key = ymdUTC(new Date(Date.UTC(startDt.getUTCFullYear(), startDt.getUTCMonth(), startDt.getUTCDate())));
    const needed = Number(e["No. of people"] ?? 0);
    const signed = counts.get(e.id) ?? 0;
    const ok = needed > 0 ? signed >= needed : false;

    const arr = byDay.get(key) ?? [];
    arr.push({
      id: e.id,
      name: e.Name ?? "(Untitled)",
      ok,
      signed,
      needed,
    });
    byDay.set(key, arr);
  }

  const days = daysInMonthUTC(start, end);
  const firstDow = weekdayIndexSun0(start);

  // Build calendar cells with leading blanks
  const cells: Array<{ date?: Date }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({});

  for (const d of days) cells.push({ date: d });

  // Trailing blanks to fill final row
  while (cells.length % 7 !== 0) cells.push({});

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Calendar for {month}</h3>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Each event shows coverage status. Green means enough volunteers, yellow means not enough.
          </p>
        </div>

        <Link
          href={`/staff/${month}/export`}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #eee",
            textDecoration: "none",
            color: "#111",
            background: "#fff",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Download CSV
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>
        {/* Calendar */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Week header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #eee" }}>
            {weekDays.map((w) => (
              <div key={w} style={{ padding: 10, fontSize: 12, opacity: 0.75 }}>
                {w}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((cell, idx) => {
              const d = cell.date;
              const key = d ? ymdUTC(d) : null;
              const items = key ? byDay.get(key) ?? [] : [];

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: 110,
                    borderRight: (idx + 1) % 7 === 0 ? "none" : "1px solid #eee",
                    borderBottom: idx < cells.length - 7 ? "1px solid #eee" : "none",
                    padding: 10,
                    background: d ? "#fff" : "#fafafa",
                  }}
                >
                  {d ? (
                    <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>{d.getUTCDate()}</div>
                  ) : null}

                  <div style={{ display: "grid", gap: 6 }}>
                    {items.slice(0, 3).map((it) => (
                      <div
                        key={it.id}
                        title={`${it.signed} signed / ${it.needed} needed`}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 10,
                          border: "1px solid #eee",
                          fontSize: 12,
                          background: it.ok ? "#e8fff1" : "#fff8d9",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {it.name}
                      </div>
                    ))}

                    {items.length > 3 ? (
                      <div style={{ fontSize: 12, opacity: 0.7 }}>+{items.length - 3} more</div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 14,
            background: "#fff",
            height: "fit-content",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Legend</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: 6, background: "#e8fff1", border: "1px solid #eee" }} />
              <div style={{ fontSize: 13 }}>Enough volunteers</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: 6, background: "#fff8d9", border: "1px solid #eee" }} />
              <div style={{ fontSize: 13 }}>Not enough</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
