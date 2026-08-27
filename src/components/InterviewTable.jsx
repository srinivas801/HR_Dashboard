import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Button, Typography, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";

const getStatusChipProps = (status) => {
  switch (status?.toLowerCase()) {
    case "scheduled":
      return { label: status, style: { bgcolor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" } };
    case "completed":
      return { label: status, style: { bgcolor: "#f3e8ff", color: "#7e22ce", border: "1px solid #e9d5ff" } };
    case "selected":
      return { label: status, style: { bgcolor: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" } };
    case "rejected":
      return { label: status, style: { bgcolor: "#ffe4e6", color: "#be123c", border: "1px solid #fecdd3" } };
    case "pending":
      return { label: status, style: { bgcolor: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" } };
    default:
      return { label: status || "N/A", style: { bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" } };
  }
};

const getLevelChipStyle = (level) => {
  switch (level?.toUpperCase()) {
    case "L1":
      return { bgcolor: "#e0e7ff", color: "#3730a3" };
    case "L2":
      return { bgcolor: "#dbeafe", color: "#1e40af" };
    case "HR":
      return { bgcolor: "#fce7f3", color: "#9d174d" };
    default:
      return { bgcolor: "#f3f4f6", color: "#374151" };
  }
};

const InterviewTable = ({ data, onSelectCandidate }) => {
  const columns = [
    {
      field: "ID",
      headerName: "ID",
      width: 70,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "Interviewee",
      headerName: "Candidate / Interviewee",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={700} color="#0f172a">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "Interviewer",
      headerName: "Interviewer",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "Position",
      headerName: "Position",
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "Interview Level",
      headerName: "Level",
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => {
        const style = getLevelChipStyle(params.value);
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "6px",
              ...style,
            }}
          />
        );
      },
    },
    {
      field: "Status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const chipProps = getStatusChipProps(params.value);
        return (
          <Chip
            label={chipProps.label}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "12px",
              ...chipProps.style,
            }}
          />
        );
      },
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
      minWidth: 110,
    },
    {
      field: "Time",
      headerName: "Time",
      flex: 0.9,
      minWidth: 100,
    },
    {
      field: "Remarks",
      headerName: "Remarks",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title={params.value || ""} placement="top-start">
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "text.secondary",
            }}
          >
            {params.value || "-"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="text"
          startIcon={<Visibility sx={{ fontSize: 16 }} />}
          onClick={() => onSelectCandidate(params.row)}
          sx={{
            color: "#4f46e5",
            fontWeight: 600,
            "&:hover": { bgcolor: "#eef2ff" },
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const rows = data.map((item, index) => ({
    id: item.ID || index + 1,
    ...item,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0,
            },
          },
        }}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f1f5f9",
            py: 1.5,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8fafc",
            borderBottom: "2px solid #e2e8f0",
            fontWeight: 700,
            color: "#475569",
            borderRadius: "12px 12px 0 0",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f8fafc",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #e2e8f0",
          },
        }}
      />
    </Box>
  );
};

export default InterviewTable;
