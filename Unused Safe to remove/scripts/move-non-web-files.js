#!/usr/bin/env node
// Script to move all files/folders NOT needed for localhost:3000 (web app)

import { readdirSync, statSync, existsSync, renameSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const targetDir = join(rootDir, 'Unused Safe to remove');

// Directories/files to KEEP (needed for localhost:3000 - web app)
const KEEP_PATTERNS = [
  'web',                    // Web app (port 3000)
  'backend',                // Backend API (used by web app)
  'shared',                 // Shared resources (used by web app)
  'package.json',           // Root package.json
  'package-lock.json',      // Root package-lock.json
  '.git',                   // Git directory
  '.gitignore',             // Git ignore
  '.cursorrules',           // Cursor rules
  'node_modules',           // Dependencies
  '.env',                   // Environment files
  '.env.local',
  '.env.development.local',
  '.env.production.local',
  'README.md',              // Main README (we'll keep this)
];

// Directories/files to MOVE (not needed for localhost:3000)
const MOVE_PATTERNS = [
  'admin',                  // Admin app (port 3002 - separate)
  'scripts',                // Utility scripts
  'docs',                   // Documentation
  '.vscode',                // VS Code settings
  '.stylelintrc.json',      // Stylelint config
  'Unused Safe to remove',  // Already moved files (don't move this folder itself)
];

function shouldKeep(item) {
  return KEEP_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(item);
    }
    return item === pattern || item.startsWith(pattern + '/');
  });
}

function shouldMove(item) {
  // Don't move if it should be kept
  if (shouldKeep(item)) {
    return false;
  }
  
  // Don't move the target directory itself
  if (item === 'Unused Safe to remove' || item.startsWith('Unused Safe to remove/')) {
    return false;
  }
  
  // Move if it matches move patterns
  return MOVE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(item);
    }
    return item === pattern || item.startsWith(pattern + '/');
  });
}

function moveItem(sourcePath, relativePath) {
  const targetPath = join(targetDir, relativePath);
  
  try {
    // Create target directory structure
    const targetItemDir = dirname(targetPath);
    if (!existsSync(targetItemDir)) {
      mkdirSync(targetItemDir, { recursive: true });
    }
    
    // Move the item
    renameSync(sourcePath, targetPath);
    return true;
  } catch (error) {
    console.error(`❌ Error moving ${relativePath}: ${error.message}`);
    return false;
  }
}

function processDirectory(dir, relativePath = '') {
  if (!existsSync(dir)) {
    return { moved: 0, errors: 0 };
  }
  
  let moved = 0;
  let errors = 0;
  
  try {
    const items = readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = join(dir, item);
      const itemRelative = relativePath ? `${relativePath}/${item}` : item;
      
      // Skip if should keep
      if (shouldKeep(itemRelative)) {
        return;
      }
      
      // Check if should move
      if (shouldMove(itemRelative)) {
        if (moveItem(itemPath, itemRelative)) {
          console.log(`✅ Moved: ${itemRelative}`);
          moved++;
        } else {
          errors++;
        }
        return;
      }
      
      // If it's a directory and we're not sure, check its contents
      try {
        const stat = statSync(itemPath);
        if (stat.isDirectory()) {
          // Recursively process subdirectories
          const result = processDirectory(itemPath, itemRelative);
          moved += result.moved;
          errors += result.errors;
        } else {
          // It's a file that doesn't match keep or move patterns
          // Move it to be safe (it's not needed for web app)
          if (moveItem(itemPath, itemRelative)) {
            console.log(`✅ Moved: ${itemRelative}`);
            moved++;
          } else {
            errors++;
          }
        }
      } catch (e) {
        // Skip items that can't be accessed
      }
    });
  } catch (e) {
    console.error(`❌ Error processing ${relativePath}: ${e.message}`);
    errors++;
  }
  
  return { moved, errors };
}

// Main execution
console.log('📦 Moving all files/folders NOT needed for localhost:3000 (web app)...\n');
console.log('='.repeat(80));
console.log('\nKEEPING (for localhost:3000):');
console.log('  - web/ (web app)');
console.log('  - backend/ (API server)');
console.log('  - shared/ (shared resources)');
console.log('  - package.json, node_modules, .git, etc.\n');
console.log('MOVING (not needed for localhost:3000):');
console.log('  - admin/ (runs on port 3002)');
console.log('  - scripts/ (utility scripts)');
console.log('  - docs/ (documentation)');
console.log('  - Other config files\n');
console.log('='.repeat(80) + '\n');

// Ensure target directory exists
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Process root directory
const result = processDirectory(rootDir);

console.log('\n' + '='.repeat(80));
console.log('\n📊 Summary:');
console.log(`   ✅ Moved: ${result.moved} items`);
console.log(`   ❌ Errors: ${result.errors}`);
console.log(`\n✅ Done! All non-web files moved to: "Unused Safe to remove" folder`);
console.log('\n💡 Next steps:');
console.log('   1. Test the web app: npm run dev');
console.log('   2. Check if everything works on localhost:3000');
console.log('   3. If issues found, restore files from "Unused Safe to remove"');

