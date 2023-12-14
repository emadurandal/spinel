export class Vector4 {
  private v: Float32Array;

  constructor(x: number, y: number, z: number, w: number) {
    this.v = new Float32Array([x, y, z, w]);
  }

  isEqual(vec: Vector4, delta = Number.EPSILON) {
    return (
      Math.abs(this.x - vec.x) < delta &&
      Math.abs(this.y - vec.y) < delta &&
      Math.abs(this.z - vec.z) < delta &&
      Math.abs(this.w - vec.w) < delta
    );
  }
  
  static zero() {
    return new Vector4(0, 0, 0, 1);
  }

  static one() {
    return new Vector4(1, 1, 1, 1);
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
    return this.v[3];
  }

  set w(value: number) {
    this.v[3] = value;
  }

  get raw() {
    return this.v;
  }

  toString() {
    return `${this.x}, ${this.y}, ${this.z}, ${this.w}`;
  }

}

