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

  const m = t.matrix;
  const t2 = t.clone();
  t2.matrix = m;

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
