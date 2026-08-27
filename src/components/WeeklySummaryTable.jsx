import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useMemo } from "react";

const WeeklySummaryTable = ({ data }) => {
  const weeklySummary = useMemo(() => {
    const weeksGrouped = data.reduce((acc, item) => {
      const week = item.Week || "N/A";
      if (!acc[week]) {
        acc[week] = {
          week,
          reqsCount: 0,
          totalPositions: 0,
          inScreen: 0,
          inTech: 0,
          inClient: 0,
          offered: 0,
        };
      }
      acc[week].reqsCount += 1;
      acc[week].totalPositions += item.Positions || 0;
      acc[week].inScreen += item.InScreen || 0;
      acc[week].inTech += item.InTech || 0;
      acc[week].inClient += item.InClient || 0;
      acc[week].offered += item.Offered || 0;
      return acc;
    }, {});

    return Object.values(weeksGrouped).sort((a, b) => {
      if (a.week === "N/A") return 1;
      if (b.week === "N/A") return -1;
      return a.week.localeCompare(b.week);
    });
  }, [data]);

  if (weeklySummary.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No data available for the selected range.
        </Typography>
      </Box>
    );
  }

  // Totals for bottom summary row
  const totals = weeklySummary.reduce(
    (acc, cur) => {
      acc.reqsCount += cur.reqsCount;
      acc.totalPositions += cur.totalPositions;
      acc.inScreen += cur.inScreen;
      acc.inTech += cur.inTech;
      acc.inClient += cur.inClient;
      acc.offered += cur.offered;
      return acc;
    },
    { reqsCount: 0, totalPositions: 0, inScreen: 0, inTech: 0, inClient: 0, offered: 0 }
  );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <Table sx={{ minWidth: 650 }} aria-label="weekly recruitment breakdown table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8fafc" }}>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Week Range</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>Reqs Raised</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>Total Positions</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>In Screening</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>In Tech</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>In Client</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>Offered / Closed</TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {weeklySummary.map((row) => (
            <TableRow
              key={row.week}
              sx={{
                "&:hover": { bgcolor: "#f1f5f9" },
                transition: "background-color 0.2s ease-in-out",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                {row.week === "N/A" ? (
                  <Chip label="No Date Raised" size="small" variant="outlined" sx={{ color: "#64748b", fontWeight: 600 }} />
                ) : (
                  row.week
                )}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500 }}>
                {row.reqsCount}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.totalPositions}
                  size="small"
                  sx={{ bgcolor: "#eef2ff", color: "#4f46e5", fontWeight: 700, minWidth: 32 }}
                />
              </TableCell>
              <TableCell align="center" sx={{ color: "#0284c7", fontWeight: 600 }}>
                {row.inScreen}
              </TableCell>
              <TableCell align="center" sx={{ color: "#7e22ce", fontWeight: 600 }}>
                {row.inTech}
              </TableCell>
              <TableCell align="center" sx={{ color: "#b45309", fontWeight: 600 }}>
                {row.inClient}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.offered}
                  size="small"
                  sx={{
                    bgcolor: row.offered > 0 ? "#dcfce7" : "#f1f5f9",
                    color: row.offered > 0 ? "#15803d" : "#475569",
                    fontWeight: 700,
                    minWidth: 32,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}

          {/* Grand Totals Row */}
          <TableRow sx={{ bgcolor: "#f8fafc", fontWeight: 700, borderTop: "2px solid #e2e8f0" }}>
            <TableCell sx={{ fontWeight: 800, color: "#0f172a" }}>Grand Total</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800 }}>{totals.reqsCount}</TableCell>
            <TableCell align="center">
              <Chip
                label={totals.totalPositions}
                size="small"
                sx={{ bgcolor: "#4f46e5", color: "#ffffff", fontWeight: 800, minWidth: 32 }}
              />
            </TableCell>
            <TableCell align="center" sx={{ color: "#0369a1", fontWeight: 800 }}>{totals.inScreen}</TableCell>
            <TableCell align="center" sx={{ color: "#6b21a8", fontWeight: 800 }}>{totals.inTech}</TableCell>
            <TableCell align="center" sx={{ color: "#9a3412", fontWeight: 800 }}>{totals.inClient}</TableCell>
            <TableCell align="center">
              <Chip
                label={totals.offered}
                size="small"
                sx={{
                  bgcolor: "#15803d",
                  color: "#ffffff",
                  fontWeight: 800,
                  minWidth: 32,
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeeklySummaryTable;
