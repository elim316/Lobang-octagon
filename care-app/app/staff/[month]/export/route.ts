import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MONTH_SLUG_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

function csvEscape(v: unknown) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ month: string }> }
) {
  const { month } = await ctx.params;
  if (!MONTH_SLUG_RE.test(month)) {
    return NextResponse.json({ error: "Invalid month parameter" }, { status: 400 });
  }
  const { startISO, endISO } = monthRange(month);

  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: events, error: eventsErr } = await supabase
    .from("Events")
    .select(`id, Name, "No. of people", "Date and Time"`)
    .gte("Date and Time", startISO)
    .lt("Date and Time", endISO)
    .order("Date and Time", { ascending: true });

  if (eventsErr) {
    return NextResponse.json({ error: eventsErr.message }, { status: 500 });
  }

  const eventIds = (events ?? []).map((e) => e.id);

  const { data: signups, error: signupsErr } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .in("event_id", eventIds.length ? eventIds : [0]);

  if (signupsErr) {
    return NextResponse.json({ error: signupsErr.message }, { status: 500 });
  }

  const counts = new Map<number, number>();
  for (const s of signups ?? []) {
    counts.set(s.event_id, (counts.get(s.event_id) ?? 0) + 1);
  }

  const rows: string[] = [];
  rows.push(["event_id", "name", "date_time", "needed", "signed_up", "status"].join(","));

  for (const e of events ?? []) {
    const needed = Number(e["No. of people"] ?? 0);
    const signed = counts.get(e.id) ?? 0;
    const status = needed > 0 && signed >= needed ? "Enough" : "Not enough";

    rows.push(
      [
        csvEscape(e.id),
        csvEscape(e.Name),
        csvEscape(e["Date and Time"]),
        csvEscape(needed),
        csvEscape(signed),
        csvEscape(status),
      ].join(",")
    );
  }

  const csv = rows.join("\n");
  const filename = `events_${month}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
