import Material from "./Material.js";
import Context from "./Context.js";

export default class Mesh {
  private _vertexBuffer: WebGLBuffer;
  private _vertexComponentNumber = 0;
  private _vertexNumber = 0;
  private _material: Material;
  private _context: Context;

  constructor(material: Material, context: Context, vertices:number[], vertexComponentNumber: number) {
    this._material = material;
    this._context = context;
    const gl = context.gl;

    const vertexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this._vertexComponentNumber = vertexComponentNumber;
    this._vertexNumber = vertices.length / vertexComponentNumber;

    this._vertexBuffer = vertexBuffer;

  }

  draw() {
    const gl = this._context.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer!);
    gl.vertexAttribPointer(
      this.material.program!._attributePosition,
      this.vertexComponentNumber, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexNumber);
  }

  get vertexBuffer() {
    return this._vertexBuffer;
  }

  get vertexComponentNumber() {
    return this._vertexComponentNumber;
  }

  get vertexNumber() {
    return this._vertexNumber;
  }

  get material() {
    return this._material;
  }
}
