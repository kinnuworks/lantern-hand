import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { RoomSystem } from './room/room-system.js';
import { StorySystem } from './story/story-system.js';

const landing = document.getElementById('landing') as HTMLDivElement;
const enter = document.getElementById('enter') as HTMLButtonElement;
const status = document.getElementById('status') as HTMLDivElement;
const restart = document.getElementById('restart') as HTMLButtonElement;
const SAVE_KEY = 'lantern-hand:v1';

// Returning visitors continue the story; this lets anyone (a judge, a second person) start over.
try {
  const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null') as { chapter?: number } | null;
  if (saved && (saved.chapter ?? 0) >= 1) {
    restart.hidden = false;
    enter.textContent = `Enter: chapter ${Math.min((saved.chapter ?? 0) + 1, 2)}`;
  }
} catch { /* no storage: always chapter one */ }
restart.addEventListener('click', () => {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* nothing saved */ }
  restart.hidden = true;
  enter.textContent = 'Enter';
  console.log('PROGRESS_CLEARED');
});

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then(async (world) => {
  world.registerSystem(RoomSystem);
  world.registerSystem(StorySystem);

  const xr = navigator.xr;
  const ok = xr ? await xr.isSessionSupported('immersive-ar').catch(() => false) : false;
  if (ok) {
    enter.disabled = false;
    status.textContent = 'Best on Meta Quest 3 or 3S with your room set up.';
  } else {
    status.textContent = 'Open this page in the Meta Quest Browser on a Quest 3 or 3S to play.';
  }
  enter.addEventListener('click', () => world.launchXR());
  world.renderer.xr.addEventListener('sessionstart', () => { landing.hidden = true; });
  world.renderer.xr.addEventListener('sessionend', () => { landing.hidden = false; });
});
