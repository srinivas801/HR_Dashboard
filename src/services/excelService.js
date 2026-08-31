import * as XLSX from "xlsx";

const getFirstNonEmptyValue = (item, aliases = []) => {
  for (const alias of aliases) {
    const value = item?.[alias];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

const hasMeaningfulData = (item) => {
  if (!item || typeof item !== "object") return false;

  return Object.entries(item).some(([key, value]) => {
    if (value === undefined || value === null) return false;
    if (key === "Slno" || key === "Sl No." || key === "ID") {
      return false;
    }
    const str = String(value).trim();
    return str !== "";
  });
};

const isValidDateString = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !Number.isNaN(date.getTime());
};

const formatDateValue = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "number") {
    const parseDateCode = XLSX.SSF?.parse_date_code;
    const dateObj = typeof parseDateCode === "function" ? parseDateCode(value) : null;

    if (dateObj) {
      const y = dateObj.y;
      const m = String(dateObj.m).padStart(2, "0");
      const d = String(dateObj.d).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    const baseDate = new Date(Date.UTC(1899, 11, 30));
    const parsedDate = new Date(baseDate.getTime() + value * 24 * 60 * 60 * 1000);
    const y = parsedDate.getUTCFullYear();
    const m = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const d = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) return trimmed;
    return trimmed;
  }

  return String(value).trim();
};

export const normalizeDate = (val) => {
  const formatted = formatDateValue(val);
  if (!formatted) return "";
  
  if (formatted.includes("/")) {
    const parts = formatted.split("/");
    if (parts.length === 3) {
      let m = parts[0].padStart(2, "0");
      let d = parts[1].padStart(2, "0");
      let y = parts[2];
      if (y.length === 2) {
        y = "20" + y;
      }
      return `${y}-${m}-${d}`;
    }
  }
  
  return formatted;
};

export const getWeekString = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  
  const y = sunday.getFullYear();
  const m = String(sunday.getMonth() + 1).padStart(2, "0");
  const d = String(sunday.getDate()).padStart(2, "0");
  const sundayStr = `${y}-${m}-${d}`;
  
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  const satM = String(saturday.getMonth() + 1).padStart(2, "0");
  const satD = String(saturday.getDate()).padStart(2, "0");
  const saturdayStr = `${satM}/${satD}`;
  
  return `${sundayStr} to ${saturdayStr}`;
};

const normalizeStatus = (value) => {
  if (!value) return "Scheduled";

  const text = String(value).trim().toLowerCase();
  if (text.includes("offer")) return "Offer";
  if (text.includes("reject") || text.includes("rejected")) return "Rejected";
  if (text.includes("selected")) return "Selected";
  if (text.includes("completed")) return "Completed";
  if (text.includes("pending")) return "Pending";
  if (text.includes("scheduled")) return "Scheduled";

  return String(value).trim();
};

const parseNum = (val, defaultVal = 0) => {
  if (val === undefined || val === null || String(val).trim() === "") return defaultVal;
  const num = parseInt(val, 10);
  return isNaN(num) ? defaultVal : num;
};

const parseOffered = (val) => {
  if (val === undefined || val === null || String(val).trim() === "") return 0;
  if (typeof val === "number") return val;
  const str = String(val).trim().toLowerCase();
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }
  const match = str.match(/(\d+)\s*-\s*offer/i) || str.match(/(\d+)\s*offer/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  if (str.includes("offer") || str.includes("onboarded") || str.includes("closed")) {
    return 1;
  }
  return 0;
};

