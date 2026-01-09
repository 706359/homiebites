#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IGNORED_DIRS = ["node_modules", ".git", "dist", "build"];

const forbidden = [
  "btn-outline",
  "btn-text",
  "btn-whatsapp",
  "add-btn",
  "order-btn",
  "login-submit-btn",
  "cta-button",
  "subscribe-btn",
  "qty-btn",
  "back-btn",
  "result-add-btn",
  "faq-whatsapp-btn",
  "search-button",
];

const exts = [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html", ".md"];

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

walk(ROOT, (file) => {
  if (!exts.includes(path.extname(file))) return;
  // Skip this script itself
  if (file.endsWith("check-buttons.js")) return;
  let content = "";
  try {
    content = fs.readFileSync(file, "utf8");
  } catch (err) {
    return;
  }
  forbidden.forEach((name) => {
    const re = new RegExp("\\b" + name + "\\b", "g");
    if (re.test(content))
      findings.push({ file: path.relative(ROOT, file), name });
  });
});

if (findings.length) {
  console.error(
    "\n🚨 Forbidden button classes found (violation of BUTTON_SYSTEM_LOCK):\n",
  );
  const grouped = findings.reduce((acc, cur) => {
    acc[cur.file] = acc[cur.file] || new Set();
    acc[cur.file].add(cur.name);
    return acc;
  }, {});
  Object.keys(grouped).forEach((f) => {
    console.error(` - ${f}: ${Array.from(grouped[f]).join(", ")}`);
  });
  console.error(
    "\nPlease migrate to the 5-button system (see docs/BUTTON_VARIANTS_GUIDE.md) or use .btn-special for custom colors.",
  );
  process.exit(1);
} else {
  console.log("\n✅ Button system check passed — no forbidden classes found.");
  process.exit(0);
}
