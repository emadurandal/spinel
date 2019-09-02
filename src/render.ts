import Mesh from "./buffer.js";

export function drawScene(gl: WebGLRenderingContext, mesh: Mesh) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer!);
  gl.vertexAttribPointer(
    mesh.material.program!._attributePosition,
    mesh.vertexComponentNumber, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexNumber);
}

