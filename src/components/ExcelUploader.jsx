import { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { UploadFile, FileUpload } from "@mui/icons-material";
import { parseExcelBuffer } from "../services/excelService";

const ExcelUploader = ({ onDataLoaded }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      setError("Please select a valid Excel (.xlsx, .xls) or CSV file.");
      return;
    }

    setError("");
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target.result;
        const parsedData = parseExcelBuffer(buffer);
        if (parsedData && parsedData.length > 0) {
          onDataLoaded(parsedData);
          setOpen(false);
        } else {
          setError("No data found in uploaded Excel file.");
        }
      } catch (err) {
        console.error("Parse error:", err);
        setError("Error parsing Excel file. Please ensure valid format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<UploadFile />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "#4f46e5",
          "&:hover": { bgcolor: "#4338ca" },
          px: 2.5,
          py: 1,
        }}
      >
        Upload Excel Sheet
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Upload Interview Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select an Excel file (.xlsx) containing columns like <b>Interviewer</b>, <b>Interviewee</b>, <b>Position</b>, <b>Level</b>, <b>Status</b>, <b>Date</b>, etc.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: "2px dashed #cbd5e1",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#f8fafc",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "#4f46e5",
                bgcolor: "#eef2ff",
              },
            }}
          >
            <FileUpload sx={{ fontSize: 48, color: "#4f46e5", mb: 1 }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Click to select Excel file
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports .xlsx, .xls, .csv
            </Typography>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExcelUploader;
