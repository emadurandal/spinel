import { Material } from "../Material.js";
import { System } from "../System.js";
import { Entity } from "../ec/Entity.js";
import { CameraComponent } from "../ec/components/Camera/CameraComponent.js";
import { CameraType, PrimitiveMode } from "../definitions.js";
import { AABB } from "../math/AABB.js";
import { Vector3 } from "../math/Vector3.js";

export type VertexAttributeSet = {
  position: Float32Array,
  color?: Float32Array,
  normal?: Float32Array,
  texcoord?: Float32Array,
  indices?: Uint16Array | Uint32Array,
  mode: PrimitiveMode,
  aabb?: AABB
}

export class Primitive {
  private _positionBuffer: WebGLBuffer;
  private _colorBuffer?: WebGLBuffer;
  private _indexBuffer?: WebGLBuffer;
  private _indexType: 5123 | 5125 = 5123; // gl.UNSIGNED_SHORT | gl.UNSIGNED_INT
  private _mode: PrimitiveMode = PrimitiveMode.Triangles;

  private _vertexNumber = 0;
  private _indexNumber = 0;
  private _material: Material;
  private static readonly _positionComponentNumber = 3;
  private static readonly _colorComponentNumber = 4;
  private _localAabb = new AABB();

  constructor(material: Material, vertexData: VertexAttributeSet) {
    this._material = material;
    this._vertexNumber = vertexData.position.length / Primitive._positionComponentNumber;

    this._positionBuffer = this._setupVertexBuffer(vertexData.position)!;
    this._colorBuffer = this._setupVertexBuffer(vertexData.color);

    if (vertexData.indices != null) {
      this._indexBuffer = this._setupIndexBuffer(vertexData.indices);
      this._indexNumber = vertexData.indices.length;
    }

    this.setupAABB(vertexData);
  }

  private setupAABB(vertexData: VertexAttributeSet) {
    this._mode = vertexData.mode;
    if (vertexData.aabb != null) {
      this._localAabb = vertexData.aabb.clone();
    } else {
      for (let i = 0; i < this._vertexNumber; i++) {
        const point = new Vector3(vertexData.position[i * 3], vertexData.position[i * 3 + 1], vertexData.position[i * 3 + 2]);
        this._localAabb.addPoint(point);
      }
    }
  }

  private _setupVertexBuffer(array: Float32Array | undefined) {
    if (array == null) {
      return undefined;
    }

    const gl = System.gl;
    const buffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

    return buffer;
  }

  private _setupIndexBuffer(indicesArray: Uint16Array | Uint32Array) {
    const gl = System.gl;
    const buffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);
    this._indexType = (indicesArray.constructor === Uint16Array) ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
    return buffer;
  }

  private _setVertexAttrib(vertexBuffer: WebGLBuffer | undefined, attributeSlot: number, componentNumber: number, defaultValue: number[]) {
    if (vertexBuffer != null) {
      const gl = System.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.enableVertexAttribArray(attributeSlot);
      gl.vertexAttribPointer(
        attributeSlot,
        componentNumber, gl.FLOAT, false, 0, 0);
    } else {
      const gl = System.gl;
      gl.disableVertexAttribArray(attributeSlot);
      if (defaultValue.length === 3) {
        gl.vertexAttrib3fv(attributeSlot, defaultValue);
      } else if (defaultValue.length === 4) {
        gl.vertexAttrib4fv(attributeSlot, defaultValue);
      }
    }
  }

  draw(entity: Entity) {
    const gl = System.gl;

    this._setVertexAttrib(this._positionBuffer, this.material.program!._attributePosition, Primitive._positionComponentNumber, [0, 0, 0]);
    this._setVertexAttrib(this._colorBuffer, this.material.program!._attributeColor, Primitive._colorComponentNumber, [1, 1, 1, 1]);

    this._material.useProgram(gl);
    this._material.setUniformValues(gl);

    // WorldMatrix
    gl.uniformMatrix4fv(this.material.program._uniformWorldMatrix, false, entity.getSceneGraph().getMatrix().raw);
    // ViewMatrix, ProjectionMatrix
    this.setCameraUniforms(gl);

    if (this._indexBuffer != null) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
      gl.drawElements(this._mode, this._indexNumber, this._indexType, 0);
    } else {
      gl.drawArrays(this._mode, 0, this.vertexNumber);
    }

  }

  private setCameraUniforms(gl: WebGLRenderingContext) {
    const cameras = Entity.getAllCameraEntities();
    if (Entity.getAllCameraEntities().length === 0) {
      const tempCameraEntity = Entity.create();
      tempCameraEntity.addCamera(CameraType.Perspective);
      CameraComponent.activeCamera = tempCameraEntity.getCamera()!;
    }
    if (CameraComponent.activeCamera == null) {
      CameraComponent.activeCamera = cameras[cameras.length - 1].getCamera()!;
    }
    gl.uniformMatrix4fv(this.material.program._uniformViewMatrix, false, CameraComponent.activeCamera.getViewMatrix().raw);
    gl.uniformMatrix4fv(this.material.program._uniformProjectionMatrix, false, CameraComponent.activeCamera.getProjectionMatrix().raw);
  }

  get vertexNumber() {
    return this._vertexNumber;
  }

  get material() {
    return this._material;
  }

  getLocalAABB() {
    return this._localAabb.clone();
  }
}
