import { AdditiveBlending, CanvasTexture, Color, MeshBasicMaterial, SRGBColorSpace } from '@iwsdk/core';

/** Soft warm light: a radial falloff drawn once into a small canvas. */
function radial(stops: [number, string][]): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [at, col] of stops) grad.addColorStop(at, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** The marker where Wick waits: a soft glow with a ring of felt stitches around it. */
function stitchedRing(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(255,236,190,0.55)');
  grad.addColorStop(0.45, 'rgba(255,214,140,0.22)');
  grad.addColorStop(1, 'rgba(255,200,120,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = 'rgba(255,244,214,1)';
  g.lineWidth = 14;
  g.lineCap = 'round';
  g.setLineDash([26, 22]);
  g.beginPath();
  g.arc(256, 256, 150, 0, Math.PI * 2);
  g.stroke();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function additive(map: CanvasTexture, color: string, opacity: number) {
  return new MeshBasicMaterial({ map, color: new Color(color), transparent: true, opacity, blending: AdditiveBlending, depthWrite: false });
}

/** Where the lantern's light lands: warm in the middle, fading to nothing at the edge. */
export const poolMat = () =>
  additive(radial([[0, 'rgba(255,226,160,1)'], [0.35, 'rgba(255,190,100,0.7)'], [0.7, 'rgba(255,150,60,0.22)'], [1, 'rgba(255,140,50,0)']]), '#ffffff', 0.9);

/** The glow that marks where to aim. */
export const markerMat = () => additive(stitchedRing(), '#ffffff', 0.95);

/** Warm light around the lantern, so it reads as lit and held in the palm. */
export const haloMat = () =>
  additive(radial([[0, 'rgba(255,214,140,0.9)'], [0.25, 'rgba(255,170,80,0.5)'], [0.6, 'rgba(255,130,50,0.14)'], [1, 'rgba(255,120,40,0)']]), '#ffffff', 0.85);