const parseRequirementsSheet = (rawData) => {
  return rawData
    .filter(hasMeaningfulData)
    .map((item, index) => {
      const rawDate = getFirstNonEmptyValue(item, ["Req. Date", "Sourcing Date", "DOJ", "Date", "Interview Date", "Scheduled Date"]);
      const rawPositions = getFirstNonEmptyValue(item, ["# Positions", "Positions", "No. of Positions", "No of Positions", "Requirement Count"]);
      const rawScreen = getFirstNonEmptyValue(item, ["In Screen", "Screening", "In Screening", "Screen Count"]);
      const rawTech = getFirstNonEmptyValue(item, ["In Tech", "L1 Discussion", "L2 Discussion", "Tech Discussion", "Technical"]);
      const rawClient = getFirstNonEmptyValue(item, ["In Client", "Client Round", "Client Discussion", "Client"]);
      const rawStatus = getFirstNonEmptyValue(item, ["Status", "Current Status", "Stage"]);
      const rawOffer = getFirstNonEmptyValue(item, ["Offer", "Offers", "Offer / Reject", "Offer/Reject", "Offered", "Offered Count"]);
      const rawJoined = getFirstNonEmptyValue(item, ["Joined", "Joined Count", "Onboarded"]);
      const rawRemarks = getFirstNonEmptyValue(item, ["Remarks", "Remarks / Comments", "Notes", "Comment", "Feedback"]);
      const rawEndUser = getFirstNonEmptyValue(item, ["End User", "Interviewer", "Recruiter", "Assigned Interviewer"]);
      const rawRequirement = getFirstNonEmptyValue(item, ["Requirement", "Position", "Job Role", "Role"]);
      const rawMrfId = getFirstNonEmptyValue(item, ["MRF ID", "MRF", "MRFNo", "MRF No.", "MRFId"]);
      const rawType = getFirstNonEmptyValue(item, ["New/Replacement", "Type", "New Requirement", "New/Replacement Requirement"]);
      const rawBillable = getFirstNonEmptyValue(item, ["Billable", "Billing", "Billing Type", "Billable / Nonbillable", "Billing Category"]);
      const rawPrimarySkills = getFirstNonEmptyValue(item, ["Primary Skills", "Skills", "PrimarySkills", "Skillset", "Skill"]);
      const rawTodo = getFirstNonEmptyValue(item, ["To do", "Todo", "Action Item", "To-do"]);
      
      const formattedDate = normalizeDate(rawDate);
      
      return {
        ID: getFirstNonEmptyValue(item, ["Slno", "Sl No.", "ID", "Serial No."]) || index + 1,
        Date: formattedDate,
        Week: getWeekString(formattedDate),
        Type: rawType ? String(rawType).trim() : "N/A",
        Requirement: rawRequirement ? String(rawRequirement).trim() : "N/A",
        Position: rawRequirement ? String(rawRequirement).trim() : "N/A", // backward compatibility
        MrfId: rawMrfId ? String(rawMrfId).trim() : "N/A",
        Billable: rawBillable ? String(rawBillable).trim() : "N/A",
        PrimarySkills: rawPrimarySkills ? String(rawPrimarySkills).trim() : "-",
        Todo: rawTodo ? String(rawTodo).trim() : "-",
        Positions: parseNum(rawPositions, 0),
        Joined: parseNum(rawJoined, 0),
        InScreen: parseNum(rawScreen, 0),
        InTech: parseNum(rawTech, 0),
        InClient: parseNum(rawClient, 0),
        Status: rawStatus ? String(rawStatus).trim() : "Open",
        Offered: parseOffered(rawOffer),
        Remarks: rawRemarks ? String(rawRemarks).trim() : "-",
        EndUser: rawEndUser ? String(rawEndUser).trim() : "N/A",
        Interviewer: rawEndUser ? String(rawEndUser).trim() : "N/A", // backward compatibility
      };
    });
};

