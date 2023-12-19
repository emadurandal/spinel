import { CameraControllerType } from "../../../definitions.js";
import { Component } from "../../Component.js";
import { Entity } from "../../Entity.js";
import { OrbitCameraController } from "./OrbitCameraController.js";
import { WalkCameraController } from "./WalkCameraController.js";

export class CameraControllerComponent extends Component {
  private _orbitController?: OrbitCameraController;
  private _walkController?: WalkCameraController;

  private constructor(entity: Entity, controller: CameraControllerType) {
    super(entity);
    if (controller === CameraControllerType.Orbit) {
      this._orbitController = new OrbitCameraController(entity);
    } else if (controller === CameraControllerType.Walk) {
      this._walkController = new WalkCameraController(entity);
    } else {
      throw new Error(`Unknown CameraControllerType: ${controller}`);
    }
  }

  /**
   * @private
   * @param mesh 
   * @returns a Mesh component
   */
  static _create(entity: Entity, controller: CameraControllerType) {
    return new CameraControllerComponent(entity, controller);
  }

  getOrbitController(): OrbitCameraController | undefined {
    return this._orbitController;
  }

  getWalkController(): WalkCameraController | undefined {
    return this._walkController;
  }
}
