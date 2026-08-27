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
import { useState, useMemo } from "react";

const STAGE_COLORS = {
  Screening: "#0284c7", // Sky blue
  Tech: "#7e22ce",      // Purple
  Client: "#b45309",    // Amber
  Offered: "#15803d",   // Green
};

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
        <Box sx={{ mt: 1 }}>
          {payload.map((item, idx) => (
            <Typography
              key={idx}
              variant="caption"
              display="block"
              sx={{ color: item.color || "#ffffff" }}
            >
              {item.name}: <b>{item.value}</b>
            </Typography>
          ))}
        </Box>
      </Paper>
    );
  }

  return null;
};

const RequirementsFunnelChart = ({ data }) => {
  const [tabValue, setTabValue] = useState(0);

  // Group metrics by week for the weekly bar chart
  const weeklyData = useMemo(() => {
    const weeksGrouped = data.reduce((acc, item) => {
      const week = item.Week || "N/A";
      if (!acc[week]) {
        acc[week] = {
          week,
          Positions: 0,
          Screening: 0,
          Tech: 0,
          Client: 0,
          Offered: 0,
        };
      }
      acc[week].Positions += item.Positions || 0;
      acc[week].Screening += item.InScreen || 0;
      acc[week].Tech += item.InTech || 0;
      acc[week].Client += item.InClient || 0;
      acc[week].Offered += item.Offered || 0;
      return acc;
    }, {});

    return Object.values(weeksGrouped).sort((a, b) => {
      if (a.week === "N/A") return 1;
      if (b.week === "N/A") return -1;
      return a.week.localeCompare(b.week);
    });
  }, [data]);

  // Aggregate total counts across all filtered data for the pie chart
  const pieData = useMemo(() => {
    const totals = data.reduce(
      (acc, item) => {
        acc.Screening += item.InScreen || 0;
        acc.Tech += item.InTech || 0;
        acc.Client += item.InClient || 0;
        acc.Offered += item.Offered || 0;
        return acc;
      },
      { Screening: 0, Tech: 0, Client: 0, Offered: 0 }
    );

    return [
      { name: "Screening", value: totals.Screening },
      { name: "Tech Round", value: totals.Tech },
      { name: "Client Round", value: totals.Client },
      { name: "Offered/Closed", value: totals.Offered },
    ].filter(item => item.value > 0); // Only display stages with data
  }, [data]);

  const hasPieData = pieData.length > 0;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Primary Weekly Funnel Chart */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          <div>
            <Typography variant="h6">Weekly Recruitment Funnel</Typography>
            <Typography variant="caption" color="text.secondary">
              Comparison of job positions vs. candidate counts at different interview stages
            </Typography>
          </div>

          <Box sx={{ flexGrow: 1, minHeight: 300, width: "100%", pt: 3 }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={weeklyData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar name="Positions" dataKey="Positions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar name="Screening" dataKey="Screening" fill={STAGE_COLORS.Screening} radius={[4, 4, 0, 0]} />
                <Bar name="Tech Round" dataKey="Tech" fill={STAGE_COLORS.Tech} radius={[4, 4, 0, 0]} />
                <Bar name="Client Round" dataKey="Client" fill={STAGE_COLORS.Client} radius={[4, 4, 0, 0]} />
                <Bar name="Offered" dataKey="Offered" fill={STAGE_COLORS.Offered} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Analytics Tabs (Funnel Breakdown vs Segment Details) */}
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
              <Tab label="Funnel Stage Distribution" sx={{ fontWeight: 600, py: 1 }} />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box sx={{ flexGrow: 1, minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              {hasPieData ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => {
                        const nameKey = entry.name.replace(" Round", "").replace("/Closed", "");
                        const fill = STAGE_COLORS[nameKey] || "#4f46e5";
                        return <Cell key={`cell-${index}`} fill={fill} />;
                      })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No active candidate counts available for stage distribution.
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RequirementsFunnelChart;
