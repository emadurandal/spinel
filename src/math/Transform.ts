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
      this._position.isEqual(transform.getPosition(), delta) &&
      this._rotation.isEqual(transform.getRotation(), delta) &&
      this._scale.isEqual(transform.getScale(), delta)
    );
  }

  toString() {
    return `position: ${this._position.toString()}
rotation: ${this._rotation.toString()}
scale: ${this._scale.toString()}`;
  }

  setPosition(value: Vector3) {
    this._position = value;
  }

  getPosition() {
    return this._position.clone();
  }

  getRotation() {
    return this._rotation.clone();
  }

  setRotation(value: Quaternion) {
    this._rotation = value;
  }

  setEulerAngles(value: Vector3) {
    this._rotation = Quaternion.fromEulerAngles(value);
  }

  getEulerAngles() {
    return this._rotation.toEulerAngles();
  }
  
  getScale() {
    return this._scale.clone();
  }

  setScale(value: Vector3) {
    this._scale = value;
  }

  setMatrix(value: Matrix4) {
    this._position = value.getTranslation();
    this._rotation = value.getRotation();
    this._scale = value.getScale();
  }

  getMatrix() {
    const t = Matrix4.translation(this._position);
    const r = Matrix4.fromQuaternion(this._rotation);
    const s = Matrix4.scale(this._scale);

    return t.multiply(r).multiply(s);
  }

  transformVector(vec: Vector4) {
    return this.getMatrix().multiplyVector(vec);
  }

  clone(): Transform {
    return new Transform(this._position.clone(), this._rotation.clone(), this._scale.clone());
  }
}
