import Spinel from '../../dist/index.js'

async function main() {

  const canvas = document.getElementById('world') as HTMLCanvasElement;
  Spinel.System.setup(canvas);
  // const entities = await Spinel.Gltf2Importer.import('../../assets/gltf/glTF-Sample-Models/2.0/2CylinderEngine/glTF/2CylinderEngine.gltf');
  const entities = await Spinel.Gltf2Importer.import('../../assets/gltf/glTF-Sample-Models/2.0/Avocado/glTF/Avocado.gltf');
  // const entities = await Spinel.Gltf2Importer.import('../../assets/gltf/glTF-Sample-Models/2.0/GearboxAssy/glTF/GearboxAssy.gltf');

  const cameraEntity = Spinel.Entity.create();
  cameraEntity.getTransform().setLocalPosition(new Spinel.Vector3(0, 0, 0));
  cameraEntity.addCamera(Spinel.CameraType.Perspective);
  Spinel.CameraComponent.activeCamera = cameraEntity.getCamera()!;
  cameraEntity.addCameraController(Spinel.CameraControllerType.Orbit);
  // cameraEntity.addCameraController(Spinel.CameraControllerType.Walk);
  const cameraController = cameraEntity.getCameraController()!;
  cameraController.getOrbitController()!.setTarget(entities);

  const draw = () => {
    Spinel.System.processAuto();
    requestAnimationFrame(draw);
  };
  draw();
}

main();
