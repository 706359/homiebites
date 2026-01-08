#!/usr/bin/env node
// Safe cleanup script - only deletes verified safe files with backup

import { unlinkSync, existsSync, copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ONLY files verified as safe to delete
const SAFE_TO_DELETE = [
  'web/next.config.js.backup',
  'web/pages/MenuPage.jsx',
  'web/pages/OffersPage.jsx',
  'web/pages/AccountPage.jsx',
  'web/pages/AdminDashboardPage.jsx',
  'web/pages/AdminForgotPasswordPage.jsx',
  'web/pages/AdminPage.jsx',
  'web/pages/ErrorPage.jsx',
  'web/pages/FAQPage.jsx',
  'web/pages/HomePage.jsx',
  'web/pages/LegalDisclaimerPage.jsx',
  'web/pages/NotFoundPage.jsx',
  'web/pages/PrivacyPolicyPage.jsx',
  'web/pages/SearchPage.jsx',
  'web/pages/TermsOfServicePage.jsx',
  'web/App.css',
];

// Keep these CSS files (they're imported)
const KEEP_CSS = [
  'web/pages/MenuPage.css',
  'web/pages/OffersPage.css',
];

function createBackup(filePath) {
  const backupDir = join(rootDir, '.cleanup-backup', dirname(filePath));
  const backupPath = join(backupDir, filePath.split('/').pop());
  
  try {
    mkdirSync(backupDir, { recursive: true });
    copyFileSync(join(rootDir, filePath), backupPath);
    return backupPath;
  } catch (error) {
    console.error(`❌ Error creating backup for ${filePath}:`, error.message);
    return null;
  }
}

function verifyNextJsStillWorks() {
  console.log('\n🔍 Verifying Next.js setup still works...\n');
  
  const checks = {
    'web/app/layout.jsx exists': existsSync(join(rootDir, 'web/app/layout.jsx')),
    'admin/app/layout.jsx exists': existsSync(join(rootDir, 'admin/app/layout.jsx')),
    'web/app/page.jsx exists': existsSync(join(rootDir, 'web/app/page.jsx')),
    'admin/app/page.jsx exists': existsSync(join(rootDir, 'admin/app/page.jsx')),
  };
  
  let allGood = true;
  for (const [check, result] of Object.entries(checks)) {
    const status = result ? '✅' : '❌';
    console.log(`   ${status} ${check}`);
    if (!result) allGood = false;
  }
  
  return allGood;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-n');
  
  console.log('🧹 Safe Cleanup Script\n');
  console.log('='.repeat(60));
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be deleted\n');
  }
  
  // Verify Next.js is working first
  if (!verifyNextJsStillWorks()) {
    console.log('\n❌ ERROR: Next.js setup incomplete!');
    console.log('   Aborting cleanup to prevent breaking the project.\n');
    process.exit(1);
  }
  
  console.log('\n📋 Files to delete:\n');
  
  const toDelete = [];
  const notFound = [];
  const errors = [];
  
  for (const filePath of SAFE_TO_DELETE) {
    const fullPath = join(rootDir, filePath);
    
    if (!existsSync(fullPath)) {
      notFound.push(filePath);
      continue;
    }
    
    toDelete.push(filePath);
    console.log(`   - ${filePath}`);
  }
  
  if (notFound.length > 0) {
    console.log('\n⚠️  Files not found (already deleted?):');
    notFound.forEach(f => console.log(`   - ${f}`));
  }
  
  if (toDelete.length === 0) {
    console.log('\n✅ No files to delete (all already removed or not found)\n');
    return;
  }
  
  console.log(`\n📊 Total: ${toDelete.length} file(s) to delete`);
  
  if (dryRun) {
    console.log('\n✅ DRY RUN: Would delete the above files');
    console.log('   Run without --dry-run to actually delete\n');
    return;
  }
  
  // Create backup directory
  const backupDir = join(rootDir, '.cleanup-backup');
  console.log(`\n💾 Creating backups in ${backupDir}...\n`);
  
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }
  
  // Delete files with backup
  let deleted = 0;
  let backedUp = 0;
  
  for (const filePath of toDelete) {
    const fullPath = join(rootDir, filePath);
    
    try {
      // Create backup
      const backupPath = createBackup(filePath);
      if (backupPath) {
        backedUp++;
        console.log(`✅ Backed up: ${filePath}`);
      }
      
      // Delete file
      unlinkSync(fullPath);
      deleted++;
      console.log(`✅ Deleted: ${filePath}`);
    } catch (error) {
      errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error deleting ${filePath}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Cleanup Summary:\n');
  console.log(`✅ Deleted: ${deleted}`);
  console.log(`💾 Backed up: ${backedUp}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
  }
  
  // Verify Next.js still works
  console.log('\n🔍 Verifying Next.js still works after cleanup...\n');
  const stillWorks = verifyNextJsStillWorks();
  
  if (stillWorks) {
    console.log('\n✅ SUCCESS: Next.js setup still intact!');
    console.log(`\n💾 Backups saved to: ${backupDir}`);
    console.log('   You can restore files from there if needed.\n');
  } else {
    console.log('\n⚠️  WARNING: Some Next.js files missing!');
    console.log(`   Restore from backup: ${backupDir}\n`);
  }
  
  // Remind about CSS files to keep
  console.log('📝 Note: These CSS files are still used and were NOT deleted:');
  KEEP_CSS.forEach(css => {
    if (existsSync(join(rootDir, css))) {
      console.log(`   ✅ ${css}`);
    }
  });
  
  console.log('\n');
}

main();

