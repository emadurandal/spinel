import { AABB } from "./AABB.js";
import { Matrix4 } from "./Matrix4.js";
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

test('AABB merge', () => {
  const aabb = new AABB();
  aabb.addPoint(new Vector3(0, 0, 0));
  aabb.addPoint(new Vector3(1, 1, 1));

  const aabb2 = new AABB();
  aabb2.addPoint(new Vector3(1, 1, 1));
  aabb2.addPoint(new Vector3(2, 2, 2));

  aabb.merge(aabb2);

  expect(aabb.getMin().isEqual(new Vector3(0, 0, 0))).toBe(true);
  expect(aabb.getMax().isEqual(new Vector3(2, 2, 2))).toBe(true);
  expect(aabb.getCenterPoint().isEqual(new Vector3(1, 1, 1))).toBe(true);
  expect(aabb.getSizeX()).toBe(2);
  expect(aabb.getSizeY()).toBe(2);
  expect(aabb.getSizeZ()).toBe(2);
  expect(aabb.getLengthCornerToCorner()).toBe(Math.sqrt(12));
});

test('AABB merge with vanilla AABB', () => {
  const aabb = new AABB();
  aabb.addPoint(new Vector3(0, 0, 0));
  aabb.addPoint(new Vector3(1, 1, 1));

  const aabb2 = new AABB();
  aabb.merge(aabb2); // no effect

  expect(aabb.getMin().isEqual(new Vector3(0, 0, 0))).toBe(true);
  expect(aabb.getMax().isEqual(new Vector3(1, 1, 1))).toBe(true);
  expect(aabb.getCenterPoint().isEqual(new Vector3(0.5, 0.5, 0.5))).toBe(true);
  expect(aabb.getSizeX()).toBe(1);
  expect(aabb.getSizeY()).toBe(1);
  expect(aabb.getSizeZ()).toBe(1);
  expect(aabb.getLengthCornerToCorner()).toBe(Math.sqrt(3));
});

test('AABB transformByMatrix', () => {
  const aabb = new AABB();
  aabb.addPoint(new Vector3(0, 0, 0));
  aabb.addPoint(new Vector3(1, 1, 1));

  const aabb2 = aabb.transformByMatrix(new Matrix4(
    1, 0, 0, 1,
    0, 1, 0, 2,
    0, 0, 1, 3,
    0, 0, 0, 1
  ));

  expect(aabb2.getMin().isEqual(new Vector3(1, 2, 3))).toBe(true);
  expect(aabb2.getMax().isEqual(new Vector3(2, 3, 4))).toBe(true);
  expect(aabb2.getCenterPoint().isEqual(new Vector3(1.5, 2.5, 3.5))).toBe(true);
  expect(aabb2.getSizeX()).toBe(1);
  expect(aabb2.getSizeY()).toBe(1);
  expect(aabb2.getSizeZ()).toBe(1);
  expect(aabb2.getLengthCornerToCorner()).toBe(Math.sqrt(3));
});

test('AABB transformByMatrix 2', () => {
  const aabb = new AABB();
  aabb.addPoint(new Vector3(1, 0, 0));
  aabb.addPoint(new Vector3(0, 1, 0));

  const aabb2 = aabb.transformByMatrix(Matrix4.rotationZ(Math.PI / 4));

  expect(aabb2.getMin().isEqual(new Vector3(-0.7071067690849304, 0, 0), 0.001)).toBe(true);
  expect(aabb2.getMax().isEqual(new Vector3(0.7071067690849304, 1.4142135381698608, 0), 0.001)).toBe(true);
  expect(aabb2.getCenterPoint().isEqual(new Vector3(0, 0.7071067690849304, 0), 0.001)).toBe(true);
});

test('AABB transformByMatrix with vanilla AABB', () => {
  const aabb2 = new AABB();
  aabb2.transformByMatrix(new Matrix4(
    1, 0, 0, 1,
    0, 1, 0, 2,
    0, 0, 1, 3,
    0, 0, 0, 1
  ));

  expect(aabb2.isVanilla()).toBe(true);
});
