import { Matrix4, Vector3 } from '@iwsdk/core';
import type { Object3D, WebGLRenderer } from '@iwsdk/core';

const KEY = 'lantern-hand:anchor';

type AnchorLike = {
  anchorSpace: XRSpace;
  requestPersistentHandle?: () => Promise<string>;
};
type FrameWithAnchors = XRFrame & {
  createAnchor?: (pose: XRRigidTransform, space: XRSpace) => Promise<AnchorLike>;
};
type SessionWithAnchors = XRSession & {
  restorePersistentAnchor?: (uuid: string) => Promise<AnchorLike>;
};

/**
 * Keeps Wick's resting place pinned to the real room between visits, with a WebXR
 * persistent anchor (Quest Browser allows a few per site). If the browser or the
 * room can't give one back, the story re-stages from the room scan instead.
 */
export class AnchorKeeper {
  private pendingSave: Vector3 | null = null;
  private restored: AnchorLike | null = null;
  private restoreWanted = false;
  private restoreResolve: ((p: Vector3 | null) => void) | null = null;
  private restoreDeadline = 0;
  private inv = new Matrix4();
  private v = new Vector3();

  /** Ask to pin a world-space point; done on the next XR frame. */
  save(world: Vector3) {
    this.pendingSave = world.clone();
  }

  /** Ask for last visit's pinned point, in world space; null if there is none or it can't be found in 4 s. */
  restore(): Promise<Vector3 | null> {
    let uuid: string | null = null;
    try { uuid = localStorage.getItem(KEY); } catch { /* no storage */ }
    if (!uuid) return Promise.resolve(null);
    this.restoreWanted = true;
    this.restoreDeadline = performance.now() + 4000;
    return new Promise((resolve) => { this.restoreResolve = resolve; });
  }

  update(renderer: WebGLRenderer, player: Object3D) {
    const frame = renderer.xr.getFrame?.() as FrameWithAnchors | undefined;
    const ref = renderer.xr.getReferenceSpace?.();
    const session = renderer.xr.getSession?.() as SessionWithAnchors | null;
    if (!frame || !ref || !session) return;

    if (this.pendingSave && frame.createAnchor) {
      const p = this.pendingSave;
      this.pendingSave = null;
      player.updateWorldMatrix(true, false);
      this.inv.copy(player.matrixWorld).invert();
      this.v.copy(p).applyMatrix4(this.inv); // world -> reference space
      frame.createAnchor(new XRRigidTransform({ x: this.v.x, y: this.v.y, z: this.v.z }), ref)
        .then((a) => a.requestPersistentHandle?.())
        .then((uuid) => {
          if (!uuid) { console.log('ANCHOR_UNAVAILABLE no persistent handle'); return; }
          try { localStorage.setItem(KEY, uuid); } catch { /* no storage */ }
          console.log('ANCHOR_SAVED ' + uuid);
        })
        .catch((err) => console.log('ANCHOR_UNAVAILABLE ' + String(err)));
    }

    if (this.restoreWanted) {
      this.restoreWanted = false;
      let uuid: string | null = null;
      try { uuid = localStorage.getItem(KEY); } catch { /* no storage */ }
      if (!uuid || !session.restorePersistentAnchor) { this.finish(null, 'no API or handle'); return; }
      session.restorePersistentAnchor(uuid)
        .then((a) => { this.restored = a; })
        .catch((err) => this.finish(null, String(err)));
    }

    if (this.restored && this.restoreResolve) {
      const pose = frame.getPose(this.restored.anchorSpace, ref);
      if (pose) {
        player.updateWorldMatrix(true, false);
        const t = pose.transform.position;
        const w = new Vector3(t.x, t.y, t.z).applyMatrix4(player.matrixWorld);
        this.restored = null;
        this.finish(w, '');
        return;
      }
    }
    if (this.restoreResolve && performance.now() > this.restoreDeadline) this.finish(null, 'not located in time');
  }

  private finish(p: Vector3 | null, why: string) {
    const r = this.restoreResolve;
    this.restoreResolve = null;
    if (p) console.log('ANCHOR_RESTORED ' + JSON.stringify(p.toArray().map((n) => Math.round(n * 1000) / 1000)));
    else console.log('ANCHOR_NONE ' + why);
    r?.(p);
  }
}
