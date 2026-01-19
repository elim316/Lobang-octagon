import { SupabaseClient } from "@supabase/supabase-js";

export type MonthItem = { label: string; slug: string };

export function monthLabelFromSlug(slug: string): string {
  const [y, m] = slug.split("-");
  const d = new Date(Date.UTC(Number(y), Number(m) - 1, 1));
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export async function fetchAvailableMonths(
  supabase: SupabaseClient
): Promise<MonthItem[]> {
  // Use PostgreSQL function to get available months
  const { data, error } = await supabase.rpc("get_available_months");

  if (error) {
    return [];
  }

  // Function returns array of { slug, label } objects
  return (data as MonthItem[]) ?? [];
}
