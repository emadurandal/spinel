import { Vector3 } from "./Vector3.js";

export class Quaternion {
  private v: Float32Array;

  constructor(x: number, y: number, z: number, w: number) {
      this.v = new Float32Array([x, y, z, w]);
  }
  get x() {
      return this.v[0];
  }
  set x(value) {
      this.v[0] = value;
  }
  get y() {
      return this.v[1];
  }
  set y(value) {
      this.v[1] = value;
  }
  get z() {
      return this.v[2];
  }
  set z(value) {
      this.v[2] = value;
  }
  get w() {
      return this.v[3];
  }
  set w(value) {
      this.v[3] = value;
  }
  get raw() {
      return this.v;
  }

  isEqual(quat: Quaternion, delta: number = Number.EPSILON) {
    return (
      Math.abs(quat.x - this.x) < delta &&
      Math.abs(quat.y - this.y) < delta &&
      Math.abs(quat.z - this.z) < delta &&
      Math.abs(quat.w - this.w) < delta
    );
  }

  static identity() {
    return new Quaternion(0, 0, 0, 1);
  }

  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
  * Compute spherical linear interpolation
  */
  static qlerp(l_quat: Quaternion, r_quat: Quaternion, ratio: number): Quaternion {
    let dotProduct =
      l_quat.x * r_quat.x +
      l_quat.y * r_quat.y +
      l_quat.z * r_quat.z +
      l_quat.w * r_quat.w;
    const ss = 1.0 - dotProduct * dotProduct;

    if (ss === 0.0) {
      return l_quat.clone();
    } else {
      if (dotProduct > 1) {
        dotProduct = 0.999;
      } else if (dotProduct < -1) {
        dotProduct = -0.999;
      }

      let theta = Math.acos(dotProduct);
      const sinTheta = Math.sin(theta);

      let s2;
      if (dotProduct < 0.0) {
        dotProduct *= -1;
        theta = Math.acos(dotProduct);
        s2 = (-1 * Math.sin(theta * ratio)) / sinTheta;
      } else {
        s2 = Math.sin(theta * ratio) / sinTheta;
      }
      const s1 = Math.sin(theta * (1.0 - ratio)) / sinTheta;

      let x = l_quat.x * s1 + r_quat.x * s2;
      let y = l_quat.y * s1 + r_quat.y * s2;
      let z = l_quat.z * s1 + r_quat.z * s2;
      let w = l_quat.w * s1 + r_quat.w * s2;

      // normalize
      const length = Math.hypot(x, y, z, w);
      x = x / length;
      y = y / length;
      z = z / length;
      w = w / length;

      return new Quaternion(x, y, z, w);
    }
  }

  static multiply(l_quat: Quaternion, r_quat: Quaternion) {
    const x =
      r_quat.w * l_quat.x +
      r_quat.z * l_quat.y -
      r_quat.x * l_quat.z +
      r_quat.x * l_quat.w;
    const y =
      -r_quat.z * l_quat.x +
      r_quat.w * l_quat.y +
      r_quat.x * l_quat.z +
      r_quat.y * l_quat.w;
    const z =
      r_quat.y * l_quat.x -
      r_quat.x * l_quat.y +
      r_quat.w * l_quat.z +
      r_quat.z * l_quat.w;
    const w =
      -r_quat.x * l_quat.x -
      r_quat.y * l_quat.y -
      r_quat.z * l_quat.z +
      r_quat.w * l_quat.w;
      
    return new Quaternion(x, y, z, w);
  }

  toEulerAngles() {
    const x = this.x, y = this.y, z = this.z, w = this.w;
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const e0 = ( 1 - ( yy + zz ) );
		const e1 = ( xy + wz );
		const e2 = ( xz - wy );
		const e3 = 0;

		const e4 = ( xy - wz );
		const e5 = ( 1 - ( xx + zz ) );
		const e6 = ( yz + wx );
		const e7 = 0;

		const e8 = ( xz + wy );
		const e9 = ( yz - wx );
		const e10 = ( 1 - ( xx + yy ) );
		const e11 = 0;

		const e12 = 0;
		const e13 = 0;
		const e14 = 0;
		const e15 = 1;

    // order: XYZ
    const _y = Math.asin( Math.max(-1, Math.min(1, e8) ) );
    if ( Math.abs( e8 ) < 0.99999 ) {
      const _x = Math.atan2( - e9, e10 );
      const _z = Math.atan2( - e4, e0 );
      return new Vector3(_x, _y, _z);
    } else {
      const _x = Math.atan2( e6, e5 );
      const _z = 0;
      return new Vector3(_x, _y, _z);
    }
  }
}