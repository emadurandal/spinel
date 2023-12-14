import { Quaternion } from "../../math/Quaternion.js";
import { Transform } from "../../math/Transform.js";
import { Vector3 } from "../../math/Vector3.js";
import { Entity } from "../Entity.js";

test("TransformComponent", () => {
  const entity = Entity.create();
  const transformComponent = entity.getTransform();
  transformComponent.setLocalPosition(new Vector3(1, 2, 3));
  transformComponent.setLocalRotation(new Quaternion(0.5, 0.5, 0.5, 0.5));
  transformComponent.setLocalScale(new Vector3(1, 2, 3));

  const m = transformComponent.getLocalMatrix();

  const t = new Transform(
    new Vector3(1, 2, 3),
    new Quaternion(0.5, 0.5, 0.5, 0.5),
    new Vector3(1, 2, 3)
  );

  const m2 = t.getMatrix();

  expect(m.isEqual(m2, 0.001)).toBe(true);
});
