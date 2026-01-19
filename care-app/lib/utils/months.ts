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
  // Pull all event datetimes, then distill distinct months in JS.
  // This avoids PostgREST distinct/group-by quirks and handles your spaced column name.
  const { data, error } = await supabase
    .from("Events")
    .select('"Date and Time"')
    .order('"Date and Time"', { ascending: true });

  if (error) {
    return [];
  }

  const monthSet = new Set<string>();

  for (const row of data ?? []) {
    const iso = row["Date and Time"] as string | null;
    if (!iso) continue;

    const d = new Date(iso);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    monthSet.add(`${y}-${m}`);
  }

  const months: MonthItem[] = Array.from(monthSet)
    .sort()
    .map((slug) => ({ slug, label: monthLabelFromSlug(slug) }))
    .reverse();

  return months;
}
