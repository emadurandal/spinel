import type { Entity } from "./Entity.js";

export abstract class Component {
  private _entity: Entity;

  constructor(entity: Entity) {
    this._entity = entity;
  }

  get entity() {
    return this._entity;
  }
}

