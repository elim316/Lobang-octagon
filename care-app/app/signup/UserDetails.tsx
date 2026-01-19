"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { designSystem } from "@/lib/ui/design-system";
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
    <div style={{ display: "grid", gap: designSystem.spacing.xl }}>
      <h2 style={{ 
        fontWeight: designSystem.typography.fontWeight.medium, 
        margin: 0,
        fontSize: designSystem.typography.fontSize.h2,
        color: designSystem.colors.text.primary
      }}>
        Tell us more about yourself.
      </h2>

      <div style={{ display: "grid", gap: designSystem.spacing.md }}>
        <Input
          id="fullName"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          aria-label="Full Name"
        />
        
        {/* Interests Section */}
        <div style={{ marginTop: designSystem.spacing.md }}>
          <p style={{ 
            fontWeight: designSystem.typography.fontWeight.semibold, 
            marginBottom: designSystem.spacing.md, 
            fontSize: designSystem.typography.fontSize.bodySmall,
            color: designSystem.colors.text.primary
          }}>
            I am interested in (Select one):
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: designSystem.spacing.md 
          }}>
            {options.map((option) => {
              const isSelected = selectedInterest === option;
              return (
                <label
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: designSystem.spacing.md,
                    padding: designSystem.spacing.md,
                    borderRadius: designSystem.borderRadius.md,
                    border: `2px solid ${designSystem.colors.text.primary}`,
                    cursor: "pointer",
                    background: isSelected ? designSystem.colors.hover : designSystem.colors.surface,
                    transition: `all ${designSystem.transitions.fast}`,
                    fontSize: designSystem.typography.fontSize.bodySmall,
                    fontWeight: designSystem.typography.fontWeight.medium,
                    boxShadow: isSelected ? "inset 0 0 0 1px #111" : "none"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleInterest(option)}
                    aria-label={option}
                    style={{ 
                      width: 18, 
                      height: 18, 
                      cursor: "pointer",
                      accentColor: designSystem.colors.primary
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
            padding: designSystem.spacing.lg, 
            borderRadius: designSystem.borderRadius.md, 
            border: `2px solid ${designSystem.colors.text.primary}`, 
            fontSize: designSystem.typography.fontSize.body, 
            resize: "none",
            fontFamily: designSystem.typography.fontFamily.sans,
            marginTop: designSystem.spacing.md
          }}
          aria-label="About you"
        />
      </div>

      <Button
        onClick={handleFinish}
        disabled={loading || !selectedInterest}
        size="lg"
        style={{ marginTop: designSystem.spacing.md }}
      >
        {loading ? "Saving..." : "Finish Setup"}
      </Button>
    </div>
  );
}