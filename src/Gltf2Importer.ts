import { Primitive, VertexAttributeSet } from './geometry/Primitive.js';
import { Gltf2Accessor, Gltf2BufferView, Gltf2, Gltf2Attribute } from './glTF2.js';
import { Material } from './Material.js';
import { Vector4 } from './math/Vector4.js';
import { Mesh } from './geometry/Mesh.js';
import { Entity } from './ec/Entity.js';
import { Vector3 } from './math/Vector3.js';
import { Quaternion } from './math/Quaternion.js';
import { Matrix4 } from './math/Matrix4.js';
import { CameraType, PrimitiveMode, SamplerMagFilter, SamplerMinFilter, SamplerWrapMode } from './definitions.js';
import { CameraComponent } from './ec/components/Camera/CameraComponent.js';
import { AABB } from './math/AABB.js';
import { Texture2D, TextureParameters } from './Texture2D.js';

export class Gltf2Importer {

  private constructor() {}

  static async import(uri: string): Promise<Entity[]> {
    const basePath = uri.substring(0, uri.lastIndexOf('/')) + '/';
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Failed to load glTF file. Status: ' + response.status + ' ' + response.statusText);
    }
    const arrayBuffer = await response!.arrayBuffer();
    
    const dataView = new DataView(arrayBuffer, 0, 20);
    // Magic field
    const magic = dataView.getUint32(0, true);
    // 0x46546C67 is 'glTF' in ASCII codes.
    if (magic === 0x46546c67) {
      return this.loadGlb(arrayBuffer, basePath);
    } else {
      return this.loadGltf(arrayBuffer, basePath);
    }

  }

  private static async loadGlb(arrayBuffer: ArrayBuffer, basePath: string): Promise<Entity[]> {
    const dataView = new DataView(arrayBuffer, 0, 20);
    const gltfVer = dataView.getUint32(4, true);
    if (gltfVer !== 2) {
      throw new Error('invalid version field in this binary glTF file.');
    }
    const lengthOfJSonChunkData = dataView.getUint32(12, true);
    const chunkType = dataView.getUint32(16, true);
    // 0x4E4F534A means JSON format (0x4E4F534A is 'JSON' in ASCII codes)
    if (chunkType !== 0x4e4f534a) {
      throw new Error('invalid chunkType of chunk0 in this binary glTF file.');
    }
    const uint8ArrayJSonContent = new Uint8Array(arrayBuffer, 20, lengthOfJSonChunkData);
    const textDecoder = new TextDecoder();
    const gotText = textDecoder.decode(uint8ArrayJSonContent);
    const gltfJson = JSON.parse(gotText);
    const arrayBufferBin = arrayBuffer.slice(20 + lengthOfJSonChunkData + 8);

    const entities = this._loadInner(gltfJson, basePath, arrayBufferBin);

    return entities;
  }

  private static async loadGltf(arrayBuffer: ArrayBuffer, basePath: string) {
    const gotText = this._arrayBufferToString(arrayBuffer);
    const json = JSON.parse(gotText) as Gltf2
    const arrayBufferBin = await this._loadBin(json, basePath);
    
    const entities = this._loadInner(json, basePath, arrayBufferBin);

    return entities;
  }

  private static _loadInner(json: Gltf2, basePath: string, arrayBuffer: ArrayBuffer) {
    const textures = this._loadTexture(json, basePath, arrayBuffer);
    const meshes = this._loadMesh(arrayBuffer, json, textures);
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

  private static async _loadBin(json: Gltf2, basePath: string) {
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

  private static _loadTexture(json: Gltf2, basePath: string, arrayBuffer: ArrayBuffer) {
    const textures: Texture2D[] = [];
    for (let textureJson of json.textures) {
      const imageJson = json.images[textureJson.source!];

      // get sampler info
      const textureParameters: TextureParameters = {
        magFilter: SamplerMagFilter.Linear,
        minFilter: SamplerMinFilter.LinearMipmapLinear,
        wrapS: SamplerWrapMode.Repeat,
        wrapT: SamplerWrapMode.Repeat,
        generateMipmap: true,
      }
      if (textureJson.sampler != null) {
        const sampler = json.samplers[textureJson.sampler]
        textureParameters.magFilter = sampler.magFilter as SamplerMagFilter ?? SamplerMagFilter.Linear;
        textureParameters.minFilter = sampler.minFilter as SamplerMinFilter ?? SamplerMinFilter.LinearMipmapLinear;
      }

      const tex = new Texture2D();
      if (imageJson.uri != null) {
        tex.loadByUrl(basePath + imageJson.uri, textureParameters);
      } else if (imageJson.bufferView != null) {
        const bufferView = json.bufferViews[imageJson.bufferView];
        const byteOffsetInBuffer = bufferView.byteOffset ?? 0;
        const buffer = new Uint8Array(arrayBuffer, byteOffsetInBuffer, bufferView.byteLength);
        const blob = new Blob([buffer], {type: imageJson.mimeType});
        const url = URL.createObjectURL(blob);
        tex.loadByUrl(url, textureParameters, ()=>{
          URL.revokeObjectURL(url);
        });
      }
      textures.push(tex);
    }

    return textures;
  }

  private static _loadMaterial(json: Gltf2, materialIndex: number, textures: Texture2D[]) {
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

      if (materialJson.pbrMetallicRoughness != null) {
        if (materialJson.pbrMetallicRoughness.baseColorTexture != null) {
          const textureIndex = materialJson.pbrMetallicRoughness.baseColorTexture.index;
          material.setBaseColorTexture(textures[textureIndex]);
        }
      }

      material.setBaseColor(baseColor);
    }

    return material;
  }

  private static _loadMesh(arrayBufferBin: ArrayBuffer, json: Gltf2, textures: Texture2D[]) {
    const meshes: Mesh[] = []
    for (let meshJson of json.meshes) {
      const primitives: Primitive[] = [];
      for (let primitiveJson of meshJson.primitives) {
        const attributes = primitiveJson.attributes;

        let materialIndex = -1;
        if (primitiveJson.material != null) {
          materialIndex = primitiveJson.material;
        }
        const material = this._loadMaterial(json, materialIndex, textures);

        const positionTypedArray = this.getAttribute(json, attributes.POSITION, arrayBufferBin);
        let colorTypedArray: Float32Array | undefined;
        if (attributes.COLOR_0 != null) {
          colorTypedArray = this.getAttribute(json, attributes.COLOR_0, arrayBufferBin);
        }

        let texcoordTypedArray: Float32Array | undefined;
        if (attributes.TEXCOORD_0 != null) {
          texcoordTypedArray = this.getAttribute(json, attributes.TEXCOORD_0, arrayBufferBin);
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
          texcoord: texcoordTypedArray,
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
    const byteOffsetOfBufferView = bufferView.byteOffset ?? 0;
    const byteOffsetOfAccessor = accessor.byteOffset ?? 0;
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
    const byteOffsetOfBufferView = bufferView.byteOffset ?? 0;
    const byteOffsetOfAccessor = accessor.byteOffset ?? 0;
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