const parseRecruitmentSheet = (rawData) => {
  return rawData.filter(hasMeaningfulData).map((item, index) => {
    const rawDate = getFirstNonEmptyValue(item, ["Sourcing Date", "DOJ", "Date", "Interview Date", "Scheduled Date"]);
    const rawStatus = getFirstNonEmptyValue(item, ["Status", "Current Status", "Offer / Reject", "Offer/Reject", "Stage"]);
    const rawInterviewer = getFirstNonEmptyValue(item, ["End User", "BH Discussion", "HR discussion", "Interviewer", "Recruiter", "Assigned Interviewer"]);
    const rawInterviewee = getFirstNonEmptyValue(item, ["Candidate Name", "Interviewee", "Candidate", "Applicant"]);
    const rawPosition = getFirstNonEmptyValue(item, ["Position", "Requirement", "Job Role", "Role"]);
    const rawRemarks = getFirstNonEmptyValue(item, ["Remarks", "Screening", "Notes", "Comment", "Feedback"]);
    const rawId = getFirstNonEmptyValue(item, ["Sl No.", "Slno", "ID", "Serial No."]);
    
    const formattedDate = normalizeDate(rawDate);

    return {
      ID: rawId || index + 1,
      Date: formattedDate,
      Week: getWeekString(formattedDate),
      Requirement: rawPosition ? String(rawPosition).trim() : "N/A",
      Position: rawPosition ? String(rawPosition).trim() : "N/A",
      Positions: 1,
      InScreen: getFirstNonEmptyValue(item, ["Screening", "In Screen", "In Screening"]) ? 1 : 0,
      InTech: (item["L1 Discussion"] || item["L2 Discussion"] || item["BH Discussion"] || getFirstNonEmptyValue(item, ["In Tech", "L1", "L2"])) ? 1 : 0,
      InClient: 0,
      Offered: (item["Offered"] || String(rawStatus || "").toLowerCase().includes("offer")) ? 1 : 0,
      Status: normalizeStatus(rawStatus),
      Remarks: rawRemarks ? String(rawRemarks).trim() : "-",
      Interviewee: rawInterviewee ? String(rawInterviewee).trim() : "N/A",
      Interviewer: rawInterviewer ? String(rawInterviewer).trim() : "N/A",
      Time: "",
      "Interview Level": item["BH Discussion"] ? "BH" : item["HR discussion"] ? "HR" : "L1",
    };
  });
};

const parseGenericSheet = (rawData) => {
  return rawData.filter(hasMeaningfulData).map((item, index) => {
    const rawDate = getFirstNonEmptyValue(item, ["Date", "Req. Date", "Interview Date", "Scheduled Date"]);
    const rawStatus = getFirstNonEmptyValue(item, ["Status", "Stage", "Offer / Reject", "Current Status"]);
    const rawInterviewer = getFirstNonEmptyValue(item, ["Interviewer", "End User", "Recruiter", "Assigned Interviewer"]);
    const rawInterviewee = getFirstNonEmptyValue(item, ["Interviewee", "Candidate Name", "Candidate", "Applicant"]);
    const rawPosition = getFirstNonEmptyValue(item, ["Position", "Requirement", "Job Role", "Role"]);
    const rawLevel = getFirstNonEmptyValue(item, ["Interview Level", "Level", "New/Replacement", "Round"]);
    const rawTime = getFirstNonEmptyValue(item, ["Time", "Interview Time", "Slot Time"]);
    const rawRemarks = getFirstNonEmptyValue(item, ["Remarks", "Notes", "Comment", "Feedback"]);
    const rawId = getFirstNonEmptyValue(item, ["ID", "Slno", "Sl No.", "Serial No."]);

    const formattedDate = normalizeDate(rawDate);

    return {
      ID: rawId || index + 1,
      Interviewer: rawInterviewer ? String(rawInterviewer).trim() : "N/A",
      Interviewee: rawInterviewee ? String(rawInterviewee).trim() : "N/A",
      Position: rawPosition ? String(rawPosition).trim() : "N/A",
      Requirement: rawPosition ? String(rawPosition).trim() : "N/A",
      "Interview Level": rawLevel ? String(rawLevel).trim() : "L1",
      Status: normalizeStatus(rawStatus),
      Date: formattedDate,
      Week: getWeekString(formattedDate),
      Time: String(rawTime || "").trim(),
      Remarks: rawRemarks ? String(rawRemarks).trim() : "-",
      Positions: 1,
      InScreen: 0,
      InTech: 0,
      InClient: 0,
      Offered: rawStatus?.toLowerCase().includes("offer") ? 1 : 0,
    };
  });
};

