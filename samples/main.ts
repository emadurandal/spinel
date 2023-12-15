import Spinel from '../dist/index.js'

async function main() {

  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const context = new Spinel.Context(canvas);
  const entities = await Spinel.Gltf2Importer.import('../assets/gltf/glTF-Sample-Models/2.0/BoxAnimated/glTF/BoxAnimated.gltf', context);

  const gl = context.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  const cameraEntity = Spinel.Entity.create();
  cameraEntity.getTransform().setLocalPosition(new Spinel.Vector3(0, 0, 15));
  cameraEntity.addCamera(Spinel.CameraType.Perspective);
  const meshEntities = Spinel.Entity.getAllMeshEntities();

  const draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (const meshEntity of meshEntities) {
    meshEntity.getMesh()!.draw();
  }
    requestAnimationFrame(draw);
  };
  draw();
}

main();
