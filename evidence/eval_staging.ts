/**
 * Our own break test of Lantern Hand's room staging (evidence/EVAL_PLAN.md).
 * Runs the app's real stager (app/src/room/stage.ts) on every captured emulator room
 * and on degraded copies of each, and checks every story beat lands on a real surface.
 *
 * Rerun: npx -y tsx evidence/eval_staging.ts   (from the repo root)
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { stage, under, isUp } from '../app/src/room/stage.ts';
import type { Plane, Spot, Vec3 } from '../app/src/room/types.ts';

const SEED = 20261118;
const TUNE = new Set(['sunlit_living_room', 'home_office']);
const BEATS = ['table', 'ridge', 'sea', 'gate', 'window'] as const;
const dir = join(import.meta.dirname, 'rooms');

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const dist = (a: Vec3, b: Vec3) => Math.hypot(...sub(a, b));

type Case = { name: string; base: string; planes: Plane[]; test: boolean };

function degrade(name: string, planes: Plane[]): Case[] {
  return [
    { name: `${name}/no-couch`, base: name, test: true, planes: planes.filter((p) => !['couch', 'bed', 'sofa'].includes(p.label)) },
    { name: `${name}/no-window-door`, base: name, test: true, planes: planes.filter((p) => !['window', 'door'].includes(p.label)) },
    { name: `${name}/floor-walls-only`, base: name, test: true, planes: planes.filter((p) => ['floor', 'wall'].includes(p.label)) },
  ];
}

function headFor(planes: Plane[]): Vec3 {
  const floor = planes.filter((p) => p.label === 'floor')[0];
  const fy = floor ? floor.center[1] : 0;
  return [0, fy + 1.2, 0]; // seated viewer at the emulator's origin
}

/** Every failure reason for one staged room (empty list = pass). */
function check(planes: Plane[], spots: Spot[], head: Vec3): string[] {
  const fails: string[] = [];
  const byId = new Map(planes.map((p) => [p.id, p]));
  for (const beat of BEATS) {
    const s = spots.find((x) => x.beat === beat);
    if (!s) { fails.push(`${beat}: not placed`); continue; }
    const p = byId.get(s.planeId)!;
    const d = sub(s.pos, p.center);
    const off = dot(d, p.normal);
    const inX = Math.abs(dot(d, p.axisX)) <= p.halfX + 0.03;
    const inZ = Math.abs(dot(d, p.axisZ)) <= p.halfZ + 0.03;
    const wallBeat = beat === 'gate' || beat === 'window';
    if (!wallBeat) {
      if (Math.abs(off) > 0.03) fails.push(`${beat}: ${off.toFixed(3)} m off its surface`);
      if (!inX || !inZ) fails.push(`${beat}: outside its surface`);
    } else {
      if (off < 0 || off > 0.15) fails.push(`${beat}: ${off.toFixed(3)} m from its wall (want 0 to 0.15)`);
    }
    for (const q of planes) {
      if (q.id !== s.planeId && isUp(q) && under(q, s.pos)) fails.push(`${beat}: hidden under ${q.label} ${q.id}`);
    }
    if (dist(s.pos, head) > 5) fails.push(`${beat}: ${dist(s.pos, head).toFixed(1)} m from the viewer`);
  }
  for (let i = 1; i < spots.length; i++) {
    if (dist(spots[i].pos, spots[i - 1].pos) < 0.2) fails.push(`${spots[i].beat}: on top of ${spots[i - 1].beat}`);
  }
  return fails;
}

/** Our own naive baseline: fixed offsets from the viewer, no scene data. */
function baseline(planes: Plane[], head: Vec3): Spot[] {
  const fy = head[1] - 1.2;
  const fixed: Record<string, Vec3> = {
    table: [0, fy + 0.75, -0.7], ridge: [0.6, fy + 0.45, -1.2], sea: [0, fy, -1.6],
    gate: [-1.0, fy, -2.0], window: [0, fy + 0.9, -2.5],
  };
  // Score each fixed point against the nearest plane so the same checks apply.
  return BEATS.map((beat) => {
    const pos = fixed[beat];
    const p = planes
      .map((q) => ({ q, d: Math.abs(dot(sub(pos, q.center), q.normal)) }))
      .sort((a, b) => a.d - b.d)[0].q;
    return { beat, pos, normal: p.normal, planeId: p.id, label: p.label, fallback: true };
  });
}

const cases: Case[] = [];
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const room = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  cases.push({ name: room.room, base: room.room, planes: room.planes, test: !TUNE.has(room.room) });
  cases.push(...degrade(room.room, room.planes));
}

const rows: string[] = [];
let k = 0, n = 0, bk = 0;
for (const c of cases) {
  const head = headFor(c.planes);
  const { spots } = stage(c.planes, head);
  const fails = check(c.planes, spots, head);
  const bfails = check(c.planes, baseline(c.planes, head), head);
  if (c.test) { n++; if (fails.length === 0) k++; if (bfails.length === 0) bk++; }
  const used = spots.map((s) => `${s.beat}:${s.label}${s.fallback ? '*' : ''}`).join(' ');
  rows.push(`| ${c.name} | ${c.test ? 'test' : 'tuning'} | ${fails.length === 0 ? 'pass' : 'FAIL'} | ${used} | ${fails.join('; ') || '-'} | ${bfails.length === 0 ? 'pass' : `fail (${bfails.length})`} |`);
}

const report = [
  `# Staging break test (seed ${SEED})`,
  '',
  `Test slice: ${k} of ${n} rooms pass. Our own naive baseline (fixed offsets, no scene data): ${bk} of ${n}.`,
  'Tuning rooms (sunlit_living_room, home_office) are listed but not counted. `*` marks a fallback surface.',
  '',
  '| Room | Slice | Result | Where each beat landed | Failures | Naive baseline |',
  '|---|---|---|---|---|---|',
  ...rows,
  '',
].join('\n');
writeFileSync(join(import.meta.dirname, 'staging-results.md'), report);
console.log(report.split('\n').slice(0, 3).join('\n'));
console.log(JSON.stringify({ k, n, baseline_k: bk }));
process.exit(k === n ? 0 : 1);
