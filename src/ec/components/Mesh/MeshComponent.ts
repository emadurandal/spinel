import { Mesh } from "../../../geometry/Mesh.js";
import { Component } from "../../Component.js";
import { Entity } from "../../Entity.js";

export class MeshComponent extends Component {
  private _mesh: Mesh;

  private constructor(entity: Entity, mesh: Mesh) {
    super(entity);
    this._mesh = mesh;
  }

  draw() {
    this._mesh.draw(this.entity);
  }

  getLocalAABB() {
    return this._mesh.getLocalAABB();
  }

  /**
   * @private
   * @param mesh 
   * @returns a Mesh component
   */
  static _create(entity: Entity, mesh: Mesh) {
    return new MeshComponent(entity, mesh);
  }
}
