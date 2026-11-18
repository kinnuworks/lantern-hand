import {
  BackSide,
  Color,
  createSystem,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SphereGeometry,
  Vector3,
} from '@iwsdk/core';
import type { Object3D, PositionalAudio } from '@iwsdk/core';
import { RoomSystem } from '../room/room-system.js';
import { raycastPlanes } from '../room/raycast.js';
import { stage } from '../room/stage.js';
import type { BeatId, Plane, Spot, Vec3 } from '../room/types.js';
import { Caption } from './caption.js';
import { haloMat, markerMat, poolMat } from './glow.js';
import { Hands } from './hands.js';
import { AnchorKeeper } from './anchor-keeper.js';
import { makeCutout, setCutoutImage } from './cutout.js';
import { ART, askLine, C2, LINES, MUSIC, ORDER, SFX } from './script.js';
import type { Line } from './script.js';
import { Sound } from './sound.js';

type Phase = 'waiting-room' | 'intro' | 'story' | 'done';
type MoveKind = 'walk' | 'hop' | 'sail';
interface Move { from: Vector3; to: Vector3; kind: MoveKind; t: number; dur: number; done: () => void }

const TRAVELLER_H = 0.33;
const LIT_RADIUS = 0.42; // how close the light pool must be to the glow (metres)
const AIM_CONE = 14; // degrees: pointing this close to the glow snaps the light onto it (hands are noisy)
const LIT_DWELL = 0.7; // seconds the light must rest there
const GAZE_AFTER = 7; // seconds without a lit hand before head-gaze takes over
const HINT_AFTER = 14;
const AUTO_AFTER = 45; // never leave anyone stuck

const STORE_KEY = 'lantern-hand:v1';

/**
 * The whole chapter: reads the staged room, runs the beats, moves the traveller
 * along the lantern's light, and plays narration and sound from the right places.
 */
export class StorySystem extends createSystem({}) {
  private hands = new Hands();
  private keeper = new AnchorKeeper();
  private perfClock = 0;
  private sound!: Sound;
  private caption!: Caption;
  private planes: Plane[] = [];
  private spots = new Map<BeatId, Spot>();
  private phase: Phase = 'waiting-room';
  private root = new Group();

  private traveller!: Mesh;
  private lantern!: Mesh;
  private pool!: Mesh;
  private halo!: Mesh;
  private glow!: Mesh;
  private night!: Mesh;
  private boat: Mesh | null = null;
  private handHint: Mesh | null = null;
  private knocks: number[] = [];
  private tipWasUp = true;
  private knocked = false; // two knocks on the table wake him without the light
  private moves: Move[] = [];
  private bob = 0;
  private walkAudio: PositionalAudio | null = null;

  private target: Spot | null = null;
  private litFor = 0;
  private waitingFor = 0;
  private hinted = false;
  private noHandFor = 0;
  private onLit: (() => void) | null = null;
  private lanternLit = false;
  private onLanternLit: (() => void) | null = null;
  private dawn = 0; // 0 night, 1 sunrise
  private gazeMode = false;

  private tmpO = new Vector3();
  private tmpD = new Vector3();
  private tmpV = new Vector3();
  private head = new Vector3();

