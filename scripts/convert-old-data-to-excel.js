#!/usr/bin/env node

/**
 * Convert old data.md to Excel format
 *
 * Parses space-separated text file and converts to Excel (.xlsx)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Try to import xlsx from web/node_modules or root
let XLSX;
try {
  const xlsxPath = path.join(process.cwd(), 'web', 'node_modules', 'xlsx');
  XLSX = await import(xlsxPath + '/index.js');
  XLSX = XLSX.default || XLSX;
} catch {
  try {
    const xlsxModule = await import('xlsx');
    XLSX = xlsxModule.default || xlsxModule;
  } catch {
    console.error('❌ xlsx package not found. Installing...');
    console.error('   Run: npm install xlsx (in web directory)');
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const inputFile = path.join(projectRoot, 'docs', 'old data.md');
const outputFile = path.join(projectRoot, 'docs', 'old-data-import.xlsx');

console.log('📄 Converting old data to Excel format...\n');

try {
  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

  if (lines.length < 2) {
    throw new Error('File must have at least a header row and one data row');
  }

  // Headers
  const headers = [
    'S No.',
    'Date',
    'Delivery Address',
    'Quantity',
    'Unit Price',
    'Total Amount',
    'Status',
    'Payment Mode',
    'Billing Month',
    'Reference Month',
    'Year',
  ];

  console.log(`📋 Headers: ${headers.length} columns\n`);

  // Parse data rows
  const dataRows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseRow(line, i);
    if (row && row.length === headers.length) {
      dataRows.push(row);
    }
  }

  console.log(`📊 Parsed ${dataRows.length} data rows\n`);

  // Create worksheet
  const worksheetData = [headers, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 }, // S No.
    { wch: 12 }, // Date
    { wch: 30 }, // Delivery Address
    { wch: 10 }, // Quantity
    { wch: 12 }, // Unit Price
    { wch: 12 }, // Total Amount
    { wch: 10 }, // Status
    { wch: 12 }, // Payment Mode
    { wch: 15 }, // Billing Month
    { wch: 15 }, // Reference Month
    { wch: 6 }, // Year
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  // Write file
  XLSX.writeFile(workbook, outputFile);

  console.log(`✅ Successfully converted ${dataRows.length} orders!`);
  console.log(`📁 Excel file: ${outputFile}\n`);
  console.log('📝 Next steps:');
  console.log('   1. Open the Excel file to verify data');
  console.log('   2. Go to Admin Dashboard → Orders');
  console.log('   3. Click "Import Orders"');
  console.log('   4. Select the Excel file\n');
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stack) console.error(error.stack);
  process.exit(1);
}

/**
 * Parse a data row
 * Format: SNo Date Address Quantity UnitPrice Total Status PaymentMode BillingMonth ReferenceMonth Year
 */
function parseRow(line, rowNum) {
  const row = [];
  let remaining = line.trim();

  // 1. S No. (first number)
  const snoMatch = remaining.match(/^(\d+)\s+/);
  if (snoMatch) {
    row.push(snoMatch[1]);
    remaining = remaining.substring(snoMatch[0].length).trim();
  } else {
    row.push(String(rowNum));
  }

  // 2. Date (M/D/YY format)
  const dateMatch = remaining.match(/^(\d+\/\d+\/\d+)\s+/);
  if (dateMatch) {
    row.push(dateMatch[1]);
    remaining = remaining.substring(dateMatch[0].length).trim();
  } else {
    row.push('');
  }

  // 3-11. Split remaining by spaces, but be smart about addresses
  // Pattern: address (can have spaces) then numbers for qty/price/total, then text fields
  const parts = remaining.split(/\s+/);

  // Smart parsing: Find the pattern where we have 3 consecutive numbers (qty, price, total)
  // Then everything before that is the address
  let numStartIdx = -1;
  for (let i = 0; i < parts.length - 2; i++) {
    const val1 = parseFloat(parts[i]);
    const val2 = parseFloat(parts[i + 1]);
    const val3 = parseFloat(parts[i + 2]);

    // Check if we have 3 consecutive valid numbers
    if (
      !isNaN(val1) &&
      !isNaN(val2) &&
      !isNaN(val3) &&
      val1 > 0 &&
      val2 > 0 &&
      val3 > 0 &&
      val1 < 1000 &&
      val2 < 10000 &&
      val3 < 100000
    ) {
      // Reasonable ranges
      numStartIdx = i;
      break;
    }
  }

  if (numStartIdx > 0 && numStartIdx < parts.length - 2) {
    // Address is everything before the numbers
    const address = parts.slice(0, numStartIdx).join(' ');
    row.push(address);

    // Quantity, Unit Price, Total Amount
    row.push(parts[numStartIdx]);
    row.push(parts[numStartIdx + 1]);
    row.push(parts[numStartIdx + 2]);

    // Remaining fields: Status, Payment Mode, Billing Month, Reference Month, Year
    const rest = parts.slice(numStartIdx + 3);
    row.push(rest[0] || ''); // Status
    row.push(rest[1] || ''); // Payment Mode
    row.push(rest[2] || ''); // Billing Month
    row.push(rest[3] || ''); // Reference Month
    row.push(rest[4] || ''); // Year
  } else {
    // Fallback: try to identify by position
    // Expected: address (variable) qty price total status payment month month year
    if (parts.length >= 9) {
      // Find where quantity likely starts (first reasonable number after date)
      let qtyIdx = -1;
      for (let i = 0; i < parts.length; i++) {
        const num = parseFloat(parts[i]);
        if (!isNaN(num) && num > 0 && num < 1000 && i > 0) {
          qtyIdx = i;
          break;
        }
      }

      if (qtyIdx > 0 && qtyIdx + 5 < parts.length) {
        const address = parts.slice(0, qtyIdx).join(' ');
        row.push(address);
        row.push(parts[qtyIdx]); // Quantity
        row.push(parts[qtyIdx + 1]); // Unit Price
        row.push(parts[qtyIdx + 2]); // Total Amount
        row.push(parts[qtyIdx + 3]); // Status
        row.push(parts[qtyIdx + 4]); // Payment Mode
        row.push(parts[qtyIdx + 5]); // Billing Month
        row.push(parts[qtyIdx + 6] || ''); // Reference Month
        row.push(parts[qtyIdx + 7] || ''); // Year
      } else {
        // Last resort: simple split
        row.push(...parts);
      }
    } else {
      // Simple split
      row.push(...parts);
    }
  }

  // Ensure 11 columns
  while (row.length < 11) {
    row.push('');
  }

  return row.slice(0, 11);
}
