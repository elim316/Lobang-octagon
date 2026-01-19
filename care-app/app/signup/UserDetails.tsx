"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div style={{ display: "grid", gap: 20 }}>
      <h2 style={{ fontWeight: 500, margin: 0 }}>Tell us more about yourself.</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Full Name"
          style={{ padding: 16, borderRadius: 12, border: "2px solid #111", fontSize: "1rem" }}
        />
        
        {/* Interests Section */}
        <div style={{ marginTop: 10 }}>
          <p style={{ fontWeight: 600, marginBottom: 12, fontSize: "0.9rem" }}>
            I am interested in:
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 10 
          }}>
            {options.map((option) => {
              const isSelected = interests.includes(option);
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
                    fontWeight: 500
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
        style={{
          padding: 16,
          borderRadius: 12,
          background: "#111",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "1rem",
          marginTop: 10
        }}
      >
        Finish Setup
      </button>
    </div>
  );
}