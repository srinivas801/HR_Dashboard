import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import { Paper, Typography, Grid, Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";

const STATUS_COLORS = {
  Scheduled: "#0284c7",
  Completed: "#7e22ce",
  Selected: "#15803d",
  Rejected: "#be123c",
  Pending: "#b45309",
};

const LEVEL_COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          bgcolor: "#0f172a",
          color: "#fff",
          borderRadius: 2,
          border: "none",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {label || payload[0].name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          Count: <b>{payload[0].value}</b>
        </Typography>
      </Paper>
    );
  }

  return null;
};

const InterviewChart = ({ data }) => {
  const [tabValue, setTabValue] = useState(0);

  // Status Distribution Data
  const statusCounts = data.reduce((acc, item) => {
    const status = item.Status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  // Level Distribution Data
  const levelCounts = data.reduce((acc, item) => {
    const level = item["Interview Level"] || "Other";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const levelData = Object.entries(levelCounts).map(([level, count]) => ({
    name: level,
    value: count,
  }));

  // Interviewer Distribution Data
  const interviewerCounts = data.reduce((acc, item) => {
    const interviewer = item.Interviewer || "Unassigned";
    acc[interviewer] = (acc[interviewer] || 0) + 1;
    return acc;
  }, {});

  const interviewerData = Object.entries(interviewerCounts).map(
    ([interviewer, count]) => ({
      interviewer,
      count,
    })
  );

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Primary Status Chart */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <div>
              <Typography variant="h6">Interviews by Status</Typography>
              <Typography variant="caption" color="text.secondary">
                Breakdown of candidates across interview stages
              </Typography>
            </div>
          </Box>

          <Box sx={{ flexGrow: 1, minHeight: 300, width: "100%", pt: 2 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#4f46e5"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Analytics Tabs (Levels & Interviewer Workload) */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(e, val) => setTabValue(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ minHeight: 40 }}
            >
              <Tab label="Interview Levels" sx={{ fontWeight: 600, py: 1 }} />
              <Tab label="Interviewer Load" sx={{ fontWeight: 600, py: 1 }} />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box sx={{ flexGrow: 1, minHeight: 280, display: "flex", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {levelData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={LEVEL_COLORS[index % LEVEL_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ flexGrow: 1, minHeight: 280, pt: 1 }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  layout="vertical"
                  data={interviewerData}
                  margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    dataKey="interviewer"
                    type="category"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InterviewChart;
