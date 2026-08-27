import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Grid,
  Paper,
} from "@mui/material";

import {
  Person,
  Work,
  CalendarToday,
  Badge,
  Description,
  FormatListNumbered,
  Groups,
  PlaylistAddCheck,
  VpnKey,
  Assignment,
} from "@mui/icons-material";

const getStatusStyle = (status) => {
  const str = String(status || "").toLowerCase();
  if (str.includes("offer")) {
    return { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" };
  } else if (str.includes("reject")) {
    return { bg: "#ffe4e6", color: "#be123c", border: "#fecdd3" };
  } else if (str.includes("complete")) {
    return { bg: "#f3e8ff", color: "#7e22ce", border: "#e9d5ff" };
  } else if (str.includes("pending")) {
    return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
  } else if (str.includes("scheduled")) {
    return { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" };
  } else {
    return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
  }
};

const CandidateModal = ({ candidate, open, onClose }) => {
  if (!candidate) return null;

  const isRequirement = !candidate.Interviewee || candidate.Interviewee === "N/A";
  const statusStyle = getStatusStyle(candidate.Status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#4f46e5",
              color: "#fff",
              width: 50,
              height: 50,
              fontWeight: 700,
              fontSize: "1.2rem",
            }}
          >
            {isRequirement
              ? (candidate.Requirement?.charAt(0) || "R")
              : (candidate.Interviewee?.charAt(0) || "C")}
          </Avatar>
          <div>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              {isRequirement ? candidate.Requirement : candidate.Interviewee}
            </Typography>
            {isRequirement ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 0.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  MRF ID: <Box component="span" sx={{ color: "#4f46e5", fontWeight: 700 }}>{candidate.MrfId || "N/A"}</Box>
                </Typography>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Primary Skills: <Box component="span" sx={{ color: "#334155", fontWeight: 700 }}>{candidate.PrimarySkills || "N/A"}</Box>
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                ID #{candidate.ID} • Candidate Overview
              </Typography>
            )}
          </div>
        </Box>
        <Chip
          label={candidate.Status}
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 700,
            border: `1px solid ${statusStyle.border}`,
            maxWidth: 150,
          }}
        />
      </DialogTitle>

      <Divider sx={{ my: 1 }} />

      <DialogContent>
        {isRequirement ? (
          // Job Requirement Details Layout (Follows handwritten wireframe layout)
          <Grid container spacing={2}>
            {/* Row 1: Hiring Type and Date */}
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Badge sx={{ color: "#4f46e5", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Hiring Type
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Type || "N/A"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <CalendarToday sx={{ color: "#f59e0b", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Date
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Date || "N/A"}
                </Typography>
              </Paper>
            </Grid>

            {/* Row 2: Billable and Position */}
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Badge sx={{ color: "#10b981", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Billable Status
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Billable || "N/A"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <FormatListNumbered sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Positions
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Positions ?? 0}
                </Typography>
              </Paper>
            </Grid>

            {/* Row 3: In Screening, In Tech, In Client */}
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Groups sx={{ color: "#0284c7", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    In Screening
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.InScreen ?? 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <PlaylistAddCheck sx={{ color: "#7e22ce", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    In Tech
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.InTech ?? 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Work sx={{ color: "#0f766e", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    In Client
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.InClient ?? 0}
                </Typography>
              </Paper>
            </Grid>

            {/* Row 4: Remarks */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Description sx={{ color: "#64748b", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Remarks
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "#334155" }}>
                  "{candidate.Remarks || "No remarks recorded."}"
                </Typography>
              </Paper>
            </Grid>

            {/* Row 5: To Do */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Assignment sx={{ color: "#e11d48", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    to do
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#334155", fontWeight: 500 }}>
                  {candidate.Todo && candidate.Todo !== "-" ? candidate.Todo : "No action items recorded."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          // Candidate / Recruitment Details Layout
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Work sx={{ color: "#4f46e5", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Target Position
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Position}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Badge sx={{ color: "#0ea5e9", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Interview Round / Level
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate["Interview Level"]}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Person sx={{ color: "#10b981", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Assigned Interviewer
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Interviewer}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <CalendarToday sx={{ color: "#f59e0b", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Date & Time
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {candidate.Date} {candidate.Time ? `at ${candidate.Time}` : ""}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Description sx={{ color: "#64748b", fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary">
                    Interviewer Remarks & Feedback
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "#334155" }}>
                  "{candidate.Remarks || "No feedback recorded yet."}"
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" disableElevation>
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidateModal;
