import { Audio, AudioListener, AudioLoader, PositionalAudio } from '@iwsdk/core';
import type { Object3D } from '@iwsdk/core';

type ThreeAudioBuffer = AudioBuffer;

const loader = new AudioLoader();
const buffers = new Map<string, Promise<ThreeAudioBuffer>>();

function buffer(path: string): Promise<ThreeAudioBuffer> {
  let p = buffers.get(path);
  if (!p) {
    p = loader.loadAsync(`${import.meta.env.BASE_URL}${path}`) as Promise<ThreeAudioBuffer>;
    p.catch((err) => console.error(`sound: could not load ${path}`, err));
    buffers.set(path, p);
  }
  return p;
}

/**
 * Narration (head-locked voice), music, and sounds that come from places in the room.
 * Every file is preloaded; a missing file is logged as an error, never silently skipped.
 */
export class Sound {
  readonly listener = new AudioListener();
  private voice: Audio;
  private music: Audio;
  private voiceToken = 0;

  constructor(camera: Object3D) {
    camera.add(this.listener);
    this.voice = new Audio(this.listener);
    this.music = new Audio(this.listener);
  }

  preload(paths: string[]) {
    return Promise.all(paths.map(buffer));
  }

  resume() {
    const ctx = this.listener.context;
    if (ctx.state !== 'running') void ctx.resume();
  }

  /** Play a narration line; resolves when it ends (or is replaced). */
  async say(path: string): Promise<void> {
    const token = ++this.voiceToken;
    const buf = await buffer(path);
    if (token !== this.voiceToken) return;
    if (this.voice.isPlaying) this.voice.stop();
    this.voice.setBuffer(buf);
    this.voice.setVolume(1);
    this.voice.play();
    this.music.setVolume(0.18); // duck the music under the voice
    await new Promise<void>((resolve) => {
      const src = this.voice.source as AudioBufferSourceNode | null;
      if (!src) return resolve();
      src.onended = () => resolve();
    });
    if (token === this.voiceToken) this.music.setVolume(0.35);
  }

  async startMusic(path: string) {
    const buf = await buffer(path);
    this.music.setBuffer(buf);
    this.music.setLoop(true);
    this.music.setVolume(0.35);
    if (!this.music.isPlaying) this.music.play();
  }

  /** A sound placed in the room, attached to an object. */
  async at(obj: Object3D, path: string, opts: { loop?: boolean; volume?: number } = {}): Promise<PositionalAudio> {
    const buf = await buffer(path);
    const a = new PositionalAudio(this.listener);
    a.setBuffer(buf);
    a.setRefDistance(0.6);
    a.setRolloffFactor(1.4);
    a.setLoop(!!opts.loop);
    a.setVolume(opts.volume ?? 1);
    obj.add(a);
    a.play();
    if (!opts.loop) {
      const src = a.source as AudioBufferSourceNode | null;
      if (src) src.onended = () => obj.remove(a);
    }
    return a;
  }
}
