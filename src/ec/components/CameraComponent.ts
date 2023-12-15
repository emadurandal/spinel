import { Context } from "../../Context.js";
import { CameraType } from "../../definitions.js";
import { Matrix4 } from "../../math/Matrix4.js";
import { Vector3 } from "../../math/Vector3.js";
import { Component } from "../Component.js";
import { Entity } from "../Entity.js";

export class CameraComponent extends Component {
  private _projectionMatrix: Matrix4;
  private _type: CameraType;

  // common camera properties
  private _near = 0.1;
  private _far = 1000;
  
  // orthographic camera properties
  private _left = -1;
  private _right = 1;
  private _bottom = -1;
  private _top = 1;

  // perspective camera properties
  private _fovy = 45;
  private _aspect = -1;

  static activeCamera?: CameraComponent;

  private constructor(entity: Entity, type: CameraType) {
    super(entity);
    this._type = type;
    this._projectionMatrix = Matrix4.identity();
    this._calculateProjectionMatrix();
  }

  getProjectionMatrix() {
    return this._projectionMatrix.clone();
  }

  getViewMatrix() {
    const eye = Vector3.zero();
    const center = new Vector3(0, 0, -1);
    const up = new Vector3(0, 1, 0);
    const lookAtMatrix = Matrix4.lookAt(eye, center, up);

    return lookAtMatrix.multiply(this.entity.getSceneGraph().getMatrix().invert());
  }

  private _calculateProjectionMatrix() {
    if (this._type === CameraType.Perspective) {
      let aspect = this._aspect;
      if (aspect < 0) {
        aspect = Context.canvasAspectRatio;
      }
      this._projectionMatrix = Matrix4.perspective(this._fovy, aspect, this._near, this._far);
    } else if (this._type === CameraType.Orthographic) {
      this._projectionMatrix = Matrix4.orthographic(this._left, this._right, this._bottom, this._top, this._near, this._far);
    } else {
      throw new Error("Unknown camera type");
    }
  }

  get fovy() {
    return this._fovy;
  }

  set fovy(fovy: number) {
    this._fovy = fovy;
    this._calculateProjectionMatrix();
  }

  get near() {
    return this._near;
  }

  set near(near: number) {
    this._near = near;
    this._calculateProjectionMatrix();
  }

  get far() {
    return this._far;
  }

  set far(far: number) {
    this._far = far;
    this._calculateProjectionMatrix();
  }

  get aspect() {
    return this._aspect;
  }

  set aspect(aspect: number) {
    this._aspect = aspect;
    this._calculateProjectionMatrix();
  }

  get left() {
    return this._left;
  }

  set left(left: number) {
    this._left = left;
    this._calculateProjectionMatrix();
  }

  get right() {
    return this._right;
  }

  set right(right: number) {
    this._right = right;
    this._calculateProjectionMatrix();
  }

  get bottom() {
    return this._bottom;
  }

  set bottom(bottom: number) {
    this._bottom = bottom;
    this._calculateProjectionMatrix();
  }

  get top() {
    return this._top;
  }

  set top(top: number) {
    this._top = top;
    this._calculateProjectionMatrix();
  }

  set xmag(xmag: number) {
    this._left = -xmag;
    this._right = xmag;
    this._calculateProjectionMatrix();
  }

  set ymag(ymag: number) {
    this._bottom = -ymag;
    this._top = ymag;
    this._calculateProjectionMatrix();
  }

  get cameraType() {
    return this._type;
  }

  set cameraType(cameraType: CameraType) {
    this._type = cameraType;
    this._calculateProjectionMatrix();
  }

  static _create(entity: Entity, type: CameraType) {
    return new CameraComponent(entity, type);
  }
}
