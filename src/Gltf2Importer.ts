import Mesh, { VertexAttributeSet } from './Mesh.js';
import { Gltf2Accessor, Gltf2BufferView, Gltf2 } from './glTF2.js';
import Material from './Material.js';
import Context from './Context.js';

export default class Gltf2Importer {
  private static __instance: Gltf2Importer;

  private constructor() {}

  async import(uri: string, context: Context, material: Material) {
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

    const meshes = this._loadMesh(arrayBufferBin, json, context, material);

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

  private _loadMesh(arrayBufferBin: ArrayBuffer, json: Gltf2, context: Context, material: Material) {
    const meshes: Mesh[] = []
    for (let mesh of json.meshes) {
      const primitive = mesh.primitives[0];
      const attributes = primitive.attributes;
      const positionAccessor = json.accessors[attributes.POSITION] as Gltf2Accessor;
      const positionBufferView = json.bufferViews[positionAccessor.bufferView!] as Gltf2BufferView;
      const byteOffsetOfBufferView = positionBufferView.byteOffset!;
      const byteOffsetOfAccessor = positionAccessor.byteOffset!;
      const byteOffset = byteOffsetOfBufferView + byteOffsetOfAccessor;
      const positionComponentBytes = this._componentBytes(positionAccessor.componentType);
      const positionComponentNum = this._componentNum(positionAccessor.type);
      const count = positionAccessor.count;
      const typedArrayComponentCount = positionComponentNum * count;
      const positionTypedArrayClass = this._componentTypedArray(positionAccessor.componentType);
      const positionTypedArray = new positionTypedArrayClass(arrayBufferBin, byteOffset, typedArrayComponentCount) as Float32Array;

      const vertexData: VertexAttributeSet = {
        position: positionTypedArray
      }
      const libMesh = new Mesh(material, context, vertexData);
      meshes.push(libMesh);

    }

    return meshes;
  }


  static getInstance() {
    if (!this.__instance) {
      this.__instance = new Gltf2Importer();
    }
    return this.__instance;
  }
}
