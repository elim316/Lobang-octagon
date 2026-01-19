"use client";

import { designSystem } from "@/lib/ui/design-system";
import { getCardStyles } from "@/lib/ui/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}

export default function Card({ children, style, hover = false }: CardProps) {
  const baseStyles = getCardStyles();

  return (
    <div
      style={{
        ...baseStyles,
        transition: hover ? `box-shadow ${designSystem.transitions.fast}, transform ${designSystem.transitions.fast}` : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = designSystem.shadows.hover;
        e.currentTarget.style.transform = "translateY(-2px)";
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = designSystem.shadows.md;
        e.currentTarget.style.transform = "translateY(0px)";
      } : undefined}
    >
      {children}
    </div>
  );
}
