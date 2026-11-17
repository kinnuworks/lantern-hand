import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader,
} from '@iwsdk/core';
import type { Texture } from '@iwsdk/core';

const loader = new TextureLoader();
const cache = new Map<string, Promise<Texture>>();

export function loadTexture(url: string): Promise<Texture> {
  let p = cache.get(url);
  if (!p) {
    p = loader.loadAsync(`${import.meta.env.BASE_URL}${url}`).then((t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
    cache.set(url, p);
  }
  return p;
}

/**
 * A paper cut-out: a flat card with a transparent PNG, sized by height in metres and
 * with its pivot at the bottom centre so it stands on surfaces.
 */
export async function makeCutout(url: string, height: number): Promise<Mesh> {
  const tex = await loadTexture(url);
  const img = tex.image as { width: number; height: number };
  const aspect = img.width / img.height;
  const geo = new PlaneGeometry(height * aspect, height);
  geo.translate(0, height / 2, 0);
  const mat = new MeshBasicMaterial({
    map: tex,
    transparent: true,
    alphaTest: 0.35,
    side: DoubleSide,
    depthWrite: true,
  });
  const mesh = new Mesh(geo, mat);
  mesh.renderOrder = 2;
  return mesh;
}

/** Swap the picture on an existing cut-out, keeping its height. */
export async function setCutoutImage(mesh: Mesh, url: string, height: number) {
  const tex = await loadTexture(url);
  const img = tex.image as { width: number; height: number };
  const aspect = img.width / img.height;
  mesh.geometry.dispose();
  const geo = new PlaneGeometry(height * aspect, height);
  geo.translate(0, height / 2, 0);
  mesh.geometry = geo;
  (mesh.material as MeshBasicMaterial).map = tex;
  (mesh.material as MeshBasicMaterial).needsUpdate = true;
}
