"use client";

import { designSystem } from "@/lib/ui/design-system";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      background: designSystem.colors.semantic.successBg,
      color: designSystem.colors.semantic.successText,
      borderColor: designSystem.colors.semantic.success,
    },
    error: {
      background: designSystem.colors.semantic.errorBg,
      color: designSystem.colors.semantic.errorText,
      borderColor: designSystem.colors.semantic.error,
    },
    info: {
      background: designSystem.colors.primarySoft,
      color: designSystem.colors.primary,
      borderColor: designSystem.colors.primary,
    },
  };

  return (
    <div
      style={{
        padding: designSystem.spacing.md,
        borderRadius: designSystem.borderRadius.md,
        border: `1px solid ${typeStyles[type].borderColor}`,
        background: typeStyles[type].background,
        color: typeStyles[type].color,
        fontSize: designSystem.typography.fontSize.bodySmall,
        fontWeight: designSystem.typography.fontWeight.medium,
        boxShadow: designSystem.shadows.lg,
        minWidth: "300px",
        maxWidth: "500px",
      }}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
