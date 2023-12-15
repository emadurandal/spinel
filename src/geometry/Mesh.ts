import { Entity } from "../ec/Entity.js";
import { Primitive } from "./Primitive.js";

export class Mesh {
  private _primitives: Primitive[];

  constructor(primitives: Primitive[]) {
    this._primitives = primitives;
  }

  draw(entity: Entity) {
    for (let primitive of this._primitives) {
      primitive.draw(entity);
    }
  }
}
