import { Entity } from "../Entity.js";

export class OrbitCameraController {
  private _entity: Entity;
  private _isPointerDown = false;
  private _rot_x = 0;
  private _rot_y = 0;

  private _pointerDownFn = this._pointerDown.bind(this);

  constructor(entity: Entity) {
    this._entity = entity;
    this._registerEvents();
  }

  private _registerEvents() {
    window.addEventListener("pointerdown", this._pointerDownFn);
  }

  private _unregisterEvents() {
    
  }

  private _pointerDown() {
    this._isPointerDown = true;
    console.log("pointer down");
  }
}
