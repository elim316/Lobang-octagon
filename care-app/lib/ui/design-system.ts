export const designSystem = {
  colors: {
    primary: "#1677ff",
    primarySoft: "#eaf2ff",
    primaryDark: "#0050b3",
    accent: "#ff6b35", // Optional warm accent
    background: "#fafafa",
    surface: "#ffffff",
    border: "#e7e9ee",
    hover: "#f3f4f6",
    text: {
      primary: "#111827",
      secondary: "#6b7280",
      muted: "#9ca3af",
    },
    semantic: {
      success: "#10b981",
      successBg: "#e8fff1",
      successText: "#065f46",
      warning: "#f59e0b",
      warningBg: "#fff8d9",
      warningText: "#92400e",
      error: "#ef4444",
      errorBg: "#fff5f5",
      errorText: "#b42318",
      info: "#3b82f6",
    },
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'var(--font-geist-mono), monospace',
    },
    fontSize: {
      display: "48px",
      h1: "32px",
      h2: "24px",
      h3: "20px",
      bodyLarge: "18px",
      body: "16px",
      bodySmall: "14px",
      caption: "12px",
    },
    lineHeight: {
      display: "56px",
      h1: "40px",
      h2: "32px",
      h3: "28px",
      bodyLarge: "28px",
      body: "24px",
      bodySmall: "20px",
      caption: "16px",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    "4xl": "64px",
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "999px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 30px rgba(17, 24, 39, 0.06)",
    hover: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    fast: "120ms ease",
    normal: "200ms ease",
  },
  breakpoints: {
    mobile: "640px",
    tablet: "1024px",
  },
};

// Helper function to get responsive styles
export function getResponsiveStyles(mobile: React.CSSProperties, desktop?: React.CSSProperties) {
  return {
    ...mobile,
    "@media (min-width: 1024px)": desktop || mobile,
  };
}
