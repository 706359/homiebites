/**
 * Society flat addresses for Panchsheel Greens.
 * Used for address suggestions on the order form.
 *
 * Tower structure:
 * A: blocks 1,2,3,4 — 14 floors — 6 flats per floor
 * B: blocks 1,2,3 — 19 floors — 4 flats per floor
 * C: blocks 1,2,3,4,5 — 14 floors — 5 flats per floor
 * F: blocks 1,2,3 — 29 floors — 6 flats per floor
 * F: blocks 4,5,6 — 19 floors — 6 flats per floor
 *
 * Format: TowerBlock-FloorFlat (e.g. A1-101, B2-1904, F4-1406)
 * FloorFlat = floor + flat zero-padded (101 = floor 1 flat 1, 1406 = floor 14 flat 6).
 */

function generateFlats(tower, blocks, floors, flatsPerFloor) {
  const list = [];
  for (const block of blocks) {
    const prefix = `${tower}${block}`;
    for (let floor = 1; floor <= floors; floor++) {
      for (let flat = 1; flat <= flatsPerFloor; flat++) {
        const floorFlat = `${floor}${String(flat).padStart(2, '0')}`;
        list.push(`${prefix}-${floorFlat}`);
      }
    }
  }
  return list;
}

const A_FLATS = generateFlats('A', [1, 2, 3, 4], 14, 6);
const B_FLATS = generateFlats('B', [1, 2, 3], 19, 4);
const C_FLATS = generateFlats('C', [1, 2, 3, 4, 5], 14, 5);
const F1_FLATS = generateFlats('F', [1, 2, 3], 29, 6);
const F2_FLATS = generateFlats('F', [4, 5, 6], 19, 6);

/** All society flat addresses (TowerBlock-FloorFlat, e.g. A1-101). */
export const SOCIETY_FLAT_ADDRESSES = [
  ...A_FLATS,
  ...B_FLATS,
  ...C_FLATS,
  ...F1_FLATS,
  ...F2_FLATS,
];

/**
 * Filter society flats by search query (prefix or contains).
 * @param {string} query - Search string (e.g. "A1", "A1-14", "A1-101")
 * @param {number} maxResults - Max suggestions to return
 * @returns {string[]}
 */
export function getSocietyFlatSuggestions(query, maxResults = 20) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toUpperCase();
  if (q.length === 0) return [];

  const matches = SOCIETY_FLAT_ADDRESSES.filter((addr) => {
    const upper = addr.toUpperCase();
    return upper.startsWith(q) || upper.includes(q);
  });

  return matches.slice(0, maxResults);
}
