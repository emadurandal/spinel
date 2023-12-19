import { Entity } from "../ec/Entity.js";
import { AABB } from "../math/AABB.js";
import { Primitive } from "./Primitive.js";

export class Mesh {
  private _primitives: Primitive[];
  private _localAABB = new AABB();

  constructor(primitives: Primitive[]) {
    this._primitives = primitives;

    for (let primitive of primitives) {
      this._localAABB.merge(primitive.getLocalAABB());
    }
  }

  getLocalAABB() {
    return this._localAABB.clone();
  }

  draw(entity: Entity) {
    for (let primitive of this._primitives) {
      primitive.draw(entity);
    }
  }
}
