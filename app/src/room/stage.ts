import type { BeatId, Plane, Spot, Vec3 } from './types.js';
import { completeRoom, roomDepth, standinRoom } from './standin.js';

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

let FORWARD: Vec3 = [0, 0, -1];

/** Horizontal angle (degrees) between the viewer's forward direction and a point. */
export function offAxis(pt: Vec3, head: Vec3, fwd: Vec3 = FORWARD): number {
  const dx = pt[0] - head[0], dz = pt[2] - head[2];
  const l = Math.hypot(dx, dz) || 1;
  const fl = Math.hypot(fwd[0], fwd[2]) || 1;
  const c = (dx * fwd[0] + dz * fwd[2]) / (l * fl);
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}

const MAX_ANGLE = 65; // keep every beat inside a comfortable forward view (degrees off centre)

/** Point of a surface a seated viewer would look at: toward a spot ahead of them. */
function viewPoint(p: Plane, head: Vec3): Vec3 {
  return clampToPlane(p, ahead(head, isWall(p) ? 1.5 : 0.8));
}

/** Nearest surface in front of the viewer; surfaces behind them are never used. */
function nearest(planes: Plane[], head: Vec3): Plane | undefined {
  return planes
    .map((p) => ({ p, pt: viewPoint(p, head) }))
    .filter(({ p, pt }) => flat(p.center, head) <= MAX_REACH + 1 && offAxis(pt, head) <= MAX_ANGLE)
    .sort((a, b) => flat(a.pt, head) + offAxis(a.pt, head) / 25 - (flat(b.pt, head) + offAxis(b.pt, head) / 25))[0]?.p;
}

/** A point on a horizontal surface, as close as possible to `want`, that the seated viewer can see. */
function visibleOn(p: Plane, want: Vec3, head: Vec3, all: Plane[], floorY: number): Vec3 | null {
  const pts: Vec3[] = [];
  const ix = Math.max(0, p.halfX - EDGE_INSET), iz = Math.max(0, p.halfZ - EDGE_INSET);
  for (let a = -1; a <= 1.0001; a += 0.25) for (let b = -1; b <= 1.0001; b += 0.25) {
    pts.push(add(add(p.center, mul(p.axisX, a * ix)), mul(p.axisZ, b * iz)));
  }
  pts.sort((u, v) => flat(u, want) - flat(v, want));
  for (const c of pts) {
    if (offAxis(c, head) > MAX_ANGLE || flat(c, head) > MAX_REACH) continue;
    if (occluded(all, head, [c[0], c[1] + 0.12, c[2]], floorY, p.id)) continue;
    return c;
  }
  return null;
}

/** Walk along a wall at a given height and return the first point that is in view, not under furniture and clear of earlier beats. */
function wallPoint(p: Plane, height: number, prefer: Vec3, head: Vec3, blockers: Plane[], taken: Vec3[], all: Plane[] = [], floorY = 0): Vec3 | null {
  const horiz = Math.abs(p.axisX[1]) < Math.abs(p.axisZ[1]) ? p.axisX : p.axisZ;
  const halfH = horiz === p.axisX ? p.halfX : p.halfZ;
  const base = onWallAt(p, height, prefer);
  for (let t = 0; t <= halfH * 2; t += 0.12) {
    for (const sgn of [1, -1]) {
      const c = clampToPlane(p, add(base, mul(horiz, sgn * t)), 0.12);
      const out = add([c[0], height, c[2]], mul(p.normal, 0.07));
      if (offAxis(out, head) > MAX_ANGLE) continue;
      if (blockers.some((b) => under(b, out))) continue;
      if (taken.some((q) => flat(q, out) < 0.35)) continue;
      if (flat(out, head) > MAX_REACH) continue;
      // The figure stands here; check its middle is visible, not just its feet.
      if (all.length && occluded(all, head, [out[0], out[1] + 0.12, out[2]], floorY)) continue;
      return out;
    }
  }
  return null;
}

