import { designSystem } from "./design-system";

export function getButtonStyles(variant: "primary" | "secondary" | "tertiary", size: "sm" | "md" | "lg" = "md") {
  const baseStyles = {
    borderRadius: designSystem.borderRadius.md,
    fontWeight: designSystem.typography.fontWeight.semibold,
    cursor: "pointer",
    transition: `background ${designSystem.transitions.fast}, transform ${designSystem.transitions.fast}`,
    border: "none",
  };

  const sizeStyles = {
    sm: { padding: "10px 16px", fontSize: designSystem.typography.fontSize.bodySmall },
    md: { padding: "12px 24px", fontSize: designSystem.typography.fontSize.body },
    lg: { padding: "16px 32px", fontSize: designSystem.typography.fontSize.bodyLarge },
  };

  const variantStyles = {
    primary: {
      background: designSystem.colors.primary,
      color: "#ffffff",
    },
    secondary: {
      background: designSystem.colors.surface,
      color: designSystem.colors.text.primary,
      border: `1px solid ${designSystem.colors.border}`,
    },
    tertiary: {
      background: "transparent",
      color: designSystem.colors.primary,
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
}

export function getCardStyles() {
  return {
    background: designSystem.colors.surface,
    border: `1px solid ${designSystem.colors.border}`,
    borderRadius: designSystem.borderRadius.lg,
    padding: designSystem.spacing.lg,
    boxShadow: designSystem.shadows.md,
  };
}

export function getInputStyles() {
  return {
    padding: "12px 16px",
    borderRadius: designSystem.borderRadius.md,
    border: `1px solid ${designSystem.colors.border}`,
    fontSize: designSystem.typography.fontSize.body,
    background: designSystem.colors.surface,
    fontFamily: designSystem.typography.fontFamily.sans,
  };
}
