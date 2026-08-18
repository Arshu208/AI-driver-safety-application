import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';

const reports = process.argv.slice(2);
if (reports.length === 0) {
  throw new Error('No report files supplied.');
}

for (const reportPath of reports) {
  const resolved = path.resolve(reportPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Missing report: ${reportPath}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(resolved);
  const summary = workbook.getWorksheet('Summary');
  if (!summary) {
    throw new Error(`Missing Summary sheet: ${reportPath}`);
  }

  const values = new Map();
  summary.eachRow((row) => {
    const key = String(row.getCell(1).value ?? '').trim().toLowerCase();
    const value = row.getCell(2).value;
    if (key) values.set(key, value);
  });

  const failed = Number(values.get('failed') ?? values.get('failed tests') ?? 0);
  const passed = Number(values.get('passed') ?? values.get('passed tests') ?? 0);
  const status = String(values.get('status') ?? '').toUpperCase();
  const hasFailureCell = workbook.worksheets.some((sheet) => {
    let failedCell = false;
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (String(cell.value ?? '').toUpperCase() === 'FAIL') failedCell = true;
      });
    });
    return failedCell;
  });
  if (hasFailureCell || status === 'FAILED' || (passed === 0 && status !== 'PASSED')) {
    throw new Error(`Report is not passing: ${reportPath} (passed=${passed}, failed=${failed}, status=${status || 'unknown'})`);
  }

  console.log(`${reportPath}: PASS (${passed || 'status'} passed, ${failed} failed)`);
}
