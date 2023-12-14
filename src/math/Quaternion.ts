import { Matrix4 } from "./Matrix4.js";
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
  
  toString() {
    return `${this.x}, ${this.y}, ${this.z}, ${this.w}`;
  }

  static identity() {
    return new Quaternion(0, 0, 0, 1);
  }

  static fromEulerAngles(vec: Vector3) {
    const sx = Math.sin(vec.x * 0.5);
    const cx = Math.cos(vec.x * 0.5);
    const sy = Math.sin(vec.y * 0.5);
    const cy = Math.cos(vec.y * 0.5);
    const sz = Math.sin(vec.z * 0.5);
    const cz = Math.cos(vec.z * 0.5);

    return new Quaternion(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz
    );
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

  multiply(q: Quaternion) {
    const x =
      q.w * this.x +
      q.z * this.y -
      q.y * this.z +
      q.x * this.w;
    const y =
      -q.z * this.x +
      q.w * this.y +
      q.x * this.z +
      q.y * this.w;
    const z =
      q.y * this.x -
      q.x * this.y +
      q.w * this.z +
      q.z * this.w;
    const w =
      -q.x * this.x -
      q.y * this.y -
      q.z * this.z +
      q.w * this.w;

    return new Quaternion(x, y, z, w);
  }

  length() {
    return Math.hypot(this.x, this.y, this.z, this.w);
  }

  invert(): Quaternion {
    const norm = this.length();
    if (norm === 0.0) {
      return new Quaternion(0, 0, 0, 0);
    }

    const x = -this.x / norm;
    const y = -this.y / norm;
    const z = -this.z / norm;
    const w = this.w / norm;
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
    const _y = Math.asin( - Math.max(-1, Math.min(1, e2) ) );
    if ( Math.abs( e2 ) < 0.99999 ) {
      const _x = Math.atan2( e6, e10 );
      const _z = Math.atan2( e1, e0 );
      return new Vector3(_x, _y, _z);
    } else {
      const _x = 0
      const _z = Math.atan2( -e4, e5 );
      return new Vector3(_x, _y, _z);
    }
  }

  static fromMatrix4(mat: Matrix4) {

    let sx = Math.hypot(mat.m00, mat.m10, mat.m20);
    const sy = Math.hypot(mat.m01, mat.m11, mat.m21);
    const sz = Math.hypot(mat.m02, mat.m12, mat.m22);

    const det = mat.determinant();
    if (det < 0) {
      sx = -sx;
    }

    const m = mat.clone();

    const invSx = 1 / sx;
    const invSy = 1 / sy;
    const invSz = 1 / sz;

    m.m00 *= invSx;
    m.m10 *= invSx;
    m.m20 *= invSx;

    m.m01 *= invSy;
    m.m11 *= invSy;
    m.m21 *= invSy;

    m.m02 *= invSz;
    m.m12 *= invSz;
    m.m22 *= invSz;

    const trace = m.m00 + m.m11 + m.m22;

    if (trace > 0) {
      const S = 0.5 / Math.sqrt(trace + 1.0);
      const x = (m.m21 - m.m12) * S;
      const y = (m.m02 - m.m20) * S;
      const z = (m.m10 - m.m01) * S;
      const w = 0.25 / S;
      return new Quaternion(x, y, z, w);
    } else if (m.m00 > m.m11 && m.m00 > m.m22) {
      const S = Math.sqrt(1.0 + m.m00 - m.m11 - m.m22) * 2;
      const x = 0.25 * S;
      const y = (m.m01 + m.m10) / S;
      const z = (m.m02 + m.m20) / S;
      const w = (m.m21 - m.m12) / S;
      return new Quaternion(x, y, z, w);
    } else if (m.m11 > m.m22) {
      const S = Math.sqrt(1.0 + m.m11 - m.m00 - m.m22) * 2;
      const x = (m.m01 + m.m10) / S;
      const y = 0.25 * S;
      const z = (m.m12 + m.m21) / S;
      const w = (m.m02 - m.m20) / S;
      return new Quaternion(x, y, z, w);
    } else {
      const S = Math.sqrt(1.0 + m.m22 - m.m00 - m.m11) * 2;
      const x = (m.m02 + m.m20) / S;
      const y = (m.m12 + m.m21) / S;
      const z = 0.25 * S;
      const w = (m.m10 - m.m01) / S;
      return new Quaternion(x, y, z, w);
    }
  }
}
