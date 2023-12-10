export class Vector4 {
  private v: Float32Array;

  constructor(x: number, y: number, z: number, w: number) {
    this.v = new Float32Array([x, y, z, w]);
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
}

