import { createSupabaseServerClient } from "@/lib/supabase/server";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { designSystem } from "@/lib/ui/design-system";

function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0)); // next month
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function StaffMonthDataPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const { startISO, endISO } = monthRange(month);

  const supabase = await createSupabaseServerClient();

  // 1) Get events for the month (using your exact column names)
  const { data: events, error: eventsErr } = await supabase
    .from("Events")
    .select(
      `
      id,
      Name,
      "No. of people",
      "Date and Time"
    `
    )
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
          Data for {month}
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

  const eventIds = (events ?? []).map((e) => e.id);

  // If there are no events, we can stop early
  if (!eventIds.length) {
    return (
      <div>
        <h3 style={{ 
          marginTop: 0,
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary
        }}>
          Data for {month}
        </h3>
        <p style={{ 
          color: designSystem.colors.text.secondary,
          fontSize: designSystem.typography.fontSize.bodySmall
        }}>
          No events found for this month.
        </p>
      </div>
    );
  }

  // 2) Get signups for these events
  const { data: signups, error: signupsErr } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .in("event_id", eventIds);

  if (signupsErr) {
    return (
      <div>
        <h3 style={{ 
          marginTop: 0,
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary
        }}>
          Data for {month}
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

  // 3) Count signups per event
  const counts = new Map<number, number>();
  for (const s of signups ?? []) {
    counts.set(s.event_id, (counts.get(s.event_id) ?? 0) + 1);
  }

  return (
    <div style={{ display: "grid", gap: designSystem.spacing.md }}>
      <div>
        <h3 style={{ 
          marginTop: 0,
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary
        }}>
          Coverage for {month}
        </h3>
        <p style={{ 
          marginTop: 6, 
          opacity: 0.8,
          fontSize: designSystem.typography.fontSize.bodySmall,
          color: designSystem.colors.text.secondary
        }}>
          Required vs signed-up volunteers per event.
        </p>
      </div>

      <div style={{ display: "grid", gap: designSystem.spacing.md }}>
        {(events ?? []).map((e) => {
          const needed = Number(e["No. of people"] ?? 0);
          const signed = counts.get(e.id) ?? 0;
          const ok = signed >= needed;

          return (
            <Card key={e.id} style={{ 
              display: "flex",
              justifyContent: "space-between",
              gap: designSystem.spacing.md,
              alignItems: "center",
            }}>
              <div style={{ display: "grid", gap: designSystem.spacing.xs }}>
                <div style={{ 
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  fontSize: designSystem.typography.fontSize.body,
                  color: designSystem.colors.text.primary
                }}>
                  {e.Name}
                </div>
                <div style={{ 
                  fontSize: designSystem.typography.fontSize.bodySmall, 
                  opacity: 0.85,
                  color: designSystem.colors.text.primary
                }}>
                  {fmtDateTime(e["Date and Time"])}
                </div>
                <div style={{ 
                  fontSize: designSystem.typography.fontSize.bodySmall, 
                  opacity: 0.85,
                  color: designSystem.colors.text.primary
                }}>
                  {signed} signed / {needed} needed
                </div>
              </div>

              <Badge variant={ok ? "success" : "warning"}>
                {ok ? "Enough" : "Not enough"}
              </Badge>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
