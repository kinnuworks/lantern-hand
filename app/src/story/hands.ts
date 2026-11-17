import { Matrix4, Vector3 } from '@iwsdk/core';
import type { Object3D, WebGLRenderer } from '@iwsdk/core';

export interface HandState {
  tracked: boolean;
  /** Fingers spread: the lantern is lit. */
  open: boolean;
  /** Centre of the palm, world space. */
  palm: Vector3;
  /** Direction the hand points (wrist toward middle fingertip), world space, unit. */
  dir: Vector3;
  /** Palm normal (out of the palm), world space, unit. */
  up: Vector3;
  /** Index and middle fingertips, world space (for knocking on surfaces). */
  index: Vector3;
  middle: Vector3;
}

const JOINTS = [
  'wrist',
  'middle-finger-metacarpal',
  'index-finger-tip',
  'middle-finger-tip',
  'ring-finger-tip',
  'pinky-finger-tip',
  'index-finger-metacarpal',
  'pinky-finger-metacarpal',
] as const;

/**
 * Reads WebXR hand joints each frame and decides, per hand, whether it is an open
 * palm (lantern lit) and where it points. No pinch is used anywhere: the system menu
 * owns palm-up pinches, so an open hand and a relaxed fist are the only states.
 */
export class Hands {
  readonly left: HandState = blank();
  readonly right: HandState = blank();
  private pos: Record<string, Vector3> = {};
  private m = new Matrix4();
  private a = new Vector3();
  private b = new Vector3();

  constructor() {
    for (const j of JOINTS) this.pos[j] = new Vector3();
  }

  update(renderer: WebGLRenderer, player: Object3D) {
    this.left.tracked = false;
    this.right.tracked = false;
    const frame = renderer.xr.getFrame?.();
    const ref = renderer.xr.getReferenceSpace?.();
    const session = renderer.xr.getSession?.();
    if (!frame || !ref || !session) return;
    player.updateWorldMatrix(true, false);
    for (const src of session.inputSources) {
      const hand = (src as XRInputSource & { hand?: XRHand }).hand;
      if (!hand || (src.handedness !== 'left' && src.handedness !== 'right')) continue;
      const st = src.handedness === 'left' ? this.left : this.right;
      let ok = true;
      for (const j of JOINTS) {
        const space = hand.get(j as XRHandJoint);
        const pose = space ? frame.getJointPose?.(space, ref) : undefined;
        if (!pose) { ok = false; break; }
        const t = pose.transform.position;
        this.pos[j].set(t.x, t.y, t.z).applyMatrix4(player.matrixWorld);
      }
      if (!ok) continue;
      st.tracked = true;
      st.index.copy(this.pos['index-finger-tip']);
      st.middle.copy(this.pos['middle-finger-tip']);
      const w = this.pos['wrist'];
      const mm = this.pos['middle-finger-metacarpal'];
      // Palm centre: between wrist and middle metacarpal.
      st.palm.copy(w).lerp(mm, 0.6);
      st.dir.copy(this.pos['middle-finger-tip']).sub(w).normalize();
      // Palm normal from the palm's two edges.
      this.a.copy(this.pos['index-finger-metacarpal']).sub(w);
      this.b.copy(this.pos['pinky-finger-metacarpal']).sub(w);
      st.up.crossVectors(this.a, this.b).normalize();
      if (src.handedness === 'left') st.up.negate();
      // Open (or relaxed) hand: fingertips far from the wrist. Measured in the emulator:
      // open 0.178 m, relaxed 0.177 m, fist 0.068 m on average, so 0.13 m splits them cleanly.
      const tips = ['index-finger-tip', 'middle-finger-tip', 'ring-finger-tip', 'pinky-finger-tip'];
      let reach = 0;
      for (const tip of tips) reach += this.pos[tip].distanceTo(w);
      st.open = reach / tips.length > 0.13;
    }
  }

  /** The hand holding the lantern: an open, tracked hand (right preferred). */
  lantern(): HandState | null {
    if (this.right.tracked && this.right.open) return this.right;
    if (this.left.tracked && this.left.open) return this.left;
    return null;
  }

  anyTracked() {
    return this.left.tracked || this.right.tracked;
  }
}

function blank(): HandState {
  return { tracked: false, open: false, palm: new Vector3(), dir: new Vector3(0, 0, -1), up: new Vector3(0, 1, 0), index: new Vector3(), middle: new Vector3() };
}
