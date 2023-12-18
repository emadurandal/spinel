import Spinel from '../../dist/index.js';
async function main() {
    const canvas = document.getElementById('world');
    Spinel.Context.setup(canvas);
    const gl = Spinel.Context.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    const meshEntity = Spinel.Entity.create();
    const material = new Spinel.Material();
    const vertexData = {
        position: new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            0, 1, 0
        ]),
        // color: [
        //   1, 0, 0, 1,
        //   0, 1, 0, 1,
        //   0, 0, 1, 1
        // ],
        indices: new Uint16Array([
            0, 1, 2
        ]),
        mode: Spinel.PrimitiveMode.Triangles,
    };
    const primitive = new Spinel.Primitive(material, vertexData);
    const mesh = new Spinel.Mesh([primitive]);
    meshEntity.addMesh(mesh);
    const cameraEntity = Spinel.Entity.create();
    cameraEntity.getTransform().setLocalPosition(new Spinel.Vector3(0, 0, 4));
    cameraEntity.addCamera(Spinel.CameraType.Perspective);
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