  init(): void {
    this.scene.add(this.root);
    this.sound = new Sound(this.camera);
    this.caption = new Caption(this.camera);
    void this.sound.preload([...Object.values(LINES).map((l) => l.audio), ...Object.values(C2).map((l) => l.audio), ...Object.values(SFX), MUSIC]);

    // The night: a soft dark veil over passthrough that lifts at dawn.
    this.night = new Mesh(
      new SphereGeometry(8, 32, 16),
      new MeshBasicMaterial({ color: new Color('#14102e'), transparent: true, opacity: 0, side: BackSide, depthWrite: false }),
    );
    this.night.renderOrder = -1;
    this.root.add(this.night);

    // Light pool where the lantern's beam lands, and the glow that marks where to aim.
    this.pool = new Mesh(new PlaneGeometry(0.42, 0.42), poolMat());
    this.pool.visible = false;
    this.root.add(this.pool);
    this.glow = new Mesh(new PlaneGeometry(0.34, 0.34), markerMat());
    this.glow.visible = false;
    this.root.add(this.glow);
    // Warm light in the open palm, behind the lantern, so it reads as held and lit.
    this.halo = new Mesh(new PlaneGeometry(0.26, 0.26), haloMat());
    this.halo.visible = false;
    this.halo.renderOrder = 1;
    this.root.add(this.halo);

    void makeCutout(ART.handHint, 0.12).then((h) => {
      this.handHint = h;
      h.position.set(0, -0.2, -0.75);
      (h.material as MeshBasicMaterial).depthTest = false;
      (h.material as MeshBasicMaterial).transparent = true;
      h.renderOrder = 9;
      h.visible = false;
      this.camera.add(h);
    });
    void Promise.all([makeCutout(ART.asleep, TRAVELLER_H * 0.75), makeCutout(ART.lantern, 0.11)]).then(([t, l]) => {
      this.traveller = t;
      this.traveller.visible = false;
      this.root.add(t);
      this.lantern = l;
      this.lantern.visible = false;
      this.root.add(l);
    });

    const room = this.world.getSystem(RoomSystem);
    room?.onRoom((planes, standin) => this.begin(planes, standin));
    (window as unknown as { __story: unknown }).__story = this;
  }

  /** Room is known: stage it and start the chapter. */
  private begin(planes: Plane[], standin: boolean) {
    if (this.phase !== 'waiting-room') return;
    this.planes = planes;
    this.camera.getWorldPosition(this.head);
    this.camera.getWorldDirection(this.tmpD);
    const staged = stage(planes, [this.head.x, this.head.y, this.head.z], [this.tmpD.x, 0, this.tmpD.z]);
    const spots = staged.spots;
    // Partial scans are completed with stand-in pieces; draw those as paper so Wick never stands on air.
    this.planes = staged.planes;
    const added = staged.planes.filter((p) => p.id.startsWith('s-'));
    if (standin || added.length) this.drawStandin(added);
    if (added.length && !standin) console.log('ROOM_COMPLETED ' + added.map((p) => p.label).join(','));
    for (const s of spots) this.spots.set(s.beat, s);
    (window as unknown as { __spots: Spot[] }).__spots = spots;
    console.log('STAGED ' + JSON.stringify(spots.map((s) => ({ beat: s.beat, label: s.label, fallback: s.fallback, pos: s.pos }))));
    this.sound.resume();
    void this.sound.startMusic(MUSIC);
    this.phase = 'intro';
    const start = new URLSearchParams(location.search).get('state') as BeatId | 'end' | 'ch2' | null;
    void this.run(start);
  }

  private async run(start: BeatId | 'end' | 'ch2' | null) {
    const saved = readSave();
    const table = this.spots.get('table');
    if (!table) { console.error('STAGING_FAILED no table spot'); this.caption.show('Something went wrong reading your room. Please exit and enter again.'); return; }
    if (start === 'ch2' || (!start && saved.chapter >= 1)) {
      await this.chapterTwo(saved.chapter >= 2);
      return;
    }

    // Intro: the lantern.
    await this.placeTraveller(table, ART.asleep);
    if (this.standinNote) {
      this.caption.show("No room scan yet, so Wick is using a paper stand-in room. Set up your space in the headset's settings to play on your own furniture.");
      await new Promise((r) => setTimeout(r, 6000));
    }
    if (!start || start === 'table') {
      await this.say(LINES.intro);
      await this.waitLantern();
      if (!this.gazeMode) {
        void this.sound.at(this.lantern, SFX.chime);
        await this.say(LINES.lantern);
      }
    } else {
      this.lanternLit = true;
    }
    this.phase = 'story';

    let i = start && start !== 'end' ? ORDER.indexOf(start) : 0;
    if (start === 'end') i = ORDER.length;
    // Jumping ahead (?state=): put him where the previous beat left him.
    if (i > 0) await this.placeTraveller(this.spots.get(ORDER[Math.min(i, ORDER.length) - 1])!, ART.traveller);

    for (; i < ORDER.length; i++) {
      const beat = ORDER[i];
      const spot = this.spots.get(beat);
      if (!spot) continue;
      await this.beat(beat, spot);
    }
    await this.ending();
  }

