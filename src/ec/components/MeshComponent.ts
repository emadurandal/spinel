import { Mesh } from "../../geometry/Mesh";

export class MeshComponent {
  private _mesh: Mesh;

  private constructor(mesh: Mesh) {
    this._mesh = mesh;
  }

  draw() {
    this._mesh.draw();
  }

  /**
   * @private
   * @param mesh 
   * @returns a Mesh component
   */
  static _create(mesh: Mesh) {
    return new MeshComponent(mesh);
  }
}
