import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function monthRange(monthSlug: string) {
  // monthSlug like "2026-01"
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0)); // next month
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

function fmtDateTime(isoOrDate: string) {
  const d = new Date(isoOrDate);
  // simple local display
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMinutes(dateIso: string, minutes: number) {
  const d = new Date(dateIso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
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
    .from("events")
    .select("id, name, event_type, no_of_people, date_and_time, duration")
    .gte("date_and_time", startISO)
    .lt("date_and_time", endISO)
    .order("date_and_time", { ascending: true });

  if (error) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load events: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Events for {month}</h3>

      {!events || events.length === 0 ? (
        <p>No events found for this month.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {events.map((e) => {
            const startText = fmtDateTime(e.date_and_time);
            const endIso = addMinutes(e.date_and_time, Number(e.duration ?? 0));
            const endText = fmtDateTime(endIso);

            return (
              <Link
                key={e.id}
                href={`/staff/${month}/events/${e.id}`}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "#111",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div style={{ fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  {e.event_type ?? "Uncategorised"}
                </div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  {startText} to {endText}
                </div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  Needed: {e.no_of_people ?? 0}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
