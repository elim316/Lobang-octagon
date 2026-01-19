import { designSystem } from "@/lib/ui/design-system";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: `${designSystem.spacing["4xl"]} ${designSystem.spacing.xl}`,
      }}
    >
      <h3
        style={{
          fontSize: designSystem.typography.fontSize.h3,
          fontWeight: designSystem.typography.fontWeight.semibold,
          color: designSystem.colors.text.primary,
          marginBottom: designSystem.spacing.md,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: designSystem.typography.fontSize.body,
            color: designSystem.colors.text.secondary,
            marginBottom: action ? designSystem.spacing.xl : 0,
          }}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
