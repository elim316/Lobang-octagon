"use client";

import { designSystem } from "@/lib/ui/design-system";
import { getInputStyles } from "@/lib/ui/utils";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const baseStyles = getInputStyles();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.currentTarget.style.borderColor = designSystem.colors.primary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${designSystem.colors.primarySoft}`;
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    e.currentTarget.style.borderColor = designSystem.colors.border;
    e.currentTarget.style.boxShadow = "none";
    onBlur?.(e);
  };

  return (
    <div style={{ display: "grid", gap: designSystem.spacing.sm }}>
      {label && (
        <label
          style={{
            fontSize: designSystem.typography.fontSize.bodySmall,
            fontWeight: designSystem.typography.fontWeight.semibold,
            color: designSystem.colors.text.primary,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          ...baseStyles,
          ...style,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${props.id || "input"}-error` : undefined}
      />
      {error && (
        <p
          id={props.id ? `${props.id}-error` : "input-error"}
          style={{
            fontSize: designSystem.typography.fontSize.bodySmall,
            color: designSystem.colors.semantic.error,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
