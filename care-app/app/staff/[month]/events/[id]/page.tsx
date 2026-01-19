import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { designSystem } from "@/lib/ui/design-system";

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
    <div style={{ display: "grid", gap: designSystem.spacing.md }}>
      <Link 
        href={`/staff/${month}`} 
        style={{ textDecoration: "none" }}
      >
        <Button variant="tertiary" size="sm">
          ← Back
        </Button>
      </Link>

      <Card>
        <div style={{ 
          fontSize: designSystem.typography.fontSize.h2, 
          fontWeight: designSystem.typography.fontWeight.bold,
          color: designSystem.colors.text.primary,
          marginBottom: designSystem.spacing.md
        }}>
          {event.name}
        </div>

        <div style={{ 
          opacity: 0.85,
          fontSize: designSystem.typography.fontSize.body,
          color: designSystem.colors.text.secondary,
          marginBottom: designSystem.spacing.sm
        }}>
          {event.event_type ?? "Uncategorised"}
        </div>

        <div style={{ 
          fontSize: designSystem.typography.fontSize.bodySmall,
          color: designSystem.colors.text.primary,
          marginBottom: designSystem.spacing.sm
        }}>
          Time: {startText} to {endText}
        </div>

        <div style={{ 
          fontSize: designSystem.typography.fontSize.bodySmall,
          color: designSystem.colors.text.primary,
          marginBottom: designSystem.spacing.sm
        }}>
          Needed: {event.no_of_people ?? 0}
        </div>

        <div style={{ 
          marginTop: designSystem.spacing.sm, 
          opacity: 0.85,
          fontSize: designSystem.typography.fontSize.bodySmall,
          color: designSystem.colors.text.secondary
        }}>
          Next: we will show volunteers signed up and whether this event is fully covered.
        </div>
      </Card>
    </div>
  );
}
