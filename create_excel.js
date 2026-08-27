import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const data = [
  {
    ID: 1,
    Interviewer: "John Mathew",
    Interviewee: "Alex Thomas",
    Position: "React Developer",
    "Interview Level": "L1",
    Status: "Completed",
    Date: "2026-07-28",
    Time: "10:00 AM",
    Remarks: "Good technical knowledge",
  },
  {
    ID: 2,
    Interviewer: "Sarah Wilson",
    Interviewee: "Rahul Kumar",
    Position: "Node.js Developer",
    "Interview Level": "L1",
    Status: "Scheduled",
    Date: "2026-07-28",
    Time: "11:30 AM",
    Remarks: "-",
  },
  {
    ID: 3,
    Interviewer: "David Smith",
    Interviewee: "Anjali Nair",
    Position: "Frontend Developer",
    "Interview Level": "L2",
    Status: "Completed",
    Date: "2026-07-28",
    Time: "02:00 PM",
    Remarks: "Strong performance",
  },
  {
    ID: 4,
    Interviewer: "John Mathew",
    Interviewee: "Kevin George",
    Position: "React Developer",
    "Interview Level": "HR",
    Status: "Selected",
    Date: "2026-07-29",
    Time: "10:00 AM",
    Remarks: "Selected for next step",
  },
  {
    ID: 5,
    Interviewer: "Sarah Wilson",
    Interviewee: "Michael John",
    Position: "Backend Developer",
    "Interview Level": "L2",
    Status: "Rejected",
    Date: "2026-07-29",
    Time: "11:30 AM",
    Remarks: "Not selected",
  },
  {
    ID: 6,
    Interviewer: "David Smith",
    Interviewee: "Priya Menon",
    Position: "Full Stack Developer",
    "Interview Level": "L1",
    Status: "Scheduled",
    Date: "2026-07-29",
    Time: "02:00 PM",
    Remarks: "-",
  },
  {
    ID: 7,
    Interviewer: "John Mathew",
    Interviewee: "Arun Raj",
    Position: "React Developer",
    "Interview Level": "L2",
    Status: "Pending",
    Date: "2026-07-30",
    Time: "10:00 AM",
    Remarks: "Feedback pending",
  },
  {
    ID: 8,
    Interviewer: "Sarah Wilson",
    Interviewee: "Neha Joseph",
    Position: "QA Engineer",
    "Interview Level": "L1",
    Status: "Completed",
    Date: "2026-07-30",
    Time: "11:30 AM",
    Remarks: "Good testing knowledge",
  },
  {
    ID: 9,
    Interviewer: "David Smith",
    Interviewee: "Tom Mathew",
    Position: "Node.js Developer",
    "Interview Level": "HR",
    Status: "Scheduled",
    Date: "2026-07-30",
    Time: "02:00 PM",
    Remarks: "-",
  },
  {
    ID: 10,
    Interviewer: "John Mathew",
    Interviewee: "Lisa George",
    Position: "UI Developer",
    "Interview Level": "L1",
    Status: "Completed",
    Date: "2026-07-31",
    Time: "10:00 AM",
    Remarks: "Good UI skills",
  },
];

const publicDataDir = path.join(process.cwd(), "public", "data");
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Interviews");

const excelPath = path.join(publicDataDir, "Interviews.xlsx");
XLSX.writeFile(workbook, excelPath);
console.log("Successfully created Interviews.xlsx at:", excelPath);