function ahead(head: Vec3, d: number): Vec3 {
  const l = Math.hypot(FORWARD[0], FORWARD[2]) || 1;
  return [head[0] + (FORWARD[0] / l) * d, head[1], head[2] + (FORWARD[2] / l) * d];
}

function area(p: Plane) {
  return 4 * p.halfX * p.halfZ;
}

export interface StageResult {
  spots: Spot[];
  floorY: number;
  /** The planes the spots refer to: the scan plus any stand-in pieces it was missing. */
  planes: Plane[];
}

export function stage(scan: Plane[], headIn: Vec3, forward: Vec3 = [0, 0, -1]): StageResult {
  // A pose the tracker hasn't settled yet can arrive as NaN: assume a seated viewer at the origin.
  const head: Vec3 = headIn.every(Number.isFinite) ? headIn : [0, 1.2, 0];
  if (!forward.every(Number.isFinite)) forward = [0, 0, -1];
  const fl = Math.hypot(forward[0], forward[2]);
  FORWARD = fl > 0.2 ? [forward[0] / fl, 0, forward[2] / fl] : [0, 0, -1]; // looking straight up or down: assume ahead
  const first = stageOnce(completeRoom(scan, head, FORWARD), head);
  const bad = badBeats(first, head);
  if (!bad.length) return first;
  // Some beat has nowhere good to go from this seat: add the stand-in pieces it needs in front
  // of the viewer (drawn as paper) and stage again.
  const want: string[] = [];
  if (bad.includes('table') || bad.includes('ridge')) want.push('s-table', 's-couch');
  if (bad.includes('sea')) want.push('s-floor');
  if (bad.includes('gate') || bad.includes('window')) want.push('s-wall', 's-door', 's-window');
  const extra = standinRoom(head, FORWARD, roomDepth(scan, head, FORWARD))
    .filter((p) => want.includes(p.id))
    .map((p): Plane => ({
      ...p,
      id: p.id + '-x',
      center: [p.center[0], p.id === 's-floor' ? first.floorY : p.center[1] + (first.floorY - (head[1] - 1.15)), p.center[2]],
      ...(p.id === 's-floor' ? { halfX: 1.2, halfZ: 1.2 } : {}),
    }));
  const second = stageOnce([...first.planes.filter((p) => !p.id.startsWith('s-floor') || !want.includes('s-floor')), ...extra], head);
  return badBeats(second, head).length < bad.length ? second : first;
}

/** Beats that are missing or that a seated viewer couldn't comfortably see. */
export function badBeats(r: StageResult, head: Vec3): BeatId[] {
  const out: BeatId[] = [];
  for (const b of ['table', 'ridge', 'sea', 'gate', 'window'] as BeatId[]) {
    const s = r.spots.find((x) => x.beat === b);
    if (!s) { out.push(b); continue; }
    const dist = Math.hypot(s.pos[0] - head[0], s.pos[1] - head[1], s.pos[2] - head[2]);
    if (dist > 5 || offAxis(s.pos, head) > 75 || occluded(r.planes, head, [s.pos[0], s.pos[1] + 0.12, s.pos[2]], r.floorY, s.planeId)) out.push(b);
  }
  return out;
}

