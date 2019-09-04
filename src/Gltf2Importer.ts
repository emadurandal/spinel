export default class Gltf2Importer {
  private static __instance: Gltf2Importer;

  private constructor() {}

  async import(uri: string) {
    let response: Response;
    try {
      response = await fetch(uri);
    } catch (err) {
      console.log('glTF2 load error.', err);
    };
    const arrayBuffer = await response!.arrayBuffer();

    this._loadFromArrayBuffer(arrayBuffer);

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

  private _loadFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    const gotText = this._arrayBufferToString(arrayBuffer);
    const json = JSON.parse(gotText);

    console.log(json);
  }


  static getInstance() {
    if (!this.__instance) {
      this.__instance = new Gltf2Importer();
    }
    return this.__instance;
  }
}
