#!/usr/bin/env node
// Script to verify files are safe to delete before cleanup

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Files to check
const FILES_TO_CHECK = {
  // Backup files (safe)
  'web/next.config.js.backup': { safe: true, reason: 'Backup file' },
  
  // Old React Router files
  'web/App.jsx': { safe: false, reason: 'Check if Next.js is fully working' },
  'web/main.jsx': { safe: false, reason: 'Check if Next.js is fully working' },
  'web/index.html': { safe: false, reason: 'Check if Next.js is fully working' },
  'admin/App.jsx': { safe: false, reason: 'Check if Next.js is fully working' },
  'admin/main.jsx': { safe: false, reason: 'Check if Next.js is fully working' },
  'admin/index.html': { safe: false, reason: 'Check if Next.js is fully working' },
  
  // Old pages (only CSS files are used)
  'web/pages/MenuPage.jsx': { safe: true, reason: 'Only CSS is imported, JSX not used' },
  'web/pages/OffersPage.jsx': { safe: true, reason: 'Only CSS is imported, JSX not used' },
  'web/pages/AccountPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/AdminDashboardPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/AdminForgotPasswordPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/AdminPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/ErrorPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/FAQPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/HomePage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/LegalDisclaimerPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/NotFoundPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/PrivacyPolicyPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/SearchPage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  'web/pages/TermsOfServicePage.jsx': { safe: true, reason: 'Only imported in old App.jsx' },
  
  // CSS files
  'web/App.css': { safe: true, reason: 'Only used by old App.jsx' },
  
  // Vite configs (might be needed for vite:dev scripts)
  'web/vite.config.js': { safe: false, reason: 'Check if vite:dev scripts are used' },
  'admin/vite.config.js': { safe: false, reason: 'Check if vite:dev scripts are used' },
};

function checkFileUsage(filePath) {
  const fullPath = join(rootDir, filePath);
  
  if (!existsSync(fullPath)) {
    return { exists: false, used: false, imports: [] };
  }
  
  // Check if file is imported in Next.js app directories
  const nextJsDirs = ['web/app', 'admin/app'];
  const imports = [];
  
  try {
    // Search for imports in Next.js directories only
    for (const dir of nextJsDirs) {
      const searchPath = join(rootDir, dir);
      if (existsSync(searchPath)) {
        const fileName = filePath.split('/').pop();
        const baseName = fileName.replace(/\.[^.]+$/, '');
        
        try {
          const result = execSync(
            `grep -r "from.*['\"]\\.\\./.*${baseName}['\"]\\|import.*['\"]\\.\\./.*${baseName}['\"]\\|require.*['\"]\\.\\./.*${baseName}['\"]" ${searchPath} 2>/dev/null || true`,
            { encoding: 'utf-8', cwd: rootDir }
          );
          
          if (result.trim()) {
            imports.push(...result.trim().split('\n').filter(Boolean));
          }
        } catch (e) {
          // No matches
        }
      }
    }
  } catch (e) {
    // Error checking
  }
  
  return {
    exists: true,
    used: imports.length > 0,
    imports: imports,
  };
}

function checkNextJsWorking() {
  console.log('\n🔍 Checking Next.js setup...\n');
  
  const checks = {
    'web/app directory exists': existsSync(join(rootDir, 'web/app')),
    'admin/app directory exists': existsSync(join(rootDir, 'admin/app')),
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
  console.log('🔍 Verifying files are safe to delete...\n');
  console.log('='.repeat(60));
  
  // Check Next.js setup first
  const nextJsWorking = checkNextJsWorking();
  
  if (!nextJsWorking) {
    console.log('\n⚠️  WARNING: Next.js setup incomplete!');
    console.log('   Do NOT delete old files until Next.js is fully working.\n');
  }
  
  console.log('\n📋 File Safety Check:\n');
  console.log('='.repeat(60));
  
  const safeToDelete = [];
  const unsafeToDelete = [];
  const notFound = [];
  
  for (const [filePath, info] of Object.entries(FILES_TO_CHECK)) {
    const usage = checkFileUsage(filePath);
    const fullPath = join(rootDir, filePath);
    const exists = existsSync(fullPath);
    
    if (!exists) {
      notFound.push(filePath);
      continue;
    }
    
    const isSafe = info.safe && (!usage.used || !nextJsWorking);
    const status = isSafe ? '✅ SAFE' : '⚠️  VERIFY';
    
    console.log(`\n${status} ${filePath}`);
    console.log(`   Reason: ${info.reason}`);
    
    if (usage.used) {
      console.log(`   ⚠️  Found ${usage.imports.length} import(s) in Next.js directories:`);
      usage.imports.slice(0, 3).forEach(imp => {
        console.log(`      - ${imp.substring(0, 80)}`);
      });
      if (usage.imports.length > 3) {
        console.log(`      ... and ${usage.imports.length - 3} more`);
      }
    }
    
    if (isSafe && nextJsWorking) {
      safeToDelete.push(filePath);
    } else {
      unsafeToDelete.push({ file: filePath, reason: info.reason, usage });
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:\n');
  console.log(`✅ Safe to delete: ${safeToDelete.length}`);
  console.log(`⚠️  Verify before deleting: ${unsafeToDelete.length}`);
  console.log(`❌ Not found: ${notFound.length}`);
  
  if (safeToDelete.length > 0) {
    console.log('\n✅ Files safe to delete:');
    safeToDelete.forEach(f => console.log(`   - ${f}`));
  }
  
  if (unsafeToDelete.length > 0) {
    console.log('\n⚠️  Files to verify before deleting:');
    unsafeToDelete.forEach(({ file, reason }) => {
      console.log(`   - ${file}`);
      console.log(`     ${reason}`);
    });
  }
  
  if (notFound.length > 0) {
    console.log('\n❌ Files not found (already deleted?):');
    notFound.forEach(f => console.log(`   - ${f}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Recommendations:');
  
  if (!nextJsWorking) {
    console.log('   1. Complete Next.js migration before deleting old files');
  } else {
    console.log('   1. Next.js is set up correctly ✅');
  }
  
  if (safeToDelete.length > 0) {
    console.log(`   2. You can safely delete ${safeToDelete.length} file(s)`);
    console.log('   3. Run: npm run cleanup:dead files');
  } else {
    console.log('   2. No files are confirmed safe to delete yet');
    console.log('   3. Verify Next.js is working, then re-run this check');
  }
  
  console.log('\n');
}

main();

