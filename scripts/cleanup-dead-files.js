#!/usr/bin/env node
// Script to safely clean up dead files

import { unlinkSync, rmdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Files to delete (verified as unused)
const FILES_TO_DELETE = [
  // Backup files
  'web/next.config.js.backup',
  
  // Old Vite entry points (if Next.js is fully working)
  // Uncomment these after verifying Next.js works:
  // 'web/App.jsx',
  // 'web/main.jsx',
  // 'web/index.html',
  // 'admin/App.jsx',
  // 'admin/main.jsx',
  // 'admin/index.html',
  
  // Old pages (after verifying Next.js routes work)
  // 'web/pages/AccountPage.jsx',
  // 'web/pages/AdminDashboardPage.jsx',
  // 'web/pages/AdminForgotPasswordPage.jsx',
  // 'web/pages/AdminPage.jsx',
  // 'web/pages/ErrorPage.jsx',
  // 'web/pages/FAQPage.jsx',
  // 'web/pages/HomePage.jsx',
  // 'web/pages/LegalDisclaimerPage.jsx',
  // 'web/pages/MenuPage.jsx', // ⚠️ CSS still used
  // 'web/pages/NotFoundPage.jsx',
  // 'web/pages/OffersPage.jsx', // ⚠️ CSS still used
  // 'web/pages/PrivacyPolicyPage.jsx',
  // 'web/pages/SearchPage.jsx',
  // 'web/pages/TermsOfServicePage.jsx',
  
  // Potentially unused CSS (verify first)
  // 'web/App.css', // Check if imported
];

// Directories to delete
const DIRS_TO_DELETE = [
  // 'web/vite-backup',
  // 'admin/vite-backup',
];

// Documentation files to archive (move to docs/archive/)
const DOCS_TO_ARCHIVE = [
  // Migration docs
  'API_MIGRATION_GUIDE.md',
  'MIGRATION_COMPLETE.md',
  'MIGRATION_VERIFICATION.md',
  'NEXTJS_MIGRATION_PLAN.md',
  'NEXTJS_OPTIMIZATION_PLAN.md',
  'TAILWIND_MIGRATION_ANALYSIS.md',
  'TAILWIND_MIGRATION_COMPLETE.md',
  'TAILWIND_MIGRATION_GUIDE.md',
  'TAILWIND_MIGRATION_PLAN.md',
  'TAILWIND_MIGRATION_SUMMARY.md',
  'TAILWIND_FIX.md',
  'TAILWIND_SETUP_PLAN.md',
  
  // Refactoring docs
  'admin/REFACTORING_COMPLETE_SUMMARY.md',
  'admin/REFACTORING_PLAN.md',
  'admin/REFACTORING_PROGRESS.md',
  'admin/REFACTORING_SUMMARY.md',
  'admin/SEPARATION_COMPLETE.md',
  'admin/STRUCTURAL_REFACTOR.md',
  
  // Status/Verification docs
  'CHANGES_SUMMARY.md',
  'CSS_CLEANUP_COMPLETE.md',
  'DASHBOARD_IMPLEMENTATION_STATUS.md',
  'DASHBOARD_VERIFICATION.md',
  'DATA_FLOW_VERIFICATION.md',
  'DESIGN_VERIFICATION_DETAILED.md',
  'DESIGN_VERIFICATION_REPORT.md',
  'DETAILED_TAB_VERIFICATION.md',
  'DOCUMENT_VERIFICATION_REPORT.md',
  'IMPLEMENTATION_CHECKLIST.md',
  'IMPLEMENTATION_STATUS.md',
  'IMPLEMENTATION_SUMMARY.md',
  'admin/CALCULATIONS_VERIFICATION.md',
  'admin/MASTER_ORDERS_IMPLEMENTATION_STATUS.md',
  
  // Plan docs
  'FULL_DASHBOARD_PLAN_COMPARISON.md',
  'admin/FULL_DASHBOARD_PLAN_COMPARISON.md',
  'admin/COMPONENT_EXTRACTION_PLAN.md',
  'CURRENT_MONTH_TAB_COMPARISON.md',
];

function deleteFiles() {
  console.log('🗑️  Deleting files...\n');
  
  let deleted = 0;
  let errors = 0;
  
  FILES_TO_DELETE.forEach(file => {
    const filePath = join(rootDir, file);
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        console.log(`✅ Deleted: ${file}`);
        deleted++;
      } catch (error) {
        console.error(`❌ Error deleting ${file}:`, error.message);
        errors++;
      }
    } else {
      console.log(`⚠️  Not found: ${file}`);
    }
  });
  
  console.log(`\n📊 Deleted: ${deleted}, Errors: ${errors}\n`);
}

function deleteDirs() {
  console.log('🗑️  Deleting directories...\n');
  
  let deleted = 0;
  let errors = 0;
  
  DIRS_TO_DELETE.forEach(dir => {
    const dirPath = join(rootDir, dir);
    if (existsSync(dirPath)) {
      try {
        rmdirSync(dirPath, { recursive: true });
        console.log(`✅ Deleted: ${dir}`);
        deleted++;
      } catch (error) {
        console.error(`❌ Error deleting ${dir}:`, error.message);
        errors++;
      }
    } else {
      console.log(`⚠️  Not found: ${dir}`);
    }
  });
  
  console.log(`\n📊 Deleted: ${deleted}, Errors: ${errors}\n`);
}

function archiveDocs() {
  console.log('📚 Archiving documentation...\n');
  
  const archiveDir = join(rootDir, 'docs', 'archive');
  
  // Create archive directory if it doesn't exist
  if (!existsSync(archiveDir)) {
    try {
      const { mkdirSync } = await import('fs');
      mkdirSync(archiveDir, { recursive: true });
      console.log(`✅ Created archive directory: ${archiveDir}`);
    } catch (error) {
      console.error(`❌ Error creating archive directory:`, error.message);
      return;
    }
  }
  
  let archived = 0;
  let errors = 0;
  
  DOCS_TO_ARCHIVE.forEach(doc => {
    const sourcePath = join(rootDir, doc);
    const fileName = doc.includes('/') ? doc.split('/').pop() : doc;
    const destPath = join(archiveDir, fileName);
    
    if (existsSync(sourcePath)) {
      try {
        const { copyFileSync } = await import('fs');
        copyFileSync(sourcePath, destPath);
        unlinkSync(sourcePath);
        console.log(`✅ Archived: ${doc}`);
        archived++;
      } catch (error) {
        console.error(`❌ Error archiving ${doc}:`, error.message);
        errors++;
      }
    } else {
      console.log(`⚠️  Not found: ${doc}`);
    }
  });
  
  console.log(`\n📊 Archived: ${archived}, Errors: ${errors}\n`);
}

// Main execution
const args = process.argv.slice(2);
const command = args[0] || 'all';

console.log('🧹 Dead Files Cleanup Script\n');
console.log('='.repeat(60));

if (command === 'files' || command === 'all') {
  deleteFiles();
}

if (command === 'dirs' || command === 'all') {
  deleteDirs();
}

if (command === 'docs' || command === 'all') {
  archiveDocs();
}

if (command === 'all') {
  console.log('✅ Cleanup complete!');
  console.log('\n⚠️  Note: Some files are commented out for safety.');
  console.log('   Review DEAD_FILES_REPORT.md and uncomment files to delete.');
}

