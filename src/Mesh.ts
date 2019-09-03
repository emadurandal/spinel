import Material from "./Material.js";
import Context from "./Context.js";

export type VertexAttributeSet = {
  position: number[],
  color?: number[],
  normal?: number[],
  texcoord?: number[],
  indices?: number[]
}

export default class Mesh {
  private _vertexBuffer: WebGLBuffer;
  private _vertexNumber = 0;
  private _material: Material;
  private _context: Context;
  private static readonly _positionComponentNumber = 3;

  constructor(material: Material, context: Context, vertexData: VertexAttributeSet) {
    this._material = material;
    this._context = context;
    const gl = context.gl;

    // position
    const vertexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.position), gl.STATIC_DRAW);
    this._vertexNumber = vertexData.position.length / Mesh._positionComponentNumber;
    this._vertexBuffer = vertexBuffer;

  }

  draw() {
    const gl = this._context.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.vertexAttribPointer(
      this.material.program!._attributePosition,
      Mesh._positionComponentNumber, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexNumber);
  }

  get vertexBuffer() {
    return this._vertexBuffer;
  }

  get vertexNumber() {
    return this._vertexNumber;
  }

  get material() {
    return this._material;
  }
}
