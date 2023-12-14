import { Entity } from "./Entity.js";

test("Component.entity", () => {
  const entity = Entity.create();
  const transformComponent = entity.getTransform();
  const entity2 = transformComponent.entity;
  expect(entity).toBe(entity2);
});
