import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Button, Typography, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";

const getHiringTypeStyle = (type) => {
  switch (type?.toLowerCase()) {
    case "replacement":
      return { bgcolor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" };
    case "new":
      return { bgcolor: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
    default:
      return { bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" };
  }
};

const RequirementsTable = ({ data, onSelectRequirement }) => {
  const columns = [
    {
      field: "Requirement",
      headerName: "Requirement",
      flex: 2,
      minWidth: 280,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", py: 1 }}>
          <Typography variant="body2" fontWeight={700} color="#0f172a" sx={{ whiteSpace: "normal" }}>
            {params.value}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#4f46e5", fontWeight: 700 }}>
              MRF: {params.row.MrfId || "N/A"}
            </Typography>
            {params.row.PrimarySkills && params.row.PrimarySkills !== "-" && (
              <>
                <Typography variant="caption" color="text.disabled" sx={{ mx: 0.25 }}>•</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#475569", 
                    bgcolor: "#f1f5f9", 
                    px: 1, 
                    py: 0.25, 
                    borderRadius: 1, 
                    fontWeight: 600,
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                  title={params.row.PrimarySkills}
                >
                  Skills: {params.row.PrimarySkills}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: "Type",
      headerName: "Type",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => {
        const style = getHiringTypeStyle(params.value);
        return (
          <Chip
            label={params.value || "Unknown"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.72rem",
              borderRadius: "6px",
              ...style,
            }}
          />
        );
      },
    },
    {
      field: "Billable",
      headerName: "Billable",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: "0.72rem",
            borderRadius: "6px",
            bgcolor: params.value?.toLowerCase().includes("non") ? "#fee2e2" : "#dcfce7",
            color: params.value?.toLowerCase().includes("non") ? "#991b1b" : "#166534",
            border: params.value?.toLowerCase().includes("non") ? "1px solid #fecaca" : "1px solid #bbf7d0",
          }}
        />
      ),
    },
    {
      field: "Status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const valueStr = String(params.value || "");
        const isOffer = valueStr.toLowerCase().includes("offer");
        return (
          <Chip
            label={valueStr || "Pending"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.72rem",
              bgcolor: isOffer ? "#dcfce7" : "#f1f5f9",
              color: isOffer ? "#15803d" : "#475569",
              border: isOffer ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="text"
          startIcon={<Visibility sx={{ fontSize: 16 }} />}
          onClick={() => onSelectRequirement(params.row)}
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
    slNo: item.ID || index + 1,
    ...item,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        getRowHeight={() => "auto"}
        getEstimatedRowHeight={() => 80}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
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
            display: "flex",
            alignItems: "center",
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

export default RequirementsTable;
