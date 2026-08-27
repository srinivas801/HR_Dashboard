import XLSX from "xlsx";
import path from "path";

const filePath = path.resolve("public/data/MIS.xlsx");
try {
  const workbook = XLSX.readFile(filePath);
  for (const sheetName of ["MBRDI", "DTICI", "Persistent"]) {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      console.log("Sheet not found");
      continue;
    }
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    const types = {};
    const billables = {};
    const statuses = {};
    rawData.forEach(row => {
      const type = row["New/Replacement"] || "";
      const billable = row["Billable"] || "";
      const status = row["Status"] || "";
      const positions = parseInt(row["# Positions"] || 0, 10);
      types[type] = (types[type] || 0) + positions;
      billables[billable] = (billables[billable] || 0) + positions;
      statuses[status] = (statuses[status] || 0) + positions;
    });
    console.log("New/Replacement positions:", types);
    console.log("Billable positions:", billables);
    console.log("Status positions:", statuses);
  }
} catch (e) {
  console.error("Error reading file:", e);
}
