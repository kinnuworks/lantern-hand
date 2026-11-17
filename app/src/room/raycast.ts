import type { Plane, Vec3 } from './types.js';

export interface Hit {
  plane: Plane;
  point: Vec3;
  distance: number;
}

/** Nearest plane the ray hits inside the plane's rectangle (pure; used for the lantern beam). */
export function raycastPlanes(planes: Plane[], o: Vec3, d: Vec3, maxDist = 8): Hit | null {
  let best: Hit | null = null;
  for (const p of planes) {
    const n = p.normal;
    const denom = d[0] * n[0] + d[1] * n[1] + d[2] * n[2];
    if (denom > -1e-4) continue; // only hit surfaces facing the ray
    const t = ((p.center[0] - o[0]) * n[0] + (p.center[1] - o[1]) * n[1] + (p.center[2] - o[2]) * n[2]) / denom;
    if (t <= 0.05 || t > maxDist || (best && t >= best.distance)) continue;
    const x: Vec3 = [o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t];
    const rx = (x[0] - p.center[0]) * p.axisX[0] + (x[1] - p.center[1]) * p.axisX[1] + (x[2] - p.center[2]) * p.axisX[2];
    const rz = (x[0] - p.center[0]) * p.axisZ[0] + (x[1] - p.center[1]) * p.axisZ[1] + (x[2] - p.center[2]) * p.axisZ[2];
    if (Math.abs(rx) > p.halfX + 0.02 || Math.abs(rz) > p.halfZ + 0.02) continue;
    best = { plane: p, point: x, distance: t };
  }
  return best;
}
