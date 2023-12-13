import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";

export class Transform {
  private _position: Vector3;
  private _rotation: Quaternion;
  private _scale: Vector3;

  constructor(position: Vector3, rotation: Quaternion, scale: Vector3) {
    this._position = position;
    this._rotation = rotation;
    this._scale = scale;
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

  clone(): Transform {
    return new Transform(this._position.clone(), this._rotation.clone(), this._scale.clone());
  }
}
