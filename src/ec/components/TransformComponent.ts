import { Matrix4 } from "../../math/Matrix4.js";
import { Quaternion } from "../../math/Quaternion.js";
import { Transform } from "../../math/Transform.js";
import { Vector3 } from "../../math/Vector3.js";
import { Component } from "../Component.js";
import type { Entity } from "../Entity.js";

export class TransformComponent extends Component {
  private _transform: Transform;

  private constructor(entity: Entity) {
    super(entity);
    this._transform = new Transform(Vector3.zero(), Quaternion.identity(), Vector3.one());
  }

  setTransform(transform: Transform) {
    this._transform = transform;
  }

  getTransform() {
    return this._transform.clone();
  }
  
  setLocalPosition(value: Vector3) {
    this._transform.setPosition(value);
  }

  getLocalPosition() {
    return this._transform.getPosition();
  }

  setLocalRotation(value: Quaternion) {
    this._transform.setRotation(value);
  }

  getLocalRotation() {
    return this._transform.getRotation();
  }

  setLocalEulerAngles(value: Vector3) {
    this._transform.setEulerAngles(value);
  }

  getLocalEulerAngles() {
    return this._transform.getEulerAngles();
  }

  setLocalScale(value: Vector3) {
    this._transform.setScale(value);
  }

  getLocalScale() {
    return this._transform.getScale();
  }

  getLocalMatrix() {
    return this._transform.getMatrix();
  }

  setLocalMatrix(value: Matrix4) {
    this._transform.setMatrix(value);
  }

  /**
   * @private
   * @param entity 
   */
  static _create(entity: Entity) {
    return new TransformComponent(entity);
  }
}

