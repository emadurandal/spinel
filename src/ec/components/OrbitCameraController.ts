import { Vector3 } from "../../math/Vector3.js";
import { Quaternion } from "../../math/Quaternion.js";
import { Matrix4 } from "../../math/Matrix4.js";
import { Entity } from "../Entity.js";
import { CameraComponent } from "../../ec/components/CameraComponent.js";

export class OrbitCameraController {
  private _entity: Entity;
  private _target?: Entity;
  private _targetEntity: Entity;
  private _isPointerDown = false;
  
  // pointer positions
  private _pointerBgnX = 0;
  private _pointerBgnY = 0;
  private _pointerX = 0;
  private _pointerY = 0;

  // translation
  private _transX = 0;
  private _transY = 0;
  public translationRatio = 0.01;

  // rotation angles
  private _rotX = 0; // rotation around y-axis in degrees
  private _rotY = 0; // rotation around x-axis in degrees
  public rotationRatio = 0.01;

  // dolly
  private _dollyVal = 1;
  public dollyRatio = 0.01;
  public wheelRatio = 0.001;

  private _pointerDownFn = this._pointerDown.bind(this);
  private _pointerMoveFn = this._pointerMove.bind(this);
  private _pointerUpFn = this._pointerUp.bind(this);
  private _wheelFn = this._wheel.bind(this);

  constructor(entity: Entity) {
    this._entity = entity;
    this._targetEntity = Entity.create();
    this._targetEntity.getSceneGraph().addChild(this._entity.getSceneGraph());
    this._registerEvents();
  }

  setTarget(target: Entity) {
    this._target = target;
    this._targetEntity.getSceneGraph().setPosition(target.getSceneGraph().getPosition());
  }

  private _registerEvents() {
    window.addEventListener("pointerdown", this._pointerDownFn);
    window.addEventListener("pointermove", this._pointerMoveFn);
    window.addEventListener("pointerup", this._pointerUpFn);
    window.addEventListener("wheel", this._wheelFn);
  }

  private _pointerDown(e: PointerEvent) {
    this._isPointerDown = true;
    this._pointerBgnX = e.clientX;
    this._pointerBgnY = e.clientY;
  }

  private _pointerMove(e: PointerEvent) {
    if (this._entity.getCamera() !== CameraComponent.activeCamera) {
      return;
    }

    if (this._isPointerDown) {
      this._pointerX = e.clientX;
      this._pointerY = e.clientY;
      const pointerMoveX = this._pointerX - this._pointerBgnX;
      const pointerMoveY = - (this._pointerY - this._pointerBgnY);

      if (e.shiftKey) {
        this._translate(pointerMoveX, pointerMoveY);
      } else if (e.altKey) {
        this._dolly(pointerMoveX * this.dollyRatio, 0);
      } else {
        this._rotate(pointerMoveX, pointerMoveY);
      }
        
      this._calcTransform();

      this._pointerBgnX = this._pointerX;
      this._pointerBgnY = this._pointerY;
    }
  }

  private _wheel(e: WheelEvent) {
    if (this._entity.getCamera() !== CameraComponent.activeCamera) {
      return;
    }
    this._dolly(e.deltaY * this.wheelRatio, 0);
    this._calcTransform();
  }

  private _translate(pointerMoveX: number, pointerMoveY: number) {
    this._transX = -pointerMoveX * this.translationRatio;
    this._transY = -pointerMoveY * this.translationRatio;
  }

  private _rotate(pointerMoveX: number, pointerMoveY: number) {
    this._rotX -= pointerMoveX * this.rotationRatio;
    this._rotY += pointerMoveY * this.rotationRatio;
  }
  
  private _dolly(pointerMoveX: number, pointerMoveY: number) {
    this._dollyVal -= pointerMoveX;
    this._dollyVal = Math.min(Math.max(this._dollyVal, 0.01), 10);
  }
  
  private _calcTransform() {
    this._targetEntity.getSceneGraph().setScale(new Vector3(this._dollyVal, this._dollyVal, this._dollyVal));

    // camera rotation
    const rotationMat = Matrix4.rotationY(this._rotX).multiply(Matrix4.rotationX(this._rotY));
    const rotation = rotationMat.getRotation();
    this._targetEntity.getSceneGraph().setRotation(rotation);
    
    // camera translation
    const translationVec = new Vector3(this._transX, this._transY, 0);
    const translationVecRotated = rotation.transformVector(translationVec);
    const currentCameraPos = this._targetEntity.getSceneGraph().getPosition();
    this._targetEntity.getSceneGraph().setPosition(currentCameraPos.add(translationVecRotated));
  }

  reset() {
    this._targetEntity.getSceneGraph().setPosition(Vector3.zero());
    this._targetEntity.getSceneGraph().setRotation(Quaternion.identity());
    this._rotX = 0;
    this._rotY = 0;
  }

  private _pointerUp() {
    this._isPointerDown = false;
    this._pointerBgnX = 0;
    this._pointerBgnY = 0;
    this._transX = 0;
    this._transY = 0;
  }
}
