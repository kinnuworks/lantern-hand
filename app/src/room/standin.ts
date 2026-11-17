import type { Plane, Vec3 } from './types.js';

/**
 * A small stand-in room, built around the viewer, for headsets with no room scan
 * (no Space Setup, or spatial data access declined). Same plane format as a real scan,
 * marked with the label prefix "standin" so the story can draw it.
 */
export function standinRoom(head: Vec3, forward: Vec3, depth = 3.2): Plane[] {
  // Everything is laid out for a 3 m deep room; squeeze it to fit in front of a nearer real wall.
  const k = Math.max(0.35, Math.min(1, (depth - 0.2) / 3.0));
  const l = Math.hypot(forward[0], forward[2]) || 1;
  const f: Vec3 = [forward[0] / l, 0, forward[2] / l];
  const r: Vec3 = [-f[2], 0, f[0]]; // right
  const floorY = head[1] - 1.15;
  const at = (fw: number, rt: number, y: number): Vec3 => [head[0] + f[0] * fw * k + r[0] * rt, y, head[2] + f[2] * fw * k + r[2] * rt];
  const flatPlane = (id: string, label: string, c: Vec3, hx: number, hz: number): Plane => ({
    id, label, orientation: 'horizontal', center: c, normal: [0, 1, 0], axisX: r, axisZ: [-f[0], 0, -f[2]], halfX: hx, halfZ: hz,
  });
  const wall = (id: string, label: string, c: Vec3, hw: number, hh: number): Plane => ({
    id, label, orientation: 'vertical', center: c, normal: [-f[0], 0, -f[2]], axisX: r, axisZ: [0, -1, 0], halfX: hw, halfZ: hh,
  });
  return [
    flatPlane('s-floor', 'floor', at(1.2, 0, floorY), 2.2, 2.2),
    flatPlane('s-table', 'table', at(0.75, 0.05, floorY + 0.42), 0.32, 0.22 * Math.max(0.6, k)),
    flatPlane('s-couch', 'couch', at(1.65, -0.75, floorY + 0.45), 0.6, 0.25 * Math.max(0.6, k)),
    wall('s-wall', 'wall', at(3.0, 0, floorY + 1.3), 2.2, 1.3),
    wall('s-door', 'door', at(2.98, 1.1, floorY + 1.0), 0.45, 1.0),
    wall('s-window', 'window', at(2.98, -0.4, floorY + 1.45), 0.55, 0.45),
  ];
}

/**
 * Fill the gaps in a partial room scan with stand-in pieces, so every beat has somewhere
 * real or paper to happen. Returns the scan plus only the pieces it was missing.
 * Pieces from here have ids starting "s-"; the story draws the raised ones as paper.
 */
/** Distance from the viewer to the nearest real wall straight ahead (metres), or 3.2 if none. */
export function roomDepth(planes: Plane[], head: Vec3, fwd: Vec3): number {
  let best = 3.2;
  for (const p of planes) {
    if (p.orientation !== 'vertical') continue;
    const n = p.normal;
    const denom = fwd[0] * n[0] + fwd[2] * n[2];
    if (denom > -0.2) continue;
    const t = ((p.center[0] - head[0]) * n[0] + (p.center[2] - head[2]) * n[2]) / denom;
    if (t <= 0.2 || t >= best) continue;
    const x: Vec3 = [head[0] + fwd[0] * t, p.center[1], head[2] + fwd[2] * t];
    const rx = (x[0] - p.center[0]) * p.axisX[0] + (x[2] - p.center[2]) * p.axisX[2];
    const rz = (x[0] - p.center[0]) * p.axisZ[0] + (x[2] - p.center[2]) * p.axisZ[2];
    if (Math.abs(rx) > p.halfX + 0.3 && Math.abs(rz) > p.halfZ + 0.3) continue;
    best = t;
  }
  return best;
}

export function completeRoom(planes: Plane[], head: Vec3, forward: Vec3): Plane[] {
  const l = Math.hypot(forward[0], forward[2]);
  const fwd: Vec3 = l > 0.2 ? [forward[0] / l, 0, forward[2] / l] : [0, 0, -1];
  const standin = standinRoom(head, fwd, roomDepth(planes, head, fwd));
  const inFront = (p: Plane) => {
    const dx = p.center[0] - head[0], dz = p.center[2] - head[2];
    const d = Math.hypot(dx, dz) || 1;
    return (dx * fwd[0] + dz * fwd[2]) / d > 0.2;
  };
  const up = (p: Plane) => p.orientation === 'horizontal' && p.normal[1] > 0.7;
  const hasFloor = planes.some((p) => up(p) && p.center[1] < head[1] - 0.8);
  const floorY = hasFloor ? Math.min(...planes.filter((p) => up(p)).map((p) => p.center[1])) : head[1] - 1.15;
  const hasRaised = planes.some((p) => up(p) && p.center[1] > floorY + 0.25 && p.center[1] < floorY + 1.3 && inFront(p));
  const hasWall = planes.some((p) => p.orientation === 'vertical' && inFront(p));
  const add: Plane[] = [];
  const pick = (ids: string[]) => standin.filter((p) => ids.includes(p.id)).map((p) => {
    // Sit stand-in pieces on the real floor when there is one.
    const dy = floorY - (head[1] - 1.15);
    return { ...p, center: [p.center[0], p.center[1] + dy, p.center[2]] as Vec3 };
  });
  if (!hasFloor) add.push(...pick(['s-floor']));
  if (!hasRaised) add.push(...pick(['s-table', 's-couch']));
  if (!hasWall) add.push(...pick(['s-wall', 's-door', 's-window']));
  return add.length ? [...planes, ...add] : planes;
}
