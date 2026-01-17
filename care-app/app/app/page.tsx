import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppEntryPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/app");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/unauthorized");

  switch (profile.role) {
    case "staff":
      redirect("/staff");
    case "volunteer":
      redirect("/volunteer");
    case "caregiver":
      redirect("/caregiver");
    case "care_recipient":
      redirect("/recipient");
    default:
      redirect("/unauthorized");
  }
}
