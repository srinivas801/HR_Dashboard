import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";

import {
  Group,
  EventNote,
  CheckCircleOutline,
  EmojiEvents,
  CancelOutlined,
  Work,
  HourglassEmpty,
} from "@mui/icons-material";

const DashboardCards = ({ data, isRequirementsSheet = false }) => {
  const total = data.length;

  // Candidate Tracker Metrics
  const scheduled = data.filter(
    (item) => item.Status?.toLowerCase() === "scheduled"
  ).length;

  const completed = data.filter(
    (item) => item.Status?.toLowerCase() === "completed"
  ).length;

  const selected = data.filter(
    (item) => item.Status?.toLowerCase() === "selected"
  ).length;

  const rejected = data.filter(
    (item) => item.Status?.toLowerCase() === "rejected"
  ).length;

  // Requirements Sheet Metrics
  const totalPositions = data.length;
  const totalJoined = data.reduce((sum, item) => sum + (item.Joined || 0), 0);
  const totalOffered = data.reduce((sum, item) => sum + (item.Offered || 0), 0);

  // Hiring Type Position Counts (number of rows/entries)
  const newPositions = data.filter((item) => {
    const type = String(item.Type || "").toLowerCase();
    return type.includes("new");
  }).length;

  const replacementPositions = data.filter((item) => {
    const type = String(item.Type || "").toLowerCase();
    return type.includes("replace");
  }).length;

  // Billability Position Counts (number of rows/entries)
  const billablePositions = data.filter((item) => {
    const billable = String(item.Billable || "").toLowerCase();
    return billable === "yes" || (billable.includes("billable") && !billable.includes("non"));
  }).length;

  const nonBillablePositions = data.filter((item) => {
    const billable = String(item.Billable || "").toLowerCase();
    if (billable === "no" || billable.includes("non") || billable.includes("no ")) {
      return true;
    }
    return billable !== "yes" && !billable.includes("yes") && !(billable.includes("billable") && !billable.includes("non"));
  }).length;

  // Status Position Counts (number of rows/entries)
  const activeStatusPositions = data.filter((item) => {
    const status = String(item.Status || "").toLowerCase();
    return status.includes("active");
  }).length;

  const onHoldStatusPositions = data.filter((item) => {
    const status = String(item.Status || "").toLowerCase();
    return status.includes("hold");
  }).length;

  const selectedStatusPositions = data.filter((item) => {
    const status = String(item.Status || "").toLowerCase();
    return status.includes("select");
  }).length;

  const closedStatusPositions = data.filter((item) => {
    const status = String(item.Status || "").toLowerCase();
    return status.includes("close");
  }).length;

  const getPercentage = (count) => {
    if (!total) return "0%";
    return `${Math.round((count / total) * 100)}%`;
  };

  const getRequirementsPercentage = (count) => {
    if (!totalPositions) return "0%";
    const percentage = Math.round((count / totalPositions) * 100);
    return `${Math.min(100, percentage)}%`;
  };

  if (isRequirementsSheet) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main "Total Positions" card spanning 8 columns on desktop */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxShadow: "0 4px 20px -2px rgba(148, 163, 184, 0.06)",
            }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#eef2ff", color: "#4f46e5", width: 44, height: 44, borderRadius: 2 }}>
                  <Work sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                    Overall Demand
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#0f172a">
                    Total position - {totalPositions}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Left Column: Hiring Type Grid */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    height: "100%",
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color="#475569" sx={{ mb: 1.5 }}>
                    Hiring Type
                  </Typography>
                  <Box sx={{ display: "flex", border: "1px solid #e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                    <Box sx={{ flex: 1, p: 1.5, textAlign: "center", borderRight: "1px solid #e2e8f0", bgcolor: "#fff" }}>
                      <Typography variant="caption" fontWeight={700} color="#0ea5e9" sx={{ display: "block", mb: 0.5 }}>
                        New
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {newPositions}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5, textAlign: "center", bgcolor: "#fff" }}>
                      <Typography variant="caption" fontWeight={700} color="#6366f1" sx={{ display: "block", mb: 0.5 }}>
                        Replacement
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {replacementPositions}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column: Billability Grid */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    height: "100%",
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color="#475569" sx={{ mb: 1.5 }}>
                    Billability Status
                  </Typography>
                  <Box sx={{ display: "flex", border: "1px solid #e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                    <Box sx={{ flex: 1, p: 1.5, textAlign: "center", borderRight: "1px solid #e2e8f0", bgcolor: "#fff" }}>
                      <Typography variant="caption" fontWeight={700} color="#10b981" sx={{ display: "block", mb: 0.5 }}>
                        Billable
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {billablePositions}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5, textAlign: "center", bgcolor: "#fff" }}>
                      <Typography variant="caption" fontWeight={700} color="#ef4444" sx={{ display: "block", mb: 0.5 }}>
                        non Billable
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {nonBillablePositions}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Bottom Row: Status Row */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color="#475569" sx={{ mb: 1.5 }}>
                    Status
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#fff",
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: "85px", p: 1.5, textAlign: "center", borderRight: "1px solid #e2e8f0" }}>
                      <Typography variant="caption" fontWeight={700} color="#3b82f6" sx={{ display: "block", mb: 0.5 }}>
                        Active
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="#0f172a">
                        {activeStatusPositions}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: "85px", p: 1.5, textAlign: "center", borderRight: "1px solid #e2e8f0" }}>
                      <Typography variant="caption" fontWeight={700} color="#f59e0b" sx={{ display: "block", mb: 0.5 }}>
                        on hold
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="#0f172a">
                        {onHoldStatusPositions}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: "85px", p: 1.5, textAlign: "center", borderRight: "1px solid #e2e8f0" }}>
                      <Typography variant="caption" fontWeight={700} color="#10b981" sx={{ display: "block", mb: 0.5 }}>
                        Selected
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="#0f172a">
                        {selectedStatusPositions}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: "85px", p: 1.5, textAlign: "center" }}>
                      <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ display: "block", mb: 0.5 }}>
                        Closed
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="#0f172a">
                        {closedStatusPositions}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right side: Offers & Joined cards */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
            {/* Offers Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                boxShadow: "0 4px 20px -2px rgba(148, 163, 184, 0.06)",
                borderLeft: "6px solid #10b981",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                    Offers
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Candidates Offered
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#dcfce7", color: "#10b981", width: 44, height: 44, borderRadius: 2 }}>
                  <EmojiEvents sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight={900} color="#10b981" sx={{ mt: 2 }}>
                {totalOffered}
              </Typography>
            </Paper>

            {/* Joined Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                boxShadow: "0 4px 20px -2px rgba(148, 163, 184, 0.06)",
                borderLeft: "6px solid #6366f1",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                    Joined
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Candidates Onboarded
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#eef2ff", color: "#6366f1", width: 44, height: 44, borderRadius: 2 }}>
                  <Group sx={{ fontSize: 24 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight={900} color="#6366f1" sx={{ mt: 2 }}>
                {totalJoined}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    );
  }

  const cardConfig = isRequirementsSheet
    ? [
        {
          title: "Total Positions Needed",
          count: totalPositions,
          subtext: `${total} requirements raised`,
          icon: <Work sx={{ color: "#4f46e5", fontSize: 26 }} />,
          bgColor: "#eef2ff",
          accentColor: "#4f46e5",
        },
        {
          title: "In Screening Stage",
          count: totalInScreen,
          subtext: `${getRequirementsPercentage(totalInScreen)} of positions`,
          icon: <Group sx={{ color: "#0284c7", fontSize: 26 }} />,
          bgColor: "#e0f2fe",
          accentColor: "#0284c7",
        },
        {
          title: "In Tech Round",
          count: totalInTech,
          subtext: `${getRequirementsPercentage(totalInTech)} of positions`,
          icon: <CheckCircleOutline sx={{ color: "#7e22ce", fontSize: 26 }} />,
          bgColor: "#f3e8ff",
          accentColor: "#7e22ce",
        },
        {
          title: "In Client Round",
          count: totalInClient,
          subtext: `${getRequirementsPercentage(totalInClient)} of positions`,
          icon: <HourglassEmpty sx={{ color: "#b45309", fontSize: 26 }} />,
          bgColor: "#fef3c7",
          accentColor: "#b45309",
        },
        {
          title: "Joined",
          count: totalJoined,
          subtext: `${getRequirementsPercentage(totalJoined)} of positions`,
          icon: <Group sx={{ color: "#0f766e", fontSize: 26 }} />,
          bgColor: "#d8f5f1",
          accentColor: "#0f766e",
        },
        {
          title: "Offers",
          count: totalOffered,
          subtext: `${getRequirementsPercentage(totalOffered)} fill rate`,
          icon: <EmojiEvents sx={{ color: "#15803d", fontSize: 26 }} />,
          bgColor: "#dcfce7",
          accentColor: "#15803d",
        },
      ]
    : [
        {
          title: "Total Interviews",
          count: total,
          subtext: "100% of dataset",
          icon: <Group sx={{ color: "#4f46e5", fontSize: 26 }} />,
          bgColor: "#eef2ff",
          accentColor: "#4f46e5",
        },
        {
          title: "Scheduled",
          count: scheduled,
          subtext: `${getPercentage(scheduled)} of total`,
          icon: <EventNote sx={{ color: "#0284c7", fontSize: 26 }} />,
          bgColor: "#e0f2fe",
          accentColor: "#0284c7",
        },
        {
          title: "Completed",
          count: completed,
          subtext: `${getPercentage(completed)} of total`,
          icon: <CheckCircleOutline sx={{ color: "#7e22ce", fontSize: 26 }} />,
          bgColor: "#f3e8ff",
          accentColor: "#7e22ce",
        },
        {
          title: "Selected",
          count: selected,
          subtext: `${getPercentage(selected)} conversion`,
          icon: <EmojiEvents sx={{ color: "#15803d", fontSize: 26 }} />,
          bgColor: "#dcfce7",
          accentColor: "#15803d",
        },
        {
          title: "Rejected",
          count: rejected,
          subtext: `${getPercentage(rejected)} rate`,
          icon: <CancelOutlined sx={{ color: "#be123c", fontSize: 26 }} />,
          bgColor: "#ffe4e6",
          accentColor: "#be123c",
        },
      ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {cardConfig.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
          <Card
            sx={{
              height: "100%",
              position: "relative",
              overflow: "hidden",
              borderTop: `4px solid ${card.accentColor}`,
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {card.title}
                </Typography>

                <Avatar
                  sx={{
                    bgcolor: card.bgColor,
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                  }}
                >
                  {card.icon}
                </Avatar>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {card.count}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
