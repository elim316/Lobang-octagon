import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FunctionResponse = {
  success: boolean;
  error?: string;
  message?: string;
};

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

  // Use PostgreSQL function to sign up
  const { data: result, error: rpcError } = await supabase.rpc("caregiver_signup", {
    p_event_id: event_id,
  });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  const response = result as FunctionResponse;

  if (!response.success) {
    const status = response.error?.includes("Not authenticated")
      ? 401
      : response.error?.includes("does not exist") || response.error?.includes("Already signed up")
      ? 400
      : 500;
    return NextResponse.json({ error: response.error || "Failed to sign up" }, { status });
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

  // Use PostgreSQL function to unsignup
  const { data: result, error: rpcError } = await supabase.rpc("caregiver_unsignup", {
    p_event_id: event_id,
  });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  const response = result as FunctionResponse;

  if (!response.success) {
    const status = response.error?.includes("Not authenticated")
      ? 401
      : response.error?.includes("not signed up")
      ? 400
      : response.error?.includes("protected by database policies")
      ? 403
      : 500;
    return NextResponse.json({ error: response.error || "Failed to cancel signup" }, { status });
  }

  return NextResponse.json({ success: true });
}
