"use client";

import Button from "@/app/components/ui/Button";
import { designSystem } from "@/lib/ui/design-system";

export default function RoleSelection({ onRoleSelected }: { onRoleSelected: () => void }) {
  const roles = ["Caregiver", "Care Recipient", "Volunteer"];

  return (
    <div style={{ display: "grid", gap: designSystem.spacing.lg, textAlign: "center" }}>
      <h2 style={{ 
        fontWeight: designSystem.typography.fontWeight.medium, 
        marginBottom: designSystem.spacing.sm,
        fontSize: designSystem.typography.fontSize.h2,
        color: designSystem.colors.text.primary
      }}>
        You are a _____
      </h2>
      
      {roles.map((role) => (
        <Button
          key={role}
          onClick={onRoleSelected}
          variant="secondary"
          size="lg"
          style={{
            border: `2px solid ${designSystem.colors.text.primary}`,
            fontSize: designSystem.typography.fontSize.bodyLarge,
          }}
          aria-label={`Select ${role} role`}
        >
          {role}
        </Button>
      ))}
    </div>
  );
}