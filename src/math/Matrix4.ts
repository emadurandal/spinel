import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class Matrix4 {
  private v: Float32Array;

  constructor(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number
  ) {
    this.v = new Float32Array([
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33
    ]);
  }

  get raw() {
    return this.v;
  }

  static identity() {
    return new Matrix4(
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    );
  }

  static translation(vec: Vector3 | Vector4) {
    return new Matrix4(
      1, 0, 0, vec.x, 
      0, 1, 0, vec.y, 
      0, 0, 1, vec.z, 
      0, 0, 0, 1
    );
  }

  static rotationX(angle: number) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Matrix4(
      1, 0, 0, 0, 
      0, cos, -sin, 0, 
      0, sin, cos, 0, 
      0, 0, 0, 1
    );
  }

  static rotationY(angle: number) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Matrix4(
      cos, 0, sin, 0, 
      0, 1, 0, 0, 
      -sin, 0, cos, 0, 
      0, 0, 0, 1
    );
  }

  static rotationZ(angle: number) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Matrix4(
      cos, -sin, 0, 0, 
      sin, cos, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    );
  }

  static rotationXYZ(vec: Vector3 | Vector4) {
    const cosX = Math.cos(vec.x);
    const sinX = Math.sin(vec.x);
    const cosY = Math.cos(vec.y);
    const sinY = Math.sin(vec.y);
    const cosZ = Math.cos(vec.z);
    const sinZ = Math.sin(vec.z);

    const x11 = cosX;
    const x12 = -sinX;
    const x21 = sinX;
    const x22 = cosX;

    const y00 = cosY;
    const y02 = sinY;
    const y20 = -sinY;
    const y22 = cosY;

    const z00 = cosZ;
    const z01 = -sinZ;
    const z10 = sinZ;
    const z11 = cosZ;

    // Y * X
    const yx00 = y00;
    const yx01 = y02 * x21;
    const yx02 = y02 * x22;
    const yx11 = x11;
    const yx12 = x12;
    const yx20 = y20;
    const yx21 = y22 * x21;
    const yx22 = y22 * x22;

    // Z * Y * X
    const m00 = z00 * yx00;
    const m01 = z00 * yx01 + z01 * yx11;
    const m02 = z00 * yx02 + z01 * yx12;
    const m10 = z10 * yx00;
    const m11 = z10 * yx01 + z11 * yx11;
    const m12 = z10 * yx02 + z11 * yx12;
    const m20 = yx20;
    const m21 = yx21;
    const m22 = yx22;

    return new Matrix4(
      m00, m01, m02, 0, 
      m10, m11, m12, 0, 
      m20, m21, m22, 0, 
      0, 0, 0, 1
    );
  }

  static scale(vec: Vector3 | Vector4) {
    return new Matrix4(
      vec.x, 0, 0, 0, 
      0, vec.y, 0, 0, 
      0, 0, vec.z, 0, 
      0, 0, 0, 1
    );
  }

  multiply(mat: Matrix4) {
    const m00 = this.m00 * mat.m00 + this.m01 * mat.m10 + this.m02 * mat.m20 + this.m03 * mat.m30;
    const m01 = this.m00 * mat.m01 + this.m01 * mat.m11 + this.m02 * mat.m21 + this.m03 * mat.m31;
    const m02 = this.m00 * mat.m02 + this.m01 * mat.m12 + this.m02 * mat.m22 + this.m03 * mat.m32;
    const m03 = this.m00 * mat.m03 + this.m01 * mat.m13 + this.m02 * mat.m23 + this.m03 * mat.m33;
    const m10 = this.m10 * mat.m00 + this.m11 * mat.m10 + this.m12 * mat.m20 + this.m13 * mat.m30;
    const m11 = this.m10 * mat.m01 + this.m11 * mat.m11 + this.m12 * mat.m21 + this.m13 * mat.m31;
    const m12 = this.m10 * mat.m02 + this.m11 * mat.m12 + this.m12 * mat.m22 + this.m13 * mat.m32;
    const m13 = this.m10 * mat.m03 + this.m11 * mat.m13 + this.m12 * mat.m23 + this.m13 * mat.m33;
    const m20 = this.m20 * mat.m00 + this.m21 * mat.m10 + this.m22 * mat.m20 + this.m23 * mat.m30;
    const m21 = this.m20 * mat.m01 + this.m21 * mat.m11 + this.m22 * mat.m21 + this.m23 * mat.m31;
    const m22 = this.m20 * mat.m02 + this.m21 * mat.m12 + this.m22 * mat.m22 + this.m23 * mat.m32;
    const m23 = this.m20 * mat.m03 + this.m21 * mat.m13 + this.m22 * mat.m23 + this.m23 * mat.m33;
    const m30 = this.m30 * mat.m00 + this.m31 * mat.m10 + this.m32 * mat.m20 + this.m33 * mat.m30;
    const m31 = this.m30 * mat.m01 + this.m31 * mat.m11 + this.m32 * mat.m21 + this.m33 * mat.m31;
    const m32 = this.m30 * mat.m02 + this.m31 * mat.m12 + this.m32 * mat.m22 + this.m33 * mat.m32;
    const m33 = this.m30 * mat.m03 + this.m31 * mat.m13 + this.m32 * mat.m23 + this.m33 * mat.m33;

    return new Matrix4(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33
    );
  }

  multiplyVector(vec: Vector4) {
    const x = this.m00 * vec.x + this.m01 * vec.y + this.m02 * vec.z + this.m03 * vec.w;
    const y = this.m10 * vec.x + this.m11 * vec.y + this.m12 * vec.z + this.m13 * vec.w;
    const z = this.m20 * vec.x + this.m21 * vec.y + this.m22 * vec.z + this.m23 * vec.w;
    const w = this.m30 * vec.x + this.m31 * vec.y + this.m32 * vec.z + this.m33 * vec.w;
    
    return new Vector4(x, y, z, w);
  }

  isEqual(mat: Matrix4, delta = Number.EPSILON) {
    return (
      Math.abs(this.m00 - mat.m00) < delta &&
      Math.abs(this.m01 - mat.m01) < delta &&
      Math.abs(this.m02 - mat.m02) < delta &&
      Math.abs(this.m03 - mat.m03) < delta &&
      Math.abs(this.m10 - mat.m10) < delta &&
      Math.abs(this.m11 - mat.m11) < delta &&
      Math.abs(this.m12 - mat.m12) < delta &&
      Math.abs(this.m13 - mat.m13) < delta &&
      Math.abs(this.m20 - mat.m20) < delta &&
      Math.abs(this.m21 - mat.m21) < delta &&
      Math.abs(this.m22 - mat.m22) < delta &&
      Math.abs(this.m23 - mat.m23) < delta &&
      Math.abs(this.m30 - mat.m30) < delta &&
      Math.abs(this.m31 - mat.m31) < delta &&
      Math.abs(this.m32 - mat.m32) < delta &&
      Math.abs(this.m33 - mat.m33) < delta
    );
  }

  toString(delimiter = ", ") {
    return (
      this.m00 + delimiter + this.m01 + delimiter + this.m02 + delimiter + this.m03 + "\n" +
      this.m10 + delimiter + this.m11 + delimiter + this.m12 + delimiter + this.m13 + "\n" +
      this.m20 + delimiter + this.m21 + delimiter + this.m22 + delimiter + this.m23 + "\n" +
      this.m30 + delimiter + this.m31 + delimiter + this.m32 + delimiter + this.m33
    );
  }

  get m00() {
    return this.v[0];
  }

  set m00(value: number) {
    this.v[0] = value;
  }

  get m10() {
    return this.v[1];
  }

  set m10(value: number) {
    this.v[1] = value;
  }

  get m20() {
    return this.v[2];
  }

  set m20(value: number) {
    this.v[2] = value;
  }

  get m30() {
    return this.v[3];
  }

  set m30(value: number) {
    this.v[3] = value;
  }

  get m01() {
    return this.v[4];
  }
  
  set m01(value: number) {
    this.v[4] = value;
  }

  get m11() {
    return this.v[5];
  }

  set m11(value: number) {
    this.v[5] = value;
  }

  get m21() {
    return this.v[6];
  }

  set m21(value: number) {
    this.v[6] = value;
  }

  get m31() {
    return this.v[7];
  }

  set m31(value: number) {
    this.v[7] = value;
  }

  get m02() {
    return this.v[8];
  }

  set m02(value: number) {
    this.v[8] = value;
  }

  get m12() {
    return this.v[9];
  }

  set m12(value: number) {
    this.v[9] = value;
  }

  get m22() {
    return this.v[10];
  }

  set m22(value: number) {
    this.v[10] = value;
  }

  get m32() {
    return this.v[11];
  }

  set m32(value: number) {
    this.v[11] = value;
  }

  get m03() {
    return this.v[12];
  }

  set m03(value: number) {
    this.v[12] = value;
  }

  get m13() {
    return this.v[13];
  }

  set m13(value: number) {
    this.v[13] = value;
  }

  get m23() {
    return this.v[14];
  }

  set m23(value: number) {
    this.v[14] = value;
  }

  get m33() {
    return this.v[15];
  }

  set m33(value: number) {
    this.v[15] = value;
  }

}
