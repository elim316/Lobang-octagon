"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { designSystem } from "@/lib/ui/design-system";

export default function UserDetails() {
  const router = useRouter();
  
  // State to track interests
  const [interests, setInterests] = useState<string[]>([]);

  const options = [
    "Elderly Care",
    "Child Care",
    "Pet Sitting",
    "Housekeeping",
    "Medical Assistance",
    "Gardening"
  ];

  const toggleInterest = (option: string) => {
    setInterests((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleFinish = () => {
    console.log("Saving interests:", interests);
    router.push("/app");
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
            I am interested in:
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: designSystem.spacing.md 
          }}>
            {options.map((option) => {
              const isSelected = interests.includes(option);
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
                    fontWeight: designSystem.typography.fontWeight.medium
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
        size="lg"
        style={{ marginTop: designSystem.spacing.md }}
      >
        Finish Setup
      </Button>
    </div>
  );
}