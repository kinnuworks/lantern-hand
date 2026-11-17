import type { BeatId, Plane, Spot, Vec3 } from './types.js';

/**
 * Picks where each story beat happens in a real room, from the labelled planes the
 * headset reports. Every beat has a chain of wished-for labels and a geometric
 * fallback, so a room with missing or odd labels still gets a full chapter.
 * Pure: no SDK imports, so the offline check runs the exact same code.
 */

const EDGE_INSET = 0.08; // stay this far inside a surface's edge (metres)
const MAX_REACH = 4.5; // ignore surfaces farther than this from the viewer (horizontal)

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const flat = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[2] - b[2]);

export const isUp = (p: Plane) => p.orientation === 'horizontal' && p.normal[1] > 0.7;
export const isWall = (p: Plane) => p.orientation === 'vertical' || Math.abs(p.normal[1]) < 0.3;

/** Clamp a world point into a plane's rectangle (inset from the edges) and onto its surface. */
export function clampToPlane(p: Plane, pt: Vec3, inset = EDGE_INSET): Vec3 {
  const d = sub(pt, p.center);
  const ix = Math.max(0, p.halfX - inset);
  const iz = Math.max(0, p.halfZ - inset);
  const x = Math.min(ix, Math.max(-ix, dot(d, p.axisX)));
  const z = Math.min(iz, Math.max(-iz, dot(d, p.axisZ)));
  return add(add(p.center, mul(p.axisX, x)), mul(p.axisZ, z));
}

/** Point on a wall plane at a given world height, nearest to `toward` horizontally. */
function onWallAt(p: Plane, height: number, toward: Vec3): Vec3 {
  const target: Vec3 = [toward[0], height, toward[2]];
  return clampToPlane(p, target, 0.12);
}

/** Lowest point of a vertical plane, a little above its bottom edge. */
function wallBottomY(p: Plane): number {
  // The in-plane axis that is most vertical gives the plane's height direction.
  const vx = Math.abs(p.axisX[1]) > Math.abs(p.axisZ[1]);
  const half = vx ? p.halfX : p.halfZ;
  return p.center[1] - half;
}

function byLabel(planes: Plane[], labels: string[], filter: (p: Plane) => boolean): Plane[] {
  return planes.filter((p) => labels.includes(p.label) && filter(p));
}

function nearest(planes: Plane[], head: Vec3): Plane | undefined {
  return planes
    .filter((p) => flat(p.center, head) <= MAX_REACH)
    .sort((a, b) => flat(a.center, head) - flat(b.center, head))[0];
}

function area(p: Plane) {
  return 4 * p.halfX * p.halfZ;
}

export interface StageResult {
  spots: Spot[];
  floorY: number;
}

