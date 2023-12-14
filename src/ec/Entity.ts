import { SceneGraphComponent } from "./components/SceneGraphComponent.js";
import { TransformComponent } from "./components/TransformComponent.js";

export class Entity {
  private _name: string;
  private _id: number;

  private static _entities: Entity[] = [];

  private _transform: TransformComponent;
  private _sceneGraph: SceneGraphComponent;

  private constructor(id: number) {
    this._id = id;
    this._name = "Entity_" + id;

    this._transform = TransformComponent._create(this);
    this._sceneGraph = SceneGraphComponent._create(this);
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name.concat();
  }

  setName(name: string) {
    this._name = name;
  }

  getTransform(): TransformComponent {
    return this._transform;
  }

  getSceneGraph(): SceneGraphComponent {
    return this._sceneGraph;
  }

  static create(): Entity {
    const entity = new Entity(this._entities.length);
    this._entities.push(entity);
    
    return entity;
  }

  static get(id: number): Entity | undefined {
    if (id < 0 || id >= this._entities.length) {
      return undefined;
    }

    return this._entities[id];
  }
  
  static reset() {
    this._entities = [];
  }
}
