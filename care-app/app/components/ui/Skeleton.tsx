import { designSystem } from "@/lib/ui/design-system";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export default function Skeleton({ 
  width = "100%", 
  height = "20px", 
  borderRadius = designSystem.borderRadius.md 
}: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: designSystem.colors.border,
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}
