import { initWebGL } from "./context.js";
import { initProgram } from "./shader.js";
import { initBuffers } from "./buffer.js";
import { drawScene } from "./render.js";


export default function main(vertices: number[], vertexComponentNumber: number) {
  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const gl = initWebGL(canvas);

  if (gl == null) {
    return false;
  }
  const shaderProgram = initProgram(gl);
  if (shaderProgram == null) {
    return false;
  }

  const vertexBuffer = initBuffers(gl, vertices, vertexComponentNumber);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene(gl, vertexBuffer, shaderProgram);

  return true;
}