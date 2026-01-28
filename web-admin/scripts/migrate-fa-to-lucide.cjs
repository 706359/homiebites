#!/usr/bin/env node
/**
 * Migrate Font Awesome <i className="fa-solid fa-XXX"> to Lucide <Icon name="XXX" />.
 * Run from project root: node scripts/migrate-fa-to-lucide.js
 * Adds Icon import if missing. Handles common patterns only; review output.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function getIconImportPath(filePath) {
  const iconFullPath = path.join(ROOT, 'components', 'ui', 'Icon.jsx');
  return path.relative(path.dirname(filePath), iconFullPath).replace(/\\/g, '/');
}

function addIconImport(content, filePath) {
  if (content.includes("from '") && content.includes('Icon') && (content.includes('ui/Icon') || content.includes('Icon.jsx'))) return content;
  const iconPath = getIconImportPath(filePath);
  const firstImport = content.match(/^import\s+.+from\s+['"].+['"];?\s*$/m);
  if (firstImport) {
    const insertAfter = content.indexOf(firstImport[0]) + firstImport[0].length;
    return content.slice(0, insertAfter) + "\nimport Icon from '" + iconPath + "';" + content.slice(insertAfter);
  }
  return content;
}

function replaceIcons(content) {
  let out = content;
  const faSolidRegex = /<i\s+className=["']fa-solid\s+fa-([a-z0-9-]+)([^"']*)["']([^>]*)>\s*<\/i>/g;
  out = out.replace(faSolidRegex, (_, iconName, restClasses, restAttrs) => {
    const cls = restClasses.trim();
    if (cls) return `<Icon name="${iconName}" className="${cls.trim()}"${restAttrs}/>`;
    return `<Icon name="${iconName}"${restAttrs}/>`;
  });
  const faSolidSelfClose = /<i\s+className=["']fa-solid\s+fa-([a-z0-9-]+)([^"']*)["']([^>]*)\s*\/>/g;
  out = out.replace(faSolidSelfClose, (_, iconName, restClasses, restAttrs) => {
    const cls = restClasses.trim();
    if (cls) return `<Icon name="${iconName}" className="${cls.trim()}"${restAttrs}/>`;
    return `<Icon name="${iconName}"${restAttrs}/>`;
  });
  const faBrandsRegex = /<i\s+className=["']fa-brands\s+fa-([a-z0-9-]+)([^"']*)["']([^>]*)>\s*<\/i>/g;
  out = out.replace(faBrandsRegex, (_, iconName, restClasses, restAttrs) => {
    const cls = restClasses.trim();
    if (cls) return `<Icon name="${iconName}" className="${cls.trim()}"${restAttrs}/>`;
    return `<Icon name="${iconName}"${restAttrs}/>`;
  });
  const templateLiteralIcon = /<i\s+className=\{`fa-solid\s+\$\{([^}]+)\}`([^>]*)>\s*<\/i>/g;
  out = out.replace(templateLiteralIcon, (_, expr, rest) => `<Icon name={${expr}}${rest}/>`);
  const templateLiteralIcon2 = /<i\s+className=\{`fa-solid\s+fa-([a-z0-9-]+)\s+([^`]+)`\}\s*([^>]*)\s*\/>/g;
  out = out.replace(templateLiteralIcon2, (_, iconName, restClasses, rest) => `<Icon name="${iconName}" className="${restClasses.trim()}" ${rest}/>`);
  return out;
}

function walk(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') walk(full, files);
    } else if (/\.(jsx?|tsx?)$/.test(f) && !f.includes('Icon.jsx') && !full.includes('node_modules')) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(path.join(ROOT, 'components')).concat(walk(path.join(ROOT, 'app')));
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('fa-solid') && !content.includes('fa-brands')) continue;
  const afterReplace = replaceIcons(content);
  if (afterReplace === content) continue;
  const afterImport = addIconImport(afterReplace, file);
  fs.writeFileSync(file, afterImport);
  changed++;
  console.log('Migrated:', path.relative(ROOT, file));
}
console.log('Done. Files updated:', changed);
