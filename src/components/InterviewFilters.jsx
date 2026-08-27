import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import { Search as SearchIcon, FilterAltOff } from "@mui/icons-material";

const InterviewFilters = ({
  data,
  search,
  setSearch,
  status,
  setStatus,
  level,
  setLevel,
  interviewer,
  setInterviewer,
}) => {
  const statuses = [...new Set(data.map((item) => item.Status).filter(Boolean))];
  const levels = [...new Set(data.map((item) => item["Interview Level"]).filter(Boolean))];
  const interviewers = [...new Set(data.map((item) => item.Interviewer).filter(Boolean))];

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setLevel("");
    setInterviewer("");
  };

  const hasActiveFilters = Boolean(search || status || level || interviewer);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search candidate, interviewer, position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "#ffffff",
              },
            }}
          />
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={4} md={2.3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
              sx={{ borderRadius: 2.5, bgcolor: "#ffffff" }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {statuses.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Level Filter */}
        <Grid item xs={12} sm={4} md={2.3}>
          <FormControl fullWidth size="small">
            <InputLabel>Interview Level</InputLabel>
            <Select
              value={level}
              label="Interview Level"
              onChange={(e) => setLevel(e.target.value)}
              sx={{ borderRadius: 2.5, bgcolor: "#ffffff" }}
            >
              <MenuItem value="">All Levels</MenuItem>
              {levels.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Interviewer Filter */}
        <Grid item xs={12} sm={4} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel>Interviewer</InputLabel>
            <Select
              value={interviewer}
              label="Interviewer"
              onChange={(e) => setInterviewer(e.target.value)}
              sx={{ borderRadius: 2.5, bgcolor: "#ffffff" }}
            >
              <MenuItem value="">All Interviewers</MenuItem>
              {interviewers.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleReset}
              startIcon={<FilterAltOff />}
              sx={{
                borderRadius: 2.5,
                borderColor: "#cbd5e1",
                color: "#64748b",
                height: 40,
                width: "100%",
              }}
            >
              Clear
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InterviewFilters;
