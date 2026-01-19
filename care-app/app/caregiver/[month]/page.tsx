import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchAvailableMonths } from "@/lib/utils/months";
import EventCards from "./EventCards";

function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { startISO: start.toISOString(), endISO: end.toISOString(), start, end };
}

type EventWithSignupInfo = {
  id: number;
  Name: string;
  "Event Type": string | null;
  "No. of people": number | null;
  "Date and Time": string;
  Duration: number | null;
  signup_count: number;
  is_signed_up: boolean;
  is_full: boolean;
};

export default async function CaregiverMonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const { start, end } = monthRange(month);

  const supabase = await createSupabaseServerClient();

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

  // Fetch events using PostgreSQL function
  const { data: eventsData, error: eventsError } = await supabase.rpc(
    "get_events_for_month_caregiver",
    {
      month_slug: month,
      user_id: user.id,
    }
  );

  if (eventsError) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>Events for {month}</h3>
        <p style={{ color: "crimson" }}>Failed to load events: {eventsError.message}</p>
      </div>
    );
  }

  const events: EventWithSignupInfo[] = (eventsData as EventWithSignupInfo[]) ?? [];

  // Extract signed up event IDs and signup counts
  const signedUpEventIds = events.filter((e) => e.is_signed_up).map((e) => e.id);
  const signupCounts: Record<number, number> = {};
  for (const e of events) {
    signupCounts[e.id] = e.signup_count;
  }

  // Extract unique event types for filter
  const eventTypes = Array.from(
    new Set(events.map((e) => e["Event Type"]).filter(Boolean))
  ) as string[];

  // Fetch available months for the month selector
  const months = await fetchAvailableMonths(supabase);

  return (
    <EventCards
      events={events}
      signedUpEventIds={signedUpEventIds}
      signupCounts={signupCounts}
      eventTypes={eventTypes}
      month={month}
      monthStart={start.toISOString()}
      monthEnd={end.toISOString()}
      months={months}
    />
  );
}
