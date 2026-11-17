import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from '@iwsdk/core';
import type { Object3D } from '@iwsdk/core';

/**
 * One line of caption, locked low in the view: 1 m away, 16 degrees below centre,
 * 0.6 m wide, so it stays inside the 58 x 54 degree design area of Meta VR Glasses.
 */
export class Caption {
  readonly mesh: Mesh;
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private tex: CanvasTexture;
  private text = '';
  private fade = 0;

  constructor(camera: Object3D) {
    this.canvas.width = 1024;
    this.canvas.height = 176;
    this.ctx = this.canvas.getContext('2d')!;
    this.tex = new CanvasTexture(this.canvas);
    this.tex.colorSpace = SRGBColorSpace;
    const mat = new MeshBasicMaterial({ map: this.tex, transparent: true, depthTest: false, depthWrite: false, opacity: 0 });
    this.mesh = new Mesh(new PlaneGeometry(0.66, 0.113), mat);
    this.mesh.position.set(0, -0.33, -1.0);
    this.mesh.rotation.x = 0.28;
    this.mesh.renderOrder = 10;
    camera.add(this.mesh);
  }

  show(text: string) {
    if (text === this.text) return;
    this.text = text;
    const c = this.ctx;
    c.clearRect(0, 0, 1024, 176);
    if (text) {
      c.fillStyle = 'rgba(20, 16, 30, 0.62)';
      roundRect(c, 8, 8, 1008, 160, 40);
      c.fill();
      c.fillStyle = '#f7efe0';
      c.font = '500 46px Georgia, "Times New Roman", serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      wrap(c, text, 512, 88, 940, 54);
    }
    this.tex.needsUpdate = true;
    this.fade = text ? 1 : 0;
  }

  update(dt: number) {
    const m = this.mesh.material as MeshBasicMaterial;
    m.opacity += (this.fade - m.opacity) * Math.min(1, dt * 6);
    this.mesh.visible = m.opacity > 0.01;
  }
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function wrap(c: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  lines.push(line);
  const top = y - ((lines.length - 1) * lineH) / 2;
  lines.forEach((l, i) => c.fillText(l, x, top + i * lineH));
}
