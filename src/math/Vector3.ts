export class Vector3 {
  private v: Float32Array;

  constructor(x: number, y: number, z: number) {
    this.v = new Float32Array([x, y, z]);
  }

  isEqual(vec: Vector3, delta = Number.EPSILON) {
    return (
      Math.abs(this.x - vec.x) < delta &&
      Math.abs(this.y - vec.y) < delta &&
      Math.abs(this.z - vec.z) < delta
    );
  }

  static zero() {
    return new Vector3(0, 0, 0);
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  get x() {
    return this.v[0];
  }

  set x(value: number) {
    this.v[0] = value;
  }

  get y() {
    return this.v[1];
  }

  set y(value: number) {
    this.v[1] = value;
  }

  get z() {
    return this.v[2];
  }

  set z(value: number) {
    this.v[2] = value;
  }

  get raw() {
    return this.v;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `${this.x}, ${this.y}, ${this.z}`;
  }
}
