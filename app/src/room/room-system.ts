import { createSystem, XRPlane } from '@iwsdk/core';
import { toPlane } from './read-planes.js';
import type { Plane } from './types.js';

type Listener = (planes: Plane[]) => void;

/**
 * Collects the room's labelled planes as the headset reports them and announces the
 * room once it has been stable for a moment. Also exposes the plane list on
 * `window.__room` and logs it once ("ROOMDUMP ...") so the offline staging check
 * can be fed the exact data the app saw.
 */
export class RoomSystem extends createSystem({
  planes: { required: [XRPlane] },
}) {
  private planes = new Map<number, Plane>();
  private lastChange = 0;
  private announced = false;
  private elapsed = 0;
  private listeners: Listener[] = [];

  onRoom(fn: Listener) {
    this.listeners.push(fn);
    if (this.announced) fn([...this.planes.values()]);
  }

  init(): void {
    this.queries.planes.subscribe('qualify', (e) => {
      const raw = e.getValue(XRPlane, '_plane') as Parameters<typeof toPlane>[2] | undefined;
      if (!raw) return;
      const p = toPlane(`p${e.index}`, e, raw);
      if (p) {
        this.planes.set(e.index, p);
        this.lastChange = this.elapsed;
      }
    });
    this.queries.planes.subscribe('disqualify', (e) => {
      this.planes.delete(e.index);
    });
  }

  update(delta: number): void {
    this.elapsed += delta;
    if (this.announced || this.planes.size === 0) return;
    // Planes arrive over the first seconds of a session; wait for a quiet second.
    if (this.elapsed - this.lastChange < 1.0) return;
    this.announced = true;
    const list = [...this.planes.values()];
    (window as unknown as { __room: Plane[] }).__room = list;
    console.log('ROOMDUMP ' + JSON.stringify(list));
    for (const fn of this.listeners) fn(list);
  }
}
