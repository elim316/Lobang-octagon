// app/volunteer/VolunteerShellServer.tsx
import VolunteerShell from "./VolunteerShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchAvailableMonths, type MonthItem } from "@/lib/utils/months";

export default async function VolunteerShellServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const months = await fetchAvailableMonths(supabase);

  // Check for errors by checking if months is empty and we might have had an error
  // Since fetchAvailableMonths returns empty array on error, we'll pass empty array
  // The VolunteerShell can handle empty months gracefully
  return <VolunteerShell months={months}>{children}</VolunteerShell>;
}
