"use client";

import { designSystem } from "@/lib/ui/design-system";
import { getButtonStyles } from "@/lib/ui/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const baseStyles = getButtonStyles(variant, size);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.transform = "translateY(-1px)";
      if (variant === "primary") {
        e.currentTarget.style.background = designSystem.colors.primaryDark;
      } else if (variant === "secondary") {
        e.currentTarget.style.background = designSystem.colors.hover;
      }
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.transform = "translateY(0px)";
      if (variant === "primary") {
        e.currentTarget.style.background = designSystem.colors.primary;
      } else if (variant === "secondary") {
        e.currentTarget.style.background = designSystem.colors.surface;
      }
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...baseStyles,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
