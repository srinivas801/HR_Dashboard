import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../services/msalConfig";

import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import CandidateModal from "../components/CandidateModal";
import RequirementsTable from "../components/RequirementsTable";

import { fetchInterviewData } from "../services/excelService";

const Dashboard = () => {
  const [workbookData, setWorkbookData] = useState({ sheets: {}, sheetNames: [] });
  const [activeSheet, setActiveSheet] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const isMsalConfigured = !!import.meta.env.VITE_AZURE_CLIENT_ID;
  const allowedSheets = ["MBRDI", "DTICI", "Persistent", "Wipro"];

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const msalContext = isMsalConfigured ? { instance, accounts } : null;
      const result = await fetchInterviewData(msalContext);
      setWorkbookData(result);
      if (result.sheetNames && result.sheetNames.length > 0) {
        const defaultSheet = result.sheetNames.find((name) => allowedSheets.includes(name)) || result.sheetNames[0];
        setActiveSheet(defaultSheet);
      }
    } catch (err) {
      console.error("Dashboard error loading data:", err);
      setError("Unable to load interview data from backend/SharePoint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMsalConfigured || isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const handleCustomDataLoaded = (newWorkbookData) => {
    setWorkbookData(newWorkbookData);
    if (newWorkbookData.sheetNames && newWorkbookData.sheetNames.length > 0) {
      const defaultSheet = newWorkbookData.sheetNames.find((name) => allowedSheets.includes(name)) || newWorkbookData.sheetNames[0];
      setActiveSheet(defaultSheet);
    }
  };

  const handleSelectSheet = (sheetName) => {
    setActiveSheet(sheetName);
  };

  const sheetOptions = useMemo(
    () => allowedSheets.filter((name) => workbookData.sheetNames.includes(name)),
    [workbookData.sheetNames]
  );

  const handleOpenCandidateModal = (candidateRow) => {
    setSelectedCandidate(candidateRow);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const data = useMemo(() => {
    return workbookData.sheets[activeSheet] || [];
  }, [workbookData, activeSheet]);

  const filteredData = useMemo(() => data, [data]);

  if (isMsalConfigured && !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0f172a",
          px: 3,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 440,
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "#1e293b",
            border: "1px solid #334155",
          }}
        >
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="/assets/Microgenesis_logo.jpg"
              alt="Microgenesis Logo"
              sx={{ width: 64, height: 64, borderRadius: 2, objectFit: "contain" }}
            />
          </Box>
          <Typography variant="h5" fontWeight={800} color="#ffffff" gutterBottom>
            HR Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="#94a3b8" sx={{ mb: 4 }}>
            Please sign in with your corporate Microsoft account to view requirements and candidate tracks.
          </Typography>
          
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 23 23">
                <path fill="#F35325" d="M1 1h10v10H1z"/>
                <path fill="#80C342" d="M12 1h10v10H12z"/>
                <path fill="#00A1F1" d="M1 12h10v10H1z"/>
                <path fill="#FFB900" d="M12 12h10v10H12z"/>
              </svg>
            }
            sx={{
              py: 1.5,
              fontSize: "0.95rem",
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#ffffff",
              color: "#1e293b",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "#f1f5f9",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              }
            }}
          >
            Sign in with Microsoft
          </Button>
          
          <Typography variant="caption" color="#475569" sx={{ mt: 4, display: "block" }}>
            Microgenesis Techsoft Internal Tools
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: "#4f46e5" }} />
        <Typography variant="body1" color="text.secondary" fontWeight={600}>
          Loading interview spreadsheet...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert
          severity="error"
          sx={{ borderRadius: 3, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef2ff" }}>
      <Header
        totalRecords={data.length}
        sheetOptions={sheetOptions}
        activeSheet={activeSheet}
        onSelectSheet={handleSelectSheet}
        onCustomDataLoaded={handleCustomDataLoaded}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <DashboardCards data={filteredData} isRequirementsSheet={true} />

        <Paper sx={{ p: 3, borderRadius: 4, mt: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="#0f172a">
              Hiring Requirements List
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click "View" for more details.
            </Typography>
          </Box>

          <RequirementsTable
            data={filteredData}
            onSelectRequirement={handleOpenCandidateModal}
          />
        </Paper>
      </Container>

      <CandidateModal
        candidate={selectedCandidate}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default Dashboard;
