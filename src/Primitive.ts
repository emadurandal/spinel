import Material from "./Material.js";
import Context from "./Context.js";

export type VertexAttributeSet = {
  position: number[] | Float32Array,
  color?: number[] | Float32Array,
  normal?: number[] | Float32Array,
  texcoord?: number[] | Float32Array,
  indices?: number[] | Uint16Array
}

export default class Primitive {
  private _positionBuffer: WebGLBuffer;
  private _colorBuffer: WebGLBuffer;
  private _indexBuffer?: WebGLBuffer;

  private _vertexNumber = 0;
  private _indexNumber = 0;
  private _material: Material;
  private _context: Context;
  private static readonly _positionComponentNumber = 3;
  private static readonly _colorComponentNumber = 4;

  constructor(material: Material, context: Context, vertexData: VertexAttributeSet) {
    this._material = material;
    this._context = context;
    this._vertexNumber = vertexData.position.length / Primitive._positionComponentNumber;

    this._positionBuffer = this._setupVertexBuffer(vertexData.position, [0, 0, 0]);
    this._colorBuffer = this._setupVertexBuffer(vertexData.color!, [1, 1, 1, 1]);

    if (vertexData.indices != null) {
      this._indexBuffer = this._setupIndexBuffer(vertexData.indices);
      this._indexNumber = vertexData.indices.length;
    }
  }

  private _setupVertexBuffer(_array: number[] | Float32Array, defaultArray: number[]) {
    let array = _array;
    if (array == null) {
      array = [];
      for (let i=0; i<this._vertexNumber; i++) {
        array = array.concat(defaultArray);
      }
    }

    const gl = this._context.gl;
    const buffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const typedArray = (array.constructor === Float32Array) ? array as Float32Array : new Float32Array(array);
    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);

    return buffer;
  }

  private _setupIndexBuffer(indicesArray: number[] | Uint16Array) {
    const gl = this._context.gl;
    const buffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    const typedArray = (indicesArray.constructor === Uint16Array) ? indicesArray as Uint16Array : new Uint16Array(indicesArray);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
    return buffer;
  }

  private _setVertexAttribPointer(vertexBuffer: WebGLBuffer, attributeSlot: number, componentNumber: number) {
    if (vertexBuffer != null) {
      const gl = this._context.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(
        attributeSlot,
        componentNumber, gl.FLOAT, false, 0, 0);
    }
  }

  draw() {
    const gl = this._context.gl;

    this._setVertexAttribPointer(this._positionBuffer, this.material.program!._attributePosition, Primitive._positionComponentNumber);
    this._setVertexAttribPointer(this._colorBuffer!, this.material.program!._attributeColor, Primitive._colorComponentNumber);

    this._material.useProgram(gl);
    this._material.setUniformValues(gl);

    if (this._indexBuffer != null) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
      gl.drawElements(gl.TRIANGLES, this._indexNumber, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, this.vertexNumber);
    }

  }

  get vertexNumber() {
    return this._vertexNumber;
  }

  get material() {
    return this._material;
  }
}
