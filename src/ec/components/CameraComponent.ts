import { Matrix4 } from "../../math/Matrix4.js";
import { Vector3 } from "../../math/Vector3.js";
import { Component } from "../Component.js";
import { Entity } from "../Entity.js";

export class CameraComponent extends Component {
  private _projectionMatrix: Matrix4;
  private _type: "perspective" | "orthographic" = "perspective";

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
  private _aspect = 1;

  private constructor(entity: Entity, type: "perspective" | "orthographic") {
    super(entity);
    this._type = type;
    this._projectionMatrix = Matrix4.identity();
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

  calculateProjectionMatrix() {
    if (this._type === "perspective") {
      this._projectionMatrix = Matrix4.perspective(this._fovy, this._aspect, this._near, this._far);
    } else if (this._type === "orthographic") {
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
    this.calculateProjectionMatrix();
  }

  get near() {
    return this._near;
  }

  set near(near: number) {
    this._near = near;
    this.calculateProjectionMatrix();
  }

  get far() {
    return this._far;
  }

  set far(far: number) {
    this._far = far;
    this.calculateProjectionMatrix();
  }

  get aspect() {
    return this._aspect;
  }

  set aspect(aspect: number) {
    this._aspect = aspect;
    this.calculateProjectionMatrix();
  }

  get left() {
    return this._left;
  }

  set left(left: number) {
    this._left = left;
    this.calculateProjectionMatrix();
  }

  get right() {
    return this._right;
  }

  set right(right: number) {
    this._right = right;
    this.calculateProjectionMatrix();
  }

  get bottom() {
    return this._bottom;
  }

  set bottom(bottom: number) {
    this._bottom = bottom;
    this.calculateProjectionMatrix();
  }

  get top() {
    return this._top;
  }

  set top(top: number) {
    this._top = top;
    this.calculateProjectionMatrix();
  }

  set xmag(xmag: number) {
    this._left = -xmag;
    this._right = xmag;
    this.calculateProjectionMatrix();
  }

  set ymag(ymag: number) {
    this._bottom = -ymag;
    this._top = ymag;
    this.calculateProjectionMatrix();
  }

  get cameraType() {
    return this._type;
  }

  set cameraType(cameraType: "perspective" | "orthographic") {
    this._type = cameraType;
    this.calculateProjectionMatrix();
  }

  static _create(entity: Entity, type: "perspective" | "orthographic") {
    return new CameraComponent(entity, type);
  }
}
