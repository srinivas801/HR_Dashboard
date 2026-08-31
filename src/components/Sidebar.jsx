import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import {
  Business,
  Dashboard,
  People,
  Assessment,
  Domain,
  Work,
} from "@mui/icons-material";

const getSheetIcon = (name) => {
  switch (name) {
    case "MBRDI":
      return <Domain sx={{ fontSize: 20 }} />;
    case "DTICI":
      return <Business sx={{ fontSize: 20 }} />;
    case "Persistent":
    case "Wipro":
      return <Work sx={{ fontSize: 20 }} />;
    case "Recruitment":
      return <People sx={{ fontSize: 20 }} />;
    default:
      return <Assessment sx={{ fontSize: 20 }} />;
  }
};

const getSheetLabel = (name) => {
  switch (name) {
    case "MBRDI":
      return "MBRDI Requirements";
    case "DTICI":
      return "DTICI Requirements";
    case "Persistent":
      return "Persistent Req.";
    case "Wipro":
      return "Wipro Req.";
    case "Recruitment":
      return "Candidate Tracker";
    default:
      return name;
  }
};

const Sidebar = ({
  sheetNames,
  sheetsData,
  activeSheet,
  setActiveSheet,
  drawerWidth = 280,
}) => {
  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        bgcolor: "#0f172a", // Dark mode aesthetic for sidebar
        borderRight: "1px solid #1e293b",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#0f172a",
            color: "#94a3b8",
            borderRight: "1px solid #1e293b",
            position: "fixed",
            height: "100vh",
          },
        }}
        open
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src="/assets/Microgenesis_logo.jpg"
            alt="Microgenesis logo"
            sx={{ width: 120, height: "auto", borderRadius: 2, objectFit: "contain", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
          />
          <div>
            <Typography variant="subtitle1" fontWeight={800} color="#ffffff" sx={{ lineHeight: 1.2 }}>
              Antigravity HR
            </Typography>
            <Typography variant="caption" color="#64748b" fontWeight={600}>
              Internal Analytics
            </Typography>
          </div>
        </Box>

        <Divider sx={{ borderColor: "#1e293b", my: 1 }} />

        <Box sx={{ px: 2, py: 2 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#475569"
            sx={{ letterSpacing: "0.1em", textTransform: "uppercase", pl: 1.5 }}
          >
            CLIENT SEGMENTS
          </Typography>
          
          <List sx={{ mt: 1, px: 0 }}>
            {sheetNames.map((name) => {
              const isActive = activeSheet === name;
              const count = sheetsData[name]?.length || 0;

              return (
                <ListItem key={name} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => setActiveSheet(name)}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      px: 2,
                      color: isActive ? "#ffffff" : "#94a3b8",
                      bgcolor: isActive ? "rgba(79, 70, 229, 0.15)" : "transparent",
                      borderLeft: isActive ? "3px solid #4f46e5" : "3px solid transparent",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: isActive ? "rgba(79, 70, 229, 0.2)" : "rgba(30, 41, 59, 0.5)",
                        color: isActive ? "#ffffff" : "#f8fafc",
                        "& .MuiListItemIcon-root": {
                          color: isActive ? "#818cf8" : "#e2e8f0",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? "#818cf8" : "#475569",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {getSheetIcon(name)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
                          {getSheetLabel(name)}
                        </Typography>
                      }
                    />
                    <Chip
                      label={count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: isActive ? "#4f46e5" : "#1e293b",
                        color: isActive ? "#ffffff" : "#94a3b8",
                        border: "none",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
