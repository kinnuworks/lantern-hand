import type { Plane, Vec3 } from './types.js';

/**
 * A small stand-in room, built around the viewer, for headsets with no room scan
 * (no Space Setup, or spatial data access declined). Same plane format as a real scan,
 * marked with the label prefix "standin" so the story can draw it.
 */
export function standinRoom(head: Vec3, forward: Vec3): Plane[] {
  const l = Math.hypot(forward[0], forward[2]) || 1;
  const f: Vec3 = [forward[0] / l, 0, forward[2] / l];
  const r: Vec3 = [-f[2], 0, f[0]]; // right
  const floorY = head[1] - 1.15;
  const at = (fw: number, rt: number, y: number): Vec3 => [head[0] + f[0] * fw + r[0] * rt, y, head[2] + f[2] * fw + r[2] * rt];
  const flatPlane = (id: string, label: string, c: Vec3, hx: number, hz: number): Plane => ({
    id, label, orientation: 'horizontal', center: c, normal: [0, 1, 0], axisX: r, axisZ: [-f[0], 0, -f[2]], halfX: hx, halfZ: hz,
  });
  const wall = (id: string, label: string, c: Vec3, hw: number, hh: number): Plane => ({
    id, label, orientation: 'vertical', center: c, normal: [-f[0], 0, -f[2]], axisX: r, axisZ: [0, -1, 0], halfX: hw, halfZ: hh,
  });
  return [
    flatPlane('s-floor', 'floor', at(1.2, 0, floorY), 2.2, 2.2),
    flatPlane('s-table', 'table', at(0.75, 0.05, floorY + 0.42), 0.32, 0.22),
    flatPlane('s-couch', 'couch', at(1.65, -0.75, floorY + 0.45), 0.6, 0.25),
    wall('s-wall', 'wall', at(3.0, 0, floorY + 1.3), 2.2, 1.3),
    wall('s-door', 'door', at(2.98, 1.1, floorY + 1.0), 0.45, 1.0),
    wall('s-window', 'window', at(2.98, -0.4, floorY + 1.45), 0.55, 0.45),
  ];
}
