#!/usr/bin/env node

/**
 * Simple converter: old data.md to Excel
 * Handles space-separated values
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const inputFile = path.join(projectRoot, 'docs', 'old data.md');
const outputFile = path.join(projectRoot, 'docs', 'old-data-import.csv');

console.log('📄 Converting old data to CSV format...\n');

try {
  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

  if (lines.length === 0) {
    throw new Error('File is empty');
  }

  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(/\s+/).filter((h) => h);

  console.log(`📋 Headers: ${headers.join(', ')}\n`);

  // Convert to CSV format
  const csvLines = [];
  csvLines.push(headers.join(',')); // Header row

  // Parse data rows - split by multiple spaces
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by 2+ spaces (tab-separated equivalent)
    const parts = line.split(/\s{2,}/);

    // If that doesn't work, try single space but be smarter about dates
    let values;
    if (parts.length >= headers.length) {
      values = parts.slice(0, headers.length);
    } else {
      // Manual parsing - look for date pattern
      const dateMatch = line.match(/(\d+\/\d+\/\d+)/);
      if (dateMatch) {
        const beforeDate = line.substring(0, dateMatch.index).trim();
        const date = dateMatch[0];
        const afterDate = line.substring(dateMatch.index + date.length).trim();

        const beforeParts = beforeDate.split(/\s+/);
        const afterParts = afterDate.split(/\s+/);

        values = [...beforeParts, date, ...afterParts].slice(0, headers.length);
      } else {
        values = line.split(/\s+/).slice(0, headers.length);
      }
    }

    // Ensure we have the right number of columns
    while (values.length < headers.length) {
      values.push('');
    }
    values = values.slice(0, headers.length);

    // Escape CSV values (handle commas and quotes)
    const escapedValues = values.map((v) => {
      const str = String(v || '').trim();
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });

    csvLines.push(escapedValues.join(','));
  }

  // Write CSV file
  fs.writeFileSync(outputFile, csvLines.join('\n'), 'utf-8');

  console.log(`✅ Converted ${csvLines.length - 1} orders to CSV!`);
  console.log(`📁 Output: ${outputFile}\n`);
  console.log('💡 You can:');
  console.log('   1. Open CSV in Excel and save as .xlsx');
  console.log('   2. Or import CSV directly (if supported)\n');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
