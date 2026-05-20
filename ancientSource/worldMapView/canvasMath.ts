// Equirectangular projection helpers for the static atlas canvas.
// Inputs are bounded so all included markers (Asia, Europe, Africa)
// render comfortably without clipping.

export type Box = { width: number; height: number };

const LON_RANGE: [number, number] = [-30, 160];
const LAT_RANGE: [number, number] = [-40, 60];

export function project(lat: number, lng: number, box: Box) {
  const [lon0, lon1] = LON_RANGE;
  const [lat0, lat1] = LAT_RANGE;
  const clampedLng = Math.max(lon0, Math.min(lon1, lng));
  const clampedLat = Math.max(lat0, Math.min(lat1, lat));
  const xRatio = (clampedLng - lon0) / (lon1 - lon0);
  const yRatio = 1 - (clampedLat - lat0) / (lat1 - lat0);
  return {
    x: xRatio * box.width,
    y: yRatio * box.height,
  };
}

export function gridLines(box: Box) {
  // Returns horizontal + vertical grid spacing for the canvas overlay.
  const xs: number[] = [];
  const ys: number[] = [];
  const cols = 12;
  const rows = 8;
  for (let i = 1; i < cols; i++) xs.push((i / cols) * box.width);
  for (let i = 1; i < rows; i++) ys.push((i / rows) * box.height);
  return { xs, ys };
}
