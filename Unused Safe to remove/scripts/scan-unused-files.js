#!/usr/bin/env node
// Comprehensive script to scan the entire project and identify files not used for running the project

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname, basename, dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Files and directories to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'dev-dist',
  'vite-backup',
  '.next',
  'build',
  'coverage',
  '.pnp',
  'package-lock.json',
  'homiebites_backend.log',
  '.DS_Store',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  '*.log',
];

// Entry points for the project
const ENTRY_POINTS = [
  // Web app (Next.js)
  'web/app/layout.jsx',
  'web/app/page.jsx',
  'web/app/**/page.jsx',
  'web/app/**/layout.jsx',
  
  // Admin app (Next.js)
  'admin/app/layout.jsx',
  'admin/app/page.jsx',
  'admin/app/**/page.jsx',
  'admin/app/**/layout.jsx',
  
  // Backend
  'backend/HomieBites/server.js',
  
  // Config files that are loaded
  'web/next.config.js',
  'admin/next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'postcss.config.cjs',
  'vite.config.js',
  '.eslintrc.json',
  'package.json',
  'web/package.json',
  'admin/package.json',
  'backend/package.json',
];

// Files that are always considered used (config, package files, etc.)
const ALWAYS_USED = [
  'package.json',
  'package-lock.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'postcss.config.cjs',
  'vite.config.js',
  '.eslintrc.json',
  '.gitignore',
  'vercel.json',
  'middleware.js',
  'index.html',
  'manifest.json',
  '.cursorrules',
];

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dir, fileList = [], baseDir = dir) {
  if (!existsSync(dir)) return fileList;
  
  try {
    const files = readdirSync(dir);
    
    files.forEach(file => {
      const filePath = join(dir, file);
      
      // Skip ignored patterns
      if (IGNORE_PATTERNS.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(file) || regex.test(filePath);
        }
        return filePath.includes(pattern) || file.includes(pattern);
      })) {
        return;
      }
      
      try {
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
          getAllFiles(filePath, fileList, baseDir);
        } else {
          fileList.push({
            path: filePath,
            relative: relative(baseDir, filePath),
            name: basename(filePath),
            ext: extname(filePath),
            dir: dirname(filePath),
          });
        }
      } catch (e) {
        // Skip files that can't be accessed
      }
    });
  } catch (e) {
    // Skip directories that can't be accessed
  }
  
  return fileList;
}

/**
 * Find all imports in a file
 */
function findImports(content, filePath) {
  const imports = new Set();
  
  // ES6 imports
  const importPatterns = [
    /import\s+['"]([^'"]+)['"]/g,
    /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,
    /import\(['"]([^'"]+)['"]\)/g,
    /export\s+.*\s+from\s+['"]([^'"]+)['"]/g,
  ];
  
  // CommonJS requires
  const requirePatterns = [
    /require\(['"]([^'"]+)['"]\)/g,
  ];
  
  // CSS imports
  const cssPatterns = [
    /@import\s+['"]([^'"]+\.css)['"]/g,
    /<link[^>]+href=['"]([^'"]+\.css)['"]/g,
  ];
  
  // Image/asset references
  const assetPatterns = [
    /src=['"]([^'"]+\.(png|jpg|jpeg|gif|svg|webp|ico))['"]/g,
    /href=['"]([^'"]+\.(png|jpg|jpeg|gif|svg|webp|ico))['"]/g,
    /url\(['"]?([^'")]+\.(png|jpg|jpeg|gif|svg|webp|ico))['"]?\)/g,
  ];
  
  // Next.js specific
  const nextPatterns = [
    /next\/image['"]/g,
    /next\/link['"]/g,
  ];
  
  const allPatterns = [
    ...importPatterns,
    ...requirePatterns,
    ...cssPatterns,
    ...assetPatterns,
  ];
  
  allPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) {
        imports.add(match[1]);
      }
    }
  });
  
  return imports;
}

/**
 * Resolve import path to actual file
 */
