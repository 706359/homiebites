/**
 * Admin dashboard font size: 12px–20px in 0.25px steps.
 * Only affects admin. Uses --admin-base-font-size + .admin-active on html
 * so rem-based --admin-fs-* scale finely without touching globals.
 */
export const ADMIN_FONT_SIZE_MIN = 12;
export const ADMIN_FONT_SIZE_MAX = 20;
export const ADMIN_FONT_SIZE_STEP = 0.25;
export const ADMIN_FONT_SIZE_DEFAULT = 16;

const LEGACY_MAP = { small: 14, medium: 16, large: 18, 'extra-large': 20 };

/**
 * Snap to nearest step and clamp. Avoids float noise in storage and DOM.
 * @param {number} v
 * @param {number} [step] - default ADMIN_FONT_SIZE_STEP
 * @returns {number}
 */
export function roundToStep(v, step = ADMIN_FONT_SIZE_STEP) {
  const n = Number(v);
  if (Number.isNaN(n)) return ADMIN_FONT_SIZE_DEFAULT;
  const ticks = Math.round(n / step) * step;
  return Math.max(
    ADMIN_FONT_SIZE_MIN,
    Math.min(ADMIN_FONT_SIZE_MAX, Math.round(ticks * 100) / 100)
  );
}

/**
 * @param {string|number} v - From settings, localStorage, or event
 * @returns {number|null} 12–20 or null
 */
export function parseFontSize(v) {
  if (v == null) return null;
  const n = parseFloat(String(v).trim());
  if (!Number.isNaN(n) && n >= ADMIN_FONT_SIZE_MIN && n <= ADMIN_FONT_SIZE_MAX)
    return n;
  const legacy = LEGACY_MAP[String(v).toLowerCase()];
  return legacy ?? null;
}

/**
 * Apply font size to admin: sets --admin-base-font-size on :root and
 * adds .admin-active to html. index.css uses that for font-size.
 * @param {number|string} value - 12–20; will be rounded to step
 */
export function applyAdminFontSize(value) {
  if (typeof document === 'undefined') return;
  const n = parseFontSize(value);
  const px = n != null ? roundToStep(n) : ADMIN_FONT_SIZE_DEFAULT;
  const root = document.documentElement;
  root.classList.add('admin-active');
  root.style.setProperty('--admin-base-font-size', `${px}px`);
}

/**
 * Remove admin font-size so the rest of the site uses html default.
 * Call when leaving /admin (e.g. layout unmount).
 */
export function clearAdminFontSize() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('admin-active');
  root.style.removeProperty('--admin-base-font-size');
  root.style.fontSize = ''; /* in case any older code set it */
}

/**
 * Format for display: "16" or "14.25" (minimal decimals).
 * @param {number} v
 * @returns {string}
 */
export function formatFontSizeDisplay(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return String(ADMIN_FONT_SIZE_DEFAULT);
  return n % 1 === 0
    ? String(Math.round(n))
    : String(Math.round(n * 100) / 100);
}
