import { Primitive, VertexAttributeSet } from './geometry/Primitive.js';
import { Gltf2Accessor, Gltf2BufferView, Gltf2, Gltf2Attribute } from './glTF2.js';
import { Material } from './Material.js';
import { Context } from './Context.js';
import { Vector4 } from './math/Vector4.js';
import { Mesh } from './geometry/Mesh.js';
import { Entity } from './ec/Entity.js';
import { Vector3 } from './math/Vector3.js';
import { Quaternion } from './math/Quaternion.js';
import { Matrix4 } from './math/Matrix4.js';
import { CameraType, PrimitiveMode } from './definitions.js';
import { CameraComponent } from './ec/components/Camera/CameraComponent.js';
import { AABB } from './math/AABB.js';

export class Gltf2Importer {

  private constructor() {}

  static async import(uri: string): Promise<Entity[]> {
    let response: Response;
    try {
      response = await fetch(uri);
    } catch (err) {
      console.log('glTF2 load error.', err);
    };
    const arrayBuffer = await response!.arrayBuffer();
    const gotText = this._arrayBufferToString(arrayBuffer);
    const json = JSON.parse(gotText) as Gltf2

    const arrayBufferBin = await this._loadBin(json, uri);

    const meshes = this._loadMesh(arrayBufferBin, json);
    const entities = this._loadNode(json, meshes);

    return entities;
  }

