import { WebGLBuffer } from "./definitions.js";

export function initBuffers(gl: WebGLRenderingContext, vertices:number[], vertexComponentNumber: number) {
  const vertexBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  vertexBuffer._vertexComponentNumber = vertexComponentNumber;
  vertexBuffer._vertexNumber = vertices.length / vertexComponentNumber;

  return vertexBuffer;
}