// Configure your SharePoint direct download link here.
// If left blank, the dashboard will fall back to using the local file.
const SHAREPOINT_EXCEL_URL = "https://microgenesistechsoft.sharepoint.com/sites/Global-MarketSales/_layouts/15/download.aspx?sourcedoc=%7B6D3A78BD-FAA9-410E-80F2-AE2580A9187A%7D";

export const fetchInterviewData = async (msalContext = null) => {
  // If MSAL context is provided and active account is logged in, try to fetch directly from Microsoft Graph API
  if (msalContext && msalContext.instance && msalContext.accounts && msalContext.accounts.length > 0) {
    try {
      console.log("Attempting to fetch Excel workbook directly from Microsoft Graph API...");
      const request = {
        scopes: ["User.Read", "Files.Read.All"],
        account: msalContext.accounts[0]
      };
      
      const tokenResult = await msalContext.instance.acquireTokenSilent(request);
      const token = tokenResult.accessToken;

      const graphUrl = "https://graph.microsoft.com/v1.0/sites/microgenesistechsoft.sharepoint.com:/sites/Global-MarketSales:/drive/root:/MIS.xlsx:/content";
      const response = await fetch(graphUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Graph API returned status ${response.status}`);
      }

      console.log("Successfully fetched live data directly from Microsoft Graph API!");
      const arrayBuffer = await response.arrayBuffer();
      return parseExcelBuffer(arrayBuffer);
    } catch (graphErr) {
      console.warn("Direct Microsoft Graph fetch failed. Falling back to local data.", graphErr.message || graphErr);
    }
  }

  // Fetch local Excel file statically from the public folder
  try {
    console.log("Fetching Excel workbook from local path: /data/MIS.xlsx");
    const response = await fetch("/data/MIS.xlsx");
    if (!response.ok) {
      throw new Error(`Failed to fetch /data/MIS.xlsx, status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return parseExcelBuffer(arrayBuffer);
  } catch (err) {
    console.error("Critical error: Failed to load local Excel data.", err);
    throw err;
  }
};

export const parseExcelBuffer = (arrayBuffer) => {
  const workbook = XLSX.read(arrayBuffer, {
    type: arrayBuffer instanceof ArrayBuffer || ArrayBuffer.isView(arrayBuffer) ? "array" : "buffer",
    cellDates: true,
  });

  const sheetsData = {};
  const sheetNames = workbook.SheetNames.filter(name => 
    ["MBRDI", "DTICI", "Persistent", "Wipro", "Recruitment"].includes(name)
  );

  if (sheetNames.length === 0 && workbook.SheetNames.length > 0) {
    const defaultName = workbook.SheetNames[0];
    sheetsData[defaultName] = parseGenericSheet(XLSX.utils.sheet_to_json(workbook.Sheets[defaultName], { defval: "" }));
    return {
      sheets: sheetsData,
      sheetNames: [defaultName]
    };
  }

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (["MBRDI", "DTICI", "Persistent", "Wipro"].includes(sheetName)) {
      sheetsData[sheetName] = parseRequirementsSheet(rawData);
    } else if (sheetName === "Recruitment") {
      sheetsData[sheetName] = parseRecruitmentSheet(rawData);
    } else {
      sheetsData[sheetName] = parseGenericSheet(rawData);
    }
  });

  return {
    sheets: sheetsData,
    sheetNames: workbook.SheetNames.filter(name => sheetsData[name] !== undefined)
  };
};
