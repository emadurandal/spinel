import { Vector3 } from "../../math/Vector3.js";
import { Entity } from "../Entity.js";

test("SceneGraphComponent Position", () => {
  const parent = Entity.create();
  const child = Entity.create();
  parent.getSceneGraph().addChild(child.getSceneGraph());

  parent.getTransform().setLocalPosition(new Vector3(10, 0, 0));
  child.getTransform().setLocalPosition(new Vector3(0, 10, 0));

  const childPos = child.getSceneGraph().getPosition();

  expect(childPos.isEqual(new Vector3(10, 10, 0), 0.001)).toBe(true);
});

test("SceneGraphComponent Rotation", () => {
  const parent = Entity.create();
  const child = Entity.create();
  parent.getSceneGraph().addChild(child.getSceneGraph());

  parent.getTransform().setLocalEulerAngles(new Vector3(0, Math.PI / 2, 0));
  child.getTransform().setLocalPosition(new Vector3(10, 0, 0));

  const childPos = child.getSceneGraph().getPosition();

  expect(childPos.isEqual(new Vector3(0, 0, -10), 0.001)).toBe(true);
});

test("SceneGraphComponent Scale", () => {
  const parent = Entity.create();
  const child = Entity.create();
  parent.getSceneGraph().addChild(child.getSceneGraph());

  parent.getTransform().setLocalScale(new Vector3(2, 2, 2));
  child.getTransform().setLocalPosition(new Vector3(10, 0, 0));

  const childPos = child.getSceneGraph().getPosition();

  expect(childPos.isEqual(new Vector3(20, 0, 0), 0.001)).toBe(true);
});

test("SceneGraphComponent Position 2", () => {
  const parent = Entity.create();
  const child = Entity.create();
  parent.getSceneGraph().addChild(child.getSceneGraph());

  parent.getTransform().setLocalPosition(new Vector3(10, 0, 0));
  child.getTransform().setLocalPosition(new Vector3(10, 0, 0));

  expect(child.getSceneGraph().getPosition().isEqual(new Vector3(20, 0, 0), 0.001)).toBe(true);

  child.getSceneGraph().setPosition(new Vector3(10, 0, 0));

  expect(child.getSceneGraph().getPosition().isEqual(new Vector3(10, 0, 0), 0.001)).toBe(true);

  expect(parent.getTransform().getLocalPosition().isEqual(new Vector3(10, 0, 0), 0.001)).toBe(true);
  expect(child.getTransform().getLocalPosition().isEqual(new Vector3(0, 0, 0), 0.001)).toBe(true);

});

test("SceneGraphComponent Rotation 2", () => {
  const parent = Entity.create();
  const child = Entity.create();
  parent.getSceneGraph().addChild(child.getSceneGraph());

  parent.getTransform().setLocalEulerAngles(new Vector3(0, Math.PI / 4, 0));
  child.getTransform().setLocalEulerAngles(new Vector3(0, Math.PI / 4, 0));

  expect(child.getSceneGraph().getEulerAngles().isEqual(new Vector3(0, Math.PI / 2, 0), 0.001)).toBe(true);

  child.getSceneGraph().setEulerAngles(new Vector3(0, Math.PI / 4, 0));

  expect(parent.getTransform().getLocalEulerAngles().isEqual(new Vector3(0, Math.PI / 4, 0), 0.001)).toBe(true);
  expect(child.getTransform().getLocalEulerAngles().isEqual(new Vector3(0, 0, 0), 0.001)).toBe(true);

});

test("SceneGraphComponent Scale 2", () => {
  const parent = Entity.create();
  const child = Entity.create();
  parent.getSceneGraph().addChild(child.getSceneGraph());

  parent.getTransform().setLocalScale(new Vector3(2, 2, 2));
  child.getTransform().setLocalScale(new Vector3(2, 2, 2));

  expect(child.getSceneGraph().getScale().isEqual(new Vector3(4, 4, 4), 0.001)).toBe(true);

  child.getSceneGraph().setScale(new Vector3(2, 2, 2));

  expect(parent.getTransform().getLocalScale().isEqual(new Vector3(2, 2, 2), 0.001)).toBe(true);
  expect(child.getTransform().getLocalScale().isEqual(new Vector3(1, 1, 1), 0.001)).toBe(true);
});
