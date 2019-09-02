import { WebGLProgram, WebGLBuffer } from "./definitions.js";

export function drawScene(gl: WebGLRenderingContext, vertexBuffer: WebGLBuffer, shaderProgram: WebGLProgram) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram._attributePosition,
    vertexBuffer._vertexComponentNumber, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer._vertexNumber);
}

