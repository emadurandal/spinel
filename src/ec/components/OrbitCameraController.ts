import { Vector3 } from "../../math/Vector3.js";
import { Transform } from "../../math/Transform.js";
import { Entity } from "../Entity.js";
import { Matrix4, Quaternion } from "../../index2.js";

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

  private _pointerDownFn = this._pointerDown.bind(this);
  private _pointerMoveFn = this._pointerMove.bind(this);
  private _pointerUpFn = this._pointerUp.bind(this);

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
  }

  private _pointerDown(e: PointerEvent) {
    this._isPointerDown = true;
    this._pointerBgnX = e.clientX;
    this._pointerBgnY = e.clientY;
    console.log("pointer down");
  }

  private _pointerMove(e: PointerEvent) {
    if (this._isPointerDown) {
      this._pointerX = e.clientX;
      this._pointerY = e.clientY;
      const pointerMoveX = this._pointerX - this._pointerBgnX;
      const pointerMoveY = - (this._pointerY - this._pointerBgnY);

      if (e.shiftKey) {
        this._translate(pointerMoveX, pointerMoveY);
      }
        else {
        this._rotate(pointerMoveX, pointerMoveY);
      }
        
      this._calcTransform();

      this._pointerBgnX = this._pointerX;
      this._pointerBgnY = this._pointerY;
    }
  }


  private _translate(pointerMoveX: number, pointerMoveY: number) {
    this._transX = -pointerMoveX * this.translationRatio;
    this._transY = -pointerMoveY * this.translationRatio;

    // console.log(`transX: ${this._transX}, transY: ${this._transY}`);
  }

  private _rotate(pointerMoveX: number, pointerMoveY: number) {
    this._rotX -= pointerMoveX * this.rotationRatio;
    this._rotY += pointerMoveY * this.rotationRatio;

    console.log(`rotX: ${this._rotX}, rotY: ${this._rotY}`); 
  }
  
  private _calcTransform() {
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
    // this._rotX = 0;
    // this._rotY = 0;
    console.log("pointer up");
  }
}
