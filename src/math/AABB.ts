import { Vector3 } from "./Vector3.js";

export class AABB {
  private _min: Vector3 = new Vector3(Infinity, Infinity, Infinity);
  private _max: Vector3 = new Vector3(-Infinity, -Infinity, -Infinity);
  constructor() {}

  addPoint(point: Vector3) {
    this._min = new Vector3(
      Math.min(this._min.x, point.x),
      Math.min(this._min.y, point.y),
      Math.min(this._min.z, point.z)
    );
    this._max = new Vector3(
      Math.max(this._max.x, point.x),
      Math.max(this._max.y, point.y),
      Math.max(this._max.z, point.z)
    );
  }

  isVanilla() {
    return this._min.x === Infinity;
  }

  getMin(): Vector3 {
    return this._min.clone();
  }

  getMax(): Vector3 {
    return this._max.clone();
  }

  getSizeX(): number {
    return this._max.x - this._min.x;
  }

  getSizeY(): number {
    return this._max.y - this._min.y;
  }

  getSizeZ(): number {
    return this._max.z - this._min.z;
  }
  
  getCenterPoint(): Vector3 {
    return this._min.add(this._max).divide(2);
  }

  getLengthCornerToCorner(): number {
    return this._max.lengthTo(this._min);
  }
}
