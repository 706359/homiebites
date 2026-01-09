#!/usr/bin/env node
// Script to move unused files to "Unused Safe to remove" folder

import { readFileSync, existsSync, mkdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const targetDir = join(rootDir, 'Unused Safe to remove');

// Read the unused files report
const reportPath = join(rootDir, 'docs', 'UNUSED_FILES_REPORT.md');
const reportContent = readFileSync(reportPath, 'utf-8');

// Extract file paths from the report
const filePaths = [];
const lines = reportContent.split('\n');

let currentSection = '';
lines.forEach(line => {
  // Detect section headers
  if (line.startsWith('## ')) {
    currentSection = line.replace('## ', '').trim();
    return;
  }
  
  // Extract file paths (lines starting with - `)
  if (line.trim().startsWith('- `') && line.includes('`')) {
    const match = line.match(/- `([^`]+)`/);
    if (match && match[1]) {
      const filePath = match[1].trim();
      // Skip docs section - we'll keep those in docs folder
      if (currentSection !== 'DOCS') {
        filePaths.push(filePath);
      }
    }
  }
});

console.log(`📦 Moving ${filePaths.length} unused files to "Unused Safe to remove" folder...\n`);

let movedCount = 0;
let skippedCount = 0;
let errorCount = 0;

filePaths.forEach(relativePath => {
  const sourcePath = join(rootDir, relativePath);
  const targetPath = join(targetDir, relativePath);
  
  if (!existsSync(sourcePath)) {
    console.log(`⚠️  File not found: ${relativePath}`);
    skippedCount++;
    return;
  }
  
  try {
    // Create target directory structure
    const targetFileDir = dirname(targetPath);
    if (!existsSync(targetFileDir)) {
      mkdirSync(targetFileDir, { recursive: true });
    }
    
    // Move the file
    renameSync(sourcePath, targetPath);
    console.log(`✅ Moved: ${relativePath}`);
    movedCount++;
  } catch (error) {
    console.error(`❌ Error moving ${relativePath}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Moved: ${movedCount}`);
console.log(`   ⚠️  Skipped: ${skippedCount}`);
console.log(`   ❌ Errors: ${errorCount}`);
console.log(`\n✅ Done! Files moved to: "Unused Safe to remove" folder`);

