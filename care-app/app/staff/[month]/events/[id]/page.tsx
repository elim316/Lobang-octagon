import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

function fmtDateTime(isoOrDate: string) {
  const d = new Date(isoOrDate);
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

export default async function StaffEventDetailPage({
  params,
}: {
  params: Promise<{ month: string; id: string }>;
}) {
  const { month, id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, event_type, no_of_people, date_and_time, duration")
    .eq("id", Number(id))
    .single();

  if (error || !event) return notFound();

  const startText = fmtDateTime(event.date_and_time);
  const endIso = addMinutes(event.date_and_time, Number(event.duration ?? 0));
  const endText = fmtDateTime(endIso);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <Link href={`/staff/${month}`} style={{ textDecoration: "none" }}>
        ← Back
      </Link>

      <div style={{ fontSize: 22, fontWeight: 700 }}>{event.name}</div>

      <div style={{ opacity: 0.85 }}>{event.event_type ?? "Uncategorised"}</div>

      <div>
        Time: {startText} to {endText}
      </div>

      <div>Needed: {event.no_of_people ?? 0}</div>

      <div style={{ marginTop: 8, opacity: 0.85 }}>
        Next: we will show volunteers signed up and whether this event is fully covered.
      </div>
    </div>
  );
}
