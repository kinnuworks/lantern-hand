import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { RoomSystem } from './room/room-system.js';
import { StorySystem } from './story/story-system.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(RoomSystem);
  world.registerSystem(StorySystem);
});
