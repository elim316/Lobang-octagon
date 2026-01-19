"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { designSystem } from "@/lib/ui/design-system";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface RoleProps {
  userId: string;
  onRoleSelected: () => void;
}

export default function RoleSelection({ userId, onRoleSelected }: RoleProps) {
  const [loading, setLoading] = useState(false);
  const roles = ["Caregiver", "Care_Recipient", "Volunteer"];

  const handleRoleSelect = async (role: string) => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    // Use .upsert to ensure the row exists and updates the role
    const { error } = await supabase
      .from("profiles")
      .upsert({ 
        user_id: userId, 
        role: role.toLowerCase() 
      });

    setLoading(false);

    if (error) {
      alert("Error saving role: " + error.message);
      return;
    }

    onRoleSelected();
  };

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
          disabled={loading}
          onClick={() => handleRoleSelect(role)}
          variant="secondary"
          size="lg"
          style={{
            border: `2px solid ${designSystem.colors.text.primary}`,
            fontSize: designSystem.typography.fontSize.bodyLarge,
            opacity: loading ? 0.6 : 1
          }}
          aria-label={`Select ${role} role`}
        >
          {role.replace("_", " ")}
        </Button>
      ))}
    </div>
  );
}