import microgenesisLogo from "../assets/Microgenesis_logo.jpg";
import { Box, Typography, Container, Paper, FormControl, InputLabel, Select, MenuItem, Chip, Button } from "@mui/material";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { parseExcelBuffer } from "../services/excelService";

const Header = ({ totalRecords, sheetOptions, activeSheet, onSelectSheet, onCustomDataLoaded }) => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const isMsalConfigured = !!import.meta.env.VITE_AZURE_CLIENT_ID;

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const parsedData = parseExcelBuffer(buffer);
        if (onCustomDataLoaded) {
          onCustomDataLoaded(parsedData);
        }
      } catch (err) {
        console.error("Failed to parse uploaded Excel file:", err);
        alert("Error parsing file. Please make sure you selected a valid MIS.xlsx workbook.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        borderRadius: 0,
        mb: 4,
        p: 3,
        boxShadow: "none",
        border: "1px solid #e2e8f0",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box
              component="img"
              src={microgenesisLogo}
              alt="Microgenesis logo"
              sx={{ width: 120, height: "auto", borderRadius: 2, objectFit: "contain" }}
            />
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                Dashboard
              </Typography>
              <Chip
                label={`${totalRecords.toLocaleString()} records`}
                size="small"
                sx={{ mt: 1, bgcolor: "#eef2ff", color: "#2563eb", fontWeight: 700 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                px: 2,
                height: 38,
                bgcolor: "#4f46e5",
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "#4338ca",
                }
              }}
            >
              Upload Excel
              <input
                type="file"
                hidden
                accept=".xlsx"
                onChange={handleFileUpload}
              />
            </Button>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="sheet-select-label">Sheet</InputLabel>
              <Select
                labelId="sheet-select-label"
                value={activeSheet}
                label="Sheet"
                onChange={(event) => onSelectSheet(event.target.value)}
                sx={{ bgcolor: "#f8fafc" }}
              >
                {sheetOptions.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isMsalConfigured && isAuthenticated && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2,
                  height: 38,
                  borderColor: "#fee2e2",
                  bgcolor: "#fff5f5",
                  "&:hover": {
                    bgcolor: "#ffe3e3",
                    borderColor: "#fca5a5"
                  }
                }}
              >
                Sign Out
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default Header;