function stageOnce(planes: Plane[], head: Vec3): StageResult {
  const floors = planes.filter((p) => p.label === 'floor' && isUp(p));
  const floorPlane =
    floors.sort((a, b) => area(b) - area(a))[0] ??
    planes.filter((p) => isUp(p) && p.center[1] < head[1] - 0.8).sort((a, b) => a.center[1] - b.center[1])[0];
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
  let tablePlane: Plane | undefined;
  let tablePt: Vec3 | null = null;
  let tableFallback = false;
  for (const [pool, fb] of [[tables, false], [raised, true]] as [Plane[], boolean][]) {
    for (const p of pool.slice().sort((u, w) => flat(viewPoint(u, head), head) - flat(viewPoint(w, head), head))) {
      const pt = visibleOn(p, ahead(head, 0.6), head, planes, floorY);
      if (pt) { tablePlane = p; tablePt = pt; tableFallback = fb; break; }
    }
    if (tablePlane) break;
  }
  if (tablePlane && tablePt) {
    push('table', tablePlane, tablePt, tableFallback);
  } else if (floorPlane) {
    // No raised surface at all: he sleeps on the floor in front of the viewer.
    const a0 = ahead(head, 0.8);
    const front: Vec3 = [a0[0], floorY, a0[2]];
    push('table', floorPlane, clampToPlane(floorPlane, front), true);
  }

  // 2. ridge: the couch back he walks along. Prefer couch/bed, else another raised surface.
  const couches = byLabel(raised, ['couch', 'bed', 'sofa'], (p) => !used.has(p.id));
  let ridgePlane: Plane | undefined;
  let ridgePt: Vec3 | null = null;
  let ridgeFallback = false;
  for (const [pool, fb] of [[couches, false], [raised.filter((p) => !used.has(p.id)), true]] as [Plane[], boolean][]) {
    for (const p of pool.slice().sort((u, w) => flat(viewPoint(u, head), head) - flat(viewPoint(w, head), head))) {
      // Walk toward the far end of the surface along its longer axis.
      const longX = p.halfX >= p.halfZ;
      const axis = longX ? p.axisX : p.axisZ;
      const half = (longX ? p.halfX : p.halfZ) - EDGE_INSET;
      const e1 = add(p.center, mul(axis, half)), e2 = add(p.center, mul(axis, -half));
      const pt = visibleOn(p, offAxis(e1, head) < offAxis(e2, head) ? e1 : e2, head, planes, floorY);
      if (pt && !spots.some((q) => flat(q.pos, pt) < 0.3)) { ridgePlane = p; ridgePt = pt; ridgeFallback = fb; break; }
    }
    if (ridgePlane) break;
  }
  if (ridgePlane && ridgePt) {
    push('ridge', ridgePlane, ridgePt, ridgeFallback);
  } else if (tablePlane && tablePlane !== floorPlane && flat(clampToPlane(tablePlane, (() => { const t = spots[0].pos; const w = add(t, mul(sub(t, head), 1)); return [w[0], t[1], w[2]] as Vec3; })()), spots[0].pos) >= 0.3) {
    // Same surface as the table: walk to its far side.
    const t = spots[0].pos;
    const away = add(t, mul(sub(t, head), 1));
    push('ridge', tablePlane, clampToPlane(tablePlane, [away[0], t[1], away[2]]), true);
  } else if (floorPlane) {
    // No raised surface anywhere: the ridge becomes a walk across open floor, away from the viewer.
    const t = spots[0]?.pos ?? (() => { const a1 = ahead(head, 0.8); return [a1[0], floorY, a1[2]] as Vec3; })();
    const dir = sub([t[0], 0, t[2]], [head[0], 0, head[2]]);
    const len = Math.hypot(dir[0], dir[2]) || 1;
    const blockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
    for (const step of [0.9, 0.7, 0.5, 1.1, 1.3]) {
      const c = clampToPlane(floorPlane, [t[0] + (dir[0] / len) * step, floorY, t[2] + (dir[2] / len) * step]);
      if (!blockers.some((b) => under(b, c)) && flat(c, t) > 0.3 && flat(c, head) <= MAX_REACH && offAxis(c, head) <= MAX_ANGLE) {
        push('ridge', floorPlane, c, true);
        break;
      }
    }
  }

  // 3. sea: open floor that is not under furniture, in view, between the ridge and the far wall.
  // Try every floor surface (the real one first, then any stand-in floor) until one has a clear spot.
  const floorsByArea = planes.filter((p) => p.label === 'floor' && isUp(p)).sort((a, b) => (b.id.startsWith('s-') ? -1 : 0) - (a.id.startsWith('s-') ? -1 : 0) || area(b) - area(a));
  if (floorPlane) {
    const from = spots[spots.length - 1]?.pos ?? head;
    const blockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
    let placed = false;
    // No clear floor in view (say, sitting right beside a bed): any large flat surface can be the sea.
    const bigFlats = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1 && area(p) > 0.3).sort((a, b) => area(b) - area(a));
    for (const fp of [...(floorsByArea.length ? floorsByArea : [floorPlane]), ...bigFlats]) {
      const surfY = fp.center[1];
      const candidates: Vec3[] = [];
      // Around where he last stood first, then around the open floor just ahead of the viewer.
      for (const c0 of [from, ahead(head, 1.0)]) {
        for (let r = c0 === from ? 0.5 : 0; r <= 2.5; r += 0.25) {
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
            candidates.push(clampToPlane(fp, [c0[0] + Math.cos(a) * r, surfY, c0[2] + Math.sin(a) * r]));
          }
        }
      }
      // Strict first; then allow a wider angle and closer spots, but never hidden, under furniture or on top of another beat.
      let free = candidates.filter((c) => spots.every((q) => flat(q.pos, c) >= 0.35) && !blockers.some((b) => b.id !== fp.id && under(b, c)) && flat(c, head) > 0.45 && flat(c, head) <= MAX_REACH && offAxis(c, head) < 60 && !occluded(planes, head, [c[0], c[1] + 0.12, c[2]], floorY, fp.id));
      if (!free.length) free = candidates.filter((c) => spots.every((q) => flat(q.pos, c) >= 0.25) && !blockers.some((b) => b.id !== fp.id && under(b, c)) && flat(c, head) > 0.3 && flat(c, head) <= MAX_REACH && offAxis(c, head) < 72 && !occluded(planes, head, [c[0], c[1] + 0.12, c[2]], floorY, fp.id));
      const pick = free.sort((a, b) => flat(a, from) + offAxis(a, head) / 25 - (flat(b, from) + offAxis(b, head) / 25))[0];
      if (pick) { push('sea', fp, pick, fp !== floorPlane); placed = true; break; }
    }
    if (!placed) push('sea', floorPlane, clampToPlane(floorPlane, [from[0], floorY, from[2]]), true);
  }

  // 4. gate: a door, else wall art, else the nearest wall in view. The gate stands at floor level against it.
  const wallBlockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
  const taken = () => spots.map((x) => x.pos);
  const prevPos = () => spots[spots.length - 1]?.pos ?? head;
  const gateChains: [string[], boolean][] = [[['door', 'door frame', 'doorframe'], false], [['wall art', 'screen', 'other'], true], [['wall'], true]];
  for (const [labels, fb] of gateChains) {
    const cands = byLabel(walls, labels, (p) => !used.has(p.id));
    const sorted = cands
      .map((p) => ({ p, pt: viewPoint(p, head) }))
      .filter(({ pt }) => offAxis(pt, head) <= MAX_ANGLE)
      .sort((a, b) => flat(a.pt, prevPos()) - flat(b.pt, prevPos()));
    let placed = false;
    for (const { p } of sorted) {
      const pt = wallPoint(p, floorY, prevPos(), head, wallBlockers, taken(), planes, floorY);
      if (pt) { push('gate', p, [pt[0], floorY, pt[2]], fb); placed = true; break; }
    }
    if (placed) break;
  }

  // Double-check the gate from the seat exactly as a viewer sees it; if it is hidden, drop it and use the floor.
  const gi = spots.findIndex((x) => x.beat === 'gate');
  if (gi >= 0) {
    const g = spots[gi];
    if (occluded(planes, head, [g.pos[0], g.pos[1] + 0.12, g.pos[2]], floorY, g.planeId)) spots.splice(gi, 1);
  }
  if (!spots.some((x) => x.beat === 'gate') && floorPlane) {
    // No clear wall in view: the paper gate stands on open floor past the sea, or on any big flat surface in view.
    const from = prevPos();
    const blockers = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1);
    const surfaces = [floorPlane, ...planes.filter((p) => isUp(p) && p !== floorPlane && p.center[1] > floorY + 0.1 && area(p) > 0.3).sort((a, b) => area(b) - area(a))];
    let best: Vec3 | null = null;
    let bestPlane: Plane = floorPlane;
    for (const sp of surfaces) {
      for (const relax of [false, true]) for (let r = 0.4; r <= 2.4 && !best; r += 0.2) {
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const c = clampToPlane(sp, [from[0] + Math.cos(a) * r, sp.center[1], from[2] + Math.sin(a) * r]);
          if (offAxis(c, head) > (relax ? 72 : MAX_ANGLE) || flat(c, head) < (relax ? 0.35 : 0.7) || flat(c, head) > MAX_REACH) continue;
          if (blockers.some((bl) => bl.id !== sp.id && under(bl, c)) || spots.some((q) => flat(q.pos, c) < 0.35)) continue;
          if (occluded(planes, head, [c[0], c[1] + 0.12, c[2]], floorY, sp.id)) continue;
          best = c; bestPlane = sp; break;
        }
      }
      if (best) break;
    }
    if (best) push('gate', bestPlane, best, true);
  }

  // 5. window: the sill where he watches the sun. A window, else wall art, else a wall in view.
  const winChains: [string[], boolean][] = [[['window', 'window frame'], false], [['wall art'], true], [['wall'], true]];
  for (const [labels, fb] of winChains) {
    const cands = byLabel(walls, labels, (p) => !used.has(p.id) || labels[0] === 'wall');
    const sorted = cands
      .map((p) => ({ p, pt: viewPoint(p, head) }))
      .filter(({ pt }) => offAxis(pt, head) <= MAX_ANGLE)
      .sort((a, b) => flat(a.pt, head) - flat(b.pt, head));
    let placed = false;
    for (const { p } of sorted) {
      const sillY = Math.max(floorY + 0.5, Math.min(floorY + 1.1, wallBottomY(p)));
      const pt = wallPoint(p, sillY, ahead(head, 1.5), head, wallBlockers, taken(), planes, floorY);
      if (pt) { push('window', p, pt, fb); placed = true; break; }
    }
    if (placed) break;
  }

  return { spots, floorY, planes };
}

