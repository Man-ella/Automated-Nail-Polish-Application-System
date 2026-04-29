// Centralized recharts colors so charts stay on-palette across pages.
export const chartColors = {
  primary: "#5C2A37",   // burgundy
  rose: "#D88FA0",      // rose
  pink: "#E8BFC6",      // pink
  pinkSoft: "#F3D5DA",  // blush
  mauve: "#A85B6E",     // mauve
  cream: "#E8DCC4",
  ink: "#2A0E1A",       // plum
  grid: "#EFD6DC",
  axis: "#7A4A55",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#E11D48",
};

export const tooltipStyle: React.CSSProperties = {
  backgroundColor: "white",
  border: `1px solid ${chartColors.grid}`,
  borderRadius: 8,
  fontSize: 12,
  padding: "6px 10px",
  boxShadow: "0 2px 8px rgba(92, 42, 55, 0.08)",
};
