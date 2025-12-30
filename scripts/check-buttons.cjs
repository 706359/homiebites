#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', 'docs'];
// Only scan these source folders (avoid docs and READMEs)
const SCAN_DIRS = ['web', 'admin', 'app', 'backend', 'shared'];

const forbidden = [
  'btn-outline',
  'btn-text',
  'btn-whatsapp',
  'add-btn',
  'order-btn',
  'login-submit-btn',
  'cta-button',
  'subscribe-btn',
  'qty-btn',
  'back-btn',
  'result-add-btn',
  'faq-whatsapp-btn',
  'search-button',
];

const exts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.md'];

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (IGNORED_DIRS.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

const findings = [];

// Walk only selected folders to avoid scanning docs
SCAN_DIRS.forEach((d) => {
  const dirPath = path.join(ROOT, d);
  if (!fs.existsSync(dirPath)) return;
  walk(dirPath, (file) => {
    if (!exts.includes(path.extname(file))) return;
    // Skip this script itself
    if (file.endsWith('check-buttons.cjs')) return;
    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      return;
    }

    // Skip build/dist assets
    if (file.includes(path.sep + 'dist' + path.sep) || file.includes(path.sep + 'build' + path.sep))
      return;

    forbidden.forEach((name) => {
      // Match .class selectors or class/className attributes containing the forbidden name
      const selectorRe = new RegExp('\\.' + name + '\\b', 'g');
      const selectorBareRe = new RegExp('(^|\\s)' + name + '\\s*\\{', 'g');
      const attrRe = new RegExp(
        'class(?:Name)?\\s*=\\s*["\'`][^"\'`]*\\b' + name + '\\b[^"\'`]*["\'`]',
        'g'
      );
      if (selectorRe.test(content) || selectorBareRe.test(content) || attrRe.test(content)) {
        findings.push({ file: path.relative(ROOT, file), name });
      }
    });
  });
});

if (findings.length) {
  console.error('\n🚨 Forbidden button classes found (violation of BUTTON_SYSTEM_LOCK):\n');
  const grouped = findings.reduce((acc, cur) => {
    acc[cur.file] = acc[cur.file] || new Set();
    acc[cur.file].add(cur.name);
    return acc;
  }, {});
  Object.keys(grouped).forEach((f) => {
    console.error(` - ${f}: ${Array.from(grouped[f]).join(', ')}`);
  });
  console.error(
    '\nPlease migrate to the 5-button system (see docs/BUTTON_VARIANTS_GUIDE.md) or use .btn-special for custom colors.'
  );
  process.exit(1);
} else {
  console.log('\n✅ Button system check passed — no forbidden classes found.');
  process.exit(0);
}
