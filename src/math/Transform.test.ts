import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";
import { Transform } from "./Transform.js";
import { Vector4 } from "./Vector4.js";
import { Matrix4 } from "./Matrix4.js";

test("Transform.matrix", () => {
  const t = new Transform(
    new Vector3(1, 2, 3),
    new Quaternion(0.5, 0.5, 0.5, 0.5),
    new Vector3(1, 2, 3)
  );

  const m = t.getMatrix();
  const t2 = t.clone();
  t2.setMatrix(m);

  expect(t.isEqual(t2, 0.001)).toBe(true);

});

test("Transform.transformVector", () => {
  const t = new Transform(
    new Vector3(1, 2, 3),
    new Quaternion(0.5, 0.5, 0.5, 0.5),
    new Vector3(1, 2, 3)
  );

  const v = new Vector4(1, 2, 3, 1);
  const v2 = t.transformVector(v);

  const mt = Matrix4.translation(new Vector3(1, 2, 3));
  const mr = Matrix4.fromQuaternion(new Quaternion(0.5, 0.5, 0.5, 0.5));
  const ms = Matrix4.scale(new Vector3(1, 2, 3));

  const m = mt.multiply(mr).multiply(ms);
  const v3 = m.multiplyVector(v);

  expect(v2.isEqual(v3, 0.001)).toBe(true);
});

test("Transform.multiply", () => {
  const p = new Vector3(1, 2, 3);
  const r = new Quaternion(0.5, 0.5, 0.5, 0.5);
  const s = new Vector3(1, 2, 3);
  const m = Matrix4.translation(p).multiply(Matrix4.fromQuaternion(r)).multiply(Matrix4.scale(s));
  
  const p2 = new Vector3(4, 5, 6);
  const r2 = new Quaternion(-0.5, 0.5, 0.5, 0.5);
  const s2 = new Vector3(4, 5, 6);
  const m2 = Matrix4.translation(p2).multiply(Matrix4.fromQuaternion(r2)).multiply(Matrix4.scale(s2));  
  const m3 = m.multiply(m2);

  const t = new Transform(p, r, s);
  const t2 = new Transform(p2, r2, s2);
  const t3 = t.multiply(t2);

  expect(t3.getMatrix().isEqual(m3, 0.001)).toBe(true);

});

test("Transform.invert", () => {
  const t = new Transform(
    new Vector3(1, 2, 3),
    new Quaternion(0.5, 0.5, 0.5, 0.5),
    new Vector3(1, 2, 3)
  );

  const t2 = t.invert().invert();

  expect(t.isEqual(t2, 0.001)).toBe(true);
});
