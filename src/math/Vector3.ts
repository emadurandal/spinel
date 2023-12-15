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

  add(vec: Vector3) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  subtract(vec: Vector3) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  dot(vec: Vector3) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  cross(vec: Vector3) {
    return new Vector3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x
    );
  }

  normalize() {
    const length = this.length();
    return new Vector3(this.x / length, this.y / length, this.z / length);
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

  get w() {
    return 1;
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
