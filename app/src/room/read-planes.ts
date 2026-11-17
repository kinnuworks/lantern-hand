import { Vector3 } from '@iwsdk/core';
import type { Entity } from '@iwsdk/core';
import type { Plane, Vec3 } from './types.js';

type XRPlaneLike = {
  orientation?: string;
  semanticLabel?: string;
  polygon?: ArrayLike<{ x: number; y: number; z: number }>;
};

const v = new Vector3();

/**
 * Turns one detected WebXR plane into the plain description the stager uses:
 * world-space centre, normal, in-plane axes and extents (from the polygon).
 */
export function toPlane(id: string, entity: Entity, raw: XRPlaneLike): Plane | null {
  const obj = entity.object3D;
  if (!obj || !raw.polygon || raw.polygon.length < 3) return null;
  obj.updateWorldMatrix(true, false);
  const m = obj.matrixWorld;

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < raw.polygon.length; i++) {
    const p = raw.polygon[i];
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;

  const center = v.set(cx, 0, cz).applyMatrix4(m).toArray() as Vec3;
  const e = m.elements;
  const norm = (x: number, y: number, z: number): Vec3 => {
    const l = Math.hypot(x, y, z) || 1;
    return [x / l, y / l, z / l];
  };
  // WebXR plane space: y is the plane normal, x and z lie in the plane.
  const axisX = norm(e[0], e[1], e[2]);
  const normal = norm(e[4], e[5], e[6]);
  const axisZ = norm(e[8], e[9], e[10]);

  return {
    id,
    label: (raw.semanticLabel ?? 'other').toLowerCase(),
    orientation: raw.orientation === 'vertical' ? 'vertical' : 'horizontal',
    center,
    normal,
    axisX,
    axisZ,
    halfX: (maxX - minX) / 2,
    halfZ: (maxZ - minZ) / 2,
  };
}