export function stage(planes: Plane[], head: Vec3): StageResult {
  const floors = planes.filter((p) => p.label === 'floor' && isUp(p));
  const floorPlane =
    floors.sort((a, b) => area(b) - area(a))[0] ??
    planes.filter(isUp).sort((a, b) => a.center[1] - b.center[1])[0];
  const floorY = floorPlane ? floorPlane.center[1] : head[1] - 1.2;

  // Raised horizontal surfaces a small figure can stand on (seat height to counter height).
  const raised = planes.filter(
    (p) => isUp(p) && p.center[1] > floorY + 0.25 && p.center[1] < floorY + 1.3 && area(p) > 0.04,
  );
  const walls = planes.filter((p) => isWall(p) && flat(p.center, head) <= MAX_REACH + 1);

  const used = new Set<string>();
  const spots: Spot[] = [];
  const push = (beat: BeatId, plane: Plane, pos: Vec3, fallback: boolean) => {
    used.add(plane.id);
    spots.push({ beat, pos, normal: plane.normal, planeId: plane.id, label: plane.label, fallback });
  };

  // 1. table: where he sleeps. Prefer a labelled table within reach, else any raised surface.
  const tables = byLabel(raised, ['table', 'desk', 'coffee table', 'storage'], () => true);
  let tablePlane = nearest(tables, head);
  const tableFallback = !tablePlane;
  tablePlane ??= nearest(raised, head);
  if (tablePlane) {
    push('table', tablePlane, clampToPlane(tablePlane, head), tableFallback);
  } else if (floorPlane) {
    // No raised surface at all: he sleeps on the floor in front of the viewer.
    const front: Vec3 = [head[0], floorY, head[2] - 0.8];
    push('table', floorPlane, clampToPlane(floorPlane, front), true);
  }

  // 2. ridge: the couch back he walks along. Prefer couch/bed, else another raised surface.
  const couches = byLabel(raised, ['couch', 'bed', 'sofa'], (p) => !used.has(p.id));
  let ridgePlane = nearest(couches, head);
  const ridgeFallback = !ridgePlane;
  ridgePlane ??= nearest(
    raised.filter((p) => !used.has(p.id)),
    head,
  );
  if (ridgePlane) {
    // Walk to the far end of the surface along its longer axis.
    const longX = ridgePlane.halfX >= ridgePlane.halfZ;
    const axis = longX ? ridgePlane.axisX : ridgePlane.axisZ;
    const half = (longX ? ridgePlane.halfX : ridgePlane.halfZ) - EDGE_INSET;
    const a = add(ridgePlane.center, mul(axis, half));
    const b = add(ridgePlane.center, mul(axis, -half));
    const far = flat(a, head) > flat(b, head) ? a : b;
    push('ridge', ridgePlane, clampToPlane(ridgePlane, far), ridgeFallback);
  } else if (tablePlane && tablePlane !== floorPlane) {
    // Same surface as the table: walk to its far side.
    const t = spots[0].pos;
    const away = add(t, mul(sub(t, head), 1));
    push('ridge', tablePlane, clampToPlane(tablePlane, [away[0], t[1], away[2]]), true);
  } else if (floorPlane) {
    // No raised surface anywhere: the ridge becomes a walk across open floor, away from the viewer.
    const t = spots[0]?.pos ?? [head[0], floorY, head[2] - 0.8];
    const dir = sub([t[0], 0, t[2]], [head[0], 0, head[2]]);
    const len = Math.hypot(dir[0], dir[2]) || 1;
    const blockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
    for (const step of [0.9, 0.7, 0.5, 1.1, 1.3]) {
      const c = clampToPlane(floorPlane, [t[0] + (dir[0] / len) * step, floorY, t[2] + (dir[2] / len) * step]);
      if (!blockers.some((b) => under(b, c)) && flat(c, t) > 0.3) {
        push('ridge', floorPlane, c, true);
        break;
      }
    }
  }

  // 3. sea: open floor that is not under furniture, between the ridge and the far wall.
  if (floorPlane) {
    const from = spots[spots.length - 1]?.pos ?? head;
    const blockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
    const candidates: Vec3[] = [];
    for (let r = 0.5; r <= 2.5; r += 0.25) {
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        candidates.push(clampToPlane(floorPlane, [from[0] + Math.cos(a) * r, floorY, from[2] + Math.sin(a) * r]));
      }
    }
    const free = candidates.filter((c) => !blockers.some((b) => under(b, c)) && flat(c, head) > 0.6);
    const pick = free.sort((a, b) => flat(a, from) - flat(b, from))[0];
    if (pick) push('sea', floorPlane, pick, false);
    else push('sea', floorPlane, clampToPlane(floorPlane, [from[0], floorY, from[2]]), true);
  }

  // 4. gate: a door, else wall art, else the nearest wall. Gate stands at floor level against it.
  const doors = byLabel(walls, ['door', 'door frame', 'doorframe'], () => true);
  let gatePlane = nearest(doors, head);
  let gateFallback = false;
  if (!gatePlane) {
    gateFallback = true;
    gatePlane = nearest(byLabel(walls, ['wall art', 'other', 'screen'], () => true), head) ?? nearest(walls.filter((w) => w.label === 'wall'), head);
  }
  if (gatePlane) {
    const base = Math.max(floorY, wallBottomY(gatePlane));
    const p = onWallAt(gatePlane, base + 0.02, spots[spots.length - 1]?.pos ?? head);
    push('gate', gatePlane, add([p[0], floorY, p[2]], mul(gatePlane.normal, 0.06)), gateFallback);
  }

  // 5. window: the sill where he watches the sun. A window, else wall art, else the farthest wall.
  const windows = byLabel(walls, ['window', 'window frame'], (p) => !used.has(p.id));
  let winPlane = nearest(windows, head);
  let winFallback = false;
  if (!winPlane) {
    winFallback = true;
    const others = walls.filter((p) => !used.has(p.id) && p.label !== 'door');
    winPlane =
      nearest(byLabel(others, ['wall art'], () => true), head) ??
      others.filter((w) => flat(w.center, head) <= MAX_REACH).sort((a, b) => flat(b.center, head) - flat(a.center, head))[0];
  }
  if (winPlane) {
    const sillY = Math.max(floorY + 0.5, Math.min(floorY + 1.1, wallBottomY(winPlane)));
    const blockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
    // Try points along the wall, nearest the viewer first, and skip any hidden under furniture.
    const horiz = Math.abs(winPlane.axisX[1]) < Math.abs(winPlane.axisZ[1]) ? winPlane.axisX : winPlane.axisZ;
    const halfH = horiz === winPlane.axisX ? winPlane.halfX : winPlane.halfZ;
    const base = onWallAt(winPlane, sillY, head);
    let chosen: Vec3 | null = null;
    for (let t = 0; t <= halfH * 2 && !chosen; t += 0.15) {
      for (const sgn of [1, -1]) {
        const c = clampToPlane(winPlane, add(base, mul(horiz, sgn * t)), 0.12);
        const out = add(c, mul(winPlane.normal, 0.07));
        if (!blockers.some((b) => under(b, out))) { chosen = out; break; }
      }
    }
    push('window', winPlane, chosen ?? add(base, mul(winPlane.normal, 0.07)), winFallback);
  }

  return { spots, floorY };
}

/** True when point c lies under horizontal plane b's footprint. */
export function under(b: Plane, c: Vec3): boolean {
  const d = sub(c, b.center);
  return (
    Math.abs(dot(d, b.axisX)) <= b.halfX + 0.05 &&
    Math.abs(dot(d, b.axisZ)) <= b.halfZ + 0.05 &&
    c[1] < b.center[1] - 0.05
  );
}