  private static _arrayBufferToString(arrayBuffer: ArrayBuffer) {
    if (typeof TextDecoder !== 'undefined') {
      let textDecoder = new TextDecoder();
      return textDecoder.decode(arrayBuffer);
    } else {
      let bytes = new Uint8Array(arrayBuffer);
      let result = "";
      let length = bytes.length;
      for (let i = 0; i < length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
  }

  private static async _loadBin(json: Gltf2, uri: string) {

    //Set the location of gltf file as basePath
    const basePath = uri.substring(0, uri.lastIndexOf('/')) + '/';

    const bufferInfo = json.buffers[0];
    const splitted = bufferInfo.uri!.split('/');
    const filename = splitted[splitted.length - 1];

    const response = await fetch(basePath + filename);
    const arrayBufferBin = await response.arrayBuffer();

    return arrayBufferBin;
  }

  private static _componentBytes(componentType: number) {
    switch (componentType) {
      case 5123: // UNSIGNED_SHORT
        return 2;
      case 5125: // UNSINGED_INT
        return 4;
      case 5126: // FLOAT
        return 4;
      default:
        console.error('Unsupported ComponentType.');
        return 0;
    }
  }

  private static _componentTypedArray(componentType: number) {
    switch (componentType) {
      case 5123: // UNSIGNED_SHORT
        return Uint16Array;
      case 5125: // UNSINGED_INT
        return Uint32Array;
      case 5126: // FLOAT
        return Float32Array;
      default:
        console.error('Unsupported ComponentTypedArray.');
        return Uint8Array;
    }
  }

  private static _componentNum(type: string) {
    switch (type) {
      case 'SCALAR':
        return 1;
      case 'VEC2':
        return 2;
      case 'VEC3':
        return 3;
      case 'VEC4':
        return 4;
      case 'MAT3':
        return 9;
      case 'MAT4':
        return 16;
      default:
        console.error('Unsupported Type.');
        return 0;
    }
  }

  private static _loadMaterial(json: Gltf2, materialIndex: number) {
    const material = new Material();

    if (materialIndex >= 0) {
      const materialJson = json.materials[materialIndex];

      let baseColor = new Vector4(1, 1, 1, 1);
      if (materialJson.pbrMetallicRoughness != null) {
        if (materialJson.pbrMetallicRoughness.baseColorFactor != null) {
          const baseColorArray = materialJson.pbrMetallicRoughness.baseColorFactor;
          baseColor = new Vector4(baseColorArray[0], baseColorArray[1], baseColorArray[2], baseColorArray[3]);
        }
      }

      material.baseColor = baseColor;
    }

    return material;
  }

  private static _loadMesh(arrayBufferBin: ArrayBuffer, json: Gltf2) {
    const meshes: Mesh[] = []
    for (let meshJson of json.meshes) {
      const primitives: Primitive[] = [];
      for (let primitiveJson of meshJson.primitives) {
        const attributes = primitiveJson.attributes;

        let materialIndex = -1;
        if (primitiveJson.material != null) {
          materialIndex = primitiveJson.material;
        }
        const material = this._loadMaterial(json, materialIndex);

        const positionTypedArray = this.getAttribute(json, attributes.POSITION, arrayBufferBin);
        let colorTypedArray: Float32Array | undefined;
        if (attributes.COLOR_0) {
          colorTypedArray = this.getAttribute(json, attributes.COLOR_0, arrayBufferBin);
        }

        let indicesTypedArray: Uint16Array | Uint32Array | undefined;
        if (primitiveJson.indices != null) {
          indicesTypedArray = this.getIndices(json, primitiveJson.indices, arrayBufferBin);
        }

        const accessor = json.accessors[attributes.POSITION];
        const aabb = new AABB();
        if (accessor.max != null && accessor.min != null) {
          aabb.setMinAndMax(new Vector3(accessor.min[0], accessor.min[1], accessor.min[2]), new Vector3(accessor.max[0], accessor.max[1], accessor.max[2]));
        }

        const vertexData: VertexAttributeSet = {
          position: positionTypedArray,
          color: colorTypedArray,
          indices: indicesTypedArray,
          mode: (primitiveJson.mode as PrimitiveMode) ?? PrimitiveMode.Triangles,
          aabb: aabb,
        }
        const primitive = new Primitive(material, vertexData);
        primitives.push(primitive);
      }
      const mesh = new Mesh(primitives);
      meshes.push(mesh);
    }

    return meshes;
  }

  private static _loadNode(json: Gltf2, meshes: Mesh[]) {
    const entities: Entity[] = [];
    for (let node of json.nodes) {
      const entity = Entity.create();
      entities.push(entity);

      // transform
      if (node.matrix != null) {
        const v = node.matrix;
        entity.getTransform().setLocalMatrix(new Matrix4(
          v[0], v[4], v[8], v[12],
          v[1], v[5], v[9], v[13],
          v[2], v[6], v[10], v[14],
          v[3], v[7], v[11], v[15]
        ));
      } else {
        if (node.translation != null) {
          const v = node.translation;
          entity.getTransform().setLocalPosition(new Vector3(v[0], v[1], v[2]));
        }
        if (node.rotation != null) {
          const v = node.rotation;
          entity.getTransform().setLocalRotation(new Quaternion(v[0], v[1], v[2], v[3]));
        }
        if (node.scale != null) {
          const v = node.scale;
          entity.getTransform().setLocalScale(new Vector3(v[0], v[1], v[2]));
        }
      }

      // mesh
      if (node.mesh != null) {
        const mesh = meshes[node.mesh];
        entity.addMesh(mesh);
      }

      // camera
      if (node.camera != null) {
        const cameraJson = json.cameras[node.camera];
        cameraJson.type
        if (cameraJson.type === 'perspective') {
          const cameraComponent = entity.addCamera(CameraType.Perspective);
          cameraComponent.fovy = cameraJson.perspective!.yfov;
          cameraComponent.aspect = cameraJson.perspective!.aspectRatio ?? -1;
          cameraComponent.near = cameraJson.perspective!.znear;
          cameraComponent.far = cameraJson.perspective!.zfar ?? Infinity;
          if (CameraComponent.activeCamera == null) {
            CameraComponent.activeCamera = cameraComponent;
          }
        } else {
          const cameraComponent = entity.addCamera(CameraType.Orthographic);
          cameraComponent.xmag = cameraJson.orthographic!.xmag;
          cameraComponent.ymag = cameraJson.orthographic!.ymag;
          cameraComponent.near = cameraJson.orthographic!.znear;
          cameraComponent.far = cameraJson.orthographic!.zfar;
          if (CameraComponent.activeCamera == null) {
            CameraComponent.activeCamera = cameraComponent;
          }
        }
      }
    }

    // make hierarchy
    for (let nodeIndex = 0; nodeIndex < json.nodes.length; nodeIndex++) {
      const node = json.nodes[nodeIndex];
      if (node.children != null) {
        const parent = entities[nodeIndex];
        for (let childIndex of node.children) {
          const child = entities[childIndex];
          parent.getSceneGraph().addChild(child.getSceneGraph());
        }
      }
    }

    return entities;
  }
  
  private static getIndices(json: Gltf2, indicesIndex: number, arrayBufferBin: ArrayBuffer) {
    const accessor = json.accessors[indicesIndex] as Gltf2Accessor;
    const bufferView = json.bufferViews[accessor.bufferView!] as Gltf2BufferView;
    const byteOffsetOfBufferView = bufferView.byteOffset!;
    const byteOffsetOfAccessor = accessor.byteOffset!;
    const byteOffset = byteOffsetOfBufferView + byteOffsetOfAccessor;
    const componentBytes = this._componentBytes(accessor.componentType);
    const componentNum = this._componentNum(accessor.type);
    const count = accessor.count;
    const typedArrayComponentCount = componentNum * count;
    const typedArrayClass = this._componentTypedArray(accessor.componentType);
    const typedArray = new typedArrayClass(arrayBufferBin, byteOffset, typedArrayComponentCount) as Uint16Array | Uint32Array;
    return typedArray;
  }

  private static getAttribute(json: Gltf2, attributeIndex: number, arrayBufferBin: ArrayBuffer) {
    const accessor = json.accessors[attributeIndex] as Gltf2Accessor;
    const bufferView = json.bufferViews[accessor.bufferView!] as Gltf2BufferView;
    const byteOffsetOfBufferView = bufferView.byteOffset!;
    const byteOffsetOfAccessor = accessor.byteOffset!;
    const byteOffset = byteOffsetOfBufferView + byteOffsetOfAccessor;
    const componentBytes = this._componentBytes(accessor.componentType);
    const componentNum = this._componentNum(accessor.type);
    const count = accessor.count;
    const typedArrayComponentCount = componentNum * count;
    const typedArrayClass = this._componentTypedArray(accessor.componentType);
    const typedArray = new typedArrayClass(arrayBufferBin, byteOffset, typedArrayComponentCount) as Float32Array;
    return typedArray;
  }
}
