import { AABB } from "./AABB.js";
import { Vector3 } from "./Vector3.js";

test('AABB is vanilla first', () => {
  const aabb = new AABB();
  expect(aabb.isVanilla()).toBe(true);

  aabb.addPoint(new Vector3(0, 0, 0));

  expect(aabb.isVanilla()).toBe(false);
});

test('AABB addPoint', () => {
  const aabb = new AABB();
  aabb.addPoint(new Vector3(0, 0, 0));
  aabb.addPoint(new Vector3(1, 1, 1));

  expect(aabb.getMin().isEqual(new Vector3(0, 0, 0))).toBe(true);
  expect(aabb.getMax().isEqual(new Vector3(1, 1, 1))).toBe(true);
  expect(aabb.getCenterPoint().isEqual(new Vector3(0.5, 0.5, 0.5))).toBe(true);
  expect(aabb.getSizeX()).toBe(1);
  expect(aabb.getSizeY()).toBe(1);
  expect(aabb.getSizeZ()).toBe(1);
  expect(aabb.getLengthCornerToCorner()).toBe(Math.sqrt(3));
});
