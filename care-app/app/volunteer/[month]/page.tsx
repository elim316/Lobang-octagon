import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchAvailableMonths } from "@/lib/utils/months";
import EventCards from "./EventCards";

function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

export default async function VolunteerMonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const { startISO, endISO } = monthRange(month);

  const supabase = await createSupabaseServerClient();

  // Fetch events for the month
  const { data: events, error: eventsError } = await supabase
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

  if (eventsError) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load events: {eventsError.message}</p>
      </div>
    );
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Not authenticated</p>
      </div>
    );
  }

  // Fetch user's signups for these events
  const eventIds = (events ?? []).map((e) => e.id);
  const { data: signups, error: signupsError } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .eq("volunteer_user_id", user.id)
    .in("event_id", eventIds.length ? eventIds : [0]);

  if (signupsError) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load signups: {signupsError.message}</p>
      </div>
    );
  }

  // Create set of event IDs user has signed up for
  const signedUpEventIds = new Set((signups ?? []).map((s) => s.event_id));

  // Fetch signup counts for all events (to show current signups vs needed)
  const { data: allSignups, error: allSignupsError } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .in("event_id", eventIds.length ? eventIds : [0]);

  if (allSignupsError) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load signup counts: {allSignupsError.message}</p>
      </div>
    );
  }

  // Count signups per event
  const signupCounts = new Map<number, number>();
  for (const s of allSignups ?? []) {
    signupCounts.set(s.event_id, (signupCounts.get(s.event_id) ?? 0) + 1);
  }

  // Extract unique event types for filter
  const eventTypes = Array.from(
    new Set((events ?? []).map((e) => e["Event Type"]).filter(Boolean))
  ) as string[];

  const { start, end } = (() => {
    const [yStr, mStr] = month.split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
    return { start, end };
  })();

  // Fetch available months for the month selector
  const months = await fetchAvailableMonths(supabase);

  return (
    <EventCards
      events={events ?? []}
      signedUpEventIds={Array.from(signedUpEventIds)}
      signupCounts={Object.fromEntries(signupCounts)}
      eventTypes={eventTypes}
      month={month}
      monthStart={start.toISOString()}
      monthEnd={end.toISOString()}
      months={months}
    />
  );
}
