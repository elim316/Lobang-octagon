import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ month: string }> }
) {
  const { month } = await ctx.params;
  const supabase = await createSupabaseServerClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { event_id } = body;

  if (!event_id || typeof event_id !== "number") {
    return NextResponse.json({ error: "event_id is required" }, { status: 400 });
  }

  // Check if already signed up
  const { data: existing } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .eq("event_id", event_id)
    .eq("volunteer_user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already signed up for this event" }, { status: 400 });
  }

  // Insert signup
  const { error: insertError } = await supabase
    .from("event_volunteers")
    .insert({ event_id, volunteer_user_id: user.id });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ month: string }> }
) {
  const { month } = await ctx.params;
  const supabase = await createSupabaseServerClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { event_id } = body;

  if (!event_id || typeof event_id !== "number") {
    return NextResponse.json({ error: "event_id is required" }, { status: 400 });
  }

  // Delete signup
  const { error: deleteError } = await supabase
    .from("event_volunteers")
    .delete()
    .eq("event_id", event_id)
    .eq("volunteer_user_id", user.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
