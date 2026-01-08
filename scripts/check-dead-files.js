#!/usr/bin/env node
// Script to find dead CSS, files, and documentation

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Files to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'dev-dist',
  'vite-backup',
  '.next',
  'package-lock.json',
  'homiebites_backend.log',
];

// Documentation files that are likely outdated/redundant
const DOCS_TO_CHECK = [
  // Migration docs (likely outdated after migration)
  'MIGRATION_COMPLETE.md',
  'MIGRATION_VERIFICATION.md',
  'NEXTJS_MIGRATION_PLAN.md',
  'NEXTJS_OPTIMIZATION_PLAN.md',
  'TAILWIND_MIGRATION_*.md',
  'REFACTORING_*.md',
  'SEPARATION_COMPLETE.md',
  'STRUCTURAL_REFACTOR.md',
  
  // Status/verification docs (likely outdated)
  'IMPLEMENTATION_STATUS.md',
  'IMPLEMENTATION_CHECKLIST.md',
  'DASHBOARD_VERIFICATION.md',
  'DESIGN_VERIFICATION_*.md',
  'CALCULATIONS_VERIFICATION.md',
  
  // Old plan docs
  'FULL_DASHBOARD_PLAN_COMPARISON.md',
  'COMPONENT_EXTRACTION_PLAN.md',
];

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (IGNORE_PATTERNS.some(pattern => filePath.includes(pattern))) {
      return;
    }
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function findImports(content, filePath) {
  const imports = new Set();
  const importPatterns = [
    /import\s+['"]([^'"]+)['"]/g,
    /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,
    /require\(['"]([^'"]+)['"]\)/g,
    /<link[^>]+href=['"]([^'"]+\.css)['"]/g,
    /@import\s+['"]([^'"]+)['"]/g,
  ];
  
  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      imports.add(match[1]);
    }
  });
  
  return imports;
}

function resolveImportPath(importPath, fromFile) {
  // Remove file extension and resolve relative paths
  if (importPath.startsWith('.')) {
    const baseDir = dirname(fromFile);
    return join(baseDir, importPath);
  }
  return importPath;
}

function checkDeadCSS() {
  console.log('\n🔍 Checking for dead CSS files...\n');
  
  const cssFiles = getAllFiles(rootDir).filter(f => 
    f.endsWith('.css') && !IGNORE_PATTERNS.some(p => f.includes(p))
  );
  
  const allFiles = getAllFiles(rootDir).filter(f => {
    const ext = extname(f);
    return ['.js', '.jsx', '.ts', '.tsx', '.html'].includes(ext) &&
           !IGNORE_PATTERNS.some(p => f.includes(p));
  });
  
  const usedCSS = new Set();
  
  // Check all JS/JSX/HTML files for CSS imports
  allFiles.forEach(file => {
    try {
      const content = readFileSync(file, 'utf-8');
      const imports = findImports(content, file);
      
      imports.forEach(imp => {
        if (imp.endsWith('.css')) {
          const resolved = resolveImportPath(imp, file);
          cssFiles.forEach(cssFile => {
            const cssName = basename(cssFile);
            const cssRelPath = cssFile.replace(rootDir + '/', '');
            if (imp.includes(cssName) || imp.includes(cssRelPath)) {
              usedCSS.add(cssFile);
            }
          });
        }
      });
    } catch (e) {
      // Skip files that can't be read
    }
  });
  
  const deadCSS = cssFiles.filter(f => !usedCSS.has(f));
  
  console.log(`Found ${cssFiles.length} CSS files`);
  console.log(`Used: ${usedCSS.size}`);
  console.log(`Potentially dead: ${deadCSS.length}\n`);
  
  if (deadCSS.length > 0) {
    console.log('⚠️  Potentially unused CSS files:');
    deadCSS.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  } else {
    console.log('✅ All CSS files appear to be used');
  }
  
  return deadCSS;
}

function checkDeadJSFiles() {
  console.log('\n🔍 Checking for potentially dead JS/JSX files...\n');
  
  const jsFiles = getAllFiles(rootDir).filter(f => {
    const ext = extname(f);
    return ['.js', '.jsx'].includes(ext) &&
           !IGNORE_PATTERNS.some(p => f.includes(p)) &&
           !f.includes('node_modules') &&
           !f.includes('scripts/') && // Skip scripts
           !f.includes('.test.') &&
           !f.includes('.spec.');
  });
  
  const entryPoints = [
    'web/app/page.jsx',
    'web/app/layout.jsx',
    'admin/app/page.jsx',
    'admin/app/layout.jsx',
    'admin/AdminDashboard.jsx',
    'backend/HomieBites/server.js',
  ];
  
  const usedFiles = new Set();
  const toCheck = [...entryPoints];
  
  while (toCheck.length > 0) {
    const file = toCheck.shift();
    const filePath = join(rootDir, file);
    
    if (!existsSync(filePath) || usedFiles.has(filePath)) continue;
    
    usedFiles.add(filePath);
    
    try {
      const content = readFileSync(filePath, 'utf-8');
      const imports = findImports(content, filePath);
      
      imports.forEach(imp => {
        // Resolve import to actual file
        jsFiles.forEach(jsFile => {
          const jsName = basename(jsFile, extname(jsFile));
          const jsRelPath = jsFile.replace(rootDir + '/', '');
          
          if (imp.includes(jsName) || imp.includes(jsRelPath.replace(extname(jsRelPath), ''))) {
            if (!usedFiles.has(jsFile) && !toCheck.includes(jsRelPath)) {
              toCheck.push(jsRelPath);
            }
          }
        });
      });
    } catch (e) {
      // Skip
    }
  }
  
  // Check for old Next.js pages that might be unused
  const oldPages = jsFiles.filter(f => {
    const relPath = f.replace(rootDir + '/', '');
    return (
      (relPath.startsWith('web/pages/') || relPath.startsWith('admin/pages/')) &&
      !relPath.includes('App.jsx') &&
      !relPath.includes('index.jsx')
    );
  });
  
  // Check for old App.jsx/main.jsx that might be unused in Next.js
  const oldAppFiles = jsFiles.filter(f => {
    const relPath = f.replace(rootDir + '/', '');
    const name = basename(f);
    return (
      (name === 'App.jsx' || name === 'main.jsx' || name === 'index.jsx') &&
      (relPath.startsWith('web/') || relPath.startsWith('admin/')) &&
      !relPath.includes('app/')
    );
  });
  
  console.log(`Found ${jsFiles.length} JS/JSX files`);
  console.log(`Checked from entry points: ${usedFiles.size}`);
  console.log(`Old pages directory files: ${oldPages.length}`);
  console.log(`Old App.jsx/main.jsx files: ${oldAppFiles.length}\n`);
  
  if (oldPages.length > 0) {
    console.log('⚠️  Old pages directory files (might be unused in Next.js):');
    oldPages.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  }
  
  if (oldAppFiles.length > 0) {
    console.log('\n⚠️  Old App.jsx/main.jsx files (might be unused in Next.js):');
    oldAppFiles.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  }
  
  return { oldPages, oldAppFiles };
}

