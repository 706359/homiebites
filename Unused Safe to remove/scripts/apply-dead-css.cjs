const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DEAD_DIR = path.join(ROOT, 'dead-css', 'backups');
if (!fs.existsSync(path.join(ROOT, 'dead-css'))) fs.mkdirSync(path.join(ROOT, 'dead-css'));
if (!fs.existsSync(DEAD_DIR)) fs.mkdirSync(DEAD_DIR, { recursive: true });

function readDetector() {
  const out = execSync('node scripts/find-dead-css.cjs', { cwd: ROOT, encoding: 'utf8' });
  return JSON.parse(out);
}

function backupFile(rel) {
  const src = path.join(ROOT, rel);
  const dest = path.join(DEAD_DIR, rel + '.orig');
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  return dest;
}

function findSelectorListBounds(content, idx) {
  // find start of selector list: go back to previous '}' or start of file
  let start = content.lastIndexOf('}', idx);
  start = start === -1 ? 0 : start + 1;
  // from start, find the next '{' after idx
  const braceOpen = content.indexOf('{', idx);
  if (braceOpen === -1) return null;
  // find corresponding closing brace
  let i = braceOpen + 1;
  let depth = 1;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  return { selStart: start, braceOpen, braceClose: i };
}

function applyEditsForFile(relPath, selectors) {
  const abs = path.join(ROOT, relPath);
  let content = fs.readFileSync(abs, 'utf8');
  const original = content;
  backupFile(relPath);

  // For deterministic processing, sort selectors by name length desc to avoid substring conflicts
  selectors.sort((a, b) => b.name.length - a.name.length);

  for (const sel of selectors) {
    const token = (sel.type === 'class' ? '.' : '#') + sel.name;
    let idx = content.indexOf(token);
    while (idx !== -1) {
      const bounds = findSelectorListBounds(content, idx);
      if (!bounds) break;
      const { selStart, braceOpen, braceClose } = bounds;
      const selectorList = content.substring(selStart, braceOpen).trim();
      // remove comments and newlines at edges
      const cleaned = selectorList.replace(/\s+/g, ' ');
      // split by commas
      const parts = selectorList
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (parts.length === 0) break;
      // if selector appears in one of the parts, remove it from parts
      const removed = parts.filter((p) => p.split(/\s+/).some((tokenPart) => tokenPart === token));
      if (removed.length > 0) {
        const remaining = parts.filter(
          (p) => !p.split(/\s+/).some((tokenPart) => tokenPart === token)
        );
        if (remaining.length === 0) {
          // comment out entire block
          const block = content.substring(selStart, braceClose + 1);
          const commented =
            '/* DEAD-CSS-REMOVED START - ' + token + '\n' + block + '\nDEAD-CSS-REMOVED END */';
          content = content.slice(0, selStart) + commented + content.slice(braceClose + 1);
        } else {
          // replace selector list with remaining list
          const newList = remaining.join(', ');
          content = content.slice(0, selStart) + '\n' + newList + ' ' + content.slice(braceOpen);
        }
      } else {
        // token might be part of a combined selector like '.a:hover' - try to remove matches using regex
        // if not removable, skip
      }
      idx = content.indexOf(token, idx + 1);
    }
  }

  if (content !== original) {
    fs.writeFileSync(abs, content, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const results = readDetector();
  const edits = [];
  for (const rel of Object.keys(results)) {
    const sels = results[rel];
    const applied = applyEditsForFile(rel, sels);
    edits.push({
      file: rel,
      selectors: sels.map((s) => (s.type === 'class' ? '.' : '#') + s.name),
      applied,
    });
  }
  console.log(JSON.stringify({ edited: edits }, null, 2));
}

main();
