import { Entity } from "./Entity.js";

afterEach(() => {
  Entity.reset();
});

test("Entity.create", () => {
  const entity = Entity.create();
  expect(entity.getId()).toBe(0);
  expect(entity.getName()).toBe("Entity_0");

  const entity2 = Entity.create();
  expect(entity2.getId()).toBe(1);
  expect(entity2.getName()).toBe("Entity_1");  
});

test("Entity.get", () => {
  const entity = Entity.create();
  expect(Entity.get(0)).toBe(entity);
  expect(Entity.get(1)).toBe(undefined);
  expect(Entity.get(-1)).toBe(undefined);
});
