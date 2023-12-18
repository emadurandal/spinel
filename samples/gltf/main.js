import Spinel from '../../dist/index.js';
async function main() {
    const canvas = document.getElementById('world');
    Spinel.Context.setup(canvas);
    const entities = await Spinel.Gltf2Importer.import('../../assets/gltf/glTF-Sample-Models/2.0/BrainStem/glTF/BrainStem.gltf');
    const gl = Spinel.Context.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    const cameraEntity = Spinel.Entity.create();
    cameraEntity.getTransform().setLocalPosition(new Spinel.Vector3(0, 0, 4));
    cameraEntity.addCamera(Spinel.CameraType.Perspective);
    Spinel.CameraComponent.activeCamera = cameraEntity.getCamera();
    cameraEntity.addCameraController(Spinel.CameraControllerType.Orbit);
    const meshEntities = Spinel.Entity.getAllMeshEntities();
    const draw = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (const meshEntity of meshEntities) {
            meshEntity.getMesh().draw();
        }
        requestAnimationFrame(draw);
    };
    draw();
}
main();
