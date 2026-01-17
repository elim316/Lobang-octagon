// app/staff/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function StaffIndex() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Events")
    .select('"Date and Time"')
    .order('"Date and Time"', { ascending: false })
    .limit(1);

  // If query fails or there are no events, pick a safe fallback
  if (error || !data?.length || !data[0]["Date and Time"]) {
    redirect("/staff/2026-01");
  }

  const d = new Date(data[0]["Date and Time"]);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const slug = `${y}-${m}`;

  redirect(`/staff/${slug}`);
}