  private async beat(beat: BeatId, spot: Spot) {
    if (beat === 'gate') await this.showGate(spot);
    void this.say(askLine(beat, spot.fallback));
    await this.waitLit(spot);
    switch (beat) {
      case 'table':
        void this.sound.at(this.traveller, SFX.yawn);
        await setCutoutImage(this.traveller, ART.traveller, TRAVELLER_H);
        await this.say(LINES.wake);
        break;
      case 'ridge':
        await this.travel(spot, 'hop');
        void this.sound.at(this.traveller, SFX.wind, { loop: false, volume: 0.6 });
        await this.say(LINES.ridge);
        break;
      case 'sea': {
        await this.travel(spot, 'hop');
        this.boat = await makeCutout(ART.boat, 0.19);
        this.boat.position.copy(this.traveller.position);
        this.root.add(this.boat);
        void this.sound.at(this.boat, SFX.water, { loop: false, volume: 0.7 });
        await this.say(LINES.boat);
        break;
      }
      case 'gate':
        void this.sound.at(this.traveller, SFX.gate);
        await this.travel(spot, this.boat ? 'sail' : 'walk');
        if (this.boat) { this.root.remove(this.boat); this.boat = null; }
        break;
      case 'window':
        await this.travel(spot, 'hop');
        await setCutoutImage(this.traveller, ART.sitting, TRAVELLER_H * 0.8);
        break;
    }
  }

  private async ending() {
    this.target = null;
    this.glow.visible = false;
    const w = this.spots.get('window');
    if (w) {
      const sun = await makeCutout(ART.sun, 0.5);
      sun.position.set(w.pos[0], w.pos[1] - 0.3, w.pos[2]);
      this.faceViewer(sun);
      this.root.add(sun);
      void this.sound.at(sun, SFX.dawn, { volume: 0.8 });
      this.rise = { mesh: sun, from: w.pos[1] - 0.3, to: w.pos[1] + 0.25, t: 0 };
    }
    await this.say(LINES.dawn);
    await this.say(LINES.bye);
    this.caption.show('Lantern Hand  ·  Chapter one: The long way to the window');
    const save = readSave(); save.finished = true; save.chapter = Math.max(save.chapter, 1); writeSave(save);
    // Pin his resting place to the real room so next time he is exactly where you left him.
    this.keeper.save(this.traveller.getWorldPosition(new Vector3()));
    this.phase = 'done';
    console.log('CHAPTER_END');
  }

  private rise: { mesh: Object3D; from: number; to: number; t: number } | null = null;

