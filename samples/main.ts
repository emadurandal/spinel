import Spinel from '../dist/index.js'

async function main() {

  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const context = new Spinel.Context(canvas);
  const entities = await Spinel.Gltf2Importer.import('../assets/gltf/BoxAnimated/glTF/BoxAnimated.gltf', context);

  const gl = context.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const meshEntities = Spinel.Entity.getAllMeshEntities();
  for (const meshEntity of meshEntities) {
    meshEntity.getMesh()!.draw();
  }
}

main();
