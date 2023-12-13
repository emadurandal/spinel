import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";

export class Transform {
  private _position: Vector3;
  private _rotation: Quaternion;
  private _scale: Vector3;

  constructor(position: Vector3, rotation: Quaternion, scale: Vector3) {
    this._position = position;
    this._rotation = rotation;
    this._scale = scale;
  }

  isEqual(transform: Transform, delta: number = Number.EPSILON) {
    return (
      this._position.isEqual(transform.position, delta) &&
      this._rotation.isEqual(transform.rotation, delta) &&
      this._scale.isEqual(transform.scale, delta)
    );
  }

  toString() {
    return `position: ${this._position.toString()}
rotation: ${this._rotation.toString()}
scale: ${this._scale.toString()}`;
  }

  get position() {
    return this._position;
  }

  set position(value: Vector3) {
    this._position = value;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value: Quaternion) {
    this._rotation = value;
  }

  get scale() {
    return this._scale;
  }

  set scale(value: Vector3) {
    this._scale = value;
  }

  set matrix(value: Matrix4) {
    this._position = value.getTranslation();
    this._rotation = value.getRotation();
    this._scale = value.getScale();
  }

  get matrix() {
    const t = Matrix4.translation(this._position);
    const r = Matrix4.fromQuaternion(this._rotation);
    const s = Matrix4.scale(this._scale);

    return t.multiply(r).multiply(s);
  }

  transformVector(vec: Vector4) {
    return this.matrix.multiplyVector(vec);
  }

  clone(): Transform {
    return new Transform(this._position.clone(), this._rotation.clone(), this._scale.clone());
  }
}
