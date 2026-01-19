"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface DetailsProps {
  userId: string;
}

export default function UserDetails({ userId }: DetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const options = ["Recreation", "Arts", "Outdoor", "Performance"];

  // Force "Only one preference" logic (Radio behavior)
  const toggleInterest = (option: string) => {
    setSelectedInterest(option);
  };

  const handleFinish = async () => {
    if (!selectedInterest) {
      alert("Please select one area of interest.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();


    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: fullName,
        Preference: selectedInterest
      })
      .eq("user_id", userId);

    setLoading(false);

    if (error) {
      console.error("Database error:", error.message);
      alert("Failed to save details. Please try again.");
      return;
    }

    // Success: Route back to login
    router.push("/login");
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <h2 style={{ fontWeight: 500, margin: 0 }}>Tell us more about yourself.</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: 16, borderRadius: 12, border: "2px solid #111", fontSize: "1rem" }}
        />
        
        {/* Interests Section */}
        <div style={{ marginTop: 10 }}>
          <p style={{ fontWeight: 600, marginBottom: 12, fontSize: "0.9rem" }}>
            I am interested in (Select one):
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 10 
          }}>
            {options.map((option) => {
              const isSelected = selectedInterest === option;
              return (
                <label
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px",
                    borderRadius: 10,
                    border: "2px solid #111",
                    cursor: "pointer",
                    background: isSelected ? "#f0f0f0" : "#fff",
                    transition: "all 0.1s ease",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    // Subtle highlight for selected item
                    boxShadow: isSelected ? "inset 0 0 0 1px #111" : "none"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleInterest(option)}
                    style={{ 
                      width: 18, 
                      height: 18, 
                      cursor: "pointer",
                      accentColor: "#111" 
                    }}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>

        <textarea
          placeholder="A little bit about you..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          style={{ 
            padding: 16, 
            borderRadius: 12, 
            border: "2px solid #111", 
            fontSize: "1rem", 
            resize: "none",
            fontFamily: "inherit",
            marginTop: 10
          }}
        />
      </div>

      <button
        onClick={handleFinish}
        disabled={loading || !selectedInterest}
        style={{
          padding: 16,
          borderRadius: 12,
          background: loading ? "#666" : "#111",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem",
          marginTop: 10,
          transition: "opacity 0.2s"
        }}
      >
        {loading ? "Saving..." : "Finish Setup"}
      </button>
    </div>
  );
}