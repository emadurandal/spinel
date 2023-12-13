import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";


test("Matrix4.toString()", () => {
  const a = new Matrix4(
    1, 2, 3, 4, 
    5, 6, 7, 8, 
    9, 10, 11, 12, 
    13, 14, 15, 16
  );

  expect(a.toString()).toBe(
    "1, 2, 3, 4\n" +
    "5, 6, 7, 8\n" +
    "9, 10, 11, 12\n" +
    "13, 14, 15, 16"
  );
});

test("Matrix4.multiply()", () => {
  const a = new Matrix4(
    1, 2, 3, 4, 
    5, 6, 7, 8, 
    9, 10, 11, 12, 
    13, 14, 15, 16
  );
  const b = new Matrix4(
    17, 18, 19, 20, 
    21, 22, 23, 24, 
    25, 26, 27, 28, 
    29, 30, 31, 32
  );
  const c = a.multiply(b);

  expect(c.isEqual(new Matrix4(
    250, 260, 270, 280, 
    618, 644, 670, 696, 
    986, 1028, 1070, 1112, 
    1354, 1412, 1470, 1528
  ))).toBe(true);
});

test("Matrix4.multiplyVector4()", () => {
  const a = new Matrix4(
      1, 2, 3, 4, 
      5, 6, 7, 8, 
      9, 10, 11, 12, 
      13, 14, 15, 16
  );
  const b = a.multiplyVector(new Vector4(1, 2, 3, 4));

  expect(b.isEqual(new Vector4(30, 70, 110, 150))).toBe(true);
});

test("Matrix4.translation()", () => {
  const a = Matrix4.translation(new Vector3(1, 2, 3));
  const b = new Matrix4(
    1, 0, 0, 1, 
    0, 1, 0, 2, 
    0, 0, 1, 3, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b)).toBe(true);
});

test("Matrix4.rotationX()", () => {
  const a = Matrix4.rotationX(Math.PI / 2);
  const b = new Matrix4(
    1, 0, 0, 0, 
    0, 0, -1, 0, 
    0, 1, 0, 0, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b)).toBe(true);
});

test("Matrix4.rotationY()", () => {
  const a = Matrix4.rotationY(Math.PI / 2);
  const b = new Matrix4(
    0, 0, 1, 0, 
    0, 1, 0, 0, 
    -1, 0, 0, 0, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b)).toBe(true);
});

test("Matrix4.rotationZ()", () => {
  const a = Matrix4.rotationZ(Math.PI / 2);
  const b = new Matrix4(
    0, -1, 0, 0, 
    1, 0, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b)).toBe(true);
});

test("Matrix4.rotationXYZ()", () => {
  const a = Matrix4.rotationXYZ(new Vector3(Math.PI / 2, Math.PI / 2, Math.PI / 2));
  const x = Matrix4.rotationX(Math.PI / 2);
  const y = Matrix4.rotationY(Math.PI / 2);
  const z = Matrix4.rotationZ(Math.PI / 2);
  const b = z.multiply(y).multiply(x);
  
  const c = new Matrix4(
    0, 0, 1, 0, 
    0, 1, 0, 0, 
    -1, 0, 0, 0, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b, 0.0001)).toBe(true);
  expect(a.isEqual(c, 0.0001)).toBe(true);
});

test("Matrix4.scale()", () => {
  const a = Matrix4.scale(new Vector3(1, 2, 3));
  const b = new Matrix4(
    1, 0, 0, 0, 
    0, 2, 0, 0, 
    0, 0, 3, 0, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b)).toBe(true);
});

test("Matrix4.fromQuaternion", () => {
  const a = Matrix4.fromQuaternion(new Quaternion(0.707, 0, 0, 0.707)); // 90 degree rotation around x axis
  const b = Matrix4.rotationX(Math.PI / 2);
  
  const c = new Matrix4(
    1, 0, 0, 0, 
    0, 0, -1, 0, 
    0, 1, 0, 0, 
    0, 0, 0, 1
  );

  expect(a.isEqual(b, 0.001)).toBe(true);
  expect(a.isEqual(c, 0.001)).toBe(true);
})

test("Matrix4.fromQuaternion", () => {
  const a = Matrix4.fromQuaternion(new Quaternion(0, 0.707, 0, 0.707)); // 90 degree rotation around y axis
  const b = Matrix4.rotationY(Math.PI / 2);
  
  expect(a.isEqual(b, 0.001)).toBe(true);
})

test("Matrix4.fromQuaternion 2", () => {
  const q = new Quaternion(0.5, 0.5, 0.5, 0.5);
  const a = Matrix4.fromQuaternion(q); // 90 degree rotation around x axis, then 90 degree rotation around y axis
  const b = Matrix4.rotationXYZ(q.toEulerAngles());
  const c = Matrix4.rotationXYZ(new Vector3(Math.PI / 2, 0, Math.PI / 2));

  expect(a.isEqual(b, 0.001)).toBe(true);
  expect(a.isEqual(c, 0.001)).toBe(true);
})

test("Matrix4.getTranslation()", () => {
  const v = new Vector3(1, 2, 3);
  const m = Matrix4.translation(v);
  const v2 = m.getTranslation();

  expect(v.isEqual(v2)).toBe(true);
});

test("Matrix4.getRotation()", () => {
  const q = new Quaternion(0.5, 0.5, 0.5, 0.5);
  const m = Matrix4.fromQuaternion(q);
  const q2 = m.getRotation();

  expect(q.isEqual(q2)).toBe(true);
});

test("Matrix4.getScale()", () => {
  const v = new Vector3(1, 2, 3);
  const m = Matrix4.scale(v);
  const r = Matrix4.rotationXYZ(new Vector3(0.1, 0.2, 0.3));
  const m2 = m.multiply(r);
  const v2 = m2.getScale();

  expect(v.isEqual(v2)).toBe(true);
});
