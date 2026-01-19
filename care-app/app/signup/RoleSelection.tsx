"use client";

export default function RoleSelection({ onRoleSelected }: { onRoleSelected: () => void }) {
  const roles = ["Caregiver", "Care Recipient", "Volunteer"];

  return (
    <div style={{ display: "grid", gap: 16, textAlign: "center" }}>
      <h2 style={{ fontWeight: 500, marginBottom: 8 }}>You are a _____</h2>
      
      {roles.map((role) => (
        <button
          key={role}
          onClick={onRoleSelected}
          style={{
            padding: "24px 16px",
            borderRadius: 16,
            border: "2px solid #111", // Matches the bold lines in sketch
            background: "#fff",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform 0.1s active",
          }}
        >
          {role}
        </button>
      ))}
    </div>
  );
}