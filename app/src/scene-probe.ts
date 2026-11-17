import { createSystem, XRMesh, XRPlane } from '@iwsdk/core';

// Prototype: report every detected plane and mesh with its semantic label and size.
export class SceneProbeSystem extends createSystem({
  planes: { required: [XRPlane] },
  meshes: { required: [XRMesh] },
}) {
  init(): void {
    const w = window as unknown as { __scene: Record<string, unknown>[] };
    w.__scene = [];
    this.queries.planes.subscribe('qualify', (e) => {
      const p = e.getValue(XRPlane, '_plane') as { orientation?: string; semanticLabel?: string } | undefined;
      const pos = e.object3D?.getWorldPosition(e.object3D.position.clone());
      { const r = { kind: 'plane', label: p?.semanticLabel ?? null, orientation: p?.orientation ?? null, pos: pos?.toArray().map((n) => +n.toFixed(2)) }; w.__scene.push(r); console.log("SCENE " + JSON.stringify(r)); }
    });
    this.queries.meshes.subscribe('qualify', (e) => {
      const r = {
        kind: 'mesh',
        label: e.getValue(XRMesh, 'semanticLabel'),
        bounded: e.getValue(XRMesh, 'isBounded3D'),
        min: e.getValue(XRMesh, 'min'),
        max: e.getValue(XRMesh, 'max'),
      };
      w.__scene.push(r); console.log('SCENE ' + JSON.stringify(r));
    });
  }
}
