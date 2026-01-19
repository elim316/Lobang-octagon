import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { designSystem } from "@/lib/ui/design-system";

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
        <h3 style={{ 
          marginTop: 0,
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary
        }}>
          Calendar for {month}
        </h3>
        <p style={{ 
          color: designSystem.colors.semantic.errorText,
          fontSize: designSystem.typography.fontSize.bodySmall
        }}>
          Failed to load events: {eventsErr.message}
        </p>
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
        <h3 style={{ 
          marginTop: 0,
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary
        }}>
          Calendar for {month}
        </h3>
        <p style={{ 
          color: designSystem.colors.semantic.errorText,
          fontSize: designSystem.typography.fontSize.bodySmall
        }}>
          Failed to load signups: {signupsErr.message}
        </p>
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
    <div style={{ display: "grid", gap: designSystem.spacing.md }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: designSystem.spacing.md }}>
        <div>
          <h3 style={{ 
            marginTop: 0,
            fontSize: designSystem.typography.fontSize.h3,
            fontWeight: designSystem.typography.fontWeight.bold,
            color: designSystem.colors.text.primary
          }}>
            Calendar for {month}
          </h3>
          <p style={{ 
            marginTop: 6, 
            opacity: 0.8,
            fontSize: designSystem.typography.fontSize.bodySmall,
            color: designSystem.colors.text.secondary
          }}>
            Each event shows coverage status. Green means enough volunteers, yellow means not enough.
          </p>
        </div>

        <Link
          href={`/staff/${month}/export`}
          style={{
            textDecoration: "none",
          }}
        >
          <Button variant="secondary" size="md">
            Download CSV
          </Button>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: designSystem.spacing.lg }}>
        {/* Calendar */}
        <Card style={{ overflow: "hidden", padding: 0 }}>
          {/* Week header */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(7, 1fr)", 
            borderBottom: `1px solid ${designSystem.colors.border}` 
          }}>
            {weekDays.map((w) => (
              <div key={w} style={{ 
                padding: 10, 
                fontSize: designSystem.typography.fontSize.caption, 
                opacity: 0.75,
                color: designSystem.colors.text.secondary
              }}>
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
                    borderRight: (idx + 1) % 7 === 0 ? "none" : `1px solid ${designSystem.colors.border}`,
                    borderBottom: idx < cells.length - 7 ? `1px solid ${designSystem.colors.border}` : "none",
                    padding: 10,
                    background: d ? designSystem.colors.surface : designSystem.colors.background,
                  }}
                >
                  {d ? (
                    <div style={{ 
                      fontSize: designSystem.typography.fontSize.caption, 
                      opacity: 0.75, 
                      marginBottom: designSystem.spacing.sm,
                      color: designSystem.colors.text.secondary
                    }}>
                      {d.getUTCDate()}
                    </div>
                  ) : null}

                  <div style={{ display: "grid", gap: 6 }}>
                    {items.slice(0, 3).map((it) => (
                      <Badge
                        key={it.id}
                        variant={it.ok ? "success" : "warning"}
                        title={`${it.signed} signed / ${it.needed} needed`}
                      >
                        {it.name}
                      </Badge>
                    ))}

                    {items.length > 3 ? (
                      <div style={{ 
                        fontSize: designSystem.typography.fontSize.caption, 
                        opacity: 0.7,
                        color: designSystem.colors.text.secondary
                      }}>
                        +{items.length - 3} more
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Legend */}
        <Card style={{ height: "fit-content" }}>
          <div style={{ 
            fontWeight: designSystem.typography.fontWeight.semibold, 
            marginBottom: designSystem.spacing.md,
            fontSize: designSystem.typography.fontSize.body,
            color: designSystem.colors.text.primary
          }}>
            Legend
          </div>

          <div style={{ display: "grid", gap: designSystem.spacing.md }}>
            <div style={{ display: "flex", gap: designSystem.spacing.md, alignItems: "center" }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                borderRadius: designSystem.borderRadius.sm, 
                background: designSystem.colors.semantic.successBg, 
                border: `1px solid ${designSystem.colors.border}` 
              }} />
              <div style={{ 
                fontSize: designSystem.typography.fontSize.bodySmall,
                color: designSystem.colors.text.primary
              }}>
                Enough volunteers
              </div>
            </div>

            <div style={{ display: "flex", gap: designSystem.spacing.md, alignItems: "center" }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                borderRadius: designSystem.borderRadius.sm, 
                background: designSystem.colors.semantic.warningBg, 
                border: `1px solid ${designSystem.colors.border}` 
              }} />
              <div style={{ 
                fontSize: designSystem.typography.fontSize.bodySmall,
                color: designSystem.colors.text.primary
              }}>
                Not enough
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
