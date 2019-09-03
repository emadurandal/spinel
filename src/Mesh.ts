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
  private _positionBuffer: WebGLBuffer;
  private _colorBuffer?: WebGLBuffer;

  private _vertexNumber = 0;
  private _material: Material;
  private _context: Context;
  private static readonly _positionComponentNumber = 3;
  private static readonly _colorComponentNumber = 4;

  constructor(material: Material, context: Context, vertexData: VertexAttributeSet) {
    this._material = material;
    this._context = context;
    const gl = context.gl;
    this._vertexNumber = vertexData.position.length / Mesh._positionComponentNumber;

    // position
    const positionBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.position), gl.STATIC_DRAW);
    this._positionBuffer = positionBuffer;

    // color
    if (vertexData.color) {
      const colorBuffer = gl.createBuffer() as WebGLBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.color), gl.STATIC_DRAW);
      this._colorBuffer = colorBuffer;
    }

  }

  draw() {
    const gl = this._context.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
    gl.vertexAttribPointer(
      this.material.program!._attributePosition,
      Mesh._positionComponentNumber, gl.FLOAT, false, 0, 0);

    if (this._colorBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
      gl.vertexAttribPointer(
        this.material.program!._attributeColor,
        Mesh._colorComponentNumber, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexNumber);
  }

  get vertexNumber() {
    return this._vertexNumber;
  }

  get material() {
    return this._material;
  }
}
