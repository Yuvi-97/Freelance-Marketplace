import { scale, verticalScale } from "@/utils/styling";

export const colors = {
  // Primary Theme Colors
  black:"black",
  white: "#FFFFFF",
  primary: "#3B82F6", // Light blue (main accent)
  primaryLight: "#93C5FD", // Lighter blue (hover states)
  primaryDark: "#1D4ED8", // Deeper blue (pressed/active)

  // Base Text Colors
  text: "#1E293B", // Slate-800 (dark text)
  textLight: "#64748B", // Slate-500 (secondary text)

  // Backgrounds
  background: "#ffffff", // Main background
  backgroundLight: "#f8fafc", // Light background sections

  // Accent Colors
  success: "#16a34a", // Green (e.g., for successful payments)
  error: "#ef4444", // Red (for errors)
  warning: "#facc15", // Yellow (alerts, limited offers)

  // Neutrals (for borders, cards, muted text)
  neutral100: "#f1f5f9",
  neutral200: "#e2e8f0",
  neutral300: "#cbd5e1",
  neutral500: "#64748B",
  neutral800: "#1e293b",
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
};
