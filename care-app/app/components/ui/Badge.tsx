import { designSystem } from "@/lib/ui/design-system";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const variantStyles = {
    success: {
      background: designSystem.colors.semantic.successBg,
      color: designSystem.colors.semantic.successText,
    },
    warning: {
      background: designSystem.colors.semantic.warningBg,
      color: designSystem.colors.semantic.warningText,
    },
    error: {
      background: designSystem.colors.semantic.errorBg,
      color: designSystem.colors.semantic.errorText,
    },
    info: {
      background: designSystem.colors.primarySoft,
      color: designSystem.colors.primary,
    },
    default: {
      background: designSystem.colors.hover,
      color: designSystem.colors.text.secondary,
    },
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: designSystem.borderRadius.full,
        fontSize: designSystem.typography.fontSize.caption,
        fontWeight: designSystem.typography.fontWeight.semibold,
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