  /** Chapter two: from the windowsill, hang three stars on the wall and climb to the moon. */
  private async chapterTwo(again: boolean) {
    console.log('RETURN_VISIT');
    const staged = this.spots.get('window') ?? this.spots.get('table')!;
    // Where you left him last night, from the persistent anchor if the headset still knows the spot.
    const pinned = await this.keeper.restore();
    const w: Spot = pinned && pinned.distanceTo(new Vector3(...staged.pos)) < 1.5
      ? { ...staged, pos: [pinned.x, pinned.y, pinned.z] }
      : staged;
    await this.placeTraveller(w, ART.sitting);
    if (again) {
      this.caption.show('Chapter three is still being written. Here is chapter two again.');
      await new Promise((r) => setTimeout(r, 4000));
    }
    await this.say(C2.sill);
    await this.waitLantern();
    if (!this.gazeMode) void this.sound.at(this.lantern, SFX.chime);
    this.phase = 'story';

    // Star spots on the wall above the sill: up the wall, swinging left and right.
    const plane = this.planes.find((p) => p.id === w.planeId);
    const n = plane && plane.orientation === 'vertical' ? plane.normal : ([0, 0, 1] as Vec3);
    const right = new Vector3(n[2], 0, -n[0]).normalize();
    const offs: [number, number][] = [[-0.16, 0.34], [0.14, 0.62], [-0.05, 0.9]];
    const lines = [C2.star1, C2.star2, C2.star3];
    const beats: BeatId[] = ['star1', 'star2', 'star3'];
    const stars: Spot[] = [];
    for (let i = 0; i < 3; i++) {
      const pos: Vec3 = [w.pos[0] + right.x * offs[i][0], w.pos[1] + offs[i][1], w.pos[2] + right.z * offs[i][0]];
      const spot: Spot = { beat: beats[i], pos, normal: n, planeId: w.planeId, label: 'star', fallback: false };
      stars.push(spot);
      void this.say(lines[i]);
      await this.waitLit(spot);
      const star = await makeCutout(ART.star, 0.13);
      star.position.set(pos[0], pos[1] - 0.06, pos[2]);
      this.tmpV.set(pos[0] + n[0], pos[1] - 0.06, pos[2] + n[2]);
      star.lookAt(this.tmpV);
      this.root.add(star);
      void this.sound.at(star, SFX.chime, { volume: 0.6 });
    }
    const top = stars[2].pos;
    const moon = await makeCutout(ART.moon, 0.3);
    moon.position.set(top[0] - right.x * 0.2, top[1] + 0.22, top[2] - right.z * 0.2);
    this.tmpV.set(moon.position.x + n[0], moon.position.y, moon.position.z + n[2]);
    moon.lookAt(this.tmpV);
    this.root.add(moon);
    await setCutoutImage(this.traveller, ART.traveller, TRAVELLER_H * 0.8);
    await this.say(C2.moon);
    for (const st of stars) await this.travel({ ...st, pos: [st.pos[0], st.pos[1] - 0.02, st.pos[2]] }, 'hop');
    await this.travel({ ...stars[2], pos: [moon.position.x, moon.position.y + 0.02, moon.position.z] }, 'hop');
    await setCutoutImage(this.traveller, ART.asleep, TRAVELLER_H * 0.6);
    await this.say(C2.end);
    this.caption.show('Lantern Hand  ·  Chapter two: Three stars to the moon');
    const save = readSave(); save.finished = true; save.chapter = 2; writeSave(save);
    this.phase = 'done';
    console.log('CHAPTER_END 2');
  }

  /** Paper surfaces for the stand-in room, so Wick never stands on thin air. */
  private drawStandin(planes: Plane[]) {
    this.standinNote = true;
    for (const p of planes) {
      if (p.label === 'floor' || p.label === 'wall') continue;
      const mesh = new Mesh(new PlaneGeometry(p.halfX * 2, p.halfZ * 2), new MeshBasicMaterial({ color: new Color(p.orientation === 'horizontal' ? '#d9c7a3' : '#c9b48f'), transparent: true, opacity: 0.85 }));
      mesh.position.set(...p.center);
      this.tmpV.set(p.center[0] + p.normal[0], p.center[1] + p.normal[1], p.center[2] + p.normal[2]);
      mesh.lookAt(this.tmpV);
      this.root.add(mesh);
    }
  }

  private standinNote = false;

  // ---- helpers -------------------------------------------------------------------------

  private async say(line: Line) {
    this.caption.show(line.text);
    await this.sound.say(line.audio);
  }

  private waitLantern(): Promise<void> {
    if (this.lanternLit) return Promise.resolve();
    return new Promise((resolve) => { this.onLanternLit = resolve; });
  }

  private waitLit(spot: Spot): Promise<void> {
    console.log(`TARGET ${spot.beat} ${JSON.stringify(spot.pos)}`);
    this.target = spot;
    this.litFor = 0;
    this.knocked = false;
    this.waitingFor = 0;
    this.hinted = false;
    this.glow.visible = true;
    this.glow.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
    this.tmpV.set(spot.pos[0] + spot.normal[0], spot.pos[1] + spot.normal[1], spot.pos[2] + spot.normal[2]);
    this.glow.lookAt(this.tmpV);
    this.glow.position.addScaledVector(this.tmpV.set(...spot.normal), 0.004);
    return new Promise((resolve) => {
      this.onLit = () => { this.target = null; this.glow.visible = false; resolve(); };
    });
  }

