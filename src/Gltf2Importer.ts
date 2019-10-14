import Primitive, { VertexAttributeSet } from './Primitive.js';
import { Gltf2Accessor, Gltf2BufferView, Gltf2, Gltf2Attribute } from './glTF2.js';
import Material from './Material.js';
import Context from './Context.js';
import Vector4 from './Vector4.js';
import Mesh from './Mesh.js';

export default class Gltf2Importer {
  private static __instance: Gltf2Importer;
  private static readonly vertexShaderStr = `
precision highp float;

attribute vec3 a_position;
attribute vec4 a_color;
varying vec4 v_color;

void main(void) {
  gl_Position = vec4(a_position, 1.0);
  v_color = a_color;
}
`;

private static readonly fragmentShaderStr = `
precision highp float;

varying vec4 v_color;
uniform vec4 u_baseColor;

void main(void) {
  gl_FragColor = v_color * u_baseColor;
}
`;

  private constructor() {}

  async import(uri: string, context: Context) {
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

    const meshes = this._loadMesh(arrayBufferBin, json, context);

    return meshes;
  }

  private _arrayBufferToString(arrayBuffer: ArrayBuffer) {
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

  private async _loadBin(json: Gltf2, uri: string) {

    //Set the location of gltf file as basePath
    const basePath = uri.substring(0, uri.lastIndexOf('/')) + '/';

    const bufferInfo = json.buffers[0];
    const splitted = bufferInfo.uri!.split('/');
    const filename = splitted[splitted.length - 1];

    const response = await fetch(basePath + filename);
    const arrayBufferBin = await response.arrayBuffer();

    return arrayBufferBin;
  }

  private _componentBytes(componentType: number) {
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

  private _componentTypedArray(componentType: number) {
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

  private _componentNum(type: string) {
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

  private _loadMaterial(json: Gltf2, materialIndex: number, context: Context) {
    const material = new Material(context, Gltf2Importer.vertexShaderStr, Gltf2Importer.fragmentShaderStr);

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

  private _loadMesh(arrayBufferBin: ArrayBuffer, json: Gltf2, context: Context) {
    const meshes: Mesh[] = []
    for (let meshJson of json.meshes) {
      const primitives: Primitive[] = [];
      for (let primitiveJson of meshJson.primitives) {
        const attributes = primitiveJson.attributes;

        let materialIndex = -1;
        if (primitiveJson.material != null) {
          materialIndex = primitiveJson.material;
        }
        const material = this._loadMaterial(json, materialIndex, context);

        const positionTypedArray = this.getAttribute(json, attributes.POSITION, arrayBufferBin);
        let colorTypedArray: Float32Array;
        if (attributes.COLOR_0) {
          colorTypedArray = this.getAttribute(json, attributes.COLOR_0, arrayBufferBin);
        }

        const vertexData: VertexAttributeSet = {
          position: positionTypedArray,
          color: colorTypedArray!
        }
        const primitive = new Primitive(material, context, vertexData);
        primitives.push(primitive);
      }
      const mesh = new Mesh(primitives);
      meshes.push(mesh);
    }

    return meshes;
  }


  private getAttribute(json: Gltf2, attributeIndex: number, arrayBufferBin: ArrayBuffer) {
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

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new Gltf2Importer();
    }
    return this.__instance;
  }
}
