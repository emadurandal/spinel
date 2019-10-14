import Spinel from '../dist/index.js'

async function main() {

  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const context = new Spinel.Context(canvas);
  const glTF2Importer = Spinel.Gltf2Importer.getInstance();
  const meshes = await glTF2Importer.import('../assets/gltf/BoxAnimated/glTF/BoxAnimated.gltf', context);

  const gl = context.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (let mesh of meshes) {
    mesh.draw();
  }

}

main();