  private async placeTraveller(spot: Spot, art: string) {
    while (!this.traveller) await new Promise((r) => setTimeout(r, 50));
    await setCutoutImage(this.traveller, art, art === ART.asleep ? TRAVELLER_H * 0.75 : TRAVELLER_H);
    this.traveller.position.set(...spot.pos);
    this.traveller.visible = true;
  }

  private async showGate(spot: Spot) {
    const gate = await makeCutout(ART.gate, 0.36);
    gate.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
    this.tmpV.set(spot.pos[0] + spot.normal[0], spot.pos[1], spot.pos[2] + spot.normal[2]);
    gate.lookAt(this.tmpV);
    this.root.add(gate);
  }

  private travel(spot: Spot, kind: MoveKind): Promise<void> {
    const to = new Vector3(...spot.pos);
    const from = this.traveller.position.clone();
    const dist = from.distanceTo(to);
    const speed = kind === 'walk' ? 0.22 : kind === 'sail' ? 0.25 : 0.9;
    const dur = Math.max(kind === 'hop' ? 0.9 : 1.5, dist / speed);
    if (kind === 'hop') void this.sound.at(this.traveller, SFX.hop, { volume: 0.7 });
    return new Promise((resolve) => this.moves.push({ from, to, kind, t: 0, dur, done: resolve }));
  }

  private faceViewer(obj: Object3D) {
    this.camera.getWorldPosition(this.head);
    this.tmpV.set(this.head.x, obj.position.y, this.head.z);
    obj.lookAt(this.tmpV);
  }

  // ---- per frame -----------------------------------------------------------------------

