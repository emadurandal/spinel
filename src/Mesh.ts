import { Primitive } from "./Primitive";

export class Mesh {
  private _primitives: Primitive[];

  constructor(primitives: Primitive[]) {
    this._primitives = primitives;
  }

  draw() {
    for (let primitive of this._primitives) {
      primitive.draw();
    }
  }
}