function resolveImportPath(importPath, fromFile) {
  const fromDir = dirname(fromFile);
  
  // Remove query strings and hashes
  importPath = importPath.split('?')[0].split('#')[0];
  
  // Handle shared directory imports (e.g., '../../shared/utils/...')
  if (importPath.includes('shared/')) {
    const sharedPath = importPath.split('shared/')[1];
    const fullSharedPath = join(rootDir, 'shared', sharedPath);
    
    const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
    for (const ext of extensions) {
      const withExt = fullSharedPath + ext;
      if (existsSync(withExt)) {
        return withExt;
      }
      
      // Try as directory with index
      const indexFile = join(fullSharedPath, `index${ext}`);
      if (existsSync(indexFile)) {
        return indexFile;
      }
    }
  }
  
  // Skip node_modules and external packages (but check if it's a relative path)
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    // Check if it's a path alias (like @/components)
    if (importPath.startsWith('@/') || importPath.startsWith('~/')) {
      // Try to resolve from root or web/admin directories
      const aliasPath = importPath.replace(/^@\/|~\//, '');
      const possibleRoots = [
        rootDir,
        join(rootDir, 'web'),
        join(rootDir, 'admin'),
      ];
      
      for (const root of possibleRoots) {
        const fullPath = join(root, aliasPath);
        const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
        for (const ext of extensions) {
          const withExt = fullPath + ext;
          if (existsSync(withExt)) {
            return withExt;
          }
        }
      }
    }
    return null;
  }
  
  // Resolve relative paths
  if (importPath.startsWith('.')) {
    let resolved = resolve(fromDir, importPath);
    
    // Try with extensions
    const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
    for (const ext of extensions) {
      const withExt = resolved + ext;
      if (existsSync(withExt)) {
        return withExt;
      }
      
      // Try as directory with index
      const indexFile = join(resolved, `index${ext}`);
      if (existsSync(indexFile)) {
        return indexFile;
      }
    }
    
    // Return the path even if file doesn't exist (might be dynamic)
    return resolved;
  }
  
  // Absolute paths (from project root)
  if (importPath.startsWith('/')) {
    const fullPath = join(rootDir, importPath);
    if (existsSync(fullPath)) {
      return fullPath;
    }
    
    // Try with extensions
    const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
    for (const ext of extensions) {
      const withExt = fullPath + ext;
      if (existsSync(withExt)) {
        return withExt;
      }
    }
  }
  
  return null;
}

/**
 * Find all Next.js app router files (page.jsx, layout.jsx, route.js, etc.)
 */
function findAppRouterFiles(appDir) {
  const files = [];
  const appPath = join(rootDir, appDir);
  
  if (!existsSync(appPath)) return files;
  
  function walkDir(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const name = entry.name.toLowerCase();
          // Next.js app router special files
          if (name === 'page.jsx' || name === 'page.js' || 
              name === 'layout.jsx' || name === 'layout.js' ||
              name === 'loading.jsx' || name === 'loading.js' ||
              name === 'error.jsx' || name === 'error.js' ||
              name === 'not-found.jsx' || name === 'not-found.js' ||
              name === 'template.jsx' || name === 'template.js' ||
              // Next.js API routes
              name === 'route.js' || name === 'route.jsx') {
            files.push(fullPath);
          }
        }
      });
    } catch (e) {
      // Skip directories that can't be accessed
    }
  }
  
  walkDir(appPath);
  return files;
}

/**
 * Find all files used from entry points
 */
