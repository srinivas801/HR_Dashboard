import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
      light: "#6366f1",
      dark: "#4338ca",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5e9",
      light: "#38bdf8",
      dark: "#0284c7",
    },
    background: {
      default: "#eef2ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
    status: {
      scheduled: { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
      completed: { bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" },
      selected: { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
      rejected: { bg: "#ffe4e6", text: "#be123c", border: "#fecdd3" },
      pending: { bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 18px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(79, 70, 229, 0.12)",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        },
        columnHeaders: {
          backgroundColor: "#f8fafc",
          color: "#475569",
          fontWeight: 700,
          borderBottom: "1px solid #e2e8f0",
        },
        footerContainer: {
          borderTop: "1px solid #e2e8f0",
        },
      },
    },
  },
});

export default theme;
