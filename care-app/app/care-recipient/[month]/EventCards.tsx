"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, List } from "lucide-react";
import { type MonthItem } from "@/lib/utils/months";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { designSystem } from "@/lib/ui/design-system";

type Event = {
  id: number;
  Name: string;
  "Event Type": string | null;
  "No. of people": number | null;
  "Date and Time": string;
  Duration: number | null;
};

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Calendar utility functions
function monthRange(monthSlug: string) {
  const [yStr, mStr] = monthSlug.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { start, end };
}

function daysInMonthUTC(start: Date, end: Date) {
  const days: Date[] = [];
  let d = new Date(start);
  while (d < end) {
    days.push(new Date(d));
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
  }
  return days;
}

function ymdUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekdayIndexSun0(d: Date) {
  return d.getUTCDay();
}

export default function EventCards({
  events,
  signedUpEventIds,
  signupCounts,
  eventTypes,
  month,
  monthStart,
  monthEnd,
  months,
}: {
  events: Event[];
  signedUpEventIds: number[];
  signupCounts: Record<number, number>;
  eventTypes: string[];
  month: string;
  monthStart: string;
  monthEnd: string;
  months: MonthItem[];
}) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "card">("card");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Find current month label
  const currentMonth = months.find((m) => m.slug === month);
  const currentMonthLabel = currentMonth?.label ?? month;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter events based on selected filter
  const filteredEvents = selectedFilter
    ? events.filter((e) => e["Event Type"] === selectedFilter)
    : events;

  const isSignedUp = (eventId: number) => signedUpEventIds.includes(eventId);

  // Group events by day for calendar view
  const { start, end } = monthRange(month);
  const days = daysInMonthUTC(start, end);
  const byDay = new Map<string, Event[]>();

  for (const e of filteredEvents) {
    const startDt = new Date(e["Date and Time"]);
    const key = ymdUTC(new Date(Date.UTC(startDt.getUTCFullYear(), startDt.getUTCMonth(), startDt.getUTCDate())));
    const arr = byDay.get(key) ?? [];
    arr.push(e);
    byDay.set(key, arr);
  }

  // Generate calendar grid cells
  const firstDow = weekdayIndexSun0(start);
  const cells: Array<{ date?: Date }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({});
  for (const d of days) cells.push({ date: d });
  while (cells.length % 7 !== 0) cells.push({});

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  async function handleSignup(eventId: number) {
    setLoadingEventId(eventId);
    setError(null);

    try {
      const response = await fetch(`/care-recipient/${month}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoadingEventId(null);
    }
  }

  async function handleUnsignup(eventId: number) {
    setLoadingEventId(eventId);
    setError(null);

    try {
      const response = await fetch(`/care-recipient/${month}/signup`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unsignup");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unsignup");
    } finally {
      setLoadingEventId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Header with Month Selector, Filter, and View Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Month Selector */}
          <div style={{ position: "relative" }} ref={monthDropdownRef}>
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              style={{
                padding: "10px 12px",
                borderRadius: designSystem.borderRadius.md,
                border: `1px solid ${designSystem.colors.border}`,
                background: designSystem.colors.surface,
                cursor: "pointer",
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize.bodySmall,
                color: designSystem.colors.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = designSystem.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = designSystem.colors.surface;
              }}
            >
              {currentMonthLabel}
              <span style={{ fontSize: designSystem.typography.fontSize.caption, opacity: 0.7 }}>▼</span>
            </button>

            {isMonthDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 8,
                  background: designSystem.colors.surface,
                  border: `1px solid ${designSystem.colors.border}`,
                  borderRadius: designSystem.borderRadius.md,
                  boxShadow: designSystem.shadows.lg,
                  padding: designSystem.spacing.sm,
                  minWidth: 200,
                  zIndex: 1000,
                  display: "grid",
                  gap: 4,
                }}
              >
                {months.map((m) => {
                  const isActive = m.slug === month;
                  return (
                    <Link
                      key={m.slug}
                      href={`/care-recipient/${m.slug}`}
                      onClick={() => setIsMonthDropdownOpen(false)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: designSystem.borderRadius.sm,
                        border: "none",
                        background: isActive ? designSystem.colors.primarySoft : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        fontWeight: isActive ? designSystem.typography.fontWeight.bold : designSystem.typography.fontWeight.medium,
                        fontSize: designSystem.typography.fontSize.bodySmall,
                        color: designSystem.colors.text.primary,
                        textDecoration: "none",
                        transition: "background 120ms ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = designSystem.colors.hover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {m.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filter */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: `1px solid ${designSystem.colors.border}`,
              background: designSystem.colors.surface,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: designSystem.colors.text.primary,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "background 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = designSystem.colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = designSystem.colors.surface;
            }}
          >
            Filter
            <span style={{ fontSize: 12, opacity: 0.7 }}>▼</span>
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 8,
                background: designSystem.colors.surface,
                border: `1px solid ${designSystem.colors.border}`,
                borderRadius: 12,
                boxShadow: designSystem.shadows.lg,
                padding: 8,
                minWidth: 200,
                zIndex: 1000,
                display: "grid",
                gap: 4,
              }}
            >
              <button
                onClick={() => {
                  setSelectedFilter(null);
                  setIsDropdownOpen(false);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: selectedFilter === null ? designSystem.colors.primarySoft : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: selectedFilter === null ? 700 : 500,
                  fontSize: 14,
                  color: designSystem.colors.text.primary,
                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (selectedFilter !== null) {
                    e.currentTarget.style.background = designSystem.colors.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFilter !== null) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                All Events
              </button>
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedFilter(type);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: selectedFilter === type ? designSystem.colors.primarySoft : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: selectedFilter === type ? 700 : 500,
                    fontSize: 14,
                    color: designSystem.colors.text.primary,
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFilter !== type) {
                      e.currentTarget.style.background = designSystem.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFilter !== type) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: designSystem.typography.fontSize.bodySmall, color: designSystem.colors.text.secondary }}>
            {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
          </div>

          {/* View Selector */}
          <div
            style={{
              border: `1px solid ${designSystem.colors.border}`,
              borderRadius: designSystem.borderRadius.md,
              padding: designSystem.spacing.xs,
              background: designSystem.colors.surface,
            }}
          >
            {/* Single View Selector Button */}
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const buttonWidth = rect.width;
                // If click is on left half, set calendar view; right half, set card view
                if (clickX < buttonWidth / 2) {
                  setViewMode("calendar");
                } else {
                  setViewMode("card");
                }
              }}
              style={{
                display: "flex",
                width: 48,
                height: 36,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderRadius: designSystem.borderRadius.sm,
                overflow: "hidden",
                transition: `background ${designSystem.transitions.fast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = designSystem.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Left section - Calendar icon */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: `${
                    viewMode === "calendar" ? "2px" : "1px"
                  } solid ${designSystem.colors.border}`,
                  borderBottom: `${
                    viewMode === "calendar" ? "2px" : "1px"
                  } solid ${designSystem.colors.border}`,
                  borderLeft: `${
                    viewMode === "calendar" ? "2px" : "1px"
                  } solid ${designSystem.colors.border}`,
                  borderRight: `1px solid ${designSystem.colors.border}`,
                  borderRadius: "8px 0 0 8px",
                  background: viewMode === "calendar" ? designSystem.colors.primarySoft : "transparent",
                }}
              >
                <Calendar
                  size={18}
                  style={{
                    color: viewMode === "calendar" ? designSystem.colors.text.primary : designSystem.colors.text.secondary,
                  }}
                />
              </div>
              {/* Right section - List icon */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: `${
                    viewMode === "card" ? "2px" : "1px"
                  } solid ${designSystem.colors.border}`,
                  borderBottom: `${
                    viewMode === "card" ? "2px" : "1px"
                  } solid ${designSystem.colors.border}`,
                  borderLeft: `1px solid ${designSystem.colors.border}`,
                  borderRight: `${
                    viewMode === "card" ? "2px" : "1px"
                  } solid ${designSystem.colors.border}`,
                  borderRadius: "0 8px 8px 0",
                  background: viewMode === "card" ? designSystem.colors.primarySoft : "transparent",
                }}
              >
                <List
                  size={18}
                  style={{
                    color: viewMode === "card" ? designSystem.colors.text.primary : designSystem.colors.text.secondary,
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: designSystem.spacing.md,
            borderRadius: designSystem.borderRadius.md,
            border: `1px solid ${designSystem.colors.border}`,
            background: designSystem.colors.semantic.errorBg,
            color: designSystem.colors.semantic.errorText,
            fontSize: designSystem.typography.fontSize.bodySmall,
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Calendar View or Card View */}
      {viewMode === "calendar" ? (
        <div
          style={{
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.borderRadius.lg,
            overflow: "hidden",
            background: designSystem.colors.surface,
          }}
        >
          {/* Week header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderBottom: `1px solid ${designSystem.colors.border}`,
            }}
          >
            {weekDays.map((w) => (
              <div key={w} style={{ padding: 10, fontSize: 12, opacity: 0.75, color: designSystem.colors.text.secondary }}>
                {w}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((cell, idx) => {
              const d = cell.date;
              const key = d ? ymdUTC(d) : null;
              const dayEvents = key ? byDay.get(key) ?? [] : [];

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: 110,
                    borderRight: (idx + 1) % 7 === 0 ? "none" : `1px solid ${designSystem.colors.border}`,
                    borderBottom: idx < cells.length - 7 ? `1px solid ${designSystem.colors.border}` : "none",
                    padding: 10,
                    background: d ? designSystem.colors.surface : "#fafafa",
                  }}
                >
                  {d ? (
                    <>
                      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8, color: designSystem.colors.text.secondary }}>
                        {d.getUTCDate()}
                      </div>

                      <div style={{ display: "grid", gap: 6 }}>
                        {dayEvents.slice(0, 3).map((e) => {
                          const signedUp = isSignedUp(e.id);
                          const isLoading = loadingEventId === e.id;
                          const needed = Number(e["No. of people"] ?? 0);
                          const signed = signupCounts[e.id] ?? 0;
                          const isFull = needed > 0 && signed >= needed;

                          return (
                            <div
                              key={e.id}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 10,
                                border: `1px solid ${designSystem.colors.border}`,
                                fontSize: 12,
                                background: signedUp ? "#e8fff1" : designSystem.colors.surface,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                }}
                                title={e.Name}
                              >
                                {e.Name}
                              </span>
                              {signedUp ? (
                                <button
                                  onClick={() => handleUnsignup(e.id)}
                                  disabled={isLoading}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    border: `1px solid ${designSystem.colors.border}`,
                                    background: designSystem.colors.surface,
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    fontWeight: 600,
                                    fontSize: 10,
                                    color: "#b42318",
                                    opacity: isLoading ? 0.6 : 1,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                  }}
                                  title="Unsignup"
                                >
                                  {isLoading ? "..." : "×"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSignup(e.id)}
                                  disabled={isLoading || isFull}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    border: `1px solid ${isFull ? designSystem.colors.border : designSystem.colors.primary}`,
                                    background: isFull ? designSystem.colors.surface : designSystem.colors.primary,
                                    cursor: isLoading || isFull ? "not-allowed" : "pointer",
                                    fontWeight: 600,
                                    fontSize: 10,
                                    color: isFull ? designSystem.colors.text.secondary : "#ffffff",
                                    opacity: isLoading ? 0.6 : 1,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                  }}
                                  title={isFull ? "Full" : "Sign Up"}
                                >
                                  {isLoading ? "..." : isFull ? "Full" : "+"}
                                </button>
                              )}
                            </div>
                          );
                        })}

                        {dayEvents.length > 3 && (
                          <div style={{ fontSize: 12, opacity: 0.7, color: designSystem.colors.text.secondary }}>
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Event Cards */
        <div style={{ display: "grid", gap: designSystem.spacing.md }}>
          {filteredEvents.length === 0 ? (
            <p style={{ color: designSystem.colors.text.secondary, margin: 0 }}>
              {selectedFilter ? `No events found for "${selectedFilter}"` : "No events found for this month."}
            </p>
          ) : (
            filteredEvents.map((e) => {
            const start = e["Date and Time"];
            const durationMin = Number(e.Duration ?? 0);
            const end = new Date(new Date(start).getTime() + durationMin * 60_000).toISOString();
            const needed = Number(e["No. of people"] ?? 0);
            const signed = signupCounts[e.id] ?? 0;
            const signedUp = isSignedUp(e.id);
            const isFull = needed > 0 && signed >= needed;
            const isLoading = loadingEventId === e.id;

            return (
              <Card key={e.id} hover style={{ padding: designSystem.spacing.lg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: designSystem.spacing.lg }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: designSystem.typography.fontWeight.bold, 
                      fontSize: designSystem.typography.fontSize.bodyLarge, 
                      marginBottom: 6,
                      color: designSystem.colors.text.primary
                    }}>
                      {e.Name}
                    </div>
                    {e["Event Type"] && (
                      <div style={{ 
                        opacity: 0.8, 
                        fontSize: designSystem.typography.fontSize.bodySmall, 
                        marginBottom: designSystem.spacing.sm, 
                        color: designSystem.colors.text.secondary 
                      }}>
                        {e["Event Type"]}
                      </div>
                    )}
                    <div style={{ 
                      marginTop: designSystem.spacing.sm, 
                      opacity: 0.85, 
                      fontSize: designSystem.typography.fontSize.bodySmall,
                      color: designSystem.colors.text.primary
                    }}>
                      {fmtDateTime(start)} to {fmtDateTime(end)}
                    </div>
                    <div style={{ 
                      marginTop: 6, 
                      opacity: 0.85, 
                      fontSize: designSystem.typography.fontSize.bodySmall,
                      color: designSystem.colors.text.primary
                    }}>
                      Volunteers: {signed} / {needed || "—"}
                    </div>
                    {signedUp && (
                      <div style={{ marginTop: designSystem.spacing.sm }}>
                        <Badge variant="success">✓ Signed Up</Badge>
                      </div>
                    )}
                  </div>
                  <div>
                    {signedUp ? (
                      <Button
                        onClick={() => handleUnsignup(e.id)}
                        disabled={isLoading}
                        variant="secondary"
                        size="md"
                        style={{
                          color: designSystem.colors.semantic.errorText,
                        }}
                        aria-label={`Unsignup from ${e.Name}`}
                      >
                        {isLoading ? "..." : "Unsignup"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSignup(e.id)}
                        disabled={isLoading || isFull}
                        variant={isFull ? "secondary" : "primary"}
                        size="md"
                        style={{
                          color: isFull ? designSystem.colors.text.secondary : undefined,
                        }}
                        aria-label={isFull ? `Event ${e.Name} is full` : `Sign up for ${e.Name}`}
                      >
                        {isLoading ? "..." : isFull ? "Full" : "Sign Up"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
          )}
        </div>
      )}
    </div>
  );
}