function checkDeadDocs() {
  console.log('\n🔍 Checking documentation files...\n');
  
  const docFiles = getAllFiles(rootDir).filter(f => 
    f.endsWith('.md') && !IGNORE_PATTERNS.some(p => f.includes(p))
  );
  
  console.log(`Found ${docFiles.length} documentation files\n`);
  
  // Categorize docs
  const migrationDocs = docFiles.filter(f => 
    basename(f).includes('MIGRATION') || 
    basename(f).includes('REFACTORING') ||
    basename(f).includes('SEPARATION') ||
    basename(f).includes('STRUCTURAL')
  );
  
  const statusDocs = docFiles.filter(f =>
    basename(f).includes('STATUS') ||
    basename(f).includes('VERIFICATION') ||
    basename(f).includes('CHECKLIST') ||
    basename(f).includes('COMPLETE') ||
    basename(f).includes('SUMMARY')
  );
  
  const planDocs = docFiles.filter(f =>
    basename(f).includes('PLAN') ||
    basename(f).includes('GUIDE')
  );
  
  console.log('📚 Documentation categories:');
  console.log(`   Migration/Refactoring docs: ${migrationDocs.length}`);
  console.log(`   Status/Verification docs: ${statusDocs.length}`);
  console.log(`   Plan/Guide docs: ${planDocs.length}`);
  console.log(`   Other docs: ${docFiles.length - migrationDocs.length - statusDocs.length - planDocs.length}\n`);
  
  if (migrationDocs.length > 0) {
    console.log('⚠️  Migration/Refactoring docs (likely outdated after migration):');
    migrationDocs.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  }
  
  if (statusDocs.length > 0) {
    console.log('\n⚠️  Status/Verification docs (might be outdated):');
    statusDocs.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  }
  
  return { migrationDocs, statusDocs, planDocs };
}

function checkOldFiles() {
  console.log('\n🔍 Checking for old/unused files...\n');
  
  const suspiciousFiles = [];
  
  // Check for backup files
  const backupFiles = getAllFiles(rootDir).filter(f =>
    f.includes('.backup') ||
    f.includes('.old') ||
    f.includes('backup') ||
    f.includes('vite-backup')
  );
  
  // Check for old CSS files in components that might not be used
  const oldComponentCSS = getAllFiles(rootDir).filter(f =>
    f.endsWith('.css') &&
    (f.includes('web/pages/') || f.includes('admin/pages/'))
  );
  
  console.log(`Backup files: ${backupFiles.length}`);
  console.log(`Old component CSS in pages/: ${oldComponentCSS.length}\n`);
  
  if (backupFiles.length > 0) {
    console.log('⚠️  Backup files found:');
    backupFiles.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  }
  
  if (oldComponentCSS.length > 0) {
    console.log('\n⚠️  Old CSS files in pages directory:');
    oldComponentCSS.forEach(f => {
      console.log(`   - ${f.replace(rootDir + '/', '')}`);
    });
  }
  
  return { backupFiles, oldComponentCSS };
}

// Run all checks
console.log('🔍 Starting comprehensive file analysis...\n');
console.log('=' .repeat(60));

const deadCSS = checkDeadCSS();
const deadJS = checkDeadJSFiles();
const deadDocs = checkDeadDocs();
const oldFiles = checkOldFiles();

console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary:');
console.log(`   Dead CSS files: ${deadCSS.length}`);
console.log(`   Old pages files: ${deadJS.oldPages.length}`);
console.log(`   Old App.jsx files: ${deadJS.oldAppFiles.length}`);
console.log(`   Migration docs: ${deadDocs.migrationDocs.length}`);
console.log(`   Status docs: ${deadDocs.statusDocs.length}`);
console.log(`   Backup files: ${oldFiles.backupFiles.length}`);
console.log(`   Old component CSS: ${oldFiles.oldComponentCSS.length}`);

console.log('\n✅ Analysis complete!\n');

