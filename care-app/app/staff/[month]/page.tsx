import { createSupabaseServerClient } from "@/lib/supabase/server";

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
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load events: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h3 style={{ marginTop: 0 }}>Events for {month}</h3>

      <div style={{ display: "grid", gap: 10 }}>
        {(events ?? []).map((e) => {
          const start = e["Date and Time"];
          const durationMin = Number(e.Duration ?? 0);
          const end = new Date(new Date(start).getTime() + durationMin * 60_000).toISOString();

          return (
            <div
              key={e.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 16,
                padding: 16,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>{e.Name}</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>{e["Event Type"] ?? ""}</div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>
                {fmtDateTime(start)} to {fmtDateTime(end)}
              </div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>
                Needed: {Number(e["No. of people"] ?? 0)}
              </div>
            </div>
          );
        })}
      </div>

      {!events?.length ? <p>No events found for this month.</p> : null}
    </div>
  );
}