  update(delta: number): void {
    const dt = Math.min(delta, 0.05);
    this.caption.update(dt);
    if (this.phase === 'waiting-room' || !this.traveller) return;
    this.hands.update(this.renderer, this.player);
    this.keeper.update(this.renderer, this.player);
    // Frame cost for the evidence log: what the renderer drew last frame, every 5 s while the story runs.
    this.perfClock += dt;
    if (this.perfClock > 5) {
      this.perfClock = 0;
      const info = this.renderer.info;
      console.log('PERF ' + JSON.stringify({ calls: info.render.calls, triangles: info.render.triangles, geometries: info.memory.geometries, textures: info.memory.textures, phase: this.phase, beat: this.target?.beat ?? null }));
    }

    // Night veil: dark during the story, lifts at dawn.
    const nightMat = this.night.material as MeshBasicMaterial;
    const want = this.phase === 'done' ? 0.12 : 0.55;
    nightMat.opacity += (want - nightMat.opacity) * Math.min(1, dt * 0.8);
    this.camera.getWorldPosition(this.night.position);
    if (this.phase === 'done') nightMat.color.lerp(DAWN, Math.min(1, dt * 0.3));

    // Lantern on the open hand.
    const hand = this.hands.lantern();
    if (hand) {
      this.lantern.visible = true;
      this.lantern.position.copy(hand.palm).addScaledVector(hand.up, 0.05);
      this.faceViewer(this.lantern);
      this.halo.visible = true;
      this.halo.position.copy(hand.palm).addScaledVector(hand.up, 0.035);
      this.faceViewer(this.halo);
      this.halo.scale.setScalar(1 + Math.sin(performance.now() / 420) * 0.05);
      this.lantern.renderOrder = 2;
      if (!this.lanternLit) {
        this.lanternLit = true;
        console.log('LANTERN_LIT');
        this.onLanternLit?.();
        this.onLanternLit = null;
      }
      this.noHandFor = 0;
    } else {
      this.lantern.visible = false;
      this.halo.visible = false;
      this.noHandFor += dt;
      // No hands at all (or hands the tracker can't see): carry on with looking instead of pointing.
      if (!this.lanternLit && this.noHandFor > GAZE_AFTER + 3 && this.onLanternLit) {
        this.lanternLit = true;
        this.gazeMode = true;
        console.log('GAZE_MODE');
        this.caption.show('No hands needed: just look at the little glow and hold your gaze there.');
        this.onLanternLit();
        this.onLanternLit = null;
      }
    }

    // A paper hand shows what to do, with no text: before the lantern is lit, and when the hand is lost.
    if (this.handHint) {
      const want = !this.gazeMode && this.phase !== 'done' && (!this.lanternLit ? this.phase === 'intro' : this.noHandFor > 3 && !!this.target && this.noHandFor < GAZE_AFTER);
      const hm = this.handHint.material as MeshBasicMaterial;
      hm.opacity += ((want ? 0.9 : 0) - hm.opacity) * Math.min(1, dt * 4);
      this.handHint.visible = hm.opacity > 0.02;
      this.handHint.scale.setScalar(1 + Math.sin(performance.now() / 400) * 0.06);
    }

    // Knock twice on the surface where he sleeps to wake him (a fingertip tapping the real table).
    if (this.target && this.target.beat === 'table' && this.onLit) {
      const plane = this.planes.find((p) => p.id === this.target!.planeId);
      const h = this.hands.right.tracked ? this.hands.right : this.hands.left.tracked ? this.hands.left : null;
      if (plane && h) {
        const tip = h.index.y < h.middle.y ? h.index : h.middle;
        const dy = tip.y - plane.center[1];
        const inside = Math.abs((tip.x - plane.center[0]) * plane.axisX[0] + (tip.z - plane.center[2]) * plane.axisX[2]) < plane.halfX + 0.05 &&
          Math.abs((tip.x - plane.center[0]) * plane.axisZ[0] + (tip.z - plane.center[2]) * plane.axisZ[2]) < plane.halfZ + 0.05;
        const down = inside && dy < 0.025;
        if (DEBUG && Math.floor(this.waitingFor * 2) !== Math.floor((this.waitingFor - dt) * 2)) {
          console.log('KNOCKDBG ' + JSON.stringify({ hand: h === this.hands.right ? 'right' : 'left', dy: r2(dy), inside, down, up: this.tipWasUp, tip: tip.toArray().map(r2), plane: plane.center.map(r2) }));
        }
        const now = performance.now() / 1000;
        if (down && this.tipWasUp) {
          this.knocks = this.knocks.filter((k) => now - k < 2.5);
          this.knocks.push(now);
          if (this.knocks.length >= 2) {
            this.knocks = [];
            void this.sound.at(this.traveller, SFX.knock);
            console.log('KNOCK');
            this.knocked = true;
          }
        }
        this.tipWasUp = dy > 0.05 ? true : down ? false : this.tipWasUp;
      }
    }

    // Beam: from the open hand, or from the head after a while with no hand (accessibility).
    let aiming = false;
    if (hand) {
      this.tmpO.copy(hand.palm);
      this.tmpD.copy(hand.dir);
      aiming = true;
    } else if (this.noHandFor > GAZE_AFTER && this.target) {
      this.camera.getWorldPosition(this.tmpO);
      this.camera.getWorldDirection(this.tmpD);
      aiming = true;
    }
    let hit = aiming
      ? raycastPlanes(this.planes, [this.tmpO.x, this.tmpO.y, this.tmpO.z], [this.tmpD.x, this.tmpD.y, this.tmpD.z])
      : null;
    // Aim assist: pointing roughly at the glow puts the light on it.
    if (aiming && this.target) {
      const t = this.target.pos;
      this.tmpV.set(t[0] - this.tmpO.x, t[1] - this.tmpO.y, t[2] - this.tmpO.z).normalize();
      const ang = (Math.acos(Math.max(-1, Math.min(1, this.tmpV.dot(this.tmpD)))) * 180) / Math.PI;
      const cone = this.noHandFor > GAZE_AFTER ? AIM_CONE * 0.8 : AIM_CONE;
      if (ang < cone) {
        const plane = this.planes.find((p) => p.id === this.target!.planeId)!;
        hit = { plane, point: [t[0], t[1], t[2]], distance: 0 };
      }
    }
    if (hit) {
      this.pool.visible = true;
      this.pool.position.set(...hit.point);
      this.tmpV.set(hit.point[0] + hit.plane.normal[0], hit.point[1] + hit.plane.normal[1], hit.point[2] + hit.plane.normal[2]);
      this.pool.lookAt(this.tmpV);
      this.pool.position.addScaledVector(this.tmpV.set(...hit.plane.normal), 0.006);
    } else {
      this.pool.visible = false;
    }

    // Is the target lit?
    if (this.target && this.onLit) {
      this.waitingFor += dt;
      if (DEBUG && Math.floor(this.waitingFor * 0.5) !== Math.floor((this.waitingFor - dt) * 0.5)) {
        console.log('AIM ' + JSON.stringify({ o: this.tmpO.toArray().map(r2), d: this.tmpD.toArray().map(r2), hit: hit ? [hit.plane.label, ...hit.point.map(r2)] : null, target: this.target.pos.map(r2), hand: !!hand, trav: this.traveller.position.toArray().map(r2), vis: this.traveller.visible }));
      }
      const t = this.target.pos;
      const near = hit ? dist3(hit.point, t) < LIT_RADIUS : false;
      this.litFor = near ? this.litFor + dt : Math.max(0, this.litFor - dt * 2);
      const pulse = 1 + Math.sin(performance.now() / 260) * 0.12 + Math.min(this.litFor / LIT_DWELL, 1) * 0.6;
      this.glow.scale.setScalar(pulse);
      const dwell = this.noHandFor > GAZE_AFTER ? LIT_DWELL * 2 : LIT_DWELL;
      if (!this.hinted && this.waitingFor > HINT_AFTER) {
        this.hinted = true;
        void this.say(LINES.hintPoint);
      }
      if (this.knocked || this.litFor >= dwell || this.waitingFor > AUTO_AFTER) {
        const done = this.onLit;
        this.onLit = null;
        console.log(`BEAT_LIT ${this.target.beat} ${this.knocked ? 'by-knock' : this.litFor >= dwell ? 'by-light' : 'auto'}`);
        this.knocked = false;
        void this.sound.at(this.glow, SFX.chime, { volume: 0.5 });
        done();
      }
    }

    // Traveller movement and paper-puppet bob.
    const m = this.moves[0];
    if (m) {
      m.t = Math.min(m.t + dt / m.dur, 1);
      const e = m.t < 0.5 ? 2 * m.t * m.t : 1 - Math.pow(-2 * m.t + 2, 2) / 2;
      this.traveller.position.lerpVectors(m.from, m.to, m.kind === 'hop' ? m.t : e);
      if (m.kind === 'hop') {
        const lift = Math.max(0.18, Math.abs(m.to.y - m.from.y) + 0.15);
        this.traveller.position.y += Math.sin(Math.PI * m.t) * lift;
      } else {
        this.bob += dt * 9;
        this.traveller.position.y += Math.abs(Math.sin(this.bob)) * 0.012;
      }
      this.traveller.rotation.z = m.kind === 'hop' ? 0 : Math.sin(this.bob) * 0.06;
      if (this.boat) this.boat.position.copy(this.traveller.position).setY(m.kind === 'sail' ? this.traveller.position.y - 0.012 : this.boat.position.y);
      if (m.t >= 1) {
        this.moves.shift();
        this.traveller.rotation.z = 0;
        m.done();
      }
    }
    this.faceViewer(this.traveller);
    if (this.boat) this.faceViewer(this.boat);

    if (this.rise) {
      this.rise.t = Math.min(1, this.rise.t + dt / 6);
      this.rise.mesh.position.y = this.rise.from + (this.rise.to - this.rise.from) * this.rise.t;
    }
  }
}

const DAWN = new Color('#ffb27a');
const DEBUG = new URLSearchParams(location.search).has('debug') || location.hostname === 'localhost';
const r2 = (n: number) => Math.round(n * 100) / 100;

function dist3(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

interface Save { finished: boolean; chapter: number }
function readSave(): Save {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as Save;
  } catch { /* private mode: start fresh */ }
  return { finished: false, chapter: 0 };
}
function writeSave(s: Save) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* private mode: nothing to keep */ }
}
