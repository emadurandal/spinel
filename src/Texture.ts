import { System } from "./System.js";
import { SamplerMagFilter, SamplerMinFilter, SamplerWrapMode } from "./definitions.js";

export type TextureParameters = {
  magFilter: SamplerMagFilter;
  minFilter: SamplerMinFilter;
  wrapS: SamplerWrapMode;
  wrapT: SamplerWrapMode;
  generateMipmap: boolean;
};

export class Texture2D {
  private _width = 0;
  private _height = 0;
  private _texture: WebGLTexture | null = null;

  constructor() {
  }
  
  get width() {
      return this._width;
  }
  get height() {
      return this._height;
  }
  
  loadByUrl(url: string, param: TextureParameters) {
    const image = new Image();
    image.onload = () => {
      this._width = image.width;
      this._height = image.height;

      const gl = System.gl;
      const texture = gl.createTexture();
      if (texture == null) {
        throw new Error('Failed to create texture.');
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (param.generateMipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, param.wrapS);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, param.wrapT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param.magFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param.minFilter);
    };

    image.src = url;
  }

  destroy() {
    const gl = System.gl;
    gl.deleteTexture(this._texture);
  }

  bind() {
    const gl = System.gl;
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
  }
}
