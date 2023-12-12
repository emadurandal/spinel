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
