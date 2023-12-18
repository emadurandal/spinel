import { CameraControllerType } from "../../../definitions.js";
import { Component } from "../../Component.js";
import { Entity } from "../../Entity.js";
import { OrbitCameraController } from "./OrbitCameraController.js";

export class CameraControllerComponent extends Component {
  private _controller: OrbitCameraController;
  private constructor(entity: Entity, controller: OrbitCameraController) {
    super(entity);
    this._controller = controller;
  }

  /**
   * @private
   * @param mesh 
   * @returns a Mesh component
   */
  static _create(entity: Entity, controller: CameraControllerType) {
    if (controller === CameraControllerType.Orbit) {
      return new CameraControllerComponent(entity, new OrbitCameraController(entity));
    } else {
      return new CameraControllerComponent(entity, new OrbitCameraController(entity));
    }
  }
}
