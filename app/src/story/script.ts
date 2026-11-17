import type { BeatId } from '../room/types.js';

export interface Line {
  audio: string;
  text: string;
}

const vo = (f: string, text: string): Line => ({ audio: `audio/vo/${f}.mp3`, text });

export const LINES = {
  intro: vo('n01-intro', "Sit back. It's late, and the house is quiet. Now, hold out one hand, palm open."),
  lantern: vo('n02-lantern', "There. That's a lantern now. Keep it low and easy, the way you'd hold a cup of tea."),
  table: vo('n03-table', "Someone's asleep on your table. His name is Wick. Shine your light on him."),
  wake: vo('n04-wake', "He's awake. He's been walking for a very long time, and tonight he wants to see the sun come up. Your window is the edge of his world."),
  couch: vo('n05-couch', "He can only walk where there's light. Point your lantern at the couch."),
  ridge: vo('n06-ridge', "Up the ridge he goes. From up here he can see the whole country. It's a long way down."),
  floor: vo('n07-floor', 'Now the floor. Light it, and see what he does.'),
  boat: vo('n08-boat', 'A boat. He always carries one, folded flat. Keep the light just ahead of him.'),
  gate: vo('n09-gate', "There's a gate by the door. Light it, and it'll let him through."),
  window: vo('n10-window', 'Last stretch. Light the window.'),
  dawn: vo('n11-dawn', "And there it is. He made it, with your help. He'll sit here a while and watch."),
  bye: vo('n12-bye', "He'll still be there tomorrow night. Come back, and we'll see where he goes next."),
  hintPoint: vo('h01-point', 'Point your open hand at the little glow.'),
  hintGeneric: vo('h02-generic', 'Light the next place he can reach. Look for the little glow.'),
} as const;

export const SFX = {
  chime: 'audio/sfx/chime.mp3',
  steps: 'audio/sfx/steps.mp3',
  wind: 'audio/sfx/wind.mp3',
  water: 'audio/sfx/water.mp3',
  gate: 'audio/sfx/gate.mp3',
  dawn: 'audio/sfx/dawn.mp3',
  yawn: 'audio/sfx/yawn.mp3',
  hop: 'audio/sfx/hop.mp3',
} as const;

export const MUSIC = 'audio/music/night.mp3';

export const ART = {
  traveller: 'art/traveller.png',
  asleep: 'art/asleep.png',
  sitting: 'art/sitting.png',
  lantern: 'art/lantern.png',
  boat: 'art/boat.png',
  gate: 'art/gate.png',
  sun: 'art/sun.png',
} as const;

/** The line that asks for a beat. Generic when the room had no matching label. */
export function askLine(beat: BeatId, fallback: boolean): Line {
  switch (beat) {
    case 'table': return LINES.table;
    case 'ridge': return fallback ? LINES.hintGeneric : LINES.couch;
    case 'sea': return LINES.floor;
    case 'gate': return fallback ? LINES.hintGeneric : LINES.gate;
    case 'window': return fallback ? LINES.hintGeneric : LINES.window;
  }
}

export const ORDER: BeatId[] = ['table', 'ridge', 'sea', 'gate', 'window'];
