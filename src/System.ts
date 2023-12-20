import { CameraComponent } from "./ec/components/Camera/CameraComponent.js";
import { Entity } from "./ec/Entity.js";

export class System {
  private static _gl: WebGLRenderingContext;
  static setup(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2') as WebGLRenderingContext;

    if (gl == null) {
      alert('Failed to initialize WebGL.');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    this._gl = gl;
  }

  static process(entities: Entity[]) {
    const gl = System._gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    for (const entity of entities) {
      entity.getMesh()?.draw();
    }

    this._processCameraControl();
  }

  static processAuto() {
    const gl = System._gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const meshEntities = Entity.getAllMeshEntities();
    for (const meshEntity of meshEntities) {
      meshEntity.getMesh()?.draw();
    }

    this._processCameraControl();
  }

  private static _processCameraControl() {
    const cameraController = CameraComponent.activeCamera?.entity.getCameraController();
    const walk = cameraController?.getWalkController();
    if (walk != null) {
      walk.process();
    }
  }

  static get gl() {
    return this._gl;
  }

  static get canvasWidth() {
    return this._gl.canvas.width;
  }

  static get canvasHeight() {
    return this._gl.canvas.height;
  }

  static get canvasAspectRatio() {
    return this.canvasWidth / this.canvasHeight;
  }

  static resize(width: number, height: number) {
    this._gl.canvas.width = width;
    this._gl.canvas.height = height;
    this._gl.viewport(0, 0, width, height);
  }
}