/** Furniture as solid boxes: from the floor up to the surface, plus a back for couches and beds. */
function solidTop(p: Plane): number {
  // Couches have a back along their length; a bed is mostly flat (headboard at one end only).
  return p.center[1] + (['couch', 'sofa'].includes(p.label) ? 0.45 : p.label === 'bed' ? 0.12 : 0.02);
}

/** True when the straight line from the viewer's eyes to a point passes through furniture. */
export function occluded(planes: Plane[], head: Vec3, pt: Vec3, floorY: number, ownPlaneId?: string): boolean {
  const raised = planes.filter((p) => isUp(p) && p.center[1] > floorY + 0.1 && p.id !== ownPlaneId);
  const len = Math.hypot(pt[0] - head[0], pt[1] - head[1], pt[2] - head[2]);
  const steps = Math.ceil(len / 0.05);
  for (let i = 1; i < steps; i++) {
    const f = i / steps;
    if (len * (1 - f) < 0.12) break; // the spot's own surroundings
    const c: Vec3 = [head[0] + (pt[0] - head[0]) * f, head[1] + (pt[1] - head[1]) * f, head[2] + (pt[2] - head[2]) * f];
    for (const b of raised) {
      const d = sub(c, b.center);
      if (
        Math.abs(dot(d, b.axisX)) <= b.halfX + 0.1 &&
        Math.abs(dot(d, b.axisZ)) <= b.halfZ + 0.1 &&
        c[1] <= solidTop(b) && c[1] >= floorY
      ) return true;
    }
  }
  return false;
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
