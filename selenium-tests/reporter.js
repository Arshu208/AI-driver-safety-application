import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const TEST_OUTPUT = path.resolve('./test-results.json');
const REPORT_OUTPUT = path.resolve('./ridesafe-selenium-report.xlsx');

async function createReport() {
  if (!fs.existsSync(TEST_OUTPUT)) {
    throw new Error(`${TEST_OUTPUT} not found. Run the Selenium tests first.`);
  }

  const results = JSON.parse(fs.readFileSync(TEST_OUTPUT, 'utf-8'));
  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet('Summary');
  const detailsSheet = workbook.addWorksheet('Details');

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const total = results.length;

  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 40 },
    { header: 'Value', key: 'value', width: 20 }
  ];

  summarySheet.addRow({ metric: 'Total test cases', value: total });
  summarySheet.addRow({ metric: 'Passed', value: passed });
  summarySheet.addRow({ metric: 'Failed', value: failed });
  summarySheet.addRow({ metric: 'Pass rate', value: `${((passed / total) * 100).toFixed(2)}%` });
  summarySheet.addRow({ metric: 'Generated at', value: new Date().toISOString() });

  detailsSheet.columns = [
    { header: 'Test ID', key: 'id', width: 15 },
    { header: 'Title', key: 'title', width: 50 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Details', key: 'detail', width: 80 },
    { header: 'Timestamp', key: 'timestamp', width: 30 }
  ];

  results.forEach((result) => {
    detailsSheet.addRow(result);
  });

  await workbook.xlsx.writeFile(REPORT_OUTPUT);
  console.log(`Excel report created at ${REPORT_OUTPUT}`);
}

createReport().catch((error) => {
  console.error('Reporter failed:', error);
  process.exit(1);
});
