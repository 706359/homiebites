const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORED = ['node_modules', '.git', 'dist', 'build', 'dead-css'];
const CSS_EXT = '.css';
const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.html', '.md'];

function walk(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (IGNORED.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...walk(full));
    else res.push(full);
  }
  return res;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function extractSelectors(css) {
  // Parse selector lists (the part before '{') to avoid matching values in declarations
  const selectorGroupRe = /([^{}]+)\{/g;
  const classes = new Set();
  const ids = new Set();
  let m;
  while ((m = selectorGroupRe.exec(css))) {
    const group = m[1];
    const parts = group.split(',');
    for (const p of parts) {
      const sel = p.trim();
      let cm;
      const classRe = /\.([a-zA-Z0-9_-]+)/g;
      while ((cm = classRe.exec(sel))) classes.add(cm[1]);
      let im;
      const idRe = /#([a-zA-Z0-9_-]+)/g;
      while ((im = idRe.exec(sel))) ids.add(im[1]);
    }
  }
  return { classes: Array.from(classes), ids: Array.from(ids) };
}

function fileContainsSelector(fileContent, selector) {
  // crude checks: className="...", class="...", ` ${selector} `, ' "selector"'
  const patterns = [
    new RegExp('className\\s*=\\s*["\'\\`][^"\'\\`]*\\b' + selector + '\\b[^"\'\\`]*["\'\\`]', 'm'),
    new RegExp('class\\s*=\\s*["\'\\`][^"\'\\`]*\\b' + selector + '\\b[^"\'\\`]*["\'\\`]', 'm'),
    new RegExp('\\b' + selector + '\\b', 'm'),
    new RegExp('\\.' + selector + '\\b', 'm'),
  ];
  return patterns.some((re) => re.test(fileContent));
}

(function main() {
  const files = walk(ROOT);
  const cssFiles = files.filter((f) => f.endsWith(CSS_EXT));
  const codeFiles = files.filter((f) => CODE_EXTS.some((ext) => f.endsWith(ext)));

  const results = {};

  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, 'utf8');
    const { classes, ids } = extractSelectors(css);
    const dead = [];
    const selectors = classes
      .map((c) => ({ type: 'class', name: c }))
      .concat(ids.map((i) => ({ type: 'id', name: i })));
    for (const sel of selectors) {
      let used = false;
      for (const cf of codeFiles) {
        // skip the css file itself and other css
        if (cf.endsWith('.css')) continue;
        const content = fs.readFileSync(cf, 'utf8');
        if (fileContainsSelector(content, sel.name)) {
          used = true;
          break;
        }
      }
      if (!used) dead.push(sel);
    }
    if (dead.length) results[path.relative(ROOT, cssFile)] = dead;
  }

  console.log(JSON.stringify(results, null, 2));
})();
