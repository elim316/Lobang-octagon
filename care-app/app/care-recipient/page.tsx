// app/care-recipient/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CareRecipientIndex() {
  const supabase = await createSupabaseServerClient();

  // Use PostgreSQL function to get latest event month
  const { data: monthSlug, error } = await supabase.rpc("get_latest_event_month");

  // If query fails or there are no events, pick a safe fallback
  if (error || !monthSlug) {
    redirect("/care-recipient/2026-01");
  }

  redirect(`/care-recipient/${monthSlug}`);
}
