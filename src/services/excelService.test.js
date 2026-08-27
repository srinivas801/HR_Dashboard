import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';
import { parseExcelBuffer } from './excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.join(__dirname, '../../public/data/MIS.xlsx');

test('parseExcelBuffer maps MIS workbook headers to dashboard fields', () => {
  const fileBuffer = fs.readFileSync(workbookPath);
  const parsed = parseExcelBuffer(fileBuffer);

  assert.ok(parsed.sheetNames.includes('MBRDI'), 'expected MBRDI sheet to be parsed');
  
  const mbrdiData = parsed.sheets.MBRDI;
  assert.ok(mbrdiData.length > 0, 'expected at least one row from MBRDI sheet');

  const first = mbrdiData[0];
  assert.equal(first.Position, 'SDM (Non Billable)', 'expected the first imported requirement to match available DTICI/MBRDI data');
  assert.equal(first.Interviewer, 'N/A');
  assert.equal(first.Status, 'Closed');
});

test('parseExcelBuffer treats blank requirement counts as zero and skips empty rows', () => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Slno', 'Req. Date', 'Requirement', '# Positions', 'Joined', 'In Screen', 'In Tech', 'In Client', 'Offer / Reject', 'Remarks', 'End User'],
    [1, '2024-07-01', '', '', '', '', '', '1 - Offer', '', 'Santosh'],
    [2, '2024-07-03', 'Python Developer', '', 2, '2', '', '', '', '', 'Nikhil'],
    ['', '', '', '', '', '', '', '', '', '', ''],
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'MBRDI');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const parsed = parseExcelBuffer(buffer);
  const rows = parsed.sheets.MBRDI;

  assert.equal(rows.length, 2, 'expected empty rows to be skipped');
  assert.equal(rows[0].Positions, 0, 'expected blank positions to default to zero');
  assert.equal(rows[1].InScreen, 2, 'expected populated screening counts to remain intact');
  assert.equal(rows[1].Joined, 2, 'expected Joined to be parsed as numeric count');
});
