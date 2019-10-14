export default class Vector3 {
  private v: Float32Array;

  constructor(x: number, y: number, z: number) {
    this.v = new Float32Array([x, y, z]);
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
}
