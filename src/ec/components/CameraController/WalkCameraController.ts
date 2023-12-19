import { Vector3 } from "../../../math/Vector3.js";
import { Entity } from "../../Entity.js";
import { CameraComponent } from "../Camera/CameraComponent.js";

export class WalkCameraController {
  private _entity: Entity;
  private _lastKeyCode = "";
  private _keyDownFn = this._keyDown.bind(this);
  private _keyUpFn = this._keyUp.bind(this);
  private _pointerDownFn = this._pointerDown.bind(this);
  private _pointerMoveFn = this._pointerMove.bind(this);
  private _pointerUpFn = this._pointerUp.bind(this);

  private _isPointerDown = false;
  private _pointerBgnX = 0;
  private _pointerX = 0;
  private _rotX = 0;
  private rotationRatio = 0.0001;

  constructor(entity: Entity) {
    this._entity = entity;
    this._registerEvents();
  }

  private _keyDown(e: KeyboardEvent) {
    this._lastKeyCode = e.code;
    console.log(this._lastKeyCode);
  }

  private _keyUp(e: KeyboardEvent) {
    this._lastKeyCode = "";
  }

  private _pointerDown(e: PointerEvent) {
    this._isPointerDown = true;
    this._pointerBgnX = e.clientX;
  }

  private _pointerMove(e: PointerEvent) {
    if (this._entity.getCamera() !== CameraComponent.activeCamera) {
      return;
    }
    if (!this._isPointerDown) {
      return;
    }

    this._pointerX = e.clientX;
    const diffX = this._pointerX - this._pointerBgnX;
    this._rotX -= diffX;

    this._entity.getSceneGraph().setEulerAngles(new Vector3(0, this._rotX * this.rotationRatio, 0));
  }

  private _pointerUp(e: PointerEvent) {
    this._isPointerDown = false;
    this._pointerBgnX = this._pointerX;
  }

  process() {
    if (this._entity.getCamera() !== CameraComponent.activeCamera) {
      return;
    }

    const rotation = this._entity.getSceneGraph().getRotation();
    let direction = new Vector3(0, 0, 0);
    if (this._lastKeyCode === "KeyW") {
      direction = new Vector3(0, 0, -1);
    } else if (this._lastKeyCode === "KeyS") {
      direction = new Vector3(0, 0, 1);
    } else if (this._lastKeyCode === "KeyA") {
      direction = new Vector3(-1, 0, 0);
    } else if (this._lastKeyCode === "KeyD") {
      direction = new Vector3(1, 0, 0);
    } else if (this._lastKeyCode === "KeyQ") {
      direction = new Vector3(0, -1, 0);
    } else if (this._lastKeyCode === "KeyE") {
      direction = new Vector3(0, 1, 0);
    }
    const rotatedDirection = rotation.transformVector(direction);
    const currentPos = this._entity.getSceneGraph().getPosition();
    this._entity.getSceneGraph().setPosition(currentPos.add(rotatedDirection));
  }

  private _registerEvents() {
    document.addEventListener("keydown", this._keyDownFn);
    document.addEventListener("keyup", this._keyUpFn);
    window.addEventListener("pointerdown", this._pointerDownFn);
    window.addEventListener("pointermove", this._pointerMoveFn);
    window.addEventListener("pointerup", this._pointerUpFn);
  }
}
