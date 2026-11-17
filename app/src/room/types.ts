export type Vec3 = [number, number, number];

/** A detected real-world surface, in world space. */
export interface Plane {
  id: string;
  /** Semantic label from the room scan: table, couch, floor, wall, door, window, wall art, ... */
  label: string;
  orientation: 'horizontal' | 'vertical';
  center: Vec3;
  /** Unit normal pointing out of the surface (up for floors and tables, into the room for walls). */
  normal: Vec3;
  /** In-plane unit axes and half extents along them. */
  axisX: Vec3;
  axisZ: Vec3;
  halfX: number;
  halfZ: number;
}

export type BeatId = 'table' | 'ridge' | 'sea' | 'gate' | 'window';

/** Where one story beat happens. */
export interface Spot {
  beat: BeatId;
  /** Point on the surface where the traveller stands, in world space. */
  pos: Vec3;
  /** Surface normal at that point. */
  normal: Vec3;
  /** Plane the spot sits on. */
  planeId: string;
  label: string;
  /** True when the wished-for label was missing and a fallback surface was used. */
  fallback: boolean;
}
