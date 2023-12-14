import { Vector3 } from "../../math/Vector3.js";
import { Matrix4 } from "../../math/Matrix4.js";
import { Quaternion } from "../../math/Quaternion.js";
import { Component } from "../Component.js";
import { Entity } from "../Entity.js";

export class SceneGraphComponent extends Component {
  private _children: SceneGraphComponent[];
  private _parent?: SceneGraphComponent;

  private constructor(entity: Entity) {
      super(entity);
      this._children = [];
  }
  get children() {
      return this._children;
  }
  
  addChild(child: SceneGraphComponent) {
    child._parent = this;
    this._children.push(child);
  }

  removeChild(child: SceneGraphComponent) {
    const index = this._children.indexOf(child);
    if (index >= 0) {
      this._children.splice(index, 1);
      child._parent = undefined;
    }
  }

  get parent(): SceneGraphComponent | undefined {
    return this._parent;
  }

  getMatrix(): Matrix4 {
    const localMatrix = this.entity.getTransform().getLocalMatrix();
    const parentSg = this.parent;

    if (parentSg === undefined) {
      return localMatrix;
    } else {
      const parentWorldMatrix = parentSg.getMatrix();
      return parentWorldMatrix.multiply(localMatrix);
    }
  }

  setPosition(vec: Vector3) {
    if (this.parent === undefined) {
      this.entity.getTransform().setLocalPosition(vec);
    } else {
      const invertMat = this.parent.entity.getSceneGraph().getMatrix().invert();
      this.entity.getTransform().setLocalPosition(invertMat.multiplyVector(vec).toVector3());
    }
  }

  getPosition(): Vector3 {
    return this.getMatrix().getTranslation();
  }

  getRotation(): Quaternion {
    const parent = this.parent;
    if (parent !== undefined) {
      return parent.getRotation().multiply(this.entity.getTransform().getLocalRotation());
    }
    return this.entity.getTransform().getLocalRotation();
  }

  setRotation(quat: Quaternion) {
    if (this.parent === undefined) {
      this.entity.getTransform().setLocalRotation(quat);
    } else {
      const quatInner = this.parent.entity.getSceneGraph().getRotation();
      const invQuat = quatInner.invert();
      this.entity.getTransform().setLocalRotation(quat.multiply(invQuat));
    }
  }

  getEulerAngles(): Vector3 {
    return this.getRotation().toEulerAngles();
  }

  setEulerAngles(vec: Vector3) {
    this.setRotation(Quaternion.fromEulerAngles(vec));
  }

  getScale(): Vector3 {
    return this.getMatrix().getScale();
  }

  setScale(vec: Vector3) {
    if (this.parent === undefined) {
      this.entity.getTransform().setLocalScale(vec);
    } else {
      const mat = this.parent.entity.getSceneGraph().getMatrix();
      mat.m03 = 0;
      mat.m13 = 0;
      mat.m23 = 0;
      const invMat = mat.invert();
      this.entity.getTransform().setLocalScale(invMat.multiplyVector(vec).toVector3());
    }
  }

  /**
   * @private
   * @param entity 
   * @returns a SceneGraph component
   */
  static _create(entity: Entity) {
    return new SceneGraphComponent(entity);
  }
}
