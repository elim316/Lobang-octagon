import { createSupabaseServerClient } from "@/lib/supabase/server";
import Card from "@/app/components/ui/Card";
import { designSystem } from "@/lib/ui/design-system";

function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
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

export default async function StaffMonthEventsPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const { startISO, endISO } = monthRange(month);

  const supabase = await createSupabaseServerClient();

  const { data: events, error } = await supabase
    .from("Events")
    .select(
      `
      id,
      Name,
      "Event Type",
      "No. of people",
      "Date and Time",
      Duration
    `
    )
    .gte("Date and Time", startISO)
    .lt("Date and Time", endISO)
    .order("Date and Time", { ascending: true });

  if (error) {
    return (
      <div>
        <h3 style={{ 
          marginTop: 0,
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary
        }}>
          Events for {month}
        </h3>
        <p style={{ 
          color: designSystem.colors.semantic.errorText,
          fontSize: designSystem.typography.fontSize.bodySmall
        }}>
          Failed to load events: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: designSystem.spacing.md }}>
      <h3 style={{ 
        marginTop: 0,
        fontSize: designSystem.typography.fontSize.h3,
        fontWeight: designSystem.typography.fontWeight.bold,
        color: designSystem.colors.text.primary
      }}>
        Events for {month}
      </h3>

      <div style={{ display: "grid", gap: designSystem.spacing.md }}>
        {(events ?? []).map((e) => {
          const start = e["Date and Time"];
          const durationMin = Number(e.Duration ?? 0);
          const end = new Date(new Date(start).getTime() + durationMin * 60_000).toISOString();

          return (
            <Card key={e.id} hover>
              <div style={{ 
                fontWeight: designSystem.typography.fontWeight.bold, 
                fontSize: designSystem.typography.fontSize.body,
                color: designSystem.colors.text.primary
              }}>
                {e.Name}
              </div>
              <div style={{ 
                opacity: 0.8, 
                marginTop: 6,
                fontSize: designSystem.typography.fontSize.bodySmall,
                color: designSystem.colors.text.secondary
              }}>
                {e["Event Type"] ?? ""}
              </div>
              <div style={{ 
                marginTop: 6, 
                opacity: 0.85,
                fontSize: designSystem.typography.fontSize.bodySmall,
                color: designSystem.colors.text.primary
              }}>
                {fmtDateTime(start)} to {fmtDateTime(end)}
              </div>
              <div style={{ 
                marginTop: 6, 
                opacity: 0.85,
                fontSize: designSystem.typography.fontSize.bodySmall,
                color: designSystem.colors.text.primary
              }}>
                Needed: {Number(e["No. of people"] ?? 0)}
              </div>
            </Card>
          );
        })}
      </div>

      {!events?.length ? (
        <p style={{ 
          color: designSystem.colors.text.secondary,
          fontSize: designSystem.typography.fontSize.bodySmall
        }}>
          No events found for this month.
        </p>
      ) : null}
    </div>
  );
}
