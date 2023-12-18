import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";

test("Quaternion toEulerAngle", ()=>{
  const q = new Quaternion(0.5, 0.5, 0.5, 0.5);
  const e = q.toEulerAngles();

  expect(e.isEqual(new Vector3(Math.PI / 2, 0, Math.PI / 2))).toBe(true);
});

test("Quaternion.multiply", () => {
  const qx = new Quaternion(0.383, 0, 0, 0.924); // 45 degree rotation around x axis
  const qy = new Quaternion(0, 0.383, 0, 0.924); // 45 degree rotation around y axis
  const qyx = qy.multiply(qx);

  const mx = Matrix4.fromQuaternion(qx);
  const my = Matrix4.fromQuaternion(qy);
  const myx = my.multiply(mx);
  const myx2 = Matrix4.fromQuaternion(qyx);

  expect(myx.isEqual(myx2, 0.001)).toBe(true);
});

test("Quaternion.multiply", () => {
  const qx = new Quaternion(0.383, 0, 0, 0.924); // 45 degree rotation around x axis
  const qy = new Quaternion(0, 0.383, 0, 0.924); // 45 degree rotation around y axis
  const qyx = qy.multiply(qx);
  const myx = Matrix4.fromQuaternion(qyx);
  const myx2 = Matrix4.rotationXYZ(qyx.toEulerAngles());

  expect(myx.isEqual(myx2, 0.001)).toBe(true);
});

test("Quaternion.fromMatrix4", () => {
  const q = new Quaternion(0.5, 0.5, 0.5, 0.5);
  const m = Matrix4.fromQuaternion(q);
  const q2 = Quaternion.fromMatrix4(m);

  expect(q.isEqual(q2)).toBe(true);
});

test("Quaternion.fromEuler", () => {
  const v = new Vector3(Math.PI / 2, 0, Math.PI / 2);
  const q = Quaternion.fromEulerAngles(v);
  const v2 = q.toEulerAngles();

  expect(v.isEqual(v2, 0.001)).toBe(true);
});

test("Quaternion.transformVector", () => {
  const euler = new Vector3(Math.PI / 2, 0, Math.PI / 2);
  const q = Quaternion.fromEulerAngles(euler);
  const testVec = new Vector3(1, 0, 0);
  const v = q.transformVector(testVec);

  const m = Matrix4.fromQuaternion(q);
  const v2 = m.multiplyVector(new Vector4(testVec.x, testVec.y, testVec.z, 1)).toVector3();

  expect(v.isEqual(v2, 0.001)).toBe(true);
});
