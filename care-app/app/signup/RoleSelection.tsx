"use client";

import { useState } from "react";
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
    <div style={{ display: "grid", gap: 16, textAlign: "center" }}>
      <h2 style={{ fontWeight: 500 }}>You are a _____</h2>
      {roles.map((role) => (
        <button
          key={role}
          disabled={loading}
          onClick={() => handleRoleSelect(role)}
          style={{
            padding: "24px 16px",
            borderRadius: 16,
            border: "2px solid #111",
            background: "#fff",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          {role}
        </button>
      ))}
    </div>
  );
}