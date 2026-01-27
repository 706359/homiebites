/**
 * Admin dashboard font size: three presets only (enterprise-style).
 * Small 17px | Normal 18px | Large 19px.
 * Uses --admin-base-font-size + .admin-active on html so rem-based
 * --admin-fs-* scale correctly across the entire dashboard.
 */
export const ADMIN_FONT_SIZE_SMALL = 17;
export const ADMIN_FONT_SIZE_NORMAL = 18;
export const ADMIN_FONT_SIZE_LARGE = 19;

export const ADMIN_FONT_SIZE_MIN = ADMIN_FONT_SIZE_SMALL;
export const ADMIN_FONT_SIZE_MAX = ADMIN_FONT_SIZE_LARGE;
export const ADMIN_FONT_SIZE_DEFAULT = ADMIN_FONT_SIZE_NORMAL;

/** Preset options for Settings UI: value (px) and label */
export const ADMIN_FONT_SIZE_OPTIONS = [
  { value: ADMIN_FONT_SIZE_SMALL, label: 'Small', px: 17 },
  { value: ADMIN_FONT_SIZE_NORMAL, label: 'Normal', px: 18 },
  { value: ADMIN_FONT_SIZE_LARGE, label: 'Large', px: 19 },
];

/** Legacy keys (e.g. from old settings) map to preset px */
const LEGACY_MAP = {
  small: ADMIN_FONT_SIZE_SMALL,
  normal: ADMIN_FONT_SIZE_NORMAL,
  large: ADMIN_FONT_SIZE_LARGE,
  medium: ADMIN_FONT_SIZE_NORMAL,
  'extra-large': ADMIN_FONT_SIZE_LARGE,
};

/**
 * Snap to nearest preset (17, 18, or 19).
 * @param {number} v
 * @returns {number}
 */
export function roundToStep(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return ADMIN_FONT_SIZE_DEFAULT;
  const opts = [ADMIN_FONT_SIZE_SMALL, ADMIN_FONT_SIZE_NORMAL, ADMIN_FONT_SIZE_LARGE];
  let best = ADMIN_FONT_SIZE_DEFAULT;
  let bestDist = Infinity;
  for (const px of opts) {
    const d = Math.abs(n - px);
    if (d < bestDist) {
      bestDist = d;
      best = px;
    }
  }
  return best;
}

/**
 * @param {string|number} v - From settings, localStorage, or event
 * @returns {number|null} 17, 18, or 19, or null
 */
export function parseFontSize(v) {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  const legacy = LEGACY_MAP[s];
  if (legacy != null) return legacy;
  const n = parseFloat(s);
  if (!Number.isNaN(n) && n >= ADMIN_FONT_SIZE_MIN && n <= ADMIN_FONT_SIZE_MAX)
    return roundToStep(n);
  return null;
}

/**
 * Apply font size to admin: sets --admin-base-font-size on :root and
 * adds .admin-active to html. index.css uses that for font-size.
 * @param {number|string} value - 17, 18, or 19 (or legacy key); snap to preset
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
 * Remove admin font-size when leaving /admin.
 */
export function clearAdminFontSize() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('admin-active');
  root.style.removeProperty('--admin-base-font-size');
  root.style.fontSize = '';
}

/**
 * Format for display: "17", "18", "19".
 */
export function formatFontSizeDisplay(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return String(ADMIN_FONT_SIZE_DEFAULT);
  return String(roundToStep(n));
}