function findUsedFiles() {
  const usedFiles = new Set();
  const checkedFiles = new Set();
  const toCheck = [];
  
  // Find all Next.js app router files
  const webAppFiles = findAppRouterFiles('web/app');
  const adminAppFiles = findAppRouterFiles('admin/app');
  
  console.log(`   Found ${webAppFiles.length} web app router files`);
  console.log(`   Found ${adminAppFiles.length} admin app router files`);
  
  // Add all app router files
  [...webAppFiles, ...adminAppFiles].forEach(file => {
    toCheck.push(file);
  });
  
  // Add other entry points
  ENTRY_POINTS.forEach(entry => {
    // Skip glob patterns (we handle app router separately)
    if (entry.includes('**')) {
      return;
    }
    
    const fullPath = join(rootDir, entry);
    if (existsSync(fullPath)) {
      toCheck.push(fullPath);
    }
  });
  
  // Add always-used files
  ALWAYS_USED.forEach(file => {
    const fullPath = join(rootDir, file);
    if (existsSync(fullPath)) {
      usedFiles.add(fullPath);
    }
    
    // Also check in subdirectories
    ['web', 'admin', 'backend'].forEach(dir => {
      const subPath = join(rootDir, dir, file);
      if (existsSync(subPath)) {
        usedFiles.add(subPath);
      }
    });
  });
  
  // Add public assets that are referenced
  const publicDirs = [
    join(rootDir, 'web/public'),
    join(rootDir, 'admin/public'),
  ];
  
  publicDirs.forEach(publicDir => {
    if (existsSync(publicDir)) {
      const files = getAllFiles(publicDir, [], rootDir);
      files.forEach(f => {
        // Public files are considered used if they exist
        usedFiles.add(f.path);
      });
    }
  });
  
  // Get all project files for flexible matching
  const allProjectFiles = getAllFiles(rootDir, [], rootDir);
  
  // Trace imports
  while (toCheck.length > 0) {
    const filePath = toCheck.shift();
    
    if (checkedFiles.has(filePath) || !existsSync(filePath)) {
      continue;
    }
    
    checkedFiles.add(filePath);
    usedFiles.add(filePath);
    
    try {
      const content = readFileSync(filePath, 'utf-8');
      const imports = findImports(content, filePath);
      
      imports.forEach(imp => {
        const resolved = resolveImportPath(imp, filePath);
        if (resolved && existsSync(resolved)) {
          if (!checkedFiles.has(resolved) && !toCheck.includes(resolved)) {
            toCheck.push(resolved);
          }
        } else if (resolved) {
          // Try to find the file with different extensions or in different locations
          const basePath = resolved.replace(/\.[^.]+$/, '');
          const possiblePaths = [
            basePath + '.js',
            basePath + '.jsx',
            basePath + '.ts',
            basePath + '.tsx',
            basePath + '.css',
            basePath + '.json',
            join(dirname(basePath), 'index.js'),
            join(dirname(basePath), 'index.jsx'),
          ];
          
          possiblePaths.forEach(possiblePath => {
            if (existsSync(possiblePath) && !checkedFiles.has(possiblePath) && !toCheck.includes(possiblePath)) {
              toCheck.push(possiblePath);
            }
          });
        } else {
          // Try flexible matching - find files that match the import pattern
          const importName = basename(imp, extname(imp));
          const importDir = dirname(imp);
          
          allProjectFiles.forEach(projectFile => {
            const projectName = basename(projectFile.path, projectFile.ext);
            const projectDir = relative(rootDir, dirname(projectFile.path));
            
            // Match by name and directory similarity
            if (projectName === importName || 
                projectFile.name.toLowerCase() === importName.toLowerCase() + projectFile.ext) {
              // Check if directory path matches
              if (importDir === '.' || 
                  projectDir.includes(importDir) || 
                  importDir.includes(projectDir) ||
                  projectFile.relative.includes(imp.replace(/^\.\.\//, ''))) {
                if (!checkedFiles.has(projectFile.path) && !toCheck.includes(projectFile.path)) {
                  toCheck.push(projectFile.path);
                }
              }
            }
          });
        }
      });
    } catch (e) {
      // Skip files that can't be read
    }
  }
  
  return usedFiles;
}

/**
 * Categorize unused files
 */
function categorizeFiles(files) {
  const categories = {
    js: [],
    css: [],
    config: [],
    docs: [],
    images: [],
    other: [],
  };
  
  files.forEach(file => {
    const ext = file.ext.toLowerCase();
    const name = file.name.toLowerCase();
    
    if (['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'].includes(ext)) {
      categories.js.push(file);
    } else if (ext === '.css') {
      categories.css.push(file);
    } else if (['.json', '.config.js', '.config.cjs', '.config.mjs'].some(e => name.includes(e) || ext === e)) {
      categories.config.push(file);
    } else if (ext === '.md') {
      categories.docs.push(file);
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].includes(ext)) {
      categories.images.push(file);
    } else {
      categories.other.push(file);
    }
  });
  
  return categories;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning project for unused files...\n');
  console.log('='.repeat(80));
  
  // Get all files
  console.log('\n📁 Collecting all files...');
  const allFiles = getAllFiles(rootDir, [], rootDir);
  console.log(`   Found ${allFiles.length} total files`);
  
  // Find used files
  console.log('\n🔗 Tracing file dependencies from entry points...');
  const usedFiles = findUsedFiles();
  console.log(`   Found ${usedFiles.size} used files`);
  
  // Find unused files (exclude scripts directory - those are utility scripts)
  console.log('\n❌ Identifying unused files...');
  const unusedFiles = allFiles.filter(f => {
    // Exclude scripts directory - those are utility scripts, not part of the running app
    if (f.relative.startsWith('scripts/')) {
      return false;
    }
    // Exclude test files
    if (f.name.includes('.test.') || f.name.includes('.spec.')) {
      return false;
    }
    return !usedFiles.has(f.path);
  });
  console.log(`   Found ${unusedFiles.length} potentially unused files`);
  
  // Categorize
  const categorized = categorizeFiles(unusedFiles);
  
  // Print results
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 UNUSED FILES REPORT\n');
  
  console.log(`Total unused files: ${unusedFiles.length}\n`);
  
  if (categorized.js.length > 0) {
    console.log(`\n📄 JavaScript/TypeScript files (${categorized.js.length}):`);
    categorized.js.forEach(f => {
      console.log(`   - ${f.relative}`);
    });
  }
  
  if (categorized.css.length > 0) {
    console.log(`\n🎨 CSS files (${categorized.css.length}):`);
    categorized.css.forEach(f => {
      console.log(`   - ${f.relative}`);
    });
  }
  
  if (categorized.config.length > 0) {
    console.log(`\n⚙️  Config files (${categorized.config.length}):`);
    categorized.config.forEach(f => {
      console.log(`   - ${f.relative}`);
    });
  }
  
  if (categorized.docs.length > 0) {
    console.log(`\n📚 Documentation files (${categorized.docs.length}):`);
    categorized.docs.forEach(f => {
      console.log(`   - ${f.relative}`);
    });
  }
  
  if (categorized.images.length > 0) {
    console.log(`\n🖼️  Image files (${categorized.images.length}):`);
    categorized.images.forEach(f => {
      console.log(`   - ${f.relative}`);
    });
  }
  
  if (categorized.other.length > 0) {
    console.log(`\n📦 Other files (${categorized.other.length}):`);
    categorized.other.forEach(f => {
      console.log(`   - ${f.relative}`);
    });
  }
  
  // Save to file
  const reportPath = join(rootDir, 'docs', 'UNUSED_FILES_REPORT.md');
  let reportContent = `# Unused Files Report\n\n`;
  reportContent += `Generated: ${new Date().toISOString()}\n\n`;
  reportContent += `Total unused files: ${unusedFiles.length}\n\n`;
  
  Object.entries(categorized).forEach(([category, files]) => {
    if (files.length > 0) {
      reportContent += `\n## ${category.toUpperCase()} (${files.length})\n\n`;
      files.forEach(f => {
        reportContent += `- \`${f.relative}\`\n`;
      });
    }
  });
  
  try {
    writeFileSync(reportPath, reportContent);
    console.log(`\n✅ Report saved to: ${reportPath}`);
  } catch (e) {
    console.log(`\n⚠️  Could not save report: ${e.message}`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Scan complete!\n');
}

// Run
main();

