import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from '@iwsdk/core';
import type { Object3D } from '@iwsdk/core';

/** The caption's look: a cream cardstock card with ink text, like a page of the story. */
export const CAPTION_STYLE = {
  card: '#f3e7cf',
  edge: '#cdb68c',
  ink: '#2f2560',
  font: '"Nunito", "Trebuchet MS", system-ui, sans-serif',
  weight: 600,
};

const W = 1024;
const H = 208;
const PLANE_W = 0.78; // metres at 1 m: about 42 degrees wide, inside the Glasses' 58 degree design width
const DOWN = 0.367; // 21 degrees below centre; the card spans about 16.5 to 25.5 degrees down, inside the 54 degree design height

/**
 * One caption card locked low in the view, 1 m away, tilted to face the eye.
 * It stays inside the 58 x 54 degree design area of Meta VR Glasses.
 */
export class Caption {
  readonly mesh: Mesh;
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private tex: CanvasTexture;
  private text = '';
  private fade = 0;

  constructor(camera: Object3D) {
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d')!;
    this.tex = new CanvasTexture(this.canvas);
    this.tex.colorSpace = SRGBColorSpace;
    this.tex.anisotropy = 4;
    const mat = new MeshBasicMaterial({ map: this.tex, transparent: true, depthTest: false, depthWrite: false, opacity: 0 });
    this.mesh = new Mesh(new PlaneGeometry(PLANE_W, (PLANE_W * H) / W), mat);
    this.mesh.position.set(0, -Math.tan(DOWN), -1.0);
    this.mesh.rotation.x = DOWN;
    this.mesh.renderOrder = 10;
    camera.add(this.mesh);
    // Redraw once the web font has loaded, so the first line doesn't stay in the fallback face.
    document.fonts?.load(`${CAPTION_STYLE.weight} 48px ${CAPTION_STYLE.font}`).then(() => {
      const t = this.text;
      this.text = '';
      this.show(t);
    }, () => undefined);
  }

  show(text: string) {
    if (text === this.text) return;
    this.text = text;
    const c = this.ctx;
    c.clearRect(0, 0, W, H);
    if (text) {
      c.font = `${CAPTION_STYLE.weight} 48px ${CAPTION_STYLE.font}`;
      let size = 48;
      let lines = wrapLines(c, text, 920);
      while (lines.length > 2 && size > 36) {
        size -= 4;
        c.font = `${CAPTION_STYLE.weight} ${size}px ${CAPTION_STYLE.font}`;
        lines = wrapLines(c, text, 920);
      }
      const lineH = size * 1.22;
      const cardH = Math.min(H - 12, lines.length * lineH + 52);
      const top = (H - cardH) / 2;
      cardPath(c, 10, top, W - 20, cardH);
      c.fillStyle = CAPTION_STYLE.card;
      c.fill();
      c.lineWidth = 3;
      c.strokeStyle = CAPTION_STYLE.edge;
      c.stroke();
      c.fillStyle = CAPTION_STYLE.ink;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const first = H / 2 - ((lines.length - 1) * lineH) / 2;
      lines.forEach((l, i) => c.fillText(l, W / 2, first + i * lineH));
    }
    this.tex.needsUpdate = true;
    this.fade = text ? 1 : 0;
  }

  update(dt: number) {
    const m = this.mesh.material as MeshBasicMaterial;
    m.opacity += (this.fade * 0.96 - m.opacity) * Math.min(1, dt * 6);
    this.mesh.visible = m.opacity > 0.01;
  }
}

/** A card with slightly uneven, hand-cut edges (fixed, so it never shimmers). */
function cardPath(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const j = [2, -3, 1, 3, -2, 2, -1, 3, -3, 1, 2, -2];
  const r = 22;
  c.beginPath();
  c.moveTo(x + r, y + j[0]);
  c.lineTo(x + w * 0.35, y + j[1]);
  c.lineTo(x + w * 0.7, y + j[2]);
  c.lineTo(x + w - r, y + j[3]);
  c.quadraticCurveTo(x + w, y, x + w + j[4], y + r);
  c.lineTo(x + w + j[5], y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h + j[6]);
  c.lineTo(x + w * 0.6, y + h + j[7]);
  c.lineTo(x + w * 0.25, y + h + j[8]);
  c.lineTo(x + r, y + h + j[9]);
  c.quadraticCurveTo(x, y + h, x + j[10], y + h - r);
  c.lineTo(x + j[11], y + r);
  c.quadraticCurveTo(x, y, x + r, y + j[0]);
  c.closePath();
}

function wrapLines(c: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let line = '';
  for (const w of text.split(' ')) {
    const t = line ? `${line} ${w}` : w;
    if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  lines.push(line);
  return lines;
}
